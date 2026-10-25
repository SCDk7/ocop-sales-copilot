const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('BGK') || l.includes('Tóm Tắt') || l.includes('Test AI') || l.includes('Nghe AI Báo Cáo')) {
    console.log(`L${i+1}: ${l}`);
  }
});

