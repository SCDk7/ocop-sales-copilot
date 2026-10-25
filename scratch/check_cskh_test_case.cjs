const fs = require('fs');
const content = fs.readFileSync('ocop-copilot.test.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(87, 105).join('\n'));

