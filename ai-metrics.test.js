const test=require('node:test'),assert=require('node:assert/strict');
const {createMetrics}=require('./ai-metrics');
test('empty metrics never claim accuracy, conversion or response performance',()=>{
 const data=createMetrics().snapshot();
 assert.equal(data.averageResponseMs,null);assert.equal(data.handoffRate,null);
 assert.equal(data.accuracyRate,null);assert.equal(data.conversionRate,null);assert.equal(data.draftOrders,0);assert.equal(data.toolSuccessRate,null);
});
test('handoff is counted once per session and failures contribute to latency',()=>{
 const metrics=createMetrics(),sessionId='demo-session-123456';
 metrics.record({durationMs:200,status:200,body:{handoffAdmin:true,integrations:{gemini:true,wikipedia:true}},sessionId});
 metrics.record({durationMs:400,status:503,body:{},sessionId});
 metrics.record({durationMs:600,status:200,body:{},sessionId:'other-session-123456'});
 const data=metrics.snapshot();
 assert.equal(data.averageResponseMs,400);assert.equal(data.requests,3);assert.equal(data.failed,1);
 assert.equal(data.trackedSessions,2);assert.equal(data.handoffSessions,1);assert.equal(data.handoffRate,0.5);
 assert.equal(data.geminiResponses,1);assert.equal(data.wikipediaResponses,1);
 assert(!JSON.stringify(data).includes(sessionId));
});
test('untracked requests do not invent tracked sessions',()=>{
 const metrics=createMetrics();metrics.record({durationMs:100,status:400,body:{},sessionId:'bad'});
 assert.equal(metrics.snapshot().requests,1);assert.equal(metrics.snapshot().trackedSessions,0);
});

test('Vietnamese midnight and selected windows include only matching events',()=>{
 let clock=Date.parse('2026-10-09T16:59:59Z');const metrics=createMetrics({now:()=>clock});
 const record=()=>metrics.record({durationMs:200,status:200,sessionId:'window-session-123456'});
 record();clock+=1000;record();
 assert.equal(metrics.snapshot('day').requests,1);
 assert.equal(metrics.snapshot('day').hourly[0].requests,1);
 assert.equal(metrics.snapshot('day').windowStart,'2026-10-09T17:00:00.000Z');
 assert.equal(metrics.snapshot('week').requests,2);
 clock+=7*86400000;record();
 assert.equal(metrics.snapshot('week').requests,1);
 assert.equal(metrics.snapshot('month').requests,3);
});

test('draft conversion deduplicates retries and only counts consultation cohorts',()=>{
 const metrics=createMetrics(),a='conversion-session-123456',b='conversion-session-654321';
 for(const sessionId of [a,b])metrics.record({durationMs:10,status:200,sessionId});
 metrics.recordDraft({id:'draft-1',sessionId:a});metrics.recordDraft({id:'draft-1',sessionId:b});
 metrics.recordDraft({id:'draft-2',sessionId:a});metrics.recordDraft({id:'old-draft',sessionId:a,reused:true});
 metrics.recordDraft({id:'unlinked-draft',sessionId:'bad'});
 const data=metrics.snapshot();assert.equal(data.draftOrders,3);assert.equal(data.convertedSessions,1);assert.equal(data.conversionRate,.5);assert.equal(data.unlinkedDraftOrders,1);
 assert.equal(data.automationRate,1);
});

test('tools count execution failures and catalogue products without invented IDs',()=>{
 const metrics=createMetrics({products:[{id:1,name:'Tea',nameEn:'Tea'}]});
 metrics.recordTool({name:'check_inventory',result:{productId:1,stock:null}});
 metrics.recordTool({name:'check_inventory',result:{error:'Invalid product'}});
 metrics.recordTool({name:'search_product_knowledge',result:{records:[{productId:1},{productId:1},{productId:999}]}});
 metrics.record({durationMs:10,status:200,body:{productIds:[1,1,999]},sessionId:'tool-session-123456'});
 const data=metrics.snapshot();assert.equal(data.toolCalls,3);assert.equal(data.toolSuccessRate,2/3);assert.equal(data.toolFailed,1);assert.equal(data.productInterest.length,1);assert.equal(data.productInterest[0].count,3);
});

test('persistent metrics survive restart and exclude customer and chat contents',()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path');const folder=fs.mkdtempSync(path.join(os.tmpdir(),'ocop-metrics-')),file=path.join(folder,'metrics.json');
 try{
  const metrics=createMetrics({file}),sessionId='private-session-123456';
  metrics.record({durationMs:20,status:200,sessionId,body:{message:'private message',customer:{phone:'0901234567',address:'private address'},productIds:[]}});
  metrics.recordDraft({id:'test-draft',sessionId});
  const restarted=createMetrics({file});assert.equal(restarted.snapshot().requests,1);assert.equal(restarted.snapshot().conversionRate,1);
  restarted.recordDraft({id:'test-draft',sessionId});assert.equal(restarted.snapshot().draftOrders,1);
  const saved=fs.readFileSync(file,'utf8');for(const value of [sessionId,'private message','0901234567','private address'])assert(!saved.includes(value));
  assert(!JSON.stringify(restarted.snapshot()).includes('test-draft'));
 }finally{fs.rmSync(folder,{recursive:true,force:true});}
});

test('retention and capped history do not claim complete all-time data',()=>{
 let clock=Date.parse('2026-01-01T00:00:00Z');const metrics=createMetrics({now:()=>clock,maxEvents:2});
 for(let i=0;i<3;i++)metrics.record({durationMs:100,status:200});
 assert.equal(metrics.snapshot().requests,2);assert.equal(metrics.snapshot().truncated,true);
 clock+=91*86400000;assert.equal(metrics.snapshot().requests,0);
 metrics.record({durationMs:100,status:200});assert.equal(metrics.snapshot().requests,1);
});

test('failed sessions are excluded from the self-service estimate',()=>{
 const metrics=createMetrics();
 metrics.record({durationMs:20,status:503,sessionId:'failed-session-123456'});
 metrics.record({durationMs:20,status:200,sessionId:'failed-session-123456'});
 metrics.record({durationMs:20,status:200,sessionId:'handoff-session-123456',body:{handoffAdmin:true}});
 metrics.record({durationMs:20,status:200,sessionId:'normal-session-123456'});
 assert.equal(metrics.snapshot().automationRate,1/3);assert.equal(metrics.snapshot().handoffRate,1/3);
});

test('consultation attribution requires a real retained chat session',()=>{
 const metrics=createMetrics(),sessionId='attribution-session-123456';assert.equal(metrics.hasSession(sessionId),false);
 metrics.recordDraft({id:'draft',sessionId});assert.equal(metrics.hasSession(sessionId),false);
 metrics.record({durationMs:1,status:200,sessionId});assert.equal(metrics.hasSession(sessionId),true);assert.equal(metrics.hasSession('bad'),false);
});
