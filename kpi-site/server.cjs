'use strict';
const http = require('node:http');
const { buildDashboard } = require('./build.cjs');

function createKpiServer({
  backend = process.env.OCOP_METRICS_URL || 'http://localhost:3000/api/ai/metrics',
  fetchMetrics = fetch,
  html = buildDashboard()
} = {}) {
  const source = new URL(backend);
  if (!['http:', 'https:'].includes(source.protocol)) throw new Error('OCOP_METRICS_URL must use HTTP or HTTPS');
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const json = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : JSON.stringify(body));
    };
    const url = new URL(req.url, 'http://localhost');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return json(405, { error: 'METHOD_NOT_ALLOWED' });
    }
    if (['/', '/kpi.html', '/index.html'].includes(url.pathname)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : html);
    }
    if (url.pathname === '/health') return json(200, { status: 'ok', service: 'ocop-kpi', commit: process.env.RENDER_GIT_COMMIT || null });
    if (url.pathname !== '/api/metrics') return json(404, { error: 'NOT_FOUND' });
    try {
      const target = new URL(source);
      const period = url.searchParams.get('period');
      target.searchParams.set('period', ['day', 'week', 'month', 'all'].includes(period) ? period : 'day');
      const response = await fetchMetrics(target, {
        signal: AbortSignal.timeout(5000), headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Metrics backend unavailable');
      const data = await response.json();
      if (!data || typeof data.requests !== 'number' || typeof data.startedAt !== 'string') throw new Error('Invalid metrics data');
      return json(200, data);
    } catch {
      return json(503, { error: 'METRICS_BACKEND_UNAVAILABLE' });
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.KPI_PORT || process.env.PORT || 3002);
  createKpiServer().listen(port, () => console.log(`OCOP KPI website: http://localhost:${port}`));
}
module.exports = { createKpiServer };
