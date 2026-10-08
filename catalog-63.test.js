const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {PRODUCTS}=require('./data'),{parse}=require('./data/imports/parse-63-provinces.cjs'),shopping=require('./ai-shopping');
test('all supplied rows replace the old catalogue including overlapping prices and star ranges',()=>{
 const rows=parse(fs.readFileSync('data/imports/catalog-63-provinces-source.txt','utf8'));
 assert.equal(PRODUCTS.length,252);assert.equal(new Set(PRODUCTS.map(p=>p.id)).size,252);
 const counts=new Map();
 for(const row of rows){const p=PRODUCTS.find(p=>p.sourceRow===row.row);assert(p);assert.equal(p.name,row.name);assert.equal(p.region,row.region);assert.equal(p.price,row.priceMax);assert.equal(p.priceMin,row.priceMax);assert.equal(p.priceMax,row.priceMax);assert.equal(p.starsMin,row.starsMin);assert.equal(p.starsMax,row.starsMax);assert(p.packaging&&p.packagingEn&&p.nameEn);assert.equal(p.origPrice,p.price);assert.equal(p.reviews,0);assert(fs.existsSync(p.img));counts.set(p.region,(counts.get(p.region)||0)+1)}
 assert.equal(counts.size,63);assert([...counts.values()].every(n=>n===4));
 for(const region of counts.keys()){const group=PRODUCTS.filter(p=>p.region===region);assert.equal(group.filter(p=>p.stars===5).length,2);assert.equal(group.filter(p=>p.stars===4).length,2)}
 const previous=require('./data/imports/catalog-before-latest.json');assert(PRODUCTS.every(p=>!previous.some(old=>old.id===p.id)));
 assert(PRODUCTS.filter(p=>p.name.startsWith('Thịt trâu')).every(p=>p.category==='food'));
 assert.deepEqual(['bac','trung','nam'].map(m=>PRODUCTS.filter(p=>p.macroRegion===m).length),[100,76,76]);
});
test('each province and all three macro regions produce only matching products',()=>{
 for(const region of new Set(PRODUCTS.map(p=>p.region))) assert.equal(PRODUCTS.filter(p=>shopping.regionMatches(p,{exactRegion:region})).length,4);
 for(const [region,n] of [['Miền Bắc',100],['Miền Nam',76],['Tây Nguyên',20]]) assert.equal(PRODUCTS.filter(p=>shopping.regionMatches(p,{regionKeyword:region})).length,n);
});
test('new combo prices, item units and latest requirements stay consistent',()=>{
 const history=[{role:'user',text:'combo 5 đến 6 món tài chính 4tr ở tây nguyên'}];
 let intent=shopping.resolve(history,PRODUCTS);let plan=shopping.closest(PRODUCTS,intent);assert(plan);assert(plan.items.length>=5&&plan.items.length<=6);assert(plan.total<=4000000);assert.equal(plan.total,plan.items.reduce((s,p)=>s+p.priceMax,0));assert(shopping.reply(plan,intent,'vi').message.includes('Tổng tham khảo'));
 history.push({role:'user',text:'đổi thành 4 món ngân sách 2tr'});intent=shopping.resolve(history,PRODUCTS);plan=shopping.closest(PRODUCTS,intent);assert(plan);assert.equal(plan.items.length,4);assert(plan.total<=2000000);assert(plan.items.every(p=>shopping.regionMatches(p,intent)));
});
test('embedded scripts parse and no old embedded catalogue remains',()=>{
 const html=fs.readFileSync('index.html','utf8');assert(!html.includes('const CORE_OCOP_PRODUCTS = ['));
 for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
});
