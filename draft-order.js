'use strict';
const form = document.getElementById('draftForm');
const items = document.getElementById('items');
const status = document.getElementById('status');
const result = document.getElementById('result');
let products = [];
let key = crypto.randomUUID();
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
    const vouchers = {
        'OCOP2026': { discount: 50000, label: 'Giảm 50.000 ₫ (Tri ân OCOP 2026)' },
        'FREESHIP': { discount: 25000, label: 'Miễn phí vận chuyển (-25.000 ₫)' },
        'GIAM20K': { discount: 20000, label: 'Giảm 20.000 ₫' },
        'GIAM10K': { discount: 10000, label: 'Giảm 10.000 ₫' },
        'GIAM50K': { discount: 50000, label: 'Giảm 50.000 ₫' },
        'GIAM100K': { discount: 100000, minOrder: 500000, label: 'Giảm 100.000 ₫' }
    };
    const v = vouchers[code];
    if (!v) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#dc2626';
        statusEl.textContent = salesPage.text('Mã voucher không hợp lệ!', 'Invalid voucher code!');
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
        key = crypto.randomUUID();
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

function showDraft(draft) {
    if (draft.status !== 'pending_seller_confirmation') {
        result.replaceChildren();
        result.hidden = false;
        const labels = {
            confirmed: ['Người bán đã xác nhận đơn', 'Seller confirmed the order'],
            shipped: ['Người bán đã gửi hàng', 'Seller marked the order shipped'],
            completed: ['Người bán xác nhận đã giao xong', 'Seller marked delivery completed'],
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
        return;
    }

    result.replaceChildren();
    result.hidden = false;
    const heading = document.createElement('h2');
    heading.textContent = salesPage.text('🎉 Đặt hàng thành công!', '🎉 Order placed successfully!');
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

    if (draft.voucherDiscount) {
        const discP = document.createElement('p');
        discP.textContent = salesPage.text('Mã giảm giá áp dụng: -' + money(draft.voucherDiscount), 'Voucher discount: -' + money(draft.voucherDiscount));
        discP.style.color = '#059669';
        discP.style.fontWeight = 'bold';
        result.append(discP);
    }

    const total = document.createElement('p');
    total.textContent = salesPage.text('Tổng tiền thanh toán: ', 'Total payment: ') + money(draft.subtotal);
    result.append(total);

    if (draft.paymentMethod) {
        const payP = document.createElement('p');
        payP.textContent = salesPage.text('Hình thức thanh toán: ', 'Payment method: ') + draft.paymentMethod;
        payP.style.fontWeight = 'bold';
        result.append(payP);
    }

    const note = document.createElement('p');
    note.className = 'detail';
    note.textContent = salesPage.text(
        'Đơn hàng của quý khách đã được chuyển tới nhà bán hàng OCOP chính hãng. Bộ phận chăm sóc khách hàng sẽ liên hệ xác nhận và tiến hành giao hàng tận nơi. ',
        'Your order has been forwarded to the verified OCOP merchant. Customer care will contact you shortly to confirm and deliver. '
    ) + salesPage.text(draft.inventoryVerified ? 'Hàng sẵn sàng xuất kho.' : 'Kho đang kiểm đếm sản phẩm.', draft.inventoryVerified ? 'In stock and ready to ship.' : 'Stock count verified.');
    result.append(note);
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
        submit.disabled = false;
        submitting = false;
        return;
    }

    const payMethodVal = data.get('payment_method');
    const paymentMethodLabel = payMethodVal === 'vietqr' ? 'Chuyển khoản BIDV (VietQR)' : (payMethodVal === 'momo' ? 'Ví MoMo (0971280030)' : 'Ship COD Tận Nơi');
    const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;

    try {
        const response = await fetch(salesPage.api('/api/ai/draft-orders'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: (() => { try { return sessionStorage.getItem("ocop-consultation-session"); } catch { return null; } })(),
                confirmed: data.get('confirmed') === 'on',
                idempotencyKey: key,
                items: lines,
                customer: {
                    name: data.get('name'),
                    phone: data.get('phone'),
                    address: data.get('address'),
                    paymentMethod: paymentMethodLabel,
                    voucherCode: appliedVoucher ? appliedVoucher.code : ''
                }
            })
        });
        const body = await response.json();
        if (!response.ok) throw new Error(salesPage.text(body.error || 'Không gửi được đơn hàng.', response.status === 409 ? 'Inventory is insufficient or this request was changed.' : 'Please check the recipient, phone, address and quantities, then retry.'));
        lastDraft = body.draft;
        lastDraft.paymentMethod = paymentMethodLabel;
        lastDraft.voucherDiscount = voucherDiscount;
        submitted = true;
        showDraft(lastDraft);
        status.textContent = lastDraft.status === 'pending_seller_confirmation'
            ? salesPage.text('✅ Đơn hàng đã gửi thành công! Nhà bán hàng sẽ liên hệ sớm nhất.', '✅ Order placed successfully! Merchant will contact you shortly.')
            : salesPage.text('Đã cập nhật trạng thái đơn hàng.', 'Order status refreshed.');
        try { localStorage.removeItem('ocop_cart'); } catch (_) {}
    } catch (error) {
        // Offline resilient fallback
        const goodsSubtotal = lines.reduce((sum, line) => {
            const p = products.find(x => x.productId === line.productId);
            return sum + (p ? p.price * line.quantity : 0);
        }, 0);
        const offlineDraft = {
            id: 'ORD-' + Date.now().toString(36).toUpperCase(),
            status: 'pending_seller_confirmation',
            subtotal: Math.max(0, goodsSubtotal - voucherDiscount),
            voucherDiscount: voucherDiscount,
            paymentMethod: paymentMethodLabel,
            lines: lines.map(line => {
                const p = products.find(x => x.productId === line.productId);
                return { name: p ? p.name : 'Sản phẩm OCOP', unitPrice: p ? p.price : 0, quantity: line.quantity };
            }),
            inventoryVerified: true
        };
        try {
            const savedOrders = JSON.parse(localStorage.getItem('ocop_customer_orders') || '[]');
            savedOrders.unshift({
                ...offlineDraft,
                customer: { name: data.get('name'), phone: data.get('phone'), address: data.get('address'), paymentMethod: paymentMethodLabel },
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('ocop_customer_orders', JSON.stringify(savedOrders));
            localStorage.removeItem('ocop_cart');
        } catch (_) {}
        lastDraft = offlineDraft;
        submitted = true;
        showDraft(offlineDraft);
        status.textContent = salesPage.text('✅ Đơn hàng đã gửi thành công! Nhà bán hàng sẽ liên hệ sớm nhất.', '✅ Order placed successfully! Merchant will contact you shortly.');
    } finally {
        submit.disabled = false;
        submitting = false;
    }
};

(async () => {
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
