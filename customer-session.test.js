const test=require('node:test'),assert=require('node:assert/strict');
const {createSession}=require('./customer-session');
function storage(initial={}){const rows=new Map(Object.entries(initial));return {getItem:key=>rows.get(key)??null,setItem:(key,value)=>rows.set(key,String(value)),removeItem:key=>rows.delete(key)};}
const user=(store,username)=>username?store.setItem('ocop_current_user',JSON.stringify({username,role:'customer'})):store.removeItem('ocop_current_user');
const chat=text=>({history:[{role:'user',text}],html:'<p>'+text+'</p>',recommendedProductIds:[1]});

test('guest reload clears the working cart and legacy chat without saving a conversation',()=>{
 const local=storage({ocop_cart:'[{"id":1,"quantity":2}]'}),temporary=storage({ocop_chat_history_v1:JSON.stringify(chat('Guest'))});
 let session=createSession(local,temporary);
 assert.equal(local.getItem('ocop_cart'),null);assert.equal(temporary.getItem('ocop_chat_history_v1'),null);
 session.saveCart([{id:2,quantity:3}]);assert.equal(session.saveChat(chat('Guest')),false);
 session=createSession(local,temporary);
 assert.equal(local.getItem('ocop_cart'),null);assert.equal(session.loadChat(),null);
});

test('signed-in cart and chat survive reloads and a new browser session',()=>{
 const local=storage();user(local,'CustomerA');
 let session=createSession(local,storage());
 session.saveCart([{id:1,quantity:3}]);session.saveChat(chat('Saved conversation'));
 session=createSession(local,storage());
 assert.equal(session.scope,'customer:customera');
 assert.deepEqual(JSON.parse(local.getItem('ocop_cart')),[{id:1,quantity:3}]);
 assert.deepEqual(session.loadChat(),chat('Saved conversation'));
 session.clearChat();assert.equal(createSession(local,storage()).loadChat(),null);
});

test('logout and account switching isolate each customers history and basket',()=>{
 const local=storage();user(local,'A');const changes=[];
 const session=createSession(local,storage(),{onChange:detail=>changes.push(detail)});
 session.saveCart([{id:1,quantity:2}]);session.saveChat(chat('Account A'));
 user(local,'B');session.syncIdentity();
 assert.deepEqual(JSON.parse(local.getItem('ocop_cart')),[]);assert.equal(session.loadChat(),null);
 session.saveCart([{id:2,quantity:4}]);session.saveChat(chat('Account B'));
 user(local,null);session.syncIdentity();
 assert.equal(session.loadChat(),null);assert.equal(local.getItem('ocop_cart'),null);
 user(local,'A');session.syncIdentity();
 assert.deepEqual(JSON.parse(local.getItem('ocop_cart')),[{id:1,quantity:2}]);assert.equal(session.loadChat().history[0].text,'Account A');
 assert.equal(session.version,3);assert.equal(changes.length,3);
 user(local,'B');session.syncIdentity();assert.equal(session.loadChat().history[0].text,'Account B');
});

test('login merges the current guest basket once without mixing another accounts basket',()=>{
 const local=storage();user(local,'A');let session=createSession(local,storage());
 session.saveCart([{id:1,quantity:2}]);user(local,null);session.syncIdentity();
 session.saveCart([{id:1,quantity:3},{id:2,quantity:1}]);
 user(local,'A');session.syncIdentity();session.syncIdentity();
 assert.deepEqual(JSON.parse(local.getItem('ocop_cart')),[{id:1,quantity:5},{id:2,quantity:1}]);
 user(local,'B');session.syncIdentity();assert.deepEqual(JSON.parse(local.getItem('ocop_cart')),[]);
});

test('existing signed-in data migrates once and checkout clearing does not resurrect the basket',()=>{
 const local=storage({ocop_cart:'[{"id":1,"qty":2}]'});user(local,'A');
 const temporary=storage({ocop_chat_history_v1:JSON.stringify(chat('Legacy'))});
 let session=createSession(local,temporary);
 assert.equal(session.loadChat().history[0].text,'Legacy');assert.equal(temporary.getItem('ocop_chat_history_v1'),null);
 session.clearCart();session=createSession(local,storage());
 assert.deepEqual(JSON.parse(local.getItem('ocop_cart')),[]);
 assert.equal(session.loadChat().history[0].text,'Legacy');
});

test('another tabs identity change does not import that tabs mirrored basket as guest items',()=>{
 const local=storage(),session=createSession(local,storage());session.saveCart([{id:1,quantity:1}]);
 user(local,'B');const other=createSession(local,storage());other.saveCart([{id:2,quantity:3}]);
 session.syncIdentity({external:true});
 assert.deepEqual(JSON.parse(local.getItem('ocop_cart')),[{id:2,quantity:3}]);
});

test('unavailable storage and invalid stored data keep the page usable',()=>{
 const broken={getItem(){throw Error('denied');},setItem(){throw Error('denied');},removeItem(){throw Error('denied');}};
 const session=createSession(broken,broken);
 assert.equal(session.scope,'');assert.equal(session.loadChat(),null);
 assert.doesNotThrow(()=>{session.saveCart([{id:1,quantity:1}]);session.clearCart();session.syncIdentity();});
 const local=storage({ocop_current_user:'invalid',ocop_cart:'not json'});
 assert.equal(createSession(local,storage()).scope,'');assert.equal(local.getItem('ocop_cart'),null);
});
