const fs = require('fs');

console.log('=== INTEGRATING AI TIKTOK MARKETING SUITE & 2-TAB ADMIN DASHBOARD ===');

// =========================================================================
// 1. UPDATE skytech-complete.css
// =========================================================================
let css = fs.readFileSync('skytech-complete.css', 'utf8');

const tiktokStyles = `
/* ==========================================================================
   ADMIN DASHBOARD 2-TAB SUITE & AI TIKTOK GENERATOR (2026 EDITION)
   ========================================================================== */
.admin-tab-bar {
    display: flex !important;
    gap: 10px !important;
    padding: 14px 18px !important;
    background: #F8FAFC !important;
    border-bottom: 2px solid #BAE6FD !important;
    align-items: center !important;
    justify-content: flex-start !important;
    flex-wrap: wrap !important;
}

.admin-tab-btn {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 10px 20px !important;
    border-radius: 14px !important;
    font-weight: 800 !important;
    font-size: 13px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    border: 1.5px solid #BAE6FD !important;
    background: #FFFFFF !important;
    color: #0369A1 !important;
}

.admin-tab-btn.active {
    background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;
    color: #FFFFFF !important;
    border-color: #0284C7 !important;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3) !important;
}

.admin-tab-btn:hover:not(.active) {
    background: #F0F9FF !important;
    border-color: #7DD3FC !important;
}

#admin-tab-tiktok-content {
    background: #F8FAFC !important;
    color: #0F172A !important;
}

.tiktok-input, .tiktok-select, .tiktok-textarea {
    width: 100% !important;
    background: #FFFFFF !important;
    border: 1.5px solid #BAE6FD !important;
    border-radius: 12px !important;
    padding: 10px 14px !important;
    color: #0F172A !important;
    font-size: 13px !important;
    outline: none !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
    box-sizing: border-box !important;
}

.tiktok-input:focus, .tiktok-select:focus, .tiktok-textarea:focus {
    border-color: #0284C7 !important;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15) !important;
}

.tiktok-phone-mockup {
    width: 280px !important;
    height: 500px !important;
    margin: 0 auto !important;
    border-radius: 36px !important;
    border: 8px solid #0F172A !important;
    background: #000000 !important;
    position: relative !important;
    box-shadow: 0 25px 50px -12px rgba(2, 132, 199, 0.35) !important;
    overflow: hidden !important;
}

.tiktok-phone-island {
    position: absolute !important;
    top: 6px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: 70px !important;
    height: 14px !important;
    background: #0F172A !important;
    border-radius: 999px !important;
    z-index: 25 !important;
}
`;

if (!css.includes('ADMIN DASHBOARD 2-TAB SUITE & AI TIKTOK GENERATOR')) {
    css += '\n' + tiktokStyles;
    fs.writeFileSync('skytech-complete.css', css, 'utf8');
    console.log('✓ Added TikTok styles to skytech-complete.css');
} else {
    console.log('• skytech-complete.css already contains TikTok styles');
}

// =========================================================================
// 2. UPDATE skytech-complete.js
// =========================================================================
let js = fs.readFileSync('skytech-complete.js', 'utf8');

// The code for TikTok Generator Engine and 2-Tab Switcher
const tiktokEngineCode = `
    // =========================================================================
    // 6. AI TIKTOK MARKETING & TRAFFIC ENGINE (ADMIN TAB 2)
    // =========================================================================
    let tiktokAnimFrameId = null;
    let isTikTokPlaying = false;
    let tiktokCurrentFrame = 0;
    const tiktokTotalFrames = 300; // 10 seconds at 30fps
    let tiktokProductImage = null;
    let tiktokCurrentProduct = null;
    let tiktokCurrentStyle = 'viral';
    let tiktokAutoCaptions = [];
    let tiktokMediaRecorder = null;
    let tiktokRecordedChunks = [];

    // Fallback list of key Dong Nai & nationwide specialties
    const featuredSpecialties = [
        { id: 'dn-hiepvan', name: 'Trà khổ qua rừng túi lọc Hiệp Vân (Đồng Nai)', region: 'Đồng Nai', stars: 5, price: 68000, img: 'images/catalog/web-latest-1.jpg', tag: 'Thanh nhiệt, hạ đường huyết, chuẩn OCOP 5 Sao' },
        { id: 'dn-tantrieu', name: 'Bưởi đường lá cam Tân Triều (Đồng Nai)', region: 'Đồng Nai', stars: 5, price: 85000, img: 'images/catalog/web-latest-2.jpg', tag: 'Mọng nước, ngọt thanh, tiến vua danh tiếng' },
        { id: 'dn-ngabien', name: 'Hạt điều rang muối vỏ lụa Nga Biên (Đồng Nai)', region: 'Đồng Nai', stars: 5, price: 165000, img: 'images/catalog/customer-search-3.jpg', tag: 'Giòn béo thơm lừng, xuất khẩu chuẩn OCOP' },
        { id: 'dn-trongduc', name: 'Bột Cacao nguyên chất Trọng Đức (Đồng Nai)', region: 'Đồng Nai', stars: 5, price: 120000, img: 'images/catalog/web-latest-4.jpg', tag: 'Đậm đà thuần khiết, giàu chất chống oxy hóa' },
        { id: 'dn-nhontrach', name: 'Trà sen Nhơn Trạch (Đặc sản Đồng Nai)', region: 'Đồng Nai', stars: 4, price: 95000, img: 'images/catalog/web-latest-5.jpg', tag: 'Hương sen tự nhiên, thư giãn an thần' }
    ];

    function getAllAvailableProducts() {
        const list = [...featuredSpecialties];
        const existing = (window.products && window.products.length > 0) ? window.products : (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
        existing.forEach(p => {
            if (!list.some(item => item.name.toLowerCase() === p.name.toLowerCase())) {
                list.push({
                    id: p.id,
                    name: p.name,
                    region: p.region || 'Việt Nam',
                    stars: p.stars || 5,
                    price: p.price || 150000,
                    img: p.img || 'images/catalog/web-latest-1.jpg',
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

        const bodyContainer = modal.querySelector('.p-4.sm\\:p-6.space-y-6') || modal.querySelector('.p-4.sm\\:p-6') || modal.querySelector('.space-y-6');
        if (!bodyContainer) return;

        // If tabs are already installed, return
        if (document.getElementById('admin-modal-tab-bar')) return;

        // 1. Create Tab Bar
        const tabBar = document.createElement('div');
        tabBar.id = 'admin-modal-tab-bar';
        tabBar.className = 'admin-tab-bar';
        tabBar.innerHTML = \`
            <button type="button" id="btn-admin-tab-revenue" class="admin-tab-btn active" onclick="switchAdminTab('revenue')">
                <i class="fa-solid fa-chart-line text-amber-300"></i>
                <span>📊 Quản Trị Doanh Thu & Tiền Lời Quảng Bá</span>
            </button>
            <button type="button" id="btn-admin-tab-tiktok" class="admin-tab-btn" onclick="switchAdminTab('tiktok')">
                <i class="fa-brands fa-tiktok text-rose-500"></i>
                <span>🎬 AI Tạo Nội Dung & Video TikTok Quảng Bá OCOP</span>
                <span style="font-size: 10px; background: #FEF08A; color: #854D0E; font-weight: 900; padding: 2px 7px; border-radius: 999px; text-transform: uppercase;">Mới 2026</span>
            </button>
        \`;

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
        tikContent.innerHTML = \`
            <!-- Top Banner -->
            <div class="p-4 rounded-2xl border border-sky-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFFFFF;">
                <div>
                    <div class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                        <span>AI TIKTOK MARKETING & TRAFFIC ENGINE • DIGITALFEST 2026</span>
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
                    <div class="tiktok-phone-mockup">
                        <div class="tiktok-phone-island"></div>
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
        \`;

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
                opt.textContent = \`\${p.name} (\${p.region}) - OCOP \${p.stars} Sao\`;
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
        const regionTag = pRegion.replace(/\\s+/g, '');

        let caption = '';
        let script = '';

        if (style === 'viral') {
            caption = \`🔥 REVIEW CỰC PHẨM: \${pName} (\${pRegion}) đạt chuẩn OCOP \${pStars} Sao \${starStr}!\n\n😱 Không ngờ hương vị lại xuất sắc đến thế này! Tuyển chọn thủ công 100%, giữ trọn vẹn tinh hoa đất trời \${pRegion}. Hàng ngàn thực khách đã trải nghiệm và mê mẩn, giá chỉ từ \${pPrice}.\n\n👉 Xem ngay điểm bán chính hãng và bản đồ showroom tại LINK BIO!\n\n#OCOPVietNam #DacSan63Tinh #OCOP\${regionTag} #DigitalFest2026 #ReviewDacSan #TikTokMadeMeBuyIt #AmThucViet\`;

            script = \`[00:00 - 00:04] Nếu bạn chưa từng thử qua \${pName} của vùng đất \${pRegion}...\n[00:04 - 00:08] Thì chắc chắn bạn đã bỏ lỡ một kiệt tác ẩm thực đạt chuẩn OCOP \${pStars} Sao!\n[00:08 - 00:13] 100% nguyên liệu tự nhiên tinh khiết, chuẩn an toàn vệ sinh thực phẩm quốc gia.\n[00:13 - 00:20] 👉 Nhấp ngay vào đường link Bio ở đầu kênh để mở Bản Đồ Số OCOP AI Hub tìm điểm bán chính hãng gần bạn nhất nhé!\`;

            tiktokAutoCaptions = [
                "🔥 REVIEW ĐẶC SẢN OCOP",
                \`\${pName.toUpperCase()}\`,
                \`⭐ ĐẠT CHUẨN OCOP \${pStars} SAO QUỐC GIA\`,
                "🌿 100% NGUYÊN LIỆU TỰ NHIÊN",
                "👉 NHẤP VÀO BIO ĐỂ MỞ BẢN ĐỒ!"
            ];
        } else if (style === 'origin') {
            caption = \`🏡 HÀNH TRÌNH DI SẢN: Câu chuyện đằng sau \${pName} (\${pRegion}) 🌿\n\nTừ đôi bàn tay cần lao của bà con nông dân và Hợp tác xã tại \${pRegion}, mỗi hộp \${pName} là sự kết tinh của tình yêu quê hương và quy trình OCOP \${pStars} Sao nghiêm ngặt.\n\n❤️ Hãy chung tay cùng OCOP AI Hub tôn vinh nông sản Việt!\n👉 Mở Bản Đồ Số OCOP trên link Bio để tìm showroom gần nhất ủng hộ bà con nhé!\n\n#OCOPVietNam #DacSan63Tinh #CauChuyenOCOP #OCOP\${regionTag} #DigitalFest2026 #NongSanViet #TuHaoHangViet\`;

            script = \`[00:00 - 00:05] Đằng sau mỗi hộp \${pName} là giọt mồ hôi và tâm huyết của bà con nông dân \${pRegion}.\n[00:05 - 00:10] Trải qua bao quy trình khắt khe để đạt chứng nhận OCOP \${pStars} Sao danh giá.\n[00:10 - 00:15] Vừa thơm ngon, vừa đậm đà bản sắc văn hóa cội nguồn.\n[00:15 - 00:20] 👉 Mở ngay Bản Đồ OCOP AI Hub tại link Bio để tìm showroom chính hãng gần bạn nhất!\`;

            tiktokAutoCaptions = [
                "🏡 HÀNH TRÌNH DI SẢN OCOP",
                \`🌿 TINH HOA \${pRegion.toUpperCase()}\`,
                \`\${pName.toUpperCase()}\`,
                \`⭐ CHỨNG NHẬN OCOP \${pStars} SAO\`,
                "👉 MUA CHÍNH HÃNG TẠI LINK BIO!"
            ];
        } else {
            caption = \`🎁 GỢI Ý QUÀ BIẾU THƯỢNG HẠNG: \${pName} (\${pRegion}) 🌟\n\nBạn đang tìm món quà sức khỏe, sang trọng và đậm đà bản sắc? \${pName} OCOP \${pStars} Sao \${starStr} chính là câu trả lời hoàn hảo! Đóng gói tinh tế, tem truy xuất nguồn gốc QR code OCOP minh bạch.\n\n👉 Bấm ngay vào link Bio để mở Bản Đồ Số OCOP AI Hub đặt hàng và nhận ưu đãi kết nối O2O ngay hôm nay!\n\n#OCOPVietNam #DacSan63Tinh #QuaTangOCOP #OCOP\${regionTag} #DigitalFest2026 #QuaBieuDoanhNghiep #OCOP\`;

            script = \`[00:00 - 00:04] Cần tìm một món quà biếu sức khỏe vừa sang trọng, vừa ý nghĩa?\n[00:04 - 00:09] Đừng bỏ qua \${pName} — Đặc sản nức tiếng vùng đất \${pRegion}!\n[00:09 - 00:14] Chuẩn OCOP \${pStars} Sao, có tem truy xuất QR code minh bạch và bao bì cao cấp.\n[00:14 - 00:20] 👉 Truy cập ngay link Bio ở trang chủ để mở Bản Đồ OCOP tìm điểm bán gần bạn nhất!\`;

            tiktokAutoCaptions = [
                "🎁 QUÀ BIẾU OCOP THƯỢNG HẠNG",
                \`\${pName.toUpperCase()}\`,
                \`📍 ĐẶC SẢN \${pRegion.toUpperCase()}\`,
                \`⭐ OCOP \${pStars} SAO • TEM QR CHỐNG GIẢ\`,
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
        const full = \`=== CAPTION ĐĂNG TIKTOK ===\\n\${cap}\\n\\n=== KỊCH BẢN LỜI THOẠI ===\\n\${scr}\`;

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
    function drawTikTokCanvasFrame() {
        const canvas = document.getElementById('tiktok-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;  // 540
        const H = canvas.height; // 960
        const frame = tiktokCurrentFrame;
        const time = (frame % tiktokTotalFrames) / 30; // 0 to 10 seconds
        const p = tiktokCurrentProduct || featuredSpecialties[0];

        // 1. DYNAMIC ROYAL BLUE GRADIENT BACKGROUND
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#0369A1');
        bgGrad.addColorStop(0.35, '#0284C7');
        bgGrad.addColorStop(0.7, '#0C4A6E');
        bgGrad.addColorStop(1, '#082F49');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // 2. AMBIENT SPARKLES / PARTICLES
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 28; i++) {
            const px = (Math.sin(i * 99 + time * 0.5) * 0.5 + 0.5) * W;
            const py = ((i * 37 - time * 45) % H + H) % H;
            const size = 1.5 + (i % 3);
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. TOP PILL BADGE: LIVE / OCOP 63 TỈNH THÀNH
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.beginPath();
        ctx.roundRect(30, 40, 240, 36, 18);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();

        // Red Live Dot
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(50, 58, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13px Inter, system-ui, sans-serif';
        ctx.fillText('OCOP VIỆT NAM • 63 TỈNH', 66, 63);
        ctx.restore();

        // 4. PRODUCT SHOWCASE CARD (KEN BURNS ZOOM EFFECT)
        const cardX = 35;
        const cardY = 110;
        const cardW = 470;
        const cardH = 460;
        const cardR = 28;

        ctx.save();
        // Drop shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.fill();
        ctx.restore();

        // Clip card interior
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.clip();

        // Draw image or emblem
        if (tiktokProductImage && tiktokProductImage.complete && tiktokProductImage.naturalWidth > 0) {
            // Ken Burns zoom calculation
            const zoom = 1.05 + 0.08 * Math.sin(time * 0.8);
            const panY = Math.cos(time * 0.5) * 8;
            const drawW = cardW * zoom;
            const drawH = cardH * zoom;
            const drawX = cardX - (drawW - cardW) / 2;
            const drawY = cardY - (drawH - cardH) / 2 + panY;
            ctx.drawImage(tiktokProductImage, drawX, drawY, drawW, drawH);
        } else {
            // Stylized emblem placeholder
            const placeholderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            placeholderGrad.addColorStop(0, '#E0F2FE');
            placeholderGrad.addColorStop(1, '#BAE6FD');
            ctx.fillStyle = placeholderGrad;
            ctx.fillRect(cardX, cardY, cardW, cardH);

            ctx.fillStyle = '#0284C7';
            ctx.font = '900 64px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🌾', cardX + cardW / 2, cardY + cardH / 2 - 20);

            ctx.fillStyle = '#0C4A6E';
            ctx.font = 'bold 22px Inter, sans-serif';
            ctx.fillText(p.name, cardX + cardW / 2, cardY + cardH / 2 + 50);
        }

        // Inner glowing border
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        // 5. OCOP STAR CERTIFICATION BANNER (OVERLAY ON CARD)
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(50, 125, 230, 36, 18);
        ctx.fill();
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText(\`⭐ CHỨNG NHẬN OCOP \${p.stars || 5} SAO\`, 65, 148);
        ctx.restore();

        // 6. PRODUCT INFO STRIP
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 24px Inter, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        
        // Wrap product title if too long
        const displayName = p.name.length > 28 ? p.name.substring(0, 26) + '...' : p.name;
        ctx.fillText(displayName, 35, 615);

        ctx.font = 'bold 15px Inter, sans-serif';
        ctx.fillStyle = '#38BDF8';
        ctx.fillText(\`📍 Đặc sản: \${p.region || 'Việt Nam'} • Showroom O2O\`, 35, 642);

        // Price Badge
        const priceText = p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Giá ưu đãi';
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.roundRect(35, 655, 150, 32, 16);
        ctx.fill();
        ctx.fillStyle = '#854D0E';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(priceText, 50, 676);
        ctx.restore();

        // 7. AUTO-CAPTIONS (TIKTOK DYNAMIC SUBTITLES)
        if (tiktokAutoCaptions && tiktokAutoCaptions.length > 0) {
            const capIndex = Math.min(
                Math.floor((time / 10) * tiktokAutoCaptions.length),
                tiktokAutoCaptions.length - 1
            );
            const currentSub = tiktokAutoCaptions[capIndex] || '';

            ctx.save();
            ctx.font = '900 18px Inter, sans-serif';
            const textWidth = ctx.measureText(currentSub).width;
            const subW = Math.max(textWidth + 36, 260);
            const subX = (W - subW) / 2;
            const subY = 720;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            ctx.beginPath();
            ctx.roundRect(subX, subY, subW, 44, 22);
            ctx.fill();
            ctx.strokeStyle = '#FBBF24';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#FDE047';
            ctx.textAlign = 'center';
            ctx.fillText(currentSub, W / 2, subY + 28);
            ctx.restore();
        }

        // 8. BOUNCING CALL-TO-ACTION BANNER (FINAL DRIVER TO BIO LINK)
        ctx.save();
        const ctaBounce = Math.sin(time * 6) * 4;
        const ctaY = 800 + ctaBounce;
        const ctaW = 470;
        const ctaX = 35;

        const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0);
        ctaGrad.addColorStop(0, '#0284C7');
        ctaGrad.addColorStop(1, '#0EA5E9');
        ctx.fillStyle = ctaGrad;
        ctx.beginPath();
        ctx.roundRect(ctaX, ctaY, ctaW, 64, 20);
        ctx.fill();

        ctx.strokeStyle = '#BAE6FD';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌐 TÌM MUA TẠI: OCOP AI HUB • LINK BIO 👆', W / 2, ctaY + 28);

        ctx.font = 'bold 12.5px Inter, sans-serif';
        ctx.fillStyle = '#E0F2FE';
        ctx.fillText('Bản đồ số 63 Tỉnh Thành • Tìm Điểm Bán & Showroom Gần Bạn', W / 2, ctaY + 49);
        ctx.restore();

        // 9. TIKTOK UI MOCKUP ON RIGHT SIDE
        ctx.save();
        const iconX = 490;
        ctx.textAlign = 'center';

        // Avatar
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(iconX, 420, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('OCOP', iconX, 425);

        // Heart
        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('❤️', iconX, 480);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('18.2K', iconX, 498);

        // Comment
        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('💬', iconX, 535);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('539', iconX, 553);

        // Bookmark
        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('🔖', iconX, 590);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('2.4K', iconX, 608);

        // Share
        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('↗️', iconX, 645);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('1.1K', iconX, 663);

        // Rotating Music Disc
        const discAngle = time * 3;
        ctx.translate(iconX, 720);
        ctx.rotate(discAngle);
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 10. BOTTOM PROGRESS BAR
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, H - 4, W, 4);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(0, H - 4, (frame % tiktokTotalFrames) / tiktokTotalFrames * W, 4);
    }

    function runTikTokAnimationLoop() {
        if (!isTikTokPlaying) return;
        tiktokCurrentFrame++;
        drawTikTokCanvasFrame();
        tiktokAnimFrameId = requestAnimationFrame(runTikTokAnimationLoop);
    }

    function playTikTokVideo() {
        if (isTikTokPlaying) return;
        isTikTokPlaying = true;
        const btn = document.getElementById('txt-tiktok-play');
        if (btn) btn.textContent = '⏸ Tạm Dừng Video';

        // Play voiceover via SpeechSynthesis if available
        playTikTokVoiceover();

        tiktokAnimFrameId = requestAnimationFrame(runTikTokAnimationLoop);
    }

    function pauseTikTokVideo() {
        isTikTokPlaying = false;
        if (tiktokAnimFrameId) {
            cancelAnimationFrame(tiktokAnimFrameId);
            tiktokAnimFrameId = null;
        }
        const btn = document.getElementById('txt-tiktok-play');
        if (btn) btn.textContent = '▶️ Phát / Xem Thử Video TikTok';
        stopTikTokVoiceover();
    }

    window.toggleTikTokVideoPlayback = function () {
        if (isTikTokPlaying) {
            pauseTikTokVideo();
        } else {
            playTikTokVideo();
        }
    };

    function playTikTokVoiceover() {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const scr = document.getElementById('tiktok-script-output')?.value || '';
        // Clean timestamps [00:00 - 00:04]
        const cleanText = scr.replace(/\\[\\d\\d:\\d\\d - \\d\\d:\\d\\d\\]/g, '').replace(/👉/g, '').trim();
        if (!cleanText) return;

        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.lang = 'vi-VN';
        utter.rate = 1.05;

        // Try to select Vietnamese voice if available
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.includes('Vietnamese'));
        if (viVoice) utter.voice = viVoice;

        window.speechSynthesis.speak(utter);
    }

    function stopTikTokVoiceover() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    // Export & Download TikTok Video (.webm / .mp4 via MediaRecorder)
    window.downloadTikTokVideo = function () {
        const canvas = document.getElementById('tiktok-canvas');
        if (!canvas) return;

        const downloadTxt = document.getElementById('txt-tiktok-download');
        if (downloadTxt) downloadTxt.textContent = '⏳ Đang render video TikTok... (0%)';

        // Ensure canvas animation is running
        tiktokCurrentFrame = 0;
        drawTikTokCanvasFrame();

        if (typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
            alert('Trình duyệt của bạn không hỗ trợ MediaRecorder canvas. Vui lòng sử dụng Chrome, Edge hoặc Firefox!');
            if (downloadTxt) downloadTxt.textContent = '📥 Tải Video Về Máy (.WebM / .MP4)';
            return;
        }

        const stream = canvas.captureStream(30);
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
        }

        try {
            tiktokRecordedChunks = [];
            tiktokMediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        } catch (err) {
            console.error('MediaRecorder error:', err);
            tiktokMediaRecorder = new MediaRecorder(stream);
        }

        tiktokMediaRecorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) {
                tiktokRecordedChunks.push(e.data);
            }
        };

        tiktokMediaRecorder.onstop = function () {
            const blob = new Blob(tiktokRecordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const pName = (tiktokCurrentProduct?.name || 'SanPham').replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_');
            a.download = \`OCOP_TikTok_\${pName}_9x16.webm\`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

            if (downloadTxt) downloadTxt.textContent = '📥 Tải Video Về Máy (.WebM / .MP4)';
            if (typeof showToast === 'function') {
                showToast('🎉 Đã tải video TikTok OCOP thành công! Bạn có thể đăng ngay lên TikTok.', 'success');
            } else {
                alert('🎉 Đã xuất và tải video TikTok OCOP thành công!');
            }
        };

        tiktokMediaRecorder.start();

        // Render frames manually for exact 10 seconds (300 frames)
        let renderFrame = 0;
        const totalRecordFrames = 300;
        const renderInterval = setInterval(() => {
            tiktokCurrentFrame = renderFrame;
            drawTikTokCanvasFrame();
            renderFrame++;

            const pct = Math.round((renderFrame / totalRecordFrames) * 100);
            if (downloadTxt) downloadTxt.textContent = \`⏳ Đang render video TikTok... (\${pct}%)\`;

            if (renderFrame >= totalRecordFrames) {
                clearInterval(renderInterval);
                tiktokMediaRecorder.stop();
            }
        }, 33); // ~30 fps
    };

    // Open TikTok Upload Center & Copy Caption
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
`;

// Now, hook setupAdminDashboardTabsAndTikTokEngine() into enrichWebmasterRevenueData()
if (!js.includes('setupAdminDashboardTabsAndTikTokEngine();')) {
    js = js.replace(
        'function enrichWebmasterRevenueData() {',
        'function enrichWebmasterRevenueData() {\n        setupAdminDashboardTabsAndTikTokEngine();'
    );
}

// Inject tiktokEngineCode right after hookSimulatorSliders
const hookSliderAnchor = 'cogsInput._hooked = true;\n        }\n    }';
if (js.includes(hookSliderAnchor)) {
    js = js.replace(hookSliderAnchor, hookSliderAnchor + '\n' + tiktokEngineCode);
} else {
    // If exact anchor not found, inject before Section 7
    const sec7Anchor = '// 7. FORM';
    js = js.replace(sec7Anchor, tiktokEngineCode + '\n    ' + sec7Anchor);
}

fs.writeFileSync('skytech-complete.js', js, 'utf8');
console.log('✓ Successfully integrated AI TikTok Marketing Suite into skytech-complete.js');
console.log('=== DONE ===');

