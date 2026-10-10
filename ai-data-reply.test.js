const test=require('node:test'),assert=require('node:assert/strict');
const {composeDataReply}=require('./ai-data-reply');
const products=[{id:1,name:'Trà Hà Giang',region:'Hà Giang',price:100000,packaging:'hộp'},{id:2,name:'Sâm',region:'Kon Tum',price:900000,packaging:'kg'}];
const sources=[{title:'Trà',url:'https://vi.wikipedia.org/wiki/Tr%C3%A0',extract:'Trà là thức uống từ lá cây chè.'}];

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
