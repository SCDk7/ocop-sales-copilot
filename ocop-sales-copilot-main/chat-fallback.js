(function(root){
    'use strict';
    const analyzer=typeof module==='object'&&module.exports?require('./ai-request-analysis'):root.OCOPRequestAnalysis;
    const profile=typeof module==='object'&&module.exports?require('./ocop-assistant-profile'):root.OCOPAssistantProfile;
    const onlyDongNaiProducts=products=>Array.isArray(products)?products.filter(product=>String(product?.region||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').replace(/\s+/g,' ').trim().toLowerCase()==='dong nai'):[];
    function imageUnavailableReply(language='vi',query='',products=[],history=[],imageEvidence=null) {
        products=onlyDongNaiProducts(products);
        const analysis=analyzer.analyzeCustomerRequest([...history,{role:'user',text:query}],products,{language,hasImages:true});
        const messages={
            vi:'Dạ, em chưa nhận diện được ảnh. Quý khách có thể mô tả chi tiết sản phẩm hoặc cho em tên sản phẩm ạ?',
            en:'Dạ, I could not identify the image. Could you describe the product or tell me its name?',
            zh:'Dạ，我还无法识别这张图片。请描述商品详情或告知商品名称，好吗？',
            ko:'Dạ, 이미지를 식별하지 못했습니다. 상품의 특징이나 이름을 알려주시겠어요?',
            ja:'Dạ、画像を認識できませんでした。商品の特徴か名前を教えていただけますか？'
        };
        const message=messages[language]||messages.vi;
        return profile.completeReply({message,text_response:message,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],imageMatchStatus:'unknown',understandingStatus:'needs_clarification',handoffAdmin:Boolean(analysis.intent.isComplaint||analysis.intent.isCSKH),localFallback:true,aiProvider:'local_catalog',requestAnalysis:{...analysis.summary,needsClarification:true},integrations:{gemini:false,openai:false,claude:false,wikipedia:false}},language);
    }
    function catalogReply(query,products,language='vi',history=[]){
        products=onlyDongNaiProducts(products);
        const questionGuide=typeof module==='object'&&module.exports?require('./customer-question-guide'):root.OCOPCustomerQuestionGuide;
        const generalCompliance=!questionGuide?.findProduct(query,products)&&questionGuide?.answerGeneralCompliance(query,language);
        if(generalCompliance)return profile.completeReply({...generalCompliance,localFallback:true,aiProvider:'local_catalog'},language);
        const analysis=analyzer.analyzeCustomerRequest([...history,{role:'user',text:query}],products,{language});
        const reply=catalogReplyAfterAnalysis(query,products,language,history,analysis);
        return profile.completeReply({...reply,requestAnalysis:{...analysis.summary,needsClarification:Boolean(analysis.summary.needsClarification||reply.understandingStatus==='needs_clarification')}},language);
    }
    function catalogReplyAfterAnalysis(query,products,language,history,analysis){
        const intent=analysis.intent;
        const storeDirectoryReply=()=>({message:language==='en'?'I can only provide approved Đồng Nai store-directory information. There are currently no approved store entries to share.':'Dạ, trợ lý chỉ dùng danh bạ điểm bán Đồng Nai đã được duyệt. Hiện chưa có điểm bán được duyệt để cung cấp.',productIds:[],suggested_products:[],combos:[],dynamic_chips:[],localFallback:true,aiProvider:'local_catalog'});
        const normQ=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase();
        const hasProductIntent=Boolean(intent.categoryOrKeyword)||/(?:dac san|san pham|product|specialt)/i.test(normQ);
        if(analysis.summary.dataUnavailable)return {message:profile.missingInformation,knowledgeStatus:'not_found',productIds:[],suggested_products:[],combos:[],dynamic_chips:[],localFallback:true,aiProvider:'local_catalog'};
        if(intent.isVoucher)return {message:language==='en'?'There is no approved voucher information in the internal data right now.':'Dạ, hiện chưa có thông tin mã ưu đãi được duyệt trong dữ liệu nội bộ ạ.',productIds:[],suggested_products:[],combos:[],localFallback:true,aiProvider:'local_catalog'};
        if(intent.isStoreLookup&&!hasProductIntent)return storeDirectoryReply();
        if(/(?:b2b|doanh nghiep|set qua doanh nghiep|qua tang doanh nghiep)/i.test(query.normalize('NFD').replace(/[\u0300-\u036f]/g,'')))return {message:language==='en'?'There is no approved B2B policy in the internal data. I can only advise on Đồng Nai products in the catalogue.':'Dạ, dữ liệu nội bộ chưa có chính sách B2B được duyệt. Em chỉ có thể tư vấn sản phẩm Đồng Nai trong danh mục ạ.',productIds:[],suggested_products:[],combos:[],localFallback:true,aiProvider:'local_catalog'};
        const assistant=typeof module==='object'&&module.exports?require('./ai-scenarios'):root.OCOPSalesAssistant;
        if(analysis.clarification)return {message:analysis.clarification,text_response:analysis.clarification,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],understandingStatus:'needs_clarification',localFallback:true,aiProvider:'local_catalog'};
        if(intent.isComplaint||intent.isCSKH){
            const scenario=assistant?.scenarioReply(query,language);
            const message=scenario?.message||(language==='en'?'Please describe the issue with your order. You can contact staff using the support button below.':'Anh/chị mô tả vấn đề cần hỗ trợ với đơn hàng nhé. Anh/chị có thể liên hệ nhân viên qua nút hỗ trợ bên dưới.');
            return {message,text_response:message,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],handoffAdmin:true,localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        }
        const codeFacts=typeof module==='object'&&module.exports?require('./catalog-facts'):root.OCOPCatalogFacts;
        if(codeFacts?.isProductCodeQuestion(query))return {...codeFacts.answer(query,products,language,history),localFallback:true,aiProvider:'local_catalog'};
        const questionGuide=typeof module==='object'&&module.exports?require('./customer-question-guide'):root.OCOPCustomerQuestionGuide;
        const guidedReply=questionGuide?.answer(query,products,language,history);
        if(guidedReply)return {...guidedReply,localFallback:true,aiProvider:'local_catalog'};
        const facts=typeof module==='object'&&module.exports?require('./catalog-facts'):root.OCOPCatalogFacts;
        const factReply=facts?.answer(query,products,language,history);
        if(factReply) return {...factReply,localFallback:true,aiProvider:'local_catalog'};
        const scenario=assistant?.scenarioReply(query,language);
        if(scenario) return {...scenario,text_response:scenario.message,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        const consultant=typeof module==='object'&&module.exports?require('./product-consultant'):root.OCOPProductConsultant;
        const consultReply=consultant?.resolveProductConsultation(query,products,language,history);
        if(consultReply) return {...consultReply,localFallback:true,aiProvider:'product_consultant'};
        const shopping=typeof module==='object'&&module.exports?require('./ai-shopping'):root.AIShopping;
        const locations=typeof module==='object'&&module.exports?require('./product-locations'):root.OCOPProductLocations;
        const isGeneralShowroom = (/(?:mang luoi|he thong|danh sach|tra cuu)\s+(?:cac\s+)?(?:showroom|diem ban|cua hang)\b|(?:showroom|diem ban|store|store location)\s*(?:network|o2o|he thong|mang luoi)\b|(?:network|list of)\s+(?:showrooms?|stores?)|(?:showroom|diem ban)\s+o2o|o2o\s+(?:showroom|diem ban|store)|(?:ban do so|digital map).*(?:showroom|diem ban|store)|(?:showroom|diem ban|store).*(?:ban do so|digital map)/i.test(normQ) || (/diem ban|showroom/i.test(normQ) && /toan quoc|tat ca|he thong|chinh hang|ban do|nationwide|all stores/i.test(normQ))) && !hasProductIntent && !/(?:san pham nay|mon nay|hang nay|this product|this item)/i.test(normQ);
        if (isGeneralShowroom) return storeDirectoryReply();
        intent.knowledgeQuery=query;
        const en=language==='en';let message,ids=[],combos=[],knowledgeStatus;
        if(intent.isComplaint||intent.isCSKH)message=en?'Please describe your request and provide your order number if available so staff can help.':'Anh/chị mô tả yêu cầu và cung cấp mã đơn nếu có để nhân viên hỗ trợ nhé.';
        else if(intent.isOrderGuide)message=en?'To order, choose an item from the Dong Nai catalogue, add it to your cart, and follow the checkout steps shown on this site. The seller confirms the order and available payment or delivery options. Which catalogue item or budget can I help with?':'Dạ, anh/chị chọn sản phẩm trong danh mục Đồng Nai, thêm vào giỏ hàng rồi làm theo hướng dẫn tại bước thanh toán. Người bán sẽ xác nhận đơn và các lựa chọn thanh toán, giao hàng hiện có. Anh/chị muốn em hỗ trợ chọn sản phẩm hay ngân sách nào ạ?';
        else if(intent.isShipping)message=en?'Please provide the items and delivery address so staff can confirm shipping.':'Anh/chị cho biết sản phẩm và địa chỉ nhận hàng để nhân viên xác nhận phí giao nhé.';
        else if(intent.isStoreLookup&&!hasProductIntent){message=storeDirectoryReply().message;ids=[];}
        else if(intent.isCombo&&intent.maxPrice){
            const reply=shopping.replyOptions(shopping.variants(products,intent),intent,language);
            message=reply.message;ids=reply.productIds||[];combos=reply.combos||[];
        }
        else if(/(?:b2b|doanh nghiep|set qua|qua tang doanh nghiep|qua bieu doanh nghiep|hop qua doanh nghiep|hop qua b2b|combo qua doanh nghiep)/i.test(normQ)){
            ids = [];
            message = en
                ? 'There is no approved B2B policy in the internal data. I can only advise on Đồng Nai products in the catalogue.'
                : 'Dạ, dữ liệu nội bộ chưa có chính sách B2B được duyệt. Em chỉ có thể tư vấn sản phẩm Đồng Nai trong danh mục ạ.';
        }else{
            const scoped=Boolean(intent.exactRegion||intent.regionKeyword||intent.categoryOrKeyword||intent.maxPrice||intent.minStars||intent.pricePreference);
            const selected=scoped?shopping.recommendations(products.filter(p=>shopping.allowed(p,intent)),intent).slice(0,3):[];
            ids=selected.map(p=>p.id);
            if(scoped&&!selected.length)knowledgeStatus='not_found';
            message=selected.length?(en?'Products matching your request:\n':'Dạ, anh/chị tham khảo các sản phẩm trong danh mục:\n')+selected.map(p=>`• ${en?p.nameEn||p.name:p.name} (${p.region}) — ${p.price.toLocaleString('vi-VN')} ₫/${p.packaging||'đơn vị'}`).join('\n')
                :scoped?(en?'No catalogue item matches these requirements. Would you like to adjust the province or product type?':'Chưa có sản phẩm phù hợp trong danh mục. Anh/chị muốn đổi tỉnh hoặc loại sản phẩm không?')
                : (en?'Which product, province or gift budget are you interested in?':'Anh/chị muốn tìm sản phẩm, đặc sản tỉnh nào hoặc quà trong ngân sách bao nhiêu ạ?');
            message=locations?.regionalAdviceMessage(selected,intent,language)||message;
        }
        const reply={message,text_response:message,knowledgeStatus,productIds:ids,suggested_products:ids,combos,dynamic_chips:en?['Find products','Gift ideas','Store locations']:['Tìm đặc sản','Gợi ý quà biếu','Tìm điểm bán'],handoffAdmin:Boolean(intent.isComplaint||intent.isCSKH),localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        return locations?locations.appendProductLocations(reply,products,intent,root.OcopStores,language):reply;
    }
    if(typeof module==='object'&&module.exports)module.exports={catalogReply,imageUnavailableReply};else root.OCOPChatFallback={catalogReply,imageUnavailableReply};
})(typeof globalThis!=='undefined'?globalThis:this);
