const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="ai-financial-modal"');
console.log(html.slice(idx + 24000, idx + 28000));

