const fs = require('fs');

console.log('=== APPLYING SUPER VIP POLISH & AI TIKTOK SUITE ===');

// =========================================================================
// 1. UPDATE index.html
// =========================================================================
let html = fs.readFileSync('index.html', 'utf8');

// A. Add global text-shadow rule and hero title overflow fix in <head>
const textShadowHeadRule = `
    <!-- SUPER VIP: ELIMINATE ALL BLURRY TEXT-SHADOWS & ENFORCE SHARP CONTRAST -->
    <style id="super-vip-contrast-rules">
        * {
            text-shadow: none !important;
        }
        #i18n-hero-title1 {
            overflow: visible !important;
            padding-left: 12px !important;
            margin-left: 0 !important;
            text-indent: 0 !important;
            display: inline-block !important;
            color: #0F172A !important;
        }
        #shop-hero h2,
        #shop-hero .lg\\:col-span-7 {
            overflow: visible !important;
        }
        #shop-hero .absolute h3,
        #shop-hero .absolute p,
        #shop-hero .absolute #i18n-hero-banner-sub {
            color: #FFFFFF !important;
            text-shadow: none !important;
        }
        #shop-hero .absolute #i18n-hero-badge-tag {
            background: #0284C7 !important;
            color: #FFFFFF !important;
            border: 1px solid #38BDF8 !important;
        }
        .lang-dropdown-btn,
        #header-lang-dropdown-btn,
        #intro-lang-dropdown-btn {
            background: #F0F9FF !important;
            border: 1.5px solid #7DD3FC !important;
            color: #0369A1 !important;
            border-radius: 12px !important;
            box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08) !important;
        }
        .lang-dropdown-btn span,
        .lang-dropdown-btn i,
        #header-lang-dropdown-btn span,
        #header-lang-dropdown-btn i,
        #intro-lang-dropdown-btn span,
        #intro-lang-dropdown-btn i {
            color: #0369A1 !important;
            font-weight: 800 !important;
        }
    </style>
`;

if (!html.includes('super-vip-contrast-rules')) {
    html = html.replace('</head>', textShadowHeadRule + '\n</head>');
    console.log('✓ Added super-vip-contrast-rules to <head>');
}

// B. Screen 1 Header button "Khám phá đặc sản ngay ->"
// Currently:
// <button type="button" onclick="enterOcopMarket('all')" class="px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer bg-sky-600 hover:bg-sky-500 text-white shadow-sm border border-sky-400">
//     <span>Khám phá đặc sản 63 tỉnh thành →</span>
// </button>
const oldIntroHeaderBtnRegex = /<button type="button" onclick="enterOcopMarket\('all'\)" class="px-4 py-2[^"]*"[^>]*>\s*<span>[^<]*<\/span>\s*<\/button>/;
const newIntroHeaderBtn = `<button type="button" id="btn-intro-header-explore" onclick="enterOcopMarket('all')" class="px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md hover:opacity-95" style="background: #0284C7 !important; color: #FFFFFF !important; border: 1px solid #0369A1 !important; font-weight: 800 !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3) !important;">
                    <span style="color: #FFFFFF !important; font-weight: 800 !important;">Khám Phá Đặc Sản Ngay →</span>
                </button>`;

if (oldIntroHeaderBtnRegex.test(html)) {
    html = html.replace(oldIntroHeaderBtnRegex, newIntroHeaderBtn);
    console.log('✓ Updated Screen 1 Header button to "Khám Phá Đặc Sản Ngay →"');
}

// C. Add "🎬 AI Tạo Video TikTok" button on Sticky Header right next to "🔐 Quản Trị Doanh Thu"
const tiktokHeaderBtnHtml = `
                <!-- Action Button 3: 🎬 AI Tạo Video TikTok -->
                <button type="button" id="btn-header-tiktok" onclick="openTikTokStudioModal()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs" style="white-space: nowrap !important; height: 38px; background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important; color: #FFFFFF !important; border: 1px solid #38BDF8 !important;" title="AI Tạo Nội Dung & Video TikTok Quảng Bá OCOP">
                    <i class="fa-brands fa-tiktok text-rose-300"></i>
                    <span>🎬 AI Tạo Video TikTok</span>
                </button>
`;

if (!html.includes('id="btn-header-tiktok"')) {
    const adminPinBtnMarker = 'id="btn-header-admin-pin"';
    const btnPinPos = html.indexOf(adminPinBtnMarker);
    if (btnPinPos !== -1) {
        // Find closing tag of admin pin button
        const closeBtnPos = html.indexOf('</button>', btnPinPos);
        if (closeBtnPos !== -1) {
            html = html.slice(0, closeBtnPos + 9) + '\n' + tiktokHeaderBtnHtml + html.slice(closeBtnPos + 9);
            console.log('✓ Added "🎬 AI Tạo Video TikTok" button to Sticky Header');
        }
    }
}

// D. Replace Screen 1 unnatural text with natural OCOP marketing copy
// Subtitle under logo:
html = html.replace(
    'id="i18n-intro-badge">Hệ điều hành số & Trợ lý quản trị đặc sản Việt Nam</span>',
    'id="i18n-intro-badge">CỔNG THÔNG TIN QUẢNG BÁ ĐẶC SẢN & KẾT NỐI ĐIỂM BÁN OCOP VIỆT NAM</span>'
);

// National Seal Award Badge:
html = html.replace(
    'id="i18n-intro-award">🏆 NỀN TẢNG ĐIỀU PHỐI SỐ & ĐỊNH VỊ THƯƠNG HIỆU OCOP TOÀN QUỐC 🏆</span>',
    'id="i18n-intro-award">🌟 TINH HOA ĐẶC SẢN 63 TỈNH THÀNH • BẢO CHỨNG CHẤT LƯỢNG OCOP</span>'
);

// Blue text under big title:
html = html.replace(
    'id="i18n-intro-title2" style="font-size: clamp(0.85rem, 1.6vw, 1.35rem); display: inline-block; color: #0284C7 !important; background: none !important; -webkit-text-fill-color: #0284C7 !important; font-weight: 800 !important;">63 TỈNH THÀNH • ĐỊNH VỊ ĐIỂM BÁN • AI HỖ TRỢ DOANH NGHIỆP</span>',
    'id="i18n-intro-title2" style="font-size: clamp(0.85rem, 1.5vw, 1.25rem); display: inline-block; color: #0284C7 !important; background: none !important; -webkit-text-fill-color: #0284C7 !important; font-weight: 800 !important;">KHÁM PHÁ ĐẶC SẢN VÙNG MIỀN • TRA CỨU CỬA HÀNG CHÍNH HÃNG • TRỢ LÝ AI TƯ VẤN</span>'
);

// Description paragraph:
const oldDescRegex = /<p[^>]*id="i18n-intro-desc"[^>]*>[\s\S]*?<\/p>/;
const newDescHtml = `<p class="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium" id="i18n-intro-desc" style="color: #1E293B !important; font-size: 1.05rem !important; line-height: 1.6 !important; font-weight: 500 !important;">
                    Chào mừng bạn đến với không gian trưng bày hơn 252 đặc sản OCOP tiêu biểu từ 63 tỉnh thành Việt Nam. Dễ dàng tìm kiếm sản phẩm chuẩn 3–5 Sao, xem câu chuyện nguồn gốc và tra cứu địa chỉ cửa hàng chính hãng gần bạn nhất.
                </p>`;
html = html.replace(oldDescRegex, newDescHtml);

// 4 Trụ Cột (intro-pillars)
const oldPillarsRegex = /<div class="intro-pillars[\s\S]*?<!-- BANNER/;
const newPillarsHtml = `<div class="intro-pillars grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-3xl pt-1">
                <div class="intro-card-glass rounded-2xl p-3 sm:p-3.5 text-center cursor-default" style="background: #FFFFFF !important; border: 1.5px solid #7DD3FC !important; box-shadow: 0 6px 16px rgba(2, 132, 199, 0.08) !important;">
                    <div class="w-9 h-9 mx-auto rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-lg mb-1.5 shadow-sm">
                        <i class="fa-solid fa-map-location-dot"></i>
                    </div>
                    <span class="block text-xs font-black" style="color: #0C4A6E !important; font-weight: 800 !important; font-size: 0.95rem !important;" id="i18n-intro-pillar1">🗺️ Bản Đồ Điểm Bán 63 Tỉnh</span>
                    <span class="block text-[11px] font-medium mt-0.5" style="color: #334155 !important;" id="i18n-intro-pillar1-sub">Tra cứu địa chỉ cửa hàng & chỉ đường tận nơi.</span>
                </div>

                <div class="intro-card-glass rounded-2xl p-3 sm:p-3.5 text-center cursor-default" style="background: #FFFFFF !important; border: 1.5px solid #7DD3FC !important; box-shadow: 0 6px 16px rgba(2, 132, 199, 0.08) !important;">
                    <div class="w-9 h-9 mx-auto rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-1.5 shadow-sm">
                        <i class="fa-solid fa-seedling"></i>
                    </div>
                    <span class="block text-xs font-black" style="color: #0C4A6E !important; font-weight: 800 !important; font-size: 0.95rem !important;" id="i18n-intro-pillar2">🌾 Đặc Sản Vùng Miền Chính Hãng</span>
                    <span class="block text-[11px] font-medium mt-0.5" style="color: #334155 !important;" id="i18n-intro-pillar2-sub">100% sản phẩm đạt chứng nhận OCOP 3–5 Sao.</span>
                </div>

                <div class="intro-card-glass rounded-2xl p-3 sm:p-3.5 text-center cursor-default" style="background: #FFFFFF !important; border: 1.5px solid #7DD3FC !important; box-shadow: 0 6px 16px rgba(2, 132, 199, 0.08) !important;">
                    <div class="w-9 h-9 mx-auto rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg mb-1.5 shadow-sm">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <span class="block text-xs font-black" style="color: #0C4A6E !important; font-weight: 800 !important; font-size: 0.95rem !important;" id="i18n-intro-pillar3">🤖 Trợ Lý AI Tư Vấn 24/7</span>
                    <span class="block text-[11px] font-medium mt-0.5" style="color: #334155 !important;" id="i18n-intro-pillar3-sub">Gợi ý đặc sản phù hợp & kết nối CSKH trực tiếp.</span>
                </div>

                <div class="intro-card-glass rounded-2xl p-3 sm:p-3.5 text-center cursor-default" style="background: #FFFFFF !important; border: 1.5px solid #7DD3FC !important; box-shadow: 0 6px 16px rgba(2, 132, 199, 0.08) !important;">
                    <div class="w-9 h-9 mx-auto rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg mb-1.5 shadow-sm">
                        <i class="fa-solid fa-video"></i>
                    </div>
                    <span class="block text-xs font-black" style="color: #0C4A6E !important; font-weight: 800 !important; font-size: 0.95rem !important;" id="i18n-intro-pillar4">🎬 AI Quảng Bá Đa Kênh</span>
                    <span class="block text-[11px] font-medium mt-0.5" style="color: #334155 !important;" id="i18n-intro-pillar4-sub">Hỗ trợ tạo nội dung & video giới thiệu sản phẩm OCOP.</span>
                </div>
            </div>\n\n            <!-- BANNER`;

html = html.replace(oldPillarsRegex, newPillarsHtml);

// Thanh ngang màu vàng
const oldLuckyBoxRegex = /<div id="intro-lucky-card"[\s\S]*?<!-- BẢN ĐỒ/;
const newLuckyBoxHtml = `<div id="intro-lucky-card" class="lucky-golden-box w-full max-w-2xl rounded-3xl p-3.5 sm:p-4 text-center relative overflow-hidden transition-all duration-300" style="background: #FEF3C7 !important; border: 1.5px solid #F59E0B !important; box-shadow: 0 4px 16px rgba(245, 158, 11, 0.15) !important;">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div class="flex items-center space-x-3 text-left">
                        <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                            ⚡
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide" style="color: #0F172A !important;">⚡ BẠN LÀ CHỦ CỬA HÀNG / HỢP TÁC XÃ OCOP? • ĐĂNG KÝ ĐƯA SẢN PHẨM LÊN TRANG QUẢNG BÁ NGAY HÔM NAY</span>
                            </div>
                            <p class="text-[11px] text-slate-800 font-medium mt-0.5" style="color: #1E293B !important;">Đưa đặc sản địa phương tiếp cận hàng triệu khách hàng toàn quốc • Hỗ trợ số hóa điểm bán & AI truyền thông đa kênh miễn phí</p>
                        </div>
                    </div>
                    <button id="btn-draw-gift" onclick="openPartnerRegistrationModal()" class="intro-mega-btn w-full sm:w-auto flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-xs shadow-lg hover:scale-105 transition flex items-center justify-center space-x-2 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white border border-amber-600">
                        <span>📝 Đăng Ký Điểm Bán Ngay</span>
                    </button>
                </div>
            </div>\n\n            <!-- BẢN ĐỒ`;

html = html.replace(oldLuckyBoxRegex, newLuckyBoxHtml);

// E. Add Quick Province Chips in .intro-regions right before #province-map
const quickProvinceChipsHtml = `
                <!-- THẺ CHỌN NHANH TỈNH THÀNH OCOP TIÊU BIỂU -->
                <div class="intro-province-quick-chips flex flex-wrap items-center gap-1.5 py-1" style="display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 10px;">
                    <span style="font-size: 11px; font-weight: 800; color: #0C4A6E; margin-right: 4px;">📍 Chọn nhanh tỉnh:</span>
                    <button type="button" onclick="selectProvinceById('VN-39')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:scale-105" style="background: #0284C7; color: #FFFFFF; border: 1px solid #0369A1; font-weight: 800;">⭐ Đồng Nai (Chủ nhà)</button>
                    <button type="button" onclick="selectProvinceById('VN-HN')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Hà Nội</button>
                    <button type="button" onclick="selectProvinceById('VN-SG')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">TP.HCM</button>
                    <button type="button" onclick="selectProvinceById('VN-35')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Lâm Đồng</button>
                    <button type="button" onclick="selectProvinceById('VN-DN')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Đà Nẵng</button>
                    <button type="button" onclick="selectProvinceById('VN-01')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Lai Châu</button>
                    <button type="button" onclick="selectProvinceById('VN-05')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Sơn La</button>
                    <button type="button" onclick="selectProvinceById('VN-50')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Bến Tre</button>
                    <button type="button" onclick="selectProvinceById('VN-CT')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Cần Thơ</button>
                </div>
`;

if (!html.includes('intro-province-quick-chips')) {
    html = html.replace(
        '<div id="province-map" class="province-map"',
        quickProvinceChipsHtml + '\n                    <div id="province-map" class="province-map"'
    );
    console.log('✓ Added Quick Province Chips to .intro-regions');
}

// F. Fix initializeProvinceMap() retry logic if !window.L
const oldMapLeafletCheck = `            if (!window.L) {
                const mapErrMap = {
                    vi: 'Không tải được thư viện bản đồ. Vui lòng tải lại trang.',
                    en: 'The map library could not be loaded. Refresh the page to try again.',
                    zh: '无法加载地图库。请刷新页面重试。',
                    ko: '지도 라이브러리를 로드할 수 없습니다. 페이지를 새로고침하세요.',
                    ja: '地図ライブラリを読み込めませんでした。ページを再読み込みしてください。'
                };
                status.textContent = mapErrMap[currentLanguage] || mapErrMap.vi;
                console.error('Leaflet is unavailable; the province map could not be initialized.');
                return;
            }`;

const newMapLeafletCheck = `            if (!window.L) {
                console.warn('Leaflet is loading, retrying initializeProvinceMap in 250ms...');
                setTimeout(initializeProvinceMap, 250);
                return;
            }`;

if (html.includes('Leaflet is unavailable; the province map could not be initialized.')) {
    html = html.replace(oldMapLeafletCheck, newMapLeafletCheck);
    console.log('✓ Updated initializeProvinceMap() with dynamic Leaflet retry');
}

// G. Fix 4th feature box description in dictionary to "Bảo chứng chất lượng chuẩn 3–5 Sao Quốc gia"
html = html.replace(
    "vi: 'Tự động hóa tính toán doanh thu, tiền lời thực tế và chiết khấu CHM',",
    "vi: 'Bảo chứng chất lượng chuẩn 3–5 Sao Quốc gia',"
);
html = html.replace(
    "vi: 'Tự động hóa tính toán doanh thu, tiền lời thực tế và chiết khấu CHM'\n",
    "vi: 'Bảo chứng chất lượng chuẩn 3–5 Sao Quốc gia'\n"
);

// H. Fix product card template:
// Change description color from slate-300 to #334155
html = html.replace(
    'class="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">${productDescription}</p>',
    'class="text-xs line-clamp-2 leading-relaxed font-medium" style="color: #334155 !important; font-weight: 500 !important;">${productDescription}</p>'
);

// Change category tag badge from gold to ice blue
html = html.replace(
    'style="background: #FEF3C7 !important; color: #D97706 !important; border: 1px solid #FDE68A !important; font-weight: 700 !important;">\n                                    ${getLocalizedProductTag(p, currentLanguage)}',
    'style="background: #E0F2FE !important; color: #0369A1 !important; border: 1px solid #BAE6FD !important; font-weight: 800 !important;">\n                                    ${getLocalizedProductTag(p, currentLanguage)}'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Successfully updated index.html with all VIP fixes');
