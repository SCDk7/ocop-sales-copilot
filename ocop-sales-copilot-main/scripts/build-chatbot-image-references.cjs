const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const {normalize} = require('../ai-shopping');

const root = path.resolve(__dirname, '..');
const searchDirectory = path.join(root, 'data/imports/chatbot-image-search-20261028');
const outputPath = path.join(root, 'data/product-image-knowledge.json');
const stopwords = new Set('san pham dac ocop thuong hang cao cap nguyen chat chinh hieu chuan tieu xuat khau dong goi hop hui hut chan khong loai tu nhien nguyen ban tham khao'.split(' '));
const types = [
  /^chan\b/, /\blua\b|\bto tam\b/, /\bgom\b|\bsu\b/, /\bdua go\b/, /\bgo\b/, /\bmay tre\b|\btre dan\b/,
  /\bdong trung ha thao\b/, /\bsam\b|\bginseng\b/, /\bnam\b|\bmushroom\b/, /\bcao\b/,
  /\bnuoc mam\b|\bfish sauce\b/, /\bmat ong\b|\bhoney\b/, /\bhat dieu\b|\bcashew\b/, /\bmac ca\b|\bmacca\b|\bmacadamia\b/,
  /\bca phe\b|\bcoffee\b/, /\bcacao\b|\bcocoa\b|\bca cao\b/, /\btra\b|\bche\b|\btea\b/,
  /\bgao\b|\bnep\b|\brice\b/, /\bmien\b|\bbun\b|\bpho\b|\bvermicelli\b/, /\bhat sen\b|\bsen hong\b/,
  /\bque\b|\bcinnamon\b/, /\btieu\b|\bpepper\b/, /\btoi\b|\bgarlic\b/, /\bmuoi\b|\bsalt\b/,
  /\bduong thot not\b|\bpalm sugar\b/, /\bnuoc\b/, /\bruou\b|\bwine\b/,
  /\byen\b|\bbird nest\b/, /\bmuc\b|\bsquid\b/, /\bcua\b|\bcrab\b/, /\btom\b|\bshrimp\b/,
  /\blap xuong\b|\bsausage\b/, /\bnem\b/, /\bthit\b|\bbo mot nang\b|\bbo kho\b|\bkho bo\b|\bcha bo\b|\btrau\b/, /\bca\b|\bfish\b/,
  /\bbanh chung\b/, /\bbanh pia\b/, /\bbanh trang\b/, /\bbanh\b/, /\bkeo\b/, /\bcom\b/,
  /\bmang\b|\bbamboo shoots\b/, /\bxoai\b|\bmango\b/, /\bchuoi\b|\bbanana\b/, /\bmit\b|\bjackfruit\b/,
  /\bdua\b|\bcoconut\b/, /\bnhan\b|\blongan\b/, /\bvai\b|\blychee\b/, /\bbuoi\b|\bpomelo\b/,
  /\bkhom\b|\bdua\b|\bpineapple\b/, /\bhat\b|\bnuts\b/, /\btinh dau\b|\bessential oil\b/
];

function publicURL(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port && !['80', '443'].includes(url.port)) return null;
    if (host === 'localhost' || /\.(?:localhost|local|internal)$/.test(host)) return null;
    if (net.isIP(host)) {
      if (host.includes(':') || /^(?:0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host)) return null;
    }
    url.hash = '';
    return url.href;
  } catch { return null; }
}

function relevance(product, candidate) {
  const name = normalize(product.name.replace(/\([^)]*\)/g, '').replace(/hút chân không/gi, '')).replace(normalize(product.region), ' ')
    .replace(/\b(?:cao cap|thuong hang|nguyen chat|chinh hang|tuyen chon|chat luong cao)\b/g, ' ');
  let sourcePath = '';
  try { sourcePath = decodeURIComponent(new URL(candidate.page).pathname); } catch {}
  const text = normalize(candidate.title + ' ' + sourcePath).replace(/[^a-z0-9]+/g, ' ');
  const region = new Set(normalize(product.region).split(/[^a-z0-9]+/));
  const words = [...new Set(name.split(/[^a-z0-9]+/).filter(word => word.length >= 3 && !stopwords.has(word) && !region.has(word)))];
  const hits = words.filter(word => (' ' + text + ' ').includes(' ' + word + ' ')).length;
  const type = types.map(pattern => ({pattern, index: name.search(pattern)})).filter(row => row.index >= 0).sort((a, b) => a.index - b.index)[0]?.pattern;
  if (type && !type.test(text) || !type && hits < Math.min(2, words.length) || hits === 0) return 0;
  return Math.round(100 * hits / Math.max(1, words.length)) + (type ? 15 : 0);
}

function buildProductImageKnowledge({products, directory = searchDirectory, output = outputPath, writeReports = true} = {}) {
  products ||= require('../data').PRODUCTS;
  const searches = fs.readdirSync(directory).filter(file => /^batch-\d+\.json$/.test(file)).sort()
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));
  let previous = [];
  try { previous = JSON.parse(fs.readFileSync(output, 'utf8')); } catch {}
  let imported={entries:[]};
  try{imported=JSON.parse(fs.readFileSync(path.join(root,'data/product-image-search-input.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  const knowledge = products.map(product => {
    const matches = searches.filter(search => search.id === product.id && search.name === product.name && search.region === product.region);
    const candidates = new Map();
    for (const search of matches) for (const candidate of search.candidates || []) {
      const imageUrl = publicURL(candidate.imageUrl), page = publicURL(candidate.page);
      const score = relevance(product, candidate);
      if (!imageUrl || !page || score === 0) continue;
      const row = {...candidate, imageUrl, page, relationship: 'similar_reference', reviewStatus: 'search_candidate', relevanceScore: score};
      if (!candidates.has(imageUrl) || candidates.get(imageUrl).relevanceScore < score) candidates.set(imageUrl, row);
    }
    const cached = previous.find(row => row.id === product.id && row.name === product.name && row.region === product.region);
    const readyURLs=new Set((cached?.googleImages||[]).filter(image=>image.downloadStatus==='ready').map(image=>image.imageUrl));
    const googleImages = [...candidates.values()].sort((a,b)=>Number(readyURLs.has(b.imageUrl))-Number(readyURLs.has(a.imageUrl))||b.relevanceScore-a.relevanceScore||a.searchRank-b.searchRank).slice(0,12);
    const input=imported.entries?.find(row=>row.id===product.id&&row.name===product.name&&row.region===product.region);
    for (const image of googleImages) {
      const prior = cached?.googleImages.find(row => row.imageUrl === image.imageUrl && row.downloadStatus === 'ready');
      if (prior) for (const key of ['downloadStatus', 'downloadedAt', 'localPath', 'sha256', 'bytes', 'mimeType', 'finalUrl']) image[key] = prior[key];
    }
    return {
      id: product.id, name: product.name, nameEn: product.nameEn || product.name, region: product.region,
      category: product.category, stars: product.stars, price: product.price, unit: product.packaging || 'đơn vị',
      cardImage: product.img,
      knowledgeVersion: '20261028-web-references-v1',
      identificationPolicy: 'References suggest similar products; they do not establish brand, origin, certification or stock.',
      googleImages, totalGoogleImages: googleImages.length,
      sourceSearch: {status: matches.length ? 'searched' : 'not_searched', engine: 'web_image_search',
        searchedAt: matches[0]?.searchedAt || null, queries: [...new Set(matches.map(search => search.query))],
        googleSearchUrl: input?.searchUrl||matches[0]?.googleSearchUrl || '',
        ...(input?{workbookSource:imported.source,workbookSha256:imported.sha256,inputQuery:input.query,usage:'internal_only'}:{})},
      visualFeatures: {keywords: [...new Set(normalize([product.name, product.nameEn, product.region].join(' ')).split(/[^a-z0-9]+/).filter(word => word.length >= 3))]}
    };
  });
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.writeFileSync(output, JSON.stringify(knowledge, null, 2) + '\n');
  if (writeReports) writeSummary(knowledge, {rawSearchResults: searches.reduce((sum, row) => sum + (row.candidates?.length || 0), 0)});
  return knowledge;
}

function writeSummary(knowledge, extra = {}) {
  const reportPath = path.join(root, 'data/product-image-reference-summary.json');
  let previous = {};
  try { previous = JSON.parse(fs.readFileSync(reportPath, 'utf8')); } catch {}
  const summary = {...previous, ...extra, updatedAt: new Date().toISOString(), products: knowledge.length,
    searchedProducts: knowledge.filter(row => row.sourceSearch?.status === 'searched').length,
    referenceImages: knowledge.reduce((sum, row) => sum + row.googleImages.length, 0),
    productsWithReferences: knowledge.filter(row => row.googleImages.length).length,
    cachedImages: knowledge.reduce((sum, row) => sum + row.googleImages.filter(image => image.downloadStatus === 'ready').length, 0),
    uniqueCachedImages: new Set(knowledge.flatMap(row => row.googleImages.filter(image => image.downloadStatus === 'ready').map(image => image.sha256))).size,
    productsWithCachedImages: knowledge.filter(row => row.googleImages.some(image => image.downloadStatus === 'ready')).length,
    missingReferences: knowledge.filter(row => !row.googleImages.length).map(({id, name}) => ({id, name})),
    productCardImagesChanged: false};
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2) + '\n');
  const quote = value => '"' + String(value ?? '').replace(/"/g, '""') + '"';
  const csv = [['id', 'name', 'region', 'reference_images', 'cached_images', 'google_search_url'],
    ...knowledge.map(row => [row.id, row.name, row.region, row.googleImages.length, row.googleImages.filter(image => image.downloadStatus === 'ready').length, row.sourceSearch.googleSearchUrl])]
    .map(row => row.map(quote).join(',')).join('\r\n');
  fs.writeFileSync(path.join(root, 'data/product-image-catalog.csv'), '\uFEFF' + csv + '\r\n');
  return summary;
}

if (require.main === module) {
  const knowledge = buildProductImageKnowledge();
  console.log(JSON.stringify(writeSummary(knowledge), null, 2));
}
module.exports = {buildProductImageKnowledge, publicURL, relevance, writeSummary, outputPath};
