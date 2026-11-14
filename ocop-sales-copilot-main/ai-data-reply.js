'use strict';
const shopping = require('./ai-shopping');
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
  const hasProductIntent = Boolean(intent.categoryOrKeyword) || /(?:dac san|san pham|product|specialt)/i.test(normQ);
  const isGeneralShowroom = (/(?:mang luoi|he thong|danh sach|tra cuu)\s+(?:cac\s+)?(?:showroom|diem ban|cua hang)\b|(?:showroom|diem ban|store|store location)\s*(?:network|o2o|he thong|mang luoi)\b|(?:network|list of)\s+(?:showrooms?|stores?)|(?:showroom|diem ban)\s+o2o|o2o\s+(?:showroom|diem ban|store)|(?:ban do so|digital map).*(?:showroom|diem ban|store)|(?:showroom|diem ban|store).*(?:ban do so|digital map)/i.test(normQ) || (/diem ban|showroom/i.test(normQ) && /toan quoc|tat ca|he thong|chinh hang|ban do|nationwide|all stores/i.test(normQ))) && !hasProductIntent && !/(?:san pham nay|mon nay|hang nay|this product|this item)/i.test(normQ);
  if (isGeneralShowroom) {
    intent.isStoreLookup = true;
    intent.categoryOrKeyword = null;
    intent.maxPrice = null;
    intent.minPrice = null;
    intent.isCombo = false;
    intent.isGift = false;
  }
  let reply;
  if (intent.requiredClarification) reply = {message:intent.requiredClarification, productIds:[], understandingStatus:'needs_clarification'};
  else if (intent.verifiedReviewMessage) reply = {message:intent.verifiedReviewMessage, productIds:intent.verifiedReviewProductIds || []};
  else if (intent.isComplaint || intent.isCSKH) reply = {message:en ? 'Please describe your request and provide your order number if available. You can contact our support team using the button below.' : 'Anh/chị mô tả yêu cầu và cung cấp mã đơn nếu có nhé. Anh/chị có thể liên hệ nhân viên qua nút bên dưới.',productIds:[],handoffAdmin:true};
  else if (intent.isVoucher) reply = {
    message: en ? 'There is no approved voucher information in the internal data right now.' : 'Dạ, hiện chưa có thông tin mã ưu đãi được duyệt trong dữ liệu nội bộ ạ.',
    productIds: []
  };
  else if (intent.isOrderGuide) reply = {message:en ? 'Choose a Đồng Nai product, add it to your cart, and complete the delivery details at checkout. The seller confirms the order.' : 'Dạ, anh/chị chọn sản phẩm Đồng Nai, thêm vào giỏ rồi điền thông tin nhận hàng ở bước thanh toán. Người bán sẽ xác nhận đơn ạ.',productIds:[]};
  else if (intent.isShipping) reply = {message:en ? 'Please provide your delivery location and the items you wish to order so staff can confirm the shipping fee and delivery time.' : 'Anh/chị cho biết địa chỉ nhận hàng và món muốn đặt để nhân viên xác nhận phí vận chuyển và thời gian giao nhé.',productIds:[]};
  else if (intent.isStoreLookup && !hasProductIntent) reply = {
    message: en
      ? 'I can only provide approved Đồng Nai store-directory information. There are currently no approved store entries to share.'
      : 'Dạ, trợ lý chỉ dùng danh bạ điểm bán Đồng Nai đã được duyệt. Hiện chưa có điểm bán được duyệt để cung cấp.',
    productIds: []
  };
  else if (intent.hasVerifiedCombo) reply = shopping.replyOptions(intent.comboPlans || [],intent,language);
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
function imageBudgetReply(products,intent,productId,language='vi') {
  if(!intent.maxPrice || !(intent.isCombo||intent.isGift||intent.minItems>1||intent.maxItems>1))return null;
  const anchor=products.find(p=>p.id===productId);
  if(!anchor||!shopping.allowed(anchor,intent))return null;
  const remaining=intent.maxPrice-anchor.price;
  const restIntent={...intent,isCombo:true,isGift:false,maxPrice:remaining,minPrice:Math.max(0,(intent.minPrice||0)-anchor.price),minItems:Math.max(1,(intent.minItems||2)-1),maxItems:Math.max(0,(intent.maxItems||7)-1)};
  const plans=remaining>0&&restIntent.maxItems>0 ? shopping.variants(products.filter(p=>p.id!==anchor.id),restIntent) : [];
  const comboPlans=plans.map(plan=>({...plan,items:[anchor,...plan.items],total:anchor.price+plan.total,budget:intent.maxPrice,remaining:intent.maxPrice-anchor.price-plan.total,averagePrice:Math.round((anchor.price+plan.total)/(plan.items.length+1))}));
  return {...composeDataReply(products,{...intent,isCombo:true,hasVerifiedCombo:true,comboPlans},language),responseMode:'image_budget_combos'};
}
module.exports={composeDataReply,fastBudgetReply,imageBudgetReply};
