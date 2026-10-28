// giohang.js - OCOP Cart & Wishlist Manager
class CartManager {
    constructor(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
        this.storage = storage;
        const read = key => { try { const value = JSON.parse(storage?.getItem(key) || '[]'); return Array.isArray(value) ? value : []; } catch (_) { return []; } };
        this.cart = read('ocop_cart');
        this.wishlist = read('ocop_wishlist');
    }

    hydrate(products) {
        const catalogue = new Map(products.map(product => [Number(product.id), product]));
        const rows = new Map();
        for (const item of this.cart) {
            if (!item || typeof item !== 'object') continue;
            const product = catalogue.get(Number(item.id));
            const quantity = Number(item.quantity ?? item.qty ?? 1);
            if (!product || !Number.isFinite(product.price) || product.price < 0 || !Number.isInteger(quantity) || quantity < 1) continue;
            const count = Math.min(99, (rows.get(product.id)?.quantity || 0) + quantity);
            rows.set(product.id, {...product, quantity:count});
        }
        this.cart = [...rows.values()];
        return this.cart;
    }

    save() {
        try {
            this.storage?.setItem('ocop_cart', JSON.stringify(this.cart));
            this.storage?.setItem('ocop_wishlist', JSON.stringify(this.wishlist));
        } catch (_) { /* Shopping remains usable when storage is unavailable. */ }
        if (typeof window !== 'undefined') window.OCOPCustomerSession?.saveCart(this.cart);
    }

    addToCart(product, quantity = 1) {
        if (!product || !Number.isInteger(quantity) || quantity < 1) return;
        const item = this.cart.find(i => i.id === product.id);
        if (item) {
            item.quantity = Math.min(99, (item.quantity || item.qty || 1) + quantity);
        } else {
            this.cart.push({ ...product, quantity:Math.min(99, quantity) });
        }
        this.save();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.save();
    }

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
        } else {
            this.wishlist.push(productId);
        }
        this.save();
        return this.wishlist.includes(productId);
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CartManager };
}
if (typeof window !== 'undefined') {
    window.CartManager = CartManager;
}
