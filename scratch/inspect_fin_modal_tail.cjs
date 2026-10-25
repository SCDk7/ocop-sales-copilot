const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(4420, 4560).join('\n'));

