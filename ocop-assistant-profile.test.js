const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const profile=require('./ocop-assistant-profile');

test('the shared system prompt includes the OCOP identity, evidence boundaries, images and voice',()=>{
    const source=fs.readFileSync('server.js','utf8');
    const start=source.indexOf('function buildAISystemInstruction('),end=source.indexOf('const wikipediaSearchCache',start);
    const context={assistantInstruction:profile.assistantInstruction,scenarioInstruction:require('./ai-scenarios').scenarioInstruction,visualSearchInstruction:require('./ai-visual-reply').visualSearchInstruction,webResearchInstruction:require('./ai-web-research').webResearchInstruction,
        commerceShopping:{instruction:()=>''},productKnowledge:{search:()=>[]},AIShopping:require('./ai-shopping')};
    vm.createContext(context);vm.runInContext(source.slice(start,end),context);
    for(const options of [{},{hasImages:true},{includeTranscription:true},{combinedReply:true}]){
        const prompt=context.buildAISystemInstruction({products:[],language:'vi'},options);
        assert(prompt.includes(profile.assistantInstruction));
        if(options.hasImages) {
            assert(prompt.includes(context.visualSearchInstruction));
            assert(!prompt.includes('với similar chỉ chọn tối đa 2'));
        }
        for(const rule of ['Trợ lý AI OCOP Việt Nam','2–4 gạch đầu dòng','Ảnh giống một sản phẩm OCOP không chứng minh','Giữ bản chép lời trung thực','Với khiếu nại chỉ hỏi chi tiết cần xử lý']) assert(prompt.includes(rule),rule);
    }
});

test('follow-ups preserve catalogue data and do not sell during complaints',()=>{
    const product={message:'• Trà — 120.000 ₫/hộp',productIds:[7],integrations:{gemini:false}};
    const reply=profile.completeReply(product,'vi');
    assert(reply.message.startsWith(product.message));
    assert(reply.message.endsWith('Anh/chị có muốn xem thêm sản phẩm cùng loại không ạ?'));
    assert.deepEqual(reply.productIds,[7]);assert.deepEqual(reply.integrations,product.integrations);
    assert.equal(reply.text_response,reply.message);assert.equal(product.message,'• Trà — 120.000 ₫/hộp');
    const support=profile.completeReply({...product,handoffAdmin:true},'vi');
    assert(support.message.endsWith('Anh/chị cần em hỗ trợ bước nào tiếp theo ạ?'));
    assert(!support.message.includes('xem thêm sản phẩm'));
});

test('uncertain photos ask for labels without inventing OCOP or origin',()=>{
    const reply=profile.completeReply({message:'Chưa nhận diện được sản phẩm.',imageMatchStatus:'unknown',productIds:[]},'vi');
    assert.match(reply.message,/ảnh nhãn rõ hơn hoặc tên sản phẩm/);
    assert.deepEqual(reply.productIds,[]);
    assert(!/3 sao|4 sao|5 sao|chính hãng/.test(reply.message));
});

test('existing questions, links, errors and translations remain intact',()=>{
    const text='Anh/chị muốn tìm trà tỉnh nào ạ?';
    assert.equal(profile.completeMessage(text,'vi'),text);
    const reply=profile.completeReply({message:'See https://example.com/?product=tea',productIds:[1]},'en');
    assert(reply.message.endsWith('Would you like to see similar products?'));
    assert(reply.message.includes('https://example.com/?product=tea'));
    const error={error:'Unavailable'};assert.equal(profile.completeReply(error,'vi'),error);
    assert.equal(profile.completeMessage('', 'vi'),'');
    const browser={};vm.runInNewContext(fs.readFileSync('ocop-assistant-profile.js','utf8'),browser);
    assert.equal(browser.OCOPAssistantProfile.completeMessage('Thông tin sản phẩm.','vi'),profile.completeMessage('Thông tin sản phẩm.','vi'));
});

test('all chat API routes apply the profile only to successful replies',()=>{
    const source=fs.readFileSync('server.js','utf8');
    const middleware=source.slice(source.indexOf("app.use(['/api/ai/chat'"),source.indexOf("app.get('/health'"));
    let routes,handler;
    vm.runInNewContext(middleware,{app:{use(paths,callback){routes=paths;handler=callback}},completeReply:profile.completeReply});
    for(const route of ['/api/ai/chat','/api/chat','/chat','/api/ai/audio-chat','/api/ai/search-image']) assert(routes.includes(route));
    let sent,next=0;
    const res={statusCode:200,json(body){sent=body;}};
    handler({body:{language:'en'}},res,()=>next++);res.json({message:'Catalogue facts.',productIds:[1]});
    assert.equal(next,1);assert(sent.message.endsWith('Would you like to see similar products?'));
    res.statusCode=503;const error={message:'Service unavailable'};res.json(error);assert.equal(sent,error);
});
