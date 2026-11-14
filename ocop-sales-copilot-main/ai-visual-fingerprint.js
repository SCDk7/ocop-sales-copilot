'use strict';
const fs=require('node:fs/promises');
const path=require('node:path');
const sharp=require('sharp');
async function fingerprint(bytes){
 const {data}=await sharp(bytes,{limitInputPixels:24000000}).rotate().flatten({background:'#ffffff'}).resize(24,24,{fit:'fill'}).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
 const values=Float32Array.from(data,value=>value/255);
 const means=[0,0,0];values.forEach((value,index)=>{means[index%3]+=value/(values.length/3);});
 const variance=values.reduce((sum,value,index)=>sum+(value-means[index%3])**2,0)/values.length;
 return {values,variance};
}
function distance(a,b){return Math.sqrt(a.values.reduce((sum,value,index)=>sum+(value-b.values[index])**2,0)/a.values.length);}
function createVisualFingerprintMatcher(root){
 const cache=new Map();
 return async(products,buffers)=>{
  const rows=[];
  for(let start=0;start<products.length;start+=8){
   const batch=await Promise.all(products.slice(start,start+8).map(async product=>{
    if(!/^\/?images\//.test(product.img||''))return null;
    const file=path.resolve(root,product.img.replace(/^\//,''));
    if(!file.startsWith(path.resolve(root,'images')+path.sep))return null;
    try{
     const stat=await fs.stat(file);if(stat.size>12000000)return null;
     const key=file+':'+stat.mtimeMs;
     if(!cache.has(key))cache.set(key,await fingerprint(await fs.readFile(file)));
     return {id:product.id,fp:cache.get(key)};
    }catch{return null;}
   }));rows.push(...batch.filter(Boolean));
  }
  return Promise.all(buffers.map(async buffer=>{
   try{
    const query=await fingerprint(buffer);if(query.variance<0.006)return [];
    const scores=rows.map(row=>({id:row.id,score:distance(query,row.fp)})).sort((a,b)=>a.score-b.score);
    if(!scores.length||scores[0].score>0.12)return [];
    const close=scores.filter(row=>row.score<=scores[0].score+0.012&&row.score<=0.12);
    const next=scores[close.length];if(next&&next.score-scores[0].score<0.025)return [];
    return close.slice(0,3).map(row=>row.id);
   }catch{return [];}
  }));
 };
}
module.exports={createVisualFingerprintMatcher,fingerprint,distance};
