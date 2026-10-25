const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="i18n-cat-header"');
console.log(html.slice(idx - 600, idx - 100));

