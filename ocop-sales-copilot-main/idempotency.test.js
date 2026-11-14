'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {Worker}=require('node:worker_threads');
const {DatabaseSync}=require('node:sqlite');
const {createTransactionalStore,UUID}=require('./transactional-store');
const {createAccountStore}=require('./account-store');
const {createSalesStore}=require('./sales-store');
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-idempotency-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return path.join(dir,'business.json');}
function counter(file,options){
 const store=createTransactionalStore(file,{balance:1000,transactions:[]},options);
 function pay(key,amount=100,user='alice'){
  return store.execute(user,key,'pay',{amount},()=>{
   const state=store.read();state.balance-=amount;state.transactions.push(crypto.randomUUID());store.save(state);
   return {status:201,body:{transaction:state.transactions.at(-1),balance:state.balance}};
  });
 }
 return {store,pay};
}
test('lost response and restart replay the exact result without a second debit',t=>{
 const file=fixture(t),key=crypto.randomUUID(),first=counter(file).pay(key);
 const restarted=counter(file),replay=restarted.pay(key);
 assert.equal(first.status,201);assert.equal(first.replayed,false);assert.equal(replay.replayed,true);
 assert.deepEqual(replay.body,first.body);assert.equal(replay.status,first.status);
 assert.deepEqual(restarted.store.read(),{balance:900,transactions:[first.body.transaction]});
 assert.throws(()=>restarted.pay(key,101),{status:409});
 assert.equal(restarted.pay(key,100,'bob').replayed,false);
 assert.equal(restarted.pay(crypto.randomUUID()).replayed,false,'new intent may purchase the same items');
});
test('a failure rolls back business data and the key, allowing a safe retry',t=>{
 const file=fixture(t),{store,pay}=counter(file),key=crypto.randomUUID();
 assert.throws(()=>store.execute('alice',key,'pay',{amount:100},()=>{store.save({balance:0,transactions:['bad']});throw Error('write failure');}),/write failure/);
 assert.equal(store.read().balance,1000);
 const db=new DatabaseSync(file+'.sqlite');assert.equal(db.prepare('SELECT count(*) AS n FROM idempotency_keys').get().n,0);db.close();
 assert.equal(pay(key).body.balance,900);
 for(const invalid of [undefined,'','7c1e9a02-5d3b-1f6e-9a1c-2b8d4e6f0a13','not-a-uuid'])assert.throws(()=>pay(invalid),{status:400});
});
test('TTL retains keys for 24 hours, cleanup expires them, and operation changes conflict',t=>{
 let now=100000;const file=fixture(t),{store,pay}=counter(file,{now:()=>now}),key=crypto.randomUUID();pay(key);
 assert.throws(()=>store.execute('alice',key,'other-operation',{amount:100},()=>({status:200,body:{}})),{status:409});
 now+=86400000-1;assert.equal(store.cleanup(),0);assert.equal(pay(key).replayed,true);
 now++;assert.equal(store.cleanup(),1);assert.equal(pay(key).replayed,false);
});
test('legacy JSON is imported once; account and draft routes share one UNIQUE user/key constraint',t=>{
 const legacy=fixture(t),db=path.join(path.dirname(legacy),'commerce.sqlite');
 fs.writeFileSync(legacy,JSON.stringify({accounts:{alice:{cart:[],orders:[],wishlist:[],language:'vi',chatHistory:[]}},sessions:{}}));
 const products=[{id:1,name:'Tea',price:100,category:'tea'}];
 const accounts=createAccountStore(legacy,products,{databaseFile:db,namespace:'accounts'});
 const sales=createSalesStore(path.join(path.dirname(legacy),'sales.json'),products,{databaseFile:db,namespace:'sales'});
 const key=crypto.randomUUID();
 const first=accounts.execute('alice',key,'create-order',{items:[{id:1,qty:1}]},()=>({status:201,body:{order:accounts.order('alice',{items:[{id:1,qty:1}]})}}));
 assert.ok(first.body.order.id);assert.equal(accounts.state('alice').orders.length,1);
 fs.writeFileSync(legacy,JSON.stringify({accounts:{},sessions:{}}));
 assert.equal(createAccountStore(legacy,products,{databaseFile:db,namespace:'accounts'}).state('alice').orders.length,1);
 assert.throws(()=>sales.execute('alice',key,'create-draft',{},()=>({status:201,body:{}})),{status:409});
});
const workerSource=`
 const {parentPort,workerData}=require('node:worker_threads');
 const store=require(workerData.module).createTransactionalStore(workerData.file,{balance:1000,transactions:[]});
 parentPort.postMessage('ready');
 parentPort.once('message',()=>{
  try{const result=store.execute('alice',workerData.key,'pay',{amount:100},()=>{
   const state=store.read();state.balance-=100;state.transactions.push('one-payment');store.save(state);
   if(workerData.crash){parentPort.postMessage('uncommitted');Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,10000);}
   else Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,40);
   return {status:201,body:{balance:state.balance}};
  });parentPort.postMessage(result);}catch(error){parentPort.postMessage({error:error.message,status:error.status});}
 });`;
function message(worker){return new Promise((resolve,reject)=>{worker.once('message',resolve);worker.once('error',reject);});}
test('independent simultaneous writers commit exactly one debit and replay seven responses',{timeout:15000},async t=>{
 const file=fixture(t),key=crypto.randomUUID();counter(file);
 const workers=[];t.after(()=>Promise.all(workers.map(w=>w.terminate())));
 for(let i=0;i<8;i++){const w=new Worker(workerSource,{eval:true,workerData:{module:path.join(__dirname,'transactional-store'),file,key}});workers.push(w);assert.equal(await message(w),'ready');}
 const results=await Promise.all(workers.map(w=>{const next=message(w);w.postMessage('go');return next;}));
 assert.ok(results.every(r=>r.status===201),JSON.stringify(results));assert.equal(results.filter(r=>!r.replayed).length,1);
 assert.ok(results.every(r=>r.body.balance===900));assert.deepEqual(counter(file).store.read(),{balance:900,transactions:['one-payment']});
});
test('a killed writer leaves no partial debit or stuck PROCESSING key',{timeout:15000},async t=>{
 const file=fixture(t),key=crypto.randomUUID(),waiting=counter(file);
 const worker=new Worker(workerSource,{eval:true,workerData:{module:path.join(__dirname,'transactional-store'),file,key,crash:true}});
 t.after(()=>worker.terminate());assert.equal(await message(worker),'ready');const changed=message(worker);worker.postMessage('go');assert.equal(await changed,'uncommitted');
 assert.throws(()=>waiting.pay(key),{status:409},'lock timeout gives an actionable conflict instead of a second write');
 await worker.terminate();
 const restarted=counter(file);assert.equal(restarted.store.read().balance,1000);assert.equal(restarted.pay(key).body.balance,900);
});
test('browser intent survives retries/reload, changes for another purchase, and stores no customer payload',async()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 function browser(){const root={crypto:crypto.webcrypto,sessionStorage:storage,TextEncoder};root.window=root;vm.runInNewContext(fs.readFileSync('checkout-intent.js','utf8'),root);return root.OCOPCheckoutIntent;}
 let client=browser();const key=client.begin('checkout');assert.match(key,UUID);
 const payload={phone:'0901234567',items:[{id:1,quantity:1}]};assert.equal(await client.bind('checkout',payload),key);
 client=browser();assert.equal(await client.bind('checkout',payload),key);
 assert.notEqual(await client.bind('checkout',{...payload,items:[{id:1,quantity:2}]}),key);
 assert.doesNotMatch(JSON.stringify([...values]),/0901234567/);
 const changed=client.begin('checkout');assert.notEqual(client.reset('checkout'),changed);
 const completed=client.begin('checkout');client.finish('checkout');assert.notEqual(browser().begin('checkout'),completed,'a confirmed purchase must not consume a later identical purchase');
});
