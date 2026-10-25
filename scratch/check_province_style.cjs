const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function getProvinceStyle');
if (idx !== -1) {
    console.log(html.slice(idx, idx + 1500));
} else {
    // search for style inside initializeProvinceMap
    const initIdx = html.indexOf('function initializeProvinceMap');
    console.log(html.slice(initIdx + 1000, initIdx + 3000));
}

