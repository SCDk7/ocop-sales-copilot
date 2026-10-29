'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),vm=require('node:vm');
const codes=require('./product-codes'),{PRODUCTS}=require('./data');
const {createSalesStore}=require('./sales-store');
test('all catalogue codes contain a two-letter group and five digits, are unique and do not depend on sorting',()=>{
 assert.equal(PRODUCTS.length,252);assert.equal(new Set(PRODUCTS.map(p=>p.productCode)).size,252);
 for(const product of PRODUCTS){assert.match(product.productCode,/^[A-Z]{2}\d{5}$/);assert.equal(product.productCode,codes.codeFor(product));assert.equal(product.productCode.slice(0,2),codes.groupFor(product).prefix);assert.equal(Number(product.productCode.slice(2)),product.id);}
 assert.deepEqual(PRODUCTS.slice().reverse().map(codes.codeFor).reverse(),PRODUCTS.map(codes.codeFor));
 assert.equal(codes.codeFor({id:336,category:'tea'}),'TD00336');assert.throws(()=>codes.codeFor({id:100000,category:'tea'}));assert.throws(()=>codes.codeFor({id:-1}));
});
test('browser, Node and seller product search agree on the same group codes',()=>{
 const browser={};vm.runInNewContext(fs.readFileSync('product-codes.js','utf8'),browser);
 for(const product of PRODUCTS)assert.equal(browser.OCOPProductCodes.codeFor(product),codes.codeFor(product));
 const product=PRODUCTS[0];assert(codes.matches(product,'td00336'));assert(codes.matches(product,'THAO DUOC'));assert(!codes.matches(product,'QT00336'));
});
test('inventory and new or existing draft orders retain the canonical code and original numeric identity',t=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-product-codes-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
 const file=path.join(directory,'sales.json'),product={...PRODUCTS[0]},store=createSalesStore(file,[product]);store.setInventory(product.id,5);
 const inventory=store.inventory(product.id);assert.equal(inventory.productCode,product.productCode);assert.equal(inventory.productGroupCode,'TD');
 const draft=store.createDraft({confirmed:true,idempotencyKey:'product-code-test-12345',items:[{productId:product.id,quantity:1,productCode:'QT99999'}],customer:{name:'Test',phone:'0901234567',address:'12 Nguyen Trai, Dong Nai'}});
 assert.equal(draft.lines[0].productCode,'TD00336');assert.equal(draft.lines[0].productId,336);
 const storage=require('./transactional-store').createTransactionalStore(file,{});
 const old=storage.read();delete old.drafts[0].lines[0].productCode;storage.wrap({write:()=>storage.save(old)},()=>{}).write();
 const restarted=createSalesStore(file,[product]);assert.equal(restarted.list()[0].lines[0].productCode,'TD00336');assert.equal(restarted.inventory(336).stock,5);
});
test('admin and distributor scopes expose the same product codes while retaining ownership filters',()=>{
 const storage=new Map();global.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)};
 global.window={PRODUCTS:structuredClone(PRODUCTS)};
 const admin=require('./admin-management');
 admin.setActiveScope('webmaster',null,'ThaoNguyenad01');const all=admin.getScopedDatasets();
 for(const product of all.products)assert.equal(product.productCode,codes.codeFor(product));
 const distributor=admin.getDistributorsList()[0];admin.setActiveScope('distributor',distributor.distributorCode);const scoped=admin.getScopedDatasets();
 for(const product of scoped.products){assert.equal(product.productCode,PRODUCTS.find(row=>row.id===product.id).productCode);assert.equal(product.region,distributor.region);}
});
