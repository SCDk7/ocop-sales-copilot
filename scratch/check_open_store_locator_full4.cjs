const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function openStoreLocator');
console.log(html.slice(idx + 7000, idx + 10000));

