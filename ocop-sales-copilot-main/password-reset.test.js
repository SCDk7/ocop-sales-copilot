'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createPasswordReset}=require('./password-reset');
function fixture(){let clock=100000;const messages=[],changed=[];const service=createPasswordReset({normalizePhone:value=>/^0\d{9}$/.test(value)?value:null,findUser:phone=>phone==='0901234567'?{id:'owner'}:null,sendOTP:async(phone,code)=>messages.push({phone,code}),updatePassword:async(id,password)=>changed.push({id,password}),isConfigured:()=>true,now:()=>clock,randomCode:()=> '123456'});return {service,messages,changed,advance:ms=>clock+=ms};}
const valid={phone:'0901234567',otp:'123456',newPassword:'NewPassword@2026',passwordConfirm:'NewPassword@2026'};
test('password recovery requires a valid OTP, is single-use and cannot select another user',async()=>{
 const {service,messages,changed}=fixture();await service.request(valid.phone);assert.equal(messages.length,1);
 await assert.rejects(()=>service.reset({...valid,otp:'111111'}));assert.equal(changed.length,0);
 await service.reset({...valid,userId:'someone-else'});assert.deepEqual(changed,[{id:'owner',password:'NewPassword@2026'}]);await assert.rejects(()=>service.reset(valid));
});
test('unknown phone responses match known phone responses without sending an SMS or changing an account',async()=>{
 const {service,messages,changed}=fixture();const known=await service.request(valid.phone),unknown=await service.request('0901111111');assert.deepEqual(unknown,known);assert.equal(messages.length,1);
 await assert.rejects(()=>service.reset({...valid,phone:'0901111111'}));assert.equal(changed.length,0);
});
test('recovery enforces expiry, resend cooldown, password confirmation and five OTP attempts',async()=>{
 const {service,advance}=fixture();await service.request(valid.phone);await assert.rejects(()=>service.request(valid.phone),error=>error.status===429);
 await assert.rejects(()=>service.reset({...valid,passwordConfirm:'WrongPassword'}));
 for(let i=0;i<5;i++)await assert.rejects(()=>service.reset({...valid,otp:'000000'}));await assert.rejects(()=>service.reset(valid));
 advance(61000);await service.request(valid.phone);advance(300000);await assert.rejects(()=>service.reset(valid));
});
test('unconfigured SMS never claims to have sent a recovery code',async()=>{
 const service=createPasswordReset({normalizePhone:value=>value,isConfigured:()=>false,findUser(){throw Error('Must not inspect accounts');}});
 await assert.rejects(()=>service.request(valid.phone),error=>error.status===503&&/CSKH/.test(error.message));
});
