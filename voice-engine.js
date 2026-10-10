(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.VoiceEngine = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    let activeUtterance = null;
    let activeTypewriter = null;

    /**
     * Chuẩn hóa và làm mượt câu từ (Natural Prosody & Phrasing Preprocessor)
     * Mở rộng các từ viết tắt kỹ thuật, ký hiệu tiền tệ, phần trăm và nhịp thở tự nhiên.
     */
    function preprocessSpeechText(text, language = 'vi') {
        if (!text || typeof text !== 'string') return '';

        let processed = text;

        // 1. Loại bỏ các thẻ HTML và markdown formatting
        processed = processed.replace(/<[^>]*>/g, ' ');
        processed = processed.replace(/\*\*([^*]+)\*\*/g, '$1');
        processed = processed.replace(/\*([^*]+)\*/g, '$1');
        processed = processed.replace(/__([^_]+)__/g, '$1');
        processed = processed.replace(/_([^_]+)_/g, '$1');
        processed = processed.replace(/[#★⭐🎁🍵💰📦↩️📞✨●•]/g, ' ');
        processed = processed.replace(/!+/g, '.');

        if (language === 'vi') {
            // 2. Chuyển đổi từ viết tắt sang ngữ điệu đọc tự nhiên
            processed = processed.replace(/\bOCOP\b/gi, 'Ô Cốp');
            processed = processed.replace(/\bHTX\b/gi, 'Hợp tác xã');
            processed = processed.replace(/\bCOGS\b/gi, 'chi phí giá vốn nhập hàng');
            processed = processed.replace(/\bOPEX\b/gi, 'chi phí vận hành nền tảng');
            processed = processed.replace(/\bCHM\b/gi, 'chiết khấu hoa hồng hệ thống');
            processed = processed.replace(/\bGMV\b/gi, 'tổng giá trị giao dịch');
            processed = processed.replace(/\bB2B2C\b/gi, 'B hai B hai C');
            processed = processed.replace(/\bO2O\b/gi, 'Online to Offline');
            processed = processed.replace(/\bMVP\b/gi, 'M V P');
            processed = processed.replace(/\bQR\b/gi, 'Q R');
            processed = processed.replace(/\bAI\b/gi, 'A I');
            processed = processed.replace(/\bVAT\b/gi, 'V A T');
            processed = processed.replace(/\bOCR\b/gi, 'O C R');

            // 3. Chuẩn hóa số thập phân và phần trăm
            processed = processed.replace(/(\d+)\.(\d+)\s*%/g, '$1 phẩy $2 phần trăm');
            processed = processed.replace(/(\d+)\s*%/g, '$1 phần trăm');

            // 4. Chuẩn hóa tiền tệ & đơn vị tính
            processed = processed.replace(/(\d[\d\.]*)\s*(?:đ|₫|VNĐ|vnd)(?=[^\w]|$)/gi, '$1 đồng');
            processed = processed.replace(/(\d[\d\.]*)\s*tr(?:iệu)?\b/gi, '$1 triệu');
            processed = processed.replace(/(\d[\d\.]*)\s*k\b/gi, '$1 nghìn');

            // 5. Thêm nhịp thở ngắt nghỉ tự nhiên sau các vế câu
            processed = processed.replace(/;\s*/g, ', ');
            processed = processed.replace(/:\s*/g, ' là: ');
        } else {
            processed = processed.replace(/\bOCOP\b/gi, 'O C O P');
            processed = processed.replace(/\bCOGS\b/gi, 'Cost of goods sold');
            processed = processed.replace(/\bOPEX\b/gi, 'Operating expenses');
            processed = processed.replace(/\bCHM\b/gi, 'Commission system');
            processed = processed.replace(/(\d+)\s*(?:đ|₫|VNĐ|vnd)\b/gi, '$1 Vietnam Dong');
        }

        // 6. Xóa bỏ khoảng trắng thừa
        return processed.replace(/\s+/g, ' ').trim();
    }

    /**
     * Phân loại và tìm kiếm Giọng đọc Neural AI thế hệ mới (3 miền Bắc - Trung - Nam)
     */
    function detectBestVoice(options = {}, browserVoices = []) {
        const { lang = 'vi', region = 'nam' } = options;
        const targetPrefix = lang === 'en' ? 'en' : 'vi';

        const matchingVoices = (browserVoices || []).filter(v => v.lang && v.lang.toLowerCase().startsWith(targetPrefix));
        if (!matchingVoices.length) return null;

        // Tiêu chí nhận diện giọng Neural AI chất lượng cao
        const isNeuralVoice = voice => {
            const name = (voice.name || '').toLowerCase();
            return /neural|natural|online|wavenet|journey|premium|high-quality|hoaimy|namminh|google|microsoft/i.test(name);
        };

        const neuralVoices = matchingVoices.filter(isNeuralVoice);

        if (lang === 'vi') {
            // Helper để loại bỏ từ 'vietnam' tránh nhận nhầm chữ 'nam' trong 'vietnam'
            const getRegionalKey = (voice) => (voice.name || '').replace(/vietnam(?:ese)?/gi, '');

            // Lọc theo 3 miền:
            if (region === 'nam') {
                // Miền Nam: Nam Minh, Southern, Sài Gòn, hoặc giọng ấm áp
                const southern = neuralVoices.find(v => /\bnam\b|namminh|southern|saigon|\bminh\b/i.test(getRegionalKey(v)));
                if (southern) return { voice: southern, isNeural: true, pitch: 1.0, rate: 0.95, region: 'nam' };
            } else if (region === 'trung') {
                // Miền Trung: tone mộc mạc, truyền cảm
                const central = neuralVoices.find(v => /\btrung\b|central|hue|danang/i.test(getRegionalKey(v)));
                if (central) return { voice: central, isNeural: true, pitch: 0.98, rate: 0.93, region: 'trung' };
            } else if (region === 'bac') {
                // Miền Bắc: Hoài My, Northern, Hà Nội
                const northern = neuralVoices.find(v => /\bbac\b|northern|hanoi|hoaimy|\bmy\b/i.test(getRegionalKey(v)));
                if (northern) return { voice: northern, isNeural: true, pitch: 1.02, rate: 0.96, region: 'bac' };
            }

            // Nếu có giọng Neural tiếng Việt chung
            if (neuralVoices.length > 0) {
                const pitchMap = { bac: 1.02, trung: 0.98, nam: 1.0 };
                const rateMap = { bac: 0.96, trung: 0.93, nam: 0.95 };
                return {
                    voice: neuralVoices[0],
                    isNeural: true,
                    pitch: pitchMap[region] || 1.0,
                    rate: rateMap[region] || 0.95,
                    region
                };
            }
        } else {
            // Tiếng Anh
            if (neuralVoices.length > 0) {
                return { voice: neuralVoices[0], isNeural: true, pitch: 1.0, rate: 0.98, region: 'en' };
            }
        }

        // Fallback voice (giọng mặc định của hệ thống)
        return {
            voice: matchingVoices[0],
            isNeural: false,
            pitch: 1.0,
            rate: 0.95,
            region
        };
    }

    /**
     * Kiểm tra xem hệ thống có sẵn giọng đọc Neural AI mượt mà không
     */
    function isNeuralAvailable(browser = (typeof window !== 'undefined' ? window : null)) {
        if (!browser || !browser.speechSynthesis) return false;
        try {
            const voices = browser.speechSynthesis.getVoices() || [];
            return voices.some(v => v.lang && v.lang.toLowerCase().startsWith('vi') &&
                /neural|natural|online|wavenet|journey|premium|google|microsoft/i.test(v.name));
        } catch (_) {
            return false;
        }
    }

    /**
     * Hiệu ứng gõ chữ mượt mà (Smooth Typewriter Fallback Engine)
     * Tự động kích hoạt khi không có giọng Neural để bảo toàn trải nghiệm cao cấp.
     */
    function typewrite(element, text, options = {}) {
        if (!element || !text) return;
        const {
            speed = 18, // ms per step
            chunkSize = 3, // số từ hoặc ký tự mỗi nhịp
            onComplete = null,
            browser = (typeof window !== 'undefined' ? window : globalThis)
        } = options;

        if (activeTypewriter) {
            browser.clearInterval(activeTypewriter.timer);
            activeTypewriter = null;
        }

        element.innerHTML = '';
        const words = text.split(' ');
        let currentIndex = 0;

        const session = {
            timer: browser.setInterval(() => {
                if (currentIndex < words.length) {
                    const nextBatch = words.slice(currentIndex, currentIndex + chunkSize).join(' ');
                    element.innerHTML += (currentIndex === 0 ? '' : ' ') + nextBatch;
                    currentIndex += chunkSize;
                } else {
                    browser.clearInterval(session.timer);
                    if (activeTypewriter === session) activeTypewriter = null;
                    if (typeof onComplete === 'function') onComplete();
                }
            }, speed)
        };

        activeTypewriter = session;
        return session;
    }

    /**
     * Dừng phát giọng nói và dừng gõ chữ ngay lập tức
     */
    function stop(browser = (typeof window !== 'undefined' ? window : null)) {
        if (browser && browser.speechSynthesis) {
            try { browser.speechSynthesis.cancel(); } catch (_) {}
        }
        activeUtterance = null;
        if (activeTypewriter) {
            try { (typeof window !== 'undefined' ? window : globalThis).clearInterval(activeTypewriter.timer); } catch (_) {}
            activeTypewriter = null;
        }
    }

    /**
     * Phát giọng đọc Neural AI với cơ chế dự phòng tự động (Fallback Mechanism)
     */
    function speak(text, options = {}) {
        const browser = options.browser || (typeof window !== 'undefined' ? window : null);
        if (!browser || !browser.speechSynthesis) {
            if (typeof options.onFallback === 'function') {
                options.onFallback({ reason: 'no_speech_synthesis', text });
            }
            return false;
        }

        stop(browser);

        const lang = options.lang || 'vi';
        const region = options.region || 'nam';
        const forceVoice = options.forceVoice || false;
        const cleanedText = preprocessSpeechText(text, lang);

        let voices = [];
        try { voices = browser.speechSynthesis.getVoices() || []; } catch (_) {}

        const voiceSelection = detectBestVoice({ lang, region }, voices);

        // NGUYÊN TẮC QUAN TRỌNG: Nếu không có giọng Neural và không ép buộc phát,
        // kích hoạt chế độ Fallback sang văn bản mượt mà thay vì phát giọng robot thô cứng!
        if ((!voiceSelection || !voiceSelection.isNeural) && !forceVoice) {
            if (typeof options.onFallback === 'function') {
                options.onFallback({
                    reason: 'no_neural_voice',
                    text: cleanedText,
                    originalText: text
                });
                return false;
            }
        }

        if (!voiceSelection) {
            if (typeof options.onError === 'function') options.onError(new Error('No matching voice'));
            return false;
        }

        try {
            const SpeechUtterance = browser.SpeechSynthesisUtterance || globalThis.SpeechSynthesisUtterance;
            if (!SpeechUtterance) {
                if (typeof options.onFallback === 'function') options.onFallback({ reason: 'no_utterance', text });
                return false;
            }

            const utterance = new SpeechUtterance(cleanedText);
            utterance.voice = voiceSelection.voice;
            utterance.lang = voiceSelection.voice.lang || (lang === 'en' ? 'en-US' : 'vi-VN');
            utterance.rate = voiceSelection.rate || 0.95;
            utterance.pitch = voiceSelection.pitch || 1.0;

            utterance.onstart = () => {
                if (typeof options.onStart === 'function') options.onStart(voiceSelection);
            };

            utterance.onend = () => {
                activeUtterance = null;
                if (typeof options.onEnd === 'function') options.onEnd();
            };

            utterance.onerror = (e) => {
                activeUtterance = null;
                if (typeof options.onError === 'function') options.onError(e);
                if (typeof options.onFallback === 'function') {
                    options.onFallback({ reason: 'speech_error', error: e, text: cleanedText });
                }
            };

            activeUtterance = utterance;
            browser.speechSynthesis.speak(utterance);
            return true;
        } catch (err) {
            if (typeof options.onFallback === 'function') {
                options.onFallback({ reason: 'exception', error: err, text: cleanedText });
            }
            return false;
        }
    }

    return {
        preprocessSpeechText,
        detectBestVoice,
        isNeuralAvailable,
        typewrite,
        speak,
        stop
    };
});
