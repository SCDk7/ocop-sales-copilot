(function(root){
 'use strict';let overlay,returnFocus,oldOverflow;
 const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!=null)node.textContent=text;if(className)node.className=className;return node;};
 function close(){if(!overlay)return;overlay.hidden=true;overlay.querySelectorAll('input').forEach(input=>{input.value='';if(input.autocomplete==='new-password')input.type='password';});document.body.style.overflow=oldOverflow;returnFocus?.focus();}
 function open(){
  if(!overlay){
   overlay=el('div',null,'password-recovery-overlay');overlay.hidden=true;
   const box=el('section',null,'password-recovery');box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-labelledby','password-recovery-title');
   const head=el('div',null,'password-recovery-header'),heading=el('h2','Quên mật khẩu');heading.id='password-recovery-title';const exit=el('button','×');exit.type='button';exit.ariaLabel='Đóng khôi phục mật khẩu';exit.onclick=close;head.append(heading,exit);box.append(head,el('p','Nhập số điện thoại đã đăng ký để nhận mã xác nhận qua SMS.'));
   const status=el('p','','password-recovery-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
   const form=el('form');
   const field=(label,name,type,autocomplete)=>{const wrapper=el('label',label),input=el('input');input.name=name;input.id='recovery-'+name;input.type=type;input.autocomplete=autocomplete;input.required=true;wrapper.append(input);form.append(wrapper);return input;};
   const phone=field('Số điện thoại đã đăng ký','phone','tel','tel');phone.maxLength=16;
   const send=el('button','Gửi mã xác nhận','password-recovery-secondary');send.type='button';form.append(send);
   const otp=field('Mã xác nhận 6 chữ số','otp','text','one-time-code');otp.inputMode='numeric';otp.pattern='[0-9]{6}';otp.maxLength=6;
   for(const [name,label]of [['newPassword','Mật khẩu mới'],['passwordConfirm','Nhập lại mật khẩu mới']]){
    const input=field(label,name,'password','new-password');input.minLength=8;input.maxLength=128;
    const toggle=el('button','Hiện');toggle.type='button';toggle.className='password-recovery-eye';toggle.setAttribute('aria-controls',input.id);toggle.setAttribute('aria-label','Hiện mật khẩu');toggle.onclick=()=>{const visible=input.type==='password';input.type=visible?'text':'password';toggle.textContent=visible?'Ẩn':'Hiện';toggle.setAttribute('aria-label',visible?'Ẩn mật khẩu':'Hiện mật khẩu');};input.parentNode.append(toggle);
   }
   const submit=el('button','Đặt lại mật khẩu','password-recovery-primary');submit.type='submit';form.append(submit);
   send.onclick=async()=>{if(!phone.reportValidity())return;send.disabled=true;status.textContent='Đang yêu cầu mã xác nhận…';try{const result=await root.OCOPAuth.forgotPassword(phone.value);status.textContent=result.message;otp.focus();}catch(error){status.textContent=error.message;}finally{send.disabled=false;}};
   form.onsubmit=async event=>{event.preventDefault();submit.disabled=true;status.textContent='Đang xác nhận…';try{const data=new FormData(form);await root.OCOPAuth.resetPassword(Object.fromEntries(data));close();root.switchCustomerAuthTab?.('login');root.showToast?.('Đã đặt lại mật khẩu. Anh/chị đăng nhập bằng mật khẩu mới nhé.','success');}catch(error){status.textContent=error.message;}finally{submit.disabled=false;}};
   box.append(form,status);overlay.append(box);document.body.append(overlay);overlay.onclick=event=>{if(event.target===overlay)close();};
   overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}if(event.key==='Tab'){const controls=[...overlay.querySelectorAll('button,input')].filter(node=>!node.disabled),first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
  }
  returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;overlay.querySelector('.password-recovery-status').textContent='';overlay.hidden=false;document.body.style.overflow='hidden';overlay.querySelector('input').focus();
 }
 root.openPasswordRecovery=open;
})(typeof window!=='undefined'?window:globalThis);
