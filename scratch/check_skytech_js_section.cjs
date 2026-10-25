const fs = require('fs');
const js = fs.readFileSync('ocop-sales-copilot/skytech-complete.js', 'utf8');
const lines = js.split('\n');
console.log(lines.slice(160, 240).map((l, i) => (161 + i) + ': ' + l).join('\n'));

