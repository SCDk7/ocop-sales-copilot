const shopping = require('./ai-shopping');

function extractSpecialtyTopic(message, products, language = 'vi') {
    if (!message) return null;
    const q = shopping.normalize(message);
    if (/^combo\b|^\d+tr\b|ngan sach|tat ca|danh muc/.test(q)) return null;

    const commonSpecialties = [
        { vi: 'Đông Trùng Hạ Thảo', en: 'Cordyceps', keys: ['dong trung ha thao'] },
        { vi: 'Sâm Ngọc Linh', en: 'Panax vietnamensis', keys: ['sam ngoc linh'] },
        { vi: 'Trà Phổ Nhĩ', en: "Pu'er tea", keys: ['tra pho nhi'] },
        { vi: 'Trà Ô Long', en: 'Oolong', keys: ['tra o long', 'o long'] },
        { vi: 'Trà Shan Tuyết', en: 'Vietnamese tea', keys: ['tra shan tuyet', 'shan tuyet'] },
        { vi: 'Trà Sen', en: 'Lotus tea', keys: ['tra sen', 'che sen'] },
        { vi: 'Yến Sào', en: "Edible bird's nest", keys: ['yen sao', 'to yen'] },
        { vi: 'Cà Phê Buôn Ma Thuột', en: 'Buon Ma Thuot coffee', keys: ['ca phe buon ma thuot'] },
        { vi: 'Cà Phê Robusta', en: 'Robusta coffee', keys: ['ca phe robusta', 'robusta'] },
        { vi: 'Cà Phê', en: 'Coffee in Vietnam', keys: ['ca phe'] },
        { vi: 'Hạt Điều', en: 'Cashew', keys: ['hat dieu'] },
        { vi: 'Mật Ong Bạc Hà', en: 'Mint honey', keys: ['mat ong bac ha'] },
        { vi: 'Mật Ong', en: 'Honey', keys: ['mat ong'] },
        { vi: 'Gạo ST25', en: 'ST25 rice', keys: ['gao st25', 'st25'] },
        { vi: 'Nước Mắm Phú Quốc', en: 'Phu Quoc fish sauce', keys: ['nuoc mam phu quoc'] },
        { vi: 'Nước Mắm', en: 'Fish sauce', keys: ['nuoc mam'] },
        { vi: 'Tỏi Lý Sơn', en: 'Ly Son garlic', keys: ['toi ly son'] },
        { vi: 'Bưởi Da Xanh', en: 'Pomelo', keys: ['buoi da xanh'] },
        { vi: 'Bưởi Tân Triều', en: 'Pomelo', keys: ['buoi tan trieu'] },
        { vi: 'Gốm Bát Tràng', en: 'Bat Trang pottery', keys: ['gom bat trang', 'bat trang'] },
        { vi: 'Rượu Cần', en: 'Ruou can', keys: ['ruou can'] },
        { vi: 'Hạt Mắc Ca', en: 'Macadamia', keys: ['mac ca', 'macca'] },
        { vi: 'Long Nhãn', en: 'Longan', keys: ['long nhan'] },
        { vi: 'Bột Sắn Dây', en: 'Kudzu powder', keys: ['san day'] },
        { vi: 'Hạt Sen', en: 'Lotus seed', keys: ['hat sen'] }
    ];

    for (const item of commonSpecialties) {
        if (item.keys.some(k => q.includes(k))) {
            return { topic: language === 'en' ? item.en : item.vi, raw: item.vi };
        }
    }

    if (Array.isArray(products) && products.length > 0) {
        for (const p of products) {
            const pName = p.name || '';
            const primaryStem = pName.split(/[/(-]/)[0].trim().replace(/^(?:đặc sản|hộp|gói|túi|chai|lọ|bình)\s+/i, '');
            const primaryNorm = shopping.normalize(primaryStem);
            if (primaryNorm.length >= 4 && q.includes(primaryNorm)) {
                return { topic: primaryStem, raw: primaryStem, product: p };
            }
        }
    }

    return null;
}

function planWikipedia(intent, semantic, message, products, language = 'vi', hasImages = false) {
    const q = shopping.normalize(message);
    if (/ton kho|con hang|con bao nhieu|het hang|kiem tra kho|stock|inventory|availability|in stock|tao don nhap|create.*draft/.test(q)) return {query:'',topics:[],skipReason:'operational_backend_data'};
    const privateDetails = /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?84|0)\d[\d ()-]{7,}\d\b/i.test(message) || /\b(?:otp|password|mat khau|ma don hang|order number)\b/.test(q);
    if (privateDetails || intent.isComplaint || intent.isCSKH || hasImages) return {query:'',topics:[],skipReason:'private_or_image_context'};
    const teaCulture = /van hoa|culture|lich su|history/.test(q) && /\b(?:tra|tea|che)\b/.test(q);
    const chosen = intent.pricePreference ? shopping.recommendations(products,intent)[0] : null;
    const productTopic = chosen ? (/^sam\b/.test(shopping.normalize(chosen.name)) ? 'sâm' : shopping.analyze(chosen.name,products).categoryOrKeyword) : null;
    const specialtyMatch = extractSpecialtyTopic(message, products, language);
    const matchedTopic = specialtyMatch?.topic || null;
    const semanticQuery = String(semantic?.wikipediaQuery || '').trim().slice(0,180);
    const defaultTopic = language === 'en' ? 'One village one product' : 'Mỗi xã một sản phẩm';
    const scopedQuery = [intent.categoryOrKeyword || (productTopic === 'sâm' ? 'Nhân sâm' : productTopic),intent.exactRegion || intent.regionKeyword].filter(Boolean).join(' ');
    const query = /\bocop\b|moi xa mot san pham/.test(q) && intent.isOcopKnowledge ? defaultTopic
        : teaCulture ? (language === 'en' ? 'Vietnamese tea culture' : 'Văn hóa trà Việt Nam')
        : intent.pricePreference && scopedQuery ? scopedQuery
        : intent.isCombo ? scopedQuery || defaultTopic : semanticQuery || matchedTopic || scopedQuery || defaultTopic;
    const topics = [...new Set([intent.categoryOrKeyword,productTopic,matchedTopic,specialtyMatch?.raw,specialtyMatch?.product?.province,intent.exactRegion,intent.regionKeyword,query].filter(Boolean))];
    return {query,topics,teaCulture,skipReason:null};
}
module.exports = {planWikipedia};
