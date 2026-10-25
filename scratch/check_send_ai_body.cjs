const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(9510, 9560).map((l, i) => (9511 + i) + ': ' + l.slice(0, 140)).join('\n'));

