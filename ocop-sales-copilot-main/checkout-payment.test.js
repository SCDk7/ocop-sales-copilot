'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createSession,recipient}=require('./checkout-payment');
test('unscanned demo QR rotates at two minutes and rejects old session IDs',()=>{
 let time=0,serial=0;const session=createSession({now:()=>time,id:()=>String(++serial)});
 const original=session.snapshot();time=119999;assert.equal(session.tick().id,original.id);
 time=120000;const next=session.tick();assert.notEqual(next.id,original.id);assert.equal(next.expiresAt,240000);
 assert.equal(session.scan(original.id),false);assert.equal(session.succeed(original.id),false);
 assert.equal(session.scan(next.id),true);
});
test('scan waits twenty minutes for demo confirmation without claiming payment',()=>{
 let time=0;const session=createSession({now:()=>time,id:()=>String(time)});
 time=30000;const id=session.snapshot().id;assert.equal(session.scan(id),true);
 assert.equal(session.snapshot().status,'scanned');assert.equal(session.snapshot().expiresAt,1230000);
 time=1229999;assert.equal(session.tick().status,'scanned');
 time=1230000;assert.equal(session.tick().status,'cancelled');assert.equal(session.succeed(id),false);
});
test('only scanned current demo sessions can succeed, and completed sessions do not rotate',()=>{
 let time=0;const session=createSession({now:()=>time,id:()=>String(time)}),id=session.snapshot().id;
 assert.equal(session.succeed(id),false);assert.equal(session.scan(id),true);assert.equal(session.scan(id),false);
 assert.equal(session.succeed('wrong'),false);assert.equal(session.succeed(id),true);
 time=9999999;assert.equal(session.tick().status,'success');assert.equal(session.scan(id),false);
});
test('demo beneficiary has configurable validated account information',()=>{
 assert.equal(recipient().account,'8808661371');
 assert.equal(recipient({account:'1234567890'}).account,'1234567890');
 assert.throws(()=>recipient({bin:'abc'}));assert.throws(()=>recipient({account:'invalid'}));assert.throws(()=>recipient({name:''}));
});
test('bank preview has QR, reference, download, share and accessible close/reopen controls',()=>{
 const {render}=require('./checkout-payment');
 class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};}append(...items){this.children.push(...items);}}
 const document={createElement:tag=>new Element(tag)},all=node=>[node,...node.children.flatMap(all)];
 const box=render({document,method:'vietqr',amount:100000});
 const nodes=all(box);
 const image=nodes.find(n=>n.tag==='img');
 assert.equal(box.dataset.paymentState,'awaiting_confirmation');
 const url=new URL(image.src);assert.equal(url.hostname,'img.vietqr.io');assert.equal(url.searchParams.get('amount'),'100000');
 assert.ok(nodes.some(n=>n.className==='bank-payment-timer'));
 const buttons=nodes.filter(n=>n.tag==='button');assert.equal(buttons.length,4);
 assert.ok(buttons.some(n=>n.textContent==='Tải mã QR'));assert.ok(buttons.some(n=>n.textContent==='Chia sẻ'));
 const content=nodes.find(n=>n.className==='bank-payment-content');
 buttons.find(n=>n.className==='bank-payment-close').onclick();assert.equal(content.hidden,true);
 buttons.find(n=>n.className==='bank-payment-reopen').onclick();assert.equal(content.hidden,false);
});
test('bank URLs validate amounts and normalize payment references',()=>{
 const {bankQR}=require('./checkout-payment');
 for(const amount of [-1,0,NaN,Infinity,1.5,10000000000000])assert.throws(()=>bankQR({amount}));
 const qr=bankQR({amount:250000,reference:'Đơn <script> / TEST 123'}),url=new URL(qr.url);
 assert.equal(qr.bank.account,'8808661371');assert.equal(url.searchParams.get('amount'),'250000');assert.match(qr.memo,/^[a-zA-Z0-9 ]+$/);
 assert.equal(url.searchParams.get('accountName'),'HOANG NGUYEN THANH BINH');
 assert.ok(bankQR({amount:1,reference:'X'.repeat(200)}).memo.length<=50);
});
