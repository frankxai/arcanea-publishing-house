import {test, before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {Miniflare} from 'miniflare';
import {hmac} from '../src/crypto.js';
const edition=JSON.parse(await readFile('editions/letters-to-the-seeker/edition.json','utf8'));
let mf,db,bucket,sessions=new Map(),count=0;
const origin='https://arcanea.test', signingSecret='whsec_fixture_only', apiKey='sk_test_fixture_only';
const schema=await readFile('commerce/migrations/0001.sql','utf8');
const script=await readFile('dist/worker.mjs','utf8');
before(async()=>{
 mf=new Miniflare({modules:true,script,compatibilityDate:'2026-07-30',d1Databases:['DB'],r2Buckets:['BOOKS'],bindings:{STRIPE_SECRET_KEY:apiKey,STRIPE_WEBHOOK_SECRET:signingSecret,DOWNLOAD_SECRET:'local_fixture_download_secret',OPS_TOKEN:'local_fixture_operator_token',PUBLIC_ORIGIN:origin},outboundService:async req=>{
  assert.equal(new URL(req.url).hostname,'api.stripe.com');assert.equal(req.headers.get('authorization'),'Bearer '+apiKey);
  if(req.method==='POST'){
   const body=new URLSearchParams(await req.text());assert.equal(body.get('mode'),'payment');assert.equal(body.get('line_items[0][price_data][unit_amount]'),'900');
   const id='cs_test_fixture_'+(++count),pi='pi_fixture_'+count;
   const session={id,livemode:false,url:'https://checkout.stripe.com/c/pay/'+id,amount_total:900,currency:'eur',payment_status:'paid',status:'complete',payment_intent:pi,metadata:{order_id:body.get('metadata[order_id]'),edition_id:body.get('metadata[edition_id]'),manifest_sha256:body.get('metadata[manifest_sha256]')}};
   sessions.set(id,session);return Response.json(session);
  }
  return Response.json(sessions.get(decodeURIComponent(new URL(req.url).pathname.split('/').pop()))||{}, {status:200});
 }});
 db=await mf.getD1Database('DB');bucket=await mf.getR2Bucket('BOOKS');await db.exec(schema.replace(/\n/g,' '));
 for(const f of ['pdf','epub']){await bucket.put(edition.artifacts[f].key,await readFile(`editions/letters-to-the-seeker/letters-to-the-seeker.${f}`),{customMetadata:{sha256:edition.artifacts[f].sha256}});}
 for(const scope of ['rights','editorial','price','sandbox']) await db.prepare('INSERT INTO approvals VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),edition.edition_id,edition.manifest_sha256,scope,'TEST FIXTURE — NOT HUMAN APPROVAL',Math.floor(Date.now()/1000),Math.floor(Date.now()/1000)+3600).run();
});
after(async()=>{await mf?.dispose();});
const call=(path,options={})=>mf.dispatchFetch(origin+path,options);
async function buy(){const r=await call('/api/checkout',{method:'POST',headers:{origin,'content-type':'application/json'},body:'{}'});assert.equal(r.status,200);const data=await r.json();const cookie=r.headers.get('set-cookie').split(';')[0];const id=data.url.split('/').pop();return{cookie,session:sessions.get(id),id};}
function evt(session,type='checkout.session.completed'){return{id:'evt_fixture_'+crypto.randomUUID(),livemode:false,type,data:{object:session}};}
async function send(event,header){const raw=JSON.stringify(event),ts=Math.floor(Date.now()/1000);return call('/api/stripe/webhook',{method:'POST',headers:{'stripe-signature':header||`t=${ts},v1=${await hmac(signingSecret,ts+'.'+raw)}`},body:raw});}

test('full fixture transaction: checkout → verified webhook → entitlement → exact EPUB/PDF → refund revokes issued URLs',async()=>{
 const order=await buy();assert.match(order.cookie,/^__Host-arcanea_order=/);
 const early=await call('/api/order',{headers:{cookie:order.cookie}});assert.equal((await early.json()).status,'pending');
 const event=evt(order.session);assert.equal((await send(event)).status,200);
 const duplicate=await send(event);assert.equal((await duplicate.json()).duplicate,true);
 const receipt=await call('/api/order',{headers:{cookie:order.cookie}});const data=await receipt.json();assert.equal(data.status,'paid');
 for(const f of ['pdf','epub']){const response=await call(data.downloads[f]);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile(`editions/letters-to-the-seeker/letters-to-the-seeker.${f}`));}
 const refund=evt({payment_intent:order.session.payment_intent},'charge.refunded');assert.equal((await send(refund)).status,200);
 assert.equal((await call(data.downloads.epub)).status,403);
 assert.equal((await(await call('/api/order',{headers:{cookie:order.cookie}})).json()).status,'revoked');
 assert.equal((await send(evt(order.session))).status,200);
 assert.equal((await(await call('/api/order',{headers:{cookie:order.cookie}})).json()).status,'revoked');
 await writeFile('evidence/transaction-fixture.json',JSON.stringify({provider:'in-process Stripe REST fixture',actual_stripe_purchase:false,storage:'Miniflare workerd D1 + R2',checkout:'passed',signature:'verified locally',duplicate_event:'idempotent',entitlement:'paid after verified event only',epub:'exact bytes matched',pdf:'exact bytes matched',refund:'revoked old links',paid_event_after_refund:'remained revoked',real_revenue_cents:0},null,2)+'\n');
});
test('same browser retry reuses the checkout session',async()=>{const o=await buy();const before=count;const response=await call('/api/checkout',{method:'POST',headers:{origin,cookie:o.cookie},body:'{}'});assert.equal((await response.json()).url,o.session.url);assert.equal(count,before);});
test('browser success page never grants access',async()=>{assert.equal((await call('/receipt?session_id=cs_test_fake')).status,200);assert.equal((await call('/api/order')).status,401);});
test('cross-origin checkout rejected',async()=>{assert.equal((await call('/api/checkout',{method:'POST',headers:{origin:'https://evil.test'}})).status,403);});
test('forged signature rejected',async()=>{assert.equal((await send(evt({}),'t=1,v1=bad')).status,400);});
test('expired signature rejected even with valid HMAC',async()=>{const event=evt({}),raw=JSON.stringify(event),ts=Math.floor(Date.now()/1000)-301;assert.equal((await send(event,`t=${ts},v1=${await hmac(signingSecret,ts+'.'+raw)}`)).status,400);});
test('future-dated signature rejected',async()=>{const event=evt({}),raw=JSON.stringify(event),ts=Math.floor(Date.now()/1000)+301;assert.equal((await send(event,`t=${ts},v1=${await hmac(signingSecret,ts+'.'+raw)}`)).status,400);});
test('key rotation accepts a valid v1 among other signatures',async()=>{const event=evt({},'unhandled.test'),raw=JSON.stringify(event),ts=Math.floor(Date.now()/1000);assert.equal((await send(event,`t=${ts},v0=ignored,v1=wrong,v1=${await hmac(signingSecret,ts+'.'+raw)},payload=ignored`)).status,200);});
test('live webhook rejected',async()=>{const event=evt({});event.livemode=true;assert.equal((await send(event)).status,400);});
test('unpaid completion grants no entitlement; later paid event fulfills',async()=>{const o=await buy();assert.equal((await send(evt({...o.session,payment_status:'unpaid'}))).status,200);assert.equal((await(await call('/api/order',{headers:{cookie:o.cookie}})).json()).status,'pending');assert.equal((await send(evt(o.session,'checkout.session.async_payment_succeeded'))).status,200);assert.equal((await(await call('/api/order',{headers:{cookie:o.cookie}})).json()).status,'paid');});
test('amount mismatch fails closed',async()=>{const o=await buy();o.session.amount_total=1;assert.equal((await send(evt(o.session))).status,409);});
test('manifest mismatch fails closed',async()=>{const o=await buy();o.session.metadata.manifest_sha256='different';assert.equal((await send(evt(o.session))).status,409);});
test('unknown order fails closed',async()=>{assert.equal((await send(evt({payment_status:'paid',metadata:{order_id:'unknown'}}))).status,409);});
test('refund before paid webhook remains revoked',async()=>{const o=await buy();assert.equal((await send(evt({payment_intent:o.session.payment_intent},'charge.refunded'))).status,200);assert.equal((await send(evt(o.session))).status,200);assert.equal((await(await call('/api/order',{headers:{cookie:o.cookie}})).json()).status,'revoked');});
test('tampered and expired download signatures rejected',async()=>{const o=await buy();await send(evt(o.session));const d=await(await call('/api/order',{headers:{cookie:o.cookie}})).json();assert.equal((await call(d.downloads.epub.replace('format=epub','format=pdf'))).status,403);const u=new URL(d.downloads.epub,origin);u.searchParams.set('expires','1');assert.equal((await call(u.pathname+u.search)).status,403);});
test('corrupted R2 bytes are rejected even with matching metadata',async()=>{const o=await buy();await send(evt(o.session));const d=await(await call('/api/order',{headers:{cookie:o.cookie}})).json();const file=edition.artifacts.epub;await bucket.put(file.key,'corrupted',{customMetadata:{sha256:file.sha256}});assert.equal((await call(d.downloads.epub)).status,503);await bucket.put(file.key,await readFile('editions/letters-to-the-seeker/letters-to-the-seeker.epub'),{customMetadata:{sha256:file.sha256}});});
test('operator data protected; no approval write API',async()=>{assert.equal((await call('/api/admin/status')).status,401);assert.equal((await call('/api/admin/status',{headers:{authorization:'Bearer local_fixture_operator_token'}})).status,200);assert.equal((await call('/api/admin/approve',{method:'POST',headers:{authorization:'Bearer local_fixture_operator_token'}})).status,404);});
test('authenticated agent runs sync with canonical digests and reject tampering',async()=>{
 const payload=JSON.parse(await readFile('evidence/agent-runs.json','utf8'));
 const options={method:'POST',headers:{authorization:'Bearer local_fixture_operator_token'},body:JSON.stringify(payload)};
 assert.equal((await call('/api/admin/runs',options)).status,200);
 assert.equal((await(await call('/api/production')).json()).runs.length,9);
 payload.runs[0].evidence.forged=true;
 assert.equal((await call('/api/admin/runs',{...options,body:JSON.stringify(payload)})).status,409);
});
test('streamed oversize checkout body and malformed JSON are rejected',async()=>{
 assert.equal((await call('/api/checkout',{method:'POST',headers:{origin},body:'x'.repeat(65537)})).status,413);
 assert.equal((await call('/api/checkout',{method:'POST',headers:{origin},body:'{'})).status,400);
});
test('raw artifact paths are not public',async()=>{assert.equal((await call('/'+edition.artifacts.epub.key)).status,404);});
test('changed manifest or missing approval disables checkout',async()=>{await db.prepare("DELETE FROM approvals WHERE scope='rights'").run();const d=await(await call('/api/readiness')).json();assert.equal(d.checkout_enabled,false);assert.equal((await call('/api/checkout',{method:'POST',headers:{origin},body:'{}'})).status,503);});
