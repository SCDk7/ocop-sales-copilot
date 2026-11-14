// AI tot hon.js - OCOP AI Engine
const pkg = (typeof require !== 'undefined') ? require('./data.js') : (typeof window !== 'undefined' ? { PRODUCTS: window.PRODUCTS } : { PRODUCTS: [] });
const PRODUCTS = (pkg && (pkg.PRODUCTS || pkg.products)) || [];

class AIEngine {
    constructor() {
        this.history = [];
    }

    // Xử lý tiếng Việt không dấu
    removeAccents(str) {
        return String(str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // AI địa phương phản hồi tức thì
    getLocalResponse(query) {
        const norm = this.removeAccents(query.trim());

        if (norm.includes('ban') || norm.includes('danh sach') || norm.includes('co gi') || norm.includes('dac san')) {
            const listText = PRODUCTS.slice(0, 15).map(p => `• **${p.nameVi || p.name}** (${Number(p.price || 0).toLocaleString('vi-VN')} ₫)`).join('\n');
            return `Dạ em chào Quý khách! 🌱 **OCOP Sales Copilot** hiện có các đặc sản chuẩn OCOP 4-5 sao:\n\n${listText}\n\nQuý khách muốn xem chi tiết món nào ạ?`;
        }

        const matched = PRODUCTS.find(p => norm.includes(this.removeAccents(p.nameVi || p.name)) || norm.includes(this.removeAccents(p.province || p.region)));
        if (matched) {
            const name = matched.nameVi || matched.name;
            const prov = matched.province || matched.region;
            const star = matched.star || matched.stars;
            const desc = matched.descVi || matched.desc;
            return `✨ **Thông Tin Đặc Sản:**\n\n📌 **${name}**\n• **Tỉnh/Thành:** ${prov}\n• **Hạng:** OCOP ${star} Sao\n• **Giá:** ${Number(matched.price || 0).toLocaleString('vi-VN')} ₫\n• **Công dụng:** ${desc}`;
        }

        return null; // Trả về null nếu câu hỏi phức tạp -> Chuyển sang Gemini API
    }

    async ask(query) {
        // 1. Kiểm tra AI địa phương trước
        const localReply = this.getLocalResponse(query);
        if (localReply) return localReply;

        // 2. Nếu không có kết quả địa phương, gọi Gemini API
        try {
            this.history.push({ role: 'user', parts: [{ text: query }] });
            
            const request=typeof window!=='undefined'&&window.OCOPAuth?window.OCOPAuth.fetch:fetch;
            const response=await request(typeof getAIEndpoint==='function'?getAIEndpoint('/api/ai/chat'):'/api/ai/chat',{
                method:'POST',headers:{'Content-Type':'application/json'},
                body:JSON.stringify({language:'vi',messages:this.history.slice(-15).map(m=>({role:m.role==='model'?'assistant':'user',text:m.parts[0].text}))})
            });
            const data=await response.json();if(!response.ok)throw Error(data.error||'AI unavailable');
            const reply=data.message||data.text_response;
            this.history.push({role:'model',parts:[{text:reply}]});
            return reply;
        } catch (err) {
            return "Dạ hiện tại kết nối mạng hơi chập chờn, Quý khách có thể xem danh mục đặc sản bên trên hoặc thử lại sau ít phút ạ! 🌱";
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIEngine };
}
if (typeof window !== 'undefined') {
    window.AIEngine = AIEngine;
}