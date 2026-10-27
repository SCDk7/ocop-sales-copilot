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
test('merchant tea stories are retrieved with live catalogue prices and product isolation',()=>{
 const tea={id:340,name:'Trà xanh cổ thụ Phìn Hồ hộp 100g',region:'Hà Giang',price:650000,stars:4,packaging:'hộp'};
 const hits=createKnowledge([tea,{id:99,name:'Hạt điều',region:'Bình Phước',desc:'Hạt điều rang muối'}]).search('bảo quản trà Phìn Hồ');
 assert.equal(hits[0].productId,340);
 assert.match(hits[0].text,/24 tháng/);
 assert.match(hits[0].text,/650\.000 VNĐ/);
 assert.match(hits[0].text,/OCOP 4 sao/);
 assert(!hits[0].text.includes('600.000'));
 assert(!hits[0].text.includes('OCOP 5 sao'));
 assert.deepEqual(createKnowledge([tea]).search('trà Phìn Hồ',{productIds:[99]}),[]);
});
test('an unrelated product reusing a tea ID cannot inherit its training facts',()=>{
 const text=createKnowledge([{id:340,name:'Hạt điều rang muối',region:'Bình Phước'}]).search('hạt điều')[0].text;
 assert(!text.includes('Phìn Hồ'));
 assert(!text.includes('24 tháng'));
});
test('tea shipping FAQ requests confirmation rather than promising exports or free shipping',()=>{
 const {trainingForProduct}=require('./product-training');
 const text=trainingForProduct({id:344,name:'Trà phun sương Actiso Sa Pa',price:150000,stars:5,packaging:'hộp túi lọc'});
 assert.match(text,/cần kiểm tra điều kiện vận chuyển/);
 assert.match(text,/không tự khẳng định hiệu quả chữa bệnh/);
 assert.match(text,/150\.000 VNĐ/);
});
