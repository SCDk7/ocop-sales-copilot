const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('final-perfect')) {
    console.log(`L${i+1}: ${l}`);
  }
});

