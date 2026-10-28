(function (root) {
    'use strict';
    const cashflowPattern = /dòng tiền|dong tien|cash[ -]?flows?|phân tích tài chính|quan tri tai chinh|quản trị tài chính|financial|biên lợi nhuận|bien loi nhuan|net profit|profit margin|gross margin|tiền lời|\b(?:COGS|OPEX|CHM|GMV)\b|现金流|净利|财务|현금\s*흐름|순이익|キャッシュフロー|財務|純利益/i;
    const isCashflowText = value => cashflowPattern.test(String(value || '')) || /đối soát|doi soat|reconcil|phân tích doanh thu|tiền lời|revenue analysis/i.test(String(value || ''));
    function stripFinancialLines(value) {
        return String(value || '').split(/\r?\n|\\n/).filter(line => !isCashflowText(line)).join('\n').trim();
    }
    const greetings = {
        vi: 'Chào anh/chị! Em hỗ trợ chọn đặc sản OCOP, kiểm tra giá và thông tin trong danh mục, hướng dẫn đặt hàng và tiếp nhận khiếu nại. Anh/chị muốn tư vấn sản phẩm, đặt mua hay cần hỗ trợ đơn hàng ạ?',
        en: 'I can help you find OCOP products, product information, prices, gifts and store locations.',
        zh: '我可以帮助您查找 OCOP 产品、产品信息、价格、礼品和门店。',
        ko: 'OCOP 상품, 상품 정보, 가격, 선물 및 매장을 안내합니다.',
        ja: 'OCOP商品、商品情報、価格、ギフト、販売店をご案内します。'
    };
    const compactCards = {
        vi: [
            ['Nguồn gốc rõ ràng','Thông tin và số sao OCOP.','Thông tin minh bạch'],
            ['Câu chuyện đặc sản','Khám phá văn hóa vùng miền.','Di sản Việt'],
            ['Tìm điểm bán','Tra cứu cửa hàng trên bản đồ.','Kết nối địa phương'],
            ['Tư vấn 24/7','Hỗ trợ chọn quà và đặt hàng.','Trợ lý sản phẩm']
        ],
        en: [
            ['Product origins','View product information and listed OCOP stars.','Clear information'],
            ['Local stories','Explore regional origins and culture.','Vietnamese heritage'],
            ['Find stores','Find stores and directions on the map.','Local connections'],
            ['24/7 assistance','Help with products, gifts and orders.','Product assistant']
        ],
        zh: [['产品来源','查看产品信息和目录中的 OCOP 星级。','信息清晰'],['地方故事','了解各地的来源与文化。','越南文化'],['查找门店','在地图上查找门店与路线。','连接当地'],['全天候咨询','协助选购产品、礼品与下单。','产品助手']],
        ko: [['상품 원산지','상품 정보와 등록된 OCOP 등급을 확인하세요.','명확한 정보'],['지역 이야기','각 지역의 유래와 문화를 알아보세요.','베트남 유산'],['매장 찾기','지도에서 매장과 길을 찾아보세요.','지역 연결'],['24시간 상담','상품과 선물 선택, 주문을 도와드립니다.','상품 도우미']],
        ja: [['商品の産地','商品情報と掲載OCOP評価を確認。','明確な情報'],['地域の物語','各地の由来と文化を紹介。','ベトナムの文化'],['販売店を探す','地図で販売店と道順を確認。','地域とのつながり'],['24時間相談','商品・ギフト選びや注文をお手伝い。','商品アシスタント']]
    };
    function cleanReply(reply, language = 'vi') {
        if (!reply || typeof reply !== 'object') return reply;
        const message = stripFinancialLines(reply.text_response || reply.message) || greetings[language] || greetings.vi;
        return {...reply, message, text_response: message,
            dynamic_chips: Array.isArray(reply.dynamic_chips) ? reply.dynamic_chips.filter(chip => !isCashflowText(typeof chip === 'string' ? chip : JSON.stringify(chip))) : []};
    }
    if (typeof module === 'object' && module.exports) module.exports = {isCashflowText, stripFinancialLines, cleanReply, compactCards};
    if (!root.document) return;

    const document = root.document;
    const language = () => typeof currentLanguage === 'string' ? currentLanguage : document.documentElement.lang || 'vi';
    const showMessage = text => { if (typeof root.showToast === 'function') root.showToast(text, 'success'); };
    const disablePanel = element => {
        if (!element) return;
        element.hidden = true;
        element.inert = true;
        element.setAttribute('aria-hidden', 'true');
        element.style.setProperty('display', 'none', 'important');
    };
    function viewProduct(id) {
        if (typeof root.openQuickView === 'function') root.openQuickView(Number(id));
    }
    function productIdFor(element) {
        const card = element.closest('[data-product-id]');
        return card?.dataset.productId || /(?:addToCart|activateProductReconciliation|openQuickView)\((\d+)\)/.exec(element.getAttribute('onclick') || '')?.[1];
    }
    function featuredProduct() {
        const image = document.getElementById('hero-product-img');
        const path = image?.getAttribute('src');
        return (root.PRODUCTS || []).find(product => product.img === path);
    }
    root.openFeaturedProduct = () => {
        const product = featuredProduct();
        if (product) viewProduct(product.id);
    };
    function cleanUI() {
        const supportLabel = document.getElementById('i18n-intro-quick-ai');
        if (supportLabel) supportLabel.textContent = language() === 'en' ? 'AI Support' : 'AI hỗ trợ';
        const featureLabels=language()==='en'
            ? ['63 Provinces Digital Map','Specialties from Vietnam','24/7 AI Assistant']
            : ['Bản Đồ Số 63 Tỉnh Thành','Đặc Sản Vùng Miền Việt Nam','Trợ lý AI 24/7'];
        featureLabels.forEach((label,index)=>{
            for(const id of [`i18n-intro-pillar${index+1}`,`i18n-hero-feat${index+1}-title`]){
                const node=document.getElementById(id);
                if(node?.closest('.intro-feature-grid, .hero-feature-grid'))node.textContent=label;
            }
        });
        const featured = featuredProduct();
        if (featured) {
            const name = typeof root.getProductName === 'function' ? root.getProductName(featured) : featured.name;
            const title = document.getElementById('i18n-hero-prodname');
            if (title) title.textContent = name;
            const image = document.getElementById('hero-product-img');
            if (image) image.alt = name;
            const stars = document.getElementById('hero-product-stars');
            if (stars) stars.textContent = `OCOP ${featured.stars} ★ • ${featured.region}`;
            const action = document.getElementById('hero-product-price');
            if (action) {
                action.textContent = language() === 'en' ? 'View product' : 'Xem sản phẩm';
                action.title = name;
                action.onclick = event => { event.stopPropagation(); root.openFeaturedProduct(); };
            }
        }
        for (const id of ['ai-financial-modal', 'adminRevenueModal', 'ai-challenge-proposal-modal']) disablePanel(document.getElementById(id));
        const badge = document.getElementById('i18n-ai-financial-badge');
        if (badge) disablePanel(badge.closest('.glass-panel'));
        document.querySelectorAll('.nav-btn-finance, .admin-hub-card[onclick*="finance"], .admin-hub-card[onclick*="revenue"]').forEach(disablePanel);
        const titleMap = {
            'i18n-intro-pillar1': 'Bản Đồ Số 63 Tỉnh Thành',
            'i18n-intro-pillar2': 'Đặc Sản Vùng Miền Việt Nam',
            'i18n-intro-pillar3': 'Trợ lý AI 24/7',
            'i18n-intro-pillar4': 'AI Financial Engine',
            'i18n-sidebar-realtime': 'Điểm bán & hợp tác xã OCOP',
            'chat-title': language() === 'en' ? 'AI • ADVICE, SUPPORT & COMPLAINTS' : 'AI • TƯ VẤN, HỖ TRỢ & KHIẾU NẠI',
            'chat-subtitle': language() === 'en' ? 'Product advice • Order support • Customer care' : 'Tư vấn sản phẩm • Hỗ trợ đơn hàng • Chăm sóc khách hàng',
            'chat-greeting': greetings[language()] || greetings.vi,
            'chat-guidance': language() === 'en' ? 'Tell me what you need or describe the issue with your order.' : 'Anh/chị cần tư vấn, hỗ trợ đơn hàng hay phản ánh vấn đề gì? Em sẽ hướng dẫn từng bước.'
        };
        for (const [id, label] of Object.entries(titleMap)) {
            const el = document.getElementById(id);
            if (el && (id.startsWith('chat-') || isCashflowText(el.textContent))) el.textContent = label;
        }
        const chatInput = document.getElementById('ai-chat-input');
        if (chatInput) chatInput.placeholder = language() === 'en' ? 'Ask for advice, support or make a complaint...' : 'Nhập yêu cầu tư vấn, hỗ trợ hoặc khiếu nại...';
        const supportActions = language() === 'en'
            ? [['Product advice','Please help me choose an OCOP product.'],['Order support','I need help placing or checking an order.'],['Complaints / returns','I need help with a complaint about my order.']]
            : [['Tư vấn sản phẩm','Tôi cần tư vấn chọn đặc sản OCOP.'],['Hỗ trợ đơn hàng','Tôi cần hỗ trợ đặt hàng hoặc kiểm tra đơn hàng.'],['Khiếu nại / đổi trả','Tôi cần hỗ trợ khiếu nại về đơn hàng.']];
        const sendSupportPrompt = prompt => {
            const input = document.getElementById('ai-chat-input');
            if (input) { input.value = prompt; root.sendAIMessage?.(); }
        };
        const quickReplies = document.getElementById('ai-chat-quick-replies');
        const actionLabels = supportActions.map(([label]) => label);
        const currentPrompts = quickReplies ? [...quickReplies.querySelectorAll('.chat-prompt')] : [];
        if (quickReplies && (currentPrompts.length !== actionLabels.length || currentPrompts.some((button, index) => button.textContent !== actionLabels[index]))) {
            quickReplies.querySelectorAll('.chat-prompt').forEach(button => button.remove());
            for (const [label, prompt] of supportActions) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'chat-prompt quick-reply-pill flex items-center gap-1.5 cursor-pointer';
                button.textContent = label;
                button.onclick = () => sendSupportPrompt(prompt);
                quickReplies.append(button);
            }
        }
        const greeting = document.getElementById('chat-greeting');
        const previousActions = document.getElementById('chat-sales-actions');
        if (previousActions && previousActions.dataset.language !== language()) previousActions.remove();
        if (greeting && !document.getElementById('chat-sales-actions')) {
            const actions = document.createElement('div');
            actions.id = 'chat-sales-actions';
            actions.dataset.language = language();
            actions.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:12px';
            for (const [label,prompt] of supportActions) {
                const button=document.createElement('button');button.type='button';button.textContent=label;
                button.style.cssText='padding:8px 10px;border:1px solid #7dd3fc;border-radius:10px;background:#e0f2fe;color:#0c4a6e;font-size:12px;font-weight:700';
                button.onclick=()=>sendSupportPrompt(prompt);
                actions.append(button);
            }
            greeting.after(actions);
        }
        for (const id of ['chat-disclaimer','chat-verification-note']) {
            const el = document.getElementById(id);
            if (el) el.textContent = language() === 'en'
                ? 'Prices and product details follow the shop catalogue. Please confirm stock and store addresses before ordering or visiting.'
                : 'Giá và thông tin theo danh mục cửa hàng. Anh/chị xác nhận tồn kho, địa chỉ điểm bán trước khi đặt mua hoặc đến xem.';
        }
        (compactCards[language()] || compactCards.vi).forEach(([title,description,badge],index) => {
            for (const [id,text] of [[`i18n-why-pillar${index+1}`,title],[`i18n-why-pillar${index+1}-desc`,description],[`i18n-why-badge${index+1}`,badge]]) {
                const el=document.getElementById(id); if(el) el.textContent=text;
            }
        });
        document.querySelectorAll('button, a, [role="button"]').forEach(button => {
            if (button.closest('#province-map')) return;
            const text = [button.textContent, button.title, button.getAttribute('aria-label')].join(' ');
            const action = button.getAttribute('onclick') || '';
            if (/openFinancialDashboardModal|toggleAiFinancialModal|FinancialReport|FinancialBriefing|quickSwitchToFinancial|activateO2ODispatch/.test(action)) { disablePanel(button); return; }
            if (!isCashflowText(text)) return;
            const id = productIdFor(button);
            if (id) {
                button.textContent = language() === 'en' ? 'View product' : 'Xem sản phẩm';
                button.title = button.textContent;
                button.setAttribute('aria-label', button.textContent);
                button.removeAttribute('onclick');
                button.onclick = event => { event.stopPropagation(); viewProduct(id); };
            } else if (/addProductsToCart/.test(action)) {
                button.textContent = language() === 'en' ? 'Add to cart' : 'Thêm vào giỏ hàng';
            } else disablePanel(button);
        });
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
            if (isCashflowText(input.placeholder)) input.placeholder = language() === 'en' ? 'Search OCOP products...' : 'Tìm đặc sản OCOP...';
        });
        // Do not inspect or mutate the Leaflet map, controls or province selection.
        const walker = document.createTreeWalker(document.body, 4);
        const nodes = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.parentElement?.closest('script, style, #province-map, #cart-drawer, #online-order-modal, #order-success-modal, [hidden], [aria-hidden="true"]')) continue;
            if (isCashflowText(node.nodeValue)) nodes.push(node);
        }
        for (const node of nodes) node.nodeValue = '';
    }
    function wrap(name, after) {
        const original = root[name];
        if (typeof original !== 'function' || original.storefrontOnly) return;
        const wrapped = function (...args) {
            const value = original.apply(this, args);
            if (value && typeof value.then === 'function') return value.then(result => after(result, args));
            return after(value, args);
        };
        wrapped.storefrontOnly = true;
        root[name] = wrapped;
    }
    function installShoppingCart() {
        if (root.OCOPCartUI) return;
        if (typeof root.CartManager !== 'function') return;
        const manager = new root.CartManager();
        const source = Array.isArray(root.PRODUCTS) ? root.PRODUCTS : [];
        const oldDrawer = document.getElementById('cart-drawer');
        disablePanel(oldDrawer);
        const drawer = document.createElement('aside');
        drawer.id = 'shopping-cart-drawer';
        drawer.hidden = true;
        drawer.setAttribute('aria-label', 'Giỏ hàng');
        drawer.style.cssText = 'position:fixed;inset:0 0 0 auto;z-index:100000;width:min(100%,440px);padding:20px;background:white;color:#1e293b;overflow-y:auto;box-shadow:0 0 30px #0004';
        document.body.appendChild(drawer);
        function button(label, action) {
            const el = document.createElement('button'); el.type = 'button'; el.textContent = label; el.onclick = action;
            el.style.cssText = 'padding:6px 10px;border:1px solid #bae6fd;border-radius:8px;background:#f0f9ff;color:#075985;cursor:pointer';
            return el;
        }
        function render() {
            drawer.replaceChildren();
            const header = document.createElement('div'); header.style.cssText = 'display:flex;justify-content:space-between;align-items:center';
            const title = document.createElement('h3'); title.textContent = language() === 'en' ? 'Shopping cart' : 'Giỏ hàng';
            header.append(title, button('✕', () => { drawer.hidden = true; })); drawer.append(header);
            if (!manager.cart.length) { const empty = document.createElement('p'); empty.textContent = language() === 'en' ? 'Your cart is empty.' : 'Giỏ hàng chưa có sản phẩm.'; drawer.append(empty); }
            let total = 0;
            for (const item of manager.cart) {
                const product = source.find(p => p.id === item.id); if (!product) continue;
                total += product.price * item.quantity;
                const row = document.createElement('article'); row.style.cssText = 'padding:14px 0;border-bottom:1px solid #e2e8f0';
                const name = document.createElement('strong'); name.textContent = typeof root.getProductName === 'function' ? root.getProductName(product) : product.name;
                const price = document.createElement('p'); price.textContent = product.price.toLocaleString('vi-VN') + ' ₫ × ' + item.quantity;
                const actions = document.createElement('div'); actions.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
                actions.append(button('−', () => root.updateCartQty(item.id,-1)),button('+', () => root.updateCartQty(item.id,1)),button(language() === 'en' ? 'Remove' : 'Xóa', () => root.removeFromCart(item.id)),button(language() === 'en' ? 'Order' : 'Đặt mua', () => {
                    if (typeof root.openOnlineOrderModal !== 'function') return;
                    root.openOnlineOrderModal(item.id);
                    if (item.quantity > 1 && typeof root.changeOrderQty === 'function') root.changeOrderQty(item.quantity - 1);
                    drawer.hidden = true;
                }));
                row.append(name, price, actions); drawer.append(row);
            }
            const subtotal = document.createElement('p'); subtotal.style.fontWeight = '800'; subtotal.textContent = (language() === 'en' ? 'Subtotal: ' : 'Tạm tính: ') + total.toLocaleString('vi-VN') + ' ₫'; drawer.append(subtotal);
            const note = document.createElement('p'); note.textContent = language() === 'en' ? 'Shipping and the final total are shown when placing an order.' : 'Phí giao hàng và tổng thanh toán hiển thị khi đặt mua.'; note.style.fontSize = '12px'; drawer.append(note);
            const count = manager.getItemCount();
            for (const id of ['cart-count','cart-count-badge','intro-cart-count','header-cart-count']) { const badge = document.getElementById(id); if (badge) badge.textContent = String(count); }
        }
        root.addToCart = id => { const p = source.find(p => p.id === Number(id)); if (!p) return; manager.addToCart(p,1); render(); showMessage(language() === 'en' ? 'Added to cart' : 'Đã thêm vào giỏ hàng'); };
        root.activateProductReconciliation = root.addToCart;
        root.addProductsToCart = ids => { for (const id of new Set(ids)) root.addToCart(id); root.toggleCart(true); };
        root.removeFromCart = id => { manager.removeFromCart(Number(id)); render(); };
        root.updateCartQty = (id,delta) => { const item = manager.cart.find(p => p.id === Number(id)); if (!item) return; item.quantity = Math.max(0,item.quantity+delta); if (!item.quantity) manager.removeFromCart(Number(id)); else manager.save(); render(); };
        root.toggleCart = force => { drawer.hidden = typeof force === 'boolean' ? !force : !drawer.hidden; render(); };
        root.renderCartItems = render;
        root.updateCartBadge = render;
        render();
    }
    function init() {
        // Disable only the retired analysis entrypoints. Keep map and ordering APIs intact.
        for (const name of ['openFinancialDashboardModal', 'toggleAiFinancialModal', 'quickSwitchToFinancialDashboard', 'updateFinancialSimulator', 'exportFinancialReport', 'filterFinancialChannel', 'playVoiceFinancialBriefing', 'triggerHeroVoiceDemo']) root[name] = () => {};
        if (root.OcopSyncEngine) root.OcopSyncEngine.syncFinancial = async () => ({disabled: true});
        if (typeof root.selectAdminHubPortal === 'function') {
            const original = root.selectAdminHubPortal;
            root.selectAdminHubPortal = portal => { if (portal === 'tiktok' || portal === 'management' || portal === 'distributor') original(portal); };
        }
        for (const name of ['renderProducts', 'openQuickView', 'renderWishlistItems', 'applyLanguage', 'enforceChallenge2026Translations', 'syncChatLanguage', 'resetAIChatHistory', 'openAdminHubModal']) wrap(name, result => { cleanUI(); return result; });
        for (const name of ['renderAIProductRecommendations', 'renderAIComboRecommendations']) wrap(name, result => {
            if (typeof result !== 'string') return result;
            const template = document.createElement('template'); template.innerHTML = result;
            template.content.querySelectorAll('button').forEach(button => {
                if (!isCashflowText(button.textContent)) return;
                const id = productIdFor(button);
                if (id) { button.textContent = language() === 'en' ? 'View product' : 'Xem sản phẩm'; button.setAttribute('onclick', `openQuickView(${Number(id)})`); }
                else button.textContent = language() === 'en' ? 'Add to cart' : 'Thêm vào giỏ hàng';
            });
            return template.innerHTML;
        });
        for (const name of ['createLocalCatalogReply', 'generateResilientAIResponse']) wrap(name, result => cleanReply(result, language()));
        for (const name of ['generateAIResponse', 'getGeminiWikiResponse']) wrap(name, result => typeof result === 'string' ? stripFinancialLines(result) || greetings[language()] || greetings.vi : result);
        const formatMessage = root.formatAIMessageText;
        if (typeof formatMessage === 'function') root.formatAIMessageText = function (text, ...args) {
            return formatMessage.call(this, stripFinancialLines(text) || greetings[language()] || greetings.vi, ...args);
        };
        const showToast = root.showToast;
        if (typeof showToast === 'function') root.showToast = function (text, ...args) {
            if (isCashflowText(text)) return;
            return showToast.call(this, text, ...args);
        };
        installShoppingCart();
        cleanUI();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
    else init();
})(typeof window !== 'undefined' ? window : globalThis);
