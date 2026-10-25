const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/initProvinceMap|provinceMap|L\.map|L\.geoJSON/i.test(line)) {
        console.log(`${idx+1}: ${line.trim().slice(0, 110)}`);
    }
});

