import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {Miniflare} from 'miniflare';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const remote=process.env.PREVIEW_URL;
let mf;
if(!remote){mf=new Miniflare({modules:true,script:await readFile('dist/worker.mjs','utf8'),compatibilityDate:'2026-07-30',d1Databases:['DB'],r2Buckets:['BOOKS']});const db=await mf.getD1Database('DB');await db.exec((await readFile('commerce/migrations/0001.sql','utf8')).replace(/\n/g,' '));}
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(remote && process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{})});
await mkdir('evidence/screenshots',{recursive:true});
const results=[];
try{
for(const width of [375,768,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,ignoreHTTPSErrors:true});
 if(!remote)await context.route('https://arcanea.test/**',async route=>{const req=route.request();const res=await mf.dispatchFetch(req.url(),{method:req.method(),headers:req.headers(),body:req.postDataBuffer()||undefined});await route.fulfill({status:res.status,headers:Object.fromEntries(res.headers),body:Buffer.from(await res.arrayBuffer())});});
 const page=await context.newPage();
 await page.addInitScript(()=>{window.__lab={lcp:null,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lab.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__lab.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
 for(const path of ['/','/ops','/receipt']){
  const start=Date.now();await page.goto((remote||'https://arcanea.test')+path,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const rendering=await page.evaluate(()=>({computed_font:getComputedStyle(document.body).fontFamily,geist_loaded:document.fonts.check('16px Geist'),lab:window.__lab}));
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations;
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const filename=(path==='/'?'storefront':path.slice(1))+'-'+width+'.png';
  await page.screenshot({path:'evidence/screenshots/'+filename,fullPage:true});
  results.push({path,width,violations:violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),horizontal_overflow:overflow,load_plus_audit_ms:Date.now()-start,rendering});
 }
 if(width===375){await page.goto((remote||'https://arcanea.test')+'/');await page.getByRole('button',{name:/Test checkout/}).click();await page.getByRole('status').filter({hasText:/awaiting/}).waitFor();results.push({interaction:'blocked checkout gives an honest status',passed:true});await page.keyboard.press('Tab');}
 await context.close();
}
await writeFile('evidence/interface-audit.json',JSON.stringify({source:remote||'local workerd runtime',results},null,2)+'\n');
console.log(JSON.stringify({screens:results.filter(x=>x.path).length,violations:results.reduce((n,r)=>n+(r.violations?.length||0),0),overflows:results.filter(x=>x.horizontal_overflow).length}));
if(results.some(r=>r.violations?.length||r.horizontal_overflow))process.exitCode=1;
}finally{await browser.close();await mf?.dispose();}
