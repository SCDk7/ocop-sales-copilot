(function(root) {
    'use strict';
    const shopping = typeof module === 'object' && module.exports ? require('./ai-shopping') : root.AIShopping;
    const complaint = /khieu nai|phan nan|doi tra|tra hang|hoan tien|complaint|refund/;
    const damage = /hang loi|hang bi loi|san pham bi loi|bi hong|hu hong|bi vo|bi moc|giao sai|giao nham|giao thieu|thieu hang|giao (?:hang )?(?:tre|cham)|chua nhan duoc hang|damaged|broken|wrong (?:item|product)/;
    const isComplaint = text => complaint.test(text) || (damage.test(text) && !/cach |bao quan|tranh |how to|prevent/.test(text));
    const contact = /gap (?:nguoi that|nhan vien|quan ly)|noi chuyen voi (?:nguoi that|nhan vien|quan ly)|human agent|speak to (?:a )?(?:human|person|manager)/;

    function analyzeCustomerRequest(messages, products, options = {}) {
        const history = messages.filter(message => message && ['user', 'assistant'].includes(message.role) && typeof message.text === 'string');
        const latest = history.filter(message => message.role === 'user').at(-1)?.text || '';
        const normalized = shopping.normalize(latest);
        const intent = shopping.resolve(history, products, options.extract || shopping.analyze);
        intent.knowledgeQuery = latest;
        const users = history.filter(message => message.role === 'user');
        const previous = shopping.normalize(users.at(-2)?.text || '');
        const supportFollowup = /ma don|order (?:id|number)|\b(?:ord|dh)[-_]?\d|gui anh|anh dinh kem/.test(normalized);
        intent.isComplaint = Boolean(intent.isComplaint || isComplaint(normalized) || (supportFollowup && isComplaint(previous)));
        intent.isCSKH = !intent.isComplaint && Boolean(intent.isCSKH || contact.test(normalized));
        const hasImages = Boolean(options.hasImages);
        const clarification = !hasImages && !intent.isComplaint && !intent.isCSKH
            ? shopping.budgetClarification(latest, options.language || 'vi', intent) : null;
        const task = intent.isComplaint ? 'complaint' : intent.isCSKH ? 'support'
            : hasImages ? 'image_lookup' : intent.isOrderGuide ? 'order_support'
            : intent.isShipping ? 'shipping' : intent.isStoreLookup ? 'store_lookup'
            : intent.isUsage || intent.isOcopKnowledge ? 'product_information' : 'product_advice';
        const catalogueApplicable = !hasImages && !intent.isComplaint && !intent.isCSKH;
        const matchingProducts = catalogueApplicable ? shopping.recommendations(products, intent.isCombo ? {...intent,minPrice:null} : intent, products.length) : [];
        return {
            intent,
            clarification,
            summary: {
                status: 'completed', source: 'catalog_rules', task,
                contextUsed: history.length > 1, hasImages,
                needsClarification: Boolean(clarification),
                catalogueMatches: catalogueApplicable ? matchingProducts.length : null,
                constraints: {province: intent.exactRegion || null, region: intent.regionKeyword || null,
                    category: intent.categoryOrKeyword || null, maxPrice: intent.maxPrice ?? null,
                    minPrice: intent.minPrice ?? null, minItems: intent.minItems ?? null, maxItems: intent.maxItems ?? null,
                    minStars: intent.minStars ?? null, excludedTerms: intent.excludedTerms || []}
            }
        };
    }
    const api = {analyzeCustomerRequest};
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.OCOPRequestAnalysis = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
