/**
 * OCOP Voucher Pool System (99 Triệu Voucher OCOP Toàn Quốc)
 * File riêng biệt quản lý kho 99.000.000 voucher số OCOP
 * - Tự động tạo và xoay vòng 99.000.000 voucher độc nhất
 * - Khi random hết 99.000.000 mã, hệ thống tự động lặp lại từ đầu
 * - Hỗ trợ đầy đủ các hạng mã OCOP: Freeship, Giảm 20K - 200K, Combo VIP, Tri ân 2026
 * - Tương thích hoàn toàn với Giỏ hàng, Đặt hàng trực tuyến và Flash Sale Banner
 */
(function (global) {
    'use strict';

    // Tổng số lượng voucher trong kho: đúng 99 triệu voucher
    const TOTAL_VOUCHERS = 99000000;

    // Hằng số LCG đạt chu kỳ đầy đủ (Hull-Dobell Theorem) cho modulo 99.000.000
    // 99.000.000 = 2^6 * 3^2 * 5^6 * 11 -> lcm(4, 2*3*5*11) = 660. Chọn a = 660 * 53 + 1 = 34981.
    // gcd(1234567, 99000000) = 1. Đảm bảo ánh xạ song ánh 1-1, không trùng lặp suốt 99 triệu mã.
    const LCG_A = 34981;
    const LCG_C = 1234567;

    // Các hạng khuyến mãi OCOP phong phú, chuẩn Shopee / OCOP Quốc Gia
    const VOUCHER_TIERS = [
        {
            prefix: 'FREESHIP',
            badge: 'FREESHIP 499K',
            discount: 25000,
            isFreeship: true,
            minOrder: 499000,
            highlight: '0 ĐỒNG',
            title: 'Miễn phí ship',
            desc: 'Miễn phí vận chuyển toàn quốc cho đơn từ 499K',
            theme: {
                border: 'border-emerald-200',
                badgeBg: 'bg-emerald-100',
                badgeText: 'text-emerald-900',
                color: 'text-emerald-600',
                btnBg: '#059669',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)'
            }
        },
        {
            prefix: 'OCOP50K',
            badge: 'ĐƠN TỪ 399K',
            discount: 50000,
            minOrder: 399000,
            highlight: '-50.000₫',
            title: 'Giảm ngay 50K',
            desc: 'Giảm 50.000₫ cho đơn hàng OCOP từ 399K',
            theme: {
                border: 'border-sky-200',
                badgeBg: 'bg-sky-100',
                badgeText: 'text-sky-800',
                color: 'text-rose-600',
                btnBg: '#0284C7',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%)'
            }
        },
        {
            prefix: 'COMBOVIP',
            badge: 'COMBO QUÀ VIP',
            discount: 100000,
            freeGift: true,
            minOrder: 899000,
            highlight: '-100.000₫',
            title: 'Giảm 100K + Quà',
            desc: 'Giảm 100K + Tặng Hộp Quà OCOP cho đơn từ 899K',
            theme: {
                border: 'border-amber-300',
                badgeBg: 'bg-amber-100',
                badgeText: 'text-amber-900',
                color: 'text-amber-600',
                btnBg: '#D97706',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FEFCE8 100%)'
            }
        },
        {
            prefix: 'GIAM20K',
            badge: 'ĐƠN TỪ 199K',
            discount: 20000,
            minOrder: 199000,
            highlight: '-20.000₫',
            title: 'Giảm ngay 20K',
            desc: 'Giảm 20.000₫ cho đơn hàng từ 199K',
            theme: {
                border: 'border-teal-200',
                badgeBg: 'bg-teal-100',
                badgeText: 'text-teal-900',
                color: 'text-teal-700',
                btnBg: '#0D9488',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%)'
            }
        },
        {
            prefix: 'OCOP30K',
            badge: 'ĐƠN TỪ 299K',
            discount: 30000,
            minOrder: 299000,
            highlight: '-30.000₫',
            title: 'Giảm liền 30K',
            desc: 'Giảm 30.000₫ cho đơn hàng từ 299K',
            theme: {
                border: 'border-blue-200',
                badgeBg: 'bg-blue-100',
                badgeText: 'text-blue-900',
                color: 'text-blue-600',
                btnBg: '#2563EB',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)'
            }
        },
        {
            prefix: 'VIP150K',
            badge: 'ĐƠN TỪ 1.2TR',
            discount: 150000,
            minOrder: 1200000,
            highlight: '-150.000₫',
            title: 'Giảm cực sâu 150K',
            desc: 'Giảm 150.000₫ cho đơn hàng OCOP lớn từ 1.200K',
            theme: {
                border: 'border-purple-200',
                badgeBg: 'bg-purple-100',
                badgeText: 'text-purple-900',
                color: 'text-purple-700',
                btnBg: '#7C3AED',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%)'
            }
        },
        {
            prefix: 'VIP200K',
            badge: 'ĐƠN TỪ 1.5TR',
            discount: 200000,
            freeGift: true,
            minOrder: 1500000,
            highlight: '-200.000₫',
            title: 'Đại tiệc OCOP -200K',
            desc: 'Giảm 200.000₫ + Hộp Trà Thượng Hạng cho đơn từ 1.500K',
            theme: {
                border: 'border-rose-200',
                badgeBg: 'bg-rose-100',
                badgeText: 'text-rose-900',
                color: 'text-rose-600',
                btnBg: '#E11D48',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFF1F2 100%)'
            }
        },
        {
            prefix: 'TRIAN26',
            badge: 'TRI ÂN 2026',
            discount: 50000,
            minOrder: 0,
            highlight: '-50.000₫',
            title: 'Tri ân OCOP 2026',
            desc: 'Mã tri ân OCOP 2026 giảm ngay 50.000₫ mọi đơn hàng',
            theme: {
                border: 'border-amber-400',
                badgeBg: 'bg-amber-200',
                badgeText: 'text-amber-950',
                color: 'text-amber-700',
                btnBg: '#B45309',
                bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FEF3C7 100%)'
            }
        }
    ];

    // Danh sách mã truyền thống cố định luôn được hỗ trợ
    const LEGACY_VOUCHERS = {
        'OCOP2026': { discount: 50000, minOrder: 0, label: 'Giảm 50.000 ₫ (Tri ân OCOP 2026)' },
        'FREESHIP': { discount: 25000, minOrder: 0, label: 'Miễn phí vận chuyển (-25.000 ₫)' },
        'GIAM20K': { discount: 20000, minOrder: 0, label: 'Giảm 20.000 ₫' },
        'GIAM10K': { discount: 10000, minOrder: 0, label: 'Giảm 10.000 ₫' },
        'GIAM50K': { discount: 50000, minOrder: 0, label: 'Giảm 50.000 ₫' },
        'GIAM100K': { discount: 100000, minOrder: 500000, label: 'Giảm 100.000 ₫ (Đơn từ 500K)' },
        'OCOP50K': { discount: 50000, minOrder: 399000, label: 'Giảm 50.000 ₫ (Đơn từ 399K)' },
        'COMBOVIP': { discount: 100000, minOrder: 899000, label: 'Giảm 100.000 ₫ + Quà (Đơn từ 899K)' }
    };

    const STORAGE_KEY_INDEX = 'ocop_voucher_pool_index';
    const STORAGE_KEY_ACTIVE = 'ocop_voucher_active_set';

    let inMemoryIndex = 0;
    let inMemoryActive = null;

    function getPoolIndex() {
        try {
            if (typeof localStorage !== 'undefined') {
                const val = localStorage.getItem(STORAGE_KEY_INDEX);
                if (val !== null) {
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed) && parsed >= 0) {
                        return parsed % TOTAL_VOUCHERS;
                    }
                }
            }
        } catch (_) {}
        return inMemoryIndex % TOTAL_VOUCHERS;
    }

    function setPoolIndex(idx) {
        // Tự động xoay vòng lại từ đầu nếu chạm mốc 99.000.000
        const safeIdx = ((idx % TOTAL_VOUCHERS) + TOTAL_VOUCHERS) % TOTAL_VOUCHERS;
        inMemoryIndex = safeIdx;
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_INDEX, String(safeIdx));
            }
        } catch (_) {}
        return safeIdx;
    }

    /**
     * Tạo voucher tại vị trí chỉ số index cụ thể (0 đến 98.999.999)
     */
    function generateVoucherAtIndex(rawIndex) {
        const safeIndex = ((rawIndex % TOTAL_VOUCHERS) + TOTAL_VOUCHERS) % TOTAL_VOUCHERS;
        // Ánh xạ phân tán LCG để mã liền kề nhau có sự đa dạng tự nhiên
        const permuted = Number((BigInt(LCG_A) * BigInt(safeIndex) + BigInt(LCG_C)) % BigInt(TOTAL_VOUCHERS));
        const tier = VOUCHER_TIERS[permuted % VOUCHER_TIERS.length];
        const serial = permuted.toString(36).toUpperCase().padStart(5, '0');
        const code = `${tier.prefix}-${serial}`;

        return {
            index: safeIndex,
            permutedId: permuted,
            code: code,
            basePrefix: tier.prefix,
            badge: tier.badge,
            discount: tier.discount,
            minOrder: tier.minOrder,
            highlight: tier.highlight,
            title: tier.title,
            desc: tier.desc,
            isFreeship: !!tier.isFreeship,
            freeGift: !!tier.freeGift,
            theme: tier.theme,
            label: `${tier.title} (${tier.highlight})`
        };
    }

    /**
     * Lấy danh sách voucher tiếp theo từ kho
     * Khi đi hết 99 triệu mã thì tự động quay vòng lại từ đầu
     */
    function getNextVouchers(count = 3) {
        let current = getPoolIndex();
        const list = [];
        for (let i = 0; i < count; i++) {
            list.push(generateVoucherAtIndex(current));
            current++;
            if (current >= TOTAL_VOUCHERS) {
                // Hết 99 triệu voucher -> quay lại từ đầu!
                current = 0;
            }
        }
        setPoolIndex(current);
        saveActiveVouchers(list);
        return list;
    }

    /**
     * Random thêm voucher mới từ kho 99 triệu
     * Bước nhảy ngẫu nhiên để mang lại cảm giác săn voucher mới mẻ
     */
    function getRandomVouchers(count = 3) {
        let current = getPoolIndex();
        const randomJump = Math.floor(Math.random() * 50000) + 1;
        current = (current + randomJump) % TOTAL_VOUCHERS;
        const list = [];
        for (let i = 0; i < count; i++) {
            list.push(generateVoucherAtIndex(current));
            current++;
            if (current >= TOTAL_VOUCHERS) {
                // Hết 99 triệu voucher -> quay lại từ đầu!
                current = 0;
            }
        }
        setPoolIndex(current);
        saveActiveVouchers(list);
        return list;
    }

    /**
     * Lưu trữ bộ 3 voucher đang hiển thị để người dùng không bị mất khi F5
     */
    function saveActiveVouchers(vouchers) {
        inMemoryActive = vouchers;
        try {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(vouchers));
            }
        } catch (_) {}
    }

    /**
     * Lấy 3 voucher đang hoạt động
     */
    function getActiveVouchers() {
        if (inMemoryActive && inMemoryActive.length > 0) return inMemoryActive;
        try {
            if (typeof sessionStorage !== 'undefined') {
                const stored = sessionStorage.getItem(STORAGE_KEY_ACTIVE);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                }
            }
        } catch (_) {}
        // Mặc định ban đầu trả về 3 voucher đầu tiên
        return getNextVouchers(3);
    }

    /**
     * Xác thực và tính giá trị giảm giá của một mã voucher bất kỳ
     */
    function validateVoucher(inputCode, orderTotal = 0) {
        if (!inputCode) {
            return { valid: false, error: 'Vui lòng nhập mã voucher giảm giá!' };
        }
        const code = String(inputCode).trim().toUpperCase();

        // 1. Kiểm tra mã truyền thống (OCOP2026, FREESHIP, GIAM20K, COMBOVIP...)
        if (LEGACY_VOUCHERS[code]) {
            const v = LEGACY_VOUCHERS[code];
            if (v.minOrder && orderTotal > 0 && orderTotal < v.minOrder) {
                return {
                    valid: false,
                    error: `Mã ${code} chỉ áp dụng cho đơn hàng từ ${v.minOrder.toLocaleString('vi-VN')} ₫!`
                };
            }
            return {
                valid: true,
                code: code,
                discount: v.discount,
                minOrder: v.minOrder,
                label: v.label,
                isLegacy: true
            };
        }

        // 2. Kiểm tra mã sinh ra từ kho 99 triệu (Dạng: <PREFIX>-<SERIAL>, ví dụ: OCOP50K-0QGLJ)
        const parts = code.split('-');
        const prefix = parts[0];
        const tier = VOUCHER_TIERS.find(t => t.prefix === prefix);
        if (tier) {
            if (tier.minOrder && orderTotal > 0 && orderTotal < tier.minOrder) {
                return {
                    valid: false,
                    error: `Mã ${code} chỉ áp dụng cho đơn hàng từ ${tier.minOrder.toLocaleString('vi-VN')} ₫!`
                };
            }
            return {
                valid: true,
                code: code,
                discount: tier.discount,
                minOrder: tier.minOrder,
                label: `${tier.title} (${tier.highlight})`,
                desc: tier.desc,
                freeGift: !!tier.freeGift,
                isFreeship: !!tier.isFreeship
            };
        }

        return {
            valid: false,
            error: 'Mã voucher không hợp lệ hoặc đã hết lượt áp dụng!'
        };
    }

    /**
     * Render 3 thẻ voucher vào container giao diện Flash Sale
     */
    function renderVoucherCardsToContainer(containerEl, vouchers) {
        if (!containerEl) return;
        const list = Array.isArray(vouchers) && vouchers.length > 0 ? vouchers : getActiveVouchers();
        
        containerEl.innerHTML = list.map((v, i) => `
            <div class="bg-white rounded-2xl p-2.5 border ${v.theme.border} shadow-2xs flex flex-col justify-between text-left hover:border-sky-400 transition transform hover:-translate-y-0.5 duration-200" style="background: ${v.theme.bgGradient} !important;">
                <div>
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[9.5px] font-black uppercase tracking-wider ${v.theme.badgeBg} ${v.theme.badgeText} px-1.5 py-0.5 rounded">${v.badge}</span>
                        <span class="text-[10px] font-black ${v.theme.color}">${v.highlight}</span>
                    </div>
                    <div class="text-[11px] font-extrabold text-slate-900 leading-tight">${v.title}</div>
                    <div class="text-[9.5px] text-slate-500 mt-0.5 font-medium">Mã: <strong class="${v.theme.color}">${v.code}</strong></div>
                </div>
                <button type="button" onclick="copyHeroVoucher('${v.code}', '${v.desc.replace(/'/g, "\\'")}', this)" class="voucher-save-btn mt-2 w-full py-1 px-2 rounded-lg active:scale-95 text-white font-extrabold text-[10.5px] shadow-2xs transition flex items-center justify-center gap-1 cursor-pointer" style="background: ${v.theme.btnBg} !important; color: #FFFFFF !important;">
                    <i class="fa-regular fa-copy"></i>
                    <span>Lưu Mã</span>
                </button>
            </div>
        `).join('');
    }

    const VoucherPool = {
        TOTAL_VOUCHERS,
        VOUCHER_TIERS,
        LEGACY_VOUCHERS,
        getPoolIndex,
        setPoolIndex,
        generateVoucherAtIndex,
        getNextVouchers,
        getRandomVouchers,
        getActiveVouchers,
        validateVoucher,
        renderVoucherCardsToContainer
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = VoucherPool;
    }
    if (typeof global !== 'undefined') {
        global.VoucherPool = VoucherPool;
    }

})(typeof window !== 'undefined' ? window : globalThis);
