'use strict';
const shopping = require('./ai-shopping');
const {trainedProductReply} = require('./product-training');
function isWikipediaURL(value) {
  try {
    const url=new URL(value);
    return url.protocol==='https:' && !url.username && !url.password && !url.port && ['vi.wikipedia.org','en.wikipedia.org'].includes(url.hostname)
      && (url.pathname.startsWith('/wiki/') || url.pathname==='/' && /^\d+$/.test(url.searchParams.get('curid') || ''));
  } catch { return false; }
}

function composeDataReply(products, intent, language, wikiSources = [], intentProvider = null) {
  const en = language === 'en';
  let reply;
  const trainedReply = trainedProductReply(products, intent, language);
  if (intent.requiredClarification) reply = {message:intent.requiredClarification, productIds:[], understandingStatus:'needs_clarification'};
  else if (intent.verifiedReviewMessage) reply = {message:intent.verifiedReviewMessage, productIds:intent.verifiedReviewProductIds || []};
  else if (intent.isComplaint || intent.isCSKH) reply = {message:en ? 'Please describe your request and provide your order number if available. You can contact our support team using the button below.' : 'Anh/chị mô tả yêu cầu và cung cấp mã đơn nếu có nhé. Anh/chị có thể liên hệ nhân viên qua nút bên dưới.',productIds:[],handoffAdmin:true};
  else if (intent.isOrderGuide) reply = {message:en ? 'To place an order on OCOP Vietnam, you can easily follow these 3 simple steps:\n\n1. Select products: Browse the 63-province catalogue or ask AI for a combo within your budget.\n2. Add to Cart: Click "Add to Cart" or "Buy Now" on your selected specialty items.\n3. Complete Order: Open the Cart icon (top right), enter recipient info (Name, Phone, Address), and choose payment method (COD or Bank Transfer).\n\nWhich regional specialty or province are you interested in so I can help you choose?' : 'Dạ, để đặt hàng đặc sản OCOP chính hãng, anh/chị có thể thực hiện theo 3 bước rất đơn giản:\n\n1. Chọn sản phẩm: Xem danh mục 63 tỉnh thành hoặc nhắn cho em ngân sách/nhu cầu để em gợi ý món ngon hoặc combo phù hợp.\n2. Thêm vào giỏ: Bấm "Thêm vào giỏ" hoặc "Mua ngay" tại sản phẩm anh/chị yêu thích.\n3. Xác nhận đơn: Bấm biểu tượng Giỏ hàng ở góc phải trên cùng, điền thông tin người nhận (Họ tên, SĐT, Địa chỉ) và chọn hình thức thanh toán (COD hoặc chuyển khoản) là hoàn tất.\n\nAnh/chị đang muốn đặt đặc sản vùng miền nào để em hỗ trợ tư vấn ngay nhé!',productIds:[]};
  else if (intent.isShipping) reply = {message:en ? 'Please provide your delivery location and the items you wish to order so staff can confirm the shipping fee and delivery time.' : 'Anh/chị cho biết địa chỉ nhận hàng và món muốn đặt để nhân viên xác nhận phí vận chuyển và thời gian giao nhé.',productIds:[]};
  else if (intent.hasVerifiedCombo) reply = shopping.replyOptions(intent.comboPlans || [],intent,language);
  else if (trainedReply && !intent.pricePreference) reply = trainedReply;
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
module.exports={composeDataReply};
