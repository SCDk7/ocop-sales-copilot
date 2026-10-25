const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('partner-registration-modal') || l.includes('partner-name'));
console.log('partner-registration-modal found at line:', idx);
if (idx !== -1) {
  console.log(lines.slice(idx, idx + 120).join('\n'));
}

