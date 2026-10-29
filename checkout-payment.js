(function(root){
 'use strict';
 const node=typeof module==='object'&&module.exports;
 const qrFactory=node?require('qrcode-generator'):root.qrcode;
 function paymentMethod(value){const text=String(value||'');return /momo/i.test(text)?'momo':/vietqr|bidv/i.test(text)?'vietqr':/cod|cash/i.test(text)?'cod':null;}
 function demoPayload(method,amount,orderId='PREVIEW'){
  return JSON.stringify({kind:'OCOP_DEMO',method,amount:Number.isSafeInteger(amount)&&amount>=0?amount:0,currency:'VND',orderId:String(orderId)});
 }
 const recipientDefaults=Object.freeze({bank:'BIDV',bin:'970418',account:'8808661371',name:'Hoang Nguyen Thanh Binh'});
 function recipient(value={}){
  const result={...recipientDefaults,...value};
  for(const key of ['bank','bin','account','name'])result[key]=String(result[key]||'').trim();
  if(!/^\d{6}$/.test(result.bin)||!/^\d{6,19}$/.test(result.account)||!result.bank||!result.name||result.bank.length>60||result.name.length>100)throw new Error('Thông tin tài khoản demo không hợp lệ.');
  return result;
 }
 function bankQR({amount,orderId='PREVIEW',reference}){
  if(!Number.isSafeInteger(amount)||amount<=0||amount>9999999999999)throw new Error('Số tiền thanh toán không hợp lệ.');
  const clean=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const memo=clean(reference||('OCOP '+(orderId==='PREVIEW'?'TAM TINH':orderId))).slice(0,50);
  const bank=recipient();
  const params=new URLSearchParams({amount:String(amount),addInfo:memo,accountName:bank.name.toUpperCase()});
  return {bank,amount,memo,url:'https://img.vietqr.io/image/'+bank.bin+'-'+bank.account+'-qr_only.svg?'+params};
 }
 function renderBank({document,amount,orderId,language,onClose}){
  const text=(vi,en)=>{const locale=node?require('./site-language'):root.OCOPLanguage;if(locale){const result=locale.text(vi,language);return result!==vi||language==='vi'?result:locale.text(en,language);}return language==='en'?en:vi;};
  const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;};
  const box=el('section','payment-qr-card bank-payment-card');box.dataset.method='vietqr';
  const header=el('div','bank-payment-header'),title=el('h3','',text('Thanh toán','Payment')),close=el('button','bank-payment-close','×');close.type='button';close.ariaLabel=text('Đóng khung thanh toán','Close payment panel');header.append(title,close);box.append(header);
  const reopen=el('button','bank-payment-reopen',text('Hiện mã thanh toán','Show payment QR'));reopen.type='button';reopen.hidden=true;
  const content=el('div','bank-payment-content');box.append(content,reopen);
  close.onclick=()=>{if(typeof onClose==='function'){onClose();return;}content.hidden=true;close.hidden=true;reopen.hidden=false;};
  reopen.onclick=()=>{content.hidden=false;close.hidden=false;reopen.hidden=true;};
  if(!Number.isSafeInteger(amount)||amount<=0||amount>9999999999999){content.append(el('p','',text('Chọn sản phẩm để tạo mã thanh toán.','Select products to generate a payment QR.')));return box;}
  const intro=el('p','bank-payment-intro',text('Mở ứng dụng ngân hàng và quét mã','Open your banking app and scan the code'));
  const timer=el('p','bank-payment-timer'),brand=el('div','bank-payment-brand','VietQR'),image=el('img','bank-payment-image');
  image.alt=text('QR chuyển khoản BIDV','BIDV bank transfer QR');image.width=360;image.height=360;image.referrerPolicy='no-referrer';
  const notice=el('p','bank-payment-feedback');notice.role='status';notice.ariaLive='polite';
  const info=el('dl','bank-payment-info');
  const row=(label,value,cls='')=>{const wrapper=el('div',cls),dt=el('dt','',label),dd=el('dd','',value);wrapper.append(dt,dd);info.append(wrapper);return dd;};
  row(text(orderId==='PREVIEW'?'Số tiền tạm tính':'Số tiền','Amount'),amount.toLocaleString('vi-VN')+' VND','bank-payment-total');
  const memoText=row(text('Nội dung','Reference'),'');
  const bank=recipient();row(text('Ngân hàng','Bank'),bank.bank);row(text('Chủ tài khoản','Beneficiary'),bank.name);row(text('Số tài khoản','Account number'),bank.account);
  const actions=el('div','bank-payment-actions'),download=el('button','',text('Tải mã QR','Download QR')),share=el('button','',text('Chia sẻ','Share'));
  for(const button of [download,share])button.type='button';actions.append(download,share);
  content.append(intro,timer,brand,image,info,actions,notice,el('p','bank-payment-caption',text('Thời gian làm mới mã hiển thị; trạng thái nhận tiền chờ xác nhận.','Display refresh timer; receipt of funds requires confirmation.')));
  let expiresAt=0,current;
  function renew(){
   const suffix=(root.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9]/g,'').slice(0,10).toUpperCase();
   const base=('OCOP '+(orderId==='PREVIEW'?'TAM TINH':String(orderId))).replace(/[^a-zA-Z0-9 ]/g,' ').slice(0,37);
   current=bankQR({amount,orderId,reference:base+' '+suffix});image.src=current.url;memoText.textContent=current.memo;expiresAt=Date.now()+120000;
   box.dataset.paymentState='awaiting_confirmation';notice.textContent='';
  }
  function tick(){if(Date.now()>=expiresAt)renew();const seconds=Math.max(0,Math.ceil((expiresAt-Date.now())/1000));timer.textContent=text('Làm mới mã sau: ','Refresh in: ')+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
  image.onerror=()=>{notice.textContent=text('Chưa tải được QR. Bạn có thể chuyển khoản bằng thông tin tài khoản bên dưới.','QR could not load. You can use the account details below.');};
  image.onload=()=>{notice.textContent='';};
  async function qrFile(snapshot){
   const response=await root.fetch(snapshot.url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('QR download failed');const blob=await response.blob();
   if(!/^image\//i.test(blob.type)||blob.size>2000000)throw new Error('Invalid QR image');
   const extension=blob.type.includes('svg')?'svg':blob.type.includes('png')?'png':'img';
   return {blob,name:'OCOP-QR-'+snapshot.memo.replace(/[^a-zA-Z0-9]/g,'-')+'.'+extension};
  }
  download.onclick=async()=>{const snapshot=current;download.disabled=true;try{const {blob,name}=await qrFile(snapshot),url=root.URL.createObjectURL(blob),link=el('a');link.href=url;link.download=name;link.click();root.setTimeout(()=>root.URL.revokeObjectURL(url),1000);}catch{notice.textContent=text('Không tải được ảnh QR. Vui lòng thử lại hoặc lưu ảnh QR đang hiển thị.','Could not download QR. Please retry or save the displayed image.');}finally{download.disabled=false;}};
  share.onclick=async()=>{const snapshot=current;share.disabled=true;try{
   const data={title:text('Thanh toán OCOP','OCOP payment'),text:bank.bank+' · '+bank.account+' · '+bank.name+'\n'+amount.toLocaleString('vi-VN')+' VND\n'+snapshot.memo};
   if(root.navigator?.share){
    let file;try{const {blob,name}=await qrFile(snapshot);file=new root.File([blob],name,{type:blob.type});}catch{}
    if(file&&root.navigator.canShare?.({files:[file]}))data.files=[file];else data.url=snapshot.url;
    await root.navigator.share(data);
   }else if(root.navigator?.clipboard?.writeText){await root.navigator.clipboard.writeText(data.text+'\n'+snapshot.url);notice.textContent=text('Đã sao chép thông tin và liên kết QR.','Payment details and QR link copied.');}
   else notice.textContent=text('Trình duyệt chưa hỗ trợ chia sẻ. Bạn có thể dùng nút Tải mã QR.','Sharing is unavailable. Please use Download QR.');
  }catch(error){if(error.name!=='AbortError')notice.textContent=text('Chưa chia sẻ được. Vui lòng dùng nút Tải mã QR.','Could not share. Please use Download QR.');}finally{share.disabled=false;}};
  renew();tick();
  if(!node){const interval=root.setInterval(()=>{if(!box.isConnected){root.clearInterval(interval);return;}tick();},1000);}
  return box;
 }
 // This state machine is deliberately local: a scan is never evidence of money received.
 function createSession({now=Date.now,id=()=>root.crypto?.randomUUID?.()||String(Math.random()).slice(2)}={}){
  let state;
  const renew=()=>state={id:id(),status:'waiting',expiresAt:now()+120000};
  renew();
  return {
   snapshot(){return {...state};},
   tick(){if(now()>=state.expiresAt){if(state.status==='waiting')renew();else if(state.status==='scanned')state={...state,status:'cancelled'};}return {...state};},
   scan(sessionId){this.tick();if(sessionId!==state.id||state.status!=='waiting')return false;state={...state,status:'scanned',expiresAt:now()+1200000};return true;},
   succeed(sessionId){this.tick();if(sessionId!==state.id||state.status!=='scanned')return false;state={...state,status:'success'};return true;},
   renew
  };
 }
 function render({document=root.document,method,amount=0,orderId='PREVIEW',language='vi',onClose}){
  const selected=paymentMethod(method);if(!selected)return null;
  if(selected==='vietqr')return renderBank({document,amount,orderId,language,onClose});
  const en=language==='en',text=(vi,english)=>{const locale=node?require('./site-language'):root.OCOPLanguage;if(locale){const result=locale.text(vi,language);return result!==vi||language==='vi'?result:locale.text(english,language);}return en?english:vi;};
  const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;};
  const box=el('div','payment-qr-card');box.dataset.method=selected;
  box.append(el('h3','',selected==='cod'?text('Thanh toán khi nhận hàng','Cash on delivery'):selected==='momo'?text('QR MoMo — mô phỏng dự án','MoMo QR — project demo'):text('QR BIDV / VietQR — mô phỏng dự án','BIDV / VietQR QR — project demo')));
  if(selected==='cod'){
   box.append(el('p','',text('Bạn thanh toán khi nhận hàng. Phương thức này không cần mã QR.','Pay when your order arrives. This method does not require a QR code.')));return box;
  }
  const layout=el('div','payment-qr-layout'),details=el('div','payment-qr-details');
  let qrImage;
  if(typeof qrFactory==='function'){
   const code=qrFactory(0,'M');code.addData(demoPayload(selected,amount,orderId));code.make();
   const image=el('img');qrImage=image;image.src=code.createDataURL(4,16);image.alt=text('Mã QR mô phỏng ', 'Demo QR code: ')+selected;image.width=208;image.height=208;layout.append(image);
  }else layout.append(el('p','',text('Chưa tải được thư viện QR. Vui lòng tải lại trang.','The QR library could not load. Please reload this page.')));
  details.append(el('p','',orderId==='PREVIEW'?text('Số tiền tạm tính','Estimated amount'):text('Số tiền của đơn hàng','Order amount')),
   el('p','payment-amount',Number(amount||0).toLocaleString('vi-VN')+' ₫'),
   el('p','',orderId==='PREVIEW'?text('Mã sẽ đổi theo phương thức và số tiền bạn chọn.','The code updates with your selected method and amount.'):text('Mã đơn: ','Order: ')+orderId));
  layout.append(details);box.append(layout);
  return box;
 }
 const api={paymentMethod,demoPayload,render,createSession,recipient,recipientDefaults,bankQR};if(node)module.exports=api;else{root.OCOPPayment=api;root.OCOPDemoPayment=api;}
})(typeof globalThis!=='undefined'?globalThis:this);
