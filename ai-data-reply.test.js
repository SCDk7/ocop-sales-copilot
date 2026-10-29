const test=require('node:test'),assert=require('node:assert/strict');
const {composeDataReply,fastBudgetReply}=require('./ai-data-reply');
test('a photo combo includes the matched item and stays within the requested budget',()=>{
 const {imageBudgetReply}=require('./ai-data-reply');
 const rows=[{id:1,name:'Bánh chưng',region:'Hà Nội',price:100000},{id:2,name:'Trà',region:'Hà Nội',price:200000},{id:3,name:'Mật ong',region:'Hà Nội',price:300000}];
 const reply=imageBudgetReply(rows,{isCombo:true,maxPrice:1000000,minItems:3,maxItems:3},1);
 assert.ok(reply.combos.length);
 for(const combo of reply.combos){assert.ok(combo.items.some(p=>p.id===1));assert.equal(combo.items.length,3);assert.ok(combo.total<=1000000);}
});
const AIShopping=require('./ai-shopping');
const products=[{id:1,name:'Trà Hà Giang',region:'Hà Giang',price:100000,packaging:'hộp'},{id:2,name:'Sâm',region:'Kon Tum',price:900000,packaging:'kg'}];
const sources=[{title:'Trà',url:'https://vi.wikipedia.org/wiki/Tr%C3%A0',extract:'Trà là thức uống từ lá cây chè.'}];
const tea={id:340,name:'Trà xanh cổ thụ Phìn Hồ hộp 100g',region:'Hà Giang',price:600000,stars:5,packaging:'hộp'};

test('clear combo budgets are answered locally with verified totals and item counts',()=>{
 const catalogue=require('./data').PRODUCTS;
 const {analyzeCustomerRequest}=require('./ai-request-analysis');
 const analysis=analyzeCustomerRequest([{role:'user',text:'1 triệu 3 món thôi'}],catalogue);
 const reply=fastBudgetReply(catalogue,analysis.intent);
 assert.ok(reply);assert.equal(reply.responseMode,'verified_catalog_combos');assert.ok(reply.combos.length);
 for(const combo of reply.combos){assert.equal(combo.items.length,3);assert.ok(combo.total<=1000000);}
 assert.equal(fastBudgetReply(catalogue,{...analysis.intent,isComplaint:true}),null);
 assert.equal(fastBudgetReply(catalogue,{...analysis.intent,isOcopKnowledge:true}),null);
 assert.equal(fastBudgetReply(catalogue,{...analysis.intent,maxPrice:null}),null);
});

test('tea FAQ answers the requested price and stars briefly without a model service',()=>{
 const reply=composeDataReply([tea],{categoryOrKeyword:'trà xanh cổ thụ Phìn Hồ',knowledgeQuery:'Trà xanh cổ thụ Phìn Hồ mấy sao giá bao nhiêu'},'vi');
 assert.match(reply.message,/600\.000 VNĐ\/hộp/);
 assert.match(reply.message,/OCOP 5 sao/);
 assert(reply.message.length<250);
 const origin=composeDataReply([tea],{categoryOrKeyword:'trà xanh cổ thụ Phìn Hồ',knowledgeQuery:'Trà xanh cổ thụ Phìn Hồ nguồn gốc ở đâu và giá bao nhiêu'},'vi');assert.match(origin.message,/cổ thụ hàng trăm năm/);
 assert.deepEqual(reply.productIds,[340]);
 const updated=composeDataReply([{...tea,price:620000,stars:4}],{categoryOrKeyword:'trà Phìn Hồ'},'vi');
 assert.match(updated.message,/620\.000/);assert.match(updated.message,/OCOP 4 sao/);
 assert(!updated.message.includes('600.000'));
});
test('tea storage and gift replies use supplied facts and selected products',()=>{
 const storage=composeDataReply([tea],{isUsage:true,knowledgeQuery:'bảo quản trà Phìn Hồ'},'vi');
 assert.match(storage.message,/24 tháng/);assert.match(storage.message,/khô ráo/);
 const gift={id:336,name:'Trà Phúc / Trà Lộc / Trà Thọ (Cồ Bắc/Hà Nội)',price:2000000,stars:5,packaging:'hộp'};
 const reply=composeDataReply([tea,gift],{isGift:true,categoryOrKeyword:'trà'},'vi');
 assert.match(reply.message,/2\.000\.000/);assert.match(reply.message,/ngân sách/);
 assert.deepEqual(reply.productIds,[336,340]);
 assert(!composeDataReply([tea],{isShipping:true},'vi').message.includes('600.000'));
});
test('tea FAQ preserves support priorities and never transfers facts to reused IDs',()=>{
 const complaint=composeDataReply([tea],{isComplaint:true},'vi');
 assert.equal(complaint.handoffAdmin,true);assert.deepEqual(complaint.productIds,[]);
 const unrelated=composeDataReply([{...tea,name:'Hạt điều rang muối'}],{categoryOrKeyword:'hạt điều'},'vi');
 assert(!unrelated.message.includes('cổ thụ hàng trăm năm'));
 const actiso={id:344,name:'Trà phun sương Actiso Sa Pa',price:150000,stars:5,packaging:'hộp túi lọc'};
 const health=composeDataReply([actiso],{isUsage:true,knowledgeQuery:'trà Actiso có công dụng gì'},'vi');
 assert.match(health.message,/chưa có tài liệu nhãn/);
 assert(!health.message.includes('tốt cho người hay thức khuya'));
});

test('an impossible Dong Nai gift combo never appends a Wikipedia locality',()=>{
 const reply=composeDataReply([],{hasVerifiedCombo:true,comboPlans:[],exactRegion:'Đồng Nai',maxPrice:300000},'vi',[{title:'Bình Minh, Đồng Nai',url:'https://vi.wikipedia.org/wiki/Binh_Minh',extract:'Bình Minh là một xã thuộc thành phố Đồng Nai, Việt Nam.'}]);
 assert.deepEqual(reply.productIds,[]);
 assert.deepEqual(reply.wikipediaSources,[]);
 assert.equal(reply.integrations.wikipedia,false);
 assert(!reply.message.includes('Bình Minh'));
});
test('catalogue prices and Wikipedia context form a reply without generated prose',()=>{
 const reply=composeDataReply(products,{pricePreference:'high'},'vi',sources);
 assert.deepEqual(reply.productIds,[2,1]);assert(reply.message.includes('900.000'));assert(reply.message.includes(sources[0].extract));assert.equal(reply.aiProvider,'catalog_wikipedia');assert.equal(reply.integrations.wikipedia,true);
});
test('an ordinary product request is not labelled low-priced; irrelevant empty knowledge cannot invent facts',()=>{
 const reply=composeDataReply([products[0]],{categoryOrKeyword:'trà'},'vi',[]);
 assert.deepEqual(reply.productIds,[1]);assert(!reply.message.includes('giá niêm yết thấp'));assert.equal(reply.integrations.wikipedia,false);
 const missing=composeDataReply(products,{isOcopKnowledge:true},'vi',[]);assert.deepEqual(missing.productIds,[]);assert(missing.message.includes('chưa tìm được thông tin xác thực'));
});
test('clarification, reviews and private support do not append external facts or promote products',()=>{
 for(const intent of [{requiredClarification:'Ngân sách bao nhiêu?'},{verifiedReviewMessage:'Chưa có đánh giá.',verifiedReviewProductIds:[1]},{isComplaint:true}]){
  const reply=composeDataReply(products,intent,'vi',sources);assert.equal(reply.integrations.wikipedia,false);assert(!reply.message.includes(sources[0].extract));
 }
});
test('a combo preserves verified totals and Wikipedia background together',()=>{
 const plan={items:[products[0],products[1]],total:1000000,budget:1000000,remaining:0};
 const reply=composeDataReply(products,{hasVerifiedCombo:true,comboPlans:[plan],maxPrice:1000000},'vi',sources);
 assert.equal(reply.combos[0].total,1000000);assert(reply.message.includes('1.000.000'));assert(reply.wikipediaSources.some(source=>source.url===sources[0].url));
});
test('Wikipedia page IDs returned by the lookup are supported and lookalike domains are rejected',()=>{
 const source={...sources[0],url:'https://vi.wikipedia.org/?curid=12345'};
 assert.equal(composeDataReply(products,{isOcopKnowledge:true},'vi',[source]).integrations.wikipedia,true);
 assert.equal(composeDataReply(products,{isOcopKnowledge:true},'vi',[{...source,url:'https://vi.wikipedia.org.evil.test/?curid=12345'}]).integrations.wikipedia,false);
});
test('five-star recommendations come from catalogue filtering even without an available semantic provider',()=>{
 const catalog=[...products.map(p=>({...p,stars:4})),{id:3,name:'Trà 5 sao',price:500000,stars:5},{id:4,name:'Yến 5 sao',price:700000,stars:5},{id:5,name:'Sâm 5 sao',price:900000,stars:5},{id:6,name:'Mật ong 5 sao',price:600000,stars:5}];
 const reply=composeDataReply(catalog,{minStars:5},'vi',[]);
 assert(reply.productIds.length>0);assert(reply.productIds.every(id=>catalog.find(p=>p.id===id).stars===5));assert.equal(reply.integrations.gemini,false);assert.equal(reply.understandingSource,'catalog_rules');
 const combined=composeDataReply([catalog[2]],{categoryOrKeyword:'trà'},'vi',sources,'gemini');
 assert.equal(combined.integrations.gemini,true);assert.equal(combined.integrations.wikipedia,true);
});
test('order guidance intent provides 3-step instructions without returning garlic products',()=>{
 const sampleCatalog=[
   {id:101,name:'Trà Shan Tuyết',region:'Hà Giang',price:200000},
   {id:102,name:'Tỏi Lý Sơn chính hãng (Hộp đóng gói xuất khẩu)',region:'Quảng Ngãi',price:350000}
 ];
 const query='Tôi muốn đặt hàng, hãy hướng dẫn tôi.';
 const intent=AIShopping.analyze(query,sampleCatalog);
 assert.equal(intent.isOrderGuide,true);
 assert.equal(intent.categoryOrKeyword,null);
 const reply=composeDataReply(sampleCatalog,intent,'vi');
 assert.deepEqual(reply.productIds,[]);
 assert.match(reply.message,/3 bước rất đơn giản/);
 assert.match(reply.message,/Chọn sản phẩm/);
 assert.match(reply.message,/Thêm vào giỏ/);
 assert.match(reply.message,/Xác nhận đơn/);
 assert(!reply.message.includes('Tỏi Lý Sơn'));
});
