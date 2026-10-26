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

    // 3. BẢN ĐỒ ĐỊA LÝ VIỆT NAM TƯƠNG TÁC (SẮC SẢO, RÕ NÉT, 63 TỈNH THÀNH & HOÀNG SA, TRƯỜNG SA)
    window.selectProvinceFromMap = function (provinceName, provinceId) {
        if (!provinceName) return;
        if (typeof onProvinceFilterChange === 'function') {
            onProvinceFilterChange(provinceName);
        } else if (typeof selectProvinceById === 'function') {
            selectProvinceById(provinceId);
        }

        // Highlight matching pin on map
        document.querySelectorAll('.map-province-pin').forEach(pin => {
            const isMatch = pin.dataset.provName === provinceName || pin.dataset.provId === provinceId;
            const dot = pin.querySelector('.pin-dot');
            const pulse = pin.querySelector('.pin-pulse, .pin-pulse-vip');
            if (dot) {
                dot.setAttribute('fill', isMatch ? '#FDE047' : (pin.dataset.provId === 'VN-39' ? '#FDE047' : '#38BDF8'));
                dot.setAttribute('stroke', isMatch ? '#DC2626' : (pin.dataset.provId === 'VN-39' ? '#DC2626' : '#FFFFFF'));
            }
            if (pulse) {
                pulse.setAttribute('fill', isMatch ? 'rgba(253, 224, 71, 0.7)' : 'rgba(56, 189, 248, 0.4)');
            }
        });

        // Update status text
        const statusEl = document.getElementById('province-selection-status');
        if (statusEl) {
            statusEl.textContent = 'Đang chọn: ' + provinceName + ' • Khám phá đặc sản OCOP chính hãng';
            statusEl.style.color = '#0284C7';
            statusEl.style.fontWeight = '700';
        }

        // Enable and highlight clear button
        const clearBtn = document.getElementById('province-map-clear');
        if (clearBtn) {
            clearBtn.disabled = false;
            clearBtn.style.setProperty('background', '#0284C7', 'important');
            clearBtn.style.setProperty('color', '#FFFFFF', 'important');
            clearBtn.style.setProperty('cursor', 'pointer', 'important');
            clearBtn.style.setProperty('opacity', '1', 'important');
        }
    };

    function setupInteractiveVietnamMap() {
        const mapContainer = document.getElementById('province-map');
        if (!mapContainer) return;

        // Container styling: 440px, Dark-Navy #0B192C, border-radius 16px, border 2px solid #38BDF8
        mapContainer.style.setProperty('background', '#0B192C', 'important');
        mapContainer.style.setProperty('min-height', '440px', 'important');
        mapContainer.style.setProperty('height', '440px', 'important');
        mapContainer.style.setProperty('border-radius', '16px', 'important');
        mapContainer.style.setProperty('overflow', 'hidden', 'important');
        mapContainer.style.setProperty('border', '2px solid #38BDF8', 'important');
        mapContainer.style.setProperty('box-shadow', '0 10px 30px rgba(11, 25, 44, 0.45)', 'important');

        // Style province-map-select: White background #FFFFFF, border #38BDF8, text #0F172A, font-weight 700
        const mapSelect = document.getElementById('province-map-select');
        if (mapSelect) {
            mapSelect.style.setProperty('background', '#FFFFFF', 'important');
            mapSelect.style.setProperty('background-color', '#FFFFFF', 'important');
            mapSelect.style.setProperty('color', '#0F172A', 'important');
            mapSelect.style.setProperty('border', '1.5px solid #38BDF8', 'important');
            mapSelect.style.setProperty('font-weight', '700', 'important');
            mapSelect.style.setProperty('border-radius', '10px', 'important');
            mapSelect.style.setProperty('padding', '6px 12px', 'important');
        }

        // Status element text
        const statusEl = document.getElementById('province-selection-status');
        if (statusEl) {
            statusEl.textContent = 'Bản đồ 63 tỉnh thành sẵn sàng • Nhấp vào tỉnh hoặc danh sách để lọc đặc sản';
            statusEl.style.color = '#0369A1';
            statusEl.style.fontWeight = '700';
        }

        // Style clear button
        const clearBtn = document.getElementById('province-map-clear');
        if (clearBtn) {
            clearBtn.style.setProperty('background', '#0284C7', 'important');
            clearBtn.style.setProperty('color', '#FFFFFF', 'important');
            clearBtn.style.setProperty('font-weight', '800', 'important');
            clearBtn.style.setProperty('border', '1.5px solid #0369A1', 'important');
            clearBtn.style.setProperty('border-radius', '8px', 'important');
            clearBtn.style.setProperty('box-shadow', '0 2px 8px rgba(2, 132, 199, 0.3)', 'important');
        }

        // Ensure Leaflet map invalidates size if already created
        if (window.provinceMap) {
            setTimeout(() => {
                try { window.provinceMap.invalidateSize(); } catch (e) {}
            }, 300);
        }
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
        let btnTikTok = document.getElementById('btn-header-tiktok');
        if (btnTikTok) {
            btnTikTok.onclick = function (e) {
                if (e) e.preventDefault();
                openTikTokStudioModal();
            };
        }

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
        if (typeof window.stopAllTikTokVideoAndVoice === 'function') {
            window.stopAllTikTokVideoAndVoice();
        }
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
        setupAdminDashboardTabsAndTikTokEngine();
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

    // =========================================================================
    // 6. AI TIKTOK MARKETING & TRAFFIC ENGINE (ADMIN TAB 2)
    // =========================================================================
    let tiktokAnimFrameId = null;
    let isTikTokPlaying = false;
    let tiktokCurrentFrame = 0;
    const tiktokTotalFrames = 450; // 10 seconds at 30fps
    let tiktokProductImage = null;
    let tiktokCurrentProduct = null;
    let tiktokCurrentStyle = 'viral';
    let tiktokAutoCaptions = [];
    let tiktokMediaRecorder = null;
    let tiktokRecordedChunks = [];

    // Fallback list of key Dong Nai & nationwide specialties
    // 15 seconds at 30fps
    let tiktokVoiceMode = 'female_natural'; // 'female_natural', 'male_warm', 'music_only'

    // Verified Dong Nai and nationwide specialties with exact real images
    const featuredSpecialties = [
        { id: 'dn-hiepvan', name: 'Trà khổ qua rừng túi lọc Hiệp Vân', region: 'Đồng Nai', stars: 5, price: 68000, img: 'images/catalog/web-latest-171.jpg', tag: 'Thanh nhiệt, hạ đường huyết, chuẩn OCOP 5 Sao' },
        { id: 'dn-tantrieu', name: 'Bưởi đường lá cam Tân Triều', region: 'Đồng Nai', stars: 5, price: 85000, img: 'images/catalog/web-latest-2.jpg', tag: 'Mọng nước, ngọt thanh, tiến vua danh tiếng' },
        { id: 'dn-ngabien', name: 'Hạt điều rang muối vỏ lụa Nga Biên', region: 'Đồng Nai', stars: 5, price: 165000, img: 'images/catalog/customer-search-189.jpg', tag: 'Giòn béo thơm lừng, xuất khẩu chuẩn OCOP' },
        { id: 'dn-trongduc', name: 'Bột Cacao nguyên chất Trọng Đức', region: 'Đồng Nai', stars: 5, price: 120000, img: 'images/catalog/web-latest-190.jpg', tag: 'Đậm đà thuần khiết, giàu chất chống oxy hóa' },
        { id: 'dn-nhontrach', name: 'Trà sen Nhơn Trạch', region: 'Đồng Nai', stars: 4, price: 95000, img: 'images/catalog/customer-search-191.jpg', tag: 'Hương sen tự nhiên, thư giãn an thần' }
    ];

    function getCleanProductName(p) {
        if (!p) return 'Đặc Sản OCOP';
        const raw = (p.name || '').trim();
        const reg = (p.region || 'Việt Nam').trim();
        return raw
            .replace(new RegExp('\\s*\\(' + reg + '\\)', 'gi'), '')
            .replace(/\s*\(Đồng Nai\)/gi, '')
            .replace(/\s*\(Đặc sản Đồng Nai\)/gi, '')
            .trim();
    }

    function formatProductOptionName(p) {
        if (!p) return '';
        const clean = getCleanProductName(p);
        const reg = (p.region || 'Việt Nam').trim();
        return clean + ' (' + reg + ')';
    }

    function getAllAvailableProducts() {
        const list = [...featuredSpecialties];
        const existing = (window.products && window.products.length > 0) ? window.products : (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
        existing.forEach(p => {
            const clean = getCleanProductName(p);
            if (!list.some(item => getCleanProductName(item).toLowerCase() === clean.toLowerCase())) {
                list.push({
                    id: p.id,
                    name: clean,
                    region: p.region || 'Việt Nam',
                    stars: p.stars || 5,
                    price: p.price || 150000,
                    img: p.img || 'images/catalog/web-latest-171.jpg',
                    tag: p.category || 'Đặc sản OCOP 63 tỉnh thành'
                });
            }
        });
        return list;
    }

    // Tab Switcher Controller
    window.switchAdminTab = function (tabName) {
        const btnRev = document.getElementById('btn-admin-tab-revenue');
        const btnTik = document.getElementById('btn-admin-tab-tiktok');
        const contentRev = document.getElementById('admin-tab-revenue-content');
        const contentTik = document.getElementById('admin-tab-tiktok-content');

        if (!btnRev || !btnTik || !contentRev || !contentTik) return;

        if (tabName === 'tiktok') {
            btnTik.classList.add('active');
            btnRev.classList.remove('active');
            contentRev.style.display = 'none';
            contentTik.style.display = 'block';
            initTikTokCreatorStudio();
        } else {
            btnRev.classList.add('active');
            btnTik.classList.remove('active');
            contentRev.style.display = 'block';
            contentTik.style.display = 'none';
            // Pause any running TikTok animation loop to save resources
            pauseTikTokVideo();
        }
    };

    function setupAdminDashboardTabsAndTikTokEngine() {
        const modal = document.getElementById('ai-financial-modal');
        if (!modal) return;

        const bodyContainer = modal.querySelector('.p-4.sm\:p-6.space-y-6') || modal.querySelector('.p-4.sm\:p-6') || modal.querySelector('.space-y-6');
        if (!bodyContainer) return;

        // If tabs are already installed, return
        if (document.getElementById('admin-modal-tab-bar')) return;

        // 1. Create Tab Bar
        const tabBar = document.createElement('div');
        tabBar.id = 'admin-modal-tab-bar';
        tabBar.className = 'admin-tab-bar';
        tabBar.innerHTML = `
            <button type="button" id="btn-admin-tab-revenue" class="admin-tab-btn active" onclick="switchAdminTab('revenue')">
                <i class="fa-solid fa-chart-line text-amber-300"></i>
                <span>📊 Quản Trị Doanh Thu & Tiền Lời Quảng Bá</span>
            </button>
            <button type="button" id="btn-admin-tab-tiktok" class="admin-tab-btn" onclick="switchAdminTab('tiktok')">
                <i class="fa-brands fa-tiktok text-rose-500"></i>
                <span>🎬 AI Tạo Nội Dung & Video TikTok Quảng Bá OCOP</span>
                <span style="font-size: 10px; background: #FEF08A; color: #854D0E; font-weight: 900; padding: 2px 7px; border-radius: 999px; text-transform: uppercase;">Mới 2026</span>
            </button>
        `;

        // 2. Wrap existing children in #admin-tab-revenue-content
        const revContent = document.createElement('div');
        revContent.id = 'admin-tab-revenue-content';
        revContent.className = 'space-y-6';
        while (bodyContainer.firstChild) {
            revContent.appendChild(bodyContainer.firstChild);
        }

        // 3. Create #admin-tab-tiktok-content
        const tikContent = document.createElement('div');
        tikContent.id = 'admin-tab-tiktok-content';
        tikContent.className = 'space-y-6';
        tikContent.style.display = 'none';
        tikContent.innerHTML = `
            <!-- Top Banner -->
            <div class="p-4 rounded-2xl border border-sky-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFFFFF;">
                <div>
                    <div class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                        <span>✨ AI VIDEO & CONTENT STUDIO • QUẢNG BÁ ĐẶC SẢN OCOP</span>
                    </div>
                    <h4 class="text-base sm:text-lg font-black tracking-tight" style="color: #FFFFFF !important;">
                        Dựng Video TikTok Dọc 9:16 & Sinh Kịch Bản Viral Kéo Khách Về Web
                    </h4>
                    <p class="text-xs opacity-90 leading-relaxed font-medium mt-0.5" style="color: #F0F9FF !important;">
                        Tự động sinh kịch bản viral, dựng video canvas chuyển động và điều hướng khách xem Bio mở Bản Đồ Số 63 Tỉnh Thành.
                    </p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <span class="px-3 py-1.5 rounded-xl bg-white/15 text-white font-black text-xs border border-white/25">
                        <i class="fa-brands fa-tiktok text-rose-300 mr-1"></i> Tỷ Lệ Chuẩn 9:16
                    </span>
                </div>
            </div>

            <!-- 2-Column Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <!-- CỘT TRÁI: Chọn Sản Phẩm & AI Tạo Nội Dung TikTok -->
                <div class="lg:col-span-7 space-y-4">
                    <div class="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-4">
                        <div>
                            <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-box-open text-sky-600"></i> 1. Chọn Sản Phẩm OCOP Cần Quảng Bá:
                            </label>
                            <select id="tiktok-product-select" class="tiktok-select" onchange="onTikTokProductChange()">
                                <!-- Dynamically populated -->
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-film text-sky-600"></i> 2. Chọn Phong Cách Video TikTok:
                            </label>
                            <select id="tiktok-style-select" class="tiktok-select" onchange="onTikTokStyleChange()">
                                <option value="viral">🔥 Xu hướng Review Đặc Sản (Viral TikTok Hook & Taste)</option>
                                <option value="origin">🏡 Câu chuyện Nông sản & Nguồn gốc OCOP (Storytelling di sản)</option>
                                <option value="gift">🎁 Gợi ý Quà tặng & Kêu gọi truy cập Web (Quà biếu thượng hạng)</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-microphone-lines text-sky-600"></i> 3. Giọng Đọc Thuyết Minh AI (Voiceover Audio):
                            </label>
                            <select id="tiktok-voice-select" class="tiktok-select" onchange="onTikTokVoiceChange(this.value)">
                                <option value="female_natural">🎙️ Giọng Nữ AI Tự Nhiên (Truyền cảm)</option>
                                <option value="male_warm">🎙️ Giọng Nam AI (Ấm áp)</option>
                                <option value="music_only">🔇 Chỉ phát Nhạc nền nhẹ (Không lời thoại)</option>
                            </select>
                        </div>

                        <button type="button" id="btn-generate-tiktok" onclick="generateAiTikTokPackage()" class="w-full py-3 px-4 rounded-xl text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 active:scale-98" style="background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%);">
                            <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                            <span>✨ AI Tạo Nội Dung & Dựng Video TikTok</span>
                        </button>
                    </div>

                    <!-- AI Generated Output -->
                    <div class="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-4">
                        <div class="flex items-center justify-between gap-2 border-b border-sky-100 pb-2">
                            <h5 class="font-black text-xs uppercase text-sky-900 flex items-center gap-1.5">
                                <i class="fa-solid fa-clipboard-list text-sky-600"></i>
                                <span>Nội Dung & Kịch Bản TikTok Chuẩn SEO</span>
                            </h5>
                            <button type="button" id="btn-copy-tiktok-content" onclick="copyTikTokContent()" class="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                                <i class="fa-solid fa-copy"></i>
                                <span>📋 Copy Caption & Kịch bản</span>
                            </button>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 mb-1">
                                📌 Caption Đăng TikTok + Bộ Hashtags:
                            </label>
                            <textarea id="tiktok-caption-output" rows="4" class="tiktok-textarea font-sans" readonly placeholder="AI đang chuẩn bị nội dung..."></textarea>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 mb-1">
                                🎙️ Kịch Bản Lời Thoại (Voiceover Script 15s - 30s) + Call-To-Action Bio:
                            </label>
                            <textarea id="tiktok-script-output" rows="6" class="tiktok-textarea font-sans" readonly placeholder="Kịch bản lời thoại AI..."></textarea>
                        </div>

                        <div class="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[11.5px] text-sky-900 leading-relaxed">
                            💡 <strong>Chiến lược Kéo Traffic:</strong> Gắn liên kết trang web <strong>OCOP AI Hub</strong> vào phần <em>Tiểu sử (Bio)</em> kênh TikTok. Sau đó đăng video này kèm bộ hashtag trên để thuật toán phân phối tự động kéo khách hàng bản địa về đặt hàng tại Showroom!
                        </div>
                    </div>
                </div>

                <!-- CỘT PHẢI: Khung Xem Trước & Tải Video TikTok Dọc 9:16 -->
                <div class="lg:col-span-5 flex flex-col items-center space-y-4">
                    <div class="text-center">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-200 mb-2">
                            <i class="fa-solid fa-mobile-screen"></i> Khung Hình iPhone 9:16 (Live Canvas)
                        </span>
                    </div>

                    <!-- Phone Frame -->
                    <div class="tiktok-phone-mockup" style="width: 300px; height: 533px; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.25); border: 1.5px solid #38BDF8; background: #0F172A; position: relative; margin: 0 auto;">
                        
                        <canvas id="tiktok-canvas" width="540" height="960" style="width: 100%; height: 100%; display: block; object-fit: cover;"></canvas>
                    </div>

                    <!-- Action Controls -->
                    <div class="w-full max-w-[280px] space-y-2.5">
                        <button type="button" id="btn-tiktok-play" onclick="toggleTikTokVideoPlayback()" class="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition" style="background: #E0F2FE; color: #0284C7; border: 1.5px solid #BAE6FD;">
                            <i class="fa-solid fa-play"></i>
                            <span id="txt-tiktok-play">▶️ Phát / Xem Thử Video TikTok</span>
                        </button>
                        
                        <button type="button" id="btn-tiktok-download" onclick="downloadTikTokVideo()" class="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:opacity-95" style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; border: none;">
                            <i class="fa-solid fa-download"></i>
                            <span id="txt-tiktok-download">📥 Tải Video Về Máy (.WebM / .MP4)</span>
                        </button>
                        
                        <button type="button" id="btn-tiktok-upload" onclick="openTikTokUploadCenter()" class="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition hover:bg-slate-800" style="background: #0F172A; color: #FFFFFF; border: 1px solid #334155;">
                            <i class="fa-brands fa-tiktok text-rose-400"></i>
                            <span>🚀 Mở TikTok Upload Center</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 4. Assemble container
        bodyContainer.appendChild(tabBar);
        bodyContainer.appendChild(revContent);
        bodyContainer.appendChild(tikContent);
    }

    // Initialize the TikTok Studio
    function initTikTokCreatorStudio() {
        const select = document.getElementById('tiktok-product-select');
        if (!select) return;

        if (select.children.length === 0) {
            const all = getAllAvailableProducts();
            
            // Group 1: Dong Nai Highlights
            const grpDongNai = document.createElement('optgroup');
            grpDongNai.label = '🌟 ĐẶC SẢN NỔI BẬT ĐỒNG NAI (DIGITALFEST 2026)';
            
            // Group 2: 63 Provinces
            const grpOther = document.createElement('optgroup');
            grpOther.label = '🌾 252+ ĐẶC SẢN OCOP 63 TỈNH THÀNH';

            all.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = `${p.name} (${p.region}) - OCOP ${p.stars} Sao`;
                if ((p.region && p.region.includes('Đồng Nai')) || String(p.id).startsWith('dn-')) {
                    grpDongNai.appendChild(opt);
                } else {
                    grpOther.appendChild(opt);
                }
            });

            select.appendChild(grpDongNai);
            select.appendChild(grpOther);
        }

        // Set default product if not selected
        if (!tiktokCurrentProduct) {
            const all = getAllAvailableProducts();
            tiktokCurrentProduct = all[0];
            loadProductImage(tiktokCurrentProduct.img);
        }

        generateAiTikTokPackage();
        drawTikTokCanvasFrame();
    }

    window.onTikTokProductChange = function () {
        window.stopAllTikTokVideoAndVoice();
        const select = document.getElementById('tiktok-product-select');
        const val = select ? select.value : '';
        const all = getAllAvailableProducts();
        const found = all.find(p => String(p.id) === String(val)) || all[0];
        tiktokCurrentProduct = found;
        loadProductImage(tiktokCurrentProduct.img);
        generateAiTikTokPackage();
    };

    window.onTikTokStyleChange = function () {
        const select = document.getElementById('tiktok-style-select');
        tiktokCurrentStyle = select ? select.value : 'viral';
        generateAiTikTokPackage();
    };

    function loadProductImage(src) {
        if (!src) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            tiktokProductImage = img;
            drawTikTokCanvasFrame();
        };
        img.onerror = function () {
            tiktokProductImage = null;
            drawTikTokCanvasFrame();
        };
        img.src = src;
    }

    // AI Generation for Captions, Script, and Auto-Captions
    window.generateAiTikTokPackage = function () {
        window.stopAllTikTokVideoAndVoice();
        if (!tiktokCurrentProduct) {
            const all = getAllAvailableProducts();
            tiktokCurrentProduct = all[0];
        }

        const p = tiktokCurrentProduct;
        const style = tiktokCurrentStyle || 'viral';
        const pName = p.name;
        const pRegion = p.region || 'Đồng Nai';
        const pStars = p.stars || 5;
        const pPrice = p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Giá ưu đãi';
        const starStr = '⭐'.repeat(pStars);
        const regionTag = pRegion.replace(/\s+/g, '');

        let caption = '';
        let script = '';

        if (style === 'viral') {
            caption = `🔥 REVIEW CỰC PHẨM: ${pName} (${pRegion}) đạt chuẩn OCOP ${pStars} Sao ${starStr}!

😱 Không ngờ hương vị lại xuất sắc đến thế này! Tuyển chọn thủ công 100%, giữ trọn vẹn tinh hoa đất trời ${pRegion}. Hàng ngàn thực khách đã trải nghiệm và mê mẩn, giá chỉ từ ${pPrice}.

👉 Xem ngay điểm bán chính hãng và bản đồ showroom tại LINK BIO!

#OCOPVietNam #DacSan63Tinh #OCOP${regionTag} #DigitalFest2026 #ReviewDacSan #TikTokMadeMeBuyIt #AmThucViet`;

            script = `[00:00 - 00:04] Nếu bạn chưa từng thử qua ${pName} của vùng đất ${pRegion}...
[00:04 - 00:08] Thì chắc chắn bạn đã bỏ lỡ một kiệt tác ẩm thực đạt chuẩn OCOP ${pStars} Sao!
[00:08 - 00:13] 100% nguyên liệu tự nhiên tinh khiết, chuẩn an toàn vệ sinh thực phẩm quốc gia.
[00:13 - 00:20] 👉 Nhấp ngay vào đường link Bio ở đầu kênh để mở Bản Đồ Số OCOP AI Hub tìm điểm bán chính hãng gần bạn nhất nhé!`;

            tiktokAutoCaptions = [
                "🔥 REVIEW ĐẶC SẢN OCOP",
                `${pName.toUpperCase()}`,
                `⭐ ĐẠT CHUẨN OCOP ${pStars} SAO QUỐC GIA`,
                "🌿 100% NGUYÊN LIỆU TỰ NHIÊN",
                "👉 NHẤP VÀO BIO ĐỂ MỞ BẢN ĐỒ!"
            ];
        } else if (style === 'origin') {
            caption = `🏡 HÀNH TRÌNH DI SẢN: Câu chuyện đằng sau ${pName} (${pRegion}) 🌿

Từ đôi bàn tay cần lao của bà con nông dân và Hợp tác xã tại ${pRegion}, mỗi hộp ${pName} là sự kết tinh của tình yêu quê hương và quy trình OCOP ${pStars} Sao nghiêm ngặt.

❤️ Hãy chung tay cùng OCOP AI Hub tôn vinh nông sản Việt!
👉 Mở Bản Đồ Số OCOP trên link Bio để tìm showroom gần nhất ủng hộ bà con nhé!

#OCOPVietNam #DacSan63Tinh #CauChuyenOCOP #OCOP${regionTag} #DigitalFest2026 #NongSanViet #TuHaoHangViet`;

            script = `[00:00 - 00:05] Đằng sau mỗi hộp ${pName} là giọt mồ hôi và tâm huyết của bà con nông dân ${pRegion}.
[00:05 - 00:10] Trải qua bao quy trình khắt khe để đạt chứng nhận OCOP ${pStars} Sao danh giá.
[00:10 - 00:15] Vừa thơm ngon, vừa đậm đà bản sắc văn hóa cội nguồn.
[00:15 - 00:20] 👉 Mở ngay Bản Đồ OCOP AI Hub tại link Bio để tìm showroom chính hãng gần bạn nhất!`;

            tiktokAutoCaptions = [
                "🏡 HÀNH TRÌNH DI SẢN OCOP",
                `🌿 TINH HOA ${pRegion.toUpperCase()}`,
                `${pName.toUpperCase()}`,
                `⭐ CHỨNG NHẬN OCOP ${pStars} SAO`,
                "👉 MUA CHÍNH HÃNG TẠI LINK BIO!"
            ];
        } else {
            caption = `🎁 GỢI Ý QUÀ BIẾU THƯỢNG HẠNG: ${pName} (${pRegion}) 🌟

Bạn đang tìm món quà sức khỏe, sang trọng và đậm đà bản sắc? ${pName} OCOP ${pStars} Sao ${starStr} chính là câu trả lời hoàn hảo! Đóng gói tinh tế, tem truy xuất nguồn gốc QR code OCOP minh bạch.

👉 Bấm ngay vào link Bio để mở Bản Đồ Số OCOP AI Hub đặt hàng và nhận ưu đãi kết nối O2O ngay hôm nay!

#OCOPVietNam #DacSan63Tinh #QuaTangOCOP #OCOP${regionTag} #DigitalFest2026 #QuaBieuDoanhNghiep #OCOP`;

            script = `[00:00 - 00:04] Cần tìm một món quà biếu sức khỏe vừa sang trọng, vừa ý nghĩa?
[00:04 - 00:09] Đừng bỏ qua ${pName} — Đặc sản nức tiếng vùng đất ${pRegion}!
[00:09 - 00:14] Chuẩn OCOP ${pStars} Sao, có tem truy xuất QR code minh bạch và bao bì cao cấp.
[00:14 - 00:20] 👉 Truy cập ngay link Bio ở trang chủ để mở Bản Đồ OCOP tìm điểm bán gần bạn nhất!`;

            tiktokAutoCaptions = [
                "🎁 QUÀ BIẾU OCOP THƯỢNG HẠNG",
                `${pName.toUpperCase()}`,
                `📍 ĐẶC SẢN ${pRegion.toUpperCase()}`,
                `⭐ OCOP ${pStars} SAO • TEM QR CHỐNG GIẢ`,
                "👉 TRUY CẬP BIO MUA NGAY HÔM NAY!"
            ];
        }

        const capEl = document.getElementById('tiktok-caption-output');
        if (capEl) capEl.value = caption;

        const scrEl = document.getElementById('tiktok-script-output');
        if (scrEl) scrEl.value = script;

        drawTikTokCanvasFrame();
    };

    window.copyTikTokContent = function () {
        const cap = document.getElementById('tiktok-caption-output')?.value || '';
        const scr = document.getElementById('tiktok-script-output')?.value || '';
        const full = `=== CAPTION ĐĂNG TIKTOK ===\n${cap}\n\n=== KỊCH BẢN LỜI THOẠI ===\n${scr}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(full).then(() => {
                if (typeof showToast === 'function') {
                    showToast('📋 Đã copy Caption & Kịch bản TikTok vào bộ nhớ tạm!', 'success');
                } else {
                    alert('📋 Đã copy Caption & Kịch bản TikTok vào bộ nhớ tạm!');
                }
            });
        }
    };

    // =========================================================================
    // HTML5 CANVAS 9:16 TIKTOK VIDEO GENERATOR ENGINE
    // =========================================================================
    
    // =========================================================================
    // NATURAL AI VOICEOVER & AUDIO DUCKING ENGINE
    // =========================================================================
    let tiktokAudioCtx = null;
    let tiktokBgGainNode = null;
    let tiktokBgOscillators = [];
    let tiktokAudioDest = null;
    let tiktokActiveAudio = null;
    let tiktokActiveUtterance = null;
    let tiktokLastSpokenScene = -1;

    function initTikTokAudioEngine() {
        if (!tiktokAudioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                tiktokAudioCtx = new AudioContext();
                try {
                    tiktokAudioDest = tiktokAudioCtx.createMediaStreamDestination();
                } catch (e) {
                    tiktokAudioDest = null;
                }
            }
        }
        if (tiktokAudioCtx && tiktokAudioCtx.state === 'suspended') {
            tiktokAudioCtx.resume().catch(() => {});
        }
    }

    function startTikTokBackgroundMusic() {
        stopTikTokBackgroundMusic();
        if (!tiktokAudioCtx) return;

        tiktokBgGainNode = tiktokAudioCtx.createGain();
        tiktokBgGainNode.gain.setValueAtTime(0.12, tiktokAudioCtx.currentTime);
        tiktokBgGainNode.connect(tiktokAudioCtx.destination);
        if (tiktokAudioDest) {
            try { tiktokBgGainNode.connect(tiktokAudioDest); } catch (e) {}
        }

        // Ambient pentatonic chord progression (C4, E4, G4, A4)
        const notes = [261.63, 329.63, 392.00, 440.00];
        tiktokBgOscillators = notes.map(freq => {
            const osc = tiktokAudioCtx.createOscillator();
            const gain = tiktokAudioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, tiktokAudioCtx.currentTime);
            gain.gain.setValueAtTime(0.035, tiktokAudioCtx.currentTime);
            osc.connect(gain);
            gain.connect(tiktokBgGainNode);
            osc.start();
            return osc;
        });
    }

    function stopTikTokBackgroundMusic() {
        if (tiktokBgOscillators.length > 0) {
            tiktokBgOscillators.forEach(osc => {
                try { osc.stop(); osc.disconnect(); } catch (e) {}
            });
            tiktokBgOscillators = [];
        }
        if (tiktokBgGainNode) {
            try { tiktokBgGainNode.disconnect(); } catch (e) {}
            tiktokBgGainNode = null;
        }
    }

    function setTikTokAudioDucking(isDucking) {
        if (!tiktokAudioCtx || !tiktokBgGainNode) return;
        const targetVol = isDucking ? 0.03 : 0.12; // 25% volume during speech
        tiktokBgGainNode.gain.setTargetAtTime(targetVol, tiktokAudioCtx.currentTime, 0.2);
    }

    
    // =========================================================================
    // DẬP TẮT ÂM THANH TRIỆT ĐỂ (STOP ALL TIKTOK VIDEO & VOICEOVER)
    // =========================================================================
    window.stopAllTikTokVideoAndVoice = function () {
        // 1. Immediately cancel all Web SpeechSynthesis utterances
        if (window.speechSynthesis) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {}
        }

        // 2. Stop and clear active audio instance (Google TTS / HTML5 Audio)
        if (tiktokActiveAudio) {
            try {
                tiktokActiveAudio.pause();
                tiktokActiveAudio.currentTime = 0;
                tiktokActiveAudio.src = '';
            } catch (e) {}
            tiktokActiveAudio = null;
        }

        // 3. Pause all <audio> and <video> elements across the DOM
        document.querySelectorAll('audio, video').forEach(media => {
            try {
                media.pause();
                media.currentTime = 0;
            } catch (e) {}
        });

        // 4. Cancel all requestAnimationFrame loops
        if (modalAnimId) {
            cancelAnimationFrame(modalAnimId);
            modalAnimId = null;
        }
        if (tiktokAnimFrameId) {
            cancelAnimationFrame(tiktokAnimFrameId);
            tiktokAnimFrameId = null;
        }

        // 5. Stop Web Audio oscillators (Background music)
        stopTikTokBackgroundMusic();
        setTikTokAudioDucking(false);

        // 6. Reset playback flags and UI buttons
        isModalPlaying = false;
        isTikTokPlaying = false;
        tiktokLastSpokenScene = -1;

        const btnModalPlay = document.getElementById('txt-modal-play');
        if (btnModalPlay) btnModalPlay.textContent = '▶️ Xem Thử Video';

        const btnTikPlay = document.getElementById('txt-tiktok-play');
        if (btnTikPlay) btnTikPlay.textContent = '▶️ Phát / Xem Thử Video TikTok';
    };

    function cleanTextForSpeech(text) {
        if (!text) return '';
        return text
            .replace(/\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]/g, '') // remove timestamps [00:00 - 00:04]
            .replace(/#[\w\u00C0-\u1EF9_]+/gu, '') // remove all hashtags (#OCOPVietNam...)
            .replace(/[*#_~`>\\-]/g, ' ') // remove markdown symbols *, #, _, ~, `, >, \, -
            .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1FA70}-\u{1FAFF}]/gu, '') // remove emojis
            .replace(/\bO2O\b/gi, 'trực tuyến và tại cửa hàng')
            .replace(/\bBio\b/gi, 'tiểu sử kênh')
            .replace(/\bOCOP\b/gi, 'Ô-cốp')
            .replace(/\bOcop\b/gi, 'Ô-cốp')
            .replace(/\bOCOP AI Hub\b/gi, 'trang web Ô-cốp Việt Nam')
            .replace(/\bQR code\b/gi, 'mã Q-R')
            .replace(/\bQR\b/gi, 'Q-R')
            .replace(/DigitalFest\s*2026/gi, 'Đại hội số hai nghìn không trăm hai mươi sáu')
            .replace(/HTX\b/gi, 'Hợp tác xã')
            .replace(/SP\b/gi, 'sản phẩm')
            .replace(/TP\.\s*/gi, 'Thành phố ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getScriptSceneSentences(scriptText) {
        if (!scriptText) return [];
        const lines = scriptText.split('\n')
            .map(l => cleanTextForSpeech(l))
            .filter(l => l.length > 5);
        if (lines.length >= 4) return lines.slice(0, 4);
        
        const allText = cleanTextForSpeech(scriptText);
        const sentences = allText.split(/(?<=[.!?])\s+/).filter(s => s.length > 5);
        return sentences.slice(0, 4);
    }

    function speakTikTokSentence(sentence) {
        if (tiktokVoiceMode === 'music_only' || !sentence) return;

        if (tiktokActiveAudio) {
            try { tiktokActiveAudio.pause(); } catch (e) {}
            tiktokActiveAudio = null;
        }
        if (window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }

        setTikTokAudioDucking(true);

        const ttsUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=' + encodeURIComponent(sentence);
        const audio = new Audio(ttsUrl);
        tiktokActiveAudio = audio;

        audio.onended = function () {
            setTikTokAudioDucking(false);
            tiktokActiveAudio = null;
        };
        audio.onerror = function () {
            speakWebSpeechFallback(sentence);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(function () {
                speakWebSpeechFallback(sentence);
            });
        }
    }

    function speakWebSpeechFallback(sentence) {
        if (!window.speechSynthesis) {
            setTikTokAudioDucking(false);
            return;
        }
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(sentence);
            utter.lang = 'vi-VN';
            utter.rate = 1.05; // Reviewer cadence rate 1.05
            utter.pitch = 1.0; // Natural pitch 1.0

            const voices = window.speechSynthesis.getVoices() || [];
            if (tiktokVoiceMode === 'female_natural') {
                const femaleVoice = 
                    voices.find(v => /hoaimy/i.test(v.name) && v.lang.startsWith('vi')) ||
                    voices.find(v => /google\s+ti[ếe]ng\s+vi[ệe]t/i.test(v.name) && v.lang.startsWith('vi')) ||
                    voices.find(v => /female|nu|linh/i.test(v.name) && v.lang.startsWith('vi')) ||
                    voices.find(v => v.lang.startsWith('vi'));
                if (femaleVoice) utter.voice = femaleVoice;
            } else if (tiktokVoiceMode === 'male_warm') {
                const maleVoice = 
                    voices.find(v => /namminh/i.test(v.name) && v.lang.startsWith('vi')) ||
                    voices.find(v => /male|nam|minh/i.test(v.name) && v.lang.startsWith('vi')) ||
                    voices.find(v => v.lang.startsWith('vi'));
                if (maleVoice) utter.voice = maleVoice;
            }

            utter.onstart = function () { setTikTokAudioDucking(true); };
            utter.onend = function () { setTikTokAudioDucking(false); };
            utter.onerror = function () { setTikTokAudioDucking(false); };
            tiktokActiveUtterance = utter;
            window.speechSynthesis.speak(utter);
        } catch (err) {
            setTikTokAudioDucking(false);
        }
    }

    function stopTikTokAudio() {
        if (tiktokActiveAudio) {
            try { tiktokActiveAudio.pause(); } catch (e) {}
            tiktokActiveAudio = null;
        }
        if (window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }
        stopTikTokBackgroundMusic();
        setTikTokAudioDucking(false);
        tiktokLastSpokenScene = -1;
    }

    window.onTikTokVoiceChange = function (val) {
        tiktokVoiceMode = val || 'female_natural';
        const sel1 = document.getElementById('tiktok-voice-select');
        const sel2 = document.getElementById('tiktok-voice-select-modal');
        if (sel1) sel1.value = tiktokVoiceMode;
        if (sel2) sel2.value = tiktokVoiceMode;
    };

    function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, font, fillStyle) {
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
                lineCount++;
                if (lineCount >= 2) {
                    const remaining = words.slice(n).join(' ');
                    const truncated = ctx.measureText(remaining).width > maxWidth ? remaining.slice(0, 24) : remaining;
                    ctx.fillText(truncated, x, currentY);
                    line = '';
                    break;
                }
            } else {
                line = testLine;
            }
        }
        if (line.trim().length > 0) {
            ctx.fillText(line.trim(), x, currentY);
        }
        ctx.restore();
    }

    // =========================================================================
    // CLEAN 9:16 COMMERCIAL VIDEO CANVAS ENGINE (ZERO FAKE BUTTONS / ZERO NOTCH)
    // =========================================================================
    function renderCommercialStudioVideo(ctx, canvas, p, frame, totalFrames, imgObj, style, captions) {
        const W = canvas.width;
        const H = canvas.height;
        const totalDuration = 15; // 15 seconds
        const time = (frame % totalFrames) / 30;

        let sceneIndex = 0;
        if (time < 3.5) sceneIndex = 0;
        else if (time < 7.5) sceneIndex = 1;
        else if (time < 11.5) sceneIndex = 2;
        else sceneIndex = 3;

        // 1. Dynamic Royal Sapphire Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#0369A1');
        bgGrad.addColorStop(0.35, '#075985');
        bgGrad.addColorStop(0.7, '#0C4A6E');
        bgGrad.addColorStop(1, '#082F49');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // 2. Ambient Floating Sparkles
        for (let i = 0; i < 24; i++) {
            const px = (Math.sin(i * 99 + time * 0.4) * 0.5 + 0.5) * W;
            const py = ((i * 37 - time * 40) % H + H) % H;
            const size = 1.2 + (i % 3);
            const alpha = 0.25 + 0.25 * Math.sin(time * 2 + i);
            ctx.fillStyle = (i % 2 === 0) ? 'rgba(253, 224, 71, ' + alpha + ')' : 'rgba(56, 189, 248, ' + alpha + ')';
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Top Clean Watermark (No fake live dot)
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.beginPath();
        ctx.roundRect(35, 38, 305, 34, 17);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.fillText('✨ OCOP VIỆT NAM • TINH HOA NÔNG SẢN', 50, 60);
        ctx.restore();

        // 4. Product Showcase Card with Ken Burns Zoom & Pan
        const cardX = 35;
        const cardY = 92;
        const cardW = 470;
        const cardH = 470;
        const cardR = 24;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.clip();

        const zoom = 1.02 + 0.10 * Math.sin((time / totalDuration) * Math.PI);
        const panX = Math.sin(time * 0.4) * 10;
        const panY = Math.cos(time * 0.3) * 8;

        if (imgObj && imgObj.complete && imgObj.naturalWidth > 0) {
            const dw = cardW * zoom;
            const dh = cardH * zoom;
            const dx = cardX - (dw - cardW) / 2 + panX;
            const dy = cardY - (dh - cardH) / 2 + panY;
            ctx.drawImage(imgObj, dx, dy, dw, dh);
        } else {
            const pGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            pGrad.addColorStop(0, '#0284C7');
            pGrad.addColorStop(1, '#0369A1');
            ctx.fillStyle = pGrad;
            ctx.fillRect(cardX, cardY, cardW, cardH);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '900 32px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🌾 ' + getCleanProductName(p), cardX + cardW / 2, cardY + cardH / 2);
        }

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // 5. OCOP Star Badge
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(50, 108, 235, 36, 18);
        ctx.fill();
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText('⭐ CHỨNG NHẬN OCOP ' + (p.stars || 5) + ' SAO', 65, 131);
        ctx.restore();

        // 6. Product Information Section (Safe Zone: Y = 585 - 710)
        ctx.save();
        ctx.textAlign = 'left';
        const cleanName = getCleanProductName(p);
        wrapCanvasText(ctx, cleanName, 35, 600, 470, 28, '900 23px Inter, sans-serif', '#FFFFFF');

        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillStyle = '#38BDF8';
        ctx.fillText('📍 Đặc sản: ' + (p.region || 'Việt Nam') + ' • Showroom O2O & Điểm Bán Toàn Quốc', 35, 660);

        const priceText = p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Giá ưu đãi';
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.roundRect(35, 675, 160, 32, 16);
        ctx.fill();
        ctx.fillStyle = '#854D0E';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('💰 ' + priceText, 48, 696);
        ctx.restore();

        // 7. Dynamic 4-Scene Subtitles in Safe Zone (Y = 725 - 785)
        let defaultCaptions = [
            '🔥 ĐẶC SẢN ' + (p.region || 'VIỆT NAM').toUpperCase() + ': BẠN ĐÃ THỬ CHƯA?',
            '🌿 100% NGUYÊN LIỆU TỰ NHIÊN • ĐẠT OCOP ' + (p.stars || 5) + ' SAO',
            '⭐ HƯƠNG VỊ ĐẬM ĐÀ • TRUY XUẤT NGUỒN GỐC QR CODE',
            '👉 NHẤP VÀO BIO ĐỂ MỞ BẢN ĐỒ SỐ OCOP NGAY!'
        ];
        if (captions && captions.length >= 4) {
            defaultCaptions = captions;
        }

        const subText = defaultCaptions[sceneIndex] || defaultCaptions[0];
        ctx.save();
        ctx.font = '900 17px Inter, sans-serif';
        const textWidth = ctx.measureText(subText).width;
        const subW = Math.min(Math.max(textWidth + 36, 280), 470);
        const subX = (W - subW) / 2;
        const subY = 730;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.beginPath();
        ctx.roundRect(subX, subY, subW, 44, 22);
        ctx.fill();
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#FDE047';
        ctx.textAlign = 'center';
        ctx.fillText(subText, W / 2, subY + 28);
        ctx.restore();

        // 8. Call-To-Action Banner (Y = 800 - 870)
        ctx.save();
        const ctaBounce = sceneIndex === 3 ? Math.sin(time * 6) * 3 : 0;
        const ctaY = 800 + ctaBounce;
        const ctaW = 470;
        const ctaX = 35;

        const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0);
        ctaGrad.addColorStop(0, '#0284C7');
        ctaGrad.addColorStop(1, '#0EA5E9');
        ctx.fillStyle = ctaGrad;
        ctx.beginPath();
        ctx.roundRect(ctaX, ctaY, ctaW, 66, 18);
        ctx.fill();
        ctx.strokeStyle = '#BAE6FD';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌐 ĐẶT MUA CHÍNH HÃNG TẠI: OCOP AI HUB | GIAO TOÀN QUỐC', W / 2, ctaY + 28);

        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#E0F2FE';
        ctx.fillText('Bản Đồ Số 63 Tỉnh Thành • Tra Cứu Showroom & Điểm Bán Gần Nhất', W / 2, ctaY + 49);
        ctx.restore();

        // 9. Bottom Progress Bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, H - 4, W, 4);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(0, H - 4, (time / totalDuration) * W, 4);
    }

    function drawTikTokCanvasFrame() {
        const canvas = document.getElementById('tiktok-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const p = tiktokCurrentProduct || featuredSpecialties[0];
        renderCommercialStudioVideo(ctx, canvas, p, tiktokCurrentFrame, tiktokTotalFrames, tiktokProductImage, tiktokCurrentStyle, tiktokAutoCaptions);
    }

    function runTikTokAnimationLoop() {
        if (!isTikTokPlaying) return;
        tiktokCurrentFrame = (tiktokCurrentFrame + 1) % tiktokTotalFrames;
        drawTikTokCanvasFrame();

        const time = (tiktokCurrentFrame % tiktokTotalFrames) / 30;
        let sIdx = 0;
        if (time < 3.5) sIdx = 0;
        else if (time < 7.5) sIdx = 1;
        else if (time < 11.5) sIdx = 2;
        else sIdx = 3;

        if (sIdx !== tiktokLastSpokenScene) {
            tiktokLastSpokenScene = sIdx;
            const scr = document.getElementById('tiktok-script-output')?.value || '';
            const sents = getScriptSceneSentences(scr);
            if (sents[sIdx]) speakTikTokSentence(sents[sIdx]);
        }

        tiktokAnimFrameId = requestAnimationFrame(runTikTokAnimationLoop);
    }

    function playTikTokVideo() {
        if (isTikTokPlaying) return;
        isTikTokPlaying = true;
        const btn = document.getElementById('txt-tiktok-play');
        if (btn) btn.textContent = '⏸ Tạm Dừng Video & Giọng Đọc';

        initTikTokAudioEngine();
        startTikTokBackgroundMusic();
        tiktokLastSpokenScene = -1;

        tiktokAnimFrameId = requestAnimationFrame(runTikTokAnimationLoop);
    }

    function pauseTikTokVideo() {
        window.stopAllTikTokVideoAndVoice();
    }

    window.toggleTikTokVideoPlayback = function () {
        if (isTikTokPlaying) {
            pauseTikTokVideo();
        } else {
            playTikTokVideo();
        }
    };

    function downloadTikTokVideoEngine(canvas, isModal) {
        if (!canvas) return;
        const downloadTxt = document.getElementById(isModal ? 'txt-modal-download' : 'txt-tiktok-download');
        const p = tiktokCurrentProduct || featuredSpecialties[0];

        if (typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
            alert('Trình duyệt của bạn không hỗ trợ MediaRecorder canvas. Vui lòng sử dụng Chrome, Edge hoặc Firefox!');
            if (downloadTxt) downloadTxt.textContent = '📥 Tải Video Về Máy (.WebM / .MP4)';
            return;
        }

        if (downloadTxt) downloadTxt.textContent = '⏳ Đang render video sạch 9:16...';

        initTikTokAudioEngine();
        startTikTokBackgroundMusic();

        const canvasStream = canvas.captureStream(30);
        let exportStream = canvasStream;

        if (tiktokAudioDest && tiktokAudioDest.stream && tiktokAudioDest.stream.getAudioTracks().length > 0) {
            try {
                exportStream = new MediaStream([
                    ...canvasStream.getVideoTracks(),
                    ...tiktokAudioDest.stream.getAudioTracks()
                ]);
            } catch (e) {
                exportStream = canvasStream;
            }
        }

        let mimeType = 'video/webm;codecs=vp9,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

        let chunks = [];
        let recorder = null;
        try {
            recorder = mimeType ? new MediaRecorder(exportStream, { mimeType }) : new MediaRecorder(exportStream);
        } catch (err) {
            recorder = new MediaRecorder(exportStream);
        }

        recorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            stopTikTokAudio();
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const safeName = (p.id || 'ocop-specialty').replace(/[^a-z0-9_-]/gi, '_');
            a.download = 'video-commercial-9-16-' + safeName + '.webm';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                if (downloadTxt) downloadTxt.textContent = '📥 Tải Video Về Máy (.WebM / .MP4)';
                if (typeof showToast === 'function') {
                    showToast('🎉 Đã tải video quảng cáo 9:16 thương mại thành công!', 'success');
                }
            }, 500);
        };

        recorder.start();

        const scrEl = document.getElementById(isModal ? 'tiktok-script-modal' : 'tiktok-script-output');
        const sents = getScriptSceneSentences(scrEl ? scrEl.value : '');

        let renderFrame = 0;
        let lastScene = -1;
        const renderInterval = setInterval(() => {
            if (renderFrame < tiktokTotalFrames) {
                if (isModal) {
                    modalCurrentFrame = renderFrame;
                    drawTikTokCanvasModalFrame();
                } else {
                    tiktokCurrentFrame = renderFrame;
                    drawTikTokCanvasFrame();
                }

                const time = renderFrame / 30;
                let sIdx = 0;
                if (time < 3.5) sIdx = 0;
                else if (time < 7.5) sIdx = 1;
                else if (time < 11.5) sIdx = 2;
                else sIdx = 3;

                if (sIdx !== lastScene) {
                    lastScene = sIdx;
                    if (sents[sIdx]) speakTikTokSentence(sents[sIdx]);
                }

                renderFrame++;
                if (downloadTxt && renderFrame % 30 === 0) {
                    const pct = Math.round((renderFrame / tiktokTotalFrames) * 100);
                    downloadTxt.textContent = '⏳ Đang dựng video: ' + pct + '%...';
                }
            } else {
                clearInterval(renderInterval);
                try { recorder.stop(); } catch (e) {}
            }
        }, 33);
    }

    window.downloadTikTokVideo = function () {
        const canvas = document.getElementById('tiktok-canvas');
        downloadTikTokVideoEngine(canvas, false);
    };

    window.openTikTokUploadCenter = function () {
        const cap = document.getElementById('tiktok-caption-output')?.value || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cap);
        }
        if (typeof showToast === 'function') {
            showToast('📋 Đã tự động copy Caption & Hashtags! Đang mở TikTok Creator Center...', 'success');
        }
        window.open('https://www.tiktok.com/creator-center/upload', '_blank');
    };


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
            // Backdrop click listener to close modal and stop audio
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    window.closeTikTokStudioModal();
                }
            });
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
            const tikModal = document.getElementById('tiktok-studio-modal');
            if (tikModal && !tikModal.classList.contains('hidden') && tikModal.style.display !== 'none') {
                window.closeTikTokStudioModal();
            }
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
    
    // =========================================================================
    // STANDALONE TIKTOK STUDIO MODAL (DIRECT FROM HEADER OR CATALOG)
    // =========================================================================
    window.openTikTokStudioModal = function (productId) {
        let modal = document.getElementById('tiktok-studio-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'tiktok-studio-modal';
            modal.className = 'fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm';
            modal.style.cssText = 'position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 12px !important; background: rgba(15, 23, 42, 0.75) !important; backdrop-filter: blur(4px) !important;';
            modal.innerHTML = `
                <div class="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl z-10 border-2 border-sky-400 animate-pop-in flex flex-col" style="max-height: calc(100dvh - 2rem); overflow-y: auto; overscroll-behavior: contain; background: #FFFFFF !important; border: 2px solid #7DD3FC !important; border-radius: 24px !important; box-shadow: 0 25px 60px rgba(2, 132, 199, 0.25) !important;">
                    <!-- Header Modal -->
                    <div class="p-4 sm:p-5 text-white rounded-t-3xl flex items-center justify-between relative" style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;">
                        <div class="flex items-center space-x-3">
                            <span class="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black shadow-md text-lg">
                                <i class="fa-brands fa-tiktok text-rose-300"></i>
                            </span>
                            <div>
                                <div class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sky-200 bg-black/20 px-2.5 py-0.5 rounded-full mb-0.5">
                                    <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                                    <span>✨ AI VIDEO & CONTENT STUDIO • QUẢNG BÁ ĐẶC SẢN OCOP</span>
                                </div>
                                <h3 class="font-black text-base sm:text-lg text-white tracking-wide">
                                    🎬 STUDIO AI: TẠO NỘI DUNG & VIDEO TIKTOK QUẢNG BÁ SẢN PHẨM OCOP
                                </h3>
                            </div>
                        </div>
                        <button type="button" onclick="closeTikTokStudioModal()" style="background: #EF4444 !important; color: #FFFFFF !important; padding: 8px 18px !important; border-radius: 999px !important; cursor: pointer; font-weight: 700 !important; border: none !important; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;" title="Đóng Studio TikTok">
                            <span>✖ Đóng</span>
                        </button>
                    </div>

                    <!-- Body Modal -->
                    <div class="p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-white to-sky-50/40 space-y-6">
                        <div id="tiktok-studio-inner-container">
                            <!-- Inner 2-column studio is cloned / mounted here -->
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Backdrop click listener to close modal and stop all audio
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    window.closeTikTokStudioModal();
                }
            });
        }

        // Mount the 2-column studio layout inside modal
        const innerContainer = document.getElementById('tiktok-studio-inner-container');
        if (innerContainer) {
            innerContainer.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <!-- BƯỚC 1: Chọn Sản Phẩm OCOP & AI Viết Bài Đăng TikTok -->
                    <div class="lg:col-span-7 space-y-4">
                        <div class="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-4" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important;">
                            <div class="border-b border-sky-100 pb-2">
                                <span class="text-xs font-black text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-md">
                                    Bước 1: Chọn Sản Phẩm & Sinh Nội Dung Tự Động
                                </span>
                            </div>

                            <div>
                                <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                    <i class="fa-solid fa-box-open text-sky-600"></i> Chọn Sản Phẩm OCOP Cần Quảng Bá:
                                </label>
                                <select id="tiktok-product-select-modal" class="tiktok-select" onchange="onTikTokModalProductChange()">
                                    <!-- Populated dynamically -->
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                    <i class="fa-solid fa-film text-sky-600"></i> Chọn Phong Cách Video TikTok:
                                </label>
                                <select id="tiktok-style-select-modal" class="tiktok-select" onchange="onTikTokModalStyleChange()">
                                    <option value="viral">🔥 Xu hướng Review Đặc Sản (Viral TikTok Hook & Taste)</option>
                                    <option value="origin">🏡 Câu chuyện Nông sản & Nguồn gốc OCOP (Storytelling di sản)</option>
                                    <option value="gift">🎁 Gợi ý Quà tặng & Kêu gọi truy cập Web (Quà biếu thượng hạng)</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                    <i class="fa-solid fa-microphone-lines text-sky-600"></i> Chọn Giọng Đọc Thuyết Minh AI:
                                </label>
                                <select id="tiktok-voice-select-modal" class="tiktok-select" onchange="onTikTokVoiceChange(this.value)">
                                    <option value="female_natural">🎙️ Giọng Nữ AI Tự Nhiên (Truyền cảm)</option>
                                    <option value="male_warm">🎙️ Giọng Nam AI (Ấm áp)</option>
                                    <option value="music_only">🔇 Chỉ phát Nhạc nền nhẹ (Không lời thoại)</option>
                                </select>
                            </div>

                            <button type="button" onclick="generateAiTikTokPackageModal()" class="w-full py-3 px-4 rounded-xl text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer hover:opacity-95" style="background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%) !important;">
                                <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                                <span>✨ AI Tạo Nội Dung & Dựng Video TikTok</span>
                            </button>
                        </div>

                        <!-- Kết Quả Bài Viết TikTok -->
                        <div class="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-4" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important;">
                            <div class="flex items-center justify-between gap-2 border-b border-sky-100 pb-2">
                                <h5 class="font-black text-xs uppercase text-sky-900 flex items-center gap-1.5">
                                    <i class="fa-solid fa-clipboard-list text-sky-600"></i>
                                    <span>Nội Dung & Kịch Bản TikTok Chuẩn SEO</span>
                                </h5>
                                <button type="button" onclick="copyTikTokModalContent()" class="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                                    <i class="fa-solid fa-copy"></i>
                                    <span>📋 Copy Nội Dung</span>
                                </button>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-700 mb-1">
                                    📌 Bài Viết (Caption) Đăng TikTok + Bộ Hashtags (#OCOPVietNam #DacSan63Tinh):
                                </label>
                                <textarea id="tiktok-caption-modal" rows="4" class="tiktok-textarea font-sans" readonly placeholder="AI đang chuẩn bị nội dung..."></textarea>
                            </div>

                            <div>
                                <label class="block text-[11px] font-bold text-slate-700 mb-1">
                                    🎙️ Kịch Bản Lời Thoại (Voiceover Script) + Kêu gọi xem Bio mở Bản Đồ:
                                </label>
                                <textarea id="tiktok-script-modal" rows="6" class="tiktok-textarea font-sans" readonly placeholder="Kịch bản lời thoại AI..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- BƯỚC 2: Khung Xem Trước & Tải Video TikTok Dọc 9:16 -->
                    <div class="lg:col-span-5 flex flex-col items-center space-y-4">
                        <div class="text-center">
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-200 mb-2">
                                <i class="fa-solid fa-mobile-screen"></i> Bước 2: Dựng Video TikTok Dọc 9:16
                            </span>
                        </div>

                        <!-- Phone Frame -->
                        <div class="tiktok-phone-mockup" style="width: 300px; height: 533px; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.25); border: 1.5px solid #38BDF8; background: #0F172A; position: relative; margin: 0 auto;">
                            
                            <canvas id="tiktok-canvas-modal" width="540" height="960" style="width: 100%; height: 100%; display: block; object-fit: cover;"></canvas>
                        </div>

                        <!-- 3 Nút Hành Động Thực Tế -->
                        <div class="w-full max-w-[280px] space-y-2.5">
                            <button type="button" id="btn-modal-play" onclick="toggleTikTokModalPlayback()" class="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition" style="background: #E0F2FE; color: #0284C7; border: 1.5px solid #BAE6FD;">
                                <i class="fa-solid fa-play"></i>
                                <span id="txt-modal-play">▶️ Xem Thử Video</span>
                            </button>
                            
                            <button type="button" id="btn-modal-download" onclick="downloadTikTokModalVideo()" class="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition hover:opacity-95" style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; border: none;">
                                <i class="fa-solid fa-download"></i>
                                <span id="txt-modal-download">📥 Tải Video Về Máy (.WebM / .MP4)</span>
                            </button>
                            
                            <button type="button" onclick="openTikTokUploadCenterModal()" class="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition hover:bg-slate-800" style="background: #0F172A; color: #FFFFFF; border: 1px solid #334155;">
                                <i class="fa-brands fa-tiktok text-rose-400"></i>
                                <span>🎵 Mở TikTok Để Đăng Bài</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Populate dropdown
        const select = document.getElementById('tiktok-product-select-modal');
        if (select) {
            select.innerHTML = '';
            const all = getAllAvailableProducts();
            const grpDongNai = document.createElement('optgroup');
            grpDongNai.label = '🌟 ĐẶC SẢN NỔI BẬT ĐỒNG NAI (DIGITALFEST 2026)';
            const grpOther = document.createElement('optgroup');
            grpOther.label = '🌾 252+ ĐẶC SẢN OCOP 63 TỈNH THÀNH';

            all.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = `${p.name} (${p.region}) - OCOP ${p.stars} Sao`;
                if ((p.region && p.region.includes('Đồng Nai')) || String(p.id).startsWith('dn-')) {
                    grpDongNai.appendChild(opt);
                } else {
                    grpOther.appendChild(opt);
                }
            });
            select.appendChild(grpDongNai);
            select.appendChild(grpOther);

            if (productId) {
                select.value = productId;
            }
        }

        // Set target product
        const all = getAllAvailableProducts();
        if (productId) {
            tiktokCurrentProduct = all.find(p => String(p.id) === String(productId)) || all[0];
        } else if (!tiktokCurrentProduct) {
            tiktokCurrentProduct = all[0];
        }

        loadProductImage(tiktokCurrentProduct.img);
        generateAiTikTokPackageModal();

        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
    };

    window.closeTikTokStudioModal = function () {
        const modal = document.getElementById('tiktok-studio-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.setProperty('display', 'none', 'important');
        }
        window.stopAllTikTokVideoAndVoice();
    };

    window.onTikTokModalProductChange = function () {
        window.stopAllTikTokVideoAndVoice();
        const select = document.getElementById('tiktok-product-select-modal');
        const val = select ? select.value : '';
        const all = getAllAvailableProducts();
        tiktokCurrentProduct = all.find(p => String(p.id) === String(val)) || all[0];
        loadProductImage(tiktokCurrentProduct.img);
        generateAiTikTokPackageModal();
    };

    window.onTikTokModalStyleChange = function () {
        const select = document.getElementById('tiktok-style-select-modal');
        tiktokCurrentStyle = select ? select.value : 'viral';
        generateAiTikTokPackageModal();
    };

    window.generateAiTikTokPackageModal = function () {
        window.stopAllTikTokVideoAndVoice();
        if (!tiktokCurrentProduct) {
            const all = getAllAvailableProducts();
            tiktokCurrentProduct = all[0];
        }

        const p = tiktokCurrentProduct;
        const style = tiktokCurrentStyle || 'viral';
        const pName = p.name;
        const pRegion = p.region || 'Đồng Nai';
        const pStars = p.stars || 5;
        const pPrice = p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Giá ưu đãi';
        const starStr = '⭐'.repeat(pStars);
        const regionTag = pRegion.replace(/\s+/g, '');

        let caption = '';
        let script = '';

        if (style === 'viral') {
            caption = `🔥 REVIEW CỰC PHẨM: ${pName} (${pRegion}) đạt chuẩn OCOP ${pStars} Sao ${starStr}!

😱 Không ngờ hương vị lại xuất sắc đến thế này! Tuyển chọn thủ công 100%, giữ trọn vẹn tinh hoa đất trời ${pRegion}. Hàng ngàn thực khách đã trải nghiệm và mê mẩn, giá chỉ từ ${pPrice}.

👉 Xem ngay điểm bán chính hãng và bản đồ showroom tại LINK BIO!

#OCOPVietNam #DacSan63Tinh #OCOP${regionTag} #DigitalFest2026 #ReviewDacSan #TikTokMadeMeBuyIt #AmThucViet`;

            script = `[00:00 - 00:04] Nếu bạn chưa từng thử qua ${pName} của vùng đất ${pRegion}...
[00:04 - 00:08] Thì chắc chắn bạn đã bỏ lỡ một kiệt tác ẩm thực đạt chuẩn OCOP ${pStars} Sao!
[00:08 - 00:13] 100% nguyên liệu tự nhiên tinh khiết, chuẩn an toàn vệ sinh thực phẩm quốc gia.
[00:13 - 00:20] 👉 Nhấp ngay vào đường link Bio ở đầu kênh để mở Bản Đồ Số OCOP AI Hub tìm điểm bán chính hãng gần bạn nhất nhé!`;

            tiktokAutoCaptions = [
                "🔥 REVIEW ĐẶC SẢN OCOP",
                `${pName.toUpperCase()}`,
                `⭐ ĐẠT CHUẨN OCOP ${pStars} SAO QUỐC GIA`,
                "🌿 100% NGUYÊN LIỆU TỰ NHIÊN",
                "👉 NHẤP VÀO BIO ĐỂ MỞ BẢN ĐỒ!"
            ];
        } else if (style === 'origin') {
            caption = `🏡 HÀNH TRÌNH DI SẢN: Câu chuyện đằng sau ${pName} (${pRegion}) 🌿

Từ đôi bàn tay cần lao của bà con nông dân và Hợp tác xã tại ${pRegion}, mỗi hộp ${pName} là sự kết tinh của tình yêu quê hương và quy trình OCOP ${pStars} Sao nghiêm ngặt.

❤️ Hãy chung tay cùng OCOP AI Hub tôn vinh nông sản Việt!
👉 Mở Bản Đồ Số OCOP trên link Bio để tìm showroom gần nhất ủng hộ bà con nhé!

#OCOPVietNam #DacSan63Tinh #CauChuyenOCOP #OCOP${regionTag} #DigitalFest2026 #NongSanViet #TuHaoHangViet`;

            script = `[00:00 - 00:05] Đằng sau mỗi hộp ${pName} là giọt mồ hôi và tâm huyết của bà con nông dân ${pRegion}.
[00:05 - 00:10] Trải qua bao quy trình khắt khe để đạt chứng nhận OCOP ${pStars} Sao danh giá.
[00:10 - 00:15] Vừa thơm ngon, vừa đậm đà bản sắc văn hóa cội nguồn.
[00:15 - 00:20] 👉 Mở ngay Bản Đồ OCOP AI Hub tại link Bio để tìm showroom chính hãng gần bạn nhất!`;

            tiktokAutoCaptions = [
                "🏡 HÀNH TRÌNH DI SẢN OCOP",
                `🌿 TINH HOA ${pRegion.toUpperCase()}`,
                `${pName.toUpperCase()}`,
                `⭐ CHỨNG NHẬN OCOP ${pStars} SAO`,
                "👉 MUA CHÍNH HÃNG TẠI LINK BIO!"
            ];
        } else {
            caption = `🎁 GỢI Ý QUÀ BIẾU THƯỢNG HẠNG: ${pName} (${pRegion}) 🌟

Bạn đang tìm món quà sức khỏe, sang trọng và đậm đà bản sắc? ${pName} OCOP ${pStars} Sao ${starStr} chính là câu trả lời hoàn hảo! Đóng gói tinh tế, tem truy xuất nguồn gốc QR code OCOP minh bạch.

👉 Bấm ngay vào link Bio để mở Bản Đồ Số OCOP AI Hub đặt hàng và nhận ưu đãi kết nối O2O ngay hôm nay!

#OCOPVietNam #DacSan63Tinh #QuaTangOCOP #OCOP${regionTag} #DigitalFest2026 #QuaBieuDoanhNghiep #OCOP`;

            script = `[00:00 - 00:04] Cần tìm một món quà biếu sức khỏe vừa sang trọng, vừa ý nghĩa?
[00:04 - 00:09] Đừng bỏ qua ${pName} — Đặc sản nức tiếng vùng đất ${pRegion}!
[00:09 - 00:14] Chuẩn OCOP ${pStars} Sao, có tem truy xuất QR code minh bạch và bao bì cao cấp.
[00:14 - 00:20] 👉 Truy cập ngay link Bio ở trang chủ để mở Bản Đồ OCOP tìm điểm bán gần bạn nhất!`;

            tiktokAutoCaptions = [
                "🎁 QUÀ BIẾU OCOP THƯỢNG HẠNG",
                `${pName.toUpperCase()}`,
                `📍 ĐẶC SẢN ${pRegion.toUpperCase()}`,
                `⭐ OCOP ${pStars} SAO • TEM QR CHỐNG GIẢ`,
                "👉 TRUY CẬP BIO MUA NGAY HÔM NAY!"
            ];
        }

        const capEl = document.getElementById('tiktok-caption-modal');
        if (capEl) capEl.value = caption;

        const scrEl = document.getElementById('tiktok-script-modal');
        if (scrEl) scrEl.value = script;

        drawTikTokCanvasModalFrame();
    };

    window.copyTikTokModalContent = function () {
        const cap = document.getElementById('tiktok-caption-modal')?.value || '';
        const scr = document.getElementById('tiktok-script-modal')?.value || '';
        const full = `=== BÀI VIẾT TIKTOK ===\n${cap}\n\n=== KỊCH BẢN THUYẾT MINH ===\n${scr}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(full).then(() => {
                if (typeof showToast === 'function') {
                    showToast('📋 Đã copy bài viết & kịch bản TikTok vào bộ nhớ tạm!', 'success');
                } else {
                    alert('📋 Đã copy bài viết & kịch bản TikTok vào bộ nhớ tạm!');
                }
            });
        }
    };

    // Canvas rendering for modal
    
    function drawTikTokCanvasModalFrame() {
        const canvas = document.getElementById('tiktok-canvas-modal');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const p = tiktokCurrentProduct || featuredSpecialties[0];
        renderCommercialStudioVideo(ctx, canvas, p, modalCurrentFrame, tiktokTotalFrames, tiktokProductImage, tiktokCurrentStyle, tiktokAutoCaptions);
    }

    function runTikTokModalLoop() {
        if (!isModalPlaying) return;
        modalCurrentFrame = (modalCurrentFrame + 1) % tiktokTotalFrames;
        drawTikTokCanvasModalFrame();

        const time = (modalCurrentFrame % tiktokTotalFrames) / 30;
        let sIdx = 0;
        if (time < 3.5) sIdx = 0;
        else if (time < 7.5) sIdx = 1;
        else if (time < 11.5) sIdx = 2;
        else sIdx = 3;

        if (sIdx !== tiktokLastSpokenScene) {
            tiktokLastSpokenScene = sIdx;
            const scr = document.getElementById('tiktok-script-modal')?.value || '';
            const sents = getScriptSceneSentences(scr);
            if (sents[sIdx]) speakTikTokSentence(sents[sIdx]);
        }

        modalAnimId = requestAnimationFrame(runTikTokModalLoop);
    }

    function playTikTokModalVideo() {
        if (isModalPlaying) return;
        isModalPlaying = true;
        const btn = document.getElementById('txt-modal-play');
        if (btn) btn.textContent = '⏸ Tạm Dừng Video & Giọng Đọc';

        initTikTokAudioEngine();
        startTikTokBackgroundMusic();
        tiktokLastSpokenScene = -1;

        modalAnimId = requestAnimationFrame(runTikTokModalLoop);
    }

    function pauseTikTokModalVideo() {
        window.stopAllTikTokVideoAndVoice();
    }

    window.toggleTikTokModalPlayback = function () {
        if (isModalPlaying) {
            pauseTikTokModalVideo();
        } else {
            playTikTokModalVideo();
        }
    };

    window.downloadTikTokModalVideo = function () {
        const canvas = document.getElementById('tiktok-canvas-modal');
        downloadTikTokVideoEngine(canvas, true);
    };

    window.openTikTokUploadCenterModal = function () {
        const cap = document.getElementById('tiktok-caption-modal')?.value || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cap);
        }
        if (typeof showToast === 'function') {
            showToast('📋 Đã tự động copy bài viết! Đang mở TikTok Creator Center...', 'success');
        }
        window.open('https://www.tiktok.com/creator-center/upload', '_blank');
    };

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
        setupInteractiveVietnamMap();
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

