'use strict';
const crypto=require('node:crypto');
function createPasswordReset({normalizePhone,findUser,sendOTP,updatePassword,isConfigured,now=Date.now,randomCode=()=>String(crypto.randomInt(100000,1000000))}){
 const pending=new Map(),requests=new Map();
 const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
 const digest=value=>crypto.createHash('sha256').update(value).digest();
 function phoneFor(value){const phone=normalizePhone(value);if(!phone)fail('Vui lòng nhập số điện thoại đã đăng ký.');return phone;}
 async function request(phoneValue){
  const phone=phoneFor(phoneValue),at=now();
  if(!isConfigured())fail('Chưa thể gửi mã khôi phục qua SMS. Anh/chị liên hệ CSKH để được hỗ trợ.',503);
  for(const [key,value]of pending)if(value.expiresAt<=at)pending.delete(key);
  for(const [key,value]of requests)if(value.resetAt<=at)requests.delete(key);
  const recent=requests.get(phone);
  if(recent&&(at-recent.lastAt<60000||recent.count>=5))fail('Vui lòng chờ trước khi yêu cầu mã khôi phục mới.',429);
  requests.set(phone,{lastAt:at,resetAt:recent?.resetAt||at+15*60000,count:(recent?.count||0)+1});
  const user=findUser(phone),code=randomCode(),entry={userId:user?.id||null,hash:digest(code),expiresAt:at+5*60000,attempts:0};pending.set(phone,entry);
  try{if(user)await sendOTP(phone,code);}catch(error){if(pending.get(phone)===entry)pending.delete(phone);throw error;}
  return {message:'Nếu số điện thoại đã được đăng ký, mã xác nhận sẽ được gửi qua SMS.',expiresIn:300};
 }
 async function reset({phone:phoneValue,otp,newPassword,passwordConfirm}={}){
  const phone=phoneFor(phoneValue);
  if(typeof newPassword!=='string'||newPassword.length<8||newPassword.length>128)fail('Mật khẩu mới phải có từ 8 đến 128 ký tự.');
  if(newPassword!==passwordConfirm)fail('Mật khẩu xác nhận không khớp.');
  const entry=pending.get(phone),code=typeof otp==='string'?otp.trim():'';
  if(!entry||entry.expiresAt<=now()){pending.delete(phone);fail('Mã khôi phục không hợp lệ hoặc đã hết hạn.');}
  entry.attempts++;
  if(!/^\d{6}$/.test(code)||!crypto.timingSafeEqual(entry.hash,digest(code))||!entry.userId){if(entry.attempts>=5)pending.delete(phone);fail('Mã khôi phục không hợp lệ hoặc đã hết hạn.');}
  pending.delete(phone);await updatePassword(entry.userId,newPassword);
  return {message:'Đã đặt lại mật khẩu. Vui lòng đăng nhập bằng mật khẩu mới.'};
 }
 return {request,reset};
}
module.exports={createPasswordReset};
