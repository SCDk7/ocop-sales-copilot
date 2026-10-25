const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function openStoreLocator');
console.log(html.slice(idx + 9500, idx + 12000));

