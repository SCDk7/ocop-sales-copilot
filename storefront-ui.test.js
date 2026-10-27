'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {isCashflowText, stripFinancialLines, cleanReply} = require('./storefront-ui');
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
