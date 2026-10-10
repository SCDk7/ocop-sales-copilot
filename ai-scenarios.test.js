const test=require('node:test');
const assert=require('node:assert/strict');
const {scenarioReply}=require('./ai-scenarios');
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
 assert.equal(scenarioReply('Cách bảo quản trà tránh bị mốc?'),null);
});
