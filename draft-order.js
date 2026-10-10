'use strict';
const form=document.getElementById('draftForm'),items=document.getElementById('items'),status=document.getElementById('status'),result=document.getElementById('result');
let products=[],key=crypto.randomUUID(),submitted=false,submitting=false;
const money=value=>value.toLocaleString('vi-VN')+' ₫';
function addRow(initialId){
 if(items.children.length>=20)return;
 const row=document.createElement('div');row.className='row';
 const select=document.createElement('select');select.required=true;select.setAttribute('aria-label',salesPage.text('Sản phẩm','Product'));
 const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=salesPage.text('Chọn sản phẩm…','Choose a product…');placeholder.dataset.vi='Chọn sản phẩm…';placeholder.dataset.en='Choose a product…';select.append(placeholder);
 products.forEach(p=>{const option=document.createElement('option');option.value=p.productId;option.textContent=p.name+' · '+money(p.price)+(p.unit?' / '+p.unit:'');select.append(option);});
 if(initialId && products.some(p=>p.productId===Number(initialId)))select.value=initialId;
 const qty=document.createElement('input');qty.type='number';qty.min=1;qty.max=999;qty.value=1;qty.required=true;qty.setAttribute('aria-label',salesPage.text('Số lượng','Quantity'));
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
 const heading=document.createElement('h2');heading.textContent=salesPage.text('Đã lưu đơn nháp','Draft saved');result.append(heading);
 const id=document.createElement('p');id.className='facts';id.textContent=draft.id;result.append(id);
 draft.lines.forEach(line=>{const p=document.createElement('p');p.textContent=line.name+' × '+line.quantity+': '+money(line.unitPrice*line.quantity);result.append(p);});
 const total=document.createElement('p');total.textContent=salesPage.text('Tạm tính theo danh mục: ','Catalogue subtotal: ')+money(draft.subtotal);result.append(total);
 const note=document.createElement('p');note.className='detail';note.textContent=salesPage.text('Chờ người bán xác nhận. Chưa gồm phí giao hàng, chưa chốt giá thanh toán và chưa giữ hàng. ','Pending seller confirmation. Shipping and final payable amount are unconfirmed; stock is not reserved. ')+salesPage.text(draft.inventoryVerified?'Đã kiểm tra số lượng trong kho ở thời điểm tạo nháp.':'Một số sản phẩm chưa có dữ liệu kho; người bán cần kiểm tra.',draft.inventoryVerified?'Inventory was checked at draft creation.':'Some inventory data is unavailable and requires seller review.');result.append(note);
}
document.addEventListener('sales-language',()=>{if(lastDraft)showDraft(lastDraft);});
form.onsubmit=async event=>{
 event.preventDefault();if(submitting)return;submitting=true;const submit=document.getElementById('submit');submit.disabled=true;status.className='';status.textContent=salesPage.text('Đang kiểm tra và lưu đơn nháp…','Checking and saving draft…');
 const data=new FormData(form),lines=[...items.children].map(row=>({productId:Number(row.querySelector('select').value),quantity:Number(row.querySelector('input').value)}));
 try{
  const response=await fetch(salesPage.api('/api/ai/draft-orders'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:(()=>{try{return sessionStorage.getItem("ocop-consultation-session");}catch{return null;}})(),confirmed:data.get('confirmed')==='on',idempotencyKey:key,items:lines,customer:{name:data.get('name'),phone:data.get('phone'),address:data.get('address')}})});
  const body=await response.json();if(!response.ok)throw new Error(salesPage.text(body.error||'Không tạo được đơn nháp.',response.status===409?'Inventory is insufficient or this request was changed.':'Please check the recipient, phone, address and quantities, then retry.'));
  lastDraft=body.draft;submitted=true;showDraft(lastDraft);status.textContent=lastDraft.status==='pending_seller_confirmation'?salesPage.text('Đã lưu. Đây chưa phải đơn hàng đã chốt.','Saved. This is not a confirmed order.'):salesPage.text('Đã cập nhật trạng thái từ backend.','Status refreshed from the backend.');
 }catch(error){status.className='error';status.textContent=error.message;}finally{submit.disabled=false;submitting=false;}
};
(async()=>{try{
 const response=await fetch(salesPage.api('/api/ai/shop-products'));if(!response.ok)throw new Error();products=(await response.json()).products;
 if(!products.length)throw new Error();
 const ids=(new URLSearchParams(location.search).get('products')||'').split(',').filter(Boolean).slice(0,20);if(ids.length)ids.forEach(id=>addRow(id));else addRow();document.getElementById('submit').disabled=false;
}catch{status.textContent=salesPage.text('Chưa tải được danh mục từ backend.','Could not load the backend catalogue.');}})();
