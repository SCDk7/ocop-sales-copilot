const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const startIdx = content.indexOf('id="ai-financial-modal"');
console.log(content.slice(startIdx + 2000, startIdx + 6000));

