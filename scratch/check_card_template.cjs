const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('const card = `');
if (idx !== -1) {
    console.log(html.slice(idx, idx + 3000));
} else {
    const idx2 = html.indexOf('function renderProductCard');
    console.log(html.slice(idx2, idx2 + 3000));
}

