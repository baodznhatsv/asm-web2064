import API from './api.js';
import CartManager from './cart.js';
import AuthManager from './auth.js';
import { formatPrice } from './utils.js';

const api = new API();
const cartManager = new CartManager();
const authManager = new AuthManager();

let selectedVariant = null;

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

async function loadProductDetail() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            window.location.href = 'products.html';
            return;
        }
        
        const product = await api.getProductById(parseInt(productId));
        const variants = await api.getVariantsByProductId(parseInt(productId));
        const category = await api.getCategoryById(product.cate_id);
        
        const container = document.getElementById('product-detail');
        const imagePath = product.image || 'images/placeholder.jpg';
        container.innerHTML = `
            <div class="product-detail-image">
                <img src="${imagePath}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'; this.onerror=null;">
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <div class="price">${formatPrice(variants[0]?.price || 0)}</div>
                <p>${product.detail}</p>
                <p><strong>Category:</strong> ${category ? category.name : 'Uncategorized'}</p>
                
                <div class="variants">
                    <h3>Available Variants</h3>
                    ${variants.map((variant, index) => `
                        <div class="variant-option ${index === 0 ? 'selected' : ''}" onclick="selectVariant(${variant.id}, ${variant.price})">
                            <div>
                                <span>${variant.variant_name}</span>
                                <br>
                                <small>Stock: ${variant.quantity}</small>
                            </div>
                            <div class="price">${formatPrice(variant.price)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" id="quantity" value="1" min="1" max="${variants[0]?.quantity || 1}">
                </div>
                
                <button class="btn btn-primary btn-block" onclick="addToCart()">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        
        selectedVariant = variants[0];
        
        // Listen for quantity change
        document.getElementById('quantity').addEventListener('change', function() {
            const max = selectedVariant?.quantity || 1;
            if (this.value > max) this.value = max;
            if (this.value < 1) this.value = 1;
        });
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

function selectVariant(variantId, price) {
    selectedVariant = { id: variantId, price };
    document.querySelectorAll('.variant-option').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.closest('.variant-option').classList.add('selected');
    
    // Update price
    document.querySelector('.product-detail-info .price').textContent = formatPrice(price);
}

function addToCart() {
    if (!selectedVariant) {
        alert('Please select a variant');
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    cartManager.addToCart(parseInt(productId), selectedVariant.id, quantity);
    updateCartCount();
    
    alert('Product added to cart!');
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    loadProductDetail();
});

window.logout = logout;
window.selectVariant = selectVariant;
window.addToCart = addToCart;

