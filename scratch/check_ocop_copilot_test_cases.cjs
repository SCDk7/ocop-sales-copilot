const fs = require('fs');
const content = fs.readFileSync('ocop-copilot.test.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/test\(/i.test(line)) {
        console.log(`${idx+1}: ${line.trim()}`);
    }
});

