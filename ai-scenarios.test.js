const test=require('node:test');
const assert=require('node:assert/strict');
const {scenarioReply}=require('./ai-scenarios');
test('retired cash-flow requests redirect to product help without affecting shopping or support',()=>{
 for(const text of ['Phân tích dòng tiền của HTX','Analyze cash flow','Tính biên lợi nhuận trà OCOP']){
  const reply=scenarioReply(text,text.startsWith('Analyze')?'en':'vi');
  assert(reply);
  assert(!reply.message.includes('COGS'));
  assert(!reply.message.includes('Phân tích dòng tiền'));
 }
 assert.equal(scenarioReply('Trà Phìn Hồ giá bao nhiêu?'),null);
 assert.equal(scenarioReply('Phí giao hàng đến Hà Nội?'),null);
 assert.equal(scenarioReply('Cho mình gặp người thật về dòng tiền').handoffAdmin,true);
});
test('vague gift requests ask budget without invented catalogue claims',()=>{
 const reply=scenarioReply('Tư vấn cho mình quà biếu với.');
 assert.equal(reply.needsClarification,true);
 assert.match(reply.message,/ngân sách/);
 assert.equal(scenarioReply('combo Đồng Nai dưới 300k'),null);
});
test('damage complaints and human requests offer support without invented actions',()=>{
 for(const text of ['Hôm trước mua hộp quà bị móp méo, shop làm ăn kiểu gì thế!','Cho mình gặp người thật','I need to speak to a human']) {
  const reply=scenarioReply(text,text.startsWith('I ')?'en':'vi');
  assert.equal(reply.handoffAdmin,true);
  assert(!/15 phút|đã chuyển|Urgent|đã tạo/.test(reply.message));
 }
 assert.equal(scenarioReply('Cách bảo quản trà tránh bị mốc?').agent,'after_sales');
});

test('sales lifecycle guides reviews and orders without inventing completed actions',()=>{
 const review=scenarioReply('Tôi muốn gửi đánh giá sản phẩm');
 assert.equal(review.agent,'reviews');
 assert.match(review.message,/chưa ghi nhận/);
 const order=scenarioReply('Kiểm tra đơn hàng của tôi');
 assert.equal(order.agent,'orders');
 assert.equal(order.handoffAdmin,true);
 assert.match(order.message,/đăng nhập/);
 assert.match(order.message,/chưa xác minh/);
});
test('automatic reminders and CRM requests disclose connection and consent requirements',()=>{
 const reminder=scenarioReply('Nhắc tôi mua lại mật ong');
 assert.equal(reminder.agent,'repurchase');
 assert.match(reminder.message,/sự đồng ý/);
 assert.match(reminder.message,/chưa bật/);
 assert.equal(scenarioReply('Biglead CRM có đồng bộ Facebook và Zalo không?').agent,'capabilities');
 assert.equal(scenarioReply('Hộp trà bị mốc, tôi muốn gửi đánh giá').handoffAdmin,true);
});
test('browser fallback uses the same lifecycle support without pretending AI integrations',()=>{
 const {catalogReply}=require('./chat-fallback');
 const reply=catalogReply('Cách bảo quản mật ong?',[]);
 assert.equal(reply.agent,'after_sales');
 assert.deepEqual(reply.productIds,[]);
 assert.equal(reply.integrations.gemini,false);
 const vm=require('node:vm'),fs=require('node:fs');
 const browser={window:{AIShopping:require('./ai-shopping')}};
 vm.runInNewContext(fs.readFileSync('ai-scenarios.js','utf8'),browser);
 assert.equal(browser.window.OCOPSalesAssistant.scenarioReply('Tôi muốn gửi đánh giá').agent,'reviews');
});
