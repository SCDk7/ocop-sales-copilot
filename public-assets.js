'use strict';
const fs=require('node:fs'),path=require('node:path');
// Only assets explicitly shipped by an HTML page are web-accessible. The source
// tree also contains backend modules, tests, dependencies and operator scripts.
function publicAssetGuard(root,{notFound}={}){
 const files=new Set();
 const pages=fs.readdirSync(root).filter(n=>/\.html$/i.test(n)&&!n.startsWith('index.backup'));
 for(const dir of ['about','contact','privacy','terms','catalog'])if(fs.existsSync(path.join(root,dir,'index.html')))pages.push(dir+'/index.html');
 for(const name of pages){
  files.add('/'+name);
  const html=fs.readFileSync(path.join(root,name),'utf8');
  for(const match of html.matchAll(/\b(?:src|href)=["']([^"'#?]+)(?:[^"']*)["']/g)){
   const url=match[1];if(/^(?:https?:|\/\/|data:|javascript:)/i.test(url))continue;
   const target=path.resolve(root,url.startsWith('/')?'.'+url:path.join(path.dirname(name),url));
   if(target.startsWith(path.resolve(root)+path.sep))files.add('/'+path.relative(root,target).split(path.sep).join('/'));
  }
 }
 return (req,res,next)=>{
  let url;try{url=decodeURIComponent(req.path);}catch{return res.sendStatus(400);}
  if(url==='/'||files.has(url)||/^\/(?:assets|images|img|logos)\/(?!.*(?:^|\/)\.)[a-zA-Z0-9_ /().@-]+\.(?:css|js|png|jpe?g|webp|gif|svg|ico|woff2?|ttf)$/i.test(url))return next();
  if(path.posix.extname(url)||/\/(?:node_modules|scripts|scratch|data|\.private-data)(?:\/|$)/i.test(url))return notFound?notFound(req,res,next):res.sendStatus(404);
  next();
 };
}
module.exports={publicAssetGuard};
