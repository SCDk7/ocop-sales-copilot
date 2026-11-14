'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),{spawn}=require('node:child_process');
const {createLocalDemoEnvironment,localDemoAllowed}=require('./local-demo');
test('demo bootstrap is opt-in, hashed, persistent and forbidden on production hosts',t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-local-login-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 for(const env of [{NODE_ENV:'production'},{RENDER:'true'},{RENDER_EXTERNAL_URL:'https://example.onrender.com'}])assert.throws(()=>createLocalDemoEnvironment({directory,env}));
 const env=createLocalDemoEnvironment({directory,env:{}});assert.equal(env.HOST,'127.0.0.1');assert.ok(localDemoAllowed(env));assert.equal(localDemoAllowed({OCOP_LOCAL_DEMO:'1'}),false);
 const original=JSON.parse(fs.readFileSync(env.CUSTOMERS_FILE,'utf8'));assert.equal(original.length,7);assert.ok(original.every(r=>!r.password&&r.passwordSalt&&r.passwordHash));
 const customer=original.find(r=>r.username==='khachhang');assert.equal(crypto.scryptSync('123456',Buffer.from(customer.passwordSalt,'hex'),64).toString('hex'),customer.passwordHash);
 createLocalDemoEnvironment({directory,env:{}});assert.deepEqual(JSON.parse(fs.readFileSync(env.CUSTOMERS_FILE,'utf8')),original);
});
test('local demo authenticates real sessions from Live Server and file origins while rejecting bad credentials',{timeout:20000},async t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-login-http-'));const demo=createLocalDemoEnvironment({directory,env:{}}),port=35000+crypto.randomInt(10000);
 const child=spawn(process.execPath,['server.js'],{cwd:__dirname,env:{...process.env,...demo,PORT:String(port),GEMINI_API_KEY:'',OPENAI_API_KEY:'',ANTHROPIC_API_KEY:'',CLAUDE_API_KEY:'',OCOP_KPI_SYNC_TOKEN:''},windowsHide:true,stdio:['ignore','pipe','pipe']});let logs='';child.stderr.on('data',d=>logs+=d);
 t.after(async()=>{child.kill();await new Promise(r=>child.exitCode!==null?r():child.once('exit',r));fs.rmSync(directory,{recursive:true,force:true});});
 const base='http://127.0.0.1:'+port;let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base+'/health')).ok){ready=true;break;}}catch{}if(child.exitCode!==null)throw Error(logs);await new Promise(r=>setTimeout(r,100));}assert.ok(ready,logs);
 const login=(name,password,origin)=>fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({name,password})});
 let token;
 for(const row of JSON.parse(fs.readFileSync(demo.CUSTOMERS_FILE,'utf8'))){
  const password=row.username==='khachhang'?'123456':row.username==='admin'?'000000':row.username==='nppdemo'?'NppDemo@2026':({'ThaoNguyenad01':'0000000','KimNganad02':'1111111','VinhPhucad03':'2222222','ThanhBinhad04':'3333333'})[row.username];
  const r=await login(row.username,password,'http://127.0.0.1:5500');assert.equal(r.status,200,row.username);assert.equal(r.headers.get('access-control-allow-origin'),'http://127.0.0.1:5500');const body=await r.json();assert.equal(body.user.role,row.role);assert.match(body.token,/^[a-f0-9]{64}$/);if(row.username==='khachhang')token=body.token;
 }
 const file=await login('khachhang','123456','null');assert.equal(file.status,200);assert.equal(file.headers.get('access-control-allow-origin'),'null');
 assert.equal((await login('khachhang','incorrect','http://localhost:5500')).status,401);
 assert.equal((await login('khachhang','123456','https://evil.example')).status,403);
 assert.equal((await fetch(base+'/api/auth/me',{headers:{Authorization:'Bearer '+token,Origin:'http://localhost:5500'}})).status,200);
 assert.equal((await fetch(base+'/local-demo.js')).status,404);
});
test('all six customer password fields reveal and mask through accessible eye buttons',()=>{
 for(const page of ['index.html','index_2.html']){
  const html=fs.readFileSync(page,'utf8');for(const id of ['cust-login-pass','cust-reg-pass','cust-reg-pass2','cust-chpass-old','cust-chpass-new','cust-chpass-new2'])assert.ok(html.includes('aria-controls="'+id+'"'),page+': '+id);
  const start=html.lastIndexOf('        function togglePasswordVisibility(inputId, btn) {'),end=html.indexOf('        function openGoogleChooser()',start),input={type:'password'},button={attributes:{},setAttribute(k,v){this.attributes[k]=v;},querySelector(){return null;}};
  const context={document:{getElementById:()=>input}};vm.runInNewContext(html.slice(start,end),context);context.togglePasswordVisibility('test',button);assert.equal(input.type,'text');assert.equal(button.attributes['aria-label'],'Ẩn mật khẩu');context.togglePasswordVisibility('test',button);assert.equal(input.type,'password');assert.equal(button.attributes['aria-pressed'],'false');
 }
});
test('authentication connection failures give local users a useful recovery command',async()=>{
 const root={fetch:async()=>{throw new TypeError('Failed to fetch');},Headers,URL,AbortSignal,location:new URL('http://127.0.0.1:5500/index.html'),document:{readyState:'complete'},localStorage:{getItem:()=>null,removeItem(){}}};root.window=root;
 vm.runInNewContext(fs.readFileSync('account-client.js','utf8'),root);await root.accountReady;await assert.rejects(()=>root.OCOPAuth.login('khachhang','123456'),/npm run dev/);
});
test('registration creates an account without storing an automatic login session or requiring an address',async()=>{
 const values=new Map(),calls=[];
 const root={Headers,URL,AbortSignal,location:new URL('http://localhost:3000'),document:{readyState:'complete'},localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)},fetch:async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify(String(url).includes('verify-otp')?{user:{id:'new-customer',username:'newcustomer'},token:'a'.repeat(64)}:{}));}};
 root.window=root;vm.runInNewContext(fs.readFileSync('account-client.js','utf8'),root);await root.accountReady;
 const result=await root.OCOPAuth.register({name:'New Customer',username:'newcustomer',phone:'0901234567',password:'NewPass@2026',passwordConfirm:'NewPass@2026'},()=> '123456');
 assert.equal(result.id,'new-customer');assert.equal(root.OCOPAuth.token(),'');assert.equal(values.has('ocop_current_user'),false);assert.equal(JSON.parse(calls[0].options.body).address,undefined);
 for(const page of ['index.html','index_2.html']){const html=fs.readFileSync(page,'utf8');assert(html.includes('id="cust-forgot-password"'));assert(!html.includes('id="cust-reg-address"'));assert(!html.includes('id="tab-btn-cust-chpass"'));}
});
