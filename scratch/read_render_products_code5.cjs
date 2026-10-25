const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pos = 396222 + 12500;
console.log(html.slice(pos, pos + 2500));

