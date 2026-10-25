const fs = require('fs');
const content = fs.readFileSync('ocop-copilot.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(838, 920).join('\n'));

