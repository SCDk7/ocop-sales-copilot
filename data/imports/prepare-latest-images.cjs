const fs=require('node:fs'),path=require('node:path');
const base=__dirname,root=path.join(base,'../..');
const rows=require('./catalog-63-provinces-rows.json'),old=require('./catalog-before-latest.json'),downloaded=require('./catalog-63-downloaded-photos.json'),map=require('./catalog-latest-previous-row-map.json');
const sources={};
for(const row of rows){
 const previousRow=map[row.row];if(!previousRow)continue;
 const p=old.find(p=>p.sourceRow===previousRow);const photo=downloaded[previousRow];
 if(p&&!p.imagePending)sources[row.row]={image:p.img,source:p.imageSource||p.imagePhotoSource||'User supplied or previously reviewed catalogue photo',previousRow,status:'awaiting_visual_review'};
 else if(photo?.image&&fs.existsSync(path.join(root,photo.image)))sources[row.row]={image:photo.image,source:photo.source,imageUrl:photo.imageUrl,title:photo.title,previousRow,status:'awaiting_visual_review'};
}
fs.writeFileSync(path.join(base,'catalog-latest-image-sources.json'),JSON.stringify(sources,null,2)+'\n');
const missing=rows.filter(r=>!sources[r.row]);
fs.writeFileSync(path.join(base,'catalog-latest-missing-images.json'),JSON.stringify(missing.map(r=>({row:r.row,name:r.name,region:r.region})),null,2)+'\n');
console.log(JSON.stringify({matched:Object.keys(sources).length,missing:missing.length,missingNames:missing.map(r=>r.row+' '+r.name+' '+r.region)},null,2));
