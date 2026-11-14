'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),express=require('express');
const content=require('./site-content');
const {createSiteInformation,notFound}=require('./site-information');
const {createSpaFallback}=require('./spa-fallback');
const products=require('./data').PRODUCTS;
function visible(html){return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');}
async function fixture(t){
 const app=express();app.use((_req,res,next)=>{res.vary('Origin');next();});
 app.use(createSiteInformation({root:__dirname,products,getInventory:()=>products.map(p=>({productId:p.id,price:p.price+1}))}));
 app.use(require('./public-assets').publicAssetGuard(__dirname,{notFound}));app.use(express.static(__dirname));
 app.use(createSpaFallback(path.join(__dirname,'index.html'),{isProduct:id=>products.some(p=>p.id===id)}));app.use(notFound);
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base='http://127.0.0.1:'+server.address().port;
 return (route,accept='text/html',method='GET')=>fetch(base+route,{method,headers:{Accept:accept}});
}
test('homepage negotiates real Markdown/HTML with quality values, wildcards, exclusions and cache-safe Vary',async t=>{
 const request=await fixture(t);
 for(const route of ['/','/index.html','/index_2.html']){
  const response=await request(route,'text/markdown');assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/^text\/markdown; charset=utf-8/);
  assert.match(response.headers.get('vary'),/Accept/);assert.match(response.headers.get('vary'),/Origin/);assert.match(response.headers.get('link'),/rel="describedby"/);
  const body=await response.text();assert.match(body,/^# OCOP Sales/);assert.ok(body.length>500);assert.doesNotMatch(body,/<script|<style|<html/i);
 }
 for(const [accept,type,status] of [['text/html','text/html',200],['*/*','text/html',200],['text/html;q=1, text/markdown;q=0.1','text/html',200],['text/html;q=0.1, text/markdown;q=0.9','text/markdown',200],['text/markdown;q=0, text/html','text/html',200],['text/html;q=0, text/*;q=0.8','text/markdown',200],['application/json','text/plain',406],['text/html;q=0, text/markdown;q=0','text/plain',406]]){
  const r=await request('/',accept);assert.equal(r.status,status,accept);assert.ok(r.headers.get('content-type').startsWith(type),accept);
 }
 const head=await request('/','text/markdown','HEAD');assert.equal(head.status,200);assert.match(head.headers.get('content-type'),/^text\/markdown/);assert.equal(await head.text(),'');
});
test('unknown pages and blocked assets preserve 404 and offer Markdown without reflecting injected HTML',async t=>{
 const request=await fixture(t);
 for(const route of ['/__ora-404-probe','/unknown/nested/route','/missing.md','/assets/missing.js','/site.config.json','/server.js','/.private-data/missing','/products/999999999']){
  const r=await request(route,'text/markdown');assert.equal(r.status,404,route);assert.match(r.headers.get('content-type'),/^text\/markdown/);assert.match(r.headers.get('vary'),/Accept/);
  const text=await r.text();assert.ok(text.length>20);assert.match(text,/\[.*\]\(https:\/\/.*\/llms\.txt\)/);
 }
 const page=await request('/not-found');assert.equal(page.status,404);assert.match(await page.text(),/<h1>Không tìm thấy trang/);
 const api=await request('/api/not-found','application/json');assert.equal(api.status,404);assert.equal(typeof(await api.json()).error,'string');
 const product=await request('/products/'+products[0].id);assert.equal(product.status,200);assert.match(await product.text(),/storefront-router\.js/);
});
test('trust pages have real HTML prose, equivalent Markdown and resolvable local stylesheet',async t=>{
 const request=await fixture(t);
 for(const route of ['/about','/contact','/privacy','/terms','/catalog']){
  const r=await request(route);assert.equal(r.status,200);const html=await r.text();assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(visible(html).length>500,route);assert.match(html,/<html lang="vi">/);
  const headings=[...html.matchAll(/<h([1-6])\b/g)].map(m=>Number(m[1]));headings.forEach((level,i)=>{if(i)assert.ok(level<=headings[i-1]+1,route);});
  const md=await request(route,'text/markdown');assert.equal(md.status,200);assert.match(md.headers.get('content-type'),/^text\/markdown/);assert.ok((await md.text()).length>500);
  for(const alias of [route+'/',route+'/index.html',route+'.md',route+'.html.md'])assert.equal((await request(alias,alias.endsWith('.md')?'text/markdown':'text/html')).status,200,alias);
 }
 assert.equal((await request('/assets/site-information.css','text/css')).status,200);
 const catalogue=await(await request('/catalog','text/markdown')).text();assert.match(catalogue,new RegExp(products[0].productCode));assert.ok(catalogue.includes((products[0].price+1).toLocaleString('vi-VN')),'catalogue reads authoritative live prices');
});
test('unpublished sample contact details are excluded from organization schema and new contact content',()=>{
 const graph=content.structuredData(),organization=graph['@graph'].find(row=>row['@type']==='Organization');
 assert.equal(organization.name,'OCOP Sales');assert.equal(organization.contactPoint.contactType,'customer support');assert.equal(organization.contactPoint.url,content.absolute('/contact'));
 assert.equal(organization.contactPoint.telephone,undefined);assert.equal(organization.contactPoint.email,undefined);assert.equal(organization.address,undefined);
 for(const text of [JSON.stringify(graph),content.markdown('/contact')])assert.doesNotMatch(text,/1900 888 688|496 Nguyễn|0312461711|banbientap@|Miễn phí|số 1 Việt Nam/);
 assert.ok(graph['@graph'].some(row=>row['@type']==='WebApplication'));
});
test('both raw homepages have one visible semantic H1, >500 characters of no-JS content and complete discovery metadata',()=>{
 for(const file of ['index.html','index_2.html']){
  const html=fs.readFileSync(file,'utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/<h1[^>]*intro-hero-title/);
  const noJS=html.match(/<noscript id="public-no-js-overview">([\s\S]*?)<\/noscript>/)[1];assert.ok(visible(noJS).length>500);assert.match(noJS,/href="catalog\/"/);
  assert.match(html,/<link rel="canonical" href="https:\/\/ocop-sales-copilot.onrender.com\/">/);assert.match(html,/<meta property="og:type" content="website">/);assert.match(html,/<meta property="og:image" content="https:\/\/.*\.png">/);
  const json=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert.equal(json['@context'],'https://schema.org');assert.deepEqual(json,content.structuredData());
  assert.match(html,/href="about\/"/);assert.match(html,/href="contact\/"/);assert.match(html,/href="privacy\/"/);
 }
});
test('llms, robots, sitemap, Markdown aliases and social image are served in their declared formats',async t=>{
 const request=await fixture(t);
 for(const [route,type] of [['/llms.txt','text/plain'],['/robots.txt','text/plain'],['/sitemap.xml','application/xml'],['/index.md','text/markdown'],['/index.html.md','text/markdown'],['/index_2.html.md','text/markdown'],['/assets/ocop-social-card.png','image/png']]){
  const r=await request(route,'*/*');assert.equal(r.status,200,route);assert.ok(r.headers.get('content-type').startsWith(type),route);assert.ok((await r.arrayBuffer()).byteLength>20);
 }
 const llms=fs.readFileSync('llms.txt','utf8');assert.match(llms,/^# OCOP Sales\n\n> /);assert.match(llms,/## When to use/);assert.match(llms,/## Optional/);
 for(const section of llms.split(/\n## /).slice(1))assert.ok(section.split('\n').slice(1).filter(Boolean).every(line=>/^- \[[^\]]+\]\(https:\/\/[^)]+\)/.test(line)),section);
 const xml=fs.readFileSync('sitemap.xml','utf8');assert.match(xml,/^<\?xml version="1.0" encoding="UTF-8"\?>/);assert.match(xml,/<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
 const locations=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(new Set(locations).size,Object.keys(content.pages).length);
 for(const location of locations){const url=new URL(location);assert.equal(url.origin,content.config.url);assert.equal((await request(url.pathname)).status,200);assert.doesNotMatch(url.pathname,/api|admin|cart|draft-order/);}
 for(const [,date]of xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g))assert.ok(Number.isFinite(Date.parse(date)));
 const image=await require('sharp')('assets/ocop-social-card.png').metadata();assert.equal(image.width,1200);assert.equal(image.height,630);
});
test('content builders escape markup from catalogue data and produce stable documents',()=>{
 const malicious=[{id:1,name:'<script>alert(1)</script> # fake',productCode:'TP00001',region:'<img onerror=alert(1)>',price:1,packaging:'kg'}];
 const html=content.html('/catalog',malicious);assert.doesNotMatch(html,/<script>alert\(1\)<\/script>|<img onerror=/);assert.match(html,/&lt;script&gt;/);
 const md=content.markdown('/catalog',malicious);assert.doesNotMatch(md,/<script>|\n# fake/);assert.match(md,/\\<script\\>/);
 const generated=['index.md','about/index.html','contact/index.html','privacy/index.html','terms/index.html','catalog/index.html','llms.txt','robots.txt','sitemap.xml'];
 const before=generated.map(file=>fs.readFileSync(file,'utf8'));require('./scripts/build-site-information.cjs').build();const after=generated.map(file=>fs.readFileSync(file,'utf8'));assert.deepEqual(after,before,'rebuilding unchanged content does not fabricate new lastmod dates');
});
