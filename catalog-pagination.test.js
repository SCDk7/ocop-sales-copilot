const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Catalog pagination toolbar replaces load more button with page numbers', () => {
    const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');

    // 1. Check pagination functions and variables exist
    assert.match(html, /let\s+currentCatalogPage\s*=\s*1;/);
    assert.match(html, /const\s+PRODUCT_PAGE_SIZE\s*=\s*36;/);
    assert.match(html, /function\s+goToCatalogPage\s*\(/);
    assert.match(html, /window\.goToCatalogPage\s*=\s*goToCatalogPage;/);

    // 2. Check that the old load more button is replaced by the pagination nav
    assert.doesNotMatch(html, /👇 Xem thêm sản phẩm/);
    assert.match(html, /aria-label="Phân trang danh mục đặc sản OCOP"/);
    assert.match(html, /catalog-page-btn/);
    assert.match(html, /catalog-page-nav-btn/);

    // 3. Slicing pagination logic
    assert.match(html, /const startIndex = \(currentCatalogPage - 1\) \* PRODUCT_PAGE_SIZE;/);
    assert.match(html, /const endIndex = Math\.min\(startIndex \+ PRODUCT_PAGE_SIZE, items\.length\);/);
    assert.match(html, /const visibleItems = items\.slice\(startIndex, endIndex\);/);

    // 4. Check index_2.html also has pagination
    const html2 = fs.readFileSync(path.resolve('index_2.html'), 'utf-8');
    assert.match(html2, /function\s+goToCatalogPage\s*\(/);
    assert.match(html2, /aria-label="Phân trang danh mục đặc sản OCOP"/);
});

