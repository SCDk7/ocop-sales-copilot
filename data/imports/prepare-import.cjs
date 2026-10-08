if (require('../../data.js').PRODUCTS.some(p => p.catalogVersion?.startsWith('20261007-63'))) throw new Error('Legacy import disabled: use data/imports/replace-catalog-latest.cjs for the 252-item catalogue.');
const fs = require('node:fs');
const path = require('node:path');
const target = path.join(__dirname, 'ocop-catalog-import.json');
const catalog = JSON.parse(fs.readFileSync(target, 'utf8'));
// Maximum reference prices supplied by the shop, in the original 126-row order.
const maxima = [800000,450000,60000,70000,70000,300000,250000,300000,250000,90000,400000,250000,1200000,80000,90000,250000,150000,55000,500000,60000,60000,200000,280000,300000,400000,65000,60000,120000,3000000,250000,120000,200000,80000,350000,180000,70000,300000,150000,600000,140000,75000,90000,80000,80000,90000,250000,1000000,500000,60000,200000,100000,70000,70000,100000,800000,140000,120000,150000,150000,90000,70000,180000,3000000,150000,350000,60000,160000,90000,120000,600000,2500000,250000,200000,300000,110000,160000,null,220000,300000,250000,400000,180000,190000,180000,450000,300000,120000,500000,220000,250000,2000000,150000,220000,190000,55000,60000,200000,220000,220000,100000,130000,250000,90000,160000,150000,150000,60000,120000,180000,70000,160000,140000,1200000,250000,150000,200000,280000,120000,150000,200000,50000,1000000,1200000,130000,600000,120000];
if (maxima.length !== 126) throw new Error('Incorrect price row count');
const correctedNames = {
  26: 'Miến dong Bình Lưu',
  30: 'Cốm làng Vòng khô / Cốm sấy Mè',
  70: 'Khô bò một nắng Krông Pa',
  76: 'Thanh long sấy dẻo / sấy khô',
  81: 'Cà phê Trung Nguyên Legend',
  98: 'Hạt tiêu Bàu Mây',
  106: 'Bánh tét Trà Cuôn chân không',
  115: 'Trà mảng cầu Phụng Hiệp'
};
for (const item of [...catalog.candidates, ...catalog.duplicates]) {
  const row = Number(item.key.replace('import-', ''));
  item.price = maxima[row - 1];
  item.priceSource = 'Bảng giá tham khảo do chủ shop cung cấp; lấy giá lớn nhất';
  item.priceIsReference = true;
  if (correctedNames[row]) item.name = correctedNames[row];
  if (row === 70) item.region = 'Gia Lai';
  item.name = item.name.replace(/\*/g, '').trim();
  item.alternatives = item.name.includes('/');
  item.needsClarification = item.alternatives || /Chợ Bãi|Địch Tỉnh|tôm rùa|rốm/.test(item.name);
}
catalog.status = 'prices_received_awaiting_product_and_image_review';
fs.writeFileSync(target, JSON.stringify(catalog, null, 2) + '\n');
console.log(`${catalog.candidates.length} candidate prices recorded; ${catalog.duplicates.length} duplicates excluded.`);
