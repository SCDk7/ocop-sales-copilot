const fs = require('fs');
const content = fs.readFileSync('ocop-copilot.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/renderCSKH|escalat|admin.*cskh|cskh|Gặp Admin/i.test(line)) {
        console.log(`${idx+1}: ${line.trim().slice(0, 120)}`);
    }
});

