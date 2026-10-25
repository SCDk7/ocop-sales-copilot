const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const startIdx = content.indexOf('id="ai-financial-modal"');
if (startIdx !== -1) {
    console.log(content.slice(startIdx, startIdx + 2500));
} else {
    console.log('ai-financial-modal not found');
}

