import API from './api.js';
import CartManager from './cart.js';
import AuthManager from './auth.js';
import { formatPrice } from './utils.js';
import i18n from './i18n.js';

// Global instances
const api = new API();
const cartManager = new CartManager();
const authManager = new AuthManager();

// Update cart count in navigation
function updateCartCount() {
    const cartCount = cartManager.getItemCount();
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => el.textContent = cartCount);
}

// Check authentication status
function checkAuth() {
    if (authManager.isAuthenticated()) {
        const currentUser = authManager.getCurrentUser();
        const loginLinks = document.querySelectorAll('#login-link');
        loginLinks.forEach(link => {
            link.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            link.href = '#';
            link.onclick = () => logout();
        });
        
        // Show admin menu if user is admin
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

// Load categories
async function loadCategories() {
    try {
        const categories = await api.getCategories();
        const mainCategories = categories.filter(c => !c.parent_id);
        const container = document.getElementById('categories-container');
        
        container.innerHTML = '';
        mainCategories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.onclick = () => window.location.href = `products.html?category=${category.id}`;
            categoryCard.innerHTML = `
                <i class="fas fa-tag"></i>
                <h3>${category.name}</h3>
            `;
            container.appendChild(categoryCard);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load featured products
async function loadFeaturedProducts() {
    try {
        const products = await api.getProducts();
        const variants = await api.getProductVariants();
        const categories = await api.getCategories();
        
        const featuredProducts = products.slice(0, 6);
        const container = document.getElementById('featured-products');
        
        container.innerHTML = '';
        featuredProducts.forEach(product => {
            const productVariants = variants.filter(v => v.product_id === product.id);
            const minPrice = Math.min(...productVariants.map(v => v.price));
            const category = categories.find(c => c.id === product.cate_id);
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            const imagePath = product.image || 'images/placeholder.jpg';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${imagePath}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'; this.onerror=null;">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${category ? category.name : 'Uncategorized'}</p>
                    <div class="product-price">${formatPrice(minPrice)}</div>
                    <button class="btn btn-primary btn-block" onclick="viewProduct(${product.id})">
                        View Details
                    </button>
                </div>
            `;
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    loadCategories();
    loadFeaturedProducts();
});

// Listen for language changes to update dynamic content
document.addEventListener('languageChanged', () => {
    i18n.updatePage();
});

// Make functions available globally
window.logout = logout;
window.viewProduct = viewProduct;

