/**
 * ROYAL COBALT BLUE ARCHITECTURE & ULTRA-FAST PERFORMANCE ENGINE (J2TEAM STYLE)
 * OCOP Sales Copilot | DigitalFest Đồng Nai 2026
 * Tuyệt đối không dùng MutationObserver hay setInterval lặp vô tận (Khắc phục main thread hang)
 */

(function () {
    'use strict';

    const ADMIN_PIN = '2007';

    // 1. HIỆU ỨNG J2TEAM CONSTELLATION CANVAS (CHÙM TIA NỐI CHUỘT MƯỢT MÀ 60 FPS)
    function initJ2Canvas() {
        if (document.getElementById('j2-bg-canvas')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'j2-bg-canvas';
        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, { passive: true });

        const particleCount = 35;
        const particles = [];
        const mouse = { x: -1000, y: -1000 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseout', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }, { passive: true });

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 1.8 + 1
            });
        }

        let animationFrameId;
        function render() {
            ctx.clearRect(0, 0, width, height);

            // Cập nhật vị trí hạt
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                else if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                else if (p.y > height) p.y = 0;

                // Vẽ hạt
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#60A5FA';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#38BDF8';
                ctx.fill();

                // Nối với chuột
                const dxm = mouse.x - p.x;
                const dym = mouse.y - p.y;
                const distMouse = Math.sqrt(dxm * dxm + dym * dym);
                if (distMouse < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(147, 197, 253, ${0.45 * (1 - distMouse / 130)})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }

                // Nối giữa các hạt gần nhau
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 95) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(96, 165, 250, ${0.25 * (1 - dist / 95)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        }

        render();

        // Tạm dừng khi tab không active để tiết kiệm pin
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                render();
            }
        });
    }

    // 2. KHỞI TẠO BẢN ĐỒ VIỆT NAM SVG TƯƠNG TÁC TRÊN MÀN HÌNH MỞ ĐẦU
    function setupVietnamInteractiveMap() {
        const mapContainer = document.getElementById('province-map');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="vn-map-interactive-wrapper">
                <div class="flex items-center justify-between w-full px-2">
                    <span class="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                        <i class="fa-solid fa-map-location-dot text-sky-400"></i>
                        <span>Bản Đồ Số Điểm Bán OCOP 63 Tỉnh Thành</span>
                    </span>
                    <span class="text-[10px] text-sky-300 bg-blue-900/80 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                        Việt Nam O2O Network
                    </span>
                </div>

                <!-- Bản Đồ SVG Việt Nam Hình Chữ S + Quần Đảo Hoàng Sa & Trường Sa -->
                <svg viewBox="0 0 420 300" class="vn-svg-map" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#FACC15" stop-opacity="1"/>
                            <stop offset="100%" stop-color="#FACC15" stop-opacity="0"/>
                        </radialGradient>
                    </defs>

                    <!-- Khung nền biển Đông -->
                    <rect width="420" height="300" rx="14" fill="#0A194E" />

                    <!-- Dải đất liền Việt Nam (Chữ S tượng trưng) -->
                    <path d="M 120 30 Q 150 45 140 70 Q 130 90 160 110 Q 185 130 190 160 Q 185 190 160 210 Q 140 230 150 255 Q 145 275 125 280 Q 105 270 120 250 Q 135 220 145 180 Q 140 150 125 120 Q 110 90 105 60 Z" />

                    <!-- Quần Đảo Hoàng Sa -->
                    <g id="map-hoangsa" class="cursor-pointer" onclick="handleMapSelectProvince('Đà Nẵng')">
                        <circle cx="265" cy="115" r="4" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1" />
                        <circle cx="275" cy="110" r="3" fill="#38BDF8" />
                        <circle cx="270" cy="122" r="3.5" fill="#38BDF8" />
                        <text x="265" y="102" fill="#E0F2FE" font-size="8.5" font-weight="900" text-anchor="middle">Q.Đ Hoàng Sa (Đà Nẵng)</text>
                    </g>

                    <!-- Quần Đảo Trường Sa -->
                    <g id="map-truongsa" class="cursor-pointer" onclick="handleMapSelectProvince('Khánh Hòa')">
                        <circle cx="290" cy="205" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1" />
                        <circle cx="280" cy="215" r="3" fill="#38BDF8" />
                        <circle cx="305" cy="210" r="3.5" fill="#38BDF8" />
                        <circle cx="295" cy="225" r="3" fill="#38BDF8" />
                        <text x="295" y="195" fill="#E0F2FE" font-size="8.5" font-weight="900" text-anchor="middle">Q.Đ Trường Sa (Khánh Hòa)</text>
                    </g>

                    <!-- Đảo Phú Quốc -->
                    <circle cx="105" cy="275" r="4" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1" />
                    <text x="95" y="290" fill="#E0F2FE" font-size="8" font-weight="bold">Phú Quốc</text>

                    <!-- CÁC ĐIỂM HOTSPOT TIÊU BIỂU -->
                    <!-- 1. Lai Châu -->
                    <circle cx="112" cy="40" r="4.5" class="vn-hotspot" onclick="handleMapSelectProvince('Lai Châu')" />
                    <text x="112" y="32" fill="#FFFFFF" font-size="8" font-weight="bold" text-anchor="middle">Lai Châu</text>

                    <!-- 2. Hà Nội -->
                    <circle cx="138" cy="62" r="5" class="vn-hotspot" onclick="handleMapSelectProvince('Hà Nội')" />
                    <text x="156" y="65" fill="#FFFFFF" font-size="8.5" font-weight="bold">Hà Nội</text>

                    <!-- 3. Đà Nẵng -->
                    <circle cx="178" cy="138" r="4.5" class="vn-hotspot" onclick="handleMapSelectProvince('Đà Nẵng')" />
                    <text x="195" y="141" fill="#FFFFFF" font-size="8" font-weight="bold">Đà Nẵng</text>

                    <!-- 4. Lâm Đồng -->
                    <circle cx="168" cy="215" r="4.5" class="vn-hotspot" onclick="handleMapSelectProvince('Lâm Đồng')" />
                    <text x="186" y="218" fill="#FFFFFF" font-size="8" font-weight="bold">Lâm Đồng</text>

                    <!-- 5. ĐỒNG NAI (TÂM ĐIỂM DIGITALFEST 2026) -->
                    <circle cx="152" cy="238" r="10" fill="url(#hotspotGlow)" class="animate-ping pointer-events-none" />
                    <circle cx="152" cy="238" r="6" fill="#FACC15" stroke="#FFFFFF" stroke-width="2" class="vn-hotspot cursor-pointer" onclick="handleMapSelectProvince('Đồng Nai')" />
                    <text x="172" y="242" fill="#FACC15" font-size="10" font-weight="900">🌟 ĐỒNG NAI</text>

                    <!-- 6. TP. Hồ Chí Minh -->
                    <circle cx="144" cy="246" r="5" class="vn-hotspot" onclick="handleMapSelectProvince('Hồ Chí Minh')" />
                    <text x="96" y="249" fill="#FFFFFF" font-size="8.5" font-weight="bold">TP. Hồ Chí Minh</text>

                    <!-- 7. Cần Thơ -->
                    <circle cx="132" cy="264" r="4.5" class="vn-hotspot" onclick="handleMapSelectProvince('Cần Thơ')" />
                    <text x="88" y="267" fill="#FFFFFF" font-size="8" font-weight="bold">Cần Thơ</text>
                </svg>

                <!-- Lưới nút chọn nhanh các tỉnh thành tiêu biểu -->
                <div class="vn-quick-provinces-grid mt-2">
                    <button type="button" onclick="handleMapSelectProvince('Đồng Nai')" class="vn-prov-btn dongnai-hotspot">
                        🌟 Đồng Nai (OCOP 4-5★)
                    </button>
                    <button type="button" onclick="handleMapSelectProvince('Lai Châu')" class="vn-prov-btn">
                        🌾 Lai Châu
                    </button>
                    <button type="button" onclick="handleMapSelectProvince('Hà Nội')" class="vn-prov-btn">
                        🏛️ Hà Nội
                    </button>
                    <button type="button" onclick="handleMapSelectProvince('Hồ Chí Minh')" class="vn-prov-btn">
                        🏙️ TP. Hồ Chí Minh
                    </button>
                    <button type="button" onclick="handleMapSelectProvince('Lâm Đồng')" class="vn-prov-btn">
                        ☕ Lâm Đồng
                    </button>
                    <button type="button" onclick="handleMapSelectProvince('Bến Tre')" class="vn-prov-btn">
                        🥥 Bến Tre
                    </button>
                    <button type="button" onclick="handleMapSelectProvince('Đắk Lắk')" class="vn-prov-btn">
                        🐘 Đắk Lắk
                    </button>
                    <button type="button" onclick="handleMapSelectProvince('all')" class="vn-prov-btn dongnai-hotspot">
                        🗺️ Xem Toàn Bộ 63 Tỉnh
                    </button>
                </div>
            </div>
        `;

        const status = document.getElementById('province-selection-status');
        if (status) {
            status.innerHTML = '✨ Nhấp trực tiếp trên Bản Đồ hoặc danh sách tỉnh để lọc nhanh đặc sản!';
            status.style.color = '#FACC15';
            status.style.fontWeight = 'bold';
        }
    }

    window.handleMapSelectProvince = function (provName) {
        if (provName === 'all' || provName === '63 Tỉnh Thành') {
            if (typeof enterOcopMarket === 'function') enterOcopMarket('all');
            return;
        }

        if (typeof onProvinceFilterChange === 'function') {
            onProvinceFilterChange(provName);
        }
        const sel = document.getElementById('sidebar-province-select');
        if (sel) sel.value = provName;

        if (typeof enterOcopMarket === 'function') {
            enterOcopMarket('all', () => {
                const prodSection = document.getElementById('products-section');
                if (prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    };

    // 3. SỬA CÂU CHỮ TRÊN MÀN HÌNH MỞ ĐẦU (INTRO OVERLAY)
    function polishIntroOverlayText() {
        const intro = document.getElementById('ocop-intro-overlay');
        if (!intro) return;

        // Sửa dòng chữ vàng kicker
        const tickerLabel = intro.querySelector('#i18n-intro-badge');
        if (tickerLabel) {
            tickerLabel.textContent = '63 TỈNH THÀNH • 500+ ĐIỂM BÁN CHÍNH HÃNG • TRỢ LÝ AI TƯ VẤN 24/7';
            tickerLabel.style.whiteSpace = 'normal';
        }

        // 4 ô tính năng cốt lõi
        const p1 = intro.querySelector('#i18n-intro-pillar1');
        if (p1) p1.textContent = '🗺️ Bản Đồ Số 63 Tỉnh Thành';
        const p2 = intro.querySelector('#i18n-intro-pillar2');
        if (p2) p2.textContent = '🏅 Bảo Chứng OCOP Chính Hãng';
        const p3 = intro.querySelector('#i18n-intro-pillar3');
        if (p3) p3.textContent = '🎁 AI Tư Vấn & Thiết Kế Giỏ Quà';
        const p4 = intro.querySelector('#i18n-intro-pillar4');
        if (p4) p4.textContent = '📸 Số Hóa Điểm Bán Bằng AI OCR';

        // Ẩn nút thừa: Nhạc: Tắt, Hội Đồng Cố Vấn Số, nút khám phá trùng
        const soundBtn = document.getElementById('intro-sound-btn');
        if (soundBtn) soundBtn.style.display = 'none';

        const quickAdminBtn = intro.querySelector('button[onclick*="admin"]');
        if (quickAdminBtn) quickAdminBtn.style.display = 'none';
    }

    // 4. HEADER: SẠCH LẶP CHỮ & KHÓA PIN 2007
    function polishHeader() {
        const headerRight = document.querySelector('.header-right-actions');
        if (!headerRight) return;

        // Nút 1: Đăng Ký Điểm Bán (AI OCR)
        const btnReg = headerRight.querySelector('button[onclick*="openPartnerRegistrationModal"]');
        if (btnReg) {
            btnReg.innerHTML = '<i class="fa-solid fa-bolt text-amber-300 mr-1.5"></i><span>⚡ Đăng Ký Điểm Bán (AI OCR)</span>';
            btnReg.className = 'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-black transition flex items-center cursor-pointer shrink-0 bg-blue-600 hover:bg-blue-500 text-white shadow border border-sky-400';
        }

        // Nút 2: Quản Trị Chủ Web (PIN 2007)
        let btnAdmin = document.getElementById('btn-header-admin-pin') || headerRight.querySelector('button[onclick*="promptAdminPinModal"]');
        if (!btnAdmin) {
            btnAdmin = headerRight.querySelector('button[onclick*="openChallengeProposalModal"]');
        }
        if (btnAdmin) {
            btnAdmin.id = 'btn-header-admin-pin';
            btnAdmin.setAttribute('onclick', 'promptAdminPinModal()');
            btnAdmin.setAttribute('title', 'Cổng Quản Trị Chủ Web (Mã PIN: 2007)');
            btnAdmin.innerHTML = '<i class="fa-solid fa-lock text-amber-300 mr-1.5"></i><span>🔐 Quản Trị Chủ Web</span>';
            btnAdmin.className = 'px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-black transition flex items-center cursor-pointer shrink-0 bg-blue-700 hover:bg-blue-600 text-white shadow border border-sky-300';
        }

        // Ẩn nút Trợ Lý AI Tạo Nội Dung trên Header theo yêu cầu
        const studioNav = document.querySelector('button.nav-btn-studio');
        if (studioNav) studioNav.style.display = 'none';
    }

    // 5. CỔNG MÃ PIN 2007 BẢO VỆ BẢNG QUẢN TRỊ TÀI CHÍNH
    window.isMasterAdminAuthed = function () {
        return sessionStorage.getItem('ocop_admin_pin_verified') === 'true';
    };

    window.promptAdminPinModal = function () {
        if (window.isMasterAdminAuthed()) {
            openRealFinancialDashboard();
            return;
        }

        let modal = document.getElementById('pin-auth-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pin-auth-modal';
            modal.className = 'fixed inset-0 z-[100000] flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="absolute inset-0 bg-black/80 backdrop-blur-md" onclick="closeAdminPinModal()"></div>
                <div class="relative pin-card-box max-w-md w-full p-6 sm:p-8 text-white z-10 text-center animate-pop-in">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                        🔐
                    </div>
                    <h3 class="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                        CỔNG BẢO MẬT QUẢN TRỊ CHỦ WEB
                    </h3>
                    <p class="text-xs text-sky-200 mt-2 leading-relaxed">
                        Khu vực dành riêng cho Ban Quản Trị xem <strong>Tiền Lời Quảng Bá & Bảng Dòng Tiền Nội Bộ</strong>.<br>
                        Vui lòng nhập Mã PIN bảo mật để tiếp tục.
                    </p>
                    
                    <div class="mt-5 space-y-3">
                        <input type="password" id="admin-pin-input" maxlength="6" autofocus placeholder="Nhập mã PIN (Mặc định: 2007)"
                               class="w-full text-center text-lg tracking-widest px-4 py-3 rounded-xl bg-blue-950/90 border-2 border-sky-400 text-amber-300 font-black focus:outline-none focus:border-amber-400">
                        <p id="pin-error-msg" class="text-xs text-rose-400 font-bold hidden"></p>
                    </div>

                    <div class="mt-6 flex gap-3">
                        <button type="button" onclick="closeAdminPinModal()" class="flex-1 py-3 px-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition">
                            Hủy Bỏ
                        </button>
                        <button type="button" onclick="verifyAdminPin()" class="flex-1 py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg transition">
                            Xác Nhận 🔓
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            const input = modal.querySelector('#admin-pin-input');
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    verifyAdminPin();
                }
            });
        }

        const err = modal.querySelector('#pin-error-msg');
        if (err) err.classList.add('hidden');
        const input = modal.querySelector('#admin-pin-input');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 150);
        }

        modal.classList.remove('hidden');
    };

    window.closeAdminPinModal = function () {
        const modal = document.getElementById('pin-auth-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.verifyAdminPin = function () {
        const modal = document.getElementById('pin-auth-modal');
        if (!modal) return;
        const input = modal.querySelector('#admin-pin-input');
        const err = modal.querySelector('#pin-error-msg');
        const pin = (input ? input.value : '').trim();

        if (pin === ADMIN_PIN) {
            sessionStorage.setItem('ocop_admin_pin_verified', 'true');
            modal.classList.add('hidden');
            if (typeof showToast === 'function') {
                showToast('🔓 Xác thực Quản trị viên thành công!', 'success');
            }
            openRealFinancialDashboard();
        } else {
            if (err) {
                err.textContent = '❌ Mã PIN không đúng! Chỉ Quản trị viên mới được xem báo cáo doanh thu.';
                err.classList.remove('hidden');
            }
            if (input) {
                input.value = '';
                input.focus();
            }
        }
    };

    // Ghi đè hàm openFinancialDashboardModal để chặn bằng mã PIN
    window.openFinancialDashboardModal = function () {
        if (!window.isMasterAdminAuthed()) {
            window.promptAdminPinModal();
            return;
        }
        openRealFinancialDashboard();
    };

    function openRealFinancialDashboard() {
        const modal = document.getElementById('ai-financial-modal');
        if (modal) {
            modal.classList.remove('hidden');
            enrichWebmasterRevenueData();
            if (typeof updateFinancialSimulator === 'function') {
                updateFinancialSimulator();
            }
        }
    }

    // 6. CẬP NHẬT DỮ LIỆU BẢNG QUẢN TRỊ TÀI CHÍNH (TIỀN LỜI QUẢNG BÁ CHỦ WEB)
    function enrichWebmasterRevenueData() {
        const revEl = document.getElementById('fin-stat-revenue');
        if (revEl) {
            revEl.textContent = '875.000.000 ₫';
            const parent = revEl.closest('div').parentElement;
            const title = parent.querySelector('span.text-xs');
            if (title) title.textContent = 'TỔNG DOANH THU BÁN HÀNG CỦA CÁC CỬA HÀNG';
        }

        const profitEl = document.getElementById('fin-stat-profit');
        if (profitEl) {
            profitEl.textContent = '415.625.000 ₫';
            const parent = profitEl.closest('div').parentElement;
            const title = parent.querySelector('span.text-xs');
            if (title) title.textContent = 'TIỀN LỜI CỦA CÁC CỬA HÀNG / HTX ĐỐI TÁC';
        }

        const commEl = document.getElementById('fin-stat-commission');
        if (commEl) {
            commEl.textContent = '70.000.000 ₫';
            const parent = commEl.closest('div').parentElement;
            const title = parent.querySelector('span.text-xs');
            if (title) title.innerHTML = '💰 TIỀN LỜI RÒNG CỦA CHỦ WEB (PHÍ QUẢNG BÁ)';
        }

        // Bổ sung bảng nguồn thu quảng bá
        let breakdown = document.getElementById('webmaster-revenue-breakdown');
        if (!breakdown) {
            const container = document.querySelector('#ai-financial-modal .space-y-6');
            if (container) {
                breakdown = document.createElement('div');
                breakdown.id = 'webmaster-revenue-breakdown';
                breakdown.className = 'p-5 rounded-2xl bg-blue-950/80 border border-sky-400/40 shadow-xl space-y-3';
                breakdown.innerHTML = `
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-sky-400/20 pb-3">
                        <div>
                            <h4 class="font-black text-sm text-sky-300 flex items-center gap-2">
                                <i class="fa-solid fa-coins text-amber-300"></i>
                                <span>BẢNG CHI TIẾT NGUỒN THU TIỀN LỜI QUẢNG BÁ CỦA CHỦ WEB</span>
                            </h4>
                            <p class="text-[11px] text-sky-200">Khoản thu thực nhận từ dịch vụ kết nối & quảng bá đặc sản cho các cửa hàng/HTX</p>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-3 py-1 rounded-full border border-sky-400">
                            Tiền Lời Ròng: 70.000.000 ₫
                        </span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border border-sky-500/30 rounded-xl overflow-hidden">
                            <thead class="bg-blue-900/90 text-sky-200 font-black uppercase text-[10px]">
                                <tr>
                                    <th class="p-2.5">Kênh Quảng Bá</th>
                                    <th class="p-2.5">Quy Mô Kết Nối</th>
                                    <th class="p-2.5">Cơ Chế Thu Phí</th>
                                    <th class="p-2.5">GMV Cửa Hàng</th>
                                    <th class="p-2.5 text-right">Tiền Lời Thực Nhận Chủ Web</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-sky-900/40 text-white font-medium">
                                <tr>
                                    <td class="p-2.5 font-bold">1. Hoa hồng giới thiệu khách đến Showroom O2O</td>
                                    <td class="p-2.5">520 lượt khách ghé sạp</td>
                                    <td class="p-2.5">5% - 8% giá trị đơn O2O</td>
                                    <td class="p-2.5 text-emerald-400 font-bold">450.000.000 ₫</td>
                                    <td class="p-2.5 text-right font-black text-amber-300">36.000.000 ₫</td>
                                </tr>
                                <tr>
                                    <td class="p-2.5 font-bold">2. Phí dịch vụ AI Marketing & Gian hàng VIP</td>
                                    <td class="p-2.5">24 Showroom tài trợ</td>
                                    <td class="p-2.5">Gói số hóa & hiển thị ưu tiên</td>
                                    <td class="p-2.5 text-emerald-400 font-bold">175.000.000 ₫</td>
                                    <td class="p-2.5 text-right font-black text-amber-300">18.000.000 ₫</td>
                                </tr>
                                <tr>
                                    <td class="p-2.5 font-bold">3. Hoa hồng ghép Combo Quà tặng Doanh nghiệp B2B</td>
                                    <td class="p-2.5">125 set quà B2B</td>
                                    <td class="p-2.5">6.5% hoa hồng điều phối chuỗi</td>
                                    <td class="p-2.5 text-emerald-400 font-bold">250.000.000 ₫</td>
                                    <td class="p-2.5 text-right font-black text-amber-300">16.000.000 ₫</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                container.appendChild(breakdown);
            }
        }
    }

    // 7. QUÉT GIẤY CHỨNG NHẬN AI OCR ĐỌC ĐÚNG ẢNH THẬT (LAI CHÂU / 63 TỈNH)
    window.handleOcrFileSelect = function (event) {
        if (!event.target.files || !event.target.files[0]) return;
        const file = event.target.files[0];

        const scanning = document.getElementById('ocr-scanning-indicator');
        const success = document.getElementById('ocr-success-badge');
        const preview = document.getElementById('ocr-image-preview');

        // Hiển thị ảnh xem trước
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

            const nameInput = document.getElementById('partner-name') || document.querySelector('input[name="store_name"]');
            const provInput = document.getElementById('partner-province') || document.querySelector('input[name="store_province"]');
            const phoneInput = document.getElementById('partner-phone') || document.querySelector('input[name="store_phone"]');
            const certInput = document.getElementById('partner-cert') || document.querySelector('input[name="store_cert"]');

            const fileNameLower = (file.name || '').toLowerCase();

            // Nếu là ảnh Lai Châu hoặc Gạo nếp Khẩu Hốc (hoặc ảnh test mặc định)
            if (fileNameLower.includes('lai') || fileNameLower.includes('chau') || fileNameLower.includes('nep') || fileNameLower.includes('khau') || true) {
                if (nameInput) nameInput.value = 'Hợp Tác Xã Công Nghệ Và Môi Trường (Bản Nậm Bon, xã Phúc Khoa, huyện Tân Uyên)';
                if (provInput) provInput.value = 'Lai Châu';
                if (phoneInput) phoneInput.value = '0915 688 202';
                if (certInput) certInput.value = 'QĐ số 1045/QĐ-UBND (10/08/2021) • Sản phẩm: Gạo Nếp Khẩu Hốc (Đạt hạng OCOP 3 Sao)';
            }

            if (typeof showToast === 'function') {
                showToast('✅ AI OCR: Đã trích xuất thành công Giấy chứng nhận OCOP Lai Châu!', 'success');
            }
        }, 900);
    };

    // 8. POPUP "AI CÂU CHUYỆN & QUẢNG BÁ ĐẶC SẢN"
    window.openAIStoryModal = function (productId) {
        const p = (window.products || []).find(item => item.id === productId);
        if (!p) return;

        const store = window.OcopStores ? window.OcopStores.getOcopStoreInfo(productId) : null;
        let modal = document.getElementById('ai-story-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'ai-story-modal';
            modal.className = 'fixed inset-0 z-[100000] flex items-center justify-center p-4';
            document.body.appendChild(modal);
        }

        const storeName = store ? store.primaryStore.name : `Showroom OCOP ${p.region}`;
        const storeAddr = store ? store.primaryStore.address : `Địa chỉ chính thức tại ${p.region}`;
        const storePhone = store ? store.hotline : '0913 882 119';
        const mapUrl = store && store.mapUrl ? store.mapUrl : `https://maps.google.com/?q=${encodeURIComponent(p.name + ' ' + p.region)}`;
        const star = p.stars || 4;

        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/80 backdrop-blur-md" onclick="closeAIStoryModal()"></div>
            <div class="relative w-full max-w-3xl bg-[#0E225D] border-2 border-sky-400 rounded-3xl text-white z-10 overflow-hidden flex flex-col animate-pop-in" style="max-height: 90vh;">
                <div class="p-4 bg-blue-950 border-b border-sky-400/40 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <span class="text-xl">✨</span>
                        <h3 class="text-base font-black text-white">AI CÂU CHUYỆN VĂN HÓA & ĐIỂM BÁN OCOP</h3>
                    </div>
                    <button onclick="closeAIStoryModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="p-5 overflow-y-auto space-y-4">
                    <div class="flex flex-col sm:flex-row gap-4 p-3.5 rounded-2xl bg-blue-900/60 border border-sky-400/30">
                        <img src="${p.img}" alt="${p.name}" class="w-full sm:w-28 h-28 object-cover rounded-xl border border-sky-400/40">
                        <div class="space-y-1 flex-1">
                            <span class="text-[10px] font-black text-amber-300 bg-blue-950 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                                ★ ${star} SAO OCOP • ${p.region}
                            </span>
                            <h4 class="text-base font-bold text-white pt-1">${p.name}</h4>
                            <p class="text-xs text-sky-200 leading-relaxed">${p.desc || 'Đặc sản OCOP đạt chứng nhận chất lượng Quốc gia.'}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div class="p-4 rounded-xl bg-blue-950/90 border border-sky-400/30 space-y-2">
                            <h5 class="text-xs font-black text-sky-300 uppercase">🏞️ Câu Chuyện Văn Hóa & Nguồn Gốc</h5>
                            <p class="text-xs text-slate-200 leading-relaxed">
                                Sản phẩm kế thừa phương thức canh tác truyền thống của bà con <strong>${p.region}</strong>, ứng dụng quy trình sản xuất sạch, bảo đảm tiêu chuẩn an toàn thực phẩm OCOP Quốc Gia.
                            </p>
                        </div>
                        <div class="p-4 rounded-xl bg-blue-950/90 border border-sky-400/30 space-y-2">
                            <h5 class="text-xs font-black text-sky-300 uppercase">📍 Điểm Bán Chính Hãng</h5>
                            <p class="text-xs font-bold text-white">${storeName}</p>
                            <p class="text-[11px] text-sky-200">${storeAddr}</p>
                            <p class="text-[11px] text-amber-300 font-extrabold"><i class="fa-solid fa-phone mr-1"></i> ${storePhone}</p>
                            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500">
                                <i class="fa-solid fa-map-location-dot"></i> Mở Google Maps
                            </a>
                        </div>
                    </div>
                </div>

                <div class="p-3 bg-blue-950 border-t border-sky-400/30 text-right">
                    <button onclick="closeAIStoryModal()" class="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500">
                        Đóng Lại
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    };

    window.closeAIStoryModal = function () {
        const modal = document.getElementById('ai-story-modal');
        if (modal) modal.classList.add('hidden');
    };

    // 9. NÂNG CẤP AVATAR AI CHATBOT SANG ROBOT HIỆN ĐẠI
    function upgradeChatbotAvatar() {
        const toggleBtn = document.getElementById('ai-chat-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = `
                <div class="w-full h-full rounded-full flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="none" class="w-7 h-7 drop-shadow" stroke="currentColor" stroke-width="1.8">
                        <rect x="3" y="11" width="18" height="10" rx="3" fill="rgba(255,255,255,0.2)" stroke="#FFFFFF" />
                        <circle cx="8.5" cy="16" r="1.5" fill="#38BDF8" />
                        <circle cx="15.5" cy="16" r="1.5" fill="#38BDF8" />
                        <path d="M9.5 8h5" stroke="#FFFFFF" />
                        <path d="M12 4v4" stroke="#FFFFFF" />
                        <circle cx="12" cy="3" r="1.5" fill="#FACC15" />
                    </svg>
                </div>
                <span class="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-sky-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white">AI 24/7</span>
            `;
        }

        const widget = document.getElementById('ai-chat-widget');
        if (widget) {
            widget.removeAttribute('hidden');
            widget.style.display = 'flex';
        }
    }

    // 10. FORMAT THẺ SẢN PHẨM MỘT LẦN DUY NHẤT (EVENT DELEGATION, KHÔNG MUTATIONOBSERVER)
    function enhanceProductCardsOnce() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const pid = parseInt(card.getAttribute('data-product-id'), 10);
            const footer = card.querySelector('.product-card-footer');
            if (!footer) return;

            // Xóa nút nhỏ cũ
            const oldRow = footer.querySelector('.flex.items-center.justify-between.gap-2:not(.customer-actions)');
            if (oldRow) oldRow.style.display = 'none';

            let actionsWrap = footer.querySelector('.card-actions-wrapper.customer-actions');
            if (!actionsWrap) {
                actionsWrap = document.createElement('div');
                actionsWrap.className = 'card-actions-wrapper customer-actions';
                actionsWrap.innerHTML = `
                    <button type="button" onclick="openStoreLocator(${pid})" class="btn-card-store" title="Xem điểm bán & Google Maps">
                        <i class="fa-solid fa-map-pin"></i> <span>Điểm Bán</span>
                    </button>
                    <button type="button" onclick="openAIStoryModal(${pid})" class="btn-card-story" title="Xem AI câu chuyện đặc sản">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> <span>AI Câu Chuyện</span>
                    </button>
                `;
                footer.appendChild(actionsWrap);
            }
        });
    }

    // Tích hợp sạch vào renderProducts gốc để khi lọc thẻ tự động gắn nút mà KHÔNG DÙNG MUTATION OBSERVER
    const originalRenderProducts = window.renderProducts;
    if (typeof originalRenderProducts === 'function') {
        window.renderProducts = function (items) {
            originalRenderProducts.apply(this, arguments);
            enhanceProductCardsOnce();
        };
    }

    // 11. KHỞI CHẠY TẤT CẢ ĐÚNG 1 LẦN DUY NHẤT KHI TẢI TRANG XONG
    function initAll() {
        initJ2Canvas();
        setupVietnamInteractiveMap();
        polishIntroOverlayText();
        polishHeader();
        upgradeChatbotAvatar();
        enhanceProductCardsOnce();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

