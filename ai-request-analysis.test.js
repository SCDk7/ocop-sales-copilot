const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {analyzeCustomerRequest}=require('./ai-request-analysis');
const {catalogReply,imageUnavailableReply}=require('./chat-fallback');
const {PRODUCTS}=require('./data');
const user=text=>({role:'user',text});

test('analysis retains conversation constraints and applies the latest budget and province correction',()=>{
 const result=analyzeCustomerRequest([user('Tìm combo Đồng Nai 2 triệu 3 món'),{role:'assistant',text:'Anh/chị muốn thay đổi gì?'},user('Đổi sang Hà Nội, ngân sách 3 triệu')],PRODUCTS);
 assert.equal(result.intent.exactRegion,'Hà Nội');
 assert.equal(result.intent.maxPrice,3000000);
 assert.equal(result.summary.contextUsed,true);
 assert.equal(result.summary.status,'completed');
 assert.equal(result.summary.source,'catalog_rules');
 assert(result.summary.catalogueMatches>0);
 assert(result.summary.catalogueMatches<=PRODUCTS.filter(product=>product.region==='Hà Nội').length);
});

test('complaints with product or price keywords take priority over recommendations',()=>{
 const reply=catalogReply('Tôi khiếu nại: trà bị hỏng, giá 250k',PRODUCTS);
 assert.equal(reply.requestAnalysis.task,'complaint');
 assert.equal(reply.handoffAdmin,true);
 assert.deepEqual(reply.productIds,[]);
 const damaged=catalogReply('Hàng bị lỗi, giao nhầm sản phẩm',PRODUCTS);
 assert.equal(damaged.requestAnalysis.task,'complaint');
 assert.deepEqual(damaged.productIds,[]);
});

test('order-reference followups retain complaint context and prevention advice remains product information',()=>{
 const reply=catalogReply('Mã đơn ORD-12345',PRODUCTS,'vi',[user('Tôi khiếu nại hàng bị hỏng')]);
 assert.equal(reply.requestAnalysis.task,'complaint');
 assert.equal(reply.handoffAdmin,true);
 assert.deepEqual(reply.productIds,[]);
 const advice=analyzeCustomerRequest([user('Cách bảo quản trà tránh bị mốc?')],PRODUCTS);
 assert.equal(advice.intent.isComplaint,false);
 assert.equal(advice.summary.task,'product_information');
});

test('images are analyzed as image requests without text rules pretending to recognize them',()=>{
 const result=imageUnavailableReply('vi','tea.jpg',PRODUCTS);
 assert.equal(result.requestAnalysis.status,'completed');
 assert.equal(result.requestAnalysis.task,'image_lookup');
 assert.equal(result.requestAnalysis.catalogueMatches,null);
 assert.equal(result.imageMatchStatus,'unknown');
 assert.deepEqual(result.productIds,[]);
 const complaint=imageUnavailableReply('vi','Hàng bị hỏng',PRODUCTS);
 assert.equal(complaint.requestAnalysis.task,'complaint');assert.equal(complaint.handoffAdmin,true);
});

test('price and FAQ replies also carry completed request analysis',()=>{
 for(const query of ['Trà Phúc giá bao nhiêu?','Cách bảo quản mật ong?','Tôi muốn gặp nhân viên']){
  const reply=catalogReply(query,PRODUCTS);
  assert.equal(reply.requestAnalysis.status,'completed');
  assert.equal(reply.requestAnalysis.source,'catalog_rules');
 }
});

test('browser fallback loads the same analysis stage as the server',()=>{
 const browser={AIShopping:require('./ai-shopping')};browser.window=browser;
 vm.createContext(browser);
 for(const file of ['ai-scenarios.js','ai-request-analysis.js','chat-fallback.js'])vm.runInContext(fs.readFileSync(file,'utf8'),browser);
 const reply=browser.OCOPChatFallback.catalogReply('Tôi muốn khiếu nại đơn hàng',PRODUCTS);
 assert.equal(reply.requestAnalysis.task,'complaint');assert.equal(reply.productIds.length,0);
});
