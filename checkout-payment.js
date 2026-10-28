(function(root){
 'use strict';
 const node=typeof module==='object'&&module.exports;
 const qrFactory=node?require('qrcode-generator'):root.qrcode;
 function paymentMethod(value){const text=String(value||'');return /momo/i.test(text)?'momo':/vietqr|bidv/i.test(text)?'vietqr':/cod|cash/i.test(text)?'cod':null;}
 function demoPayload(method,amount,orderId='PREVIEW'){
  return JSON.stringify({kind:'OCOP_DEMO',method,amount:Number.isSafeInteger(amount)&&amount>=0?amount:0,currency:'VND',orderId:String(orderId)});
 }
 function render({document=root.document,method,amount=0,orderId='PREVIEW',language='vi'}){
  const selected=paymentMethod(method);if(!selected)return null;
  const en=language==='en',text=(vi,english)=>en?english:vi;
  const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;};
  const box=el('div','payment-qr-card');box.dataset.method=selected;
  box.append(el('h3','',selected==='cod'?text('Thanh toán khi nhận hàng','Cash on delivery'):selected==='momo'?text('QR MoMo — mô phỏng dự án','MoMo QR — project demo'):text('QR BIDV / VietQR — mô phỏng dự án','BIDV / VietQR QR — project demo')));
  if(selected==='cod'){
   box.append(el('p','',text('Bạn thanh toán khi nhận hàng. Phương thức này không cần mã QR.','Pay when your order arrives. This method does not require a QR code.')));return box;
  }
  box.append(el('p','payment-demo-note',text('MÃ MÔ PHỎNG — KHÔNG DÙNG CHUYỂN TIỀN. Quét mã chỉ xem thông tin demo.','DEMO ONLY — NOT FOR TRANSFERRING MONEY. Scanning shows demo details only.')));
  const layout=el('div','payment-qr-layout'),details=el('div','payment-qr-details');
  if(typeof qrFactory==='function'){
   const code=qrFactory(0,'M');code.addData(demoPayload(selected,amount,orderId));code.make();
   const image=el('img');image.src=code.createDataURL(4,16);image.alt=text('Mã QR mô phỏng ', 'Demo QR code: ')+selected;image.width=208;image.height=208;layout.append(image);
  }else layout.append(el('p','',text('Chưa tải được thư viện QR. Vui lòng tải lại trang.','The QR library could not load. Please reload this page.')));
  details.append(el('p','',orderId==='PREVIEW'?text('Số tiền tạm tính','Estimated amount'):text('Số tiền của đơn hàng','Order amount')),
   el('p','payment-amount',Number(amount||0).toLocaleString('vi-VN')+' ₫'),
   el('p','',orderId==='PREVIEW'?text('Mã sẽ đổi theo phương thức và số tiền bạn chọn.','The code updates with your selected method and amount.'):text('Mã đơn: ','Order: ')+orderId),
   el('p','',text('Đây là luồng thử nghiệm của dự án; mã này không xác nhận giao dịch hay trạng thái đã thanh toán.','This project demo does not confirm a transaction or mark an order as paid.')));
  layout.append(details);box.append(layout);return box;
 }
 const api={paymentMethod,demoPayload,render};if(node)module.exports=api;else root.OCOPDemoPayment=api;
})(typeof globalThis!=='undefined'?globalThis:this);
