'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function createConversations(file,{now=Date.now,maxSessions=500}={}){
 let rows=[];try{rows=JSON.parse(fs.readFileSync(file,'utf8'));if(!Array.isArray(rows))throw new Error('Invalid conversations file');}catch(e){if(e.code!=='ENOENT')throw e;}
 const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
 function save(next){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(next),{mode:0o600});fs.renameSync(file+'.tmp',file);rows=next;}
 return {
  record({sessionId,messages,body={},status}){
   if(!Array.isArray(messages)||!messages.length||status<200||status>=300)return;
   const user=messages.filter(m=>m?.role==='user'&&typeof m.text==='string').at(-1);if(!user)return;
   const id=hash(typeof sessionId==='string'&&/^[a-zA-Z0-9-]{16,64}$/.test(sessionId)?sessionId:crypto.randomUUID());
   const next=structuredClone(rows).filter(r=>Date.parse(r.updatedAt)>=now()-90*86400000),at=new Date(now()).toISOString();
   let row=next.find(r=>r.id===id);if(!row){row={id,createdAt:at,updatedAt:at,needsStaff:false,messages:[]};next.push(row);}
   if(body.handoffAdmin){row.needsStaff=true;row.supportStatus='pending';delete row.resolvedAt;}
   row.updatedAt=at;row.messages.push({role:'user',text:user.text.slice(0,1200),at},{role:'assistant',text:String(body.message||body.text_response||'').slice(0,10000),at});row.messages=row.messages.slice(-60);
   save(next.sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt)).slice(0,maxSessions));
  },
  list:()=>structuredClone(rows).filter(r=>Date.parse(r.updatedAt)>=now()-90*86400000).sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt)),
  resolve(id){const next=structuredClone(rows),row=next.find(r=>r.id===id);if(!row)throw Object.assign(new Error('Không tìm thấy hội thoại.'),{status:404});if(!row.needsStaff)throw Object.assign(new Error('Hội thoại không có yêu cầu hỗ trợ.'),{status:409});row.supportStatus='resolved';row.resolvedAt=new Date(now()).toISOString();save(next);return structuredClone(row);}
 };
}
module.exports={createConversations};
