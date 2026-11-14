throw new Error('Superseded catalogue: use replace-catalog-latest.cjs');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { parse } = require('./parse-63-provinces.cjs');
const root = path.join(__dirname, '../..');
const source = fs.readFileSync(path.join(__dirname, 'catalog-63-provinces-source.txt'), 'utf8');
const rows = parse(source);
const archivePath = path.join(__dirname, 'catalog-before-63.json');
// Keep IDs and decisions reproducible on reruns; never reinterpret new IDs as old stock.
if (!fs.existsSync(archivePath)) fs.writeFileSync(archivePath, JSON.stringify(require('../../data.js').PRODUCTS, null, 2) + '\n');
const oldProducts = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
const matches = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog-63-image-matches.json'), 'utf8'));
const english = fs.readFileSync(path.join(__dirname, 'catalog-63-names-en.txt'), 'utf8').trim().split(/\r?\n/).flatMap(line => line.split(' | '));
assert.equal(english.length, 252);
const norm = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
const regionKey = value => norm(value).replace(/[^a-z0-9]/g, '').replace(/^(thanhpho|tp)/, '');
function category(name) {
  const q = norm(name);
  if (/gom|am chen|thu cong|my nghe|may tre|sam|curcumin|tinh dau|dau gio|cao xoa|cao gam/.test(q)) return 'gift';
  if (/nuoc mam|mam|tuong|muoi|tieu|que|hoa hoi|hat doi|hat mac khen|dau dua|tinh bot nghe|mach nha|duong phen|duong phoi|thot not/.test(q)) return 'spice';
  if (/tra|che|ca phe|ca cao|cacao|ruou|atiso|actiso|giao co lam|kho qua|re tranh/.test(q) && !/banh trang|banh da/.test(q)) return 'tea';
  if (/banh|keo|com|say|khoai deo|hat dieu|hat mac ca|hat de|hong treo|long nhan|nhai/.test(q) && !/thit|ca loc|ca boi|ca thieu|tom kho|muc|ca that lat|bo mot nang|hai san/.test(q)) return 'snack';
  return 'food';
}
function packagingEn(suffix) {
  const replacements = [['đóng hộp thiếc kín', 'sealed tin'], ['đóng thùng xốp chống sốc', 'protective insulated box'], ['chai thủy tinh/nhựa ép seal', 'sealed glass/plastic bottle'], ['hút chân không cấp đông', 'vacuum-packed and frozen'], ['hút chân không', 'vacuum-packed'], ['đóng túi khô', 'dry sealed bag'], ['hộp túi lọc', 'box of tea bags'], ['đóng gói miếng', 'packed portions'], ['hộp đóng kín', 'sealed box'], ['túi hút chân không', 'vacuum-sealed bag'], ['đóng thùng xốp', 'insulated box'], ['chai đóng seal kỹ', 'securely sealed bottle'], ['tùy quy cách lọ/hộp', 'bottle/box size varies'], ['tùy dung tích', 'volume varies'], ['tùy hàm lượng', 'content varies'], ['tùy sản phẩm', 'product varies'], ['tùy nhân trứng muối', 'salted egg filling varies'], ['tùy loại yếm vuông/gạch', 'crab type varies'], ['tùy loại', 'type varies'], ['tùy món', 'item varies'], ['dạng viên/hũ', 'pieces/jar'], ['túi khô', 'dry bag'], ['chiếc', 'piece'], ['lạng', '100g'], ['lít', 'litre'], ['chai', 'bottle'], ['hộp', 'box'], ['thùng', 'case'], ['chục', '10 pieces'], ['bình', 'container'], ['gói', 'pack'], ['túi', 'bag'], ['hũ', 'jar'], ['lọ', 'bottle'], ['nải', 'banana bunch'], ['đòn', 'roll'], ['cái', 'piece'], ['bộ', 'set'], ['món', 'item']];
  let result = suffix.replace(/^\+/, '').replace(/^\//, '').trim();
  for (const [vi, en] of replacements) result = result.replaceAll(vi, en);
  return result || 'pack size varies';
}
let nextId = Math.max(...oldProducts.map(p => p.id)) + 1;
const imageReview = [];
const products = rows.map((row, index) => {
  const old = matches[row.row] ? oldProducts.find(p => p.id === matches[row.row]) : null;
  if (old) assert.equal(regionKey(old.region), regionKey(row.region), 'Image region mismatch at row ' + row.row);
  const packaging = row.priceSuffix.replace(/^\+/, '').replace(/^\//, '').trim() || 'Quy cách tùy loại';
  const packEn = packagingEn(row.priceSuffix);
  const image = old?.img || 'images/product-photo-pending.svg';
  assert(fs.existsSync(path.join(root, image)), 'Missing image at row ' + row.row);
  imageReview.push({ row: row.row, name: row.name, region: row.region, previousId: old?.id || null, previousName: old?.name || null, image, status: old ? 'matching_existing_photo' : 'awaiting_matching_photo', note: old ? 'Same province and matching product form; illustrative pack size may differ.' : 'No reviewed matching photo retained; neutral placeholder instead of unrelated food.' });
  return {
    id: old?.id || nextId++, name: row.name, nameEn: english[index].trim(),
    region: row.region, macroRegion: row.macroRegion, category: category(row.name),
    stars: row.starsMin, starsMin: row.starsMin, starsMax: row.starsMax,
    price: row.priceMax, priceMin: row.priceMin, priceMax: row.priceMax,
    priceOpenEnded: row.priceOpenEnded, priceIsReference: true, origPrice: row.priceMax,
    rating: null, reviews: 0, tag: 'Danh mục mới', tagEn: 'Updated catalogue', img: image,
    desc: `${row.name} – ${row.region}. Quy cách tính giá: ${packaging}. Giá tham khảo do chủ shop cung cấp; tính combo theo mức cao nhất của khoảng giá.${row.priceOpenEnded ? ' Giá có thể cao hơn tùy loại.' : ''}`,
    descEn: `${english[index].trim()} from ${row.region}. Price unit: ${packEn}. Reference price supplied by the shop; sets use the upper end of the price range.${row.priceOpenEnded ? ' Price may be higher depending on the item.' : ''}`,
    packaging, packagingEn: packEn, imageIsSample: Boolean(old), imagePending: !old,
    ...(old?.imageSource ? { imageSource: old.imageSource } : {}),
    ...(old?.imagePhotoSource ? { imagePhotoSource: old.imagePhotoSource } : {}),
    certificationSource: 'Danh sách do chủ shop cung cấp',
    hasAlternatives: row.name.includes('/'), catalogImport: 'catalog-63-' + row.row,
    catalogVersion: '20261007-63', sourceRow: row.row
  };
});
assert.equal(new Set(products.map(p => p.id)).size, 252);
const existingData = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
fs.writeFileSync(path.join(root, 'data.js'), existingData.replace(/const PRODUCTS = \[[\s\S]*?\n\];/, 'const PRODUCTS = ' + JSON.stringify(products, null, 2) + ';'));
fs.writeFileSync(path.join(__dirname, 'catalog-63-image-review.json'), JSON.stringify(imageReview, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, 'catalog-63-migration.json'), JSON.stringify({ catalogVersion: '20261007-63', totalProducts: 252, provinces: 63, matchingPhotos: imageReview.filter(r => r.previousId).length, retainedIds: products.filter(p => p.id <= 142).map(p => p.id), retiredIds: oldProducts.filter(old => !products.some(p => p.id === old.id)).map(p => p.id), macroCounts: { bac: 100, trung: 76, nam: 76 } }, null, 2) + '\n');
console.log(`Published ${products.length} source rows; retained ${imageReview.filter(r => r.previousId).length} reviewed photos.`);
