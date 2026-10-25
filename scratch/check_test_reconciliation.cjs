const fs = require('fs');
const testJs = fs.readFileSync('province-filter-sync.test.js', 'utf8');

const lines = testJs.split('\n');
lines.forEach((line, idx) => {
    if (/activateProductReconciliation/i.test(line)) {
        console.log(`${idx+1}: ${line.trim()}`);
    }
});

