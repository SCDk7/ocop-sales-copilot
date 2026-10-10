const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createSalesStore}=require('./sales-store');
const products=[{id:1,name:'Trà',region:'Đồng Nai',price:100000,priceIsReference:true,packaging:'hộp'},{id:2,name:'Hạt điều',price:200000}];
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-sales-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));const file=path.join(dir,'sales.json');return {file,store:createSalesStore(file,structuredClone(products))};}
const body=()=>({confirmed:true,idempotencyKey:'test-draft-123456789',items:[{productId:1,quantity:2,price:1}],customer:{name:'Khách demo',phone:'0901234567',address:'12 Nguyễn Văn Trỗi, Đồng Nai'}});
test('unknown stock stays unknown, draft uses backend prices and persists without a reservation',t=>{
 const {file,store}=fixture(t);assert.equal(store.inventory(1).stock,null);assert.equal(store.inventory(1).available,null);
 const draft=store.createDraft(body());assert.equal(draft.subtotal,200000);assert.equal(draft.total,null);assert.equal(draft.shippingFee,null);assert.equal(draft.reserved,false);assert.equal(draft.inventoryVerified,false);
 const restarted=createSalesStore(file,products);assert.equal(restarted.list()[0].id,draft.id);assert.equal(restarted.createDraft(body()).reused,true);assert.equal(restarted.stats().draftOrders,1);
});
test('verified inventory, invalid quantities, insufficient stock and confirmation are enforced',t=>{
 const {store}=fixture(t);store.setInventory(1,1);assert.equal(store.inventory(1,2).available,false);
 assert.throws(()=>store.createDraft(body()),{status:409});
 assert.throws(()=>store.inventory(1,0));assert.throws(()=>store.inventory(1,1.5));assert.throws(()=>store.setInventory(1,-1));assert.throws(()=>store.inventory(999),{status:404});
 assert.throws(()=>store.createDraft({...body(),confirmed:false}));
 store.setInventory(1,5);const draft=store.createDraft(body());assert.equal(draft.inventoryVerified,true);assert.equal(store.inventory(1).stock,5);
 store.setInventory(1,0);assert.equal(store.createDraft(body()).id,draft.id);
});
test('idempotency keys cannot be reused for another customer or request',t=>{
 const {store}=fixture(t);store.createDraft(body());
 assert.throws(()=>store.createDraft({...body(),items:[{productId:1,quantity:3}]}),{status:409});
 assert.throws(()=>store.createDraft({...body(),customer:{...body().customer,name:'Khách khác'}}),{status:409});
 assert.throws(()=>store.createDraft({...body(),idempotencyKey:'other-key-123456789',items:[{productId:1,quantity:1},{productId:1,quantity:1}]}));
});

test('seller price persists and updates shared catalogue used by AI and checkout',t=>{
 const {file}=fixture(t),catalogue=structuredClone(products),store=createSalesStore(file,catalogue);
 store.updateProduct(1,{price:125000,stock:9});assert.equal(catalogue[0].price,125000);assert.equal(catalogue[0].priceIsReference,false);assert.equal(store.createDraft(body()).subtotal,250000);
 const restart=createSalesStore(file,structuredClone(products));assert.equal(restart.inventory(1).price,125000);assert.equal(restart.inventory(1).stock,9);
 assert.throws(()=>store.updateProduct(1,{price:-1,stock:2}));assert.equal(store.inventory(1).stock,9);
 assert.throws(()=>store.updateProduct(1,{}));assert.throws(()=>store.updateProduct(99,{price:100}),{status:404});
});

test('confirmation atomically reserves stock once, cancellation releases it once',t=>{
 const {store}=fixture(t);store.setInventory(1,5);const draft=store.createDraft(body());
 assert.throws(()=>store.transition(draft.id,{action:'confirm',shippingFee:0}));assert.equal(store.inventory(1).stock,5);
 const result=store.transition(draft.id,{action:'confirm',shippingFee:20000,customerAgreed:true});assert.equal(result.total,220000);assert.equal(result.status,'confirmed');assert.equal(result.reserved,true);assert.equal(store.inventory(1).stock,3);
 assert.equal(store.transition(draft.id,{action:'confirm',shippingFee:20000,customerAgreed:true}).reused,true);assert.equal(store.inventory(1).stock,3);
 store.transition(draft.id,{action:'cancel'});assert.equal(store.inventory(1).stock,5);store.transition(draft.id,{action:'cancel'});assert.equal(store.inventory(1).stock,5);
 assert.throws(()=>store.transition(draft.id,{action:'ship',trackingNumber:'test'}),{status:409});
});

test('confirmation rejects changed prices or unknown and depleted inventory without partial reservations',t=>{
 const {store}=fixture(t);const draft=store.createDraft(body());
 assert.throws(()=>store.transition(draft.id,{action:'confirm',shippingFee:0,customerAgreed:true}),{status:409});
 store.updateProduct(1,{stock:10,price:120000});assert.throws(()=>store.transition(draft.id,{action:'confirm',shippingFee:0,customerAgreed:true}),{status:409});assert.equal(store.inventory(1).stock,10);
 store.updateProduct(1,{price:100000});const second=store.createDraft({...body(),idempotencyKey:'second-order-123456',items:[{productId:1,quantity:2},{productId:2,quantity:1}]});
 store.setInventory(2,0);assert.throws(()=>store.transition(second.id,{action:'confirm',shippingFee:0,customerAgreed:true}),{status:409});assert.equal(store.inventory(1).stock,10);
});

test('shipping, completion and payment are independent and revenue requires seller confirmation',t=>{
 const {file,store}=fixture(t);store.setInventory(1,5);const draft=store.createDraft({...body(),sessionId:'chat-session-123456789'},{consultationVerified:true});
 assert.throws(()=>store.transition(draft.id,{action:'paid',paymentReference:'receipt'}),{status:409});
 store.transition(draft.id,{action:'confirm',shippingFee:10000,customerAgreed:true});
 assert.throws(()=>store.transition(draft.id,{action:'complete'}),{status:409});
 store.transition(draft.id,{action:'ship',trackingNumber:'TRACK-001'});store.transition(draft.id,{action:'complete'});
 const range=['2020-01-01T00:00:00Z','2099-01-01T00:00:00Z'];assert.equal(store.businessStats(...range).paidRevenue,0);assert.equal(store.businessStats(...range).completedOrders,1);
 assert.throws(()=>store.transition(draft.id,{action:'paid',paymentReference:''}));
 store.transition(draft.id,{action:'paid',paymentReference:'Receipt checked'});store.transition(draft.id,{action:'paid',paymentReference:'Receipt checked'});
 const stats=store.businessStats(...range);assert.equal(stats.paidRevenue,210000);assert.equal(stats.chatbotPaidRevenue,210000);assert.equal(stats.paidOrders,1);
 assert.throws(()=>store.transition(draft.id,{action:'cancel'}),{status:409});assert.equal(store.businessStats('2090-01-01T00:00:00Z','2099-01-01T00:00:00Z').paidRevenue,0);
 const restarted=createSalesStore(file,structuredClone(products));assert.equal(restarted.list()[0].paymentStatus,'paid');assert.equal(restarted.list()[0].history.length,4);
});

test('a fabricated session cannot attribute storefront revenue to the chatbot',t=>{
 const {store}=fixture(t);store.setInventory(1,5);const draft=store.createDraft({...body(),sessionId:'fabricated-session-12345',source:'chatbot',consultationVerified:true});
 store.transition(draft.id,{action:'confirm',shippingFee:0,customerAgreed:true});store.transition(draft.id,{action:'paid',paymentReference:'Cash received'});
 const stats=store.businessStats('2020-01-01T00:00:00Z','2099-01-01T00:00:00Z');assert.equal(stats.paidRevenue,200000);assert.equal(stats.chatbotPaidRevenue,0);assert.equal(draft.source,'storefront');
});
