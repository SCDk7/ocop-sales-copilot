const test = require('node:test');
const assert = require('node:assert/strict');
const VoucherPool = require('./voucher-pool.js');
const fs = require('node:fs');
const vm = require('node:vm');

function countdownFixture(now, savedDeadline) {
    const source = fs.readFileSync('skytech-complete.js', 'utf8');
    const start = source.indexOf('    window.refreshHeroVouchers = function');
    const end = source.indexOf("    if (document.readyState === 'loading')", start);
    let current = now, rotations = 0;
    const nodes = Object.fromEntries(['hero-voucher-cards-container','hero-countdown-h','hero-countdown-m','hero-countdown-s'].map(id => [id, {}]));
    const storage = new Map(savedDeadline ? [['ocop_hero_voucher_deadline', String(savedDeadline)]] : []);
    const intervals = [], events = {};
    class Clock extends Date {
        constructor(...args) { super(...(args.length ? args : [current])); }
        static now() { return current; }
    }
    const document = {hidden: false, getElementById: id => nodes[id], addEventListener: (event, callback) => events[event] = callback};
    const context = {Date: Clock, document, sessionStorage: {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value)},
        setInterval: callback => intervals.push(callback),
        showToast() { throw Error('Automatic voucher rotation must be silent'); },
        VoucherPool: {getActiveVouchers: () => VoucherPool.getActiveVouchers(), getRandomVouchers(count) { rotations++; return VoucherPool.getRandomVouchers(count); }, renderVoucherCardsToContainer(container, vouchers) { container.vouchers = vouchers; }}};
    context.window = context;
    vm.runInNewContext(source.slice(start, end), context);
    context.initHeroPromoCountdown();
    return {context, nodes, storage, intervals, events, get rotations() { return rotations; }, advance(time) { current = time; intervals[0](); }};
}

test('countdown automatically changes vouchers once at expiry even when midnight ticks were skipped', () => {
    const midnight = new Date(2026, 9, 29).getTime();
    const fixture = countdownFixture(midnight - 2000);
    const initial = fixture.nodes['hero-voucher-cards-container'].vouchers.map(v => v.code).join();
    assert.equal(fixture.nodes['hero-countdown-s'].textContent, '02');
    fixture.advance(midnight - 1);
    assert.equal(fixture.rotations, 0, 'Do not replace vouchers before the deadline');
    fixture.advance(midnight + 60000);
    assert.equal(fixture.rotations, 1);
    assert.notEqual(fixture.nodes['hero-voucher-cards-container'].vouchers.map(v => v.code).join(), initial);
    fixture.events.visibilitychange();
    fixture.context.initHeroPromoCountdown();
    assert.equal(fixture.rotations, 1, 'No repeated replacement within the new countdown');
    assert.equal(fixture.intervals.length, 1, 'Initialization does not add duplicate timers');
    fixture.advance(new Date(2026, 9, 30).getTime());
    assert.equal(fixture.rotations, 2, 'The next expiry also replaces vouchers');
});

test('reloading after a saved deadline replaces the expired vouchers immediately', () => {
    const midnight = new Date(2026, 9, 29).getTime();
    const fixture = countdownFixture(midnight + 60000, midnight);
    assert.equal(fixture.rotations, 1);
    assert.equal(Number(fixture.storage.get('ocop_hero_voucher_deadline')), new Date(2026, 9, 30).getTime());
    fixture.advance(midnight + 61000);
    assert.equal(fixture.rotations, 1);
});

test('VoucherPool configuration has exactly 99 million vouchers', () => {
    assert.equal(VoucherPool.TOTAL_VOUCHERS, 99000000, 'Total vouchers must be 99 million');
    assert.ok(VoucherPool.VOUCHER_TIERS.length >= 6, 'Multiple voucher tiers available');
});

test('generateVoucherAtIndex produces valid deterministic voucher codes', () => {
    const v0 = VoucherPool.generateVoucherAtIndex(0);
    const v1 = VoucherPool.generateVoucherAtIndex(1);
    const vLast = VoucherPool.generateVoucherAtIndex(98999999);

    assert.ok(v0.code.includes('-'), 'Code has prefix and serial');
    assert.ok(v0.discount > 0, 'Discount is positive');
    assert.notEqual(v0.code, v1.code, 'Sequential vouchers have distinct codes');
    assert.ok(vLast.code, 'Last voucher at index 98,999,999 generates cleanly');
});

test('pool automatically wraps around from start when 99 million is reached', () => {
    // Set index to 98,999,999 (the last voucher)
    VoucherPool.setPoolIndex(98999999);
    assert.equal(VoucherPool.getPoolIndex(), 98999999);

    // Pull 2 vouchers across the boundary
    const vouchers = VoucherPool.getNextVouchers(2);
    assert.equal(vouchers.length, 2);
    assert.equal(vouchers[0].index, 98999999);
    assert.equal(vouchers[1].index, 0, 'Index wraps around to 0 when 99 million is exhausted');

    // Current index is now 1
    assert.equal(VoucherPool.getPoolIndex(), 1);
});

test('getRandomVouchers returns diverse vouchers and wraps around 99M', () => {
    const setA = VoucherPool.getRandomVouchers(3);
    assert.equal(setA.length, 3);
    for (const v of setA) {
        assert.ok(v.code);
        assert.ok(v.discount > 0);
        assert.ok(v.theme);
    }
});

test('validateVoucher validates both legacy codes and 99M generated codes', () => {
    // 1. Legacy codes
    const legacy = VoucherPool.validateVoucher('OCOP2026', 100000);
    assert.equal(legacy.valid, true);
    assert.equal(legacy.discount, 50000);

    const freeship = VoucherPool.validateVoucher('FREESHIP', 50000);
    assert.equal(freeship.valid, true);
    assert.equal(freeship.discount, 25000);

    // 2. 99M Generated vouchers
    const gen = VoucherPool.generateVoucherAtIndex(42);
    const resGen = VoucherPool.validateVoucher(gen.code, gen.minOrder + 1000);
    assert.equal(resGen.valid, true);
    assert.equal(resGen.discount, gen.discount);

    // 3. Min order checks
    const underMin = VoucherPool.validateVoucher('GIAM100K', 200000); // requires 500k
    assert.equal(underMin.valid, false);
    assert.match(underMin.error, /chỉ áp dụng cho đơn/);

    // 4. Invalid codes
    const invalid = VoucherPool.validateVoucher('HOANTOAN_SAI');
    assert.equal(invalid.valid, false);
    assert.match(invalid.error, /không hợp lệ/);
});

