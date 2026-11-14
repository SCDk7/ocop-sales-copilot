'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createKpiServer } = require('./server.cjs');

async function serve(t, options) {
  const server = createKpiServer(options);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  return 'http://127.0.0.1:' + server.address().port;
}

test('standalone HTML serves the dashboard without separate frontend assets or private files', async t => {
  const html = fs.readFileSync(path.join(__dirname, 'kpi.html'), 'utf8');
  const base = await serve(t, { html });
  const response = await fetch(base);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Bảng điều khiển hiệu suất/);
  assert.match(html, /<style>/);
  assert.doesNotMatch(html, /<style>\uFEFF/);
  assert.match(html, /function renderMetrics/);
  assert.doesNotMatch(html, /<script src=|<link rel="stylesheet"/);
  assert.equal((await fetch(base + '/kpi.html')).status, 200);
  for (const file of ['/server.cjs', '/.env', '/package.json', '/public/dashboard.js']) {
    assert.equal((await fetch(base + file)).status, 404);
  }
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
});

test('proxy preserves backend metrics and only forwards supported period filters', async t => {
  const metrics = { requests: 8, startedAt: '2026-10-10T00:00:00Z', paidRevenue: 120000 };
  const targets = [];
  const base = await serve(t, {
    html: '<html></html>', backend: 'https://backend.example/api/ai/metrics',
    fetchMetrics: async url => { targets.push(String(url)); return { ok: true, json: async () => metrics }; }
  });
  for (const [period, expected] of [['week', 'week'], ['month', 'month'], ['all', 'all'], ['anything', 'day']]) {
    const response = await fetch(base + '/api/metrics?period=' + period);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), metrics);
    assert.equal(new URL(targets.at(-1)).searchParams.get('period'), expected);
  }
});

test('unavailable or invalid backend data returns an error while the website remains available', async t => {
  for (const fetchMetrics of [async () => { throw Error('offline'); }, async () => ({ ok: true, json: async () => ({}) })]) {
    const base = await serve(t, { html: '<html></html>', fetchMetrics });
    const response = await fetch(base + '/api/metrics');
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'METRICS_BACKEND_UNAVAILABLE' });
    assert.equal((await fetch(base)).status, 200);
    assert.deepEqual(await (await fetch(base + '/health')).json(), { status: 'ok', service: 'ocop-kpi', commit: process.env.RENDER_GIT_COMMIT || null });
  }
});

test('cloud data pipeline sync endpoints enforce secure token and ingest real-time financial data', async t => {
  const token = 'TEST_SYNC_TOKEN_SECURE_123';
  const base = await serve(t, { html: '<html></html>', token });

  // 1. Rejects missing or invalid token with 401
  const unauthResp = await fetch(base + '/api/sync/financial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grossRevenue: 68000 })
  });
  assert.equal(unauthResp.status, 401);

  const invalidTokenResp = await fetch(base + '/api/sync/financial', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-ocop-sync-token': 'WRONG_TOKEN' },
    body: JSON.stringify({ grossRevenue: 68000 })
  });
  assert.equal(invalidTokenResp.status, 401);

  // 2. Accepts valid token and ingests financial record
  const syncResp = await fetch(base + '/api/sync/financial', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ocop-sync-token': token
    },
    body: JSON.stringify({
      type: 'qr_scan',
      grossRevenue: 100000,
      cogs: 62000,
      opex: 7500,
      netProfit: 23500,
      province: 'Đồng Nai'
    })
  });
  assert.equal(syncResp.status, 200);
  const syncJson = await syncResp.json();
  assert.equal(syncJson.success, true);

  // 3. Sync regional OCOP verification
  const verifyResp = await fetch(base + '/api/sync/verify-ocop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ocop-sync-token': token
    },
    body: JSON.stringify({
      products: [{ id: 524, name: 'Bưởi Tân Triều', region: 'Đồng Nai', stars: 4, decree: 'QĐ 2145/QĐ-UBND' }]
    })
  });
  assert.equal(verifyResp.status, 200);

  // 4. Query consolidated sync data
  const dataResp = await fetch(base + '/api/sync/data');
  assert.equal(dataResp.status, 200);
  const dataJson = await dataResp.json();
  assert.equal(dataJson.ok, true);
  assert(dataJson.financial.grossRevenue >= 842500000);
  assert(dataJson.financial.cogs > 0);
  assert(dataJson.financial.netProfit > 0);
  assert(Array.isArray(dataJson.verifications));
  assert(Array.isArray(dataJson.auditLogs));
});
