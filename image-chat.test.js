const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const shopping=require('./ai-shopping'),{waitForSignal}=require('./ai-deadline');
const {matchImageEvidence,createCatalogImageMatcher,createReferenceImageMatcher,getProductImageKnowledge}=require('./ai-image-match');
const source=fs.readFileSync('server.js','utf8');
const products=[{id:1,name:'Trà',region:'Hà Nội',price:100000},{id:2,name:'Cà phê',region:'Đắk Lắk',price:200000},{id:3,name:'Cacao',region:'Đắk Lắk',price:300000}];

test('the reported text query reaches the API fallback without an uninitialized intent error',async()=>{
 const catalogue=require('./data').PRODUCTS;
 const query='Tư vấn đặc sản OCOP tiêu biểu tỉnh Đồng Nai và chỉ đường đến showroom chính hãng';
 const context={console,Date,AbortSignal,Promise,Set,fetch,process:{env:{}},analyzeCustomerRequest:require('./ai-request-analysis').analyzeCustomerRequest,
  commerceShopping:require('./commerce-shopping').createCommerceShopping(),
  appendProductLocations:require('./product-locations').appendProductLocations,OcopStores:require('./ocop-stores'),
  AIShopping:shopping,AIIntent:{understand:async()=>{throw Error('No model configured');},merge:local=>local},
  isAIRateLimited:()=>false,validateAIRequest:body=>({...body,products:catalogue}),getRestrictedTopicReply:()=>null,
  MAX_CHAT_IMAGES_PER_MESSAGE:10,chatImages:[],aiWebsiteCatalog:{products:catalogue},
  answerTrainingQuery:()=>null,CatalogFacts:{answer:()=>null},ProductConsultant:{resolveProductConsultation:()=>null},scenarioReply:()=>null,
  extractSearchIntents:shopping.analyze,planWikipedia:()=>({query:'',topics:[],skipReason:'not_needed'}),
  getAIModelConfiguration:()=>({}),buildAISystemInstruction:()=>'',getGeneralComplaintClarification:()=>null,
  filterProductsByIntent:(items,intent)=>items.filter(p=>shopping.allowed(p,intent)),reviewStore:{list:()=>({items:[]})},
  normalizeCatalogTerm:shopping.normalize,waitForSignal,composeDataReply:require('./ai-data-reply').composeDataReply,
  generateAIResponse:async()=>({status:503,body:{}})};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('async function handleAIChatRequest('),source.indexOf("app.post('/api/ai/chat'")),context);
 let body,status=200;const res={status(code){status=code;return this},json(value){body=value;return value}};
 await context.handleAIChatRequest({ip:'test',body:{language:'vi',messages:[{role:'user',text:query}]}},res);
 assert.equal(status,200);assert(body.productIds.length>0);
 assert(body.productIds.every(id=>catalogue.find(p=>p.id===id).region==='Đồng Nai'));
 assert(body.productLocations.length>0);assert(body.message.includes('khu vực nào của Đồng Nai'));
 assert.equal(body.requestAnalysis.status,'completed');
 let analyses=0;
 const analyze=context.analyzeCustomerRequest;
 context.analyzeCustomerRequest=(...args)=>{analyses++;return analyze(...args);};
 const routes=[
  ()=>{context.commerceShopping.localReply=()=>({message:'Stock answer',productIds:[]});},
  ()=>{context.commerceShopping.localReply=()=>null;context.answerTrainingQuery=()=>({message:'FAQ answer',productIds:[]});},
  ()=>{context.answerTrainingQuery=()=>null;context.CatalogFacts.answer=()=>({message:'Catalogue answer',productIds:[]});},
  ()=>{context.CatalogFacts.answer=()=>null;context.ProductConsultant.resolveProductConsultation=()=>({message:'Consultation answer',productIds:[]});}
 ];
 for(const [index,configure]of routes.entries()){
  configure();
  await context.handleAIChatRequest({ip:'test',body:{language:'vi',messages:[{role:'user',text:query}]}},res);
  assert.equal(analyses,index+1,'request analysis runs before each shortcut reply');
  assert.equal(body.requestAnalysis.status,'completed');
 }
});
test('an attached photo bypasses text-only intent and reaches vision with its caption',async()=>{
 const image={id:'00000000-0000-0000-0000-000000000001',mimeType:'image/png',bytes:20,fileName:'test.png'};let visionCalls=0;
 const context={console,Date,AbortSignal,Promise,Set,process:{env:{}},analyzeCustomerRequest:require('./ai-request-analysis').analyzeCustomerRequest,commerceShopping:require('./commerce-shopping').createCommerceShopping(),appendProductLocations:require('./product-locations').appendProductLocations,OcopStores:{},AIShopping:shopping,AIIntent:{understand:()=>{throw Error('Text-only intent must not run')},merge:local=>local},
  isAIRateLimited:()=>false,validateAIRequest:body=>({...body,products}),getRestrictedTopicReply:()=>null,MAX_CHAT_IMAGES_PER_MESSAGE:10,chatImages:[image],saveChatImages:()=>{},aiWebsiteCatalog:{products},
  extractSearchIntents:shopping.analyze,planWikipedia:()=>({query:'',topics:[],skipReason:'private_or_image_context'}),getAIModelConfiguration:()=>({model:'test',apiKey:'test'}),
  getGeneralComplaintClarification:()=>null,filterProductsByIntent:()=>products,reviewStore:{list:()=>({items:[]})},normalizeCatalogTerm:shopping.normalize,waitForSignal,
  generateAIResponse:async(validation,options)=>{visionCalls++;assert.equal(options.attachedImages[0],image);assert.equal(validation.messages.at(-1).text,'Ảnh này là món gì?');return {status:200,body:{message:'Cà phê',productIds:[2],integrations:{gemini:true}}}}};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('async function handleAIChatRequest('),source.indexOf("app.post('/api/ai/chat'")),context);
 let body,status;const res={status(code){status=code;return this},json(value){body=value;return value}};
 await context.handleAIChatRequest({ip:'test',body:{language:'vi',messages:[{role:'user',text:'Ảnh này là món gì?'}],imageIds:[image.id]}},res);
 assert.equal(visionCalls,1);assert.equal(status,200);assert.equal(body.productIds[0],2);
 assert.equal(body.geminiUnderstanding.status,'understood');
 context.searchProductByImageKnowledge=()=>{throw Error('A caption or filename cannot substitute for image recognition');};
 context.generateAIResponse=async()=>({status:200,body:{message:'Please send a clearer label',productIds:[],imageMatchStatus:'unknown'}});
 await context.handleAIChatRequest({ip:'test',body:{language:'vi',messages:[{role:'user',text:'tea.jpg'}],imageIds:[image.id]}},res);
 assert.equal(body.imageMatchStatus,'unknown');assert.equal(body.productIds.length,0);
 context.generateAIResponse=async()=>({status:503,body:{message:'Image service unavailable',productIds:[],imageMatchStatus:'unknown'}});
 await context.handleAIChatRequest({ip:'test',body:{language:'vi',messages:[{role:'user',text:'tea.jpg'}],imageIds:[image.id]}},res);
 assert.equal(status,503);assert.equal(body.productIds.length,0);
});
function visionContext(provider){
 const context={console,Date,Buffer,AbortController,AbortSignal,setTimeout,clearTimeout,matchCatalogImages:async()=>[],matchReferenceImages:async()=>[],MAX_AI_MESSAGE_LENGTH:1200,GEMINI_INLINE_IMAGE_LIMIT_BYTES:70000000,
  getAIModelConfiguration:()=>({apiKey:'test',model:'test'}),buildAIServiceUnavailable:()=>({status:503,body:{message:'Unavailable',productIds:[],suggested_products:[],retryable:true,integrations:{gemini:false}}}),
  buildAISystemInstruction:()=> 'Inspect the supplied image',generatePreferredContent:provider,isImageProductLookupRequest:()=>true,normalizeCatalogTerm:shopping.normalize,matchImageEvidence};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('async function generateAIResponse('),source.indexOf("app.post('/api/ai/transcribe'")),context);return context;
}
test('vision sends image bytes and caption together, uses one request, and validates matching catalogue IDs',async()=>{
 let calls=0;
 const context=visionContext(async(_config,payload,options)=>{
  calls++;assert.equal(options.maxAttempts,1);assert.equal(payload.contents.at(-1).parts[0].text,'Tìm món trong ảnh');assert.equal(payload.contents.at(-1).parts[1].inline_data.data,'test-image');
  return {response:{ok:true},data:{candidates:[{content:{parts:[{text:JSON.stringify({message:'Cà phê',understandingStatus:'understood',productIds:[2,999],imageMatchStatus:'exact',handoffAdmin:false,dynamic_chips:[]})}]}}]},provider:'gemini',model:'test'};
 });
 const result=await context.generateAIResponse({language:'vi',products,messages:[{role:'user',text:'Tìm món trong ảnh'}]},{imageData:{mimeType:'image/png',data:'test-image'}});
 assert.equal(calls,1);assert.equal(result.status,200);assert.deepEqual(Array.from(result.body.productIds),[2]);
});

test('the actual tea photo matches its catalogue entry without a Gemini request, even without API configuration',async()=>{
 const product=require('./data').PRODUCTS.find(product=>product.id===336);
 const context=visionContext(()=>{throw Error('An identical catalogue image must not need vision')});
 context.getAIModelConfiguration=()=>{throw Error('No API key')};
 context.matchCatalogImages=createCatalogImageMatcher(__dirname);
 const result=await context.generateAIResponse({language:'vi',products:[product],messages:[{role:'user',text:'Ảnh này là món gì?'}]},{imageData:{mimeType:'image/jpeg',data:fs.readFileSync(product.img).toString('base64')}});
 assert.equal(result.status,200);assert.equal(result.body.imageMatchStatus,'exact');
 assert.deepEqual(Array.from(result.body.productIds),[336]);assert.match(result.body.message,/Trà Phúc/);
 assert.equal(result.body.integrations.gemini,false);
});

test('catalogue image identity detects shared photos and lets unknown or mixed photos continue to vision',async()=>{
 const match=createCatalogImageMatcher(__dirname);
 const product=require('./data').PRODUCTS.find(product=>product.id===336);
 const bytes=fs.readFileSync(product.img);
 assert.deepEqual(await match([product,{...product,id:999}],[bytes]),[[336,999]]);
 assert.deepEqual(await match([product],[bytes,Buffer.from('unrelated picture')]),[[336],[]]);
});

test('a downloaded reference photo returns a similar product without claiming exact brand or calling an AI service',async()=>{
 const catalogue=require('./data').PRODUCTS;
 let chosen;
 for(const row of getProductImageKnowledge()){
  const product=catalogue.find(product=>product.id===row.id);
  const cardHash=require('node:crypto').createHash('sha256').update(fs.readFileSync(product.img)).digest('hex');
  const image=row.googleImages.find(image=>image.downloadStatus==='ready'&&image.sha256!==cardHash&&['image/jpeg','image/png','image/webp'].includes(image.mimeType));
  if(image){chosen={product,image};break;}
 }
 assert.ok(chosen);
 const context=visionContext(()=>{throw Error('A cached reference must not call an external AI service');});
 context.matchCatalogImages=createCatalogImageMatcher(__dirname);
 context.matchReferenceImages=createReferenceImageMatcher(__dirname);
 context.getAIModelConfiguration=()=>{throw Error('No API key');};
 const bytes=fs.readFileSync(chosen.image.localPath);
 const result=await context.generateAIResponse({language:'vi',products:[chosen.product],messages:[{role:'user',text:'Ảnh này là món gì?'}]},{imageData:{mimeType:chosen.image.mimeType,data:bytes.toString('base64')}});
 assert.equal(result.status,200);assert.equal(result.body.responseMode,'reference_image_match');
 assert.equal(result.body.imageMatchStatus,'similar');assert.equal(result.body.integrations.gemini,false);
 assert.deepEqual(Array.from(result.body.productIds),[chosen.product.id]);
 assert.match(result.body.message,/chưa xác nhận đúng thương hiệu/);
});
test('vision provider failure keeps retry available and asks for label text without inventing recognition',async()=>{
 const context=visionContext(async()=>({response:{ok:false,status:503},data:{error:{message:'Unavailable'}}}));
 const result=await context.generateAIResponse({language:'vi',products,messages:[{role:'user',text:'Tìm món trong ảnh'}]},{imageData:{mimeType:'image/png',data:'test-image'}});
 assert.equal(result.status,503);assert.equal(result.body.error,'IMAGE_ANALYSIS_UNAVAILABLE');assert.equal(result.body.imageMatchStatus,'unknown');assert(result.body.retryable);assert.equal(result.body.productIds.length,0);assert.match(result.body.message,/tên sản phẩm.*trên nhãn/);
});

test('readable coffee evidence recovers a related catalogue match even when vision reports unknown',async()=>{
 const context=visionContext(async()=>({response:{ok:true},data:{candidates:[{content:{parts:[{text:JSON.stringify({message:'Unknown',understandingStatus:'understood',productIds:[],imageMatchStatus:'unknown',visibleLabel:'Cà phê Đắk Lắk',recognizedProductType:'Coffee',handoffAdmin:false,dynamic_chips:[]})}]}}]},provider:'gemini',model:'test'}));
 const result=await context.generateAIResponse({language:'vi',products,messages:[{role:'user',text:'Ảnh này là món gì?'}]},{imageData:{mimeType:'image/png',data:'test-image'}});
 assert.equal(result.body.imageMatchStatus,'similar');
 assert.deepEqual(Array.from(result.body.productIds),[2]);
 assert.equal(result.body.imageEvidence.productType,'Coffee');
});

test('image matching respects visible region and never guesses from a caption or unknown type',()=>{
 const catalog=require('./data').PRODUCTS;
 assert.deepEqual(matchImageEvidence(catalog,{label:'Cà phê Hà Chung Mường Ảng - Điện Biên',productType:'Cà phê'}),[353]);
 assert.deepEqual(matchImageEvidence(catalog,{label:'Cà phê Điện Biên',productType:'unknown'}),[]);
 assert.deepEqual(matchImageEvidence(products,{label:'Cà phê Hà Nội',productType:'Cà phê'}),[]);
 assert.deepEqual(matchImageEvidence(products,{label:'',productType:'Đồ chơi'}),[]);
 const mienMatches=matchImageEvidence(catalog,{label:'Miến dong Trà Lĩnh',productType:'Miến dong'});
 assert.equal(mienMatches.includes(425),true);
});
