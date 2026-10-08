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
test('OpenAI takes over after Gemini retries with the same Wikipedia, catalogue and history',async()=>{
 const calls=[];let request;
 const result=await generatePreferredContent(config,payload,{sleep:async()=>{},fetcher:async(url,options)=>{
  calls.push(url);if(url.startsWith('https://generativelanguage.googleapis.com/'))return new Response('{}',{status:503});
  assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(options.headers.Authorization,'Bearer openai-test-key');request=JSON.parse(options.body);return openAIResponse();
 }});
 assert.equal(result.provider,'openai');assert.equal(result.model,'gpt-4.1-mini');assert.equal(result.geminiAttempts,3);assert.equal(calls.length,4);
 assert.equal(request.instructions,payload.system_instruction.parts[0].text);assert.equal(request.store,false);
 assert.deepEqual(request.input.map(m=>m.role),['user','assistant','user']);assert.equal(request.input[2].content,'Hà Nội');
 assert.equal(request.text.format.type,'json_schema');assert.equal(request.text.format.strict,true);assert.equal(request.text.format.schema.additionalProperties,false);
 assert.equal(request.text.format.schema.properties.productIds.items.type,'integer');
 assert(!JSON.stringify(request).includes('openai-test-key'));assert.deepEqual(JSON.parse(result.data.candidates[0].content.parts[0].text),answer);
});
test('missing OpenAI key and dual provider failure cannot produce a successful fallback',async()=>{
 let openaiCalls=0;
 const fetcher=async url=>{if(url.startsWith('https://api.openai.com/'))openaiCalls++;return new Response('{}',{status:503})};
 const result=await generatePreferredContent({...config,openai:{}},payload,{sleep:async()=>{},fetcher});
 assert.equal(result.response.status,503);assert.equal(result.provider,'gemini');assert.equal(openaiCalls,0);
 await assert.rejects(()=>generatePreferredContent(config,payload,{sleep:async()=>{},fetcher}),/OpenAI/);
});
test('OpenAI preserves image inputs and rejects Gemini files, refusal and incomplete responses',async()=>{
 const image=openAIInput([{role:'user',parts:[{text:'Identify'},{inline_data:{mime_type:'image/png',data:'aGVsbG8='}}]}]);
 assert.equal(image[0].content[1].image_url,'data:image/png;base64,aGVsbG8=');
 assert.throws(()=>openAIInput([{role:'user',parts:[{file_data:{file_uri:'https://generativelanguage.googleapis.com/file'}}]}]),/cannot be sent/);
 await assert.rejects(()=>generateOpenAIContent(config.openai,payload,{fetcher:async()=>new Response(JSON.stringify({status:'incomplete',output:[]}))}),/incomplete/);
 await assert.rejects(()=>generateOpenAIContent(config.openai,payload,{fetcher:async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'No'}]}]}))}),/declined/);
});
