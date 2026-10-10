(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ChatDictation = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function mount({ input, button, status, getLanguage, transcribe, onTranscript, onStatus, replaceExisting = false, singleUtterance = false, recordingLimitMs = 120000, browser = window }) {
        let session = null;
        const english = () => getLanguage() === 'en';
        const text = (vi, en) => english() ? en : vi;
        const announce = message => {
            status.textContent = message;
            status.hidden = !message;
            if (onStatus && message) onStatus(message);
        };
        function refreshLabels() {
            const label = session
                ? text('Bấm để kết thúc nhận dạng giọng nói', 'Tap to finish voice input')
                : text('Bấm một lần để nhập bằng giọng nói', 'Tap once to type by voice');
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
            active.stream?.getTracks().forEach(track => track.stop());
            if (session === active) { session = null; refreshLabels(); }
        }
        function stop(cancel = false) {
            if (!session) return;
            const active = session;
            if (active.mode === 'recording') {
                if (cancel) {
                    finish(active);
                    active.controller.abort();
                    if (active.recorder?.state === 'recording') active.recorder.stop();
                    announce('');
                } else if (!active.stopping) {
                    active.stopping = true;
                    browser.clearTimeout(active.timer);
                    announce(text('Đang chuyển giọng nói thành văn bản…', 'Transcribing your voice…'));
                    if (active.recorder?.state === 'recording') active.recorder.stop();
                }
                return;
            }
            if (cancel) {
                // Ignore late results after sending, editing or closing the chat.
                finish(active);
                try { active.recognition.abort(); } catch (_) {}
                announce('');
            } else {
                if (active.stopping) return;
                active.stopping = true;
                browser.clearTimeout(active.timer);
                announce(text('Đang hoàn tất văn bản…', 'Finishing transcription…'));
                try { active.recognition.stop(); } catch (_) { finish(active); announce(''); }
            }
        }
        async function startRecording() {
            const active = {mode:'recording',prefix:replaceExisting ? '' : input.value.trimEnd(),controller:new browser.AbortController(),timer:null,stopping:false};
            session=active;refreshLabels();
            announce(text('Đang mở micro để ghi âm…', 'Opening the microphone to record…'));
            try {
                const stream=await browser.navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});
                if (session!==active) {stream.getTracks().forEach(track=>track.stop());return;}
                active.stream=stream;
                const mimeType=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(type=>browser.MediaRecorder.isTypeSupported(type));
                const recorder=new browser.MediaRecorder(stream,{...(mimeType?{mimeType}:{}),audioBitsPerSecond:32000});
                active.recorder=recorder;
                const chunks=[];
                const language=getLanguage();
                recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
                recorder.onerror=()=>{if(session===active){finish(active);announce(text('Không ghi âm được. Hãy kiểm tra micro rồi thử lại.', 'Recording failed. Check your microphone and try again.'));}};
                recorder.onstop=async()=>{
                    stream.getTracks().forEach(track=>track.stop());
                    if(session!==active)return;
                    active.stopping=true;browser.clearTimeout(active.timer);
                    announce(text('Đang chuyển giọng nói thành văn bản…', 'Transcribing your voice…'));
                    try {
                        const audio=new browser.Blob(chunks,{type:recorder.mimeType || mimeType || 'audio/webm'});
                        if(!audio.size)throw Error(text('Chưa thu được âm thanh. Bấm micro để thử lại.', 'No audio recorded. Tap the microphone to try again.'));
                        const transcript=await transcribe(audio,{language,signal:active.controller.signal});
                        if(session!==active)return;
                        if(!transcript?.trim())throw Error(text('Chưa nghe rõ lời nói. Bấm micro để thử lại.', 'No clear speech detected. Tap the microphone to try again.'));
                        input.value=[active.prefix,transcript.trim()].filter(Boolean).join(' ');
                        finish(active);
                        announce(text('Đã chuyển thành văn bản. Bạn có thể sửa rồi nhấn gửi.', 'Transcribed. Edit your text if needed, then press send.'));
                        if (onTranscript) onTranscript(input.value);
                    }catch(error){if(session===active){finish(active);announce(error.message || text('Không chuyển được giọng nói. Vui lòng thử lại.', 'Transcription failed. Please try again.'));}}
                };
                recorder.start();
                announce(text('Đang ghi âm… Bấm micro lần nữa để dừng và chuyển thành văn bản.', 'Recording… Tap the microphone again to stop and transcribe.'));
                active.timer=browser.setTimeout(()=>stop(),recordingLimitMs);
                if(active.stopping)recorder.stop();
            }catch(error){
                if(session!==active)return;
                finish(active);
                announce(error.name==='NotAllowedError'
                    ? text('Bạn chưa cấp quyền micro. Hãy cho phép micro trong trình duyệt rồi thử lại.', 'Microphone access was denied. Allow it in your browser settings and try again.')
                    : text('Không mở được micro. Hãy kiểm tra thiết bị và quyền micro.', 'Could not open the microphone. Check your device and microphone permissions.'));
            }
        }
        function start() {
            if (session) { stop(); return; }
            if(transcribe && browser.MediaRecorder && browser.navigator?.mediaDevices?.getUserMedia && browser.isSecureContext!==false){
                startRecording();return;
            }
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
            const active = { recognition, prefix: replaceExisting ? '' : input.value.trimEnd(), received: false, error: false, stopping: false, timer: null };
            session = active;
            recognition.lang = english() ? 'en-US' : 'vi-VN';
            recognition.continuous = !singleUtterance;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            recognition.onstart = () => {
                if (session !== active) return;
                announce(text('Đang nghe… Nhấn micro lần nữa để dừng, rồi kiểm tra và gửi văn bản.', 'Listening… Tap the microphone again to stop, then review and send your text.'));
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
                if (event.error === 'no-speech' && !active.stopping) return;
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
                if (!active.stopping && !active.error && !singleUtterance) {
                    // Some phone browsers end recognition after a pause even in continuous mode.
                    // Keep the toggle active and preserve the completed text across restarts.
                    active.prefix = input.value.trimEnd();
                    active.timer = browser.setTimeout(() => {
                        if (session !== active || active.stopping) return;
                        try { recognition.start(); }
                        catch (_) { finish(active); announce(text('Không thể tiếp tục nhận dạng. Nhấn micro để thử lại.', 'Could not continue recognition. Tap the microphone to try again.')); }
                    }, 300);
                    return;
                }
                finish(active);
                announce(active.received
                    ? text('Đã chuyển thành văn bản. Bạn có thể sửa rồi nhấn gửi.', 'Transcribed. Edit your text if needed, then press send.')
                    : text('Chưa nhận được giọng nói. Nhấn micro để thử lại.', 'No speech received. Tap the microphone to try again.'));
                if (active.received && !active.error && onTranscript) onTranscript(input.value);
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
    function createTranscriber(getEndpoint, fetcher = fetch) {
        return async (audio, {language, signal}) => {
            const english=language==='en';
            const generic=english?'Voice transcription failed. Please try again.':'Không chuyển được giọng nói. Bạn thử lại nhé.';
            const response=await fetcher(getEndpoint()+'?language='+encodeURIComponent(language),{
                method:'POST',headers:{'Content-Type':audio.type},body:audio,
                signal:AbortSignal.any([signal,AbortSignal.timeout(30000)])
            });
            let result;
            try { result=await response.json(); }
            catch (_) {
                throw Error(english
                    ? 'The voice service is not available at this address. Open the server demo or update the website backend.'
                    : 'Địa chỉ này chưa có dịch vụ giọng nói. Bạn mở demo ở localhost:3000 hoặc cập nhật máy chủ website nhé.');
            }
            if(!response.ok)throw Error(typeof result.error==='string'?result.error:generic);
            if(typeof result.transcription!=='string')throw Error(generic);
            return result.transcription;
        };
    }
    return { mount, createTranscriber };
});
