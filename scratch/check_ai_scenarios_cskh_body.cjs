const fs = require('fs');
const content = fs.readFileSync('ai-scenarios.test.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(9, 30).join('\n'));

