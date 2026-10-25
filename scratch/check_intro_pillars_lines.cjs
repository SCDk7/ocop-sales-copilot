const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(2805, 2825).join('\n'));

