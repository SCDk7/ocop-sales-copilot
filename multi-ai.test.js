'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {getAIConfiguration}=require('./ai-configuration');
const {generatePreferredContent}=require('./ai-provider');
const {generateClaudeContent,claudeMessages}=require('./claude-client');
const {catalogReply}=require('./chat-fallback');
const {locationForProduct}=require('./product-locations');
const {PRODUCTS}=require('./data');
const payload={contents:[{role:'user',parts:[{text:'Tìm đặc sản Đồng Nai'}]}],generationConfig:{responseSchema:{type:'OBJECT',properties:{message:{type:'STRING'},productIds:{type:'ARRAY',items:{type:'INTEGER'}}},required:['message','productIds']}}};
const configuration={apiKey:'gemini-test',model:'gemini-test-model',openai:{apiKey:'openai-test',model:'gpt-4.1-mini'},claude:{apiKey:'claude-test',model:'claude-sonnet-4-6'}};
function response(provider,answer){const text=JSON.stringify(answer);return new Response(JSON.stringify(provider==='gemini'?{candidates:[{content:{parts:[{text}]}}]}:provider==='openai'?{status:'completed',output:[{type:'message',content:[{type:'output_text',text}]}]}:{stop_reason:'end_turn',content:[{type:'text',text}]}));}
test('fast chat returns the first valid structured answer and cancels slower providers',async()=>{
 const slowSignals=[];
 const fetcher=async(url,options)=>{
  if(String(url).includes('openai.com'))return response('openai',{message:'Dạ, trả lời nhanh.',productIds:[1]});
  slowSignals.push(options.signal);return new Promise((resolve,reject)=>{const abort=()=>reject(options.signal.reason);if(options.signal.aborted)abort();else options.signal.addEventListener('abort',abort,{once:true});});
 };
 const result=await generatePreferredContent(configuration,payload,{fetcher,fastest:true,timeoutMs:1000});
 assert.equal(result.provider,'openai');assert.equal(result.strategy,'fastest_valid');assert.deepEqual(result.providersUsed,['openai']);assert(slowSignals.length>0);assert(slowSignals.every(signal=>signal.aborted));
});
test('configuration has no embedded fallback credentials and supports OpenAI or Claude alone',()=>{
 assert.throws(()=>getAIConfiguration({}),/not configured/);
 assert.throws(()=>getAIConfiguration({GEMINI_API_KEY:'replace_with_your_key'}),/not configured/);
 assert.equal(getAIConfiguration({OPENAI_API_KEY:'test'}).apiKey,'');
 assert.equal(getAIConfiguration({CLAUDE_API_KEY:'test'}).claude.apiKey,'test');
});
test('three providers vote on the product scope; dissent does not override agreement',async()=>{
 const result=await generatePreferredContent(configuration,payload,{fetcher:async url=>{
  const provider=url.includes('googleapis')?'gemini':url.includes('openai')?'openai':'claude';
  return response(provider,{message:provider,productIds:provider==='gemini'?[340]:[524,525]});
 }});
 assert.equal(result.provider,'openai');
 assert.deepEqual(result.providersUsed,['gemini','openai','claude']);
 assert.equal(result.strategy,'ensemble');
});
test('fallback stops after the first valid configured provider',async()=>{
 const called=[];
 const result=await generatePreferredContent({...configuration,mode:'fallback'},payload,{fetcher:async url=>{called.push(url);return response('gemini',{message:'ok',productIds:[524]});}});
 assert.equal(called.length,1);assert.deepEqual(result.providersUsed,['gemini']);
});
test('Claude uses structured messages and rejects truncated output and hosted Gemini files',async()=>{
 let body;
 const result=await generateClaudeContent(configuration.claude,payload,{fetcher:async(url,options)=>{body=JSON.parse(options.body);return response('claude',{message:'ok',productIds:[524]});}});
 assert.equal(result.provider,'claude');assert.equal(body.output_config.format.type,'json_schema');
 assert.equal(body.messages[0].role,'user');
 assert.throws(()=>claudeMessages([{role:'user',parts:[{file_data:{file_uri:'private'}}]}]),/cannot be sent/);
 await assert.rejects(()=>generateClaudeContent(configuration.claude,payload,{fetcher:async()=>new Response(JSON.stringify({stop_reason:'max_tokens',content:[{type:'text',text:'{}'}]}))}),/incomplete/);
});
test('shared deadline bounds stalled services and never claims they answered',async()=>{
 const result=await generatePreferredContent(configuration,payload,{timeoutMs:20,fetcher:()=>new Promise(()=>{})});
 assert.equal(result.provider,'unavailable');assert.deepEqual(result.providersUsed,[]);
});
test('the reported Dong Nai query stays in Dong Nai and has useful map links',()=>{
 const reply=catalogReply('Tư vấn đặc sản OCOP tiêu biểu tỉnh Đồng Nai và chỉ đường đến showroom chính hãng',PRODUCTS);
 assert(reply.productIds.length>0);
 assert(reply.productIds.every(id=>PRODUCTS.find(p=>p.id===id).region==='Đồng Nai'));
 assert(!reply.message.includes('Suối Giàng'));
 assert(!/COGS|CHM|dòng tiền|Smart Contract/.test(reply.message));
 assert(reply.productLocations.every(location=>location.mapUrl.startsWith('https://www.google.com/maps/search/')));
 assert(reply.message.includes('giá tham khảo'));
 assert(reply.message.includes('chưa xác nhận điểm bán chính hãng'));
 assert(reply.message.includes('khu vực nào của Đồng Nai'));
 assert(reply.message.indexOf('chưa xác nhận điểm bán chính hãng')<reply.message.indexOf('https://www.google.com/maps/search/'));
});

test('regional advice is consistent for backend fallback and map enrichment is not duplicated',()=>{
 const {composeDataReply}=require('./ai-data-reply');
 const {appendProductLocations}=require('./product-locations');
 const shopping=require('./ai-shopping');
 const query='Tư vấn đặc sản OCOP tiêu biểu tỉnh Đồng Nai và chỉ đường đến showroom chính hãng';
 const intent=shopping.resolve([{role:'user',text:query}],PRODUCTS);
 intent.knowledgeQuery=query;
 const products=PRODUCTS.filter(product=>product.region==='Đồng Nai');
 const reply=composeDataReply(products,intent,'vi');
 assert(reply.message.includes('giá tham khảo'));
 const enriched=appendProductLocations(reply,products,intent,{},'vi');
 assert(enriched.message.includes('khu vực nào của Đồng Nai'));
 assert.equal(appendProductLocations(enriched,products,intent,{},'vi'),enriched);
});
test('a reused catalogue ID cannot inherit another products showroom address',()=>{
 const product={id:1,name:'Cacao Đồng Nai',region:'Đồng Nai'};
 const location=locationForProduct(product,{REFERENCE_STORE_MAP:{1:{productName:'Trà Hà Giang',region:'Hà Giang',primaryStore:{name:'Sai điểm bán',address:'Hà Giang'}}}});
 assert.equal(location.type,'map_search');assert.equal(location.address,'');assert(!location.mapUrl.includes('Sai'));
});
test('store lookup query returns showroom directory and never misclassifies tra cuu as tea',()=>{
 const reply=catalogReply('Tra cứu mạng lưới showroom và điểm bán O2O chính hãng trên bản đồ số',PRODUCTS);
 assert(reply.message.includes('Mạng lưới Showroom & Điểm bán O2O'));
 assert(reply.message.includes('Hoàng Quốc Việt'));
 assert(!reply.message.includes('Trà Phúc'));
});

test('store lookup query with prior product chat history returns showroom directory without leaking previous products',()=>{
 const history = [
   { role: 'user', text: 'Tìm bánh chưng Tranh Khúc' },
   { role: 'assistant', text: 'Dạ anh/chị' }
 ];
 const reply = catalogReply('Tra cứu mạng lưới showroom và điểm bán O2O chính hãng trên bản đồ số', PRODUCTS, 'vi', history);
 assert(reply.message.includes('Mạng lưới Showroom & Điểm bán O2O'));
 assert(reply.message.includes('Hoàng Quốc Việt'));
 assert(!reply.message.includes('Bánh chưng'));
 assert.equal(reply.productIds.length, 0);
});
