const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('provinceMap = L.map(');
console.log(html.slice(idx, idx + 1200));

