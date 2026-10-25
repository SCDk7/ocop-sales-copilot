const fs = require('fs');
const content = fs.readFileSync('ai-metrics.test.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/html|financial|cogs|simulat|stat/i.test(line)) {
        console.log(`${idx+1}: ${line.trim().slice(0, 110)}`);
    }
});

