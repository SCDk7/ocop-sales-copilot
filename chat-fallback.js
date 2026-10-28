(function(root){
    'use strict';
    const analyzer=typeof module==='object'&&module.exports?require('./ai-request-analysis'):root.OCOPRequestAnalysis;
    function imageUnavailableReply(language='vi',query='',products=[],history=[]) {
        const analysis=analyzer.analyzeCustomerRequest([...history,{role:'user',text:query}],products,{language,hasImages:true});
        const message = language === 'en'
            ? 'Image recognition is currently unavailable. Please provide the product name or visible label text so I can help with product information or your complaint.'
            : 'Hiện em chưa nhận diện được ảnh. Anh/chị cho em tên sản phẩm hoặc nội dung trên nhãn để em tư vấn, hỗ trợ hoặc tiếp nhận khiếu nại nhé.';
        return {message,text_response:message,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],imageMatchStatus:'unknown',understandingStatus:'needs_clarification',handoffAdmin:Boolean(analysis.intent.isComplaint||analysis.intent.isCSKH),localFallback:true,aiProvider:'local_catalog',requestAnalysis:{...analysis.summary,needsClarification:true},integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
    }
    function catalogReply(query,products,language='vi',history=[]){
        const analysis=analyzer.analyzeCustomerRequest([...history,{role:'user',text:query}],products,{language});
        const reply=catalogReplyAfterAnalysis(query,products,language,history,analysis);
        return {...reply,requestAnalysis:{...analysis.summary,needsClarification:Boolean(analysis.summary.needsClarification||reply.understandingStatus==='needs_clarification')}};
    }
    function catalogReplyAfterAnalysis(query,products,language,history,analysis){
        const intent=analysis.intent;
        const assistant=typeof module==='object'&&module.exports?require('./ai-scenarios'):root.OCOPSalesAssistant;
        if(analysis.clarification)return {message:analysis.clarification,text_response:analysis.clarification,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],understandingStatus:'needs_clarification',localFallback:true,aiProvider:'local_catalog'};
        if(intent.isComplaint||intent.isCSKH){
            const scenario=assistant?.scenarioReply(query,language);
            const message=scenario?.message||(language==='en'?'Please describe the issue with your order. You can contact staff using the support button below.':'Anh/chị mô tả vấn đề cần hỗ trợ với đơn hàng nhé. Anh/chị có thể liên hệ nhân viên qua nút hỗ trợ bên dưới.');
            return {message,text_response:message,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],handoffAdmin:true,localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        }
        const training=typeof module==='object'&&module.exports?require('./product-training'):root.OCOPProductTraining;
        const trainedReply=training?.answerTrainingQuery(query,products,language,history);
        if(trainedReply) return {...trainedReply,localFallback:true};
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
        const normQ = (query || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd');
        const isGeneralShowroom = (/(?:mang luoi|he thong|danh sach|tra cuu)\s+(?:cac\s+)?(?:showroom|diem ban|cua hang)\b|(?:showroom|diem ban|store|store location)\s*(?:network|o2o|he thong|mang luoi)\b|(?:network|list of)\s+(?:showrooms?|stores?)|(?:showroom|diem ban)\s+o2o|o2o\s+(?:showroom|diem ban|store)|(?:ban do so|digital map).*(?:showroom|diem ban|store)|(?:showroom|diem ban|store).*(?:ban do so|digital map)/i.test(normQ) || (/diem ban|showroom/i.test(normQ) && /toan quoc|tat ca|he thong|chinh hang|ban do|nationwide|all stores/i.test(normQ))) && !/(?:san pham nay|mon nay|hang nay|this product|this item)/i.test(normQ);
        if (isGeneralShowroom) {
            intent.isStoreLookup = true;
            intent.categoryOrKeyword = null;
            intent.isCombo = false;
            intent.isGift = false;
            intent.maxPrice = null;
            intent.minPrice = null;
            if (!intent.exactRegion) {
                intent.exactRegions = [];
                intent.regionKeyword = null;
            }
        }
        intent.knowledgeQuery=query;
        const en=language==='en';let message,ids=[],combos=[];
        if(intent.isComplaint||intent.isCSKH)message=en?'Please describe your request and provide your order number if available so staff can help.':'Anh/chị mô tả yêu cầu và cung cấp mã đơn nếu có để nhân viên hỗ trợ nhé.';
        else if(intent.isVoucher) {
            message = en
                ? 'Currently, OCOP Vietnam offers several active discount vouchers for you:\n\n• **OCOP2026**: 50,000₫ OFF on all orders (2026 Appreciation code).\n• **FREESHIP**: Free shipping nationwide (-25,000₫).\n• **GIAM20K**: 20,000₫ OFF directly on your order.\n• **GIAM100K**: 100,000₫ OFF for orders from 500,000₫.\n• **COMBOVIP**: 100,000₫ OFF + OCOP Gift Box for combo orders from 899,000₫.\n\n👉 How to use: Enter the code in the "Voucher Code" box at checkout or click "Copy Code" on the homepage banner to apply instantly!'
                : 'Dạ, hiện tại hệ thống OCOP Việt Nam đang có các mã giảm giá và voucher ưu đãi cực tốt dành cho anh/chị đây ạ:\n\n• **OCOP2026**: Giảm ngay **50.000 đ** cho mọi đơn hàng (Mã tri ân OCOP 2026).\n• **FREESHIP**: Miễn phí vận chuyển toàn quốc (**-25.000 đ** phí ship).\n• **GIAM20K**: Giảm **20.000 đ** trực tiếp vào đơn hàng.\n• **GIAM100K**: Giảm ngay **100.000 đ** cho đơn hàng từ 500.000 đ trở lên.\n• **COMBOVIP**: Giảm **100.000 đ + Tặng Hộp quà OCOP** cho đơn combo từ 899.000 đ.\n\n👉 **Cách áp dụng:** Khi thanh toán giỏ hàng, anh/chị chỉ cần nhập mã vào ô **"Mã voucher"** hoặc bấm **"Lưu mã"** tại banner Ưu Đãi trên trang chủ để được giảm giá trực tiếp nhé!';
            ids = [];
        }
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
        }
        else if(/(?:b2b|doanh nghiep|set qua|qua tang doanh nghiep|qua bieu doanh nghiep|hop qua doanh nghiep|hop qua b2b|combo qua doanh nghiep)/i.test(normQ)){
            const b2bItems = products.filter(p => p.stars === 5 || [525, 526, 342, 336, 360, 506, 349].includes(p.id)).slice(0, 4);
            ids = b2bItems.map(p => p.id);
            message = en
                ? '🎁 OCOP Vietnam Corporate & B2B Gift Solutions (63 Provinces):\n\n• Attractive discounts (10% - 25%) for corporate bulk orders, conferences, and holiday gifting.\n• Customized premium gift box design with branded company logo engraving.\n• 100% official 4-5 Star National OCOP specialties with official VAT invoices and food safety certificates.\n\nRecommended prestigious specialties for corporate gift sets:'
                : '🎁 Dạ, OCOP Việt Nam hân hạnh tư vấn giải pháp **Set Quà Tặng Doanh Nghiệp (B2B)** cao cấp từ đặc sản 63 tỉnh thành:\n\n✨ **Chính sách ưu đãi doanh nghiệp:**\n• Chiết khấu hấp dẫn từ **10% - 25%** cho đơn hàng số lượng lớn (sự kiện, hội nghị, tri ân đối tác, quà Tết).\n• Thiết kế hộp quà sang trọng & in khắc logo doanh nghiệp theo nhận diện riêng.\n• Sản phẩm đạt chuẩn **OCOP 4-5 sao Quốc Gia**, đầy đủ hóa đơn VAT và giấy chứng nhận VSATTP.\n\nDưới đây là các dòng đặc sản thượng hạng tiêu biểu được nhiều cơ quan & doanh nghiệp lựa chọn:';
        }else{
            const scoped=Boolean(intent.exactRegion||intent.regionKeyword||intent.categoryOrKeyword||intent.maxPrice||intent.minStars||intent.pricePreference);
            const selected=scoped?shopping.recommendations(products.filter(p=>shopping.allowed(p,intent)),intent).slice(0,3):[];
            ids=selected.map(p=>p.id);
            message=selected.length?(en?'Products matching your request:\n':'Dạ, anh/chị tham khảo các sản phẩm trong danh mục:\n')+selected.map(p=>`• ${en?p.nameEn||p.name:p.name} (${p.region}) — ${p.price.toLocaleString('vi-VN')} ₫/${p.packaging||'đơn vị'}`).join('\n')
                :scoped?(en?'No catalogue item matches these requirements. Would you like to adjust the province or product type?':'Chưa có sản phẩm phù hợp trong danh mục. Anh/chị muốn đổi tỉnh hoặc loại sản phẩm không?')
                : (en?'Which product, province or gift budget are you interested in?':'Anh/chị muốn tìm sản phẩm, đặc sản tỉnh nào hoặc quà trong ngân sách bao nhiêu ạ?');
            message=locations?.regionalAdviceMessage(selected,intent,language)||message;
        }
        const reply={message,text_response:message,productIds:ids,suggested_products:ids,combos,dynamic_chips:en?['Find products','Gift ideas','Store locations']:['Tìm đặc sản','Gợi ý quà biếu','Tìm điểm bán'],handoffAdmin:Boolean(intent.isComplaint||intent.isCSKH),localFallback:true,aiProvider:'local_catalog',integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
        return locations?locations.appendProductLocations(reply,products,intent,root.OcopStores,language):reply;
    }
    if(typeof module==='object'&&module.exports)module.exports={catalogReply,imageUnavailableReply};else root.OCOPChatFallback={catalogReply,imageUnavailableReply};
})(typeof globalThis!=='undefined'?globalThis:this);
