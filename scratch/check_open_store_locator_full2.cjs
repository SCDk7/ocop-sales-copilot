const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function openStoreLocator');
console.log(html.slice(idx + 3000, idx + 6500));

