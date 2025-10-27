import AuthManager from './auth.js';
import { showMessage, validateEmail } from './utils.js';
import i18n from './i18n.js';

const authManager = new AuthManager();

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!validateEmail(email)) {
        showMessage(i18n.t('message.validEmail'), 'error');
        return;
    }
    
    try {
        const user = await authManager.login(email, password);
        
        if (user) {
            showMessage(i18n.t('message.loginSuccess'), 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage(i18n.t('message.loginFailed'), 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(i18n.t('message.error'), 'error');
    }
});

