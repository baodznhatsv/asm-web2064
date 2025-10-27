import API from '../scripts/api.js';
import AuthManager from '../scripts/auth.js';

const api = new API();
const authManager = new AuthManager();
let users = [];
let orders = [];

// Check authentication
if (!authManager.isAuthenticated() || !authManager.isAdmin()) {
    window.location.href = '../login.html';
}

function logout() {
    authManager.logout();
    window.location.href = '../login.html';
}

async function loadCustomers() {
    try {
        users = await api.getUsers();
        orders = await api.getOrders();
        displayCustomers();
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

function displayCustomers() {
    const tbody = document.getElementById('customers-table');
    tbody.innerHTML = '';
    
    const customers = users.filter(u => u.role === 'member');
    
    customers.forEach(customer => {
        const tr = document.createElement('tr');
        const totalOrders = orders.filter(o => o.user_id === customer.id).length;
        
        tr.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${totalOrders}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
});

window.logout = logout;

