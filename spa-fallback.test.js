const test=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');
const path=require('node:path');
const {createSpaFallback}=require('./spa-fallback');
const {resolveRoute}=require('./storefront-router');

test('direct navigation and reload return the app shell while APIs/assets keep 404',async()=>{
 const app=express();
 app.use(express.static(__dirname));
 app.use(createSpaFallback(path.join(__dirname,'index.html')));
 const server=app.listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try {
  for(const route of ['/san-pham/336','/products/336?from=share','/gio-hang','/unknown/nested/route']){
   const response=await fetch(base+route,{headers:{Accept:'text/html'}});
   assert.equal(response.status,200);
   assert.equal(response.redirected,false);
   const html=await response.text();assert.match(html,/<base href="\/">/);assert.match(html,/storefront-router\.js/);
  }
  for(const route of ['/api/missing','/images/missing.png','/missing.js','/assets/missing','/admin/missing','/.private-data/missing']){
   assert.equal((await fetch(base+route,{headers:{Accept:'text/html'}})).status,404,route);
  }
  assert.equal((await fetch(base+'/products/336',{headers:{Accept:'application/json'}})).status,404);
  assert.equal((await fetch(base+'/products/336',{method:'POST'})).status,404);
  assert.equal((await fetch(base+'/products/336',{method:'HEAD',headers:{Accept:'text/html'}})).status,200);
 } finally {await new Promise(resolve=>server.close(resolve));}
});
test('client routes open the requested product or cart without rewriting its URL',()=>{
 assert.deepEqual(resolveRoute('/products/336'),{type:'product',id:336});
 assert.deepEqual(resolveRoute('/san-pham/525/'),{type:'product',id:525});
 assert.deepEqual(resolveRoute('/gio-hang'),{type:'cart'});
 assert.equal(resolveRoute('/products/not-a-number'),null);
});
