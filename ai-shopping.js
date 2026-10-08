(function (root) {
  'use strict';
  const normalize = text => String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').trim();
  function money(value, unit) {
    const number = Number(value.replace(/[.,](?=\d{3}(?:\D|$))/g, '').replace(',', '.'));
    return Math.round(number * (/^(trieu|tr|m)$/.test(unit) ? 1000000 : /^(k|nghin|ngan)$/.test(unit) ? 1000 : 1));
  }
  function budget(text) {
    const query = normalize(text).replace(/(?:moi|tung)\s+(?:mon|san pham|mat hang)[^,;\n]*?(\d+(?:[.,]\d+)*)\s*(?:trieu|tr|m|k|nghin|ngan|vnd|dong|d|₫)(?!\w)/g, ' ');
    const amounts = [...query.matchAll(/(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan|vnd|dong|d|₫)(?!\w)/g)];
    const range = query.match(/(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan)?\s*(?:-|–|den|to)\s*(\d+(?:[.,]\d+)*)\s*(trieu|tr|m|k|nghin|ngan)(?!\w)/);
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
    const high = /gia tri cao|gia (?:thanh )?cao|dat (?:tien|nhat|hon)|cao cap|premium|high(?:er)?[- ](?:value|price)|expensive/.test(q);
    const low = /gia (?:thanh )?(?:thap|re)|gia re|re (?:nhat|hon)|mon re|hang re|tiet kiem|cheap|affordable|low(?:er)?[- ]price/.test(q);
    const negatedHigh = /(?:khong|dung|ko)\s+(?:(?:can|chon|muon|lay)\s+)?(?:mon\s+)?(?:gia cao|dat|cao cap)/.test(q);
    const preference = negatedHigh ? {pricePreference:'low'} : premium || high ? {pricePreference:'high'} : low ? {pricePreference:'low'} : {};
    return (premium || high) && !negatedHigh ? { ...preference, smallItems: false, perItemMax: null } : perItem || cheap ? { ...preference, smallItems: true, perItemMax: perItem ? money(perItem[1], perItem[2]) : null } : preference;
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
    const exclusions = [];
    if (/\b(?:an chay|do chay|thuan chay|chay|vegan|vegetarian)\b/.test(q)) {
      exclusions.push('thit', 'trau', 'hai san', 'cua', 'tom', 'cha muc', 'nuoc mam');
    }
    const matches = [...q.matchAll(/\b(?:khong|dung|bo|tru)\s+(?:(?:lay|chon|them|can|thich|dung|mon)\s+)?(ruou|gom|tra|ca phe|mat ong|banh|keo|yen|gao|sam|hai san|thit|cua|tom)\b/g)];
    for (const match of matches) exclusions.push(match[1]);
    return [...new Set(exclusions)];
  }
  function allowed(product, intent) {
    const name = normalize([product.name, product.nameEn, product.category, product.desc, product.description, product.tag].join(' '));
    const excluded = intent.excludedTerms || [];
    if (!excluded.length) return true;
    const padded = ' ' + name + ' ';
    return !excluded.some(term => {
      const rx = new RegExp('(?:^|[^a-z0-9])' + term + '(?:[^a-z0-9]|$)', 'i');
      return rx.test(padded);
    });
  }
  const regions = {
    'Tây Nguyên': ['gia lai', 'dak lak', 'dak nong', 'lam dong', 'kon tum'],
    'Tây Bắc': ['ha giang', 'lao cai', 'son la', 'dien bien', 'lai chau', 'yen bai', 'hoa binh'],
    'Miền Tây': ['kien giang', 'ben tre', 'ca mau', 'an giang', 'long an', 'soc trang', 'hau giang', 'can tho', 'dong thap', 'bac lieu', 'tra vinh', 'vinh long', 'tien giang'],
    'Miền Trung': ['quang nam', 'quang ngai', 'thua thien hue', 'hue', 'quang tri', 'da nang', 'binh dinh', 'phu yen', 'khanh hoa', 'ninh thuan', 'nghe an', 'ha tinh', 'quang binh', 'thanh hoa'],
    'Miền Bắc': ['ha noi', 'ha giang', 'thai nguyen', 'quang ninh', 'lao cai', 'nam dinh', 'bac giang', 'hung yen', 'yen bai', 'tuyen quang', 'vinh phuc', 'ninh binh', 'bac kan', 'cao bang', 'lang son', 'phu tho', 'son la', 'dien bien', 'lai chau', 'hoa binh', 'ha nam', 'hai duong', 'hai phong', 'thai binh']
  };
  regions['Miền Nam'] = ['binh phuoc','binh duong','dong nai','tay ninh','ba ria vung tau','ho chi minh',...regions['Miền Tây']];
  regions['Miền Bắc'].push('bac ninh');
  regions['Miền Trung'].push('binh thuan');
  function regionMatches(product, intent) {
    const key = value => normalize(value).replace(/[^a-z0-9]/g, '').replace(/^(thanhpho|tp)/, '');
    const province = key(product.region);
    if (intent.isAllProvinces) return true;
    if (intent.exactRegions?.length) return intent.exactRegions.some(region => province === key(region));
    if (intent.exactRegion) return province === key(intent.exactRegion);
    if (intent.regionKeyword === 'Miền Nam' && product.macroRegion) return product.macroRegion === 'nam';
    return !intent.regionKeyword || (regions[intent.regionKeyword] || []).some(value => key(value) === province);
  }
  function analyze(text, products) {
    const q = normalize(text);
    const productQuery = q
      .replace(/\btoi\s+(?=muon|can|co|tim|mua|chon|thich|dang|se|duoc|xin|hoi|lay|da\b|thieu\b|uu\b)/g,' ')
      .replace(/\b(?:cho|giup|voi|cua)\s+toi\b/g,' ');
    const categories = [['trà', /\b(tra|che|tea)\b/], ['cà phê', /ca phe|coffee/], ['mật ong', /mat ong|honey/], ['bánh', /banh|keo|snack/], ['yến', /yen sao|to yen/], ['gạo', /gao|rice/], ['sâm', /\b(sam|ginseng)\b/], ['tỏi', /\b(toi|garlic)\b/], ['nước mắm', /nuoc mam|fish sauce/], ['hạt', /hat dieu|hat mac ca|mac ca|cashew|macadamia/]];
    const isAllProvinces = /(tat ca|tat ca cac tinh|tat ca tinh|toan quoc|63 tinh|xuyen viet|bac trung nam|3 mien|ba mien|lien tinh|nhieu tinh|cac tinh thanh|gom tinh|gom cac tinh|gom het)/.test(q);
    const allProvinces = [...new Set(products.map(p => p.region).filter(Boolean))].sort((a, b) => b.length - a.length);
    const exactRegions = allProvinces.filter(r => {
      const nr = normalize(r);
      return nr.length >= 3 && q.includes(nr);
    });
    const exactRegion = exactRegions[0] || null;
    return { ...budget(text), ...preferences(text), rawText: text,
      isCombo: /combo|bo qua|gio qua|set qua|gift set|bundle/.test(q),
      isGift: /qua|bieu|tang|gift/.test(q),
      isComplaint: /doi tra|hang loi|hoan tien|khieu nai/.test(q),
      isCSKH: /cskh|hotline|lien he|admin/.test(q),
      isShipping: /phi ship|giao hang|van chuyen/.test(q),
      isUsage: /cach pha|cach dung|bao quan/.test(q),
      isOcopKnowledge: /la gi|nguon goc|tieu chuan|cach |bao nhieu ngay|thoi tiet/.test(q),
      isAllProvinces,
      exactRegions,
      exactRegion,
      categoryOrKeyword: categories.find(([, pattern]) => pattern.test(productQuery))?.[0] || null,
      regionKeyword: Object.keys(regions).find(region => q.includes(normalize(region))) || null,
      minStars: /5\s*sao|5\s*star/.test(q) ? 5 : /4\s*sao|4\s*star/.test(q) ? 4 : null };
  }
  function resolve(messages, products, extract = analyze) {
    let saved = {};
    let current = {};
    for (const message of messages.filter(m => m.role === 'user')) {
      current = { ...extract(message.text, products), ...budget(message.text) };
      current.regionKeyword ||= analyze(message.text, products).regionKeyword;
      // A per-item amount must never overwrite the total shopping budget.
      if (!Object.keys(budget(message.text)).length && preferences(message.text).perItemMax) { current.minPrice = null; current.maxPrice = null; }
      current.categoryOrKeyword ||= analyze(message.text, products).categoryOrKeyword;
      const q = normalize(message.text);
      const followup = /^(?:\d|toi co|minh co|ngan sach|tai chinh|budget|duoi|tam|khoang|doi|con|chi|them|combo|bo qua|gio qua|set qua|gift set|bundle|moi mon|tung mon|gia tri|cao cap|khong chon|dung chon)/.test(q) || (!current.categoryOrKeyword && !current.exactRegion && !(current.exactRegions && current.exactRegions.length) && !current.isAllProvinces && q.length < 45) || Object.keys(budget(message.text)).length > 0 || Object.keys(itemCount(message.text)).length > 0;
      if ((!followup && !excludedTerms(message.text).length) || /bat dau lai|yeu cau moi|start over/.test(q)) saved = {};
      if (current.isAllProvinces) {
        saved.isAllProvinces = true;
        delete saved.exactRegion;
        delete saved.exactRegions;
        delete saved.regionKeyword;
      } else if (current.exactRegions && current.exactRegions.length > 0) {
        saved.exactRegions = current.exactRegions;
        saved.exactRegion = current.exactRegion;
        delete saved.regionKeyword;
        delete saved.isAllProvinces;
      } else if (current.exactRegion || current.regionKeyword) {
        delete saved.exactRegion;
        delete saved.exactRegions;
        delete saved.regionKeyword;
        delete saved.isAllProvinces;
        if (current.exactRegion) {
          saved.exactRegion = current.exactRegion;
          saved.exactRegions = [current.exactRegion];
        }
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
      if (/khong (?:gioi han|can).*?(?:tinh|vung)|bat ky tinh|all regions/.test(q)) {
        delete saved.exactRegion;
        delete saved.exactRegions;
        delete saved.isAllProvinces;
        delete saved.regionKeyword;
        current.exactRegion = null;
        current.exactRegions = [];
        current.isAllProvinces = false;
        current.regionKeyword = null;
      }
      if (/khong (?:gioi han|can).*?(?:loai|nhom)|loai nao cung|any category/.test(q)) { delete saved.categoryOrKeyword; current.categoryOrKeyword = null; }
    }
    return { ...current, ...saved, rawText: messages.filter(m => m.role === 'user').at(-1)?.text || '' };
  }
  // Exact subset-sum: no item-count cap, one unit per catalogue item.
  function recommendations(products, intent, limit = 3) {
    const keyword = normalize(intent.categoryOrKeyword);
    return products.filter(p => Number.isFinite(p.price) && p.price > 0 && regionMatches(p, intent) && allowed(p, intent)
      && (intent.maxPrice == null || p.price <= intent.maxPrice)
      && (intent.minPrice == null || p.price >= intent.minPrice)
      && (intent.minStars == null || p.stars >= intent.minStars)
      && (!keyword || normalize([p.name,p.nameEn,p.category,p.desc,p.description].join(' ')).includes(keyword)))
      .sort((a,b) => (intent.pricePreference === 'high' ? b.price-a.price : intent.pricePreference === 'low' ? a.price-b.price : 0)
        || (b.stars || 0)-(a.stars || 0) || a.id-b.id).slice(0,limit);
  }
  function recommendationReply(products, intent, language = 'vi') {
    const items = recommendations(products, intent), en = language === 'en';
    const heading = intent.pricePreference === 'high'
      ? (en ? 'You are looking for higher-priced products. These have the highest listed prices among products meeting your requirements:' : 'Bạn đang tìm món có giá trị cao. Mình ưu tiên những sản phẩm có giá niêm yết cao trong nhóm phù hợp yêu cầu của bạn:')
      : (en ? 'These are the lowest-priced products meeting your requirements:' : 'Mình ưu tiên những sản phẩm có giá niêm yết thấp trong nhóm phù hợp yêu cầu của bạn:');
    const message = items.length ? [heading,...items.map(p => `• ${en ? p.nameEn || p.name : p.name}: ${p.price.toLocaleString('vi-VN')} ₫${p.packaging ? ' / '+(en ? p.packagingEn || p.packaging : p.packaging) : ''}`),
      en ? 'Prices are per listed selling unit. Which budget or product type would you like to narrow this down to?' : 'Giá theo quy cách bán của từng món. Bạn muốn giới hạn ngân sách hoặc ưu tiên loại sản phẩm nào?'].join('\n')
      : (en ? 'No product meets all your requirements. Would you like to change the budget, province or product type?' : 'Chưa có sản phẩm đáp ứng đồng thời các yêu cầu. Bạn muốn điều chỉnh ngân sách, tỉnh hoặc loại sản phẩm nào?');
    return {message,text_response:message,productIds:items.map(p=>p.id),suggested_products:items.map(p=>p.id),dynamic_chips:en?['Set budget','Choose product type']:['Chọn ngân sách','Chọn loại sản phẩm'],handoffAdmin:false,responseMode:'verified_catalog_price_preference'};
  }
  // Each card represents one unit, so cart contents and quoted totals agree.
  function closest(products, intent) {
    const ceiling = intent.maxPrice;
    if (!Number.isSafeInteger(ceiling) || ceiling <= 0) return null;
    const minItems = intent.minItems ?? 2;
    const maxItems = intent.maxItems ?? products.length;
    if (!Number.isInteger(minItems) || minItems < 1 || !Number.isInteger(maxItems) || maxItems < minItems) return null;
    const affordable = products.filter(p => regionMatches(p, intent) && allowed(p, intent) && Number.isSafeInteger(p.price) && p.price > 0 && p.price <= ceiling && (!intent.perItemMax || p.price <= intent.perItemMax)).sort((a, b) => a.price - b.price || a.id - b.id);
    if (affordable.length < minItems) return null;
    // Aim for substantial items at this budget; adapt for a narrowly filtered catalogue.
    const itemFloor = intent.smallItems || intent.relaxItemFloor ? 0 : Math.min(Math.ceil(ceiling / Math.max(8, minItems * 2)), affordable.at(-minItems).price);
    const candidates = affordable.filter(p => p.price >= itemFloor);
    const states = new Map([[0, { empty: { count: 0, quality: 0, previous: null, regions: new Set() } }]]);
    for (const product of candidates) {
      // Snapshot prevents buying the same item again in this iteration.
      const snapshot = [...states].flatMap(([total, choices]) => Object.values(choices).map(previous => [total, previous]));
      for (const [total, previous] of snapshot) {
        const nextTotal = total + product.price;
        if (nextTotal > ceiling) continue;
        const count = previous.count + 1;
        if (count > maxItems) continue;
        const prevRegions = previous.regions || new Set();
        const regionBonus = intent.exactRegions && intent.exactRegions.length > 1 && product.region && !prevRegions.has(product.region) ? 200 : 0;
        const quality = previous.quality + (Number.isFinite(product.rating) ? product.rating : 0) + regionBonus;
        const regions = new Set([...prevRegions, product.region]);
        const key = intent.minItems != null || intent.maxItems != null ? String(count) : count === 1 ? 'single' : 'combo';
        const choices = states.get(nextTotal) || {};
        const existing = choices[key];
        const preferredCount = existing && (intent.smallItems || intent.preferVariety ? count > existing.count : count < existing.count);
        if (!existing || preferredCount || (count === existing.count && quality > existing.quality)) {
          states.set(nextTotal, { ...choices, [key]: { product, previous, count, quality, regions } });
        }
      }
    }
    let total = 0;
    let best = null;
    for (const [sum, choices] of states) {
      for (const state of Object.values(choices)) {
        if (state.count < minItems || state.count > maxItems || sum < (intent.minPrice || 0)) continue;
        const preferredCount = best && (intent.smallItems || intent.preferVariety ? state.count > best.count : state.count < best.count);
        if (sum > total || (sum === total && (!best || preferredCount || (state.count === best.count && state.quality > best.quality)))) { total = sum; best = state; }
      }
    }
    if (!best && itemFloor > 0 && (intent.minItems != null || intent.maxItems != null)) return closest(products, { ...intent, relaxItemFloor: true });
    if (!best) return null;
    const items = [];
    for (let state = best; state.product; state = state.previous) items.push(state.product);
    items.reverse();
    // A supporting lower-priced item can complete a valuable regional set.
    // Keep its average price substantial without imposing an item-count cap.
    if (itemFloor > 0 && total < ceiling) {
      const alternative = closest(products, { ...intent, relaxItemFloor: true });
      if (alternative && alternative.total > total && alternative.averagePrice >= itemFloor) return alternative;
    }
    return { items, total, budget: ceiling, remaining: ceiling - total, averagePrice: Math.round(total / items.length), itemFloor, smallItems: Boolean(intent.smallItems) };
  }
  function reply(plan, intent, language) {
    const en = language === 'en';
    const format = value => value.toLocaleString('vi-VN') + ' ₫';
    const requestedCount = intent.minItems === intent.maxItems && intent.minItems ? ` ${intent.minItems}` : intent.minItems ? ` ${intent.minItems}–${intent.maxItems || '+'}` : '';
    const regionLabel = intent.isAllProvinces
      ? (en ? ', nationwide 63 provinces' : ', tinh hoa 63 tỉnh thành')
      : (intent.exactRegions && intent.exactRegions.length > 1
          ? (en ? `, specialties of ${intent.exactRegions.join(' & ')}` : `, đặc sản liên tỉnh ${intent.exactRegions.join(' & ')}`)
          : (intent.exactRegion || intent.regionKeyword ? `, đặc sản ${intent.exactRegion || intent.regionKeyword}` : ''));
    const message = !plan ? (en ? `I could not find a${requestedCount}-item set meeting your budget and preferences. Would you like to adjust the item count, budget, or category?` : `Mình chưa tìm được combo${requestedCount} món đáp ứng đồng thời ngân sách và yêu cầu hiện tại. Anh/chị muốn điều chỉnh số món, ngân sách hoặc nhóm hàng?`) : [
      en ? `For your ${format(plan.budget)} budget${regionLabel}, here is a matching set of ${plan.items.length} different products:` : `Với ngân sách ${format(plan.budget)}${regionLabel}${intent.categoryOrKeyword ? ', nhóm ' + intent.categoryOrKeyword : ''}, mình gợi ý combo ${plan.items.length} món phù hợp:`,
      ...plan.items.map(p => `• ${en ? p.nameEn || p.name : p.name} × 1${p.packaging ? ' (' + (en ? p.packagingEn || p.packaging : p.packaging) + ')' : ''}: ${format(p.price)}`),
      `${en ? 'Total' : 'Tổng combo'}: ${format(plan.total)}. ${en ? 'Remaining' : 'Còn lại'}: ${format(plan.remaining)}.`,
      `${en ? 'Average price per item' : 'Giá trung bình mỗi món'}: ${format(plan.averagePrice)}.`,
      plan.smallItems ? (en ? 'Lower-priced items selected as requested.' : 'Ưu tiên món giá nhỏ theo yêu cầu của anh/chị.') : (en ? 'Selected to match your preferences and budget.' : 'Các món được chọn theo nhu cầu và ngân sách của anh/chị.'),
      plan.items.some(p => p.priceIsReference) ? (en ? 'Reference total uses the listed product prices; confirm the actual price and packaging before ordering. Shipping and gift boxes are extra.' : 'Tổng tham khảo tính theo giá niêm yết của từng sản phẩm; cần xác nhận giá và quy cách khi đặt hàng. Chưa gồm vận chuyển và hộp quà.') : (en ? 'Catalogue prices; shipping and gift packaging are not included.' : 'Giá theo danh mục; chưa gồm phí vận chuyển và hộp quà.')
    ].join('\n');
    return { message, productIds: plan ? plan.items.map(p => p.id) : [], combo: plan, dynamic_chips: en ? ['Adjust budget', 'Other category'] : ['Đổi ngân sách', 'Nhóm hàng khác'] };
  }
  function variants(products, intent, count = 3, random = Math.random) {
    const plans = [], seen = new Set();
    for (let attempt = 0; attempt < 12 && plans.length < count; attempt++) {
      const previous = plans.length ? plans[Math.floor(random() * plans.length)] : null;
      const blocked = previous ? previous.items[Math.floor(random() * previous.items.length)].id : null;
      // Shuffle before remapping IDs to break equal-price ties without changing catalogue IDs.
      const shuffled = products.filter(p => p.id !== blocked).map(p => ({p, rank:random()})).sort((a,b)=>a.rank-b.rank);
      const lookup = new Map(shuffled.map(({p},index)=>[index+1,p]));
      const plan = closest(shuffled.map(({p},index)=>({...p,id:index+1})),{...intent,preferVariety:true});
      if (!plan) continue;
      plan.items = plan.items.map(p=>lookup.get(p.id));
      const key = plan.items.map(p=>p.id).sort((a,b)=>a-b).join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      plans.push(plan);
    }
    return plans;
  }
  function replyOptions(plans, intent, language) {
    if (!plans.length) return {...reply(null,intent,language),combos:[]};
    const en = language === 'en', money = n=>n.toLocaleString('vi-VN')+' ₫';
    const message = [
      en ? `Here are ${plans.length} different combinations within your ${money(intent.maxPrice)} budget:` : `Mình gợi ý ${plans.length} combo khác nhau, mỗi combo không vượt ngân sách ${money(intent.maxPrice)}:`,
      ...plans.map((plan,index)=>`${en?'Option':'Combo'} ${index+1}: ${plan.items.length} ${en?'items':'món'} · ${money(plan.total)} · ${en?'Remaining':'Còn lại'} ${money(plan.remaining)}.`),
      en ? 'Choose one option below. Catalogue prices exclude shipping and gift packaging.' : 'Anh/chị chọn một combo bên dưới nhé. Giá danh mục chưa gồm vận chuyển và hộp quà.'
    ].join('\n');
    return {message,combos:plans,combo:plans[0],productIds:[...new Set(plans.flatMap(plan=>plan.items.map(p=>p.id)))],dynamic_chips:en?['Other combinations','Adjust budget']:['Combo khác','Đổi ngân sách']};
  }
  const api = { normalize, budget, analyze, resolve, closest, reply, variants, replyOptions, itemCount, allowed, regionMatches, preferences, recommendations, recommendationReply };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AIShopping = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
