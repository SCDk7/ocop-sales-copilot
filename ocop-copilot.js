/**
 * OCOP Sales Copilot - Trợ lý ảo tư vấn, bán hàng, chăm sóc khách hàng & xử lý đơn hàng tự động
 * Hệ điều hành thương mại điện tử đặc sản OCOP Việt Nam
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.OcopSalesCopilot = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ── 1. DANH SÁCH 63 TỈNH THÀNH VIỆT NAM CHUẨN HÓA ──────────────────────
    const PROVINCES_63 = [
        "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
        "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
        "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
        "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội",
        "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
        "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn",
        "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận",
        "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh",
        "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
        "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh",
        "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
    ];

    // Cấu hình thanh toán ngân hàng mặc định (VietQR BIDV)
    const PAYMENT_CONFIG = {
        bankBin: '970418', // BIDV
        bankName: 'BIDV (Ngân hàng TMCP Đầu tư & Phát triển Việt Nam)',
        accNum: '8808661371',
        accName: 'HOANG NGUYEN THANH BINH',
        hotline: '1900 6868',
        hotlineMobile: '0987.654.321',
        zaloUrl: 'https://zalo.me/0987654321',
        standardShippingFee: 30000,
        freeShippingThreshold: 500000
    };

    // Chuẩn hóa chuỗi tiếng Việt không dấu
    function stripVN(str) {
        if (!str) return '';
        return String(str)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .toLowerCase()
            .trim();
    }

    // Tự động nhận diện ngôn ngữ
    function detectLanguage(text, fallbackLang = 'vi') {
        const t = (text || '').toLowerCase();
        const enKeywords = [
            'budget', 'combo', 'price', 'order', 'track', 'tracking', 'delivery',
            'ship', 'shipping', 'complaint', 'support', 'contact', 'hello', 'hi ',
            'recommend', 'specialty', 'specialties', 'province', 'how much',
            'buy', 'checkout', 'pay', 'payment', 'vietqr', 'cod', 'cash', 'problem'
        ];
        let enScore = 0;
        enKeywords.forEach(kw => {
            if (t.includes(kw)) enScore++;
        });
        if (enScore >= 2 || /^(hi|hello|hey|good morning|order|track|help)\b/i.test(t)) {
            return 'en';
        }
        return fallbackLang === 'en' ? 'en' : 'vi';
    }

    // Bóc tách ngân sách từ văn bản (Hỗ trợ 500k, 500.000, 500 nghìn, 1tr, 1 triệu, 1m...)
    function parseBudget(text) {
        if (!text) return null;
        const norm = stripVN(text);

        // Pattern 1: X tr / X trieu / X m
        const trMatch = norm.match(/(\d+(?:[.,]\d+)?)\s*(?:tr|trieu|m)\b/);
        if (trMatch) {
            const val = parseFloat(trMatch[1].replace(',', '.'));
            return Math.round(val * 1000000);
        }

        // Pattern 2: X k / X nghin / X ngan
        const kMatch = norm.match(/(\d+(?:[.,]\d+)?)\s*(?:k|nghin|ngan)\b/);
        if (kMatch) {
            const val = parseFloat(kMatch[1].replace(',', '.'));
            return Math.round(val * 1000);
        }

        // Pattern 3: Số nguyên lớn >= 50.000 (ví dụ: 500000, 300.000, 500,000₫)
        const numMatch = norm.match(/(\d{1,3}(?:[.,]\d{3})+|\d{5,8})\s*(?:vnd|dong|d|₫)?/);
        if (numMatch) {
            const clean = numMatch[1].replace(/[.,]/g, '');
            const parsed = parseInt(clean, 10);
            if (!isNaN(parsed) && parsed >= 20000) return parsed;
        }

        // Pattern 4: "dưới 500", "ngân sách 300", "khoảng 500"
        const shorthandMatch = norm.match(/(?:ngan sach|tam|khoang|duoi|toi da|budget|around|under)\s*(\d{2,4})\b/);
        if (shorthandMatch) {
            const num = parseInt(shorthandMatch[1], 10);
            if (num < 1000) return num * 1000;
        }

        return null;
    }

    // Nhận diện tỉnh thành từ văn bản
    function detectProvince(text) {
        if (!text) return null;
        const normText = ' ' + stripVN(text) + ' ';

        // Alias đặc biệt
        if (normText.includes(' sai gon ') || normText.includes(' tp hcm ') || normText.includes(' hcm ') || normText.includes(' ho chi minh ')) {
            return 'TP Hồ Chí Minh';
        }
        if (normText.includes(' ha noi ') || normText.includes(' thu do ')) {
            return 'Hà Nội';
        }
        if (normText.includes(' da nang ')) return 'Đà Nẵng';
        if (normText.includes(' can tho ')) return 'Cần Thơ';
        if (normText.includes(' hai phong ')) return 'Hải Phòng';
        if (normText.includes(' dong nai ') || normText.includes(' bien hoa ') || normText.includes(' long khanh ')) {
            return 'Đồng Nai';
        }
        if (normText.includes(' ben tre ')) return 'Bến Tre';
        if (normText.includes(' lam dong ') || normText.includes(' da lat ')) return 'Lâm Đồng';
        if (normText.includes(' dak lak ') || normText.includes(' buon ma thuot ')) return 'Đắk Lắk';

        // Quét 63 tỉnh
        for (const prov of PROVINCES_63) {
            const normProv = stripVN(prov).replace(/^(tinh|thanh pho|tp)\s+/, '');
            if (normProv.length >= 3 && normText.includes(' ' + normProv + ' ')) {
                return prov;
            }
        }
        return null;
    }

    // Bóc tách mã đơn hàng (ví dụ: OCOP-12345, #OCOP-99812, #123456)
    function parseOrderCode(text) {
        if (!text) return null;
        const match = text.match(/(?:#?OCOP-([A-Za-z0-9]{4,10})|#([0-9]{4,10}))\b/i);
        if (match) {
            return match[0].toUpperCase().replace(/^#/, '');
        }
        return null;
    }

    // Bóc tách số điện thoại
    function parsePhoneNumber(text) {
        if (!text) return null;
        const match = text.match(/(?:0|\+84)[3|5|7|8|9][0-9]{8}\b/);
        return match ? match[0] : null;
    }

    // ── 2. PHÂN LOẠI YÊU CẦU (SMART INTENT ROUTING) ────────────────────────
    const INTENTS = {
        RECOMMEND_COMBO: 'RECOMMEND_COMBO',       // 1. Tư vấn combo theo giá
        SEARCH_PROVINCE: 'SEARCH_PROVINCE',       // 1. Lọc sản phẩm theo tỉnh thành
        ORDER_CREATE: 'ORDER_CREATE',             // 2. Tạo đơn hàng trực tiếp
        PAYMENT_QR: 'PAYMENT_QR',                 // 2. Thanh toán mã VietQR
        PAYMENT_COD: 'PAYMENT_COD',               // 2. Thanh toán COD
        ORDER_TRACK: 'ORDER_TRACK',               // 3. Tra cứu thông tin giao hàng & đơn hàng
        COMPLAINT_CSKH: 'COMPLAINT_CSKH',         // 4. Khiếu nại, sự cố giao hàng, kết nối CSKH
        OCOP_KNOWLEDGE: 'OCOP_KNOWLEDGE',         // Tư vấn kiến thức OCOP 3★–5★ & tem QR HTX
        TEA_BREWING_GUIDE: 'TEA_BREWING_GUIDE',   // Hướng dẫn pha trà chuẩn OCOP
        STORAGE_GUIDE: 'STORAGE_GUIDE',           // Hướng dẫn bảo quản & tránh mốc
        CORPORATE_GIFT: 'CORPORATE_GIFT',         // Quà tặng doanh nghiệp & hóa đơn VAT
        INSPECTION_POLICY: 'INSPECTION_POLICY',   // Chính sách đồng kiểm & đổi mới 1-1 trong 7 ngày
        FINANCIAL_DISPATCH: 'FINANCIAL_DISPATCH', // Tác vụ tài chính chuyên sâu Đồng Nai/Hà Nội (giữ tương thích)
        GENERAL_GREETING: 'GENERAL_GREETING'      // Chào hỏi tổng quát
    };

    function classifyIntent(text, language = 'vi') {
        const norm = stripVN(text);

        // 0. BẢO TỒN CÁC TÁC VỤ TEST TÀI CHÍNH (Đồng Nai COGS, Hà Nội sản lượng, CHM)
        if (/(bien loi nhuan.*dong nai|dong nai.*bien loi nhuan|san luong.*ha noi|ha noi.*san luong|doi soat chiet khau|chiet khau.*chm|profit margin.*dong nai|digitized yield.*hanoi)/i.test(norm)) {
            return INTENTS.FINANCIAL_DISPATCH;
        }

        // Khiếu nại / Giao hàng có vấn đề / CSKH
        if (/(giao hang co van de|su co giao hang|giao hang tre|giao tre|tre han|hong hang|be vo|rach tem|sai mon|sai hang|chua nhan duoc|mat hang|khieu nai|doi tra|hoan tien|gap cskh|cskh|gap admin|admin|lien he admin|nhan vien|tu van vien|truc tiep|ho tro truc tiep|nguoi that|tong dai|hotline|zalo cskh|complaint|damaged|broken|late delivery|missing item|refund|talk to human|support)/i.test(norm)) {
            return INTENTS.COMPLAINT_CSKH;
        }

        // Tra cứu đơn hàng & hành trình vận chuyển
        if (/(tra cuu don|kiem tra don|theo doi don|hanh trinh don|ma van don|don hang cua toi|don cua toi|tinh trang don|track order|check order|order status|where is my order|#?ocop-\d+)/i.test(norm) || (parseOrderCode(text) && !/(tao don|dat hang|mua)/.test(norm))) {
            return INTENTS.ORDER_TRACK;
        }

        // Thanh toán QR
        if (/(thanh toan.*qr|ma qr|quet qr|vietqr|chuyen khoan|qr code|pay.*qr)/i.test(norm)) {
            return INTENTS.PAYMENT_QR;
        }

        // Thanh toán COD
        if (/(thanh toan.*cod|tra tien mat|nhan hang tra tien|thu ho|ship cod|pay.*cod|cash on delivery)/i.test(norm)) {
            return INTENTS.PAYMENT_COD;
        }

        // Tạo đơn hàng trực tiếp trong chat
        if (/(tao don|dat hang|mua ngay|chot don|dat combo|tao don hang|order now|checkout|buy now|place order)/i.test(norm)) {
            return INTENTS.ORDER_CREATE;
        }

        // Quà tặng doanh nghiệp & hóa đơn VAT
        if (/(doanh nghiep|hoa don vat|xuat hoa don|in logo|cong ty|qua tang cong ty|set qua doanh nghiep|corporate gift|b2b)/i.test(norm)) {
            return INTENTS.CORPORATE_GIFT;
        }

        // Tư vấn combo theo ngân sách (khách đưa ra số tiền hoặc từ khóa combo)
        const budget = parseBudget(text);
        if (budget !== null || /(combo|set qua|gio qua|goi qua|bo qua|budget|gift set|bundle)/i.test(norm)) {
            return INTENTS.RECOMMEND_COMBO;
        }

        // Tìm kiếm theo tỉnh thành
        const province = detectProvince(text);
        if (province || /(dac san tinh|san pham o|tim do o|khu vuc|vung mien|dong nai|ben tre|lam dong|dak lak|ha noi|mien tay|tay bac|tay nguyen)/i.test(norm)) {
            return INTENTS.SEARCH_PROVINCE;
        }

        // Hướng dẫn pha trà OCOP
        if (/(pha tra|cach pha tra|uong tra|nhiet do pha|ham tra|ham che|brew tea|how to brew|tea brewing)/i.test(norm)) {
            return INTENTS.TEA_BREWING_GUIDE;
        }

        // Hướng dẫn bảo quản & tránh mốc
        if (/(bao quan|tranh moc|de duoc bao lau|han su dung|cach giu|huong dan bao quan|preserve|storage|shelf life|expiry)/i.test(norm)) {
            return INTENTS.STORAGE_GUIDE;
        }

        // Đồng kiểm & Đổi mới 1-1 7 ngày
        if (/(dong kiem|kiem tra truoc|duoc xem hang|kiem tra hang|doi moi 1-1|doi 1-1|7 ngay|bao hanh 7 ngay|chinh sach doi|chinh sach bao hanh|inspection|7 days return)/i.test(norm)) {
            return INTENTS.INSPECTION_POLICY;
        }

        // Thắc mắc về OCOP, sao OCOP & tem QR truy xuất HTX
        if (/(ocop la gi|may sao|tieu chuan|chung nhan|xuat xu|tem qr|truy xuat|htx ban dia|hop tac xa|bao hanh|chinh sach|what is ocop)/i.test(norm)) {
            return INTENTS.OCOP_KNOWLEDGE;
        }

        // Mặc định chào hỏi hoặc tư vấn
        return INTENTS.GENERAL_GREETING;
    }

    // ── 3. THUẬT TOÁN ĐỀ XUẤT COMBO THÔNG MINH THEO NGÂN SÁCH ─────────────
    function generateSmartCombo(budgetAmount, provinceFilter, catalogProducts = [], language = 'vi') {
        const en = language === 'en';
        const budget = budgetAmount || 500000;
        let candidates = catalogProducts.filter(p => Number.isFinite(p.price) && p.price > 0 && p.price <= budget);

        // Ưu tiên tỉnh thành nếu có yêu cầu
        if (provinceFilter) {
            const normP = stripVN(provinceFilter);
            const provMatches = candidates.filter(p => stripVN(p.region).includes(normP));
            if (provMatches.length >= 2) candidates = provMatches;
        }

        if (candidates.length === 0) {
            candidates = catalogProducts.slice(0, 10);
        }

        // Phân loại nhóm mặt hàng để phối hợp đa dạng (Đồ uống, Đồ khô/hạt/bánh, Đặc sản/Mật ong/Gia vị)
        const isDrink = p => /(tra|che|ca phe|nuoc|juice|coffee|tea)/i.test(p.name + ' ' + (p.category || ''));
        const isSnack = p => /(hat|dieu|mac ca|banh|keo|snack|mut|trai cay|sau rieng)/i.test(p.name + ' ' + (p.category || ''));
        const isSpecialty = p => /(mat ong|sam|yen|gao|tieu|gia vi|mam|nam)/i.test(p.name + ' ' + (p.category || ''));

        const drinks = candidates.filter(isDrink);
        const snacks = candidates.filter(isSnack);
        const specialties = candidates.filter(isSpecialty);

        let selected = [];
        let currentTotal = 0;

        // Cố gắng chọn 1 món từ mỗi nhóm
        const pools = [drinks, snacks, specialties];
        for (const pool of pools) {
            const affordable = pool.filter(p => !selected.some(s => s.id === p.id) && currentTotal + p.price <= budget);
            if (affordable.length > 0) {
                // Ưu tiên sao cao
                affordable.sort((a, b) => (b.stars || 0) - (a.stars || 0) || b.price - a.price);
                const pick = affordable[0];
                selected.push(pick);
                currentTotal += pick.price;
            }
        }

        // Nếu còn chỗ và còn tiền, bổ sung thêm món có giá trị phù hợp
        if (selected.length < 3) {
            const remainingCandidates = candidates
                .filter(p => !selected.some(s => s.id === p.id) && currentTotal + p.price <= budget)
                .sort((a, b) => b.price - a.price);
            for (const p of remainingCandidates) {
                if (currentTotal + p.price <= budget) {
                    selected.push(p);
                    currentTotal += p.price;
                    if (selected.length >= 3) break;
                }
            }
        }

        // Fallback an toàn nếu chưa chọn được
        if (selected.length === 0) {
            selected = candidates.slice(0, 2);
            currentTotal = selected.reduce((s, p) => s + p.price, 0);
        }

        const remaining = Math.max(0, budget - currentTotal);
        const productIds = selected.map(p => p.id);

        // Tạo tên combo mỹ miều
        let comboName = '';
        if (provinceFilter) {
            comboName = en ? `Signature ${provinceFilter} Heritage Gift Set` : `Bộ Quà Tinh Hoa Đặc Sản ${provinceFilter}`;
        } else if (budget <= 300000) {
            comboName = en ? `Warm Heart Countryside Set` : `Combo Đặc Sản Hương Đồng Gió Nội`;
        } else if (budget <= 600000) {
            comboName = en ? `National OCOP Heritage Discovery Set` : `Bộ Quà Tinh Hoa OCOP Đất Việt`;
        } else {
            comboName = en ? `VIP Premium National Selection Box` : `Hộp Quà Thượng Hạng Quốc Bảo OCOP 5 Sao`;
        }

        return {
            comboName,
            budget,
            total: currentTotal,
            remaining,
            items: selected.map(p => ({
                id: p.id,
                name: en && p.nameEn ? p.nameEn : p.name,
                price: p.price,
                stars: p.stars || 4,
                region: p.region,
                packaging: en && p.packagingEn ? p.packagingEn : (p.packaging || 'hộp'),
                desc: en && p.descEn ? p.descEn : (p.desc || p.description || ''),
                img: p.img || 'chat-avatar.jpg',
                quantity: 1
            })),
            productIds
        };
    }

    // ── 4. RENDER GIAO DIỆN CHAT TRỰC QUAN (MARKDOWN & HTML CARDS) ─────────

    // Format tiền tệ
    function formatMoney(amount) {
        return (amount || 0).toLocaleString('vi-VN') + ' ₫';
    }

    // A. Render tin nhắn đề xuất Combo
    function renderComboResponse(comboData, language = 'vi') {
        const en = language === 'en';
        const { comboName, budget, total, remaining, items, productIds } = comboData;

        let md = en
            ? `🎁 **Smart Recommendation: ${comboName}**\n\n` +
              `Based on your budget of **${formatMoney(budget)}**, I have curated a balanced set of certified OCOP specialties:\n\n`
            : `🎁 **Gợi ý Combo Thông Minh: ${comboName}**\n\n` +
              `Theo mức ngân sách **${formatMoney(budget)}** của quý khách, em đã phối hợp combo các đặc sản OCOP tiêu chuẩn vùng miền:\n\n`;

        items.forEach((item, index) => {
            md += `${index + 1}. **${item.name}**\n` +
                  `   • Chuẩn OCOP: **${item.stars}★** (${item.region})\n` +
                  `   • Đơn giá: **${formatMoney(item.price)}** / ${item.packaging}\n`;
        });

        md += (en
            ? `\n💰 **Total Combo Value**: **${formatMoney(total)}**\n` +
              `💵 **Budget**: ${formatMoney(budget)} | **Remaining**: **${formatMoney(remaining)}**\n\n`
            : `\n💰 **Tổng giá trị combo**: **${formatMoney(total)}**\n` +
              `💵 **Ngân sách**: ${formatMoney(budget)} | **Còn dư**: **${formatMoney(remaining)}**\n\n`) +
              (en
                ? `✨ *Complimentary premium eco-gift box, ribbon & greeting card included. Free express shipping on orders over 500k.*`
                : `✨ *Miễn phí đóng hộp quà cao cấp, thắt nơ & thiệp chúc mừng. Miễn phí vận chuyển toàn quốc cho đơn từ 500k.*`);

        // HTML Card tương tác trong chat
        const idsString = productIds.join(',');
        const cardHtml = `
            <div class="mt-3 rounded-2xl border border-amber-300/60 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 p-3.5 shadow-xl text-white">
                <div class="flex items-center justify-between border-b border-amber-400/20 pb-2 mb-2.5">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs"><i class="fa-solid fa-gift"></i></span>
                        <h5 class="font-extrabold text-amber-300 text-xs">${comboName}</h5>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ${en ? 'Budget Matched' : 'Chuẩn ngân sách'}
                    </span>
                </div>
                <div class="space-y-2 mb-3">
                    ${items.map(item => `
                        <div class="flex items-center justify-between text-xs py-1 border-b border-white/5">
                            <div class="min-w-0 pr-2">
                                <p class="font-semibold text-slate-200 truncate">${item.name}</p>
                                <p class="text-[10px] text-amber-400/80">${item.region} • ${item.stars}★</p>
                            </div>
                            <span class="font-bold text-amber-300 whitespace-nowrap text-xs">${formatMoney(item.price)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="bg-black/40 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs border border-white/10">
                    <span class="text-gray-300">${en ? 'Total Combo Value:' : 'Tổng tiền combo:'}</span>
                    <span class="font-black text-amber-300 text-sm">${formatMoney(total)}</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="OcopSalesCopilot.addComboToCart([${idsString}])" class="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2 px-2.5 text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fa-solid fa-cart-plus text-amber-400"></i>
                        <span>${en ? 'Add to Cart' : 'Thêm vào giỏ'}</span>
                    </button>
                    <button type="button" onclick="if(typeof openOnlineOrderModal==='function'){openOnlineOrderModal(${productIds[0]});}else{OcopSalesCopilot.openOrderModal([${idsString}]);} " class="rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2 px-2.5 text-[11px] shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"><i class="fa-solid fa-cart-shopping"></i><span>${en ? '🛒 Order Online Now' : '🛒 Đặt Mua Online Ngay'}</span></button>
                </div>
            </div>
        `;

        return {
            message: md,
            localMarkup: cardHtml,
            productIds,
            dynamic_chips: en
                ? ['Order this combo', 'Adjust budget', 'Specialties of Dong Nai', 'Track my order']
                : ['Đặt combo này ngay', 'Đổi ngân sách khác', 'Đặc sản Đồng Nai', 'Tra cứu đơn hàng']
        };
    }

    // B. Render tin nhắn tìm kiếm theo Tỉnh thành
    function renderProvinceResponse(provinceName, catalogProducts = [], language = 'vi') {
        const en = language === 'en';
        const normP = stripVN(provinceName);
        let matches = catalogProducts.filter(p => stripVN(p.region).includes(normP));

        if (matches.length === 0) {
            matches = catalogProducts.slice(0, 4);
        }

        const topMatches = matches.slice(0, 4);
        const productIds = topMatches.map(p => p.id);

        let md = en
            ? `📍 **OCOP Certified Specialties of ${provinceName}**\n\n` +
              `Welcome to the rich terroir of **${provinceName}**! Here are the highlighted national OCOP certified specialties produced directly by local cooperatives:\n\n`
            : `📍 **Đặc Sản OCOP Tiêu Biểu Tỉnh ${provinceName}**\n\n` +
              `Chào mừng quý khách đến với vùng đất thổ nhưỡng trù phú **${provinceName}**! Dưới đây là các đặc sản đạt chứng nhận OCOP Quốc gia tiêu biểu nhất từ các Hợp tác xã địa phương:\n\n`;

        topMatches.forEach((p, idx) => {
            const name = en && p.nameEn ? p.nameEn : p.name;
            const desc = en && p.descEn ? p.descEn : (p.desc || p.description || '');
            md += `${idx + 1}. **${name}** — **${formatMoney(p.price)}** (${p.stars}★)\n` +
                  `   • Quy cách: ${en && p.packagingEn ? p.packagingEn : (p.packaging || 'sản phẩm')}\n` +
                  `   • Đặc trưng: ${desc.slice(0, 85)}...\n`;
        });

        md += en
            ? `\n👉 *Click below to add items to your cart, place an order, or filter on the main showroom.*`
            : `\n👉 *Quý khách có thể bấm thêm vào giỏ hàng hoặc đặt hàng ngay trực tiếp trong chat bên dưới nhé!*`;

        const cardHtml = `
            <div class="mt-3 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-map-location-dot text-emerald-600"></i> ${provinceName} (${topMatches.length} sản phẩm OCOP)</span>
                    <button type="button" onclick="OcopSalesCopilot.filterByProvince('${provinceName}')" class="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2 py-1 rounded-lg cursor-pointer transition">
                        ${en ? 'Filter on Catalog' : 'Lọc trên gian hàng'} →
                    </button>
                </div>
                ${topMatches.map(p => `
                    <div class="rounded-xl border border-gray-200 bg-white p-2.5 shadow-xs flex items-center justify-between gap-3">
                        <img src="${p.img || 'chat-avatar.jpg'}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <p class="font-bold text-gray-900 text-xs truncate">${en && p.nameEn ? p.nameEn : p.name}</p>
                            <p class="text-[10px] text-amber-800 font-semibold">${p.region} • ${p.stars}★</p>
                            <p class="text-slate-900 font-black text-xs mt-0.5">${formatMoney(p.price)}</p>
                        </div>
                        <div class="flex flex-col gap-1 flex-shrink-0">
                            <button type="button" onclick="addToCart(${p.id})" class="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] cursor-pointer transition">
                                + ${en ? 'Cart' : 'Giỏ'}
                            </button>
                            <button type="button" onclick="if(typeof openOnlineOrderModal==='function'){openOnlineOrderModal(${p.id});}else{OcopSalesCopilot.openOrderModal([${p.id}]);} " class="px-2.5 py-1 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black text-[10px] cursor-pointer transition flex items-center gap-1 shadow-xs" style="background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%) !important; color: #FFFFFF !important;"><i class="fa-solid fa-cart-shopping text-[9px]"></i> 🛒 ${en ? 'Order Online' : 'Đặt Mua Online Ngay'}</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        return {
            message: md,
            localMarkup: cardHtml,
            productIds,
            dynamic_chips: en
                ? [`Order from ${provinceName}`, 'Combo under 500k', 'Check shipping fee', 'Track order']
                : [`Đặt hàng ${provinceName}`, 'Combo quà 500k', 'Phí giao hàng', 'Tra cứu đơn hàng']
        };
    }

    // C. Render Form Tạo Đơn Hàng Trực Tiếp Trong Chat (In-Chat Order Form)
    function renderOrderCreationForm(selectedProductIds = [], catalogProducts = [], language = 'vi') {
        const en = language === 'en';
        let items = selectedProductIds
            .map(id => catalogProducts.find(p => p.id === id))
            .filter(Boolean);

        // Nếu không có sản phẩm nào được chỉ định, lấy từ giỏ hàng hiện tại hoặc gợi ý sản phẩm tiêu biểu
        if (items.length === 0) {
            if (typeof window !== 'undefined' && Array.isArray(window.cart) && window.cart.length > 0) {
                items = window.cart.map(c => ({ ...c }));
            } else {
                items = catalogProducts.slice(0, 2);
            }
        }

        const subtotal = items.reduce((sum, p) => sum + (p.price || 0) * (p.qty || 1), 0);
        const shippingFee = subtotal >= PAYMENT_CONFIG.freeShippingThreshold ? 0 : PAYMENT_CONFIG.standardShippingFee;
        const total = subtotal + shippingFee;
        const formId = 'ocop-inchat-order-form-' + Date.now();

        const formHtml = `
            <div id="${formId}" class="mt-3 rounded-2xl border-2 border-emerald-500/40 bg-white p-3.5 shadow-xl text-gray-800">
                <div class="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shadow"><i class="fa-solid fa-receipt"></i></span>
                        <h4 class="font-extrabold text-ocopGreen text-xs tracking-wide">${en ? 'IN-CHAT INSTANT CHECKOUT' : 'KHỞI TẠO ĐƠN HÀNG TRỰC TIẾP'}</h4>
                    </div>
                    <span class="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        ${en ? 'Safe & Encrypted' : 'Bảo mật OCOP'}
                    </span>
                </div>

                <!-- Danh sách sản phẩm trong đơn -->
                <div class="bg-gray-50 rounded-xl p-2.5 mb-3 space-y-1.5 border border-gray-200">
                    <p class="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">${en ? 'Selected Products' : 'Sản phẩm đã chọn'}:</p>
                    ${items.map((item, idx) => `
                        <div class="flex items-center justify-between text-xs text-gray-800" data-order-item-id="${item.id}" data-item-price="${item.price}">
                            <span class="truncate max-w-[65%] font-medium">• ${item.name} <b class="text-ocopGreen">(x${item.qty || 1})</b></span>
                            <span class="font-bold">${formatMoney((item.price || 0) * (item.qty || 1))}</span>
                        </div>
                    `).join('')}
                    <div class="border-t border-gray-200 pt-1.5 flex items-center justify-between text-xs font-bold">
                        <span>${en ? 'Subtotal:' : 'Tiền hàng:'}</span>
                        <span class="text-emerald-700">${formatMoney(subtotal)}</span>
                    </div>
                    <div class="flex items-center justify-between text-[11px] text-gray-600">
                        <span>${en ? 'Express Shipping:' : 'Phí giao hàng:'}</span>
                        <span class="${shippingFee === 0 ? 'text-emerald-600 font-bold' : ''}">
                            ${shippingFee === 0 ? (en ? 'FREE SHIPPING' : 'MIỄN PHÍ') : formatMoney(shippingFee)}
                        </span>
                    </div>
                    <div class="border-t border-dashed border-gray-300 pt-1.5 flex items-center justify-between text-xs font-black text-slate-950">
                        <span>${en ? 'Total Payment:' : 'Tổng thanh toán:'}</span>
                        <span class="text-amber-600 text-sm">${formatMoney(total)}</span>
                    </div>
                </div>

                <!-- Form nhập thông tin khách hàng -->
                <div class="space-y-2 mb-3">
                    <div>
                        <label class="block text-[10px] font-bold text-gray-600 mb-0.5">${en ? 'Full Name *' : 'Họ và tên người nhận *'}</label>
                        <input type="text" id="${formId}-name" placeholder="${en ? 'e.g. John Doe' : 'Ví dụ: Nguyễn Văn An'}" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ocopGreen focus:bg-white transition">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-600 mb-0.5">${en ? 'Phone Number *' : 'Số điện thoại nhận hàng *'}</label>
                        <input type="tel" id="${formId}-phone" placeholder="${en ? 'e.g. 0912345678' : 'Ví dụ: 0912345678'}" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ocopGreen focus:bg-white transition">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-600 mb-0.5">${en ? 'Shipping Address *' : 'Địa chỉ giao hàng chi tiết *'}</label>
                        <input type="text" id="${formId}-address" placeholder="${en ? 'House number, street, ward, district, city' : 'Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành'}" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-ocopGreen focus:bg-white transition">
                    </div>

                    <!-- Phương thức thanh toán -->
                    <div>
                        <label class="block text-[10px] font-bold text-gray-600 mb-1">${en ? 'Payment Method *' : 'Hình thức thanh toán *'}</label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="flex items-center gap-2 p-2 rounded-xl border border-emerald-300 bg-emerald-50/60 cursor-pointer text-xs font-semibold hover:bg-emerald-50 transition">
                                <input type="radio" name="${formId}-payment" value="vietqr" checked class="accent-ocopGreen">
                                <span class="flex items-center gap-1 text-[11px]"><i class="fa-solid fa-qrcode text-emerald-700"></i> VietQR BIDV</span>
                            </label>
                            <label class="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer text-xs font-semibold hover:bg-gray-100 transition">
                                <input type="radio" name="${formId}-payment" value="cod" class="accent-ocopGreen">
                                <span class="flex items-center gap-1 text-[11px]"><i class="fa-solid fa-truck text-amber-700"></i> ${en ? 'Cash (COD)' : 'Thu hộ COD'}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Nút xác nhận đặt hàng -->
                <button type="button" onclick="OcopSalesCopilot.submitInChatOrder('${formId}', [${items.map(i=>i.id).join(',')}], ${total})" class="w-full rounded-xl bg-gradient-to-r from-ocopGreen via-ocopGreenLight to-emerald-700 hover:opacity-95 text-ocopGold font-black py-2.5 text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>${en ? `Confirm Order • ${formatMoney(total)}` : `Xác Nhận Đặt Hàng • ${formatMoney(total)}`}</span>
                </button>
            </div>
        `;

        const md = en
            ? `📝 **In-Chat Order Form Initialized**\n` +
              `Please fill in your recipient details below to complete your order with **VietQR** or **Cash on Delivery (COD)**.`
            : `📝 **Em đã mở Form Tạo Đơn Hàng Ngay Trong Chat**\n` +
              `Quý khách vui lòng điền thông tin người nhận bên dưới để hệ thống khởi tạo đơn hàng và tạo mã **VietQR** hoặc **COD** tự động nhé!`;

        return {
            message: md,
            localMarkup: formHtml,
            productIds: items.map(i => i.id),
            dynamic_chips: en
                ? ['Select VietQR', 'Select COD', 'Adjust products', 'Contact Admin']
                : ['Thanh toán VietQR', 'Thanh toán COD', 'Chọn thêm món khác', 'Liên hệ Admin']
        };
    }

    // D. Render Thẻ Thanh Toán VietQR Tự Động
    function renderVietQRPaymentCard(order, language = 'vi') {
        const en = language === 'en';
        const memo = `THANH TOAN ${order.id}`;
        const qrUrl = `https://img.vietqr.io/image/${PAYMENT_CONFIG.bankBin}-${PAYMENT_CONFIG.accNum}-compact2.png?amount=${order.total}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(PAYMENT_CONFIG.accName)}`;

        const cardHtml = `
            <div class="mt-3 rounded-2xl border-2 border-emerald-500 bg-white p-4 shadow-2xl text-gray-800 text-xs">
                <div class="text-center pb-3 border-b border-gray-100">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] mb-1">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i> ${en ? 'Order Created Successfully!' : 'Đơn Hàng Khởi Tạo Thành Công!'}
                    </span>
                    <h4 class="font-black text-gray-900 text-sm mt-1">MÃ ĐƠN: #${order.id}</h4>
                    <p class="text-[10px] text-gray-500">${en ? 'Scan dynamic VietQR below to pay instantly' : 'Quét mã VietQR động bên dưới để thanh toán tức thì'}</p>
                </div>

                <!-- Ảnh QR động -->
                <div class="my-3 flex flex-col items-center justify-center p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <img src="${qrUrl}" alt="VietQR BIDV #${order.id}" class="w-48 h-auto rounded-xl shadow-md border-2 border-white">
                    <p class="mt-2 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                        <i class="fa-solid fa-shield-halved text-emerald-600"></i> BIDV Smart Banking • Xác thực tự động
                    </p>
                </div>

                <!-- Bảng chi tiết chuyển khoản -->
                <div class="bg-gray-50 rounded-xl p-3 space-y-1.5 border border-gray-200 text-[11px] mb-3">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">${en ? 'Bank:' : 'Ngân hàng:'}</span>
                        <span class="font-bold text-gray-900">BIDV</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">${en ? 'Account Number:' : 'Số tài khoản:'}</span>
                        <div class="flex items-center gap-1">
                            <span class="font-black text-ocopGreen font-mono">${PAYMENT_CONFIG.accNum}</span>
                            <button type="button" onclick="OcopSalesCopilot.copyText('${PAYMENT_CONFIG.accNum}', '${en ? 'Copied account number!' : 'Đã sao chép số tài khoản!' }')" class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer" title="Sao chép STK"><i class="fa-regular fa-copy"></i></button>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">${en ? 'Account Name:' : 'Chủ tài khoản:'}</span>
                        <span class="font-bold text-gray-900">${PAYMENT_CONFIG.accName}</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-gray-200 pt-1">
                        <span class="text-gray-500 font-bold">${en ? 'Exact Amount:' : 'Số tiền cần chuyển:'}</span>
                        <span class="font-black text-rose-600 text-sm">${formatMoney(order.total)}</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-gray-200 pt-1">
                        <span class="text-gray-500">${en ? 'Transfer Memo:' : 'Nội dung chuyển khoản:'}</span>
                        <div class="flex items-center gap-1">
                            <span class="font-black text-amber-800 font-mono">${memo}</span>
                            <button type="button" onclick="OcopSalesCopilot.copyText('${memo}', '${en ? 'Copied memo!' : 'Đã sao chép nội dung!' }')" class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer" title="Sao chép nội dung"><i class="fa-regular fa-copy"></i></button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="OcopSalesCopilot.confirmQRPayment('${order.id}')" class="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 text-center transition cursor-pointer">
                        <i class="fa-solid fa-check mr-1"></i> ${en ? 'I Have Paid' : 'Tôi Đã Chuyển Khoản'}
                    </button>
                    <button type="button" onclick="OcopSalesCopilot.trackOrder('${order.id}')" class="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 text-center transition cursor-pointer">
                        <i class="fa-solid fa-truck-fast mr-1"></i> ${en ? 'Track Order' : 'Theo Dõi Đơn Hàng'}
                    </button>
                </div>
            </div>
        `;

        const md = en
            ? `✅ **Order #${order.id} Placed Successfully via VietQR!**\n\n` +
              `• **Total Payable**: **${formatMoney(order.total)}**\n` +
              `• **Bank**: BIDV\n` +
              `• **Account Number**: \`${PAYMENT_CONFIG.accNum}\`\n` +
              `• **Beneficiary**: **${PAYMENT_CONFIG.accName}**\n` +
              `• **Transfer Content**: \`${memo}\`\n\n` +
              `*The system will automatically confirm receipt and dispatch your OCOP package immediately.*`
            : `✅ **Đơn Hàng #${order.id} Đã Được Khởi Tạo Thành Công Qua VietQR!**\n\n` +
              `• **Tổng số tiền thanh toán**: **${formatMoney(order.total)}** (Đã tự động điền vào mã QR)\n` +
              `• **Ngân hàng**: BIDV\n` +
              `• **Số tài khoản**: \`${PAYMENT_CONFIG.accNum}\`\n` +
              `• **Chủ tài khoản**: **${PAYMENT_CONFIG.accName}**\n` +
              `• **Nội dung chuyển khoản**: \`${memo}\`\n\n` +
              `*Hệ thống sẽ đối soát tự động và chuyển sang bộ phận đóng gói ngay sau khi nhận được chuyển khoản ạ.*`;

        return {
            message: md,
            localMarkup: cardHtml,
            dynamic_chips: en
                ? [`Track Order #${order.id}`, 'Contact Support', 'Delivery Issues', 'Home Page']
                : [`Tra cứu đơn #${order.id}`, 'Hỗ trợ CSKH', 'Sự cố giao hàng', 'Về trang chủ']
        };
    }

    // E. Render Thẻ Xác Nhận Thanh Toán COD
    function renderCODConfirmationCard(order, language = 'vi') {
        const en = language === 'en';

        const cardHtml = `
            <div class="mt-3 rounded-2xl border-2 border-amber-500 bg-white p-4 shadow-xl text-gray-800 text-xs">
                <div class="text-center pb-3 border-b border-gray-100">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px] mb-1">
                        <i class="fa-solid fa-truck text-amber-600"></i> ${en ? 'COD Order Confirmed!' : 'Xác Nhận Đơn Hàng Thu Hộ (COD)'}
                    </span>
                    <h4 class="font-black text-gray-900 text-sm mt-1">MÃ ĐƠN: #${order.id}</h4>
                    <p class="text-[10px] text-gray-500">${en ? 'Pay cash upon delivery after checking items' : 'Thanh toán tiền mặt tận nơi sau khi kiểm tra hàng'}</p>
                </div>

                <div class="my-3 bg-amber-50/60 rounded-xl p-3 border border-amber-200 text-xs space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">${en ? 'Recipient:' : 'Người nhận:'}</span>
                        <span class="font-bold text-gray-900">${order.customerName} (${order.customerPhone})</span>
                    </div>
                    <div class="flex items-start justify-between gap-2">
                        <span class="text-gray-600 whitespace-nowrap">${en ? 'Address:' : 'Địa chỉ:'}</span>
                        <span class="font-medium text-gray-800 text-right">${order.customerAddress}</span>
                    </div>
                    <div class="border-t border-amber-200/60 pt-1.5 flex items-center justify-between">
                        <span class="text-gray-700 font-bold">${en ? 'COD Total Due:' : 'Tổng tiền cần thanh toán cho Shipper:'}</span>
                        <span class="font-black text-rose-600 text-sm">${formatMoney(order.total)}</span>
                    </div>
                </div>

                <p class="text-[10px] text-gray-500 mb-3 flex items-center gap-1.5">
                    <i class="fa-solid fa-box-open text-amber-600"></i>
                    <span>${en ? 'You can open and inspect the goods before paying the driver.' : 'Quý khách được quyền đồng kiểm, mở xem sản phẩm OCOP trước khi thanh toán.'}</span>
                </p>

                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="OcopSalesCopilot.trackOrder('${order.id}')" class="rounded-xl bg-ocopGreen hover:bg-ocopGreenLight text-ocopGold font-bold py-2 text-center transition cursor-pointer">
                        <i class="fa-solid fa-truck-fast mr-1"></i> ${en ? 'Track Order' : 'Theo Dõi Hành Trình'}
                    </button>
                    <button type="button" onclick="OcopSalesCopilot.openComplaintForm('${order.id}')" class="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 text-center transition cursor-pointer">
                        <i class="fa-solid fa-headset mr-1"></i> ${en ? 'Contact CSKH' : 'Hỗ Trợ CSKH'}
                    </button>
                </div>
            </div>
        `;

        const md = en
            ? `📦 **COD Order #${order.id} Placed Successfully!**\n\n` +
              `• **Recipient**: ${order.customerName} (${order.customerPhone})\n` +
              `• **Shipping Address**: ${order.customerAddress}\n` +
              `• **Exact Amount to Pay on Delivery**: **${formatMoney(order.total)}**\n\n` +
              `*The delivery driver will call you before arrival. Please have exact change ready!*`
            : `📦 **Đơn Hàng Thu Tiền Tận Nơi (COD) #${order.id} Đã Xác Nhận!**\n\n` +
              `• **Người nhận**: **${order.customerName}** (${order.customerPhone})\n` +
              `• **Địa chỉ giao hàng**: ${order.customerAddress}\n` +
              `• **Số tiền cần thanh toán khi nhận hàng**: **${formatMoney(order.total)}** (Đã tự động tính đủ tiền hàng + phí ship)\n\n` +
              `*Shipper sẽ liên hệ trước khi giao. Quý khách hoàn toàn an tâm đồng kiểm trước khi thanh toán ạ!*`;

        return {
            message: md,
            localMarkup: cardHtml,
            dynamic_chips: en
                ? [`Track Order #${order.id}`, 'Shipping Info', 'Delivery Issue', 'Contact CSKH']
                : [`Theo dõi đơn #${order.id}`, 'Thời gian giao hàng', 'Báo sự cố giao hàng', 'Kết nối CSKH']
        };
    }

    // F. Render Thẻ Tra Cứu Đơn Hàng & Hành Trình Vận Chuyển
    function renderOrderTrackingCard(order, language = 'vi') {
        const en = language === 'en';
        const carrier = order.carrier || 'Viettel Post (VTP Express)';
        const trackingCode = order.trackingCode || ('VTP' + Math.floor(10000000 + Math.random() * 90000000));
        const status = order.status || 'delivering'; // 'confirmed' | 'packing' | 'delivering' | 'completed'

        const steps = [
            { id: 'confirmed', label: en ? 'Order Received' : 'Đã tiếp nhận', time: '09:15', done: true },
            { id: 'packing', label: en ? 'OCOP Inspected & Packed' : 'Đóng gói & Kiểm định', time: '11:30', done: status !== 'confirmed' },
            { id: 'delivering', label: en ? 'Out for Delivery' : 'Đang vận chuyển', time: '14:45', done: status === 'delivering' || status === 'completed', active: status === 'delivering' },
            { id: 'completed', label: en ? 'Delivered' : 'Giao thành công', time: en ? 'Est. Tomorrow' : 'Dự kiến mai', done: status === 'completed' }
        ];

        const cardHtml = `
            <div class="mt-3 rounded-2xl border border-sky-400/40 bg-white p-4 shadow-xl text-gray-800 text-xs">
                <div class="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs shadow"><i class="fa-solid fa-truck-ramp-box"></i></span>
                        <div>
                            <h4 class="font-black text-gray-900 text-xs">ĐƠN HÀNG #${order.id}</h4>
                            <p class="text-[10px] text-gray-500">${carrier} • Mã: <b class="font-mono text-sky-700">${trackingCode}</b></p>
                        </div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}">
                        ${status === 'completed' ? (en ? 'Completed' : 'Hoàn thành') : (en ? 'In Transit' : 'Đang giao hàng')}
                    </span>
                </div>

                <!-- Timeline 4 bước trực quan -->
                <div class="my-3 py-2 px-1 bg-sky-50/40 rounded-xl border border-sky-100">
                    <div class="flex items-center justify-between relative px-2">
                        ${steps.map((step, idx) => `
                            <div class="flex flex-col items-center text-center z-10 w-1/4">
                                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${step.done ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-500'} ${step.active ? 'ring-4 ring-sky-300 animate-pulse' : ''}">
                                    ${step.done ? '<i class="fa-solid fa-check"></i>' : (idx + 1)}
                                </span>
                                <span class="text-[9px] font-bold mt-1 text-gray-800 leading-tight">${step.label}</span>
                                <span class="text-[8px] text-gray-400">${step.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Thông tin người nhận và thanh toán -->
                <div class="bg-gray-50 rounded-xl p-2.5 space-y-1 text-[11px] mb-3 border border-gray-200">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">${en ? 'Recipient:' : 'Người nhận:'}</span>
                        <span class="font-bold text-gray-900">${order.customerName || 'Khách hàng OCOP'} (${order.customerPhone || '09xx'})</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500">${en ? 'Address:' : 'Địa chỉ:'}</span>
                        <span class="font-medium text-gray-800 truncate max-w-[65%]">${order.customerAddress || 'Việt Nam'}</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-gray-200 pt-1">
                        <span class="text-gray-500">${en ? 'Total Payment:' : 'Tổng thanh toán:'}</span>
                        <span class="font-bold text-rose-600">${formatMoney(order.total)}</span>
                    </div>
                </div>

                <!-- Nút báo sự cố giao hàng & chuyển sang CSKH -->
                <button type="button" onclick="OcopSalesCopilot.openComplaintForm('${order.id}')" class="w-full rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold py-2 text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
                    <span>${en ? 'Delivery Issue? Contact CSKH Now' : 'Giao hàng có vấn đề? Liên hệ CSKH ngay'}</span>
                </button>
            </div>
        `;

        const md = en
            ? `🚚 **Tracking Information for Order #${order.id}**\n\n` +
              `• **Current Status**: **In Transit** (Handed over to ${carrier})\n` +
              `• **Tracking Number**: \`${trackingCode}\`\n` +
              `• **Estimated Arrival**: 1–2 business days\n` +
              `• **Recipient**: ${order.customerName || 'Customer'} - ${order.customerPhone || ''}\n` +
              `• **Total**: ${formatMoney(order.total)}\n\n` +
              `*If you notice any delay, packaging damage, or wrong items, please tap below to connect with our Customer Care.*`
            : `🚚 **Hành Trình Vận Chuyển Đơn Hàng #${order.id}**\n\n` +
              `• **Trạng thái hiện tại**: **Đang trên đường giao hàng** (Đơn vị vận chuyển: ${carrier})\n` +
              `• **Mã vận đơn**: \`${trackingCode}\`\n` +
              `• **Thời gian giao dự kiến**: Trong 24h - 48h tới\n` +
              `• **Người nhận**: **${order.customerName || 'Quý khách'}** (${order.customerPhone || ''})\n` +
              `• **Tổng tiền**: **${formatMoney(order.total)}**\n\n` +
              `*Nếu kiện hàng gặp bất kỳ sự cố giao chậm, móp méo hoặc phát sinh khiếu nại, quý khách bấm nút bên dưới để gặp ngay CSKH nhé!*`;

        return {
            message: md,
            localMarkup: cardHtml,
            dynamic_chips: en
                ? ['Report delivery issue', 'Call Hotline 1900 6868', 'Zalo CSKH', 'Track another order']
                : ['Báo sự cố giao hàng', 'Gọi Hotline 1900 6868', 'Chat Zalo CSKH', 'Tra cứu đơn khác']
        };
    }

    // G. Render Thẻ Khiếu Nại & Kết Nối CSKH (Customer Support & Dispute Resolution)
    function renderCSKHSupportCard(orderId = '', issueType = '', language = 'vi') {
        const en = language === 'en';
        const formId = 'ocop-cskh-dispute-' + Date.now();

        const cardHtml = `
            <div id="${formId}" class="mt-3 rounded-2xl border-2 border-rose-400 bg-white p-4 shadow-xl text-gray-800 text-xs">
                <div class="flex items-center gap-2 border-b border-gray-100 pb-2 mb-3">
                    <span class="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center text-sm shadow"><i class="fa-solid fa-headset"></i></span>
                    <div>
                        <h4 class="font-extrabold text-rose-700 text-xs uppercase">${en ? '24/7 CUSTOMER CARE & DISPUTE HANDLER' : 'TRUNG TÂM CSKH & XỬ LÝ SỰ CỐ ĐƠN HÀNG'}</h4>
                        <p class="text-[10px] text-gray-500">${en ? '100% money back or replacement guaranteed' : 'Cam kết đổi mới hoặc hoàn tiền 100% nếu có lỗi'}</p>
                    </div>
                </div>

                <!-- 4 Admin Chuyên Trách OCOP -->
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

                <!-- 3 Kênh Hỗ Trợ Khẩn Cấp -->
                <div class="grid grid-cols-3 gap-2 mb-3 text-center">
                    <a href="tel:${PAYMENT_CONFIG.hotline}" class="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 transition">
                        <i class="fa-solid fa-phone text-base text-rose-600 mb-0.5"></i>
                        <p class="font-extrabold text-[10px]">Hotline 24/7</p>
                        <p class="text-[9px] text-gray-500">${PAYMENT_CONFIG.hotline}</p>
                    </a>
                    <a href="${PAYMENT_CONFIG.zaloUrl}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition">
                        <i class="fa-solid fa-comment-dots text-base text-blue-600 mb-0.5"></i>
                        <p class="font-extrabold text-[10px]">Zalo OA</p>
                        <p class="text-[9px] text-gray-500">${en ? 'Chat Now' : 'Chat Ngay'}</p>
                    </a>
                    <button type="button" onclick="toggleAdminSupport()" class="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100 transition cursor-pointer">
                        <i class="fa-brands fa-facebook-messenger text-base text-indigo-600 mb-0.5"></i>
                        <p class="font-extrabold text-[10px]">4 Admin FB</p>
                        <p class="text-[9px] text-gray-500">${en ? 'Live Support' : 'Trực Tuyến'}</p>
                    </button>
                </div>

                <!-- Form Gửi Yêu Cầu Hỗ Trợ Nhanh -->
                <div class="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2">
                    <p class="text-[10px] font-bold text-gray-700">${en ? 'Quick Incident Report (Response in 15 mins):' : 'Gửi yêu cầu hỗ trợ nhanh (Phản hồi trong 15 phút):'}</p>
                    <div>
                        <input type="text" id="${formId}-order-code" value="${orderId ? '#' + orderId : ''}" placeholder="${en ? 'Order Code (e.g. #OCOP-8823)' : 'Mã đơn hàng (ví dụ: #OCOP-8823)'}" class="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-rose-500">
                    </div>
                    <div>
                        <select id="${formId}-issue-type" class="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-rose-500">
                            <option value="delay">${en ? 'Delivery is delayed / past expected time' : 'Giao hàng trễ / Quá hẹn dự kiến'}</option>
                            <option value="damaged">${en ? 'Packaging damaged / broken items' : 'Hàng móp méo / Hỏng hóc / Bể vỡ'}</option>
                            <option value="wrong">${en ? 'Wrong items / missing items' : 'Giao sai sản phẩm / Thiếu món'}</option>
                            <option value="driver">${en ? 'Delivery driver issue' : 'Thái độ Shipper / Sự cố giao nhận'}</option>
                            <option value="other">${en ? 'Other questions' : 'Vấn đề khiếu nại khác'}</option>
                        </select>
                    </div>
                    <div>
                        <textarea id="${formId}-note" rows="2" placeholder="${en ? 'Describe your issue in detail...' : 'Mô tả chi tiết sự cố quý khách gặp phải...'}" class="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"></textarea>
                    </div>
                    <button type="button" onclick="OcopSalesCopilot.submitComplaint('${formId}')" class="w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2 text-xs transition cursor-pointer">
                        <i class="fa-solid fa-paper-plane mr-1"></i> ${en ? 'Submit Issue to CSKH' : 'Gửi Khiếu Nại Cho CSKH Tiếp Nhận'}
                    </button>
                </div>
            </div>
        `;

        const md = en
            ? `🙏 **OCOP Customer Care is Here to Assist You!**\n\n` +
              `We sincerely apologize for any inconvenience caused. At OCOP Digital Platform, customer satisfaction is our top priority.\n\n` +
              `• **Hotline 24/7**: [${PAYMENT_CONFIG.hotline}](tel:${PAYMENT_CONFIG.hotline})\n` +
              `• **Zalo Official Support**: [Connect via Zalo](${PAYMENT_CONFIG.zaloUrl})\n` +
              `• **Warranty & Return Policy**: 100% free return & exchange within 7 days for damaged or substandard products.\n\n` +
              `*You can also submit the quick issue report form below and our staff will respond within 15 minutes.*`
            : `🙏 **OCOP Rất Xin Lỗi Quý Khách Về Sự Cố Gặp Phải!**\n\n` +
              `Em xin chân thành ghi nhận sự cố này. Hệ thống đặc sản OCOP cam kết chính sách bảo vệ người tiêu dùng tuyệt đối:\n\n` +
              `• **Tổng đài Hotline CSKH**: [${PAYMENT_CONFIG.hotline}](tel:${PAYMENT_CONFIG.hotline}) (hoặc [${PAYMENT_CONFIG.hotlineMobile}](tel:${PAYMENT_CONFIG.hotlineMobile}))\n` +
              `• **Zalo OA Hỗ Trợ Trực Tuyến**: [Bấm kết nối Zalo](${PAYMENT_CONFIG.zaloUrl})\n` +
              `• **Cam kết quyền lợi**: Đổi mới miễn phí tận nơi hoặc hoàn tiền 100% nếu sản phẩm bị hư hỏng, bể vỡ hoặc giao trễ.\n\n` +
              `*Quý khách vui lòng chọn kênh liên hệ khẩn cấp hoặc gửi form khiếu nại bên dưới, chuyên viên CSKH sẽ xử lý ngay lập tức ạ!*`;

        return {
            message: md,
            localMarkup: cardHtml,
            dynamic_chips: en
                ? ['Call Hotline 1900 6868', 'Chat via Zalo', 'Open Facebook Support', 'Track Order']
                : ['Gọi Hotline 1900 6868', 'Chat qua Zalo OA', 'Mở 4 Admin FB', 'Tra cứu đơn hàng']
        };
    }

    // ── 5. BỘ ĐIỀU PHỐI TIN NHẮN TRUNG TÂM (MAIN DISPATCHER) ───────────────

    // Helper render thẻ sản phẩm rút gọn có nút [🛒 Đặt Mua Online Ngay]
    function renderCompactKnowledgeProductCard(recommendedProducts, title, language = 'vi') {
        const en = language === 'en';
        if (!recommendedProducts || recommendedProducts.length === 0) return '';
        return `
            <div class="mt-3 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-sky-900 bg-sky-50 p-2 rounded-xl border border-sky-200">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-star text-amber-500"></i> ${title}</span>
                </div>
                ${recommendedProducts.map(p => `
                    <div class="rounded-xl border border-gray-200 bg-white p-2.5 shadow-xs flex items-center justify-between gap-3">
                        <img src="${p.img || 'chat-avatar.jpg'}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <p class="font-bold text-gray-900 text-xs truncate">${en && p.nameEn ? p.nameEn : p.name}</p>
                            <p class="text-[10px] text-amber-800 font-semibold">${p.region} • ${p.stars || 4}★ SAO OCOP</p>
                            <p class="text-[#0284C7] font-black text-xs mt-0.5">${formatMoney(p.price)}</p>
                        </div>
                        <div class="flex flex-col gap-1 flex-shrink-0">
                            <button type="button" onclick="addToCart(${p.id})" class="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-[10px] cursor-pointer transition">
                                + ${en ? 'Cart' : 'Giỏ'}
                            </button>
                            <button type="button" onclick="if(typeof openOnlineOrderModal==='function'){openOnlineOrderModal(${p.id});}else{OcopSalesCopilot.openOrderModal([${p.id}]);} " class="px-2.5 py-1 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black text-[10px] cursor-pointer transition flex items-center gap-1 shadow-xs" style="background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%) !important; color: #FFFFFF !important;"><i class="fa-solid fa-cart-shopping text-[9px]"></i> 🛒 ${en ? 'Order Online' : 'Đặt Mua Online Ngay'}</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function processUserMessage(rawQuery, languageOverride, catalogProducts = []) {
        const lang = languageOverride || detectLanguage(rawQuery);
        const intent = classifyIntent(rawQuery, lang);
        const en = lang === 'en';

        // 1. Phân loại: Đề xuất Combo theo ngân sách
        if (intent === INTENTS.RECOMMEND_COMBO) {
            const budget = parseBudget(rawQuery) || 500000;
            const prov = detectProvince(rawQuery);
            const comboData = generateSmartCombo(budget, prov, catalogProducts, lang);
            return renderComboResponse(comboData, lang);
        }

        // 2. Phân loại: Tìm kiếm theo tỉnh thành
        if (intent === INTENTS.SEARCH_PROVINCE) {
            const prov = detectProvince(rawQuery) || 'Đồng Nai';
            return renderProvinceResponse(prov, catalogProducts, lang);
        }

        // 3. Phân loại: Khởi tạo đơn hàng trực tiếp trong chat
        if (intent === INTENTS.ORDER_CREATE) {
            return renderOrderCreationForm([], catalogProducts, lang);
        }

        // 4. Phân loại: Thanh toán QR
        if (intent === INTENTS.PAYMENT_QR) {
            const orderCode = parseOrderCode(rawQuery) || ('OCOP' + Math.floor(10000 + Math.random() * 90000));
            const budget = parseBudget(rawQuery) || 500000;
            const mockOrder = {
                id: orderCode,
                total: budget,
                customerName: 'Quý khách hàng',
                customerPhone: '0912345678',
                customerAddress: 'Địa chỉ nhận hàng'
            };
            return renderVietQRPaymentCard(mockOrder, lang);
        }

        // 5. Phân loại: Thanh toán COD
        if (intent === INTENTS.PAYMENT_COD) {
            const orderCode = parseOrderCode(rawQuery) || ('OCOP' + Math.floor(10000 + Math.random() * 90000));
            const budget = parseBudget(rawQuery) || 500000;
            const mockOrder = {
                id: orderCode,
                total: budget,
                customerName: 'Quý khách hàng',
                customerPhone: '0912345678',
                customerAddress: 'Giao hàng tận nơi'
            };
            return renderCODConfirmationCard(mockOrder, lang);
        }

        // 6. Phân loại: Tra cứu đơn hàng & vận chuyển
        if (intent === INTENTS.ORDER_TRACK) {
            const code = parseOrderCode(rawQuery);
            const phone = parsePhoneNumber(rawQuery);
            let foundOrder = null;

            // Tra trong localStorage nếu có
            try {
                const storedOrders = JSON.parse(localStorage.getItem('ocop_orders') || '[]');
                if (code) {
                    foundOrder = storedOrders.find(o => o.id === code || o.id === code.replace(/^#/, ''));
                }
                if (!foundOrder && phone) {
                    foundOrder = storedOrders.find(o => o.customerPhone === phone);
                }
            } catch (_) {}

            if (!foundOrder) {
                // Tạo thông tin vận chuyển mô phỏng thực tế
                foundOrder = {
                    id: code || ('OCOP-' + Math.floor(10000 + Math.random() * 90000)),
                    total: 485000,
                    status: 'delivering',
                    customerName: 'Quý khách',
                    customerPhone: phone || '0988xxxxxx',
                    customerAddress: 'Số 18, Hoàng Quốc Việt, Cầu Giấy, Hà Nội'
                };
            }
            return renderOrderTrackingCard(foundOrder, lang);
        }

        // 7. Phân loại: Khiếu nại, sự cố giao hàng & CSKH
        if (intent === INTENTS.COMPLAINT_CSKH) {
            const code = parseOrderCode(rawQuery) || '';
            return renderCSKHSupportCard(code, '', lang);
        }

        // 8.1 Hướng dẫn Pha Trà OCOP chuẩn vị
        if (intent === INTENTS.TEA_BREWING_GUIDE) {
            const teaItems = catalogProducts.filter(p => /(tra|che|tea)/i.test(p.name + ' ' + (p.category || ''))).slice(0, 2);
            const md = en
                ? `🍵 **Authentic OCOP Vietnamese Tea Brewing Masterguide:**\n\n` +
                  `• **Step 1 (Warm Teaware):** Rinse teapot and cups with 100°C boiling water to awaken aromas.\n` +
                  `• **Step 2 (Ratio):** Use **5g – 8g of tea leaves** per 150ml – 200ml teapot.\n` +
                  `• **Step 3 (Water Temperature):** Optimal brewing water is **85°C – 90°C** (never use roaring 100°C water directly on ancient Shan Tuyet leaves to prevent burning and harsh bitterness).\n` +
                  `• **Step 4 (Awaken):** Pour hot water over leaves and decant immediately within 3 seconds.\n` +
                  `• **Step 5 (Infuse):** Steep for **30 – 45 seconds**. Pour all tea into a sharing pitcher to maintain equal infusion strength and enjoy the lingering sweet aftertaste (hậu ngọt).\n\n` +
                  `👉 *Tap below to order authentic certified OCOP teas directly:*\n`
                : `🍵 **Hướng Dẫn Pha Trà OCOP Thơm Ngon Chuẩn Vị Bản Địa:**\n\n` +
                  `• **Bước 1 (Tráng ấm chén):** Dùng nước sôi 100°C tráng đều ấm và chén để làm nóng dụng cụ pha, giúp dậy hương trà tối đa.\n` +
                  `• **Bước 2 (Định lượng):** Lấy khoảng **5g – 8g trà** (khoảng 1 muỗng) cho ấm dung tích 150ml – 200ml.\n` +
                  `• **Bước 3 (Nhiệt độ nước):** Dùng nước nóng khoảng **85°C – 90°C** (tránh đổ trực tiếp nước sôi sùng sục 100°C làm cháy lá non và vị chát gắt).\n` +
                  `• **Bước 4 (Đánh thức trà):** Rót nước ngập lá trà rồi rót ra ngay trong vòng 3 giây.\n` +
                  `• **Bước 5 (Hãm & Thưởng trà):** Châm nước vào ấm, hãm trong **30 – 45 giây**. Rót hết nước trà ra tống rồi chia đều ra các chén để thưởng thức trọn vẹn vị thanh ngọt hậu tự nhiên.\n\n` +
                  `👉 *Quý khách có thể bấm đặt mua trà OCOP thượng hạng giao tận nơi bên dưới:*\n`;

            return {
                message: md,
                localMarkup: renderCompactKnowledgeProductCard(teaItems, en ? 'Featured OCOP Teas' : 'Đặc Sản Trà OCOP Tiêu Biểu', lang),
                dynamic_chips: en
                    ? ['Ancient Shan Tuyet Tea', 'Dong Nai Bitter Melon Tea', 'Gift Combo under 500k', 'Order Online Now']
                    : ['Trà Shan Tuyết Cổ Thụ', 'Trà Khổ Qua Rừng Đồng Nai', 'Combo quà 500k', 'Đặt mua online ngay']
            };
        }

        // 8.2 Hướng dẫn Bảo quản & Tránh ẩm mốc
        if (intent === INTENTS.STORAGE_GUIDE) {
            const sampleItems = catalogProducts.slice(0, 2);
            const md = en
                ? `🌿 **OCOP Specialty Storage Guide (Prevent Mold & Preserve Freshness):**\n\n` +
                  `• **Teas & Dried Herbs:** Store in sealed ceramic/tin canisters or airtight zip bags in a cool, dry place away from direct sunlight.\n` +
                  `• **Wild Forest Honey:** Keep at room temperature (20°C – 27°C). **Do not refrigerate** to prevent natural glucose crystallization.\n` +
                  `• **Roasted Nuts & Confectionery:** Reseal zip bag tightly after opening; never use a wet utensil inside containers.\n` +
                  `• **Expiry Date:** Every product carries verified production and expiry dates (typically 6–12 months) inspected by local cooperatives.\n\n` +
                  `👉 *All products are freshly dispatched from local cooperatives:*\n`
                : `🌿 **Hướng Dẫn Bảo Quản Đặc Sản OCOP Tránh Ẩm Mốc & Giữ Trọn Dinh Dưỡng:**\n\n` +
                  `• **Đối với Trà & Cà phê:** Đựng trong hũ gốm/thủy tinh hoặc túi zip kín khí, để nơi khô ráo, tránh ánh sáng mặt trời trực tiếp và không để gần gia vị có mùi nồng.\n` +
                  `• **Đối với Mật ong rừng:** Bảo quản ở nhiệt độ phòng (20°C – 27°C) nơi thoáng mát. **Tuyệt đối không bảo quản trong ngăn mát tủ lạnh** vì dễ gây hiện tượng kết tinh đường tự nhiên.\n` +
                  `• **Đối với Hạt sấy & Bánh mứt:** Sau khi mở bao bì, miết chặt khóa zip hoặc bảo quản trong hũ kín. Không dùng thìa ướt để lấy thực phẩm.\n` +
                  `• **Hạn sử dụng:** Toàn bộ đặc sản đều có tem ghi rõ ngày sản xuất và hạn dùng (thường từ 6 – 12 tháng) được HTX kiểm định an toàn VSTP.\n\n` +
                  `👉 *Bấm nút đặt hàng nhanh để nhận sản phẩm sản xuất mới nhất trong tuần:*\n`;

            return {
                message: md,
                localMarkup: renderCompactKnowledgeProductCard(sampleItems, en ? 'Fresh OCOP Specialties' : 'Đặc Sản OCOP Date Mới Nhất', lang),
                dynamic_chips: en
                    ? ['Storage advice', 'U Minh Honey', 'Roasted Cashews', 'Order Online Now']
                    : ['Hạn sử dụng trà', 'Mật ong rừng U Minh', 'Hạt điều rang muối', 'Đặt mua online ngay']
            };
        }

        // 8.3 Tư vấn Quà tặng Doanh nghiệp & Hóa đơn VAT
        if (intent === INTENTS.CORPORATE_GIFT) {
            const giftItems = catalogProducts.filter(p => p.stars === 5 || p.price >= 120000).slice(0, 2);
            const md = en
                ? `🎁 **Corporate OCOP Gift Consultation & Official VAT Invoicing:**\n\n` +
                  `• **Elegance & Heritage:** Curated luxury 3★–5★ specialty gift sets from 63 provinces.\n` +
                  `• **Branding & Customization:** Free corporate logo printing, tailored ribbons and bilingual greeting cards.\n` +
                  `• **Budget Tiers:** Flexible tiers at 300,000₫ – 500,000₫ – 1,000,000₫ – 2,500,000₫/set.\n` +
                  `• **Legality & Invoicing:** Full official VAT (e-Invoice) and genuine cooperative origin certificates.\n\n` +
                  `👉 *Explore popular corporate gift sets below or connect with our B2B Manager:*\n`
                : `🎁 **Dịch Vụ Quà Tặng Doanh Nghiệp OCOP 3★–5★ Sang Trọng & Ý Nghĩa:**\n\n` +
                  `• **Đẳng cấp & Bản sắc:** Set quà kết tinh tinh hoa đặc sản 63 tỉnh thành, chuẩn hóa chất lượng OCOP quốc gia.\n` +
                  `• **Thiết kế riêng:** Hỗ trợ in logo doanh nghiệp, thiệp chúc mừng và đóng hộp quà cao cấp theo yêu cầu.\n` +
                  `• **Linh hoạt ngân sách:** Đáp ứng trọn gói các phân khúc: 300.000₫ – 500.000₫ – 1.000.000₫ – 2.500.000₫/set.\n` +
                  `• **Pháp lý minh bạch:** Cung cấp đầy đủ **Hóa đơn GTGT (VAT)**, hợp đồng mua bán và hồ sơ chứng nhận OCOP từ các Hợp tác xã chính hãng.\n\n` +
                  `👉 *Quý khách xem mẫu hộp quà gợi ý bên dưới hoặc kết nối CSKH để nhận báo giá chiết khấu:*\n`;

            return {
                message: md,
                localMarkup: renderCompactKnowledgeProductCard(giftItems, en ? 'Corporate Gift Sets' : 'Gợi Ý Quà Tặng OCOP Tiêu Biểu', lang),
                dynamic_chips: en
                    ? ['Corporate Gift 500k', 'Corporate Gift 1M', 'VAT Invoice inquiry', 'Contact B2B Admin']
                    : ['Set quà 500k', 'Hộp quà VIP 1 triệu', 'Xuất hóa đơn VAT', 'Liên hệ Admin B2B']
            };
        }

        // 8.4 Chính sách Đồng kiểm & Đổi mới 1-1 trong 7 ngày
        if (intent === INTENTS.INSPECTION_POLICY) {
            const inspectItems = catalogProducts.slice(0, 2);
            const md = en
                ? `🛡️ **100% Parcel Inspection Rights & 7-Day 1-to-1 Replacement Guarantee:**\n\n` +
                  `• **Open Box Inspection:** You have the full right to **open and inspect packages** before paying the courier.\n` +
                  `• **7-Day 1-to-1 Replacement:** Free 1-to-1 replacement or 100% refund within 7 days for any courier damage or defect.\n` +
                  `• **Authentic QR Stamp:** Every box carries a verified QR code issued by registered local cooperatives.\n\n` +
                  `👉 *Enjoy 100% peace of mind shopping below:*\n`
                : `🛡️ **Chính Sách Đồng Kiểm & Đổi Mới 1-1 Trong 7 Ngày Toàn Diện:**\n\n` +
                  `• **Quyền lợi Đồng kiểm 100%:** Khi nhận hàng từ Shipper, quý khách hoàn toàn được quyền **mở hộp kiểm tra ngoại quan**, số lượng và tem niêm phong sản phẩm trước khi thanh toán.\n` +
                  `• **Đổi mới 1-1 trong 7 ngày:** Nếu phát hiện sản phẩm bị móp méo, vỡ hỏng do vận chuyển, giao sai món hoặc không đúng chất lượng cam kết, hệ thống sẽ **thu hồi và gửi đổi sản phẩm mới ngay trong 24h** hoàn toàn miễn phí.\n` +
                  `• **Cam kết hoàn tiền:** Hoàn tiền 100% nếu quý khách không hài lòng về chất lượng nguồn gốc xuất xứ.\n` +
                  `• **Tem QR truy xuất:** Mỗi kiện hàng đều dán tem QR HTX bản địa để quý khách quét kiểm tra chứng nhận nguồn gốc xuất xứ tức thì.\n\n` +
                  `👉 *Quý khách hoàn toàn an tâm đặt mua đặc sản chính hãng ngay hôm nay:*\n`;

            return {
                message: md,
                localMarkup: renderCompactKnowledgeProductCard(inspectItems, en ? 'Guaranteed OCOP Specialties' : 'Sản Phẩm Đảm Bảo Quyền Lợi Đồng Kiểm', lang),
                dynamic_chips: en
                    ? ['Inspection policy', 'Return within 7 days', 'Track Order', 'Order Online Now']
                    : ['Quyền đồng kiểm', 'Đổi trả trong 7 ngày', 'Tra cứu đơn hàng', 'Đặt mua online ngay']
            };
        }

        // 8.5 Kiến thức OCOP 3★–5★ & Tem QR HTX bản địa
        if (intent === INTENTS.OCOP_KNOWLEDGE) {
            const fiveStarItems = catalogProducts.filter(p => p.stars === 5).slice(0, 2);
            const md = en
                ? `🌿 **Vietnam National OCOP Standards & Cooperative QR Origin Tracing:**\n\n` +
                  `• **What is OCOP?** 'One Commune One Product' is Vietnam's national program elevating traditional agricultural specialties and handicraft villages across 63 provinces.\n` +
                  `• **OCOP 3-Star (District/Provincial):** Certified food safety standards, clear packaging, and traceable local production.\n` +
                  `• **OCOP 4-Star (Provincial/Regional):** High-standard regional treasures adhering to VietGAP/HACCP/ISO, wide commercial distribution.\n` +
                  `• **OCOP 5-Star (National Masterpiece):** Recognized by the Prime Minister & Central Council, global export quality embodying Vietnamese cultural heritage.\n` +
                  `• **Cooperative QR Tracing:** 100% of products are stamped with verifiable QR codes linking directly to local cooperatives (HTX).\n` +
                  `• **Buyer Protection:** Full parcel inspection before payment and 7-day 1-to-1 replacement.\n\n` +
                  `👉 *Explore certified 5-star national treasures below:*\n`
                : `🌿 **Hệ Thống Tiêu Chuẩn OCOP Quốc Gia (Mỗi Xã Một Sản Phẩm) & Tem QR HTX Bản Địa:**\n\n` +
                  `• **OCOP là gì?** Là chương trình phát triển kinh tế nông thôn quốc gia, chuẩn hóa và bảo tồn đặc sản tinh hoa truyền thống từ 63 tỉnh thành Việt Nam.\n` +
                  `• **OCOP 3 Sao (Cấp Huyện/Tỉnh):** Sản phẩm đạt chuẩn an toàn thực phẩm, bao bì truy xuất nguồn gốc, quy mô sản xuất ổn định tại địa phương.\n` +
                  `• **OCOP 4 Sao (Cấp Tỉnh/Vùng):** Sản phẩm tiêu biểu vùng miền, quy trình tiên tiến đạt chuẩn VietGAP/HACCP/ISO, có tiềm năng thương mại lớn.\n` +
                  `• **OCOP 5 Sao (Quốc Bảo Quốc Gia):** Do Thủ tướng Chính phủ và Hội đồng Trung ương công nhận, chất lượng đỉnh cao và đại diện Việt Nam xuất khẩu toàn cầu.\n` +
                  `• **Tem QR Truy Xuất HTX Bản Địa:** 100% sản phẩm phân phối đều dán tem QR định danh truy xuất nguồn gốc tận Hợp tác xã / Cơ sở sản xuất.\n` +
                  `• **Chính sách:** Đồng kiểm khi nhận hàng và bảo hành đổi mới 1-1 trong vòng 7 ngày.\n\n` +
                  `👉 *Quý khách muốn em tư vấn combo quà tặng 5 sao hay đặc sản của tỉnh thành nào ạ?*`;

            return {
                message: md,
                localMarkup: renderCompactKnowledgeProductCard(fiveStarItems.length ? fiveStarItems : catalogProducts.slice(0, 2), en ? 'Certified 5-Star National Treasures' : 'Quốc Bảo OCOP 5 Sao Tiêu Biểu', lang),
                dynamic_chips: en
                    ? ['5-Star OCOP Gifts', 'Cooperative QR stamps', 'Specialties of Dong Nai', 'Order Online Now']
                    : ['Đặc sản 5 Sao', 'Tem QR truy xuất HTX', 'Đặc sản Đồng Nai', 'Đặt mua online ngay']
            };
        }

        // 9. Chào hỏi tổng quát
        const greetingMd = en
            ? `Xin chào! I am **AI OCOP Sales Copilot** – your smart assistant for Vietnamese regional specialties.\n\n` +
              `I can assist you across all steps:\n` +
              `• 🎁 **Curate Combos by Budget**: Enter your budget (e.g. "Combo 500k")\n` +
              `• 📍 **Filter by 63 Provinces**: (e.g. "Specialties of Dong Nai" or "Ben Tre")\n` +
              `• 🛒 **In-Chat Ordering & Payment**: Instant VietQR or Cash on Delivery (COD)\n` +
              `• 🚚 **Track Delivery & 24/7 CSKH**: Instant order tracking and dispute handling.\n\n` +
              `How may I assist you today?`
            : `Xin chào quý khách! Em là **AI OCOP Sales Copilot** – Trợ lý ảo thông minh chuyên tư vấn, bán hàng và chăm sóc khách hàng đặc sản OCOP.\n\n` +
              `Em sẵn sàng hỗ trợ quý khách xuyên suốt mọi nhu cầu:\n` +
              `• 🎁 **Tư vấn Combo theo ngân sách**: (Ví dụ: "Tôi có 500k", "Combo 300k quà tặng")\n` +
              `• 📍 **Lọc đặc sản 63 Tỉnh Thành**: (Ví dụ: "Đặc sản Đồng Nai", "Sản phẩm Bến Tre")\n` +
              `• 🛒 **Tạo đơn & Thanh toán trực tiếp**: VietQR tự động hoặc Ship COD tận nơi\n` +
              `• 🚚 **Tra cứu hành trình đơn & Kết nối CSKH 24/7**: Kiểm tra tiến độ giao hàng và xử lý sự cố.\n\n` +
              `Quý khách đang quan tâm đến đặc sản vùng miền nào hoặc cần em lên combo ngân sách bao nhiêu ạ?`;

        return {
            message: greetingMd,
            dynamic_chips: en
                ? ['Combo under 500k', 'Combo under 300k', 'Dong Nai Specialties', 'Create an Order', 'Track Order']
                : ['Combo quà 500k', 'Combo tiết kiệm 300k', 'Đặc sản Đồng Nai', 'Tạo đơn hàng ngay', 'Tra cứu đơn hàng']
        };
    }

    // ── 6. CÁC HÀM TƯƠNG TÁC THAO TÁC (ACTIONS / PUBLIC API) ──────────────

    // Thêm combo vào giỏ hàng
    function addComboToCart(productIds) {
        if (typeof window !== 'undefined' && typeof window.addProductsToCart === 'function') {
            window.addProductsToCart(productIds);
        } else if (typeof window !== 'undefined' && typeof window.addToCart === 'function') {
            productIds.forEach(id => window.addToCart(id));
        }
        if (typeof showToast === 'function') {
            showToast('Đã thêm toàn bộ sản phẩm trong Combo vào Giỏ Hàng thành công!', 'success');
        }
    }

    // Mở Form Đặt Hàng Trực Tiếp Trong Chat
    function openOrderModal(productIds) {
        const catalog = (typeof products !== 'undefined' && Array.isArray(products)) ? products : [];
        const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
        const formResponse = renderOrderCreationForm(productIds, catalog, lang);

        const messagesEl = document.getElementById('ai-chat-messages');
        if (!messagesEl) return;

        const reply = document.createElement('div');
        reply.className = 'flex items-start space-x-2';
        reply.innerHTML = `
            <img src="chat-avatar.jpg" alt="" class="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 shadow">
            <div class="bg-white p-3.5 rounded-2xl border border-emerald-100 text-gray-800 shadow-sm leading-relaxed max-w-[92%] space-y-2 break-words">
                <div class="flex items-center justify-between text-[10px] text-gray-400 border-b border-gray-100 pb-1 mb-1">
                    <span class="font-bold text-ocopGreen flex items-center gap-1"><i class="fa-solid fa-receipt text-amber-500"></i> AI Order Checkout</span>
                </div>
                <p class="whitespace-pre-wrap">${formResponse.message}</p>
                <div class="ai-order-form-container">${formResponse.localMarkup}</div>
            </div>
        `;
        messagesEl.appendChild(reply);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Xử lý gửi Form Đặt Hàng Trong Chat
    function submitInChatOrder(formId, productIds, totalAmount) {
        const nameInput = document.getElementById(`${formId}-name`);
        const phoneInput = document.getElementById(`${formId}-phone`);
        const addressInput = document.getElementById(`${formId}-address`);
        const paymentRadio = document.querySelector(`input[name="${formId}-payment"]:checked`);

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const address = addressInput ? addressInput.value.trim() : '';
        const paymentMethod = paymentRadio ? paymentRadio.value : 'vietqr';

        if (!name) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập Họ và tên người nhận!', 'warning');
            if (nameInput) nameInput.focus();
            return;
        }
        if (!phone || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone.replace(/\s+/g, ''))) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập Số điện thoại hợp lệ (10 chữ số)!', 'warning');
            if (phoneInput) phoneInput.focus();
            return;
        }
        if (!address) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập Địa chỉ giao hàng chi tiết!', 'warning');
            if (addressInput) addressInput.focus();
            return;
        }

        // Tạo đơn hàng mới
        const orderId = 'OCOP-' + Math.floor(10000 + Math.random() * 90000);
        const newOrder = {
            id: orderId,
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            paymentMethod: paymentMethod,
            productIds: productIds,
            total: totalAmount,
            createdAt: new Date().toISOString(),
            status: paymentMethod === 'vietqr' ? 'awaiting_payment' : 'confirmed',
            carrier: 'Viettel Post (VTP Express)',
            trackingCode: 'VTP' + Math.floor(10000000 + Math.random() * 90000000)
        };

        // Lưu đơn hàng vào localStorage
        try {
            const orders = JSON.parse(localStorage.getItem('ocop_orders') || '[]');
            orders.unshift(newOrder);
            localStorage.setItem('ocop_orders', JSON.stringify(orders.slice(0, 50)));
        } catch (_) {}

        if (typeof showToast === 'function') {
            showToast(`Đã tạo thành công đơn hàng #${orderId}!`, 'success');
        }

        // Hiển thị thẻ thanh toán tương ứng ngay trong chat
        const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
        let paymentResponse = null;
        if (paymentMethod === 'vietqr') {
            paymentResponse = renderVietQRPaymentCard(newOrder, lang);
        } else {
            paymentResponse = renderCODConfirmationCard(newOrder, lang);
        }

        const formNode = document.getElementById(formId);
        if (formNode) {
            formNode.innerHTML = paymentResponse.localMarkup;
        }
    }

    // Sao chép văn bản vào clipboard
    function copyText(text, successMsg) {
        if (!navigator.clipboard) {
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        } else {
            navigator.clipboard.writeText(text);
        }
        if (typeof showToast === 'function') {
            showToast(successMsg || 'Đã sao chép vào bộ nhớ tạm!', 'success');
        }
    }

    // Xác nhận đã thanh toán VietQR
    function confirmQRPayment(orderId) {
        try {
            const orders = JSON.parse(localStorage.getItem('ocop_orders') || '[]');
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'paid';
                localStorage.setItem('ocop_orders', JSON.stringify(orders));
            }
        } catch (_) {}

        if (typeof showToast === 'function') {
            showToast(`Đã ghi nhận thanh toán đơn #${orderId}. Bộ phận đóng gói đang xử lý!`, 'success');
        }

        trackOrder(orderId);
    }

    // Tra cứu đơn hàng
    function trackOrder(orderId) {
        const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
        let foundOrder = null;
        try {
            const orders = JSON.parse(localStorage.getItem('ocop_orders') || '[]');
            foundOrder = orders.find(o => o.id === orderId || o.id === orderId.replace(/^#/, ''));
        } catch (_) {}

        if (!foundOrder) {
            foundOrder = {
                id: orderId,
                total: 485000,
                status: 'delivering',
                customerName: 'Quý khách',
                customerPhone: '0988xxxxxx',
                customerAddress: 'Địa chỉ nhận hàng'
            };
        }

        const trackingResponse = renderOrderTrackingCard(foundOrder, lang);
        const messagesEl = document.getElementById('ai-chat-messages');
        if (!messagesEl) return;

        const reply = document.createElement('div');
        reply.className = 'flex items-start space-x-2';
        reply.innerHTML = `
            <img src="chat-avatar.jpg" alt="" class="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 shadow">
            <div class="bg-white p-3.5 rounded-2xl border border-sky-100 text-gray-800 shadow-sm leading-relaxed max-w-[92%] space-y-2 break-words">
                <div class="flex items-center justify-between text-[10px] text-gray-400 border-b border-gray-100 pb-1 mb-1">
                    <span class="font-bold text-sky-600 flex items-center gap-1"><i class="fa-solid fa-truck text-sky-500"></i> AI Delivery Tracker</span>
                </div>
                <p class="whitespace-pre-wrap">${trackingResponse.message}</p>
                <div>${trackingResponse.localMarkup}</div>
            </div>
        `;
        messagesEl.appendChild(reply);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Mở Form Khiếu Nại & CSKH
    function openComplaintForm(orderId) {
        const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'vi';
        const cskhResponse = renderCSKHSupportCard(orderId, '', lang);

        const messagesEl = document.getElementById('ai-chat-messages');
        if (!messagesEl) return;

        const reply = document.createElement('div');
        reply.className = 'flex items-start space-x-2';
        reply.innerHTML = `
            <img src="chat-avatar.jpg" alt="" class="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 shadow">
            <div class="bg-white p-3.5 rounded-2xl border border-rose-100 text-gray-800 shadow-sm leading-relaxed max-w-[92%] space-y-2 break-words">
                <div class="flex items-center justify-between text-[10px] text-gray-400 border-b border-gray-100 pb-1 mb-1">
                    <span class="font-bold text-rose-600 flex items-center gap-1"><i class="fa-solid fa-headset text-rose-500"></i> AI Support Desk</span>
                </div>
                <p class="whitespace-pre-wrap">${cskhResponse.message}</p>
                <div>${cskhResponse.localMarkup}</div>
            </div>
        `;
        messagesEl.appendChild(reply);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Gửi Yêu Cầu Khiếu Nại
    function submitComplaint(formId) {
        const orderInput = document.getElementById(`${formId}-order-code`);
        const typeSelect = document.getElementById(`${formId}-issue-type`);
        const noteText = document.getElementById(`${formId}-note`);

        const orderCode = orderInput ? orderInput.value.trim() : '';
        const issueType = typeSelect ? typeSelect.value : 'other';
        const note = noteText ? noteText.value.trim() : '';

        // Lưu khiếu nại vào localStorage
        try {
            const complaints = JSON.parse(localStorage.getItem('ocop_complaints') || '[]');
            complaints.unshift({
                id: 'TICKET-' + Date.now().toString().slice(-6),
                orderCode: orderCode,
                issueType: issueType,
                note: note,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('ocop_complaints', JSON.stringify(complaints));
        } catch (_) {}

        if (typeof showToast === 'function') {
            showToast('Đã gửi yêu cầu khiếu nại! Chuyên viên CSKH OCOP sẽ liên hệ lại trong 15 phút.', 'success');
        }

        const formNode = document.getElementById(formId);
        if (formNode) {
            formNode.innerHTML = `
                <div class="text-center py-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <i class="fa-solid fa-circle-check text-2xl text-emerald-600 mb-2"></i>
                    <h4 class="font-extrabold text-emerald-800 text-xs uppercase">Đã Tiếp Nhận Yêu Cầu Thành Công</h4>
                    <p class="text-[10px] text-gray-600 mt-1 px-3">Mã khiếu nại của quý khách đã được chuyển ưu tiên tới trưởng bộ phận CSKH. Hotline hỗ trợ khẩn cấp: <b>1900 6868</b>.</p>
                </div>
            `;
        }
    }

    // Lọc theo Tỉnh Thành trên gian hàng chính
    function filterByProvince(provinceName) {
        if (typeof window !== 'undefined') {
            if (typeof window.filterProductsByProvince === 'function') {
                window.filterProductsByProvince(provinceName);
            } else if (typeof window.filterProductsGlobal === 'function') {
                window.filterProductsGlobal(provinceName);
            }
            if (typeof window.scrollToProducts === 'function') {
                window.scrollToProducts();
            }
            if (typeof showToast === 'function') {
                showToast(`Đang hiển thị đặc sản tỉnh: ${provinceName}`, 'info');
            }
        }
    }

    return {
        PROVINCES_63,
        PAYMENT_CONFIG,
        detectLanguage,
        parseBudget,
        detectProvince,
        classifyIntent,
        generateSmartCombo,
        processUserMessage,
        addComboToCart,
        openOrderModal,
        submitInChatOrder,
        copyText,
        confirmQRPayment,
        trackOrder,
        openComplaintForm,
        submitComplaint,
        filterByProvince
    };
}));
