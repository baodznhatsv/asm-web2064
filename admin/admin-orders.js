import API from '../scripts/api.js';
import AuthManager from '../scripts/auth.js';
import { formatDate, formatPrice } from '../scripts/utils.js';

const api = new API();
const authManager = new AuthManager();
let orders = [];
let orderDetails = [];
let users = [];

// Check authentication
if (!authManager.isAuthenticated() || !authManager.isAdmin()) {
    window.location.href = '../login.html';
}

function logout() {
    authManager.logout();
    window.location.href = '../login.html';
}

async function loadOrders() {
    try {
        orders = await api.getOrders();
        orderDetails = await api.getOrderDetails();
        users = await api.getUsers();
        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function displayOrders() {
    const tbody = document.getElementById('orders-table');
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const user = users.find(u => u.id === order.user_id);
        const orderTotal = calculateOrderTotal(order.id);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${user ? user.name : 'Unknown'}</td>
            <td>${formatDate(order.created_date)}</td>
            <td>${formatPrice(orderTotal)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td class="actions">
                <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails(${order.id})">
                    View
                </button>
                <select onchange="updateOrderStatus(${order.id}, this.value)" class="status-select">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function calculateOrderTotal(orderId) {
    let total = 0;
    const details = orderDetails.filter(od => od.order_id === orderId);
    for (const detail of details) {
        total += detail.unit_price * detail.quantity;
    }
    return total;
}

function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        displayOrders();
    }
}

async function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const user = users.find(u => u.id === order.user_id);
    const details = orderDetails.filter(od => od.order_id === orderId);
    
    const container = document.getElementById('order-detail-content');
    container.innerHTML = `
        <h3>Order #${order.id}</h3>
        <p><strong>Customer:</strong> ${user ? user.name : 'Unknown'}</p>
        <p><strong>Date:</strong> ${formatDate(order.created_date)}</p>
        <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
        <h4>Order Items</h4>
        <table style="width: 100%; margin-top: 1rem;">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${details.map(detail => `
                    <tr>
                        <td>Product ${detail.product_id}</td>
                        <td>${detail.quantity}</td>
                        <td>${formatPrice(detail.unit_price)}</td>
                        <td>${formatPrice(detail.unit_price * detail.quantity)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p style="margin-top: 1rem; text-align: right;">
            <strong>Total: ${formatPrice(calculateOrderTotal(orderId))}</strong>
        </p>
    `;
    
    document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

window.logout = logout;
window.viewOrderDetails = viewOrderDetails;
window.updateOrderStatus = updateOrderStatus;
window.closeOrderModal = closeOrderModal;

