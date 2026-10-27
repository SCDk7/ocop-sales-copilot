(function(root) {
    'use strict';
    function resolveRoute(pathname) {
        const product = /^\/(?:products?|san-pham)\/([1-9]\d*)\/?$/.exec(pathname);
        if (product) return {type:'product',id:Number(product[1])};
        if (/^\/(?:cart|gio-hang)\/?$/.test(pathname)) return {type:'cart'};
        return null;
    }
    if (typeof module === 'object' && module.exports) { module.exports={resolveRoute}; return; }
    function navigate() {
        const route = resolveRoute(root.location.pathname);
        if (!route) return;
        const open = () => {
            if (route.type === 'product') {
                if ((root.PRODUCTS || []).some(product => product.id === route.id)) root.openQuickView?.(route.id);
                else root.showToast?.('Không tìm thấy sản phẩm trong danh mục.', 'info');
            } else {
                const drawer = document.getElementById('shopping-cart-drawer') || document.getElementById('cart-drawer');
                if (!drawer || drawer.hidden || drawer.classList.contains('hidden')) root.toggleCart?.(true);
            }
        };
        if (typeof root.enterOcopMarket === 'function') root.enterOcopMarket('all',open);
        else open();
    }
    root.addEventListener('popstate',navigate);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',navigate,{once:true});
    else navigate();
})(typeof window !== 'undefined' ? window : globalThis);
