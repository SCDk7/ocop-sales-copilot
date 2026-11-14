const fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'catalog-63-image-search.json');
let rows=JSON.parse(fs.readFileSync(file,'utf8'));
const more=path.join(__dirname,'catalog-63-image-search-more.json');
if(fs.existsSync(more)) rows=[...rows,...JSON.parse(fs.readFileSync(more,'utf8'))].filter((r,i,a)=>a.findIndex(x=>x.row===r.row)===i);
const norm=s=>decodeURIComponent(String(s).replace(/%(?![a-f\d]{2})/gi,'%25')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stop=new Set('san pham hut chan khong dong goi hop thung cao cap thuong hang nguyen chat sach kho say deo ban dia tuoi huu co thong truyen tinh bot thit hat'.split(' '));
for(const row of rows){
 const words=norm(row.name.split('/')[0]).split(' ').filter(w=>!stop.has(w));
 const region=norm(row.region).replace(/^thanh pho /,'');
 for(const c of row.candidates){
  let text;try{text=norm(c.title+' '+c.page+' '+c.image)}catch{text=norm(c.title)}
  c.score=words.reduce((s,w)=>s+(new RegExp('\\b'+w+'\\b').test(text)?2:0),0)+(text.includes(region)?4:0);
  if(/nongdan|nhandan|ocop|gov vn|duongchau|dacsan/.test(text))c.score+=1;
  if(/shopee|bachhoa extra|tecki|lazada|pinterest|youtube|facebook/.test(text))c.score-=2;
  if(/vuon|trong|cay giong|so che|thu hoach|chung nhan|bao bi|logo|hoat dong|tham quan/.test(norm(c.title)))c.score-=2;
 }
 row.candidates.sort((a,b)=>b.score-a.score);
 row.selected=row.candidates[0];
}
fs.writeFileSync(file,JSON.stringify(rows,null,2)+'\n');
console.log(rows.map(r=>`${r.row}. ${r.name} (${r.region}) => ${r.selected.title}`).slice(Number(process.argv[2]||0),Number(process.argv[3]||193)).join('\n'));
