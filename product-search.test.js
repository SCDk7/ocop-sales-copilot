const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {PRODUCTS}=require('./data'),{search}=require('./product-search');
test('tea search matches product type rather than substrings, place names or advertising descriptions',()=>{
 const result=search(PRODUCTS,'trà');assert(result.length>0);assert.deepEqual(result.map(p=>p.id),search(PRODUCTS,'tra').map(p=>p.id));
 for(const id of [425,464])assert(!result.some(p=>p.id===id));
 assert(result.some(p=>p.id===341));assert(result.some(p=>p.id===465));
 const fake={id:999,name:'Bánh tráng',nameEn:'Rice paper',region:'Đồng Nai',category:'snack',desc:'Dùng cùng trà',tag:'chè ngon'};assert.equal(search([fake],'trà').length,0);
});
test('search combines product, province, budget and stars without returning unrelated items',()=>{
 const result=search(PRODUCTS,'trà Hà Giang');assert(result.length>0);assert(result.every(p=>p.region==='Hà Giang'));assert(result.some(p=>p.id===341));
 assert.deepEqual(search(PRODUCTS,'Hà Giang trà').map(p=>p.id),result.map(p=>p.id));assert(!search(PRODUCTS,'Cao Bằng trà').some(p=>p.id===425));
 const budget=search(PRODUCTS,'trà dưới 200k 5 sao');assert(budget.length>0);assert(budget.every(p=>p.price<=200000&&p.stars>=5));assert(!budget.some(p=>p.id===425));
 assert.equal(search(PRODUCTS,'bưởi Tân Triều').length,0);assert.equal(search(PRODUCTS,'sản phẩm không tồn tại abcxyz').length,0);
});
test('product codes and group prefixes match canonical products, with stable catalogue order for ties',()=>{
 assert.deepEqual(search(PRODUCTS,'td00336').map(p=>p.id),[336]);assert(search(PRODUCTS,'TD').every(p=>p.productCode.startsWith('TD')));
 assert(search(PRODUCTS,'bánh tráng').every(p=>/Bánh tráng/i.test(p.name)));assert(search(PRODUCTS,'mật ong').every(p=>/Mật ong/i.test(p.name)));
 assert.deepEqual(search(PRODUCTS,''),PRODUCTS);
});
test('both storefront pages use the same search and do not broaden a failed search outside active filters',()=>{
 for(const file of ['index.html','index_2.html']){
  const html=fs.readFileSync(file,'utf8'),start=html.indexOf('        function filterProductsGlobal('),end=html.indexOf('        // Lắng nghe',start),source=html.slice(start,end);assert(source.includes('window.OCOPProductSearch.search(filtered,query)'));assert(!source.includes('fallbackMatches'));assert(!source.includes('provFiltered :'));assert(html.includes('src="product-search.js'));
  let rows;const element=()=>({value:'',classList:{add(){},remove(){}}});
  const context={window:{OCOPProductSearch:{search}},products:PRODUCTS,document:{getElementById:()=>element()},productSearchTimer:null,clearTimeout(){},selectedProvince:{name:'Hà Nội'},normalizeProvinceName:value=>value.toLowerCase(),currentCategory:'gift',currentMacroRegion:null,currentShopeeStarFilter:'all',currentSortMode:'default',renderProducts:value=>{rows=value;},updateProvinceSelectionStatus(){}};
  vm.runInNewContext(source,context);context.filterProductsGlobal('trà Hà Giang');assert.equal(rows.length,0);
 }
});
