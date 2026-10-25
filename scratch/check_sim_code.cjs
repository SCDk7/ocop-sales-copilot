const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('function updateFinancialSimulator'));
console.log('updateFinancialSimulator start line:', start + 1);
console.log(lines.slice(start, start + 60).map((l, i) => (start + 1 + i) + ': ' + l.slice(0, 140)).join('\n'));

