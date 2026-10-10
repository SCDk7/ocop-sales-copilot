'use strict';
const {normalize}=require('./ai-shopping');

const scenarioInstruction = `CUSTOMER SCENARIOS:
1. Vague requests: ask one focused question about the missing purpose or budget instead of a long product list. Never advertise example products as actual shop inventory.
2. Requested quality or quantity beyond budget: explain the mismatch using supplied catalogue prices. Suggest only verified alternatives that preserve the budget and province; ask before relaxing any constraint. Higher price does not prove better quality.
3. Insufficient stock: report exact availability only from a successful backend inventory result. Ask whether the customer accepts a verified alternative or staff review. Do not promise replenishment, split delivery, reservations or dates without backend confirmation.
4. Origin and certification: use product-specific records for production location, OCOP stars, certification year, ingredients, organic status, usage and storage. Wikipedia supports cultural background, not certification of this product. Never promise absolute food safety or invent certification years. Say which information is unavailable and offer seller verification.
5. Purchase: retain product, quantity, recipient and delivery details already supplied. Ask only for missing details. Show prices, shipping fees and totals only when supported by backend data, labelling reference prices clearly. Draft order IDs and successful handoffs require actual backend results. Without these tools, offer seller confirmation and set handoffAdmin=true, without claiming a draft was created or staff already received it.
6. Complaints or requests for a human: acknowledge the specific concern with empathy, apologize briefly for a reported bad experience, ask for an order number or relevant photo if needed, and set handoffAdmin=true. Do not continue selling. Do not claim an urgent ticket exists, a refund is approved or a callback will occur within 15 minutes without backend evidence.
All example names, prices, quantities, dates and order IDs in user-provided scenario documents are illustrations, not shop facts.`;

function scenarioReply(text, language='vi') {
 const q=normalize(text),en=language==='en';
 const human=/gap (?:nguoi that|nhan vien|quan ly)|noi chuyen voi (?:nguoi that|nhan vien|quan ly)|human agent|speak to (?:a )?(?:human|person|manager)/.test(q);
 const damaged=/mop|meo|vo hong|bi vo|bi hong|hu hong|bi moc|oi thiu|damaged|broken/.test(q) && !/cach |bao quan|tranh |how to|prevent/.test(q);
 const complaint=/khieu nai|phan nan|shop lam an|complaint|doi tra|hoan tien/.test(q) || damaged;
 if (human || complaint) return {message:complaint
   ? (en ? 'I am sorry about the problem you reported. Please provide your order number or a photo if available so staff can review it. You can contact staff using the support button below; a refund or replacement needs their confirmation.' : 'Dạ, em rất tiếc và xin lỗi anh/chị về sự cố vừa phản ánh. Anh/chị gửi mã đơn hoặc ảnh nếu có để nhân viên kiểm tra nhé. Anh/chị có thể liên hệ nhân viên qua nút hỗ trợ bên dưới; việc đổi trả cần được nhân viên xác nhận.')
   : (en ? 'You can contact staff using the support button below. What would you like them to help with?' : 'Dạ, anh/chị có thể liên hệ nhân viên qua nút hỗ trợ bên dưới. Anh/chị cần hỗ trợ vấn đề gì ạ?'),handoffAdmin:true};
 if (/^(?:shop oi\s*)?(?:co dac san gi ngon khong|tu van (?:cho minh |cho toi )?qua bieu(?: voi)?|goi y qua bieu)(?:\s*[.!?]*)$/.test(q)) return {message:en ? 'What budget would you like per gift?' : 'Dạ, anh/chị dự kiến ngân sách khoảng bao nhiêu cho mỗi phần quà ạ?',needsClarification:true};
 return null;
}
module.exports={scenarioInstruction,scenarioReply};
