const fs = require('fs');
const content = fs.readFileSync('skytech-complete.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(640, 685).join('\n'));

