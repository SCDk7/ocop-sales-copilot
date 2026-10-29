(function(){
'use strict';
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const user=()=>window.getCurrentCustomer?.();
const money=n=>Number(n||0).toLocaleString('vi-VN')+' đ';
let modal,content,notice,tab='profile',status='Tất cả',oldOverflow='',returnFocus;
const labels={profile:'Hồ sơ của tôi',addresses:'Địa chỉ nhận hàng',orders:'Đơn mua',favorites:'Sản phẩm yêu thích',password:'Đổi mật khẩu'};
const passwordPane=document.getElementById?.('cust-pane-chpass');passwordPane?.remove();
function clearPasswordFields(){passwordPane?.querySelectorAll('input').forEach(input=>{input.value='';input.type='password';});passwordPane?.querySelectorAll('.customer-password-toggle').forEach(button=>{button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Hiện mật khẩu');button.title='Hiện mật khẩu';});}
function node(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n}
function button(text,fn){const b=node('button',text);b.type='button';b.onclick=fn;return b}
const navIcons={
 profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 addresses:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 orders:'<path d="m3 7 9-4 9 4v10l-9 4-9-4Z"/><path d="m3 7 9 4 9-4M12 11v10M7.5 5l9 4"/>',
 favorites:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
 password:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
 partner:'<path d="M3 10V4h18v6M3 4l-1 6a3 3 0 0 0 5 2 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 5-2l-1-6M4 13v8h16v-8M9 21v-6h6v6"/>',
 admin:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
 cart:'<path d="M2 3h3l3 12h12l2-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/>',
 logout:'<path d="M9 4H4v16h5M10 12h12m-5-5 5 5-5 5"/>'
};
function navButton(id,label,action){
 const b=button(null,action);b.title=label;b.setAttribute('aria-label',label);b.className='account-nav-icon';
 b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+navIcons[id]+'</svg>';
 return b;
}
function key(s){return 'ocop_account_'+String(user()?.username||'').toLowerCase()+'_'+s}
function orders(){
 const u=user(),rows=[];
 for(const name of ['ocop_online_orders','ocop_customer_orders']){const saved=read(name,[]);if(Array.isArray(saved))rows.push(...saved)}
 return [...new Map(rows.filter(o=>o.username&&String(o.username).toLowerCase()===String(u.username).toLowerCase()).map(o=>[o.id||o.orderId,o])).values()];
}
function orderStatus(order){
 if(order.status==='completed')return order.customerReceivedAt?'Hoàn thành':'Chờ xác nhận nhận hàng';
 return {pending_seller_confirmation:'Chờ xác nhận',confirmed:'Đã xác nhận',shipped:'Đang giao',cancelled:'Đã hủy'}[order.status]||order.status||'Chờ xác nhận';
}
function renderOrders(u){
 const tabs=node('div',null,'account-order-tabs');
 for(const s of ['Tất cả','Chờ xác nhận','Đã xác nhận','Chờ thanh toán','Đang giao','Chờ xác nhận nhận hàng','Hoàn thành','Đã hủy']){
  const b=button(s,()=>{status=s;render()});b.setAttribute('aria-pressed',String(status===s));tabs.append(b);
 }
 content.append(tabs);
 const rows=orders().filter(o=>status==='Tất cả'||orderStatus(o)===status);
 if(!rows.length)content.append(node('p','Chưa có đơn hàng trong mục này.','account-center-empty'));
 for(const o of rows){
  const card=node('article',null,'account-center-card');
  card.append(node('strong',o.orderId||o.id||'Đơn hàng'),node('p',orderStatus(o)),
   node('p',o.productName||(o.items||o.lines||[]).map(x=>typeof x==='string'?x:(x.name||'')+(x.quantity?' × '+x.quantity:'')).join(', ')),
   node('p',(o.total==null&&o.grandTotal==null?'Tiền hàng tạm tính: ':'Tổng tiền: ')+money(o.total??o.grandTotal??o.subtotal)),
   button('Xem chi tiết',()=>{const d=node('div');d.append(node('p','Ngày đặt: '+(o.createdAt||o.date||'Chưa có dữ liệu')),node('p','Người nhận: '+(o.customerName||u.fullName||'')),node('p','Địa chỉ: '+(o.address||o.shippingAddress||'Chưa có dữ liệu')),node('p','Số điện thoại: '+(o.customerPhone||u.phone||'')));card.append(d)}));
  if(o.receiptToken&&o.id){
   const link=node('a',o.status==='shipped'?'Theo dõi / xác nhận đã nhận hàng':'Theo dõi đơn hàng','account-order-tracking');
   const url=new URL('draft-order.html',document.baseURI);url.searchParams.set('order',o.id);url.hash='receipt='+o.receiptToken;link.href=url.href;card.append(link);
  }
  content.append(card);
 }
}
function close(){if(!modal)return;clearPasswordFields();modal.hidden=true;if(notice)notice.hidden=true;document.body.style.overflow=oldOverflow;returnFocus?.focus()}
function showNotice(message){
 if(!user())return false;
 if(!modal||modal.hidden)show();
 notice.textContent=message;notice.hidden=false;notice.focus({preventScroll:true});return true;
}
function show(section='profile'){
 if(!user())return window.openCustomerAuthModal();
 if(!modal){modal=node('div',null,'account-center');modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Tài khoản của tôi');
 const box=node('div',null,'account-center-box'),head=node('header',null,'account-center-head');head.append(node('strong','Tài khoản của tôi'),button('Đóng ×',close));
 notice=node('div',null,'account-center-notice');notice.hidden=true;notice.setAttribute('role','alert');notice.tabIndex=-1;
 const layout=node('div',null,'account-center-layout'),nav=node('nav',null,'account-center-nav');nav.setAttribute('aria-label','Quản lý tài khoản');
 for(const [id,title]of Object.entries(labels)){const b=navButton(id,title,()=>show(id));b.dataset.section=id;nav.append(b);if(id==='profile')nav.append(navButton('cart','Giỏ hàng',()=>{close();window.openCartUI?.()}))}
 nav.append(navButton('partner','Đăng ký điểm bán',()=>{close();window.openPartnerRegistrationModal?.()}),navButton('admin','Quản trị',()=>window.promptAdminPinModal?.(close)),navButton('logout','Đăng xuất',()=>{close();window.handleCustomerLogout?.()}));content=node('section',null,'account-center-content');layout.append(nav,content);box.append(head,notice,layout);modal.append(box);document.body.append(modal);modal.onclick=e=>{if(e.target===modal)close()};modal.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const a=[...modal.querySelectorAll('button,input,select,textarea')].filter(n=>!n.disabled&&n.getClientRects().length);const first=a[0],last=a.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});}
 if(modal.hidden){returnFocus=document.activeElement;oldOverflow=document.body.style.overflow}modal.hidden=false;document.body.style.overflow='hidden';tab=section;
 modal.querySelectorAll('[data-section]').forEach(n=>n.setAttribute('aria-current',n.dataset.section===tab?'page':'false'));render();modal.querySelector('button').focus();
}
function field(form,label,value,name,type='text'){const l=node('label',label),i=node('input');i.name=name;i.type=type;i.value=value||'';i.maxLength=250;l.append(i);form.append(l);return i}
function render(){const u=user();if(!u)return close();content.replaceChildren(node('h2',labels[tab]),node('p',u.fullName||u.username,'account-center-user'));
 if(tab==='password'){
  clearPasswordFields();const alert=node('p','');alert.id='account-password-alert';alert.setAttribute('role','alert');
  if(passwordPane){passwordPane.classList.remove('hidden');passwordPane.querySelector('#cust-chpass-not-logged')?.classList.add('hidden');passwordPane.querySelector('#cust-chpass-form')?.classList.remove('hidden');const label=passwordPane.querySelector('#chpass-username-display');if(label)label.textContent=u.username;content.append(alert,passwordPane);}return;
 }
 if(tab==='profile'){
  const f=node('form');
  const isAdmin=u.role==='admin'||u.role==='super_admin'||u.isAdmin||Boolean(u.adminId)||['admin','ad','thaonguyenad01','kimnganad02','vinhphucad03','thanhbinhad04'].includes(String(u.username||'').toLowerCase());
  const isDist=u.role==='distributor'||u.isDistributor;
  let userCode=u.customerCode||u.adminCode||u.distributorCode||'';
  if(isAdmin){
    if(!userCode||!userCode.startsWith('AD')||userCode.length!==12){
      const adNum=String(u.adminId||u.username||'1').replace(/\D/g,'')||'1';
      userCode='AD26'+adNum.padStart(8,'0');
    }
  }else if(isDist){
    if(!userCode||!userCode.startsWith('NPP')||userCode.length!==12){
      userCode=u.distributorCode||'NPP260000001';
    }
  }else{
    if(!userCode||userCode.length!==12||!userCode.startsWith('KH')){
      userCode=userCode&&userCode.startsWith('KH')?userCode:'KH2600000001';
    }
  }
  if(u.customerCode!==userCode){
    u.customerCode=userCode;
    if(isAdmin)u.adminCode=userCode;
    try{localStorage.setItem('ocop_current_user',JSON.stringify(u));}catch(_){}
  }
  const codeLabel=isAdmin?'Mã quản trị viên (12 ký tự)':(isDist?'Mã nhà phân phối (12 ký tự)':'Mã khách hàng (12 ký tự)');
  field(f,codeLabel,userCode,'customerCode').disabled=true;
  field(f,'Tên đăng nhập',u.username,'username').disabled=true;field(f,'Họ và tên',u.fullName,'fullName').required=true;field(f,'Số điện thoại',u.phone,'phone','tel');field(f,'Email',u.email,'email','email');const submit=node('button','Lưu thay đổi');submit.type='submit';const note=node('p','Thông tin được lưu trên trình duyệt này.','account-center-note');f.append(submit,note);f.onsubmit=e=>{e.preventDefault();const data=new FormData(f),next={...u,fullName:String(data.get('fullName')).trim(),phone:String(data.get('phone')).trim(),email:String(data.get('email')).trim()};if(!next.fullName)return;try{const db=read('ocop_customers',[]);const entry=db.find(c=>c.username===u.username);if(entry)Object.assign(entry,next);localStorage.setItem('ocop_customers',JSON.stringify(db));localStorage.setItem('ocop_current_user',JSON.stringify(next));window.updateCustomerHeaderUI?.();note.textContent='Đã lưu thông tin.'}catch{note.textContent='Không lưu được. Hãy kiểm tra quyền lưu dữ liệu của trình duyệt.'}};
  const extraActions=node('div',null,'account-center-extra-actions');extraActions.style.cssText='margin-top:20px;padding-top:16px;border-top:1.5px dashed #bae6fd;display:flex;flex-direction:column;gap:8px;';
  extraActions.append(node('strong','Kênh đối tác & Quản lý:'));
  const btnRow=node('div');btnRow.style.cssText='display:flex;gap:8px;flex-wrap:wrap;';
  const bOcr=button('⚡ Đăng Ký Điểm Bán',()=>{close();window.openPartnerRegistrationModal?.()});
  bOcr.style.cssText='background:#0284c7!important;color:#fff!important;border:none;border-radius:9px;padding:9px 14px;font-weight:700;text-align:center;font-size:12px;';
  const bAdm=button('🔒 Quản trị',()=>window.promptAdminPinModal?.(close));
  bAdm.style.cssText='background:#0f172a!important;color:#fff!important;border:1.5px solid #38bdf8;border-radius:9px;padding:9px 14px;font-weight:700;text-align:center;font-size:12px;';
  btnRow.append(bOcr,bAdm);extraActions.append(btnRow);
  content.append(f,extraActions);return}
 if(tab==='addresses'){const rows=read(key('addresses'),u.address?[{name:u.fullName,phone:u.phone,address:u.address,default:true}]:[]);rows.forEach((a,index)=>{const card=node('article',null,'account-center-card');card.append(node('strong',a.name+(a.default?' · Mặc định':'')),node('p',a.phone),node('p',a.address),button('Đặt mặc định',()=>{rows.forEach((r,i)=>r.default=i===index);saveAddresses(rows)}),button('Xóa',()=>{rows.splice(index,1);if(rows.length&&!rows.some(r=>r.default))rows[0].default=true;saveAddresses(rows)}));content.append(card)});if(!rows.length)content.append(node('p','Bạn chưa có địa chỉ nhận hàng.'));
 const f=node('form');field(f,'Người nhận','','name').required=true;field(f,'Số điện thoại','','phone','tel').required=true;const a=field(f,'Địa chỉ đầy đủ','','address');a.required=true;const b=node('button','Thêm địa chỉ');b.type='submit';f.append(b);f.onsubmit=e=>{e.preventDefault();const d=new FormData(f);rows.push({name:String(d.get('name')).trim(),phone:String(d.get('phone')).trim(),address:String(d.get('address')).trim(),default:!rows.length});saveAddresses(rows)};content.append(f,node('p','Địa chỉ được lưu trên trình duyệt này.','account-center-note'));return}
 if(tab==='orders'){renderOrders(u);return}
 if(tab==='favorites'){const ids=read(key('favorites'),[]),products=(window.PRODUCTS||[]).filter(p=>ids.includes(p.id));if(!products.length)content.append(node('p','Bạn chưa lưu sản phẩm yêu thích.'));for(const p of products){const card=node('article',null,'account-center-card');card.append(node('strong',p.name),node('p',money(p.price)),button('Xem sản phẩm',()=>{close();window.openProvinceProductDetails?.(p.id)}),button('Bỏ yêu thích',()=>{localStorage.setItem(key('favorites'),JSON.stringify(ids.filter(id=>id!==p.id)));render()}));content.append(card)}}
}
function saveAddresses(rows){try{localStorage.setItem(key('addresses'),JSON.stringify(rows));const u=user(),next={...u,address:rows.find(r=>r.default)?.address||''};localStorage.setItem('ocop_current_user',JSON.stringify(next));const db=read('ocop_customers',[]),entry=db.find(c=>c.username===u.username);if(entry)entry.address=next.address;localStorage.setItem('ocop_customers',JSON.stringify(db));render()}catch{window.showToast?.('Không lưu được địa chỉ.','error')}}
const originalOpen=window.openCustomerAuthModal,originalSwitch=window.switchCustomerAuthTab;
if(originalOpen){window.openCustomerAuthModal=function(){if(user())show('profile');else originalOpen()};window.switchCustomerAuthTab=function(section){if((section==='orders'||section==='chpass')&&user()){window.closeCustomerAuthModal?.();show(section==='chpass'?'password':'orders')}else originalSwitch(section==='chpass'?'login':section)};}
const originalFavorite=window.toggleWishlist;
if(originalFavorite)window.toggleWishlist=function(id){if(!user())return originalFavorite(id);const ids=read(key('favorites'),[]),index=ids.indexOf(id);if(index<0)ids.push(id);else ids.splice(index,1);localStorage.setItem(key('favorites'),JSON.stringify(ids));if(typeof wishlist!=='undefined')wishlist=ids.slice();window.updateWishlistBadge?.();window.showToast?.(index<0?'Đã lưu sản phẩm yêu thích.':'Đã bỏ yêu thích.','success')};
window.openAccountCenter=show;
window.showAccountNotice=showNotice;
window.addEventListener?.('storage',event=>{if(['ocop_customer_orders','ocop_online_orders'].includes(event.key)&&modal&&!modal.hidden&&tab==='orders')render()});
window.addEventListener?.('ocop-orders-updated',()=>{if(modal&&!modal.hidden&&tab==='orders')render()});
})();

