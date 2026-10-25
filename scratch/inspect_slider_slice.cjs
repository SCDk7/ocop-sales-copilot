const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx4 = html.indexOf('Thanh 1: Sản lượng phân phối');
console.log('Found slider at index:', idx4);
if (idx4 !== -1) {
    console.log(JSON.stringify(html.slice(idx4 - 50, idx4 + 300)));
}

