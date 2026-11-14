'use strict';
const fs=require('node:fs'),path=require('node:path');
const {createAIAccessStore}=require('../ai-access-store');
const [id,action]=process.argv.slice(2),base=process.env.PRIVATE_DATA_DIR||path.resolve(__dirname,'../.private-data');
try{
 if(!id||!['enable','disable'].includes(action))throw Error('Usage: node scripts/set-ai-access.cjs USER_ID enable|disable');
 const users=JSON.parse(fs.readFileSync(process.env.CUSTOMERS_FILE||path.join(base,'customers.json'),'utf8'));
 if(!users.some(user=>user.id===id))throw Error('Account not found. Use the server account ID, not a browser username.');
 const policy=createAIAccessStore(process.env.AI_ACCESS_FILE||path.join(base,'ai-access.json')).set(id,action==='enable','operator-cli');
 console.log(JSON.stringify({userId:id,...policy}));
}catch(error){console.error(error.message);process.exitCode=1;}
