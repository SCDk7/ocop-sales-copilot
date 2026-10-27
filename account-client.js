(function(){
    // Neutralized account client: purely offline B2B2C mode for GitHub Pages & Digital Challenge 2026.
    try {
        localStorage.removeItem('ocop-session-token');
    } catch (_) {}

    window.currentUser = null;
    window.accountReady = Promise.resolve();
    window.requireAccountCheckout = async function() { return true; };
    window.createAccountOrder = async function() {
        let total = 0;
        if (typeof getCartTotal === 'function') total = getCartTotal();
        if (typeof activeVoucher !== 'undefined' && activeVoucher && typeof getVoucherDiscount === 'function') {
            total = Math.max(0, total - getVoucherDiscount());
        }
        const orderId = 'ORD-' + Date.now().toString().slice(-6);
        const order = { id: orderId, total: total, items: (typeof cart !== 'undefined' ? [...cart] : []), date: new Date().toISOString() };
        if (typeof ordersHistory !== 'undefined' && Array.isArray(ordersHistory)) {
            ordersHistory.unshift(order);
            try { localStorage.setItem('ocop_orders_history', JSON.stringify(ordersHistory)); } catch (_) {}
        }
        return order;
    };
    window.reportAccountPayment = async function() {
        if (typeof cart !== 'undefined') cart = [];
        return { ok: true };
    };
    window.logoutAccount = async function() {
        window.currentUser = null;
        if (typeof showToast === 'function') showToast('Đã chuyển sang chế độ đối tác số OCOP.', 'info');
    };
    window.toggleAuthModal = function() {
        if (typeof openPartnerRegistrationModal === 'function') {
            openPartnerRegistrationModal();
        }
    };
})();
