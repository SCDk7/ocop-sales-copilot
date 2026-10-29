(function(root){
 'use strict';
 const groups=Object.freeze({
  tea:Object.freeze({prefix:'TD',name:'Thảo dược & trà'}),
  gift:Object.freeze({prefix:'QT',name:'Quà tặng di sản'}),
  food:Object.freeze({prefix:'NS',name:'Nông sản chế biến'}),
  spice:Object.freeze({prefix:'GV',name:'Gia vị & hương liệu'}),
  snack:Object.freeze({prefix:'TP',name:'Thực phẩm bản địa'})
 });
 function groupFor(product){return groups[product?.category]||{prefix:'SP',name:'Sản phẩm khác'};}
 function codeFor(product){
  const id=Number(product?.id??product?.productId);
  if(!Number.isSafeInteger(id)||id<1||id>99999)throw Error('Product ID must be between 1 and 99999');
  return groupFor(product).prefix+String(id).padStart(5,'0');
 }
 function decorate(product){const group=groupFor(product);return {...product,productCode:codeFor(product),productGroupCode:group.prefix,productGroupName:group.name};}
 function matches(product,query){
  const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase();
  return normalize([codeFor(product),product.name,product.nameEn,product.region,groupFor(product).name].join(' ')).includes(normalize(query).trim());
 }
 const api={groups,groupFor,codeFor,decorate,matches};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.OCOPProductCodes=api;
})(typeof globalThis!=='undefined'?globalThis:this);
