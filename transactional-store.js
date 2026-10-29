'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const schema=fs.readFileSync(path.join(__dirname,'migrations/001-idempotency.sql'),'utf8');
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const fail=(message,status)=>{throw Object.assign(Error(message),{status});};
function canonical(value){
 if(Array.isArray(value))return value.map(canonical);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));
 return value;
}
function createTransactionalStore(legacyFile,initial,{now=Date.now,databaseFile=legacyFile+'.sqlite',namespace='state'}={}){
 const file=databaseFile;let connection;
 fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
 function open(){const db=new DatabaseSync(file,{timeout:1500});db.exec('PRAGMA busy_timeout=1500; PRAGMA synchronous=FULL;');return db;}
 const setup=open();
 try{
  setup.exec('PRAGMA journal_mode=WAL;'+schema);setup.exec('BEGIN IMMEDIATE');
  if(!setup.prepare('SELECT 1 FROM business_state WHERE id=?').get(namespace)){
   let data=initial;try{data=JSON.parse(fs.readFileSync(legacyFile,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
   setup.prepare('INSERT INTO business_state(id,payload) VALUES(?,?)').run(namespace,JSON.stringify(data));
  }
  setup.exec('COMMIT');
 }catch(e){try{setup.exec('ROLLBACK');}catch{}throw e;}finally{setup.close();}
 try{fs.chmodSync(file,0o600);}catch(e){if(process.platform!=='win32')throw e;}
 function transaction(work){
  if(connection)return work();
  const db=open();connection=db;
  try{db.exec('BEGIN IMMEDIATE');const result=work();if(result?.then)throw Error('Transaction callbacks must be synchronous; external payments require provider idempotency.');db.exec('COMMIT');return result;}
  catch(e){try{db.exec('ROLLBACK');}catch{}if(e.errcode===5||/database is locked/i.test(e.message))fail('Giao dịch đang được xử lý. Vui lòng thử lại với cùng mã yêu cầu.',409);throw e;}
  finally{connection=null;db.close();}
 }
 const read=()=>transaction(()=>JSON.parse(connection.prepare('SELECT payload FROM business_state WHERE id=?').get(namespace).payload));
 const save=data=>{if(!connection)throw Error('Business writes require a transaction');connection.prepare('UPDATE business_state SET payload=? WHERE id=?').run(JSON.stringify(data),namespace);};
 function execute(userId,key,operation,payload,work){
  if(typeof userId!=='string'||!userId)fail('Vui lòng đăng nhập.',401);
  if(typeof key!=='string'||!UUID.test(key))fail('Header Idempotency-Key phải là UUID v4.',400);
  const hash=crypto.createHash('sha256').update(JSON.stringify(canonical(payload))).digest('hex');
  return transaction(()=>{
   const at=now();
   // Lazy cleanup on every protected write also works after downtime/restart.
   connection.prepare('DELETE FROM idempotency_keys WHERE expires_at<=?').run(at);
   const inserted=connection.prepare("INSERT INTO idempotency_keys(user_id,key,operation,request_hash,status,created_at,expires_at) VALUES(?,?,?,?,'PROCESSING',?,?) ON CONFLICT(user_id,key) DO NOTHING").run(userId,key,operation,hash,at,at+86400000).changes;
   const row=connection.prepare('SELECT * FROM idempotency_keys WHERE user_id=? AND key=?').get(userId,key);
   if(row.operation!==operation||row.request_hash!==hash)fail('Mã yêu cầu đã được dùng cho nội dung khác. Hãy tạo phiên đặt hàng mới.',409);
   if(row.status==='COMPLETED')return {...JSON.parse(row.response_data),replayed:true};
   // A PROCESSING row from another transaction is invisible until it commits.
   // Synchronous BEGIN IMMEDIATE serializes writers; timeout returns 409 above.
   if(!inserted)fail('Giao dịch đang được xử lý. Vui lòng thử lại với cùng mã yêu cầu.',409);
   const response=work();if(response?.then)throw Error('Idempotent business callbacks must be synchronous');
   if(!Number.isInteger(response.status)||response.status<200||response.status>=300)throw Error('Only successful business results may commit');
   connection.prepare("UPDATE idempotency_keys SET status='COMPLETED',response_data=? WHERE user_id=? AND key=?").run(JSON.stringify(response),userId,key);
   return {...response,replayed:false};
  });
 }
 function wrap(methods,setState){return Object.fromEntries(Object.entries(methods).map(([name,method])=>[name,(...args)=>transaction(()=>{setState(read());return method(...args);})]));}
 const cleanup=()=>transaction(()=>connection.prepare('DELETE FROM idempotency_keys WHERE expires_at<=?').run(now()).changes);
 return {read,save,execute,wrap,cleanup,file};
}
module.exports={createTransactionalStore,UUID};
