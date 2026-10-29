'use strict';
const fs=require('node:fs'),path=require('node:path');
const content=require('./site-content');
const locale=require('./site-language');
function requestLanguage(req){
 if(locale.languages.includes(req.query?.lang))return req.query.lang;
 const cookie=/(?:^|;)\s*ocop-language=(vi|en|zh|ko|ja)(?:;|$)/.exec(req.headers.cookie||'');
 return cookie?cookie[1]:locale.normalize(req.acceptsLanguages?.(locale.languages));
}
function representation(req){return req.accepts(['html','text/markdown']);}
function formatHeaders(res,language='vi'){res.vary('Accept');res.vary('Accept-Language');res.vary('Cookie');res.set('Cache-Control','no-cache');res.set('Content-Language',language);}
function notFound(req,res){
 const language=requestLanguage(req),t=value=>locale.text(value,language);formatHeaders(res,language);const message=t('Không tìm thấy trang hoặc tài nguyên được yêu cầu.'),title=t('Không tìm thấy trang');
 if(req.accepts(['html','text/markdown','json'])==='text/markdown')return res.status(404).type('text/markdown').send(`# ${title}\n\n${message}\n\n- [${t('Trang chủ')}](${content.absolute('/')})\n- [${t('Hướng dẫn cho agent')}](${content.absolute('/llms.txt')})\n- [${t('Sơ đồ website')}](${content.absolute('/sitemap.xml')})\n`);
 if(req.path.startsWith('/api/')||req.accepts(['html','json'])==='json')return res.status(404).json({error:message});
 return res.status(404).type('html').send(`<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} — OCOP Sales</title><style>body{margin:0;padding:clamp(24px,8vw,100px);background:#edf7ff;color:#17354e;font:18px/1.7 Arial,sans-serif}main{max-width:700px;padding:36px;background:white;border:1px solid #c4e3fa;border-radius:24px}h1{font-size:32px}a{color:#236b9e}nav{display:flex;gap:20px;flex-wrap:wrap}</style></head><body><main><h1>${title}</h1><p>${message}</p><nav><a href="/">${t("Trang chủ")}</a><a href="/llms.txt">${t("Hướng dẫn cho agent")}</a><a href="/sitemap.xml">${t("Sơ đồ website")}</a></nav></main></body></html>`);
}
function createSiteInformation({root,products,getInventory}={}){
 function catalogue(){
  if(!getInventory)return products;
  const live=new Map(getInventory().map(row=>[row.productId,row]));
  return products.map(p=>({...p,price:live.get(p.id)?.price??p.price}));
 }
 return (req,res,next)=>{
  if(!['GET','HEAD'].includes(req.method))return next();
  const url=req.path.replace(/\/+$/,'')||'/';
  if(['/llms.txt','/robots.txt','/sitemap.xml'].includes(url)){
   const type=url.endsWith('.xml')?'application/xml':'text/plain';
   res.set('Cache-Control','no-cache');return res.type(type).send(fs.readFileSync(path.join(root,url.slice(1)),'utf8'));
  }
  const alias=/^\/(index(?:_2)?(?:\.html)?|about|contact|privacy|terms|catalog)(?:\.html)?\.md$/.exec(url);
  const route=alias?(alias[1].startsWith('index')?'/':'/'+alias[1]):['/index.html','/index_2.html'].includes(url)?'/':url.replace(/\/index\.html$/,'');
  if(!Object.hasOwn(content.pages,route))return next();
  const language=requestLanguage(req);formatHeaders(res,language);
  res.set('Link',`<${route==='/'?'/index.md':route+'.md'}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`);
  const format=alias?(req.accepts('text/markdown')?'text/markdown':false):representation(req);
  if(!format)return res.status(406).type('text/plain').send('Supported representations: text/html, text/markdown.');
  if(format==='text/markdown')return res.type('text/markdown').send(content.markdown(route,route==='/catalog'?catalogue():products,language));
  if(route==='/'){res.set('Content-Language','vi');return next();}
  return res.type('html').send(content.html(route,route==='/catalog'?catalogue():products,language));
 };
}
module.exports={createSiteInformation,notFound,requestLanguage};
