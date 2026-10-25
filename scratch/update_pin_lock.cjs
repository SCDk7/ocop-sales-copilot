const fs = require('fs');

console.log('=== UPDATING PIN LOCK 2007 IN skytech-complete.js and skytech-complete.css ===');

// =========================================================================
// 1. UPDATE skytech-complete.js
// =========================================================================
let js = fs.readFileSync('skytech-complete.js', 'utf8');

// A. Add storage purge at script start
const purgeStorageCode = `
    // PURGE ANY SAVED ADMIN AUTH STATE IMMEDIATELY (MANDATORY PIN 2007 ON EVERY ACCESS)
    try {
        sessionStorage.removeItem('ocop_admin_pin_verified');
        sessionStorage.removeItem('admin_pin_verified');
        localStorage.removeItem('ocop_admin_pin_verified');
        localStorage.removeItem('admin_pin_verified');
    } catch (e) {}
`;

// Inject right after (function () {
if (!js.includes('PURGE ANY SAVED ADMIN AUTH STATE IMMEDIATELY')) {
    js = js.replace('(function () {', '(function () {' + purgeStorageCode);
}

// B. Replace Section 5 with strict PIN 2007 logic & modal markup
const section5Start = '// 5. CỔNG MÃ PIN 2007 BẢO VỆ BẢNG QUẢN TRỊ TÀI CHÍNH';
const section5End = '// Cập nhật dữ liệu Bảng Quản Trị Doanh Thu & Tiền Lời Quảng Bá';

const idxStart = js.indexOf(section5Start);
const idxEnd = js.indexOf(section5End);

if (idxStart === -1 || idxEnd === -1) {
    console.error('ERROR: Could not locate Section 5 in skytech-complete.js');
    process.exit(1);
}

const newSection5 = `// 5. CỔNG MÃ PIN 2007 BẢO VỆ BẢNG QUẢN TRỊ TÀI CHÍNH (KHÓA CHẶT 100% - BẮT BUỘC NHẬP MÃ MỖI LẦN)
    window.isMasterAdminAuthed = function () {
        // Never allow persistent authorization
        return false;
    };

    window.promptAdminPinModal = function () {
        // Purge any stored token so no stale auth can exist
        try {
            sessionStorage.removeItem('ocop_admin_pin_verified');
            sessionStorage.removeItem('admin_pin_verified');
            localStorage.removeItem('ocop_admin_pin_verified');
            localStorage.removeItem('admin_pin_verified');
        } catch (e) {}

        let modal = document.getElementById('admin-pin-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'admin-pin-modal';
            modal.style.cssText = 'display: flex !important; position: fixed !important; inset: 0 !important; z-index: 2147483647 !important; align-items: center !important; justify-content: center !important; padding: 16px !important; background: rgba(15, 23, 42, 0.65) !important; backdrop-filter: blur(4px) !important;';
            modal.innerHTML = \`
                <div id="admin-pin-card" style="position: relative !important; width: 100% !important; max-width: 440px !important; background: #FFFFFF !important; border: 2.5px solid #0284C7 !important; border-radius: 24px !important; padding: 28px 24px !important; box-shadow: 0 25px 60px rgba(2, 132, 199, 0.3) !important; color: #0F172A !important; font-family: inherit !important; text-align: center !important;">
                    <button type="button" onclick="closeAdminPinModal()" style="position: absolute !important; top: 16px !important; right: 16px !important; width: 32px !important; height: 32px !important; border-radius: 999px !important; background: #F1F5F9 !important; border: none !important; color: #64748B !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; transition: all 0.2s !important;" title="Đóng">
                        <i class="fa-solid fa-xmark" style="font-size: 14px !important;"></i>
                    </button>
                    
                    <div style="width: 56px !important; height: 56px !important; margin: 0 auto 12px !important; border-radius: 18px !important; background: #E0F2FE !important; color: #0284C7 !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 24px !important; border: 1.5px solid #BAE6FD !important; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15) !important;">
                        <i class="fa-solid fa-lock"></i>
                    </div>

                    <h3 style="margin: 0 0 8px !important; color: #0C4A6E !important; font-size: 1.22rem !important; font-weight: 900 !important; letter-spacing: -0.01em !important;">
                        🔐 XÁC THỰC QUẢN TRỊ VIÊN (ADMIN)
                    </h3>

                    <p style="margin: 0 0 20px !important; color: #334155 !important; font-size: 13.5px !important; line-height: 1.5 !important; font-weight: 500 !important;">
                        Khu vực bảo mật doanh thu & tiền lời dành riêng cho Chủ Web. Khách hàng vui lòng quay lại.
                    </p>

                    <div style="margin-bottom: 16px !important; text-align: left !important;">
                        <label for="admin-pin-input" style="display: block !important; font-size: 12px !important; font-weight: 700 !important; color: #0369A1 !important; margin-bottom: 6px !important;">
                            Mã PIN Quản Trị:
                        </label>
                        <input type="password" id="admin-pin-input" maxlength="10" placeholder="Nhập mã PIN quản trị..." autocomplete="off"
                               style="width: 100% !important; box-sizing: border-box !important; padding: 12px 16px !important; font-size: 16px !important; font-weight: 700 !important; text-align: center !important; letter-spacing: 0.15em !important; border-radius: 12px !important; background: #F8FAFC !important; border: 2px solid #BAE6FD !important; color: #0F172A !important; outline: none !important; transition: all 0.2s !important;">
                        <p id="admin-pin-error" style="display: none; margin: 8px 0 0 !important; color: #DC2626 !important; font-size: 12.5px !important; font-weight: 700 !important; text-align: center !important;">
                            ❌ Mã PIN không chính xác! Bạn không có quyền truy cập.
                        </p>
                    </div>

                    <div style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 12px !important; margin-top: 20px !important;">
                        <button type="button" onclick="closeAdminPinModal()"
                                style="flex: 1 !important; padding: 12px 18px !important; border-radius: 12px !important; background: #F1F5F9 !important; color: #475569 !important; font-weight: 700 !important; font-size: 14px !important; border: 1px solid #E2E8F0 !important; cursor: pointer !important; transition: all 0.2s !important;">
                            Hủy Bỏ
                        </button>
                        <button type="button" onclick="verifyAdminPin()"
                                style="flex: 1 !important; padding: 12px 20px !important; border-radius: 12px !important; background: #0284C7 !important; color: #FFFFFF !important; font-weight: 800 !important; font-size: 14px !important; border: none !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35) !important; cursor: pointer !important; transition: all 0.2s !important;">
                            Mở Khóa
                        </button>
                    </div>
                </div>
            \`;
            document.body.appendChild(modal);

            const input = document.getElementById('admin-pin-input');
            if (input) {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        window.verifyAdminPin();
                    }
                });
            }
        }

        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('z-index', '2147483647', 'important');

        const card = document.getElementById('admin-pin-card');
        if (card) {
            card.classList.remove('admin-pin-shake');
        }

        const input = document.getElementById('admin-pin-input');
        if (input) {
            input.value = '';
            input.style.borderColor = '#BAE6FD';
            input.style.background = '#F8FAFC';
            setTimeout(() => input.focus(), 80);
        }
        const err = document.getElementById('admin-pin-error');
        if (err) err.style.display = 'none';
    };

    window.closeAdminPinModal = function () {
        const modal = document.getElementById('admin-pin-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.setProperty('display', 'none', 'important');
        }
    };

    window.verifyAdminPin = function () {
        const input = document.getElementById('admin-pin-input');
        const err = document.getElementById('admin-pin-error');
        const card = document.getElementById('admin-pin-card');
        const pin = (input ? input.value : '').trim();

        if (pin === '2007') {
            if (err) err.style.display = 'none';
            window.closeAdminPinModal();
            openRealFinancialDashboard();
            if (typeof showToast === 'function') {
                showToast('🔓 Xác thực Quản Trị thành công!', 'success');
            }
        } else {
            if (err) err.style.display = 'block';
            if (input) {
                input.style.borderColor = '#DC2626';
                input.style.background = '#FEF2F2';
                input.value = '';
                input.focus();
            }
            if (card) {
                card.classList.remove('admin-pin-shake');
                void card.offsetWidth; // trigger reflow
                card.classList.add('admin-pin-shake');
            }
        }
    };

    // Mở Bảng Quản Trị Doanh Thu thật (chỉ gọi sau khi xác thực đúng PIN 2007)
    function openRealFinancialDashboard() {
        const modal = document.getElementById('ai-financial-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.setProperty('display', 'flex', 'important');
            modal.style.setProperty('z-index', '100000', 'important');
            enrichWebmasterRevenueData();
            if (typeof updateFinancialSimulator === 'function') {
                updateFinancialSimulator();
            }
        }
    }

    // Bọc hàm mở/đóng modal tài chính để khóa chặt
    window.openFinancialDashboardModal = function () {
        window.promptAdminPinModal();
    };
    window.toggleAiFinancialModal = function () {
        window.promptAdminPinModal();
    };

    const prevCloseFin = window.closeFinancialDashboardModal;
    window.closeFinancialDashboardModal = function () {
        try {
            sessionStorage.removeItem('ocop_admin_pin_verified');
            sessionStorage.removeItem('admin_pin_verified');
            localStorage.removeItem('ocop_admin_pin_verified');
            localStorage.removeItem('admin_pin_verified');
        } catch (e) {}

        const modal = document.getElementById('ai-financial-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.setProperty('display', 'none', 'important');
        }
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        if (typeof prevCloseFin === 'function') {
            try { prevCloseFin(); } catch (err) {}
        }
    };

    // CAPTURE-PHASE CLICK INTERCEPTOR (CHẶN ĐỨNG TRƯỚC MỌI ONCLICK)
    window.addEventListener('click', function (e) {
        // Không chặn click bên trong PIN modal
        if (e.target.closest('#admin-pin-modal')) {
            return;
        }

        // Không chặn click vào nút đóng Bảng Quản Trị
        if (e.target.closest('#btn-close-fin-modal-sticky') || e.target.closest('[onclick*="closeFinancialDashboardModal"]')) {
            window.closeFinancialDashboardModal();
            return;
        }

        // Không chặn thao tác bên trong Bảng Quản Trị khi nó đã mở
        if (e.target.closest('#ai-financial-modal')) {
            return;
        }

        const el = e.target.closest('button, a, div[onclick], [role="button"], span');
        if (!el) return;

        const rawText = (el.innerText || el.textContent || '').trim().toLowerCase();
        const onclickAttr = (el.getAttribute('onclick') || '').toLowerCase();
        const id = (el.id || '').toLowerCase();
        const cls = (el.className || '').toString().toLowerCase();

        // Không chặn nếu là hành động đóng
        if (rawText.includes('đóng') || rawText.includes('close') || onclickAttr.includes('close')) {
            return;
        }

        const isRevenueTrigger =
            id === 'btn-header-admin-pin' ||
            cls.includes('nav-btn-finance') ||
            onclickAttr.includes('openfinancialdashboardmodal') ||
            onclickAttr.includes('promptadminpinmodal') ||
            onclickAttr.includes('openrealfinancialdashboard') ||
            onclickAttr.includes('toggleaifinancialmodal') ||
            rawText.includes('quản trị doanh thu') ||
            rawText.includes('quản trị chủ web') ||
            rawText.includes('bảng quản trị') ||
            rawText.includes('ai financial engine') ||
            rawText.includes('kích hoạt ai financial engine');

        if (isRevenueTrigger) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Đảm bảo Bảng Quản Trị luôn bị ẩn cho đến khi nhập đúng PIN
            const finModal = document.getElementById('ai-financial-modal');
            if (finModal) {
                finModal.classList.add('hidden');
                finModal.style.setProperty('display', 'none', 'important');
            }

            window.promptAdminPinModal();
        }
    }, true); // true = CAPTURE PHASE, chạy trước mọi onclick trong HTML

    `;

js = js.slice(0, idxStart) + newSection5 + js.slice(idxEnd);
fs.writeFileSync('skytech-complete.js', js, 'utf8');
console.log('✓ Updated skytech-complete.js with strict PIN 2007 logic and Capture Interceptor');

// =========================================================================
// 2. UPDATE skytech-complete.css
// =========================================================================
let css = fs.readFileSync('skytech-complete.css', 'utf8');

const shakeKeyframes = `
/* SHAKE ANIMATION FOR ADMIN PIN MODAL */
@keyframes adminPinShake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}

.admin-pin-shake {
    animation: adminPinShake 0.4s ease !important;
}

#admin-pin-modal {
    z-index: 2147483647 !important;
}
`;

if (!css.includes('adminPinShake')) {
    css += '\n' + shakeKeyframes;
    fs.writeFileSync('skytech-complete.css', css, 'utf8');
    console.log('✓ Added adminPinShake keyframes and z-index to skytech-complete.css');
} else {
    console.log('• skytech-complete.css already contains adminPinShake');
}

console.log('=== DONE ===');

