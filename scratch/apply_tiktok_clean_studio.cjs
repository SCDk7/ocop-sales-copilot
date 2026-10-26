const fs = require('fs');

console.log('=== PREPARING CLEAN TIKTOK STUDIO REFACTOR ===');

let js = fs.readFileSync('skytech-complete.js', 'utf8');

// 1. Update featuredSpecialties
const oldSpecialtiesRegex = /const featuredSpecialties = \[\s*\{ id: 'dn-hiepvan'[\s\S]*?\{ id: 'dn-nhontrach'[\s\S]*?\}\s*\];/;
const newSpecialties = `// 15 seconds at 30fps
    let tiktokVoiceMode = 'female_natural'; // 'female_natural', 'male_warm', 'music_only'

    // Verified Dong Nai and nationwide specialties with exact real images
    const featuredSpecialties = [
        { id: 'dn-hiepvan', name: 'Trà khổ qua rừng túi lọc Hiệp Vân', region: 'Đồng Nai', stars: 5, price: 68000, img: 'images/catalog/web-latest-171.jpg', tag: 'Thanh nhiệt, hạ đường huyết, chuẩn OCOP 5 Sao' },
        { id: 'dn-tantrieu', name: 'Bưởi đường lá cam Tân Triều', region: 'Đồng Nai', stars: 5, price: 85000, img: 'images/catalog/web-latest-2.jpg', tag: 'Mọng nước, ngọt thanh, tiến vua danh tiếng' },
        { id: 'dn-ngabien', name: 'Hạt điều rang muối vỏ lụa Nga Biên', region: 'Đồng Nai', stars: 5, price: 165000, img: 'images/catalog/customer-search-189.jpg', tag: 'Giòn béo thơm lừng, xuất khẩu chuẩn OCOP' },
        { id: 'dn-trongduc', name: 'Bột Cacao nguyên chất Trọng Đức', region: 'Đồng Nai', stars: 5, price: 120000, img: 'images/catalog/web-latest-190.jpg', tag: 'Đậm đà thuần khiết, giàu chất chống oxy hóa' },
        { id: 'dn-nhontrach', name: 'Trà sen Nhơn Trạch', region: 'Đồng Nai', stars: 4, price: 95000, img: 'images/catalog/customer-search-191.jpg', tag: 'Hương sen tự nhiên, thư giãn an thần' }
    ];`;

if (oldSpecialtiesRegex.test(js)) {
    js = js.replace(oldSpecialtiesRegex, newSpecialties);
    console.log('✓ Updated featuredSpecialties with real images and clean names');
} else {
    console.error('Could not match featuredSpecialties regex!');
    process.exit(1);
}

// 2. Change tiktokTotalFrames from 300 to 450 (15 seconds)
js = js.replace(/const tiktokTotalFrames = 300;/g, 'const tiktokTotalFrames = 450;');

// 3. Update subtitle in modal and admin banner
js = js.replace(/AI TikTok Marketing Engine 2026 • Chuẩn Ý Thảo Nguyên/g, '✨ AI VIDEO & CONTENT STUDIO • QUẢNG BÁ ĐẶC SẢN OCOP');
js = js.replace(/AI TIKTOK MARKETING & TRAFFIC ENGINE • DIGITALFEST 2026/g, '✨ AI VIDEO & CONTENT STUDIO • QUẢNG BÁ ĐẶC SẢN OCOP');

// 4. Update helper functions: getCleanProductName and formatProductOptionName
const oldGetAllProdsRegex = /function getAllAvailableProducts\(\) \{[\s\S]*?return list;\s*\}/;
const newGetAllProds = `function getCleanProductName(p) {
        if (!p) return 'Đặc Sản OCOP';
        const raw = (p.name || '').trim();
        const reg = (p.region || 'Việt Nam').trim();
        return raw
            .replace(new RegExp('\\\\s*\\\\(' + reg + '\\\\)', 'gi'), '')
            .replace(/\\s*\\(Đồng Nai\\)/gi, '')
            .replace(/\\s*\\(Đặc sản Đồng Nai\\)/gi, '')
            .trim();
    }

    function formatProductOptionName(p) {
        if (!p) return '';
        const clean = getCleanProductName(p);
        const reg = (p.region || 'Việt Nam').trim();
        return clean + ' (' + reg + ')';
    }

    function getAllAvailableProducts() {
        const list = [...featuredSpecialties];
        const existing = (window.products && window.products.length > 0) ? window.products : (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
        existing.forEach(p => {
            const clean = getCleanProductName(p);
            if (!list.some(item => getCleanProductName(item).toLowerCase() === clean.toLowerCase())) {
                list.push({
                    id: p.id,
                    name: clean,
                    region: p.region || 'Việt Nam',
                    stars: p.stars || 5,
                    price: p.price || 150000,
                    img: p.img || 'images/catalog/web-latest-171.jpg',
                    tag: p.category || 'Đặc sản OCOP 63 tỉnh thành'
                });
            }
        });
        return list;
    }`;

if (oldGetAllProdsRegex.test(js)) {
    js = js.replace(oldGetAllProdsRegex, newGetAllProds);
    console.log('✓ Updated getAllAvailableProducts with getCleanProductName & formatProductOptionName');
} else {
    console.error('Could not match getAllAvailableProducts regex!');
    process.exit(1);
}

// 5. Update populateProductDropdown and populateTikTokModalProducts to use formatProductOptionName
js = js.replace(/opt\.textContent = `\$\{p\.name\} \(\$\{p\.region\}\)`;/g, 'opt.textContent = formatProductOptionName(p);');
js = js.replace(/opt\.textContent = `\$\{p\.name\} \(\$\{p\.region \|\| 'Việt Nam'\}\)`;/g, 'opt.textContent = formatProductOptionName(p);');

// 6. Audio Engine Implementation
const audioEngineCode = `
    // =========================================================================
    // NATURAL AI VOICEOVER & AUDIO DUCKING ENGINE
    // =========================================================================
    let tiktokAudioCtx = null;
    let tiktokBgGainNode = null;
    let tiktokBgOscillators = [];
    let tiktokAudioDest = null;
    let tiktokActiveAudio = null;
    let tiktokActiveUtterance = null;
    let tiktokLastSpokenScene = -1;

    function initTikTokAudioEngine() {
        if (!tiktokAudioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                tiktokAudioCtx = new AudioContext();
                try {
                    tiktokAudioDest = tiktokAudioCtx.createMediaStreamDestination();
                } catch (e) {
                    tiktokAudioDest = null;
                }
            }
        }
        if (tiktokAudioCtx && tiktokAudioCtx.state === 'suspended') {
            tiktokAudioCtx.resume().catch(() => {});
        }
    }

    function startTikTokBackgroundMusic() {
        stopTikTokBackgroundMusic();
        if (!tiktokAudioCtx) return;

        tiktokBgGainNode = tiktokAudioCtx.createGain();
        tiktokBgGainNode.gain.setValueAtTime(0.12, tiktokAudioCtx.currentTime);
        tiktokBgGainNode.connect(tiktokAudioCtx.destination);
        if (tiktokAudioDest) {
            try { tiktokBgGainNode.connect(tiktokAudioDest); } catch (e) {}
        }

        // Ambient pentatonic chord progression (C4, E4, G4, A4)
        const notes = [261.63, 329.63, 392.00, 440.00];
        tiktokBgOscillators = notes.map(freq => {
            const osc = tiktokAudioCtx.createOscillator();
            const gain = tiktokAudioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, tiktokAudioCtx.currentTime);
            gain.gain.setValueAtTime(0.035, tiktokAudioCtx.currentTime);
            osc.connect(gain);
            gain.connect(tiktokBgGainNode);
            osc.start();
            return osc;
        });
    }

    function stopTikTokBackgroundMusic() {
        if (tiktokBgOscillators.length > 0) {
            tiktokBgOscillators.forEach(osc => {
                try { osc.stop(); osc.disconnect(); } catch (e) {}
            });
            tiktokBgOscillators = [];
        }
        if (tiktokBgGainNode) {
            try { tiktokBgGainNode.disconnect(); } catch (e) {}
            tiktokBgGainNode = null;
        }
    }

    function setTikTokAudioDucking(isDucking) {
        if (!tiktokAudioCtx || !tiktokBgGainNode) return;
        const targetVol = isDucking ? 0.03 : 0.12; // 25% during speech
        tiktokBgGainNode.gain.setTargetAtTime(targetVol, tiktokAudioCtx.currentTime, 0.2);
    }

    function cleanTextForSpeech(text) {
        if (!text) return '';
        return text
            .replace(/\\[\\d{2}:\\d{2}\\s*-\\s*\\d{2}:\\d{2}\\]/g, '') // remove timestamps
            .replace(/[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}]/gu, '') // remove emojis
            .replace(/\\bO2O\\b/gi, 'tại cửa hàng và trực tuyến')
            .replace(/\\bBio\\b/gi, 'tiểu sử kênh')
            .replace(/\\bOCOP\\b/gi, 'Ô-cốp')
            .replace(/\\bOcop\\b/gi, 'Ô-cốp')
            .replace(/\\bOCOP AI Hub\\b/gi, 'trang web Ô-cốp Việt Nam')
            .replace(/\\bQR code\\b/gi, 'mã Q-R')
            .replace(/\\bQR\\b/gi, 'Q-R')
            .replace(/DigitalFest\\s*2026/gi, 'Đại hội số hai nghìn không trăm hai mươi sáu')
            .replace(/\\s+/g, ' ')
            .trim();
    }

    function getScriptSceneSentences(scriptText) {
        if (!scriptText) return [];
        const lines = scriptText.split('\\n')
            .map(l => cleanTextForSpeech(l))
            .filter(l => l.length > 5);
        if (lines.length >= 4) return lines.slice(0, 4);
        
        const allText = cleanTextForSpeech(scriptText);
        const sentences = allText.split(/(?<=[.!?])\\s+/).filter(s => s.length > 5);
        return sentences.slice(0, 4);
    }

    function speakTikTokSentence(sentence) {
        if (tiktokVoiceMode === 'music_only' || !sentence) return;

        if (tiktokActiveAudio) {
            try { tiktokActiveAudio.pause(); } catch (e) {}
            tiktokActiveAudio = null;
        }
        if (window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }

        setTikTokAudioDucking(true);

        const ttsUrl = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=' + encodeURIComponent(sentence);
        const audio = new Audio(ttsUrl);
        tiktokActiveAudio = audio;

        audio.onended = function () {
            setTikTokAudioDucking(false);
            tiktokActiveAudio = null;
        };
        audio.onerror = function () {
            speakWebSpeechFallback(sentence);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(function () {
                speakWebSpeechFallback(sentence);
            });
        }
    }

    function speakWebSpeechFallback(sentence) {
        if (!window.speechSynthesis) {
            setTikTokAudioDucking(false);
            return;
        }
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(sentence);
            utter.lang = 'vi-VN';
            const voices = window.speechSynthesis.getVoices() || [];
            if (tiktokVoiceMode === 'female_natural') {
                const femaleVoice = voices.find(v => /hoaimy|linh|female|nu/i.test(v.name) && v.lang.startsWith('vi')) || voices.find(v => v.lang.startsWith('vi'));
                if (femaleVoice) utter.voice = femaleVoice;
                utter.rate = 0.98;
                utter.pitch = 1.04;
            } else {
                const maleVoice = voices.find(v => /namminh|minh|male|nam/i.test(v.name) && v.lang.startsWith('vi')) || voices.find(v => v.lang.startsWith('vi'));
                if (maleVoice) utter.voice = maleVoice;
                utter.rate = 0.94;
                utter.pitch = 0.88;
            }

            utter.onstart = function () { setTikTokAudioDucking(true); };
            utter.onend = function () { setTikTokAudioDucking(false); };
            utter.onerror = function () { setTikTokAudioDucking(false); };
            tiktokActiveUtterance = utter;
            window.speechSynthesis.speak(utter);
        } catch (err) {
            setTikTokAudioDucking(false);
        }
    }

    function stopTikTokAudio() {
        if (tiktokActiveAudio) {
            try { tiktokActiveAudio.pause(); } catch (e) {}
            tiktokActiveAudio = null;
        }
        if (window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch (e) {}
        }
        stopTikTokBackgroundMusic();
        setTikTokAudioDucking(false);
        tiktokLastSpokenScene = -1;
    }

    window.onTikTokVoiceChange = function (val) {
        tiktokVoiceMode = val || 'female_natural';
        const sel1 = document.getElementById('tiktok-voice-select');
        const sel2 = document.getElementById('tiktok-voice-select-modal');
        if (sel1) sel1.value = tiktokVoiceMode;
        if (sel2) sel2.value = tiktokVoiceMode;
    };

    function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, font, fillStyle) {
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
                lineCount++;
                if (lineCount >= 2) {
                    const remaining = words.slice(n).join(' ');
                    const truncated = ctx.measureText(remaining).width > maxWidth ? remaining.slice(0, 24) : remaining;
                    ctx.fillText(truncated, x, currentY);
                    line = '';
                    break;
                }
            } else {
                line = testLine;
            }
        }
        if (line.trim().length > 0) {
            ctx.fillText(line.trim(), x, currentY);
        }
        ctx.restore();
    }
`;

// Insert audioEngineCode before drawTikTokCanvasFrame
const drawFrameIdx = js.indexOf('function drawTikTokCanvasFrame()');
if (drawFrameIdx !== -1) {
    js = js.slice(0, drawFrameIdx) + audioEngineCode + '\n' + js.slice(drawFrameIdx);
    console.log('✓ Inserted Audio Engine & Text Wrap Helpers');
} else {
    console.error('Could not find function drawTikTokCanvasFrame()!');
    process.exit(1);
}

// 7. Commercial Video Renderer Function
const commercialRendererCode = `
    function renderCommercialStudioVideo(ctx, canvas, p, frame, totalFrames, imgObj, style, captions) {
        const W = canvas.width;
        const H = canvas.height;
        const totalDuration = 15; // 15 seconds
        const time = (frame % totalFrames) / 30;

        let sceneIndex = 0;
        if (time < 3.5) sceneIndex = 0;
        else if (time < 7.5) sceneIndex = 1;
        else if (time < 11.5) sceneIndex = 2;
        else sceneIndex = 3;

        // 1. Dynamic Royal Sapphire Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#0369A1');
        bgGrad.addColorStop(0.35, '#075985');
        bgGrad.addColorStop(0.7, '#0C4A6E');
        bgGrad.addColorStop(1, '#082F49');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // 2. Ambient Floating Sparkles
        for (let i = 0; i < 24; i++) {
            const px = (Math.sin(i * 99 + time * 0.4) * 0.5 + 0.5) * W;
            const py = ((i * 37 - time * 40) % H + H) % H;
            const size = 1.2 + (i % 3);
            const alpha = 0.25 + 0.25 * Math.sin(time * 2 + i);
            ctx.fillStyle = (i % 2 === 0) ? 'rgba(253, 224, 71, ' + alpha + ')' : 'rgba(56, 189, 248, ' + alpha + ')';
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Top Clean Watermark (No fake live dot)
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.beginPath();
        ctx.roundRect(35, 38, 305, 34, 17);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.fillText('✨ OCOP VIỆT NAM • TINH HOA NÔNG SẢN', 50, 60);
        ctx.restore();

        // 4. Product Showcase Card with Ken Burns Zoom & Pan
        const cardX = 35;
        const cardY = 92;
        const cardW = 470;
        const cardH = 470;
        const cardR = 24;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.clip();

        const zoom = 1.02 + 0.10 * Math.sin((time / totalDuration) * Math.PI);
        const panX = Math.sin(time * 0.4) * 10;
        const panY = Math.cos(time * 0.3) * 8;

        if (imgObj && imgObj.complete && imgObj.naturalWidth > 0) {
            const dw = cardW * zoom;
            const dh = cardH * zoom;
            const dx = cardX - (dw - cardW) / 2 + panX;
            const dy = cardY - (dh - cardH) / 2 + panY;
            ctx.drawImage(imgObj, dx, dy, dw, dh);
        } else {
            const pGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            pGrad.addColorStop(0, '#0284C7');
            pGrad.addColorStop(1, '#0369A1');
            ctx.fillStyle = pGrad;
            ctx.fillRect(cardX, cardY, cardW, cardH);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '900 32px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🌾 ' + getCleanProductName(p), cardX + cardW / 2, cardY + cardH / 2);
        }

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // 5. OCOP Star Badge
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(50, 108, 235, 36, 18);
        ctx.fill();
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText('⭐ CHỨNG NHẬN OCOP ' + (p.stars || 5) + ' SAO', 65, 131);
        ctx.restore();

        // 6. Product Information Section (Safe Zone: Y = 585 - 710)
        ctx.save();
        ctx.textAlign = 'left';
        const cleanName = getCleanProductName(p);
        wrapCanvasText(ctx, cleanName, 35, 600, 470, 28, '900 23px Inter, sans-serif', '#FFFFFF');

        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillStyle = '#38BDF8';
        ctx.fillText('📍 Đặc sản: ' + (p.region || 'Việt Nam') + ' • Showroom O2O & Điểm Bán Toàn Quốc', 35, 660);

        const priceText = p.price ? p.price.toLocaleString('vi-VN') + ' đ' : 'Giá ưu đãi';
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.roundRect(35, 675, 160, 32, 16);
        ctx.fill();
        ctx.fillStyle = '#854D0E';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('💰 ' + priceText, 48, 696);
        ctx.restore();

        // 7. Dynamic 4-Scene Subtitles in Safe Zone (Y = 725 - 785)
        let defaultCaptions = [
            '🔥 ĐẶC SẢN ' + (p.region || 'VIỆT NAM').toUpperCase() + ': BẠN ĐÃ THỬ CHƯA?',
            '🌿 100% NGUYÊN LIỆU TỰ NHIÊN • ĐẠT OCOP ' + (p.stars || 5) + ' SAO',
            '⭐ HƯƠNG VỊ ĐẬM ĐÀ • TRUY XUẤT NGUỒN GỐC QR CODE',
            '👉 NHẤP VÀO BIO ĐỂ MỞ BẢN ĐỒ SỐ OCOP NGAY!'
        ];
        if (captions && captions.length >= 4) {
            defaultCaptions = captions;
        }

        const subText = defaultCaptions[sceneIndex] || defaultCaptions[0];
        ctx.save();
        ctx.font = '900 17px Inter, sans-serif';
        const textWidth = ctx.measureText(subText).width;
        const subW = Math.min(Math.max(textWidth + 36, 280), 470);
        const subX = (W - subW) / 2;
        const subY = 730;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.beginPath();
        ctx.roundRect(subX, subY, subW, 44, 22);
        ctx.fill();
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#FDE047';
        ctx.textAlign = 'center';
        ctx.fillText(subText, W / 2, subY + 28);
        ctx.restore();

        // 8. Call-To-Action Banner (Y = 800 - 870)
        ctx.save();
        const ctaBounce = sceneIndex === 3 ? Math.sin(time * 6) * 3 : 0;
        const ctaY = 800 + ctaBounce;
        const ctaW = 470;
        const ctaX = 35;

        const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0);
        ctaGrad.addColorStop(0, '#0284C7');
        ctaGrad.addColorStop(1, '#0EA5E9');
        ctx.fillStyle = ctaGrad;
        ctx.beginPath();
        ctx.roundRect(ctaX, ctaY, ctaW, 66, 18);
        ctx.fill();
        ctx.strokeStyle = '#BAE6FD';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌐 ĐẶT MUA CHÍNH HÃNG TẠI: OCOP AI HUB | GIAO TOÀN QUỐC', W / 2, ctaY + 28);

        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#E0F2FE';
        ctx.fillText('Bản Đồ Số 63 Tỉnh Thành • Tra Cứu Showroom & Điểm Bán Gần Nhất', W / 2, ctaY + 49);
        ctx.restore();

        // 9. Bottom Progress Bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, H - 4, W, 4);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(0, H - 4, (time / totalDuration) * W, 4);
    }
`;

// Replace old drawTikTokCanvasFrame implementation
const oldDrawFrameRegex = /function drawTikTokCanvasFrame\(\) \{[\s\S]*?ctx\.fillRect\(0, H - 4, \(frame % tiktokTotalFrames\) \/ tiktokTotalFrames \* W, 4\);\s*\}/;
const newDrawFrame = commercialRendererCode + `
    function drawTikTokCanvasFrame() {
        const canvas = document.getElementById('tiktok-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const p = tiktokCurrentProduct || featuredSpecialties[0];
        renderCommercialStudioVideo(ctx, canvas, p, tiktokCurrentFrame, tiktokTotalFrames, tiktokProductImage, tiktokCurrentStyle, tiktokAutoCaptions);
    }`;

if (oldDrawFrameRegex.test(js)) {
    js = js.replace(oldDrawFrameRegex, newDrawFrame);
    console.log('✓ Replaced drawTikTokCanvasFrame with clean commercialRendererCode');
} else {
    console.error('Could not match oldDrawFrameRegex!');
    process.exit(1);
}

// Replace old drawTikTokCanvasModalFrame implementation
const oldDrawModalFrameRegex = /function drawTikTokCanvasModalFrame\(\) \{[\s\S]*?ctx\.fillRect\(0, H - 4, \(frame % tiktokTotalFrames\) \/ tiktokTotalFrames \* W, 4\);\s*\}/;
const newDrawModalFrame = `function drawTikTokCanvasModalFrame() {
        const canvas = document.getElementById('tiktok-canvas-modal');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const p = tiktokCurrentProduct || featuredSpecialties[0];
        renderCommercialStudioVideo(ctx, canvas, p, modalCurrentFrame, tiktokTotalFrames, tiktokProductImage, tiktokCurrentStyle, tiktokAutoCaptions);
    }`;

if (oldDrawModalFrameRegex.test(js)) {
    js = js.replace(oldDrawModalFrameRegex, newDrawModalFrame);
    console.log('✓ Replaced drawTikTokCanvasModalFrame with clean commercialRendererCode');
} else {
    console.error('Could not match oldDrawModalFrameRegex!');
    process.exit(1);
}

// 8. Update runTikTokAnimationLoop & toggleTikTokVideoPlayback
const oldRunLoopRegex = /function runTikTokAnimationLoop\(\) \{[\s\S]*?tiktokAnimFrameId = requestAnimationFrame\(runTikTokAnimationLoop\);\s*\}/;
const newRunLoop = `function runTikTokAnimationLoop() {
        if (!isTikTokPlaying) return;
        tiktokCurrentFrame = (tiktokCurrentFrame + 1) % tiktokTotalFrames;
        drawTikTokCanvasFrame();

        const time = (tiktokCurrentFrame % tiktokTotalFrames) / 30;
        let sIdx = 0;
        if (time < 3.5) sIdx = 0;
        else if (time < 7.5) sIdx = 1;
        else if (time < 11.5) sIdx = 2;
        else sIdx = 3;

        if (sIdx !== tiktokLastSpokenScene) {
            tiktokLastSpokenScene = sIdx;
            const scr = document.getElementById('tiktok-script-output')?.value || '';
            const sents = getScriptSceneSentences(scr);
            if (sents[sIdx]) speakTikTokSentence(sents[sIdx]);
        }

        tiktokAnimFrameId = requestAnimationFrame(runTikTokAnimationLoop);
    }`;

if (oldRunLoopRegex.test(js)) {
    js = js.replace(oldRunLoopRegex, newRunLoop);
    console.log('✓ Updated runTikTokAnimationLoop with natural voice triggers');
} else {
    console.error('Could not match oldRunLoopRegex!');
    process.exit(1);
}

// Update toggleTikTokVideoPlayback
const oldTogglePlayRegex = /window\.toggleTikTokVideoPlayback = function \(\) \{[\s\S]*?txt\.textContent = '▶️ Phát \/ Xem Thử Video TikTok';\s*\}\s*\};/;
const newTogglePlay = `window.toggleTikTokVideoPlayback = function () {
        const playBtn = document.getElementById('btn-tiktok-play');
        const playTxt = document.getElementById('txt-tiktok-play');
        isTikTokPlaying = !isTikTokPlaying;

        if (isTikTokPlaying) {
            initTikTokAudioEngine();
            startTikTokBackgroundMusic();
            tiktokLastSpokenScene = -1;
            if (playTxt) playTxt.textContent = '⏸️ Tạm Dừng Video & Giọng Đọc';
            if (playBtn) playBtn.style.background = '#FEF08A';
            runTikTokAnimationLoop();
        } else {
            stopTikTokAudio();
            if (tiktokAnimFrameId) cancelAnimationFrame(tiktokAnimFrameId);
            if (playTxt) playTxt.textContent = '▶️ Phát / Xem Thử Video TikTok';
            if (playBtn) playBtn.style.background = '#E0F2FE';
        }
    };`;

if (oldTogglePlayRegex.test(js)) {
    js = js.replace(oldTogglePlayRegex, newTogglePlay);
    console.log('✓ Updated toggleTikTokVideoPlayback');
} else {
    console.error('Could not match oldTogglePlayRegex!');
    process.exit(1);
}

// 9. Update runTikTokModalLoop & toggleTikTokModalPlayback
const oldRunModalLoopRegex = /function runTikTokModalLoop\(\) \{[\s\S]*?modalAnimId = requestAnimationFrame\(runTikTokModalLoop\);\s*\}/;
const newRunModalLoop = `function runTikTokModalLoop() {
        if (!isModalPlaying) return;
        modalCurrentFrame = (modalCurrentFrame + 1) % tiktokTotalFrames;
        drawTikTokCanvasModalFrame();

        const time = (modalCurrentFrame % tiktokTotalFrames) / 30;
        let sIdx = 0;
        if (time < 3.5) sIdx = 0;
        else if (time < 7.5) sIdx = 1;
        else if (time < 11.5) sIdx = 2;
        else sIdx = 3;

        if (sIdx !== tiktokLastSpokenScene) {
            tiktokLastSpokenScene = sIdx;
            const scr = document.getElementById('tiktok-script-modal')?.value || '';
            const sents = getScriptSceneSentences(scr);
            if (sents[sIdx]) speakTikTokSentence(sents[sIdx]);
        }

        modalAnimId = requestAnimationFrame(runTikTokModalLoop);
    }`;

if (oldRunModalLoopRegex.test(js)) {
    js = js.replace(oldRunModalLoopRegex, newRunModalLoop);
    console.log('✓ Updated runTikTokModalLoop with natural voice triggers');
} else {
    console.error('Could not match oldRunModalLoopRegex!');
    process.exit(1);
}

// Update toggleTikTokModalPlayback
const oldToggleModalPlayRegex = /window\.toggleTikTokModalPlayback = function \(\) \{[\s\S]*?txt\.textContent = '▶️ Xem Thử Video';\s*\}\s*\};/;
const newToggleModalPlay = `window.toggleTikTokModalPlayback = function () {
        const playBtn = document.getElementById('btn-modal-play');
        const playTxt = document.getElementById('txt-modal-play');
        isModalPlaying = !isModalPlaying;

        if (isModalPlaying) {
            initTikTokAudioEngine();
            startTikTokBackgroundMusic();
            tiktokLastSpokenScene = -1;
            if (playTxt) playTxt.textContent = '⏸️ Tạm Dừng Video & Giọng Đọc';
            if (playBtn) playBtn.style.background = '#FEF08A';
            runTikTokModalLoop();
        } else {
            stopTikTokAudio();
            if (modalAnimId) cancelAnimationFrame(modalAnimId);
            if (playTxt) playTxt.textContent = '▶️ Xem Thử Video';
            if (playBtn) playBtn.style.background = '#E0F2FE';
        }
    };`;

if (oldToggleModalPlayRegex.test(js)) {
    js = js.replace(oldToggleModalPlayRegex, newToggleModalPlay);
    console.log('✓ Updated toggleTikTokModalPlayback');
} else {
    console.error('Could not match oldToggleModalPlayRegex!');
    process.exit(1);
}

// 10. Unified Video Exporter for downloadTikTokVideo & downloadTikTokModalVideo
const exporterCode = `
    function downloadTikTokVideoEngine(canvas, isModal) {
        if (!canvas) return;
        const downloadTxt = document.getElementById(isModal ? 'txt-modal-download' : 'txt-tiktok-download');
        const p = tiktokCurrentProduct || featuredSpecialties[0];

        if (typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
            alert('Trình duyệt của bạn không hỗ trợ MediaRecorder canvas. Vui lòng sử dụng Chrome, Edge hoặc Firefox!');
            if (downloadTxt) downloadTxt.textContent = '📥 Tải Video Về Máy (.WebM / .MP4)';
            return;
        }

        if (downloadTxt) downloadTxt.textContent = '⏳ Đang render video sạch 9:16...';

        initTikTokAudioEngine();
        startTikTokBackgroundMusic();

        const canvasStream = canvas.captureStream(30);
        let exportStream = canvasStream;

        if (tiktokAudioDest && tiktokAudioDest.stream && tiktokAudioDest.stream.getAudioTracks().length > 0) {
            try {
                exportStream = new MediaStream([
                    ...canvasStream.getVideoTracks(),
                    ...tiktokAudioDest.stream.getAudioTracks()
                ]);
            } catch (e) {
                exportStream = canvasStream;
            }
        }

        let mimeType = 'video/webm;codecs=vp9,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

        let chunks = [];
        let recorder = null;
        try {
            recorder = mimeType ? new MediaRecorder(exportStream, { mimeType }) : new MediaRecorder(exportStream);
        } catch (err) {
            recorder = new MediaRecorder(exportStream);
        }

        recorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            stopTikTokAudio();
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const safeName = (p.id || 'ocop-specialty').replace(/[^a-z0-9_-]/gi, '_');
            a.download = 'video-commercial-9-16-' + safeName + '.webm';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                if (downloadTxt) downloadTxt.textContent = '📥 Tải Video Về Máy (.WebM / .MP4)';
                if (typeof showToast === 'function') {
                    showToast('🎉 Đã tải video quảng cáo 9:16 thương mại thành công!', 'success');
                }
            }, 500);
        };

        recorder.start();

        const scrEl = document.getElementById(isModal ? 'tiktok-script-modal' : 'tiktok-script-output');
        const sents = getScriptSceneSentences(scrEl ? scrEl.value : '');

        let renderFrame = 0;
        let lastScene = -1;
        const renderInterval = setInterval(() => {
            if (renderFrame < tiktokTotalFrames) {
                if (isModal) {
                    modalCurrentFrame = renderFrame;
                    drawTikTokCanvasModalFrame();
                } else {
                    tiktokCurrentFrame = renderFrame;
                    drawTikTokCanvasFrame();
                }

                const time = renderFrame / 30;
                let sIdx = 0;
                if (time < 3.5) sIdx = 0;
                else if (time < 7.5) sIdx = 1;
                else if (time < 11.5) sIdx = 2;
                else sIdx = 3;

                if (sIdx !== lastScene) {
                    lastScene = sIdx;
                    if (sents[sIdx]) speakTikTokSentence(sents[sIdx]);
                }

                renderFrame++;
                if (downloadTxt && renderFrame % 30 === 0) {
                    const pct = Math.round((renderFrame / tiktokTotalFrames) * 100);
                    downloadTxt.textContent = '⏳ Đang dựng video: ' + pct + '%...';
                }
            } else {
                clearInterval(renderInterval);
                try { recorder.stop(); } catch (e) {}
            }
        }, 33);
    }

    window.downloadTikTokVideo = function () {
        const canvas = document.getElementById('tiktok-canvas');
        downloadTikTokVideoEngine(canvas, false);
    };

    window.downloadTikTokModalVideo = function () {
        const canvas = document.getElementById('tiktok-canvas-modal');
        downloadTikTokVideoEngine(canvas, true);
    };
`;

// Replace old downloadTikTokVideo
const oldDl1Idx = js.indexOf('window.downloadTikTokVideo = function ()');
const oldDl1End = js.indexOf('window.openTikTokUploadCenter = function ()', oldDl1Idx);
if (oldDl1Idx !== -1 && oldDl1End !== -1) {
    js = js.slice(0, oldDl1Idx) + exporterCode + '\n' + js.slice(oldDl1End);
    console.log('✓ Replaced downloadTikTokVideo with downloadTikTokVideoEngine');
} else {
    console.error('Could not find window.downloadTikTokVideo!');
    process.exit(1);
}

// 11. Also add voice selector and modern player frame into Admin Tab HTML
const oldAdminStyleSelect = `<div>
                            <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-film text-sky-600"></i> 2. Chọn Phong Cách Video TikTok:
                            </label>
                            <select id="tiktok-style-select" class="tiktok-select" onchange="onTikTokStyleChange()">
                                <option value="viral">🔥 Xu hướng Review Đặc Sản (Viral TikTok Hook & Taste)</option>
                                <option value="origin">🏡 Câu chuyện Nông sản & Nguồn gốc OCOP (Storytelling di sản)</option>
                                <option value="gift">🎁 Gợi ý Quà tặng & Kêu gọi truy cập Web (Quà biếu thượng hạng)</option>
                            </select>
                        </div>`;

const newAdminStyleSelect = oldAdminStyleSelect + `

                        <div>
                            <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                <i class="fa-solid fa-microphone-lines text-sky-600"></i> 3. Giọng Đọc Thuyết Minh AI (Voiceover Audio):
                            </label>
                            <select id="tiktok-voice-select" class="tiktok-select" onchange="onTikTokVoiceChange(this.value)">
                                <option value="female_natural">🎙️ Giọng Nữ AI Tự Nhiên (Truyền cảm)</option>
                                <option value="male_warm">🎙️ Giọng Nam AI (Ấm áp)</option>
                                <option value="music_only">🔇 Chỉ phát Nhạc nền nhẹ (Không lời thoại)</option>
                            </select>
                        </div>`;

if (js.includes(oldAdminStyleSelect)) {
    js = js.replace(oldAdminStyleSelect, newAdminStyleSelect);
    console.log('✓ Added voice selector to Admin Tab HTML');
}

// Remove tiktok-phone-island from Admin tab and modal
js = js.replace(/<div class="tiktok-phone-island"><\/div>/g, '');

// Also add voice selector into Modal HTML
const oldModalStyleSelect = `<div>
                                <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                    <i class="fa-solid fa-film text-sky-600"></i> Chọn Phong Cách Video TikTok:
                                </label>
                                <select id="tiktok-style-select-modal" class="tiktok-select" onchange="onTikTokModalStyleChange()">
                                    <option value="viral">🔥 Xu hướng Review Đặc Sản (Viral TikTok Hook & Taste)</option>
                                    <option value="origin">🏡 Câu chuyện Nông sản & Nguồn gốc OCOP (Storytelling di sản)</option>
                                    <option value="gift">🎁 Gợi ý Quà tặng & Kêu gọi truy cập Web (Quà biếu thượng hạng)</option>
                                </select>
                            </div>`;

const newModalStyleSelect = oldModalStyleSelect + `

                            <div>
                                <label class="block text-xs font-black text-sky-900 mb-1.5 flex items-center gap-1.5">
                                    <i class="fa-solid fa-microphone-lines text-sky-600"></i> Chọn Giọng Đọc Thuyết Minh AI:
                                </label>
                                <select id="tiktok-voice-select-modal" class="tiktok-select" onchange="onTikTokVoiceChange(this.value)">
                                    <option value="female_natural">🎙️ Giọng Nữ AI Tự Nhiên (Truyền cảm)</option>
                                    <option value="male_warm">🎙️ Giọng Nam AI (Ấm áp)</option>
                                    <option value="music_only">🔇 Chỉ phát Nhạc nền nhẹ (Không lời thoại)</option>
                                </select>
                            </div>`;

if (js.includes(oldModalStyleSelect)) {
    js = js.replace(oldModalStyleSelect, newModalStyleSelect);
    console.log('✓ Added voice selector to Modal HTML');
}

// Replace the old downloadTikTokModalVideo definition if it exists
const oldModalDlIdx = js.indexOf('window.downloadTikTokModalVideo = function ()');
if (oldModalDlIdx !== -1) {
    const nextFnIdx = js.indexOf('window.openTikTokUploadCenterModal = function ()', oldModalDlIdx);
    if (nextFnIdx !== -1) {
        js = js.slice(0, oldModalDlIdx) + js.slice(nextFnIdx);
        console.log('✓ Cleaned up redundant downloadTikTokModalVideo implementation');
    }
}

fs.writeFileSync('skytech-complete.js', js, 'utf8');
console.log('✓ Saved all clean studio & voiceover changes into skytech-complete.js');
