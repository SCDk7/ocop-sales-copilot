'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sharp = require('sharp');
const products = require('./data').PRODUCTS;
const knowledge = require('./data/product-image-knowledge.json');

test('a resized product reference works without the AI service; plain images do not invent a match', async () => {
  const honey = knowledge.find(row => row.name === 'Mật ong bạc hà Mèo Vạc');
  const reference = honey.googleImages.find(image => image.downloadStatus === 'ready');
  assert.ok(reference);
  const resized = await sharp(reference.localPath).resize({width: 400}).jpeg({quality: 80}).toBuffer();
  const image = await sharp(resized).resize(24, 24, {fit: 'fill'}).flatten({background: '#ffffff'}).removeAlpha().toColourspace('srgb').raw().toBuffer();
  const rgba = new Uint8Array(24 * 24 * 4);
  for (let i=0,j=0;i<image.length;i+=3) { rgba[j++]=image[i];rgba[j++]=image[i+1];rgba[j++]=image[i+2];rgba[j++]=255; }
  const context = {
    OCOPImageFingerprints: [],
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    createImageBitmap: async value => ({ pixels: value, close() {} }),
    document: {createElement: () => ({getContext: () => ({fillRect() {},drawImage(bitmap) {this.current=bitmap.pixels;},getImageData() {return {data:this.current};}})})},
    URL
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('image-fingerprints.js', 'utf8'), context);
  vm.runInContext(fs.readFileSync('client-image-match.js', 'utf8'), context);
  const matched = await context.OCOPClientImageMatch.match([rgba], products, 'vi');
  assert.equal(matched.productIds[0], honey.id);
  assert.equal(matched.imageMatchStatus, 'similar');
  assert.match(matched.message, /chưa xác minh được nhãn/);
  const plain = new Uint8Array(24 * 24 * 4);
  for(let i=0;i<plain.length;i+=4){plain[i]=40;plain[i+1]=170;plain[i+2]=80;plain[i+3]=255;}
  assert.equal(await context.OCOPClientImageMatch.match([plain], products, 'vi'), null);
});
