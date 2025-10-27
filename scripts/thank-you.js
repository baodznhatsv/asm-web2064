import AuthManager from './auth.js';
import { formatDate } from './utils.js';

const authManager = new AuthManager();

function updateCartCount() {
    // Cart is empty after checkout
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = '0');
}

function checkAuth() {
    if (!authManager.isAuthenticated()) {
        window.location.href = 'index.html';
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
    
    // Display order ID
    const orderId = sessionStorage.getItem('lastOrderId');
    if (orderId) {
        document.getElementById('order-id').textContent = orderId;
    }
}

function logout() {
    authManager.logout();
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
});

window.logout = logout;

