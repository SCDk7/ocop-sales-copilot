const test=require('node:test');
const assert=require('node:assert/strict');
const {waitForSignal}=require('./ai-deadline');
const {EventEmitter}=require('node:events');
const {createChatDeadline}=require('./ai-deadline');

test('whole-request deadline aborts upstream work, returns a retryable response and ignores late replies',async()=>{
 const res=new EventEmitter();let sends=0,body;res.status=code=>{res.statusCode=code;return res;};res.json=value=>{sends++;body=value;res.writableEnded=true;res.emit('finish');};
 const req={method:'POST',body:{language:'vi'}};createChatDeadline({timeoutMs:20})(req,res,()=>{});
 await new Promise(resolve=>setTimeout(resolve,40));assert.equal(res.statusCode,504);assert.equal(body.code,'CHAT_TIMEOUT');assert.match(body.message,/^Dạ/);assert.equal(req.aiSignal.aborted,true);
 res.json({message:'late'});assert.equal(sends,1);
});
test('completed or disconnected chats cancel the timer and abort remaining provider work',async()=>{
 for(const event of ['finish','close']){
  const res=new EventEmitter();let sends=0;res.json=()=>{sends++;res.writableEnded=true;res.emit('finish');return res;};
  const req={method:'POST'};createChatDeadline({timeoutMs:20})(req,res,()=>{});
  if(event==='finish')res.json({message:'early'});else res.emit('close');
  await new Promise(resolve=>setTimeout(resolve,35));assert.equal(sends,event==='finish'?1:0);assert.equal(req.aiSignal.aborted,true);
 }
});

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
