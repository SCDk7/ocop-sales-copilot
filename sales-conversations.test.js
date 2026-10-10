const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createConversations}=require('./sales-conversations');
function fixture(t,options){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-conversations-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));const file=path.join(dir,'logs.json');return {file,store:createConversations(file,options)};}
const event=(body={})=>({sessionId:'conversation-123456789',status:200,messages:[{role:'user',text:'I need staff'}],body:{message:'Please contact the seller',...body}});
test('support logs persist, resolve and reopen on a new support request',t=>{
 const {store,file}=fixture(t);store.record(event({handoffAdmin:true}));let rows=store.list();assert.equal(rows.length,1);assert.equal(rows[0].messages.length,2);assert(!rows[0].id.includes('conversation'));
 store.resolve(rows[0].id);assert.equal(store.list()[0].supportStatus,'resolved');store.record(event());assert.equal(store.list()[0].supportStatus,'resolved');store.record(event({handoffAdmin:true}));assert.equal(store.list()[0].supportStatus,'pending');
 assert.equal(createConversations(file).list()[0].messages.length,6);assert.throws(()=>store.resolve('bad'),{status:404});
});
test('malformed and failed chats are not archived; records and messages stay bounded',t=>{
 const {store}=fixture(t,{maxSessions:2});store.record({...event(),status:400});store.record({...event(),messages:[]});assert.equal(store.list().length,0);
 for(let i=0;i<40;i++)store.record(event());assert.equal(store.list()[0].messages.length,60);
 store.record({...event(),sessionId:'conversation-other-12345'});store.record({...event(),sessionId:'conversation-third-12345'});assert.equal(store.list().length,2);
});
test('expired conversation history is hidden and pruned on writes',t=>{
 let now=Date.now();const {store}=fixture(t,{now:()=>now});store.record(event());now+=91*86400000;assert.equal(store.list().length,0);store.record(event());assert.equal(store.list()[0].messages.length,2);
});
