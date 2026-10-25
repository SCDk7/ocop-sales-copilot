const fs = require('fs');
const code = fs.readFileSync('ocop-sales-copilot/ocop-copilot.js', 'utf8');
const lines = code.split('\n');

lines.forEach((l, i) => {
  if (l.includes('CSKH') || l.includes('Admin') || l.includes('escalat') || l.includes('chuyển tiếp')) {
    console.log((i+1) + ': ' + l.trim().slice(0, 120));
  }
});

