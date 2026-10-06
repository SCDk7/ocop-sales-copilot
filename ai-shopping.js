(function (root) {
  'use strict';
  const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  function money(value, unit) {
    const number = Number(value.replace(/[.,](?=\d{3}(?:\D|$))/g, '').replace(',', '.'));
    return Math.round(number * (/^(trieu|tr|m)$/.test(unit) ? 1000000 : /^(k|nghin|ngan)$/.test(unit) ? 1000 : 1));
  }
  function budget(text) {
    const query = normalize(text);
    const amounts = [...query.matchAll(/(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan|vnd|dong|d|₫)(?!\w)/g)];
    const range = query.match(/(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan)?\s*(?:-|–|den|to)\s*(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan)/);
    if (range) return { minPrice: money(range[1], range[2] || range[4]), maxPrice: money(range[3], range[4]) };
    const amount = amounts[0] || query.match(/(?:ngan sach|toi co|minh co|tai chinh|budget|duoi|toi da|khoang|tam)\s*(\d+(?:[.,]\d+)*)/);
    if (!amount) return {};
    const value = money(amount[1], amount[2] || '');
    return /(?:tren|toi thieu|over|above)\s*\d/.test(query) ? { minPrice: value, maxPrice: null } : { minPrice: null, maxPrice: value };
  }
  function analyze(text, products) {
    const q = normalize(text);
    const categories = [['trà', /\b(tra|che|tea)\b/], ['cà phê', /ca phe|coffee/], ['mật ong', /mat ong|honey/], ['bánh', /banh|keo|snack/], ['yến', /yen sao|to yen/], ['gạo', /gao|rice/]];
    return { ...budget(text), rawText: text,
      isCombo: /combo|bo qua|gio qua|set qua|gift set|bundle/.test(q),
      isGift: /qua|bieu|tang|gift/.test(q),
      isComplaint: /doi tra|hang loi|hoan tien|khieu nai/.test(q),
      isCSKH: /cskh|hotline|lien he|admin/.test(q),
      isShipping: /phi ship|giao hang|van chuyen/.test(q),
      isUsage: /cach pha|cach dung|bao quan/.test(q),
      isOcopKnowledge: /la gi|nguon goc|tieu chuan/.test(q),
      categoryOrKeyword: categories.find(([, pattern]) => pattern.test(q))?.[0] || null,
      exactRegion: products.find(p => q.includes(normalize(p.region)) && p.region)?.region || null,
      minStars: /5\s*sao|5\s*star/.test(q) ? 5 : /4\s*sao|4\s*star/.test(q) ? 4 : null };
  }
  function resolve(messages, products, extract = analyze) {
    let saved = {};
    let current = {};
    for (const message of messages.filter(m => m.role === 'user')) {
      current = { ...extract(message.text, products), ...budget(message.text) };
      current.categoryOrKeyword ||= analyze(message.text, products).categoryOrKeyword;
      const q = normalize(message.text);
      const followup = /^(?:\d|toi co|minh co|ngan sach|tai chinh|budget|duoi|tam|khoang|doi|con|chi|them|combo|bo qua|gio qua|set qua|gift set|bundle)/.test(q) || (!current.categoryOrKeyword && !current.exactRegion && q.length < 45);
      if (!followup || /bat dau lai|yeu cau moi|start over/.test(q)) saved = {};
      for (const key of ['categoryOrKeyword', 'exactRegion', 'regionKeyword', 'minStars']) {
        if (current[key]) {
          if (key === 'exactRegion' || key === 'regionKeyword') { delete saved.exactRegion; delete saved.regionKeyword; }
          saved[key] = current[key];
        }
      }
      if (current.maxPrice != null || current.minPrice != null) { saved.maxPrice = current.maxPrice ?? null; saved.minPrice = current.minPrice ?? null; }
      if (current.isCombo) saved.isCombo = true;
      if (current.isGift) saved.isGift = true;
    }
    return { ...current, ...saved, rawText: messages.filter(m => m.role === 'user').map(m => m.text).join('\n') };
  }
  // Exact subset-sum: no item-count cap, one unit per catalogue item.
  // Each card represents one unit, so cart contents and quoted totals agree.
  function closest(products, intent) {
    const ceiling = intent.maxPrice;
    if (!Number.isSafeInteger(ceiling) || ceiling <= 0) return null;
    const candidates = products.filter(p => Number.isSafeInteger(p.price) && p.price > 0 && p.price <= ceiling).sort((a, b) => a.price - b.price || a.id - b.id);
    const states = new Map([[0, { count: 0, quality: 0, previous: null }]]);
    for (const product of candidates) {
      // Snapshot prevents buying the same item again in this iteration.
      for (const [total, previous] of [...states]) {
        const nextTotal = total + product.price;
        if (nextTotal > ceiling) continue;
        const count = previous.count + 1;
        const quality = previous.quality + (Number.isFinite(product.rating) ? product.rating : 0);
        const existing = states.get(nextTotal);
        if (!existing || count > existing.count || (count === existing.count && quality > existing.quality)) {
          states.set(nextTotal, { product, previous, count, quality });
        }
      }
    }
    let total = 0;
    let best = null;
    for (const [sum, state] of states) {
      if (state.count >= 2 && sum >= (intent.minPrice || 0) && sum > total) { total = sum; best = state; }
    }
    if (!best) return null;
    const items = [];
    for (let state = best; state.product; state = state.previous) items.push(state.product);
    items.reverse();
    return { items, total, budget: ceiling, remaining: ceiling - total };
  }
  function reply(plan, intent, language) {
    const en = language === 'en';
    const format = value => value.toLocaleString('vi-VN') + ' ₫';
    const message = !plan ? (en ? 'No matching combo fits this budget. Would you prefer one item or a different budget/category?' : 'Chưa có combo đúng yêu cầu trong ngân sách này. Anh/chị muốn chọn một món hoặc điều chỉnh ngân sách/nhóm hàng?') : [
      en ? `For your ${format(plan.budget)} budget, this is the closest matching set of ${plan.items.length} different products:` : `Với ngân sách ${format(plan.budget)}${intent.exactRegion ? ', đặc sản ' + intent.exactRegion : ''}${intent.categoryOrKeyword ? ', nhóm ' + intent.categoryOrKeyword : ''}, đây là combo ${plan.items.length} món khác nhau có tổng tiền sát nhất:`,
      ...plan.items.map(p => `• ${en ? p.nameEn || p.name : p.name} × 1: ${format(p.price)}`),
      `${en ? 'Total' : 'Tổng combo'}: ${format(plan.total)}. ${en ? 'Remaining' : 'Còn lại'}: ${format(plan.remaining)}.`,
      en ? 'At the same total, more different matching items are preferred, then catalogue customer ratings.' : 'Nếu tổng tiền bằng nhau, ưu tiên nhiều món phù hợp khác nhau hơn, sau đó xét đánh giá trong danh mục.',
      en ? 'Catalogue prices; shipping and gift packaging are not included.' : 'Giá theo danh mục; chưa gồm phí vận chuyển và hộp quà.'
    ].join('\n');
    return { message, productIds: plan ? plan.items.map(p => p.id) : [], combo: plan, dynamic_chips: en ? ['Adjust budget', 'Other category'] : ['Đổi ngân sách', 'Nhóm hàng khác'] };
  }
  const api = { normalize, budget, analyze, resolve, closest, reply };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AIShopping = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
