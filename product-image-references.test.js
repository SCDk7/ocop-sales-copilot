const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {PRODUCTS} = require('./data');
const {createReferenceImageMatcher, getProductImageKnowledge, searchProductByImageKnowledge} = require('./ai-image-match');
const {publicURL, relevance} = require('./scripts/build-chatbot-image-references.cjs');
const {fetchImage, imageType} = require('./scripts/cache-image-references.cjs');

test('every current product has attributed search references and keeps its card image', () => {
  const knowledge = getProductImageKnowledge();
  assert.equal(knowledge.length, PRODUCTS.length);
  const totalReferences = knowledge.reduce((sum, item) => sum + (item.googleImages?.length || 0), 0);
  assert.ok(totalReferences>0,'Only actual attributed search results are retained');
  const directory=path.join(__dirname,'data/imports/chatbot-image-search-20261028');
  const discovered=fs.readdirSync(directory).filter(file=>/^batch-\d+\.json$/.test(file)).flatMap(file=>JSON.parse(fs.readFileSync(path.join(directory,file),'utf8')));
  for (const product of PRODUCTS) {
    const row = knowledge.find(item => item.id === product.id);
    assert.equal(row.name, product.name); assert.equal(row.region, product.region);
    assert.equal(row.cardImage, product.img);
    assert.equal(row.sourceSearch.status, 'searched');
    assert.ok(row.googleImages.length>0,product.name);
    assert.ok(row.googleImages.some(image => image.downloadStatus === 'ready'), product.name);
    for (const image of row.googleImages) {
      assert.ok(publicURL(image.imageUrl)); assert.ok(publicURL(image.page));
      assert.equal(image.relationship, 'similar_reference');
      assert.equal(image.reviewStatus, 'search_candidate');
      assert.ok(image.relevanceScore > 0, 'Relevance must be positive for ' + image.title);
      assert(discovered.some(search=>search.id===product.id&&search.name===product.name&&search.candidates.some(candidate=>candidate.imageUrl===image.imageUrl&&candidate.page===image.page)),'Image URL must have a recorded search result, never a generated URL');
    }
  }
});

test('summary reconciles to attributed reference images without altering product cards', () => {
  const summaryPath = path.join(__dirname, 'data', 'product-image-reference-summary.json');
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  assert.equal(summary.referenceImages,getProductImageKnowledge().reduce((sum,row)=>sum+row.googleImages.length,0));
  assert.equal(summary.products, 252);
  assert.equal(summary.searchedProducts, 252);
  assert.equal(summary.productsWithReferences, 252);
  assert.equal(summary.productCardImagesChanged, false);

  // Test AI Chatbot knowledge matching finds similar products
  const teaRow = getProductImageKnowledge().find(p => p.id === 336);
  const refImg = teaRow.googleImages[1];
  const matched = searchProductByImageKnowledge({imageUrl: refImg.imageUrl, label: 'Trà Phúc Lộc Thọ'});
  assert.ok(matched.length > 0);
  assert.equal(matched[0].id, 336);
  assert.equal(matched[0].name, teaRow.name);
});

test('workbook searches map all catalogue identities internally and never become customer search links',()=>{
 const input=require('./data/product-image-search-input.json');
 const {normalizeSearchURL}=require('./scripts/import-product-image-searches.cjs');
 assert.equal(input.entries.length,PRODUCTS.length);assert.equal(new Set(input.entries.map(row=>row.id)).size,PRODUCTS.length);
 const knowledge=getProductImageKnowledge();
 for(const entry of input.entries){
  const product=PRODUCTS.find(product=>product.id===entry.id);assert.equal(entry.name,product.name);assert.equal(entry.region,product.region);
  const row=knowledge.find(row=>row.id===entry.id);assert.equal(row.sourceSearch.googleSearchUrl,normalizeSearchURL(entry.searchUrl));assert.equal(row.sourceSearch.usage,'internal_only');assert.equal(row.sourceSearch.workbookSha256,input.sha256);
 }
 const {formatVisualReply}=require('./ai-visual-reply'),reply=formatVisualReply([PRODUCTS[0]],{status:'similar'});
 assert(reply.includes(PRODUCTS[0].name));assert(reply.includes(PRODUCTS[0].price.toLocaleString('vi-VN')));assert(!/https?:|google\.com|tbm=isch/.test(reply));
});

test('import accepts only public Google Images queries and decodes Excel hyperlink entities',()=>{
 const {normalizeSearchURL}=require('./scripts/import-product-image-searches.cjs');
 const valid=normalizeSearchURL('https://www.google.com/search?q=tea&amp;tbm=isch');assert.equal(new URL(valid).searchParams.get('tbm'),'isch');
 for(const value of ['file:///secret','http://127.0.0.1/search?q=x&tbm=isch','https://google.com.evil.test/search?q=x&tbm=isch','https://www.google.com/search?q=tea','https://www.google.com/search?tbm=isch','https://user:pass@google.com/search?q=x&tbm=isch'])assert.throws(()=>normalizeSearchURL(value));
});

test('cached reference bytes have the recorded digest and can be matched without changing catalogue images', async () => {
  const knowledge = getProductImageKnowledge();
  const row = knowledge[0];
  const product = PRODUCTS.find(product => product.id === row.id);
  const image = row.googleImages.find(image => image.downloadStatus === 'ready');
  const bytes = fs.readFileSync(path.join(__dirname, image.localPath));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), image.sha256);
  const match = createReferenceImageMatcher(__dirname);
  assert.deepEqual(await match([product], [bytes]), [[product.id]]);
  assert.deepEqual(await match([{...product, name: 'A different product now uses this ID'}], [bytes]), [[]]);
  const shared = createReferenceImageMatcher(__dirname, () => [row, {...row, id: 999}]);
  assert.deepEqual(await shared([product, {...product, id: 999}], [bytes]), [[product.id, 999]]);
});

test('filenames, captions and guessed colours cannot masquerade as image recognition', () => {
  assert.deepEqual(searchProductByImageKnowledge({text: 'Trà Phúc', fileName: 'tea.jpg', color: 'green_leaf_emerald'}), []);
});

test('reference filtering distinguishes food names from packaging words and province names', () => {
  const candidate = title => ({title, page: 'https://example.com/product'});
  assert.ok(relevance({name: 'Bánh chưng Tranh Khúc hút chân không', region: 'Hà Nội'}, candidate('Bánh chưng làng Tranh Khúc')) > 0);
  assert.equal(relevance({name: 'Bánh chưng Tranh Khúc hút chân không', region: 'Hà Nội'}, candidate('Chăn bông tơ tằm')), 0);
  assert.ok(relevance({name: 'Bột sắn dây nguyên chất cao cấp Hà Nam', region: 'Hà Nam'}, candidate('Bột sắn dây nguyên chất')) > 0);
  assert.equal(relevance({name: 'Miến dong Trà Lĩnh thượng hạng', region: 'Cao Bằng'}, candidate('Trà xanh cao cấp')), 0);
  assert.ok(relevance({name: 'Bộ đèn tre Đức Phong (Thủ công mỹ nghệ)', region: 'Nghệ An'}, candidate('Bộ đèn tre Đức Phong')) > 0);
});

test('the download cache rejects local URLs and HTML responses disguised as image URLs', async () => {
  for (const url of ['file:///secret', 'http://127.0.0.1/image.jpg', 'http://localhost/image.jpg', 'http://192.168.1.1/image.jpg', 'https://user:password@example.com/image.jpg']) assert.equal(publicURL(url), null);
  assert.equal(imageType(Buffer.from('<html>not an image</html>')), null);
  await assert.rejects(fetchImage('https://example.com/photo.jpg', async () => new Response('<html>blocked</html>', {headers: {'Content-Type': 'image/jpeg'}})), /not a supported raster image/);
});
