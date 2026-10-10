const test=require('node:test'),assert=require('node:assert/strict');
const {createKnowledge}=require('./product-knowledge');
test('retrieval ranks relevant source records and respects exact product scope',()=>{
 const records=[{id:1,name:'Trà hoa vàng',region:'Đồng Nai',desc:'Bảo quản trà nơi khô ráo.'},{id:2,name:'Hạt điều',region:'Bình Phước',desc:'Hạt điều rang muối.'}];
 const knowledge=createKnowledge(records),hits=knowledge.search('trà hoa vàng Đồng Nai');
 assert.equal(hits[0].productId,1);assert.equal(hits[0].source,'shop_catalogue');assert.match(hits[0].text,/Bảo quản/);
 assert.deepEqual(knowledge.search('trà hoa vàng',{productIds:[2]}),[]);
 assert.deepEqual(knowledge.search('bào ngư'),[]);
 assert(!hits[0].text.includes('2024'));
});
test('operational inventory questions never send a public Wikipedia search',()=>{
 const {planWikipedia}=require('./ai-wikipedia');
 assert.equal(planWikipedia({},null,'Trà này còn bao nhiêu trong kho?',[]).skipReason,'operational_backend_data');
 assert.equal(planWikipedia({},null,'Tạo đơn nháp cho tôi',[]).query,'');
});
