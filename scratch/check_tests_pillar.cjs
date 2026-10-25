const fs = require('fs');
const content = fs.readFileSync('province-filter-sync.test.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/intro-pillar|pillar3/i.test(line)) {
        console.log(`${idx+1}: ${line.trim()}`);
    }
});
console.log('Checked test file.');

