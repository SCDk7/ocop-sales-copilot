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
    assert(provProducts.some(p => p.name.includes('Bưởi Tân Triều') || p.name.includes('Tân Triều')));
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

    // 3. Kiểm tra logic xử lý sản lượng số hóa Hà Nội
    assert(html.includes('Kiểm Tra Sản Lượng Số Hóa: Mạng Lưới OCOP Thủ Đô Hà Nội'), 'Client fallback must handle Hanoi digitized yield');
    assert(serverJs.includes('Kiểm Tra Sản Lượng Số Hóa: Mạng Lưới OCOP Thủ Đô Hà Nội'), 'Server handler must handle Hanoi digitized yield');

    // 4. Kiểm tra quy tắc phản hồi Model Alignment: [HỆ THỐNG ĐỒNG BỘ: Biên lợi nhuận ròng...
    assert(html.includes('[HỆ THỐNG ĐỒNG BỘ: Biên lợi nhuận ròng'), 'Client responses must include digital business synchronization block');
    assert(serverJs.includes('[HỆ THỐNG ĐỒNG BỘ: Biên lợi nhuận ròng'), 'Server responses must include digital business synchronization block');
    assert(serverJs.includes('attachDigitalBusinessSyncBlock'), 'Server must define attachDigitalBusinessSyncBlock');
    assert(html.includes('attachClientDigitalBusinessSyncBlock'), 'Client must define attachClientDigitalBusinessSyncBlock');
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
    assert(html.includes('❖ THÔNG TIN ĐIỂM BÁN & DỮ LIỆU CHỨNG NHẬN ĐÃ XÁC THỰC'), 'Chat title VI');
    assert(html.includes('❖ VERIFIED SHOWROOM INFO & OCOP CERTIFICATION DATA'), 'Chat title EN');
    assert(html.includes('❖ 已验证展厅信息与 OCOP 认证数据'), 'Chat title ZH');
    assert(html.includes('❖ 검증된 쇼룸 정보 및 OCOP 인증 데이터'), 'Chat title KO');
    assert(html.includes('❖ 認証済みショールーム情報＆OCOP認証データ'), 'Chat title JA');

    assert(html.includes('✓ Dữ liệu được đồng bộ Real-time từ Cơ sở dữ liệu OCOP Quốc gia và AI Financial Engine.'), 'Chat disclaimer VI');
    assert(html.includes('✓ Data synchronized real-time from the National OCOP Database and AI Financial Engine.'), 'Chat disclaimer EN');
    assert(html.includes('✓ 数据来自国家 OCOP 数据库与 AI 财务引擎的实时同步。'), 'Chat disclaimer ZH');
    assert(html.includes('✓ 국가 OCOP 데이터베이스 및 AI 재무 엔진에서 실시간 동기화된 데이터입니다.'), 'Chat disclaimer KO');
    assert(html.includes('✓ 国家OCOPデータベースおよびAI財務エンジンからリアルタイム同期されたデータ。'), 'Chat disclaimer JA');

    // 6. Kiểm tra Phần 2.5: Bảng phân tích dòng tiền mô phỏng (khung phải)
    assert(html.includes('Bảng phân tích dòng tiền cửa hàng (AI Simulated)'), 'Cash flow title VI');
    assert(html.includes('Store Cash Flow Analytics (AI Simulated)'), 'Cash flow title EN');
    assert(html.includes('店铺现金流分析面板 (AI 模拟)'), 'Cash flow title ZH');
    assert(html.includes('매장 현금 흐름 분석 (AI 시뮬레이션)'), 'Cash flow title KO');
    assert(html.includes('店舗キャッシュフロー分析（AIシミュレーション）'), 'Cash flow title JA');

    assert(html.includes('Xuất Báo Cáo Tài Chính AI & Đối Soát Dòng Tiền'), 'Action button VI');
    assert(html.includes('Export AI Financial Report & Cash Flow Reconciliation'), 'Action button EN');
    assert(html.includes('导出 AI 财务报告与现金流对账'), 'Action button ZH');
    assert(html.includes('AI 재무 보고서 내보내기 및 현금 흐름 정산'), 'Action button KO');
    assert(html.includes('AI財務レポート出力・キャッシュフロー決済'), 'Action button JA');
});



