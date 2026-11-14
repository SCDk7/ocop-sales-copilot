const test = require('node:test');
const assert = require('node:assert/strict');
const {PRODUCTS} = require('./data');
const {findTargetProduct, resolveProductConsultation} = require('./product-consultant');
const {catalogReply} = require('./chat-fallback');

test('out-of-province product consultation is not answered from the Dong Nai catalogue', () => {
    const q = 'Tư vấn cho tôi về đặc sản Đũa gỗ Quảng Thủy xuất khẩu (Quảng Bình): nguồn gốc xuất xứ, câu chuyện văn hóa và địa chỉ showroom O2O chính hãng.';
    const reply = catalogReply(q, PRODUCTS);
    assert.deepEqual(reply.productIds, []);
    assert(!reply.message.includes('Đũa gỗ Quảng Thủy xuất khẩu'));
    assert(!reply.message.includes('Quảng Bình'));
    assert(!reply.message.includes('Google Maps'));
});

test('follow-up questions do not bring out-of-province products into the Dong Nai chat', () => {
    const history = [
        { role: 'user', text: 'Tư vấn cho tôi về đặc sản Đũa gỗ Quảng Thủy xuất khẩu' },
        { role: 'model', text: 'Dạ, em xin tư vấn chi tiết về đặc sản Đũa gỗ Quảng Thủy...' }
    ];
    const reply = catalogReply('sản phẩm này có j', PRODUCTS, 'vi', history);
    assert.deepEqual(reply.productIds, []);
    assert(!reply.message.includes('Đũa gỗ Quảng Thủy xuất khẩu'));
    assert(!reply.message.includes('150.000 ₫/bịch'));
    assert(!reply.message.includes('Google Maps'));
});

test('general province and showroom network queries stay in their designated handlers', () => {
    const provReply = catalogReply('Tư vấn đặc sản OCOP tiêu biểu tỉnh Đồng Nai và chỉ đường đến showroom chính hãng', PRODUCTS);
    assert(provReply.productIds.every(id => PRODUCTS.find(p => p.id === id).region === 'Đồng Nai'));

    const netReply = catalogReply('Tra cứu mạng lưới showroom và điểm bán O2O chính hãng trên bản đồ số', PRODUCTS);
    assert(netReply.message.includes('danh bạ điểm bán Đồng Nai đã được duyệt'));
    assert(netReply.message.includes('chưa có điểm bán được duyệt'));
    assert(!netReply.message.includes('Hà Nội'));
});

