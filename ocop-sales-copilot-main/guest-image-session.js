'use strict';
const crypto=require('node:crypto');
function createGuestImageSessions({secret=crypto.randomBytes(32),now=Date.now,lifetimeMs=3600000}={}){
 const sign=payload=>crypto.createHmac('sha256',secret).update(payload).digest('base64url');
 function issue(){const payload=Buffer.from(JSON.stringify({id:'guest-image-'+crypto.randomUUID(),expiresAt:now()+lifetimeMs})).toString('base64url');return payload+'.'+sign(payload);}
 function verify(token){
  if(typeof token!=='string'||token.length>500)return null;
  const parts=token.split('.');if(parts.length!==2||!/^[\w-]+$/.test(parts[0])||!/^[\w-]{43}$/.test(parts[1]))return null;
  const expected=sign(parts[0]),actual=parts[1];if(!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(actual)))return null;
  try{const data=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));return /^guest-image-[0-9a-f-]{36}$/.test(data.id)&&Number.isSafeInteger(data.expiresAt)&&data.expiresAt>now()?{id:data.id,guest:true}:null;}catch{return null;}
 }
 return {issue,verify};
}
module.exports={createGuestImageSessions};
