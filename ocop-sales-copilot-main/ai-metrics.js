'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const DAY=86400000,OFFSET=7*3600000;
function createMetrics({file,now=Date.now,products=[],maxEvents=50000}={}) {
 let state={startedAt:new Date(now()).toISOString(),events:[],truncated:false};
 if(file){try{state=JSON.parse(fs.readFileSync(file,'utf8'));if(!Array.isArray(state.events)||typeof state.startedAt!=='string')throw new Error('Invalid metrics file');}catch(e){if(e.code!=='ENOENT')throw e;}}
 const catalogue=new Map(products.map(p=>[p.id,p]));
 const session=value=>typeof value==='string'&&/^[a-zA-Z0-9-]{16,64}$/.test(value)?crypto.createHash('sha256').update(value).digest('hex'):null;
 const ids=values=>[...new Set((Array.isArray(values)?values:[]).filter(id=>Number.isSafeInteger(id)&&id>0&&(!catalogue.size||catalogue.has(id))))].slice(0,100);
 function add(event){
  state.events=state.events.filter(e=>e.at>=now()-90*DAY);state.events.push({at:now(),...event});
  if(state.events.length>maxEvents){state.events=state.events.slice(-maxEvents);state.truncated=true;}
  if(file){try{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(state),{mode:0o600});fs.renameSync(file+'.tmp',file);}catch(e){console.warn('Metrics persistence unavailable:',e.code);}}
 }
 function recordDraft({id,sessionId,reused=false}){
  if(reused||typeof id!=='string'||state.events.some(e=>e.kind==='draft'&&e.id===id))return;
  add({kind:'draft',id,session:session(sessionId)});
 }
 return {
  record({durationMs,status,body={},sessionId}){
   add({kind:'chat',session:session(sessionId),ms:Number.isFinite(durationMs)?Math.max(0,durationMs):0,ok:status>=200&&status<300,handoff:Boolean(body.handoffAdmin),gemini:Boolean(body.integrations?.gemini),wiki:Boolean(body.integrations?.wikipedia),products:ids(body.productIds)});
  },
  recordDraft,
  hasSession(sessionId){const key=session(sessionId);return Boolean(key&&state.events.some(e=>e.kind==='chat'&&e.session===key&&e.at>=now()-90*DAY));},
  recordTool({name,result={},sessionId}){
   add({kind:'tool',name:String(name).slice(0,80),ok:!result.error,products:ids([result.productId,...(result.records||[]).map(p=>p.productId)])});
   if(name==='create_draft_order'&&!result.error)recordDraft({...result,sessionId});
  },
  snapshot(period='all'){
   if(!['day','week','month','all'].includes(period))period='all';
   const end=now(),midnight=Math.floor((end+OFFSET)/DAY)*DAY-OFFSET;
   const start=period==='all'?Math.max(Date.parse(state.startedAt),end-90*DAY):midnight-({day:0,week:6,month:29}[period])*DAY;
   const events=state.events.filter(e=>e.at>=start&&e.at<=end),chats=events.filter(e=>e.kind==='chat'),tools=events.filter(e=>e.kind==='tool'),drafts=events.filter(e=>e.kind==='draft');
   const sessions=new Map(),counts=new Map(),hourly=Array.from({length:24},(_,hour)=>({hour,requests:0}));
   for(const e of chats){
    hourly[new Date(e.at+OFFSET).getUTCHours()].requests++;
    if(e.session){const previous=sessions.get(e.session)||{handoff:false,failed:false};previous.handoff||=e.handoff;previous.failed||=!e.ok;sessions.set(e.session,previous);}
   }
   for(const e of events)if((e.kind==='tool'&&e.ok)||(e.kind==='chat'&&e.ok))for(const id of e.products||[])counts.set(id,(counts.get(id)||0)+1);
   const handoffSessions=[...sessions.values()].filter(s=>s.handoff).length;
   const converted=new Set(drafts.filter(d=>d.session&&sessions.has(d.session)).map(d=>d.session));
   const successful=chats.filter(e=>e.ok).length,toolSuccessful=tools.filter(e=>e.ok).length;
   return {startedAt:state.startedAt,scope:'retained_history',period,windowStart:new Date(start).toISOString(),windowEnd:new Date(end).toISOString(),timezone:'Asia/Ho_Chi_Minh',retentionDays:90,truncated:Boolean(state.truncated),requests:chats.length,successful,failed:chats.length-successful,averageResponseMs:chats.length?Math.round(chats.reduce((n,e)=>n+e.ms,0)/chats.length):null,handoffResponses:chats.filter(e=>e.handoff).length,geminiResponses:chats.filter(e=>e.gemini).length,wikipediaResponses:chats.filter(e=>e.wiki).length,trackedSessions:sessions.size,handoffSessions,handoffRate:sessions.size?handoffSessions/sessions.size:null,automationRate:sessions.size?[...sessions.values()].filter(s=>!s.handoff&&!s.failed).length/sessions.size:null,accuracyRate:null,conversionRate:sessions.size?converted.size/sessions.size:null,convertedSessions:converted.size,draftOrders:drafts.length,unlinkedDraftOrders:drafts.filter(d=>!d.session||!sessions.has(d.session)).length,toolCalls:tools.length,toolSuccessful,toolFailed:tools.length-toolSuccessful,toolSuccessRate:tools.length?toolSuccessful/tools.length:null,hourly,productInterest:[...counts].map(([productId,count])=>({productId,count,name:catalogue.get(productId)?.name||String(productId),nameEn:catalogue.get(productId)?.nameEn||catalogue.get(productId)?.name||String(productId)})).sort((a,b)=>b.count-a.count),targets:{accuracyRate:0.95,averageResponseMs:3000,automationRateMin:0.7,automationRateMax:0.8}};
  }
 };
}
module.exports={createMetrics};
