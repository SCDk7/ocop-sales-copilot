const test=require('node:test');
const assert=require('node:assert/strict');
const {answer}=require('./catalog-facts');
const {PRODUCTS}=require('./data');
test('MSP shorthand answers the code of the named product without unrelated price or gift advice',()=>{
 const {catalogReply}=require('./chat-fallback'),product=PRODUCTS.find(product=>product.id===336);
 for(const question of ['msp là j','mã sp là gì','mã số sản phẩm là gì','SKU']){
  const reply=catalogReply(product.name+' '+question,PRODUCTS);assert.equal(reply.productCode,'TD00336');assert(reply.message.startsWith('Dạ'));assert(reply.message.includes('TD00336'));assert(!/Giá|VNĐ|quà biếu/.test(reply.message));assert.equal(reply.responseMode,'verified_product_code');
 }
});
test('code follow-ups use the last referenced product including an image result, while ambiguous requests ask once',()=>{
 const {catalogReply}=require('./chat-fallback'),p=PRODUCTS[0];
 for(const role of ['user','assistant'])assert.equal(catalogReply('msp là j',PRODUCTS,'vi',[{role,text:p.name}]).productCode,p.productCode);
 const noContext=catalogReply('msp là j',PRODUCTS);assert.deepEqual(noContext.productIds,[]);assert.match(noContext.message,/sản phẩm nào/);
 const ambiguous=catalogReply('msp là j',PRODUCTS,'vi',[{role:'assistant',text:PRODUCTS.slice(0,2).map(product=>product.name).join('\n')}]);assert.deepEqual(ambiguous.productIds,[]);
 const giaLai=PRODUCTS.find(product=>product.region==='Gia Lai');assert.equal(catalogReply(giaLai.name+' msp là gì',PRODUCTS).productCode,giaLai.productCode);
});

test('product facts come from current catalogue fields without a model',()=>{
 const p=PRODUCTS.find(p=>p.id===336);
 const result=answer(`${p.name} giá bao nhiêu, mấy sao, xuất xứ và quy cách?`,PRODUCTS);
 assert.deepEqual(result.productIds,[p.id]);
 assert(result.message.includes(p.price.toLocaleString('vi-VN')));
 assert(result.message.includes(p.stars+' sao'));
 assert(result.message.includes(p.region));
 assert.equal(result.catalogChecked,true);
 assert.equal(result.integrations.gemini,false);
});
test('unknown, missing and ambiguous product data cannot become fabricated facts',()=>{
 const products=[{id:1,name:'Trà Mây Núi',region:'',price:null,stars:null}];
 const missing=answer('Trà Mây Núi giá bao nhiêu, mấy sao, nguồn gốc?',products);
 assert.match(missing.message,/chưa có dữ liệu/);
 assert(!missing.message.includes('4 sao'));
 assert.deepEqual(answer('Trà tên không có trong shop giá bao nhiêu?',products).productIds,[]);
 assert.deepEqual(answer('Trà Mây Núi giá bao nhiêu?',products.concat({...products[0],id:2})).productIds,[]);
});
test('follow-up price uses previous product while complaints and shopping stay in their flows',()=>{
 const products=[{id:1,name:'Trà Mây Núi',price:350000,stars:3,region:'Lào Cai'}];
 assert.deepEqual(answer('Giá bao nhiêu?',products,'vi',[{role:'user',text:'Trà Mây Núi'}]).productIds,[1]);
 assert.equal(answer('Hộp Trà Mây Núi bị mốc, giá bao nhiêu?',products),null);
 assert.equal(answer('Gợi ý quà dưới 500k',products),null);
 const {catalogReply}=require('./chat-fallback');
 assert.equal(catalogReply('Trà Mây Núi mấy sao?',products).responseMode,'verified_catalog_facts');
});
test('browser facts use the same catalogue guard',()=>{
 const vm=require('node:vm'),fs=require('node:fs');
 const context={AIShopping:require('./ai-shopping')};context.globalThis=context;
 vm.runInNewContext(fs.readFileSync('catalog-facts.js','utf8'),context);
 const reply=context.OCOPCatalogFacts.answer('Trà Mây Núi giá bao nhiêu?',[{id:1,name:'Trà Mây Núi',price:123000}]);
 assert(reply.message.includes('123.000'));
});
