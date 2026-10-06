(function (root) {
    class AIEngine {
        constructor(options = {}) {
            if (!options || typeof options !== 'object') options = {};
            this.products = options.products || (typeof module !== 'undefined' && module.exports ? require('./data.js').PRODUCTS : root.PRODUCTS || []);
            this.language = options.language === 'en' ? 'en' : 'vi';
            this.endpoint = options.endpoint || (root.location?.protocol === 'file:' ? 'http://localhost:3000/api/ai/chat' : '/api/ai/chat');
            this.history = [];
        }
        removeAccents(text) {
            return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0111/g, 'd').toLowerCase();
        }
        getLocalResponse(query) {
            const q = this.removeAccents(query.trim());
            const fiveStars = /5\s*(?:sao|s\b|stars?)|nam sao/.test(q);
            let matches = fiveStars ? this.products.filter(p => p.stars === 5) : this.products.filter(p => q.includes(this.removeAccents(p.name)) || q.includes(this.removeAccents(p.region)));
            if (!matches.length && /dac san|danh sach|san pham|products|specialties/.test(q)) matches = this.products;
            if (!matches.length) return null;
            const intro = this.language === 'en' ? 'Here are some representative OCOP products:' : 'D\u1ea1, em gi\u1edbi thi\u1ec7u m\u1ed9t s\u1ed1 s\u1ea3n ph\u1ea9m OCOP ti\u00eau bi\u1ec3u:';
            return intro + '\n\n' + matches.slice(0, 3).map(p => `- **${p.name}** (${p.stars} sao - ${p.region}) - ${p.price.toLocaleString(this.language === 'en' ? 'en-US' : 'vi-VN')} VND`).join('\n\n');
        }
        async ask(query) {
            const text = String(query || '').trim();
            if (!text) return '';
            try {
                const response = await fetch(this.endpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({language: this.language, messages: [...this.history.slice(-14), {role: 'user', text}], products: this.products})});
                const data = await response.json();
                const reply = data.message || data.text_response;
                if (!response.ok || !reply) throw new Error('Chat request failed');
                this.history.push({role: 'user', text}, {role: 'assistant', text: reply});
                this.history = this.history.slice(-14);
                return reply;
            } catch (error) {
                return this.getLocalResponse(text) || (this.language === 'en' ? 'The assistant is temporarily unavailable. Please try again shortly.' : 'D\u1ea1, tr\u1ee3 l\u00fd \u0111ang t\u1ea1m m\u1ea5t k\u1ebft n\u1ed1i. Anh/Ch\u1ecb th\u1eed l\u1ea1i sau nh\u00e9.');
            }
        }
    }
    if (typeof module !== 'undefined' && module.exports) module.exports = {AIEngine};
    root.AIEngine = AIEngine;
})(globalThis);
