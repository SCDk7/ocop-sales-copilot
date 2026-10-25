const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
console.log(lines.slice(11450, 11485).map((l, i) => (11451 + i) + ': ' + l).join('\n'));

