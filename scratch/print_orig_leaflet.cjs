const fs = require('fs');
const content = fs.readFileSync('index.backup-safe.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(6900, 7060).join('\n'));

