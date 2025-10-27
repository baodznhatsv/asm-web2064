// Internationalization support
import { translations } from './translations.js';

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('susan_shop_lang') || 'vn';
        this.trans = translations[this.currentLang];
    }

    // Set language
    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            this.trans = translations[lang];
            localStorage.setItem('susan_shop_lang', lang);
            this.updatePage();
        }
    }

    // Get translation
    t(key) {
        return this.trans[key] || key;
    }

    // Update all elements with data-i18n attribute
    updatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Check if element has placeholder attribute for inputs
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });

        // Update page title
        const titleKey = document.querySelector('[data-i18n-title]');
        if (titleKey) {
            document.title = this.t(titleKey.getAttribute('data-i18n-title'));
        }

        // Trigger custom event for dynamic content
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }

    // Get current language
    getCurrentLang() {
        return this.currentLang;
    }

    // Initialize language
    init() {
        this.updatePage();
        this.createLanguageSwitcher();
    }

    // Create language switcher button
    createLanguageSwitcher() {
        // Check if switcher already exists
        const existingSwitcher = document.querySelector('.language-switcher');
        if (existingSwitcher) {
            existingSwitcher.innerHTML = this.getLanguageSwitcherHTML();
        } else {
            // Try to add to navigation
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                const switcherDiv = document.createElement('li');
                switcherDiv.className = 'language-switcher';
                switcherDiv.innerHTML = this.getLanguageSwitcherHTML();
                navMenu.appendChild(switcherDiv);
            }

            // Also add to admin navigation if present
            const adminNav = document.querySelector('.admin-nav-links');
            if (adminNav) {
                const switcherDiv = document.createElement('a');
                switcherDiv.className = 'language-switcher-admin';
                switcherDiv.innerHTML = this.getLanguageSwitcherHTML();
                adminNav.insertBefore(switcherDiv, adminNav.firstChild);
            }
        }
    }

    // Get language switcher HTML
    getLanguageSwitcherHTML() {
        const otherLang = this.currentLang === 'en' ? 'vn' : 'en';
        const otherLangLabel = otherLang === 'en' ? 'English' : 'Tiếng Việt';
        return `
            <select onchange="changeLanguage(this.value)" style="padding: 0.5rem; border-radius: 5px; border: 1px solid #ddd;">
                <option value="vn" ${this.currentLang === 'vn' ? 'selected' : ''}>🇻🇳 Tiếng Việt</option>
                <option value="en" ${this.currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            </select>
        `;
    }
}

// Global i18n instance
const i18n = new I18n();

// Change language function
window.changeLanguage = function(lang) {
    i18n.setLanguage(lang);
};

// Auto-initialize
i18n.init();

export default i18n;

