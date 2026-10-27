(function(root){
    'use strict';
    function catalogReply(query,products,language='vi',history=[]){
        const training=typeof module==='object'&&module.exports?require('./product-training'):root.OCOPProductTraining;
        const trainedReply=training?.answerTrainingQuery(query,products,language,history);
        if(trainedReply) return {...trainedReply,localFallback:true};
        const facts=typeof module==='object'&&module.exports?require('./catalog-facts'):root.OCOPCatalogFacts;
        const factReply=facts?.answer(query,products,language,history);
        if(factReply) return {...factReply,localFallback:true,aiProvider:'local_catalog'};
        const assistant=typeof module==='object'&&module.exports?require('./ai-scenarios'):root.OCOPSalesAssistant;
        const scenario=assistant?.scenarioReply(query,language);
        if(scenario) return {...scenario,text_response:scenario.message,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        const shopping=typeof module==='object'&&module.exports?require('./ai-shopping'):root.AIShopping;
        const locations=typeof module==='object'&&module.exports?require('./product-locations'):root.OCOPProductLocations;
        const intent=shopping.resolve([...history,{role:'user',text:query}],products);
        intent.knowledgeQuery=query;
        const en=language==='en';let message,ids=[],combos=[];
        if(intent.isComplaint||intent.isCSKH)message=en?'Please describe your request and provide your order number if available so staff can help.':'Anh/chị mô tả yêu cầu và cung cấp mã đơn nếu có để nhân viên hỗ trợ nhé.';
        else if(intent.isOrderGuide)message=en?'To place an order on OCOP Vietnam, you can easily follow these 3 steps:\n\n1. Select products: Browse the 63-province catalogue or ask AI for a combo within your budget.\n2. Add to Cart: Click "Add to Cart" or "Buy Now" on items you like.\n3. Complete Order: Open the Cart icon (top right), enter recipient info (Name, Phone, Address), and choose payment method (COD or Bank Transfer).\n\nWhich regional specialty or province are you interested in so I can help you choose?':'Dạ, để đặt hàng đặc sản OCOP chính hãng, anh/chị có thể thực hiện theo 3 bước rất đơn giản:\n\n1. Chọn sản phẩm: Xem danh mục 63 tỉnh thành hoặc nhắn cho em ngân sách/nhu cầu để em gợi ý món ngon hoặc combo phù hợp.\n2. Thêm vào giỏ: Bấm "Thêm vào giỏ" hoặc "Mua ngay" tại sản phẩm anh/chị yêu thích.\n3. Xác nhận đơn: Bấm biểu tượng Giỏ hàng ở góc phải trên cùng, điền thông tin người nhận (Họ tên, SĐT, Địa chỉ) và chọn hình thức thanh toán (COD hoặc chuyển khoản) là hoàn tất.\n\nAnh/chị đang muốn đặt đặc sản vùng miền nào để em hỗ trợ tư vấn ngay nhé!';
        else if(intent.isShipping)message=en?'Please provide the items and delivery address so staff can confirm shipping.':'Anh/chị cho biết sản phẩm và địa chỉ nhận hàng để nhân viên xác nhận phí giao nhé.';
        else if(intent.isCombo&&intent.maxPrice){
            const reply=shopping.replyOptions(shopping.variants(products,intent),intent,language);
            message=reply.message;ids=reply.productIds||[];combos=reply.combos||[];
        }else{
            const scoped=Boolean(intent.exactRegion||intent.regionKeyword||intent.categoryOrKeyword||intent.maxPrice||intent.minStars||intent.pricePreference);
            const selected=scoped?shopping.recommendations(products.filter(p=>shopping.allowed(p,intent)),intent).slice(0,3):[];
            ids=selected.map(p=>p.id);
            message=selected.length?(en?'Products matching your request:\n':'Dạ, anh/chị tham khảo các sản phẩm trong danh mục:\n')+selected.map(p=>`• ${en?p.nameEn||p.name:p.name} (${p.region}) — ${p.price.toLocaleString('vi-VN')} ₫/${p.packaging||'đơn vị'}`).join('\n')
                :scoped?(en?'No catalogue item matches these requirements. Would you like to adjust the province or product type?':'Chưa có sản phẩm phù hợp trong danh mục. Anh/chị muốn đổi tỉnh hoặc loại sản phẩm không?')
                :(en?'Which product, province or gift budget are you interested in?':'Anh/chị muốn tìm sản phẩm, đặc sản tỉnh nào hoặc quà trong ngân sách bao nhiêu ạ?');
        }
        const reply={message,text_response:message,productIds:ids,suggested_products:ids,combos,dynamic_chips:en?['Find products','Gift ideas','Store locations']:['Tìm đặc sản','Gợi ý quà biếu','Tìm điểm bán'],handoffAdmin:Boolean(intent.isComplaint||intent.isCSKH),localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        return locations?locations.appendProductLocations(reply,products,intent,root.OcopStores,language):reply;
    }
    if(typeof module==='object'&&module.exports)module.exports={catalogReply};else root.OCOPChatFallback={catalogReply};
})(typeof globalThis!=='undefined'?globalThis:this);
