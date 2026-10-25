const fs = require('fs');

console.log('=== UPDATING skytech-complete.js and skytech-complete.css ===');

// ==========================================
// 1. UPDATE skytech-complete.js
// ==========================================
let skyJs = fs.readFileSync('skytech-complete.js', 'utf8');

// A. Update setupVietnamMapPreservation() to trigger resize multiple times
const oldMapPreserve = `    function setupVietnamMapPreservation() {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            if (window.provinceMap && typeof window.provinceMap.invalidateSize === 'function') {
                window.provinceMap.invalidateSize();
            }
            const statusEl = document.getElementById('province-selection-status');
            if (statusEl && statusEl.textContent.includes('Đang tải')) {
                statusEl.textContent = 'Bản đồ số 63 tỉnh thành sẵn sàng';
            }
        }, 350);
    }`;

const newMapPreserve = `    function setupVietnamMapPreservation() {
        function refreshMap() {
            window.dispatchEvent(new Event('resize'));
            if (window.provinceMap && typeof window.provinceMap.invalidateSize === 'function') {
                window.provinceMap.invalidateSize();
            }
            const mapEl = document.getElementById('province-map');
            if (mapEl) {
                mapEl.style.background = '#E0F2FE';
            }
            const statusEl = document.getElementById('province-selection-status');
            if (statusEl && statusEl.textContent.includes('Đang tải')) {
                statusEl.textContent = 'Bản đồ số 63 tỉnh thành sẵn sàng';
                statusEl.style.color = '#0369A1';
            }
        }
        setTimeout(refreshMap, 100);
        setTimeout(refreshMap, 350);
        setTimeout(refreshMap, 800);
        setTimeout(refreshMap, 1500);
    }`;

if (skyJs.includes(oldMapPreserve)) {
    skyJs = skyJs.replace(oldMapPreserve, newMapPreserve);
    console.log('✓ Updated setupVietnamMapPreservation in skytech-complete.js');
}

// B. Update enhanceProductCardElements() so it doesn't double-add buttons
const oldEnhance = `    function enhanceProductCardElements() {
        const cards = document.querySelectorAll('#product-grid > div');
        cards.forEach(card => {
            // Remove any AI story buttons on all cards
            card.querySelectorAll('.btn-card-ai-story').forEach(btn => btn.remove());

            let cluster = card.querySelector('.product-action-cluster');
            if (cluster) {
                const storeBtn = cluster.querySelector('.btn-card-store');
                if (storeBtn) {
                    storeBtn.innerHTML = '<i class="fa-solid fa-location-dot mr-1.5"></i><span>📍 Xem Điểm Bán & Liên Hệ</span>';
                    storeBtn.style.cssText = 'width: 100% !important; background: linear-gradient(135deg, #0284C7, #0EA5E9) !important; color: #FFFFFF !important; font-weight: 700 !important; padding: 10px 16px !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important; cursor: pointer !important;';
                }
                cluster.style.cssText = 'display: block !important; width: 100% !important; margin-top: 10px !important;';
                return;
            }

            let productId = null;
            const actionBtn = card.querySelector('[onclick*="activateProductReconciliation"]');
            if (actionBtn) {
                const match = actionBtn.getAttribute('onclick')?.match(/\\d+/);
                if (match) productId = parseInt(match[0], 10);
            }

            if (!productId) {
                const storeBtn = card.querySelector('[onclick*="openStoreLocator"]');
                if (storeBtn) {
                    const match = storeBtn.getAttribute('onclick')?.match(/\\d+/);
                    if (match) productId = parseInt(match[0], 10);
                }
            }

            if (!productId) return;

            cluster = document.createElement('div');
            cluster.className = 'product-action-cluster';
            cluster.style.cssText = 'display: block !important; width: 100% !important; margin-top: 10px !important;';
            cluster.innerHTML = \`
                <button type="button" class="btn-card-store" onclick="openStoreLocator(\${productId})" style="width: 100% !important; background: linear-gradient(135deg, #0284C7, #0EA5E9) !important; color: #FFFFFF !important; font-weight: 700 !important; padding: 10px 16px !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important; cursor: pointer !important;">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>📍 Xem Điểm Bán & Liên Hệ</span>
                </button>
            \`;

            const footer = card.querySelector('.product-card-footer') || card;
            footer.appendChild(cluster);
        });
    }`;

const newEnhance = `    function enhanceProductCardElements() {
        const cards = document.querySelectorAll('#product-grid > div');
        cards.forEach(card => {
            // Remove any AI story buttons on all cards
            card.querySelectorAll('.btn-card-ai-story').forEach(btn => btn.remove());

            // Check if card footer already has the full-width store button
            const existingStoreBtn = card.querySelector('.product-card-footer .btn-card-store, .product-action-cluster .btn-card-store');
            if (existingStoreBtn) {
                existingStoreBtn.innerHTML = '<i class="fa-solid fa-location-dot mr-1.5"></i><span>📍 Xem Điểm Bán & Liên Hệ</span>';
                existingStoreBtn.style.cssText = 'width: 100% !important; background: linear-gradient(135deg, #0284C7, #0EA5E9) !important; color: #FFFFFF !important; font-weight: 700 !important; padding: 10px 16px !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important; cursor: pointer !important; border: none !important; font-size: 13px !important;';
                return;
            }

            let productId = null;
            const actionBtn = card.querySelector('[onclick*="activateProductReconciliation"]');
            if (actionBtn) {
                const match = actionBtn.getAttribute('onclick')?.match(/\\d+/);
                if (match) productId = parseInt(match[0], 10);
            }

            if (!productId) {
                const storeBtn = card.querySelector('[onclick*="openStoreLocator"]');
                if (storeBtn) {
                    const match = storeBtn.getAttribute('onclick')?.match(/\\d+/);
                    if (match) productId = parseInt(match[0], 10);
                }
            }

            if (!productId) return;

            const cluster = document.createElement('div');
            cluster.className = 'product-action-cluster';
            cluster.style.cssText = 'display: block !important; width: 100% !important; margin-top: 10px !important;';
            cluster.innerHTML = \`
                <button type="button" class="btn-card-store" onclick="openStoreLocator(\${productId})" style="width: 100% !important; background: linear-gradient(135deg, #0284C7, #0EA5E9) !important; color: #FFFFFF !important; font-weight: 700 !important; padding: 10px 16px !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important; cursor: pointer !important; border: none !important; font-size: 13px !important;">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>📍 Xem Điểm Bán & Liên Hệ</span>
                </button>
            \`;

            const footer = card.querySelector('.product-card-footer') || card;
            footer.appendChild(cluster);
        });
    }`;

if (skyJs.includes(oldEnhance)) {
    skyJs = skyJs.replace(oldEnhance, newEnhance);
    console.log('✓ Updated enhanceProductCardElements in skytech-complete.js');
}

// C. Update enrichWebmasterRevenueData in skytech-complete.js: set label colors to #1E293B
skyJs = skyJs.replace(
    `if (title) title.textContent = 'TỔNG DOANH THU BÁN HÀNG GIÚP CÁC CỬA HÀNG';`,
    `if (title) { title.textContent = 'TỔNG DOANH THU BÁN HÀNG GIÚP CÁC CỬA HÀNG'; title.style.color = '#1E293B'; title.style.fontWeight = '700'; }`
);
skyJs = skyJs.replace(
    `if (title) title.textContent = 'LỢI NHUẬN RÒNG CỦA CÁC ĐƠN VỊ / HTX ĐỐI TÁC';`,
    `if (title) { title.textContent = 'LỢI NHUẬN RÒNG CỦA CÁC ĐƠN VỊ / HTX ĐỐI TÁC'; title.style.color = '#1E293B'; title.style.fontWeight = '700'; }`
);
skyJs = skyJs.replace(
    `if (title) title.textContent = '💰 TIỀN LỜI RÒNG CỦA CHỦ WEB (HOA HỒNG QUẢNG BÁ)';`,
    `if (title) { title.textContent = '💰 TIỀN LỜI RÒNG CỦA CHỦ WEB (HOA HỒNG QUẢNG BÁ)'; title.style.color = '#1E293B'; title.style.fontWeight = '700'; }`
);
skyJs = skyJs.replace(
    `if (title4) title4.textContent = 'TỔNG ĐƠN HÀNG KẾT NỐI QUA NỀN TẢNG';`,
    `if (title4) { title4.textContent = 'TỔNG ĐƠN HÀNG KẾT NỐI QUA NỀN TẢNG'; title4.style.color = '#1E293B'; title4.style.fontWeight = '700'; }`
);

fs.writeFileSync('skytech-complete.js', skyJs, 'utf8');
console.log('✓ Written skytech-complete.js');


// ==========================================
// 2. UPDATE skytech-complete.css
// ==========================================
let skyCss = fs.readFileSync('skytech-complete.css', 'utf8');

// Replace the end of skytech-complete.css with the comprehensive polish rules
const comprehensiveStyles = `
/* ==========================================================================
   FINAL POLISH STYLES V2 (4 CORE SECTIONS ENFORCED)
   ========================================================================== */

/* --- 1. MÀN HÌNH ĐẦU TIÊN (INTRO SCREEN) & BẢN ĐỒ VIỆT NAM --- */
#ocop-intro-overlay,
#intro-content,
.intro-screen {
    background: linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 50%, #FFFFFF 100%) !important;
    color: #0F172A !important;
}

#ocop-intro-overlay h1,
#ocop-intro-overlay h2,
#i18n-intro-title1 {
    color: #0C4A6E !important;
    font-weight: 900 !important;
}

#i18n-intro-title2,
.intro-gold-gradient {
    color: #0284C7 !important;
    background: none !important;
    -webkit-text-fill-color: #0284C7 !important;
    font-weight: 800 !important;
}

#i18n-intro-desc {
    color: #1E293B !important;
    font-weight: 500 !important;
}

#intro-award-badge,
.intro-seal-badge {
    background: #E0F2FE !important;
    border: 1px solid #7DD3FC !important;
    color: #0369A1 !important;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.1) !important;
}

#intro-award-badge span,
#i18n-intro-award {
    color: #0369A1 !important;
    font-weight: 800 !important;
}

.intro-pillars > div,
.intro-card-glass,
#intro-features > div,
.intro-feature-card {
    background: #FFFFFF !important;
    border: 1.5px solid #BAE6FD !important;
    border-radius: 16px !important;
    box-shadow: 0 4px 16px rgba(2, 132, 199, 0.08) !important;
    color: #0F172A !important;
}

.intro-pillars span[id*="i18n-intro-pillar"]:not([id*="sub"]) {
    color: #0369A1 !important;
    font-weight: 800 !important;
}

.intro-pillars span[id*="i18n-intro-pillar"][id*="sub"] {
    color: #334155 !important;
    font-weight: 500 !important;
}

#intro-lucky-card,
.lucky-golden-box {
    background: #FFFFFF !important;
    border: 1.5px solid #BAE6FD !important;
    border-radius: 20px !important;
    box-shadow: 0 4px 16px rgba(2, 132, 199, 0.08) !important;
    color: #0F172A !important;
}

#intro-lucky-card span,
#intro-lucky-card strong {
    color: #0369A1 !important;
    font-weight: 800 !important;
}

#intro-lucky-card p {
    color: #334155 !important;
    font-weight: 500 !important;
}

#btn-draw-gift {
    background: linear-gradient(135deg, #0284C7, #0EA5E9) !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25) !important;
}

.intro-regions,
.intro-map-console {
    background: #FFFFFF !important;
    border: 1.5px solid #7DD3FC !important;
    border-radius: 24px !important;
    box-shadow: 0 10px 30px rgba(2, 132, 199, 0.12) !important;
    color: #0F172A !important;
}

.intro-regions .intro-region-kicker,
.intro-regions #i18n-intro-region-header {
    color: #0C4A6E !important;
    font-weight: 800 !important;
}

.intro-regions .intro-region-caption,
.intro-regions #i18n-intro-region-caption {
    color: #334155 !important;
    font-weight: 600 !important;
}

#province-map,
.province-map,
.province-map .leaflet-container,
#province-map .leaflet-container {
    background: #E0F2FE !important;
    border: 1.5px solid #7DD3FC !important;
    border-radius: 18px !important;
    overflow: hidden !important;
    box-shadow: 0 6px 20px rgba(2, 132, 199, 0.1) !important;
    min-height: 380px !important;
}

#province-selection-status {
    color: #0369A1 !important;
    font-weight: 700 !important;
}

/* --- 2. KHU VỰC SẢN PHẨM & BỘ LỌC BÊN TRONG --- */
#catalog-main-content > div:first-child,
.catalog-control-toolbar {
    background: #FFFFFF !important;
    border: 1.5px solid #BAE6FD !important;
    color: #0F172A !important;
    box-shadow: 0 4px 16px rgba(2, 132, 199, 0.08) !important;
}

#system-status-indicator,
#system-status-indicator span,
#catalog-main-content > div:first-child span {
    color: #0F172A !important;
}

#product-count-badge {
    color: #0284C7 !important;
    background: #E0F2FE !important;
    border: 1px solid #BAE6FD !important;
    font-weight: 800 !important;
}

#search-status-text {
    color: #0369A1 !important;
    font-weight: 800 !important;
}

#catalog-sidebar div:has(#i18n-cat-header) {
    background: #E0F2FE !important;
    border: 1px solid #BAE6FD !important;
    color: #0369A1 !important;
}

#i18n-cat-header {
    color: #0369A1 !important;
    font-weight: 800 !important;
}

#i18n-macro-region-title,
#catalog-sidebar .text-amber-300,
#catalog-sidebar h3,
#catalog-sidebar h4,
#catalog-sidebar [id*="i18n"] {
    color: #0C4A6E !important;
    font-weight: 800 !important;
}

.product-card .mx-3.mb-2,
.product-card .store-info-box,
.product-card-store-box {
    background: #F0F9FF !important;
    border: 1px solid #BAE6FD !important;
    border-radius: 12px !important;
}

[data-review-summary],
[data-review-summary] button,
[data-review-summary] i {
    color: #D97706 !important;
    font-weight: 700 !important;
}

.product-card span[class*="bg-amber-400"] {
    background: #FEF3C7 !important;
    color: #D97706 !important;
    border: 1px solid #FDE68A !important;
    font-weight: 700 !important;
}

.product-card-footer {
    background: #FFFFFF !important;
    border-top: 1px solid #BAE6FD !important;
    padding: 10px 12px !important;
}

.product-card-footer > div:has([onclick*="openQuickView"]),
.product-card-footer .product-sys-metrics,
.product-card-footer div:has([onclick*="activateProductReconciliation"]),
.product-card-footer button[onclick*="openQuickView"],
.btn-card-ai-story {
    display: none !important;
}

.btn-card-store {
    width: 100% !important;
    background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%) !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    padding: 10px 16px !important;
    border-radius: 12px !important;
    border: none !important;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    text-align: center !important;
    font-size: 13px !important;
}

.btn-card-store:hover {
    background: linear-gradient(135deg, #0369A1 0%, #0284C7 100%) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 18px rgba(2, 132, 199, 0.35) !important;
}

/* --- 3. POPUP MẠNG LƯỚI ĐIỂM BÁN & CỬA HÀNG (ẢNH 2) --- */
#ocop-store-modal > div {
    background: #FFFFFF !important;
    border: 2px solid #7DD3FC !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 60px rgba(2, 132, 199, 0.18) !important;
    color: #0F172A !important;
}

#ocop-store-modal .modal-header,
#ocop-store-modal .bg-gradient-to-r.from-emerald-900 {
    background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;
    color: #FFFFFF !important;
}

#ocop-store-modal .space-y-3 > div,
#ocop-store-modal div:has(> img[alt]) {
    background: #FFFFFF !important;
    border: 1.5px solid #BAE6FD !important;
    border-radius: 16px !important;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.06) !important;
}

#ocop-store-modal .producer-box,
#ocop-store-modal .bg-gradient-to-br,
#ocop-store-modal div:has(i.fa-landmark) {
    background: #F0F9FF !important;
    border: 1.5px solid #7DD3FC !important;
    border-radius: 16px !important;
    color: #0F172A !important;
}

#ocop-store-modal div:has(i.fa-landmark) span,
#ocop-store-modal div:has(i.fa-landmark) strong {
    color: #0F172A !important;
}

#ocop-store-modal span[class*="bg-emerald-100"],
#ocop-store-modal span[class*="bg-blue-50"] {
    background: #E0F2FE !important;
    color: #0369A1 !important;
    font-weight: 700 !important;
    border: 1px solid #BAE6FD !important;
}

#ocop-store-modal .text-gray-500.font-bold,
#ocop-store-modal .p-3\\.5.rounded-2xl span {
    color: #0C4A6E !important;
    font-weight: 700 !important;
}

#ocop-store-modal a[href*="maps"],
#ocop-store-modal a[href*="google.com/maps"] {
    color: #0284C7 !important;
    font-weight: 700 !important;
}

#ocop-store-modal a[href*="tel:"] {
    color: #D97706 !important;
    font-weight: 700 !important;
}

/* --- 4. BẢNG QUẢN TRỊ DOANH THU (AI FINANCIAL MODAL) --- */
#ai-financial-modal > div:last-child {
    background: #F8FAFC !important;
    border: 2px solid #7DD3FC !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 60px rgba(2, 132, 199, 0.18) !important;
    color: #0F172A !important;
}

#ai-financial-modal h3 {
    color: #FFFFFF !important;
    font-weight: 900 !important;
}

#ai-financial-modal h4 {
    color: #0C4A6E !important;
    font-size: 1.1rem !important;
    font-weight: 800 !important;
}

#ai-financial-modal div[style*="background:#E0F2FE"],
#ai-financial-modal div:has(i.fa-lock) {
    background: #E0F2FE !important;
    color: #0F172A !important;
    border: 1px solid #BAE6FD !important;
}

#ai-financial-modal div:has(i.fa-lock) strong,
#ai-financial-modal div:has(i.fa-lock) span {
    color: #0F172A !important;
}

#ai-financial-modal .grid-cols-4 span.text-xs,
#ai-financial-modal .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 span.text-xs {
    color: #1E293B !important;
    font-weight: 700 !important;
    font-size: 0.78rem !important;
}

#ai-financial-modal .grid-cols-1.md\\:grid-cols-3 > div {
    background: #FFFFFF !important;
    border: 1px solid #BAE6FD !important;
    border-radius: 14px !important;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.06) !important;
}

#ai-financial-modal .grid-cols-1.md\\:grid-cols-3 h5 {
    color: #0F172A !important;
    font-weight: 800 !important;
}

#ai-financial-modal .grid-cols-1.md\\:grid-cols-3 p {
    color: #334155 !important;
    font-weight: 500 !important;
}

#ai-financial-modal table {
    background: #FFFFFF !important;
    color: #0F172A !important;
}

#ai-financial-modal thead th {
    background: #F0F9FF !important;
    color: #0369A1 !important;
    border-bottom: 1.5px solid #BAE6FD !important;
    font-weight: 700 !important;
}

#ai-financial-modal tbody td {
    color: #0F172A !important;
    border-bottom: 1px solid #F1F5F9 !important;
}

#ai-financial-modal tbody tr:hover {
    background: #F0F9FF !important;
}

#ai-financial-modal button[onclick*="playVoiceFinancialBriefing"] {
    display: none !important;
}
`;

const posPolish = skyCss.indexOf('FINAL POLISH STYLES');
if (posPolish !== -1) {
    skyCss = skyCss.slice(0, posPolish) + comprehensiveStyles;
} else {
    skyCss += '\n' + comprehensiveStyles;
}

fs.writeFileSync('skytech-complete.css', skyCss, 'utf8');
console.log('✓ Written skytech-complete.css');
console.log('=== DONE ===');

