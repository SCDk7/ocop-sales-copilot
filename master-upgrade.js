/**
 * MASTER UPGRADE 2026: CONTROLLER JS
 * Phục hồi màu sắc gốc, bảo vệ doanh thu bằng PIN 2007,
 * Tối ưu responsive và nâng cấp AI Câu chuyện đặc sản OCOP 63 tỉnh thành.
 */

(function () {
    'use strict';

    // 1. PIN BẢO MẬT QUẢN TRỊ 2007
    const ADMIN_PIN = '2007';

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
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg">
                        🔐
                    </div>
                    <h3 class="text-lg sm:text-xl font-black text-amber-300 uppercase tracking-wide">
                        CỔNG BẢO MẬT QUẢN TRỊ CHỦ WEB
                    </h3>
                    <p class="text-xs text-slate-300 mt-2 leading-relaxed">
                        Khu vực dành riêng cho Ban Quản Trị xem <strong>Tiền Lời Quảng Bá & Bảng Dòng Tiền Nội Bộ</strong>.<br>
                        Vui lòng nhập Mã PIN bảo mật để tiếp tục.
                    </p>
                    
                    <div class="mt-5 space-y-3">
                        <input type="password" id="admin-pin-input" maxlength="6" autofocus placeholder="Nhập mã PIN (Mặc định: 2007)"
                               class="w-full text-center text-lg tracking-widest px-4 py-3 rounded-xl bg-slate-950/90 border-2 border-amber-400/50 text-amber-300 font-black focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30">
                        <p id="pin-error-msg" class="text-xs text-rose-400 font-bold hidden"></p>
                    </div>

                    <div class="mt-6 flex gap-3">
                        <button type="button" onclick="closeAdminPinModal()" class="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition">
                            Hủy Bỏ
                        </button>
                        <button type="button" onclick="verifyAdminPin()" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-lg transition">
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

    // ĐÈ LỆNH openFinancialDashboardModal() ĐỂ YÊU CẦU MÃ PIN
    const originalOpenFinancial = window.openFinancialDashboardModal;
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
            enrichWebmasterFinancialData();
            if (typeof updateFinancialSimulator === 'function') {
                updateFinancialSimulator();
            }
        }
    }

    // 2. NÂNG CẤP BẢNG SỐ LIỆU DOANH THU & TIỀN LỜI QUẢNG BÁ CỦA CHỦ WEB
    function enrichWebmasterFinancialData() {
        // Cập nhật 4 thẻ KPI cốt lõi
        const revEl = document.getElementById('fin-stat-revenue');
        if (revEl) {
            revEl.textContent = '875.000.000 ₫';
            const parent = revEl.closest('div').parentElement;
            const title = parent.querySelector('span.text-xs');
            if (title) title.textContent = 'TỔNG GMV QUẢNG BÁ CHO CÁC CỬA HÀNG';
            const sub = parent.querySelector('.text-emerald-700, .text-emerald-400');
            if (sub) sub.innerHTML = '<i class="fa-solid fa-arrow-up"></i> +28.4% tổng doanh thu mang về cho hệ thống HTX';
        }

        const profitEl = document.getElementById('fin-stat-profit');
        if (profitEl) {
            profitEl.textContent = '415.625.000 ₫';
            const parent = profitEl.closest('div').parentElement;
            const title = parent.querySelector('span.text-xs');
            if (title) title.textContent = 'TIỀN LỜI CỦA CÁC CỬA HÀNG / HTX';
            const sub = document.getElementById('fin-stat-profit-sub');
            if (sub) sub.innerHTML = '<i class="fa-solid fa-seedling text-emerald-400"></i> Lợi nhuận ròng giúp bà con nông dân thu về sau tối ưu COGS';
        }

        const commEl = document.getElementById('fin-stat-commission');
        if (commEl) {
            commEl.textContent = '70.000.000 ₫';
            const parent = commEl.closest('div').parentElement;
            const title = parent.querySelector('span.text-xs');
            if (title) title.innerHTML = '💰 TIỀN LỜI RÒNG CHỦ WEB (PHÍ QUẢNG BÁ)';
            const sub = document.getElementById('fin-stat-commission-sub');
            if (sub) sub.innerHTML = '<i class="fa-solid fa-hand-holding-dollar text-amber-300"></i> Thực nhận từ 8% hoa hồng O2O + Gói quảng bá VIP';
        }

        // Thẻ KPI thứ 4: Tỷ Lệ Chuyển Đổi AI Copilot
        const grid4 = document.querySelector('#ai-financial-modal .grid-cols-4, #ai-financial-modal .grid-cols-2');
        if (grid4 && grid4.children.length >= 4) {
            const fourthCard = grid4.children[3];
            const title = fourthCard.querySelector('span.text-xs');
            if (title) title.textContent = 'TỶ LỆ CHUYỂN ĐỔI TỪ AI COPILOT';
            const bigVal = fourthCard.querySelector('.text-2xl');
            if (bigVal) {
                bigVal.textContent = '34.8%';
                bigVal.className = 'text-2xl font-black text-sky-400';
            }
            const sub = fourthCard.querySelector('.text-\\[11px\\]');
            if (sub) sub.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-sky-300"></i> Tăng trưởng vượt bậc nhờ AI kể chuyện & tư vấn giỏ quà';
        }

        // Bổ sung Bảng Chi Tiết: Doanh Thu & Tiền Lời Quảng Bá Theo Từng Kênh (Dành cho Chủ Web)
        let webmasterTableWrap = document.getElementById('webmaster-revenue-breakdown');
        if (!webmasterTableWrap) {
            const container = document.querySelector('#ai-financial-modal .space-y-6');
            if (container) {
                webmasterTableWrap = document.createElement('div');
                webmasterTableWrap.id = 'webmaster-revenue-breakdown';
                webmasterTableWrap.className = 'p-5 rounded-2xl bg-slate-900/90 border border-amber-400/40 shadow-xl space-y-3';
                webmasterTableWrap.innerHTML = `
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-400/20 pb-3">
                        <div>
                            <h4 class="font-black text-sm text-amber-300 flex items-center gap-2">
                                <i class="fa-solid fa-coins text-amber-400"></i>
                                <span>BẢNG CHI TIẾT TIỀN LỜI QUẢNG BÁ CỦA CHỦ WEB THEO TỪNG KÊNH</span>
                            </h4>
                            <p class="text-[11px] text-slate-300">Số tiền thực nhận của Nền Tảng khi kết nối khách hàng với các Điểm bán & HTX OCOP</p>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
                            Thu Nhập Thực Nhận: 70.000.000 ₫
                        </span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="webmaster-revenue-table">
                            <thead>
                                <tr>
                                    <th>Nguồn Thu Quảng Bá</th>
                                    <th>Quy Mô Kết Nối</th>
                                    <th>Cơ Chế Thu Phí</th>
                                    <th>GMV Đóng Góp</th>
                                    <th class="text-right">Tiền Lời Thực Nhận Của Chủ Web</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="font-bold text-white">1. Hoa hồng giới thiệu khách đến Showroom O2O</td>
                                    <td>520 lượt du khách ghé showroom</td>
                                    <td>5% - 8% trên giá trị đơn O2O</td>
                                    <td class="text-emerald-400 font-bold">450.000.000 ₫</td>
                                    <td class="text-right font-black text-amber-300">36.000.000 ₫</td>
                                </tr>
                                <tr>
                                    <td class="font-bold text-white">2. Phí dịch vụ AI Marketing & Gian hàng OCOP VIP</td>
                                    <td>24 Cửa hàng / HTX tài trợ</td>
                                    <td>Gói số hóa & vị trí hiển thị ưu tiên</td>
                                    <td class="text-emerald-400 font-bold">175.000.000 ₫</td>
                                    <td class="text-right font-black text-amber-300">18.000.000 ₫</td>
                                </tr>
                                <tr>
                                    <td class="font-bold text-white">3. Hoa hồng ghép Combo Quà tặng Doanh nghiệp B2B</td>
                                    <td>125 set quà B2B theo ngân sách</td>
                                    <td>6.5% hoa hồng điều phối chuỗi</td>
                                    <td class="text-emerald-400 font-bold">250.000.000 ₫</td>
                                    <td class="text-right font-black text-amber-300">16.000.000 ₫</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="bg-emerald-950/80 font-black">
                                    <td colspan="3" class="text-amber-200">TỔNG CỘNG NGUỒN THU QUẢNG BÁ CHỦ WEB</td>
                                    <td class="text-emerald-300">875.000.000 ₫</td>
                                    <td class="text-right text-base text-amber-300">70.000.000 ₫</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                `;
                // Chèn vào ngay trên bảng bóc tách chi phí cũ
                const targetOldTable = container.querySelector('.bg-white.rounded-2xl');
                if (targetOldTable) {
                    container.insertBefore(webmasterTableWrap, targetOldTable);
                } else {
                    container.appendChild(webmasterTableWrap);
                }
            }
        }
    }

    // 3. NÂNG CẤP POPUP "AI CÂU CHUYỆN & QUẢNG BÁ ĐẶC SẢN"
    window.openAIStoryModal = function (productId) {
        const p = (window.products || []).find(item => item.id === productId);
        if (!p) {
            if (typeof openQuickView === 'function') openQuickView(productId);
            return;
        }

        const store = window.OcopStores ? window.OcopStores.getOcopStoreInfo(productId) : null;
        let modal = document.getElementById('ai-story-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'ai-story-modal';
            modal.className = 'fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5';
            document.body.appendChild(modal);
        }

        const storeName = store ? store.primaryStore.name : `Showroom OCOP ${p.region}`;
        const storeAddr = store ? store.primaryStore.address : `Địa chỉ chính thức tại ${p.region}`;
        const storePhone = store ? store.hotline : '0913 882 119';
        const mapUrl = store && store.mapUrl ? store.mapUrl : `https://maps.google.com/?q=${encodeURIComponent(p.name + ' ' + p.region)}`;
        const star = p.stars || 4;

        const promoPostVi = `🌿 ĐẶC SẢN OCOP: ${p.name.toUpperCase()} (${star} SAO)\n` +
            `📍 Xuất xứ: ${p.region}\n` +
            `✨ Tinh hoa ẩm thực truyền thống, đạt tiêu chuẩn chất lượng OCOP Quốc Gia.\n` +
            `🛒 Trải nghiệm sản phẩm chính hãng trực tiếp tại: ${storeName} (${storeAddr}).\n` +
            `📞 Hotline đặt hàng & tư vấn B2B: ${storePhone}\n` +
            `#OCOP #DacSanVietNam #${p.region.replace(/\s+/g, '')} #OcopSalesCopilot #DigitalFest2026`;

        const promoPostEn = `🌿 VIETNAMESE OCOP SPECIALTY: ${p.name.toUpperCase()} (${star}-STAR)\n` +
            `📍 Origin: ${p.region}, Vietnam\n` +
            `✨ Certified National Quality Standard. Sourced directly from local farmers.\n` +
            `📍 Official Showroom: ${storeName} (${storeAddr})\n` +
            `📞 Contact & Export Wholesale: ${storePhone}\n` +
            `#VietnamOCOP #AuthenticSpecialty #CulturalGourmet`;

        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/80 backdrop-blur-md" onclick="closeAIStoryModal()"></div>
            <div class="relative w-full max-w-4xl bg-[#081711] border-2 border-amber-400/60 rounded-3xl shadow-2xl text-white z-10 overflow-hidden flex flex-col animate-pop-in" style="max-height: 92vh;">
                <!-- Header -->
                <div class="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 border-b border-amber-400/30 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-lg font-black shadow-md">
                            ✨
                        </div>
                        <div>
                            <span class="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                                AI Storytelling & Omnichannel Marketing
                            </span>
                            <h3 class="text-base sm:text-lg font-black text-white mt-0.5">
                                AI CÂU CHUYỆN & QUẢNG BÁ ĐẶC SẢN OCOP
                            </h3>
                        </div>
                    </div>
                    <button onclick="closeAIStoryModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Body (Scrollable) -->
                <div class="p-4 sm:p-6 overflow-y-auto space-y-5">
                    <!-- Top Summary Card -->
                    <div class="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
                        <img src="${p.img}" alt="${p.name}" class="w-full sm:w-32 h-32 object-cover rounded-xl border border-amber-400/30 shadow">
                        <div class="space-y-1.5 flex-1">
                            <div class="flex items-center gap-2">
                                <span class="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                                    ★ ${star} SAO OCOP
                                </span>
                                <span class="text-xs font-bold text-amber-300">${p.region}</span>
                            </div>
                            <h4 class="text-lg font-black text-white">${p.name}</h4>
                            <p class="text-xs text-slate-300 leading-relaxed">${p.desc || 'Sản phẩm OCOP tiêu biểu được bảo hộ chất lượng và truy xuất nguồn gốc.'}</p>
                        </div>
                    </div>

                    <!-- 3 Khu Vực Trực Quan Theo Yêu Cầu -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Khu 1: Câu chuyện văn hóa & nguồn gốc -->
                        <div class="p-4 rounded-2xl bg-[#0b2218] border border-amber-400/30 space-y-2.5">
                            <h5 class="text-xs font-black text-amber-300 uppercase flex items-center gap-1.5">
                                <span>🏞️ Câu Chuyện Văn Hóa</span>
                            </h5>
                            <p class="text-xs text-slate-200 leading-relaxed">
                                Sản phẩm kết tinh từ thổ nhưỡng trù phú của <strong>${p.region}</strong> và bí quyết canh tác truyền thống lâu đời. Được chế biến theo quy trình chuẩn khép kín, giữ trọn vẹn hương vị tự nhiên và giá trị dinh dưỡng cao.
                            </p>
                            <div class="pt-2 border-t border-amber-400/20 text-[11px] text-emerald-300 font-semibold">
                                <i class="fa-solid fa-certificate text-amber-400 mr-1"></i> Chứng nhận OCOP ${star} Sao Quốc Gia
                            </div>
                        </div>

                        <!-- Khu 2: Nội dung quảng bá đa kênh -->
                        <div class="p-4 rounded-2xl bg-[#0b2218] border border-sky-400/30 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <h5 class="text-xs font-black text-sky-300 uppercase flex items-center gap-1.5">
                                    <span>📱 Bài Đăng Đa Kênh</span>
                                </h5>
                                <button type="button" onclick="copyStoryText(this)" class="px-2 py-0.5 rounded-md bg-sky-500/20 hover:bg-sky-500/40 text-sky-200 text-[10px] font-bold border border-sky-400/40 transition">
                                    📋 Sao chép
                                </button>
                            </div>
                            <textarea id="ai-story-post-text" readonly class="w-full h-24 p-2 rounded-xl bg-slate-950/80 border border-slate-700 text-[11px] text-slate-300 resize-none font-mono focus:outline-none">${promoPostVi}</textarea>
                            <div class="flex gap-2">
                                <button type="button" onclick="switchStoryLang('vi')" class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/30 text-amber-200 border border-amber-400/40">VI</button>
                                <button type="button" onclick="switchStoryLang('en')" class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">EN (Global)</button>
                            </div>
                        </div>

                        <!-- Khu 3: Điểm bán chính hãng O2O -->
                        <div class="p-4 rounded-2xl bg-[#0b2218] border border-emerald-400/30 space-y-2.5">
                            <h5 class="text-xs font-black text-emerald-300 uppercase flex items-center gap-1.5">
                                <span>📍 Điểm Bán & Đặt Hàng</span>
                            </h5>
                            <div class="text-xs space-y-1.5">
                                <p class="font-bold text-white">${storeName}</p>
                                <p class="text-[11px] text-slate-300">${storeAddr}</p>
                                <p class="text-[11px] text-amber-300 font-extrabold"><i class="fa-solid fa-phone text-emerald-400 mr-1"></i> ${storePhone}</p>
                            </div>
                            <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow transition">
                                <i class="fa-solid fa-map-location-dot"></i>
                                <span>Mở Chỉ Đường Google Maps</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-3.5 sm:p-4 bg-slate-950 border-t border-amber-400/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span class="text-slate-400 text-[11px]">
                        ❖ Dữ liệu số hóa chính hãng phục vụ quảng bá OCOP 63 tỉnh thành
                    </span>
                    <button onclick="closeAIStoryModal()" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">
                        Đóng Lại
                    </button>
                </div>
            </div>
        `;

        window._currentStoryVi = promoPostVi;
        window._currentStoryEn = promoPostEn;
        modal.classList.remove('hidden');
    };

    window.closeAIStoryModal = function () {
        const modal = document.getElementById('ai-story-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.switchStoryLang = function (lang) {
        const ta = document.getElementById('ai-story-post-text');
        if (!ta) return;
        ta.value = lang === 'en' ? (window._currentStoryEn || '') : (window._currentStoryVi || '');
    };

    window.copyStoryText = function (btn) {
        const ta = document.getElementById('ai-story-post-text');
        if (!ta) return;
        navigator.clipboard.writeText(ta.value).then(() => {
            if (btn) btn.textContent = '✅ Đã sao chép!';
            if (typeof showToast === 'function') {
                showToast('📋 Đã sao chép nội dung quảng bá vào bộ nhớ tạm!', 'success');
            }
            setTimeout(() => {
                if (btn) btn.textContent = '📋 Sao chép';
            }, 2000);
        });
    };

    // 4. SỬA MÀN HÌNH MỞ ĐẦU & LƯỚI TỈNH THÀNH (ĐỒNG NAI TIÊU BIỂU)
    function setupIntroProvinceGrid() {
        const mapContainer = document.getElementById('province-map');
        if (!mapContainer) return;

        // Chỉ tạo lưới nếu chưa có
        if (mapContainer.querySelector('.intro-province-quick-grid')) return;

        const prominentProvinces = [
            { name: 'Đồng Nai', count: '12+ Sản phẩm', highlight: true, note: 'Trọng tâm OCOP 4-5★' },
            { name: 'Hà Nội', count: '10+ Sản phẩm', highlight: false, note: 'Gốm Bát Tràng' },
            { name: 'TP. Hồ Chí Minh', count: '8+ Sản phẩm', highlight: false, note: 'Yến sào Cần Giờ' },
            { name: 'Lâm Đồng', count: '9+ Sản phẩm', highlight: false, note: 'Trà Oolong Bảo Lộc' },
            { name: 'Bến Tre', count: '7+ Sản phẩm', highlight: false, note: 'Kẹo dừa truyền thống' },
            { name: 'Đắk Lắk', count: '6+ Sản phẩm', highlight: false, note: 'Cà phê Ban Mê' },
            { name: 'An Giang', count: '6+ Sản phẩm', highlight: false, note: 'Đường thốt nốt' },
            { name: 'Cần Thơ', count: '5+ Sản phẩm', highlight: false, note: 'Gạo ST25 OCOP' },
            { name: 'Thái Nguyên', count: '6+ Sản phẩm', highlight: false, note: 'Trà Tân Cương' },
            { name: 'Quảng Nam', count: '5+ Sản phẩm', highlight: false, note: 'Sâm Ngọc Linh' },
            { name: 'Lào Cai', count: '5+ Sản phẩm', highlight: false, note: 'Tương ớt Mường Khương' },
            { name: '63 Tỉnh Thành', count: '252 Sản phẩm', highlight: true, note: 'Xem toàn bộ' }
        ];

        let html = '<div class="intro-province-quick-grid">';
        prominentProvinces.forEach(p => {
            html += `
                <button type="button" onclick="selectQuickIntroProvince('${p.name}')" class="intro-prov-pill ${p.highlight ? 'highlight-dongnai' : ''}">
                    <span class="prov-name text-xs">${p.highlight ? '🌟 ' : '📍 '}${p.name}</span>
                    <span class="text-[9.5px] text-emerald-300 font-bold">${p.count}</span>
                    <span class="text-[8.5px] text-slate-400">${p.note}</span>
                </button>
            `;
        });
        html += '</div>';

        mapContainer.innerHTML = html;
        const status = document.getElementById('province-selection-status');
        if (status) {
            status.innerHTML = '✨ Chọn nhanh tỉnh thành tiêu biểu (Ưu tiên <strong>Đồng Nai</strong>) để khám phá ngay!';
            status.className = 'text-xs text-amber-300 font-bold';
        }
    }

    window.selectQuickIntroProvince = function (provinceName) {
        if (provinceName === '63 Tỉnh Thành') {
            if (typeof enterOcopMarket === 'function') enterOcopMarket('all');
            return;
        }

        if (typeof onProvinceFilterChange === 'function') {
            onProvinceFilterChange(provinceName);
        }
        const sel = document.getElementById('sidebar-province-select');
        if (sel) sel.value = provinceName;

        if (typeof enterOcopMarket === 'function') {
            enterOcopMarket('all', () => {
                const prodSection = document.getElementById('products-section');
                if (prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    };

    // 5. GẮN NÚT "🔐 Quản Trị Chủ Web" VÀO HEADER
    function setupHeaderAdminButton() {
        const headerRight = document.querySelector('.header-right-actions');
        if (!headerRight) return;

        // Thay nút pitch deck cũ bằng nút Quản Trị Chủ Web
        const oldPitch = headerRight.querySelector('button[onclick*="openChallengeProposalModal"]');
        if (oldPitch) {
            oldPitch.id = 'btn-header-admin-pin';
            oldPitch.setAttribute('onclick', 'promptAdminPinModal()');
            oldPitch.setAttribute('title', 'Cổng Quản Trị Chủ Web (Mã PIN: 2007)');
            oldPitch.innerHTML = `
                <i class="fa-solid fa-lock text-amber-300"></i>
                <span class="hidden sm:inline">🔐 Quản Trị Chủ Web</span>
                <span class="sm:hidden">🔐 Chủ Web</span>
            `;
        }
    }

    // 6. TỰ ĐỘNG ĐẢM BẢO AI CHATBOT VÀ SIDEBAR LUÔN HIỂN THỊ
    function ensureChatbotAndSidebar() {
        const widget = document.getElementById('ai-chat-widget');
        if (widget) {
            widget.removeAttribute('hidden');
            widget.style.display = 'flex';
        }

        const sidebar = document.getElementById('catalog-sidebar');
        if (sidebar && window.innerWidth >= 1024) {
            sidebar.style.display = 'block';
        }
    }

    // 7. HOOK VÀO WHAT-IF SIMULATOR ĐỂ NHẢY SỐ TIỀN LỜI CHỦ WEB THEO THỜI GIAN THỰC
    function hookWhatIfSimulator() {
        const volSlider = document.getElementById('sim-volume-slider');
        const chmSlider = document.getElementById('sim-chm-slider');

        function updateWebmasterDynamic() {
            if (!volSlider) return;
            const vol = parseInt(volSlider.value, 10) || 2500;
            const chmRate = chmSlider ? (parseFloat(chmSlider.value) || 8.0) : 8.0;

            // Doanh số O2O ước tính
            const totalGmv = vol * 350000;
            const o2oGmv = totalGmv * 0.514;
            const o2oProfit = Math.round(o2oGmv * (chmRate / 100));
            const vipFees = 18000000;
            const b2bComm = Math.round(totalGmv * 0.0183);
            const totalWebmasterProfit = o2oProfit + vipFees + b2bComm;

            const commStat = document.getElementById('fin-stat-commission');
            if (commStat) {
                commStat.textContent = totalWebmasterProfit.toLocaleString('vi-VN') + ' ₫';
            }

            const revStat = document.getElementById('fin-stat-revenue');
            if (revStat) {
                revStat.textContent = totalGmv.toLocaleString('vi-VN') + ' ₫';
            }
        }

        if (volSlider) volSlider.addEventListener('input', updateWebmasterDynamic);
        if (chmSlider) chmSlider.addEventListener('input', updateWebmasterDynamic);
    }

    // 8. KHỞI CHẠY KHI TẢI TRANG
    function initMasterUpgrade() {
        setupHeaderAdminButton();
        setupIntroProvinceGrid();
        ensureChatbotAndSidebar();
        hookWhatIfSimulator();

        // Đảm bảo nút trên thẻ sản phẩm mở AI Câu chuyện & Điểm bán
        const observer = new MutationObserver(() => {
            const cards = document.querySelectorAll('.product-card:not([data-upgraded])');
            cards.forEach(card => {
                card.setAttribute('data-upgraded', 'true');
                const pid = parseInt(card.getAttribute('data-product-id'), 10);
                const footer = card.querySelector('.product-card-footer');
                if (footer && !footer.querySelector('.card-actions-wrapper')) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'card-actions-wrapper customer-actions';
                    actionsDiv.innerHTML = `
                        <button type="button" onclick="openStoreLocator(${pid})" class="btn-card-store" title="Tra cứu Showroom & Google Maps">
                            <i class="fa-solid fa-map-pin"></i>
                            <span>Điểm Bán</span>
                        </button>
                        <button type="button" onclick="openAIStoryModal(${pid})" class="btn-card-story" title="Khám phá câu chuyện đặc sản & AI Marketing">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            <span>AI Câu Chuyện</span>
                        </button>
                    `;
                    footer.appendChild(actionsDiv);
                }
            });
        });

        const grid = document.getElementById('product-grid');
        if (grid) {
            observer.observe(grid, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMasterUpgrade);
    } else {
        initMasterUpgrade();
    }
})();

