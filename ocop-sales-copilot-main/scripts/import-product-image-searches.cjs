'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {normalize}=require('../ai-shopping');
function normalizeSearchURL(value){
 const url=new URL(String(value||'').replace(/&amp;/gi,'&'));
 if(url.protocol!=='https:'||!['www.google.com','google.com'].includes(url.hostname)||url.pathname!=='/search'||url.username||url.password||url.port||url.searchParams.get('tbm')!=='isch'||!url.searchParams.get('q')?.trim())throw Error('Expected a Google Images search URL');
 const canonical=new URL('https://www.google.com/search');canonical.searchParams.set('q',url.searchParams.get('q'));canonical.searchParams.set('tbm','isch');return canonical.href;
}
function importSearches(filename,{products=require('../data').PRODUCTS,output=path.resolve(__dirname,'../data/product-image-search-input.json')}={}){
 const XLSX=require('xlsx');
 const bytes=fs.readFileSync(filename);if(bytes.length>10*1024*1024)throw Error('Workbook exceeds 10 MB');
 const workbook=XLSX.read(bytes,{type:'buffer',cellFormula:false}),entries=[],seen=new Set();
 for(const sheetName of workbook.SheetNames){
  const sheet=workbook.Sheets[sheetName],rows=XLSX.utils.sheet_to_json(sheet,{header:1,defval:''});
  if(!rows.length)continue;
  const headers=rows[0].map(value=>normalize(String(value))),idColumn=headers.indexOf('id'),nameColumn=headers.indexOf('ten san pham'),urlColumn=headers.findIndex(value=>value.includes('link')&&value.includes('anh'));
  if([idColumn,nameColumn,urlColumn].some(value=>value<0))throw Error('Missing product ID, name or image-search column');
  for(let index=1;index<rows.length;index++){
   const row=rows[index];if(row.every(value=>value===''))continue;
   const id=Number(row[idColumn]),product=products.find(product=>product.id===id);
   if(!product||normalize(product.name)!==normalize(String(row[nameColumn])))throw Error('Unmatched catalogue identity at '+sheetName+' row '+(index+1));
   if(seen.has(id))throw Error('Duplicate product ID '+id);seen.add(id);
   const cell=sheet[XLSX.utils.encode_cell({r:index,c:urlColumn})];
   const searchUrl=normalizeSearchURL(cell?.l?.Target||row[urlColumn]);
   entries.push({id:product.id,name:product.name,region:product.region,query:new URL(searchUrl).searchParams.get('q'),searchUrl,sheet:sheetName,row:index+1});
  }
 }
 if(!entries.length)throw Error('Workbook contains no image searches');
 const result={source:path.basename(filename),sha256:crypto.createHash('sha256').update(bytes).digest('hex'),purpose:'internal_image_search_only',entries};
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');return result;
}
if(require.main===module){try{const result=importSearches(process.argv[2]);console.log(JSON.stringify({products:result.entries.length,source:result.source}));}catch(error){console.error(error.message);process.exitCode=1;}}
module.exports={importSearches,normalizeSearchURL};
