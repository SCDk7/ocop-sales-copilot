const test=require('node:test'),assert=require('node:assert/strict');
const {withoutCopilot,cleanTree}=require('./ui-branding');
test('visible branding is removed from labels, headings and contact text',()=>{
 for(const value of ['OCOP SALES COPILOT','Trợ lý AI Copilot','Open AI Copilot Assistant','OCOP Copilot 24/7'])assert(!/copilot/i.test(withoutCopilot(value)));
 assert.equal(withoutCopilot('OCOP SALES COPILOT').trim(),'OCOP SALES');
 assert.equal(withoutCopilot('support@ocopsalescopilot.vn'),'Liên hệ CSKH');
 assert.equal(withoutCopilot('Giỏ hàng 2 · 600.000 ₫'),'Giỏ hàng 2 · 600.000 ₫');
});
test('dynamic text and labels are cleaned while DOM IDs and navigation targets stay intact',()=>{
 const attrs={id:'i18n-hero-btn-copilot',href:'/ocop-copilot.js',title:'Open AI Copilot',onclick:'openCopilot()'};
 const node={nodeType:1,matches:()=>false,querySelectorAll:()=>[],getAttribute:key=>attrs[key]??null,setAttribute:(key,value)=>attrs[key]=value};
 const text={nodeValue:'Trợ lý AI Copilot',parentElement:{closest:()=>null}};
 const document={createTreeWalker(){let used=false;return{nextNode(){if(used)return false;used=true;return true;},currentNode:text};}};
 cleanTree(node,document);
 assert.equal(text.nodeValue.trim(),'Trợ lý AI');assert(!/copilot/i.test(attrs.title));
 assert.equal(attrs.id,'i18n-hero-btn-copilot');assert.equal(attrs.href,'/ocop-copilot.js');assert.equal(attrs.onclick,'openCopilot()');
});
test('scripts, styles and customer input are not rewritten',()=>{
 const node={nodeType:3,nodeValue:'const openCopilot = 1;',parentElement:{closest:()=>({})}};
 cleanTree(node,{});assert.equal(node.nodeValue,'const openCopilot = 1;');
});
