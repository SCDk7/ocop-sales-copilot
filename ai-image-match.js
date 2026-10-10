const {normalize} = require('./ai-shopping');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

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
    ['mat ong', 'honey'], ['hat dieu', 'cashew'], ['gao', 'rice']
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

module.exports = {matchImageEvidence, createCatalogImageMatcher};
