'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const {createGuestImageSessions}=require('./guest-image-session');
test('guest image tokens are signed, expire and cannot be forged or reused after a server restart',()=>{
 let time=100;const sessions=createGuestImageSessions({now:()=>time,lifetimeMs:50}),token=sessions.issue();assert.equal(sessions.verify(token).guest,true);assert.match(sessions.verify(token).id,/^guest-image-/);
 assert.equal(sessions.verify(token.slice(0,-1)+(token.endsWith('A')?'B':'A')),null);assert.equal(createGuestImageSessions().verify(token),null);
 time=150;assert.equal(sessions.verify(token),null);assert.equal(sessions.verify('not-a-token'),null);
});
test('visitors can identify an uploaded image without login while other guest images and private operations remain isolated',{timeout:30000},async t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-guest-images-')),port=34000+crypto.randomInt(10000);
 const files=Object.fromEntries(['CUSTOMERS_FILE','ACCOUNT_DATA_FILE','PRODUCT_REVIEWS_FILE','SALES_DATA_FILE','AI_METRICS_FILE','SALES_CONVERSATIONS_FILE','AI_ACCESS_FILE'].map(key=>[key,path.join(directory,key.toLowerCase()+'.json')]));
 const child=spawn(process.execPath,['server.js'],{cwd:__dirname,env:{...process.env,...files,PORT:String(port),HOST:'127.0.0.1',PRIVATE_DATA_DIR:directory,OCOP_LOCAL_DEMO:'',GEMINI_API_KEY:'',OPENAI_API_KEY:'',ANTHROPIC_API_KEY:'',CLAUDE_API_KEY:'',AUDIO_ADMIN_PASSWORD:'',TWILIO_ACCOUNT_SID:'',TWILIO_AUTH_TOKEN:'',TWILIO_FROM_NUMBER:'',TRUST_PROXY:'',AI_ENABLED:'true'},windowsHide:true,stdio:['ignore','pipe','pipe']});
 let log='';child.stdout.on('data',data=>log+=data);child.stderr.on('data',data=>log+=data);
 t.after(async()=>{child.kill();await new Promise(resolve=>child.exitCode!==null?resolve():child.once('exit',resolve));fs.rmSync(directory,{recursive:true,force:true});});
 const base='http://127.0.0.1:'+port;let ready=false;
 for(let i=0;i<100;i++){try{if((await fetch(base+'/health')).ok){ready=true;break;}}catch{}if(child.exitCode!==null)throw Error(log);await new Promise(resolve=>setTimeout(resolve,100));}assert(ready);
 const post=(route,body,token)=>fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',...(token?{'X-OCOP-Guest-Image':token}:{})},body:JSON.stringify(body)});
 const a=(await (await post('/api/ai/guest-image-session',{})).json()).guestToken,b=(await (await post('/api/ai/guest-image-session',{})).json()).guestToken;assert(a&&b&&a!==b);
 const row=require('./data/product-image-knowledge.json')[0],reference=row.googleImages.find(image=>image.downloadStatus==='ready');
 const upload=await fetch(base+'/api/ai/images',{method:'POST',headers:{'Content-Type':reference.mimeType,'X-OCOP-Guest-Image':a},body:fs.readFileSync(path.join(__dirname,reference.localPath))});assert.equal(upload.status,201);const {image}=await upload.json();
 const question={messages:[{role:'user',text:'Tìm sản phẩm trong ảnh'}],imageIds:[image.id],language:'vi'};
 const matched=await post('/api/ai/chat',question,a);assert.equal(matched.status,200);const reply=await matched.json();assert(reply.productIds.includes(row.id));assert.match(reply.message,/^Dạ/);
 assert.equal((await post('/api/ai/chat',question,b)).status,404);
 assert.equal((await post('/api/ai/chat',question,a+'x')).status,401);
 assert.equal((await post('/api/ai/chat',{messages:[{role:'user',text:'hello'}]},a)).status,401);
 assert.equal((await post('/api/ai/audio-chat',{recordingConsent:true},a)).status,401);
 assert.equal((await post('/api/ai/search-image',{imageData:'invalid'},a)).status,400);
 assert.equal((await post('/api/ai/draft-orders',{},a)).status,401);
 const owners=JSON.parse(fs.readFileSync(path.join(directory,'chat-images.json'),'utf8'));assert.match(owners[0].ownerId,/^guest-image-/);
});
test('anonymous browser image uploads share one temporary session without leaking it to another origin',async()=>{
 const vm=require('node:vm'),calls=[],temporary=new Map();
 const root={Headers,URL,location:new URL('http://localhost:5500/'),document:{readyState:'complete'},localStorage:{getItem:()=>null,removeItem(){}},sessionStorage:{getItem:key=>temporary.get(key)||null,setItem:(key,value)=>temporary.set(key,value),removeItem:key=>temporary.delete(key)},getAIEndpoint:route=>'http://localhost:3000'+route,
 fetch:async(url,options={})=>{calls.push({url,options});return new Response(JSON.stringify(String(url).endsWith('/guest-image-session')?{guestToken:'signed-test-token'}:{image:{id:'test-image'}}));}};
 root.window=root;vm.runInNewContext(fs.readFileSync('account-client.js','utf8'),root);await root.accountReady;
 await Promise.all([1,2].map(()=>root.OCOPAuth.fetch('http://localhost:3000/api/ai/images',{method:'POST'})));
 assert.equal(calls.filter(call=>call.url.endsWith('/guest-image-session')).length,1);
 assert.equal(calls.filter(call=>call.url.endsWith('/images')&&call.options.headers.get('X-OCOP-Guest-Image')==='signed-test-token').length,2);
 await root.OCOPAuth.fetch('https://evil.example/api/ai/images');assert.equal(calls.at(-1).options.headers.has('X-OCOP-Guest-Image'),false);
});
