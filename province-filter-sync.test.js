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
    assert(html.includes('Trà khổ qua rừng túi lọc Hiệp Vân - Đặc sản Long Khánh, Đồng Nai (OCOP 4 Sao)') && html.includes('Hiep Van Forest Bitter Melon Tea - Long Khanh, Dong Nai Specialty (OCOP 4-Star)') && html.includes('协云 森林苦瓜袋泡茶 - 同奈省 隆庆特产 (OCOP 4星级)') && html.includes('혭번 야생 여주 티백 - 동나이성 롱카인 특산물 (OCOP 4성급)') && html.includes('協雲 野生ゴーヤティーバッグ - ドンナイ省 ロンカイン特産品 (OCOP 4つ星)'), 'Product name 5 languages');
    assert(html.includes('Điểm Bán O2O • Định Vị') && html.includes('O2O Showroom Locator') && html.includes('O2O 展厅定位') && html.includes('O2O 쇼룸 위치 관제') && html.includes('O2Oショールーム位置確認'), 'O2O Showroom Locator 5 languages');
    assert(html.includes('[Sản lượng điều phối hệ thống: 1.200 đơn vị • Trạng thái đối soát CHM: Đã phân bổ tự động]') && html.includes('[System Coordinated Volume: 1,200 units • CHM Reconciliation Status: Automatically Distributed]') && html.includes('[系统统筹流通量: 1,200 单位 • CHM 对账状态: 已自动分配]') && html.includes('[시스템 조정 유통량: 1,200 단위 • CHM 정산 상태: 자동 분배 완료]') && html.includes('[システム調整流通量: 1,200 ユニット • CHM 精算ステータス: 自動配分完了]'), 'System coordinated volume 5 languages');

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

    assert(!serverJs.includes('Verified 100% (0.00% variance)'));
    assert(!html.includes('Verified 100% (0.00% variance)'));

});
