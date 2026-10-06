const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '../..');
const draftPath = path.join(__dirname, 'ocop-catalog-import.json');
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const details = JSON.parse(fs.readFileSync(path.join(__dirname, 'product-details.json'), 'utf8'));
const { PRODUCTS, CONFIG } = require(path.join(root, 'data.js'));
const products = PRODUCTS.filter(p => !p.catalogImport);
const names = {
  22:'Cà phê Mường Ảng', 26:'Miến dong Bình Lư',
  30:'Cốm làng Vòng khô', 58:'Tinh dầu tràm Huế',
  73:'Nho sấy khô Ninh Thuận', 76:'Thanh long sấy dẻo Bình Thuận',
  86:'Hồng treo gió Đà Lạt', 90:'Rượu bưởi Tân Triều',
  109:'Hạt sen sấy Nam Huy', 112:'Mắm thái Châu Đốc'
};
function category(name) {
  if (/Trà|Chè/.test(name)) return 'tea';
  if (/Gốm|Tranh|Sơn mài|Rượu|Vang|Cao mềm|Cao sâm|Tinh dầu/.test(name)) return 'gift';
  if (/Nước mắm|Mắm|Tương|Quế|Dầu|Hạt tiêu/.test(name)) return 'spice';
  if (/Bánh|Cốm|Kẹo|Hạt mắc|Hạt sen|Nho sấy|Hồng treo|Thanh long sấy/.test(name)) return 'snack';
  return 'food';
}
for (const item of draft.candidates) {
  const row = Number(item.key.replace('import-', ''));
  const info = details[row];
  if (!item.image || !info || !Number.isFinite(item.price)) {
    item.status = 'pending';
    item.pendingReason = 'Chưa xác định được ảnh đúng tên/nhãn hàng hoặc sản phẩm cụ thể của dòng nhiều lựa chọn.';
    continue;
  }
  if (!fs.existsSync(path.join(root,item.image))) throw new Error(`Missing image: ${item.image}`);
  const name = (names[row] || item.name).replace(/\*/g,'').trim();
  const id = Math.max(...products.map(p=>p.id)) + 1;
  const product = {
    id, name, nameEn:info[0], region:item.region, category:category(name),
    stars:item.stars, price:item.price, origPrice:item.price, rating:null, reviews:0,
    tag:'Danh mục mới', tagEn:'New collection', img:item.image,
    desc:`${name} – ${item.region}. Quy cách: ${info[1]}. Giá tham khảo theo bảng giá shop cung cấp.`,
    descEn:`${info[0]} from ${item.region}. Pack size: ${info[2]}. Reference price supplied by the shop.`,
    packaging:info[1], packagingEn:info[2], priceIsReference:true,
    imageSource:item.imageSource.page, imageIsSample:true,
    certificationSource:'Danh sách do chủ shop cung cấp',
    catalogImport:item.key
  };
  products.push(product);
  item.status='published'; item.productId=id; item.publishedName=name;
  delete item.pendingReason;
}
const source = `// Canonical product catalogue shared by the website, chatbot, and server.\nconst PRODUCTS = ${JSON.stringify(products,null,2)};\n\nconst CONFIG = ${JSON.stringify(CONFIG,null,2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = { PRODUCTS, products: PRODUCTS, CONFIG };\n}\nif (typeof window !== 'undefined') {\n  window.PRODUCTS = PRODUCTS;\n  window.CONFIG = CONFIG;\n}\n`;
fs.writeFileSync(path.join(root,'data.js'),source);
draft.status = draft.candidates.every(p=>p.status==='published') ? 'published' : 'partially_published_awaiting_exact_product_images';
fs.writeFileSync(draftPath,JSON.stringify(draft,null,2)+'\n');
const pending = draft.candidates.filter(p=>p.status==='pending');
const csv = [['STT','Tên sản phẩm','Tỉnh / Thành phố','Giá cao nhất (VNĐ)','Ghi chú'], ...pending.map(p=>[p.key.replace('import-',''),p.name,p.region,p.price,p.pendingReason])];
fs.writeFileSync(path.join(__dirname,'pending-products.csv'),'\ufeff'+csv.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n');
console.log(JSON.stringify({added:products.length-77,total:products.length,pending:pending.length,duplicates:draft.duplicates.length}));
