(function(root){
    'use strict';
    function regionalAdviceMessage(products,intent,language='vi') {
        if (!intent.exactRegion || !intent.isStoreLookup || !products.length || intent.isComplaint || intent.isCSKH || intent.requiredClarification) return null;
        const en=language==='en';
        const selected=products.filter(product=>product.region===intent.exactRegion).slice(0,3);
        if(!selected.length)return null;
        const intro=en
            ? `For specialties from ${intent.exactRegion}, here are ${selected.length} options in the shop catalogue. Prices below are reference prices:`
            : `Dạ, anh/chị muốn chọn đặc sản ${intent.exactRegion} và tìm điểm bán để đến xem. Em gợi ý ${selected.length} món trong danh mục, với giá tham khảo như sau:`;
        const lines=selected.map(product=>`• **${en?product.nameEn||product.name:product.name}** — ${product.price.toLocaleString('vi-VN')} ₫/${en?product.packagingEn||product.packaging||'unit':product.packaging||'đơn vị'}`);
        return [intro,lines.join('\n')].join('\n\n');
    }
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
        if (reply.productLocations?.length) return reply;
        const query=String(intent.knowledgeQuery||intent.rawText||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
        if(!/diem ban|showroom|chi duong|cua hang|store location|directions/.test(query)||intent.isComplaint||intent.isCSKH||intent.isShipping||intent.requiredClarification)return reply;
        const ids=reply.productIds||reply.suggested_products||[];
        const selected=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean).slice(0,3);
        if(!selected.length)return reply;
        const locations=selected.map(p=>locationForProduct(p,directory));
        const lines=locations.map(location=>location.type==='shop_directory'
            ? `• ${location.productName}: ${location.name} — ${location.address}. [${language==='en'?'Directions':'Chỉ đường'}](${location.mapUrl})`
            : `• [${language==='en'?'Find sellers for':'Tìm điểm bán'} ${location.productName}](${location.mapUrl})`);
        const unverified=locations.some(location=>location.type==='map_search');
        const note=unverified?(language==='en'?'For showroom directions: some products do not have a matched showroom address. These links search Google Maps and do not verify an official seller. Please confirm the seller before visiting.':'Về showroom và chỉ đường: một số món chưa có địa chỉ showroom được đối chiếu. Các liên kết dưới đây là tìm kiếm trên Google Maps, chưa xác nhận điểm bán chính hãng. Anh/chị xác nhận với nhân viên trước khi đến nhé.'):(language==='en'?'Showroom addresses below are from the shop directory; please confirm before visiting.':'Địa chỉ showroom dưới đây theo danh bạ cửa hàng; anh/chị xác nhận trước khi đến nhé.');
        const question=unverified&&intent.exactRegion?(language==='en'?`Which area of ${intent.exactRegion} would you like to visit?`:`Anh/chị muốn tìm điểm bán ở khu vực nào của ${intent.exactRegion} ạ?`):'';
        const message=[reply.message||reply.text_response,note,lines.join('\n'),question].filter(Boolean).join('\n\n');
        return {...reply,message,text_response:message,productLocations:locations};
    }
    const api={locationForProduct,appendProductLocations,regionalAdviceMessage};
    if(typeof module==='object'&&module.exports)module.exports=api;else root.OCOPProductLocations=api;
})(typeof globalThis!=='undefined'?globalThis:this);
