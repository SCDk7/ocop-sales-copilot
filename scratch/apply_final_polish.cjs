const fs = require('fs');

console.log('=== STARTING FINAL POLISH FOR OCOP SALES COPILOT ===');

// ==========================================
// 1. UPDATE index.html
// ==========================================
let html = fs.readFileSync('index.html', 'utf8');

// A. Fix the quick-replies opening div syntax error
const quickRepliesBroken = `<div id="ai-chat-quick-replies" class="quick-replies-carousel
                <button type="button" onclick="escalateToAdmin()" class="quick-reply-pill px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs shrink-0 cursor-pointer hover:bg-rose-100 transition" style="background: #FFF1F2 !important; color: #BE123C !important; border: 1px solid #FECDD3 !important; font-weight: 700 !important; white-space: nowrap !important;">
                    👨💻 Gặp Admin / CSKH Trực Tiếp
                </button>
                 p-2 bg-[#0a100d] border-t border-amber-400/20 flex items-center gap-2 overflow-x-auto text-[11px] font-bold">`;

const quickRepliesFixed = `<div id="ai-chat-quick-replies" class="quick-replies-carousel p-2 bg-[#0a100d] border-t border-amber-400/20 flex items-center gap-2 overflow-x-auto text-[11px] font-bold">
                <button type="button" onclick="escalateToAdmin()" class="quick-reply-pill px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs shrink-0 cursor-pointer hover:bg-rose-100 transition" style="background: #FFF1F2 !important; color: #BE123C !important; border: 1px solid #FECDD3 !important; font-weight: 700 !important; white-space: nowrap !important;">
                    👨💻 Gặp Admin / CSKH Trực Tiếp
                </button>`;

if (html.includes(quickRepliesBroken)) {
    html = html.replace(quickRepliesBroken, quickRepliesFixed);
    console.log('✓ Fixed quick-replies div syntax error in index.html');
} else {
    console.log('• Quick replies div already clean or not matching exact snippet');
}

// B. Update greeting & guidance in index.html to clean, professional customer-facing text
const oldGreeting = `<p class="font-bold text-ocopGreen" id="chat-greeting">Xin chào! Tôi là AI OCOP Sales Copilot — Đại sứ Văn hóa số hóa 252 đặc sản OCOP 63 tỉnh thành, tư vấn quà tặng B2B, chỉ đường Showroom O2O và Trợ lý Quản trị Tài chính AI cho HTX.</p>`;
const newGreeting = `<p class="font-bold text-ocopGreen" id="chat-greeting">Xin chào! Tôi là AI OCOP Sales Copilot — Đồng hành cùng bạn khám phá tinh hoa 252 đặc sản OCOP 63 tỉnh thành, tra cứu mạng lưới điểm bán chính hãng và tư vấn giỏ quà tặng doanh nghiệp.</p>`;

if (html.includes(oldGreeting)) {
    html = html.replace(oldGreeting, newGreeting);
    console.log('✓ Updated chat-greeting in index.html');
}

const oldGuidance = `<p class="mt-1.5" id="chat-guidance">Anh/chị có thể nhập tên đặc sản, tỉnh thành (ưu tiên Đồng Nai) hoặc chọn các đề xuất tư vấn & đối soát bên dưới nhé.</p>`;
const newGuidance = `<p class="mt-1.5" id="chat-guidance">Bạn có thể nhập tên đặc sản, tỉnh thành cần tìm hoặc chọn nhanh các đề xuất gợi ý bên dưới nhé!</p>`;

if (html.includes(oldGuidance)) {
    html = html.replace(oldGuidance, newGuidance);
    console.log('✓ Updated chat-guidance in index.html');
}

// C. Hide duplicate verification bar in chat
if (html.includes('id="chat-verification-bar"') && !html.includes('id="chat-verification-bar" style="display: none !important;"')) {
    html = html.replace('id="chat-verification-bar"', 'id="chat-verification-bar" style="display: none !important;"');
    console.log('✓ Hidden duplicate chat-verification-bar in index.html');
}

// D. Update chat input placeholder
html = html.replace(
    'placeholder="Nhập tên sản phẩm hoặc tỉnh thành để AI phân tích dòng tiền..."',
    'placeholder="Nhập tên sản phẩm hoặc tỉnh thành cần tìm..."'
);

// E. Update feat4 translation strings so language init doesn't revert to old financial text
html = html.replace(
    `'i18n-hero-feat4-desc': {\n                vi: 'Tự động hóa tính toán doanh thu, tiền lời thực tế và chiết khấu CHM',`,
    `'i18n-hero-feat4-desc': {\n                vi: '100% sản phẩm có quyết định công nhận sao OCOP chính quy',`
);
html = html.replace(
    `setText('i18n-hero-feat4-desc', {\n                vi: 'Tự động hóa tính toán doanh thu, tiền lời thực tế và chiết khấu CHM',`,
    `setText('i18n-hero-feat4-desc', {\n                vi: '100% sản phẩm có quyết định công nhận sao OCOP chính quy',`
);

// F. Ensure closeFinancialDashboardModal is exported to window
if (!html.includes('window.closeFinancialDashboardModal = closeFinancialDashboardModal;')) {
    html = html.replace(
        'function closeFinancialDashboardModal() {',
        'function closeFinancialDashboardModal() {\n            // close handler'
    );
    html = html.replace(
        'if (typeof restorePageScrollState === \'function\') {\n                restorePageScrollState();\n            }\n        }',
        'if (typeof restorePageScrollState === \'function\') {\n                restorePageScrollState();\n            }\n        }\n        window.closeFinancialDashboardModal = closeFinancialDashboardModal;'
    );
    console.log('✓ Exported window.closeFinancialDashboardModal in index.html');
}

// G. In ai-financial-modal, update dark inline styles to light theme
html = html.replace(
    `style="background: #062017 !important; border-top: 1px solid rgba(251, 191, 36, 0.3) !important; color: #fde68a !important;"`,
    `style="background: #F8FAFC !important; border-top: 1px solid #BAE6FD !important; color: #475569 !important;"`
);
html = html.replace(
    `style="background:rgba(6,36,22,0.85);color:#fde68a;"`,
    `style="background:#E0F2FE;color:#0369A1;border:1px solid #BAE6FD;"`
);
html = html.replace(
    `style="background: rgba(10, 26, 20, 0.9); border: 1px solid rgba(212, 175, 55, 0.4); backdrop-filter: blur(20px);"`,
    `style="background: #FFFFFF; border: 1px solid #BAE6FD; box-shadow: 0 6px 20px rgba(2, 132, 199, 0.08);"`
);

// H. Update intro pillar 3
html = html.replace(
    `<span class="block text-xs font-black text-amber-100" id="i18n-intro-pillar3">AI Financial Engine</span>\n                    <span class="block text-[10px] text-cyan-300/80 font-medium" id="i18n-intro-pillar3-sub">Tự động tính toán doanh thu & tiền lời ròng.</span>`,
    `<span class="block text-xs font-black text-amber-100" id="i18n-intro-pillar3">Tư Vấn Đặc Sản & Giỏ Quà OCOP</span>\n                    <span class="block text-[10px] text-cyan-300/80 font-medium" id="i18n-intro-pillar3-sub">Gợi ý combo quà tặng và hỗ trợ khách hàng.</span>`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Successfully written updated index.html');


