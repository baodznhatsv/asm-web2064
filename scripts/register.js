import AuthManager from './auth.js';
import { showMessage, validateEmail, validatePhone } from './utils.js';

const authManager = new AuthManager();

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const address = document.getElementById('register-address').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validation
    if (!name || !email || !phone || !address || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showMessage('Please enter a valid phone number', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const user = await authManager.register(name, email, phone, address, password);
        
        if (user) {
            showMessage('Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage('Registration failed. Email may already exist.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Registration failed. Please try again.', 'error');
    }
});

