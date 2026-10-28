const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const lines = indexHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('520+')) {
    console.log('index.html line', i + 1, l.trim());
  }
});

const skytech = fs.readFileSync('skytech-complete.js', 'utf8');
const skyLines = skytech.split('\n');
skyLines.forEach((l, i) => {
  if (l.includes('520+')) {
    console.log('skytech-complete.js line', i + 1, l.trim());
  }
});
