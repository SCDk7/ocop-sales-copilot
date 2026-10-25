const fs = require('fs');
const testCode = fs.readFileSync('ocop-sales-copilot/province-filter-sync.test.js', 'utf8');
const lines = testCode.split('\n');

lines.forEach((l, i) => {
  if (l.includes('AI Financial Engine') || l.includes('activateProductReconciliation') || l.includes('Đối Soát Dòng Tiền')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

