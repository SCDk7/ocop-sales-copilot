const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx1 = html.indexOf('Khối Thông Tin Chủ Thể OCOP & Điểm Bán');
const end1 = html.indexOf('<!-- Footer Thẻ:', idx1);
console.log('--- Store box slice ---');
console.log(JSON.stringify(html.slice(idx1, end1)));

const idx2 = end1;
const end2 = html.indexOf('</div>\r\n                `;', idx2) !== -1 ? html.indexOf('</div>\r\n                `;', idx2) : html.indexOf('</div>\n                `;', idx2);
console.log('--- Footer slice ---');
console.log(JSON.stringify(html.slice(idx2, end2 + 6)));

