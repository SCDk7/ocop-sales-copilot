const test = require('node:test');
const assert = require('node:assert/strict');
const { mount } = require('./chat-dictation');

function setup() {
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
    const browser = { SpeechRecognition: Recognition, isSecureContext:true, setTimeout:()=>1, clearTimeout() {} };
    const dictation = mount({ input, button, status, browser, getLanguage:()=>language });
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
    assert.equal(s.button.attrs['aria-label'],'Type by voice');assert.equal(s.start().lang,'en-US');s.dictation.stop(true);
    s.browser.SpeechRecognition=undefined;s.start();assert.match(s.status.textContent,/does not support/);
    s.browser.SpeechRecognition=class {};s.browser.isSecureContext=false;s.start();assert.match(s.status.textContent,/HTTPS/);
});
