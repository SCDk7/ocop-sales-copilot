const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(2710, 2760).map((l, i) => (2711 + i) + ': ' + l).join('\n'));

