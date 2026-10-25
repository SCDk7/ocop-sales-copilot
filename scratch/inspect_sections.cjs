const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

function findRange(keyword, before = 5, after = 30) {
  const idx = lines.findIndex(l => l.includes(keyword));
  if (idx === -1) {
    console.log(`NOT FOUND: ${keyword}`);
    return;
  }
  console.log(`=== FOUND: ${keyword} at line ${idx + 1} ===`);
  console.log(lines.slice(Math.max(0, idx - before), Math.min(lines.length, idx + after)).join('\n'));
}

findRange('HỆ THỐNG ĐIỀU PHỐI ĐẶC SẢN OCOP TOÀN QUỐC');
findRange('<header class="sticky top-0');
findRange('id="shop-hero"');
findRange('CAM KẾT VẬN HÀNH CHUỖI CUNG ỨNG');
findRange('Tóm Tắt Đề Án |');

