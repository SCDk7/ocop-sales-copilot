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
    const intent = { maxPrice: seed * 13000, minPrice: seed * 5000 };
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
  const diverse = shopping.closest([...products, { id: 9, price: 400000 }], { maxPrice: 600000 });
  assert.equal(diverse.items.length, 6);
  const rated = shopping.closest([{ id: 1, price: 100000, rating: 3 }, { id: 2, price: 100000, rating: 5 }, { id: 3, price: 200000, rating: 5 }], { maxPrice: 300000 });
  assert.deepEqual(rated.items.map(p => p.id), [2, 3]);
  assert.match(shopping.reply(six, {}, 'vi').message, /6 món/);
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
