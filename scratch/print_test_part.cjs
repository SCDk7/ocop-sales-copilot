const fs = require('fs');
const testContent = fs.readFileSync('province-filter-sync.test.js', 'utf8');
const lines = testContent.split('\n');
console.log(lines.slice(355, 410).join('\n'));

