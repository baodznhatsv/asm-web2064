// API utility functions for managing data
class API {
    constructor() {
        // Detect if we're in admin folder and adjust path
        const isAdmin = window.location.pathname.includes('/admin/');
        this.baseURL = isAdmin ? '../data/' : './data/';
    }

    // Generic fetch function
    async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    // Get all data
    async getCategories() {
        return this.fetchData('categories.json');
    }

    async getProducts() {
        return this.fetchData('products.json');
    }

    async getProductVariants() {
        return this.fetchData('product-variants.json');
    }

    async getUsers() {
        return this.fetchData('users.json');
    }

    async getOrders() {
        return this.fetchData('orders.json');
    }

    async getOrderDetails() {
        return this.fetchData('order-details.json');
    }

    // Helper function to get product variants for a specific product
    async getVariantsByProductId(productId) {
        const variants = await this.getProductVariants();
        return variants.filter(v => v.product_id === productId);
    }

    // Helper function to get products by category
    async getProductsByCategory(categoryId) {
        const products = await this.getProducts();
        return products.filter(p => p.cate_id === categoryId);
    }

    // Helper function to get category by ID
    async getCategoryById(categoryId) {
        const categories = await this.getCategories();
        return categories.find(c => c.id === categoryId);
    }

    // Helper function to get product by ID
    async getProductById(productId) {
        const products = await this.getProducts();
        return products.find(p => p.id === productId);
    }

    // Helper function to get orders by user ID
    async getOrdersByUserId(userId) {
        const orders = await this.getOrders();
        return orders.filter(o => o.user_id === userId);
    }

    // Helper function to get order details by order ID
    async getOrderDetailsByOrderId(orderId) {
        const orderDetails = await this.getOrderDetails();
        return orderDetails.filter(od => od.order_id === orderId);
    }
}

export default API;

