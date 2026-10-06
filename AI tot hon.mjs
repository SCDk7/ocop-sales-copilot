// js/ai-engine.js
import pkg from './data.mjs';
const { PRODUCTS } = pkg;

export class AIEngine {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.history = [];
    }

    // Xử lý tiếng Việt không dấu
    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // AI địa phương phản hồi tức thì
    getLocalResponse(query) {
        const norm = this.removeAccents(query.trim());

        if (norm.includes('ban') || norm.includes('danh sach') || norm.includes('co gi') || norm.includes('dac san')) {
            const listText = PRODUCTS.map(p => `• **${p.nameVi}** (${p.price.toLocaleString('vi-VN')} ₫)`).join('\n');
            return `Dạ em chào Quý khách! 🌱 **OCOP Sales Copilot** hiện có 20 đặc sản chuẩn OCOP 4-5 sao:\n\n${listText}\n\nQuý khách muốn xem chi tiết món nào ạ?`;
        }

        const matched = PRODUCTS.find(p => norm.includes(this.removeAccents(p.nameVi)) || norm.includes(this.removeAccents(p.province)));
        if (matched) {
            return `✨ **Thông Tin Đặc Sản:**\n\n📌 **${matched.nameVi}**\n• **Tỉnh/Thành:** ${matched.province}\n• **Hạng:** OCOP ${matched.star} Sao\n• **Giá:** ${matched.price.toLocaleString('vi-VN')} ₫\n• **Công dụng:** ${matched.descVi}`;
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
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: this.history })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Dạ em là Trợ lý AI OCOP, em có thể hỗ trợ gì thêm cho Quý khách ạ?";
            
            this.history.push({ role: 'model', parts: [{ text: reply }] });
            return reply;
        } catch (err) {
            return "Dạ hiện tại kết nối mạng hơi chập chờn, Quý khách có thể xem danh mục đặc sản bên trên hoặc thử lại sau ít phút ạ! 🌱";
        }
    }
}
