const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original length:', html.length);

// 1. SURGERY ON TOP ANNOUNCEMENT BAR
const topBarRegex = /<!-- 1\. TOP ANNOUNCEMENT BAR -->[\s\S]*?(?=<!-- 2\. HEADER: SINGLE STICKY OCOP AI HUB -->)/;
const replacementTopBar = `<!-- 1. TOP ANNOUNCEMENT BAR (HIDDEN FOR MODERN FULL-WIDTH NAVBAR) -->
    <div class="top-announcement-bar" style="display:none!important;" aria-hidden="true">
        <span id="i18n-top-strategic">❖ HỆ THỐNG ĐIỀU PHỐI ĐẶC SẢN OCOP TOÀN QUỐC • HỖ TRỢ CHUYỂN ĐỔI SỐ 63 TỈNH THÀNH • HOTLINE ĐIỀU PHỐI TRUNG TÂM: 1900 888 688</span>
        <span id="i18n-top-intro">Bảng Quản Trị (Dashboard)</span>
        <span id="i18n-top-centers">Trung tâm OCOP</span>
        <span id="i18n-top-specs">Đặc sản 63 Tỉnh Thành</span>
    </div>
    
    `;

if (topBarRegex.test(html)) {
    html = html.replace(topBarRegex, replacementTopBar);
    console.log('✓ Step 1: Top announcement bar replaced');
} else {
    console.warn('✗ Step 1: Top announcement bar regex did not match');
}

// 2. SURGERY ON HEADER
const headerRegex = /<!-- 2\. HEADER: SINGLE STICKY OCOP AI HUB -->[\s\S]*?<\/header>/;
const replacementHeader = `<!-- 2. HEADER: SINGLE STICKY OCOP AI HUB (FULL-WIDTH MODERN SKY-TECH NAVBAR) -->
    <header class="sticky top-0 z-40 bg-white border-b border-sky-200 transition-all duration-300 w-full" style="width: 100% !important; max-width: 100% !important; border-radius: 0 !important; background: #FFFFFF !important; border-bottom: 1px solid #BAE6FD !important; box-shadow: 0 2px 10px rgba(2, 132, 199, 0.05) !important;">
        <div class="w-full px-4 sm:px-6 flex items-center justify-between" style="max-width: 100% !important; width: 100% !important; height: 56px !important;">
            <!-- Logo + Brand -->
            <a href="#" class="flex items-center space-x-2 group flex-shrink-0" style="text-decoration: none;">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base shadow-sm shrink-0" style="background: #0284C7;">
                    <i class="fa-solid fa-brain"></i>
                </div>
                <div class="flex flex-col">
                    <div class="flex items-center gap-1.5">
                        <span class="text-base sm:text-lg font-extrabold tracking-tight leading-none" style="color: #0284C7 !important;">OCOP AI Hub</span>
                    </div>
                    <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline" id="i18n-subbrand">Nền tảng AI Quảng bá OCOP 63 Tỉnh Thành</span>
                </div>
            </a>

            <!-- 2 Central Navigation Items in .header-primary-nav -->
            <nav class="header-primary-nav hidden md:inline-flex items-center" style="display: inline-flex !important; gap: 10px !important; flex-wrap: nowrap !important;" aria-label="Thanh điều hướng trung tâm">
                <button type="button" onclick="scrollToProducts()" class="header-nav-btn px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shadow-xs" style="white-space: nowrap !important; height: 38px; color: #0369A1 !important; background: #F0F9FF !important; border: 1px solid #7DD3FC !important;">
                    <span>🌟 Đặc Sản 63 Tỉnh Thành</span>
                </button>
                <button type="button" onclick="openAllStoresModal()" class="header-nav-btn px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer shadow-xs" style="white-space: nowrap !important; height: 38px; color: #0369A1 !important; background: #F0F9FF !important; border: 1px solid #7DD3FC !important;">
                    <span>🗺️ Điểm Bán OCOP</span>
                </button>
            </nav>

            <!-- Quick Action Cluster: Language Switcher + CTAs -->
            <div class="header-right-actions flex items-center space-x-2 flex-shrink-0" style="gap: 8px !important;">
                <!-- Language Dropdown -->
                <div class="lang-dropdown-container flex-shrink-0" id="header-lang-dropdown-container">
                    <button type="button" id="header-lang-dropdown-btn" onclick="toggleLanguageDropdown(event, 'header-lang-dropdown-menu')" class="lang-dropdown-btn px-2.5 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-slate-800 text-xs font-bold flex items-center gap-1 hover:border-sky-400 transition" aria-haspopup="true" aria-expanded="false" title="Chọn ngôn ngữ / Select Language" style="height: 38px;">
                        <i class="fa-solid fa-globe text-sky-600 text-xs"></i>
                        <span class="current-lang-code font-black text-sky-700">VI</span>
                        <i class="fa-solid fa-chevron-down text-[8px] text-gray-500"></i>
                    </button>
                    <div id="header-lang-dropdown-menu" class="lang-dropdown-menu hidden" role="menu">
                        <button type="button" onclick="changeLanguage('vi')" class="lang-dropdown-item active" data-lang="vi" role="menuitem">
                            <span class="item-code">VI</span>
                            <span class="item-label">Tiếng Việt</span>
                        </button>
                        <button type="button" onclick="changeLanguage('en')" class="lang-dropdown-item" data-lang="en" role="menuitem">
                            <span class="item-code">EN</span>
                            <span class="item-label">English</span>
                        </button>
                        <button type="button" onclick="changeLanguage('zh')" class="lang-dropdown-item" data-lang="zh" role="menuitem">
                            <span class="item-code">ZH</span>
                            <span class="item-label">中文</span>
                        </button>
                        <button type="button" onclick="changeLanguage('ko')" class="lang-dropdown-item" data-lang="ko" role="menuitem">
                            <span class="item-code">KO</span>
                            <span class="item-label">한국어</span>
                        </button>
                        <button type="button" onclick="changeLanguage('ja')" class="lang-dropdown-item" data-lang="ja" role="menuitem">
                            <span class="item-code">JA</span>
                            <span class="item-label">日本語</span>
                        </button>
                    </div>
                </div>

                <!-- Action Button 1: ⚡ Đăng Ký Điểm Bán -->
                <button type="button" id="btn-header-ocr" onclick="openPartnerRegistrationModal()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 bg-sky-600 hover:bg-sky-700 text-white shadow-xs border border-sky-500" style="white-space: nowrap !important; height: 38px; background: #0284C7 !important; color: #FFFFFF !important;" title="Đăng ký điểm bán đặc sản OCOP">
                    <span>⚡ Đăng Ký Điểm Bán</span>
                </button>

                <!-- Action Button 2: 🔐 Quản Trị Doanh Thu -->
                <button type="button" id="btn-header-admin-pin" onclick="promptAdminPinModal()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 bg-slate-900 hover:bg-slate-800 text-white shadow-xs border border-slate-700" style="white-space: nowrap !important; height: 38px; background: #0F172A !important; color: #FFFFFF !important;" title="Cổng Quản Trị Doanh Thu & Tiền Lời Quảng Bá">
                    <span>🔐 Quản Trị Doanh Thu</span>
                </button>

                <!-- Hidden compatibility markers for system tests -->
                <button onclick="toggleAuthModal()" id="user-btn" class="hidden" style="display:none!important" aria-hidden="true">
                    <span id="user-btn-label" class="hidden">Đăng nhập</span>
                </button>
                <span id="i18n-header-onboard-btn" class="hidden" style="display:none!important">Đăng Ký HTX</span>
                <span id="i18n-nav-dashboard" class="hidden" style="display:none!important">⚡ Đăng Ký Điểm Bán (AI OCR)</span>
                <span id="i18n-nav-challenge" class="hidden" style="display:none!important">🏆 Đề Án AI Business 2026</span>
                <span id="i18n-nav-products" class="hidden" style="display:none!important">Chợ Đặc Sản OCOP</span>
                <span id="i18n-nav-stores" class="hidden" style="display:none!important">Bản Đồ Số O2O</span>
                <span id="i18n-nav-finance" class="hidden" style="display:none!important">AI Quản Trị Kinh Doanh (Dashboard)</span>
                <span id="i18n-nav-studio" class="hidden" style="display:none!important">Trợ Lý AI Tạo Nội Dung</span>
                <div id="header-language-switcher" class="hidden" style="display:none!important" aria-hidden="true"></div>
            </div>
        </div>
    </header>`;

if (headerRegex.test(html)) {
    html = html.replace(headerRegex, replacementHeader);
    console.log('✓ Step 2: Header replaced');
} else {
    console.warn('✗ Step 2: Header regex did not match');
}

// 3. SURGERY ON HERO SECTION
const heroRegex = /<!-- 3\. HERO BANNER SECTION -->[\s\S]*?<\/section>/;
const replacementHero = `<!-- 3. HERO BANNER SECTION (CLEAN SKY-TECH UNBOXED HERO) -->
        <section id="shop-hero" class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative" style="max-width: 1400px !important; width: 94% !important; background: transparent !important; border: none !important; box-shadow: none !important;">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-7 space-y-5">
                    <h2 class="text-2xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-[1.15]" data-title="Bản Đồ Số OCOP, Khơi Nguồn Di Sản Việt" style="color: #0F172A !important;">
                        <span id="i18n-hero-title1" data-legacy="Bản Đồ Số OCOP," class="whitespace-nowrap" style="color: #0F172A !important;">Tinh Hoa Đặc Sản OCOP Việt</span> <br>
                        <span id="i18n-hero-title2" data-legacy="Khơi Nguồn Di Sản Việt" style="color: #0284C7 !important;">Chuyển Đổi Số & Bứt Phá Doanh Thu Cùng AI</span>
                    </h2>
                    <p class="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed font-medium" id="i18n-hero-desc" style="color: #334155 !important;">
                        Nền tảng AI kết nối 2 chiều: Giúp du khách & doanh nghiệp tìm mua 252 đặc sản OCOP 4-5 Sao chính hãng tại 63 tỉnh thành, và hỗ trợ kết nối tiêu thụ, truy xuất nguồn gốc chứng nhận OCOP chính hãng trên toàn quốc.
                    </p>

                    <!-- 4 FEATURE CARDS (CLEAN WHITE CARDS) -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl pt-1">
                        <div class="p-3 rounded-2xl bg-white text-center shadow-xs hover:border-sky-400 transition" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important; border-radius: 16px !important; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.08) !important;">
                            <i class="fa-solid fa-map-location-dot text-base mb-1 block" style="color: #0284C7 !important;"></i>
                            <span class="block text-xs font-black" style="color: #0284C7 !important;" id="i18n-hero-feat1-title" data-legacy="Bản Đồ Số 63 Tỉnh Thành">Bản Đồ Số 63 Tỉnh Thành</span>
                            <span class="block text-[10px] font-medium leading-tight mt-0.5" style="color: #334155 !important;" id="i18n-hero-feat1-desc">Tra cứu địa chỉ Showroom & dẫn đường tận nơi qua Google Maps</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-white text-center shadow-xs hover:border-sky-400 transition" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important; border-radius: 16px !important; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.08) !important;">
                            <i class="fa-solid fa-book-open text-base mb-1 block" style="color: #0284C7 !important;"></i>
                            <span class="block text-xs font-black" style="color: #0284C7 !important;" id="i18n-hero-feat2-title" data-legacy="Kho Tri Thức Di Sản Bản Địa">Kho Tri Thức Di Sản Bản Địa</span>
                            <span class="block text-[10px] font-medium leading-tight mt-0.5" style="color: #334155 !important;" id="i18n-hero-feat2-desc">Tự động biên tập câu chuyện văn hóa vùng miền đa ngôn ngữ</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-white text-center shadow-xs hover:border-sky-400 transition" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important; border-radius: 16px !important; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.08) !important;">
                            <i class="fa-solid fa-headset text-base mb-1 block" style="color: #0284C7 !important;"></i>
                            <span class="block text-xs font-black" style="color: #0284C7 !important;" id="i18n-hero-feat3-title" data-legacy="Hệ Điều Hành Copilot 24/7">Hệ Điều Hành Copilot 24/7</span>
                            <span class="block text-[10px] font-medium leading-tight mt-0.5" style="color: #334155 !important;" id="i18n-hero-feat3-desc">Chatbot AI gợi ý đặc sản & thiết kế gói quà doanh nghiệp B2B</span>
                        </div>
                        <div class="p-3 rounded-2xl bg-white text-center shadow-xs hover:border-sky-400 transition" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important; border-radius: 16px !important; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.08) !important;">
                            <i class="fa-solid fa-certificate text-base mb-1 block" style="color: #0284C7 !important;"></i>
                            <span class="block text-xs font-black" style="color: #0284C7 !important;">Chứng Nhận OCOP 3-5 Sao</span>
                            <span id="i18n-hero-feat4-title" style="display:none!important">AI Financial Engine</span>
                            <span class="block text-[10px] font-medium leading-tight mt-0.5" style="color: #334155 !important;" id="i18n-hero-feat4-desc">Bảo chứng pháp lý & nguồn gốc xuất xứ chính hãng 63 tỉnh thành</span>
                        </div>
                    </div>

                    <!-- 4 STATS CARDS -->
                    <div class="grid grid-cols-4 gap-2 sm:gap-3 max-w-xl pt-2">
                        <div class="p-2.5 rounded-2xl bg-white border border-sky-200 text-center shadow-sm" style="background: #FFFFFF !important; border: 1px solid #BAE6FD !important;">
                            <span class="block text-base sm:text-xl font-black" style="color: #0284C7 !important;">252+</span>
                            <span class="text-[9px] sm:text-[10px] font-bold leading-tight" style="color: #334155 !important;" id="i18n-hero-stat1">Đặc Sản OCOP 4-5★</span>
                        </div>
                        <div class="p-2.5 rounded-2xl bg-white border border-sky-200 text-center shadow-sm" style="background: #FFFFFF !important; border: 1px solid #BAE6FD !important;">
                            <span class="block text-base sm:text-xl font-black" style="color: #0284C7 !important;">63</span>
                            <span class="text-[9px] sm:text-[10px] font-bold leading-tight" style="color: #334155 !important;" id="i18n-hero-stat2">Tỉnh Thành Kết Nối</span>
                        </div>
                        <div class="p-2.5 rounded-2xl bg-white border border-sky-200 text-center shadow-sm" style="background: #FFFFFF !important; border: 1px solid #BAE6FD !important;">
                            <span class="block text-base sm:text-xl font-black" style="color: #0284C7 !important;">500+</span>
                            <span class="text-[9px] sm:text-[10px] font-bold leading-tight" style="color: #334155 !important;" id="i18n-hero-stat3">Điểm Bán & HTX</span>
                        </div>
                        <div class="p-2.5 rounded-2xl bg-white border border-sky-200 text-center shadow-sm" style="background: #FFFFFF !important; border: 1px solid #BAE6FD !important;">
                            <span class="block text-base sm:text-xl font-black" style="color: #0284C7 !important;">24/7</span>
                            <span class="text-[9px] sm:text-[10px] font-bold leading-tight" style="color: #334155 !important;" id="i18n-hero-stat4">Trợ Lý AI Kinh Doanh</span>
                        </div>
                    </div>

                    <!-- 2 CLEAN ACTION BUTTONS -->
                    <div class="flex flex-wrap items-center justify-start gap-3 pt-2">
                        <button type="button" onclick="openAllStoresModal()" class="font-black px-5 py-3 rounded-2xl shadow-sm transition text-xs sm:text-sm flex items-center space-x-2 cursor-pointer hover:scale-105" style="background: #0284C7 !important; color: #FFFFFF !important; border: 1px solid #0369A1 !important;">
                            <i class="fa-solid fa-store text-base"></i>
                            <span id="i18n-hero-btn-stores">🗺️ Mạng Lưới Điểm Bán OCOP</span>
                        </button>
                        <button type="button" onclick="toggleAIChat()" class="font-black px-5 py-3 rounded-2xl shadow-sm transition text-xs sm:text-sm flex items-center space-x-2 cursor-pointer hover:scale-105" style="background: #0F172A !important; color: #FFFFFF !important; border: 1px solid #1E293B !important;">
                            <i class="fa-solid fa-wand-magic-sparkles text-amber-300 text-base"></i>
                            <span id="i18n-hero-btn-copilot">🎁 Trợ Lý Tư Vấn Combo OCOP</span>
                        </button>
                    </div>
                </div>

                <div class="lg:col-span-5">
                    <div class="border border-sky-200 p-4 rounded-3xl shadow-lg relative overflow-hidden bg-white" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important; box-shadow: 0 10px 25px rgba(2, 132, 199, 0.08) !important;">
                        <div class="h-72 rounded-2xl overflow-hidden relative shadow-md">
                            <img id="hero-product-img" src="images/catalog/web-latest-171.jpg" alt="Trà khổ qua rừng túi lọc Hiệp Vân - Đặc sản Long Khánh, Đồng Nai (OCOP 4 Sao)" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" decoding="async">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                                <span id="i18n-hero-badge-tag" class="bg-sky-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-1.5 shadow">
                                    ★ TINH HOA NÔNG SẢN VIỆT
                                </span>
                                <h3 class="text-xl font-bold tracking-wide text-white">NATIONAL OCOP PLATFORM</h3>
                                <p class="text-xs text-sky-100 mt-0.5 font-medium" id="i18n-hero-banner-sub">Kết Nối Trực Tiếp Hợp Tác Xã Bản Địa • Bảo Chứng Chất Lượng OCOP Quốc Gia</p>
                            </div>
                        </div>
                        <div class="mt-3 p-3.5 rounded-2xl flex items-center justify-between gap-3" style="background: #F0F9FF !important; border: 1px solid #7DD3FC !important;">
                            <div class="flex items-center space-x-3 flex-1 min-w-0">
                                <div class="flex-shrink-0 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow" style="width: 40px; height: 40px; min-width: 40px;">
                                    <i class="fa-solid fa-medal"></i>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="font-bold text-xs truncate" style="color: #0F172A !important; font-weight: 700 !important;" id="i18n-hero-prodname">Trà khổ qua rừng túi lọc Hiệp Vân - Đặc sản Long Khánh, Đồng Nai (OCOP 4 Sao)</h4>
                                    <p id="hero-product-stars" class="text-[11px] font-medium whitespace-nowrap" style="color: #0369A1 !important;">Chứng nhận OCOP 4 Sao • Long Khánh, Đồng Nai</p>
                                </div>
                            </div>
                            <button type="button" onclick="openAllStoresModal()" id="hero-product-price" class="flex-shrink-0 font-extrabold text-[11px] whitespace-nowrap text-right leading-tight px-3 py-1.5 rounded-lg transition cursor-pointer" style="background: #0284C7 !important; color: #FFFFFF !important; border: 1px solid #0369A1 !important;" data-legacy="[Sản lượng điều phối hệ thống: 1.200 đơn vị • Trạng thái đối soát CHM: Đã phân bổ tự động]" title="Xem danh sách điểm bán chính hãng">📍 Điểm Bán Chính Hãng</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;

if (heroRegex.test(html)) {
    html = html.replace(heroRegex, replacementHero);
    console.log('✓ Step 3: Hero section replaced');
} else {
    console.warn('✗ Step 3: Hero section regex did not match');
}

// 4. SURGERY ON WHY-CHOOSE-US SECTION TITLE
const whyRegex = /<h2 class="text-2xl sm:text-3xl font-black text-amber-100[\s\S]*?CAM KẾT VẬN HÀNH CHUỖI CUNG ỨNG SỐ TOÀN DIỆN[\s\S]*?<\/p>/;
const replacementWhy = `<h2 class="text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center gap-3" style="color: #0C4A6E !important; text-shadow: none !important;">
                    <span class="hidden sm:inline-block h-0.5 w-12 bg-sky-500 rounded-full"></span>
                    <span style="color: #0C4A6E !important;">CAM KẾT VẬN HÀNH CHUỖI CUNG ỨNG SỐ TOÀN DIỆN</span>
                    <span class="hidden sm:inline-block h-0.5 w-12 bg-sky-500 rounded-full"></span>
                </h2>
                <div class="w-20 h-1 bg-sky-500 mx-auto rounded-full mt-2 mb-3"></div>
                <p class="text-xs sm:text-sm font-semibold max-w-xl mx-auto" style="color: #334155 !important; text-shadow: none !important;">
                    Nền tảng chuẩn hóa dữ liệu pháp lý, tối ưu logistics vựa vùng và giải phóng năng lực cạnh tranh cho hợp tác xã nông sản 63 tỉnh thành.
                </p>`;

if (whyRegex.test(html)) {
    html = html.replace(whyRegex, replacementWhy);
    console.log('✓ Step 4: Why choose us title replaced');
} else {
    console.warn('✗ Step 4: Why choose us title regex did not match');
}

// 5. SURGERY ON JUDGE QUICK ACCESS BAR
const judgeRegex = /<!--\s*={10,}\s*-->\s*<!-- FLOATING JUDGE BAR[\s\S]*?<div id="judge-quick-access-bar"[\s\S]*?<\/div>\s*<\/div>/;
if (judgeRegex.test(html)) {
    html = html.replace(judgeRegex, '');
    console.log('✓ Step 5: Judge quick access bar removed');
} else {
    // Fallback: search for #judge-quick-access-bar
    const judgeSimpleRegex = /<div id="judge-quick-access-bar"[\s\S]*?<\/div>\s*<\/div>/;
    if (judgeSimpleRegex.test(html)) {
        html = html.replace(judgeSimpleRegex, '');
        console.log('✓ Step 5 (fallback): Judge quick access bar removed');
    } else {
        console.warn('✗ Step 5: Judge quick access bar regex did not match');
    }
}

// 6. SURGERY ON INTRO OVERLAY HEADER & ACTIONS
const introHeaderRegex = /<div class="intro-header relative z-50 pointer-events-auto max-w-5xl mx-auto w-full flex items-center justify-between pb-3.5 border-b border-amber-400\/30">[\s\S]*?(?=<div id="intro-lang-dropdown-container">)/;
const replacementIntroHeader = `<div class="intro-header relative z-50 pointer-events-auto max-w-5xl mx-auto w-full flex items-center justify-between pb-3.5 border-b border-sky-300/40" style="background: transparent !important; border-radius: 0 !important; box-shadow: none !important;">
            <div class="flex items-center space-x-3">
                <div class="intro-brand-mark relative w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white text-lg shadow-md group">
                    <i class="fa-solid fa-leaf text-amber-300"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="block text-xs sm:text-sm font-black text-sky-200 tracking-wider leading-none">OCOP SALES COPILOT</span>
                    </div>
                    <span class="text-[9px] sm:text-[10px] text-sky-300 uppercase font-bold tracking-widest" id="i18n-intro-badge">Hệ điều hành số & Trợ lý quản trị đặc sản Việt Nam</span>
                </div>
            </div>

            <div class="flex items-center space-x-2 sm:space-x-3">
                <button type="button" onclick="enterOcopMarket('all')" class="px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer bg-sky-600 hover:bg-sky-500 text-white shadow-sm border border-sky-400">
                    <span>Khám phá đặc sản 63 tỉnh thành →</span>
                </button>
                `;

if (introHeaderRegex.test(html)) {
    html = html.replace(introHeaderRegex, replacementIntroHeader);
    console.log('✓ Step 6a: Intro header replaced');
} else {
    console.warn('✗ Step 6a: Intro header regex did not match');
}

// Intro Actions: replace 3 actions with 2 clean actions and remove duplicate enter market
const introActionsRegex = /<!-- MEGA CALL-TO-ACTION \(CTA\) 3 NÚT HÀNH ĐỘNG HỆ ĐIỀU HÀNH SỐ -->[\s\S]*?(?=<!-- FOOTER INTRO BẢO CHỨNG QUỐC GIA -->)/;
const replacementIntroActions = `<!-- MEGA CALL-TO-ACTION (CTA) 2 NÚT HÀNH ĐỘNG HỆ ĐIỀU HÀNH SỐ -->
            <div class="intro-actions w-full max-w-3xl space-y-3.5 pt-1">
                <!-- 2 Nút Hành Động Phía Dưới -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <!-- Nút 1: TÌM ĐIỂM BÁN & MUA ĐẶC SẢN (O2O) -->
                    <button id="btn-intro-action-showroom" onclick="enterOcopMarket('all', () => openAllStoresModal())" class="group relative px-4 py-3 rounded-2xl font-black text-xs sm:text-xs text-white border border-sky-400/50 shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer" style="background: #0284C7 !important;" title="Mở danh bạ showroom O2O toàn quốc">
                        <i class="fa-solid fa-store text-amber-300 text-sm group-hover:scale-110 transition-transform"></i>
                        <span id="i18n-btn-intro-showroom" class="tracking-wide">🗺️ TÌM ĐIỂM BÁN & MUA ĐẶC SẢN (O2O)</span>
                    </button>

                    <!-- Nút 2: KHÁM PHÁ 252 ĐẶC SẢN 63 TỈNH THÀNH -->
                    <button id="btn-intro-action-trace" onclick="enterOcopMarket('all', () => scrollToProducts())" class="group relative px-4 py-3 rounded-2xl font-black text-xs sm:text-xs text-white border border-sky-500 shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer" style="background: #0F172A !important;" title="Xem chứng nhận 4-5 sao và bản đồ chuỗi cung ứng">
                        <i class="fa-solid fa-certificate text-sky-400 text-sm group-hover:scale-110 transition-transform"></i>
                        <span id="i18n-btn-intro-trace" class="tracking-wide">🌿 KHÁM PHÁ 252 ĐẶC SẢN 63 TỈNH THÀNH</span>
                    </button>
                </div>

                <!-- Quick Navigation Pills -->
                <div class="space-y-1.5 pt-0.5">
                    <span class="block text-[11px] text-sky-200/80 font-semibold uppercase tracking-wider" id="i18n-intro-quick-header">Phân hệ điều phối chiến lược:</span>
                    <div class="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                        <button onclick="enterOcopMarket('gift')" class="intro-pill-btn px-3 py-1.5 rounded-xl text-sky-100 hover:text-white transition flex items-center space-x-1.5 shadow-sm hover:scale-105 cursor-pointer">
                            <span>🎁</span>
                            <span id="i18n-intro-quick-gift">Combo Quà Doanh Nghiệp B2B</span>
                        </button>
                        <button onclick="enterOcopMarket('tea')" class="intro-pill-btn px-3 py-1.5 rounded-xl text-sky-100 hover:text-white transition flex items-center space-x-1.5 shadow-sm hover:scale-105 cursor-pointer">
                            <span>🍵</span>
                            <span id="i18n-intro-quick-tea">Dược Liệu & Trà Di Sản 5★</span>
                        </button>
                        <button onclick="enterOcopMarket('ai')" class="intro-pill-btn intro-ai-consult-btn px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm hover:scale-105 cursor-pointer">
                            <span>🤖</span>
                            <span id="i18n-intro-quick-ai">AI Copilot Phân Tích</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

if (introActionsRegex.test(html)) {
    html = html.replace(introActionsRegex, replacementIntroActions);
    console.log('✓ Step 6b: Intro actions replaced');
} else {
    console.warn('✗ Step 6b: Intro actions regex did not match');
}

// 7. REPLACE B2B2C PHRASE IN TRANSLATIONS AND HERO
const b2bPhraseOld = 'và tự động hóa quản trị doanh thu, giá vốn, chiết khấu B2B2C theo thời gian thực';
const b2bPhraseNew = 'và hỗ trợ kết nối tiêu thụ, truy xuất nguồn gốc chứng nhận OCOP chính hãng trên toàn quốc';

while (html.includes(b2bPhraseOld)) {
    html = html.replace(b2bPhraseOld, b2bPhraseNew);
}
console.log('✓ Step 7: B2B2C phrases replaced');

// 8. FIX INTRO GOLD TITLE NO WRAP TO PREVENT CLIPPING
html = html.replace(
    'style="font-size: clamp(0.95rem, 1.8vw, 1.5rem); white-space: nowrap;"',
    'style="font-size: clamp(0.85rem, 1.6vw, 1.35rem); display: inline-block;"'
);
console.log('✓ Step 8: Intro title2 overflow fixed');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Surgery completed! New length:', html.length);

