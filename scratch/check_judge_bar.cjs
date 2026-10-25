const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('id="judge-quick-access-bar"'));
console.log('judge bar start line:', start + 1);
console.log(lines.slice(Math.max(0, start - 5), start + 40).map((l, i) => (start - 4 + i) + ': ' + l.slice(0, 140)).join('\n'));

