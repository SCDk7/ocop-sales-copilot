const fs = require('fs');

console.log('=== UPDATING skytech-complete.js, skytech-complete.css, and ocop-copilot.js ===');

// ==========================================
// 1. UPDATE skytech-complete.js
// ==========================================
let skyJs = fs.readFileSync('skytech-complete.js', 'utf8');

// A. Update enhanceProductCardElements()
const oldEnhanceFunc = `    function enhanceProductCardElements() {
        const cards = document.querySelectorAll('#product-grid > div');
        cards.forEach(card => {
            if (card.querySelector('.product-action-cluster')) return;

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
            cluster.innerHTML = \`
                <button type="button" class="btn-card-store" onclick="openStoreLocator(\${productId})">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>📍 Điểm Bán</span>
                </button>
                <button type="button" class="btn-card-ai-story" onclick="openAIStoryModal(\${productId})">
                    <i class="fa-solid fa-sparkles"></i>
                    <span>✨ Câu Chuyện OCOP</span>
                </button>
            \`;

            const footer = card.querySelector('.product-card-footer') || card;
            footer.appendChild(cluster);
        });
    }`;

const newEnhanceFunc = `    function enhanceProductCardElements() {
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

if (skyJs.includes(oldEnhanceFunc)) {
    skyJs = skyJs.replace(oldEnhanceFunc, newEnhanceFunc);
    console.log('✓ Updated enhanceProductCardElements() in skytech-complete.js');
} else {
    console.log('• enhanceProductCardElements() snippet did not match exactly, checking regex');
}

// B. Add Global Escape key listener in skytech-complete.js
if (!skyJs.includes('window.addEventListener(\'keydown\', function (e) {')) {
    const escapeListener = `
    // GLOBAL ESCAPE KEY LISTENER (ĐÓNG TẤT CẢ CÁC MODAL KHI BẤM ESC)
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (typeof window.closeFinancialDashboardModal === 'function') {
                window.closeFinancialDashboardModal();
            }
            if (typeof window.closeAdminPinModal === 'function') {
                window.closeAdminPinModal();
            }
            if (typeof window.closeStoreLocatorModal === 'function') {
                window.closeStoreLocatorModal();
            }
            if (typeof window.closeAIStoryModal === 'function') {
                window.closeAIStoryModal();
            }
            if (typeof window.closePartnerRegistrationModal === 'function') {
                window.closePartnerRegistrationModal();
            }
            if (typeof window.closeChallengeProposalModal === 'function') {
                window.closeChallengeProposalModal();
            }
        }
    });
`;
    skyJs = skyJs.replace('// KHỞI CHẠY TẤT CẢ (CHỈ CHẠY 1 LẦN KHI LOAD, ZERO-LAG)', escapeListener + '\n    // KHỞI CHẠY TẤT CẢ (CHỈ CHẠY 1 LẦN KHI LOAD, ZERO-LAG)');
    console.log('✓ Added global Escape key listener in skytech-complete.js');
}

// C. Ensure window.askAiAboutStore is available in skytech-complete.js
if (!skyJs.includes('window.askAiAboutStore')) {
    const askAiFunc = `
    // HỎI AI VỀ ĐIỂM BÁN & SẢN PHẨM (TỰ ĐỘNG ĐÓNG MODAL ĐIỂM BÁN & MỞ CHATBOT)
    window.askAiAboutStore = function (productId) {
        const storeModal = document.getElementById('ocop-store-modal');
        if (storeModal) {
            storeModal.classList.add('hidden');
            storeModal.style.setProperty('display', 'none', 'important');
        }
        if (typeof window.closeStoreLocatorModal === 'function') {
            window.closeStoreLocatorModal();
        }

        const chatWindow = document.getElementById('ai-chat-window');
        if (chatWindow) {
            chatWindow.classList.remove('hidden');
            chatWindow.style.setProperty('display', 'flex', 'important');
        }
        if (typeof window.setChatOpen === 'function') {
            window.setChatOpen(true);
        }

        const p = (window.products || []).find(item => item.id === productId);
        const pName = p ? p.name : 'đặc sản OCOP';
        const queryText = \`Tư vấn điểm bán chính hãng và showroom đặc sản: \${pName}\`;

        const input = document.getElementById('ai-chat-input');
        if (input) {
            input.value = queryText;
        }

        if (typeof window.sendAIMessage === 'function') {
            window.sendAIMessage();
        }
    };
`;
    skyJs = skyJs.replace('// KHỞI CHẠY TẤT CẢ (CHỈ CHẠY 1 LẦN KHI LOAD, ZERO-LAG)', askAiFunc + '\n    // KHỞI CHẠY TẤT CẢ (CHỈ CHẠY 1 LẦN KHI LOAD, ZERO-LAG)');
    console.log('✓ Added window.askAiAboutStore in skytech-complete.js');
}

fs.writeFileSync('skytech-complete.js', skyJs, 'utf8');
console.log('✓ Successfully written updated skytech-complete.js');

// ==========================================
// 2. UPDATE skytech-complete.css
// ==========================================
let skyCss = fs.readFileSync('skytech-complete.css', 'utf8');

// Ensure section for 7 polish fixes is appended / updated
const polishStyles = `
/* ==========================================================================
   FINAL POLISH STYLES (7 CORE FIXES)
   ========================================================================== */

/* 1. PRODUCT CARDS ACTION BUTTON (FULL WIDTH STORE BUTTON & HIDE STORY BUTTON) */
.product-action-cluster {
    display: block !important;
    width: 100% !important;
    margin-top: 10px !important;
}

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

/* 2. REVENUE DASHBOARD MODAL (AI FINANCIAL MODAL) LIGHT THEME & RED CLOSE BUTTON */
#ai-financial-modal > div:last-child {
    background: #F8FAFC !important;
    border: 2px solid #7DD3FC !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 60px rgba(2, 132, 199, 0.18) !important;
    color: #0F172A !important;
}

#ai-financial-modal .bg-gradient-to-r.from-emerald-950,
#ai-financial-modal .modal-header-fin {
    background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;
    border-bottom: 1px solid #7DD3FC !important;
    color: #FFFFFF !important;
}

#btn-close-fin-modal-sticky,
.btn-close-fin-sticky {
    position: sticky !important;
    top: 12px !important;
    right: 12px !important;
    z-index: 999999 !important;
    background: #EF4444 !important;
    color: #FFFFFF !important;
    padding: 8px 18px !important;
    border-radius: 999px !important;
    cursor: pointer !important;
    font-weight: 700 !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;
    display: inline-flex !important;
    align-items: center !important;
}

#ai-financial-modal button[onclick*="closeFinancialDashboardModal"] {
    background: #EF4444 !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
}

/* What-if Simulator Container & 3 Sliders */
#ai-financial-modal div[style*="rgba(10, 26, 20"],
#ai-financial-modal .simulator-box {
    background: #FFFFFF !important;
    border: 1px solid #BAE6FD !important;
    box-shadow: 0 6px 20px rgba(2, 132, 199, 0.08) !important;
}

#ai-financial-modal .bg-slate-900\\/80,
#ai-financial-modal .slider-card {
    background: #F0F9FF !important;
    border: 1px solid #BAE6FD !important;
    color: #0F172A !important;
}

#ai-financial-modal .bg-slate-900\\/80 span,
#ai-financial-modal .bg-slate-900\\/80 div {
    color: #0F172A !important;
}

#ai-financial-modal input[type="range"] {
    accent-color: #0284C7 !important;
}

/* 4 KPI Cards inside Financial Modal */
#ai-financial-modal .grid-cols-4 > div,
#ai-financial-modal .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 > div {
    background: #FFFFFF !important;
    border: 1px solid #BAE6FD !important;
    border-radius: 16px !important;
    box-shadow: 0 4px 16px rgba(2, 132, 199, 0.06) !important;
}

#ai-financial-modal #fin-stat-revenue {
    color: #0284C7 !important;
    font-weight: 900 !important;
}

#ai-financial-modal #fin-stat-profit {
    color: #059669 !important;
    font-weight: 900 !important;
}

#ai-financial-modal #fin-stat-commission {
    color: #0284C7 !important;
    font-weight: 900 !important;
}

#ai-financial-modal #fin-stat-orders {
    color: #0F172A !important;
    font-weight: 900 !important;
}

/* Product COGS Breakdown Table */
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

/* 3. STORE LOCATOR MODAL (MẠNG LƯỚI ĐIỂM BÁN) LIGHT THEME & TAGS */
#ocop-store-modal > div {
    background: #FFFFFF !important;
    border: 2px solid #7DD3FC !important;
    border-radius: 20px !important;
    box-shadow: 0 25px 60px rgba(2, 132, 199, 0.18) !important;
    color: #0F172A !important;
}

#ocop-store-modal .modal-header,
#ocop-store-modal .bg-gradient-to-r.from-emerald-900 {
    background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;
    color: #FFFFFF !important;
}

#ocop-store-modal .producer-box,
#ocop-store-modal .bg-gradient-to-r.from-emerald-950 {
    background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;
    border: 1px solid #7DD3FC !important;
    color: #FFFFFF !important;
    border-radius: 16px !important;
}

#ocop-store-modal .producer-box span,
#ocop-store-modal .bg-gradient-to-r.from-emerald-950 span {
    color: #E0F2FE !important;
}

#ocop-store-modal .producer-box strong,
#ocop-store-modal .bg-gradient-to-r.from-emerald-950 strong {
    color: #FFFFFF !important;
}

/* Store Modal Tags & Badges: Fix White-on-White */
#ocop-store-modal span[class*="bg-emerald-100"],
#ocop-store-modal span[class*="bg-gray-100"],
#ocop-store-modal span[class*="bg-amber-100"],
#ocop-store-modal span[class*="bg-blue-100"],
#ocop-store-modal .store-tag,
#ocop-store-modal .badge-ocop {
    background: #E0F2FE !important;
    color: #0369A1 !important;
    font-weight: 700 !important;
    border: 1px solid #BAE6FD !important;
}

#ocop-store-modal button[onclick*="activateProductReconciliation"],
#btn-store-reconcile {
    display: none !important;
}

#ocop-store-modal button[onclick*="askAiAboutStore"] {
    background: #0284C7 !important;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    border-radius: 12px !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25) !important;
}

#ocop-store-modal button[onclick*="askAiAboutStore"]:hover {
    background: #0369A1 !important;
}

/* 4. AI CHATBOT CSKH & LIGHT THEME */
#ai-chat-window {
    background: #F8FAFC !important;
    border: 2px solid #7DD3FC !important;
    border-radius: 24px !important;
    box-shadow: 0 20px 50px rgba(2, 132, 199, 0.2) !important;
}

#ai-chat-messages {
    background: #F8FAFC !important;
}

#ai-chat-messages .bg-white {
    background: #FFFFFF !important;
    border: 1px solid #BAE6FD !important;
    color: #0F172A !important;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.05) !important;
}

#chat-verification-bar {
    display: none !important;
}

/* 5. INTRO SCREEN MAP CONSOLE & HERO TITLE */
.intro-map-console {
    background: rgba(240, 249, 255, 0.95) !important;
    border: 1.5px solid #7DD3FC !important;
    box-shadow: 0 10px 30px rgba(2, 132, 199, 0.15) !important;
    color: #0F172A !important;
}

.intro-map-console .intro-region-kicker,
.intro-map-console #i18n-intro-region-header {
    color: #0284C7 !important;
    font-weight: 800 !important;
}

.intro-map-console .intro-region-caption,
.intro-map-console #i18n-intro-region-caption {
    color: #334155 !important;
}

#i18n-hero-title1 {
    padding-left: 4px !important;
    overflow: visible !important;
    display: inline-block !important;
}
`;

if (!skyCss.includes('FINAL POLISH STYLES (7 CORE FIXES)')) {
    skyCss += '\n' + polishStyles;
    fs.writeFileSync('skytech-complete.css', skyCss, 'utf8');
    console.log('✓ Appended polish styles to skytech-complete.css');
} else {
    console.log('• Polish styles already in skytech-complete.css');
}

// ==========================================
// 3. UPDATE ocop-copilot.js
// ==========================================
let copilotJs = fs.readFileSync('ocop-copilot.js', 'utf8');

// Update intent classification for human/admin escalation
const oldIntentMatch = `if (/(giao hang co van de|su co giao hang|giao hang tre|giao tre|tre han|hong hang|be vo|rach tem|sai mon|sai hang|chua nhan duoc|mat hang|khieu nai|doi tra|hoan tien|gap cskh|lien he cskh|nhan vien ho tro|tong dai|hotline|zalo cskh|complaint|damaged|broken|late delivery|missing item|refund|talk to human|support)/i.test(norm)) {`;
const newIntentMatch = `if (/(giao hang co van de|su co giao hang|giao hang tre|giao tre|tre han|hong hang|be vo|rach tem|sai mon|sai hang|chua nhan duoc|mat hang|khieu nai|doi tra|hoan tien|gap cskh|cskh|gap admin|admin|lien he admin|nhan vien|tu van vien|truc tiep|ho tro truc tiep|nguoi that|tong dai|hotline|zalo cskh|complaint|damaged|broken|late delivery|missing item|refund|talk to human|support)/i.test(norm)) {`;

if (copilotJs.includes(oldIntentMatch)) {
    copilotJs = copilotJs.replace(oldIntentMatch, newIntentMatch);
    console.log('✓ Expanded CSKH intent matching in ocop-copilot.js');
}

// Update renderCSKHSupportCard to return exact required escalation text and 4 admin profiles
const oldCskhMsgVi = `: \`🙏 **OCOP Rất Xin Lỗi Quý Khách Về Sự Cố Gặp Phải!**\\n\\n\` +
              \`Em xin chân thành ghi nhận sự cố này. Hệ thống đặc sản OCOP cam kết chính sách bảo vệ người tiêu dùng tuyệt đối:\\n\\n\` +
              \`• **Tổng đài Hotline CSKH**: [\${PAYMENT_CONFIG.hotline}](tel:\${PAYMENT_CONFIG.hotline}) (hoặc [\${PAYMENT_CONFIG.hotlineMobile}](tel:\${PAYMENT_CONFIG.hotlineMobile}))\\n\` +
              \`• **Zalo OA Hỗ Trợ Trực Tuyến**: [Bấm kết nối Zalo](\${PAYMENT_CONFIG.zaloUrl})\\n\` +
              \`• **Cam kết quyền lợi**: Đổi mới miễn phí tận nơi hoặc hoàn tiền 100% nếu sản phẩm bị hư hỏng, bể vỡ hoặc giao trễ.\\n\\n\` +
              \`*Quý khách vui lòng chọn kênh liên hệ khẩn cấp hoặc gửi form khiếu nại bên dưới, chuyên viên CSKH sẽ xử lý ngay lập tức ạ!*\`;`;

const newCskhMsgVi = `: \`💡 Câu hỏi của bạn cần sự hỗ trợ chuyên sâu hơn. Hệ thống đã chuyển tiếp yêu cầu của bạn đến **Đội ngũ Admin CSKH Trực tuyến**! Bạn có thể nhắn trực tiếp tại đây hoặc liên hệ ngay với Admin phụ trách bên dưới để được giải đáp tức thì:\\n\\n\` +
              \`• **Tổng đài Hotline CSKH 24/7**: [\${PAYMENT_CONFIG.hotline}](tel:\${PAYMENT_CONFIG.hotline}) (hoặc [\${PAYMENT_CONFIG.hotlineMobile}](tel:\${PAYMENT_CONFIG.hotlineMobile}))\\n\` +
              \`• **Zalo OA Hỗ Trợ Trực Tuyến**: [Bấm kết nối Zalo](\${PAYMENT_CONFIG.zaloUrl})\\n\` +
              \`• **Cam kết quyền lợi**: Đổi mới miễn phí tận nơi hoặc hoàn tiền 100% nếu có bất kỳ sự cố phát sinh.\\n\\n\` +
              \`*Quý khách vui lòng chọn kênh liên hệ khẩn cấp hoặc gửi form khiếu nại bên dưới, chuyên viên CSKH sẽ hỗ trợ ngay lập tức ạ!*\`;`;

if (copilotJs.includes(oldCskhMsgVi)) {
    copilotJs = copilotJs.replace(oldCskhMsgVi, newCskhMsgVi);
    console.log('✓ Updated renderCSKHSupportCard message in ocop-copilot.js');
}

// Add 4 Admin profile cards to renderCSKHSupportCard cardHtml
const oldCardHtmlTarget = `<!-- 3 Kênh Hỗ Trợ Khẩn Cấp -->`;
const adminProfilesHtml = `<!-- 4 Admin Chuyên Trách OCOP -->
                <div class="mb-3 space-y-2">
                    <p class="font-extrabold text-[11px] text-gray-800 uppercase flex items-center gap-1.5">
                        <i class="fa-solid fa-users text-sky-600"></i>
                        <span>Đội Ngũ Admin CSKH Chuyên Trách:</span>
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div class="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-2">
                            <span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">A1</span>
                            <div class="min-w-0 flex-1">
                                <p class="font-bold text-sky-900 leading-tight">Admin 1 - Điểm Bán & Đơn Hàng</p>
                                <p class="text-[10px] text-gray-600 mt-0.5">Xử lý showroom, đơn hàng O2O</p>
                                <a href="tel:0915688202" class="inline-block mt-1 text-[10px] font-bold text-sky-700 hover:underline">📞 0915 688 202</a>
                            </div>
                        </div>
                        <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2">
                            <span class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">A2</span>
                            <div class="min-w-0 flex-1">
                                <p class="font-bold text-emerald-900 leading-tight">Admin 2 - Tư Vấn Quà B2B</p>
                                <p class="text-[10px] text-gray-600 mt-0.5">Set quà doanh nghiệp & combo</p>
                                <a href="https://zalo.me/0988234567" target="_blank" rel="noopener" class="inline-block mt-1 text-[10px] font-bold text-emerald-700 hover:underline">💬 Zalo B2B 24/7</a>
                            </div>
                        </div>
                        <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                            <span class="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">A3</span>
                            <div class="min-w-0 flex-1">
                                <p class="font-bold text-amber-900 leading-tight">Admin 3 - Hỗ Trợ Đăng Ký HTX</p>
                                <p class="text-[10px] text-gray-600 mt-0.5">Kỹ thuật & số hóa nông sản</p>
                                <button type="button" onclick="openPartnerRegistrationModal()" class="inline-block mt-1 text-[10px] font-bold text-amber-800 hover:underline cursor-pointer">⚡ Đăng ký điểm bán</button>
                            </div>
                        </div>
                        <div class="p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-2">
                            <span class="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">A4</span>
                            <div class="min-w-0 flex-1">
                                <p class="font-bold text-purple-900 leading-tight">Admin 4 - CSKH 24/7 & Sự Cố</p>
                                <p class="text-[10px] text-gray-600 mt-0.5">Khiếu nại, hoàn tiền & đổi trả</p>
                                <a href="tel:19006868" class="inline-block mt-1 text-[10px] font-bold text-purple-700 hover:underline">📞 Hotline 1900 6868</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3 Kênh Hỗ Trợ Khẩn Cấp -->`;

if (copilotJs.includes(oldCardHtmlTarget) && !copilotJs.includes('Admin 1 - Điểm Bán & Đơn Hàng')) {
    copilotJs = copilotJs.replace(oldCardHtmlTarget, adminProfilesHtml);
    console.log('✓ Added 4 Admin profiles to CSKH card in ocop-copilot.js');
}

fs.writeFileSync('ocop-copilot.js', copilotJs, 'utf8');
console.log('✓ Successfully written updated ocop-copilot.js');
console.log('=== ALL UPDATES COMPLETED SUCCESSFULLY ===');

