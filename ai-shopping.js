(function (root) {
  'use strict';
  const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  function money(value, unit) {
    const number = Number(value.replace(/[.,](?=\d{3}(?:\D|$))/g, '').replace(',', '.'));
    return Math.round(number * (/^(trieu|tr|m)$/.test(unit) ? 1000000 : /^(k|nghin|ngan)$/.test(unit) ? 1000 : 1));
  }
  function budget(text) {
    const query = normalize(text).replace(/(?:moi|tung)\s+(?:mon|san pham|mat hang)[^,;\n]*?(\d+(?:[.,]\d+)*)\s*(?:trieu|tr|m|k|nghin|ngan|vnd|dong|d|₫)(?!\w)/g, ' ');
    const amounts = [...query.matchAll(/(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan|vnd|dong|d|₫)(?!\w)/g)];
    const range = query.match(/(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan)?\s*(?:-|–|den|to)\s*(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan)/);
    if (range) return { minPrice: money(range[1], range[2] || range[4]), maxPrice: money(range[3], range[4]) };
    const amount = amounts[0] || query.match(/(?:ngan sach|toi co|minh co|tai chinh|budget|duoi|toi da|khoang|tam)\s*(\d+(?:[.,]\d+)*)/);
    if (!amount) return {};
    const value = money(amount[1], amount[2] || '');
    return /(?:tren|toi thieu|over|above)\s*\d/.test(query) ? { minPrice: value, maxPrice: null } : { minPrice: null, maxPrice: value };
  }
  function preferences(text) {
    const q = normalize(text);
    const perItem = q.match(/(?:moi|tung)\s+(?:mon|san pham|mat hang).*?(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan|vnd|dong|d|₫)(?!\w)/);
    const premium = /(?:khong|dung)\s+(?:chon\s+)?(?:mon re|hang re)|gia tri (?:trung binh cao|cao)|cao cap|it mon|premium|higher value/.test(q);
    const cheap = /(?:moi|tung)\s+(?:mon|san pham|mat hang).*?(?:re|gia (?:nho|thap)|gia thanh (?:nho|thap))|nhieu mon re|small items|cheap items/.test(q);
    return premium ? { smallItems: false, perItemMax: null } : perItem || cheap ? { smallItems: true, perItemMax: perItem ? money(perItem[1], perItem[2]) : null } : {};
  }
  function itemCount(text) {
    const words = { mot: 1, hai: 2, ba: 3, bon: 4, nam: 5, sau: 6, bay: 7, tam: 8, chin: 9, muoi: 10 };
    const q = normalize(text).replace(/\b(mot|hai|ba|bon|nam|sau|bay|tam|chin|muoi)(?=\s+(?:mon|san pham|loai)\b)/g, word => words[word]);
    if (/bao nhieu mon cung|khong (?:gioi han|can).*?(?:so mon|so luong)|any number/.test(q)) return { minItems: null, maxItems: null };
    const range = q.match(/(\d+)\s*(?:-|–|den|toi|hoac)\s*(\d+)\s*(?:mon|san pham|loai|items|products)\b/);
    if (range) return { minItems: Number(range[1]), maxItems: Number(range[2]) };
    const count = q.match(/(\d+)\s*(?:mon|san pham|loai|items|products)\b/) || q.match(/combo\s*(\d+)\b(?!\s*(?:tr|trieu|k|m)\b)/);
    if (!count) return {};
    const n = Number(count[1]);
    return /toi da|khong qua|at most/.test(q) ? { minItems: 2, maxItems: n } : /it nhat|toi thieu|at least/.test(q) ? { minItems: n, maxItems: null } : { minItems: n, maxItems: n };
  }
  function excludedTerms(text) {
    const q = normalize(text);
    const matches = [...q.matchAll(/(?:khong|dung)\s+(?:(?:lay|chon|them|can|thich|dung)\s+)?(ruou|gom|tra|ca phe|mat ong|banh|keo|yen|gao|sam|hai san)\b/g)];
    return matches.map(match => match[1]);
  }
  function allowed(product, intent) {
    const name = normalize([product.name, product.nameEn, product.category].join(' '));
    return !(intent.excludedTerms || []).some(term => name.includes(term));
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
      isOcopKnowledge: /la gi|nguon goc|tieu chuan|cach |bao nhieu ngay|thoi tiet/.test(q),
      categoryOrKeyword: categories.find(([, pattern]) => pattern.test(q))?.[0] || null,
      exactRegion: products.find(p => q.includes(normalize(p.region)) && p.region)?.region || null,
      minStars: /5\s*sao|5\s*star/.test(q) ? 5 : /4\s*sao|4\s*star/.test(q) ? 4 : null };
  }
  function resolve(messages, products, extract = analyze) {
    let saved = {};
    let current = {};
    for (const message of messages.filter(m => m.role === 'user')) {
      current = { ...extract(message.text, products), ...budget(message.text) };
      // A per-item amount must never overwrite the total shopping budget.
      if (!Object.keys(budget(message.text)).length && preferences(message.text).perItemMax) { current.minPrice = null; current.maxPrice = null; }
      current.categoryOrKeyword ||= analyze(message.text, products).categoryOrKeyword;
      const q = normalize(message.text);
      const followup = /^(?:\d|toi co|minh co|ngan sach|tai chinh|budget|duoi|tam|khoang|doi|con|chi|them|combo|bo qua|gio qua|set qua|gift set|bundle|moi mon|tung mon|gia tri|cao cap|khong chon|dung chon)/.test(q) || (!current.categoryOrKeyword && !current.exactRegion && q.length < 45) || Object.keys(budget(message.text)).length > 0 || Object.keys(itemCount(message.text)).length > 0;
      if ((!followup && !excludedTerms(message.text).length) || /bat dau lai|yeu cau moi|start over/.test(q)) saved = {};
      if (current.exactRegion || current.regionKeyword) {
        delete saved.exactRegion;
        delete saved.regionKeyword;
        if (current.exactRegion) saved.exactRegion = current.exactRegion;
        if (current.regionKeyword) saved.regionKeyword = current.regionKeyword;
      }
      for (const key of ['categoryOrKeyword', 'minStars']) {
        if (current[key]) {
          saved[key] = current[key];
        }
      }
      if (current.maxPrice != null || current.minPrice != null) { saved.maxPrice = current.maxPrice ?? null; saved.minPrice = current.minPrice ?? null; }
      if (current.isCombo) saved.isCombo = true;
      if (current.isGift) saved.isGift = true;
      Object.assign(saved, preferences(message.text));
      Object.assign(saved, itemCount(message.text));
      const exclusions = excludedTerms(message.text);
      if (exclusions.length) {
        saved.excludedTerms = [...new Set([...(saved.excludedTerms || []), ...exclusions])];
        if (exclusions.includes(normalize(current.categoryOrKeyword))) { current.categoryOrKeyword = null; delete saved.categoryOrKeyword; }
      }
      if (/bo (?:gioi han|dieu kien) loai tru|khong loai tru|include everything/.test(q)) saved.excludedTerms = [];
      if (/khong (?:gioi han|can).*?(?:tinh|vung)|bat ky tinh|all regions/.test(q)) { delete saved.exactRegion; delete saved.regionKeyword; current.exactRegion = null; current.regionKeyword = null; }
      if (/khong (?:gioi han|can).*?(?:loai|nhom)|loai nao cung|any category/.test(q)) { delete saved.categoryOrKeyword; current.categoryOrKeyword = null; }
    }
    return { ...current, ...saved, rawText: messages.filter(m => m.role === 'user').at(-1)?.text || '' };
  }
  // Exact subset-sum: no item-count cap, one unit per catalogue item.
  // Each card represents one unit, so cart contents and quoted totals agree.
  function closest(products, intent) {
    const ceiling = intent.maxPrice;
    if (!Number.isSafeInteger(ceiling) || ceiling <= 0) return null;
    const minItems = intent.minItems ?? 2;
    const maxItems = intent.maxItems ?? products.length;
    if (!Number.isInteger(minItems) || minItems < 1 || !Number.isInteger(maxItems) || maxItems < minItems) return null;
    const affordable = products.filter(p => allowed(p, intent) && Number.isSafeInteger(p.price) && p.price > 0 && p.price <= ceiling && (!intent.perItemMax || p.price <= intent.perItemMax)).sort((a, b) => a.price - b.price || a.id - b.id);
    if (affordable.length < minItems) return null;
    // Aim for substantial items at this budget; adapt for a narrowly filtered catalogue.
    const itemFloor = intent.smallItems || intent.relaxItemFloor ? 0 : Math.min(Math.ceil(ceiling / Math.max(8, minItems * 2)), affordable.at(-minItems).price);
    const candidates = affordable.filter(p => p.price >= itemFloor);
    const states = new Map([[0, { empty: { count: 0, quality: 0, previous: null } }]]);
    for (const product of candidates) {
      // Snapshot prevents buying the same item again in this iteration.
      const snapshot = [...states].flatMap(([total, choices]) => Object.values(choices).map(previous => [total, previous]));
      for (const [total, previous] of snapshot) {
        const nextTotal = total + product.price;
        if (nextTotal > ceiling) continue;
        const count = previous.count + 1;
        if (count > maxItems) continue;
        const quality = previous.quality + (Number.isFinite(product.rating) ? product.rating : 0);
        const key = intent.minItems != null || intent.maxItems != null ? String(count) : count === 1 ? 'single' : 'combo';
        const choices = states.get(nextTotal) || {};
        const existing = choices[key];
        const preferredCount = existing && (intent.smallItems ? count > existing.count : count < existing.count);
        if (!existing || preferredCount || (count === existing.count && quality > existing.quality)) {
          states.set(nextTotal, { ...choices, [key]: { product, previous, count, quality } });
        }
      }
    }
    let total = 0;
    let best = null;
    for (const [sum, choices] of states) {
      for (const state of Object.values(choices)) {
        if (state.count < minItems || state.count > maxItems || sum < (intent.minPrice || 0)) continue;
        const preferredCount = best && (intent.smallItems ? state.count > best.count : state.count < best.count);
        if (sum > total || (sum === total && (!best || preferredCount || (state.count === best.count && state.quality > best.quality)))) { total = sum; best = state; }
      }
    }
    if (!best && itemFloor > 0 && (intent.minItems != null || intent.maxItems != null)) return closest(products, { ...intent, relaxItemFloor: true });
    if (!best) return null;
    const items = [];
    for (let state = best; state.product; state = state.previous) items.push(state.product);
    items.reverse();
    return { items, total, budget: ceiling, remaining: ceiling - total, averagePrice: Math.round(total / items.length), itemFloor, smallItems: Boolean(intent.smallItems) };
  }
  function reply(plan, intent, language) {
    const en = language === 'en';
    const format = value => value.toLocaleString('vi-VN') + ' ₫';
    const requestedCount = intent.minItems === intent.maxItems && intent.minItems ? ` ${intent.minItems}` : intent.minItems ? ` ${intent.minItems}–${intent.maxItems || '+'}` : '';
    const message = !plan ? (en ? `I could not find a${requestedCount}-item set meeting your budget and preferences. Would you like to adjust the item count, budget, or category?` : `Mình chưa tìm được combo${requestedCount} món đáp ứng đồng thời ngân sách và yêu cầu hiện tại. Anh/chị muốn điều chỉnh số món, ngân sách hoặc nhóm hàng?`) : [
      en ? `For your ${format(plan.budget)} budget, here is a matching set of ${plan.items.length} different products:` : `Với ngân sách ${format(plan.budget)}${intent.exactRegion ? ', đặc sản ' + intent.exactRegion : ''}${intent.categoryOrKeyword ? ', nhóm ' + intent.categoryOrKeyword : ''}, mình gợi ý combo ${plan.items.length} món phù hợp:`,
      ...plan.items.map(p => `• ${en ? p.nameEn || p.name : p.name} × 1: ${format(p.price)}`),
      `${en ? 'Total' : 'Tổng combo'}: ${format(plan.total)}. ${en ? 'Remaining' : 'Còn lại'}: ${format(plan.remaining)}.`,
      `${en ? 'Average price per item' : 'Giá trung bình mỗi món'}: ${format(plan.averagePrice)}.`,
      plan.smallItems ? (en ? 'Lower-priced items selected as requested.' : 'Ưu tiên món giá nhỏ theo yêu cầu của anh/chị.') : (en ? 'Selected to match your preferences and budget.' : 'Các món được chọn theo nhu cầu và ngân sách của anh/chị.'),
      en ? 'Catalogue prices; shipping and gift packaging are not included.' : 'Giá theo danh mục; chưa gồm phí vận chuyển và hộp quà.'
    ].join('\n');
    return { message, productIds: plan ? plan.items.map(p => p.id) : [], combo: plan, dynamic_chips: en ? ['Adjust budget', 'Other category'] : ['Đổi ngân sách', 'Nhóm hàng khác'] };
  }
  const api = { normalize, budget, analyze, resolve, closest, reply, itemCount, allowed };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AIShopping = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
