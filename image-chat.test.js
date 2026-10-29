const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const shopping=require('./ai-shopping'),{waitForSignal}=require('./ai-deadline');
const {matchImageEvidence,createCatalogImageMatcher,createReferenceImageMatcher,getProductImageKnowledge}=require('./ai-image-match');
const {formatVisualReply}=require('./ai-visual-reply');
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
  normalizeCatalogTerm:shopping.normalize,waitForSignal,composeDataReply:require('./ai-data-reply').composeDataReply,fastBudgetReply:require('./ai-data-reply').fastBudgetReply,
  generateAIResponse:async()=>({status:503,body:{}})};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('async function handleAIChatRequest('),source.indexOf("app.post('/api/ai/chat'")),context);
 let body,status=200;const res={status(code){status=code;return this},json(value){body=value;return value}};
 await context.handleAIChatRequest({ip:'test',authUser:{id:'user-a'},body:{language:'vi',messages:[{role:'user',text:query}]}},res);
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
  await context.handleAIChatRequest({ip:'test',authUser:{id:'user-a'},body:{language:'vi',messages:[{role:'user',text:query}]}},res);
  assert.equal(analyses,index+1,'request analysis runs before each shortcut reply');
  assert.equal(body.requestAnalysis.status,'completed');
 }
});
test('an attached photo bypasses text-only intent and reaches vision with its caption',async()=>{
 const image={ownerId:'user-a',id:'00000000-0000-0000-0000-000000000001',mimeType:'image/png',bytes:20,fileName:'test.png'};let visionCalls=0;
 const context={console,Date,AbortSignal,Promise,Set,process:{env:{}},analyzeCustomerRequest:require('./ai-request-analysis').analyzeCustomerRequest,commerceShopping:require('./commerce-shopping').createCommerceShopping(),appendProductLocations:require('./product-locations').appendProductLocations,OcopStores:{},AIShopping:shopping,AIIntent:{understand:()=>{throw Error('Text-only intent must not run')},merge:local=>local},
  isAIRateLimited:()=>false,validateAIRequest:body=>({...body,products}),getRestrictedTopicReply:()=>null,MAX_CHAT_IMAGES_PER_MESSAGE:10,chatImages:[image],saveChatImages:()=>{},aiWebsiteCatalog:{products},
  extractSearchIntents:shopping.analyze,planWikipedia:()=>({query:'',topics:[],skipReason:'private_or_image_context'}),getAIModelConfiguration:()=>({model:'test',apiKey:'test'}),
  getGeneralComplaintClarification:()=>null,filterProductsByIntent:()=>products,reviewStore:{list:()=>({items:[]})},normalizeCatalogTerm:shopping.normalize,waitForSignal,
  generateAIResponse:async(validation,options)=>{visionCalls++;assert.equal(options.attachedImages[0],image);assert.equal(validation.messages.at(-1).text,'Ảnh này là món gì?');return {status:200,body:{message:'Cà phê',productIds:[2],integrations:{gemini:true}}}}};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('async function handleAIChatRequest('),source.indexOf("app.post('/api/ai/chat'")),context);
 let body,status;const res={status(code){status=code;return this},json(value){body=value;return value}};
 await context.handleAIChatRequest({ip:'test',authUser:{id:'user-a'},body:{language:'vi',messages:[{role:'user',text:'Ảnh này là món gì?'}],imageIds:[image.id]}},res);
 assert.equal(visionCalls,1);assert.equal(status,200);assert.equal(body.productIds[0],2);
 assert.equal(body.geminiUnderstanding.status,'understood');
 context.searchProductByImageKnowledge=()=>{throw Error('A caption or filename cannot substitute for image recognition');};
 context.generateAIResponse=async()=>({status:200,body:{message:'Please send a clearer label',productIds:[],imageMatchStatus:'unknown'}});
 await context.handleAIChatRequest({ip:'test',authUser:{id:'user-a'},body:{language:'vi',messages:[{role:'user',text:'tea.jpg'}],imageIds:[image.id]}},res);
 assert.equal(body.imageMatchStatus,'unknown');assert.equal(body.productIds.length,0);
 context.generateAIResponse=async()=>({status:503,body:{message:'Image service unavailable',productIds:[],imageMatchStatus:'unknown'}});
 await context.handleAIChatRequest({ip:'test',authUser:{id:'user-a'},body:{language:'vi',messages:[{role:'user',text:'tea.jpg'}],imageIds:[image.id]}},res);
 assert.equal(status,503);assert.equal(body.productIds.length,0);
});
test('resized JPEG catalogue photos match by pixels and plain colour images do not identify products',async()=>{
 const sharp=require('sharp'),path=require('node:path');
 const {createVisualFingerprintMatcher}=require('./ai-visual-fingerprint');
 const catalogue=require('./data').PRODUCTS.filter(p=>[336,337,338].includes(p.id));
 const product=catalogue.find(p=>p.id===336);
 const bytes=await sharp(path.join(__dirname,product.img)).resize({width:240}).jpeg({quality:75}).toBuffer();
 const matcher=createVisualFingerprintMatcher(__dirname);
 const results=await matcher(catalogue,[bytes]);
 assert.ok(results[0].includes(product.id));
 const plain=await sharp({create:{width:100,height:100,channels:3,background:'#22aa55'}}).png().toBuffer();
 assert.deepEqual(await matcher(catalogue,[plain]),[[]]);
});

test('ordinary Vietnamese words do not accidentally classify a product photo as damaged goods',()=>{
 const context={};vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function isImageProductLookupRequest('),source.indexOf('function buildAISystemInstruction(')),context);
 assert.equal(context.isImageProductLookupRequest('Kiếm combo với món trong ảnh, không quá 1 triệu'),true);
 assert.equal(context.isImageProductLookupRequest('Ảnh bếp có món này'),true);
 assert.equal(context.isImageProductLookupRequest('Hàng bị hỏng, tôi muốn đổi trả'),false);
});

function visionContext(provider){
 const context={console,Date,Buffer,AbortController,AbortSignal,setTimeout,clearTimeout,matchCatalogImages:async()=>[],matchVisualFingerprints:async()=>[],imageBudgetReply:require('./ai-data-reply').imageBudgetReply,matchReferenceImages:async()=>[],MAX_AI_MESSAGE_LENGTH:1200,GEMINI_INLINE_IMAGE_LIMIT_BYTES:70000000,
  getAIModelConfiguration:()=>({apiKey:'test',model:'test'}),buildAIServiceUnavailable:()=>({status:503,body:{message:'Unavailable',productIds:[],suggested_products:[],retryable:true,integrations:{gemini:false}}}),
  buildAISystemInstruction:()=> 'Inspect the supplied image',generatePreferredContent:provider,isImageProductLookupRequest:()=>true,normalizeCatalogTerm:shopping.normalize,matchImageEvidence,formatVisualReply};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('async function generateAIResponse('),source.indexOf("app.post('/api/ai/transcribe'")),context);return context;
}
test('vision sends image bytes and caption together, uses one request, and validates matching catalogue IDs',async()=>{
 let calls=0;
 const context=visionContext(async(_config,payload,options)=>{
  calls++;assert.equal(options.maxAttempts,1);assert.equal(payload.contents.at(-1).parts[0].text,'Tìm món trong ảnh');assert.equal(payload.contents.at(-1).parts[1].inline_data.data,'test-image');
  return {response:{ok:true},data:{candidates:[{content:{parts:[{text:JSON.stringify({message:'Cà phê',understandingStatus:'understood',productIds:[2,999],imageMatchStatus:'exact',visibleLabel:'Cà phê Đắk Lắk',recognizedProductType:'Cà phê',observedFeatures:['Túi màu nâu'],handoffAdmin:false,dynamic_chips:[]})}]}}]},provider:'gemini',model:'test'};
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
 assert.match(result.body.message,/tương tự, chưa có điểm khớp %/);
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

test('similar photo replies highlight the best product with its actual price and honest match level',async()=>{
 const catalogue=[
  {id:10,name:'Trà sen Nhơn Trạch',region:'Đồng Nai',stars:4,price:160000,packaging:'hộp'},
  {id:11,name:'Trà sen Tây Hồ',region:'Hà Nội',stars:5,price:250000,packaging:'hộp'},
  {id:12,name:'Trà sen Huế',region:'Thừa Thiên Huế',stars:3,price:90000,packaging:'túi'},
  {id:13,name:'Mật ong rừng',region:'Đồng Nai',stars:4,price:130000,packaging:'chai'}
 ];
 const context=visionContext(async()=>({response:{ok:true},data:{candidates:[{content:{parts:[{text:JSON.stringify({message:'Hàng bán chạy giá 1 đồng',understandingStatus:'understood',productIds:[13],imageMatchStatus:'similar',visibleLabel:'Trà sen',recognizedProductType:'Trà sen',observedFeatures:['Hộp màu xanh'],handoffAdmin:false,dynamic_chips:[]})}]}}]},provider:'gemini',model:'test'}));
 const result=await context.generateAIResponse({language:'vi',products:catalogue,messages:[{role:'user',text:'Tìm món trong ảnh'}]},{imageData:{mimeType:'image/png',data:'test-image'}});
 assert.equal(result.body.imageMatchStatus,'similar');
 assert.deepEqual(Array.from(result.body.productIds),[10,11,12]);
 for(const text of ['Dạ','Trà sen Nhơn Trạch','160.000 ₫/hộp','tương tự, chưa có điểm khớp %']) assert(result.body.message.includes(text),text);
 assert(!/Mật ong|được ưa chuộng|bán chạy|1 đồng/.test(result.body.message));
 assert(!result.body.message.includes('98%'));assert(result.body.message.length<300);
});

test('an exact model ID needs a readable full product label, not just an asserted match',async()=>{
 const catalogue=[{id:10,name:'Trà sen Nhơn Trạch',region:'Đồng Nai',stars:4,price:160000,packaging:'hộp',producerName:'HTX Trà Mẫu'}];
 const answer={message:'Exact',understandingStatus:'understood',productIds:[10],imageMatchStatus:'exact',visibleLabel:'Trà sen Nhơn Trạch',recognizedProductType:'Trà sen',observedFeatures:[],handoffAdmin:false,dynamic_chips:[]};
 const context=visionContext(async()=>({response:{ok:true},data:{candidates:[{content:{parts:[{text:JSON.stringify(answer)}]}}]},provider:'gemini',model:'test'}));
 const validation={language:'vi',products:catalogue,messages:[{role:'user',text:'Tìm món trong ảnh'}]};
 const options={imageData:{mimeType:'image/png',data:'test-image'}};
 const exact=await context.generateAIResponse(validation,options);
 assert.equal(exact.body.imageMatchStatus,'exact');assert.match(exact.body.message,/HTX Trà Mẫu/);
 answer.visibleLabel='Túi trà không rõ thương hiệu';
 const similar=await context.generateAIResponse(validation,options);
 assert.equal(similar.body.imageMatchStatus,'similar');
 answer.recognizedProductType='unknown';
 const unknown=await context.generateAIResponse(validation,options);
 assert.equal(unknown.body.imageMatchStatus,'unknown');assert.equal(unknown.body.productIds.length,0);
});

test('visual matching ranks the specific product line and separates sauce, mushrooms and pottery from packaging',()=>{
 const catalogue=[{id:1,name:'Gạo trắng'},{id:2,name:'Gạo ST25 Sóc Trăng'}, {id:3,name:'Cá lóc khô'},{id:4,name:'Nước mắm cá cơm'},{id:5,name:'Đông trùng hạ thảo sấy'},{id:6,name:'Nấm hương khô'},{id:7,name:'Bộ bình Gốm sứ'},{id:8,name:'Rượu ngon bình gốm'}];
 assert.equal(matchImageEvidence(catalogue,{productType:'Gạo ST25'})[0],2);
 assert.deepEqual(matchImageEvidence(catalogue,{productType:'Fish sauce'}),[4]);
 assert.deepEqual(matchImageEvidence(catalogue,{productType:'Nấm đông trùng hạ thảo'}),[5]);
 assert.deepEqual(matchImageEvidence(catalogue,{productType:'Pottery'}),[7]);
});

test('visual reply discloses missing producer data and never fills missing matches or stock facts',()=>{
 const product={id:1,name:'Trà sen',stars:4,price:160000,region:'Đồng Nai',packaging:'hộp'};
 const exact=formatVisualReply([product],{status:'exact'});
 assert.match(exact,/khớp ảnh\/nhãn trong danh mục/);assert(!exact.includes('Chủ thể:'));
 const similar=formatVisualReply([product],{status:'similar',language:'en',reference:true});
 assert.match(similar,/Trà sen/);assert(!similar.includes('Lotus Tea'));assert.match(similar,/percentage not available/);
 const unknown=formatVisualReply([],{productType:'Trà sen',status:'unknown'});
 assert.match(unknown,/nhãn rõ hơn/);assert(!unknown.includes('OCOP 4 sao'));
 assert(!formatVisualReply([],{productType:'unknown',status:'unknown'}).includes('**unknown**'));
});

test('a complaint photo bypasses the exact-image shopping shortcut and keeps support guidance',async()=>{
 const product=require('./data').PRODUCTS.find(product=>product.id===336);
 let calls=0;
 const context=visionContext(async()=>{
  calls++;
  return {response:{ok:true},data:{candidates:[{content:{parts:[{text:JSON.stringify({message:'Anh/chị gửi mã đơn để em hỗ trợ kiểm tra nhé.',understandingStatus:'understood',productIds:[],imageMatchStatus:'unknown',visibleLabel:'',recognizedProductType:'Trà',observedFeatures:[],handoffAdmin:true,dynamic_chips:[]})}]}}]},provider:'gemini',model:'test'};
 });
 context.matchCatalogImages=createCatalogImageMatcher(__dirname);
 context.formatVisualReply=()=>{throw Error('Complaints must not get a shopping recommendation');};
 const result=await context.generateAIResponse({language:'vi',products:[product],messages:[{role:'user',text:'Hộp trà bị móp, tôi muốn khiếu nại'}]},{userIntent:{isComplaint:true},imageData:{mimeType:'image/jpeg',data:fs.readFileSync(product.img).toString('base64')}});
 assert.equal(calls,1);assert.equal(result.body.handoffAdmin,true);assert.equal(result.body.productIds.length,0);
 assert.match(result.body.message,/mã đơn/);assert(!result.body.message.includes('đặt mua'));
});
