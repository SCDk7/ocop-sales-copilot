const test=require('node:test');
const assert=require('node:assert/strict');
const {waitForSignal}=require('./ai-deadline');

test('deadline interrupts an unfinished lookup and handles its late rejection',async()=>{
 const controller=new AbortController();let rejectLookup;
 const lookup=new Promise((_,reject)=>{rejectLookup=reject});
 const wait=waitForSignal(lookup,controller.signal),reason=new Error('Shared five-second deadline');
 controller.abort(reason);
 await assert.rejects(wait,error=>error===reason);
 rejectLookup(new Error('Late lookup failure'));
});
test('one signal keeps the same deadline across successive AI stages',async()=>{
 const controller=new AbortController();
 assert.equal(await waitForSignal(Promise.resolve('Gemini intent'),controller.signal),'Gemini intent');
 controller.abort(new Error('Expired'));
 await assert.rejects(waitForSignal(Promise.resolve('Late answer'),controller.signal),/Expired/);
});
test('completed knowledge lookup retains its result before the deadline',async()=>{
 const controller=new AbortController(),sources=[{title:'Trà Việt Nam'}];
 assert.equal(await waitForSignal(Promise.resolve(sources),controller.signal),sources);
});
