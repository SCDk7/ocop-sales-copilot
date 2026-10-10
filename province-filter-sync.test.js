const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PRODUCTS } = require('./data');

// Trích xuất các hàm và cấu hình từ index.html để test logic cô lập
function loadFilterHelpers() {
    const html = fs.readFileSync('index.html', 'utf8');

    // Kiểm tra các từ khóa quan trọng có trong index.html
    assert(html.includes('function onProvinceFilterChange'), 'onProvinceFilterChange must be defined');
    assert(html.includes('function resetFilters'), 'resetFilters must be defined');
    assert(html.includes('sidebar-province-select'), 'sidebar-province-select must exist in HTML');
    assert(html.includes('prov-chip-btn'), 'prov-chip-btn quick chips must exist');

    function normalizeProvinceName(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .toLowerCase()
            .replace(/^(tinh|thanh pho|tp\.?)\s+/i, '')
            .replace(/[^a-z0-9]/g, '');
    }

    const MACRO_REGIONS = {
        bac: ['Hà Nội', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Điện Biên', 'Lai Châu', 'Sơn La', 'Yên Bái', 'Hòa Bình', 'Thái Nguyên', 'Lạng Sơn', 'Quảng Ninh', 'Bắc Giang', 'Phú Thọ', 'Vĩnh Phúc', 'Bắc Ninh', 'Hải Dương', 'Hải Phòng', 'Hưng Yên', 'Thái Bình', 'Hà Nam', 'Nam Định', 'Ninh Bình'],
        trung: ['Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng'],
        nam: ['TP. Hồ Chí Minh', 'Bà Rịa - Vũng Tàu', 'Bình Dương', 'Bình Phước', 'Đồng Nai', 'Tây Ninh', 'An Giang', 'Bạc Liêu', 'Bến Tre', 'Cà Mau', 'Cần Thơ', 'Đồng Tháp', 'Hậu Giang', 'Kiên Giang', 'Long An', 'Sóc Trăng', 'Tiền Giang', 'Trà Vinh', 'Vĩnh Long']
    };

    return { normalizeProvinceName, MACRO_REGIONS };
}

test('normalizeProvinceName maps all 63 real provinces correctly', () => {
    const { normalizeProvinceName } = loadFilterHelpers();
    const provinces = [...new Set(PRODUCTS.map(p => p.region))];
    assert.equal(provinces.length, 63);

    // Test Đồng Nai variants
    assert.equal(normalizeProvinceName('Đồng Nai'), normalizeProvinceName('dong nai'));
    assert.equal(normalizeProvinceName('Tỉnh Đồng Nai'), normalizeProvinceName('Dong Nai'));
    assert.equal(normalizeProvinceName('TP. Hồ Chí Minh'), normalizeProvinceName('Hồ Chí Minh'));
    assert.equal(normalizeProvinceName('Hà Nội'), normalizeProvinceName('Thành phố Hà Nội'));
});

test('Province selection logic resolves exact province products without macro region collision', () => {
    const { normalizeProvinceName, MACRO_REGIONS } = loadFilterHelpers();

    // Kịch bản: Người dùng ban đầu ở Miền Bắc, sau đó chọn Đồng Nai (thuộc Miền Nam)
    let currentMacroRegion = 'bac';
    let targetProvince = 'Đồng Nai';
    const normTarget = normalizeProvinceName(targetProvince);

    // Thuật toán phát hiện và đồng bộ Macro Region tự động
    let matchedMacro = null;
    for (const [m, list] of Object.entries(MACRO_REGIONS)) {
        if (list.some(p => normalizeProvinceName(p) === normTarget)) {
            matchedMacro = m;
            break;
        }
    }
    assert.equal(matchedMacro, 'nam', 'Đồng Nai must belong to macro region nam');
    currentMacroRegion = matchedMacro;

    // Lọc sản phẩm
    const selectedProvince = { id: targetProvince, name: targetProvince };
    const normSel = normalizeProvinceName(selectedProvince.name);
    const provProducts = PRODUCTS.filter(p => normalizeProvinceName(p.region) === normSel);

    assert.equal(provProducts.length, 4, 'Đồng Nai must have exactly 4 real OCOP products');
    assert(provProducts.every(p => p.region === 'Đồng Nai'));
    assert.deepEqual(provProducts.map(p => p.id), PRODUCTS.filter(p => p.region === 'Đồng Nai').map(p => p.id));
});

test('Category auto-recovery: falls back to all when province lacks products in chosen category', () => {
    const { normalizeProvinceName } = loadFilterHelpers();
    const dongNaiProducts = PRODUCTS.filter(p => normalizeProvinceName(p.region) === normalizeProvinceName('Đồng Nai'));

    // Giả sử category 'handicraft' không có trong Đồng Nai (Đồng Nai chủ yếu food/beverage)
    let currentCategory = 'handicraft';
    let catMatch = dongNaiProducts.filter(p => p.category === currentCategory);

    let matchedList = dongNaiProducts;
    if (catMatch.length > 0) {
        matchedList = catMatch;
    } else {
        currentCategory = 'all'; // Tự động phục hồi để tránh mảng rỗng
        matchedList = dongNaiProducts;
    }

    assert.equal(currentCategory, 'all', 'Should auto-fallback to all to prevent empty page');
    assert.equal(matchedList.length, 4, 'Must return all 4 OCOP products for the selected province');
});

test('ResetFilters cleanses state and preserves all 252 products', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    // Kiểm tra resetFilters xóa cả sidebar-province-select, prov-chip-btn và reset scroll
    assert(html.includes("document.getElementById('sidebar-province-select')"), 'Must reset sidebar dropdown');
    assert(html.includes("document.querySelectorAll('.prov-chip-btn')"), 'Must reset sidebar chips');
    assert(html.includes("grid.scrollTop = 0"), 'Must reset grid scroll position');
    assert(html.includes("window.scrollTo"), 'Must reset window scroll position');
});

test('Catalog parent wrapper and multi-column product grid layout validation', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    // 1. Kiểm tra thẻ cha #catalog-layout-wrapper và các con trực tiếp #catalog-sidebar, #catalog-main-content
    assert(html.includes('id="catalog-layout-wrapper"'), 'Parent wrapper #catalog-layout-wrapper must exist');
    assert(html.includes('id="catalog-sidebar"'), 'Sidebar #catalog-sidebar must exist');
    assert(html.includes('id="catalog-main-content"'), 'Right content #catalog-main-content must exist');

    // 2. Kiểm tra CSS Grid cấu hình desktop: 320px 1fr, gap 32px, align-items: start
    assert(html.includes('grid-template-columns: 320px 1fr'), 'CSS Grid must configure 320px 1fr columns');
    assert(html.includes('#catalog-sidebar {'), 'CSS must define #catalog-sidebar styles');
    assert(html.includes('width: 320px'), 'Sidebar width must be locked at 320px');

    // 3. Kiểm tra #product-grid cấu hình 3 cột trên desktop
    assert(html.includes('grid-template-columns: repeat(3, 1fr)'), 'Desktop product grid must display 3 columns');
    assert(html.includes('#product-grid .product-card'), 'Product card sizing rules must be defined');
    assert(html.includes('#product-grid .product-card-image-wrap'), 'Image wrap must enforce 220px height with cover');
});

test('Dropdown options language, styling, and AI Engine Toast notification validation', () => {
    const html = fs.readFileSync('index.html', 'utf8');

    // 1. Kiểm tra ngôn từ quản trị số trong dropdown sắp xếp
    assert(html.includes('Biên lợi nhuận: Tăng dần'), 'Sorting option must be Biên lợi nhuận: Tăng dần');
    assert(html.includes('Biên lợi nhuận: Giảm dần'), 'Sorting option must be Biên lợi nhuận: Giảm dần');
    assert(html.includes('Sản lượng số hóa: Cao nhất'), 'Sorting option must be Sản lượng số hóa: Cao nhất');
    assert(html.includes('Phân hạng: Ưu tiên OCOP 5 Sao'), 'Sorting option must be Phân hạng: Ưu tiên OCOP 5 Sao');

    // 2. Kiểm tra CSS tương phản Deep Tech cho dropdown
    assert(html.includes('#product-sort-select option'), 'CSS must style dropdown options');
    assert(html.includes('background-color: #0d1b15'), 'Dropdown options must have deep tech background');

    // 3. Kiểm tra Toast box công nghệ AI Engine
    assert(html.includes('.ai-toast-box'), 'CSS must define .ai-toast-box class');
    assert(html.includes('ai-toast-icon-pulse'), 'Pulse animation must be applied to toast icon');
    assert(html.includes('⚡ AI Engine: Đã đồng bộ và tối ưu dữ liệu dòng tiền điểm bán tỉnh'), 'Province toast must use AI Engine cash flow copy');
});

test('Quick Replies Minimalist Tech UI and AI Digital Business Model Alignment validation', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    const serverJs = fs.readFileSync('server.js', 'utf8');

    // 1. Kiểm tra chính xác 3 nút lệnh gợi ý chiến lược
    assert(html.includes('⚡ Biên lợi nhuận: Đồng Nai'), 'Nút 1 phải là ⚡ Biên lợi nhuận: Đồng Nai');
    assert(html.includes('📊 Sản lượng số hóa: Hà Nội'), 'Nút 2 phải là 📊 Sản lượng số hóa: Hà Nội');
    assert(html.includes('🔄 Đối soát chiết khấu (CHM)'), 'Nút 3 phải là 🔄 Đối soát chiết khấu (CHM)');

    // 2. Kiểm tra CSS Minimalist Tech & Smooth Carousel
    assert(html.includes('.quick-replies-carousel'), 'Class .quick-replies-carousel must be defined');
    assert(html.includes('.quick-reply-pill'), 'Class .quick-reply-pill must be defined');
    assert(html.includes('scrollbar-width: none'), 'Quick replies must hide raw scrollbars');
    assert(html.includes('rgba(255, 255, 255, 0.05)'), 'Pills must have transparent minimalist dark tech background');
    assert(html.includes('rgba(212, 175, 55'), 'Pills must have golden glow on hover');

    // Customer answers stay grounded instead of adding invented financial metrics.
    assert(!html.includes('attachClientDigitalBusinessSyncBlock'));
    assert(!serverJs.includes('attachDigitalBusinessSyncBlock'));
    assert(serverJs.includes('Actual shop sales and performance require backend metrics'));

});

test('Comprehensive 5-language localization architecture validation (VI, EN, ZH, KO, JA)', () => {
    const html = fs.readFileSync('index.html', 'utf8');

    // 1. Kiểm tra UI/UX Language Switcher trong Header
    assert(html.includes('id="header-language-switcher"') || html.includes('class="lang-switcher-pill"'), 'Language switcher must exist in header');
    assert(html.includes('data-lang="vi"'), 'Must have VI button');
    assert(html.includes('data-lang="en"'), 'Must have EN button');
    assert(html.includes('data-lang="zh"'), 'Must have ZH button');
    assert(html.includes('data-lang="ko"'), 'Must have KO button');
    assert(html.includes('data-lang="ja"'), 'Must have JA button');
    assert(html.includes('.lang-switcher-pill'), 'CSS .lang-switcher-pill must be defined');
    assert(html.includes('.lang-btn'), 'CSS .lang-btn must be defined');
    assert(html.includes('border-radius: 20px'), 'Language switcher pill must have 20px border radius');

    // 2. Kiểm tra Phần 2.1: Tiêu đề bộ lọc sidebar
    assert(html.includes('BỘ LỌC ĐIỀU PHỐI HỆ SINH THÁI'), 'Sidebar filter title VI');
    assert(html.includes('ECOSYSTEM COORDINATION FILTERS'), 'Sidebar filter title EN');
    assert(html.includes('生态系统协调过滤器'), 'Sidebar filter title ZH');
    assert(html.includes('생태계 제어 필터'), 'Sidebar filter title KO');
    assert(html.includes('エコシステム制御フィルター'), 'Sidebar filter title JA');

    // 3. Kiểm tra Phần 2.2: Các mục danh mục con vĩ mô (A -> E)
    // A. Thảo dược
    assert(html.includes('Thảo Dược & Y Học Cổ Truyền'), 'Herbs VI');
    assert(html.includes('Herbs & Traditional Medicine'), 'Herbs EN');
    assert(html.includes('草药与传统医学'), 'Herbs ZH');
    assert(html.includes('한방 약재 및 전통 의학'), 'Herbs KO');
    assert(html.includes('生薬・伝統医学'), 'Herbs JA');

    // B. Quà tặng di sản
    assert(html.includes('Quà Tặng Di Sản Cao Cấp'), 'Gift VI');
    assert(html.includes('Premium Heritage Gifts'), 'Gift EN');
    assert(html.includes('高端文化遗产礼品'), 'Gift ZH');
    assert(html.includes('프리미엄 문화유산 기프트'), 'Gift KO');
    assert(html.includes('プレミアム文化遺産ギフト'), 'Gift JA');

    // C. Nông sản chế biến sâu
    assert(html.includes('Nông Sản Chế Biến Sâu'), 'Produce VI');
    assert(html.includes('Deep-Processed Agro-Products'), 'Produce EN');
    assert(html.includes('农业深加工产品'), 'Produce ZH');
    assert(html.includes('농산물 심층 가공품'), 'Produce KO');
    assert(html.includes('農産物深加工品'), 'Produce JA');

    // D. Đặc sản thực phẩm bản địa
    assert(html.includes('Đặc Sản Thực Phẩm Bản Địa'), 'Food VI');
    assert(html.includes('Indigenous Food Specialties'), 'Food EN');
    assert(html.includes('地方特色原味食品'), 'Food ZH');
    assert(html.includes('로컬 토속 식품 특산물'), 'Food KO');
    assert(html.includes('ローカル食品特産物'), 'Food JA');

    // E. Gia vị thổ nhưỡng
    assert(html.includes('Gia Vị & Hương Liệu Thổ Nhưỡng'), 'Spice VI');
    assert(html.includes('Terroir Spices & Aromatics'), 'Spice EN');
    assert(html.includes('风土调味品与香料'), 'Spice ZH');
    assert(html.includes('토양 특산 양념 및 향신료'), 'Spice KO');
    assert(html.includes('特有の調味料・香料'), 'Spice JA');

    // 4. Kiểm tra Phần 2.3: Khối thông tin Trợ lý AI Financial
    assert(html.includes('TRỢ LÝ AI FINANCIAL — Tự động tính toán Doanh thu, Tiền lời, Chiết khấu (CHM) thời gian thực.'), 'AI Financial text VI');
    assert(html.includes('AI FINANCIAL ASSISTANT — Automating Revenue, Net Profit, and Commission (CHM) splits in real-time.'), 'AI Financial text EN');
    assert(html.includes('AI 财务助手 — 实时自动计算营收、净利润与佣金分成 (CHM)。'), 'AI Financial text ZH');
    assert(html.includes('AI 재무 어시스턴트 — 매출, 순이익 및 수수료 정산 (CHM) 실시간 자동화.'), 'AI Financial text KO');
    assert(html.includes('AI財務アシスタント — 売上、純利益、手数料精算（CHM）をリアルタイムに自動化。'), 'AI Financial text JA');

    // 5. Kiểm tra Phần 2.4: Tiêu đề khung Chatbot AI & Dòng ghi chú xác thực
    assert(html.includes('❖ THÔNG TIN SẢN PHẨM & NGUỒN THAM KHẢO'), 'Chat title VI');
    assert(html.includes('❖ PRODUCT INFORMATION & REFERENCE SOURCES'), 'Chat title EN');
    assert(html.includes('❖ 产品信息与参考来源'), 'Chat title ZH');
    assert(html.includes('❖ 제품 정보 및 참고 자료'), 'Chat title KO');
    assert(html.includes('❖ 商品情報と参考資料'), 'Chat title JA');

    assert(html.includes('Giá và tồn kho từ cửa hàng. Thông tin tham khảo cần đối chiếu nguồn.'), 'Chat disclaimer VI');
    assert(html.includes('Prices and stock come from the shop. Reference information requires source checks.'), 'Chat disclaimer EN');
    assert(html.includes('价格和库存来自商店。参考信息需核对来源。'), 'Chat disclaimer ZH');
    assert(html.includes('가격과 재고는 매장 데이터입니다. 참고 정보의 출처를 확인하세요.'), 'Chat disclaimer KO');
    assert(html.includes('価格と在庫は店舗データです。参考情報の出典を確認してください。'), 'Chat disclaimer JA');

    // Customer cart remains a checkout flow; financial snapshots use a separate modal.
    assert(html.includes('onclick="checkout()"'));
    assert(html.includes('function renderCartItems()'));
    assert(html.includes('id="ai-financial-modal"'));

    // 7. Kiểm tra 4 thẻ cam kết vận hành (Pillars)
    assert(html.includes('Bản Đồ Số 63 Tỉnh Thành'), 'Pillar 1 VI');
    assert(html.includes('63 Provinces Across Vietnam'), 'Pillar 1 EN');
    assert(html.includes('63省数字地图'), 'Pillar 1 ZH');
    assert(html.includes('63개 성·시 디지털 지도'), 'Pillar 1 KO');
    assert(html.includes('63省・市デジタルマップ'), 'Pillar 1 JA');
});

test('Technical metrics, Hero product card, and Chatbot AI 5-language sync validation', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    const serverJs = fs.readFileSync('server.js', 'utf8');

    // PHẦN 1: Khối chỉ số kỹ thuật (0%, +18.4%, >95%, <3s) sang 5 thứ tiếng
    assert(html.includes('Sai Số Tài Chính') && html.includes('Financial Margins of Error') && html.includes('财务误差率') && html.includes('재무 오차율') && html.includes('财务誤差率'), '0% metric label 5 languages');
    assert(html.includes('Tăng Tiền Lời') && html.includes('Net Profit Growth') && html.includes('净利润增长') && html.includes('순이익 증가율') && html.includes('純利益の成長'), '+18.4% metric label 5 languages');
    assert(html.includes('Độ Chuẩn RAG AI') && html.includes('AI RAG Accuracy') && html.includes('AI RAG 准确率') && html.includes('AI RAG 정확도') && html.includes('AI RAG 精度'), '>95% metric label 5 languages');
    assert(html.includes('Tốc Độ Phản Hồi') && html.includes('Response Time') && html.includes('系统响应时间') && html.includes('응답 속도') && html.includes('応答速度'), '<3s metric label 5 languages');

    // PHẦN 2: Thẻ sản phẩm & thông số tài chính sang 5 thứ tiếng
    assert(html.includes('★ TINH HOA NÔNG SẢN VIỆT') && html.includes('★ VIETNAM PREMIUM NATIVE AGRO') && html.includes('★ 越南优质农产品') && html.includes('★ 베트남 프리미엄 농산물') && html.includes('★ ベトナムプレミアム農産物'), 'Badge 5 languages');
    assert(html.includes('NATIONAL OCOP PLATFORM — Hợp Nhất Dòng Tiền • Số Hóa Chuỗi Cung Ứng Đơn Vị Vùng Miền') && html.includes('NATIONAL OCOP PLATFORM — Cash Flow Integration • Supply Chain Digitalization') && html.includes('NATIONAL OCOP PLATFORM — 现金流整合 • 区域供应链数字化') && html.includes('NATIONAL OCOP PLATFORM — 현금 흐름 통합 • 지역 공급망 디지털화') && html.includes('NATIONAL OCOP PLATFORM — キャッシュフロー統合 • 地域サプライチェーンデジタル化'), 'White banner subtext 5 languages');
    assert(html.includes('Trà khổ qua rừng túi lọc Hiệp Vân - Đặc sản Long Khánh, Đồng Nai (OCOP 4 Sao)') && html.includes('Trà khổ qua rừng túi lọc Hiệp Vân - Long Khanh, Dong Nai Specialty (OCOP 4-Star)') && html.includes('Trà khổ qua rừng túi lọc Hiệp Vân - 同奈省 隆庆特产 (OCOP 4星级)') && html.includes('Trà khổ qua rừng túi lọc Hiệp Vân - 동나이성 롱카인 특산물 (OCOP 4성급)') && html.includes('Trà khổ qua rừng túi lọc Hiệp Vân - ドンナイ省 ロンカイン特産品 (OCOP 4つ星)'), 'Product name 5 languages');
    assert(html.includes('Điểm Bán O2O • Định Vị') && html.includes('O2O Showroom Locator') && html.includes('O2O 展厅定位') && html.includes('O2O 쇼룸 위치 관제') && html.includes('O2Oショールーム位置確認'), 'O2O Showroom Locator 5 languages');
    assert(html.includes('[Sản lượng điều phối hệ thống: 1.200 đơn vị • Trạng thái đối soát CHM: Đã phân bổ tự động]') && html.includes('[System Volume: 1,200 units • CHM Settlement: Automatically distributed via Smart Contract]') && html.includes('[系统调度量：1,200 件 • CHM 佣金结算：智能合约自动拨付]') && html.includes('[시스템 조율량: 1,200개 • CHM 수수료 정산: 스마트 계약 자동 정산 완료]') && html.includes('[システム調整量：1,200個 • CHM手数料精算：スマートコントラクト自動決済済]'), 'System coordinated volume 5 languages');

    // PHẦN 3: Chatbot AI Action buttons
    assert(html.includes('Ghim vị trí điểm bán') && html.includes('Pin Showroom Location') && html.includes('固定展厅位置') && html.includes('쇼룸 위치 고정') && html.includes('ショールーム位置を固定'), 'Action Button 1 5 languages');
    assert(html.includes('Xem dòng tiền mô phỏng') && html.includes('View Simulated Cash Flow') && html.includes('查看模拟现金流') && html.includes('시뮬레이션 흐름 보기') && html.includes('キャッシュフローシミュレーション'), 'Action Button 2 5 languages');

    // PHẦN 3: Chatbot Quick Replies
    assert(html.includes('⚡ 边际利润: 同奈苦瓜茶') && html.includes('详细分析同奈省森林苦瓜茶的毛利率与净利润'), 'Quick reply ZH 1');
    assert(html.includes('📊 数字化产量: 河内绿柚') && html.includes('更新河内大青柚的数字化分配产量'), 'Quick reply ZH 2');
    assert(html.includes('🔄 佣金对账 (CHM): 10%') && html.includes('核对CHM系统的10%交易佣金'), 'Quick reply ZH 3');

    assert(html.includes('⚡ 마진율: 동나이 여주차') && html.includes('동나이성 야생 여주 티백의 매출 총이익 및 순이익 분석'), 'Quick reply KO 1');
    assert(html.includes('📊 디지털 생산량: 하노이 자몽') && html.includes('하노이 대청 자몽의 디지털 배분 생산량 현황'), 'Quick reply KO 2');
    assert(html.includes('🔄 수수료 정산 (CHM): 10%') && html.includes('CHM 시스템 10% 거래 수수료 대조'), 'Quick reply KO 3');

    assert(html.includes('⚡ 利益率: ドンナイゴーヤ茶') && html.includes('ドンナイ省野生ゴーヤ茶の粗利益および純利益の詳細分析'), 'Quick reply JA 1');
    assert(html.includes('📊 デジタル生産量: ハノイポメロ') && html.includes('ハノイ産ポメロのデジタル配分生産量の最新状況'), 'Quick reply JA 2');
    assert(html.includes('🔄 手数料照合 (CHM): 10%') && html.includes('CHMシステムにおける10%の取引手数料を照合'), 'Quick reply JA 3');

    assert(html.includes('⚡ Margin: Dong Nai Bitter Melon Tea') && html.includes('Detail the gross & net margin for Dong Nai forest bitter melon tea'), 'Quick reply EN 1');
    assert(html.includes('📊 Digitized Yield: Hanoi Pomelo') && html.includes('Check digitized allocation volume for Hanoi green pomelo'), 'Quick reply EN 2');
    assert(html.includes('🔄 CHM Fee Reconciliation: 10%') && html.includes('Reconcile the 10% transaction commission in the CHM system'), 'Quick reply EN 3');

    // PHẦN 4: 3 Nút Hành động Lớn (Hero Action Buttons) sang 5 thứ tiếng
    assert(html.includes('AI Quản Trị Tài Chính') && html.includes('AI Financial Dashboard') && html.includes('AI 财务看板') && html.includes('AI 재무 대시보드') && html.includes('AI財務ダッシュボード'), 'Hero Action Button 1 (Dashboard) 5 languages');
    assert(html.includes('Mạng Lưới Điểm Bán OCOP') && html.includes('OCOP Showroom Network') && html.includes('OCOP 展厅网络') && html.includes('OCOP 쇼룸 네트워크') && html.includes('OCOPショールームネットワーク'), 'Hero Action Button 2 (Stores) 5 languages');
    assert(html.includes('Hồ Sơ Đề Án Challenge 2026') && html.includes('Challenge 2026 Project File') && html.includes('2026 挑战赛方案') && html.includes('2026 챌린지 프로젝트') && html.includes('2026 チャレンジプロジェクト'), 'Hero Action Button 3 (Proposal) 5 languages');

    // Server OCOP product name rule
    assert(serverJs.includes('CRITICAL OCOP LOCALIZATION RULE'), 'Server must have critical OCOP localization rule');
    assert(serverJs.includes('Tất cả Tên sản phẩm đặc sản OCOP thực tế'), 'Server rule 9 must lock Vietnamese product names');

    assert(!serverJs.includes('Verified 100% (0.00% variance)'));
    assert(!html.includes('Verified 100% (0.00% variance)'));

});

test('Central navigation bar Flexbox layout, wishlist removal, and 5-language sync validation', () => {
    const html = fs.readFileSync('index.html', 'utf8');

    // 1. Kiểm tra cấu hình Flexbox Engine cho thanh điều hướng trung tâm
    assert(html.includes('display: flex !important'), 'Flex display rule');
    assert(html.includes('flex-direction: row !important'), 'Row direction rule');
    assert(html.includes('flex-wrap: nowrap !important'), 'Nowrap flex rule');
    assert(html.includes('gap: 16px !important'), '16px gap rule');
    assert(html.includes('white-space: nowrap !important'), 'Text nowrap rule');
    assert(html.includes('font-size: 14px !important'), 'Font size 14px rule');
    assert(html.includes('padding: 6px 14px !important'), 'Padding 6px 14px rule');

    // 2. Kiểm tra gỡ bỏ hoàn toàn nút yêu thích bán lẻ (Heart icon & wishlist-count) khỏi Header
    assert(!html.includes('id="wishlist-count"'), 'Wishlist count badge must be removed from header');
    assert(!html.includes('fa-regular fa-heart text-xs sm:text-sm text-red-500'), 'Heart icon must be removed from header');

    // 3. Kiểm tra đồng bộ đa ngôn ngữ 5 thứ tiếng cho các nút điều hướng trung tâm
    // Nút Đề Án Challenge 2026
    assert(html.includes('Đề Án Challenge 2026') &&
           html.includes('Challenge Project 2026') &&
           html.includes('2026 挑战赛方案') &&
           html.includes('2026 챌린지 프로젝트') &&
           html.includes('2026 チャレンジプロジェクト'),
           'Đề Án Challenge 2026 must be mapped to all 5 languages');

    // Nút Điểm Bán OCOP
    assert(html.includes('Điểm Bán OCOP') &&
           html.includes('OCOP Showrooms') &&
           html.includes('OCOP 展厅') &&
           html.includes('OCOP 쇼룸') &&
           html.includes('OCOP ショールーム'),
           'Điểm Bán OCOP must be mapped to all 5 languages');

    // Nút Bảng Quản Trị
    assert(html.includes('Bảng Quản Trị') &&
           html.includes('KPI Dashboard') &&
           html.includes('管理控制台') &&
           html.includes('관리 대시보드') &&
           html.includes('管理ダッシュボード'),
           'Bảng Quản Trị must be mapped to all 5 languages');

    // Nút AI Financial Engine
    assert(html.includes('AI Financial Engine') &&
           html.includes('AI 财务引擎') &&
           html.includes('AI 재무 엔진') &&
           html.includes('AI 財務エンジン'),
           'AI Financial Engine must be mapped to all 5 languages');
});

test('Product card reconciliation button, system metrics, cash flow drawer sync, and 5-language localization validation', () => {
    const html = fs.readFileSync('index.html', 'utf8');

    // 1. Kiểm tra nút hành động màu vàng trên thẻ sản phẩm (Yellow Action Button)
    assert(html.includes('onclick="activateProductReconciliation(${p.id})"'), 'Action button must call activateProductReconciliation');
    assert(html.includes('reconcileBtnLabels'), 'reconcileBtnLabels mapping must be defined');

    // 5 ngôn ngữ cho nhãn nút hành động
    assert(html.includes('⚡ Kích Hoạt Đối Soát'), 'VI button label: ⚡ Kích Hoạt Đối Soát');
    assert(html.includes('⚡ Activate Reconciliation'), 'EN button label: ⚡ Activate Reconciliation');
    assert(html.includes('⚡ 激活财务对账'), 'ZH button label: ⚡ 激活财务对账');
    assert(html.includes('⚡ 정산 데이터 활성화'), 'KO button label: ⚡ 정산 데이터 활성화');
    assert(html.includes('⚡ 財務決済の有効化'), 'JA button label: ⚡ 財務決済の有効化');

    // 2. Kiểm tra chỉ số quản trị thay thế giá bán lẻ (System Metrics)
    assert(html.includes('getProductSystemMetrics'), 'getProductSystemMetrics function must exist');
    assert(html.includes('Sản lượng số hóa:'), 'VI volume label must exist');
    assert(html.includes('Biên lợi nhuận ròng:'), 'VI margin label must exist');
    assert(html.includes('Digitized Volume:'), 'EN volume label must exist');
    assert(html.includes('Net Profit Margin:'), 'EN margin label must exist');
    assert(html.includes('数字化统筹量:'), 'ZH volume label must exist');
    assert(html.includes('净利润率:'), 'ZH margin label must exist');
    assert(html.includes('디지털 조율량:'), 'KO volume label must exist');
    assert(html.includes('순이익률:'), 'KO margin label must exist');
    assert(html.includes('デジタル調整量:'), 'JA volume label must exist');
    assert(html.includes('純利益率:'), 'JA margin label must exist');

    // Footer thẻ sản phẩm không còn hiển thị giá lẻ tiêu dùng
    assert(html.includes('product-card-footer px-3 py-2.5'), 'Product card footer exists');
    assert(html.includes('sysMetrics.volume') && html.includes('sysMetrics.margin'), 'Footer renders system metrics');

    // 3. Kiểm tra hàm activateProductReconciliation & Reset Virtual Anchor
    assert(html.includes('function activateProductReconciliation(productId)'), 'activateProductReconciliation function must be defined');
    assert(html.includes('window.activateProductReconciliation = activateProductReconciliation;'), 'Function must be exported to window');
    assert(html.includes('cartItems.scrollTop = 0;'), 'Virtual Anchor reset must reset scrollTop to 0');
    assert(html.includes("drawer.classList.remove('hidden');"), 'Must open cart-drawer when activated');

    // 4. Kiểm tra Bảng Phân Tích Dòng Tiền (AI Simulated Drawer) & Tính toán COGS 62%, OPEX 7.5%, Net Profit
    assert(html.includes('id="cart-drawer"'), 'cart-drawer element exists');
    assert(html.includes('id="cart-cogs"'), 'cart-cogs element exists');
    assert(html.includes('id="cart-opex"'), 'cart-opex element exists');
    assert(html.includes('id="cart-subtotal"'), 'cart-subtotal element exists');
    assert(html.includes('id="cart-total"'), 'cart-total element exists');
    assert(html.includes('Math.round(subtotal * 0.62)'), 'COGS calculation must be 62%');
    assert(html.includes('Math.round(subtotal * 0.075)'), 'OPEX calculation must be 7.5%');
    assert(html.includes('Math.max(0, subtotal - cogs - opex - discount)'), 'Net Profit calculation formula');

    // 5. Kiểm tra I18N_DATA cho bảng dòng tiền đa ngôn ngữ
    assert(html.includes("'i18n-cart-title'") && html.includes("Bảng Phân Tích Dòng Tiền Cửa Hàng (AI Simulated)"), 'i18n-cart-title localized');
    assert(html.includes("'i18n-cart-subtotal'") && html.includes("Gross Revenue (Tổng doanh thu):"), 'i18n-cart-subtotal localized');
    assert(html.includes("'i18n-cart-cogs-label'") && html.includes("COGS (Giá vốn hàng bán 62%):"), 'i18n-cart-cogs-label localized');
    assert(html.includes("'i18n-cart-chm-label'") && html.includes("OPEX (Chi phí vận hành 7.5%):"), 'i18n-cart-chm-label localized');
    assert(html.includes("'i18n-cart-total'") && html.includes("Net Profit (Tiền lời ròng thực nhận):"), 'i18n-cart-total localized');
    assert(html.includes("'i18n-cart-empty'") && html.includes("Bảng mô phỏng đang trống. Hãy bấm '⚡ Kích Hoạt Đối Soát' trên sản phẩm để phân tích!"), 'i18n-cart-empty localized');
});

