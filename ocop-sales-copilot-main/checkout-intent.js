(function(root){
 'use strict';
 const memory=new Map();
 function uuid(){
  if(root.crypto?.randomUUID)return root.crypto.randomUUID();
  const bytes=root.crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20);
 }
 function read(scope){try{return JSON.parse(root.sessionStorage?.getItem('ocop-checkout-intent:'+scope))||memory.get(scope);}catch{return memory.get(scope);}}
 function write(scope,value){memory.set(scope,value);try{root.sessionStorage?.setItem('ocop-checkout-intent:'+scope,JSON.stringify(value));}catch{}return value;}
 function begin(scope){const current=read(scope);return (current&&!current.completed?current:write(scope,{key:uuid()})).key;}
 function canonical(value){if(Array.isArray(value))return value.map(canonical);return value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;}
 async function bind(scope,payload){
  const digest=await root.crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(canonical(payload))));
  const fingerprint=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
  let intent=read(scope)||{key:uuid()};
  if(intent.fingerprint&&intent.fingerprint!==fingerprint)intent={key:uuid()};
  write(scope,{...intent,fingerprint});return intent.key;
 }
 function reset(scope){return write(scope,{key:uuid()}).key;}
 function finish(scope){const current=read(scope);if(current)write(scope,{...current,completed:true});}
 const api={begin,bind,reset,finish};if(typeof module==='object'&&module.exports)module.exports=api;else root.OCOPCheckoutIntent=api;
})(typeof window!=='undefined'?window:globalThis);
