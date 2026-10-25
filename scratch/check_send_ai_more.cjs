const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(9560, 9620).map((l, i) => (9561 + i) + ': ' + l.slice(0, 140)).join('\n'));

