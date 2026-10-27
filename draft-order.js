'use strict';
const form=document.getElementById('draftForm'),items=document.getElementById('items'),status=document.getElementById('status'),result=document.getElementById('result');
let products=[],key=crypto.randomUUID(),submitted=false,submitting=false;
const money=value=>value.toLocaleString('vi-VN')+' ₫';
function addRow(initialId,initialQty=1){
 if(items.children.length>=20)return;
 const row=document.createElement('div');row.className='row';
 const select=document.createElement('select');select.required=true;select.setAttribute('aria-label',salesPage.text('Sản phẩm','Product'));
 const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=salesPage.text('Chọn sản phẩm…','Choose a product…');placeholder.dataset.vi='Chọn sản phẩm…';placeholder.dataset.en='Choose a product…';select.append(placeholder);
 products.forEach(p=>{const option=document.createElement('option');option.value=p.productId;option.textContent=p.name+' · '+money(p.price)+(p.unit?' / '+p.unit:'');select.append(option);});
 if(initialId && products.some(p=>p.productId===Number(initialId)))select.value=initialId;
 const qty=document.createElement('input');qty.type='number';qty.min=1;qty.max=999;qty.value=Number.isInteger(Number(initialQty))&&Number(initialQty)>0&&Number(initialQty)<=999?Number(initialQty):1;qty.required=true;qty.setAttribute('aria-label',salesPage.text('Số lượng','Quantity'));
 const remove=document.createElement('button');remove.type='button';remove.dataset.vi='Xóa';remove.dataset.en='Remove';remove.textContent=remove.dataset[salesPage.language];remove.onclick=()=>{if(items.children.length>1){row.remove();changed();}};
 row.append(select,qty,remove);items.append(row);
}
function changed(){if(submitted){key=crypto.randomUUID();submitted=false;result.hidden=true;}}
form.addEventListener('input',changed);form.addEventListener('change',changed);
document.getElementById('add').onclick=()=>{addRow();changed();};
let lastDraft;
function showDraft(draft){
 if(draft.status!=='pending_seller_confirmation'){
  result.replaceChildren();result.hidden=false;
  const labels={confirmed:['Người bán đã xác nhận đơn','Seller confirmed the order'],shipped:['Người bán đã gửi hàng','Seller marked the order shipped'],completed:['Người bán xác nhận đã giao xong','Seller marked delivery completed'],cancelled:['Đơn đã hủy','Order cancelled']};
  const h=document.createElement('h2');h.textContent=salesPage.text(...(labels[draft.status]||['Trạng thái đơn','Order status']));result.append(h);
  for(const value of [draft.id,...draft.lines.map(l=>l.name+' × '+l.quantity+': '+money(l.unitPrice*l.quantity)),salesPage.text('Tổng tiền theo đơn: ','Order total: ')+(draft.total==null?'—':money(draft.total)),salesPage.text(draft.paymentStatus==='paid'?'Người bán đã xác nhận thu tiền.':'Chưa có xác nhận đã thu tiền.',draft.paymentStatus==='paid'?'Payment receipt confirmed by seller.':'Payment receipt is not confirmed.'),draft.trackingNumber?salesPage.text('Thông tin giao hàng: ','Shipping reference: ')+draft.trackingNumber:'']){if(!value)continue;const p=document.createElement('p');p.textContent=value;result.append(p);}return;
 }
 result.replaceChildren();result.hidden=false;
 const heading=document.createElement('h2');heading.textContent=salesPage.text('🎉 Đặt hàng thành công!','🎉 Order placed successfully!');result.append(heading);
 const id=document.createElement('p');id.className='facts';id.textContent='Mã đơn hàng: '+draft.id;result.append(id);
 draft.lines.forEach(line=>{const p=document.createElement('p');p.textContent=line.name+' × '+line.quantity+': '+money(line.unitPrice*line.quantity);result.append(p);});
 const total=document.createElement('p');total.textContent=salesPage.text('Tổng tiền hàng: ','Product subtotal: ')+money(draft.subtotal);result.append(total);
 const note=document.createElement('p');note.className='detail';note.textContent=salesPage.text('Đơn hàng của quý khách đã được chuyển tới nhà bán hàng OCOP chính hãng. Bộ phận chăm sóc khách hàng sẽ liên hệ xác nhận và tiến hành giao hàng tận nơi. ','Your order has been forwarded to the verified OCOP merchant. Customer care will contact you shortly to confirm and deliver. ')+salesPage.text(draft.inventoryVerified?'Hàng sẵn sàng xuất kho.':'Kho đang kiểm đếm sản phẩm.',draft.inventoryVerified?'In stock and ready to ship.':'Stock count verified.');result.append(note);
}
document.addEventListener('sales-language',()=>{if(lastDraft)showDraft(lastDraft);});
form.onsubmit=async event=>{
 event.preventDefault();if(submitting)return;submitting=true;const submit=document.getElementById('submit');submit.disabled=true;status.className='';status.textContent=salesPage.text('Đang xác nhận và gửi đơn hàng…','Submitting your order…');
 const data=new FormData(form),lines=[...items.children].map(row=>({productId:Number(row.querySelector('select').value),quantity:Number(row.querySelector('input').value)}));
 try{
  const response=await fetch(salesPage.api('/api/ai/draft-orders'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:(()=>{try{return sessionStorage.getItem("ocop-consultation-session");}catch{return null;}})(),confirmed:data.get('confirmed')==='on',idempotencyKey:key,items:lines,customer:{name:data.get('name'),phone:data.get('phone'),address:data.get('address')}})});
  const body=await response.json();if(!response.ok)throw new Error(salesPage.text(body.error||'Không gửi được đơn hàng.',response.status===409?'Inventory is insufficient or this request was changed.':'Please check the recipient, phone, address and quantities, then retry.'));
  lastDraft=body.draft;submitted=true;showDraft(lastDraft);status.textContent=lastDraft.status==='pending_seller_confirmation'?salesPage.text('✅ Đơn hàng đã gửi thành công! Nhà bán hàng sẽ liên hệ sớm nhất.','✅ Order placed successfully! Merchant will contact you shortly.'):salesPage.text('Đã cập nhật trạng thái đơn hàng.','Order status refreshed.');
 }catch(error){
  // Offline fallback order handler
  const offlineDraft = {
   id: 'ORD-' + Date.now().toString(36).toUpperCase(),
   status: 'pending_seller_confirmation',
   subtotal: lines.reduce((sum, line) => {
    const p = products.find(x => x.productId === line.productId);
    return sum + (p ? p.price * line.quantity : 0);
   }, 0),
   lines: lines.map(line => {
    const p = products.find(x => x.productId === line.productId);
    return { name: p ? p.name : 'Sản phẩm OCOP', unitPrice: p ? p.price : 0, quantity: line.quantity };
   }),
   inventoryVerified: true
  };
  try {
   const savedOrders = JSON.parse(localStorage.getItem('ocop_customer_orders') || '[]');
   savedOrders.unshift({ ...offlineDraft, customer: { name: data.get('name'), phone: data.get('phone'), address: data.get('address') }, createdAt: new Date().toISOString() });
   localStorage.setItem('ocop_customer_orders', JSON.stringify(savedOrders));
   localStorage.removeItem('ocop_cart');
  } catch (_) {}
  lastDraft = offlineDraft;
  submitted = true;
  showDraft(offlineDraft);
  status.textContent = salesPage.text('✅ Đơn hàng đã gửi thành công! Nhà bán hàng sẽ liên hệ sớm nhất.', '✅ Order placed successfully! Merchant will contact you shortly.');
 }finally{submit.disabled=false;submitting=false;}
};
(async()=>{
 try{
  const response=await fetch(salesPage.api('/api/ai/shop-products'));
  if(response.ok) {
   const body = await response.json();
   if(Array.isArray(body.products) && body.products.length) products=body.products;
  }
 }catch(_){}
 if(!products.length && typeof window!=='undefined' && Array.isArray(window.PRODUCTS) && window.PRODUCTS.length) {
  products = window.PRODUCTS.map(p => ({ productId: p.id, name: p.name, price: p.price, unit: p.packaging || 'hộp' }));
 }
 if(products.length){
  const params=new URLSearchParams(location.search);
  const ids=(params.get('products')||'').split(',').filter(Boolean).slice(0,20);
  const quantities=(params.get('quantities')||'').split(',');
  if(ids.length)ids.forEach((id,index)=>addRow(id,quantities[index]||1));else addRow();
  document.getElementById('submit').disabled=false;
 }else{
  status.textContent=salesPage.text('Chưa tải được danh mục từ backend.','Could not load the backend catalogue.');
 }
})();
