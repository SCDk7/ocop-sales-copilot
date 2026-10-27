const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const os = require('node:os');
const path = require('node:path');
const {syncClientAssets} = require('./scripts/sync-client-assets.cjs');

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
        for (const file of ['giohang.js', 'admin-management.js', 'ai-request-analysis.js', 'skytech-complete.js', 'cart-ui.js', 'account-center.js', 'storefront-ui.js', 'ui-branding.js', 'storefront-navigation.js', 'storefront-router.js']) {
            assert.equal(scripts.filter(src => src === file).length, 1, file + ' is loaded once');
        }
        for (const file of ['skytech-complete.css', 'cart-ui.css', 'account-center.css', 'store-directory-light.css', 'assets/vendor/fonts/jakarta.css', 'assets/vendor/fontawesome/css/all.min.css']) {
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
        const sendStart=html.indexOf('        async function sendAIMessage()');
        const sendEnd=html.indexOf('        function isAIComboRequest(',sendStart);
        assert.ok(!html.slice(sendStart,sendEnd).includes('escalateToAdmin();'), 'support questions use the analyzed request flow');
        for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
            if (/\bsrc=|application\/(?:ld\+)?json/.test(match[1])) continue;
            new vm.Script(match[2], {filename: page});
        }
        assert.ok(!html.includes("localStorage.removeItem('ocop_cart')"), 'guest carts survive reload');
    });
}

test('offline account adapter preserves the current customer on reload', () => {
    const values = new Map([['ocop_current_user', JSON.stringify({username: 'customer'})], ['ocop_users_db', '[]']]);
    const root = {localStorage: {removeItem: key => values.delete(key)}};
    root.window = root;
    vm.runInNewContext(fs.readFileSync('account-client.js', 'utf8'), root);
    assert.equal(JSON.parse(values.get('ocop_current_user')).username, 'customer');
    assert.equal(values.get('ocop_users_db'), '[]');
});

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
