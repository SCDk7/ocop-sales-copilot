'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
// Separate from editable profile state. Read on every check so a CLI/admin change
// is effective on the next request, including after a server restart.
function createAIAccessStore(file){
 const valid=id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{1,128}$/.test(id)&&!['__proto__','constructor','prototype'].includes(id);
 function read(){try{const db=JSON.parse(fs.readFileSync(file,'utf8'));if(!db||db.version!==1||!db.users||Array.isArray(db.users)||typeof db.users!=='object')throw Error('Invalid AI access data');return db;}catch(e){if(e.code==='ENOENT')return {version:1,users:{}};throw Object.assign(new Error('AI access policy unavailable'),{status:503});}}
 function get(id){if(!valid(id))throw Object.assign(new Error('Invalid account ID'),{status:400});const db=read(),exists=Object.hasOwn(db.users,id),row=exists?db.users[id]:null;if(exists&&(!row||typeof row.ai_enabled!=='boolean'))throw Object.assign(new Error('AI access policy unavailable'),{status:503});return exists?structuredClone(row):{ai_enabled:true};}
 function set(id,enabled,actor='operator'){
  if(!valid(id)||typeof enabled!=='boolean')throw Object.assign(new Error('Account ID and boolean ai_enabled are required'),{status:400});
  fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});const tmp=file+'.'+crypto.randomUUID()+'.tmp',lock=file+'.lock';let handle;
  try{handle=fs.openSync(lock,'wx',0o600);}catch(e){if(e.code==='EEXIST')throw Object.assign(new Error('Another policy update is running. Please retry.'),{status:503});throw e;}
  try{
   const db=read();db.users[id]={ai_enabled:enabled,updatedAt:new Date().toISOString(),updatedBy:String(actor).slice(0,128)};
   fs.writeFileSync(tmp,JSON.stringify(db,null,2),{mode:0o600,flag:'wx'});fs.renameSync(tmp,file);return structuredClone(db.users[id]);
  }finally{fs.closeSync(handle);fs.unlinkSync(lock);try{fs.unlinkSync(tmp);}catch(e){if(e.code!=='ENOENT')throw e;}}
 }
 return {get,set};
}
module.exports={createAIAccessStore};
