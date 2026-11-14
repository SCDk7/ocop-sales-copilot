const fs=require('node:fs'),path=require('node:path');
const rows=require('./catalog-63-provinces-rows.json');const output=path.join(__dirname,'catalog-latest-english.json');
const env=Object.fromEntries(fs.readFileSync(path.join(__dirname,'../../.env'),'utf8').split(/\r?\n/).filter(s=>s.includes('=')&&!s.trim().startsWith('#')).map(s=>{const n=s.indexOf('=');return[s.slice(0,n).trim(),s.slice(n+1).trim().replace(/^['"]|['"]$/g,'')]}));
const saved=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):{};
(async()=>{
 for(let i=0;i<rows.length;i+=24){const batch=rows.slice(i,i+24).filter(r=>saved[r.row]?.name!==r.name);if(!batch.length)continue;
 const res=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+(env.GEMINI_MODEL||'gemini-3.1-flash-lite')+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},body:JSON.stringify({contents:[{parts:[{text:'Translate each product name and price unit into English. Preserve Vietnamese proper names and brand names. Do not correct or invent certification, ingredients or claims. Return JSON array with row, nameEn, packagingEn. Input: '+JSON.stringify(batch.map(r=>({row:r.row,name:r.name,packaging:r.priceSuffix.replace(/^\//,'')||'Quy cách cần xác nhận'})))}]}],generationConfig:{temperature:0,maxOutputTokens:4500,responseMimeType:'application/json',responseSchema:{type:'ARRAY',items:{type:'OBJECT',properties:{row:{type:'INTEGER'},nameEn:{type:'STRING'},packagingEn:{type:'STRING'}},required:['row','nameEn','packagingEn']}}}}),signal:AbortSignal.timeout(60000)});
 const data=await res.json();if(!res.ok)throw Error('Translation HTTP '+res.status+' '+data.error?.status);
 const answers=JSON.parse(data.candidates[0].content.parts.map(p=>p.text||'').join(''));
 for(const r of batch){const a=answers.find(a=>a.row===r.row);if(!a?.nameEn||!a?.packagingEn)throw Error('Missing English for row '+r.row);saved[r.row]={name:r.name,nameEn:a.nameEn,packagingEn:a.packagingEn}}
 fs.writeFileSync(output,JSON.stringify(saved,null,2)+'\n');console.log('Translated '+Math.min(i+24,rows.length)+'/'+rows.length);
 }
})().catch(e=>{console.error(e.message);process.exit(1)});
