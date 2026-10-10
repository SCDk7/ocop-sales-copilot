const shopping = require('./ai-shopping');
function planWikipedia(intent, semantic, message, products, language = 'vi', hasImages = false) {
    const q = shopping.normalize(message);
    if (/ton kho|con hang|con bao nhieu|het hang|kiem tra kho|stock|inventory|availability|in stock|tao don nhap|create.*draft/.test(q)) return {query:'',topics:[],skipReason:'operational_backend_data'};
    const privateDetails = /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?84|0)\d[\d ()-]{7,}\d\b/i.test(message) || /\b(?:otp|password|mat khau|ma don hang|order number)\b/.test(q);
    if (privateDetails || intent.isComplaint || intent.isCSKH || hasImages) return {query:'',topics:[],skipReason:'private_or_image_context'};
    const teaCulture = /van hoa|culture|lich su|history/.test(q) && /\b(?:tra|tea|che)\b/.test(q);
    const chosen = intent.pricePreference ? shopping.recommendations(products,intent)[0] : null;
    const productTopic = chosen ? (/^sam\b/.test(shopping.normalize(chosen.name)) ? 'sâm' : shopping.analyze(chosen.name,products).categoryOrKeyword) : null;
    const semanticQuery = String(semantic?.wikipediaQuery || '').trim().slice(0,180);
    const defaultTopic = language === 'en' ? 'One village one product' : 'Mỗi xã một sản phẩm';
    const scopedQuery = [intent.categoryOrKeyword || (productTopic === 'sâm' ? 'Nhân sâm' : productTopic),intent.exactRegion || intent.regionKeyword].filter(Boolean).join(' ');
    const query = /\bocop\b|moi xa mot san pham/.test(q) && intent.isOcopKnowledge ? defaultTopic
        : teaCulture ? (language === 'en' ? 'Vietnamese tea culture' : 'Văn hóa trà Việt Nam')
        : intent.pricePreference && scopedQuery ? scopedQuery
        : intent.isCombo ? scopedQuery || defaultTopic : semanticQuery || scopedQuery || defaultTopic;
    const topics = [...new Set([intent.categoryOrKeyword,productTopic,intent.exactRegion,intent.regionKeyword,query].filter(Boolean))];
    return {query,topics,teaCulture,skipReason:null};
}
module.exports = {planWikipedia};
