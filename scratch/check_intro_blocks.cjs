const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');

console.log('--- INTRO HEADER (2714-2740) ---');
console.log(lines.slice(2713, 2740).map((l, i) => (2714 + i) + ': ' + l).join('\n'));

console.log('--- INTRO ACTIONS (2889-2942) ---');
console.log(lines.slice(2888, 2942).map((l, i) => (2889 + i) + ': ' + l).join('\n'));

