const {normalize} = require('./ai-shopping');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

let productImageKnowledge = null;
let knowledgeStamp = null;
function getProductImageKnowledge() {
    try {
      const kbPath = path.join(__dirname, 'data', 'product-image-knowledge.json');
      const stat = require('node:fs').statSync(kbPath);
      const stamp = stat.mtimeMs + ':' + stat.size;
      if (productImageKnowledge && knowledgeStamp === stamp) return productImageKnowledge;
      const raw = require('node:fs').readFileSync(kbPath, 'utf8');
      const parsed = JSON.parse(raw);
      productImageKnowledge = Array.isArray(parsed) ? parsed : [];
      knowledgeStamp = stamp;
    } catch (_) {
      productImageKnowledge = [];
      knowledgeStamp = null;
    }
  return productImageKnowledge;
}

function createReferenceImageMatcher(root, loadKnowledge = getProductImageKnowledge) {
  let key, pending;
  const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  return async (products, buffers) => {
    if (!buffers.length) return [];
    const knowledge = loadKnowledge();
    const valid = knowledge.filter(row => products.some(product => product.id === row.id && product.name === row.name && product.region === row.region));
    const references = valid.flatMap(row => (row.googleImages || []).filter(image => image.downloadStatus === 'ready' && image.relationship === 'similar_reference')
      .map(image => ({id: row.id, path: image.localPath, sha256: image.sha256})));
    const currentKey = JSON.stringify(references);
    if (currentKey !== key) {
      key = currentKey;
      pending = (async () => {
        const index = new Map();
        const directory = path.resolve(root, 'data/image-references') + path.sep;
        for (const reference of references) {
          if (typeof reference.path !== 'string' || !reference.path.startsWith('data/image-references/') || !/^[a-f0-9]{64}$/.test(reference.sha256 || '')) continue;
          const file = path.resolve(root, reference.path);
          if (!file.startsWith(directory)) continue;
          try {
            const bytes = await fs.readFile(file);
            if (bytes.length > 3 * 1024 * 1024 || digest(bytes) !== reference.sha256) continue;
            if (!index.has(reference.sha256)) index.set(reference.sha256, []);
            if (!index.get(reference.sha256).includes(reference.id)) index.get(reference.sha256).push(reference.id);
          } catch { /* Unavailable references continue through the existing vision flow. */ }
        }
        return index;
      })();
    }
    const index = await pending;
    return buffers.map(bytes => index.get(digest(bytes)) || []);
  };
}

function createCatalogImageMatcher(root) {
  let catalogKey, indexPromise;
  const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  return async (products, buffers) => {
    if (!buffers.length) return [];
    const key = JSON.stringify(products.map(({id,img}) => [id,img]));
    if (key !== catalogKey) {
      catalogKey = key;
      indexPromise = (async () => {
        const index = new Map();
        for (const product of products) {
          if (typeof product.img !== 'string' || !product.img.startsWith('images/')) continue;
          const filename = path.resolve(root, product.img);
          if (!filename.startsWith(path.resolve(root) + path.sep)) continue;
          try {
            const hash = digest(await fs.readFile(filename));
            if (!index.has(hash)) index.set(hash, []);
            index.get(hash).push(product.id);
          } catch (_) { /* Missing local pictures continue through vision recognition. */ }
        }
        return index;
      })();
    }
    const index = await indexPromise;
    return buffers.map(bytes => index.get(digest(bytes)) || []);
  };
}

// Only vision evidence may drive this lookup; captions are not visual evidence.
function matchImageEvidence(products, evidence = {}) {
  const type = normalize(evidence.productType || '').trim();
  const label = normalize(evidence.label || '').trim();
  if (!type || /^(unknown|unidentified|khong ro|san pham|product)$/.test(type)) return [];
  const aliases = [
    ['ca phe', 'coffee'], ['tra', 'tea'], ['cacao', 'ca cao', 'cocoa'],
    ['mat ong', 'honey'], ['hat dieu', 'cashew'], ['gao', 'rice'],
    ['que', 'cinnamon', 'vo que', 'que ong', 'que thanh', 'que kho'],
    ['yen', 'yen sao', 'to yen', 'bird nest'],
    ['tieu', 'hat tieu', 'pepper', 'black pepper'],
    ['toi', 'toi den', 'toi co don', 'black garlic', 'garlic'],
    ['nam', 'nam huong', 'nam linh chi', 'nam lim xanh', 'mushroom'],
    ['tom', 'tom kho', 'dried shrimp', 'shrimp'],
    ['cua', 'cua bien', 'cua ca mau', 'cua nam can', 'crab'],
    ['ca loc', 'kho ca loc', 'ca kho', 'fish'],
    ['thit trau', 'trau gac bep', 'thit kho', 'meat'],
    ['banh pia', 'pia'],
    ['nem chua', 'nem', 'nem lai vung'],
    ['duong thot not', 'thot not', 'palm sugar'],
    ['nuoc mam', 'fish sauce'],
    ['sam', 'nhan sam', 'ginseng', 'sam ngoc linh'],
    ['dong trung ha thao', 'nam dong trung ha thao', 'cordyceps'],
    ['gom', 'gom su', 'ceramic', 'ceramics', 'pottery'],
    ['may tre', 'may tre dan', 'bamboo', 'rattan'],
    ['tho cam', 'textile', 'textiles', 'weaving'],
    ['mien', 'mien dong', 'mien dao', 'bun', 'pho', 'vermicelli', 'noodles', 'noodle', 'banh da', 'soi']
  ];
  const phrase = (text, term) => (` ${text} `).includes(` ${term} `);
  const family=aliases.map(terms=>({terms,prefix:Math.max(0,...terms.filter(term=>type===term||type.startsWith(term+' ')).map(term=>term.length)),length:Math.max(0,...terms.filter(term=>phrase(type,term)).map(term=>term.length))}))
    .filter(group=>group.length).sort((a,b)=>b.prefix-a.prefix || b.length-a.length)[0];
  const terms = family?.terms || [type];
  let candidates = products.filter(product => terms.some(term => phrase(normalize(product.name || ''), term)));
  if(terms.includes('pottery')) candidates=candidates.filter(product=>!phrase(normalize(product.name||''),'ruou'));
  // A visible catalogue region narrows candidates; never replace it with another province.
  const visibleRegions = [...new Set(products.map(product => normalize(product.region || '')).filter(region => region && phrase(label, region)))];
  if (visibleRegions.length) candidates = candidates.filter(product => visibleRegions.includes(normalize(product.region || '')));
  const labelWords = [...new Set(label.split(/[^a-z0-9]+/).filter(word => word.length >= 3))];
  const typeWords = [...new Set(type.split(/[^a-z0-9]+/).filter(word => word.length >= 2))];
  const knowledge = new Map(getProductImageKnowledge().map(row => [row.id, row]));
  return candidates.map(product => {
    const name = normalize(product.name || '');
    const reference = knowledge.get(product.id);
    const titles = reference?.name === product.name && reference?.region === product.region
      ? (reference.googleImages || []).map(image => normalize(image.title || '')) : [];
    const referenceScore = titles.length ? Math.max(...titles.map(title => labelWords.filter(word => phrase(title, word)).length)) : 0;
    return {id:product.id, score:(phrase(name,type)?30:0)+typeWords.filter(word=>phrase(name,word)).length*3+labelWords.filter(word => phrase(name, word)).length * 4 + referenceScore};
  }).sort((a,b) => b.score-a.score || a.id-b.id).slice(0,3).map(product => product.id);
}

/**
 * Ranks reference records using observed labels/types or a known source image URL.
 * Captions, filenames and guessed colours alone are not visual evidence.
 */
function searchProductByImageKnowledge({ text = '', label = '', productType = '', fileName = '', imageUrl = '', color = '' } = {}) {
  const kb = getProductImageKnowledge();
  if (!kb || !kb.length) return [];

  if (!label.trim() && !productType.trim() && !imageUrl) return [];
  const rawQuery = [label, productType].filter(Boolean).join(' ');
  const normQuery = normalize(rawQuery);
  const queryTokens = [...new Set(normQuery.split(/[^a-z0-9]+/).filter(w => w.length >= 2))];

  const results = kb.map(item => {
    let score = 0;
    const nameNorm = normalize(item.name || '');
    const regionNorm = normalize(item.region || '');
    const keywords = (item.visualFeatures && item.visualFeatures.keywords) || [];

    // 1. Direct name or region match in query
    if (nameNorm && normQuery.includes(nameNorm)) score += 50;
    if (regionNorm && normQuery.includes(regionNorm)) score += 15;

    // 2. Keyword overlap
    queryTokens.forEach(token => {
      if (token.length >= 3 && nameNorm.includes(token)) score += 6;
      if (keywords.includes(token)) score += 4;
    });

    // 3. Google images match (candidate URL or candidate title match)
    if (imageUrl) {
      const matchedImg = item.googleImages?.some(g => g.imageUrl === imageUrl);
      if (matchedImg) score += 80;
    }
    if (item.googleImages && queryTokens.length) {
      item.googleImages.forEach(g => {
        const titleNorm = normalize(g.title || '');
        queryTokens.forEach(token => {
          if (token.length >= 4 && titleNorm.includes(token)) score += 2;
        });
      });
    }

    return { item, score };
  });

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || a.item.id - b.item.id)
    .slice(0, 3)
    .map(r => r.item);
}

function detectVisualCategory(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 32) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    try {
      const zlib = require('node:zlib');
      let pos = 8;
      const idatChunks = [];
      let width = 0, height = 0;
      while (pos < buf.length) {
        const len = buf.readUInt32BE(pos);
        const type = buf.slice(pos + 4, pos + 8).toString('ascii');
        if (type === 'IHDR') {
          width = buf.readUInt32BE(pos + 8);
          height = buf.readUInt32BE(pos + 12);
        } else if (type === 'IDAT') {
          idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
        }
        pos += 12 + len;
      }
      if (!width || !height || !idatChunks.length) return null;
      const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
      const stride = 1 + width * 4;
      let amber = 0, green = 0, dark = 0, total = 0;
      const prevRow = Buffer.alloc(width * 4);
      const curRow = Buffer.alloc(width * 4);
      const stepY = Math.max(1, Math.floor(height / 80));
      const stepX = Math.max(1, Math.floor(width / 80));
      for (let y = 0; y < height; y++) {
        const rowOffset = y * stride;
        const filter = decompressed[rowOffset];
        for (let x = 0; x < width * 4; x++) {
          const raw = decompressed[rowOffset + 1 + x];
          const a = x >= 4 ? curRow[x - 4] : 0;
          const b = prevRow[x];
          const c = x >= 4 ? prevRow[x - 4] : 0;
          let val = raw;
          if (filter === 1) val = (raw + a) & 0xff;
          else if (filter === 2) val = (raw + b) & 0xff;
          else if (filter === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
          else if (filter === 4) {
            const p = a + b - c;
            const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
            const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
            val = (raw + pr) & 0xff;
          }
          curRow[x] = val;
        }
        prevRow.set(curRow);
        if (y % stepY === 0) {
          for (let x = 0; x < width; x += stepX) {
            const px = x * 4;
            const r = curRow[px], g = curRow[px+1], b = curRow[px+2];
            total++;
            if (r > 155 && g > 105 && b < 135 && (r - b) > 35) amber++;
            else if (g > r + 15 && g > b + 15 && g > 60) green++;
            else if (r < 85 && g < 65 && b < 50 && Math.max(r,g,b) < 95) dark++;
          }
        }
      }
      if (total > 0) {
        if (amber / total > 0.06) return 'Mật ong';
        if (green / total > 0.12) return 'Trà';
        if (dark / total > 0.12) return 'Cà phê';
      }
    } catch (_) {}
  }
  return null;
}

module.exports = {
  detectVisualCategory,
  matchImageEvidence,
  createCatalogImageMatcher,
  createReferenceImageMatcher,
  getProductImageKnowledge,
  searchProductByImageKnowledge
};
