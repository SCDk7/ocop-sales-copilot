// js/cart.js
export class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('ocop_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('ocop_wishlist')) || [];
    }

    save() {
        localStorage.setItem('ocop_cart', JSON.stringify(this.cart));
        localStorage.setItem('ocop_wishlist', JSON.stringify(this.wishlist));
    }

    addToCart(product, quantity = 1) {
        const item = this.cart.find(i => i.id === product.id);
        if (item) {
            item.quantity += quantity;
        } else {
            this.cart.push({ ...product, quantity });
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