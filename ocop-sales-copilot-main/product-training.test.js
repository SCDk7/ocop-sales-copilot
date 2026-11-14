const test=require('node:test'),assert=require('node:assert/strict');
const {answerTrainingQuery}=require('./product-training');
const {PRODUCTS}=require('./data');
const fs=require('node:fs'),vm=require('node:vm');

test('merchant FAQ answers the supplied tea question using current catalogue price and stars',()=>{
 const reply=answerTrainingQuery('Trà xanh cổ thụ Phìn Hồ mấy sao OCOP? Giá bao nhiêu?',PRODUCTS);
 assert.deepEqual(reply.productIds,[340]);assert.match(reply.message,/600\.000 VNĐ\/hộp/);assert.match(reply.message,/OCOP 5 sao/);assert(reply.message.length<250);
 const changed=PRODUCTS.map(p=>p.id===340?{...p,price:650000,stars:4}:p);
 const updated=answerTrainingQuery('Trà xanh Phìn Hồ giá bao nhiêu?',changed);
 assert.match(updated.message,/650\.000/);assert.match(updated.message,/OCOP 4 sao/);assert(!updated.message.includes('600.000'));
 assert.equal(updated.knowledgeSource,'merchant_supplied');
});
test('storage and story requests answer the actual question instead of turning into gift recommendations',()=>{
 const storage=answerTrainingQuery('Bảo quản trà xanh Phìn Hồ như thế nào?',PRODUCTS);
 assert.deepEqual(storage.productIds,[340]);assert.match(storage.message,/24 tháng/);assert.match(storage.message,/bao bì thực tế/);
 const story=answerTrainingQuery('Câu chuyện trà xanh Phìn Hồ?',PRODUCTS);
 assert.match(story.message,/búp trà vùng cao/);
 const follow=answerTrainingQuery('Hạn sử dụng bao lâu?',PRODUCTS,'vi',[{role:'user',text:'Trà xanh cổ thụ Phìn Hồ'}]);
 assert.deepEqual(follow.productIds,[340]);assert.match(follow.message,/24 tháng/);
});
test('gift suggestions preserve prices, and shipping never promises unverified export policies',()=>{
 const gift=answerTrainingQuery('Shop có trà nào thích hợp để làm quà biếu cao cấp không?',PRODUCTS);
 assert(gift.productIds.includes(336));assert.match(gift.message,/2\.000\.000/);assert.match(gift.message,/ngân sách/);
 const ship=answerTrainingQuery('Sản phẩm có gửi đi tỉnh hoặc gửi đi nước ngoài được không?',PRODUCTS);
 assert.deepEqual(ship.productIds,[]);assert.match(ship.message,/cần kiểm tra điều kiện vận chuyển/);
 assert.equal(ship.integrations.gemini,false);
 assert.equal(answerTrainingQuery('Hộp trà xanh Phìn Hồ bị mốc, tôi muốn đổi trả',PRODUCTS),null);
 assert.equal(answerTrainingQuery('Trà xanh Phìn Hồ giá bao nhiêu?',[{id:340,name:'Hạt điều',price:100}]),null);
});
test('generated browser knowledge matches JSON and gives the same FAQ as the backend',()=>{
 const context={AIShopping:require('./ai-shopping')};context.window=context;context.globalThis=context;
 vm.runInNewContext(fs.readFileSync('data/tea-knowledge.js','utf8'),context);
 assert.equal(JSON.stringify(context.OCOPTeaKnowledge),JSON.stringify(require('./data/tea-knowledge.json')));
 vm.runInNewContext(fs.readFileSync('product-training.js','utf8'),context);
 const q='Trà xanh cổ thụ Phìn Hồ mấy sao OCOP? Giá bao nhiêu?';
 assert.equal(context.OCOPProductTraining.answerTrainingQuery(q,PRODUCTS).message,answerTrainingQuery(q,PRODUCTS).message);
});
