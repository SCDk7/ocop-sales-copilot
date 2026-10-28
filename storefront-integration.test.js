const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const os = require('node:os');
const path = require('node:path');
const {syncClientAssets} = require('./scripts/sync-client-assets.cjs');

for (const page of ['index.html', 'index_2.html']) {
    test(page + ' intro and product navigation never change a cart or dialog header', () => {
        const html=fs.readFileSync(page,'utf8');
        function node(initial=[]) {
            const classes=new Set(initial),style={};
            style.setProperty=(key,value)=>style[key]=value;style.removeProperty=key=>delete style[key];
            return {style,classList:{add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name)),contains:name=>classes.has(name)}};
        }
        const header=node(),dialogHeader=node(),overlay=node();
        dialogHeader.style.display='grid';dialogHeader.style.position='relative';
        const context={document:{body:node(),getElementById:()=>overlay,querySelectorAll:selector=>/(^|,)\s*header\s*(,|$)/.test(selector)?[header,dialogHeader]:[header]},
            products:[{id:1}],window:{openQuickView(){}},setAIChatWidgetVisibility(){},restorePageScrollState(){},playChimeSound(){},fetchProducts(){},
            playWhooshSound(){},stopIntroMusic(){},scrollToProducts(){},setTimeout:callback=>callback()};
        vm.createContext(context);
        const sections=[['function openIntroModal()', 'function enterOcopMarket('],['function enterOcopMarket(', 'function openLuckyGift('],['function openProvinceProductDetails(', 'let currentSortMode']];
        for(const [from,to]of sections){const start=html.indexOf(from);vm.runInContext(html.slice(start,html.indexOf(to,start)),context);}
        context.openIntroModal();context.enterOcopMarket('all');context.openProvinceProductDetails(1);
        assert.equal(header.style.display,'block');
        assert.equal(dialogHeader.style.display,'grid');assert.equal(dialogHeader.style.position,'relative');
        assert.equal(dialogHeader.classList.contains('hidden'),false);
    });

    test(page + ' keeps a dragged chat accessible after a viewport resize', () => {
        const html = fs.readFileSync(page, 'utf8');
        const source = html.slice(html.indexOf('        function keepChatInViewport()'), html.indexOf('        function initDraggableResizableChatbox()'));
        let rect = {left: 1200, top: 650, width: 440, height: 500};
        const style = {setProperty(key, value) {this[key] = value;}};
        const chat = {style, classList: {contains: () => false}, getBoundingClientRect: () => rect};
        const context = {document: {getElementById: () => chat, documentElement: {clientWidth: 1018}}, window: {innerWidth: 1024, innerHeight: 768, visualViewport: {height: 600}}};
        vm.createContext(context);
        vm.runInContext(source + '\nkeepChatInViewport();', context);
        assert.equal(style.left, '570px');
        assert.equal(style.top, '92px');
        assert.equal(style['--chat-viewport-height'], '600px');
        // A chat already inside the viewport retains the user's position.
        rect = {left: 100, top: 40, width: 440, height: 500};
        style.left = '100px'; style.top = '40px';
        vm.runInContext('keepChatInViewport();', context);
        assert.equal(style.left, '100px'); assert.equal(style.top, '40px');
    });
}

test('changed AI files automatically get a new URL in both pages without repeated churn', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ocop-assets-'));
    try {
        const html = '<script src="ai.js?v=old"></script><link rel="stylesheet" href="style.css"><!-- <script src="unused.js"></script> -->';
        for (const file of ['index.html', 'index_2.html', 'draft-order.html']) fs.writeFileSync(path.join(directory, file), html);
        fs.writeFileSync(path.join(directory, 'ai.js'), 'first');
        fs.writeFileSync(path.join(directory, 'style.css'), 'body{}');
        assert.equal(syncClientAssets(directory), 3);
        const previous = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
        assert.equal(syncClientAssets(directory), 0);
        fs.writeFileSync(path.join(directory, 'ai.js'), 'updated');
        assert.equal(syncClientAssets(directory), 3);
        const current = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
        assert.notEqual(current, previous);
        assert.equal(current, fs.readFileSync(path.join(directory, 'index_2.html'), 'utf8'));
        assert.equal(current, fs.readFileSync(path.join(directory, 'draft-order.html'), 'utf8'));
        assert.ok(current.includes('<!-- <script src="unused.js"></script> -->'));
    } finally {
        for (const file of ['index.html', 'index_2.html', 'draft-order.html', 'ai.js', 'style.css']) fs.unlinkSync(path.join(directory, file));
        fs.rmdirSync(directory);
    }
});

for (const page of ['index.html', 'index_2.html']) {
    test(page + ' loads shared modules once, initializes routes last and compiles inline scripts', () => {
        const html = fs.readFileSync(page, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
        const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(match => match[1].split('?')[0]);
        const styles = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"/g)].map(match => match[1].split('?')[0]);
        for (const file of ['customer-session.js', 'giohang.js', 'admin-management.js', 'ai-request-analysis.js', 'ai-web-research.js', 'ocop-assistant-profile.js', 'skytech-complete.js', 'cart-ui.js', 'account-center.js', 'storefront-ui.js', 'ui-branding.js', 'storefront-navigation.js', 'storefront-router.js']) {
            assert.equal(scripts.filter(src => src === file).length, 1, file + ' is loaded once');
        }
        for (const file of ['assets/tailwind.css', 'skytech-complete.css', 'cart-ui.css', 'account-center.css', 'admin-management.css', 'store-directory-light.css', 'assets/vendor/fonts/jakarta.css', 'assets/vendor/fontawesome/css/all.min.css']) {
            assert.equal(styles.filter(src => src === file).length, 1, file + ' is loaded once');
        }
        for (const src of [...scripts, ...styles].filter(src => !/^https?:/.test(src))) assert.ok(fs.existsSync(src), src);
        for (const match of html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))\?v=([a-f0-9]{12})"/g)) {
            if (/^https?:/.test(match[1])) continue;
            const hash = crypto.createHash('sha256').update(fs.readFileSync(match[1])).digest('hex').slice(0, 12);
            assert.equal(match[2], hash, match[1] + ' URL tracks the current file');
        }
        for (const [before, after] of [['giohang.js', 'cart-ui.js'], ['skytech-complete.js', 'cart-ui.js'], ['cart-ui.js', 'storefront-ui.js'], ['account-client.js', 'account-center.js'], ['admin-management.js', 'account-center.js'], ['storefront-ui.js', 'storefront-router.js']]) {
            assert.ok(scripts.indexOf(before) < scripts.indexOf(after), before + ' precedes ' + after);
        }
        assert.ok(scripts.indexOf('ai-request-analysis.js') < scripts.indexOf('chat-fallback.js'));
        assert.ok(scripts.indexOf('ocop-assistant-profile.js') < scripts.indexOf('chat-fallback.js'));
        const sendStart=html.indexOf('        async function sendAIMessage()');
        const sendEnd=html.indexOf('        function isAIComboRequest(',sendStart);
        assert.ok(!html.slice(sendStart,sendEnd).includes('escalateToAdmin();'), 'support questions use the analyzed request flow');
        for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
            if (/\bsrc=|application\/(?:ld\+)?json/.test(match[1])) continue;
            new vm.Script(match[2], {filename: page});
        }
        assert.ok(scripts.indexOf('customer-session.js') < scripts.indexOf('giohang.js'), 'guest reset and signed-in restore happen before reading the basket');
    });
}

test('account access warnings stay inside the account panel and authorized access still opens management', () => {
    let current = {username: 'customer', role: 'customer'};
    const document = {activeElement: null};
    class Element {
        constructor(tag) { this.tag = tag; this.children = []; this.dataset = {}; this.style = {}; this.attributes = {}; }
        append(...nodes) { this.children.push(...nodes); }
        replaceChildren(...nodes) { this.children = nodes; }
        setAttribute(key, value) { this.attributes[key] = value; }
        addEventListener() {}
        focus() { document.activeElement = this; }
        querySelectorAll(selector) {
            return this.children.flatMap(child => [child, ...child.querySelectorAll('*')]).filter(child =>
                selector === '*' || selector === 'button' && child.tag === 'button' || selector === '[data-section]' && child.dataset.section);
        }
        querySelector(selector) { return this.querySelectorAll(selector)[0]; }
    }
    document.createElement = tag => new Element(tag);
    document.body = new Element('body');
    const values = new Map();
    const localStorage = {getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value)};
    const events = [];
    const context = {document, localStorage, sessionStorage: {getItem: () => null},
        getCurrentCustomer: () => current,
        isCurrentUserAdminOrDistributor: person => ['admin', 'distributor'].includes(person.role),
        showToast: () => events.push('toast'), openCustomerAuthModal: () => events.push('auth'),
        OcopAdminManagement: {openAdminManagementModal: role => events.push(role)}};
    context.window = context;
    vm.createContext(context);
    const skytech = fs.readFileSync('skytech-complete.js', 'utf8');
    vm.runInContext(skytech.slice(skytech.indexOf('    window.promptAdminPinModal = function'), skytech.indexOf('    window.toggleAdminPinVisibility = function')), context);
    vm.runInContext(fs.readFileSync('account-center.js', 'utf8'), context);
    context.openAccountCenter();
    const panel = document.body.children[0];
    const notice = panel.querySelectorAll('*').find(node => node.className === 'account-center-notice');
    const controls = panel.querySelectorAll('button').filter(node => node.textContent === '🔒 Quản trị');
    assert.equal(controls.length, 2);
    for (const control of controls) {
        control.onclick();
        assert.equal(panel.hidden, false);
        assert.equal(notice.hidden, false);
        assert.match(notice.textContent, /không có quyền truy cập/);
        assert.equal(document.activeElement, notice);
        assert.equal(document.body.style.overflow, 'hidden');
        assert.deepEqual(events, []);
    }
    for (const role of ['admin', 'distributor']) {
        current = {username: role, role};
        context.openAccountCenter();
        panel.querySelectorAll('button').find(node => node.textContent === '🔒 Quản trị').onclick();
        assert.equal(panel.hidden, true);
        assert.equal(notice.hidden, true);
        assert.equal(events.at(-1), role === 'admin' ? 'webmaster' : 'distributor');
    }
});

test('offline account adapter preserves the current customer on reload', () => {
    const values = new Map([['ocop_current_user', JSON.stringify({username: 'customer'})], ['ocop_users_db', '[]']]);
    const root = {localStorage: {removeItem: key => values.delete(key)}};
    root.window = root;
    vm.runInNewContext(fs.readFileSync('account-client.js', 'utf8'), root);
    assert.equal(JSON.parse(values.get('ocop_current_user')).username, 'customer');
    assert.equal(values.get('ocop_users_db'), '[]');
});

for (const page of ['index.html', 'index_2.html']) {
    test(page + ' reopens the store directory after a previous hidden state', () => {
        const html = fs.readFileSync(page, 'utf8');
        const start = html.indexOf('        function openAllStoresModal()');
        const end = html.indexOf('        function filterStoresInModal(', start);
        const classes = new Set(['hidden']);
        const attributes = new Map();
        const styles = new Map([['display', 'none']]);
        const trigger = {setAttribute: (key, value) => attributes.set('trigger-' + key, value)};
        let focused = false;
        const modal = {
            hidden: true, inert: true,
            classList: {add: key => classes.add(key), remove: key => classes.delete(key)},
            setAttribute: (key, value) => attributes.set(key, value),
            style: {setProperty: (key, value) => styles.set(key, value)},
            querySelector: () => ({focus: () => { focused = true; }})
        };
        const body = {innerHTML: '', scrollTop: 100};
        const document = {
            getElementById: id => ({'ocop-all-stores-modal': modal, 'ocop-all-stores-body': body, 'header-stores-toggle': trigger})[id],
            body: {style: {}}, documentElement: {style: {}}
        };
        const context = {document, window: {OcopStores: {}}, products: require('./data').PRODUCTS,
            restorePageScrollState: () => {document.body.style.overflow = ''; document.documentElement.style.overflow = '';}};
        vm.createContext(context);
        vm.runInContext(html.slice(start, end), context);
        for (let attempt = 0; attempt < 2; attempt++) {
            context.openAllStoresModal();
            assert.equal(modal.hidden, false);
            assert.equal(modal.inert, false);
            assert.equal(classes.has('hidden'), false);
            assert.equal(styles.get('display'), 'flex');
            assert.equal(attributes.get('aria-hidden'), 'false');
            assert.equal(attributes.get('trigger-aria-expanded'), 'true');
            assert.equal(document.body.style.overflow, 'hidden');
            assert.equal(body.scrollTop, 0);
            assert.ok(body.innerHTML.includes('store-provinces-list'));
            assert.ok(focused);
            context.closeAllStoresModal();
            assert.equal(modal.hidden, true);
            assert.equal(modal.inert, true);
            assert.equal(styles.get('display'), 'none');
            assert.equal(attributes.get('trigger-aria-expanded'), 'false');
            assert.equal(document.body.style.overflow, '');
        }
    });
}

for (const page of ['index.html', 'index_2.html']) {
    test(page + ' sends IDE preview API calls to the backend while preserving deployed and configured endpoints', () => {
        const html = fs.readFileSync(page, 'utf8');
        const start = html.indexOf('        function getAIEndpoint(');
        const end = html.indexOf('        const maxAIChatImages', start);
        for (const port of ['3001', '5500', '5173', '8080', '3000']) {
            const context = {URL, window: {location: {hostname: '127.0.0.1', protocol: 'http:', port}}, document: {querySelector: () => null}};
            vm.createContext(context);vm.runInContext(html.slice(start, end), context);
            assert.equal(context.getAIEndpoint('/api/ai/chat'), port === '3000' ? '/api/ai/chat' : 'http://localhost:3000/api/ai/chat');
        }
        const context = {URL, window: {location: {hostname: 'shop.example', protocol: 'https:', port: ''}}, document: {querySelector: () => ({content: 'https://api.example/'})}};
        vm.createContext(context);vm.runInContext(html.slice(start, end), context);
        assert.equal(context.getAIEndpoint('/api/ai/chat'), 'https://api.example/api/ai/chat');
    });
}

test('draft order and admin pages use the same IDE preview backend', () => {
    const source = fs.readFileSync('sales-pages.js', 'utf8');
    const method = source.match(/ api\(path\)\{([\s\S]*?)\},\s*text\(/)[1];
    const context = {URL, location: {hostname: '127.0.0.1', protocol: 'http:', port: '3001'}, document: {querySelector: () => null}, localStorage: {getItem: () => null}};
    vm.createContext(context);vm.runInContext('function api(path) {' + method + '}', context);
    assert.equal(context.api('/api/ai/draft-orders'), 'http://localhost:3000/api/ai/draft-orders');
});

test('account changes are synchronized between the two storefront pages', () => {
    const pages = ['index.html', 'index_2.html'].map(file => fs.readFileSync(file, 'utf8'));
    const normalized = pages.map(page => page.replace(/\r\n/g, '\n').trimEnd());
    assert.ok(normalized[0] === normalized[1], 'both storefront entrypoints contain the same current changes');
    for (const id of ['btn-cust-login-submit', 'btn-cust-reg-submit', 'btn-cust-chpass-submit']) {
        for (const html of pages) assert.equal((html.match(new RegExp('id="' + id + '"', 'g')) || []).length, 1);
    }
    const alert = html => html.slice(html.indexOf('    function showCustomerAuthAlert('), html.indexOf('    function hideCustomerAuthAlert('));
    assert.equal(alert(pages[0]), alert(pages[1]));
});

for (const page of ['index.html', 'index_2.html']) {
    test(page + ' uses the current shared AI fallback and preserves API image results', () => {
        const html = fs.readFileSync(page, 'utf8');
        const start = html.indexOf('        function generateResilientAIResponse(');
        const end = html.indexOf('        function escalateToAdmin()', start);
        const products = require('./data').PRODUCTS;
        const context = {window: {OCOPChatFallback: require('./chat-fallback')}, products, aiConversationHistory: []};
        vm.createContext(context);
        vm.runInContext(html.slice(start, end), context);
        const complaint = context.generateResilientAIResponse('Tôi muốn khiếu nại, hàng bị hỏng', 'vi');
        assert.equal(complaint.handoffAdmin, true);
        assert.equal(complaint.productIds.length, 0);
        assert.ok(!/COGS|CHM|Smart Contract/.test(complaint.message));
        const unavailable = context.generateResilientAIResponse('tea.jpg', 'vi', null, true);
        assert.equal(unavailable.imageMatchStatus, 'unknown');
        assert.equal(unavailable.productIds.length, 0);
        const apiReply = {message: 'Need a clearer label', imageMatchStatus: 'unknown', productIds: []};
        assert.equal(context.generateResilientAIResponse('tea.jpg', 'vi', apiReply, true), apiReply);
        assert.ok(!html.includes('matchProductFromAttachedImages('));
    });
}
