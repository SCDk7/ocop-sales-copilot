const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('draft-order.js','utf8');
test('order summaries preserve buyer identity on receipt updates without leaking receipt tokens',()=>{
 const values=new Map();const context={localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)}};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('function syncOrderSummary('),source.indexOf('function showDraft(')),context);
 context.syncOrderSummary({id:'TEST',status:'pending_seller_confirmation',customer:{name:'Khách mua',phone:'0901000000'},lines:[{productId:101,quantity:2,unitPrice:100000}],receiptToken:'secret'});
 context.syncOrderSummary({id:'TEST',status:'completed',customerReceivedAt:'2026-10-29T00:00:00Z'});
 const rows=JSON.parse(values.get('ocop_online_orders'));assert.equal(rows.length,1);assert.equal(rows[0].customerPhone,'0901000000');assert.equal(rows[0].lines[0].quantity,2);assert.equal(rows[0].status,'completed');assert.equal(rows[0].receiptToken,undefined);
});
function fixture(fetch){
 class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.style={};this.dataset={};this.hidden=false;this.textContent='';}
  append(...children){this.children.push(...children)}
  replaceChildren(...children){this.children=children}
  addEventListener(){}
 }
 const nodes=Object.fromEntries(['draftForm','items','status','result','submit','add'].map(id=>[id,new Element()]));
 const heading=new Element('h1'),intro=new Element('p');
 const values=new Map([['ocop_cart','[{"id":1,"quantity":1}]'],['ocop_current_user','{"username":"customer"}']]);
 const document={getElementById:id=>nodes[id]||null,createElement:tag=>new Element(tag),addEventListener(){},querySelector:selector=>selector==='h1'?heading:selector==='h1 + p'?intro:null};
 nodes.items.children=[{querySelector:selector=>selector==='select'?{value:'1'}:{value:'1'}}];
 const formData={name:'Customer',phone:'0901234567',address:'12 Nguyen Trai, Dong Nai',confirmed:'on',payment_method:'cod'};
 const context={document,fetch,URL,URLSearchParams,Event,crypto:require('node:crypto'),
  localStorage:{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)},
  sessionStorage:{getItem:()=>null},location:{href:'http://localhost/draft-order.html?products=1'},history:{replaceState(){}},
  salesPage:{language:'vi',text:vi=>vi,api:path=>path},FormData:class{get(key){return formData[key]}},confirm:()=>true,dispatchEvent(){}};
 context.window=context;vm.createContext(context);
 vm.runInContext(source.slice(0,source.indexOf('(async () => {')),context);
 const all=node=>[node,...(node.children||[]).flatMap(all)];
 return {context,nodes,values,all,
  render(draft){context.testDraft=draft;vm.runInContext("receiptAccess='"+'a'.repeat(64)+"';showDraft(testDraft)",context);}};
}
const draft=status=>({id:'OCOP-DRAFT-test',status,lines:[{name:'Trà',quantity:1,unitPrice:100000}],subtotal:100000,total:null,receiptToken:'a'.repeat(64),inventoryVerified:false});

test('a rejected checkout preserves the cart and never fabricates a successful order',async()=>{
 for(const failure of [async()=>{throw new TypeError('Failed to fetch')},async()=>({ok:false,status:409,json:async()=>({error:'Hết hàng'})})]){
  const {nodes,values}=fixture(failure);
  await nodes.draftForm.onsubmit({preventDefault(){}});
  assert.equal(nodes.status.className,'error');assert.match(nodes.status.textContent,/Chưa gửi được/);
  assert.ok(values.has('ocop_cart'));assert.equal(values.has('ocop_customer_orders'),false);
  assert.equal(nodes.result.children.length,0);
 }
});

test('an accepted order stays pending and has a tracking link without a receipt button',async()=>{
 const {nodes,values,all}=fixture(async()=>({ok:true,json:async()=>({draft:draft('pending_seller_confirmation')})}));
 await nodes.draftForm.onsubmit({preventDefault(){}});
 assert.match(nodes.result.children[0].textContent,/chờ người bán xác nhận/);
 assert.doesNotMatch(nodes.status.textContent,/thành công|hoàn thành/);
 assert.equal(all(nodes.result).some(node=>node.id==='confirm-order-received'),false);
 assert.equal(JSON.parse(values.get('ocop_customer_orders'))[0].status,'pending_seller_confirmation');
 assert.equal(nodes.draftForm.hidden,true);assert.equal(values.has('ocop_cart'),false);
 const link=all(nodes.result).find(node=>node.tag==='a');
 assert.ok(link.href.includes('#receipt='));assert.ok(!new URL(link.href).search.includes('receipt'));
});

test('receipt completion is shown only after customer confirmation and a successful server response',async()=>{
 let requests=0;
 const {context,nodes,values,all,render}=fixture(async(url,options)=>{
  requests++;assert.match(url,/\/received$/);assert.equal(options.headers.Authorization,'Bearer '+'a'.repeat(64));
  assert.equal(JSON.parse(options.body).confirmed,true);
  return {ok:true,json:async()=>({draft:{...draft('completed'),customerReceivedAt:'2026-10-28T10:00:00Z'}})};
 });
 render(draft('shipped'));
 const receive=all(nodes.result).find(node=>node.id==='confirm-order-received');assert.ok(receive);
 context.confirm=()=>false;await receive.onclick();assert.equal(requests,0);
 context.confirm=()=>true;await receive.onclick();assert.equal(requests,1);
 assert.match(nodes.result.children[0].textContent,/Đơn hàng hoàn thành/);
 assert.equal(JSON.parse(values.get('ocop_customer_orders'))[0].status,'completed');
 assert.equal(all(nodes.result).some(node=>node.id==='confirm-order-received'),false);
});

test('a failed receipt confirmation keeps the existing shipping state',async()=>{
 const {nodes,values,all,render}=fixture(async()=>({ok:false,json:async()=>({error:'Đơn chưa được gửi hàng.'})}));
 render(draft('shipped'));
 const receive=all(nodes.result).find(node=>node.id==='confirm-order-received');await receive.onclick();
 assert.equal(nodes.status.className,'error');assert.equal(receive.disabled,false);
 assert.match(nodes.result.children[0].textContent,/Đang giao/);assert.equal(values.has('ocop_customer_orders'),false);
});


test('order with voucher shows voucher as directly applied without waiting for seller confirmation', async () => {
 const draftWithVoucher = { ...draft('pending_seller_confirmation'), voucherCode: 'GIAM20K', subtotal: 100000 };
 const { nodes, all, render } = fixture(async () => ({ ok: true, json: async () => ({ draft: draftWithVoucher }) }));
 render(draftWithVoucher);
 const voucherP = all(nodes.result).find(n => n.textContent && n.textContent.includes('GIAM20K'));
 assert.ok(voucherP, 'Voucher line is present');
 assert.doesNotMatch(voucherP.textContent, /chờ người bán xác nhận/, 'Voucher is applied directly without waiting for seller');
 assert.match(voucherP.textContent, /Đã áp dụng trực tiếp/);
});
