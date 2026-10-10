const test = require('node:test');
const assert = require('node:assert/strict');
const VoiceEngine = require('./voice-engine.js');

test('preprocessSpeechText converts technical acronyms, currency and percentages to natural speech', () => {
  const raw = '**OCOP** 5 sao từ HTX Kim Sơn, giá 150.000đ/hộp, COGS 90.000đ, OPEX 6%, CHM 5%, Net Profit tăng 12.5%!';
  const processed = VoiceEngine.preprocessSpeechText(raw, 'vi');

  // Should remove markdown bold asterisks
  assert.ok(!processed.includes('**'));
  assert.ok(!processed.includes('!'));

  // Should expand abbreviations
  assert.ok(processed.includes('Ô Cốp'));
  assert.ok(processed.includes('Hợp tác xã'));
  assert.ok(processed.includes('chi phí giá vốn nhập hàng'));
  assert.ok(processed.includes('chi phí vận hành nền tảng'));
  assert.ok(processed.includes('chiết khấu hoa hồng hệ thống'));
  assert.ok(processed.includes('đồng'));
  assert.ok(processed.includes('12 phẩy 5 phần trăm'));
  assert.ok(processed.includes('6 phần trăm'));
});

test('detectBestVoice correctly classifies Neural AI voices and 3 regions', () => {
  const mockVoices = [
    { name: 'Microsoft HoaiMy Online (Natural) - Vietnamese (Vietnam)', lang: 'vi-VN' },
    { name: 'Microsoft NamMinh Online (Natural) - Vietnamese (Vietnam)', lang: 'vi-VN' },
    { name: 'Google Tiếng Việt', lang: 'vi-VN' },
    { name: 'Standard Voice', lang: 'vi-VN' },
    { name: 'Microsoft Jenny Neural', lang: 'en-US' }
  ];

  const southernSelection = VoiceEngine.detectBestVoice({ lang: 'vi', region: 'nam' }, mockVoices);
  assert.ok(southernSelection);
  assert.equal(southernSelection.isNeural, true);
  assert.equal(southernSelection.region, 'nam');
  assert.ok(southernSelection.voice.name.includes('NamMinh'));

  const northernSelection = VoiceEngine.detectBestVoice({ lang: 'vi', region: 'bac' }, mockVoices);
  assert.ok(northernSelection);
  assert.equal(northernSelection.isNeural, true);
  assert.equal(northernSelection.region, 'bac');
  assert.ok(northernSelection.voice.name.includes('HoaiMy'));

  const nonNeuralVoices = [
    { name: 'eSpeak Vietnamese', lang: 'vi' }
  ];
  const fallbackSelection = VoiceEngine.detectBestVoice({ lang: 'vi', region: 'nam' }, nonNeuralVoices);
  assert.ok(fallbackSelection);
  assert.equal(fallbackSelection.isNeural, false);
});

test('isNeuralAvailable detects presence of modern AI voices', () => {
  const browserWithNeural = {
    speechSynthesis: {
      getVoices: () => [
        { name: 'Microsoft HoaiMy Online (Natural) - Vietnamese', lang: 'vi-VN' }
      ]
    }
  };
  assert.equal(VoiceEngine.isNeuralAvailable(browserWithNeural), true);

  const browserWithoutNeural = {
    speechSynthesis: {
      getVoices: () => [
        { name: 'Robotic Voice', lang: 'vi-VN' }
      ]
    }
  };
  assert.equal(VoiceEngine.isNeuralAvailable(browserWithoutNeural), false);

  assert.equal(VoiceEngine.isNeuralAvailable(null), false);
});

test('typewrite creates smooth text stream chunk by chunk and invokes onComplete', async () => {
  const mockElement = { innerHTML: '' };
  const mockBrowser = {
    setInterval: (fn, delay) => {
      const id = setInterval(fn, delay);
      return id;
    },
    clearInterval: (id) => clearInterval(id)
  };

  await new Promise((resolve) => {
    VoiceEngine.typewrite(mockElement, 'Hệ điều hành số OCOP Sales Copilot', {
      speed: 5,
      chunkSize: 2,
      browser: mockBrowser,
      onComplete: () => {
        assert.equal(mockElement.innerHTML, 'Hệ điều hành số OCOP Sales Copilot');
        resolve();
      }
    });
  });
});

test('speak triggers fallback without robotic voice when no neural voice exists', () => {
  let fallbackTriggered = false;
  let fallbackReason = '';

  const mockBrowser = {
    speechSynthesis: {
      getVoices: () => [{ name: 'Robotic Standard', lang: 'vi-VN' }],
      speak: () => {},
      cancel: () => {}
    }
  };

  const spoken = VoiceEngine.speak('Xin chào bà con OCOP', {
    browser: mockBrowser,
    lang: 'vi',
    forceVoice: false,
    onFallback: (data) => {
      fallbackTriggered = true;
      fallbackReason = data.reason;
    }
  });

  assert.equal(spoken, false);
  assert.equal(fallbackTriggered, true);
  assert.equal(fallbackReason, 'no_neural_voice');
});

test('speak plays through SpeechSynthesis when neural voice is available', () => {
  let spokenUtterance = null;

  class MockUtterance {
    constructor(text) {
      this.text = text;
    }
  }

  const mockBrowser = {
    SpeechSynthesisUtterance: MockUtterance,
    speechSynthesis: {
      getVoices: () => [{ name: 'Microsoft NamMinh Online (Natural)', lang: 'vi-VN' }],
      speak: (u) => { spokenUtterance = u; },
      cancel: () => {}
    }
  };

  const spoken = VoiceEngine.speak('Báo cáo doanh thu cửa hàng OCOP', {
    browser: mockBrowser,
    lang: 'vi',
    region: 'nam'
  });

  assert.equal(spoken, true);
  assert.ok(spokenUtterance);
  assert.ok(spokenUtterance.text.includes('Ô Cốp'));
});

