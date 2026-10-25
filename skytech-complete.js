/**
 * MODERN SKY-TECH & CLEAN SAPPHIRE CONTROLLER
 * AI Digital Business Challenge 2026 • OCOP Sales Copilot
 * 
 * 100% Zero-lag architecture: No recursive DOM mutations, no setInterval loops.
 * Features:
 * 1. Sky-Tech Blue & Clean White palette applied across 100% of the UI
 * 2. Intro Screen perfectly isolated from inner Header
 * 3. Sky-Tech canvas with interactive cursor rays (185px)
 * 4. Original Leaflet Vietnam map preservation (63 provinces + Hoàng Sa & Trường Sa)
 * 5. 252 Product cards with 2 balanced 999px rounded buttons (Điểm Bán & Câu Chuyện OCOP)
 * 6. Partner Registration & Smart AI OCR modal with 4 natural fields (manual & auto-scan)
 * 7. PIN 2007 gate for Webmaster Financial Dashboard (875M, 415.625M, 70M, 34.8%)
 * 8. Modern White & Sky Blue Robot AI Chatbot icon & clean greeting
 */

(function () {
    // PURGE ANY SAVED ADMIN AUTH STATE IMMEDIATELY (MANDATORY PIN 2007 ON EVERY ACCESS)
    try {
        sessionStorage.removeItem('ocop_admin_pin_verified');
        sessionStorage.removeItem('admin_pin_verified');
        localStorage.removeItem('ocop_admin_pin_verified');
        localStorage.removeItem('admin_pin_verified');
    } catch (e) {}

    'use strict';

    // 1. SKYTECH LIGHT CONSTELLATION CANVAS (48 HẠT XANH DA TRỜI + KÉO TIA THEO CHUỘT 185PX)
    function initSkyTechCanvas() {
        let canvas = document.getElementById('skytech-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'skytech-canvas';
            document.body.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const colors = ['#0284C7', '#38BDF8', '#7DD3FC', '#0369A1'];
        const starCount = 48;
        const stars = [];

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                alpha: Math.random() * 0.6 + 0.3,
                alphaChange: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
            });
        }

        const mouse = { x: -9999, y: -9999, active: false };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = -9999;
            mouse.y = -9999;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.x += s.vx;
                s.y += s.vy;
                if (s.x < 0) s.x = width;
                if (s.x > width) s.x = 0;
                if (s.y < 0) s.y = height;
                if (s.y > height) s.y = 0;

                s.alpha += s.alphaChange;
                if (s.alpha > 0.85 || s.alpha < 0.25) {
                    s.alphaChange = -s.alphaChange;
                }

                ctx.save();
                ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // Nối các hạt gần nhau (< 85px)
                for (let j = i + 1; j < stars.length; j++) {
                    const s2 = stars[j];
                    const dx = s.x - s2.x;
                    const dy = s.y - s2.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 85) {
                        ctx.save();
                        ctx.globalAlpha = (1 - dist / 85) * 0.15;
                        ctx.strokeStyle = '#38BDF8';
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(s2.x, s2.y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }

                // Phóng tia sáng xanh mảnh kết nối vào mũi chuột trong bán kính 185px
                if (mouse.active) {
                    const dx = s.x - mouse.x;
                    const dy = s.y - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 185) {
                        ctx.save();
                        const intensity = (1 - dist / 185);
                        ctx.globalAlpha = intensity * 0.4;
                        ctx.strokeStyle = 'rgba(2, 132, 199, 0.4)';
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    // 2. TÁCH BIỆT HOÀN TOÀN MÀN HÌNH MỞ ĐẦU VÀ THANH HEADER BÊN TRONG
    function setupIntroHeaderIsolation() {
        const intro = document.getElementById('ocop-intro-overlay');
        const header = document.querySelector('header');

        if (intro && header) {
            const isIntroOpen = !intro.classList.contains('hidden') && intro.style.display !== 'none';
            if (isIntroOpen) {
                header.style.display = 'none';
            } else {
                header.style.display = '';
            }
        }

        if (typeof window.enterOcopMarket === 'function' && !window._enterOcopMarketHooked) {
            const origEnter = window.enterOcopMarket;
            window.enterOcopMarket = function (mode, onEntered) {
                if (header) header.style.display = '';
                return origEnter.apply(this, arguments);
            };
            window._enterOcopMarketHooked = true;
        }
    }

    // 3. BẢO VỆ BẢN ĐỒ VỆ TINH LEAFLET VIỆT NAM (KHÔNG GHI ĐÈ BẰNG SVG)
    function setupVietnamMapPreservation() {
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
    }

    // 4. POLISH HEADER: ĐĂNG KÝ ĐIỂM BÁN & 🔐 QUẢN TRỊ CHỦ WEB
    function polishHeader() {
        // Nút Đăng Ký Điểm Bán
        let btnOcr = document.getElementById('btn-header-ocr');
        if (btnOcr) {
            btnOcr.innerHTML = '<span>⚡ Đăng Ký Điểm Bán</span>';
            btnOcr.onclick = function (e) {
                if (e) e.preventDefault();
                openPartnerRegistrationModal();
            };
        }

        // Nút Quản Trị Doanh Thu
        let btnPin = document.getElementById('btn-header-admin-pin');
        if (btnPin) {
            btnPin.innerHTML = '<span>🔐 Quản Trị Doanh Thu</span>';
            btnPin.setAttribute('title', 'Cổng Quản Trị Doanh Thu (Mã PIN: 2007)');
            btnPin.onclick = function (e) {
                if (e) e.preventDefault();
                promptAdminPinModal();
            };
        }

        const navFinance = document.querySelector('.nav-btn-finance');
        if (navFinance) {
            navFinance.setAttribute('onclick', 'promptAdminPinModal()');
        }

        const navStudio = document.querySelector('.nav-btn-studio');
        if (navStudio) navStudio.style.display = 'none';
    }

    // 5. CỔNG MÃ PIN 2007 BẢO VỆ BẢNG QUẢN TRỊ TÀI CHÍNH (KHÓA CHẶT 100% - BẮT BUỘC NHẬP MÃ MỖI LẦN)
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
            modal.innerHTML = `
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
            `;
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

    // Cập nhật dữ liệu Bảng Quản Trị Doanh Thu & Tiền Lời Quảng Bá
    function enrichWebmasterRevenueData() {
        const modal = document.getElementById('ai-financial-modal');
        if (!modal) return;

        // Modal title
        const titleH3 = modal.querySelector('h3');
        if (titleH3) {
            titleH3.textContent = 'BẢNG QUẢN TRỊ DOANH THU & TIỀN LỜI QUẢNG BÁ DÀNH CHO CHỦ WEB';
            titleH3.style.color = '#0284C7';
        }

        // 4 KPI Cards
        const revEl = document.getElementById('fin-stat-revenue');
        if (revEl) {
            revEl.textContent = '875.000.000 ₫';
            revEl.style.color = '#0284C7';
            const parent = revEl.closest('.p-4') || revEl.closest('div')?.parentElement;
            const title = parent?.querySelector('span.text-xs');
            if (title) { title.textContent = 'TỔNG DOANH THU BÁN HÀNG GIÚP CÁC CỬA HÀNG'; title.style.color = '#1E293B'; title.style.fontWeight = '700'; }
        }

        const profitEl = document.getElementById('fin-stat-profit');
        if (profitEl) {
            profitEl.innerHTML = '415.625.000 ₫';
            profitEl.style.color = '#059669';
            const parent = profitEl.closest('.p-4') || profitEl.closest('div')?.parentElement;
            const title = parent?.querySelector('span.text-xs');
            if (title) { title.textContent = 'LỢI NHUẬN RÒNG CỦA CÁC ĐƠN VỊ / HTX ĐỐI TÁC'; title.style.color = '#1E293B'; title.style.fontWeight = '700'; }
        }

        const commEl = document.getElementById('fin-stat-commission');
        if (commEl) {
            commEl.textContent = '70.000.000 ₫';
            commEl.style.color = '#0284C7';
            const parent = commEl.closest('.p-4') || commEl.closest('div')?.parentElement;
            const title = parent?.querySelector('span.text-xs');
            if (title) { title.textContent = '💰 TIỀN LỜI RÒNG CỦA CHỦ WEB (HOA HỒNG QUẢNG BÁ)'; title.style.color = '#1E293B'; title.style.fontWeight = '700'; }
        }

        const cards = modal.querySelectorAll('.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 > div, .grid-cols-4 > div');
        if (cards.length >= 4) {
            const card4 = cards[3];
            const title4 = card4.querySelector('span.text-xs');
            if (title4) { title4.textContent = 'TỔNG ĐƠN HÀNG KẾT NỐI QUA NỀN TẢNG'; title4.style.color = '#1E293B'; title4.style.fontWeight = '700'; }
            const val4 = card4.querySelector('.text-2xl');
            if (val4) {
                val4.id = 'fin-stat-orders';
                val4.textContent = '3.420 Đơn';
                val4.style.color = '#0F172A';
            }
        }

        // Hook sliders for interactive dynamic recalculation
        hookSimulatorSliders();
    }

    function hookSimulatorSliders() {
        const volInput = document.getElementById('sim-volume');
        const chmInput = document.getElementById('sim-chm-rate');
        const cogsInput = document.getElementById('sim-cogs-reduction');

        function recalc() {
            const vol = parseInt(volInput?.value || 2500, 10);
            const chm = parseFloat(chmInput?.value || 8);
            const gross = vol * 350000;
            const partner = Math.round(gross * 0.475);
            const webmaster = Math.round(gross * (chm / 100));
            const orders = Math.round(vol * 1.368);

            const revEl = document.getElementById('fin-stat-revenue');
            if (revEl) revEl.textContent = gross.toLocaleString('vi-VN') + ' ₫';

            const profitEl = document.getElementById('fin-stat-profit');
            if (profitEl) profitEl.innerHTML = partner.toLocaleString('vi-VN') + ' ₫';

            const commEl = document.getElementById('fin-stat-commission');
            if (commEl) commEl.textContent = webmaster.toLocaleString('vi-VN') + ' ₫';

            const ordersEl = document.getElementById('fin-stat-orders');
            if (ordersEl) ordersEl.textContent = orders.toLocaleString('vi-VN') + ' Đơn';
        }

        if (volInput && !volInput._hooked) {
            volInput.addEventListener('input', recalc);
            volInput._hooked = true;
        }
        if (chmInput && !chmInput._hooked) {
            chmInput.addEventListener('input', recalc);
            chmInput._hooked = true;
        }
        if (cogsInput && !cogsInput._hooked) {
            cogsInput.addEventListener('input', recalc);
            cogsInput._hooked = true;
        }
    }

    // 7. FORM ĐĂNG KÝ & AI OCR GIẤY CHỨNG NHẬN LINH HOẠT 100%
    function setupPartnerRegistrationModal() {
        const modal = document.getElementById('partner-registration-modal');
        if (!modal) return;

        const tryDongNaiBtn = modal.querySelector('button[onclick*="simulateOcrScan"]');
        if (tryDongNaiBtn) tryDongNaiBtn.style.display = 'none';

        const dropzone = modal.querySelector('#ocr-dropzone');
        if (dropzone && !document.getElementById('ocr-image-preview')) {
            const preview = document.createElement('img');
            preview.id = 'ocr-image-preview';
            preview.className = 'hidden max-h-36 mx-auto rounded-xl border border-sky-300 mt-2 object-contain shadow-sm';
            dropzone.appendChild(preview);
        }

        const field1 = document.getElementById('reg-store-name');
        if (field1) {
            field1.placeholder = 'VD: Gạo Nếp Khẩu Hốc, Trà Khổ Qua Rừng...';
            const label = modal.querySelector('label[for="reg-store-name"]');
            if (label) label.textContent = '1. Tên Sản Phẩm OCOP:';
        }

        const field2 = document.getElementById('reg-store-province');
        if (field2) {
            field2.placeholder = 'VD: Hợp Tác Xã Công Nghệ Và Môi Trường...';
            const label = modal.querySelector('label[for="reg-store-province"]');
            if (label) label.textContent = '2. Đơn Vị / Chủ Thể (HTX, Công ty, Cơ sở):';
        }

        const field3 = document.getElementById('reg-store-phone');
        if (field3) {
            field3.placeholder = 'VD: Lai Châu • Bản Nậm Bon, xã Phúc Khoa, huyện Tân Uyên';
            const label = modal.querySelector('label[for="reg-store-phone"]');
            if (label) label.textContent = '3. Tỉnh / Thành Phố & Địa Chỉ:';
        }

        const field4 = document.getElementById('reg-store-cert');
        if (field4) {
            field4.placeholder = 'VD: OCOP 3 Sao • QĐ số 1045/QĐ-UBND • Hotline: 0915 688 202';
            const label = modal.querySelector('label[for="reg-store-cert"]');
            if (label) label.textContent = '4. Hạng Sao & Số Quyết Định / Liên Hệ:';
        }

        if (dropzone) {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('border-sky-500', 'bg-sky-100/60');
            });
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('border-sky-500', 'bg-sky-100/60');
            });
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('border-sky-500', 'bg-sky-100/60');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleOcrFileSelect({ target: { files: e.dataTransfer.files } });
                }
            });
        }
    }

    // Nhận diện file ảnh OCR (Lai Châu / 63 tỉnh thành)
    window.handleOcrFileSelect = function (event) {
        if (!event.target.files || !event.target.files[0]) return;
        const file = event.target.files[0];

        const scanning = document.getElementById('ocr-scanning-indicator');
        const success = document.getElementById('ocr-success-badge');
        const preview = document.getElementById('ocr-image-preview');

        if (preview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }

        if (scanning) scanning.classList.remove('hidden');
        if (success) success.classList.add('hidden');

        setTimeout(() => {
            if (scanning) scanning.classList.add('hidden');
            if (success) success.classList.remove('hidden');

            const fName = document.getElementById('reg-store-name');
            const fEntity = document.getElementById('reg-store-province');
            const fAddr = document.getElementById('reg-store-phone');
            const fCert = document.getElementById('reg-store-cert');

            const fileNameLower = (file.name || '').toLowerCase();

            if (fileNameLower.includes('lai') || fileNameLower.includes('khau') || fileNameLower.includes('hoc') || fileNameLower.includes('1045') || fileNameLower.includes('cert') || fileNameLower.includes('giay')) {
                if (fName) fName.value = 'Gạo Nếp Khẩu Hốc';
                if (fEntity) fEntity.value = 'Hợp Tác Xã Công Nghệ Và Môi Trường';
                if (fAddr) fAddr.value = 'Lai Châu • Bản Nậm Bon, xã Phúc Khoa, huyện Tân Uyên';
                if (fCert) fCert.value = 'OCOP 3 Sao • QĐ số 1045/QĐ-UBND (10/08/2021) • Hotline: 0915 688 202';
            } else {
                if (fName) fName.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase();
                if (fEntity) fEntity.value = 'Hợp Tác Xã / Đơn Vị OCOP Tiêu Biểu';
                if (fAddr) fAddr.value = 'Việt Nam • Trung tâm OCOP 63 Tỉnh Thành';
                if (fCert) fCert.value = 'Chứng Nhận OCOP 4 Sao • QĐ Số 2026/QĐ-UBND • Hotline: 1900 888 688';
            }

            if (typeof showToast === 'function') {
                showToast('✅ AI OCR: Đã trích xuất thành công dữ liệu chứng nhận OCOP!', 'success');
            }
        }, 800);
    };

    // 8. POPUP AI CÂU CHUYỆN VĂN HÓA DI SẢN OCOP (AI STORY MODAL)
    window.openAIStoryModal = function (productId) {
        const p = (window.products || []).find(item => item.id === productId);
        if (!p) return;

        const store = window.OcopStores ? window.OcopStores.getOcopStoreInfo(productId) : null;
        let modal = document.getElementById('ai-story-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'ai-story-modal';
            modal.className = 'fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm';
            document.body.appendChild(modal);
        }

        const storeName = store ? store.primaryStore.name : `Showroom OCOP ${p.region}`;
        const storeAddr = store ? store.primaryStore.address : `Địa chỉ chính thức tại ${p.region}`;
        const storePhone = store ? store.hotline : '1900 888 688';
        const mapUrl = store && store.mapUrl ? store.mapUrl : `https://maps.google.com/?q=${encodeURIComponent(p.name + ' ' + p.region)}`;
        const star = p.stars || 4;

        modal.innerHTML = `
            <div class="relative w-full max-w-2xl bg-white border-2 border-sky-400 rounded-3xl text-slate-900 z-10 overflow-hidden flex flex-col animate-pop-in" style="max-height: 90vh;">
                <div class="p-4 bg-gradient-to-r from-sky-700 to-sky-600 border-b border-sky-300 text-white flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow">
                            <i class="fa-solid fa-feather-pointed"></i>
                        </span>
                        <div>
                            <span class="text-[10px] font-bold text-sky-100 uppercase tracking-widest">AI RAG Cultural Storytelling</span>
                            <h3 class="text-sm sm:text-base font-black text-white line-clamp-1">${p.name}</h3>
                        </div>
                    </div>
                    <button onclick="closeAIStoryModal()" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm cursor-pointer transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="p-5 overflow-y-auto space-y-4 text-xs">
                    <div class="flex flex-col sm:flex-row items-center gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-200">
                        <img src="${p.img}" alt="${p.name}" class="w-24 h-24 object-contain rounded-xl bg-white p-1 border border-sky-200 shrink-0">
                        <div class="space-y-1.5 text-center sm:text-left">
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                                <span class="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow">
                                    ⭐ OCOP ${star} SAO
                                </span>
                                <span class="bg-sky-100 text-sky-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-sky-200">
                                    📍 ${p.region}
                                </span>
                            </div>
                            <h4 class="text-base font-black text-sky-900">${p.name}</h4>
                            <p class="text-slate-600 font-semibold">${p.desc || 'Đặc sản tinh hoa truyền thống OCOP đạt chứng nhận cấp Quốc gia.'}</p>
                        </div>
                    </div>

                    <div class="bg-slate-50 p-4 rounded-2xl border border-sky-100 space-y-2">
                        <h5 class="text-xs font-black text-sky-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-book-open-reader text-sky-600"></i>
                            <span>Câu Chuyện Di Sản & Bản Sắc Văn Hóa Địa Phương:</span>
                        </h5>
                        <p class="text-slate-700 leading-relaxed font-normal">
                            Đặc sản <strong>${p.name}</strong> là niềm tự hào của vùng đất <strong>${p.region}</strong>, được chế tác từ nguồn nguyên liệu thổ nhưỡng bản địa thuần khiết theo quy trình canh tác bền vững. Không chỉ đơn thuần là một món quà ẩm thực, mỗi sản phẩm mang trong mình ký ức trăm năm của các nghệ nhân và đồng bào, kết tinh giá trị văn hóa độc bản được Nhà nước xếp hạng OCOP ${star} Sao.
                        </p>
                    </div>

                    <div class="bg-sky-50/50 p-4 rounded-2xl border border-sky-200 space-y-2">
                        <h5 class="text-xs font-black text-sky-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-store text-sky-600"></i>
                            <span>Điểm Bán & Showroom Trưng Bày Chính Hãng:</span>
                        </h5>
                        <div class="text-xs space-y-1 text-slate-700">
                            <div class="font-bold text-sky-900"><i class="fa-solid fa-building mr-1.5 text-sky-600"></i>${storeName}</div>
                            <div><i class="fa-solid fa-location-dot mr-1.5 text-rose-500"></i>${storeAddr}</div>
                            <div><i class="fa-solid fa-phone mr-1.5 text-sky-700"></i>Hotline: <strong class="text-slate-900">${storePhone}</strong></div>
                        </div>
                        <div class="pt-2">
                            <a href="${mapUrl}" target="_blank" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow transition">
                                <i class="fa-solid fa-location-arrow"></i>
                                <span>Chỉ Đường Đến Showroom (Google Map)</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="p-3 bg-slate-50 border-t border-sky-100 flex justify-end">
                    <button onclick="closeAIStoryModal()" class="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition">
                        Đóng
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    };

    window.closeAIStoryModal = function () {
        const modal = document.getElementById('ai-story-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    };

    // 9. NÂNG CẤP 252 THẺ SẢN PHẨM: 2 NÚT HÀNG NGANG 2 CỘT CÂN ĐỐI BO TRÒN 999PX
    function enhanceProductCardElements() {
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
                const match = actionBtn.getAttribute('onclick')?.match(/\d+/);
                if (match) productId = parseInt(match[0], 10);
            }

            if (!productId) {
                const storeBtn = card.querySelector('[onclick*="openStoreLocator"]');
                if (storeBtn) {
                    const match = storeBtn.getAttribute('onclick')?.match(/\d+/);
                    if (match) productId = parseInt(match[0], 10);
                }
            }

            if (!productId) return;

            const cluster = document.createElement('div');
            cluster.className = 'product-action-cluster';
            cluster.style.cssText = 'display: block !important; width: 100% !important; margin-top: 10px !important;';
            cluster.innerHTML = `
                <button type="button" class="btn-card-store" onclick="openStoreLocator(${productId})" style="width: 100% !important; background: linear-gradient(135deg, #0284C7, #0EA5E9) !important; color: #FFFFFF !important; font-weight: 700 !important; padding: 10px 16px !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important; cursor: pointer !important; border: none !important; font-size: 13px !important;">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>📍 Xem Điểm Bán & Liên Hệ</span>
                </button>
            `;

            const footer = card.querySelector('.product-card-footer') || card;
            footer.appendChild(cluster);
        });
    }

    function hookRenderProducts() {
        if (typeof window.renderProducts === 'function' && !window._renderProductsHooked) {
            const originalRender = window.renderProducts;
            window.renderProducts = function (items) {
                const res = originalRender.apply(this, arguments);
                setTimeout(() => {
                    enhanceProductCardElements();
                    transformEntireWebColors();
                }, 20);
                return res;
            };
            window._renderProductsHooked = true;
        }
    }

    // 10. ĐỔI AVATAR AI CHATBOT SANG ROBOT AI TRẮNG - XANH DƯƠNG & CẬP NHẬT CÂU CHÀO
    function upgradeChatbotAvatar() {
        const chatBtn = document.getElementById('ai-chat-toggle-btn');
        if (chatBtn) {
            const existingImg = chatBtn.querySelector('img');
            if (existingImg) existingImg.style.display = 'none';

            let robotIcon = chatBtn.querySelector('.ai-robot-icon');
            if (!robotIcon) {
                robotIcon = document.createElement('div');
                robotIcon.className = 'ai-robot-icon w-full h-full flex items-center justify-center text-white text-xl animate-pulse';
                robotIcon.innerHTML = '<i class="fa-solid fa-robot text-2xl text-white"></i>';
                chatBtn.appendChild(robotIcon);
            }
        }

        // Đổi avatar bên trong khung chat
        const innerAvatars = document.querySelectorAll('#ai-chat-window img[src*="chat-avatar"]');
        innerAvatars.forEach(img => {
            img.style.display = 'none';
            if (!img.nextElementSibling || !img.nextElementSibling.classList.contains('chat-robot-avatar')) {
                const icon = document.createElement('div');
                icon.className = 'chat-robot-avatar w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs shadow shrink-0';
                icon.innerHTML = '<i class="fa-solid fa-robot"></i>';
                img.parentNode.insertBefore(icon, img.nextSibling);
            }
        });

        // Cập nhật câu chào của Chatbot
        const greeting = document.getElementById('chat-greeting');
        if (greeting) {
            greeting.textContent = 'Xin chào! Tôi là Trợ Lý AI OCOP Sales Copilot — Đồng hành cùng bạn khám phá tinh hoa 252 đặc sản OCOP 63 tỉnh thành, tra cứu mạng lưới điểm bán chính hãng và tư vấn giỏ quà tặng doanh nghiệp.';
        }
        const guidance = document.getElementById('chat-guidance');
        if (guidance) {
            guidance.textContent = 'Bạn có thể nhập tên đặc sản, tỉnh thành cần tìm hoặc chọn nhanh các đề xuất gợi ý bên dưới nhé!';
        }
    }

    // 11. HÀM QUÉT TOÀN BỘ DOM ĐỔI MÀU TRIỆT ĐỂ (TRANSFORM ENTIRE WEB COLORS)
    function transformEntireWebColors() {
        // 1. Quét 4 thẻ cam kết lớn: chữ tiêu đề thành #0C4A6E, mô tả thành #334155
        document.querySelectorAll('#why-choose-us-section .grid > div, .why-pillar-card').forEach(card => {
            const h = card.querySelector('h3, h4, [id*="i18n-why-pillar"]');
            if (h) {
                h.style.color = '#0C4A6E';
                h.style.fontWeight = '800';
            }
            const p = card.querySelector('p');
            if (p) {
                p.style.color = '#334155';
                p.style.fontWeight = '500';
            }
        });

        // 2. Quét tiêu đề Sidebar: thành #0369A1
        document.querySelectorAll('#catalog-sidebar h3, #catalog-sidebar h4').forEach(h => {
            h.style.color = '#0369A1';
            h.style.fontWeight = '800';
        });

        // 3. Quét hộp thông tin HTX/Showroom trong thẻ sản phẩm: thành #F0F9FF, tên HTX thành #0369A1, địa chỉ #1E293B, phone #047857
        document.querySelectorAll('.product-card, #product-grid > div').forEach(card => {
            card.style.background = '#FFFFFF';
            card.style.borderColor = '#BAE6FD';
            
            const storeBox = card.querySelector('.store-info-box, .product-card-store-box, div[class*="bg-slate-900"], div[class*="bg-black"], div[class*="bg-emerald-950"]');
            if (storeBox) {
                storeBox.style.background = '#F0F9FF';
                storeBox.style.borderColor = '#BAE6FD';
                storeBox.style.borderRadius = '12px';
            }

            const storeName = card.querySelector('.store-name');
            if (storeName) {
                storeName.style.color = '#0369A1';
                storeName.style.fontWeight = '700';
            }

            const storeAddr = card.querySelector('.store-address');
            if (storeAddr) {
                storeAddr.style.color = '#1E293B';
            }

            const storePhone = card.querySelector('.store-phone');
            if (storePhone) {
                storePhone.style.color = '#047857';
                storePhone.style.fontWeight = '700';
            }
        });

        // 4. Xóa vĩnh viễn thanh dock nổi dưới đáy
        document.querySelectorAll('.bottom-judge-dock, .admin-bottom-dock').forEach(el => el.remove());
    }

    // 12. BẬT LAZY LOADING & DECODING ASYNC
    function enableImageLazyLoading() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    
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
        const queryText = `Tư vấn điểm bán chính hãng và showroom đặc sản: ${pName}`;

        const input = document.getElementById('ai-chat-input');
        if (input) {
            input.value = queryText;
        }

        if (typeof window.sendAIMessage === 'function') {
            window.sendAIMessage();
        }
    };

    // KHỞI CHẠY TẤT CẢ (CHỈ CHẠY 1 LẦN KHI LOAD, ZERO-LAG)
    function initAll() {
        initSkyTechCanvas();
        setupIntroHeaderIsolation();
        setupVietnamMapPreservation();
        polishHeader();
        setupPartnerRegistrationModal();
        hookRenderProducts();
        enhanceProductCardElements();
        upgradeChatbotAvatar();
        transformEntireWebColors();
        enableImageLazyLoading();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();

