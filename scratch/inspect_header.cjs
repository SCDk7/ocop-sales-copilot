const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('<header'));
console.log('header starts at line:', start + 1);
console.log(lines.slice(start, start + 80).join('\n'));
