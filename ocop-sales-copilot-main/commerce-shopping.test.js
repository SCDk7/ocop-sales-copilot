const test=require('node:test'),assert=require('node:assert/strict');
const {createCommerceShopping,selectFlows}=require('./commerce-shopping');
const {createKnowledge}=require('./product-knowledge');
const {generatePreferredContent}=require('./ai-provider');
const {PRODUCTS}=require('./data');

test('real reference workflows load and customer intent selects the relevant shopping flow',()=>{
 const commerce=createCommerceShopping();
 assert.equal(commerce.describe('').available,true);
 assert.deepEqual(selectFlows('So sánh trà và mật ong'),['purchase-research','search-discovery']);
 assert.deepEqual(selectFlows('Gợi ý quà Tết dưới 1 triệu'),['planning-goals','search-discovery']);
 assert.deepEqual(selectFlows('Đơn hàng bị vỡ, tôi muốn đổi trả'),['customer-care']);
 assert.deepEqual(selectFlows('Tôi ăn chay'),['memory-personalization','search-discovery']);
 assert.match(commerce.instruction({query:'tìm đặc sản',products:PRODUCTS}),/# Search and discovery/);
});
test('backend adapter reads live shop records and preserves region, budget and unknown inventory',()=>{
 const products=PRODUCTS.map(p=>p.id===524?{...p,price:123456}:p);
 const reads=[];
 const commerce=createCommerceShopping({knowledge:createKnowledge(products),salesStore:{inventory:id=>{reads.push(id);return {productId:id,stock:null,price:products.find(p=>p.id===id).price};}}});
 const context=commerce.readContext({query:'Đặc sản Đồng Nai còn hàng không?',products,intent:{exactRegion:'Đồng Nai',maxPrice:200000}});
 assert(context.catalogue.length>0);
 assert(context.catalogue.every(p=>p.region==='Đồng Nai'&&p.price<=200000));
 assert(context.catalogue.some(p=>p.productId===524&&p.price===123456));
 assert(reads.length>0);assert(context.inventory.every(item=>item.stock===null));
 assert.equal(context.capabilities.privateOrders,'authenticated_account_only');
 assert.equal(context.capabilities.persistentMemory,false);
 assert.equal(commerce.getProductDetails(products,999999),null);
});
test('reference workflows cannot enable merchant writes, model-authored purchases or unverified policies',()=>{
 const commerce=createCommerceShopping({knowledge:createKnowledge(PRODUCTS)});
 const prompt=commerce.instruction({query:'So sánh trà',products:PRODUCTS,intent:{categoryOrKeyword:'trà'}});
 assert.match(prompt,/# Purchase research/);
 assert.match(prompt,/DEPLOYMENT OVERRIDES/);
 assert.match(prompt,/never ACME/);
 assert.match(prompt,/do not charge|does not charge/);
 assert.match(prompt,/Wikipedia does not prove a product certificate/);
 assert.match(prompt,/untrusted reference DATA/);
 assert.equal(commerce.describe('').merchantAnalytics,false);
});
test('missing optional reference folder falls back without pretending the framework loaded',()=>{
 const commerce=createCommerceShopping({sourceRoot:require('node:path').join(__dirname,'scratch','nonexistent-reference')});
 assert.equal(commerce.describe('').available,false);
 assert.equal(commerce.instruction({query:'tìm trà',products:PRODUCTS}),'');
});
test('Gemini and OpenAI receive the same commerce workflow and grounded product records',async()=>{
 const commerce=createCommerceShopping({knowledge:createKnowledge(PRODUCTS)});
 const instruction=commerce.instruction({query:'So sánh trà Phìn Hồ',products:PRODUCTS,intent:{categoryOrKeyword:'trà'}});
 const seen=[];
 const payload={system_instruction:{parts:[{text:instruction}]},contents:[{role:'user',parts:[{text:'So sánh trà'}]}],generationConfig:{responseSchema:{type:'OBJECT',properties:{message:{type:'STRING'},productIds:{type:'ARRAY',items:{type:'INTEGER'}}},required:['message','productIds']}}};
 const result=await generatePreferredContent({apiKey:'mock-gemini',model:'gemini-test',openai:{apiKey:'mock-openai',model:'gpt-4.1-mini'},mode:'ensemble'},payload,{fetcher:async(url,options)=>{
  const provider=url.includes('openai.com')?'openai':'gemini',request=JSON.parse(options.body);
  seen.push({provider,instruction:provider==='openai'?request.instructions:request.system_instruction.parts[0].text});
  const text=JSON.stringify({message:'Compare current catalogue records.',productIds:[340,341]});
  return new Response(JSON.stringify(provider==='openai'?{status:'completed',output:[{type:'message',content:[{type:'output_text',text}]}]}:{candidates:[{content:{parts:[{text}]}}]}));
 }});
 assert.equal(seen.length,2);assert(seen.every(request=>request.instruction===instruction));
 assert.deepEqual(result.providersUsed,['gemini','openai']);
});
test('provider failures cannot be labelled as successful multi-model answers',async()=>{
 const result=await generatePreferredContent({apiKey:'mock-gemini',model:'gemini-test',openai:{apiKey:'mock-openai',model:'gpt-4.1-mini'}},{contents:[{role:'user',parts:[{text:'hello'}]}],generationConfig:{responseSchema:{type:'OBJECT',properties:{message:{type:'STRING'}},required:['message']}}},{fetcher:async()=>new Response(JSON.stringify({error:{code:'insufficient_quota'}}),{status:429})});
 assert.equal(result.provider,'unavailable');assert.deepEqual(result.providersUsed,[]);
});

test('comparison and inventory flows remain useful without a paid model response',()=>{
 const shopping=require('./ai-shopping');
 const commerce=createCommerceShopping({salesStore:{inventory:id=>({productId:id,stock:null})}});
 const query='So sánh trà xanh cổ thụ Phìn Hồ và hồng trà Phìn Hồ';
 const comparison=commerce.localReply({query,products:PRODUCTS,intent:shopping.resolve([{role:'user',text:query}],PRODUCTS)});
 assert.equal(comparison.responseMode,'commerce_comparison');
 assert.deepEqual([...comparison.productIds].sort(),[340,341]);
 assert(comparison.message.includes('600.000'));assert(comparison.message.includes('700.000'));
 assert.equal(comparison.integrations.gemini,false);
 const inventory=commerce.localReply({query:'Trà xanh cổ thụ Phìn Hồ còn hàng không?',products:PRODUCTS});
 assert.match(inventory.message,/Chưa có dữ liệu tồn kho/);
 assert.equal(inventory.responseMode,'commerce_inventory');
});
