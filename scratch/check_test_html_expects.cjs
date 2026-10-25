const fs = require('fs');
const content = fs.readFileSync('province-filter-sync.test.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/html\.(includes|indexOf|match)|assert.*index\.html/i.test(line)) {
        console.log(`${idx+1}: ${line.trim().slice(0, 120)}`);
    }
});

