'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const guide = require('./customer-question-guide');
const products = require('./data').PRODUCTS;
const product = products.find(item => item.id === 336);

test('catalog answers address the actual question without treating the CSV wording as verified facts', () => {
  const cases = [
    ['có giấy chứng nhận bản sao trong hộp không?', /chưa lưu bản chứng nhận/],
    ['người bị tiểu đường có dùng được không?', /hỏi nhân viên y tế/],
    ['sau khi khui hộp nên bảo quản thế nào?', /chưa có hướng dẫn bảo quản/],
    ['giá đã bao gồm VAT và xuất hóa đơn đỏ chưa?', /Thuế, hóa đơn/],
    ['có hỗ trợ gói quà và thiệp không?', /chưa được xác nhận/],
    ['giao hàng mất bao nhiêu ngày và phí vận chuyển?', /1–2 ngày làm việc/]
  ];
  for (const [question, expected] of cases) {
    const result = guide.answer(`${product.name} ${question}`, products);
    assert.ok(result, question);
    assert.equal(result.productIds[0], product.id);
    assert.match(result.message, /^Dạ,/);
    assert.match(result.message, expected);
    assert.match(result.message, new RegExp(product.price.toLocaleString('vi-VN')));
  }
});

test('quoted product names and questions without a matched product are handled safely', () => {
  const quoted = products.find(item => item.name.includes('vũ nữ chân dài'));
  assert.ok(quoted);
  const csvForm = quoted.name.replaceAll('"', '""');
  assert.equal(guide.answer(`"Shop ơi, ${csvForm} có mã chứng nhận không?"`, products).productIds[0], quoted.id);
  assert.equal(guide.answer('Shop ơi, sản phẩm lạ có giấy chứng nhận không?', products), null);
});

test('certificate and VAT follow-up answers the new question instead of repeating a previous combo', () => {
  const history=[{role:'user',text:'Gợi ý 3 combo dưới 2 triệu'},{role:'assistant',text:'Combo 1: 5 món gồm Mật ong bạc hà Mèo Vạc'}];
  const answer=require('./chat-fallback').catalogReply('có đảm bảo giấy chứng nhận và vat ko',products,'vi',history);
  assert.equal(answer.responseMode,'general_compliance');
  assert.deepEqual(answer.productIds,[]);
  assert.match(answer.message,/chứng nhận/);
  assert.match(answer.message,/VAT/);
  assert.doesNotMatch(answer.message,/Combo 1|2\.000\.000/);
});
