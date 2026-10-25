const fs = require('fs');
const testFiles = fs.readdirSync('ocop-sales-copilot').filter(f => f.endsWith('.test.js'));

const words = [
  'btn-intro-action-finance',
  'intro-sound-btn',
  'intro-enter-market',
  'i18n-intro-quick-admin',
  'i18n-intro-sound-status'
];

words.forEach(w => {
  let found = [];
  testFiles.forEach(f => {
    const code = fs.readFileSync('ocop-sales-copilot/' + f, 'utf8');
    if (code.includes(w)) found.push(f);
  });
  console.log(w, 'found in:', found);
});

