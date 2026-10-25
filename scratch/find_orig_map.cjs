const fs = require('fs');
const content = fs.readFileSync('index.backup-safe.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('province-map') || lines[i].includes('vietnam-provinces.geojson')) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
    console.log(lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 35)).join('\n'));
    console.log('--------------------------------------------------');
  }
}

