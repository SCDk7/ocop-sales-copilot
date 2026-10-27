const {normalize} = require('./ai-shopping');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

let productImageKnowledge = null;
function getProductImageKnowledge() {
  if (!productImageKnowledge) {
    try {
      const kbPath = path.join(__dirname, 'data', 'product-image-knowledge.json');
      const raw = require('node:fs').readFileSync(kbPath, 'utf8');
      productImageKnowledge = JSON.parse(raw);
    } catch (_) {
      productImageKnowledge = [];
    }
  }
  return productImageKnowledge;
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
    ['dong trung ha thao', 'cordyceps']
  ];
  const phrase = (text, term) => (` ${text} `).includes(` ${term} `);
  const terms = aliases.find(group => group.some(term => phrase(type, term))) || [type];
  let candidates = products.filter(product => terms.some(term => phrase(normalize(product.name || ''), term)));
  // A visible catalogue region narrows candidates; never replace it with another province.
  const visibleRegions = [...new Set(products.map(product => normalize(product.region || '')).filter(region => region && phrase(label, region)))];
  if (visibleRegions.length) candidates = candidates.filter(product => visibleRegions.includes(normalize(product.region || '')));
  const labelWords = [...new Set(label.split(/[^a-z0-9]+/).filter(word => word.length >= 3))];
  return candidates.map(product => {
    const name = normalize(product.name || '');
    return {id:product.id, score:labelWords.filter(word => phrase(name, word)).length};
  }).sort((a,b) => b.score-a.score || a.id-b.id).slice(0,2).map(product => product.id);
}

/**
 * Searches the 252-product Google Image Knowledge Base for matching OCOP products
 * based on image metadata, OCR label, visual keywords, filename, or candidate URLs.
 */
function searchProductByImageKnowledge({ text = '', label = '', productType = '', fileName = '', imageUrl = '', color = '' } = {}) {
  const kb = getProductImageKnowledge();
  if (!kb || !kb.length) return [];

  const rawQuery = [text, label, productType, fileName].filter(Boolean).join(' ');
  const normQuery = normalize(rawQuery);
  const queryTokens = [...new Set(normQuery.split(/[^a-z0-9]+/).filter(w => w.length >= 2))];

  const results = kb.map(item => {
    let score = 0;
    const nameNorm = normalize(item.name || '');
    const regionNorm = normalize(item.region || '');
    const keywords = (item.visualFeatures && item.visualFeatures.keywords) || [];

    // 1. Direct name or region match in query
    if (normQuery.includes(nameNorm)) score += 50;
    if (regionNorm && normQuery.includes(regionNorm)) score += 15;

    // 2. Keyword overlap
    queryTokens.forEach(token => {
      if (token.length >= 3 && nameNorm.includes(token)) score += 6;
      if (keywords.includes(token)) score += 4;
    });

    // 3. Google images match (candidate URL or candidate title match)
    if (imageUrl) {
      const matchedImg = item.googleImages?.some(g => g.imageUrl === imageUrl || (g.page && imageUrl.includes(g.page)));
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

    // 4. Color / visual match
    if (color && item.visualFeatures?.dominantColor === color) {
      score += 5;
    }

    return { item, score };
  });

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || a.item.id - b.item.id)
    .slice(0, 3)
    .map(r => r.item);
}

module.exports = {
  matchImageEvidence,
  createCatalogImageMatcher,
  getProductImageKnowledge,
  searchProductByImageKnowledge
};
