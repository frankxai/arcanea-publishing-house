import {sha256,hmac,equal,nonce,verifyWebhook} from './crypto.js';
import geistFont from '../assets/geist-sans.woff2';
import {storefront,dashboard,receipt,styles,clientScript} from './interface.js';
import {collectorPreview,chainPreparation} from './collector.js';
import edition from '../../editions/letters-to-the-seeker/edition.json' with {type:'json'};
const now=()=>Math.floor(Date.now()/1000);
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});
const problem=(message,status=400)=>json({error:message},status);
const qs=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const testKey=env=>/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY||'');
const auth=async(req,env)=>!!env.OPS_TOKEN && equal(await sha256(req.headers.get('authorization')||''),await sha256(`Bearer ${env.OPS_TOKEN}`));
function originAllowed(req,env) {return req.headers.get('origin') === (env.PUBLIC_ORIGIN||new URL(req.url).origin);}
async function boundedBytes(req,limit=65536) {
 if(Number(req.headers.get('content-length'))>limit) throw new RangeError('Body too large');
 const reader=req.body?.getReader();if(!reader)return new Uint8Array();let size=0;const parts=[];
 try {while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new RangeError('Body too large');}parts.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}return bytes;
}
async function body(req){return new TextDecoder().decode(await boundedBytes(req));}
async function stripe(env,path,params,idempotency) {
 if(!testKey(env)) throw new Error('Stripe test key required');
 const response=await fetch('https://api.stripe.com/v1'+path,{method:params?'POST':'GET',headers:{authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,...(params?{'content-type':'application/x-www-form-urlencoded','Idempotency-Key':idempotency}: {})},body:params?new URLSearchParams(params):undefined,signal:AbortSignal.timeout(15000)});
 if(!response.ok) throw new Error('Stripe sandbox request failed');
 const result=await response.json();
 if(result.livemode!==false) throw new Error('Stripe returned a live object');
 return result;
}
async function currentOrder(req,env) {
 const token=(req.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('__Host-arcanea_order='))?.slice(21);
 if(!token || !/^[a-f0-9]{64}$/.test(token)) return null;
 return qs(env,'SELECT * FROM orders WHERE token_hash=?',await sha256(token)).first();
}
async function approved(env) {
 const result=await qs(env,"SELECT scope FROM approvals WHERE edition_id=? AND manifest_sha256=? AND expires_at>?",edition.edition_id,edition.manifest_sha256,now()).all();
 return ['rights','editorial','price','sandbox'].every(s=>result.results.some(x=>x.scope===s));
}
async function readiness(env) {
 const checks={stripe_test_key:testKey(env),webhook_secret:!!env.STRIPE_WEBHOOK_SECRET,download_secret:!!env.DOWNLOAD_SECRET,approvals:await approved(env),artifacts:true};
 for(const f of ['pdf','epub']) { const obj=await env.BOOKS.head(edition.artifacts[f].key); if(!obj || obj.customMetadata?.sha256!==edition.artifacts[f].sha256) checks.artifacts=false; }
 return {edition_id:edition.edition_id,mode:'sandbox-only',checks,checkout_enabled:Object.values(checks).every(Boolean),price_cents:edition.price_cents,price_state:'proposal',release_state:'PREVIEW',real_sales:0};
}
async function checkout(req,env) {
 if(!originAllowed(req,env)) return problem('Origin rejected',403);
 const ready=await readiness(env);
 if(!ready.checkout_enabled) return json({error:'Sandbox checkout is awaiting configuration and edition approval.',readiness:ready},503);
 const hour=Math.floor(now()/3600), ip=await sha256(req.headers.get('cf-connecting-ip')||'local');
 const limit=await qs(env,'INSERT INTO rate_limits(key,count) VALUES(?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count',`${hour}:${ip}`).first();
 if(limit.count>20) return problem('Checkout rate limit',429);
 const input=JSON.parse(await body(req)||'{}');
 let order=await currentOrder(req,env), token;
 if(order?.status==='paid') return json({url:'/receipt'});
 if(order?.status==='revoked') order=null;
 if(!order) {
  token=nonce();const id=crypto.randomUUID();
  await qs(env,'INSERT INTO orders(id,edition_id,manifest_sha256,token_hash,amount,currency,created_at,attribution) VALUES(?,?,?,?,?,?,?,?)',id,edition.edition_id,edition.manifest_sha256,await sha256(token),edition.price_cents,'eur',now(),String(input.attribution||'direct').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,50)).run();
  order=await qs(env,'SELECT * FROM orders WHERE id=?',id).first();
 }
 const headers={};
 if(token) headers['Set-Cookie']=`__Host-arcanea_order=${token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`;
 try {
  if(order.checkout_url) return new Response(JSON.stringify({url:order.checkout_url}),{headers:{...headers,'content-type':'application/json'}});
  const origin=env.PUBLIC_ORIGIN||new URL(req.url).origin;
  const session=await stripe(env,'/checkout/sessions',{
   mode:'payment','payment_method_types[0]':'card','line_items[0][quantity]':'1',
   'line_items[0][price_data][currency]':'eur','line_items[0][price_data][unit_amount]':String(order.amount),
   'line_items[0][price_data][product_data][name]':edition.title+' — Sandbox review edition',
   'metadata[order_id]':order.id,'metadata[edition_id]':edition.edition_id,'metadata[manifest_sha256]':edition.manifest_sha256,
   client_reference_id:order.id,success_url:origin+'/receipt',cancel_url:origin+'/?checkout=cancelled'
  },order.id);
  if(!session.id?.startsWith('cs_test_') || new URL(session.url).hostname!=='checkout.stripe.com') throw new Error('Unexpected checkout response');
  await qs(env,'UPDATE orders SET session_id=?,checkout_url=? WHERE id=?',session.id,session.url,order.id).run();
  return new Response(JSON.stringify({url:session.url}),{headers:{...headers,'content-type':'application/json'}});
 } catch {return new Response(JSON.stringify({error:'Stripe sandbox unavailable; retry this checkout.'}),{status:502,headers:{...headers,'content-type':'application/json'}});}
}
async function webhook(req,env) {
 let event;
 try {event=await verifyWebhook(await body(req),req.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET);} catch {return problem('Invalid sandbox webhook',400);}
 if(await qs(env,'SELECT id FROM stripe_events WHERE id=?',event.id).first()) return json({received:true,duplicate:true});
 const object=event.data?.object;
 const record=qs(env,'INSERT OR IGNORE INTO stripe_events(id,type,received_at) VALUES(?,?,?)',event.id,event.type,now());
 if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)) {
  if(object?.payment_status!=='paid') return json({received:true,pending:true});
  const order=await qs(env,'SELECT * FROM orders WHERE id=?',object.metadata?.order_id||'').first();
  if(!order) return problem('Unknown order',409);
  // Resolve the Checkout Session from Stripe as a second trust boundary.
  const session=await stripe(env,'/checkout/sessions/'+encodeURIComponent(object.id));
  if(session.id!==order.session_id || session.payment_status!=='paid' || session.status!=='complete' || session.amount_total!==order.amount || session.currency!==order.currency || session.metadata?.edition_id!==order.edition_id || session.metadata?.manifest_sha256!==order.manifest_sha256 || session.metadata?.order_id!==order.id || typeof session.payment_intent!=='string' || !session.payment_intent.startsWith('pi_')) return problem('Checkout mismatch',409);
  await env.DB.batch([record,qs(env,"UPDATE orders SET payment_intent=?,status=CASE WHEN status='revoked' OR EXISTS(SELECT 1 FROM revoked_payments WHERE payment_intent=?) THEN 'revoked' ELSE 'paid' END,paid_at=COALESCE(paid_at,?) WHERE id=?",session.payment_intent,session.payment_intent,now(),order.id)]);
 } else if(event.type==='charge.refunded' || event.type==='charge.dispute.created') {
  const pi=object?.payment_intent;
  if(typeof pi!=='string' || !pi.startsWith('pi_')) return problem('Missing payment intent',400);
  // Any partial refund or dispute conservatively revokes this single-book entitlement.
  await env.DB.batch([record,qs(env,'INSERT OR IGNORE INTO revoked_payments VALUES(?,?,?)',pi,event.id,now()),qs(env,"UPDATE orders SET status='revoked',revoked_at=? WHERE payment_intent=?",now(),pi)]);
 } else await record.run();
 return json({received:true});
}
async function downloads(req,env) {
 const order=await currentOrder(req,env);
 if(!order) return problem('Order session required',401);
 if(order.status!=='paid') return json({status:order.status,downloads:[]});
 if(!env.DOWNLOAD_SECRET) return problem('Downloads not configured',503);
 const exp=now()+300;
 const links={};
 for(const format of ['pdf','epub']) {
  const payload=`${order.id}.${format}.${exp}`;
  links[format]=`/download?order=${order.id}&format=${format}&expires=${exp}&signature=${await hmac(env.DOWNLOAD_SECRET,payload)}`;
 }
 return json({status:'paid',edition_id:order.edition_id,expires_at:exp,downloads:links});
}
async function download(req,env) {
 const u=new URL(req.url),id=u.searchParams.get('order'),f=u.searchParams.get('format'),exp=u.searchParams.get('expires'),sig=u.searchParams.get('signature');
 if(!env.DOWNLOAD_SECRET || !['pdf','epub'].includes(f) || !/^\d+$/.test(exp||'') || Number(exp)<=now() || Number(exp)>now()+300 || !equal(sig,await hmac(env.DOWNLOAD_SECRET,`${id}.${f}.${exp}`))) return problem('Download link invalid or expired',403);
 const order=await qs(env,'SELECT * FROM orders WHERE id=?',id).first();
 if(!order || order.status!=='paid') return problem('Entitlement inactive',403);
 const file=edition.artifacts[f],obj=await env.BOOKS.get(file.key);
 if(!obj || obj.customMetadata?.sha256!==file.sha256) return problem('Edition artifact unavailable',503);
 const bytes=await obj.arrayBuffer();
 if(await sha256(bytes)!==file.sha256) return problem('Edition integrity failure',503);
 await qs(env,'INSERT INTO downloads VALUES(?,?,?,?)',crypto.randomUUID(),id,f,now()).run();
 return new Response(bytes,{headers:{'content-type':f==='pdf'?'application/pdf':'application/epub+zip','content-disposition':`attachment; filename="letters-to-the-seeker.${f}"`,'cache-control':'private, no-store'}});
}
async function admin(req,env,path) {
 if(!await auth(req,env)) return problem('Operator authentication required',401);
 if(path==='/api/admin/runs' && req.method==='POST') {
  const input=JSON.parse(await body(req));
  if(!Array.isArray(input.runs) || input.runs.length>9) return problem('Invalid run batch',400);
  const capabilities=['canon_intelligence','manuscript_studio','art_director','editorial_guardian','edition_architect','commerce_operator','collector_curator','distribution_director','revenue_analyst'];
  const canonical=v=>JSON.stringify(v&&typeof v==='object'?(Array.isArray(v)?v.map(x=>JSON.parse(canonical(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(canonical(v[k]))]))):v);
  const batch=[];
  for(const r of input.runs) {
   if(r.contract!=='arcanea.task.v1' || r.edition_id!==edition.edition_id || r.manifest_sha256!==edition.manifest_sha256 || !capabilities.includes(r.capability) || !['prepared','review_required','blocked'].includes(r.state) || !/^[a-f0-9]{64}$/.test(r.input_sha256) || r.release_authority!==false || typeof r.model_version!=='string' || !Number.isSafeInteger(r.created_at) || !(r.cost_micros===null || Number.isSafeInteger(r.cost_micros)&&r.cost_micros>=0) || await sha256(canonical(r.evidence))!==r.output_sha256) return problem('Run contract or digest rejected',409);
   batch.push(qs(env,'INSERT OR IGNORE INTO agent_runs VALUES(?,?,?,?,?,?,?,?,?,?)',r.run_id,r.edition_id,r.capability,r.state,r.input_sha256,r.output_sha256,JSON.stringify(r.evidence),r.model_version,r.cost_micros,r.created_at));
  }
  if(batch.length)await env.DB.batch(batch);
  return json({stored:true,runs:batch.length,release_approved:false});
 }
 if(path.startsWith('/api/admin/artifacts/') && req.method==='PUT') {
  const format=path.split('/').pop(),file=edition.artifacts[format];
  if(!file) return problem('Unsupported format',400);
  const data=await boundedBytes(req,file.bytes);
  if(data.byteLength!==file.bytes || await sha256(data)!==file.sha256) return problem('Artifact digest mismatch',409);
  const exists=await env.BOOKS.head(file.key);
  if(exists) return json({stored:true,already_present:true,key:file.key,sha256:file.sha256});
  await env.BOOKS.put(file.key,data,{customMetadata:{sha256:file.sha256},httpMetadata:{contentType:format==='pdf'?'application/pdf':'application/epub+zip'}});
  return json({stored:true,key:file.key,sha256:file.sha256});
 }
 if(path==='/api/admin/status' && req.method==='GET') {
  const [orders,runs,approvals,fulfilled]=await Promise.all([
   qs(env,"SELECT status,COUNT(*) AS count,SUM(amount) AS amount_cents FROM orders GROUP BY status").all(),
   qs(env,'SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT 100').all(),
   qs(env,'SELECT * FROM approvals ORDER BY approved_at DESC').all(),
   qs(env,'SELECT COUNT(*) AS count FROM downloads').first()
  ]);
  return json({readiness:await readiness(env),sandbox_orders:orders.results,runs:runs.results,approvals:approvals.results,download_count:fulfilled.count,conversion:null,costs:null,real_revenue_cents:0});
 }
 // This build intentionally has no approval-write or live-release endpoint.
 return problem('Unknown operation',404);
}
async function route(req,env) {
 const path=new URL(req.url).pathname;
 if(path.startsWith('/api/admin/')) return admin(req,env,path);
 if(req.method==='GET') {
  if(path==='/') return new Response(storefront(edition),{headers:{'content-type':'text/html; charset=utf-8'}});
  if(path==='/ops') return new Response(dashboard(edition),{headers:{'content-type':'text/html; charset=utf-8'}});
  if(path==='/receipt') return new Response(receipt(),{headers:{'content-type':'text/html; charset=utf-8'}});
  if(path==='/fonts/geist-sans.woff2') return new Response(Uint8Array.from(atob(geistFont),c=>c.charCodeAt(0)),{headers:{'content-type':'font/woff2'}});
  if(path==='/styles.css') return new Response(styles,{headers:{'content-type':'text/css'}});
  if(path==='/client.js') return new Response(clientScript,{headers:{'content-type':'text/javascript'}});
  if(path==='/api/readiness') return json(await readiness(env));
  if(path==='/api/production') { const rows=await qs(env,'SELECT capability,state,input_sha256,output_sha256,model_version,cost_micros,created_at FROM (SELECT capability,state,input_sha256,output_sha256,model_version,cost_micros,created_at,ROW_NUMBER() OVER(PARTITION BY capability ORDER BY created_at DESC,id DESC) AS row FROM agent_runs WHERE edition_id=?) WHERE row=1 ORDER BY capability',edition.edition_id).all(); return json({edition_id:edition.edition_id,runs:rows.results}); }
  if(path==='/api/collector-preview') return json({edition:collectorPreview(edition),adapters:['base','ethereum'].map(c=>chainPreparation(collectorPreview(edition,c)))});
  if(path==='/api/order') return downloads(req,env);
  if(path==='/download') return download(req,env);
  if(path==='/robots.txt') return new Response('User-agent: *\nDisallow: /');
 }
 if(req.method==='POST' && path==='/api/checkout') return checkout(req,env);
 if(req.method==='POST' && path==='/api/stripe/webhook') return webhook(req,env);
 return problem('Not found',404);
}
export default {async fetch(req,env) {
 let response;
 try {response=await route(req,env);} catch(error) {response=problem(error instanceof RangeError?'Request too large':'Request could not be processed',error instanceof RangeError?413:error instanceof SyntaxError?400:500);}
 const h=new Headers(response.headers);
 for(const [k,v] of Object.entries({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"})) h.set(k,v);
 return new Response(response.body,{status:response.status,headers:h});
}};
