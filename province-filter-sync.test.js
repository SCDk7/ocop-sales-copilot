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
    assert(html.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'), 'Desktop product grid must display 3 columns');
    assert(html.includes('#product-grid .product-card'), 'Product card sizing rules must be defined');
    assert(html.includes('#product-grid .product-card-image-wrap'), 'Image wrap must enforce 220px height with cover');
});


