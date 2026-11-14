const test=require('node:test'),assert=require('node:assert/strict');
const {generateWithSalesTools}=require('./sales-tools');
const payload={system_instruction:{parts:[{text:'Use verified facts'}]},contents:[{role:'user',parts:[{text:'Check stock'}]}],generationConfig:{responseMimeType:'application/json',responseSchema:{type:'OBJECT',required:['message']}}};
const result=content=>({response:{ok:true},data:{candidates:[{content}]},provider:'gemini',attempts:1});
test('real function-call loop passes authoritative results back and preserves thought signatures',async()=>{
 let calls=0;
 const content={role:'model',parts:[{thoughtSignature:'preserve-signature',functionCall:{name:'check_inventory',args:{productId:1,quantity:2}}}]};
 const reply=await generateWithSalesTools({model:'test'},payload,{enableTools:true,salesStore:{inventory:(id,qty)=>({productId:id,requestedQuantity:qty,stock:null,price:100000})},knowledge:{search:()=>[]},generate:async(_c,p)=>{
  calls++;if(calls===1){assert(p.tools);assert(!p.generationConfig.responseSchema);return result(content);}
  assert.deepEqual(p.contents[1],content);assert.equal(p.contents[2].parts[0].functionResponse.response.stock,null);
  return result({role:'model',parts:[{text:JSON.stringify({message:'Stock is unverified.'})}]});
 }});
 assert.equal(calls,2);assert.equal(reply.salesToolResults[0].result.stock,null);
});
test('unconfirmed model draft requests are rejected and confirmed drafts use only frontend data',async()=>{
 for(const confirmed of [false,true]){
  let creates=0,calls=0;const frontend={confirmed:true,idempotencyKey:'frontend-request-12345',items:[{productId:1,quantity:2}]};
  const reply=await generateWithSalesTools({},payload,{enableTools:true,confirmedDraft:confirmed?frontend:null,salesStore:{createDraft:b=>{creates++;assert.equal(b,frontend);return {id:'real-draft',status:'pending_seller_confirmation',lines:[],subtotal:200000,reserved:false};}},knowledge:{search:()=>[]},generate:async(_c,p)=>{
   calls++;if(calls===1){const names=p.tools[0].functionDeclarations.map(d=>d.name);assert.equal(names.includes('create_draft_order'),confirmed);return result({role:'model',parts:[{functionCall:{name:'create_draft_order',args:{items:[{productId:999,quantity:500}]}}}]});}
   return result({role:'model',parts:[{text:'{"message":"Done"}'}]});
  }});
  assert.equal(creates,confirmed?1:0);if(!confirmed)assert(reply.salesToolResults[0].result.error);
 }
});
test('tools are bypassed for normal chat and provider failures remain failures',async()=>{
 let calls=0;const generate=async()=>{calls++;return {response:{ok:false,status:503},attempts:1};};
 assert.equal((await generateWithSalesTools({},payload,{generate})).response.status,503);assert.equal(calls,1);
});

test('execution telemetry is retained when the model fails after a successful tool',async()=>{
 const observed=[];let calls=0;
 const reply=await generateWithSalesTools({},payload,{enableTools:true,onToolResult:event=>observed.push(event),salesStore:{inventory:()=>({productId:1,stock:null})},knowledge:{search:()=>[]},generate:async()=>{
  if(++calls===1)return result({role:'model',parts:[{functionCall:{name:'check_inventory',args:{productId:1}}}]});
  return {response:{ok:false,status:503},attempts:1};
 }});
 assert.equal(reply.response.status,503);assert.equal(observed.length,1);assert.equal(observed[0].result.productId,1);
});
