const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const shopping = require('./ai-shopping');
test('change-budget chip asks for a new amount and preserves Dong Nai on the next turn',()=>{
 const products=require('./data').PRODUCTS;
 const history=[{role:'user',text:'combo quà biếu đối tác dưới 300k chỉ chọn sản phẩm Đồng Nai'},{role:'assistant',text:'Chưa tìm được combo phù hợp.'},{role:'user',text:'Đổi ngân sách'}];
 const intent=shopping.resolve(history,products);
 const question=shopping.budgetClarification('Đổi ngân sách','vi',intent);
 assert.match(question,/tổng ngân sách combo/);
 assert.match(question,/Đồng Nai/);
 assert.equal(shopping.budgetClarification('đổi ngân sách thành 500k','vi',intent),null);
 assert.match(shopping.budgetClarification('Adjust budget','en',intent),/new total combo budget/);
 history.push({role:'assistant',text:question},{role:'user',text:'500k'});
 const updated=shopping.resolve(history,products);
 assert.equal(updated.maxPrice,500000);
 assert.equal(updated.exactRegion,'Đồng Nai');
 assert.equal(updated.isCombo,true);
});
test('a money-only message asks single product versus combo at every budget',()=>{
 for(const text of ['2tr','500k','15 triệu','1.500.000 đ','2000000','ngân sách 3tr','tôi có 800k']){
  const question=shopping.budgetClarification(text);assert(question);assert.match(question,/1 món.*combo/);
 }
 for(const text of ['combo 2tr','1 món 2tr','trà dưới 500k','combo 7 món 15tr']) assert.equal(shopping.budgetClarification(text),null);
 const products=require('./data').PRODUCTS;
 const history=[{role:'user',text:'combo 3 món 1tr'},{role:'user',text:'2tr'},{role:'user',text:'1 món'}];
 const result=shopping.resolve(history,products);assert.equal(result.maxPrice,2000000);assert.equal(result.isCombo,false);assert.equal(result.isGift,false);
 const context={};vm.runInNewContext(fs.readFileSync('ai-shopping.js','utf8'),context);assert(context.AIShopping.budgetClarification('2tr').includes('1 món'));
});

test('a budget follow-up completes the chosen combo or single-product mode without repeating the question',()=>{
 const products=require('./data').PRODUCTS;
 const combo=shopping.resolve([{role:'user',text:'Hello Cho tôi một combo 300'},{role:'assistant',text:'Ngân sách bao nhiêu?'},{role:'user',text:'300k'}],products);
 assert.equal(combo.purchaseMode,'combo');assert.equal(combo.isCombo,true);assert.equal(combo.maxPrice,300000);
 assert.equal(shopping.budgetClarification('300k','vi',combo),null);
 const plans=shopping.variants(products,combo);assert(plans.length);assert(plans.every(plan=>plan.total<=300000));
 const single=shopping.resolve([{role:'user',text:'Tôi muốn 1 món'},{role:'user',text:'300k'}],products);
 assert.equal(single.purchaseMode,'single');assert.equal(shopping.budgetClarification('300k','vi',single),null);
 const reset=shopping.resolve([{role:'user',text:'combo 300k'},{role:'user',text:'bắt đầu lại'},{role:'user',text:'300k'}],products);
 assert(shopping.budgetClarification('300k','vi',reset));
});
test('a new general five-star recommendation does not silently inherit the previous tea-only request',()=>{
 const intent=shopping.resolve([{role:'user',text:'Gợi ý trà'},{role:'user',text:'Gợi ý đặc sản OCOP 5 sao'}],require('./data').PRODUCTS);
 assert.equal(intent.minStars,5);assert.equal(intent.categoryOrKeyword,null);
});

test('luxury combo requests use premium catalogue labels within the stated budget',()=>{
  const products=[{id:1,name:'Trà cao cấp hộp quà',price:1000000},{id:2,name:'Yến thượng hạng',price:1000000},{id:3,name:'Món thông thường',price:1000000}];
  const intent=shopping.resolve([{role:'user',text:'bạn có thể gợi ý cho mình combo sang trọng tầm 2tr ko'}],products);
  assert.equal(intent.maxPrice,2000000);assert.equal(intent.preferPremium,true);assert.equal(intent.isCombo,true);
  const plan=shopping.closest(products,intent);assert.equal(plan.total,2000000);assert.deepEqual(plan.items.map(p=>p.id).sort(),[1,2]);
  const alternatives=shopping.variants([...products,...Array.from({length:8},(_,i)=>({id:10+i,name:'Món thường '+i,price:250000}))],intent,1,()=>0.5);
  assert.equal(alternatives[0].items.length,2);assert.deepEqual(alternatives[0].items.map(p=>p.id).sort(),[1,2]);
});

test('a high budget with only one feasible seven-item set displays one genuine option',()=>{
  const products=Array.from({length:7},(_,id)=>({id:id+1,name:'Món '+(id+1),price:1000000}));
  const intent={maxPrice:15000000,minItems:7,maxItems:7};
  const plans=shopping.variants(products,intent,3,()=>0.5);
  assert.equal(plans.length,1);assert.equal(plans[0].items.length,7);assert.equal(plans[0].total,7000000);
  const reply=shopping.replyOptions(plans,intent,'vi');
  assert.equal(reply.combos.length,1);assert.match(reply.message,/tìm được 1 combo phù hợp/);assert(!reply.message.includes('Combo 2'));assert.match(reply.message,/8\.000\.000/);
});

test('duplicate contents are removed regardless of order; equal totals do not merge different combos',()=>{
  const a={id:1,price:100000},b={id:2,price:100000},c={id:3,price:100000};
  const first={items:[a,b],total:200000,budget:15000000,remaining:14800000};
  const duplicate={...first,items:[b,a]},different={...first,items:[a,c]};
  const single=shopping.replyOptions([first,duplicate],{maxPrice:15000000},'en');
  assert.equal(single.combos.length,1);assert.match(single.message,/1 matching combination/);
  const distinct=shopping.replyOptions([first,duplicate,different],{maxPrice:15000000},'vi');
  assert.equal(distinct.combos.length,2);assert.match(distinct.message,/2 combo khác nhau/);
  const context={};vm.runInNewContext(fs.readFileSync('ai-shopping.js','utf8'),context);
  assert.equal(context.AIShopping.replyOptions([first,duplicate],{maxPrice:15000000},'vi').combos.length,1);
});

test('strict item limits differ from inclusive bounds and never become a money budget',()=>{
  assert.deepEqual(shopping.itemCount('ý là đưa combo 2tr những dưới 5 món'),{minItems:2,maxItems:4});
  assert.deepEqual(shopping.itemCount('ít hơn năm món'),{minItems:2,maxItems:4});
  assert.deepEqual(shopping.itemCount('không quá 5 món'),{minItems:2,maxItems:5});
  assert.deepEqual(shopping.itemCount('trên 5 món'),{minItems:6,maxItems:null});
  assert.deepEqual(shopping.itemCount('ít nhất 5 món'),{minItems:5,maxItems:null});
  assert.deepEqual(shopping.itemCount('tối đa 2tr gồm 4 món'),{minItems:4,maxItems:4});
  assert.deepEqual(shopping.itemCount('fewer than 5 items'),{minItems:2,maxItems:4});
  assert.deepEqual(shopping.budget('dưới 5 món'),{});
  assert.equal(shopping.budget('combo 2tr dưới 5 món').maxPrice,2000000);
});

test('Tây Nguyên screenshot works on both server and browser and respects follow-ups', () => {
  const products = require('./data.js').PRODUCTS;
  const source = fs.readFileSync('server.js', 'utf8');
  const context = { normalizeCatalogTerm: shopping.normalize, expandChatShorthand: text => text };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function extractSearchIntents('), source.indexOf('const REGION_PROVINCES =')), context);
  vm.runInContext(source.slice(source.indexOf('const REGION_PROVINCES ='), source.indexOf('function buildAIServiceUnavailable')), context);
  for (const extract of [shopping.analyze, context.extractSearchIntents]) {
    const history = [{ role: 'user', text: 'tôi muốn tìm kiếm combo ở tây nguyên tài chính 4tr' }];
    let intent = shopping.resolve(history, products, extract);
    assert.equal(intent.maxPrice, 4000000);
    assert.equal(intent.categoryOrKeyword, null);
    assert.equal(intent.regionKeyword, 'Tây Nguyên');
    assert(shopping.regionMatches({ region: 'Đắk Lắk' }, intent));
    assert(shopping.regionMatches({ region: 'Lâm Đồng' }, intent));
    let plan = shopping.closest(products, intent);
    assert(plan);
    assert.equal(plan.total, 4000000);
    assert(plan.items.every(p => shopping.regionMatches(p, intent)));
    const filtered = context.filterProductsByIntent(products, { ...intent, minStars: null });
    assert(filtered.length > 0);
    assert(shopping.closest(filtered, intent));
    history.push({ role: 'user', text: 'đổi thành 5 món ngân sách 2tr' });
    intent = shopping.resolve(history, products, extract);
    plan = shopping.closest(products, intent);
    assert.equal(intent.regionKeyword, 'Tây Nguyên');
    assert.equal(plan.items.length, 5);
    assert(plan.total <= 2000000);
    assert(plan.items.every(p => shopping.regionMatches(p, intent)));
    history.push({ role: 'user', text: 'chuyển sang miền Tây' });
    intent = shopping.resolve(history, products, extract);
    assert.equal(intent.regionKeyword, 'Miền Tây');
    assert.equal(intent.maxPrice, 2000000);
  }
  assert.equal(context.extractSearchIntents('tôi muốn mua tỏi đen', products).categoryOrKeyword, 'tỏi');
  assert.equal(context.extractSearchIntents('toi muon mua toi den', products).categoryOrKeyword, 'tỏi');
});

test('Vietnamese budgets, grouped amounts and ranges', () => {
  for (const text of ['500k', '500.000đ', '500,000 VND', 'ngân sách 500000', 'tôi có 500000₫']) {
    assert.equal(shopping.budget(text).maxPrice, 500000, text);
  }
  assert.equal(shopping.budget('1,5 triệu').maxPrice, 1500000);
  assert.deepEqual(shopping.budget('từ 300 đến 500k'), { minPrice: 300000, maxPrice: 500000 });
  assert.deepEqual(shopping.budget('trên 1 triệu'), { minPrice: 1000000, maxPrice: null });
});

test('follow-up budget keeps requirements; new product request resets them', () => {
  const products = [{ name: 'Trà', region: 'Hà Giang' }];
  const messages = [{ role: 'user', text: 'Tư vấn combo trà Hà Giang' }, { role: 'assistant', text: 'Bạn có 2 triệu?' }, { role: 'user', text: 'Tôi có 500k' }];
  const intent = shopping.resolve(messages, products);
  assert.equal(intent.exactRegion, 'Hà Giang');
  assert.equal(intent.categoryOrKeyword, 'trà');
  assert.equal(intent.maxPrice, 500000);
  assert.equal(intent.isCombo, true);
  const next = shopping.resolve([...messages, { role: 'user', text: 'Tìm cà phê' }], products);
  assert.equal(next.categoryOrKeyword, 'cà phê');
  assert.equal(next.maxPrice, undefined);
  assert.equal(next.exactRegion, null);
});

test('closest combo agrees with exhaustive search, never exceeds budget', () => {
  for (let seed = 1; seed <= 35; seed++) {
    const products = Array.from({ length: 12 }, (_, id) => ({ id, name: String(id), price: ((id * 37 + seed * 19) % 130 + 10) * 1000 }));
    const intent = { maxPrice: seed * 13000, minPrice: seed * 5000, smallItems: true };
    let expected = 0;
    for (let mask = 1; mask < 2 ** products.length; mask++) {
      const items = products.filter((_, index) => mask & (1 << index));
      if (items.length < 2) continue;
      const total = items.reduce((sum, p) => sum + p.price, 0);
      if (total <= intent.maxPrice && total >= intent.minPrice) expected = Math.max(expected, total);
    }
    const plan = shopping.closest(products, intent);
    assert.equal(plan?.total || 0, expected);
    if (plan) {
      assert.equal(plan.total, plan.items.reduce((sum, p) => sum + p.price, 0));
      assert.equal(new Set(plan.items.map(p => p.id)).size, plan.items.length);
      assert.equal(plan.remaining, intent.maxPrice - plan.total);
    }
  }
  assert.equal(shopping.closest([{ price: 600000 }], { maxPrice: 500000 }), null);
});

test('combos can contain six or more items and prefer variety at equal totals', () => {
  const products = Array.from({ length: 8 }, (_, id) => ({ id, name: `Item ${id}`, price: 100000, rating: 4.5 }));
  const six = shopping.closest(products, { maxPrice: 600000 });
  assert.equal(six.items.length, 6);
  assert.equal(six.total, 600000);
  assert.equal(shopping.closest(products, { maxPrice: 800000 }).items.length, 8);
  const diverse = shopping.closest([...products, { id: 9, price: 400000 }], { maxPrice: 600000, smallItems: true });
  assert.equal(diverse.items.length, 6);
  const rated = shopping.closest([{ id: 1, price: 100000, rating: 3 }, { id: 2, price: 100000, rating: 5 }, { id: 3, price: 200000, rating: 5 }], { maxPrice: 300000 });
  assert.deepEqual(rated.items.map(p => p.id), [2, 3]);
  assert.match(shopping.reply(six, {}, 'vi').message, /6 món/);
});

test('six million budget prefers substantial items instead of dozens of cheap fillers', () => {
  const data = require('./data.js');
  const products = Array.isArray(data) ? data : data.PRODUCTS || data.products;
  const plan = shopping.closest(products, { maxPrice: 6000000 });
  assert.ok(plan);
  assert.ok(plan.total <= 6000000);
  assert.ok(plan.items.length <= 8);
  assert.ok(plan.items.every(product => product.price >= 750000));
  assert.ok(plan.averagePrice >= 750000);
  const cheap = shopping.closest(products, { maxPrice: 6000000, smallItems: true, perItemMax: 100000 });
  assert.ok(cheap.items.every(product => product.price <= 100000));
  assert.ok(cheap.items.length > plan.items.length);
});

test('latest budget and preferences replace old values without interpreting per-item caps as total', () => {
  const products = [{ region: 'Hà Giang' }, { region: 'Bến Tre' }];
  const history = [{ role: 'user', text: 'Combo trà Hà Giang 6 triệu' }];
  let intent = shopping.resolve([...history, { role: 'user', text: 'Đổi ngân sách xuống 2 triệu' }], products);
  assert.equal(intent.maxPrice, 2000000);
  assert.equal(intent.categoryOrKeyword, 'trà');
  assert.equal(intent.exactRegion, 'Hà Giang');
  intent = shopping.resolve([...history, { role: 'user', text: 'Mỗi món dưới 100k' }], products);
  assert.equal(intent.maxPrice, 6000000);
  assert.equal(intent.perItemMax, 100000);
  assert.equal(intent.smallItems, true);
  intent = shopping.resolve([...history, { role: 'user', text: 'Mỗi món dưới 100k' }, { role: 'user', text: 'Đổi sang cao cấp, không chọn món rẻ' }], products);
  assert.equal(intent.smallItems, false);
  assert.equal(intent.perItemMax, null);
  intent = shopping.resolve([...history, { role: 'user', text: 'Đổi sang bánh Bến Tre 1 triệu' }], products);
  assert.equal(intent.maxPrice, 1000000);
  assert.equal(intent.categoryOrKeyword, 'bánh');
  assert.equal(intent.exactRegion, 'Bến Tre');
  assert.equal(intent.rawText, 'Đổi sang bánh Bến Tre 1 triệu');
});

test('a single item must not displace a valid multi-item combo at the same total', () => {
  const plan = shopping.closest([{ id: 1, price: 100000 }, { id: 2, price: 200000 }, { id: 3, price: 300000 }], { maxPrice: 300000 });
  assert.deepEqual(plan.items.map(product => product.id), [1, 2]);
});

test('high-value screenshot ranks by catalogue price instead of matching cao or Quang Tri', () => {
  const {PRODUCTS}=require('./data');
  const source=fs.readFileSync('server.js','utf8');
  const context={AIShopping:shopping,expandChatShorthand:text=>text,getRestrictedTopicReply:()=>null,aiWebsiteCatalog:null};
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function normalizeCatalogTerm'),source.indexOf('function isAIRateLimited')),context);
  const query='mình muốn tìm kiếm một số món có giá trị cao';
  assert.equal(context.findDirectCatalogMatches(query,PRODUCTS).length,0);
  const intent=shopping.resolve([{role:'user',text:query}],PRODUCTS,context.extractSearchIntents);
  assert.equal(intent.pricePreference,'high');assert.equal(intent.exactRegion,null);assert.equal(intent.categoryOrKeyword,null);
  const reply=require('./ai-data-reply').composeDataReply(context.filterProductsByIntent(PRODUCTS,intent),intent,'vi');
  const selected=reply.productIds.map(id=>PRODUCTS.find(p=>p.id===id));
  assert.equal(selected.length,3);assert.equal(selected[0].price,Math.max(...PRODUCTS.map(p=>p.price)));
  assert(selected.every((p,i)=>i===0||p.price<=selected[i-1].price));
  assert.match(reply.message,/giá niêm yết cao/);assert.doesNotMatch(reply.message,/chất lượng cao nhất/);
  const regional=shopping.resolve([{role:'user',text:'trà Hà Giang giá trị cao dưới 1 triệu'}],PRODUCTS,context.extractSearchIntents);
  const scoped=shopping.recommendations(PRODUCTS,regional);
  assert(scoped.length>0);assert(scoped.every(p=>p.region==='Hà Giang'&&p.price<=1000000&&/trà/i.test(p.name)));
  const followup=shopping.resolve([{role:'user',text:'trà Hà Giang giá trị cao dưới 1 triệu'},{role:'user',text:'đổi sang giá thấp hơn'}],PRODUCTS,context.extractSearchIntents);
  assert.equal(followup.pricePreference,'low');assert.equal(followup.exactRegion,'Hà Giang');assert.equal(followup.maxPrice,1000000);
  const cheap=shopping.recommendations(PRODUCTS,followup);
  assert(cheap.every((p,i)=>i===0||p.price>=cheap[i-1].price));
  const teaIntent=shopping.resolve([{role:'user',text:'tìm trà giá cao'}],PRODUCTS,context.extractSearchIntents);
  const teaCandidates=context.filterProductsByIntent(PRODUCTS,teaIntent);
  assert(teaCandidates.length>3);
  assert.equal(shopping.recommendations(teaCandidates,teaIntent)[0].price,Math.max(...PRODUCTS.filter(p=>/trà/i.test(p.name)).map(p=>p.price)));
  assert.equal(shopping.analyze('không chọn món rẻ',PRODUCTS).pricePreference,'high');
  assert.equal(shopping.analyze('không cần cao cấp',PRODUCTS).pricePreference,'low');
  assert.equal(shopping.analyze('giá trị dinh dưỡng cao',PRODUCTS).pricePreference,undefined);
  assert.equal(shopping.recommendations(PRODUCTS,{...regional,maxPrice:1}).length,0);
  const ginseng=shopping.resolve([{role:'user',text:'Tôi muốn tìm sâm giá cao'}],PRODUCTS);
  assert.equal(ginseng.categoryOrKeyword,'sâm');
  assert(shopping.recommendations(PRODUCTS,ginseng).every(p=>/sâm/i.test(p.name)));
  assert.equal(shopping.resolve([{role:'user',text:'Tôi muốn tìm món giá cao'}],PRODUCTS).categoryOrKeyword,null);
});

test('server filters do not silently discard an impossible constraint', () => {
  const source = fs.readFileSync('server.js', 'utf8');
  const context = { normalizeCatalogTerm: shopping.normalize, findDirectCatalogMatches: () => [] };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('const REGION_PROVINCES ='), source.indexOf('function buildAIServiceUnavailable')), context);
  const products = [{ id: 1, name: 'Trà', region: 'Hà Giang', price: 680000, stars: 5 }];
  const intent = { exactRegion: 'Hà Giang', maxPrice: 500000, minStars: null, isCombo: true };
  assert.equal(context.filterProductsByIntent(products, intent).length, 0);
});

test('screenshot request returns exactly four items for five million', () => {
  const data = require('./data.js');
  const products = Array.isArray(data) ? data : data.PRODUCTS || data.products;
  const intent = shopping.resolve([{ role: 'user', text: 'gợi ý combo 4 món giá 5tr' }], products);
  assert.equal(intent.minItems, 4);
  assert.equal(intent.maxItems, 4);
  assert.equal(intent.maxPrice, 5000000);
  const plan = shopping.closest(products, intent);
  assert.equal(plan.items.length, 4);
  assert.equal(plan.total, 5000000);
  assert.match(shopping.reply(plan, intent, 'vi').message, /combo 4 món/);
  const next = shopping.resolve([{ role: 'user', text: 'gợi ý combo 4 món giá 5tr' }, { role: 'assistant', text: 'Combo 4 món' }, { role: 'user', text: 'đổi thành 6 món giá 3tr' }], products);
  assert.equal(next.minItems, 6);
  assert.equal(next.maxPrice, 3000000);
  const changed = shopping.closest(products, next);
  assert.equal(changed.items.length, 6);
  assert.ok(changed.total <= 3000000);
});

test('item count ranges, limits, release and impossible requests', () => {
  assert.deepEqual(shopping.itemCount('combo 5-6 món 2 triệu'), { minItems: 5, maxItems: 6 });
  assert.deepEqual(shopping.itemCount('tối đa 4 món'), { minItems: 2, maxItems: 4 });
  assert.deepEqual(shopping.itemCount('ít nhất 5 món'), { minItems: 5, maxItems: null });
  assert.deepEqual(shopping.itemCount('combo 5tr'), {});
  assert.deepEqual(shopping.itemCount('bao nhiêu món cũng được'), { minItems: null, maxItems: null });
  const products = [{ id: 1, price: 100000 }, { id: 2, price: 200000 }];
  const intent = { maxPrice: 500000, minItems: 4, maxItems: 4 };
  assert.equal(shopping.closest(products, intent), null);
  const reply = shopping.reply(null, intent, 'vi');
  assert.match(reply.message, /combo 4 món/);
  assert.deepEqual(reply.productIds, []);
});

test('requested count takes priority over the default price floor', () => {
  const products = [50000, 70000, 100000, 780000].map((price, id) => ({ price, id }));
  const plan = shopping.closest(products, { maxPrice: 1000000, minItems: 4, maxItems: 4 });
  assert.equal(plan.items.length, 4);
  assert.equal(plan.total, 1000000);
  assert.equal(plan.smallItems, false);
});

test('written counts and product exclusions are respected across follow-ups', () => {
  assert.deepEqual(shopping.itemCount('combo bốn món 5tr'), { minItems: 4, maxItems: 4 });
  const products = [{ id: 1, name: 'Rượu', price: 500000 }, { id: 2, name: 'Trà', price: 400000 }, { id: 3, name: 'Bánh', price: 300000 }];
  const intent = shopping.resolve([{ role: 'user', text: 'combo 2 món 1tr' }, { role: 'user', text: 'không lấy rượu' }], products);
  const plan = shopping.closest(products, intent);
  assert.deepEqual(plan.items.map(product => product.id), [3, 2]);
  assert.equal(plan.items.length, 2);
  assert.equal(plan.budget, 1000000);
});

test('server reads corrections as instructions rather than product names', () => {
  const source = fs.readFileSync('server.js', 'utf8');
  const context = { normalizeCatalogTerm: shopping.normalize, expandChatShorthand: text => text };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function extractSearchIntents('), source.indexOf('const REGION_PROVINCES =')), context);
  assert.equal(context.extractSearchIntents('đổi thành 6 món giá 3tr', []).categoryOrKeyword, null);
  assert.equal(context.extractSearchIntents('quà tặng bố mẹ', []).categoryOrKeyword, null);
  const history = [{ role: 'user', text: 'combo 4 món giá 5tr' }, { role: 'user', text: 'đổi thành 6 món giá 3tr' }, { role: 'user', text: 'không lấy rượu' }];
  const intent = shopping.resolve(history, [], context.extractSearchIntents);
  assert.equal(intent.maxPrice, 3000000);
  assert.equal(intent.minItems, 6);
  assert.equal(intent.categoryOrKeyword, null);
  assert.deepEqual(intent.excludedTerms, ['ruou']);
});

test('multi-province and nationwide 63-province intent extraction and combo bundling', () => {
  const data = require('./data.js');
  const products = Array.isArray(data) ? data : data.PRODUCTS || data.products;

  // 1. Multi-province extraction
  const multiIntent = shopping.resolve([{ role: 'user', text: 'Cho combo đồng nai với cà mau' }], products);
  assert.equal(multiIntent.isCombo, true);
  assert.deepEqual(multiIntent.exactRegions, ['Đồng Nai', 'Cà Mau']);
  assert.equal(multiIntent.isAllProvinces, false);

  // 2. Nationwide / all provinces extraction
  const allIntent = shopping.resolve([{ role: 'user', text: 'combo gom tất cả tỉnh thành 63 tỉnh' }], products);
  assert.equal(allIntent.isCombo, true);
  assert.equal(allIntent.isAllProvinces, true);

  // 3. Multi-province combo selection with budget covers both provinces
  const multiBudget = shopping.resolve([{ role: 'user', text: 'Cho combo đồng nai với cà mau 2 triệu' }], products);
  const eligible = products.filter(p => multiBudget.exactRegions.includes(p.region));
  const plan = shopping.closest(eligible, multiBudget);
  assert.ok(plan);
  assert.ok(plan.total <= 2000000);
  const pickedRegions = new Set(plan.items.map(p => p.region));
  assert.ok(pickedRegions.has('Đồng Nai'), 'Plan must contain product from Đồng Nai');
  assert.ok(pickedRegions.has('Cà Mau'), 'Plan must contain product from Cà Mau');
  assert.match(shopping.reply(plan, multiBudget, 'vi').message, /Đồng Nai & Cà Mau/);
});

test('vegetarian combo automatically excludes meat and seafood items', () => {
  const data = require('./data.js');
  const products = Array.isArray(data) ? data : data.PRODUCTS || data.products;
  const vegIntent = shopping.resolve([{ role: 'user', text: 'combo ăn chay 1 triệu' }], products);
  assert.ok(vegIntent.excludedTerms.includes('thit'));
  assert.ok(vegIntent.excludedTerms.includes('cua'));
  assert.ok(vegIntent.excludedTerms.includes('nuoc mam'));
  const eligible = products.filter(p => shopping.allowed(p, vegIntent));
  const plan = shopping.closest(eligible, vegIntent);
  assert.ok(plan);
  assert.ok(plan.items.every(p => shopping.allowed(p, vegIntent)));
  assert.ok(!plan.items.some(p => /cua|thịt|trâu|tôm|chả mực|mắm/i.test(p.name)));
});

test('sommelier comparative analysis and occasion gift intent extraction from server', () => {
  const source = fs.readFileSync('server.js', 'utf8');
  const context = { normalizeCatalogTerm: shopping.normalize, expandChatShorthand: text => text };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function extractSearchIntents('), source.indexOf('const REGION_PROVINCES =')), context);

  // 1. Comparison intent
  const teaComp = context.extractSearchIntents('Trà Shan Tuyết khác gì trà Tân Cương?', []);
  assert.equal(teaComp.isComparison, true);
  assert.equal(teaComp.categoryOrKeyword, 'trà');

  const samComp = context.extractSearchIntents('So sánh sâm Ngọc Linh với nhân sâm Hàn Quốc', []);
  assert.equal(samComp.isComparison, true);
  assert.equal(samComp.categoryOrKeyword, 'sâm');

  const mamComp = context.extractSearchIntents('Nước mắm truyền thống khác gì nước mắm công nghiệp?', []);
  assert.equal(mamComp.isComparison, true);
  assert.equal(mamComp.categoryOrKeyword, 'nước mắm');

  // 2. Occasion gift intent
  const inLaws = context.extractSearchIntents('Tư vấn quà ra mắt nhà bạn gái', []);
  assert.equal(inLaws.isOccasionGift, true);
  assert.equal(inLaws.isGift, true);

  const expat = context.extractSearchIntents('Quà biếu kiều bào mang đi nước ngoài', []);
  assert.equal(expat.isOccasionGift, true);
  assert.equal(expat.isGift, true);

  const housewarming = context.extractSearchIntents('Quà mừng tân gia nhà mới', []);
  assert.equal(housewarming.isOccasionGift, true);
  assert.equal(housewarming.isGift, true);

  // 3. Vegetarian intent
  const veg = context.extractSearchIntents('Có đồ ăn thuần chay không?', []);
  assert.equal(veg.isVegetarian, true);
});

test('maximum budgets and Vietnamese pronouns do not request garlic', () => {
  const source=fs.readFileSync('server.js','utf8');
  const context={normalizeCatalogTerm:shopping.normalize,expandChatShorthand:text=>text};
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function extractSearchIntents('),source.indexOf('const REGION_PROVINCES =')),context);
  for(const analyze of [shopping.analyze,context.extractSearchIntents]) {
  for (const text of ['Gợi ý 3 combo đặc sản ngân sách tối đa 6 triệu đồng', 'Cho tôi combo 6 triệu', 'Combo tối thiểu 2 triệu']) {
    assert.equal(analyze(text, []).categoryOrKeyword, null);
  }
  assert.equal(analyze('Combo tỏi Lý Sơn tối đa 6 triệu', []).categoryOrKeyword, 'tỏi');
  }
});
