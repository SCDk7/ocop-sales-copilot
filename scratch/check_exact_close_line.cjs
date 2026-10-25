const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(4180, 4200).map((l, i) => (4181 + i) + ': ' + l).join('\n'));

