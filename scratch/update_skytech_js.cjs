const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'skytech-complete.js');
let js = fs.readFileSync(jsPath, 'utf8');

// 1. Update polishHeader
const oldPolishHeader = /function polishHeader\(\) \{[\s\S]*?const navStudio = document\.querySelector\('\.nav-btn-studio'\);[\s\S]*?if \(navStudio\) navStudio\.style\.display = 'none';\s*\}/;

const newPolishHeader = `function polishHeader() {
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
    }`;

if (oldPolishHeader.test(js)) {
    js = js.replace(oldPolishHeader, newPolishHeader);
    console.log('✓ polishHeader updated');
} else {
    console.warn('✗ oldPolishHeader regex did not match');
}

// 2. Update promptAdminPinModal & verifyAdminPin & enrichWebmasterRevenueData
const oldPinSection = /window\.promptAdminPinModal = function \(\) \{[\s\S]*?function enrichWebmasterRevenueData\(\) \{[\s\S]*?kpiEls\[3\]\.textContent = '34\.8%';\s*\}\s*\}/;

const newPinSection = `window.promptAdminPinModal = function () {
        if (window.isMasterAdminAuthed()) {
            openRealFinancialDashboard();
            return;
        }

        let modal = document.getElementById('admin-pin-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'admin-pin-modal';
            modal.className = 'fixed inset-0 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm';
            modal.style.zIndex = '999999';
            modal.innerHTML = \`
                <div class="relative w-full max-w-md bg-white border-2 border-sky-400 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl space-y-5 animate-pop-in" style="z-index: 1000000;">
                    <button onclick="closeAdminPinModal()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm absolute top-4 right-4 cursor-pointer transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <div class="text-center space-y-2">
                        <div class="w-14 h-14 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl border border-sky-200 shadow-sm">
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <h3 class="text-lg font-black text-slate-900 uppercase tracking-wide">Cổng Quản Trị Doanh Thu</h3>
                        <p class="text-xs text-slate-600">Khu vực quản trị nội bộ: Báo cáo dòng tiền, doanh thu hệ thống và hoa hồng quảng bá O2O.</p>
                    </div>

                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs font-bold text-sky-800 mb-1.5">Nhập mã PIN bảo mật:</label>
                            <input type="password" id="admin-pin-input" maxlength="10" placeholder="••••" autocomplete="off"
                                   class="w-full px-4 py-3 text-center text-xl tracking-widest rounded-xl bg-slate-50 border-2 border-sky-200 text-sky-700 font-mono font-bold focus:border-sky-500 focus:outline-none">
                            <p id="admin-pin-error" class="hidden text-xs font-bold text-rose-500 mt-1.5 text-center">
                                <i class="fa-solid fa-circle-exclamation mr-1"></i> Mã PIN không đúng. Vui lòng thử lại! (Gợi ý: 2007)
                            </p>
                        </div>

                        <div class="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-sky-800 text-center">
                            💡 Khách mua hàng & khám phá đặc sản không cần mã PIN. Mã PIN mặc định: <strong class="text-sky-700">2007</strong>
                        </div>

                        <div class="flex items-center gap-3 pt-1">
                            <button type="button" onclick="verifyAdminPin()" class="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md transition cursor-pointer">
                                🔓 Xác Nhận
                            </button>
                            <button type="button" onclick="closeAdminPinModal()" class="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer transition">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            \`;
            document.body.appendChild(modal);

            const input = document.getElementById('admin-pin-input');
            if (input) {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') verifyAdminPin();
                });
            }
        }
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.zIndex = '999999';
        const input = document.getElementById('admin-pin-input');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 100);
        }
        const err = document.getElementById('admin-pin-error');
        if (err) err.classList.add('hidden');
    };

    window.closeAdminPinModal = function () {
        const modal = document.getElementById('admin-pin-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    };

    window.verifyAdminPin = function () {
        const input = document.getElementById('admin-pin-input');
        const err = document.getElementById('admin-pin-error');
        const pin = (input ? input.value : '').trim();

        if (pin === '2007') {
            sessionStorage.setItem('ocop_admin_pin_verified', 'true');
            window.closeAdminPinModal();
            openRealFinancialDashboard();
            if (typeof showToast === 'function') {
                showToast('✅ Xác thực Quản Trị thành công!', 'success');
            }
        } else {
            if (err) err.classList.remove('hidden');
            if (input) {
                input.classList.add('border-rose-500');
                input.focus();
                input.select();
            }
        }
    };

    // Mở Bảng Quản Trị Doanh Thu thật
    function openRealFinancialDashboard() {
        const modal = document.getElementById('ai-financial-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.zIndex = '100000';
            enrichWebmasterRevenueData();
            if (typeof updateFinancialSimulator === 'function') {
                updateFinancialSimulator();
            }
        }
    }

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
            if (title) title.textContent = 'TỔNG DOANH THU BÁN HÀNG GIÚP CÁC CỬA HÀNG';
        }

        const profitEl = document.getElementById('fin-stat-profit');
        if (profitEl) {
            profitEl.innerHTML = '415.625.000 ₫';
            profitEl.style.color = '#059669';
            const parent = profitEl.closest('.p-4') || profitEl.closest('div')?.parentElement;
            const title = parent?.querySelector('span.text-xs');
            if (title) title.textContent = 'LỢI NHUẬN RÒNG CỦA CÁC ĐƠN VỊ / HTX ĐỐI TÁC';
        }

        const commEl = document.getElementById('fin-stat-commission');
        if (commEl) {
            commEl.textContent = '70.000.000 ₫';
            commEl.style.color = '#0284C7';
            const parent = commEl.closest('.p-4') || commEl.closest('div')?.parentElement;
            const title = parent?.querySelector('span.text-xs');
            if (title) title.textContent = '💰 TIỀN LỜI RÒNG CỦA CHỦ WEB (HOA HỒNG QUẢNG BÁ)';
        }

        const cards = modal.querySelectorAll('.grid-cols-1.sm\\\\:grid-cols-2.lg\\\\:grid-cols-4 > div, .grid-cols-4 > div');
        if (cards.length >= 4) {
            const card4 = cards[3];
            const title4 = card4.querySelector('span.text-xs');
            if (title4) title4.textContent = 'TỔNG ĐƠN HÀNG KẾT NỐI QUA NỀN TẢNG';
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
    }`;

if (oldPinSection.test(js)) {
    js = js.replace(oldPinSection, newPinSection);
    console.log('✓ PIN & Dashboard logic updated');
} else {
    console.warn('✗ oldPinSection regex did not match');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('skytech-complete.js update done!');

