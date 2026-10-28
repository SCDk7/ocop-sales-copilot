'use strict';
const shopping = require('./ai-shopping');
const {trainedProductReply} = require('./product-training');
const {resolveProductConsultation} = require('./product-consultant');
const {regionalAdviceMessage} = require('./product-locations');
function isWikipediaURL(value) {
  try {
    const url=new URL(value);
    return url.protocol==='https:' && !url.username && !url.password && !url.port && ['vi.wikipedia.org','en.wikipedia.org'].includes(url.hostname)
      && (url.pathname.startsWith('/wiki/') || url.pathname==='/' && /^\d+$/.test(url.searchParams.get('curid') || ''));
  } catch { return false; }
}

function composeDataReply(products, intent, language, wikiSources = [], intentProvider = null) {
  const en = language === 'en';
  const normQ = shopping.normalize(intent.knowledgeQuery || intent.rawText || '');
  const isGeneralShowroom = (/(?:mang luoi|he thong|danh sach|tra cuu)\s+(?:cac\s+)?(?:showroom|diem ban|cua hang)\b|(?:showroom|diem ban|store|store location)\s*(?:network|o2o|he thong|mang luoi)\b|(?:network|list of)\s+(?:showrooms?|stores?)|(?:showroom|diem ban)\s+o2o|o2o\s+(?:showroom|diem ban|store)|(?:ban do so|digital map).*(?:showroom|diem ban|store)|(?:showroom|diem ban|store).*(?:ban do so|digital map)/i.test(normQ) || (/diem ban|showroom/i.test(normQ) && /toan quoc|tat ca|he thong|chinh hang|ban do|nationwide|all stores/i.test(normQ))) && !/(?:san pham nay|mon nay|hang nay|this product|this item)/i.test(normQ);
  if (isGeneralShowroom) {
    intent.isStoreLookup = true;
    intent.categoryOrKeyword = null;
    intent.maxPrice = null;
    intent.minPrice = null;
    intent.isCombo = false;
    intent.isGift = false;
  }
  let reply;
  const trainedReply = trainedProductReply(products, intent, language);
  if (intent.requiredClarification) reply = {message:intent.requiredClarification, productIds:[], understandingStatus:'needs_clarification'};
  else if (intent.verifiedReviewMessage) reply = {message:intent.verifiedReviewMessage, productIds:intent.verifiedReviewProductIds || []};
  else if (intent.isComplaint || intent.isCSKH) reply = {message:en ? 'Please describe your request and provide your order number if available. You can contact our support team using the button below.' : 'Anh/chị mô tả yêu cầu và cung cấp mã đơn nếu có nhé. Anh/chị có thể liên hệ nhân viên qua nút bên dưới.',productIds:[],handoffAdmin:true};
  else if (intent.isVoucher) reply = {
    message: en
      ? 'Currently, OCOP Vietnam offers several active discount vouchers for you:\n\n• **OCOP2026**: 50,000₫ OFF on all orders (2026 Appreciation code).\n• **FREESHIP**: Free shipping nationwide (-25,000₫).\n• **GIAM20K**: 20,000₫ OFF directly on your order.\n• **GIAM100K**: 100,000₫ OFF for orders from 500,000₫.\n• **COMBOVIP**: 100,000₫ OFF + OCOP Gift Box for combo orders from 899,000₫.\n\n👉 How to use: Enter the code in the "Voucher Code" box at checkout or click "Copy Code" on the homepage banner to apply instantly!'
      : 'Dạ, hiện tại hệ thống OCOP Việt Nam đang có các mã giảm giá và voucher ưu đãi cực tốt dành cho anh/chị đây ạ:\n\n• **OCOP2026**: Giảm ngay **50.000 đ** cho mọi đơn hàng (Mã tri ân OCOP 2026).\n• **FREESHIP**: Miễn phí vận chuyển toàn quốc (**-25.000 đ** phí ship).\n• **GIAM20K**: Giảm **20.000 đ** trực tiếp vào đơn hàng.\n• **GIAM100K**: Giảm ngay **100.000 đ** cho đơn hàng từ 500.000 đ trở lên.\n• **COMBOVIP**: Giảm **100.000 đ + Tặng Hộp quà OCOP** cho đơn combo từ 899.000 đ.\n\n👉 **Cách áp dụng:** Khi thanh toán giỏ hàng, anh/chị chỉ cần nhập mã vào ô **"Mã voucher"** hoặc bấm **"Lưu mã"** tại banner Ưu Đãi trên trang chủ để được giảm giá trực tiếp nhé!',
    productIds: [],
    dynamic_chips: ['Áp dụng OCOP2026', 'Áp dụng FREESHIP', 'Xem giỏ hàng']
  };
  else if (intent.isOrderGuide) reply = {message:en ? 'To place an order on OCOP Vietnam, you can easily follow these 3 simple steps:\n\n1. Select products: Browse the 63-province catalogue or ask AI for a combo within your budget.\n2. Add to Cart: Click "Add to Cart" or "Buy Now" on your selected specialty items.\n3. Complete Order: Open the Cart icon (top right), enter recipient info (Name, Phone, Address), and choose payment method (COD or Bank Transfer).\n\nWhich regional specialty or province are you interested in so I can help you choose?' : 'Dạ, để đặt hàng đặc sản OCOP chính hãng, anh/chị có thể thực hiện theo 3 bước rất đơn giản:\n\n1. Chọn sản phẩm: Xem danh mục 63 tỉnh thành hoặc nhắn cho em ngân sách/nhu cầu để em gợi ý món ngon hoặc combo phù hợp.\n2. Thêm vào giỏ: Bấm "Thêm vào giỏ" hoặc "Mua ngay" tại sản phẩm anh/chị yêu thích.\n3. Xác nhận đơn: Bấm biểu tượng Giỏ hàng ở góc phải trên cùng, điền thông tin người nhận (Họ tên, SĐT, Địa chỉ) và chọn hình thức thanh toán (COD hoặc chuyển khoản) là hoàn tất.\n\nAnh/chị đang muốn đặt đặc sản vùng miền nào để em hỗ trợ tư vấn ngay nhé!',productIds:[]};
  else if (intent.isShipping) reply = {message:en ? 'Please provide your delivery location and the items you wish to order so staff can confirm the shipping fee and delivery time.' : 'Anh/chị cho biết địa chỉ nhận hàng và món muốn đặt để nhân viên xác nhận phí vận chuyển và thời gian giao nhé.',productIds:[]};
  else if (intent.isStoreLookup && !intent.exactRegion && !intent.regionKeyword && !intent.categoryOrKeyword) reply = {message:en ? '📍 OCOP Vietnam Flagship Showrooms & O2O Stores:\n\n• [National OCOP Trade Promotion Center (Hanoi)](https://www.google.com/maps/search/?api=1&query=489+Hoang+Quoc+Viet+Cau+Giay+Hanoi) — 489 Hoang Quoc Viet, Cau Giay, Hanoi (Hotline: 024.3755.8899 | 08:00 - 21:30)\n• [Big C Thang Long OCOP Center (Hanoi)](https://www.google.com/maps/search/?api=1&query=222+Tran+Duy+Hung+Cau+Giay+Hanoi) — 222 Tran Duy Hung, Cau Giay, Hanoi (Hotline: 024.3784.8888)\n• [Regional OCOP Showroom (HCMC)](https://www.google.com/maps/search/?api=1&query=459+Chu+Van+An+Binh+Thanh+HCMC) — 459 Chu Van An, Ward 12, Binh Thanh, HCMC (Hotline: 028.3899.6677 | 08:00 - 21:00)\n• [Central & Highlands OCOP Hub (Da Nang)](https://www.google.com/maps/search/?api=1&query=08+Cach+Mang+Thang+Tam+Cam+Le+Da+Nang) — 08 Cach Mang Thang Tam, Cam Le, Da Nang (Hotline: 0236.388.9911)\n\n💡 How to explore on our platform:\n1. Select any province on the "63-Province Digital Map" on the home page to view local showrooms & stores.\n2. Click the "📍 Điểm Bán" button on any product card for cooperative details, hotline, and Google Maps directions!' : '📍 Mạng lưới Showroom & Điểm bán O2O OCOP chính hãng:\n\n• [Trung tâm XTTM & Trưng bày OCOP Quốc Gia (Hà Nội)](https://www.google.com/maps/search/?api=1&query=Trung+t%C3%A2m+X%C3%BAc+ti%E1%BA%BFn+Th%C6%B0%C6%A1ng+m%E1%BA%A1i+OCOP+Qu%E1%BB%91c+Gia+489+Ho%C3%A0ng+Qu%E1%BB%91c+Vi%E1%BB%87t) — Số 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội (Hotline: 024.3755.8899 | Giờ mở cửa: 08:00 - 21:30)\n• [Điểm Giới thiệu & Bán SP OCOP Big C Thăng Long (Hà Nội)](https://www.google.com/maps/search/?api=1&query=Big+C+Th%C4%83ng+Long+222+Tr%E1%BA%A7n+Duy+H%C6%B0ng) — Tầng 1, TTTM Big C Thăng Long, 222 Trần Duy Hưng, Cầu Giấy, Hà Nội (Hotline: 024.3784.8888)\n• [Trung tâm Trưng bày & Phân phối OCOP Vùng Miền (TP.HCM)](https://www.google.com/maps/search/?api=1&query=459+Chu+V%C4%83n+An+B%C3%ACnh+Th%E1%BA%A1nh+TP+HCM) — Số 459 Chu Văn An, Phường 12, Quận Bình Thạnh, TP.HCM (Hotline: 028.3899.6677 | Giờ mở cửa: 08:00 - 21:00)\n• [Điểm Bán & Quảng bá OCOP Miền Trung - Tây Nguyên (Đà Nẵng)](https://www.google.com/maps/search/?api=1&query=08+C%C3%A1ch+M%E1%BA%A1ng+Th%C3%A1ng+T%C3%A1m+C%E1%BA%A9m+L%E1%BB%87+%C4%90%C3%A0+N%E1%BA%B5ng) — Số 08 Cách Mạng Tháng Tám, Quận Cẩm Lệ, TP. Đà Nẵng (Hotline: 0236.388.9911)\n\n💡 Cách tra cứu trên hệ thống:\n1. Chọn tỉnh thành trên "Bản Đồ Số 63 Tỉnh Thành" ngay trang chủ để xem danh sách điểm bán OCOP của từng tỉnh.\n2. Bấm nút "📍 Điểm Bán" tại bất kỳ thẻ sản phẩm nào để xem chi tiết địa chỉ Hợp tác xã, hotline và mở Google Maps chỉ đường tận nơi!', productIds:[]};
  else if (intent.hasVerifiedCombo) reply = shopping.replyOptions(intent.comboPlans || [],intent,language);
  else if (trainedReply && !intent.pricePreference) reply = trainedReply;
  else if (!intent.pricePreference && !intent.isCombo && !intent.isGift && resolveProductConsultation(intent.knowledgeQuery || intent.rawText || '', products, language)) reply = resolveProductConsultation(intent.knowledgeQuery || intent.rawText || '', products, language);
  else if (intent.isOcopKnowledge || intent.isUsage) {
    const selected = intent.isUsage && products.length<=3 ? products : [];
    const descriptions = selected.map(p=>p.description || p.desc).filter(Boolean);
    reply = {message:descriptions.length ? (en ? 'Product catalogue information:\n' : 'Thông tin trong danh mục sản phẩm:\n') + descriptions.join('\n') : '', productIds:selected.map(p=>p.id)};
  } else if (intent.pricePreference) reply = shopping.recommendationReply(products,intent,language);
  else {
    const items=shopping.recommendations(products,intent);
    const scoped=intent.categoryOrKeyword || intent.exactRegion || intent.regionKeyword || intent.maxPrice || intent.minStars || products.length<=3;
    reply={message:scoped ? (items.length ? (en ? 'Products matching your request:\n' : 'Các sản phẩm phù hợp với yêu cầu của anh/chị:\n')+items.map(p=>'• '+(en ? p.nameEn || p.name : p.name)+': '+p.price.toLocaleString('vi-VN')+' ₫'+(p.packaging ? ' / '+(en ? p.packagingEn || p.packaging : p.packaging) : '')+(items.length===1 && (p.description || p.desc) ? '\n'+(p.description || p.desc) : '')).join('\n') : (en ? 'No product matches all your requirements. Would you like to adjust the budget or product type?' : 'Chưa có món đáp ứng đầy đủ yêu cầu. Anh/chị muốn thay đổi mức giá hoặc loại sản phẩm không?')) : (en ? 'How can I help? Please tell me the product, province, or budget you are looking for.' : 'Mình có thể giúp anh/chị tìm món gì? Anh/chị cho biết sản phẩm, tỉnh thành hoặc ngân sách nhé.'),productIds:scoped ? items.map(p=>p.id) : []};
  }

  const regionalAdvice = !intent.requiredClarification && !intent.verifiedReviewMessage && !intent.isCombo && !intent.isGift
    ? regionalAdviceMessage((reply.productIds||[]).map(id=>products.find(product=>product.id===id)).filter(Boolean),intent,language) : null;
  if (regionalAdvice) reply.message=regionalAdvice;

  const hasUsefulContext = intent.isOcopKnowledge || intent.isUsage || (reply.productIds || []).length > 0;
  const sources = hasUsefulContext && !intent.requiredClarification && !intent.verifiedReviewMessage && !intent.isComplaint && !intent.isCSKH && !intent.isShipping && !intent.isOrderGuide
    ? wikiSources.filter(s=>typeof s.extract==='string' && s.extract.trim() && isWikipediaURL(s.url)).slice(0,1) : [];
  if (sources.length) {
    const source=sources[0];
    const extract=source.extract.replace(/\s+/g,' ').trim();
    const sentences=[...new Intl.Segmenter(en ? 'en' : 'vi',{granularity:'sentence'}).segment(extract)].slice(0,2).map(part=>part.segment.trim()).join(' ');
    const end=sentences.lastIndexOf(' ',280);
    const excerpt=sentences.length<=280 ? sentences : sentences.slice(0,end>0 ? end : 280)+'…';
    reply.message=[reply.message,excerpt].filter(Boolean).join('\n\n');
  }
  if (!reply.message) reply.message=en ? 'I could not find verified information for this question. Please give the exact product name or the detail you want to check.' : 'Mình chưa tìm được thông tin xác thực cho câu hỏi này. Anh/chị cho biết tên sản phẩm hoặc chi tiết muốn tìm hiểu nhé.';
  const productIds=reply.productIds || [];
  return {...reply,message:reply.message,text_response:reply.message,productIds,suggested_products:productIds,understandingStatus:reply.understandingStatus || 'understood',understandingSource:intentProvider || 'catalog_rules',imageMatchStatus:'not_applicable',handoffAdmin:Boolean(reply.handoffAdmin),dynamic_chips:reply.dynamic_chips || [],wikipediaSources:sources.map(({title,url})=>({title,url})),aiProvider:'catalog_wikipedia',responseMode:'semantic_catalog_wikipedia',integrations:{gemini:intentProvider==='gemini',openai:false,wikipedia:sources.length>0,googleSearch:false}};
}
function fastBudgetReply(products,intent,language='vi') {
  if(!intent.maxPrice || !(intent.isCombo || intent.isGift || (intent.minItems && intent.minItems > 1) || (intent.maxItems && intent.maxItems > 1)) || intent.requiredClarification ||
    ['isComplaint','isCSKH','isShipping','isUsage','isOcopKnowledge','isOrderGuide','isStoreLookup'].some(key=>intent[key]))return null;
  const verified={...intent,isCombo:true,hasVerifiedCombo:true};
  verified.comboPlans=shopping.variants(products.filter(product=>shopping.allowed(product,verified)),verified);
  return {...composeDataReply(products,verified,language),responseMode:'verified_catalog_combos',understandingSource:'catalog_rules'};
}
module.exports={composeDataReply,fastBudgetReply};
