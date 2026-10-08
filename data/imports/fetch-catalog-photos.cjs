const fs=require('node:fs'),path=require('node:path');
const rows=require('./catalog-63-image-search.json'),choices=require('./catalog-63-photo-choices.json');
const root=path.join(__dirname,'../..'),output=path.join(__dirname,'catalog-63-downloaded-photos.json');
const saved=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):{};
async function get(row){
 const index=Object.hasOwn(choices,row.row)?choices[row.row]:0;
 if(index===null)return;
 const candidate=row.candidates[index];if(!candidate)throw Error('Invalid choice '+row.row);
 if(saved[row.row]?.imageUrl===candidate.image&&fs.existsSync(path.join(root,saved[row.row].image)))return;
 try{
  const res=await fetch(candidate.image,{headers:{'User-Agent':'Mozilla/5.0','Referer':candidate.page},signal:AbortSignal.timeout(22000)});
  if(!res.ok)throw Error('HTTP '+res.status);
  const mime=res.headers.get('content-type')?.split(';')[0];
  const bytes=Buffer.from(await res.arrayBuffer());
  const extension={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','image/gif':'gif'}[mime];
  if(!extension||bytes.length<1500||bytes.length>8*1024*1024)throw Error('Invalid image '+mime+' '+bytes.length);
  const image='images/catalog/web-63-'+row.row+'.'+extension;
  fs.writeFileSync(path.join(root,image),bytes);
  saved[row.row]={row:row.row,name:row.name,region:row.region,image,imageUrl:candidate.image,source:candidate.page,title:candidate.title,bytes:bytes.length,status:'awaiting_visual_review'};
 }catch(e){saved[row.row]={row:row.row,name:row.name,error:e.message};}
}
(async()=>{
 for(let i=0;i<rows.length;i+=8){await Promise.all(rows.slice(i,i+8).map(get));fs.writeFileSync(output,JSON.stringify(saved,null,2)+'\n');if(i%32===0)console.log('Processed '+Math.min(i+8,rows.length)+'/'+rows.length)}
 console.log(JSON.stringify({downloaded:Object.values(saved).filter(r=>r.image).length,errors:Object.values(saved).filter(r=>r.error)},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
