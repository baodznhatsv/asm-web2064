import API from '../scripts/api.js';
import AuthManager from '../scripts/auth.js';

const api = new API();
const authManager = new AuthManager();
let products = [];
let categories = [];
let isEditing = false;
let editingId = null;

// Check authentication
if (!authManager.isAuthenticated() || !authManager.isAdmin()) {
    window.location.href = '../login.html';
}

function logout() {
    authManager.logout();
    window.location.href = '../login.html';
}

function openProductModal() {
    document.getElementById('product-modal').classList.add('active');
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    isEditing = false;
    editingId = null;
    loadCategoryOptions();
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

async function loadProducts() {
    try {
        products = await api.getProducts();
        categories = await api.getCategories();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts() {
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        const category = categories.find(c => c.id === product.cate_id);
        
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${category ? category.name : 'Uncategorized'}</td>
            <td class="actions">
                <button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})">
                    Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadCategoryOptions() {
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">Select Category</option>';
    
    categories.filter(c => !c.parent_id).forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.cate_id;
    document.getElementById('product-detail').value = product.detail;
    document.getElementById('product-image').value = product.image || '';
    
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-modal').classList.add('active');
    
    isEditing = true;
    editingId = id;
    loadCategoryOptions();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        displayProducts();
    }
}

document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const cate_id = document.getElementById('product-category').value;
    const detail = document.getElementById('product-detail').value;
    const image = document.getElementById('product-image').value;
    
    if (isEditing && editingId) {
        const index = products.findIndex(p => p.id === editingId);
        products[index] = {
            ...products[index],
            name,
            cate_id: parseInt(cate_id),
            detail,
            image
        };
    } else {
        const newProduct = {
            id: products.length + 1,
            name,
            cate_id: parseInt(cate_id),
            detail,
            image
        };
        products.push(newProduct);
    }
    
    displayProducts();
    closeProductModal();
});

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

window.logout = logout;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

