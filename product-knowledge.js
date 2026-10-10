'use strict';
const {normalize}=require('./ai-shopping');
const stop=new Set('la gi co khong cho toi minh anh chi shop nay cua va voi ve duoc san pham dac san ocop the a what is the of and product'.split(' '));
function words(value){return normalize(value).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>1&&!stop.has(w));}
function createKnowledge(products) {
 const documents=products.map(p=>({productId:p.id,title:p.name,region:p.region,source:'shop_catalogue',text:[p.name,p.nameEn,p.region,p.description||p.desc,p.descEn,p.packaging,p.packagingEn].filter(Boolean).join('\n').slice(0,4000)}));
 const rows=documents.map(d=>({document:d,tokens:words(d.text)}));
 const frequency=new Map();for(const row of rows)for(const token of new Set(row.tokens))frequency.set(token,(frequency.get(token)||0)+1);
 const average=rows.reduce((sum,row)=>sum+row.tokens.length,0)/Math.max(1,rows.length);
 return {search(query,{productIds,limit=4}={}) {
  const tokens=[...new Set(words(query))];
  return rows.filter(row=>!productIds || productIds.includes(row.document.productId)).map(row=>{
   const matched=tokens.filter(token=>row.tokens.includes(token));
   const anchors=words(row.document.title+' '+row.document.region);
   if(tokens.length>1 && matched.length<2 && !matched.some(token=>anchors.includes(token)))return {...row.document,score:0};
   let score=0;
   for(const token of tokens){const count=row.tokens.filter(w=>w===token).length;if(!count)continue;
    const idf=Math.log(1+(rows.length-(frequency.get(token)||0)+0.5)/((frequency.get(token)||0)+0.5));
    score+=idf*count*2.2/(count+1.2*(0.25+0.75*row.tokens.length/Math.max(1,average)));
   }
   return {...row.document,score};
  }).filter(d=>d.score>0).sort((a,b)=>b.score-a.score).slice(0,Math.min(6,Math.max(1,limit)));
 }};
}
module.exports={createKnowledge};
