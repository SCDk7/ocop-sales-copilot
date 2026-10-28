const test=require('node:test'),assert=require('node:assert/strict');
const {planWebResearch,applyWebResearch,createResearchMiddleware}=require('./ai-web-research');
const {lookupGoogle}=require('./ai-grounding');
const products=[{id:1,name:'Trà sen Nhơn Trạch',region:'Đồng Nai',price:160000,stars:5,packaging:'hộp'}];
const message=text=>[{role:'user',text}];
const evidence={attempted:true,searched:true,status:'success',text:'⭐ Chứng nhận OCOP: nguồn chính thức ghi 4 sao.\nAnh/chị muốn biết thêm thành phần không ạ?',sources:[{title:'Cổng OCOP tỉnh',url:'https://dongnai.gov.vn/ocop/tea'}],suggestions:'<div>Google Search</div>',checkedAt:'2026-10-28T12:00:00Z'};

test('every product question and existing catalogue FAQ gets a mandatory public research plan',()=>{
 for(const q of ['Trà sen Nhơn Trạch giá bao nhiêu?','Trà sen Nhơn Trạch có nguồn gốc ở đâu?','Đặc sản Hà Giang 5 sao','Gợi ý quà biếu dưới 500k']){
  const plan=planWebResearch(message(q),products);assert.equal(plan.required,true);assert(plan.queries.length>0);
 }
 const named=planWebResearch(message('Trà sen Nhơn Trạch mấy sao?'),products);assert(named.queries[0].includes(products[0].name));
});

test('public research never sends customer account, order, complaint or contact information',()=>{
 for(const q of ['Tôi cần kiểm tra đơn hàng','Tôi muốn khiếu nại','Mật khẩu của tôi là abc','Tư vấn trà, gọi 0912345678','Email a@example.com','Đơn hàng ORD-123','Trà còn hàng không?','Xin chào']){
  const plan=planWebResearch(message(q),products);assert.equal(plan.required,false,q);assert.equal(plan.queries,undefined);
 }
 const followUp=planWebResearch([{role:'user',text:'Trà sen gọi tôi qua 0912345678'},{role:'user',text:'Công dụng là gì?'}],products);
 assert(!followUp.queries.join(' ').includes('0912345678'));
});

test('photos are researched only after a product or visible type is identified',()=>{
 assert.equal(planWebResearch(message('Ảnh này là gì?'),products,null,{hasImages:true}).deferred,true);
 assert.equal(planWebResearch(message('Ảnh này là gì?'),products,{imageEvidence:{productType:'unknown'}},{hasImages:true}).required,false);
 const plan=planWebResearch(message('Ảnh này là gì?'),products,{productIds:[1]},{hasImages:true});assert.equal(plan.required,true);assert(plan.queries[0].includes(products[0].name));
});

test('web facts and actual cited URLs replace unsupported model claims while checkout prices stay in the catalogue',()=>{
 const plan=planWebResearch(message('Trà sen Nhơn Trạch mấy sao?'),products);
 const reply=applyWebResearch({message:'Definitely 5 stars, unsupported manufacturer.',productIds:[1],integrations:{gemini:true}},evidence,plan,products);
 assert(!reply.message.includes('unsupported manufacturer'));assert(reply.message.includes('4 sao'));assert(reply.message.includes('160.000 ₫/hộp'));assert(reply.message.includes(evidence.sources[0].url));
 assert.equal(reply.integrations.googleSearch,true);assert.equal(reply.webResearch.status,'success');assert.equal(reply.googleSearchSuggestions,evidence.suggestions);
 assert.deepEqual(reply.productIds,[1]);assert(reply.message.endsWith('?'));assert.equal(reply.text_response,reply.message);
});

test('a source URL without actual search execution never becomes a verified web answer',()=>{
 const plan=planWebResearch(message('Trà sen Nhơn Trạch mấy sao?'),products);
 for(const research of [{...evidence,searched:false},{status:'http_401',attempted:true,searched:false},{status:'not_configured',attempted:false,searched:false}]){
  const reply=applyWebResearch({message:'Invented confirmed facts.',productIds:[1]},research,plan,products);
  assert.equal(reply.integrations.googleSearch,false);assert.equal(reply.googleSources.length,0);assert(!reply.message.includes('Invented'));assert(reply.message.includes('chưa được cập nhật đầy đủ'));
 }
});

test('mandatory research middleware runs even for a direct FAQ response and forces a fresh search each request',async()=>{
 let calls=0,sent;
 const middleware=createResearchMiddleware({lookup:async(query,config,language,options)=>{calls++;assert.equal(options.force,true);assert(options.timeoutMs<=8000);return evidence;},getConfiguration:()=>({apiKey:'test'}),getProducts:()=>products});
 for(let i=0;i<2;i++){
  const req={method:'POST',body:{language:'vi',messages:message('Trà sen Nhơn Trạch mấy sao?')}};
  const res={statusCode:200,json:body=>{sent=body;}};
  middleware(req,res,()=>{});await res.json({message:'Old FAQ answer.',productIds:[1]});
  assert.equal(sent.integrations.googleSearch,true);assert.equal(req.ocopWebResearch,true);
 }
 assert.equal(calls,2);
});

test('errors and private requests do not invoke public search; missing credentials are disclosed',async()=>{
 let calls=0,sent;
 const make=config=>createResearchMiddleware({lookup:async()=>{calls++;return evidence;},getConfiguration:()=>config,getProducts:()=>products});
 const res={statusCode:400,json:body=>{sent=body;}},req={method:'POST',body:{messages:message('Trà sen Nhơn Trạch')}};
 make({apiKey:'test'})(req,res,()=>{});const error={error:'Bad input'};await res.json(error);assert.equal(sent,error);assert.equal(calls,0);
 const privateRes={statusCode:200,json:body=>{sent=body;}};make({apiKey:'test'})({method:'POST',body:{messages:message('Tôi muốn khiếu nại')}},privateRes,()=>{});await privateRes.json({message:'Please share the order reference.',handoffAdmin:true});assert.equal(calls,0);
 const missing={statusCode:200,json:body=>{sent=body;}};make({})(req,missing,()=>{});await missing.json({message:'FAQ',productIds:[1]});assert.equal(sent.webResearch.status,'not_configured');assert.equal(sent.webResearch.attempted,false);
});

test('a stalled web provider cannot hold the chat response beyond the research budget',async()=>{
 let sent,signal;
 const middleware=createResearchMiddleware({lookup:async(query,config,language,options)=>{signal=options.signal;return new Promise(()=>{});},getConfiguration:()=>({apiKey:'test'}),getProducts:()=>products,timeoutMs:20});
 const req={method:'POST',body:{messages:[{role:'user',text:'Trà sen giá bao nhiêu?'}],language:'vi'}};
 const res={statusCode:200,json:body=>{sent=body;}};
 middleware(req,res,()=>{});
 await res.json({message:'Theo danh mục',productIds:[1]});
 assert.equal(sent.webResearch.status,'timeout');assert.equal(sent.webResearch.searched,false);assert.equal(signal.aborted,true);
});

test('Google grounding enables its real search tool, prioritizes official sources and does not cache forced calls',async()=>{
 let calls=0;
 const fetcher=async(url,options)=>{
  calls++;const payload=JSON.parse(options.body);assert.deepEqual(payload.tools,[{google_search:{}}]);assert(payload.contents[0].parts[0].text.includes('ocopvietnam.gov.vn'));assert.equal(options.headers['x-goog-api-key'],'test');assert(!url.includes('test'));
  return new Response(JSON.stringify({candidates:[{content:{parts:[{text:evidence.text}]},groundingMetadata:{webSearchQueries:['Trà sen OCOP'],groundingChunks:[{web:{title:'Government',uri:evidence.sources[0].url}}]}}]}));
 };
 for(let i=0;i<2;i++){const result=await lookupGoogle('Trà sen test',{apiKey:'test',model:'grounding-model'},'vi',{fetcher,force:true});assert.equal(result.status,'success');}
 assert.equal(calls,2);
 const failed=await lookupGoogle('Trà sen test',{apiKey:'test',model:'grounding-model'},'vi',{force:true,fetcher:async()=>new Response('{}',{status:401})});assert.equal(failed.status,'http_401');assert.equal(failed.searched,false);assert.equal(failed.sources.length,0);
});
