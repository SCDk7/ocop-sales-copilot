const fs = require('fs');
const content = fs.readFileSync('index.backup-safe.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(15, 35).join('\n'));

