const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(4300, 4420).map((l, i) => (4301 + i) + ': ' + l.slice(0, 140)).join('\n'));

