const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {createReviewStore}=require('./product-reviews');
test('real reviews persist across restart, ignore demo stats and calculate all ratings',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-reviews-'));
  try {
    const file=path.join(dir,'reviews.json');let store=createReviewStore(file,[336,337]);
    const request={requestId:crypto.randomUUID(),name:'Khách thử',rating:5,comment:'Sản phẩm đóng gói tốt.'};
    store.add(336,request);assert.equal(store.add(336,request).duplicate,true);
    store.add(336,{...request,requestId:crypto.randomUUID(),rating:1});
    store=createReviewStore(file,[336,337]);assert.deepEqual(store.summary(336),{productId:336,reviews:2,rating:3});
    assert.equal(store.summary(337).reviews,0);assert.equal(store.enrich([{id:337,rating:5,reviews:999}])[0].rating,null);
    assert.equal(store.list(336).items[0].verifiedPurchase,false);
    assert.throws(()=>store.add(999,request),error=>error.status===404);
    assert.throws(()=>store.add(336,{...request,rating:6}),error=>error.status===400);
    assert.throws(()=>store.add(336,{...request,comment:'Changed text'}),error=>error.status===409);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
test('review photos persist, reject unsafe formats and preserve submission idempotency',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-review-photos-'));
  try {
    const file=path.join(dir,'reviews.json');let store=createReviewStore(file,[336]);
    const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2YtAAAAAASUVORK5CYII=';
    const request={requestId:crypto.randomUUID(),name:'Photo customer',rating:4,comment:'Packaging photo attached.',images:[png]};
    const result=store.add(336,request);assert.equal(result.review.images.length,1);
    assert.equal(store.add(336,request).duplicate,true);
    store=createReviewStore(file,[336]);const image=store.image(result.review.images[0].id);
    assert.equal(image.mimeType,'image/png');assert.equal(image.buffer.toString('base64'),png.split(',')[1]);
    assert.throws(()=>store.image('../reviews.json'),e=>e.status===404);
    assert.throws(()=>store.add(336,{...request,images:[]}),e=>e.status===409);
    for(const images of [[png,png,png,png],['data:image/svg+xml;base64,PHN2Zz4='],['data:image/png;base64,PGh0bWw+SGVsbG88L2h0bWw+'],['data:image/png;base64,'+Buffer.alloc(500001).toString('base64')]]) {
      assert.throws(()=>store.add(336,{...request,requestId:crypto.randomUUID(),images}),e=>e.status===400);
    }
    assert.equal(store.summary(336).reviews,1);
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
