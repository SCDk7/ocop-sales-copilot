const test = require('node:test');
const assert = require('node:assert/strict');
const AIBusinessKnowledge = require('./ai-business-knowledge.js');

test('verified O2O store mapping covers 252 products and 6 key flagship showrooms', () => {
  const stores = require('./ocop-stores.js');
  const { PRODUCTS } = require('./data.js');

  // All 252 products have mapped store info
  assert.equal(Object.keys(stores.STORE_MAP).length, 252);

  // 6 key products have locked real-world physical showroom addresses and Google Map URLs
  const keyIds = [336, 342, 360, 524, 525, 526];
  for (const id of keyIds) {
    const store = stores.getOcopStoreInfo(id);
    assert.ok(store, `Store for ID ${id} must exist`);
    assert.ok(store.primaryStore && store.primaryStore.address, `Address for ID ${id} must exist`);
    assert.ok(store.mapUrl && store.mapUrl.includes('google.com/maps'), `Google Map URL for ID ${id} must be valid`);
  }

  // Specific checks for flagship items
  const store525 = stores.getOcopStoreInfo(525);
  assert.ok(store525.primaryStore.address.includes('Nguyễn Trường Tộ') && store525.primaryStore.address.includes('Long Khánh'));

  const store336 = stores.getOcopStoreInfo(336);
  assert.ok(store336.primaryStore.address.includes('Bát Tràng') && store336.primaryStore.address.includes('Gia Lâm'));

  const store360 = stores.getOcopStoreInfo(360);
  assert.ok(store360.primaryStore.address.includes('Hua La') && store360.primaryStore.address.includes('Sơn La'));

  const store342 = stores.getOcopStoreInfo(342);
  assert.ok(store342.primaryStore.address.includes('Mèo Vạc') && store342.primaryStore.address.includes('Hà Giang'));
});

test('business knowledge profile and ecosystem validation', () => {
  assert.equal(AIBusinessKnowledge.PROJECT_PROFILE.competition, 'AI Digital Business Challenge 2026');
  assert.equal(AIBusinessKnowledge.PROJECT_PROFILE.modelType, 'B2B2C & O2O (Online-to-Offline) Tri-party Digital Ecosystem');

  const ecosystem = AIBusinessKnowledge.BUSINESS_MODEL.triPartyEcosystem;
  assert.ok(ecosystem.party1_Producers, 'Producers/Cooperatives must be defined');
  assert.ok(ecosystem.party2_Consumers, 'Consumers/Tourists must be defined');
  assert.ok(ecosystem.party3_Platform, 'Digital Platform must be defined');
});

test('financial engine metrics and calculations', () => {
  const snapshot = AIBusinessKnowledge.SAMPLE_FINANCIAL_SNAPSHOT;
  const overview = snapshot.overview;

  assert.equal(overview.totalRevenue, 842500000);
  assert.equal(overview.netProfit, 269600000);
  assert.equal(overview.errorRate, '0.00%');
  assert.equal(overview.aiOptimizedGrowth, '+18.4%');

  // Verify top products have exact net profit = retailPrice - cogs - platformCommission - ctvCommission
  for (const item of snapshot.topProductsFinancials) {
    const calculatedNetProfit = item.retailPrice - item.cogs - item.platformCommission - item.ctvCommission;
    assert.equal(item.netProfit, calculatedNetProfit, `Net profit mismatch for ${item.name}`);
    assert.equal(item.totalRevenue, item.retailPrice * item.soldUnits, `Total revenue mismatch for ${item.name}`);
    assert.equal(item.totalNetProfit, item.netProfit * item.soldUnits, `Total net profit mismatch for ${item.name}`);
  }
});

test('KPIs and strategic differentiators validation', () => {
  assert.equal(AIBusinessKnowledge.KPIS_AND_METRICS.length, 5);
  const kpiCodes = AIBusinessKnowledge.KPIS_AND_METRICS.map(k => k.code);
  assert.ok(kpiCodes.includes('GMV'));
  assert.ok(kpiCodes.includes('PROFIT_GROWTH'));
  assert.ok(kpiCodes.includes('FINANCIAL_ACCURACY'));
  assert.ok(kpiCodes.includes('AI_RAG_ACCURACY'));
  assert.ok(kpiCodes.includes('RESPONSE_TIME'));

  assert.equal(AIBusinessKnowledge.DIFFERENTIATORS.length, 4);
  const diffIds = AIBusinessKnowledge.DIFFERENTIATORS.map(d => d.id);
  assert.ok(diffIds.includes('ai_financial_dashboard'));
  assert.ok(diffIds.includes('ai_cultural_storytelling'));
  assert.ok(diffIds.includes('voice_first_multiregion'));
  assert.ok(diffIds.includes('lightweight_mvp'));
});
