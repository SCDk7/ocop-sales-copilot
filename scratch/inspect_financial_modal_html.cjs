const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('id="ai-financial-modal"'));
console.log('ai-financial-modal line:', idx + 1);
console.log(lines.slice(idx, idx + 50).map((l, i) => (idx + 1 + i) + ': ' + l.slice(0, 140)).join('\n'));

