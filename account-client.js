(function(root){
 'use strict';
 const rawFetch=root.fetch.bind(root),TOKEN='ocop-session-token';
 const GUEST_IMAGE='ocop-guest-image-session';let guestImageToken='',guestImagePending=null;
 function token(){try{const value=localStorage.getItem(TOKEN)||'';return /^[a-f0-9]{64}$/.test(value)?value:'';}catch{return '';}}
 const endpoint=route=>typeof root.getAIEndpoint==='function'?root.getAIEndpoint(route):root.salesPage?.api?root.salesPage.api(route):route;
 function trusted(url){const target=new URL(url,location.href),backend=new URL(endpoint('/api/auth/me'),location.href);return target.origin===backend.origin&&/^\/(?:api\/|chat(?:\/|$))/.test(target.pathname);}
 async function guestImageSession(signal){
  if(!guestImageToken)try{guestImageToken=root.sessionStorage?.getItem(GUEST_IMAGE)||'';}catch{}
  if(guestImageToken)return guestImageToken;
  if(!guestImagePending)guestImagePending=(async()=>{
   const response=await rawFetch(endpoint('/api/ai/guest-image-session'),{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal});
   const body=await response.json().catch(()=>({}));if(!response.ok||typeof body.guestToken!=='string')throw Error(body.error||'Dạ, chưa tạo được phiên nhận diện ảnh. Anh/chị thử lại nhé.');
   guestImageToken=body.guestToken;try{root.sessionStorage?.setItem(GUEST_IMAGE,guestImageToken);}catch{}return guestImageToken;
  })().finally(()=>{guestImagePending=null;});
  return guestImagePending;
 }
 async function apiFetch(url,options={}){
  const headers=new Headers(options.headers);const access=token();
  if(trusted(url)&&access)headers.set('Authorization','Bearer '+access);
  const imageGuest=trusted(url)&&!access&&['/api/ai/images','/api/ai/search-image','/api/ai/chat','/api/chat','/chat'].includes(new URL(url,location.href).pathname);
  if(imageGuest)headers.set('X-OCOP-Guest-Image',await guestImageSession(options.signal));
  const response=await rawFetch(url,{...options,headers});
  if(imageGuest&&response.status===401){guestImageToken='';try{root.sessionStorage?.removeItem(GUEST_IMAGE);}catch{}}
  return response;
 }
 function clear(){try{localStorage.removeItem(TOKEN);localStorage.removeItem('ocop_current_user');}catch{}root.currentUser=null;root.OCOPCustomerSession?.syncIdentity();}
 function accept(body){
  const user={...body.user,username:body.user.username||body.user.id,fullName:body.user.name,role:['admin','distributor'].includes(body.user.role)?body.user.role:'customer'};
  if(body.token)localStorage.setItem(TOKEN,body.token);
  localStorage.setItem('ocop_current_user',JSON.stringify(user));root.currentUser=user;root.OCOPCustomerSession?.syncIdentity();root.updateCustomerHeaderUI?.();return user;
 }
 async function request(route,body){
  let response;
  try{response=await apiFetch(endpoint(route),{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(15000),body:JSON.stringify(body)});}
  catch(error){
   const local=location.protocol==='file:'||['localhost','127.0.0.1','[::1]'].includes(location.hostname);
   throw Error(local?'Không kết nối được máy chủ đăng nhập. Mở Terminal và chạy npm run dev, sau đó thử lại.':'Chưa kết nối được máy chủ đăng nhập. Vui lòng thử lại sau ít phút.');
  }
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.error||(response.status===429?'Bạn thao tác quá nhanh. Vui lòng chờ rồi thử lại.':'Chưa đăng nhập được. Vui lòng kiểm tra tài khoản và thử lại.'));
  if(!data.user&&['/api/auth/login','/api/auth/register/verify-otp','/api/auth/oauth/exchange'].includes(route))throw Error('Máy chủ chưa hỗ trợ đăng nhập. Vui lòng chạy npm run dev trong Terminal.');
  return data;
 }
 async function login(name,password){return accept(await request('/api/auth/login',{name,password}));}
 async function register(details,readOTP){await request('/api/auth/register',details);const otp=await readOTP();if(!otp)throw Error('Chưa nhập mã OTP.');return (await request('/api/auth/register/verify-otp',{phone:details.phone,otp})).user;}
 const forgotPassword=phone=>request('/api/auth/forgot-password',{phone});
 const resetPassword=details=>request('/api/auth/reset-password',details);
 async function logout(){try{if(token())await request('/api/auth/logout',{});}finally{clear();}}
 async function changePassword(oldPassword,newPassword){await request('/api/auth/change-password',{oldPassword,newPassword});clear();}
 async function finishOAuth(){
  const params=new URLSearchParams(location.hash.slice(1)),code=params.get('oauth_code'),error=params.get('oauth_error');
  if(!code&&!error)return;
  history.replaceState(null,'',location.pathname+location.search);
  if(error)throw Error('Không thể xác minh đăng nhập. Vui lòng thử lại.');
  return accept(await request('/api/auth/oauth/exchange',{code}));
 }
 root.OCOPAuth={fetch:apiFetch,login,logout,register,changePassword,forgotPassword,resetPassword,finishOAuth,token,endpoint};
 root.logoutAccount=logout;
 root.requireAccountCheckout=async()=>{await root.accountReady;if(!token()){root.openCustomerAuthModal?.();throw Error('Vui lòng đăng nhập để đặt hàng.');}return true;};
 root.createAccountOrder=async body=>(await request('/api/orders',body)).order;
 root.reportAccountPayment=id=>request('/api/orders/'+encodeURIComponent(id)+'/payment-reported',{});
 async function restore(){
  if(!token()){clear();return;}
  try{const response=await apiFetch(endpoint('/api/auth/me'),{signal:AbortSignal.timeout(8000)});if(response.ok)accept(await response.json());else if(response.status===401)clear();}catch{}
 }
 root.accountReady=document.readyState==='loading'?new Promise(resolve=>document.addEventListener('DOMContentLoaded',()=>restore().finally(resolve),{once:true})):restore();
})(window);
