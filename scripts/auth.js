// Authentication management using localStorage
class AuthManager {
    constructor() {
        this.storageKey = 'susan_shop_user';
        this.currentUser = this.getCurrentUser();
    }

    // Get current user from localStorage
    getCurrentUser() {
        const user = localStorage.getItem(this.storageKey);
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem(this.storageKey, JSON.stringify(user));
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.storageKey);
    }

    // Check if user is logged in
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    // Login
    async login(email, password) {
        const api = new (await import('./api.js')).default();
        const users = await api.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Remove password before storing
            const { password: _, ...userWithoutPassword } = user;
            this.setCurrentUser(userWithoutPassword);
            return userWithoutPassword;
        }
        return null;
    }

    // Register
    async register(name, email, phone, address, password) {
        const api = new (await import('./api.js')).default();
        const users = await api.getUsers();
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return null; // User already exists
        }

        // Create new user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            phone,
            address,
            password,
            role: 'member'
        };

        // In a real app, you would save this to the server
        this.setCurrentUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            address: newUser.address,
            role: newUser.role
        });

        return newUser;
    }
}

export default AuthManager;

