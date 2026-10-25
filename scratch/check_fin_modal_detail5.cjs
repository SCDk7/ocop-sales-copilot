const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="ai-financial-modal"');
console.log(html.slice(idx + 18000, idx + 24000));

