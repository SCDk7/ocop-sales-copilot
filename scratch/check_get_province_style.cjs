const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
const start = lines.findIndex(l => l.includes('function getProvinceStyle'));
console.log(lines.slice(start, start + 30).map((l, i) => (start + 1 + i) + ': ' + l).join('\n'));

