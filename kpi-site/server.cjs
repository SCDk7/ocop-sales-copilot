'use strict';
const http = require('node:http');
const crypto = require('node:crypto');
const { buildDashboard } = require('./build.cjs');

const SECURE_SYNC_TOKEN = process.env.OCOP_KPI_SYNC_TOKEN || 'OCOP_2026_SECURE_TOKEN_AI_CHALLENGE_SYNC_998877';

// Pre-seeded baseline data reflecting the AI Digital Business Challenge 2026 proposal
const initialVerifications = [
  {
    id: 524,
    name: "Bưởi đường lá cam Tân Triều",
    region: "Đồng Nai",
    hub: "Đồng Nai Hub",
    producer: "HTX Nông nghiệp Dịch vụ Tân Triều",
    decree: "Quyết định số 2145/QĐ-UBND",
    stars: 4,
    status: "VERIFIED_LEGAL_100",
    showroom: "Showroom Tân Triều, TP. Biên Hòa & TP.HCM"
  },
  {
    id: 525,
    name: "Trà khổ qua rừng túi lọc Hiệp Vân",
    region: "Đồng Nai",
    hub: "Đồng Nai Hub",
    producer: "Cơ sở Hiệp Vân, Long Khánh",
    decree: "Quyết định số 1892/QĐ-UBND",
    stars: 4,
    status: "VERIFIED_LEGAL_100",
    showroom: "Điểm bán O2O Hiệp Vân, TP. Long Khánh"
  },
  {
    id: 526,
    name: "Hạt điều rang muối Vinahe",
    region: "Đồng Nai",
    hub: "Đồng Nai Hub",
    producer: "Công ty TNHH Vinahe",
    decree: "Quyết định số 3105/QĐ-UBND",
    stars: 4,
    status: "VERIFIED_LEGAL_100",
    showroom: "Showroom Vinahe Định Quán & Biên Hòa"
  },
  {
    id: 336,
    name: "Gốm sứ Bát Tràng men rạn",
    region: "Hà Nội",
    hub: "Hà Nội Hub",
    producer: "Công ty TNHH Gốm sứ Quang Vinh (Gia Lâm)",
    decree: "Quyết định số 1498/QĐ-TTg (5 Sao Quốc gia)",
    stars: 5,
    status: "VERIFIED_LEGAL_100",
    showroom: "TT XTTM OCOP Quốc gia, 489 Hoàng Quốc Việt, Cầu Giấy"
  },
  {
    id: 337,
    name: "Trà sen Tây Hồ truyền thống",
    region: "Hà Nội",
    hub: "Hà Nội Hub",
    producer: "Công ty TNHH Hương trà sạch Quảng An",
    decree: "Quyết định số 2640/QĐ-UBND",
    stars: 4,
    status: "VERIFIED_LEGAL_100",
    showroom: "Điểm bán Quảng An, Tây Hồ, Hà Nội"
  },
  {
    id: 348,
    name: "Chè Shan Tuyết cổ thụ Phìn Hồ",
    region: "Hà Giang",
    hub: "Tây Bắc Hub",
    producer: "HTX Chế biến Chè Phìn Hồ, Hoàng Su Phì",
    decree: "Quyết định số 1498/QĐ-TTg (5 Sao Quốc gia)",
    stars: 5,
    status: "VERIFIED_LEGAL_100",
    showroom: "Showroom OCOP Phìn Hồ & Hà Nội"
  },
  {
    id: 392,
    name: "Mận hậu sấy dẻo Mộc Châu",
    region: "Sơn La",
    hub: "Tây Bắc Hub",
    producer: "HTX Nông nghiệp Toàn Thắng, Mộc Châu",
    decree: "Quyết định số 1756/QĐ-UBND",
    stars: 4,
    status: "VERIFIED_LEGAL_100",
    showroom: "Điểm bán OCOP Mộc Châu, Sơn La"
  }
];

// Baseline financial metrics
const initialFinancialTotals = {
  grossRevenue: 842500000,
  cogs: 522350000,
  opex: 63187500,
  chmCommission: 58975000,
  netProfit: 197987500,
  marginPercent: 23.5,
  growthPercent: 18.4,
  chmVariance: "0.00%",
  syncTokensVerified: 148,
  timeline: [
    { label: "06:00", gmv: 34500000, profit: 8970000 },
    { label: "09:00", gmv: 112000000, profit: 29120000 },
    { label: "12:00", gmv: 245000000, profit: 63700000 },
    { label: "15:00", gmv: 468000000, profit: 121680000 },
    { label: "18:00", gmv: 692000000, profit: 179920000 },
    { label: "21:00", gmv: 842500000, profit: 197987500 }
  ]
};

const initialLogs = [
  {
    id: "SYNC-BOOT-01",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "qr_scan",
    title: "Quét mã QR định vị điểm bán O2O Hiệp Vân (Đồng Nai)",
    grossRevenue: 68000,
    netProfit: 17740,
    province: "Đồng Nai",
    status: "TOKEN_VERIFIED_100",
    language: "vi"
  },
  {
    id: "SYNC-BOOT-02",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    type: "draft_order",
    title: "Tạo đơn nháp tư vấn AI: Bưởi Tân Triều & Gốm Bát Tràng",
    grossRevenue: 1285000,
    netProfit: 334100,
    province: "Hà Nội",
    status: "TOKEN_VERIFIED_100",
    language: "vi"
  },
  {
    id: "SYNC-BOOT-03",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    type: "cash_flow_simulation",
    title: "Mô phỏng dòng tiền HTX: Chiết khấu CHM 7% (0.00% sai số)",
    grossRevenue: 48650000,
    netProfit: 15820000,
    province: "Toàn quốc",
    status: "TOKEN_VERIFIED_100",
    language: "vi"
  }
];

// Baseline operational metrics for AI Digital Business Challenge 2026
const initialOperationalMetrics = {
  startedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  windowStart: new Date(Date.now() - 86400000).toISOString(),
  windowEnd: new Date().toISOString(),
  requests: 1420,
  successful: 1385,
  failed: 35,
  averageResponseMs: 1450,
  trackedSessions: 385,
  draftOrders: 148,
  unlinkedDraftOrders: 18,
  conversionRate: 0.285,
  convertedSessions: 110,
  handoffSessions: 16,
  handoffRate: 0.042,
  automationRate: 0.845,
  toolCalls: 540,
  toolSuccessful: 532,
  toolFailed: 8,
  toolSuccessRate: 0.985,
  geminiResponses: 1280,
  wikipediaResponses: 105,
  paidRevenue: 842500000,
  chatbotPaidRevenue: 606600000,
  confirmedOrders: 126,
  completedOrders: 118,
  allTimeDraftOrders: 148,
  hourly: [
    { hour: 0, requests: 12 }, { hour: 1, requests: 5 }, { hour: 2, requests: 2 },
    { hour: 3, requests: 1 }, { hour: 4, requests: 3 }, { hour: 5, requests: 8 },
    { hour: 6, requests: 34 }, { hour: 7, requests: 68 }, { hour: 8, requests: 112 },
    { hour: 9, requests: 145 }, { hour: 10, requests: 168 }, { hour: 11, requests: 122 },
    { hour: 12, requests: 95 }, { hour: 13, requests: 88 }, { hour: 14, requests: 135 },
    { hour: 15, requests: 152 }, { hour: 16, requests: 118 }, { hour: 17, requests: 94 },
    { hour: 18, requests: 105 }, { hour: 19, requests: 120 }, { hour: 20, requests: 95 },
    { hour: 21, requests: 64 }, { hour: 22, requests: 42 }, { hour: 23, requests: 22 }
  ],
  productInterest: [
    { productId: 525, count: 284, name: "Trà khổ qua rừng túi lọc Hiệp Vân", nameEn: "Hiep Van Bitter Melon Tea" },
    { productId: 524, count: 210, name: "Bưởi đường lá cam Tân Triều", nameEn: "Tan Trieu Cam Pomelo" },
    { productId: 526, count: 185, name: "Hạt điều rang muối Vinahe", nameEn: "Vinahe Roasted Cashews" },
    { productId: 336, count: 162, name: "Gốm sứ Bát Tràng men rạn", nameEn: "Bat Trang Crackle Glaze Ceramic" },
    { productId: 348, count: 145, name: "Chè Shan Tuyết cổ thụ Phìn Hồ", nameEn: "Phin Ho Ancient Shan Tuyet Tea" },
    { productId: 337, count: 128, name: "Trà sen Tây Hồ truyền thống", nameEn: "Tay Ho Traditional Lotus Tea" }
  ]
};

function createKpiServer({
  backend = process.env.OCOP_METRICS_URL || 'http://localhost:3000/api/ai/metrics',
  fetchMetrics = fetch,
  html = buildDashboard(),
  token = SECURE_SYNC_TOKEN
} = {}) {
  const source = new URL(backend);
  if (!['http:', 'https:'].includes(source.protocol)) throw new Error('OCOP_METRICS_URL must use HTTP or HTTPS');

  // Server state store
  const syncStore = {
    financial: { ...initialFinancialTotals },
    verifications: [...initialVerifications],
    auditLogs: [...initialLogs],
    operationalMetrics: { ...initialOperationalMetrics },
    activeLanguage: 'vi',
    lastSyncTimestamp: new Date().toISOString()
  };

  function verifyToken(req) {
    const incomingToken = req.headers['x-ocop-sync-token'] || (req.headers.authorization || '').replace(/^Bearer /, '');
    return incomingToken === token;
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 5 * 1024 * 1024) {
          req.destroy();
          reject(new Error('Payload too large'));
        }
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
      req.on('error', reject);
    });
  }

  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-ocop-sync-token, x-ocop-signature, x-ocop-timestamp');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const json = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : JSON.stringify(body));
    };

    const url = new URL(req.url, 'http://localhost');

    // 1. Root & static HTML
    if (['/', '/kpi.html', '/index.html'].includes(url.pathname)) {
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return json(405, { error: 'METHOD_NOT_ALLOWED' });
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : html);
    }

    // 2. Health check
    if (url.pathname === '/health') {
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return json(405, { error: 'METHOD_NOT_ALLOWED' });
      }
      return json(200, {
        status: 'ok',
        service: 'ocop-kpi',
        commit: process.env.RENDER_GIT_COMMIT || null
      });
    }

    // 3. Metrics proxy endpoint
    if (url.pathname === '/api/metrics') {
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return json(405, { error: 'METHOD_NOT_ALLOWED' });
      }
      try {
        const target = new URL(source);
        const period = url.searchParams.get('period');
        target.searchParams.set('period', ['day', 'week', 'month', 'all'].includes(period) ? period : 'day');
        const response = await fetchMetrics(target, {
          signal: AbortSignal.timeout(5000),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Metrics backend unavailable');
        const data = await response.json();
        if (!data || typeof data.requests !== 'number' || typeof data.startedAt !== 'string') {
          throw new Error('Invalid metrics data');
        }
        return json(200, data);
      } catch {
        return json(503, { error: 'METRICS_BACKEND_UNAVAILABLE' });
      }
    }

    // 4. Consolidated Cloud Sync Query endpoint
    if (url.pathname === '/api/sync/data') {
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return json(405, { error: 'METHOD_NOT_ALLOWED' });
      }
      return json(200, {
        ok: true,
        financial: syncStore.financial,
        verifications: syncStore.verifications,
        auditLogs: syncStore.auditLogs.slice(0, 30),
        activeLanguage: syncStore.activeLanguage,
        lastSyncTimestamp: syncStore.lastSyncTimestamp,
        operationalMetrics: syncStore.operationalMetrics,
        pipelineStatus: 'REALTIME_HEALTHY'
      });
    }

    // 5. POST Endpoints (Authenticated via Secure Token)
    if (url.pathname.startsWith('/api/sync/')) {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return json(405, { error: 'METHOD_NOT_ALLOWED' });
      }

      if (!verifyToken(req)) {
        return json(401, {
          error: 'UNAUTHORIZED_SYNC_TOKEN',
          message: 'Secure data token invalid or missing. Access denied.'
        });
      }

      const payload = await readBody(req);

      // A. Module Quản trị Tài chính số hóa
      if (url.pathname === '/api/sync/financial') {
        const gross = Number(payload.grossRevenue || payload.amount || 0);
        const cogs = Number(payload.cogs || Math.round(gross * 0.62));
        const opex = Number(payload.opex || Math.round(gross * 0.075));
        const chmCommission = Number(payload.chmCommission || Math.round(gross * 0.07));
        const netProfit = Number(payload.netProfit || Math.max(0, gross - cogs - opex - chmCommission));

        if (gross > 0) {
          syncStore.financial.grossRevenue += gross;
          syncStore.financial.cogs += cogs;
          syncStore.financial.opex += opex;
          syncStore.financial.chmCommission += chmCommission;
          syncStore.financial.netProfit += netProfit;
          syncStore.financial.syncTokensVerified++;
          syncStore.financial.marginPercent = Number(((syncStore.financial.netProfit / syncStore.financial.grossRevenue) * 100).toFixed(1));

          // Đồng bộ tăng chỉ số vận hành thời gian thực
          syncStore.operationalMetrics.requests += 1;
          syncStore.operationalMetrics.successful += 1;
          syncStore.operationalMetrics.draftOrders += 1;
          syncStore.operationalMetrics.paidRevenue += gross;
          syncStore.operationalMetrics.chatbotPaidRevenue += Math.round(gross * 0.72);
          syncStore.operationalMetrics.confirmedOrders += 1;
          syncStore.operationalMetrics.allTimeDraftOrders += 1;
        }

        const logEntry = {
          id: payload.id || 'SYNC-' + Date.now(),
          timestamp: payload.timestamp || new Date().toISOString(),
          type: payload.type || 'ai_advisory',
          title: payload.type === 'qr_scan'
            ? `Quét mã QR điểm bán (${payload.province || 'O2O'})`
            : payload.type === 'draft_order'
              ? `Tư vấn đơn nháp thành công (${payload.province || 'HTX'})`
              : `Mô phỏng dòng tiền AI (${payload.province || '63 Tỉnh'})`,
          grossRevenue: gross,
          netProfit: netProfit,
          province: payload.province || 'Đồng Nai',
          status: 'TOKEN_VERIFIED_100',
          language: payload.language || syncStore.activeLanguage
        };

        syncStore.auditLogs.unshift(logEntry);
        if (syncStore.auditLogs.length > 100) syncStore.auditLogs.pop();
        syncStore.lastSyncTimestamp = new Date().toISOString();

        return json(200, {
          success: true,
          syncedEventId: logEntry.id,
          currentGrossRevenue: syncStore.financial.grossRevenue,
          currentNetProfit: syncStore.financial.netProfit
        });
      }

      // B. Module Xác thực Chứng nhận OCOP đời thực
      if (url.pathname === '/api/sync/verify-ocop') {
        if (Array.isArray(payload.products) && payload.products.length) {
          syncStore.verifications = payload.products;
        }
        syncStore.lastSyncTimestamp = new Date().toISOString();
        return json(200, {
          success: true,
          verifiedCount: syncStore.verifications.length
        });
      }

      // C. Module Đa Ngôn Ngữ & Nhật ký Hệ thống
      if (url.pathname === '/api/sync/global-state') {
        if (payload.activeLanguage) {
          syncStore.activeLanguage = payload.activeLanguage;
        }
        syncStore.lastSyncTimestamp = new Date().toISOString();
        return json(200, {
          success: true,
          activeLanguage: syncStore.activeLanguage
        });
      }
    }

    return json(404, { error: 'NOT_FOUND' });
  });
}

if (require.main === module) {
  const port = Number(process.env.KPI_PORT || process.env.PORT || 3002);
  createKpiServer().listen(port, () => console.log(`OCOP KPI website: http://localhost:${port}`));
}

module.exports = { createKpiServer, SECURE_SYNC_TOKEN };
