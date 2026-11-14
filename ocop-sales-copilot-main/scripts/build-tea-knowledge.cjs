const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const knowledge=JSON.parse(fs.readFileSync(path.join(root,'data/tea-knowledge.json'),'utf8'));
fs.writeFileSync(path.join(root,'data/tea-knowledge.js'),'// Generated from tea-knowledge.json by scripts/build-tea-knowledge.cjs\nwindow.OCOPTeaKnowledge = '+JSON.stringify(knowledge,null,2)+';\n');
console.log('Browser tea knowledge updated.');
