import API from './api.js';
import CartManager from './cart.js';
import AuthManager from './auth.js';
import { formatPrice, showMessage, validateEmail, validatePhone } from './utils.js';

const api = new API();
const cartManager = new CartManager();
const authManager = new AuthManager();

function updateCartCount() {
    const cartCount = cartManager.getItemCount();
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = cartCount);
}

function checkAuth() {
    if (!authManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
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
    
    // Pre-fill form with user data
    document.getElementById('name').value = currentUser.name;
    document.getElementById('email').value = currentUser.email;
    document.getElementById('phone').value = currentUser.phone;
    document.getElementById('address').value = currentUser.address;
}

function logout() {
    authManager.logout();
    window.location.href = 'index.html';
}

async function loadCheckoutItems() {
    try {
        const cart = cartManager.getCart();
        const products = await api.getProducts();
        const variants = await api.getProductVariants();
        
        const container = document.getElementById('checkout-items');
        let subtotal = 0;
        
        container.innerHTML = '';
        
        for (const item of cart) {
            const product = products.find(p => p.id === item.productId);
            const variant = variants.find(v => v.id === item.variantId);
            
            if (!product || !variant) continue;
            
            const itemTotal = variant.price * item.quantity;
            subtotal += itemTotal;
            
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <div>
                    <strong>${product.name}</strong><br>
                    <small>${variant.variant_name} x ${item.quantity}</small>
                </div>
                <div>${formatPrice(itemTotal)}</div>
            `;
            container.appendChild(checkoutItem);
        }
        
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        
        document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal);
        document.getElementById('checkout-tax').textContent = formatPrice(tax);
        document.getElementById('checkout-total').textContent = formatPrice(total);
    } catch (error) {
        console.error('Error loading checkout items:', error);
    }
}

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Validation
    if (!name || !email || !phone || !address) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showMessage('Please enter a valid phone number', 'error');
        return;
    }
    
    try {
        // Generate order ID
        const orderId = Date.now();
        
        // Save order data to session storage
        sessionStorage.setItem('lastOrderId', orderId);
        
        // Clear cart
        cartManager.clearCart();
        
        // Redirect to thank you page
        window.location.href = 'thank-you.html';
    } catch (error) {
        console.error('Error processing order:', error);
        showMessage('Error processing order. Please try again.', 'error');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    loadCheckoutItems();
});

window.logout = logout;

