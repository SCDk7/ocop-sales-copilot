const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx3 = html.indexOf('CHỦ THỂ SẢN XUẤT ĐẠT CHỨNG NHẬN OCOP');
console.log('Found modal producer box at index:', idx3);
if (idx3 !== -1) {
    const start = html.lastIndexOf('<div class="p-4 rounded-2xl bg-gradient-to-br', idx3);
    const end = html.indexOf('<!-- Danh sách Cửa hàng', idx3);
    console.log(JSON.stringify(html.slice(start, end)));
}

