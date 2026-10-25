const fs = require('fs');
['kpi-sync.test.js', 'ai-business-knowledge.test.js'].forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (/index\.html/i.test(line)) {
            console.log(`${file}:${idx+1}: ${line.trim()}`);
        }
    });
});
console.log('Done checking kpi and business knowledge.');

