const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('const islandReferenceLayer');
console.log(html.slice(idx, idx + 800));

