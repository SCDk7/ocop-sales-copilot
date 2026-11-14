'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const { PRODUCTS } = require('../data');
const knowledge = require('../data/product-image-knowledge.json');
const root = path.resolve(__dirname, '..');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function main() {
  const rows = [];
  const productById = new Map(PRODUCTS.map(product => [product.id, product]));
  const sources = PRODUCTS.map(product => ({ id: product.id, file: product.img }));
  for (const row of knowledge) {
    const product = productById.get(row.id);
    if (!product || product.name !== row.name || product.region !== row.region) continue;
    for (const reference of row.googleImages || []) {
      if (reference.downloadStatus === 'ready' && reference.relationship === 'similar_reference')
        sources.push({ id: row.id, file: reference.localPath, sha256: reference.sha256 });
    }
  }
  for (const source of sources) {
    if (typeof source.file !== 'string' || !/^(images|data\/image-references)\/[\w./-]+$/.test(source.file)) continue;
    const file = path.resolve(root, source.file);
    if (!file.startsWith(root + path.sep)) continue;
    let bytes;
    try { bytes = fs.readFileSync(file); } catch { continue; }
    if (bytes.length > 12 * 1024 * 1024 || (source.sha256 && digest(bytes) !== source.sha256)) continue;
    try {
      const raw = await sharp(bytes, { limitInputPixels: 24000000 }).rotate().flatten({ background: '#ffffff' })
        .resize(24, 24, { fit: 'fill' }).removeAlpha().toColourspace('srgb').raw().toBuffer();
      if (raw.length === 24 * 24 * 3) rows.push([source.id, raw.toString('base64')]);
    } catch { /* A broken reference is excluded. */ }
  }
  const body = `(function(root){root.OCOPImageFingerprints=${JSON.stringify(rows)};})(typeof window!=='undefined'?window:globalThis);\n`;
  fs.writeFileSync(path.join(root, 'image-fingerprints.js'), body);
  console.log(`Built ${rows.length} local image fingerprints.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
