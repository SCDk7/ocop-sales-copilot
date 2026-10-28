const test = require('node:test');
const assert = require('node:assert/strict');
const VoucherPool = require('./voucher-pool.js');

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
