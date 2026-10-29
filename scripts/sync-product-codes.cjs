'use strict';
const fs=require('node:fs'),path=require('node:path');
const {codeFor}=require('../product-codes');
function syncProductCodes(){
 const filename=path.resolve(__dirname,'../data.js');
 delete require.cache[require.resolve('../data')];const {PRODUCTS}=require('../data');
 const codes=new Map(PRODUCTS.map(product=>[product.id,codeFor(product)]));
 if(codes.size!==PRODUCTS.length||new Set(codes.values()).size!==PRODUCTS.length)throw Error('Duplicate catalogue IDs or product codes');
 const source=fs.readFileSync(filename,'utf8');let count=0;
 const updated=source.replace(/(    "id": (\d+),)(?:\r?\n    "productCode": "[A-Z]{2}\d{5}",)?/g,(match,idLine,id)=>{
  const code=codes.get(Number(id));if(!code)throw Error('Unknown product ID '+id);count++;return idLine+'\n    "productCode": "'+code+'",';
 });
 if(count!==PRODUCTS.length)throw Error('Catalogue layout changed; codes were not written');
 if(source!==updated)fs.writeFileSync(filename,updated);
 return count;
}
if(require.main===module)console.log('Synchronized '+syncProductCodes()+' product codes.');
module.exports={syncProductCodes};
