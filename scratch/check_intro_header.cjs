const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('class="intro-header'));
console.log('intro-header at line:', idx + 1);
console.log(lines.slice(idx, idx + 25).map((l, i) => (idx + 1 + i) + ': ' + l).join('\n'));

