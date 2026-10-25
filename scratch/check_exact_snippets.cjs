const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('Khối Thông Tin Chủ Thể OCOP & Điểm Bán');
console.log('Found store box at index:', idx);
if (idx !== -1) {
    console.log(html.slice(idx - 50, idx + 800));
}

const idx2 = html.indexOf('Footer Thẻ: Chỉ Số Quản Trị Vĩ Mô');
console.log('Found footer at index:', idx2);
if (idx2 !== -1) {
    console.log(html.slice(idx2 - 50, idx2 + 800));
}

