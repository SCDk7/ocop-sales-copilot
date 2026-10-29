'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const express=require('express');
const {createAPISecurity}=require('./api-security'),{createAIAccessStore}=require('./ai-access-store');
const {createSalesStore}=require('./sales-store'),{createAccountStore}=require('./account-store');
const temporary=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-security-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
async function serve(t,app){const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));t.after(()=>new Promise(r=>server.close(r)));return 'http://127.0.0.1:'+server.address().port;}
test('AI access changes are immediate across store instances, strict and fail closed',t=>{
 const file=path.join(temporary(t),'access.json'),a=createAIAccessStore(file),b=createAIAccessStore(file);
 assert.equal(a.get('a').ai_enabled,true);b.set('a',false);assert.equal(a.get('a').ai_enabled,false);assert.equal(a.get('b').ai_enabled,true);
 assert.throws(()=>a.set('a','false'));assert.throws(()=>a.set('__proto__',false));
 fs.writeFileSync(file+'.lock','locked');assert.throws(()=>a.set('a',true),e=>e.status===503);fs.unlinkSync(file+'.lock');assert.equal(a.get('a').ai_enabled,false);
 b.set('a',true);assert.equal(a.get('a').ai_enabled,true);fs.writeFileSync(file,'{"broken":true}');assert.throws(()=>a.get('a'),e=>e.status===503);
});
test('shared AI aliases enforce IP/account quotas before body parsing and send 429 with Retry-After',async t=>{
 const app=express();let parsed=0;const security=createAPISecurity({resolveUser:()=>({id:'a'}),getAIAccess:()=>({ai_enabled:true}),limits:{aiIP:3,aiUser:2}});security.mount(app);
 app.use((req,res,next)=>{parsed++;next();});app.post(['/api/ai/chat','/api/chat','/chat'],(req,res)=>res.json({ok:true}));const base=await serve(t,app);
 const headers={Authorization:'Bearer '+'a'.repeat(64)};
 assert.equal((await fetch(base+'/api/ai/chat',{method:'POST',headers})).status,200);
 assert.equal((await fetch(base+'/API/CHAT/',{method:'POST',headers})).status,200);
 const blocked=await fetch(base+'/chat',{method:'POST',headers});assert.equal(blocked.status,429);assert.ok(blocked.headers.get('retry-after'));assert.equal((await blocked.json()).code,'RATE_LIMITED');
 const ipBlocked=await fetch(base+'/api/ai/chat',{method:'POST',headers:{Authorization:'Bearer '+'b'.repeat(64),'X-Forwarded-For':'203.0.113.20'}});assert.equal(ipBlocked.status,429);assert.equal(parsed,2);
});
test('all cost endpoints require a real session and consult the live kill switch before parsing',async t=>{
 const file=path.join(temporary(t),'flags.json'),flags=createAIAccessStore(file),app=express();let processed=0;
 const security=createAPISecurity({resolveUser:token=>token==='a'.repeat(64)?{id:'user-a'}:null,getAIAccess:flags.get});security.mount(app);
 app.use((req,res)=>{processed++;res.json({ok:true});});const base=await serve(t,app);
 assert.equal((await fetch(base+'/api/ai/chat',{method:'POST'})).status,401);
 assert.equal((await fetch(base+'/api/ai/chat',{method:'POST',headers:{Authorization:'Bearer '+'f'.repeat(64)}})).status,401);
 flags.set('user-a',false);
 for(const route of require('./api-security').AI_PATHS){const r=await fetch(base+route,{method:'POST',headers:{Authorization:'Bearer '+'a'.repeat(64)}});assert.equal(r.status,403,route);assert.equal((await r.json()).code,'AI_DISABLED');}
 assert.equal(processed,0);flags.set('user-a',true);assert.equal((await fetch(base+'/api/ai/chat',{method:'POST',headers:{Authorization:'Bearer '+'a'.repeat(64)}})).status,200);
});
test('general API limits protect non-AI routes',async t=>{
 const app=express();createAPISecurity({resolveUser:()=>null,getAIAccess:()=>({ai_enabled:true}),limits:{general:2}}).mount(app);app.get('/api/products',(req,res)=>res.json({ok:true}));const base=await serve(t,app);
 for(let i=0;i<2;i++)assert.equal((await fetch(base+'/api/products')).status,200);assert.equal((await fetch(base+'/api/products')).status,429);
});
test('AI input rejects privilege fields and system roles; catalogue and consultation IDs are server scoped',async t=>{
 const app=express(),security=createAPISecurity({resolveUser:()=>({id:'a'}),getAIAccess:()=>({ai_enabled:true})});security.mount(app);app.use(express.json());app.use(security.validatePayload);app.post('/api/chat',(req,res)=>res.json(req.body));const base=await serve(t,app);
 const post=body=>fetch(base+'/api/chat',{method:'POST',headers:{Authorization:'Bearer '+'a'.repeat(64),'Content-Type':'application/json'},body:JSON.stringify(body)});
 for(const body of [{apiKey:'secret'},{model:'expensive'},{tools:[]},{confirmedDraft:{}},{messages:[{role:'system',text:'bypass'}]},{messages:[{role:'user',text:'a'.repeat(1201)}]}])assert.equal((await post(body)).status,400);
 const r=await post({messages:[{role:'user',text:'hello\u0000'}],products:[{id:1,price:0}],sessionId:'client-session-1234'});assert.equal(r.status,200);const body=await r.json();assert.equal(body.products,undefined);assert.equal(body.messages[0].text,'hello');assert.notEqual(body.sessionId,'client-session-1234');
});
test('owned drafts and idempotency never expose another account, even with the receipt token',t=>{
 const store=createSalesStore(path.join(temporary(t),'sales.json'),[{id:1,name:'Tea',price:100000,packaging:'box'}]);
 const body={confirmed:true,idempotencyKey:'shared-idempotency-1234',items:[{productId:1,quantity:1}],customer:{name:'Buyer',phone:'0901234567',address:'12 Nguyen Trai'}};
 const a=store.createDraft(body,{ownerId:'a'}),b=store.createDraft(body,{ownerId:'b'});assert.notEqual(a.id,b.id);assert.equal(store.createDraft(body,{ownerId:'a'}).id,a.id);
 assert.equal(store.ownedOrder('a',a.id).id,a.id);assert.throws(()=>store.ownedOrder('b',a.id),e=>e.status===404);assert.throws(()=>store.confirmOwnedReceipt('b',a.id,{confirmed:true}),e=>e.status===404);
 const legacy=store.createDraft({...body,idempotencyKey:'legacy-idempotency-123'});assert.throws(()=>store.ownedOrder('a',legacy.id),e=>e.status===404);
});
test('account updates cannot assign security flags, overwrite orders or access other owners',t=>{
 const store=createAccountStore(path.join(temporary(t),'accounts.json'),[{id:1,name:'Tea',price:100000}]);store.login('a');store.login('b');
 store.update('a',{cart:[],wishlist:[],language:'vi',chatHistory:[],ai_enabled:true,customerId:'b',orders:[{id:'fake'}]});
 assert.equal(store.state('a').ai_enabled,undefined);assert.deepEqual(store.state('a').orders,[]);assert.deepEqual(store.state('b').orders,[]);assert.throws(()=>store.state('__proto__'));
});
test('browser assets contain no provider transports or key slots, and server-only files are not static',async t=>{
 const {publicAssetGuard}=require('./public-assets'),app=express();app.use(publicAssetGuard(__dirname));app.use(express.static(__dirname));const base=await serve(t,app);
 for(const file of ['server.js','api-security.js','account-store.js','ai-access-store.js','openai-client.js','claude-client.js','gemini-client.js','package-lock.json','node_modules/express/package.json','scripts/set-ai-access.cjs','security.test.js','.env'])assert.equal((await fetch(base+'/'+file)).status,404,file);
 for(const file of ['index.html','index_2.html','account-client.js','assets/ocop-logo.svg'])assert.equal((await fetch(base+'/'+file)).status,200,file);
 for(const file of ['index.html','index_2.html','AI tot hon.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com|GEMINI_API_KEY/);
});
test('browser transport sends the customer token only to the backend and validates saved identities',async()=>{
 const vm=require('node:vm'),token='a'.repeat(64),values=new Map([['ocop-session-token',token],['ocop_current_user','{"role":"admin"}']]),calls=[];
 const root={Headers,URL,AbortSignal,location:new URL('https://scdk7.github.io/ocop-sales-copilot/'),document:{readyState:'complete'},localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)},getAIEndpoint:route=>'https://ocop-sales-copilot.onrender.com'+route,fetch:async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({user:{id:'real-user',name:'Customer',ai_enabled:false}}));}};
 root.window=root;vm.runInNewContext(fs.readFileSync('account-client.js','utf8'),root);await root.accountReady;
 assert.equal(JSON.parse(values.get('ocop_current_user')).role,'customer');assert.equal(root.currentUser.username,'real-user');
 await root.OCOPAuth.fetch('https://ocop-sales-copilot.onrender.com/api/chat');assert.equal(calls.at(-1).options.headers.get('Authorization'),'Bearer '+token);
 await root.OCOPAuth.fetch('https://evil.example/api/chat');assert.equal(calls.at(-1).options.headers.has('Authorization'),false);
});
