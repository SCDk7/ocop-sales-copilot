/**
 * Script tạo ai-product-knowledge.js từ các file Excel OCOP
 * Chạy: node scripts/read-excel-to-ai-data.js
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = 'C:/Users/USER/.gemini/antigravity/brain/814a3fb0-baff-41ec-b7e5-cec03f5deef7/.user_uploaded';

const FILES = [
  {
    file: path.join(UPLOAD_DIR, 'media_1792984268378_bd00d130.xlsx'),
    group: 'Đồ Ăn Vặt, Hạt & Trái Cây Sấy',
    key: 'do_an_vat_hat_trai_cay_say',
    keywords: ['hạt', 'trái cây sấy', 'đồ ăn vặt', 'bánh', 'kẹo', 'snack', 'sấy', 'khô']
  },
  {
    file: path.join(UPLOAD_DIR, 'media_1792984268409_e5c48a13.xlsx'),
    group: 'Trà & Thảo Mộc',
    key: 'tra_thao_moc',
    keywords: ['trà', 'chè', 'thảo mộc', 'trà xanh', 'trà hoa', 'trà túi lọc', 'matcha', 'shan tuyết']
  },
  {
    file: path.join(UPLOAD_DIR, 'media_1792984268380_9d85eda4.xlsx'),
    group: 'Thực Phẩm & Nông Sản',
    key: 'thuc_pham_nong_san',
    keywords: ['gạo', 'mì', 'bún', 'miến', 'nước mắm', 'dầu', 'thực phẩm', 'nông sản', 'thịt', 'cá', 'mật ong']
  },
  {
    file: path.join(UPLOAD_DIR, 'media_1792984268378_c58e8590.xlsx'),
    group: 'Gia Vị & Nông Sản Khô',
    key: 'gia_vi_nong_san_kho',
    keywords: ['gia vị', 'tương', 'muối', 'hạt tiêu', 'sả', 'gừng', 'tỏi', 'ớt', 'khô', 'bột']
  },
  {
    file: path.join(UPLOAD_DIR, 'media_1792984268376_61bf1f4d.xlsx'),
    group: 'Quà Tặng & Thủ Công Mỹ Nghệ',
    key: 'qua_tang_thu_cong_my_nghe',
    keywords: ['quà tặng', 'thủ công', 'mỹ nghệ', 'lụa', 'thêu', 'đan', 'gốm', 'sứ', 'chăn', 'đệm']
  },
];

const allGroups = {};
let totalProducts = 0;

for (const { file, group, key, keywords } of FILES) {
  try {
    const wb = XLSX.readFile(file);
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    // Chuẩn hoá dữ liệu
    const products = rows.map(r => ({
      id: r['ID'] || '',
      name: r['Tên sản phẩm'] || '',
      province: r['Tỉnh / Thành phố'] || '',
      stars: r['Số sao'] || '',
      price: r['Giá niêm yết (VNĐ)'] || 0,
      unit: r['Quy cách'] || '',
    })).filter(p => p.name);

    allGroups[key] = { group, keywords, products };
    totalProducts += products.length;

    console.log(`✅ ${group}: ${products.length} sản phẩm`);
  } catch (e) {
    console.error(`❌ ${group}: ${e.message}`);
  }
}

// ── Tạo province index ──────────────────────────────────────────────
const byProvince = {};
for (const grpData of Object.values(allGroups)) {
  for (const p of grpData.products) {
    const prov = p.province;
    if (!prov) continue;
    if (!byProvince[prov]) byProvince[prov] = [];
    byProvince[prov].push({ ...p, group: grpData.group });
  }
}

// ── Tạo star index ─────────────────────────────────────────────────
const byStar = {};
for (const grpData of Object.values(allGroups)) {
  for (const p of grpData.products) {
    const star = p.stars;
    if (!star) continue;
    if (!byStar[star]) byStar[star] = [];
    byStar[star].push({ ...p, group: grpData.group });
  }
}

// ── Giá rẻ nhất / đắt nhất ────────────────────────────────────────
const allProducts = Object.values(allGroups).flatMap(g =>
  g.products.map(p => ({ ...p, group: g.group }))
);
const cheapest = [...allProducts].filter(p => p.price > 0).sort((a, b) => a.price - b.price).slice(0, 10);
const priciest = [...allProducts].filter(p => p.price > 0).sort((a, b) => b.price - a.price).slice(0, 10);

// ── Xuất file JS ───────────────────────────────────────────────────
const jsContent = `// ============================================================
// AI PRODUCT KNOWLEDGE BASE — OCOP Sales Copilot
// Nguồn: Dữ liệu Excel OCOP 5 nhóm hàng
// Mục đích: Hỗ trợ AI trả lời câu hỏi của khách hàng
// KHÔNG liên quan đến hiển thị sản phẩm trên trang web
// Tạo lúc: ${new Date().toLocaleString('vi-VN')}
// Tổng: ${totalProducts} sản phẩm / ${Object.keys(allGroups).length} nhóm
// ============================================================

(function() {
'use strict';

/**
 * Dữ liệu kiến thức sản phẩm OCOP theo nhóm hàng
 * Mỗi nhóm có: group (tên), keywords (từ khoá), products (danh sách SP)
 */
const GROUPS = ${JSON.stringify(allGroups, null, 2)};

/**
 * Index tra cứu theo tỉnh/thành phố
 */
const BY_PROVINCE = ${JSON.stringify(byProvince, null, 2)};

/**
 * Index tra cứu theo số sao OCOP
 */
const BY_STAR = ${JSON.stringify(byStar, null, 2)};

/**
 * Top 10 sản phẩm giá rẻ nhất
 */
const CHEAPEST_10 = ${JSON.stringify(cheapest, null, 2)};

/**
 * Top 10 sản phẩm đắt nhất / cao cấp nhất
 */
const PRICIEST_10 = ${JSON.stringify(priciest, null, 2)};

// ── API công khai ─────────────────────────────────────────────────

/**
 * Tìm sản phẩm theo từ khoá (tìm trong tên + tỉnh)
 * @param {string} query
 * @returns {Array}
 */
function searchProducts(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const grpData of Object.values(GROUPS)) {
    for (const p of grpData.products) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.province.toLowerCase().includes(q) ||
        grpData.group.toLowerCase().includes(q)
      ) {
        results.push({ ...p, group: grpData.group });
      }
    }
  }
  return results;
}

/**
 * Lấy sản phẩm theo tỉnh/thành phố
 * @param {string} province
 * @returns {Array}
 */
function getByProvince(province) {
  if (!province) return [];
  const p = province.toLowerCase();
  for (const [prov, list] of Object.entries(BY_PROVINCE)) {
    if (prov.toLowerCase().includes(p) || p.includes(prov.toLowerCase())) {
      return list;
    }
  }
  return [];
}

/**
 * Lấy sản phẩm 5 sao
 * @returns {Array}
 */
function getFiveStarProducts() {
  return BY_STAR['5 sao'] || [];
}

/**
 * Lấy sản phẩm theo nhóm
 * @param {string} groupKey - key nhóm hàng
 * @returns {Array}
 */
function getByGroup(groupKey) {
  return GROUPS[groupKey]?.products || [];
}

/**
 * Lấy sản phẩm trong khoảng giá
 * @param {number} minPrice
 * @param {number} maxPrice
 * @returns {Array}
 */
function getByPriceRange(minPrice, maxPrice) {
  const results = [];
  for (const grpData of Object.values(GROUPS)) {
    for (const p of grpData.products) {
      if (p.price >= minPrice && p.price <= maxPrice) {
        results.push({ ...p, group: grpData.group });
      }
    }
  }
  return results.sort((a, b) => a.price - b.price);
}

/**
 * Format giá tiền VNĐ
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  if (!price || price === 0) return 'Liên hệ';
  return price.toLocaleString('vi-VN') + ' đ';
}

/**
 * Lấy tóm tắt context cho AI (dùng trong prompt)
 * @param {string} userQuery - câu hỏi của user
 * @returns {string} context text
 */
function getAIContext(userQuery) {
  if (!userQuery) return '';
  const matches = searchProducts(userQuery);
  if (matches.length === 0) {
    // Thử tìm theo tỉnh
    const byProv = getByProvince(userQuery);
    if (byProv.length > 0) {
      return buildContextText(byProv.slice(0, 8), 'tỉnh/thành này');
    }
    return '';
  }
  return buildContextText(matches.slice(0, 8), 'tìm được');
}

function buildContextText(products, label) {
  if (!products || products.length === 0) return '';
  const lines = products.map(p =>
    \`- \${p.name} (\${p.province}) | \${p.stars} | \${formatPrice(p.price)}/\${p.unit || 'đơn vị'} | Nhóm: \${p.group}\`
  );
  return \`Các sản phẩm OCOP \${label}:\\n\${lines.join('\\n')}\`;
}

/**
 * Gợi ý quà tặng theo ngân sách
 * @param {number} budget
 * @returns {Array}
 */
function suggestGifts(budget) {
  const all = Object.values(GROUPS).flatMap(g => g.products.map(p => ({...p, group: g.group})));
  return all
    .filter(p => p.price > 0 && p.price <= budget)
    .sort((a, b) => {
      // Ưu tiên 5 sao, sau đó giá cao hơn (quà ngon hơn)
      const starA = parseInt(a.stars) || 0;
      const starB = parseInt(b.stars) || 0;
      if (starB !== starA) return starB - starA;
      return b.price - a.price;
    })
    .slice(0, 10);
}

// ── Export toàn cục ────────────────────────────────────────────────
window.OCOP_AI_KNOWLEDGE = {
  // Dữ liệu thô
  groups: GROUPS,
  byProvince: BY_PROVINCE,
  byStar: BY_STAR,
  cheapest10: CHEAPEST_10,
  priciest10: PRICIEST_10,

  // API tìm kiếm & hỗ trợ AI
  searchProducts,
  getByProvince,
  getFiveStarProducts,
  getByGroup,
  getByPriceRange,
  formatPrice,
  getAIContext,
  suggestGifts,

  // Meta
  totalProducts: ${totalProducts},
  totalGroups: ${Object.keys(allGroups).length},
  provinces: ${JSON.stringify(Object.keys(byProvince).sort())},
  groupKeys: ${JSON.stringify(Object.keys(allGroups))},
};

console.log('[OCOP AI Knowledge] Đã tải:', ${totalProducts}, 'sản phẩm từ', ${Object.keys(allGroups).length}, 'nhóm hàng');

})();
`;

fs.writeFileSync(path.join(__dirname, '..', 'ai-product-knowledge.js'), jsContent, 'utf8');

const stat = fs.statSync(path.join(__dirname, '..', 'ai-product-knowledge.js'));
console.log('\n✅ Đã tạo: ai-product-knowledge.js');
console.log('   Kích thước:', (stat.size / 1024).toFixed(1), 'KB');
console.log('   Tổng sản phẩm:', totalProducts);
console.log('   Tổng tỉnh thành:', Object.keys(byProvince).length);
console.log('   Phân loại sao:', Object.entries(byStar).map(([k,v])=>k+': '+v.length+'SP').join(', '));
