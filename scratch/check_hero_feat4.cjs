const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/i18n-hero-title1|i18n-hero-feat4/i.test(line)) {
        console.log(`${idx+1}: ${line.trim()}`);
    }
});

