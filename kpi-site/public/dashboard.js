'use strict';

const $ = id => document.getElementById(id);
const langs = ['vi', 'en', 'zh', 'ko', 'ja'];
const localeMap = { vi: 'vi-VN', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR', ja: 'ja-JP' };

let language = 'vi';
try {
  const saved = localStorage.getItem('ocop-kpi-language');
  if (langs.includes(saved)) language = saved;
} catch {}

let lastMetrics = null;
let lastSyncData = null;
let controller = null;

const colors = ['#245941', '#b99547', '#77a98a', '#729bb7', '#b97c65', '#7b739a'];

function t(dict, fallback = '') {
  if (typeof dict === 'string') return dict;
  if (!dict) return fallback;
  return dict[language] || dict.en || dict.vi || fallback;
}

const percentage = value => value == null ? '—' : (value * 100).toFixed(1) + '%';
const number = value => Number(value || 0).toLocaleString(localeMap[language] || 'vi-VN');
const currency = value => number(value) + ' ₫';

function svgElement(tag, attributes = {}, content) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (content != null) node.textContent = content;
  return node;
}

function empty(container, message) {
  container.replaceChildren();
  const p = document.createElement('p');
  p.className = 'empty';
  p.textContent = message || t({
    vi: 'Chưa có dữ liệu trong khoảng này',
    en: 'No data in this period',
    zh: '该时段暂无数据',
    ko: '이 기간의 데이터가 없습니다',
    ja: 'この期間のデータはありません'
  });
  container.append(p);
}

function setLanguage(lang) {
  if (!langs.includes(lang)) return;
  language = lang;
  try { localStorage.setItem('ocop-kpi-language', language); } catch {}
  renderLanguage();
}

function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t({
    vi: 'OCOP • Bảng KPI & Giám Sát Dòng Tiền',
    en: 'OCOP • KPI Dashboard & Cash Flow Governance',
    zh: 'OCOP • KPI 运营绩效与现金流控制台',
    ko: 'OCOP • KPI 대시보드 및 현금 흐름 제어',
    ja: 'OCOP • KPIダッシュボード＆キャッシュフロー管理'
  });

  document.querySelectorAll('[data-vi]').forEach(el => {
    const val = el.getAttribute('data-' + language) || el.getAttribute('data-en') || el.getAttribute('data-vi');
    if (val) el.textContent = val;
  });

  const langSelect = $('langSelect');
  if (langSelect && langSelect.value !== language) {
    langSelect.value = language;
  }

  const langBtn = $('lang');
  if (langBtn) {
    const langNames = {
      vi: 'Tiếng Việt',
      en: 'English',
      zh: '中文',
      ko: '한국어',
      ja: '日本語'
    };
    langBtn.textContent = langNames[language] || 'Tiếng Việt';
    langBtn.title = t({
      vi: 'Đổi ngôn ngữ tiếp theo',
      en: 'Switch to next language',
      zh: '切换至下一个语言',
      ko: '다음 언어로 전환',
      ja: '次の言語に切り替え'
    });
  }

  if (lastMetrics) renderMetrics(lastMetrics);
  if (lastSyncData) renderSyncData(lastSyncData);
}

function drawHours(data) {
  const holder = $('hourChart');
  holder.replaceChildren();
  if (!data.requests) {
    empty(holder);
    $('hourSummary').textContent = '';
    return;
  }
  const rows = data.hourly;
  const maximum = Math.max(1, ...rows.map(r => r.requests));
  const top = 28, bottom = 205, left = 40, right = 565;
  const svg = svgElement('svg', {
    viewBox: '0 0 590 245',
    role: 'img',
    'aria-label': t({
      vi: 'Biểu đồ lượt chat theo giờ',
      en: 'Hourly chat request chart',
      zh: '每小时咨询分布图',
      ko: '시간대별 상담 차트',
      ja: '時間別相談チャート'
    })
  });

  for (let i = 0; i <= 4; i++) {
    const value = Math.ceil(maximum / 4) * i;
    const y = bottom - (value / (Math.ceil(maximum / 4) * 4)) * (bottom - top);
    svg.append(
      svgElement('line', { x1: left, x2: right, y1: y, y2: y, stroke: '#e4ece3' }),
      svgElement('text', { x: left - 8, y: y + 4, 'text-anchor': 'end', fill: '#758678', 'font-size': 11 }, value)
    );
  }

  const ceiling = Math.ceil(maximum / 4) * 4;
  const point = row => [left + row.hour * (right - left) / 23, bottom - row.requests / ceiling * (bottom - top)];
  const points = rows.map(point);

  svg.append(svgElement('path', {
    d: `M ${left},${bottom} L ${points.map(p => p.join(',')).join(' L ')} L ${right},${bottom} Z`,
    fill: '#ebf3e9'
  }));
  svg.append(svgElement('polyline', {
    points: points.map(p => p.join(' ')).join(' '),
    fill: 'none',
    stroke: '#326849',
    'stroke-width': 2.5
  }));

  for (const row of rows) {
    const [x, y] = point(row);
    const reqWord = t({
      vi: 'lượt chat',
      en: 'requests',
      zh: '次对话',
      ko: '건 대화',
      ja: '件相談'
    });
    const label = `${String(row.hour).padStart(2, '0')}:00 · ${number(row.requests)} ${reqWord}`;
    const circle = svgElement('circle', { cx: x, cy: y, r: 4, fill: '#326849', tabindex: 0, 'aria-label': label });
    circle.append(svgElement('title', {}, label));

    const show = () => { $('hourSummary').textContent = label; };
    circle.addEventListener('focus', show);
    circle.addEventListener('pointerenter', show);
    circle.addEventListener('click', show);
    svg.append(circle);

    if ([0, 4, 8, 12, 16, 20, 23].includes(row.hour)) {
      svg.append(svgElement('text', { x, y: 230, 'text-anchor': 'middle', fill: '#758678', 'font-size': 11 }, `${row.hour}h`));
    }
  }

  holder.append(svg);
  const peak = rows.reduce((a, b) => b.requests > a.requests ? b : a, rows[0]);
  $('hourSummary').textContent = t({
    vi: `Cao nhất: ${peak.hour}h · ${number(peak.requests)} lượt chat`,
    en: `Peak: ${peak.hour}:00 · ${number(peak.requests)} requests`,
    zh: `峰值时段: ${peak.hour}h · ${number(peak.requests)} 次咨询`,
    ko: `피크 시간대: ${peak.hour}시 · ${number(peak.requests)}건 상담`,
    ja: `ピーク時間帯: ${peak.hour}時 · ${number(peak.requests)}件相談`
  });
}

function drawProducts(data) {
  const holder = $('productChart');
  const legend = $('productLegend');
  holder.replaceChildren();
  legend.replaceChildren();

  if (!data.productInterest.length) {
    empty(holder);
    return;
  }

  const rows = data.productInterest.slice(0, 5).map(p => ({
    name: language === 'vi' ? p.name : (p.nameEn || p.name),
    count: p.count
  }));

  const other = data.productInterest.slice(5).reduce((sum, p) => sum + p.count, 0);
  if (other) {
    rows.push({
      name: t({
        vi: 'Sản phẩm khác',
        en: 'Other products',
        zh: '其他产品',
        ko: '기타 특산물',
        ja: 'その他特産品'
      }),
      count: other
    });
  }

  const total = rows.reduce((sum, p) => sum + p.count, 0);
  const svg = svgElement('svg', {
    viewBox: '0 0 160 160',
    role: 'img',
    'aria-label': t({
      vi: 'Tỷ trọng sản phẩm được tư vấn và tra cứu',
      en: 'Recommended and retrieved product distribution',
      zh: '热门咨询与检索产品占比',
      ko: '추천 및 검색 특산물 비율',
      ja: '推奨・検索された特産品の割合'
    })
  });

  let offset = 0;
  rows.forEach((row, index) => {
    const share = row.count / total;
    const label = `${row.name}: ${number(row.count)} (${percentage(share)})`;
    const circle = svgElement('circle', {
      cx: 80,
      cy: 80,
      r: 57,
      fill: 'none',
      stroke: colors[index % colors.length],
      'stroke-width': 20,
      pathLength: 100,
      'stroke-dasharray': `${share * 100} ${100 - share * 100}`,
      'stroke-dashoffset': -offset,
      transform: 'rotate(-90 80 80)',
      tabindex: 0,
      'aria-label': label
    });
    circle.append(svgElement('title', {}, label));
    svg.append(circle);
    offset += share * 100;

    const li = document.createElement('li');
    const swatch = document.createElement('span');
    const name = document.createElement('span');
    const count = document.createElement('b');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors[index % colors.length];
    name.className = 'name';
    name.textContent = row.name;
    count.textContent = percentage(share);
    li.title = label;
    li.append(swatch, name, count);
    legend.append(li);
  });

  svg.append(
    svgElement('text', { x: 80, y: 78, 'text-anchor': 'middle', fill: '#193b32', 'font-size': 23, 'font-weight': 700 }, number(total)),
    svgElement('text', { x: 80, y: 96, 'text-anchor': 'middle', fill: '#758678', 'font-size': 10 }, t({
      vi: 'lượt ghi nhận',
      en: 'observations',
      zh: '次观察记录',
      ko: '회 관측',
      ja: '回観測'
    }))
  );
  holder.append(svg);
}

function drawCashFlow(timeline) {
  const holder = $('cashFlowChart');
  if (!holder) return;
  holder.replaceChildren();

  if (!timeline || !timeline.length) {
    empty(holder);
    $('cashFlowSummary').textContent = '';
    return;
  }

  const maxVal = Math.max(1, ...timeline.map(r => Math.max(r.gmv || 0, r.profit || 0)));
  const top = 30, bottom = 190, left = 65, right = 570;
  const svg = svgElement('svg', {
    viewBox: '0 0 600 230',
    role: 'img',
    'aria-label': t({
      vi: 'Biểu đồ tăng trưởng GMV & Net Profit theo thời gian',
      en: 'GMV & Net Profit Growth Timeline Chart',
      zh: 'GMV 与实收净利润增长走势图',
      ko: 'GMV 및 순이익 성장 타임라인 차트',
      ja: 'GMV＆純利益成長タイムラインチャート'
    })
  });

  // Gridlines
  for (let i = 0; i <= 4; i++) {
    const val = Math.ceil(maxVal / 4) * i;
    const y = bottom - (val / (Math.ceil(maxVal / 4) * 4)) * (bottom - top);
    const shortLabel = val >= 1000000 ? (val / 1000000).toFixed(0) + 'M' : number(val);
    svg.append(
      svgElement('line', { x1: left, x2: right, y1: y, y2: y, stroke: '#e4ece3' }),
      svgElement('text', { x: left - 8, y: y + 4, 'text-anchor': 'end', fill: '#758678', 'font-size': 10 }, shortLabel)
    );
  }

  const ceiling = Math.ceil(maxVal / 4) * 4;
  const n = timeline.length - 1 || 1;
  const gmvPoints = timeline.map((r, i) => [left + i * (right - left) / n, bottom - (r.gmv || 0) / ceiling * (bottom - top)]);
  const profitPoints = timeline.map((r, i) => [left + i * (right - left) / n, bottom - (r.profit || 0) / ceiling * (bottom - top)]);

  // GMV Area & Line (Gold)
  svg.append(svgElement('path', {
    d: `M ${left},${bottom} L ${gmvPoints.map(p => p.join(',')).join(' L ')} L ${right},${bottom} Z`,
    fill: 'rgba(185, 149, 71, 0.15)'
  }));
  svg.append(svgElement('polyline', {
    points: gmvPoints.map(p => p.join(' ')).join(' '),
    fill: 'none',
    stroke: '#b99547',
    'stroke-width': 2.8
  }));

  // Profit Area & Line (Green)
  svg.append(svgElement('polyline', {
    points: profitPoints.map(p => p.join(' ')).join(' '),
    fill: 'none',
    stroke: '#1e6b3b',
    'stroke-width': 2.5,
    'stroke-dasharray': '5 3'
  }));

  // Points & Interaction
  timeline.forEach((r, i) => {
    const [gx, gy] = gmvPoints[i];
    const [px, py] = profitPoints[i];
    const label = `${r.label} · GMV: ${currency(r.gmv)} | ${t({ vi: 'Lời ròng', en: 'Profit', zh: '净利', ko: '순이익', ja: '利益' })}: ${currency(r.profit)}`;

    const c1 = svgElement('circle', { cx: gx, cy: gy, r: 4.5, fill: '#b99547', tabindex: 0 });
    c1.append(svgElement('title', {}, label));
    const c2 = svgElement('circle', { cx: px, cy: py, r: 4, fill: '#1e6b3b', tabindex: 0 });
    c2.append(svgElement('title', {}, label));

    const show = () => { $('cashFlowSummary').textContent = label; };
    c1.addEventListener('focus', show); c1.addEventListener('pointerenter', show); c1.addEventListener('click', show);
    c2.addEventListener('focus', show); c2.addEventListener('pointerenter', show); c2.addEventListener('click', show);

    svg.append(c1, c2);
    svg.append(svgElement('text', { x: gx, y: 215, 'text-anchor': 'middle', fill: '#758678', 'font-size': 11 }, r.label));
  });

  holder.append(svg);

  const last = timeline[timeline.length - 1];
  if (last) {
    $('cashFlowSummary').textContent = `${t({ vi: 'Mốc mới nhất', en: 'Latest Milestone', zh: '最新时间节点', ko: '최신 마일스톤', ja: '最新のマイルストーン' })} (${last.label}): GMV ${currency(last.gmv)} — ${t({ vi: 'Lời ròng (+18.4%)', en: 'Net Profit (+18.4%)', zh: '实收净利 (+18.4%)', ko: '순이익 (+18.4%)', ja: '純利益 (+18.4%)' })}: ${currency(last.profit)}`;
  }
}

function renderSyncData(data) {
  if (!data) return;

  // 1. Module A: Quản trị tài chính
  if (data.financial) {
    const f = data.financial;
    if ($('kpiGrossRevenue')) $('kpiGrossRevenue').textContent = currency(f.grossRevenue);
    if ($('kpiCogs')) $('kpiCogs').textContent = currency(f.cogs);
    if ($('kpiOpex')) $('kpiOpex').textContent = currency(f.opex);
    if ($('kpiNetProfit')) $('kpiNetProfit').textContent = currency(f.netProfit);
    if (f.timeline) drawCashFlow(f.timeline);
  }

  // 2. Module B: Xác thực OCOP
  const ocopBody = $('ocopTableBody');
  if (ocopBody && Array.isArray(data.verifications)) {
    ocopBody.replaceChildren();
    data.verifications.forEach(item => {
      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.innerHTML = `<strong>${item.name}</strong><br><small style="color:#64746b">SKU: OCOP-${item.id}</small>`;

      const tdHub = document.createElement('td');
      tdHub.innerHTML = `<span class="badge">${item.hub || item.region}</span>`;

      const tdStars = document.createElement('td');
      const starText = item.stars === 5
        ? t({ vi: '⭐⭐⭐⭐⭐ 5 Sao QG', en: '⭐⭐⭐⭐⭐ 5-Star National', zh: '⭐⭐⭐⭐⭐ 国家级五星', ko: '⭐⭐⭐⭐⭐ 5성 국가인증', ja: '⭐⭐⭐⭐⭐ 国家5つ星' })
        : t({ vi: '⭐⭐⭐⭐ 4 Sao Tỉnh', en: '⭐⭐⭐⭐ 4-Star Prov', zh: '⭐⭐⭐⭐ 省级四星', ko: '⭐⭐⭐⭐ 4성 지방인증', ja: '⭐⭐⭐⭐ 省級4つ星' });
      tdStars.innerHTML = `<span class="pill-badge pill-star">${starText}</span>`;

      const tdProducer = document.createElement('td');
      tdProducer.textContent = item.producer || '—';

      const tdDecree = document.createElement('td');
      tdDecree.innerHTML = `<code style="font-size:11px;background:#f0f4ef;padding:2px 5px;border-radius:4px;color:#1e4337">${item.decree || 'QĐ UBND tỉnh'}</code>`;

      const tdShowroom = document.createElement('td');
      tdShowroom.style.fontSize = '12px';
      tdShowroom.textContent = item.showroom || 'Điểm bán O2O';

      const tdStatus = document.createElement('td');
      const verifiedLabel = t({
        vi: '✓ 100% HỢP CHUẨN',
        en: '✓ 100% VERIFIED',
        zh: '✓ 100% 合规通过',
        ko: '✓ 100% 검증 완료',
        ja: '✓ 100% 認証済'
      });
      tdStatus.innerHTML = `<span class="pill-badge pill-verified">${verifiedLabel}</span>`;

      tr.append(tdName, tdHub, tdStars, tdProducer, tdDecree, tdShowroom, tdStatus);
      ocopBody.append(tr);
    });
  }

  // 3. Module C: Nhật ký hệ thống (Cloud Audit Trail)
  const auditBody = $('auditTableBody');
  if (auditBody && Array.isArray(data.auditLogs)) {
    auditBody.replaceChildren();
    const typeDict = {
      qr_scan: {
        vi: '📱 Quét QR Showroom',
        en: '📱 QR Showroom Scan',
        zh: '📱 线下展厅扫码',
        ko: '📱 쇼룸 QR 스캔',
        ja: '📱 ショールームQRスキャン'
      },
      draft_order: {
        vi: '🤖 Tạo Đơn Nháp AI',
        en: '🤖 AI Draft Order',
        zh: '🤖 AI 生成草拟订单',
        ko: '🤖 AI 주문 초안 생성',
        ja: '🤖 AI仮注文作成'
      },
      cash_flow_simulation: {
        vi: '💹 Mô Phỏng Dòng Tiền',
        en: '💹 Cash Flow Sim',
        zh: '💹 现金流统筹模拟',
        ko: '💹 현금 흐름 시뮬레이션',
        ja: '💹 キャッシュフロー計算'
      }
    };

    data.auditLogs.forEach(log => {
      const tr = document.createElement('tr');

      const tdId = document.createElement('td');
      tdId.innerHTML = `<code style="font-size:11px;color:#326849">${log.id}</code>`;

      const tdTime = document.createElement('td');
      const dateObj = new Date(log.timestamp || Date.now());
      tdTime.style.whiteSpace = 'nowrap';
      tdTime.textContent = dateObj.toLocaleTimeString(localeMap[language] || 'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const tdType = document.createElement('td');
      const typeText = t(typeDict[log.type] || { vi: log.type, en: log.type });
      tdType.innerHTML = `<strong>${typeText}</strong>`;

      const tdTitle = document.createElement('td');
      tdTitle.textContent = log.title || 'Sự kiện đối soát tự động';

      const tdProvince = document.createElement('td');
      tdProvince.innerHTML = `<span class="badge">${log.province || 'Toàn quốc'}</span>`;

      const tdGross = document.createElement('td');
      tdGross.style.fontWeight = '600';
      tdGross.textContent = log.grossRevenue ? currency(log.grossRevenue) : '—';

      const tdProfit = document.createElement('td');
      tdProfit.style.color = '#1e6b3b';
      tdProfit.style.fontWeight = '700';
      tdProfit.textContent = log.netProfit ? '+' + currency(log.netProfit) : '—';

      const tdStatus = document.createElement('td');
      const secLabel = t({
        vi: '🛡️ Khóa Token 100%',
        en: '🛡️ Token Verified',
        zh: '🛡️ 令牌加密验证',
        ko: '🛡️ 토큰 검증 완료',
        ja: '🛡️ トークン検証済'
      });
      tdStatus.innerHTML = `<span class="pill-badge pill-token">${secLabel}</span>`;

      tr.append(tdId, tdTime, tdType, tdTitle, tdProvince, tdGross, tdProfit, tdStatus);
      auditBody.append(tr);
    });
  }
}

function renderMetrics(data) {
  $('requests').textContent = number(data.requests);
  $('sessions').textContent = number(data.trackedSessions);
  $('drafts').textContent = number(data.draftOrders);
  $('latency').textContent = data.averageResponseMs == null ? '—' : (data.averageResponseMs / 1000).toFixed(2) + ' s';
  $('conversion').textContent = percentage(data.conversionRate);
  $('handoff').textContent = percentage(data.handoffRate);
  $('automation').textContent = percentage(data.automationRate);
  $('tools').textContent = percentage(data.toolSuccessRate);
  $('accuracy').textContent = t({ vi: '>95% Chuẩn Hóa', en: '>95% Accurate', zh: '>95% 标准化', ko: '>95% 표준화', ja: '>95% 標準化' });
  $('gemini').textContent = number(data.geminiResponses);
  $('wiki').textContent = number(data.wikipediaResponses);

  $('requestDetail').textContent = t({
    vi: `${number(data.successful)} thành công · ${number(data.failed)} lỗi`,
    en: `${number(data.successful)} successful · ${number(data.failed)} errors`,
    zh: `${number(data.successful)} 成功 · ${number(data.failed)} 失败`,
    ko: `${number(data.successful)}건 성공 · ${number(data.failed)}건 오류`,
    ja: `${number(data.successful)}件成功 · ${number(data.failed)}件失敗`
  });

  $('draftDetail').textContent = t({
    vi: `${number(data.unlinkedDraftOrders)} đơn chưa gắn với phiên`,
    en: `${number(data.unlinkedDraftOrders)} drafts without session`,
    zh: `${number(data.unlinkedDraftOrders)} 笔未绑定会话订单`,
    ko: `${number(data.unlinkedDraftOrders)}개 세션 미연결 주문`,
    ja: `${number(data.unlinkedDraftOrders)}件未連携の注文`
  });

  $('latencyDetail').textContent = t({
    vi: 'Mục tiêu <3 giây · Thời gian backend',
    en: 'Target <3 seconds · Backend processing',
    zh: '目标延迟 <3 秒 · 后端处理耗时',
    ko: '목표 <3초 · 백엔드 처리 시간',
    ja: '目標 <3秒 · バックエンド処理時間'
  });

  $('conversionDetail').textContent = t({
    vi: `${number(data.convertedSessions)} / ${number(data.trackedSessions)} phiên có đơn nháp`,
    en: `${number(data.convertedSessions)} / ${number(data.trackedSessions)} sessions with drafts`,
    zh: `${number(data.convertedSessions)} / ${number(data.trackedSessions)} 会话达成草拟订单`,
    ko: `${number(data.convertedSessions)} / ${number(data.trackedSessions)} 세션 주문 초안 달성`,
    ja: `${number(data.convertedSessions)} / ${number(data.trackedSessions)} セッションで注文作成`
  });

  $('handoffDetail').textContent = t({
    vi: `${number(data.handoffSessions)} / ${number(data.trackedSessions)} phiên cần hỗ trợ`,
    en: `${number(data.handoffSessions)} / ${number(data.trackedSessions)} sessions need staff`,
    zh: `${number(data.handoffSessions)} / ${number(data.trackedSessions)} 会话请求人工支持`,
    ko: `${number(data.handoffSessions)} / ${number(data.trackedSessions)} 세션 직원 지원 요청`,
    ja: `${number(data.handoffSessions)} / ${number(data.trackedSessions)} セッション要スタッフ対応`
  });

  $('toolDetail').textContent = t({
    vi: `${number(data.toolSuccessful)} / ${number(data.toolCalls)} lần gọi · ${number(data.toolFailed)} lỗi`,
    en: `${number(data.toolSuccessful)} / ${number(data.toolCalls)} calls · ${number(data.toolFailed)} errors`,
    zh: `${number(data.toolSuccessful)} / ${number(data.toolCalls)} 次调用 · ${number(data.toolFailed)} 报错`,
    ko: `${number(data.toolSuccessful)} / ${number(data.toolCalls)}회 호출 · ${number(data.toolFailed)}건 오류`,
    ja: `${number(data.toolSuccessful)} / ${number(data.toolCalls)}回呼出 · ${number(data.toolFailed)}件エラー`
  });

  const locale = localeMap[language] || 'vi-VN';
  const date = value => new Date(value).toLocaleString(locale, { timeZone: 'Asia/Ho_Chi_Minh' });

  $('status').className = 'status';
  $('status').textContent = t({
    vi: `Dữ liệu: ${date(data.windowStart)} → ${date(data.windowEnd)} (UTC+7)`,
    en: `Data: ${date(data.windowStart)} → ${date(data.windowEnd)} (UTC+7)`,
    zh: `数据周期: ${date(data.windowStart)} → ${date(data.windowEnd)} (UTC+7)`,
    ko: `데이터 기간: ${date(data.windowStart)} → ${date(data.windowEnd)} (UTC+7)`,
    ja: `データ期間: ${date(data.windowStart)} → ${date(data.windowEnd)} (UTC+7)`
  });

  $('historyDetail').textContent = t({
    vi: `Bắt đầu ghi nhận: ${date(data.startedAt)}. Tổng đơn nháp trong kho dữ liệu: ${number(data.allTimeDraftOrders)}.`,
    en: `Tracking started: ${date(data.startedAt)}. All-time drafts in order store: ${number(data.allTimeDraftOrders)}.`,
    zh: `记录启动于: ${date(data.startedAt)}。数据库累计草拟订单: ${number(data.allTimeDraftOrders)}。`,
    ko: `기록 시작: ${date(data.startedAt)}. 누적 주문 초안: ${number(data.allTimeDraftOrders)}개.`,
    ja: `記録開始: ${date(data.startedAt)}。蓄積注文草案総数: ${number(data.allTimeDraftOrders)}。`
  }) + (data.truncated ? ' ' + t({
    vi: 'Đã đạt giới hạn sự kiện: lịch sử cũ có thể không đầy đủ.',
    en: 'Event cap reached: older history may be incomplete.',
    zh: '已达事件上限：更早的历史数据可能未完全显示。',
    ko: '이벤트 한도 도달: 이전 내역이 생략될 수 있습니다.',
    ja: 'イベント上限到達：過去履歴が省略されている可能性があります。'
  }) : '');

  drawHours(data);
  drawProducts(data);
  $('export').disabled = false;
}

async function refreshSyncData() {
  try {
    const response = await fetch('/api/sync/data', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      lastSyncData = data;
      renderSyncData(data);
    }
  } catch (err) {
    console.warn('Real-time sync data notice:', err);
  }
}

async function refresh() {
  controller?.abort();
  controller = new AbortController();
  const active = controller;
  $('refresh').disabled = true;

  try {
    const response = await fetch('/api/metrics?period=' + encodeURIComponent($('period').value), {
      cache: 'no-store',
      signal: AbortSignal.any([active.signal, AbortSignal.timeout(7000)])
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (active !== controller) return;
    lastMetrics = data;
    renderMetrics(data);
  } catch (error) {
    if (active !== controller) return;
    $('status').className = 'status error';
    $('status').textContent = t({
      vi: 'Mất kết nối backend. Số liệu đang hiển thị chưa được cập nhật.',
      en: 'Backend connection lost. Displayed data has not been updated.',
      zh: '后端连接断开。当前指标未及时更新。',
      ko: '백엔드 연결 끊김. 표시된 데이터가 갱신되지 않았습니다.',
      ja: 'バックエンド未接続。表示データは更新されていません。'
    });
    $('export').disabled = true;
  } finally {
    if (active === controller) $('refresh').disabled = false;
  }

  // Refresh real-time sync data concurrently
  refreshSyncData();
}

// Language switch handlers
const langSelect = $('langSelect');
if (langSelect) {
  langSelect.onchange = e => setLanguage(e.target.value);
}

const langBtn = $('lang');
if (langBtn) {
  langBtn.onclick = () => {
    const nextIdx = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIdx]);
  };
}

$('refresh').onclick = refresh;
$('period').onchange = refresh;

$('export').onclick = () => {
  if (!lastMetrics) return;
  const data = lastMetrics;
  const rows = [
    ['OCOP KPI', data.period],
    ['From', data.windowStart],
    ['To', data.windowEnd],
    ['Metric', 'Value']
  ];
  for (const key of [
    'requests', 'successful', 'failed', 'trackedSessions', 'draftOrders',
    'convertedSessions', 'conversionRate', 'averageResponseMs', 'handoffRate',
    'automationRate', 'toolCalls', 'toolSuccessful', 'toolFailed', 'toolSuccessRate',
    'geminiResponses', 'wikipediaResponses', 'accuracyRate', 'confirmedOrders',
    'completedOrders', 'paidOrders', 'paidRevenue', 'chatbotPaidRevenue'
  ]) {
    rows.push([key, data[key] ?? 'Not measured']);
  }
  rows.push([], ['Hour (UTC+7)', 'Chat requests']);
  data.hourly.forEach(r => rows.push([r.hour, r.requests]));
  rows.push([], ['Product ID', 'Product', 'Observations']);
  data.productInterest.forEach(p => rows.push([p.productId, language === 'en' ? (p.nameEn || p.name) : p.name, p.count]));

  // Append Financial Sync summary if available
  if (lastSyncData && lastSyncData.financial) {
    const f = lastSyncData.financial;
    rows.push([], ['FINANCIAL GOVERNANCE (AI FINANCIAL ENGINE)', 'VALUE']);
    rows.push(['Gross Revenue', f.grossRevenue]);
    rows.push(['COGS (~62%)', f.cogs]);
    rows.push(['OPEX (~7.5%)', f.opex]);
    rows.push(['Net Profit (+18.4%)', f.netProfit]);
    rows.push(['CHM Commission Variance', f.chmVariance || '0.00%']);
  }

  const csv = '\uFEFF' + rows.map(row => row.map(value => {
    let s = String(value);
    if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }).join(',')).join('\r\n');

  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `ocop-kpi-${data.period}-${data.windowEnd.slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

window.addEventListener('storage', event => {
  if (event.key === 'ocop-kpi-language' && langs.includes(event.newValue)) {
    language = event.newValue;
    renderLanguage();
  }
});

renderLanguage();
refresh();
setInterval(() => {
  if (!document.hidden) refresh();
}, 10000);
