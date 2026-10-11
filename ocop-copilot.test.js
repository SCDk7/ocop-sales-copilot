const test = require('node:test');
const assert = require('node:assert');
const OcopSalesCopilot = require('./ocop-copilot.js');

// Mock catalogue data
const sampleCatalog = [
    { id: 1, name: "Trà Shan Tuyết Cổ Thụ", nameEn: "Ancient Shan Tuyet Tea", price: 180000, category: "tea", region: "Hà Giang", stars: 5, packaging: "hộp" },
    { id: 2, name: "Cà Phê Arabica Cầu Đất", nameEn: "Cau Dat Arabica Coffee", price: 150000, category: "coffee", region: "Lâm Đồng", stars: 5, packaging: "gói" },
    { id: 3, name: "Hạt Điều Rang Muối Vinahe", nameEn: "Vinahe Salted Roasted Cashews", price: 125000, category: "snack", region: "Đồng Nai", stars: 4, packaging: "hũ" },
    { id: 4, name: "Mật Ong Rừng Tràm U Minh", nameEn: "U Minh Melaleuca Forest Honey", price: 195000, category: "honey", region: "Cà Mau", stars: 5, packaging: "chai" },
    { id: 5, name: "Kẹo Dừa Bến Tre Truyền Thống", nameEn: "Ben Tre Coconut Candy", price: 65000, category: "snack", region: "Bến Tre", stars: 4, packaging: "hộp" },
    { id: 6, name: "Trà Khổ Qua Rừng Hiệp Vân", nameEn: "Hiep Van Wild Bitter Melon Tea", price: 68000, category: "tea", region: "Đồng Nai", stars: 4, packaging: "hộp" },
    { id: 7, name: "Bưởi Đường Lá Cam Tân Triều", nameEn: "Tan Trieu Orange Leaf Pomelo", price: 85000, category: "fruit", region: "Đồng Nai", stars: 4, packaging: "quả" }
];

test('Budget Parser extracts numbers from diverse Vietnamese and English expressions', () => {
    assert.strictEqual(OcopSalesCopilot.parseBudget('Tôi có 500k muốn mua quà'), 500000);
    assert.strictEqual(OcopSalesCopilot.parseBudget('Combo 300.000đ'), 300000);
    assert.strictEqual(OcopSalesCopilot.parseBudget('Ngân sách 1tr mua gì bạn ơi'), 1000000);
    assert.strictEqual(OcopSalesCopilot.parseBudget('Dưới 200 nghìn'), 200000);
    assert.strictEqual(OcopSalesCopilot.parseBudget('Budget around 400k'), 400000);
});

test('Province Detector recognizes provinces accurately', () => {
    assert.strictEqual(OcopSalesCopilot.detectProvince('Đặc sản Đồng Nai có gì ngon'), 'Đồng Nai');
    assert.strictEqual(OcopSalesCopilot.detectProvince('Tìm quà quê Bến Tre'), 'Bến Tre');
    assert.strictEqual(OcopSalesCopilot.detectProvince('Đặc sản Hà Nội biếu sếp'), 'Hà Nội');
    assert.strictEqual(OcopSalesCopilot.detectProvince('Specialties from Lam Dong'), 'Lâm Đồng');
});

test('Intent Classifier routes messages into 4 core business groups', () => {
    // 1. Tư vấn Combo theo ngân sách
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Tôi có 500k nên mua combo nào?'), 'RECOMMEND_COMBO');
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Tư vấn set quà 300k'), 'RECOMMEND_COMBO');

    // 1. Lọc sản phẩm theo tỉnh thành
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Đặc sản Bến Tre có những món gì?'), 'SEARCH_PROVINCE');

    // 2. Tạo đơn hàng & Thanh toán
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Tôi muốn tạo đơn hàng này'), 'ORDER_CREATE');
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Thanh toán bằng mã QR VietQR'), 'PAYMENT_QR');
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Ship COD thanh toán khi nhận hàng'), 'PAYMENT_COD');

    // 3. Tra cứu vận chuyển & đơn hàng
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Tra cứu tình trạng đơn hàng #OCOP-98214'), 'ORDER_TRACK');
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Đơn hàng của tôi đã giao tới đâu rồi?'), 'ORDER_TRACK');

    // 4. Khiếu nại & CSKH
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Giao hàng có vấn đề, hàng bị móp méo bể vỡ'), 'COMPLAINT_CSKH');
    assert.strictEqual(OcopSalesCopilot.classifyIntent('Giao trễ hẹn quá, tôi cần gặp nhân viên CSKH'), 'COMPLAINT_CSKH');
});

test('Smart Combo Generator curates products without exceeding budget', () => {
    const budget = 500000;
    const combo = OcopSalesCopilot.generateSmartCombo(budget, null, sampleCatalog, 'vi');
    assert(combo.total <= budget, 'Total combo price must not exceed budget');
    assert(combo.remaining >= 0, 'Remaining budget must be >= 0');
    assert(combo.items.length >= 2, 'Combo must contain at least 2 items');
    assert(combo.productIds.length === combo.items.length, 'Product IDs must match items');
});

test('Smart Combo Generator with Province Priority', () => {
    const budget = 300000;
    const combo = OcopSalesCopilot.generateSmartCombo(budget, 'Đồng Nai', sampleCatalog, 'vi');
    assert(combo.total <= budget, 'Total must not exceed budget');
    assert(combo.items.some(i => i.region === 'Đồng Nai'), 'Should include Dong Nai specialties');
});

test('In-Chat Order Form & Payment Logic', () => {
    const res = OcopSalesCopilot.processUserMessage('Tôi muốn tạo đơn hàng ngay', 'vi', sampleCatalog);
    assert(res.localMarkup.includes('KHỞI TẠO ĐƠN HÀNG TRỰC TIẾP'), 'Must render In-Chat Order Form header');
    assert(res.localMarkup.includes('Họ và tên người nhận'), 'Must include recipient name field');
    assert(res.localMarkup.includes('Số điện thoại nhận hàng'), 'Must include phone field');
    assert(res.localMarkup.includes('Địa chỉ giao hàng chi tiết'), 'Must include address field');
    assert(res.localMarkup.includes('VietQR BIDV'), 'Must include VietQR radio option');
    assert(res.localMarkup.includes('Thu hộ COD'), 'Must include COD radio option');
});

test('Order Tracking Stepper contains 4 milestones and CSKH handoff', () => {
    const res = OcopSalesCopilot.processUserMessage('Tra cứu đơn hàng #OCOP-88294', 'vi', sampleCatalog);
    assert(res.message.includes('Hành Trình Vận Chuyển Đơn Hàng #OCOP-88294'), 'Should state order code');
    assert(res.localMarkup.includes('Đã tiếp nhận'), 'Milestone 1');
    assert(res.localMarkup.includes('Đóng gói & Kiểm định'), 'Milestone 2');
    assert(res.localMarkup.includes('Đang vận chuyển'), 'Milestone 3');
    assert(res.localMarkup.includes('Giao hàng có vấn đề? Liên hệ CSKH ngay'), 'Must have button connecting to CSKH');
});

test('Complaint and CSKH Handler includes multi-channel emergency support', () => {
    const res = OcopSalesCopilot.processUserMessage('Giao hàng bị trễ và hỏng hàng, tôi muốn khiếu nại', 'vi', sampleCatalog);
    assert(res.message.includes('1900 6868'), 'Must provide Hotline 1900 6868');
    assert(res.localMarkup.includes('Hotline 24/7'), 'Card must have Hotline');
    assert(res.localMarkup.includes('Zalo OA'), 'Card must have Zalo OA');
    assert(res.localMarkup.includes('4 Admin FB'), 'Card must have 4 Admin FB button');
    assert(res.localMarkup.includes('Gửi yêu cầu hỗ trợ nhanh'), 'Card must have quick issue form');
});

test('Bilingual Support: English prompts trigger fluent English output', () => {
    const resEn = OcopSalesCopilot.processUserMessage('Recommend a combo under 500k', 'en', sampleCatalog);
    assert(resEn.message.includes('Smart Recommendation'), 'Must be in English');
    assert(resEn.message.includes('Total Combo Value'), 'Must contain English price label');

    const trackEn = OcopSalesCopilot.processUserMessage('Track my order #OCOP-12345', 'en', sampleCatalog);
    assert(trackEn.message.includes('Tracking Information for Order #OCOP-12345'), 'English tracking message');
    assert(trackEn.localMarkup.includes('Delivery Issue? Contact CSKH Now'), 'English dispute button');
});

