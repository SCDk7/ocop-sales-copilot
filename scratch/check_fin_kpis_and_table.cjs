const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- KPI CARDS (4330-4385) ---');
console.log(lines.slice(4329, 4385).map((l, i) => (4330 + i) + ': ' + l).join('\n'));

console.log('--- TABLE (4440-4490) ---');
console.log(lines.slice(4439, 4490).map((l, i) => (4440 + i) + ': ' + l).join('\n'));

