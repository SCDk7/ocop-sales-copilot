const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('id="province-map"'));
console.log('id="province-map" at line:', idx + 1);
if (idx !== -1) {
  console.log(lines.slice(Math.max(0, idx - 10), Math.min(lines.length, idx + 40)).join('\n'));
}

