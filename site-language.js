(function(root){
 'use strict';
 const languages=['vi','en','zh','ko','ja'],names={vi:'Tiếng Việt',en:'English',zh:'中文',ko:'한국어',ja:'日本語'};
 const normalize=value=>{const code=String(value||'').toLowerCase().split('-')[0];return languages.includes(code)?code:'vi';};
 function saved(){try{const query=new URL(root.location.href).searchParams.get('lang');if(languages.includes(query))return query;const stored=root.localStorage?.getItem('ocop-language');if(languages.includes(stored))return stored;}catch{}return normalize(root.document?.documentElement.lang);}
 let current=saved();
 const dictionary=()=>root.OCOPUITranslations?.rows||(typeof module==='object'&&module.exports?require('./ui-translations').rows:[]);
 let cachedLength=-1,lookup=new Map(),prefixes=[];
 function text(value,lang=current){
  const input=String(value??''),plain=input.trim(),rows=dictionary();lang=normalize(lang);
  if(cachedLength!==rows.length){cachedLength=rows.length;lookup=new Map();for(const row of rows)for(const label of row)if(!lookup.has(label.trim()))lookup.set(label.trim(),row);prefixes=[...lookup].filter(([label])=>/[:：]$/.test(label)).sort((a,b)=>b[0].length-a[0].length);}
  const index=languages.indexOf(lang),row=lookup.get(plain);if(row)return input.replace(plain,row[index].trim());
  const required=rows.find(entry=>entry.some(label=>label.trim().replace(/\s*\*$/,'')===plain));if(required)return input.replace(plain,required[index].trim().replace(/\s*\*$/,''));
  const decorated=/^([\p{Extended_Pictographic}\uFE0F\u200D\s]+)(\S.*)$/u.exec(plain);if(decorated){const translated=text(decorated[2],lang);if(translated!==decorated[2])return input.replace(plain,decorated[1]+translated);}
  const prefix=prefixes.find(([label])=>plain.startsWith(label));if(prefix)return input.replace(prefix[0],prefix[1][index].trim());
  const count=/^(\d+)\s+(?:sản phẩm|items|件商品|개 상품|商品)$/.exec(plain);if(count)return count[1]+' '+({vi:'sản phẩm',en:'items',zh:'件商品',ko:'개 상품',ja:'商品'})[lang];
  return input;
 }
 function productName(product,lang=current){if(!product)return '';lang=normalize(lang);return lang==='vi'?product.name:product['name'+lang[0].toUpperCase()+lang.slice(1)]||product.name;}
 function productDescription(product,lang=current){
  if(!product)return '';lang=normalize(lang);const translated=product['desc'+lang[0].toUpperCase()+lang.slice(1)];if(lang==='vi')return product.desc||product.description||'';if(translated)return translated;
  const summaries={en:'{name} — {region}. Price unit: {unit}. Prices and star ratings are supplied by the store. Please confirm stock and product details before ordering.',zh:'{name} — {region}。计价单位：{unit}。价格和星级由商家提供，下单前请确认库存和商品详情。',ko:'{name} — {region}. 가격 단위: {unit}. 가격과 별 등급은 판매점이 제공합니다. 주문 전 재고와 상품 정보를 확인하세요.',ja:'{name} — {region}。価格単位：{unit}。価格と星等級は店舗からの情報です。注文前に在庫と商品情報をご確認ください。'};
  return summaries[lang].replace('{name}',productName(product,lang)).replace('{region}',product.region||'').replace('{unit}',unit(product.packaging||product.unit||'',lang));
 }
 function unit(value,lang=current){const units={hộp:['box','盒','상자','箱'],chiếc:['piece','件','개','個'],gói:['pack','包','팩','パック'],chai:['bottle','瓶','병','本'],lọ:['jar','罐','병','瓶'],hũ:['jar','罐','단지','瓶'],túi:['bag','袋','봉지','袋'],bộ:['set','套','세트','セット'],thùng:['carton','箱','상자','箱'],bình:['bottle','瓶','병','本'],lít:['litre','升','리터','リットル'],nải:['bunch','串','송이','房'],tranh:['painting','幅','점','枚'],cái:['piece','件','개','個'],chục:['ten pieces','十件','10개','10個'],bịch:['pack','袋','팩','袋'],món:['item','件','개','品'],đòn:['roll','条','개','本']};lang=normalize(lang);if(lang==='vi')return value;return String(value||'').replace(/Quy cách cần xác nhận/g,({en:'Packaging to be confirmed',zh:'包装待确认',ko:'포장 규격 확인 필요',ja:'包装仕様は要確認'})[lang]).replace(/hộp túi lọc/g,({en:'tea-bag box',zh:'袋泡茶盒',ko:'티백 상자',ja:'ティーバッグ箱'})[lang]).replace(/hộp|chiếc|gói|chai|lọ|hũ|túi|bộ|thùng|bình|lít|nải|tranh|cái|chục|bịch|món/g,key=>units[key][languages.indexOf(lang)-1]);}
 function links(scope=root.document){const anchors=[...(scope?.matches?.('a[href]')?[scope]:[]),...(scope?.querySelectorAll?.('a[href]')||[])];anchors.forEach(anchor=>{const href=anchor.getAttribute('href');if(!href||href.startsWith('#'))return;try{const url=new URL(href,root.document.baseURI);if(url.origin!==root.location.origin)return;if(/\/(?:about|contact|privacy|terms|catalog)(?:\/|\.md)?$|\/(?:index(?:_2)?|draft-order)\.html$/.test(url.pathname)){url.searchParams.set('lang',current);const next=url.pathname+url.search+url.hash;if(anchor.getAttribute('href')!==next)anchor.setAttribute('href',next);}}catch{}});}
 const translatedNodes=new WeakMap(),translatedAttributes=new WeakMap();
 function translate(scope=root.document){
  if(!scope?.createTreeWalker&&!root.document?.createTreeWalker)return;
  const document=root.document,container=scope.nodeType===3?scope.parentNode:scope;if(!container)return;
  const skip=node=>node.parentElement?.closest('script,style,textarea,input,[contenteditable],[data-localization-skip],#ai-chat-messages,.account-center-user');
  const walker=document.createTreeWalker(container,4);let node;while((node=walker.nextNode())){if(skip(node))continue;const prior=translatedNodes.get(node);if(prior?.language===current&&prior.value===node.nodeValue)continue;const next=text(node.nodeValue);translatedNodes.set(node,{language:current,value:next});if(next!==node.nodeValue)node.nodeValue=next;}
  const elements=[...(container.nodeType===1?[container]:[]),...(container.querySelectorAll?.('[title],[aria-label],[placeholder]')||[])];elements.forEach(element=>{const previous=translatedAttributes.get(element)||{};for(const attr of ['title','aria-label','placeholder']){const value=element.getAttribute(attr);if(value!=null){if(previous[attr]?.language===current&&previous[attr].value===value)continue;const next=text(value);previous[attr]={language:current,value:next};if(next!==value)element.setAttribute(attr,next);}}translatedAttributes.set(element,previous);});
  links(container);
 }
 function set(value,{source='user',persist=true}={}){
  const target=normalize(value),previous=current;current=target;
  if(persist){try{root.localStorage?.setItem('ocop-language',target);}catch{}try{root.document.cookie='ocop-language='+target+'; Path=/; Max-Age=31536000; SameSite=Lax';}catch{}}
  if(root.document)root.document.documentElement.lang=target;
  try{const url=new URL(root.location.href);if(url.searchParams.has('lang')){url.searchParams.set('lang',target);root.history?.replaceState(null,'',url.pathname+url.search+url.hash);}}catch{}
  if(previous!==target&&root.CustomEvent)root.dispatchEvent?.(new root.CustomEvent('ocop-language-change',{detail:{language:target,source}}));
  return target;
 }
 const api={languages,names,normalize,get:()=>current,set,text,unit,translate,links,productName,productDescription};
 if(typeof module==='object'&&module.exports){module.exports=api;return;}root.OCOPLanguage=api;
 function init(){
  set(current);root.setTimeout(()=>translate(),0);
  root.addEventListener('storage',event=>{if(event.key==='ocop-language'&&languages.includes(event.newValue)){set(event.newValue,{source:'storage',persist:false});translate();}});
  root.addEventListener('ocop-language-change',()=>translate());
  if(root.MutationObserver){let queued=false;const targets=new Set();new root.MutationObserver(records=>{for(const record of records){if(record.type==='characterData')targets.add(record.target.parentNode);else if(record.type==='attributes')targets.add(record.target);else for(const node of record.addedNodes)if(node.nodeType===1||node.nodeType===3)targets.add(node);}if(!queued&&targets.size){queued=true;queueMicrotask(()=>{queued=false;const pending=[...targets];targets.clear();pending.forEach(node=>{if(node?.isConnected)translate(node);});});}}).observe(root.document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});}
 }
 if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof window!=='undefined'?window:globalThis);
