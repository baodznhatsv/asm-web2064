import API from '../scripts/api.js';
import AuthManager from '../scripts/auth.js';
import { formatPrice } from '../scripts/utils.js';

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

async function loadStatistics() {
    try {
        const products = await api.getProducts();
        const orders = await api.getOrders();
        const orderDetails = await api.getOrderDetails();
        const variants = await api.getProductVariants();
        
        // Calculate total revenue
        let totalRevenue = 0;
        for (const order of orders) {
            const details = orderDetails.filter(o => o.order_id === order.id);
            for (const detail of details) {
                totalRevenue += detail.unit_price * detail.quantity;
            }
        }
        
        // Calculate total inventory
        const totalInventory = variants.reduce((sum, v) => sum + v.quantity, 0);
        
        document.getElementById('stat-total-products').textContent = products.length;
        document.getElementById('stat-total-orders').textContent = orders.length;
        document.getElementById('stat-total-revenue').textContent = formatPrice(totalRevenue);
        document.getElementById('stat-total-inventory').textContent = totalInventory;
        
        // Load popular products
        await loadPopularProducts();
        
        // Load inventory alerts
        await loadInventoryAlerts();
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

async function loadPopularProducts() {
    const products = await api.getProducts();
    const orderDetails = await api.getOrderDetails();
    
    // Count product orders
    const productStats = {};
    for (const detail of orderDetails) {
        if (!productStats[detail.product_id]) {
            productStats[detail.product_id] = {
                count: 0,
                quantity: 0,
                revenue: 0
            };
        }
        productStats[detail.product_id].count++;
        productStats[detail.product_id].quantity += detail.quantity;
        productStats[detail.product_id].revenue += detail.unit_price * detail.quantity;
    }
    
    // Get top 5 products
    const sortedProducts = Object.entries(productStats)
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 5);
    
    const tbody = document.getElementById('popular-products-table');
    tbody.innerHTML = '';
    
    for (const [productId, stats] of sortedProducts) {
        const product = products.find(p => p.id === parseInt(productId));
        
        if (product) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${stats.count}</td>
                <td>${stats.quantity}</td>
                <td>${formatPrice(stats.revenue)}</td>
            `;
            tbody.appendChild(tr);
        }
    }
}

async function loadInventoryAlerts() {
    try {
        const variants = await api.getProductVariants();
        const products = await api.getProducts();
        
        // Filter low stock items (quantity < 10)
        const lowStock = variants.filter(v => v.quantity < 10);
        
        const tbody = document.getElementById('inventory-alert-table');
        
        if (lowStock.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--success-color);">All products have sufficient stock</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        
        for (const variant of lowStock) {
            const product = products.find(p => p.id === variant.product_id);
            
            if (product) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.name} - ${variant.variant_name}</td>
                    <td>${variant.quantity}</td>
                    <td><span class="status-badge status-warning">Low Stock</span></td>
                `;
                tbody.appendChild(tr);
            }
        }
    } catch (error) {
        console.error('Error loading inventory alerts:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
});

window.logout = logout;

