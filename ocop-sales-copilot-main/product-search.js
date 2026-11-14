(function(root){
 'use strict';
 const shopping=typeof module==='object'&&module.exports?require('./ai-shopping'):root.AIShopping;
 const normalize=value=>shopping.normalize(String(value||'')).replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
 const cache=new WeakMap();
 function record(product){
  const signature=[product.name,product.nameEn,product.region,product.productCode].join('|');
  const old=cache.get(product);if(old?.signature===signature)return old;
  const name=normalize(product.name),nameEn=normalize(product.nameEn),code=normalize(product.productCode),region=normalize(product.region);
  const row={signature,name,nameEn,code,words:new Set((name+' '+nameEn+' '+code).split(' '))};cache.set(product,row);return row;
 }
 function search(products,query){
  if(!String(query||'').trim())return products.slice();
  const intent=shopping.analyze(query,products);
  let text=shopping.normalize(String(query).replace(/(^|\s)(ở|tại)(?=\s|$)/giu,' '));
  text=text.replace(/\b(?:tim kiem|toi muon|toi can|cho toi|giup toi|san pham|dac san|vui long|thanh pho)\b/g,' ');
  if(intent.maxPrice!=null||intent.minPrice!=null){
   const money='\\d+(?:[.,]\\d+)*\\s*(?:trieu|nghin|ngan|vnd|dong|k|tr|d)?';
   text=text.replace(new RegExp('\\b(?:duoi|toi da|khong qua|tren|tu|den|toi|ngan sach|tam|khoang|gia)\\s*'+money,'g'),' ')
    .replace(/\b\d+(?:[.,]\d+)*\s*(?:trieu|nghin|ngan|vnd|dong|k|tr|d)\b/g,' ');
  }
  text=text.replace(/\b[345]\s*(?:sao|stars?)\b/g,' ').replace(/\b(?:tim|mua|muon|can|giup|voi|nhe|shop|tinh|cua)\b/g,' ');
  if(intent.regionKeyword)text=text.replace(/\b(?:mien bac|mien trung|mien nam|tay nguyen)\b/g,' ');
  const normalized=normalize(text),locationWords=new Set(normalize(intent.exactRegion||'').split(' ')),terms=normalized.split(' ').filter(term=>term&&!locationWords.has(term));
  const teaIntent=/\b(?:tra|che|tea)\b/.test(normalized)&&!/^(?:mien|banh|que|ruou|tuong|muoi|nuoc mam|mat ong|ca phe|hat dieu)\b/.test(normalized),group=/^(?:td|qt|ns|gv|tp)$/.test(normalized)?normalized:null;
  const types=[['banh trang',/^banh trang\b/],['mat ong',/^mat ong\b/],['ca phe',/^(?:ca phe|bot ca phe|hat ca phe)\b/],['hat dieu',/^(?:hat dieu|dieu)\b/],['nuoc mam',/^nuoc mam\b/],['mien dong',/^mien dong\b/]];
  const leadingType=types.find(([term])=>normalized===term||normalized.startsWith(term+' '));
  const codePrefix=/^(?:td|qt|ns|gv|tp)\d{1,5}$/.test(normalized)?normalized:null;
  const ranked=[];
  for(const product of products){
   if((intent.exactRegion||intent.regionKeyword)&&!shopping.regionMatches(product,intent))continue;
   if(intent.maxPrice!=null&&(!Number.isFinite(product.price)||product.price>intent.maxPrice))continue;
   if(intent.minPrice!=null&&(!Number.isFinite(product.price)||product.price<intent.minPrice))continue;
   if(intent.minStars&&product.stars<intent.minStars)continue;
   const row=record(product);
   if(leadingType&&!leadingType[1].test(row.name))continue;
   if(group||codePrefix){if(!row.code.startsWith(group||codePrefix))continue;}
   else{
    const unrelatedTeaPrefix=/^(?:mien|banh|que|ruou|tuong|muoi|nuoc mam)\b/.test(row.name);
    const isTea=!unrelatedTeaPrefix&&(/\btra\b/.test(row.name)||product.category==='tea'&&/\bche\b/.test(row.name));
    if(teaIntent&&!isTea)continue;
    const matches=terms.every(term=>row.words.has(term)||(['tra','che','tea'].includes(term)&&teaIntent&&(/\btra\b/.test(row.name)||product.category==='tea'&&/\bche\b/.test(row.name))));
    if(!matches)continue;
   }
   const score=(row.code===normalized?10000:0)+(row.name===normalized?1000:row.name.startsWith(normalized)?100:0)+(product.category==='tea'&&teaIntent?10:0);
   ranked.push({product,score});
  }
  return ranked.sort((a,b)=>b.score-a.score).map(row=>row.product);
 }
 const api={search};if(typeof module==='object'&&module.exports)module.exports=api;else root.OCOPProductSearch=api;
})(typeof globalThis!=='undefined'?globalThis:this);
