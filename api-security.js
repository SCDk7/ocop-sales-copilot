'use strict';
const crypto=require('node:crypto');
const {rateLimit}=require('express-rate-limit');
const {createGuestImageSessions}=require('./guest-image-session');
const AI_PATHS=new Set(['/api/ai/chat','/api/chat','/chat','/api/ai/search-image','/api/ai/audio-chat','/api/ai/transcribe','/api/ai/translate','/api/ai/images','/api/ai/guest-image-session']);
const guestImagePaths=new Set(['/api/ai/images','/api/ai/search-image','/api/ai/chat','/api/chat','/chat']);
const AUTH_PATHS=new Set(['/api/auth/login','/api/auth/register','/api/auth/register/verify-otp','/api/auth/oauth/exchange','/api/auth/change-password','/api/auth/forgot-password','/api/auth/reset-password','/api/admin/audio/login']);
const canonical=value=>value.toLowerCase().replace(/\/+$/,'')||'/';
function createAPISecurity({resolveUser,getAIAccess,env=process.env,limits={}}){
 const guestSessions=createGuestImageSessions();
 const limiter=(name,max,windowMs=60000,extra={})=>rateLimit({windowMs,limit:max,standardHeaders:'draft-8',legacyHeaders:false,identifier:name,
  handler:(_req,res)=>res.status(429).json({code:'RATE_LIMITED',error:`Too many requests (${name}). Please retry after the Retry-After interval.`}),...extra});
 const general=limiter('api',limits.general||120),aiIP=limiter('ai-ip',limits.aiIP||20),
  aiUser=limiter('ai-account',limits.aiUser||15,60000,{keyGenerator:req=>req.authUser.id}),
  auth=limiter('authentication',limits.auth||10,15*60000);
 const counts=new Map();let active=0;
 const identify=(req,res,next)=>{
  const header=req.headers.authorization;
  if(header){if(!/^Bearer [a-f0-9]{64}$/.test(header))return res.status(401).json({code:'INVALID_SESSION',error:'A valid server-issued session is required.'});
   const user=resolveUser(header.slice(7));if(!user)return res.status(401).json({code:'INVALID_SESSION',error:'Your session is invalid or expired.'});req.authUser=user;}
  else if(canonical(req.path)==='/api/ai/guest-image-session'){
   req.guestImageToken=guestSessions.issue();req.authUser=guestSessions.verify(req.guestImageToken);
  }else if(guestImagePaths.has(canonical(req.path))){
   const guest=req.headers['x-ocop-guest-image'];
   if(guest){req.authUser=guestSessions.verify(guest);if(!req.authUser)return res.status(401).json({code:'GUEST_IMAGE_EXPIRED',error:'Dạ, phiên ảnh đã hết hạn. Anh/chị gửi lại ảnh giúp em nhé.'});}
  }
  next();
 };
 const requireAI=(req,res,next)=>{
  if(!req.authUser)return res.status(401).json({code:'AUTH_REQUIRED',error:'Please sign in to use AI features.'});
  try{if(env.AI_ENABLED==='false'||!req.authUser.guest&&!getAIAccess(req.authUser.id).ai_enabled)return res.status(403).json({code:'AI_DISABLED',error:'AI features have been temporarily disabled for your account.'});}catch(e){return next(e);}
  next();
 };
 const concurrency=(req,res,next)=>{
  const id=req.authUser.id;if(active>=8||(counts.get(id)||0)>=2){res.setHeader('Retry-After','2');return res.status(429).json({code:'AI_BUSY',error:'Too many AI requests are running. Please retry shortly.'});}
  active++;counts.set(id,(counts.get(id)||0)+1);let released=false;
  const release=()=>{if(released)return;released=true;active--;const count=counts.get(id)-1;count?counts.set(id,count):counts.delete(id);};
  res.once('finish',release);res.once('close',release);next();
 };
 function mount(app){
  app.disable('x-powered-by');
  const proxy=env.TRUST_PROXY;
  if(proxy==='true')throw Error('TRUST_PROXY=true is unsafe; use verified proxy CIDRs or a verified hop count');
  if(proxy)app.set('trust proxy',/^\d+$/.test(proxy)?Number(proxy):proxy.split(',').map(x=>x.trim()));
  app.use((req,res,next)=>{
   const route=canonical(req.path),api=route.startsWith('/api/')||route==='/chat';if(!api)return next();
   res.setHeader('Cache-Control','no-store');
   general(req,res,()=>{
    if(req.method==='OPTIONS')return next();
    if(AUTH_PATHS.has(route))return auth(req,res,next);
    if(!AI_PATHS.has(route))return next();
    aiIP(req,res,()=>identify(req,res,()=>requireAI(req,res,()=>aiUser(req,res,()=>concurrency(req,res,next)))));
   });
  });
 }
 function validatePayload(req,res,next){
  const route=canonical(req.path);if(!AI_PATHS.has(route)||!req.is('application/json'))return next();
  const body=req.body;
  const invalid=error=>res.status(400).json({code:'INVALID_AI_REQUEST',error});
  if(!body||Array.isArray(body)||typeof body!=='object')return invalid('A JSON object is required.');
  if(req.authUser?.guest&&['/api/ai/chat','/api/chat','/chat'].includes(route)&&(!Array.isArray(body.imageIds)||!body.imageIds.length))return res.status(401).json({code:'AUTH_REQUIRED',error:'Dạ, phiên khách chỉ hỗ trợ nhận diện ảnh. Anh/chị có thể hỏi danh mục ngay trên website.'});
  // Browser input can never choose provider credentials, system prompts or tools.
  const allowed=new Set(['messages','message','prompt','query','text','texts','language','products','imageIds','imageData','audio','recordingConsent','sessionId']);
  if(Object.keys(body).some(k=>!allowed.has(k)))return invalid('Unsupported AI request field.');
  if(body.language!==undefined&&!['vi','en','zh','ko','ja'].includes(body.language))return invalid('Unsupported language.');
  const clean=text=>text.normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim();
  if(route==='/api/ai/translate')return next();
  if(body.messages!==undefined){
   if(!Array.isArray(body.messages)||body.messages.length>16)return invalid('Use at most 16 conversation messages.');
   let total=0;for(const row of body.messages){if(!row||!['user','assistant'].includes(row.role)||typeof (row.text??row.content)!=='string')return invalid('Only user and assistant text messages are accepted.');row.text=clean(row.text??row.content);delete row.content;if(row.text.length>1200||(total+=row.text.length)>12000)return invalid('Conversation text is too long.');}
   if(body.messages.length&&body.messages.at(-1).role!=='user')return invalid('The last message must be from the user.');
  }
  for(const key of ['message','prompt','query','text'])if(body[key]!==undefined){if(typeof body[key]!=='string'||body[key].length>1200)return invalid('Message text is invalid or too long.');body[key]=clean(body[key]);}
  // Never accept a browser-supplied catalogue or owner as the source of truth.
  delete body.products;
  if(body.sessionId!==undefined&&(typeof body.sessionId!=='string'||!/^[a-zA-Z0-9-]{16,64}$/.test(body.sessionId)))return invalid('Invalid consultation session.');
  if(req.authUser)body.sessionId=crypto.createHash('sha256').update(req.authUser.id+'\n'+(body.sessionId||'default')).digest('hex');
  next();
 }
 return {mount,identify,requireAI,validatePayload};
}
module.exports={createAPISecurity,AI_PATHS};
