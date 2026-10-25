/**
 * POLISH PERFECT UI: CONTROLLER JS
 * Sửa lỗi lặp chữ Header, đổi Avatar AI Chatbot Robot hiện đại,
 * Xóa nút trùng lặp trên Thẻ Sản Phẩm và bảo đảm 100% tính năng.
 */

(function () {
    'use strict';

    // SVG ROBOT ICON HIỆN ĐẠI (CYBER AI ASSISTANT)
    const ROBOT_ICON_SVG = `
        <svg viewBox="0 0 24 24" fill="none" class="w-7 h-7 drop-shadow-md text-white" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="4" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8" />
            <circle cx="8.5" cy="16" r="1.5" fill="#38bdf8" />
            <circle cx="15.5" cy="16" r="1.5" fill="#38bdf8" />
            <path d="M9.5 8h5" stroke="#ffffff" />
            <path d="M12 4v4" stroke="#ffffff" />
            <circle cx="12" cy="3" r="1.5" fill="#fde047" stroke="#ffffff" />
            <path d="M2 15h1" stroke="#34d399" />
            <path d="M21 15h1" stroke="#34d399" />
            <path d="M10 19h4" stroke="#38bdf8" stroke-linecap="round" />
        </svg>
    `;

    const ROBOT_HEADER_SVG = `
        <div class="w-full h-full rounded-2xl bg-gradient-to-tr from-[#059669] to-[#0284C7] p-1.5 flex items-center justify-center ring-2 ring-amber-400 shadow">
            <svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 text-white" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="3" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="1.8" />
                <circle cx="8.5" cy="16" r="1.5" fill="#38bdf8" />
                <circle cx="15.5" cy="16" r="1.5" fill="#38bdf8" />
                <path d="M9.5 8h5" stroke="#ffffff" />
                <path d="M12 4v4" stroke="#ffffff" />
                <circle cx="12" cy="3" r="1.5" fill="#fde047" stroke="#ffffff" />
            </svg>
        </div>
    `;

    // 1. SỬA LỖI LẶP CHỮ TRÊN THANH HEADER
    function fixHeaderButtons() {
        const headerRight = document.querySelector('.header-right-actions');
        if (!headerRight) return;

        // Nút 1: Đăng Ký HTX (OCR)
        const btnReg = headerRight.querySelector('button[onclick*="openPartnerRegistrationModal"]');
        if (btnReg) {
            btnReg.innerHTML = '<i class="fa-solid fa-bolt text-amber-300 mr-1.5"></i><span>⚡ Đăng Ký HTX (OCR)</span>';
            btnReg.className = 'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black transition flex items-center cursor-pointer shrink-0 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sm border border-sky-300 hover:scale-105';
        }

        // Nút 2: Quản Trị Chủ Web (PIN 2007)
        const btnAdmin = document.getElementById('btn-header-admin-pin') || headerRight.querySelector('button[onclick*="promptAdminPinModal"]');
        if (btnAdmin) {
            btnAdmin.innerHTML = '<i class="fa-solid fa-lock text-amber-300 mr-1.5"></i><span>🔐 Quản Trị Chủ Web</span>';
            btnAdmin.className = 'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black transition flex items-center cursor-pointer shrink-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-sm border border-amber-300 hover:scale-105';
        }
    }

    // 2. ĐỔI AVATAR AI CHATBOT SANG BIỂU TƯỢNG ROBOT HIỆN ĐẠI
    function upgradeAIChatbotAvatar() {
        const toggleBtn = document.getElementById('ai-chat-toggle-btn');
        if (toggleBtn) {
            // Thay đổi nội dung của toggle button
            toggleBtn.innerHTML = `
                <div class="ai-bot-avatar-inner">
                    ${ROBOT_ICON_SVG}
                </div>
                <span class="ai-bot-badge-pulse pointer-events-none">AI 24/7</span>
                <span class="absolute right-full mr-3 bg-slate-900/95 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl border border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    OCOP AI Copilot 24/7 ✨
                </span>
            `;
        }

        // Đổi avatar trong header khung chat
        const headerAvatarWrap = document.querySelector('#ai-chat-header .relative.w-9, #ai-chat-header .relative.w-10');
        if (headerAvatarWrap) {
            headerAvatarWrap.innerHTML = `
                ${ROBOT_HEADER_SVG}
                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
            `;
        }
    }

    // 3. FORMAT THẺ SẢN PHẨM: XÓA NÚT TRÙNG LẶP & ĐỒNG BỘ 2 CỘT CÂN ĐỐI
    function formatProductCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const pid = parseInt(card.getAttribute('data-product-id'), 10);
            const footer = card.querySelector('.product-card-footer');
            if (!footer) return;

            // Xóa/ẩn các div nút cũ bị lặp
            const oldButtonsDiv = footer.querySelector('.flex.items-center.justify-between.gap-2:not(.customer-actions)');
            if (oldButtonsDiv) {
                oldButtonsDiv.style.display = 'none';
            }

            // Đảm bảo chỉ có DUY NHẤT 1 wrapper customer-actions chứa 2 nút
            let actionsWrap = footer.querySelector('.card-actions-wrapper.customer-actions');
            if (!actionsWrap) {
                actionsWrap = document.createElement('div');
                actionsWrap.className = 'card-actions-wrapper customer-actions';
                footer.appendChild(actionsWrap);
            }

            actionsWrap.innerHTML = `
                <button type="button" onclick="openStoreLocator(${pid})" class="btn-card-store" title="Tra cứu Showroom & Google Maps">
                    <i class="fa-solid fa-map-pin"></i>
                    <span>📍 Điểm Bán</span>
                </button>
                <button type="button" onclick="openAIStoryModal(${pid})" class="btn-card-story" title="Khám phá câu chuyện đặc sản & AI Marketing">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>✨ AI Câu Chuyện</span>
                </button>
            `;
        });
    }

    // 4. KHỞI CHẠY VÀ THEO DÕI THAY ĐỔI
    function initPolishPerfect() {
        fixHeaderButtons();
        upgradeAIChatbotAvatar();
        formatProductCards();

        // Theo dõi khi người dùng lọc tỉnh thành / danh mục để format lại ngay
        const grid = document.getElementById('product-grid');
        if (grid) {
            const observer = new MutationObserver(() => {
                formatProductCards();
            });
            observer.observe(grid, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPolishPerfect);
    } else {
        initPolishPerfect();
    }
})();

