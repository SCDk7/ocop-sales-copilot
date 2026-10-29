'use strict';
const fs=require('node:fs'),path=require('node:path');
// Only assets explicitly shipped by an HTML page are web-accessible. The source
// tree also contains backend modules, tests, dependencies and operator scripts.
function publicAssetGuard(root){
 const files=new Set();
 for(const name of fs.readdirSync(root).filter(n=>/\.html$/i.test(n)&&!n.startsWith('index.backup'))){
  files.add('/'+name);
  const html=fs.readFileSync(path.join(root,name),'utf8');
  for(const match of html.matchAll(/\b(?:src|href)=["']([^"'#?]+)(?:[^"']*)["']/g)){
   const url=match[1];if(/^(?:https?:|\/\/|data:|javascript:)/i.test(url))continue;
   const relative='/'+url.replace(/^\.?\//,'');if(!relative.includes('..'))files.add(relative);
  }
 }
 return (req,res,next)=>{
  let url;try{url=decodeURIComponent(req.path);}catch{return res.sendStatus(400);}
  if(url==='/'||files.has(url)||/^\/(?:assets|images|img|logos)\/(?!.*(?:^|\/)\.)[a-zA-Z0-9_ /().@-]+\.(?:css|js|png|jpe?g|webp|gif|svg|ico|woff2?|ttf)$/i.test(url))return next();
  if(path.posix.extname(url)||/\/(?:node_modules|scripts|scratch|data|\.private-data)(?:\/|$)/i.test(url))return res.sendStatus(404);
  next();
 };
}
module.exports={publicAssetGuard};
