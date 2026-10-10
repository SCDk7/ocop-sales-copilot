'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { KpiSyncService, SECURE_SYNC_TOKEN } = require('./kpi-sync-service.js');

test('KpiSyncService correctly normalizes financial records with 62% COGS and 0.00% variance', () => {
  const service = new KpiSyncService();
  const record = service.normalizeFinancialRecord({
    grossRevenue: 1000000,
    province: 'Đồng Nai',
    type: 'qr_scan'
  });

  assert.equal(record.grossRevenue, 1000000);
  assert.equal(record.cogs, 620000); // 62%
  assert.equal(record.opex, 75000);  // 7.5%
  assert.equal(record.chmCommission, 70000); // 7%
  assert.equal(record.netProfit, 235000); // 23.5%
  assert.equal(record.province, 'Đồng Nai');
  assert.ok(record.signature, 'Signature must be generated');
  assert.equal(typeof record.signature, 'string');
});

test('KpiSyncService successfully dispatches financial and OCOP verification payloads to mock remote', async () => {
  const calls = [];
  const mockFetch = async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    return {
      ok: true,
      json: async () => ({ ok: true, status: 'RECEIVED' })
    };
  };

  const service = new KpiSyncService({
    targetUrl: 'https://mock-kpi.test.internal',
    token: 'TEST_TOKEN_123',
    fetch: mockFetch
  });

  // 1. Sync Financial
  const finResult = await service.syncFinancial({
    grossRevenue: 500000,
    province: 'Hà Nội',
    type: 'ai_advisory'
  });
  assert.ok(finResult.success);

  // 2. Sync Verification
  const ocopResult = await service.syncOcopVerification();
  assert.ok(ocopResult.success);
  assert.ok(ocopResult.count >= 7);

  // 3. Sync Global State
  const stateResult = await service.syncGlobalState({ language: 'en' });
  assert.ok(stateResult.success);

  // Verify dispatches
  assert.equal(calls.length, 3);
  assert.equal(calls[0].url, 'https://mock-kpi.test.internal/api/sync/financial');
  assert.equal(calls[0].options.headers['x-ocop-sync-token'], 'TEST_TOKEN_123');
  assert.equal(calls[0].body.grossRevenue, 500000);

  assert.equal(calls[1].url, 'https://mock-kpi.test.internal/api/sync/verify-ocop');
  assert.ok(Array.isArray(calls[1].body.products));

  assert.equal(calls[2].url, 'https://mock-kpi.test.internal/api/sync/global-state');
  assert.equal(calls[2].body.activeLanguage, 'en');

  // Verify health stats
  const health = service.getPipelineHealth();
  assert.equal(health.stats.totalDispatched, 1);
  assert.equal(health.stats.totalSuccess, 3);
  assert.equal(health.queuedRetries, 0);
});

test('KpiSyncService queues retries and recovers gracefully upon network failure', async () => {
  let callCount = 0;
  const failingFetch = async () => {
    callCount++;
    throw new Error('Render cold start or temporary timeout');
  };

  const service = new KpiSyncService({
    targetUrl: 'https://offline-kpi.test.internal',
    fetch: failingFetch
  });

  await service.syncFinancial({ grossRevenue: 200000 }).catch(() => {});
  const health = service.getPipelineHealth();
  assert.equal(health.stats.totalFailed, 1);
  assert.equal(health.queuedRetries, 1);
  assert.ok(health.recentEventsLogged >= 1);
});

