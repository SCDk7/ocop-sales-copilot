(function(root) {
    'use strict';
    const shopping = typeof module === 'object' && module.exports ? require('./ai-shopping') : root.AIShopping;
    const normalize = value => shopping.normalize(String(value || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    const stop = new Set('san pham dac ocop gia bao nhieu may sao xuat xu nguon goc dong goi quy cach la gi cua toi minh shop cho hoi o dau the nao va co khong price stars origin packaging'.split(' '));
    function answer(query, products, language = 'vi', history = []) {
        const q = normalize(query), en = language === 'en';
        if (!/gia bao nhieu|gia ban|may sao|bao nhieu sao|xuat xu|nguon goc|quy cach|dong goi|price|star rating|origin|packaging/.test(q)) return null;
        if (/khieu nai|doi tra|hoan tien|bi moc|bi hong|damaged|refund/.test(q)) return null;
        if (/cau chuyen|van hoa|story|culture|showroom|dia chi|diem ban|o2o|tu van|gioi thieu|consult|co gi|co j|dac diem|thanh phan|nhu the nao|chi tiet|huong vi|ngon khong/.test(q)) return null;
        const tokens = text => [...new Set(normalize(text).split(' ').filter(word => word.length > 1 && !stop.has(word)))];
        function matches(text) {
            const words = new Set(tokens(text));
            return products.map(product => {
                const names = [product.name, product.nameEn].filter(Boolean);
                const scores = names.map(name => {
                    const stem = name.replace(/\([^)]*\)/g, '').trim();
                    const terms = tokens(stem);
                    const score = terms.filter(word => words.has(word)).length;
                    return normalize(text).includes(normalize(stem)) ? 1000 + terms.length : score >= 2 && score >= terms.length * .5 ? score : 0;
                });
                return {product, score: Math.max(0, ...scores)};
            }).filter(row => row.score > 0).sort((a,b) => b.score-a.score);
        }
        let found = matches(query);
        if (!found.length && tokens(query).length === 0) {
            const previous = [...history].reverse().find(message => message.role === 'user');
            if (previous) found = matches(previous.text || previous.content || '');
        }
        const top = found[0]?.score;
        const selected = found.filter(row => row.score === top).map(row => row.product);
        let message, ids = [];
        if (selected.length !== 1) {
            message = en ? 'Please give the exact product name so I can check its catalogue price, OCOP stars and origin. I cannot confirm details without a matching record.' : 'Anh/chị cho em tên sản phẩm cụ thể để đối chiếu giá, số sao và nguồn gốc trong danh mục nhé. Em chưa xác nhận thông tin khi chưa tìm được đúng sản phẩm.';
        } else {
            const p = selected[0]; ids = [p.id];
            const unknown = en ? 'not recorded; please confirm with the shop' : 'chưa có dữ liệu, cần cửa hàng xác nhận';
            const lines = [en ? p.nameEn || p.name : p.name];
            if (/gia|price/.test(q)) lines.push((en ? 'Catalogue price: ' : 'Giá theo danh mục: ') + (Number.isFinite(p.price) && p.price > 0 ? p.price.toLocaleString('vi-VN') + ' ₫' + (p.packaging ? '/' + p.packaging : '') + (p.priceIsReference ? (en ? ' (reference price)' : ' (giá tham khảo)') : '') : unknown));
            if (/sao|star/.test(q)) lines.push('OCOP: ' + (Number.isInteger(p.stars) && p.stars >= 1 && p.stars <= 5 ? p.stars + (en ? ' stars according to the shop catalogue.' : ' sao theo danh mục cửa hàng.') : unknown));
            if (/xuat xu|nguon goc|origin/.test(q)) lines.push((en ? 'Catalogue region: ' : 'Vùng miền theo danh mục: ') + (p.region || unknown));
            if (/quy cach|dong goi|packaging/.test(q)) lines.push((en ? 'Packaging/unit: ' : 'Quy cách/đơn vị: ') + (p.packaging || unknown));
            message = lines.join('\n');
        }
        return {message,text_response:message,productIds:ids,suggested_products:ids,combos:[],dynamic_chips:[],handoffAdmin:false,responseMode:'verified_catalog_facts',catalogSource:'data.js',catalogChecked:true,integrations:{gemini:false,openai:false,claude:false,wikipedia:false}};
    }
    if (typeof module === 'object' && module.exports) module.exports = {answer};
    else root.OCOPCatalogFacts = {answer};
})(typeof globalThis !== 'undefined' ? globalThis : this);
