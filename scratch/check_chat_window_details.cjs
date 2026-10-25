const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(3855, 3935).map((l, i) => (3856 + i) + ': ' + l.slice(0, 140)).join('\n'));

