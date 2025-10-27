import API from './api.js';
import CartManager from './cart.js';
import AuthManager from './auth.js';
import { formatPrice } from './utils.js';

const api = new API();
const cartManager = new CartManager();
const authManager = new AuthManager();

function updateCartCount() {
    const cartCount = cartManager.getItemCount();
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = cartCount);
}

function checkAuth() {
    if (authManager.isAuthenticated()) {
        const currentUser = authManager.getCurrentUser();
        const loginLinks = document.querySelectorAll('#login-link');
        loginLinks.forEach(link => {
            link.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            link.href = '#';
            link.onclick = () => logout();
        });
        
        const adminMenu = document.getElementById('admin-menu');
        if (authManager.isAdmin() && adminMenu) {
            adminMenu.style.display = 'block';
        }
    }
}

function logout() {
    authManager.logout();
    window.location.href = 'index.html';
}

async function loadCart() {
    try {
        const cart = cartManager.getCart();
        
        if (cart.length === 0) {
            document.getElementById('cart-empty').style.display = 'block';
            document.getElementById('cart-content').style.display = 'none';
            return;
        }
        
        const products = await api.getProducts();
        const variants = await api.getProductVariants();
        const categories = await api.getCategories();
        
        const container = document.getElementById('cart-items');
        let subtotal = 0;
        
        container.innerHTML = '';
        
        for (const item of cart) {
            const product = products.find(p => p.id === item.productId);
            const variant = variants.find(v => v.id === item.variantId);
            const category = categories.find(c => c.id === product.cate_id);
            
            if (!product || !variant) continue;
            
            const itemTotal = variant.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const imagePath = product.image || 'images/placeholder.jpg';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${imagePath}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'; this.onerror=null;">
                </div>
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p>${variant.variant_name}</p>
                    <p>${category ? category.name : 'Uncategorized'}</p>
                    <div class="product-price">${formatPrice(variant.price)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button onclick="updateQuantity(${item.variantId}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.variantId}, ${item.quantity + 1})">+</button>
                        </div>
                        <div class="product-price">Total: ${formatPrice(itemTotal)}</div>
                        <button class="btn btn-danger btn-sm" onclick="removeItem(${item.variantId})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(cartItem);
        }
        
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        
        document.getElementById('subtotal').textContent = formatPrice(subtotal);
        document.getElementById('tax').textContent = formatPrice(tax);
        document.getElementById('total').textContent = formatPrice(total);
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function updateQuantity(variantId, quantity) {
    cartManager.updateQuantity(variantId, quantity);
    loadCart();
    updateCartCount();
}

function removeItem(variantId) {
    cartManager.removeFromCart(variantId);
    loadCart();
    updateCartCount();
}

function checkout() {
    if (!authManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    const cart = cartManager.getCart();
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    loadCart();
});

window.logout = logout;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.checkout = checkout;

