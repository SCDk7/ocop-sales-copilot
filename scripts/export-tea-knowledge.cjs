'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const {trainingForProduct} = require('../product-training');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), context);
const sections = context.window.PRODUCTS.map(product => {
  const text = trainingForProduct(product);
  return text ? `## ${product.name}\n\n${text.split('\n').map(line => `- ${line}`).join('\n')}` : '';
}).filter(Boolean);
fs.writeFileSync(path.join(root, 'TRA_OCOP_KNOWLEDGE.md'), [
  '# Kho kiến thức trà OCOP cho chatbot',
  'Thông tin do chủ shop cung cấp. Giá, quy cách và số sao lấy từ data.js tại thời điểm xuất tài liệu. Chatbot tra cứu dữ liệu này qua product-knowledge.js; đây là bổ sung kho kiến thức, không phải huấn luyện lại trọng số mô hình.',
  'Chạy lại `node scripts/export-tea-knowledge.cjs` khi cần cập nhật tài liệu từ danh mục. Khởi động lại máy chủ Node sau khi thay đổi kho kiến thức. Script Excel vẫn quản lý danh mục gốc; mô tả bổ sung được giữ riêng trong data/tea-knowledge.json.',
  ...sections,
  '## Cách tư vấn quà biếu',
  'Khi khách hỏi trà làm quà, lọc sản phẩm trà trong danh mục theo ngân sách và địa phương mong muốn. Có thể giới thiệu Trà Phúc / Trà Lộc / Trà Thọ hoặc các dòng Phìn Hồ nếu phù hợp. Luôn lấy giá và mức sao hiện tại từ danh mục, hỏi ngân sách nếu khách chưa cung cấp; không suy đoán chất liệu hộp, tồn kho hay ưu đãi.',
].join('\n\n') + '\n');
console.log(`Exported ${sections.length} tea profiles to TRA_OCOP_KNOWLEDGE.md`);
