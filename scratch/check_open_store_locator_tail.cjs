const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(11180, 11260).map((l, i) => (11181 + i) + ': ' + l.slice(0, 140)).join('\n'));

