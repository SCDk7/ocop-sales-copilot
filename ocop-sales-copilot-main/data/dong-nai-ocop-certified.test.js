'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const certifiedOcop = require('./dong-nai-ocop-certified');

test('official Dong Nai OCOP registry contains only the 25 three-star records', () => {
    assert.equal(certifiedOcop.records.length, 25);
    assert.ok(certifiedOcop.records.every(record => record.stars === 3));
    assert.ok(certifiedOcop.records.every(record => record.province === 'Đồng Nai'));
    assert.ok(certifiedOcop.records.every(record => record.coordinates === null));
    assert.equal(certifiedOcop.source.decisionNumber, '125/QĐ-UBND');
    assert.match(certifiedOcop.source.url, /^https:\/\/dongnai\.gov\.vn\//);
});

test('official registry search matches Vietnamese names without diacritics', () => {
    const matches = certifiedOcop.filterRecords('banh sua long thanh');
    assert.equal(matches.length, 5);
    assert.ok(matches.every(record => record.stars === 3));
    assert.equal(certifiedOcop.filterRecords('Đồng Nai').length, 25);
});

test('public registry output includes the official star rating and score', () => {
    const html = certifiedOcop.renderPublicList('Rau Nhíp');
    assert.match(html, /product-card/);
    assert.match(html, /Rau Nhíp/);
    assert.match(html, /3★ SAO OCOP/);
    assert.match(html, /62 điểm/);
    assert.doesNotMatch(html, /Giá:|Mua ngay|Thêm vào giỏ/);
});
