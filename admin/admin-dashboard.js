import API from '../scripts/api.js';
import AuthManager from '../scripts/auth.js';
import { formatPrice, formatDate } from '../scripts/utils.js';

const api = new API();
const authManager = new AuthManager();

// Check authentication
if (!authManager.isAuthenticated() || !authManager.isAdmin()) {
    window.location.href = '../login.html';
}

function logout() {
    authManager.logout();
    window.location.href = '../login.html';
}

async function loadStats() {
    try {
        const products = await api.getProducts();
        const orders = await api.getOrders();
        const users = await api.getUsers();
        const orderDetails = await api.getOrderDetails();
        
        // Calculate total revenue
        let totalRevenue = 0;
        for (const order of orders) {
            const details = orderDetails.filter(od => od.order_id === order.id);
            for (const detail of details) {
                totalRevenue += detail.unit_price * detail.quantity;
            }
        }
        
        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('total-customers').textContent = users.filter(u => u.role === 'member').length;
        document.getElementById('total-revenue').textContent = formatPrice(totalRevenue);
        
        // Load recent orders
        loadRecentOrders(orders);
        loadPopularProducts(orderDetails, products);
        
        // Load inventory alert
        await loadInventoryAlert();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadRecentOrders(orders) {
    const recentOrders = orders.slice(-5).reverse();
    const container = document.getElementById('recent-orders');
    
    container.innerHTML = '';
    
    if (recentOrders.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">No orders yet</p>';
        return;
    }
    
    const allUsers = await api.getUsers();
    
    for (const order of recentOrders) {
        const user = allUsers.find(u => u.id === order.user_id);
        
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <div>
                <strong>Order #${order.id}</strong>
                <br><small>${user ? user.name : 'Unknown'} - ${formatDate(order.created_date)}</small>
            </div>
            <div>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
        `;
        container.appendChild(orderDiv);
    }
}

async function loadPopularProducts(orderDetails, products) {
    // Count product orders
    const productCounts = {};
    const productRevenue = {};
    
    for (const detail of orderDetails) {
        if (!productCounts[detail.product_id]) {
            productCounts[detail.product_id] = detail.quantity;
            productRevenue[detail.product_id] = detail.unit_price * detail.quantity;
        } else {
            productCounts[detail.product_id] += detail.quantity;
            productRevenue[detail.product_id] += detail.unit_price * detail.quantity;
        }
    }
    
    // Get top 5 products
    const sortedProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const container = document.getElementById('popular-products');
    container.innerHTML = '';
    
    if (sortedProducts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--secondary-color);">No products sold yet</p>';
        return;
    }
    
    for (const [productId, count] of sortedProducts) {
        const product = products.find(p => p.id === parseInt(productId));
        
        if (product) {
            const revenue = productRevenue[productId] || 0;
            const productDiv = document.createElement('div');
            productDiv.className = 'popular-product';
            productDiv.innerHTML = `
                <div>
                    <strong>${product.name}</strong><br>
                    <small>${formatPrice(revenue)} revenue</small>
                </div>
                <div>
                    <span class="badge">${count} sold</span>
                </div>
            `;
            container.appendChild(productDiv);
        }
    }
}

async function loadInventoryAlert() {
    try {
        const variants = await api.getProductVariants();
        const products = await api.getProducts();
        
        // Filter low stock items (quantity < 10)
        const lowStock = variants.filter(v => v.quantity < 10);
        
        const container = document.getElementById('inventory-alert');
        
        if (lowStock.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--success-color);">✅ All products have sufficient stock</p>';
            return;
        }
        
        container.innerHTML = '';
        
        for (const variant of lowStock) {
            const product = products.find(p => p.id === variant.product_id);
            
            if (product) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'popular-product';
                alertDiv.style.borderLeft = '4px solid var(--danger-color)';
                alertDiv.innerHTML = `
                    <div>
                        <strong>${product.name}</strong><br>
                        <small>${variant.variant_name}</small>
                    </div>
                    <div>
                        <span class="badge" style="background: var(--danger-color);">Only ${variant.quantity} left</span>
                    </div>
                `;
                container.appendChild(alertDiv);
            }
        }
    } catch (error) {
        console.error('Error loading inventory alert:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});

window.logout = logout;

