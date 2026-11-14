(function(root) {
'use strict';
const node=typeof module==='object' && module.exports;
const knowledge=node?require('./data/tea-knowledge.json'):root.OCOPTeaKnowledge;
const shopping=node?require('./ai-shopping'):root.AIShopping;
const {normalize}=shopping;
function profileForProduct(product) {
  return knowledge?.products.find(row => String(row.productId) === String(product.id) && normalize(row.name) === normalize(product.name));
}

function trainingForProduct(product) {
  const profile = profileForProduct(product);
  if (!profile) return '';
  const price = Number.isSafeInteger(product.price) && product.price > 0
    ? `${product.price.toLocaleString('vi-VN')} VNĐ/${product.packaging || 'đơn vị'}` : 'Cần nhân viên xác nhận giá';
  const stars = Number(product.stars);
  const classification = stars >= 3 && stars <= 5 ? `OCOP ${stars} sao theo danh mục chủ shop cung cấp` : 'Cần xác nhận mức sao OCOP';
  return [
    'Nguồn mô tả và câu chuyện: chủ shop cung cấp; không phải xác minh độc lập.',
    `Thông tin danh mục hiện tại: ${product.name}; ${product.region || ''}; ${classification}; ${price}.`,
    profile.origin && `Nguồn gốc: ${profile.origin}`,
    profile.characteristics && `Đặc điểm: ${profile.characteristics}`,
    profile.story && `Câu chuyện sản phẩm: ${profile.story}`,
    profile.storage && `Bảo quản: ${profile.storage}`,
    profile.usageNote && `Lưu ý tư vấn: ${profile.usageNote}`,
    `Câu hỏi thường gặp: ${profile.questions.join(' | ')}`,
    `Trả lời mẫu giá/số sao: Dạ, ${product.name} có mức ${classification}, giá niêm yết hiện tại ${price}. Anh/chị muốn xem thêm thông tin hay cần tư vấn làm quà biếu?`,
    `FAQ vận chuyển, giao tỉnh, gửi nước ngoài: ${knowledge.shippingAnswer}`
  ].filter(Boolean).join('\n');
}
function trainedProductReply(products, intent, language) {
  if (language !== 'vi') return null;
  const known = products.filter(product => profileForProduct(product));
  const query = normalize(intent.knowledgeQuery || intent.categoryOrKeyword || '');
  const teaGift = intent.isGift && (/(^| )tra( |$)/.test(query) || (products.length > 0 && known.length === products.length));
  if (teaGift && known.length) {
    const items = known.filter(product => Number.isSafeInteger(product.price) && product.price > 0)
      .sort((a,b) => b.price - a.price).slice(0,3);
    if (!items.length) return null;
    return {
      message: 'Dạ, anh/chị có thể tham khảo các dòng trà làm quà sau:\n' + items.map(product =>
        `• ${product.name}${product.stars ? ` — OCOP ${product.stars} sao theo danh mục` : ''}: ${product.price.toLocaleString('vi-VN')} VNĐ/${product.packaging || 'đơn vị'}.`
      ).join('\n') + '\nAnh/chị dự định biếu trong khoảng ngân sách nào để em tư vấn kỹ hơn ạ?',
      productIds: items.map(product => product.id)
    };
  }
  if (products.length !== 1 || known.length !== 1) return null;
  const product = known[0], profile = profileForProduct(product);
  const details = [];
  if (/bao quan|han su dung/.test(query)) {
    details.push(profile.storage || 'Em chưa có hướng dẫn bảo quản riêng cho sản phẩm này; anh/chị đối chiếu nhãn hoặc nhờ nhân viên kiểm tra giúp nhé.');
  } else if (/cong dung|suc khoe|mat gan|giai doc/.test(query) && profile.usageNote) {
    details.push('Đây là dòng trà thảo mộc. Em chưa có tài liệu nhãn để xác nhận công dụng sức khỏe cụ thể; anh/chị xem hướng dẫn trên bao bì hoặc nhờ nhân viên kiểm tra thông tin trước khi chọn dùng nhé.');
  } else {
    details.push(profile.origin, profile.characteristics);
    if (/cau chuyen|van hoa|di san/.test(query)) details.push(profile.story);
    if (intent.isUsage) details.push(profile.storage);
  }
  const stars = Number(product.stars);
  const classification = stars >= 3 && stars <= 5 ? `, OCOP ${stars} sao theo danh mục cửa hàng` : '';
  const price = Number.isSafeInteger(product.price) && product.price > 0
    ? ` Giá niêm yết hiện tại là ${product.price.toLocaleString('vi-VN')} VNĐ/${product.packaging || 'đơn vị'}.` : ' Anh/chị liên hệ nhân viên để xác nhận giá hiện tại nhé.';
  if(/gia|bao nhieu tien/.test(query)&&!/bao quan|han su dung|cau chuyen|cong dung|so sanh|huong vi|vi sao|vi gi|dac diem|nguon goc|xuat xu|o dau/.test(query))return {message:`Dạ, ${product.name}${classification}.${price}`,productIds:[product.id]};
  return {
    message: [`Dạ, ${product.name}${classification}.${price}`, ...details.filter(Boolean)].join('\n'),
    productIds: [product.id]
  };
}
function answerTrainingQuery(query,products,language='vi',history=[]) {
  if(language!=='vi'||!knowledge)return null;
  const q=normalize(query),intent=shopping.resolve([...history,{role:'user',text:query}],products);
  if(intent.isComplaint||intent.isCSKH||/khieu nai|doi tra|hoan tien|bi moc|bi hong/.test(q))return null;
  const response=reply=>({...reply,text_response:reply.message,suggested_products:reply.productIds||[],combos:[],dynamic_chips:[],catalogChecked:true,catalogSource:'data.js',knowledgeSource:'merchant_supplied',aiProvider:'catalog_knowledge',responseMode:'merchant_product_faq',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}});
  if(intent.isShipping||/gui.*nuoc ngoai|giao.*tinh|ship.*quoc te/.test(q))return response({message:knowledge.shippingAnswer,productIds:[]});
  if(intent.isCombo)return null;
  if(/so sanh|khac nhau|compare|versus|\bvs\b/.test(q))return null;
  const known=products.filter(product=>profileForProduct(product));
  if(intent.isGift&&/\btra\b/.test(q)&&/qua bieu|lam qua|tang|qua tet|gift/.test(q)){
    const eligible=known.filter(product=>shopping.allowed(product,intent));
    const reply=trainedProductReply(eligible,{...intent,isGift:true,knowledgeQuery:query},language);
    return reply?response(reply):null;
  }
  function select(text){
    const normalized=normalize(text);
    const matches=known.map(product=>{
      const profile=profileForProduct(product),aliases=[profile.name,...(profile.aliases||[])];
      return {product,score:Math.max(0,...aliases.filter(alias=>normalized.includes(normalize(alias))).map(alias=>normalize(alias).length))};
    }).filter(row=>row.score>0).sort((a,b)=>b.score-a.score);
    return matches.length&&(matches.length===1||matches[0].score>matches[1].score)?matches[0].product:null;
  }
  let product=select(query);
  if(!product&&/^(?:bao quan|han su dung|vi gi|gia bao nhieu|may sao|cau chuyen|tra nay|san pham nay)/.test(q)){
    const previous=[...history].reverse().find(message=>message.role==='user');
    if(previous)product=select(previous.text||previous.content||'');
  }
  if(!product)return null;
  const reply=trainedProductReply([product],{...intent,isGift:false,knowledgeQuery:query},language);
  return reply?response(reply):null;
}
const api={trainingForProduct,trainedProductReply,answerTrainingQuery};
if(node)module.exports=api;else root.OCOPProductTraining=api;
})(typeof globalThis!=='undefined'?globalThis:this);
