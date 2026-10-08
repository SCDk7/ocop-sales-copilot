const test=require('node:test'),assert=require('node:assert/strict');
const {generateContent}=require('./gemini-client');
const config={apiKey:'test-key',model:'gemini-3.1-flash-lite',fallbackModels:['gemini-2.5-flash']};
test('Gemini retries overload using only the configured model, ignoring alternatives',async()=>{
 const calls=[],delays=[];
 const result=await generateContent(config,{contents:[{parts:[{text:'Question'}]}],generationConfig:{maxOutputTokens:100}}, {
  sleep:async ms=>delays.push(ms),fetcher:async(url,options)=>{
   calls.push({url,headers:options.headers,body:JSON.parse(options.body)});
   return new Response(JSON.stringify(calls.length<3?{error:{message:'overload'}}:{candidates:[{content:{parts:[{text:'Answer'}]}}]}),{status:calls.length<3?503:200});
  }
 });
 assert.equal(result.response.status,200);assert.equal(result.attempts,3);assert.equal(result.model,config.model);
 assert(calls.every(c=>c.url.endsWith('/'+config.model+':generateContent')));
 assert(calls.every(c=>c.url.startsWith('https://generativelanguage.googleapis.com/')&&!c.url.includes('test-key')));
 assert.equal(calls[0].body.contents[0].parts[0].text,'Question');
 assert.equal(calls[2].body.generationConfig.thinkingConfig,undefined);assert.deepEqual(delays,[500,1000]);
});
test('Gemini auth failures stop immediately and all-overload stays a failure',async()=>{
 let calls=0;
 const auth=await generateContent(config,{}, {sleep:async()=>{},fetcher:async()=>{calls++;return new Response('{}',{status:403})}});
 assert.equal(auth.response.status,403);assert.equal(calls,1);
 calls=0;
 const overloaded=await generateContent(config,{}, {sleep:async()=>{},fetcher:async()=>{calls++;return new Response('{}',{status:503})}});
 assert.equal(overloaded.response.status,503);assert.equal(calls,3);
});
test('Gemini retries a network failure and honours cancellation and Retry-After',async()=>{
 let calls=0;const delays=[];
 const result=await generateContent(config,{}, {sleep:async ms=>delays.push(ms),fetcher:async()=>{
  calls++;if(calls===1)throw new TypeError('network');if(calls===2)return new Response('{}',{status:429,headers:{'Retry-After':'2'}});return new Response('{}',{status:200});
 }});
 assert.equal(result.response.status,200);assert.deepEqual(delays,[500,2000]);
 const controller=new AbortController();controller.abort();
 await assert.rejects(()=>generateContent(config,{}, {signal:controller.signal,fetcher:async()=>{throw Error('must not call')}}));
});
test('Wikipedia plans public price requests and excludes private account details',()=>{
 const {planWikipedia}=require('./ai-wikipedia'),shopping=require('./ai-shopping'),{PRODUCTS}=require('./data');
 const text='mình muốn tìm kiếm một số món có giá trị cao';
 const plan=planWikipedia(shopping.resolve([{role:'user',text}],PRODUCTS),null,text,PRODUCTS);
 assert(plan.query.includes('sâm'));assert.equal(plan.skipReason,null);
 const generic=planWikipedia({},null,'combo6tr',PRODUCTS);assert.match(generic.query,/Mỗi xã/);
 const privatePlan=planWikipedia({},null,'kiểm tra mã đơn hàng ABC123 cho tôi',PRODUCTS);
 assert.equal(privatePlan.query,'');assert(privatePlan.skipReason);
 assert.equal(planWikipedia({},null,'OTP 123456',PRODUCTS).query,'');
});
