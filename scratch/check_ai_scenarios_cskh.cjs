const fs = require('fs');
const content = fs.readFileSync('ai-scenarios.test.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/damage complaints and human requests|cskh|complaint/i.test(line)) {
        console.log(`${idx+1}: ${line.trim()}`);
    }
});

