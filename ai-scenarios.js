'use strict';
const {normalize}=typeof module==='object' && module.exports ? require('./ai-shopping') : window.AIShopping;

const scenarioInstruction = `CUSTOMER SCENARIOS:
Before answering every customer question, privately interpret the latest message together with the conversation, identify all requested tasks, retain stated product/province/budget/quantity/exclusions, and apply the latest corrections. Prioritize complaints and support over selling. Check relevant supplied catalogue or tool evidence before writing. If essential information is missing, ask one focused question and do not invent it. Keep the final reply direct and helpful; do not expose internal reasoning or present unverified assumptions as facts.
You are a customer-facing OCOP sales and support assistant. Your three primary tasks are product consultation, helping the customer complete a confirmed purchase, and complaint support. Consult current catalogue and product knowledge before answering. For purchase intent summarize verified products, quantity and known subtotal, ask one missing detail at a time, and direct customers to actual cart/order controls. Never claim an order is confirmed without a successful backend result. For complaints stop upselling, collect the order reference and specific issue, request relevant evidence only as needed, and offer staff review. Never request passwords, OTPs or full payment-card details.
The storefront offers OCOP product information, gifts, store locations and ordering. Cash-flow analysis, financial simulations, COGS/OPEX, margin projections and commission analytics are unavailable. Do not offer these features or suggest them in quick replies. Product prices, order totals and shipping fees remain supported.
1. Vague requests: ask one focused question about the missing purpose or budget instead of a long product list. Never advertise example products as actual shop inventory.
2. Requested quality or quantity beyond budget: explain the mismatch using supplied catalogue prices. Suggest only verified alternatives that preserve the budget and province; ask before relaxing any constraint. Higher price does not prove better quality.
3. Insufficient stock: report exact availability only from a successful backend inventory result. Ask whether the customer accepts a verified alternative or staff review. Do not promise replenishment, split delivery, reservations or dates without backend confirmation.
4. Origin and certification: use product-specific records for production location, OCOP stars, certification year, ingredients, organic status, usage and storage. Wikipedia supports cultural background, not certification of this product. Never promise absolute food safety or invent certification years. Say which information is unavailable and offer seller verification.
5. Purchase: retain product, quantity, recipient and delivery details already supplied. Ask only for missing details. Show prices, shipping fees and totals only when supported by backend data, labelling reference prices clearly. Draft order IDs and successful handoffs require actual backend results. Without these tools, offer seller confirmation and set handoffAdmin=true, without claiming a draft was created or staff already received it.
6. Complaints or requests for a human: acknowledge the specific concern with empathy, apologize briefly for a reported bad experience, ask for an order number or relevant photo if needed, and set handoffAdmin=true. Do not continue selling. Do not claim an urgent ticket exists, a refund is approved or a callback will occur within 15 minutes without backend evidence.
All example names, prices, quantities, dates and order IDs in user-provided scenario documents are illustrations, not shop facts.
FIVE SALES ASSISTANT ROLES (reply naturally as one assistant, not as a list of agents):
1. Product advisor: understand taste, occasion, gift recipient, region and budget from conversation. Recommend catalogue matches with their actual names, prices and OCOP stars. Product stories must come from product knowledge; cultural background must be attributed.
2. Order assistant: help choose quantities and use the purchase/cart controls. Ask only for missing order details. Fetch authenticated order status through available tools; never infer delivery progress or shipping fees.
3. After-sales assistant: explain product-specific storage from verified instructions, otherwise ask for product/label. Acknowledge damaged packaging, request order reference/photo, and offer human support without approving refunds.
4. Review assistant: invite honest feedback after use, help the customer open the product review form. Never fabricate reviews, confirm an unsubmitted review, or reuse feedback in marketing without consent.
5. Repurchase assistant: help rebuild the customer's requested basket from the current catalogue. Cart reminders, scheduled messages and purchase-history access require real tools, authentication and explicit consent; do not pretend they have been enabled.
The Biglead/CRM/multi-channel proposal describes desired behavior, not proof of integrations. Do not claim Facebook, Zalo, TikTok, Biglead CRM, document ingestion, automatic follow-ups, 3-second responses or 80% automation are active without tool evidence. Do not send unsolicited messages. Ask one short useful question, preserve context, and prioritize support over selling.`;

function lifecycleReply(text, language='vi') {
 const q=normalize(text),en=language==='en';
 const reply=(agent,message,english,handoffAdmin=false)=>({agent,message:en?english:message,handoffAdmin});
 if (/biglead|crm|da kenh|multi.?channel|5 (?:ai )?agent|nam tro ly|facebook.*zalo|zalo.*tiktok/.test(q)) return reply('capabilities',
  'Em hỗ trợ tư vấn đặc sản, hướng dẫn đặt hàng, bảo quản và đổi trả, gửi đánh giá, gợi ý mua lại ngay trong chat. Đồng bộ Biglead, Facebook, Zalo, TikTok và nhắn tin tự động cần kết nối dịch vụ thực tế; hiện em chưa có xác nhận các kết nối đó. Anh/chị muốn được hỗ trợ phần nào?',
  'I can advise on products, ordering, after-sales care, reviews and repurchasing here. Biglead CRM, social channels and automatic messaging require verified service connections. Which area can I help with?');
 if (/nhac.*gio hang|gio hang.*bo quen|nhac.*mua lai|tu dong.*nhan tin|abandoned cart|remind me|automatic.*message/.test(q)) return reply('repurchase',
  'Em có thể giúp chọn lại sản phẩm trong cuộc trò chuyện này. Gửi nhắc giỏ hàng hoặc mua lại tự động cần hệ thống nhắn tin đã kết nối và sự đồng ý của anh/chị; em chưa bật lời nhắc nào. Anh/chị muốn mua lại món nào?',
  'I can help rebuild your basket here. Automatic reminders require a connected messaging service and your consent; no reminder has been enabled. What would you like to buy again?');
 if (/bao quan|han su dung|storage|shelf life|expiry/.test(q)) return reply('after_sales',
  'Anh/chị cho em tên sản phẩm hoặc ảnh nhãn nhé. Em sẽ hướng dẫn theo thông tin bảo quản và hạn dùng đã có của đúng sản phẩm; nếu chưa có dữ liệu, cần xác nhận với cửa hàng, không tự suy ra hạn dùng.',
  'Please share the product name or a label photo. I will use its documented storage and expiry instructions; missing details need seller confirmation.');
 if (/gui (?:danh gia|review)|viet (?:danh gia|review)|muon danh gia|gop y.*san pham|leave (?:a )?review|submit.*review/.test(q)) return reply('reviews',
  'Cảm ơn anh/chị! Anh/chị muốn đánh giá sản phẩm nào? Mở “Xem nhanh” của sản phẩm để gửi nhận xét thật về hương vị, chất lượng và đóng gói; em chưa ghi nhận đánh giá khi anh/chị chưa gửi biểu mẫu.',
  'Thank you! Which product would you like to review? Open its quick view to submit honest feedback on taste, quality and packaging. A review is saved only after the form is submitted.');
 if (/don (?:hang )?(?:cua toi|cua minh|dang o dau)|kiem tra.*don|theo doi.*don|tinh trang.*don|track.*order|order status/.test(q)) return reply('orders',
  'Anh/chị đăng nhập và mở mục đơn hàng trong tài khoản để xem thông tin của mình nhé. Nếu cần kiểm tra thêm, anh/chị gửi mã đơn qua kênh CSKH; em chưa xác minh được trạng thái giao hàng từ tin nhắn này.',
  'Please sign in and open your account orders. For further help, share the order reference with customer support; I cannot verify delivery status from this message.',true);
 if (/huong dan.*dat hang|ho tro dat hang|how (?:do|can) i (?:place|make) an order|help (?:me )?(?:place|placing) an order/.test(q)) return reply('ordering',
  'Dạ, anh/chị chọn sản phẩm rồi bấm “Mua ngay” hoặc thêm vào giỏ hàng. Sau đó mở Giỏ hàng, kiểm tra số lượng và điền thông tin nhận hàng để tiếp tục đặt hàng. Anh/chị muốn đặt sản phẩm nào ạ?',
  'Choose a product and click “Buy now” or add it to your cart. Then open the cart, check the quantities and enter the delivery details to continue ordering. Which product would you like to order?');
 return null;
}

function scenarioReply(text, language='vi') {
 const q=normalize(text),en=language==='en';
 const human=/gap (?:nguoi that|nhan vien|quan ly)|noi chuyen voi (?:nguoi that|nhan vien|quan ly)|human agent|speak to (?:a )?(?:human|person|manager)/.test(q);
 const damaged=/mop|meo|vo hong|bi vo|bi hong|hu hong|bi moc|oi thiu|damaged|broken/.test(q) && !/cach |bao quan|tranh |how to|prevent/.test(q);
 const complaint=/khieu nai|phan nan|shop lam an|complaint|doi tra|hoan tien/.test(q) || damaged;
 if (human || complaint) return {message:complaint
   ? (en ? 'I am sorry about the problem you reported. Please provide your order number or a photo if available so staff can review it. You can contact staff using the support button below; a refund or replacement needs their confirmation.' : 'Dạ, em rất tiếc và xin lỗi anh/chị về sự cố vừa phản ánh. Anh/chị gửi mã đơn hoặc ảnh nếu có để nhân viên kiểm tra nhé. Anh/chị có thể liên hệ nhân viên qua nút hỗ trợ bên dưới; việc đổi trả cần được nhân viên xác nhận.')
   : (en ? 'You can contact staff using the support button below. What would you like them to help with?' : 'Dạ, anh/chị có thể liên hệ nhân viên qua nút hỗ trợ bên dưới. Anh/chị cần hỗ trợ vấn đề gì ạ?'),handoffAdmin:true};
 const voucher = /\b(ma giam gia|ma uu dai|ma khuyen mai|vouchers?|coupons?|promo codes?|discounts?)\b|\b(?:co|xin|cho|hoi|tim)\b.*\b(?:giam gia|khuyen mai|uu dai)\b|\b(?:giam gia|khuyen mai|uu dai)\b.*\b(?:khong|ko|gi|j|nao|chua)\b/i.test(q);
 if (voucher) return {message:en
   ? 'Currently, OCOP Vietnam offers several active discount vouchers for you:\n\n• **OCOP2026**: 50,000₫ OFF on all orders (2026 Appreciation code).\n• **FREESHIP**: Free shipping nationwide (-25,000₫).\n• **GIAM20K**: 20,000₫ OFF directly on your order.\n• **GIAM100K**: 100,000₫ OFF for orders from 500,000₫.\n• **COMBOVIP**: 100,000₫ OFF + OCOP Gift Box for combo orders from 899,000₫.\n\n👉 How to use: Enter the code in the "Voucher Code" box at checkout or click "Copy Code" on the homepage banner to apply instantly!'
   : 'Dạ, hiện tại hệ thống OCOP Việt Nam đang có các mã giảm giá và voucher ưu đãi cực tốt dành cho anh/chị đây ạ:\n\n• **OCOP2026**: Giảm ngay **50.000 đ** cho mọi đơn hàng (Mã tri ân OCOP 2026).\n• **FREESHIP**: Miễn phí vận chuyển toàn quốc (**-25.000 đ** phí ship).\n• **GIAM20K**: Giảm **20.000 đ** trực tiếp vào đơn hàng.\n• **GIAM100K**: Giảm ngay **100.000 đ** cho đơn hàng từ 500.000 đ trở lên.\n• **COMBOVIP**: Giảm **100.000 đ + Tặng Hộp quà OCOP** cho đơn combo từ 899.000 đ.\n\n👉 **Cách áp dụng:** Khi thanh toán giỏ hàng, anh/chị chỉ cần nhập mã vào ô **"Mã voucher"** hoặc bấm **"Lưu mã"** tại banner Ưu Đãi trên trang chủ để được giảm giá trực tiếp nhé!'};
 if (/dong tien|cash[ -]?flow|phan tich tai chinh|quan tri tai chinh|bien loi nhuan|profit margin|financial (?:engine|analysis)|\b(?:cogs|opex|chm)\b/.test(q)) return {message:en ? 'I can help with OCOP products, prices, gift recommendations, store locations and ordering. What product would you like to find?' : 'Em hỗ trợ thông tin đặc sản OCOP, giá bán, quà biếu, điểm bán và đặt hàng. Anh/chị muốn tìm sản phẩm nào ạ?'};
 if (/^(?:shop oi\s*)?(?:co dac san gi ngon khong|tu van (?:cho minh |cho toi )?qua bieu(?: voi)?|goi y qua bieu)(?:\s*[.!?]*)$/.test(q)) return {message:en ? 'What budget would you like per gift?' : 'Dạ, anh/chị dự kiến ngân sách khoảng bao nhiêu cho mỗi phần quà ạ?',needsClarification:true};
 if (/(?:can |muon |xin )?tu van (?:giup |cho )?(?:toi |minh |em )?(?:chon |tim )?(?:dac san|san pham|qua bieu|combo)|tu van san pham|tu van dac san|goi y dac san|co dac san gi/i.test(q) && !/dong nai|ha noi|da nang|tp hcm|quang binh|lam dong|can tho|tinh |gia bao nhieu|duoi |trieu|nghin|k\b/i.test(q)) {
  return {
   message: en
     ? 'Welcome to OCOP Vietnam! We have over 252 certified 3–5 star specialties from 63 provinces across 3 regions:\n\n• **Northern Region:** Ancient Shan Tuyet tea, Tranh Khuc square cake, Ba Be vermicelli, wild honey.\n• **Central & Highlands:** Bird nest, Ngoc Linh ginseng, Buon Ma Thuot coffee, dried beef.\n• **Southern Region:** Soc Trang pia cake, Phu Quoc fish sauce, An Giang palm sugar, Binh Phuoc cashews.\n\nWhich province or budget range (e.g. under 500k, gift set 1–2 million) are you looking for so I can recommend the best products for you?'
     : 'Dạ, em sẵn sàng tư vấn đặc sản OCOP chính hãng tiêu biểu cho anh/chị ngay đây ạ! Hiện hệ thống có hơn 252 đặc sản chuẩn 3–5 sao khắp 63 tỉnh thành:\n\n• **Đặc sản miền Bắc:** Trà cổ thụ Shan Tuyết, bánh chưng Tranh Khúc, miến dong Ba Bể, mật ong rừng.\n• **Đặc sản miền Trung - Tây Nguyên:** Yến sào, sâm Ngọc Linh, cà phê Đắk Lắk, bò một nắng.\n• **Đặc sản miền Nam:** Bánh pía Sóc Trăng, nước mắm Phú Quốc, đường thốt nốt An Giang, hạt điều rang muối.\n\nAnh/chị đang muốn tìm đặc sản của tỉnh thành nào hoặc theo mức ngân sách bao nhiêu để em gợi ý chuẩn xác nhất ạ?',
   needsClarification: true
  };
 }
 return null;
}
const originalScenarioReply=scenarioReply;
function salesAssistantReply(text,language='vi') {
 return originalScenarioReply(text,language) || lifecycleReply(text,language);
}
if(typeof module==='object' && module.exports) module.exports={scenarioInstruction,scenarioReply:salesAssistantReply,lifecycleReply};
else window.OCOPSalesAssistant={scenarioInstruction,scenarioReply:salesAssistantReply,lifecycleReply};
