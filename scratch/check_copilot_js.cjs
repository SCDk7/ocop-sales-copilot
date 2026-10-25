const fs = require('fs');
const code = fs.readFileSync('ocop-sales-copilot/ocop-copilot.js', 'utf8');
console.log('ocop-copilot.js length:', code.length);
console.log(code.slice(0, 1500));

