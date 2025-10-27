import API from '../scripts/api.js';
import AuthManager from '../scripts/auth.js';

const api = new API();
const authManager = new AuthManager();
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

function openCategoryModal() {
    document.getElementById('category-modal').classList.add('active');
    document.getElementById('modal-title').textContent = 'Add Category';
    document.getElementById('category-form').reset();
    isEditing = false;
    editingId = null;
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.remove('active');
}

async function loadCategories() {
    try {
        categories = await api.getCategories();
        displayCategories();
        loadParentCategoryOptions();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function displayCategories() {
    const tbody = document.getElementById('categories-table');
    tbody.innerHTML = '';
    
    categories.forEach(category => {
        const tr = document.createElement('tr');
        const parentCategory = categories.find(c => c.id === category.parent_id);
        
        tr.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${parentCategory ? parentCategory.name : 'None'}</td>
            <td class="actions">
                <button class="btn btn-secondary btn-sm" onclick="editCategory(${category.id})">
                    Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadParentCategoryOptions() {
    const select = document.getElementById('category-parent');
    select.innerHTML = '<option value="">None (Main Category)</option>';
    
    categories.filter(c => !c.parent_id).forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-parent').value = category.parent_id || '';
    
    document.getElementById('modal-title').textContent = 'Edit Category';
    document.getElementById('category-modal').classList.add('active');
    
    isEditing = true;
    editingId = id;
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        categories = categories.filter(c => c.id !== id);
        displayCategories();
        loadParentCategoryOptions();
    }
}

document.getElementById('category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('category-name').value;
    const parentId = document.getElementById('category-parent').value;
    
    if (isEditing && editingId) {
        // Update existing category
        const index = categories.findIndex(c => c.id === editingId);
        categories[index] = {
            ...categories[index],
            name,
            parent_id: parentId ? parseInt(parentId) : null
        };
    } else {
        // Add new category
        const newCategory = {
            id: categories.length + 1,
            name,
            parent_id: parentId ? parseInt(parentId) : null
        };
        categories.push(newCategory);
    }
    
    displayCategories();
    loadParentCategoryOptions();
    closeCategoryModal();
});

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

window.logout = logout;
window.openCategoryModal = openCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;

