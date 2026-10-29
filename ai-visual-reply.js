'use strict';

const clean=value=>String(value||'').replace(/[<>*\[\]`]/g,'').replace(/\s+/g,' ').trim();
const visualSearchInstruction=`VISUAL SEARCH: Inspect attached images before replying. Identify type, readable labels and observable features. Match only against real catalogue data; never use caption, filename or generic packaging as proof. Exact requires a readable full product label or validated catalogue image match. A photo alone cannot authenticate OCOP certification, origin, manufacturer or medical effects. For uncertain matches use similar, and use unknown if no related product can be identified. Reply briefly, starting with the Vietnamese polite greeting required by the assistant profile: show the best matching canonical product name, catalogue price/unit and an honest match level. Never invent similarity percentages; state that no percentage score is available when the system has not measured one. Ask one short clarification for an unreadable label. Follow budget and quantity constraints when the customer asks for a combo from the photo. Complaint/damage photos must keep the support handoff and must not become shopping recommendations.`;

function formatVisualReply(products, {status='unknown', productType='', features=[], language='vi', reference=false}={}) {
    return conciseVisualReply(products,{status,language});
}

function conciseVisualReply(products,{status='unknown',language='vi'}={}){
    if(status==='unknown'||!products.length)return language==='en'?'Dạ, please send a clearer label photo or the product name.':'Dạ, anh/chị gửi ảnh nhãn rõ hơn hoặc tên sản phẩm để em đối chiếu ạ.';
    const product=products[0],en=language==='en';
    const price=Number.isFinite(product.price)&&product.price>0?product.price.toLocaleString('vi-VN')+' ₫/'+(clean(product.packaging)||(en?'unit':'đơn vị')):(en?'price not recorded':'chưa có giá');
    const level=status==='exact'?(en?'matches catalogue image/label':'khớp ảnh/nhãn trong danh mục'):(en?'similar; percentage not available':'tương tự, chưa có điểm khớp %');
    const producer=status==='exact'?(product.producerName||product.producer):'';
    return `Dạ, ${en?'closest product':'mẫu gần nhất'}: **${clean(product.name)}** — ${price}. ${en?'Match':'Mức khớp'}: ${level}.${typeof producer==='string'&&producer?' '+clean(producer)+'.':''}`;
}

module.exports={formatVisualReply,visualSearchInstruction};
