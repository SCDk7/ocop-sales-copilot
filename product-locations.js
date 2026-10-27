(function(root){
    'use strict';
    function locationForProduct(product,directory){
        const normalized=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/\s+/g,' ').trim();
        const reference=directory?.REFERENCE_STORE_MAP?.[product.id];
        const matches=reference && normalized(reference.productName)===normalized(product.name) && normalized(reference.region)===normalized(product.region);
        if(matches && reference.primaryStore?.address){
            return {productId:product.id,productName:product.name,type:'shop_directory',name:reference.primaryStore.name,address:reference.primaryStore.address,
                mapUrl:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(reference.primaryStore.name+' '+reference.primaryStore.address)};
        }
        return {productId:product.id,productName:product.name,type:'map_search',address:'',
            mapUrl:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(product.name+' OCOP '+product.region)};
    }
    function appendProductLocations(reply,products,intent,directory,language='vi'){
        const query=String(intent.knowledgeQuery||intent.rawText||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
        if(!/diem ban|showroom|chi duong|cua hang|store location|directions/.test(query)||intent.isComplaint||intent.isCSKH||intent.isShipping||intent.requiredClarification)return reply;
        const ids=reply.productIds||reply.suggested_products||[];
        const selected=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean).slice(0,3);
        if(!selected.length)return reply;
        const locations=selected.map(p=>locationForProduct(p,directory));
        const lines=locations.map(location=>location.type==='shop_directory'
            ? `• ${location.productName}: ${location.name} — ${location.address}. [${language==='en'?'Directions':'Chỉ đường'}](${location.mapUrl})`
            : `• [${language==='en'?'Find sellers for':'Tìm điểm bán'} ${location.productName}](${location.mapUrl})`);
        const note=locations.some(location=>location.type==='map_search')?(language==='en'?'Specific showroom addresses have not been matched to these products. Please confirm the seller and address before visiting.':'Chưa có địa chỉ showroom được đối chiếu cho một số sản phẩm này. Anh/chị xác nhận điểm bán và địa chỉ với nhân viên trước khi đến nhé.'):(language==='en'?'Addresses are from the shop directory; please confirm before visiting.':'Địa chỉ theo danh bạ cửa hàng; anh/chị xác nhận trước khi đến nhé.');
        const message=[reply.message||reply.text_response,lines.join('\n'),note].filter(Boolean).join('\n\n');
        return {...reply,message,text_response:message,productLocations:locations};
    }
    const api={locationForProduct,appendProductLocations};
    if(typeof module==='object'&&module.exports)module.exports=api;else root.OCOPProductLocations=api;
})(typeof globalThis!=='undefined'?globalThis:this);
