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
        const consultant=typeof module==='object'&&module.exports?require('./product-consultant'):root.OCOPProductConsultant;
        const consultReply=consultant?.resolveProductConsultation(query,products,language,history);
        if(consultReply) return {...consultReply,localFallback:true,aiProvider:'product_consultant'};
        const shopping=typeof module==='object'&&module.exports?require('./ai-shopping'):root.AIShopping;
        const locations=typeof module==='object'&&module.exports?require('./product-locations'):root.OCOPProductLocations;
        const intent=shopping.resolve([...history,{role:'user',text:query}],products);
        intent.knowledgeQuery=query;
        const en=language==='en';let message,ids=[],combos=[];
        if(intent.isComplaint||intent.isCSKH)message=en?'Please describe your request and provide your order number if available so staff can help.':'Anh/chị mô tả yêu cầu và cung cấp mã đơn nếu có để nhân viên hỗ trợ nhé.';
        else if(intent.isOrderGuide)message=en?'To place an order on OCOP Vietnam, you can easily follow these 3 steps:\n\n1. Select products: Browse the 63-province catalogue or ask AI for a combo within your budget.\n2. Add to Cart: Click "Add to Cart" or "Buy Now" on items you like.\n3. Complete Order: Open the Cart icon (top right), enter recipient info (Name, Phone, Address), and choose payment method (COD or Bank Transfer).\n\nWhich regional specialty or province are you interested in so I can help you choose?':'Dạ, để đặt hàng đặc sản OCOP chính hãng, anh/chị có thể thực hiện theo 3 bước rất đơn giản:\n\n1. Chọn sản phẩm: Xem danh mục 63 tỉnh thành hoặc nhắn cho em ngân sách/nhu cầu để em gợi ý món ngon hoặc combo phù hợp.\n2. Thêm vào giỏ: Bấm "Thêm vào giỏ" hoặc "Mua ngay" tại sản phẩm anh/chị yêu thích.\n3. Xác nhận đơn: Bấm biểu tượng Giỏ hàng ở góc phải trên cùng, điền thông tin người nhận (Họ tên, SĐT, Địa chỉ) và chọn hình thức thanh toán (COD hoặc chuyển khoản) là hoàn tất.\n\nAnh/chị đang muốn đặt đặc sản vùng miền nào để em hỗ trợ tư vấn ngay nhé!';
        else if(intent.isShipping)message=en?'Please provide the items and delivery address so staff can confirm shipping.':'Anh/chị cho biết sản phẩm và địa chỉ nhận hàng để nhân viên xác nhận phí giao nhé.';
        else if(intent.isStoreLookup&&!intent.exactRegion&&!intent.regionKeyword&&!intent.categoryOrKeyword){
            message=en
                ?'📍 OCOP Vietnam Flagship Showrooms & O2O Stores:\n\n• [National OCOP Trade Promotion Center (Hanoi)](https://www.google.com/maps/search/?api=1&query=489+Hoang+Quoc+Viet+Cau+Giay+Hanoi) — 489 Hoang Quoc Viet, Cau Giay, Hanoi (Hotline: 024.3755.8899 | 08:00 - 21:30)\n• [Big C Thang Long OCOP Center (Hanoi)](https://www.google.com/maps/search/?api=1&query=222+Tran+Duy+Hung+Cau+Giay+Hanoi) — 222 Tran Duy Hung, Cau Giay, Hanoi (Hotline: 024.3784.8888)\n• [Regional OCOP Showroom (HCMC)](https://www.google.com/maps/search/?api=1&query=459+Chu+Van+An+Binh+Thanh+HCMC) — 459 Chu Van An, Ward 12, Binh Thanh, HCMC (Hotline: 028.3899.6677 | 08:00 - 21:00)\n• [Central & Highlands OCOP Hub (Da Nang)](https://www.google.com/maps/search/?api=1&query=08+Cach+Mang+Thang+Tam+Cam+Le+Da+Nang) — 08 Cach Mang Thang Tam, Cam Le, Da Nang (Hotline: 0236.388.9911)\n\n💡 How to explore on our platform:\n1. Select any province on the "63-Province Digital Map" on the home page to view local showrooms & stores.\n2. Click the "📍 Điểm Bán" button on any product card for cooperative details, hotline, and Google Maps directions!'
                :'📍 Mạng lưới Showroom & Điểm bán O2O OCOP chính hãng:\n\n• [Trung tâm XTTM & Trưng bày OCOP Quốc Gia (Hà Nội)](https://www.google.com/maps/search/?api=1&query=Trung+t%C3%A2m+X%C3%BAc+ti%E1%BA%BFn+Th%C6%B0%C6%A1ng+m%E1%BA%A1i+OCOP+Qu%E1%BB%91c+Gia+489+Ho%C3%A0ng+Qu%E1%BB%91c+Vi%E1%BB%87t) — Số 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội (Hotline: 024.3755.8899 | Giờ mở cửa: 08:00 - 21:30)\n• [Điểm Giới thiệu & Bán SP OCOP Big C Thăng Long (Hà Nội)](https://www.google.com/maps/search/?api=1&query=Big+C+Th%C4%83ng+Long+222+Tr%E1%BA%A7n+Duy+H%C6%B0ng) — Tầng 1, TTTM Big C Thăng Long, 222 Trần Duy Hưng, Cầu Giấy, Hà Nội (Hotline: 024.3784.8888)\n• [Trung tâm Trưng bày & Phân phối OCOP Vùng Miền (TP.HCM)](https://www.google.com/maps/search/?api=1&query=459+Chu+V%C4%83n+An+B%C3%ACnh+Th%E1%BA%A1nh+TP+HCM) — Số 459 Chu Văn An, Phường 12, Quận Bình Thạnh, TP.HCM (Hotline: 028.3899.6677 | Giờ mở cửa: 08:00 - 21:00)\n• [Điểm Bán & Quảng bá OCOP Miền Trung - Tây Nguyên (Đà Nẵng)](https://www.google.com/maps/search/?api=1&query=08+C%C3%A1ch+M%E1%BA%A1ng+Th%C3%A1ng+T%C3%A1m+C%E1%BA%A9m+L%E1%BB%87+%C4%90%C3%A0+N%E1%BA%B5ng) — Số 08 Cách Mạng Tháng Tám, Quận Cẩm Lệ, TP. Đà Nẵng (Hotline: 0236.388.9911)\n\n💡 Cách tra cứu trên hệ thống:\n1. Chọn tỉnh thành trên "Bản Đồ Số 63 Tỉnh Thành" ngay trang chủ để xem danh sách điểm bán OCOP của từng tỉnh.\n2. Bấm nút "📍 Điểm Bán" tại bất kỳ thẻ sản phẩm nào để xem chi tiết địa chỉ Hợp tác xã, hotline và mở Google Maps chỉ đường tận nơi!';
        }
        else if(intent.isCombo&&intent.maxPrice){
            const reply=shopping.replyOptions(shopping.variants(products,intent),intent,language);
            message=reply.message;ids=reply.productIds||[];combos=reply.combos||[];
        }else{
            const scoped=Boolean(intent.exactRegion||intent.regionKeyword||intent.categoryOrKeyword||intent.maxPrice||intent.minStars||intent.pricePreference);
            const selected=scoped?shopping.recommendations(products.filter(p=>shopping.allowed(p,intent)),intent).slice(0,3):[];
            ids=selected.map(p=>p.id);
            message=selected.length?(en?'Products matching your request:\n':'Dạ, anh/chị tham khảo các sản phẩm trong danh mục:\n')+selected.map(p=>`• ${en?p.nameEn||p.name:p.name} (${p.region}) — ${p.price.toLocaleString('vi-VN')} ₫/${p.packaging||'đơn vị'}`).join('\n')
                :scoped?(en?'No catalogue item matches these requirements. Would you like to adjust the province or product type?':'Chưa có sản phẩm phù hợp trong danh mục. Anh/chị muốn đổi tỉnh hoặc loại sản phẩm không?')
                :(/ảnh|anh|hinh anh|photo|image|picture|nhin|xem|day la/i.test(query)
                ? (function() {
                    const isQue = /que|cinnamon/i.test(query);
                    const topProds = isQue ? products.filter(p => /quế|cinnamon/i.test(p.name)) : products.filter(p => p.stars === 5 || p.id === 349 || p.id === 506);
                    ids = topProds.slice(0, 3).map(p => p.id);
                    return en
                        ? 'I have received your image! Here are recommended 5-star OCOP specialties from our official catalogue for your reference:'
                        : 'Dạ, em đã nhận được hình ảnh nông đặc sản của anh/chị! Hệ thống OCOP Quốc Gia xin gợi ý các sản phẩm chuẩn sao chính hãng nổi bật tương ứng dưới đây để anh/chị tham khảo ngay nhé:';
                })()
                : (en?'Which product, province or gift budget are you interested in?':'Anh/chị muốn tìm sản phẩm, đặc sản tỉnh nào hoặc quà trong ngân sách bao nhiêu ạ?'));
        }
        const reply={message,text_response:message,productIds:ids,suggested_products:ids,combos,dynamic_chips:en?['Find products','Gift ideas','Store locations']:['Tìm đặc sản','Gợi ý quà biếu','Tìm điểm bán'],handoffAdmin:Boolean(intent.isComplaint||intent.isCSKH),localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        return locations?locations.appendProductLocations(reply,products,intent,root.OcopStores,language):reply;
    }
    if(typeof module==='object'&&module.exports)module.exports={catalogReply};else root.OCOPChatFallback={catalogReply};
})(typeof globalThis!=='undefined'?globalThis:this);
