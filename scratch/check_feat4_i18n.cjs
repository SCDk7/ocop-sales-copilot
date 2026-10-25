const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
console.log('--- 13320-13330 ---');
console.log(lines.slice(13318, 13330).join('\n'));
console.log('--- 14715-14725 ---');
console.log(lines.slice(14714, 14725).join('\n'));

