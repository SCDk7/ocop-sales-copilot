const fs = require('fs');
const code = fs.readFileSync('final-perfect.js', 'utf8');
const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('function setupVietnamInteractiveMap'));
console.log(lines.slice(start, start + 60).join('\n'));

