const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createAccountStore}=require('./account-store');
test('account isolation, persistent sessions, authoritative orders and logout',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-accounts-'));
 try{const file=path.join(dir,'accounts.json'),products=[{id:336,name:'Trà',price:400000}];let store=createAccountStore(file,products);
 const a=store.login('user-a'),b=store.login('user-b');store.update('user-a',{cart:[{id:336,qty:2}],wishlist:[336],language:'en',chatHistory:[{role:'user',text:'Xin chào'}],orders:[{total:1}]});assert.equal(store.state('user-b').cart.length,0);assert.equal(store.state('user-a').orders.length,0);
 const order=store.order('user-a',{items:[{id:336,qty:2,price:1}],voucherCode:'OCOP-QUA30',total:1});assert.equal(order.total,770000);assert.equal(store.order('user-a',{items:[{id:336,qty:2}],voucherCode:'OCOP-QUA30'}).id,order.id);assert.throws(()=>store.confirm('user-b',order.id),e=>e.status===404);
 store=createAccountStore(file,products);assert.equal(store.session(a.token),'user-a');assert.equal(store.state('user-a').language,'en');assert.equal(store.state('user-a').chatHistory.length,1);assert.equal(store.state('user-b').orders.length,0);
 assert.equal(store.confirm('user-a',order.id).orders[0].status,'Chờ xác nhận BIDV');assert.equal(store.state('user-a').cart.length,0);store.logout(a.token);assert.equal(store.session(a.token),null);assert.equal(store.session(b.token),'user-b');assert.equal(fs.readFileSync(file,'utf8').includes(b.token),false);
 assert.throws(()=>store.order('user-b',{items:[{id:336,qty:-1}]}),e=>e.status===400);assert.throws(()=>store.order('user-b',{items:[{id:336,qty:1}],voucherCode:'fake'}),e=>e.status===400);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
