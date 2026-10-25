const fs = require('fs');

console.log('=== UPDATING STANDALONE TIKTOK STUDIO MODAL IN skytech-complete.js ===');

let js = fs.readFileSync('skytech-complete.js', 'utf8');

// Ensure polishHeader binds #btn-header-tiktok
const oldPolishHeaderAnchor = "let btnPin = document.getElementById('btn-header-admin-pin');";
const newPolishHeaderSnippet = `let btnTikTok = document.getElementById('btn-header-tiktok');
        if (btnTikTok) {
            btnTikTok.onclick = function (e) {
                if (e) e.preventDefault();
                openTikTokStudioModal();
            };
        }

        let btnPin = document.getElementById('btn-header-admin-pin');`;

if (!js.includes('btnTikTok') && js.includes(oldPolishHeaderAnchor)) {
    js = js.replace(oldPolishHeaderAnchor, newPolishHeaderSnippet);
    console.log('✓ Hooked #btn-header-tiktok in polishHeader()');
}

// Add standalone TikTok Studio Modal creation & open/close functions
const standaloneModalCode = `
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
            modal.innerHTML = \`
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
                                    <span>AI TikTok Marketing Engine 2026 • Chuẩn Ý Thảo Nguyên</span>
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
            \`;
            document.body.appendChild(modal);
        }

        // Mount the 2-column studio layout inside modal
        const innerContainer = document.getElementById('tiktok-studio-inner-container');
        if (innerContainer) {
            innerContainer.innerHTML = \`
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
                        <div class="tiktok-phone-mockup">
                            <div class="tiktok-phone-island"></div>
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
            \`;
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
                opt.textContent = \`\${p.name} (\${p.region}) - OCOP \${p.stars} Sao\`;
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
        pauseTikTokModalVideo();
    };

    window.onTikTokModalProductChange = function () {
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

        const capEl = document.getElementById('tiktok-caption-modal');
        if (capEl) capEl.value = caption;

        const scrEl = document.getElementById('tiktok-script-modal');
        if (scrEl) scrEl.value = script;

        drawTikTokCanvasModalFrame();
    };

    window.copyTikTokModalContent = function () {
        const cap = document.getElementById('tiktok-caption-modal')?.value || '';
        const scr = document.getElementById('tiktok-script-modal')?.value || '';
        const full = \`=== BÀI VIẾT TIKTOK ===\\n\${cap}\\n\\n=== KỊCH BẢN THUYẾT MINH ===\\n\${scr}\`;

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

        // 2. PARTICLES
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 28; i++) {
            const px = (Math.sin(i * 99 + time * 0.5) * 0.5 + 0.5) * W;
            const py = ((i * 37 - time * 45) % H + H) % H;
            const size = 1.5 + (i % 3);
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. TOP PILL BADGE
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.beginPath();
        ctx.roundRect(30, 40, 240, 36, 18);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();

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
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.clip();

        if (tiktokProductImage && tiktokProductImage.complete && tiktokProductImage.naturalWidth > 0) {
            const zoom = 1.05 + 0.08 * Math.sin(time * 0.8);
            const panY = Math.cos(time * 0.5) * 8;
            const drawW = cardW * zoom;
            const drawH = cardH * zoom;
            const drawX = cardX - (drawW - cardW) / 2;
            const drawY = cardY - (drawH - cardH) / 2 + panY;
            ctx.drawImage(tiktokProductImage, drawX, drawY, drawW, drawH);
        } else {
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

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        // 5. OCOP STAR BADGE
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

        // 6. PRODUCT INFO
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 24px Inter, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        
        const displayName = p.name.length > 28 ? p.name.substring(0, 26) + '...' : p.name;
        ctx.fillText(displayName, 35, 615);

        ctx.font = 'bold 15px Inter, sans-serif';
        ctx.fillStyle = '#38BDF8';
        ctx.fillText(\`📍 Đặc sản: \${p.region || 'Việt Nam'} • Showroom O2O\`, 35, 642);

        const priceText = p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Giá ưu đãi';
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.roundRect(35, 655, 150, 32, 16);
        ctx.fill();
        ctx.fillStyle = '#854D0E';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText(priceText, 50, 676);
        ctx.restore();

        // 7. AUTO-CAPTIONS
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

        // 8. BOUNCING CALL-TO-ACTION BANNER
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
        ctx.fillText('🌐 XEM ĐIỂM BÁN CHÍNH HÃNG: OCOP AI HUB 👆', W / 2, ctaY + 28);

        ctx.font = 'bold 12.5px Inter, sans-serif';
        ctx.fillStyle = '#E0F2FE';
        ctx.fillText('Bản đồ số 63 Tỉnh Thành • Tra Cứu Showroom Gần Nhất', W / 2, ctaY + 49);
        ctx.restore();

        // 9. TIKTOK HUD
        ctx.save();
        const iconX = 490;
        ctx.textAlign = 'center';

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(iconX, 420, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('OCOP', iconX, 425);

        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('❤️', iconX, 480);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('18.2K', iconX, 498);

        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('💬', iconX, 535);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('539', iconX, 553);

        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('🔖', iconX, 590);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('2.4K', iconX, 608);

        ctx.font = '22px Inter, sans-serif';
        ctx.fillText('↗️', iconX, 645);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('1.1K', iconX, 663);

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

        // 10. PROGRESS BAR
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, H - 4, W, 4);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(0, H - 4, (frame % tiktokTotalFrames) / tiktokTotalFrames * W, 4);
    }

    let isModalPlaying = false;
    let modalAnimId = null;

    function runTikTokModalLoop() {
        if (!isModalPlaying) return;
        tiktokCurrentFrame++;
        drawTikTokCanvasModalFrame();
        modalAnimId = requestAnimationFrame(runTikTokModalLoop);
    }

    function playTikTokModalVideo() {
        if (isModalPlaying) return;
        isModalPlaying = true;
        const btn = document.getElementById('txt-modal-play');
        if (btn) btn.textContent = '⏸ Tạm Dừng Video';

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const scr = document.getElementById('tiktok-script-modal')?.value || '';
            const cleanText = scr.replace(/\\[\\d\\d:\\d\\d - \\d\\d:\\d\\d\\]/g, '').replace(/👉/g, '').trim();
            if (cleanText) {
                const utter = new SpeechSynthesisUtterance(cleanText);
                utter.lang = 'vi-VN';
                utter.rate = 1.05;
                const voices = window.speechSynthesis.getVoices();
                const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.includes('Vietnamese'));
                if (viVoice) utter.voice = viVoice;
                window.speechSynthesis.speak(utter);
            }
        }

        modalAnimId = requestAnimationFrame(runTikTokModalLoop);
    }

    function pauseTikTokModalVideo() {
        isModalPlaying = false;
        if (modalAnimId) {
            cancelAnimationFrame(modalAnimId);
            modalAnimId = null;
        }
        const btn = document.getElementById('txt-modal-play');
        if (btn) btn.textContent = '▶️ Xem Thử Video';
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
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
        if (!canvas) return;

        const downloadTxt = document.getElementById('txt-modal-download');
        if (downloadTxt) downloadTxt.textContent = '⏳ Đang render video TikTok... (0%)';

        tiktokCurrentFrame = 0;
        drawTikTokCanvasModalFrame();

        if (typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
            alert('Trình duyệt của bạn không hỗ trợ MediaRecorder canvas. Vui lòng sử dụng Chrome, Edge hoặc Firefox!');
            if (downloadTxt) downloadTxt.textContent = '📥 Tải Video Về Máy (.WebM / .MP4)';
            return;
        }

        const stream = canvas.captureStream(30);
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

        let chunks = [];
        let recorder = null;
        try {
            recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        } catch (err) {
            recorder = new MediaRecorder(stream);
        }

        recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
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

        recorder.start();

        let renderFrame = 0;
        const totalRecordFrames = 300;
        const interval = setInterval(() => {
            tiktokCurrentFrame = renderFrame;
            drawTikTokCanvasModalFrame();
            renderFrame++;

            const pct = Math.round((renderFrame / totalRecordFrames) * 100);
            if (downloadTxt) downloadTxt.textContent = \`⏳ Đang render video TikTok... (\${pct}%)\`;

            if (renderFrame >= totalRecordFrames) {
                clearInterval(interval);
                recorder.stop();
            }
        }, 33);
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
`;

// Inject before window.askAiAboutStore
const askAiAnchor = 'window.askAiAboutStore = function';
if (js.includes(askAiAnchor) && !js.includes('window.openTikTokStudioModal')) {
    js = js.replace(askAiAnchor, standaloneModalCode + '\n    ' + askAiAnchor);
    console.log('✓ Injected standalone TikTok studio modal into skytech-complete.js');
}

// Ensure Escape closes tiktok-studio-modal
const escAnchor = 'if (typeof window.closeAdminPinModal === \'function\') {';
const escSnippet = `if (typeof window.closeTikTokStudioModal === 'function') {
                window.closeTikTokStudioModal();
            }\n            ` + escAnchor;

if (js.includes(escAnchor) && !js.includes('closeTikTokStudioModal')) {
    js = js.replace(escAnchor, escSnippet);
    console.log('✓ Hooked Escape key to close TikTok studio modal');
}

fs.writeFileSync('skytech-complete.js', js, 'utf8');
console.log('=== DONE UPDATING skytech-complete.js ===');

