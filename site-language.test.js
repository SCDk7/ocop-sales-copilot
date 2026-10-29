'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm'),express=require('express');
const content=require('./site-content'),locale=require('./site-language'),editorial=require('./site-locales'),ui=require('./ui-translations');
const {createSiteInformation,notFound}=require('./site-information');
const {publicAssetGuard}=require('./public-assets');
const products=require('./data').PRODUCTS;
function browser(storage=new Map(),url='http://localhost:3000/'){
 const events=[],handlers={};const root={URL,location:new URL(url),localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{documentElement:{lang:'vi'},cookie:'',readyState:'loading',addEventListener(){}},history:{replaceState(_a,_b,url){root.location=new URL(url,root.location);}},CustomEvent:class{constructor(type,init){this.type=type;Object.assign(this,init);}},addEventListener(type,handler){handlers[type]=handler;},dispatchEvent(event){events.push(event);handlers[event.type]?.(event);}};
 root.window=root;vm.createContext(root);for(const file of ['ui-translations.js','sales-translations.js','site-language.js'])vm.runInContext(fs.readFileSync(file,'utf8'),root);
 return {root,api:root.OCOPLanguage,storage,events};
}
test('one locale persists across page navigation and explicit URL preference overrides saved language',()=>{
 const {api,storage,root,events}=browser();api.set('ko');assert.equal(storage.get('ocop-language'),'ko');assert.match(root.document.cookie,/ocop-language=ko/);assert.equal(root.document.documentElement.lang,'ko');assert.equal(events.at(-1).detail.language,'ko');
 assert.equal(browser(storage,'http://localhost:3000/about').api.get(),'ko');
 const changed=browser(storage,'http://localhost:3000/privacy?lang=ja');assert.equal(changed.api.get(),'ja');changed.api.set('zh');assert.equal(changed.root.location.search,'?lang=zh');
 assert.equal(locale.normalize('ja-JP'),'ja');assert.equal(locale.normalize('not-supported'),'vi');
});
test('shared UI and sales phrases cover all five languages while preserving numbers, SKUs and unit quantities',()=>{
 for(const row of ui.rows){assert.equal(row.length,5);assert.ok(row.every(label=>typeof label==='string'&&label.length>0),JSON.stringify(row));}
 for(const lang of locale.languages){assert.equal(locale.text('Quên mật khẩu?',lang),ui.rows.find(row=>row[0]==='Quên mật khẩu?')[locale.languages.indexOf(lang)]);assert.ok(locale.text('TẠO TÀI KHOẢN',lang));}
 assert.equal(locale.text('Làm mới mã sau: 01:30','ko'),'새로고침까지: 01:30');assert.equal(locale.text('Mã khách hàng: KH2600000001','ja'),'顧客コード： KH2600000001');assert.equal(locale.text('3 sản phẩm','zh'),'3 件商品');assert.equal(locale.text('TD00336','ko'),'TD00336');
 assert.equal(locale.unit('hộp túi lọc','ko'),'티백 상자');assert.equal(locale.unit('túi 500g','ja'),'袋 500g');
 const p=products[0];assert.equal(locale.productName(p,'en'),p.nameEn);assert.equal(locale.productName(p,'ko'),p.name);assert.doesNotMatch(locale.productDescription(p,'ko'),/Price unit|Prices and star ratings/);
});
test('every information page has complete editorial translations and selected-language metadata',()=>{
 for(const lang of locale.languages)for(const route of Object.keys(content.pages)){
  const page=content.pageFor(route,lang);assert.ok(page.title&&page.description);assert.equal(page.sections.length,content.pages[route].sections.length);
  page.sections.forEach(section=>{assert.equal(section.length,2);assert.ok(section[0].length>=2);assert.ok(section[1].length>40);});
  if(lang!=='vi')assert.notEqual(page.title,content.pages[route].title,route+' '+lang);
  const md=content.markdown(route,products,lang);assert.ok(md.startsWith('# '+page.title));
  const metadata=content.metadata(route,lang);assert.ok(metadata.includes(page.title));const graph=JSON.parse(metadata.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert.equal(graph['@graph'].find(row=>row['@type']==='WebSite').inLanguage,lang);
 }
 for(const lang of ['en','zh','ko','ja'])assert.deepEqual(Object.keys(editorial[lang]),Object.keys(content.pages));
});
test('server selects a full language from query, cookie or Accept-Language for both HTML and Markdown',async t=>{
 const app=express();app.use(createSiteInformation({root:__dirname,products}));app.use(publicAssetGuard(__dirname,{notFound}));app.use(express.static(__dirname));app.use(notFound);
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));t.after(()=>{server.closeAllConnections();return new Promise(resolve=>server.close(resolve));});
 const base='http://127.0.0.1:'+server.address().port;
 for(const lang of locale.languages)for(const route of ['/about','/contact','/privacy','/terms','/catalog']){
  const response=await fetch(base+route+'?lang='+lang);assert.equal(response.status,200);assert.equal(response.headers.get('content-language'),lang);assert.match(response.headers.get('vary'),/Cookie/);assert.match(response.headers.get('vary'),/Accept-Language/);
  const html=await response.text();assert.ok(html.includes('<html lang="'+lang+'">'));assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(html.includes('<h1>'+content.pageFor(route,lang).title+'</h1>'));
  const views=JSON.parse(html.match(/id="site-locale-views">([\s\S]*?)<\/script>/)[1]);assert.deepEqual(Object.keys(views),locale.languages);assert.ok(views[lang].html.includes(content.pageFor(route,lang).title));assert.match(html,/id="site-language-select"/);
  const md=await fetch(base+route+'.md?lang='+lang,{headers:{Accept:'text/markdown'}});assert.equal(md.headers.get('content-language'),lang);assert.ok((await md.text()).startsWith('# '+content.pageFor(route,lang).title));
 }
 for(const [path,headers,expected]of [['/about',{'Accept-Language':'ko-KR, en;q=0.5'},'ko'],['/about',{Cookie:'ocop-language=ja','Accept-Language':'en'},'ja'],['/about?lang=zh',{Cookie:'ocop-language=ja'},'zh']]){const response=await fetch(base+path,{headers});assert.equal(response.headers.get('content-language'),expected);await response.text();}
 const missing=await fetch(base+'/not-found?lang=ko',{headers:{Accept:'text/markdown'}});assert.equal(missing.status,404);assert.equal(missing.headers.get('content-language'),'ko');assert.match(await missing.text(),/^# 페이지/);
 for(const file of ['ui-translations.js','sales-translations.js','site-language.js','site-information-client.js'])assert.equal((await fetch(base+'/'+file)).status,200,file);
 assert.equal((await fetch(base+'/site-locales.js')).status,404,'server-only source remains private');
});
test('account state accepts and persists every supported language without changing ownership',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-language-state-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));const store=require('./account-store').createAccountStore(path.join(dir,'accounts.json'),products);
 for(const language of locale.languages){store.update('alice',{cart:[],wishlist:[],language,chatHistory:[]});assert.equal(store.state('alice').language,language);assert.equal(store.state('bob').language,'vi');}
 assert.throws(()=>store.update('alice',{cart:[],wishlist:[],language:'unsupported',chatHistory:[]}),{status:400});
});
