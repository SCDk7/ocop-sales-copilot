const test = require('node:test');
const assert = require('node:assert/strict');
const {PRODUCTS} = require('./data');
const {findTargetProduct, resolveProductConsultation} = require('./product-consultant');
const {catalogReply} = require('./chat-fallback');

test('specific product consultation query returns origin, cultural story and O2O showroom', () => {
    const q = 'Tư vấn cho tôi về đặc sản Đũa gỗ Quảng Thủy xuất khẩu (Quảng Bình): nguồn gốc xuất xứ, câu chuyện văn hóa và địa chỉ showroom O2O chính hãng.';
    const reply = catalogReply(q, PRODUCTS);
    assert.deepEqual(reply.productIds, [448]);
    assert(reply.message.includes('Đũa gỗ Quảng Thủy xuất khẩu'));
    assert(reply.message.includes('Quảng Bình'));
    assert(reply.message.includes('Nguồn gốc & Câu chuyện văn hóa'));
    assert(reply.message.includes('Làng nghề'));
    assert(reply.message.includes('Đặc điểm & Giá trị nổi bật'));
    assert(reply.message.includes('Địa chỉ Showroom O2O'));
    assert(reply.message.includes('Google Maps'));
});

test('follow-up inquiry "sản phẩm này có j" resolves previous product and details features', () => {
    const history = [
        { role: 'user', text: 'Tư vấn cho tôi về đặc sản Đũa gỗ Quảng Thủy xuất khẩu' },
        { role: 'model', text: 'Dạ, em xin tư vấn chi tiết về đặc sản Đũa gỗ Quảng Thủy...' }
    ];
    const reply = catalogReply('sản phẩm này có j', PRODUCTS, 'vi', history);
    assert.deepEqual(reply.productIds, [448]);
    assert(reply.message.includes('Đũa gỗ Quảng Thủy xuất khẩu'));
    assert(reply.message.includes('Đặc điểm & Giá trị nổi bật (Sản phẩm này có gì?)'));
    assert(reply.message.includes('150.000 ₫/bịch'));
    assert(reply.message.includes('Showroom'));
});

test('general province and showroom network queries stay in their designated handlers', () => {
    const provReply = catalogReply('Tư vấn đặc sản OCOP tiêu biểu tỉnh Đồng Nai và chỉ đường đến showroom chính hãng', PRODUCTS);
    assert(provReply.productIds.every(id => PRODUCTS.find(p => p.id === id).region === 'Đồng Nai'));

    const netReply = catalogReply('Tra cứu mạng lưới showroom và điểm bán O2O chính hãng trên bản đồ số', PRODUCTS);
    assert(netReply.message.includes('Mạng lưới Showroom & Điểm bán O2O'));
});

