const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname,'../../index.html');
let html = fs.readFileSync(file,'utf8');
// Load data once, before any catalogue-dependent scripts.
html = html.replace(/\s*<script src="data\.js"><\/script>/g,'');
html = html.replace('    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>', '    <script src="data.js"></script>\n    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>');
html = html.replace(/const products = \[[\s\S]*?\n        \];/, 'const products = window.PRODUCTS;');
html = html.replace('${p.rating} (${p.reviews} ${currentLanguage === \'en\' ? \'reviews\' : \'đánh giá\'})','${getProductReviewLabel(p)}');
html = html.replace('${p.rating} (${p.reviews} ${currentLanguage === \'en\' ? \'reviews\' : \'Đánh giá\'})','${getProductReviewLabel(p)}');
html = html.replace('${product.rating.toFixed(1)}/5', '${getProductReviewLabel(product)}');
html = html.replace(/\$\{p\.origPrice\.toLocaleString\('vi-VN'\)\} ₫/g, '${p.origPrice > p.price ? p.origPrice.toLocaleString(\'vi-VN\') + \' ₫\' : \'\'}');
html = html.replace("${p.stars} ${currentLanguage === 'en' ? 'STAR' : 'SAO QUỐC GIA'}", "OCOP ${p.stars} ${currentLanguage === 'en' ? 'STARS' : 'SAO'}");
html = html.replace('class="product-card-image w-full h-full object-cover"', 'class="product-card-image w-full h-full ${p.catalogImport ? \'object-contain p-2\' : \'object-cover\'}"');
html = html.replace('<img src="${p.img}" class="w-full h-full object-cover">', '<img src="${p.img}" alt="${getProductName(p)}" decoding="async" class="w-full h-full ${p.catalogImport ? \'object-contain p-3\' : \'object-cover\'}">');
const marker = '        function getProductDescription(product) {';
if (!html.includes('function getProductReviewLabel(')) html = html.replace(marker, `        function getProductReviewLabel(product) {\n            if (!Number.isFinite(product.rating) || !product.reviews) {\n                return currentLanguage === 'en' ? 'No customer reviews yet' : 'Chưa có đánh giá';\n            }\n            return product.rating.toFixed(1) + ' (' + product.reviews + ' ' + (currentLanguage === 'en' ? 'reviews' : 'đánh giá') + ')';\n        }\n\n${marker}`);
fs.writeFileSync(file,html);
console.log('Website now reads the same data.js catalogue as the chatbot and server.');
