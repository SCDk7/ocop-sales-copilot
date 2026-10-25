const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('</head>'));
console.log('</head> at line:', idx + 1);
console.log(lines.slice(Math.max(0, idx - 15), idx + 5).join('\n'));

