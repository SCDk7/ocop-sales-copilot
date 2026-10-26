const fs = require('fs');

console.log('=== STARTING COMPLETE OVERHAUL SCRIPT ===');

// ============================================================================
// PART 1: UPDATE index.html
// ============================================================================
let html = fs.readFileSync('index.html', 'utf8');

// 1.1 Insert #province-stores-panel if not already there
if (!html.includes('id="province-stores-panel"')) {
    const targetDiv = `<button id="province-map-clear" class="province-map-clear rounded-lg px-3 py-1.5 text-xs font-extrabold" type="button" onclick="clearSelectedProvince()" disabled>
                            Xóa lựa chọn
                        </button>
                    </div>`;
    const targetReplacement = `<button id="province-map-clear" class="province-map-clear rounded-lg px-3 py-1.5 text-xs font-extrabold" type="button" onclick="clearSelectedProvince()" disabled>
                            Xóa lựa chọn
                        </button>
                    </div>
                    <!-- DANH SÁCH CỬA HÀNG & ĐIỂM BÁN CHỨNG NHẬN OCOP TẠI TỈNH -->
                    <div id="province-stores-panel" class="hidden mt-3 transition-all duration-300"></div>`;
    
    if (html.includes(targetDiv)) {
        html = html.replace(targetDiv, targetReplacement);
        console.log('✓ Successfully inserted #province-stores-panel in index.html');
    } else {
        console.error('❌ Could not locate targetDiv for #province-stores-panel');
    }
}

// 1.2 Replace ArcGIS / OSM layers in initializeProvinceMap with CartoDB Dark No-Labels and Maritime Sovereign Markers
const mapLayerRegex = /const satelliteLayer = L\.tileLayer\([\s\S]*?L\.control\.layers\([\s\S]*?\.addTo\(provinceMap\);/;
if (mapLayerRegex.test(html)) {
    const newDarkMapCode = `// CARTO Dark-Navy No-Labels tile layer (Clean, ZERO foreign labels / No East Sea foreign text)
                const darkNavyLayer = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                    {
                        subdomains: 'abcd',
                        maxZoom: 19,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    }
                );

                provinceMap = L.map('province-map', {
                    center: [16.0, 107.8],
                    zoom: 5.5,
                    minZoom: 4.8,
                    maxZoom: 13,
                    layers: [darkNavyLayer],
                    scrollWheelZoom: false,
                    zoomControl: true
                });
                window.provinceMap = provinceMap;

                // 1. CHỦ QUYỀN BIỂN ĐÔNG (Chữ in hoa cố định màu xanh sáng/trắng)
                const bienDongIcon = L.divIcon({
                    className: 'bien-dong-label',
                    html: '<span style="font-size: 13px; font-weight: 900; letter-spacing: 3px; color: #38BDF8; text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(56,189,248,0.7); text-transform: uppercase;">BIỂN ĐÔNG</span>',
                    iconSize: [140, 24],
                    iconAnchor: [70, 12]
                });
                L.marker([14.5, 111.5], { icon: bienDongIcon, interactive: false }).addTo(provinceMap);

                // 2. QUẦN ĐẢO HOÀNG SA (Đà Nẵng - Việt Nam)
                const hoangSaIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div class="sovereign-island-badge" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; background: rgba(15, 23, 42, 0.9); border: 1.5px solid #F59E0B; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); color: #FFFFFF; font-size: 10.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">' +
                          '<span>🇻🇳</span><span style="color: #FEF08A; font-weight: 900;">Quần đảo Hoàng Sa</span><span style="color: #93C5FD; font-size: 9px;">(Đà Nẵng - VN)</span>' +
                          '</div>',
                    iconSize: [210, 28],
                    iconAnchor: [105, 14]
                });
                L.marker([16.5, 112.0], { icon: hoangSaIcon }).addTo(provinceMap).on('click', () => {
                    provinceMap.flyTo([16.5, 112.0], 8, { duration: 1.2 });
                    if (typeof showToast === 'function') {
                        showToast('🇻🇳 Quần đảo Hoàng Sa thuộc chủ quyền thiêng liêng của nước CHXHCN Việt Nam (Trực thuộc TP. Đà Nẵng)', 'info');
                    }
                });

                // 3. QUẦN ĐẢO TRƯỜNG SA (Khánh Hòa - Việt Nam)
                const truongSaIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div class="sovereign-island-badge" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; background: rgba(15, 23, 42, 0.9); border: 1.5px solid #F59E0B; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); color: #FFFFFF; font-size: 10.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">' +
                          '<span>🇻🇳</span><span style="color: #FEF08A; font-weight: 900;">Quần đảo Trường Sa</span><span style="color: #93C5FD; font-size: 9px;">(Khánh Hòa - VN)</span>' +
                          '</div>',
                    iconSize: [210, 28],
                    iconAnchor: [105, 14]
                });
                L.marker([10.0, 114.0], { icon: truongSaIcon }).addTo(provinceMap).on('click', () => {
                    provinceMap.flyTo([10.0, 114.0], 8, { duration: 1.2 });
                    if (typeof showToast === 'function') {
                        showToast('🇻🇳 Quần đảo Trường Sa thuộc chủ quyền thiêng liêng của nước CHXHCN Việt Nam (Trực thuộc tỉnh Khánh Hòa)', 'info');
                    }
                });

                // 4. ĐẢO PHÚ QUỐC
                const phuQuocIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div style="display: inline-flex; align-items: center; padding: 3px 8px; background: rgba(15, 23, 42, 0.85); border: 1px solid #38BDF8; border-radius: 999px; color: #E0F2FE; font-size: 9.5px; font-weight: 700; white-space: nowrap; cursor: pointer;">' +
                          '<span>🏝️ Đảo Phú Quốc</span></div>',
                    iconSize: [110, 22],
                    iconAnchor: [55, 11]
                });
                L.marker([10.22, 103.96], { icon: phuQuocIcon }).addTo(provinceMap).on('click', () => {
                    selectProvinceById('VN-47');
                });

                // 5. CÔN ĐẢO
                const conDaoIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div style="display: inline-flex; align-items: center; padding: 3px 8px; background: rgba(15, 23, 42, 0.85); border: 1px solid #38BDF8; border-radius: 999px; color: #E0F2FE; font-size: 9.5px; font-weight: 700; white-space: nowrap; cursor: pointer;">' +
                          '<span>🏝️ Côn Đảo</span></div>',
                    iconSize: [85, 22],
                    iconAnchor: [42, 11]
                });
                L.marker([8.68, 106.60], { icon: conDaoIcon }).addTo(provinceMap).on('click', () => {
                    selectProvinceById('VN-43');
                });`;
    html = html.replace(mapLayerRegex, newDarkMapCode);
    console.log('✓ Successfully replaced Leaflet tile layers with CartoDB Dark No-Labels in index.html');
} else {
    console.warn('⚠️ mapLayerRegex did not match in index.html (may already be replaced)');
}

// 1.3 Connect onProvinceFilterChange to Leaflet flyTo, Red Pin and renderProvinceStoresPanel
const targetFilterToast = 'showToast(`⚡ AI Engine: Đã đồng bộ mạng lưới đặc sản toàn quốc (63 Tỉnh Thành • ${sortedList.length} Sản phẩm)`, "info");\n                }';
const targetFilterReplacement = `showToast(\`⚡ AI Engine: Đã đồng bộ mạng lưới đặc sản toàn quốc (63 Tỉnh Thành • \${sortedList.length} Sản phẩm)\`, "info");
                }

                // Leaflet Map FlyTo, Red Pin, and OCOP Stores synchronization
                if (selectedProvince) {
                    if (provinceMap && provinceBoundaryLayer) {
                        let targetLayer = null;
                        provinceBoundaryLayer.eachLayer(layer => {
                            if (layer.feature && (normalizeProvinceName(layer.feature.properties.name) === normTarget || layer.feature.properties.id === targetProvince)) {
                                targetLayer = layer;
                            }
                        });
                        if (targetLayer && targetLayer.getBounds) {
                            const center = targetLayer.getBounds().getCenter();
                            provinceMap.flyTo(center, 8.5, { duration: 1.2 });
                            placeLeafletRedPin(center);
                        }
                    }
                    if (typeof renderProvinceStoresPanel === 'function') {
                        renderProvinceStoresPanel(selectedProvince.name);
                    }
                } else {
                    if (provinceMap) {
                        provinceMap.flyTo([16.0, 107.8], 5.5, { duration: 1.2 });
                    }
                    if (typeof removeLeafletRedPin === 'function') {
                        removeLeafletRedPin();
                    }
                    if (typeof renderProvinceStoresPanel === 'function') {
                        renderProvinceStoresPanel(null);
                    }
                }`;

if (html.includes(targetFilterToast) && !html.includes('renderProvinceStoresPanel(selectedProvince.name)')) {
    html = html.replace(targetFilterToast, targetFilterReplacement);
    console.log('✓ Successfully hooked onProvinceFilterChange in index.html');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Saved index.html');

// ============================================================================
// PART 2: UPDATE skytech-complete.css
// ============================================================================
let css = fs.readFileSync('skytech-complete.css', 'utf8');

// Update #province-map styles to 440px and Dark-Navy
css = css.replace(/#province-map\s*\{[\s\S]*?min-height:\s*480px[\s\S]*?\}/g, `#province-map {
    position: relative !important;
    width: 100% !important;
    min-height: 440px !important;
    height: 440px !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    border: 2px solid #38BDF8 !important;
    box-shadow: 0 10px 30px rgba(11, 25, 44, 0.45) !important;
    background: #0B192C !important;
}`);

// Update #province-map-select to white background, cyan border, dark bold text
css = css.replace(/#province-map-select\s*\{[\s\S]*?\}/g, `#province-map-select {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    border: 1.5px solid #38BDF8 !important;
    border-radius: 10px !important;
    font-weight: 700 !important;
    padding: 6px 12px !important;
    outline: none !important;
    box-shadow: 0 1px 4px rgba(2, 132, 199, 0.1) !important;
}`);

// Append Leaflet Dark-Navy, Maritime Sovereignty, Red Pin & Store Cards styles if not present
if (!css.includes('.bien-dong-label')) {
    const additionalCss = `
/* LEAFLET DARK-NAVY VIETNAM MAP & SOVEREIGNTY STYLING */
#province-map .leaflet-container {
    background: #0B192C !important;
    font-family: inherit !important;
}

.bien-dong-label {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    pointer-events: none !important;
    user-select: none !important;
}

.sovereign-island-marker {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

.sovereign-island-badge:hover {
    transform: scale(1.05);
    border-color: #FDE047 !important;
    box-shadow: 0 6px 18px rgba(245, 158, 11, 0.7) !important;
}

/* LARGE RED GOOGLE MAPS PIN (SVG) WITH RIPPLE WAVE */
.leaflet-red-pin-wrapper {
    position: relative;
    width: 34px;
    height: 46px;
    transform: translate(-17px, -46px);
    pointer-events: none;
}

.leaflet-red-pin-wrapper svg {
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65));
    animation: pinDropBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pinDropBounce {
    0% { transform: translateY(-30px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.pin-ripple-pulse {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 22px;
    height: 8px;
    background: rgba(220, 38, 38, 0.45);
    border-radius: 50%;
    animation: pinPulseWave 1.6s infinite ease-out;
}

@keyframes pinPulseWave {
    0% { transform: translateX(-50%) scale(0.6); opacity: 0.9; }
    100% { transform: translateX(-50%) scale(2.4); opacity: 0; }
}

/* OCOP PROVINCE STORES PANEL */
#province-stores-panel .store-item-card {
    transition: all 0.25s ease;
}

#province-stores-panel .store-item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(2, 132, 199, 0.15) !important;
    border-color: #38BDF8 !important;
}
`;
    css += additionalCss;
    console.log('✓ Appended Leaflet Dark-Navy & Red Pin styles to skytech-complete.css');
}

fs.writeFileSync('skytech-complete.css', css, 'utf8');
console.log('✓ Saved skytech-complete.css');

// ============================================================================
// PART 3: UPDATE skytech-complete.js
// ============================================================================
let js = fs.readFileSync('skytech-complete.js', 'utf8');

// 3.1 Replace setupInteractiveVietnamMap in skytech-complete.js: DO NOT wipe out Leaflet with SVG!
// Find setupInteractiveVietnamMap function and replace it with Leaflet coordinator
const oldSetupMapRegex = /function setupInteractiveVietnamMap\(\)\s*\{[\s\S]*?mapContainer\.innerHTML = mapSvg;[\s\S]*?window\.selectProvinceById = function[\s\S]*?\};?\s*\}/;

const newSetupMapCode = `function setupInteractiveVietnamMap() {
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
    }`;

if (oldSetupMapRegex.test(js)) {
    js = js.replace(oldSetupMapRegex, newSetupMapCode);
    console.log('✓ Successfully replaced setupInteractiveVietnamMap in skytech-complete.js (removed SVG overwrite)');
} else {
    console.warn('⚠️ Could not match oldSetupMapRegex in skytech-complete.js');
}

// 3.2 Implement stopAllTikTokVideoAndVoice and bind to all audio sources
const audioTeardownCode = `
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
`;

// Insert stopAllTikTokVideoAndVoice before cleanTextForSpeech
if (!js.includes('window.stopAllTikTokVideoAndVoice = function')) {
    js = js.replace('function cleanTextForSpeech(text) {', audioTeardownCode + '\n    function cleanTextForSpeech(text) {');
    console.log('✓ Inserted stopAllTikTokVideoAndVoice in skytech-complete.js');
}

// 3.3 Update cleanTextForSpeech to strip markdown *, #, -, hashtags, emojis, timestamps
const oldCleanTextRegex = /function cleanTextForSpeech\(text\)\s*\{[\s\S]*?return text[\s\S]*?\.trim\(\);\s*\}/;
const newCleanTextCode = `function cleanTextForSpeech(text) {
        if (!text) return '';
        return text
            .replace(/\\[\\d{2}:\\d{2}\\s*-\\s*\\d{2}:\\d{2}\\]/g, '') // remove timestamps [00:00 - 00:04]
            .replace(/#[\\w\\u00C0-\\u1EF9_]+/gu, '') // remove all hashtags (#OCOPVietNam...)
            .replace(/[*#_~\`>\\\\-]/g, ' ') // remove markdown symbols *, #, _, ~, \`, >, \\, -
            .replace(/[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{1FA70}-\\u{1FAFF}]/gu, '') // remove emojis
            .replace(/\\bO2O\\b/gi, 'trực tuyến và tại cửa hàng')
            .replace(/\\bBio\\b/gi, 'tiểu sử kênh')
            .replace(/\\bOCOP\\b/gi, 'Ô-cốp')
            .replace(/\\bOcop\\b/gi, 'Ô-cốp')
            .replace(/\\bOCOP AI Hub\\b/gi, 'trang web Ô-cốp Việt Nam')
            .replace(/\\bQR code\\b/gi, 'mã Q-R')
            .replace(/\\bQR\\b/gi, 'Q-R')
            .replace(/DigitalFest\\s*2026/gi, 'Đại hội số hai nghìn không trăm hai mươi sáu')
            .replace(/HTX\\b/gi, 'Hợp tác xã')
            .replace(/SP\\b/gi, 'sản phẩm')
            .replace(/TP\\.\\s*/gi, 'Thành phố ')
            .replace(/\\s+/g, ' ')
            .trim();
    }`;

if (oldCleanTextRegex.test(js)) {
    js = js.replace(oldCleanTextRegex, newCleanTextCode);
    console.log('✓ Updated cleanTextForSpeech with full markdown/emoji filtering');
}

// 3.4 Update speakWebSpeechFallback with voice priority (HoaiMy, NamMinh, Google Tiếng Việt, vi-VN) & rate=1.05, pitch=1.0
const oldFallbackRegex = /function speakWebSpeechFallback\(sentence\)\s*\{[\s\S]*?window\.speechSynthesis\.speak\(utter\);[\s\S]*?catch \(err\) \{[\s\S]*?\}\s*\}/;
const newFallbackCode = `function speakWebSpeechFallback(sentence) {
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
                    voices.find(v => /google\\s+ti[ếe]ng\\s+vi[ệe]t/i.test(v.name) && v.lang.startsWith('vi')) ||
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
    }`;

if (oldFallbackRegex.test(js)) {
    js = js.replace(oldFallbackRegex, newFallbackCode);
    console.log('✓ Updated speakWebSpeechFallback with preferred voice priority and rate=1.05');
}

// 3.5 Hook stopAllTikTokVideoAndVoice to closeTikTokStudioModal, onProductChange, generateAiTikTokPackage
js = js.replace(/window\.closeTikTokStudioModal = function \(\) \{[\s\S]*?pauseTikTokModalVideo\(\);\s*\};/, `window.closeTikTokStudioModal = function () {
        const modal = document.getElementById('tiktok-studio-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.setProperty('display', 'none', 'important');
        }
        window.stopAllTikTokVideoAndVoice();
    };`);

// Hook to onTikTokModalProductChange & onTikTokProductChange
js = js.replace(/window\.onTikTokModalProductChange = function \(\) \{/, `window.onTikTokModalProductChange = function () {\n        window.stopAllTikTokVideoAndVoice();`);
js = js.replace(/window\.onTikTokProductChange = function \(\) \{/, `window.onTikTokProductChange = function () {\n        window.stopAllTikTokVideoAndVoice();`);

// Hook to generateAiTikTokPackageModal & generateAiTikTokPackage
js = js.replace(/window\.generateAiTikTokPackageModal = function \(\) \{/, `window.generateAiTikTokPackageModal = function () {\n        window.stopAllTikTokVideoAndVoice();`);
js = js.replace(/window\.generateAiTikTokPackage = function \(\) \{/, `window.generateAiTikTokPackage = function () {\n        window.stopAllTikTokVideoAndVoice();`);

// Hook to pauseTikTokModalVideo & pauseTikTokVideo
js = js.replace(/function pauseTikTokModalVideo\(\) \{[\s\S]*?stopTikTokAudio\(\);\s*\}/, `function pauseTikTokModalVideo() {\n        window.stopAllTikTokVideoAndVoice();\n    }`);
js = js.replace(/function pauseTikTokVideo\(\) \{[\s\S]*?stopTikTokAudio\(\);\s*\}/, `function pauseTikTokVideo() {\n        window.stopAllTikTokVideoAndVoice();\n    }`);

// Hook to backdrop click on #tiktok-studio-modal
js = js.replace(/document\.body\.appendChild\(modal\);\s*\}/, `document.body.appendChild(modal);
            // Backdrop click listener to close modal and stop audio
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    window.closeTikTokStudioModal();
                }
            });
        }`);

// Hook to Escape key listener
js = js.replace(/if \(e\.key === 'Escape' \|\| e\.key === 'Esc'\) \{/, `if (e.key === 'Escape' || e.key === 'Esc') {
            const tikModal = document.getElementById('tiktok-studio-modal');
            if (tikModal && !tikModal.classList.contains('hidden') && tikModal.style.display !== 'none') {
                window.closeTikTokStudioModal();
            }`);

fs.writeFileSync('skytech-complete.js', js, 'utf8');
console.log('✓ Saved skytech-complete.js');

console.log('=== OVERHAUL COMPLETE ===');

