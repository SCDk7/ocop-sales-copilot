// Shared cart: the current catalogue and CartManager are the only data sources.
(function(root) {
    'use strict';
    function checkoutURL(lines) {
        const params=new URLSearchParams({products:lines.map(p=>p.id).join(','),quantities:lines.map(p=>p.quantity).join(',')});
        return 'draft-order.html?'+params;
    }
    if(typeof module==='object'&&module.exports){module.exports={checkoutURL};return;}
    if(root.OCOPCartUI)return;
    root.OCOPCartUI={ready:false};
    let manager,panel,overlay,previousFocus,previousOverflow,opened=false;
    const selected=new Set();let knownIds=new Set();
    const catalogue=()=>root.PRODUCTS||[];
    const money=n=>n.toLocaleString('vi-VN')+' ₫';
    const translations={
      'Your cart':['购物车','장바구니','カート'], 'Close cart':['关闭购物车','장바구니 닫기','カートを閉じる'],
      'Your cart is empty. Add your favourite OCOP products.':['购物车为空，请添加喜欢的 OCOP 商品。','장바구니가 비어 있습니다. OCOP 상품을 추가해 주세요.','カートは空です。OCOP商品を追加してください。'],
      'Select all':['全选','전체 선택','すべて選択'],'Remove selected':['删除所选','선택 삭제','選択を削除'],
      'Product':['商品','상품','商品'],'Unit price':['单价','단가','単価'],'Quantity':['数量','수량','数量'],
      'Subtotal':['小计','소계','小計'],'Action':['操作','작업','操作'],'Product total':['商品总额','상품 합계','商品合計'],
      'Continue to order':['前往下单','주문하기','注文へ進む'],'Continue shopping':['继续购物','계속 쇼핑','買い物を続ける'],
      'items':['件商品','개 상품','点'],'selected items':['件已选商品','개 선택 상품','点を選択中'],
      'Select ':['选择 ','선택 ','選択 '],'Decrease quantity':['减少数量','수량 줄이기','数量を減らす'],
      'Increase quantity':['增加数量','수량 늘리기','数量を増やす'],'Quantity ':['数量 ','수량 ','数量 '],
      'Remove':['删除','삭제','削除'],'Added to your cart.':['已加入购物车。','장바구니에 추가했습니다.','カートに追加しました。'],
      'Each request supports up to 20 different products. Please split your basket.':['每单最多20种商品，请分单。','한 주문에 최대 20종의 상품을 담을 수 있습니다.','1回の注文は20種類までです。分けて注文してください。'],
      'Estimated delivery: 1–2 business days within the dispatch city centre, 2–5 business days in outlying areas, starting at carrier handover. Interprovincial, remote-area and holiday deliveries may take longer. The seller confirms timing for your address, shipping fees, inventory and final pricing before confirming your order.':[
        '预计配送：交给承运商后，发货地市区1–2个工作日，郊区2–5个工作日。跨省、偏远地区或节假日可能更久。卖家会确认收货地址对应的时效、运费、库存及最终价格。',
        '예상 배송: 배송업체 인계 후 발송지 도심 1–2영업일, 외곽 2–5영업일입니다. 타 지역, 도서 산간 및 공휴일에는 더 걸릴 수 있습니다. 판매자가 주소별 배송일, 배송비, 재고와 최종 가격을 확인합니다.',
        '配送目安：配送業者への引き渡し後、発送地の市街地は1～2営業日、郊外は2～5営業日です。他省・遠隔地・祝日はさらに日数がかかる場合があります。販売者がお届け先に応じた日数、送料、在庫、最終価格を確認します。'
      ]
    };
    const text=(vi,en)=>{const lang=document.documentElement.lang.split('-')[0];return lang==='vi'?vi:translations[en]?.[['zh','ko','ja'].indexOf(lang)]||en;};
    const labels=[];
    function bind(node,vi,en){labels.push(()=>{node.textContent=text(vi,en);});return node;}
    function el(tag,cls,content){const node=document.createElement(tag);node.className=cls||'';if(content!==undefined)node.textContent=content;return node;}
    function btn(label,action,id){const node=el('button','cart-ui-button',label);node.type='button';node.dataset.action=action;if(id!==undefined)node.dataset.productId=String(id);return node;}
    function lines(){return manager?manager.hydrate(catalogue()):[];}
    function selectedLines(){return lines().filter(product=>selected.has(product.id));}
    function render(){
        if(!panel)return;
        labels.forEach(update=>update());
        const closeButton=panel.querySelector('#cart-ui-close-btn');
        closeButton.setAttribute('aria-label',text('Đóng giỏ hàng','Close cart'));closeButton.setAttribute('title',text('Đóng giỏ hàng','Close cart'));
        const rows=lines(),count=rows.reduce((s,p)=>s+p.quantity,0);
        const ids=new Set(rows.map(product=>product.id));
        for(const product of rows)if(!knownIds.has(product.id))selected.add(product.id);
        for(const id of selected)if(!ids.has(id))selected.delete(id);
        knownIds=ids;
        for(const id of ['cart-count','cart-count-badge','intro-cart-count','header-cart-count']){const node=document.getElementById(id);if(node)node.textContent=String(count);}
        panel.querySelector('#cart-ui-item-count').textContent=count+' '+text('sản phẩm','items');
        const list=panel.querySelector('#cart-ui-product-list');list.replaceChildren();
        panel.querySelector('#cart-ui-empty').hidden=rows.length>0;
        panel.querySelector('#cart-ui-totals').hidden=!rows.length;
        panel.querySelector('#cart-ui-selection').hidden=!rows.length;
        panel.querySelector('#cart-ui-columns').hidden=!rows.length;
        const selectAll=panel.querySelector('#cart-ui-select-all');
        selectAll.checked=rows.length>0&&selected.size===rows.length;
        selectAll.indeterminate=selected.size>0&&selected.size<rows.length;
        panel.querySelector('#cart-ui-remove-selected').disabled=!selected.size;
        for(const p of rows){
            const card=el('article','cart-product-card'),image=el('img','cart-ui-product-image'),body=el('div','cart-ui-product-body');
            card.dataset.productId=String(p.id);
            const choose=el('input','cart-ui-checkbox');choose.type='checkbox';choose.checked=selected.has(p.id);choose.dataset.action='select';choose.dataset.productId=String(p.id);choose.setAttribute('aria-label',text('Chọn ','Select ')+p.name);
            if(/^(?:images\/|\/images\/|https:\/\/)/i.test(p.img||''))image.src=p.img;
            image.alt='';image.loading='lazy';image.addEventListener('error',()=>{image.hidden=true;},{once:true});
            const title=btn(typeof root.getProductName==='function'?root.getProductName(p):p.name,'view',p.id);title.className='cart-ui-product-title';
            const meta=el('p','cart-ui-product-meta',[p.region,Number.isInteger(p.stars)?`OCOP ${p.stars} ★`:''].filter(Boolean).join(' • '));
            const price=el('p','cart-product-price',money(p.price)+(p.packaging?' / '+p.packaging:''));price.dataset.label=text('Đơn giá','Unit price');
            const controls=el('div','cart-ui-quantity'),minus=btn('−','minus',p.id),plus=btn('+','plus',p.id);
            minus.setAttribute('aria-label',text('Giảm số lượng','Decrease quantity'));minus.disabled=p.quantity<=1;
            plus.setAttribute('aria-label',text('Tăng số lượng','Increase quantity'));plus.disabled=p.quantity>=99;
            const qty=el('input','cart-qty-num');qty.type='number';qty.min='1';qty.max='99';qty.value=String(p.quantity);qty.dataset.action='quantity';qty.dataset.productId=String(p.id);qty.setAttribute('aria-label',text('Số lượng ','Quantity ')+p.name);
            controls.append(minus,qty,plus);
            const remove=btn(text('Xóa','Remove'),'remove',p.id);remove.classList.add('cart-remove-btn');
            const product=el('div','cart-ui-product');body.append(title,meta);product.append(image,body);
            const total=el('p','cart-product-total',money(p.price*p.quantity));total.dataset.label=text('Thành tiền','Subtotal');
            card.append(choose,product,price,controls,total,remove);list.append(card);
        }
        const chosen=rows.filter(product=>selected.has(product.id));
        const subtotal=chosen.reduce((s,p)=>s+p.price*p.quantity,0);
        panel.querySelector('#cart-ui-subtotal').textContent=money(subtotal);
        panel.querySelector('#cart-ui-total').textContent=money(subtotal);
        panel.querySelector('#cart-ui-selected-count').textContent=chosen.reduce((sum,p)=>sum+p.quantity,0)+' '+text('sản phẩm đã chọn','selected items');
        panel.querySelector('#cart-ui-checkout-btn').disabled=!chosen.length||chosen.length>20;
        panel.querySelector('#cart-ui-checkout-note').textContent=chosen.length>20
            ?text('Mỗi yêu cầu tối đa 20 sản phẩm khác nhau. Vui lòng chia giỏ hàng.','Each request supports up to 20 different products. Please split your basket.')
            :text('Giao hàng dự kiến: nội thành 1–2 ngày làm việc, ngoại thành 2–5 ngày làm việc kể từ khi bàn giao đơn vị vận chuyển, theo khu vực của điểm gửi. Đơn liên tỉnh, vùng xa hoặc lễ Tết có thể lâu hơn. Người bán sẽ xác nhận thời gian theo địa chỉ, phí giao hàng, tồn kho và giá cuối cùng trước khi chốt đơn.','Estimated delivery: 1–2 business days within the dispatch city centre, 2–5 business days in outlying areas, starting at carrier handover. Interprovincial, remote-area and holiday deliveries may take longer. The seller confirms timing for your address, shipping fees, inventory and final pricing before confirming your order.');
    }
    function close(){if(!opened||!panel)return;opened=false;panel.classList.remove('cart-ui-panel-open');panel.inert=true;panel.setAttribute('aria-hidden','true');overlay.hidden=true;document.body.style.overflow=previousOverflow;if(previousFocus?.isConnected)previousFocus.focus();}
    function open(){if(!panel)return;if(!opened){previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;}try{if(manager.storage){const saved=JSON.parse(manager.storage.getItem('ocop_cart')||'[]');if(Array.isArray(saved))manager.cart=saved;}}catch(_){}opened=true;render();panel.inert=false;panel.setAttribute('aria-hidden','false');overlay.hidden=false;panel.classList.add('cart-ui-panel-open');document.body.style.overflow='hidden';panel.querySelector('[data-action="close"]').focus();}
    function add(id){const p=catalogue().find(p=>p.id===Number(id));if(!p)return;lines();manager.addToCart(p,1);selected.add(p.id);render();root.showToast?.(text('Đã thêm vào giỏ hàng.','Added to your cart.'),'success');return p;}
    function addProduct(idOrName){if(!String(idOrName??'').trim())return null;const product=typeof idOrName==='number'?catalogue().find(p=>p.id===idOrName):catalogue().find(p=>p.name.toLowerCase().includes(String(idOrName).trim().toLowerCase()));return product?add(product.id):null;}
    function quantity(id,delta){const p=lines().find(p=>p.id===Number(id));if(!p||!Number.isInteger(delta))return;p.quantity=Math.max(1,Math.min(99,p.quantity+delta));manager.save();render();}
    function remove(id){manager.removeFromCart(Number(id));render();}
    function checkout(){
        let rows = selectedLines();
        if (!rows || !rows.length) {
            if (typeof root.showToast === 'function') root.showToast('Vui lòng chọn ít nhất 1 sản phẩm để mua hàng!', 'info');
            else if (typeof alert === 'function') alert('Vui lòng chọn ít nhất 1 sản phẩm để mua hàng!');
            return;
        }
        if (rows.length > 20) {
            if (typeof root.showToast === 'function') root.showToast('Mỗi yêu cầu tối đa 20 sản phẩm.', 'info');
            return;
        }
        manager?.save?.();
        const dest = new URL(checkoutURL(rows), document.baseURI).href;
        try {
            root.location.assign(dest);
        } catch (_) {
            root.location.href = dest;
        }
    }
    function init(){
        if(root.OCOPCartUI.ready||typeof root.CartManager!=='function')return;
        manager=new root.CartManager();
        if(!manager.cart.length){try{if(typeof cart!=='undefined'&&Array.isArray(cart))manager.cart=cart;}catch(_){}}
        manager.hydrate(catalogue());manager.save();
        for(const id of ['cart-drawer','shopping-cart-drawer']){const old=document.getElementById(id);if(old){old.hidden=true;old.style.setProperty('display','none','important');}}
        overlay=el('div','cart-ui-overlay');overlay.id='cart-ui-overlay';overlay.hidden=true;overlay.addEventListener('click',close);
        panel=el('div','cart-ui-panel');panel.id='cart-ui-panel';panel.inert=true;
        for(const [key,value]of Object.entries({role:'dialog','aria-modal':'true','aria-hidden':'true','aria-labelledby':'cart-ui-title'}))panel.setAttribute(key,value);
        const header=el('header','cart-ui-header'),heading=el('div'),title=bind(el('h2'),'Giỏ hàng của bạn','Your cart'),count=el('p');
        title.id='cart-ui-title';count.id='cart-ui-item-count';heading.append(title,count);
        const closeButton=btn('','close');closeButton.id='cart-ui-close-btn';
        const closeIcon=el('span','cart-ui-close-icon','×');closeIcon.setAttribute('aria-hidden','true');
        closeIcon.setAttribute('translate','no');closeButton.append(closeIcon);
        closeButton.setAttribute('aria-label',text('Đóng giỏ hàng','Close cart'));
        closeButton.setAttribute('title',text('Đóng giỏ hàng','Close cart'));
        header.append(heading,closeButton);
        const content=el('div','cart-ui-items'),empty=bind(el('div','cart-ui-empty'),'Giỏ hàng đang trống. Hãy thêm đặc sản OCOP bạn yêu thích.','Your cart is empty. Add your favourite OCOP products.'),list=el('div');
        content.id='cart-ui-items';empty.id='cart-ui-empty';list.id='cart-ui-product-list';
        const selection=el('div','cart-ui-selection');selection.id='cart-ui-selection';
        const allLabel=el('label','cart-ui-select-all-label'),all=el('input','cart-ui-checkbox');all.id='cart-ui-select-all';all.type='checkbox';all.dataset.action='select-all';allLabel.append(all,bind(el('span'),'Chọn tất cả','Select all'));
        const removeSelected=bind(btn('','remove-selected'),'Xóa đã chọn','Remove selected');removeSelected.id='cart-ui-remove-selected';selection.append(allLabel,removeSelected);
        const columns=el('div','cart-ui-columns');columns.id='cart-ui-columns';columns.setAttribute('aria-hidden','true');
        for(const [vi,en] of [['',''],['Sản phẩm','Product'],['Đơn giá','Unit price'],['Số lượng','Quantity'],['Thành tiền','Subtotal'],['Thao tác','Action']])columns.append(bind(el('span'),vi,en));
        content.append(selection,columns,empty,list);
        const totals=el('footer','cart-ui-totals');totals.id='cart-ui-totals';
        const sub=el('p','cart-ui-total-row'),subAmount=el('strong');subAmount.id='cart-ui-subtotal';sub.append(bind(el('span'),'Tạm tính','Subtotal'),subAmount);
        const total=el('p','cart-ui-total-row cart-ui-total'),amount=el('strong');amount.id='cart-ui-total';total.append(bind(el('span'),'Tổng tiền hàng','Product total'),amount);
        const selectedCount=el('p','cart-ui-selected-count');selectedCount.id='cart-ui-selected-count';
        const note=el('p','cart-ui-note');note.id='cart-ui-checkout-note';
        const actions=el('div','cart-ui-actions'),order=bind(btn('','checkout'),'Mua hàng','Continue to order');order.id='cart-ui-checkout-btn';order.classList.add('cart-ui-primary');order.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}checkout();};
        const summary=el('div','cart-ui-summary');summary.append(sub,total,selectedCount,note);actions.append(order,bind(btn('','close'),'Tiếp tục mua sắm','Continue shopping'));totals.append(summary,actions);panel.append(header,content,totals);document.body.append(overlay,panel);
        function handleCartWheel(event){
            if(event.defaultPrevented||event._cartScrolled)return;
            const scrollTarget=content||panel.querySelector('.cart-ui-items, #cart-ui-items');
            if(scrollTarget&&event.deltaY!==0){
                scrollTarget.scrollBy({top:event.deltaY*1.35,behavior:'auto'});
                if(event.cancelable)event.preventDefault();
                event._cartScrolled=true;
            }
        }
        panel.addEventListener('wheel',handleCartWheel,{passive:false});
        overlay.addEventListener('wheel',handleCartWheel,{passive:false});
        panel.addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button)return;const id=Number(button.dataset.productId);switch(button.dataset.action){case'close':close();break;case'plus':quantity(id,1);break;case'minus':quantity(id,-1);break;case'remove':remove(id);break;case'remove-selected':manager.cart=lines().filter(product=>!selected.has(product.id));manager.save();render();break;case'checkout':checkout();break;case'view':close();root.openQuickView?.(id);break;}});
        panel.addEventListener('change',event=>{const input=event.target,id=Number(input.dataset.productId);if(input.dataset.action==='select'){if(input.checked)selected.add(id);else selected.delete(id);render();}else if(input.dataset.action==='select-all'){selected.clear();if(input.checked)for(const product of lines())selected.add(product.id);render();}else if(input.dataset.action==='quantity'){const product=lines().find(product=>product.id===id),value=Number(input.value);if(product&&Number.isInteger(value)&&value>=1&&value<=99){product.quantity=value;manager.save();}render();}});
        document.addEventListener('keydown',event=>{if(!opened)return;if(event.key==='Escape'){event.preventDefault();close();}if(event.key==='Tab'){const nodes=[...panel.querySelectorAll('button:not(:disabled),input:not(:disabled)')].filter(n=>n.getClientRects().length),first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}});
        root.addEventListener('storage',event=>{if(event.key==='ocop_cart'){manager=new root.CartManager();render();}});
        root.addEventListener('ocop-customer-scope-change',()=>{
            manager=new root.CartManager();knownIds=new Set();selected.clear();
            try {if(typeof cart!=='undefined')cart=manager.cart;}catch(_){}
            render();
        });
        Object.assign(root,{openCartUI:open,closeCartUI:close,renderCartUIItems:render,changeCartUIQty:quantity,removeFromCartUI:remove,proceedCheckoutFromCart:checkout,
            checkout,openOnlineOrderModal:id=>{const product=catalogue().find(p=>p.id===Number(id));if(!product)return;const dest=new URL(checkoutURL([{...product,quantity:1}]),document.baseURI).href;root.location.assign(dest);},
            handleBuyNow:id=>root.openOnlineOrderModal(id),
            addToCart:add,addProductToCart:addProduct,activateProductReconciliation:add,removeFromCart:remove,updateCartQty:quantity,renderCartItems:render,updateCartBadge:render,
            getCartTotal:()=>lines().reduce((s,p)=>s+p.price*p.quantity,0),toggleCart:force=>{if(force===false||(force===undefined&&opened))close();else open();},
            addProductsToCart:ids=>{for(const id of new Set(ids))add(id);open();},isCartUIOpen:()=>opened});
        root.OCOPCartUI.ready=true;root.OCOPCartUI.lines=lines;root.OCOPCartUI.selectedLines=selectedLines;render();
        if(typeof root.MutationObserver==='function')new root.MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof window!=='undefined'?window:globalThis);
