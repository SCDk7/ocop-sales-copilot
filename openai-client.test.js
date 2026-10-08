const test=require('node:test'),assert=require('node:assert/strict');
const {generatePreferredContent}=require('./ai-provider');
const {generateOpenAIContent,openAIInput}=require('./openai-client');
const config={apiKey:'gemini-test-key',model:'gemini-3.1-flash-lite',openai:{apiKey:'openai-test-key',model:'gpt-4.1-mini'}};
const answer={message:'According to supplied Wikipedia: tea.',productIds:[336]};
const payload={system_instruction:{parts:[{text:'Wikipedia: Trà Việt Nam. Catalogue price: 2000000 VND.'}]},contents:[{role:'user',parts:[{text:'Find tea'}]},{role:'model',parts:[{text:'Which province?'}]},{role:'user',parts:[{text:'Hà Nội'}]}],generationConfig:{maxOutputTokens:1100,responseSchema:{type:'OBJECT',properties:{message:{type:'STRING'},productIds:{type:'ARRAY',items:{type:'INTEGER'}}},required:['message','productIds']}}};
const openAIResponse=()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(answer)}]}]}),{status:200});
test('Gemini success never calls OpenAI',async()=>{
 const calls=[];const result=await generatePreferredContent(config,payload,{sleep:async()=>{},fetcher:async url=>{
  calls.push(url);return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(answer)}]}}]}));
 }});
 assert.equal(result.provider,'gemini');assert.equal(calls.length,1);assert(calls[0].startsWith('https://generativelanguage.googleapis.com/'));
});
test('Gemini failure never calls OpenAI even when a legacy key exists',async()=>{
 const calls=[];
 const result=await generatePreferredContent(config,payload,{sleep:async()=>{},fetcher:async url=>{
  calls.push(url);return new Response('{}',{status:503});
 }});
 assert.equal(result.provider,'gemini');assert.equal(result.response.status,503);assert.equal(calls.length,3);
 assert(calls.every(url=>url.startsWith('https://generativelanguage.googleapis.com/')));
});
test('missing Gemini key cannot use OpenAI, and Gemini overload stays a failure',async()=>{
 let openaiCalls=0;
 const fetcher=async url=>{if(url.startsWith('https://api.openai.com/'))openaiCalls++;return new Response('{}',{status:503})};
 const result=await generatePreferredContent({...config,openai:{}},payload,{sleep:async()=>{},fetcher});
 assert.equal(result.response.status,503);assert.equal(result.provider,'gemini');assert.equal(openaiCalls,0);
 await assert.rejects(()=>generatePreferredContent({...config,apiKey:''},payload,{sleep:async()=>{},fetcher}),/Gemini configuration/);
 assert.equal(openaiCalls,0);
});
test('OpenAI preserves image inputs and rejects Gemini files, refusal and incomplete responses',async()=>{
 const image=openAIInput([{role:'user',parts:[{text:'Identify'},{inline_data:{mime_type:'image/png',data:'aGVsbG8='}}]}]);
 assert.equal(image[0].content[1].image_url,'data:image/png;base64,aGVsbG8=');
 assert.throws(()=>openAIInput([{role:'user',parts:[{file_data:{file_uri:'https://generativelanguage.googleapis.com/file'}}]}]),/cannot be sent/);
 await assert.rejects(()=>generateOpenAIContent(config.openai,payload,{fetcher:async()=>new Response(JSON.stringify({status:'incomplete',output:[]}))}),/incomplete/);
 await assert.rejects(()=>generateOpenAIContent(config.openai,payload,{fetcher:async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'No'}]}]}))}),/declined/);
});
