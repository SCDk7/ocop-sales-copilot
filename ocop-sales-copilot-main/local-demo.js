'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
// Sample credentials are seeded only by npm run dev, never normal npm start.
const accounts=[
 ['khachhang','123456','Khách hàng Demo','customer'],
 ['admin','000000','Quản trị viên Demo','admin','AD01'],
 ['ThaoNguyenad01','0000000','Thảo Nguyên (Admin 01)','admin','AD01'],
 ['KimNganad02','1111111','Kim Ngân (Admin 02)','admin','AD02'],
 ['VinhPhucad03','2222222','Vĩnh Phúc (Admin 03)','admin','AD03'],
 ['ThanhBinhad04','3333333','Thanh Bình (Admin 04)','admin','AD04'],
 ['nppdemo','NppDemo@2026','Nhà phân phối Demo OCOP','distributor','NPP26DEMO001']
];
function localDemoAllowed(env=process.env){return env.OCOP_LOCAL_DEMO==='1'&&env.NODE_ENV==='development'&&!env.RENDER&&!env.RENDER_GIT_COMMIT&&!env.RENDER_EXTERNAL_URL;}
function createLocalDemoEnvironment({directory=path.join(__dirname,'.private-data','local-demo'),env=process.env}={}){
 if(env.NODE_ENV==='production'||env.RENDER||env.RENDER_GIT_COMMIT||env.RENDER_EXTERNAL_URL)throw Error('Local demo accounts cannot run in production or on Render.');
 fs.mkdirSync(directory,{recursive:true,mode:0o700});const file=path.join(directory,'customers.json');let rows=[];
 try{rows=JSON.parse(fs.readFileSync(file,'utf8'));if(!Array.isArray(rows))throw Error('Invalid local demo customer data');}catch(e){if(e.code!=='ENOENT')throw e;}
 for(const [index,[username,password,name,role,code]]of accounts.entries()){
  if(rows.some(row=>row.normalizedUsername===username.toLowerCase()))continue;
  const salt=crypto.randomBytes(16);
  rows.push({id:'local-demo-'+(index+1),username,normalizedUsername:username.toLowerCase(),name,normalizedName:name.toLowerCase(),role,demo:true,
   ...(role==='admin'?{adminId:code}:role==='distributor'?{distributorCode:code}:{}),
   phone:'+8499000000'+index,address:'Địa chỉ mẫu — demo cục bộ',passwordSalt:salt.toString('hex'),passwordHash:crypto.scryptSync(password,salt,64).toString('hex'),verifiedAt:new Date().toISOString()});
 }
 const temporary=file+'.tmp';fs.writeFileSync(temporary,JSON.stringify(rows,null,2),{mode:0o600});fs.renameSync(temporary,file);
 const files={CUSTOMERS_FILE:'customers.json',ACCOUNT_DATA_FILE:'account-data.json',PRODUCT_REVIEWS_FILE:'reviews.json',SALES_DATA_FILE:'sales.json',AI_METRICS_FILE:'metrics.json',SALES_CONVERSATIONS_FILE:'conversations.json',AI_ACCESS_FILE:'ai-access.json'};
 return {NODE_ENV:'development',HOST:'127.0.0.1',TRUST_PROXY:'',OCOP_LOCAL_DEMO:'1',PRIVATE_DATA_DIR:directory,...Object.fromEntries(Object.entries(files).map(([key,name])=>[key,path.join(directory,name)]))};
}
module.exports={createLocalDemoEnvironment,localDemoAllowed};
