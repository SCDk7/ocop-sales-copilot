const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const profile=require('./ocop-assistant-profile');
test('shared provider instruction requires understanding, website evidence, compact replies, honest images and voice',()=>{
 for(const text of ['Trợ lý AI OCOP Việt Nam','HIỂU TRƯỚC KHI TRẢ LỜI','1–3 câu','Dạ','Thưa','Giữ bản chép lời trung thực','không tự tạo 98%',profile.missingInformation])assert(profile.assistantInstruction.includes(text),text);
 const server=fs.readFileSync('server.js','utf8');assert(server.includes('assistantInstruction,'));assert(server.includes('analyzeCustomerRequest(validation.messages'));
});
test('greetings are enforced idempotently without adding a generic follow-up',()=>{
 for(const input of ['Giá 120.000 ₫/hộp.','Dạ, giá 120.000 ₫/hộp.','Thưa anh/chị, giá 120.000 ₫/hộp.']){
  const message=profile.completeMessage(input);assert.match(message,/^(Dạ|Thưa)/);assert.equal(profile.completeMessage(message),message);assert(message.includes('120.000 ₫/hộp.'));assert(!message.includes('?'));
 }
 assert.equal(profile.completeMessage('Anh/chị muốn trà tỉnh nào ạ?'),'Dạ, Anh/chị muốn trà tỉnh nào ạ?');
});
test('unknown catalogue facts use the exact missing-data response and preserve metadata',()=>{
 const reply=profile.completeReply({message:'No result',knowledgeStatus:'not_found',productIds:[],requestAnalysis:{status:'completed'}});
 assert.equal(reply.message,profile.missingInformation);assert.equal(reply.text_response,reply.message);assert.deepEqual(reply.productIds,[]);assert.equal(reply.requestAnalysis.status,'completed');
});
test('final formatting preserves URLs, facts, clarification and machine fields',()=>{
 const original={message:'• Trà — 120.000 ₫/hộp\nhttps://example.com/?id=7',productIds:[7],integrations:{openai:false}};
 const reply=profile.completeReply(original);assert.deepEqual(reply.productIds,[7]);assert.deepEqual(reply.integrations,original.integrations);assert(reply.message.includes(original.message));assert.equal(reply.text_response,reply.message);assert.equal(original.message[0],'•');
 assert.equal(profile.completeMessage('','vi'),'');const error={error:'Unavailable'};assert.equal(profile.completeReply(error),error);
 const browser={};vm.runInNewContext(fs.readFileSync('ocop-assistant-profile.js','utf8'),browser);assert.equal(browser.OCOPAssistantProfile.completeMessage('Thông tin.'),profile.completeMessage('Thông tin.'));
});
test('every successful text, image and audio chat API passes through the final formatter',()=>{
 const source=fs.readFileSync('server.js','utf8');const middleware=source.slice(source.indexOf("app.use(['/api/ai/chat'"),source.indexOf("app.get('/health'"));let routes,handler;
 vm.runInNewContext(middleware,{app:{use(paths,callback){routes=paths;handler=callback}},completeReply:profile.completeReply});
 for(const route of ['/api/ai/chat','/api/chat','/chat','/api/ai/audio-chat','/api/ai/search-image'])assert(routes.includes(route));
 let sent;const res={statusCode:200,json(body){sent=body;}};handler({body:{language:'vi'}},res,()=>{});res.json({message:'Giá 120.000 ₫/hộp.'});assert.equal(sent.message,'Dạ, Giá 120.000 ₫/hộp.');
 res.statusCode=503;const error={error:'Unavailable'};res.json(error);assert.equal(sent,error);
});
