(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ChatDictation = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function mount({ input, button, status, getLanguage, browser = window }) {
        let session = null;
        const english = () => getLanguage() === 'en';
        const text = (vi, en) => english() ? en : vi;
        const announce = message => {
            status.textContent = message;
            status.hidden = !message;
        };
        function refreshLabels() {
            const label = session
                ? text('Dừng nhập bằng giọng nói', 'Stop voice input')
                : text('Nhập bằng giọng nói', 'Type by voice');
            button.title = label;
            button.setAttribute('aria-label', label);
            button.setAttribute('aria-pressed', String(!!session));
            button.classList.toggle('is-listening', !!session);
            button.innerHTML = session
                ? '<i class="fa-solid fa-stop text-xs" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-microphone text-sm" aria-hidden="true"></i>';
        }
        function finish(active) {
            browser.clearTimeout(active.timer);
            if (session === active) { session = null; refreshLabels(); }
        }
        function stop(cancel = false) {
            if (!session) return;
            const active = session;
            if (cancel) {
                // Ignore late results after sending, editing or closing the chat.
                finish(active);
                try { active.recognition.abort(); } catch (_) {}
                announce('');
            } else {
                announce(text('Đang hoàn tất văn bản…', 'Finishing transcription…'));
                try { active.recognition.stop(); } catch (_) { finish(active); announce(''); }
            }
        }
        function start() {
            if (session) { stop(); return; }
            const Recognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;
            if (!Recognition) {
                announce(text('Trình duyệt chưa hỗ trợ nhập giọng nói. Bạn có thể thử Chrome hoặc nhập văn bản.', 'This browser does not support voice input. Try Chrome or type your message.'));
                return;
            }
            if (browser.isSecureContext === false) {
                announce(text('Hãy mở trang bằng HTTPS để sử dụng micro.', 'Open this page over HTTPS to use the microphone.'));
                return;
            }
            let recognition;
            try { recognition = new Recognition(); }
            catch (_) { announce(text('Không thể bật micro. Vui lòng thử lại.', 'Could not start the microphone. Please try again.')); return; }
            const active = { recognition, prefix: input.value.trimEnd(), received: false, error: false, timer: null };
            session = active;
            recognition.lang = english() ? 'en-US' : 'vi-VN';
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            recognition.onstart = () => {
                if (session !== active) return;
                announce(text('Đang nghe… Nhấn micro lần nữa để dừng, rồi kiểm tra và gửi văn bản.', 'Listening… Tap the microphone again to stop, then review and send your text.'));
                active.timer = browser.setTimeout(() => { if (session === active) stop(); }, 60000);
            };
            recognition.onresult = event => {
                if (session !== active) return;
                // Each event contains the session's full results, including revised interim text.
                const transcript = Array.from(event.results, result => result[0]?.transcript || '').join(' ').trim();
                if (!transcript) return;
                active.received = true;
                input.value = [active.prefix, transcript].filter(Boolean).join(' ');
                input.scrollLeft = input.scrollWidth;
            };
            recognition.onerror = event => {
                if (session !== active) return;
                active.error = true;
                const messages = {
                    'not-allowed': text('Bạn chưa cấp quyền micro. Hãy cho phép micro trong cài đặt trình duyệt rồi thử lại.', 'Microphone access was denied. Allow it in your browser settings and try again.'),
                    'service-not-allowed': text('Trình duyệt không cho phép nhận dạng giọng nói. Vui lòng kiểm tra quyền micro.', 'Speech recognition is not allowed. Check your microphone permissions.'),
                    'audio-capture': text('Không tìm thấy micro khả dụng. Vui lòng kiểm tra thiết bị.', 'No available microphone was found. Check your device.'),
                    'no-speech': text('Chưa nghe rõ giọng nói. Nhấn micro để thử lại.', 'No speech was detected. Tap the microphone to try again.'),
                    'network': text('Kết nối nhận dạng giọng nói bị gián đoạn. Vui lòng thử lại.', 'The speech recognition connection failed. Please try again.')
                };
                announce(messages[event.error] || text('Không thể nhận dạng giọng nói. Bạn vẫn có thể nhập văn bản.', 'Speech recognition failed. You can still type your message.'));
                finish(active);
                try { recognition.abort(); } catch (_) {}
            };
            recognition.onend = () => {
                if (session !== active) return;
                finish(active);
                announce(active.received
                    ? text('Đã chuyển thành văn bản. Bạn có thể sửa rồi nhấn gửi.', 'Transcribed. Edit your text if needed, then press send.')
                    : text('Chưa nhận được giọng nói. Nhấn micro để thử lại.', 'No speech received. Tap the microphone to try again.'));
            };
            refreshLabels();
            announce(text('Đang mở micro…', 'Starting microphone…'));
            try { recognition.start(); }
            catch (_) { finish(active); announce(text('Không thể bật micro. Vui lòng thử lại.', 'Could not start the microphone. Please try again.')); }
        }
        const onEdit = () => stop(true);
        const onHide = () => { if (browser.document?.hidden) stop(true); };
        button.addEventListener('click', start);
        input.addEventListener('input', onEdit);
        browser.document?.addEventListener('visibilitychange', onHide);
        refreshLabels();
        return { stop, refreshLabels, destroy() {
            stop(true);
            button.removeEventListener('click', start);
            input.removeEventListener('input', onEdit);
            browser.document?.removeEventListener('visibilitychange', onHide);
        } };
    }
    return { mount };
});
