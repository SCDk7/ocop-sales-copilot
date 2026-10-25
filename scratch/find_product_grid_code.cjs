const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('product-grid');
let pos = 0;
while ((pos = html.indexOf('product-grid', pos)) !== -1) {
    console.log(`Pos: ${pos}`);
    console.log(html.slice(pos - 100, pos + 300));
    pos += 12;
}

