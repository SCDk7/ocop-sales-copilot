'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const productCodes=require('./product-codes');
function createSalesStore(file,products) {
 const catalogue=new Map(products.map(p=>[p.id,p]));
 let db={inventory:{},drafts:[]};
 try{db=JSON.parse(fs.readFileSync(file,'utf8'));if(!db.inventory||!Array.isArray(db.drafts))throw new Error('Invalid sales store');}catch(e){if(e.code!=='ENOENT')throw e;}
 db.prices??={};
 for(const draft of db.drafts)for(const line of draft.lines||[]){const product=catalogue.get(line.productId);if(product&&!line.productCode)line.productCode=productCodes.codeFor(product);}
 function applyPrice(id,price){const p=catalogue.get(Number(id));if(p){Object.assign(p,{price,priceMin:price,priceMax:price,priceIsReference:false});}}
 for(const [id,row] of Object.entries(db.prices))applyPrice(id,row.price);
 const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
 function save(next){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(next,null,2),{mode:0o600});fs.renameSync(file+'.tmp',file);db=next;}
 function receiptToken(draft){return crypto.createHmac('sha256',db.receiptSecret).update(draft.id+'\n'+draft.idempotencyKey).digest('hex');}
 function issueReceiptAccess(draft){
  if(!db.receiptSecret){const next=structuredClone(db);next.receiptSecret=crypto.randomBytes(32).toString('hex');save(next);}
  return {...draft,receiptToken:receiptToken(draft)};
 }
 function customerOrder(id,token){
  const draft=db.drafts.find(row=>row.id===id);
  if(!draft||!db.receiptSecret||typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token)||!crypto.timingSafeEqual(Buffer.from(token,'hex'),Buffer.from(receiptToken(draft),'hex')))fail('Không tìm thấy đơn hoặc liên kết theo dõi không hợp lệ.',404);
  const {status,lines,subtotal,total,shippingFee,paymentStatus,paymentMethod,voucherCode,inventoryVerified,reserved,trackingNumber,createdAt,customerReceivedAt,completedAt}=draft;
  return structuredClone({id,status,lines,subtotal,total,shippingFee,paymentStatus,paymentMethod,voucherCode,inventoryVerified,reserved,trackingNumber,createdAt,customerReceivedAt,completedAt});
 }
 function confirmReceipt(id,token,{confirmed}={}){
  customerOrder(id,token);
  if(confirmed!==true)fail('Cần xác nhận bạn đã nhận được hàng.');
  const next=structuredClone(db),draft=next.drafts.find(row=>row.id===id);
  if(draft.status==='completed'&&draft.customerReceivedAt)return {...customerOrder(id,token),reused:true};
  if(!['shipped','completed'].includes(draft.status))fail('Chỉ xác nhận đã nhận hàng khi đơn đang giao.',409);
  const at=new Date().toISOString();
  Object.assign(draft,{status:'completed',customerReceivedAt:at,completedAt:at});
  draft.history??=[];draft.history.push({action:'received',at,actor:'customer'});
  save(next);return {...customerOrder(id,token),reused:false};
 }
 function inventory(productId,quantity=1){
  const p=catalogue.get(productId);if(!p)fail('Không tìm thấy sản phẩm.',404);
  if(!Number.isSafeInteger(quantity)||quantity<1||quantity>999)fail('Số lượng không hợp lệ.');
  const row=db.inventory[productId];
  const group=productCodes.groupFor(p);
  return {productId:p.id,productCode:productCodes.codeFor(p),category:p.category||'other',productGroupCode:group.prefix,productGroupName:group.name,name:p.name,nameEn:p.nameEn||p.name,region:p.region,price:p.price,priceIsReference:p.priceIsReference===true,unit:p.packaging||'',stock:row?.stock??null,available:row?row.stock>=quantity:null,requestedQuantity:quantity,updatedAt:row?.updatedAt??null,priceUpdatedAt:db.prices[productId]?.updatedAt??null,source:row?'seller_inventory':'catalogue_no_inventory'};
 }
 function setInventory(productId,stock){
  if(!catalogue.has(productId))fail('Không tìm thấy sản phẩm.',404);
  if(!Number.isSafeInteger(stock)||stock<0||stock>1000000)fail('Tồn kho không hợp lệ.');
  const next=structuredClone(db);next.inventory[productId]={stock,updatedAt:new Date().toISOString()};save(next);return inventory(productId);
 }
 function updateProduct(productId,{stock,price}={}){
  if(!catalogue.has(productId))fail('Không tìm thấy sản phẩm.',404);
  if(stock===undefined&&price===undefined)fail('Nhập giá hoặc tồn kho cần cập nhật.');
  if(stock!==undefined&&(!Number.isSafeInteger(stock)||stock<0||stock>1000000))fail('Tồn kho không hợp lệ.');
  if(price!==undefined&&(!Number.isSafeInteger(price)||price<1||price>100000000))fail('Giá bán không hợp lệ.');
  const next=structuredClone(db),updatedAt=new Date().toISOString();
  if(stock!==undefined)next.inventory[productId]={stock,updatedAt};
  if(price!==undefined)next.prices[productId]={price,updatedAt};
  save(next);if(price!==undefined)applyPrice(productId,price);return inventory(productId);
 }
 function createDraft(body,{consultationVerified=false,ownerId=null}={}){
  if(body.confirmed!==true)fail('Khách cần xác nhận tạo đơn nháp.');
  if(typeof body.idempotencyKey!=='string'||! /^[a-zA-Z0-9-]{16,80}$/.test(body.idempotencyKey))fail('Mã chống tạo trùng không hợp lệ.');
  if(!Array.isArray(body.items)||!body.items.length||body.items.length>20)fail('Danh sách sản phẩm không hợp lệ.');
  let shortage=null;
  const seen=new Set();const lines=body.items.map(row=>{
   if(!row || seen.has(row.productId))fail('Sản phẩm bị trùng.');seen.add(row.productId);
   const facts=inventory(row.productId,row.quantity);
   if(facts.available===false)shortage='Sản phẩm '+facts.name+' không đủ tồn kho.';
   return {productId:facts.productId,productCode:facts.productCode,name:facts.name,quantity:row.quantity,unitPrice:facts.price,priceIsReference:facts.priceIsReference,unit:facts.unit,stockChecked:facts.stock!==null};
  });
  const customer=body.customer;
  if(!customer||typeof customer.name!=='string'||!customer.name.trim()||customer.name.length>120||typeof customer.phone!=='string'||! /^(?:\+84|0)\d{9,10}$/.test(customer.phone.replace(/[ ()-]/g,''))||typeof customer.address!=='string'||customer.address.trim().length<8||customer.address.length>500)fail('Vui lòng nhập tên, số điện thoại và địa chỉ nhận hàng hợp lệ.');
  const normalized={items:lines.map(({productId,quantity})=>({productId,quantity})).sort((a,b)=>a.productId-b.productId),customer:{name:customer.name.trim(),phone:customer.phone.replace(/[ ()-]/g,''),address:customer.address.trim()}};
  const fingerprint=crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
  const existing=db.drafts.find(d=>d.idempotencyKey===body.idempotencyKey&&(d.ownerId||null)===ownerId);
  if(existing){if(existing.fingerprint!==fingerprint)fail('Mã tạo đơn đã được dùng cho nội dung khác.',409);return {...issueReceiptAccess(existing),reused:true};}
  if(shortage)fail(shortage,409);
  const sessionHash=typeof body.sessionId==='string'&&/^[a-zA-Z0-9-]{16,64}$/.test(body.sessionId)?crypto.createHash('sha256').update(body.sessionId).digest('hex'):null;
  const draft={id:'OCOP-DRAFT-'+crypto.randomUUID(),createdAt:new Date().toISOString(),status:'pending_seller_confirmation',lines,customer:normalized.customer,subtotal:lines.reduce((sum,l)=>sum+l.unitPrice*l.quantity,0),shippingFee:null,total:null,inventoryVerified:lines.every(l=>l.stockChecked),reserved:false,sessionHash,source:consultationVerified&&sessionHash?'chatbot':'storefront',paymentStatus:'unpaid',history:[],idempotencyKey:body.idempotencyKey,fingerprint};
  draft.ownerId=ownerId;
  draft.paymentMethod=typeof customer.paymentMethod==='string'?customer.paymentMethod.trim().slice(0,120):null;
  draft.voucherCode=typeof customer.voucherCode==='string'?customer.voucherCode.trim().slice(0,40):null;
  if(typeof customer.note==='string')draft.customer.note=customer.note.trim().slice(0,500);
  const next=structuredClone(db);next.receiptSecret??=crypto.randomBytes(32).toString('hex');next.drafts.push(draft);save(next);return {...issueReceiptAccess(draft),reused:false};
 }
 function transition(id,{action,shippingFee,paymentReference,trackingNumber,customerAgreed}={}){
  const next=structuredClone(db),draft=next.drafts.find(d=>d.id===id);if(!draft)fail('Không tìm thấy đơn.',404);
  const at=new Date().toISOString();draft.history??=[];
  const target={confirm:'confirmed',ship:'shipped',complete:'completed',cancel:'cancelled'}[action];
  if(action==='complete'&&!draft.customerReceivedAt)fail('Chỉ hoàn thành đơn khi khách hàng xác nhận đã nhận hàng.',409);
  if(action==='paid'){
   if(!['confirmed','shipped','completed'].includes(draft.status))fail('Cần xác nhận đơn trước khi ghi nhận thanh toán.',409);
   if(draft.paymentStatus==='paid')return {...draft,reused:true};
   if(typeof paymentReference!=='string'||!paymentReference.trim()||paymentReference.length>120)fail('Nhập mã giao dịch hoặc ghi chú xác nhận thu tiền.');
   draft.paymentStatus='paid';draft.paidAt=at;draft.paymentReference=paymentReference.trim();
  }else{
   if(!target)fail('Thao tác không hợp lệ.');
   if(draft.status===target)return {...draft,reused:true};
   if(action==='confirm'){
    if(draft.status!=='pending_seller_confirmation')fail('Đơn không còn chờ xác nhận.',409);
    if(customerAgreed!==true)fail('Cần thống nhất phí giao hàng với khách trước khi xác nhận.');
    if(!Number.isSafeInteger(shippingFee)||shippingFee<0||shippingFee>10000000)fail('Nhập phí giao hàng hợp lệ (0 nếu miễn phí).');
    for(const line of draft.lines){const facts=inventory(line.productId,line.quantity);if(facts.price!==line.unitPrice)fail('Giá đã thay đổi. Cần khách xác nhận lại và tạo nháp mới.',409);if(facts.available!==true)fail('Cần kiểm kê đủ tồn kho trước khi xác nhận đơn.',409);}
    for(const line of draft.lines){next.inventory[line.productId].stock-=line.quantity;next.inventory[line.productId].updatedAt=at;}
    Object.assign(draft,{shippingFee,total:draft.subtotal+shippingFee,confirmedAt:at,reserved:true,inventoryVerified:true});
   }else if(action==='ship'){
    if(draft.status!=='confirmed')fail('Chỉ gửi hàng sau khi xác nhận đơn.',409);
    if(typeof trackingNumber!=='string'||!trackingNumber.trim()||trackingNumber.length>120)fail('Nhập mã vận đơn hoặc thông tin giao hàng.');
    draft.trackingNumber=trackingNumber.trim();draft.shippedAt=at;
   }else if(action==='complete'){
    if(draft.status!=='shipped')fail('Chỉ hoàn tất sau khi gửi hàng.',409);draft.completedAt=at;
   }else if(action==='cancel'){
    if(!['pending_seller_confirmation','confirmed'].includes(draft.status)||draft.paymentStatus==='paid')fail('Không thể hủy đơn đã gửi hoặc đã thu tiền; cần xử lý riêng với khách.',409);
    if(draft.reserved)for(const line of draft.lines){next.inventory[line.productId].stock+=line.quantity;next.inventory[line.productId].updatedAt=at;}
    draft.reserved=false;draft.cancelledAt=at;
   }
   draft.status=target;
  }
  draft.history.push({action,at});save(next);return {...draft,reused:false};
 }
 function businessStats(start,end){
  const inRange=at=>at&&Date.parse(at)>=Date.parse(start)&&Date.parse(at)<=Date.parse(end);
  const paid=db.drafts.filter(d=>d.paymentStatus==='paid'&&inRange(d.paidAt)),confirmed=db.drafts.filter(d=>inRange(d.confirmedAt)),completed=db.drafts.filter(d=>d.customerReceivedAt&&inRange(d.completedAt));
  return {confirmedOrders:confirmed.length,completedOrders:completed.length,paidOrders:paid.length,paidRevenue:paid.reduce((sum,d)=>sum+d.total,0),chatbotPaidRevenue:paid.filter(d=>d.source==='chatbot'&&d.sessionHash).reduce((sum,d)=>sum+d.total,0)};
 }
 function ownedOrder(ownerId,id){
  const draft=db.drafts.find(d=>d.id===id&&typeof ownerId==='string'&&d.ownerId===ownerId);
  if(!draft)fail('Order not found for this account.',404);
  return customerOrder(id,receiptToken(draft));
 }
 function confirmOwnedReceipt(ownerId,id,body){ownedOrder(ownerId,id);const draft=db.drafts.find(d=>d.id===id);return confirmReceipt(id,receiptToken(draft),body);}
 return {inventory,setInventory,updateProduct,createDraft,transition,customerOrder,confirmReceipt,ownedOrder,confirmOwnedReceipt,businessStats,list:()=>structuredClone(db.drafts),stats:()=>({draftOrders:db.drafts.length,inventoryProducts:Object.keys(db.inventory).length})};
}
module.exports={createSalesStore};
