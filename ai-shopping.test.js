const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const shopping = require('./ai-shopping');

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

test('server filters do not silently discard an impossible constraint', () => {
  const source = fs.readFileSync('server.js', 'utf8');
  const context = { normalizeCatalogTerm: shopping.normalize, findDirectCatalogMatches: () => [] };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('const REGION_PROVINCES ='), source.indexOf('function generateLocalComboReply')), context);
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
