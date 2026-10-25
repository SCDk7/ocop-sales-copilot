const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(2840, 2880).map((l, i) => (2841 + i) + ': ' + l).join('\n'));

