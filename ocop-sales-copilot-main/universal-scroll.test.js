const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup({intro = false, region = '', mode = 0, ctrlKey = false, modal = false, cart = false, scrollTop = 0, deltaY = 10} = {}) {
    const source = fs.readFileSync('skytech-complete.js', 'utf8');
    const start = source.indexOf('    (function initUniversalMouseWheelScroll()');
    const end = source.indexOf('    // HERO SHOWCASE', start);
    const calls = [];
    const overlay = {classList: {contains: () => !intro}, style: {}, scrollBy: delta => calls.push(['intro', delta.top])};
    const node = {id: region, classList: {contains: () => false}, parentElement: null, scrollHeight: 800, clientHeight: 200, scrollTop,
        closest: selector => selector.includes(region) && region ? node : null,
        scrollBy: delta => calls.push(['nested', delta.top])};
    const modalContent = {...node, scrollBy: delta => calls.push(['modal', delta.top])};
    const modalNode = {contains: () => false, querySelector: () => modalContent};
    const cartPanel = {classList: {contains: () => cart}, getAttribute: () => cart ? 'false' : 'true', style: {}, querySelector: () => modalContent};
    const document = {body: {style: {}}, documentElement: {style: {}},
        getElementById: id => id === 'ocop-intro-overlay' ? overlay : id === 'cart-ui-panel' && cart ? cartPanel : null, querySelector: () => modal ? modalNode : null};
    let wheel;
    const window = {innerHeight: 700, getComputedStyle: () => ({overflowY: 'auto'}),
        addEventListener: (name, listener) => { wheel = listener; }, scrollBy: delta => calls.push(['page', delta.top])};
    vm.runInNewContext(source.slice(start, end), {window, document});
    let prevented = false;
    wheel({target: node, deltaY, deltaX: 0, deltaMode: mode, ctrlKey, cancelable: true, preventDefault: () => { prevented = true; }});
    return {calls, prevented};
}

test('intro scrolls once over ordinary content, maps and province panels', () => {
    for (const region of ['', 'province-map', 'province-products-panel']) {
        const result = setup({intro: true, region});
        assert.deepEqual(result.calls, [['intro', 13.5]]);
        assert.equal(result.prevented, true);
    }
});

test('page scrolls over maps and nested page sections', () => {
    for (const region of ['', 'province-map', 'province-products-panel']) {
        const result = setup({region});
        assert.deepEqual(result.calls, [['page', 13.5]]);
        assert.equal(result.prevented, true);
    }
});

test('chat retains internal scrolling without double scrolling', () => {
    assert.deepEqual(setup({region: 'ai-chat-window'}).calls, [['nested', 13.5]]);
});

test('category sidebar scrolls internally and hands scrolling back to the page at either boundary', () => {
    const region = 'catalog-sidebar-scroll';
    assert.deepEqual(setup({region}).calls, [['nested', 13.5]]);
    assert.deepEqual(setup({region, scrollTop: 600}).calls, [['page', 13.5]]);
    assert.deepEqual(setup({region, scrollTop: 300, deltaY: -10}).calls, [['nested', -13.5]]);
    assert.deepEqual(setup({region, scrollTop: 0, deltaY: -10}).calls, [['page', -13.5]]);
});

test('line-mode wheels normalize and browser zoom is preserved', () => {
    assert.deepEqual(setup({mode: 1}).calls, [['page', 216]]);
    assert.deepEqual(setup({ctrlKey: true}), {calls: [], prevented: false});
});

test('open account dialogs and carts receive wheel scrolling before the intro', () => {
    assert.deepEqual(setup({intro: true, modal: true}).calls, [['modal', 13.5]]);
    assert.deepEqual(setup({intro: true, cart: true}).calls, [['modal', 13.5]]);
});
