// Cart management using localStorage
class CartManager {
    constructor() {
        this.storageKey = 'susan_shop_cart';
    }

    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem(this.storageKey);
        return cart ? JSON.parse(cart) : [];
    }

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
    }

    // Add item to cart
    addToCart(productId, variantId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.variantId === variantId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId,
                variantId,
                quantity
            });
        }

        this.saveCart(cart);
        return cart;
    }

    // Remove item from cart
    removeFromCart(variantId) {
        const cart = this.getCart().filter(item => item.variantId !== variantId);
        this.saveCart(cart);
        return cart;
    }

    // Update item quantity
    updateQuantity(variantId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.variantId === variantId);
        
        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(variantId);
            }
            item.quantity = quantity;
            this.saveCart(cart);
        }
        return cart;
    }

    // Clear cart
    clearCart() {
        this.saveCart([]);
    }

    // Get cart item count
    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Calculate total price (requires variants data)
    async calculateTotal() {
        const cart = this.getCart();
        const api = new (await import('./api.js')).default();
        const variants = await api.getProductVariants();
        
        let total = 0;
        for (const item of cart) {
            const variant = variants.find(v => v.id === item.variantId);
            if (variant) {
                total += variant.price * item.quantity;
            }
        }
        return total;
    }
}

export default CartManager;

