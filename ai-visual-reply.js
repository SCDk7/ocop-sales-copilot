'use strict';

const clean=value=>String(value||'').replace(/[<>*\[\]`]/g,'').replace(/\s+/g,' ').trim();
const visualSearchInstruction=`VISUAL SEARCH AND RECOMMENDATION:
Inspect every attached image before answering. Record the product type, readable label text, shape, colour, packaging and any visible OCOP mark. Return recognizedProductType, visibleLabel and up to three observedFeatures using only visible evidence. A star logo in a photograph does not authenticate certification.
Match against the supplied catalogue by the same product type and product line, prioritizing distinguishing label details and the region actually visible. Do not use the caption, filename, generic packaging colour or the requested province as proof of what the photo contains. Do not substitute unrelated products from the same province.
Return exact only for a catalogue identity supported by a readable full product label; a model-selected product ID alone is insufficient. For an exact match, state its canonical Vietnamese name, recorded OCOP stars, producer and price when available. Disclose missing fields instead of guessing.
If the type is known but the exact product is not found, use similar and explain that no exact match has been found. Recommend the closest two or three genuinely related catalogue products, or fewer if the catalogue does not contain enough. List their actual names, stars, region and reference price or verified short description. Do not claim they are popular or in stock without backend evidence.
Use unknown with no product IDs for an unrecognizable image or when no related catalogue product exists, and ask for a clearer label or the product name. Never pad the list with unrelated popular products.
Use a compact introduction, short bullets and one closing question about ingredients or ordering. Keep names in Vietnamese and answer in the customer's language. For complaint/damage photos, prioritize support, keep the handoff flag and do not turn the reply into a shopping recommendation.`;

function formatVisualReply(products, {status='unknown', productType='', features=[], language='vi', reference=false}={}) {
    const en=language==='en', selected=products.slice(0,3);
    const rawType=clean(productType).slice(0,100);
    const type=/^(unknown|unidentified|not applicable|không rõ|khong ro|sản phẩm|san pham|product)$/i.test(rawType) ? '' : rawType;
    if(status==='unknown' || !selected.length) {
        return [type ? (en ? `The image appears to show **${type}**.` : `Qua ảnh, em nhận diện loại sản phẩm: **${type}**.`) : '',
            en ? 'I could not identify a matching product in the catalogue. Could you send a clearer label photo or the product name?' : 'Dạ, em chưa tìm được sản phẩm phù hợp trong hệ thống. Anh/chị có thể gửi ảnh nhãn rõ hơn hoặc tên sản phẩm để em đối chiếu tiếp không ạ?'].filter(Boolean).join('\n\n');
    }
    const intro=status==='exact'
        ? (en ? 'This image matches the following catalogue product:' : 'Dạ, ảnh này khớp với sản phẩm trong danh mục:')
        : (en ? 'I have not found an exact match in the system. Here are the closest similar catalogue products for reference:' : 'Dạ, em chưa tìm thấy chính xác sản phẩm này trong hệ thống. Dưới đây là các sản phẩm tương tự trong danh mục để anh/chị tham khảo:');
    const observation=status!=='exact' && type
        ? (en ? `The product type visible in your image appears to be **${type}**.` : `Qua ảnh, em nhận diện loại sản phẩm: **${type}**.`) : '';
    const details=Array.isArray(features) ? features.filter(value=>typeof value==='string').map(value=>clean(value).slice(0,100)).filter(Boolean).slice(0,3) : [];
    const lines=selected.map(product=>{
        const stars=Number.isInteger(product.stars) && product.stars>=3 && product.stars<=5
            ? `OCOP ${product.stars} ${en?'stars':'sao'}` : (en?'OCOP rating not recorded':'chưa có dữ liệu số sao');
        const price=typeof product.price==='number' && Number.isFinite(product.price) && product.price>0
            ? `${product.price.toLocaleString('vi-VN')} ₫/${clean(product.packaging)||(en?'unit':'đơn vị')}` : (en?'price not recorded':'chưa cập nhật giá');
        const producer=typeof product.producerName==='string' ? product.producerName : typeof product.producer==='string' ? product.producer : '';
        return `• **${clean(product.name)}** — ${[stars,clean(product.region),price,producer ? `${en?'Producer':'Chủ thể'}: ${clean(producer)}` : ''].filter(Boolean).join(' — ')}`;
    });
    const missingProducer=status==='exact' && !selected[0].producerName && !selected[0].producer
        ? (en ? 'The producer is not yet recorded in this product profile.' : 'Chủ thể sản xuất chưa được cập nhật trong hồ sơ sản phẩm.') : '';
    const note=status==='exact'
        ? (en ? 'Stars, origin and prices above are catalogue information; a matching photo does not authenticate the physical item.' : 'Số sao, xuất xứ và giá tham khảo ở trên theo danh mục; ảnh khớp chưa xác thực được hàng thực tế.')
        : (reference ? (en ? 'This is a saved reference photo; it does not confirm the exact brand or origin.' : 'Ảnh tham chiếu chưa xác nhận đúng thương hiệu hoặc xuất xứ của món trong ảnh.')
            : (en ? 'Similar appearance does not confirm the brand, origin or OCOP certification of the item in your photo.' : 'Hình ảnh tương tự chưa xác nhận thương hiệu, xuất xứ hoặc chứng nhận OCOP của món trong ảnh.'));
    return [observation,details.length ? `${en?'Visible features':'Đặc điểm nhìn thấy'}: ${details.join('; ')}.` : '',intro,lines.join('\n'),missingProducer,note,
        en ? 'Would you like ingredient details or help ordering one of these products?' : 'Anh/chị muốn tìm hiểu thành phần hay cách đặt mua sản phẩm nào ạ?'].filter(Boolean).join('\n\n');
}

module.exports={formatVisualReply,visualSearchInstruction};
