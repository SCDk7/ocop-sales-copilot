'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

async function verify(base, { kpi = false, commit } = {}) {
  const url = new URL(base);
  const request = async route => {
    const response = await fetch(new URL(route, url), { signal: AbortSignal.timeout(45000), cache: 'no-store' });
    assert.equal(response.status, 200, `${route}: HTTP ${response.status}`);
    return response;
  };
  const health = await (await request('/health')).json();
  assert.equal(health.service, kpi ? 'ocop-kpi' : 'ocop-sales-copilot');
  if (commit) assert.equal(health.commit, commit, 'Hosting is still serving another commit');
  const normalize = text => text.replace(/\r\n/g, '\n').trim();
  const hash = text => crypto.createHash('sha256').update(normalize(text)).digest('hex');
  const root = path.resolve(__dirname, '..');
  const routes = kpi ? [['/', 'kpi-site/kpi.html']] : [
    ['/', 'index.html'], ['/ai-shopping.js', 'ai-shopping.js'], ['/chat-dictation.js', 'chat-dictation.js'],
    ['/account-client.js', 'account-client.js'], ['/assets/tailwind.css', 'assets/tailwind.css']
  ];
  for (const [route, file] of routes) {
    const content = await (await request(route)).text();
    assert.equal(hash(content), hash(fs.readFileSync(path.join(root, file), 'utf8')), `${route}: stale or different content`);
  }
  const metrics = await (await request(kpi ? '/api/metrics?period=day' : '/api/ai/metrics?period=day')).json();
  assert.equal(typeof metrics.requests, 'number');
  assert.equal(metrics.period, 'day');
  return { base: url.origin, service: health.service, commit: health.commit, assetsVerified: routes.length, metrics: true };
}

if (require.main === module) {
  const base = process.argv[2] || 'https://ocop-sales-copilot.onrender.com';
  const kpi = process.argv.includes('--kpi');
  const commit = process.env.EXPECTED_DEPLOY_COMMIT || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' }).trim();
  verify(base, { kpi, commit }).then(result => console.log(JSON.stringify(result))).catch(error => {
    console.error('Deployment verification failed:', error.message);
    process.exitCode = 1;
  });
}
module.exports = { verify };
