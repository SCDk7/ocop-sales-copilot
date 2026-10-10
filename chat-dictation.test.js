const test = require('node:test');
const assert = require('node:assert/strict');
const { mount, createTranscriber } = require('./chat-dictation');
const fs=require('node:fs'),vm=require('node:vm');

test('local preview API requests use the Node server while explicit and deployed origins are preserved',()=>{
 const source=fs.readFileSync('index.html','utf8');
 const start=source.indexOf('        function getAIEndpoint(path) {');
 const end=source.indexOf('        const maxAIChatImages',start);
 const context={URL,window:{location:{protocol:'http:',hostname:'127.0.0.1',port:'5500'}},document:{querySelector:()=>({content:''})}};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);
 assert.equal(context.getAIEndpoint('/api/ai/transcribe'),'http://localhost:3000/api/ai/transcribe');
 context.window.location={protocol:'https:',hostname:'shop.example.com',port:''};
 assert.equal(context.getAIEndpoint('/api/ai/transcribe'),'/api/ai/transcribe');
 context.document.querySelector=()=>({content:'https://api.example.com/'});
 assert.equal(context.getAIEndpoint('/api/ai/transcribe'),'https://api.example.com/api/ai/transcribe');
});

test('transcription handles an HTML error page without exposing a JSON parser exception',async()=>{
 const transcribe=createTranscriber(()=>'/api/ai/transcribe',async()=>({ok:false,json:async()=>{throw new SyntaxError('Unexpected token <');}}));
 await assert.rejects(transcribe(new Blob(['audio'],{type:'audio/webm'}),{language:'vi',signal:new AbortController().signal}),/chưa có dịch vụ giọng nói/);
 const success=createTranscriber(()=>'/api/ai/transcribe',async()=>({ok:true,json:async()=>({transcription:'tìm trà'})}));
 assert.equal(await success(new Blob(['audio']),{language:'vi',signal:new AbortController().signal}),'tìm trà');
});

function setup(options={}) {
    class Element extends EventTarget {
        constructor() { super(); this.value = ''; this.attrs = {}; this.classList = { toggle() {} }; }
        setAttribute(name, value) { this.attrs[name] = value; }
    }
    class Recognition {
        constructor() { Recognition.latest = this; }
        start() { this.onstart(); }
        stop() { this.stopped = true; }
        abort() { this.aborted = true; this.onend(); }
        result(...phrases) { this.onresult({ results: phrases.map(transcript => [{ transcript }]) }); }
    }
    const input = new Element(), button = new Element(), status = new Element();
    let language = 'vi';
    const browser = { SpeechRecognition: Recognition, isSecureContext:true, setTimeout:()=>1, clearTimeout() {},...options.browser };
    const dictation = mount({ input, button, status, browser, getLanguage:()=>language,transcribe:options.transcribe,...options.mountOptions });
    return { input, button, status, dictation, browser, start:()=>{
        button.dispatchEvent(new Event('click')); return Recognition.latest;
    }, setLanguage:value=>language=value };
}

test('dictation revises interim text without duplication and preserves existing draft', () => {
    const s=setup(); s.input.value='Tìm quà';const r=s.start();
    assert.equal(r.lang,'vi-VN');assert.equal(s.button.attrs['aria-pressed'],'true');
    r.result('dưới năm');r.result('dưới năm trăm nghìn','ở miền Tây');
    assert.equal(s.input.value,'Tìm quà dưới năm trăm nghìn ở miền Tây');
    s.button.dispatchEvent(new Event('click'));assert.equal(r.stopped,true);
    r.result('dưới 500 nghìn','ở miền Tây');r.onend();
    assert.equal(s.input.value,'Tìm quà dưới 500 nghìn ở miền Tây');
    assert.equal(s.button.attrs['aria-pressed'],'false');
    assert.match(s.status.textContent,/sửa rồi nhấn gửi/);
});

function recordingSetup(transcribe,mountOptions) {
 let trackStopped=false;
 class Recorder {
  static isTypeSupported(type){return type.startsWith('audio/webm');}
  constructor(){Recorder.latest=this;this.state='inactive';this.mimeType='audio/webm';}
  start(){this.state='recording';}
  stop(){this.state='inactive';this.ondataavailable({data:new Blob(['audio'])});this.onstop();}
 }
 const state=setup({transcribe,mountOptions,browser:{MediaRecorder:Recorder,Blob,AbortController,navigator:{mediaDevices:{getUserMedia:async()=>({getTracks:()=>[{stop(){trackStopped=true;}}]})}}}});
 return {...state,recorder:()=>Recorder.latest,trackStopped:()=>trackStopped};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));

test('voice search uses backend recording, replaces the old query and releases the mic before searching',async()=>{
 let searched;
 const s=recordingSetup(async()=> 'trà Đồng Nai',{replaceExisting:true,recordingLimitMs:15000,onTranscript:value=>{assert(s.trackStopped());searched=value;}});
 s.input.value='cà phê';s.start();await flush();s.button.dispatchEvent(new Event('click'));await flush();
 assert.equal(s.input.value,'trà Đồng Nai');assert.equal(searched,'trà Đồng Nai');
});
test('single-utterance search does not restart browser recognition or append an old query',()=>{
 let searched;
 const s=setup({mountOptions:{singleUtterance:true,replaceExisting:true,onTranscript:value=>searched=value}});
 s.input.value='mật ong';const recognition=s.start();assert.equal(recognition.continuous,false);
 recognition.result('hạt điều');recognition.onend();assert.equal(searched,'hạt điều');assert.equal(s.input.value,'hạt điều');assert.equal(s.button.attrs['aria-pressed'],'false');
});
test('failed backend voice search keeps the old query and never triggers a search',async()=>{
 let searched=false;
 const s=recordingSetup(async()=>{throw Error('Voice service unavailable');},{replaceExisting:true,onTranscript:()=>searched=true});
 s.input.value='trà';s.start();await flush();s.button.dispatchEvent(new Event('click'));await flush();
 assert.equal(s.input.value,'trà');assert.equal(searched,false);assert(s.trackStopped());
});

test('two taps record and transcribe through the backend without browser speech recognition',async()=>{
 let calls=0;
 const s=recordingSetup(async(audio,{language})=>{calls++;assert(audio.size>0);assert.equal(language,'vi');return 'tìm trà Hà Nội';});
 s.input.value='Xin';s.start();await flush();
 assert.equal(s.recorder().state,'recording');assert.equal(s.button.attrs['aria-pressed'],'true');
 s.button.dispatchEvent(new Event('click'));await flush();
 assert.equal(calls,1);assert.equal(s.input.value,'Xin tìm trà Hà Nội');assert(s.trackStopped());assert.equal(s.button.attrs['aria-pressed'],'false');
});

test('cancel while awaiting transcription aborts upload and prevents late text overwriting an edit',async()=>{
 let complete,signal;
 const s=recordingSetup((_audio,options)=>{signal=options.signal;return new Promise(resolve=>complete=resolve);});
 s.start();await flush();s.button.dispatchEvent(new Event('click'));await flush();
 s.input.value='khách sửa';s.input.dispatchEvent(new Event('input'));
 complete('late transcript');await flush();
 assert.equal(s.input.value,'khách sửa');assert(signal.aborted);assert(s.trackStopped());
});

test('cancel before permission resolves releases the microphone without recording',async()=>{
 let permit;
 const s=recordingSetup(async()=>{throw Error('Must not transcribe');});
 s.browser.navigator.mediaDevices.getUserMedia=()=>new Promise(resolve=>permit=resolve);
 s.start();s.dictation.stop(true);
 let stopped=false;permit({getTracks:()=>[{stop(){stopped=true;}}]});await flush();
 assert(stopped);assert.equal(s.button.attrs['aria-pressed'],'false');
});

test('cancel for sending and manual editing ignores late results', () => {
    const s=setup(),r=s.start();r.result('trà Hà Giang');s.dictation.stop(true);s.input.value='';
    r.result('late response');assert.equal(s.input.value,'');assert.equal(r.aborted,true);
    const next=s.start();next.result('gạo');s.input.value='khách sửa';s.input.dispatchEvent(new Event('input'));
    next.result('ghi đè');assert.equal(s.input.value,'khách sửa');assert.equal(next.aborted,true);
});

test('permission failure releases microphone state and keeps the draft', () => {
    const s=setup();s.input.value='giữ văn bản';const r=s.start();
    r.onerror({error:'not-allowed'});
    assert.equal(s.input.value,'giữ văn bản');assert.equal(s.button.attrs['aria-pressed'],'false');
    assert.match(s.status.textContent,/chưa cấp quyền micro/);assert.equal(r.aborted,true);
});

test('English recognition, unsupported browsers and insecure pages show correct status', () => {
    const s=setup();s.setLanguage('en');s.dictation.refreshLabels();
    assert.equal(s.button.attrs['aria-label'],'Tap once to type by voice');assert.equal(s.start().lang,'en-US');s.dictation.stop(true);
    s.browser.SpeechRecognition=undefined;s.start();assert.match(s.status.textContent,/does not support/);
    s.browser.SpeechRecognition=class {};s.browser.isSecureContext=false;s.start();assert.match(s.status.textContent,/HTTPS/);
});
test('a single tap keeps listening across phone pauses; the second tap stops without restarting',()=>{
 const s=setup();let restart;
 s.browser.setTimeout=callback=>{restart=callback;return 1};
 const r=s.start();r.result('tìm trà');r.onend();
 assert.equal(s.button.attrs['aria-pressed'],'true');restart();r.result('Hà Giang');
 assert.equal(s.input.value,'tìm trà Hà Giang');
 s.button.dispatchEvent(new Event('click'));assert.equal(r.stopped,true);r.onend();
 assert.equal(s.button.attrs['aria-pressed'],'false');
 restart();assert.equal(s.button.attrs['aria-pressed'],'false');assert.equal(s.input.value,'tìm trà Hà Giang');
});
