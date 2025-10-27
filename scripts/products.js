import API from './api.js';
import CartManager from './cart.js';
import AuthManager from './auth.js';
import { formatPrice } from './utils.js';

const api = new API();
const cartManager = new CartManager();
const authManager = new AuthManager();

let allProducts = [];
let allVariants = [];
let allCategories = [];

// Update cart count
function updateCartCount() {
    const cartCount = cartManager.getItemCount();
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = cartCount);
}

// Check authentication
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

// Load products
async function loadProducts() {
    try {
        allProducts = await api.getProducts();
        allVariants = await api.getProductVariants();
        allCategories = await api.getCategories();
        
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('category');
        
        let productsToShow = allProducts;
        if (categoryId) {
            productsToShow = allProducts.filter(p => p.cate_id === parseInt(categoryId));
        }
        
        displayProducts(productsToShow);
        loadCategoryFilter();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productVariants = allVariants.filter(v => v.product_id === product.id);
        const minPrice = Math.min(...productVariants.map(v => v.price));
        const category = allCategories.find(c => c.id === product.cate_id);
        
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
}

function loadCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    allCategories.filter(c => !c.parent_id).forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

function applyFilters() {
    const categoryId = document.getElementById('category-filter').value;
    const maxPrice = document.getElementById('price-filter').value;
    
    let filteredProducts = allProducts;
    
    if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.cate_id === parseInt(categoryId));
    }
    
    // Filter by price
    filteredProducts = filteredProducts.filter(product => {
        const productVariants = allVariants.filter(v => v.product_id === product.id);
        const minPrice = Math.min(...productVariants.map(v => v.price));
        return minPrice <= maxPrice;
    });
    
    displayProducts(filteredProducts);
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Update price display
document.getElementById('price-filter')?.addEventListener('input', (e) => {
    const maxPrice = e.target.value;
    document.getElementById('price-display').textContent = `$0 - $${maxPrice}`;
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    loadProducts();
});

window.logout = logout;
window.applyFilters = applyFilters;
window.viewProduct = viewProduct;

