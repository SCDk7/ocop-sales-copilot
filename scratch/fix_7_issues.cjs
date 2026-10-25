const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const indexPath = path.join(baseDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('--- STARTING FIX FOR 7 ISSUES ---');
console.log('Current index.html length:', html.length);

// =========================================================================
// 1. DIỆT TẬN GỐC HIỆN TƯỢNG F5 BỊ NHÁY MÀU XANH LÁ CŨ (ZERO FLASH ON RELOAD)
// =========================================================================
// Insert <link rel="stylesheet" href="skytech-complete.css"> right before </head>
if (!html.includes('<link rel="stylesheet" href="skytech-complete.css">\n</head>')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="skytech-complete.css">\n</head>');
    console.log('✓ Step 1a: Added skytech-complete.css right before </head>');
}

// In <head> style, replace dark green background of body > header
html = html.replace(
    'body > header {\n            background: rgba(7, 18, 14, 0.97) !important;',
    'body > header {\n            background: #FFFFFF !important;'
);
html = html.replace(
    'body > header a h1 { color: #6ee7b7 !important; }',
    'body > header a h1 { color: #0284C7 !important; }'
);
html = html.replace(
    'body > header a p { color: #d4af37 !important; }',
    'body > header a p { color: #64748B !important; }'
);
console.log('✓ Step 1b: Neutralized early header styles in <head>');

// =========================================================================
// 2. SỬA BẢNG QUẢN TRỊ DOANH THU: ĐỔI MÀU SÁNG & SỬA NÚT THOÁT
// =========================================================================
// Fix closeFinancialDashboardModal function in index.html
const oldCloseFinFunc = /function closeFinancialDashboardModal\(\)\s*\{[\s\S]*?restorePageScrollState\(\);\s*\}/;
const newCloseFinFunc = `function closeFinancialDashboardModal() {
            const modal = document.getElementById('ai-financial-modal');
            if (modal) {
                modal.style.setProperty('display', 'none', 'important');
                modal.classList.add('hidden');
            }
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            if (typeof restorePageScrollState === 'function') {
                restorePageScrollState();
            }
        }`;

if (oldCloseFinFunc.test(html)) {
    html = html.replace(oldCloseFinFunc, newCloseFinFunc);
    console.log('✓ Step 2a: closeFinancialDashboardModal updated to enforce display:none !important');
} else {
    console.warn('✗ Step 2a: oldCloseFinFunc did not match');
}

// Add sticky red close button inside ai-financial-modal header
const finHeaderTarget = `<div class="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-ocopGreen to-slate-900 text-white rounded-t-3xl flex items-center justify-between shadow-md">`;
const finHeaderReplacement = `<div class="p-4 sm:p-5 bg-sky-600 text-white rounded-t-3xl flex items-center justify-between shadow-md" style="background: #0284C7 !important;">
                <button type="button" onclick="closeFinancialDashboardModal()" id="btn-close-fin-modal-sticky" style="position: sticky; top: 12px; right: 12px; z-index: 999999; background: #EF4444 !important; color: #FFFFFF !important; padding: 8px 18px !important; border-radius: 999px !important; cursor: pointer; font-weight: 700 !important; border: none !important; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important; order: 99;">
                    <i class="fa-solid fa-xmark mr-1"></i> ✖ Đóng
                </button>`;

if (html.includes(finHeaderTarget)) {
    html = html.replace(finHeaderTarget, finHeaderReplacement);
    console.log('✓ Step 2b: Added sticky red close button in ai-financial-modal header');
}

// Update bottom close button of ai-financial-modal
html = html.replace(
    'class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black shadow-md transition cursor-pointer">Đóng Bảng Quản Trị</button>',
    'class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md transition cursor-pointer" style="background: #EF4444 !important; color: #FFFFFF !important;">✖ Đóng Bảng Quản Trị</button>'
);
console.log('✓ Step 2c: Updated bottom close button');

// =========================================================================
// 3. SỬA MODAL ĐIỂM BÁN (ẢNH 5): BỎ ĐỐI SOÁT DÒNG TIỀN & THÊM HỎI AI ĐIỂM BÁN
// =========================================================================
// In openStoreLocator, update the buttons at footer
const oldStoreFooterBtns = `<button onclick="addToCart(\${p.id}); closeStoreLocator();" class="flex-1 sm:flex-initial bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-chart-line text-emerald-300"></i>
                            <span>\${({
                                vi: '📊 Đối Soát Dòng Tiền',
                                en: '📊 Analyze Cash Flow',
                                zh: '📊 分析现金流',
                                ko: '📊 현금 흐름 분석',
                                ja: '📊 キャッシュフロー分析'
                            })[currentLanguage] || '📊 Đối Soát Dòng Tiền'}</span>
                        </button>
                        <button onclick="closeStoreLocator(); toggleAIChat();" class="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-comments"></i>
                            <span>\${({
                                vi: 'Hỏi AI điểm bán',
                                en: 'Ask AI Showroom',
                                zh: '向 AI 咨询展厅',
                                ko: 'AI 매장 문의',
                                ja: 'AI 店舗案内'
                            })[currentLanguage] || 'Hỏi AI điểm bán'}</span>
                        </button>`;

const newStoreFooterBtns = `<button type="button" onclick="askAiAboutStore(\${p.id})" class="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer" style="background: #0284C7 !important; color: #FFFFFF !important;">
                            <i class="fa-solid fa-comments"></i>
                            <span>💬 Hỏi AI Điểm Bán & Mua Hàng</span>
                        </button>`;

if (html.includes(oldStoreFooterBtns)) {
    html = html.replace(oldStoreFooterBtns, newStoreFooterBtns);
    console.log('✓ Step 3a: Store modal footer buttons updated');
} else {
    // Regex replacement for flexibility
    const storeFooterRegex = /<button onclick="addToCart\(\$\{p\.id\}\); closeStoreLocator\(\);"[\s\S]*?<\/button>\s*<button onclick="closeStoreLocator\(\);\s*toggleAIChat\(\);"[\s\S]*?<\/button>/;
    if (storeFooterRegex.test(html)) {
        html = html.replace(storeFooterRegex, newStoreFooterBtns);
        console.log('✓ Step 3a (regex): Store modal footer buttons updated');
    } else {
        console.warn('✗ Step 3a: Store modal footer buttons not matched');
    }
}

// Add askAiAboutStore function to index.html
if (!html.includes('function askAiAboutStore(')) {
    const askAiFunc = `
        function askAiAboutStore(productId) {
            const p = (products || []).find(item => item.id === productId);
            closeStoreLocator();
            
            // Ensure chat is open
            const chatWin = document.getElementById('ai-chat-window');
            if (chatWin && (chatWin.classList.contains('hidden') || chatWin.style.display === 'none')) {
                toggleAIChat();
            }
            
            if (p) {
                const store = window.OcopStores ? window.OcopStores.getOcopStoreInfo(productId) : null;
                const storeName = store ? store.primaryStore.name : ('Showroom OCOP ' + p.region);
                const storeAddr = store ? store.primaryStore.address : ('Địa chỉ tại ' + p.region);
                const storePhone = store ? (store.primaryStore.phone || store.hotline) : '1900 888 688';
                
                setTimeout(() => {
                    const input = document.getElementById('ai-chat-input');
                    if (input) input.value = 'Chỉ đường & liên hệ mua ' + p.name;
                    if (typeof sendAIMessage === 'function') sendAIMessage();
                }, 150);
            }
        }
        window.askAiAboutStore = askAiAboutStore;
    `;
    html = html.replace('function openStoreLocator(productId) {', askAiFunc + '\n        function openStoreLocator(productId) {');
    console.log('✓ Step 3b: Defined askAiAboutStore function');
}

// =========================================================================
// 4. KHÔI PHỤC CSKH & NÚT GẶP ADMIN TRỰC TIẾP TRONG CHATBOT
// =========================================================================
// In #ai-chat-quick-replies, add 👨💻 Gặp Admin / CSKH Trực Tiếp button
if (!html.includes('onclick="escalateToAdmin()"')) {
    const adminPill = `<button type="button" onclick="escalateToAdmin()" class="quick-reply-pill px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs shrink-0 cursor-pointer hover:bg-rose-100 transition" style="background: #FFF1F2 !important; color: #BE123C !important; border: 1px solid #FECDD3 !important; font-weight: 700 !important; white-space: nowrap !important;">
                    👨💻 Gặp Admin / CSKH Trực Tiếp
                </button>\n                `;
    html = html.replace('<div id="ai-chat-quick-replies" class="quick-replies-carousel', '<div id="ai-chat-quick-replies" class="quick-replies-carousel\n                ' + adminPill);
    console.log('✓ Step 4a: Added 👨💻 Gặp Admin / CSKH Trực Tiếp button to chat carousel');
}

// Define escalateToAdmin function in index.html
if (!html.includes('function escalateToAdmin()')) {
    const escalateFunc = `
        function escalateToAdmin() {
            const messagesEl = document.getElementById('ai-chat-messages');
            if (!messagesEl) return;
            
            const adminMsgId = 'ai-admin-escalation-' + Date.now();
            const adminHtml = \`
                <div class="flex items-start space-x-2 animate-fade-in" id="\${adminMsgId}">
                    <div class="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs shadow shrink-0">
                        <i class="fa-solid fa-headset"></i>
                    </div>
                    <div class="bg-white p-4 rounded-2xl border border-sky-200 text-slate-800 shadow-sm leading-relaxed max-w-[92%] space-y-3">
                        <p class="font-bold text-sky-900 text-xs leading-relaxed">
                            💡 Câu hỏi của bạn cần sự hỗ trợ chuyên sâu hơn. Hệ thống đã chuyển tiếp yêu cầu của bạn đến <strong class="text-rose-600">Đội ngũ Admin CSKH Trực tuyến</strong>! Bạn có thể nhắn trực tiếp tại đây hoặc liên hệ ngay với Admin phụ trách bên dưới để được giải đáp tức thì:
                        </p>
                        
                        <div class="space-y-2 pt-1 text-xs">
                            <!-- Admin 1 -->
                            <div class="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-[10px] flex items-center justify-center">1</span>
                                    <div>
                                        <strong class="text-sky-950 block text-xs">Admin 1 • Hỗ trợ Điểm bán & Đơn hàng</strong>
                                        <span class="text-[10.5px] text-slate-500">Hotline: 0912 345 678</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <a href="tel:0912345678" class="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[10.5px] font-bold">Gọi ngay</a>
                                    <a href="https://zalo.me/0912345678" target="_blank" class="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10.5px] font-bold">Zalo</a>
                                </div>
                            </div>

                            <!-- Admin 2 -->
                            <div class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center">2</span>
                                    <div>
                                        <strong class="text-amber-950 block text-xs">Admin 2 • Tư vấn Quà tặng Doanh nghiệp B2B</strong>
                                        <span class="text-[10.5px] text-slate-500">Hotline: 0918 888 688</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <a href="tel:0918888688" class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10.5px] font-bold">Gọi ngay</a>
                                    <a href="https://zalo.me/0918888688" target="_blank" class="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10.5px] font-bold">Zalo</a>
                                </div>
                            </div>

                            <!-- Admin 3 -->
                            <div class="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">3</span>
                                    <div>
                                        <strong class="text-emerald-950 block text-xs">Admin 3 • Hỗ trợ Kỹ thuật & Đăng ký HTX</strong>
                                        <span class="text-[10.5px] text-slate-500">Hotline: 0909 123 456</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <a href="tel:0909123456" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold">Gọi ngay</a>
                                    <a href="https://zalo.me/0909123456" target="_blank" class="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10.5px] font-bold">Zalo</a>
                                </div>
                            </div>

                            <!-- Admin 4 -->
                            <div class="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center">4</span>
                                    <div>
                                        <strong class="text-purple-950 block text-xs">Admin 4 • Chăm sóc Khách hàng 24/7</strong>
                                        <span class="text-[10.5px] text-slate-500">Tổng đài: 1900 888 688</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <a href="tel:1900888688" class="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10.5px] font-bold">Hotline</a>
                                    <button type="button" onclick="toggleAdminSupport()" class="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-bold">Messenger</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
            messagesEl.insertAdjacentHTML('beforeend', adminHtml);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }
        window.escalateToAdmin = escalateToAdmin;
    `;
    html = html.replace('async function sendAIMessage() {', escalateFunc + '\n        async function sendAIMessage() {');
    console.log('✓ Step 4b: Defined escalateToAdmin function');
}

// In sendAIMessage, check if message is asking for admin or CSKH
const adminCheckSnippet = `
            if (/gặp admin|gap admin|liên hệ admin|lien he admin|cskh|nhân viên|nhan vien|tư vấn viên|tu van vien|trực tiếp|truc tiep/i.test(text)) {
                setTimeout(() => {
                    const loading = document.getElementById(loadingId);
                    if (loading) loading.remove();
                    escalateToAdmin();
                    isAIRequestPending = false;
                    sendButton.disabled = false;
                    sendButton.removeAttribute('aria-busy');
                }, 400);
                return;
            }
`;
if (!html.includes('gap admin|liên hệ admin')) {
    html = html.replace('// Giả lập AI đang gõ', adminCheckSnippet + '\n            // Giả lập AI đang gõ');
    console.log('✓ Step 4c: Added admin intent interceptor in sendAIMessage');
}

// =========================================================================
// 5. SỬA LỖI MÀN HÌNH MỞ ĐẦU (ẢNH 2) & CẮT NÉT CHỮ T Ở HERO (ẢNH 3)
// =========================================================================
// 5a. Remove duplicate button in intro header
// In intro header:
const introSkipBtnTarget = `<button id="intro-skip-button" onclick="enterOcopMarket('all')" class="intro-mega-btn px-4 py-1.5 rounded-full text-xs font-black transition flex items-center space-x-1.5 shadow-md cursor-pointer">`;
if (html.includes(introSkipBtnTarget)) {
    // Find the end of this button tag and remove it
    const startIdx = html.indexOf(introSkipBtnTarget);
    const endIdx = html.indexOf('</button>', startIdx) + 9;
    html = html.slice(0, startIdx) + html.slice(endIdx);
    console.log('✓ Step 5a: Removed duplicate yellow button in intro header');
}

// 5b. Fix intro pillar 3 (replace AI Financial Engine on outer intro with Gift consulting)
html = html.replace(
    '<span class="block text-xs font-black text-amber-100" id="i18n-intro-pillar3">AI Financial Engine</span>\n                    <span class="block text-[10px] text-cyan-300/80 font-medium" id="i18n-intro-pillar3-sub">Tự động tính toán doanh thu & tiền lời ròng.</span>',
    '<span class="block text-xs font-black text-amber-100" id="i18n-intro-pillar3">Tư Vấn Đặc Sản & Giỏ Quà OCOP</span>\n                    <span class="block text-[10px] text-cyan-300/80 font-medium" id="i18n-intro-pillar3-sub">Gợi ý giỏ quà doanh nghiệp B2B & đặc sản 63 tỉnh thành.</span>'
);

// 5c. Fix intro description text
html = html.replace(
    'tự động hóa vận hành, quản trị doanh thu, tiền lời, chiết khấu real-time',
    'kết nối chuỗi cung ứng số, quảng bá đặc sản và định vị thương hiệu OCOP'
);
console.log('✓ Step 5b & 5c: Updated intro pillar 3 and intro description');

// 5d. Fix hero title letter T cut off
html = html.replace(
    '<span id="i18n-hero-title1" data-legacy="Bản Đồ Số OCOP," class="whitespace-nowrap" style="color: #0F172A !important;">Tinh Hoa Đặc Sản OCOP Việt</span>',
    '<span id="i18n-hero-title1" data-legacy="Bản Đồ Số OCOP," class="whitespace-nowrap" style="color: #0F172A !important; padding-left: 4px !important; overflow: visible !important; display: inline-block !important;">Tinh Hoa Đặc Sản OCOP Việt</span>'
);
console.log('✓ Step 5d: Added padding-left and overflow:visible to hero title1');

// 5e. Fix hero feature 4 description
html = html.replace(
    'Bảo chứng pháp lý & nguồn gốc xuất xứ chính hãng 63 tỉnh thành',
    '100% sản phẩm có quyết định công nhận sao OCOP chính quy'
);
html = html.replace(
    'Hỗ trợ HTX tính giá vốn, chiết khấu và tối ưu dòng tiền',
    '100% sản phẩm có quyết định công nhận sao OCOP chính quy'
);
console.log('✓ Step 5e: Updated hero feature 4 subtitle to official OCOP certification');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html saved! New length:', html.length);

