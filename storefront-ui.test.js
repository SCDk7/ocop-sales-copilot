'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {isCashflowText, stripFinancialLines, cleanReply} = require('./storefront-ui');

test('combo preset buttons open the chat and submit their selected prompt',()=>{
 const fs=require('node:fs'),vm=require('node:vm');const source=fs.readFileSync('storefront-ui.js','utf8');
 const start=source.indexOf('        root.triggerAIComboPrompt =');const end=source.indexOf('        // Disable only',start);
 const input={value:'',dispatchEvent(){}};let opened=0,sent='';
 const root={openAIChat:()=>opened++,sendAIMessage:()=>{sent=input.value;}};
 vm.runInNewContext(source.slice(start,end),{root,document:{getElementById:()=>input},Event:class{}});
 root.triggerAIComboPrompt('gợi ý combo quà tặng 500k');assert.equal(opened,1);assert.equal(sent,'gợi ý combo quà tặng 500k');
});
test('retired analysis labels are identified without hiding product prices or map labels', () => {
    for (const label of ['Phân tích dòng tiền', 'AI Financial Engine', 'COGS 62%', 'CHM commission', 'Analyze cash flow']) assert.equal(isCashflowText(label),true);
    for (const label of ['Bản đồ Việt Nam', 'Xem sản phẩm', '600.000 VNĐ/hộp', 'Phí giao hàng 30.000đ', 'Tổng thanh toán']) assert.equal(isCashflowText(label),false);
});
test('customer replies keep product and ordering details while removing analysis lines and chips', () => {
    const reply = cleanReply({message:'Trà Phìn Hồ: 600.000 VNĐ/hộp\nBiên lợi nhuận: 30%\nPhí giao hàng cần nhân viên xác nhận.',productIds:[340],dynamic_chips:['Xem sản phẩm','Phân tích dòng tiền']});
    assert.match(reply.message,/600\.000/);
    assert.match(reply.message,/Phí giao hàng/);
    assert(!reply.message.includes('Biên lợi nhuận'));
    assert.deepEqual(reply.productIds,[340]);
    assert.deepEqual(reply.dynamic_chips,['Xem sản phẩm']);
});
test('an entirely retired response becomes a product help prompt rather than an empty bubble', () => {
    const reply = cleanReply({message:'AI Financial Engine\nCOGS 62%'});
    assert(reply.message.includes('sản phẩm'));
    assert.equal(reply.message,reply.text_response);
    assert.equal(stripFinancialLines('Xem sản phẩm\\nCash flow 10%'),'Xem sản phẩm');
});

test('storefront cleanup disables analysis without changing map controls or cart functions',()=>{
    const vm=require('node:vm'),fs=require('node:fs');
    const mapControl={textContent:'Bản đồ Việt Nam',title:'',getAttribute:()=>'',closest:()=>({id:'province-map'})};
    const mapNode={nodeValue:'Map data retained',parentElement:{closest:()=>({id:'province-map'})}};
    const financeNode={nodeValue:'Phân tích dòng tiền',parentElement:{closest:()=>null}};
    const modal={hidden:false,inert:false,setAttribute(){},style:{setProperty(){}}};
    const nodes=[financeNode,mapNode];let i=-1;
    const map=()=>{},cart=()=>{};
    const context={document:{readyState:'complete',documentElement:{lang:'vi'},body:{},getElementById:id=>id==='ai-financial-modal'?modal:null,
        querySelectorAll:selector=>selector==='button, a, [role="button"]'?[mapControl]:[],
        createTreeWalker:()=>({nextNode(){i++;return i<nodes.length;},get currentNode(){return nodes[i];}})},
        OCOPCartUI:{ready:true},toggleCart:cart,setupInteractiveVietnamMap:map,OcopSyncEngine:{syncFinancial:()=>{throw Error('Must be disabled');}}};
    context.window=context;
    vm.runInNewContext(fs.readFileSync('storefront-ui.js','utf8'),context);
    assert.equal(modal.hidden,true);assert.equal(modal.inert,true);
    assert.equal(financeNode.nodeValue,'');assert.equal(mapNode.nodeValue,'Map data retained');
    assert.equal(mapControl.textContent,'Bản đồ Việt Nam');assert.equal(context.setupInteractiveVietnamMap,map);assert.equal(context.toggleCart,cart);
    assert.equal(context.openFinancialDashboardModal(),undefined);
});

function previewFixture(initialAttribute) {
    const vm=require('node:vm'),fs=require('node:fs');
    const values=new Map(initialAttribute===undefined?[]:[['data-server-no-reload',initialAttribute]]);
    const attributes=new Map();
    const body={hasAttribute:key=>values.has(key),getAttribute:key=>values.get(key),setAttribute:(key,value)=>values.set(key,value),removeAttribute:key=>values.delete(key)};
    const chat={hidden:false,style:{display:'none'},classList:{contains:()=>false}};
    const widget={hidden:false,style:{},classList:{contains:()=>false}};
    const send={getAttribute:key=>attributes.get(key)};
    let update;
    const root={MutationObserver:class{constructor(callback){update=callback}observe(){}}};
    const document={body,getElementById:id=>({'ai-chat-window':chat,'ai-chat-widget':widget,'chat-send-button':send})[id]};
    const source=fs.readFileSync('storefront-ui.js','utf8');
    vm.runInNewContext(source.slice(source.indexOf('    function protectChatFromPreviewReload()'),source.indexOf('    function init()'))+'protectChatFromPreviewReload();',{document,root});
    return {values,chat,widget,attributes,update:()=>update()};
}

test('preview file-change reloads are blocked during chat and while an image request is still running',()=>{
    const {values,chat,attributes,update}=previewFixture();
    assert.equal(values.has('data-server-no-reload'),false);
    chat.style.display='flex';update();
    assert.equal(values.get('data-server-no-reload'),'ai-chat');
    attributes.set('aria-busy','true');chat.style.display='none';update();
    assert.equal(values.has('data-server-no-reload'),true,'closing the chat cannot interrupt an in-flight upload');
    attributes.delete('aria-busy');update();
    assert.equal(values.has('data-server-no-reload'),false,'automatic preview updates resume after the conversation closes');
    chat.style.display='flex';update();attributes.set('aria-busy','true');update();
    attributes.delete('aria-busy');update();
    assert.equal(values.has('data-server-no-reload'),true,'success and error cleanup keep an open conversation protected');
});

test('chat protection preserves reload locks owned by other page features',()=>{
    const {values,chat,update}=previewFixture('another-feature');
    chat.style.display='flex';update();chat.style.display='none';update();
    assert.equal(values.get('data-server-no-reload'),'another-feature');
});
