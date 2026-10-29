'use strict';
const form = document.getElementById('draftForm');
const items = document.getElementById('items');
const status = document.getElementById('status');
const result = document.getElementById('result');
let products = [];
let key = window.OCOPCheckoutIntent.begin('draft');
let submitted = false;
let submitting = false;
let appliedVoucher = null;

const money = value => Number(value || 0).toLocaleString('vi-VN') + ' ₫';

function updateSummary() {
    let subtotal = 0;
    if (items) {
        for (const row of items.children) {
            const select = row.querySelector('select');
            const qtyInput = row.querySelector('input[type="number"]');
            if (!select || !qtyInput) continue;
            const pId = Number(select.value);
            const qty = Number(qtyInput.value) || 1;
            const p = products.find(x => x.productId === pId);
            if (p) subtotal += p.price * qty;
        }
    }

    const goodsEl = document.getElementById('order-goods-amount');
    if (goodsEl) goodsEl.textContent = money(subtotal);

    const discount = appliedVoucher ? appliedVoucher.discount : 0;
    const vRow = document.getElementById('draft-voucher-row');
    const vCode = document.getElementById('draft-applied-code');
    const vAmt = document.getElementById('draft-voucher-discount-amount');
    if (vRow && vCode && vAmt) {
        if (discount > 0) {
            vRow.style.display = 'flex';
            vCode.textContent = appliedVoucher.code;
            vAmt.textContent = '-' + money(discount);
        } else {
            vRow.style.display = 'none';
        }
    }

    const finalTotal = Math.max(0, subtotal - discount);
    const totalEl = document.getElementById('order-total-amount');
    if (totalEl) totalEl.textContent = money(finalTotal);
    updatePaymentPreview(finalTotal);
}

window.applyDraftVoucher = function() {
    const input = document.getElementById('draft-voucher-input');
    const statusEl = document.getElementById('draft-voucher-status');
    if (!input || !statusEl) return;
    const code = input.value.trim().toUpperCase();
    if (!code) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#dc2626';
        statusEl.textContent = salesPage.text('Vui lòng nhập mã voucher!', 'Please enter voucher code!');
        return;
    }

    const subtotal = Array.from(items.children).reduce((sum, row) => {
        const select = row.querySelector('select');
        const qty = row.querySelector('input');
        const p = products.find(x => x.productId === Number(select?.value));
        return sum + (p ? p.price * Math.max(1, Number(qty?.value) || 1) : 0);
    }, 0);

    // Ưu tiên kiểm tra qua Kho 99 Triệu Voucher OCOP
    if (typeof VoucherPool !== 'undefined' && typeof VoucherPool.validateVoucher === 'function') {
        const check = VoucherPool.validateVoucher(code, subtotal);
        if (check.valid) {
            appliedVoucher = { code: check.code, discount: check.discount };
            statusEl.style.display = 'block';
            statusEl.style.color = '#059669';
            statusEl.textContent = salesPage.text('✅ Đã áp dụng mã ' + check.code + ': ' + check.label, '✅ Applied code ' + check.code);
            updateSummary();
            return;
        } else if (check.error && check.error.includes('chỉ áp dụng')) {
            statusEl.style.display = 'block';
            statusEl.style.color = '#d97706';
            statusEl.textContent = check.error;
            return;
        }
    }

    const vouchers = {
        'OCOP2026': { discount: 50000, label: 'Giảm 50.000 ₫ (Tri ân OCOP 2026)' },
        'FREESHIP': { discount: 25000, label: 'Miễn phí vận chuyển (-25.000 ₫)' },
        'GIAM20K': { discount: 20000, label: 'Giảm 20.000 ₫' },
        'GIAM10K': { discount: 10000, label: 'Giảm 10.000 ₫' },
        'GIAM50K': { discount: 50000, label: 'Giảm 50.000 ₫' },
        'GIAM100K': { discount: 100000, minOrder: 500000, label: 'Giảm 100.000 ₫' },
        'OCOP50K': { discount: 50000, minOrder: 399000, label: 'Giảm 50.000 ₫' },
        'COMBOVIP': { discount: 100000, minOrder: 899000, label: 'Giảm 100.000 ₫ + Quà' }
    };
    const v = vouchers[code];
    if (!v) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#dc2626';
        statusEl.textContent = salesPage.text('Mã voucher không hợp lệ hoặc đã hết lượt!', 'Invalid voucher code!');
        return;
    }
    if (v.minOrder && subtotal < v.minOrder) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#d97706';
        statusEl.textContent = salesPage.text('Mã ' + code + ' chỉ áp dụng cho đơn từ ' + v.minOrder.toLocaleString('vi-VN') + ' ₫!', 'Order must be at least ' + v.minOrder);
        return;
    }
    appliedVoucher = { code: code, discount: v.discount };
    statusEl.style.display = 'block';
    statusEl.style.color = '#059669';
    statusEl.textContent = salesPage.text('✅ Đã áp dụng mã ' + code + ': ' + v.label, '✅ Applied code ' + code);
    updateSummary();
};

function addRow(initialId, initialQty = 1) {
    if (items.children.length >= 20) return;
    const row = document.createElement('div');
    row.className = 'row';

    const select = document.createElement('select');
    select.required = true;
    select.setAttribute('aria-label', salesPage.text('Sản phẩm', 'Product'));

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = salesPage.text('Chọn sản phẩm…', 'Choose a product…');
    placeholder.dataset.vi = 'Chọn sản phẩm…';
    placeholder.dataset.en = 'Choose a product…';
    select.append(placeholder);

    products.forEach(p => {
        const option = document.createElement('option');
        option.value = String(p.productId);
        option.textContent = p.name + ' · ' + money(p.price) + (p.unit ? ' / ' + p.unit : '');
        select.append(option);
    });

    if (initialId && products.some(p => p.productId === Number(initialId))) {
        select.value = String(initialId);
    }

    const qty = document.createElement('input');
    qty.type = 'number';
    qty.min = 1;
    qty.max = 999;
    const parsedQty = Number(initialQty);
    qty.value = Number.isInteger(parsedQty) && parsedQty > 0 && parsedQty <= 999 ? parsedQty : 1;
    qty.required = true;
    qty.setAttribute('aria-label', salesPage.text('Số lượng', 'Quantity'));

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.dataset.vi = 'Xóa';
    remove.dataset.en = 'Remove';
    remove.textContent = remove.dataset[salesPage.language] || 'Xóa';
    remove.onclick = () => {
        if (items.children.length > 1) {
            row.remove();
            changed();
            updateSummary();
        }
    };

    select.addEventListener('change', updateSummary);
    qty.addEventListener('input', updateSummary);

    row.append(select, qty, remove);
    items.append(row);
    updateSummary();
}

function changed() {
    if (submitted) {
        key = window.OCOPCheckoutIntent.reset('draft');
        submitted = false;
        result.hidden = true;
    }
    updateSummary();
}

form.addEventListener('input', changed);
form.addEventListener('change', changed);
document.getElementById('add').onclick = () => {
    addRow();
    changed();
};

let lastDraft;
let receiptAccess = '';
let trackingBusy = false;

function trackingURL(draft) {
    const url = new URL('draft-order.html', location.href);
    url.searchParams.set('order', draft.id);
    url.hash = '';
    return url.href;
}

function rememberDraft(draft) {
    try {
        const saved = JSON.parse(localStorage.getItem('ocop_customer_orders') || '[]');
        const rows = Array.isArray(saved) ? saved : [];
        const previous = rows.find(row => row.id === draft.id);
        const user = JSON.parse(localStorage.getItem('ocop_current_user') || 'null');
        const record = {...previous, ...draft, receiptToken: receiptAccess, username: previous?.username || user?.username || null};
        localStorage.setItem('ocop_customer_orders', JSON.stringify([record, ...rows.filter(row => row.id !== draft.id)]));
        window.dispatchEvent(new Event('ocop-orders-updated'));
    } catch (_) {}
}

function trackingView(draft) {
    form.hidden = true;
    document.getElementById('add').hidden = true;
    const heading = document.querySelector('h1');
    if (heading) {
        heading.dataset.vi = 'Theo dõi đơn hàng OCOP';
        heading.dataset.en = 'Track your OCOP order';
        heading.textContent = salesPage.text(heading.dataset.vi, heading.dataset.en);
    }
    const intro = document.querySelector('h1 + p');
    if (intro) {
        intro.dataset.vi = 'Đơn chỉ hoàn thành khi bạn xác nhận đã nhận hàng. Hãy giữ riêng liên kết theo dõi đơn này để xem lại trạng thái.';
        intro.dataset.en = 'Your order is completed only after you confirm receipt. Keep this tracking link private so you can check its status later.';
        intro.textContent = salesPage.text(intro.dataset.vi, intro.dataset.en);
    }
    if (draft && receiptAccess) history.replaceState(null, '', trackingURL(draft));
}

async function refreshDraft(id) {
    if (trackingBusy) return;
    trackingBusy = true;
    status.className = '';
    status.textContent = salesPage.text('Đang cập nhật trạng thái đơn…', 'Refreshing order status…');
    try {
        const response = await fetch(salesPage.api('/api/ai/draft-orders/' + encodeURIComponent(id)), {
            headers: {Authorization: 'Bearer ' + (window.OCOPAuth?.token()||'')}, cache: 'no-store'
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || salesPage.text('Không tải được đơn hàng.', 'Could not load this order.'));
        lastDraft = body.draft;
        rememberDraft(lastDraft);
        showDraft(lastDraft);
        status.textContent = salesPage.text('Đã cập nhật trạng thái đơn hàng.', 'Order status updated.');
    } catch (error) {
        status.className = 'error';
        status.textContent = error.message;
    } finally { trackingBusy = false; }
}

function orderActions(draft) {

    const actions = document.createElement('div');
    actions.className = 'order-tracking-actions';
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.textContent = salesPage.text('Cập nhật trạng thái', 'Refresh status');
    refresh.onclick = () => refreshDraft(draft.id);
    actions.append(refresh);
    if (draft.status === 'shipped' || draft.status === 'completed' && !draft.customerReceivedAt) {
        const receive = document.createElement('button');
        receive.type = 'button';
        receive.id = 'confirm-order-received';
        receive.className = 'primary';
        receive.textContent = salesPage.text('Tôi đã nhận hàng', 'I have received my order');
        receive.onclick = async () => {
            if (trackingBusy || !window.confirm(salesPage.text('Bạn xác nhận đã nhận đủ hàng? Chỉ xác nhận khi hàng đã được giao đến bạn.', 'Have you received your items? Confirm only after they have been delivered to you.'))) return;
            trackingBusy = true;
            receive.disabled = true;
            try {
                const response = await fetch(salesPage.api('/api/ai/draft-orders/' + encodeURIComponent(draft.id) + '/received'), {
                    method: 'POST', headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + (window.OCOPAuth?.token()||'')},
                    body: JSON.stringify({confirmed: true})
                });
                const body = await response.json();
                if (!response.ok) throw new Error(body.error || salesPage.text('Chưa xác nhận được nhận hàng.', 'Could not confirm receipt.'));
                lastDraft = body.draft;
                rememberDraft(lastDraft);
                showDraft(lastDraft);
                status.className = '';
                status.textContent = salesPage.text('Đã xác nhận nhận hàng. Đơn hàng hoàn thành!', 'Receipt confirmed. Your order is complete!');
            } catch (error) {
                status.className = 'error';
                status.textContent = error.message;
            } finally { trackingBusy = false; receive.disabled = false; }
        };
        actions.append(receive);
    }
    const link = document.createElement('a');
    link.href = trackingURL(draft);
    link.textContent = salesPage.text('Liên kết theo dõi đơn hàng (giữ riêng)', 'Private order tracking link');
    actions.append(link);
    result.append(actions);
}


function renderVietQRBox(draft, payAmount) {
    return window.OCOPDemoPayment?.render({document,method:draft.paymentMethod,amount:payAmount,orderId:draft.id,language:salesPage.language}) || null;
}
let paymentPreviewSignature='';
function updatePaymentPreview(amount) {
    const host=document.getElementById('checkout-payment-preview');
    if(!host || !window.OCOPDemoPayment)return;
    const method=form.querySelector('input[name="payment_method"]:checked')?.value || 'vietqr';
    const signature=[method,amount,salesPage.language].join(':');
    if(signature===paymentPreviewSignature)return;
    paymentPreviewSignature=signature;
    const card=window.OCOPDemoPayment.render({document,method,amount,language:salesPage.language});
    host.replaceChildren(...(card?[card]:[]));
}

function syncOrderSummary(draft) {
    try {
        const orders=JSON.parse(localStorage.getItem('ocop_online_orders')||'[]');
        if(!Array.isArray(orders)||!draft?.id)return;
        const index=orders.findIndex(order=>order.id===draft.id),previous=index<0?{}:orders[index];
        const customer=draft.customer||{};
        const row={...previous,id:draft.id,status:draft.status,lines:draft.lines||previous.lines||[],customerReceivedAt:draft.customerReceivedAt||previous.customerReceivedAt,
            customerName:customer.name||previous.customerName,customerPhone:customer.phone||previous.customerPhone,customerCode:customer.customerCode||previous.customerCode};
        if(index<0)orders.push(row);else orders[index]=row;
        localStorage.setItem('ocop_online_orders',JSON.stringify(orders));
    }catch(_){}
}
function showDraft(draft) {
    syncOrderSummary(draft);
    if (draft.status !== 'pending_seller_confirmation') {
        result.replaceChildren();
        result.hidden = false;
        const labels = {
            confirmed: ['Người bán đã xác nhận đơn', 'Seller confirmed the order'],
            shipped: ['Đang giao — chờ bạn xác nhận đã nhận hàng', 'In transit — awaiting your receipt confirmation'],
            completed: draft.customerReceivedAt ? ['Đơn hàng hoàn thành — bạn đã xác nhận nhận hàng', 'Order complete — you confirmed receipt'] : ['Chờ bạn xác nhận đã nhận hàng', 'Awaiting your receipt confirmation'],
            cancelled: ['Đơn đã hủy', 'Order cancelled']
        };
        const h = document.createElement('h2');
        h.textContent = salesPage.text(...(labels[draft.status] || ['Trạng thái đơn', 'Order status']));
        result.append(h);
        for (const value of [
            draft.id,
            ...draft.lines.map(l => l.name + ' × ' + l.quantity + ': ' + money(l.unitPrice * l.quantity)),
            salesPage.text('Tổng tiền theo đơn: ', 'Order total: ') + (draft.total == null ? '—' : money(draft.total)),
            draft.paymentMethod ? salesPage.text('Hình thức thanh toán: ', 'Payment method: ') + draft.paymentMethod : '',
            salesPage.text(draft.paymentStatus === 'paid' ? 'Người bán đã xác nhận thu tiền.' : 'Chưa có xác nhận đã thu tiền.', draft.paymentStatus === 'paid' ? 'Payment receipt confirmed by seller.' : 'Payment receipt is not confirmed.'),
            draft.trackingNumber ? salesPage.text('Thông tin giao hàng: ', 'Shipping reference: ') + draft.trackingNumber : ''
        ]) {
            if (!value) continue;
            const p = document.createElement('p');
            p.textContent = value;
            result.append(p);
        }
        if(draft.paymentStatus!=='paid'&&['confirmed','shipped'].includes(draft.status)&&draft.total>0){
            const card=renderVietQRBox(draft,draft.total);if(card)result.append(card);
        }
        orderActions(draft);
        return;
    }

    result.replaceChildren();
    result.hidden = false;
    const heading = document.createElement('h2');
    heading.textContent = salesPage.text('Đã tiếp nhận đơn hàng — chờ người bán xác nhận', 'Order received — awaiting seller confirmation');
    result.append(heading);

    const id = document.createElement('p');
    id.className = 'facts';
    id.textContent = 'Mã đơn hàng: ' + draft.id;
    result.append(id);

    draft.lines.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line.name + ' × ' + line.quantity + ': ' + money(line.unitPrice * line.quantity);
        result.append(p);
    });

    const vMap = { 'OCOP2026': 50000, 'FREESHIP': 25000, 'GIAM20K': 20000, 'GIAM10K': 10000, 'GIAM50K': 50000, 'GIAM100K': 100000, 'OCOP50K': 50000, 'COMBOVIP': 100000 };
    let discAmt = 0;
    if (typeof appliedVoucher !== 'undefined' && appliedVoucher && appliedVoucher.discount) {
        discAmt = appliedVoucher.discount;
    } else if (typeof VoucherPool !== 'undefined' && typeof VoucherPool.validateVoucher === 'function' && draft.voucherCode) {
        const check = VoucherPool.validateVoucher(draft.voucherCode, draft.subtotal);
        if (check && check.valid) discAmt = check.discount;
    }
    if (!discAmt && draft.voucherCode && vMap[draft.voucherCode]) {
        discAmt = vMap[draft.voucherCode];
    }

    if (draft.voucherCode) {
        const discP = document.createElement('p');
        const discText = discAmt > 0 ? ' (-' + money(discAmt) + ')' : '';
        discP.textContent = salesPage.text('Mã ưu đãi áp dụng: ', 'Applied voucher: ') + draft.voucherCode + discText + salesPage.text(' (Đã áp dụng trực tiếp)', ' (Applied directly)');
        discP.style.color = '#059669';
        discP.style.fontWeight = 'bold';
        result.append(discP);
    }

    const payAmount = draft.total != null ? draft.total : Math.max(0, draft.subtotal - discAmt);
    const total = document.createElement('p');
    total.textContent = salesPage.text('Tiền hàng tạm tính: ', 'Product subtotal: ') + money(draft.subtotal);
    result.append(total);

    if (discAmt > 0) {
        const discRow = document.createElement('p');
        discRow.textContent = salesPage.text('Giảm giá ưu đãi: -', 'Voucher discount: -') + money(discAmt);
        discRow.style.color = '#059669';
        discRow.style.fontWeight = 'bold';
        result.append(discRow);

        const finalTotal = document.createElement('p');
        finalTotal.textContent = salesPage.text('Tổng thanh toán: ', 'Total payment: ') + money(payAmount);
        finalTotal.style.color = '#047857';
        finalTotal.style.fontWeight = '900';
        finalTotal.style.fontSize = '16px';
        result.append(finalTotal);
    }

    if (draft.paymentMethod) {
        const payP = document.createElement('p');
        payP.textContent = salesPage.text('Hình thức thanh toán: ', 'Payment method: ') + draft.paymentMethod;
        payP.style.fontWeight = 'bold';
        result.append(payP);

        const qrCard = renderVietQRBox(draft, payAmount);
        if (qrCard) result.append(qrCard);
    }

    const note = document.createElement('p');
    note.className = 'detail';
    note.textContent = salesPage.text(
        'Hệ thống đã lưu yêu cầu đặt hàng. Người bán cần xác nhận tồn kho, phí giao hàng và xử lý đơn. Đơn chỉ hoàn thành sau khi bạn nhận hàng và bấm “Tôi đã nhận hàng”.',
        'Your order request is saved. The seller still needs to confirm stock, shipping and process the order. It is completed only after you receive the items and click “I have received my order”.'
    );
    result.append(note);
    orderActions(draft);
}

document.addEventListener('sales-language', () => {
    if (lastDraft) showDraft(lastDraft);
    updateSummary();
});

form.onsubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    submitting = true;
    const submit = document.getElementById('submit');
    submit.disabled = true;
    const submitLabel = submit.textContent;
    submit.textContent = salesPage.text('Đang xử lý…', 'Processing…');
    status.className = '';
    status.textContent = salesPage.text('Đang xác nhận và gửi đơn hàng…', 'Submitting your order…');

    const data = new FormData(form);
    const lines = [...items.children].map(row => ({
        productId: Number(row.querySelector('select').value),
        quantity: Number(row.querySelector('input').value)
    })).filter(l => l.productId && l.quantity > 0);

    if (!lines.length) {
        status.className = 'error';
        status.textContent = salesPage.text('Vui lòng chọn ít nhất một sản phẩm!', 'Please choose at least one product!');
        submit.textContent = submitLabel;
        submit.disabled = false;
        submitting = false;
        return;
    }

    const payMethodVal = data.get('payment_method');
    const paymentMethodLabel = payMethodVal === 'vietqr' ? 'BIDV / VietQR' : (payMethodVal === 'momo' ? 'Ví MoMo (mô phỏng)' : 'Ship COD Tận Nơi');
    try {
        await window.accountReady;
        const payload = {
                sessionId: (() => { try { return sessionStorage.getItem("ocop-consultation-session"); } catch { return null; } })(),
                confirmed: data.get('confirmed') === 'on',
                items: lines,
                customer: {
                    name: data.get('name'),
                    phone: data.get('phone'),
                    address: data.get('address'),
                    paymentMethod: paymentMethodLabel,
                    voucherCode: appliedVoucher ? appliedVoucher.code : ''
                }
        };
        key = await window.OCOPCheckoutIntent.bind('draft', {user:window.currentUser?.id||null,payload});
        // Keep older backend instances usable during a rolling frontend rollout.
        // The updated backend still requires and trusts the header, not this field.
        payload.idempotencyKey = key;
        const response = await fetch(salesPage.api('/api/ai/draft-orders'), {
            method: 'POST',
            signal: AbortSignal.timeout(20000),
            headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, Authorization:'Bearer '+(window.OCOPAuth?.token()||'') },
            body: JSON.stringify(payload)
        });
        const body = await response.json();
        if (!response.ok) throw new Error(salesPage.text(body.error || 'Không gửi được đơn hàng.', response.status === 409 ? 'Inventory is insufficient or this request was changed.' : 'Please check the recipient, phone, address and quantities, then retry.'));
        lastDraft = body.draft;
        window.OCOPCheckoutIntent.finish('draft');
        receiptAccess = lastDraft.receiptToken || '';
        submitted = true;
        rememberDraft(lastDraft);
        trackingView(lastDraft);
        showDraft(lastDraft);
        status.textContent = lastDraft.status === 'pending_seller_confirmation'
            ? salesPage.text('Đã tiếp nhận đơn hàng. Đang chờ người bán xác nhận.', 'Order received. Awaiting seller confirmation.')
            : salesPage.text('Đã cập nhật trạng thái đơn hàng.', 'Order status refreshed.');
        try { localStorage.removeItem('ocop_cart');window.OCOPCustomerSession?.clearCart(); } catch (_) {}
    } catch (error) {
        status.className = 'error';
        status.textContent = salesPage.text('Chưa nhận được xác nhận đơn hàng. Giỏ hàng vẫn được giữ; hãy thử lại để kiểm tra cùng yêu cầu. ', 'Order confirmation was not received. Your cart is preserved; retry to check the same request. ') + error.message;
    } finally {
        submit.textContent = submitLabel;
        submit.disabled = false;
        submitting = false;
    }
};

(async () => {
    const trackingId = new URLSearchParams(location.search).get('order');
    if (trackingId) {
        receiptAccess = window.OCOPAuth?.token() || '';
        trackingView();
        await refreshDraft(trackingId);
        return;
    }
    // 1. Initial product population: sync from window.PRODUCTS first (instant, 0ms latency)
    if (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS) && window.PRODUCTS.length) {
        products = window.PRODUCTS.map(p => ({ productId: p.id, name: p.name, price: p.price, unit: p.packaging || 'hộp' }));
    }

    // 2. Fetch fresh catalog from API if server is reachable
    try {
        const response = await fetch(salesPage.api('/api/ai/shop-products'));
        if (response.ok) {
            const body = await response.json();
            if (Array.isArray(body.products) && body.products.length) products = body.products;
        }
    } catch (_) {}

    // 3. Fallback to window.PRODUCTS again if still empty
    if (!products.length && typeof window !== 'undefined' && Array.isArray(window.PRODUCTS) && window.PRODUCTS.length) {
        products = window.PRODUCTS.map(p => ({ productId: p.id, name: p.name, price: p.price, unit: p.packaging || 'hộp' }));
    }

    if (products.length) {
        const params = new URLSearchParams(location.search);
        let ids = (params.get('products') || '').split(',').filter(Boolean).slice(0, 20);
        let quantities = (params.get('quantities') || '').split(',');

        // If URL has no products, auto-retrieve from localStorage cart
        if (!ids.length) {
            try {
                const savedCart = JSON.parse(localStorage.getItem('ocop_cart') || '[]');
                if (Array.isArray(savedCart) && savedCart.length) {
                    ids = savedCart.map(item => String(item.id));
                    quantities = savedCart.map(item => String(item.quantity || item.qty || 1));
                }
            } catch (_) {}
        }

        items.replaceChildren();
        if (ids.length) {
            ids.forEach((id, index) => addRow(id, quantities[index] || 1));
        } else {
            addRow();
        }

        // Pre-fill recipient credentials if customer is logged in
        try {
            const rawUser = localStorage.getItem('ocop_current_user');
            if (rawUser) {
                const user = JSON.parse(rawUser);
                const nameField = form.querySelector('input[name="name"]');
                const phoneField = form.querySelector('input[name="phone"]');
                const addrField = form.querySelector('textarea[name="address"]');
                if (nameField && !nameField.value && user.fullName) nameField.value = user.fullName;
                if (phoneField && !phoneField.value && user.phone) phoneField.value = user.phone;
                if (addrField && !addrField.value && user.address) addrField.value = user.address;
            }
        } catch (_) {}

        document.getElementById('submit').disabled = false;
        updateSummary();
    } else {
        status.textContent = salesPage.text('Chưa tải được danh mục từ backend.', 'Could not load the backend catalogue.');
    }
})();
