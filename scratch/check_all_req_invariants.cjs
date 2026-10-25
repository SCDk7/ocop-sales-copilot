const fs = require('fs');
const testFiles = fs.readdirSync('ocop-sales-copilot').filter(f => f.endsWith('.test.js'));

const searchTerms = [
  'i18n-intro-pillar3',
  'AI Financial Engine',
  'fin-stat-revenue',
  'fin-stat-profit',
  'fin-stat-commission',
  'stores-directory-modal',
  'ocop-store-modal',
  'openStoreLocator',
  'activateProductReconciliation',
  'Hỏi AI điểm bán',
  'Đối Soát Dòng Tiền',
  'Câu Chuyện OCOP',
  'i18n-hero-title1',
  'i18n-hero-feat4-desc'
];

searchTerms.forEach(term => {
  let matches = [];
  testFiles.forEach(file => {
    const content = fs.readFileSync('ocop-sales-copilot/' + file, 'utf8');
    if (content.includes(term)) matches.push(file);
  });
  console.log(term, '=>', matches);
});

