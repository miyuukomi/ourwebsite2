// 🎀 Universally discover where this script is running from 
const currentScriptSrc = document.currentScript ? document.currentScript.src : '';
const scriptDirectory = currentScriptSrc.substring(0, currentScriptSrc.lastIndexOf('/'));

async function initializeGlobalHeader() {
    const headerContainer = document.getElementById('global-header');
    if (!headerContainer) return;

    try {
        // 🎀 Fetches header.html from the exact same directory as this script
        const response = await fetch(`${scriptDirectory}/header.html`);
        if (!response.ok) throw new Error('Header resource load failed');
        headerContainer.innerHTML = await response.text();

        // ==========================================
        // 1. LANGUAGE BUTTON TOGGLE & CLICK-AWAY LOGIC
        // ==========================================
        const langTrigger = headerContainer.querySelector('.lang-bookmark-trigger');
        const langTabFace = headerContainer.querySelector('.lang-bookmark-tab-face');
        const langContent = headerContainer.querySelector('.lang-bookmark-content');
        
        if (langTrigger && langTabFace) {
            // Open/Close on tap
            langTabFace.addEventListener('click', (e) => {
                e.stopPropagation();
                langTrigger.classList.toggle('active-dropdown');
            });
            
            // Prevent clicks inside the menu from closing it
            if (langContent) {
                langContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }

        // Tap anywhere outside to quit the UI completely
        document.addEventListener('click', (e) => {
            if (langTrigger && !langTrigger.contains(e.target)) {
                langTrigger.classList.remove('active-dropdown');
            }
        });

        // ==========================================
        // 2. LANGUAGE TRANSLATION BINDINGS
        // ==========================================
        headerContainer.querySelectorAll('.lang-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (window.setLanguage) {
                    window.setLanguage(lang);
                    // Optional: Automatically close the dropdown after picking a language
                    langTrigger.classList.remove('active-dropdown'); 
                }
            });
        });

        // ==========================================
        // 3. NAVIGATION ACTIVE STATES
        // ==========================================
        let currentPath = window.location.pathname.toLowerCase();
        if (currentPath.endsWith('/')) currentPath = currentPath.slice(0, -1);
        if (currentPath === '' || currentPath === '/index.html') currentPath = '/';

        headerContainer.querySelectorAll('.nav-btn').forEach(link => {
            const dataPage = link.getAttribute('data-page');
            link.classList.toggle('active', dataPage && dataPage.toLowerCase() === currentPath);
        });

        // Apply translations once header loads
        if (window.applyTranslations) {
            window.applyTranslations(window.getLang());
        }

    } catch (error) {
        console.error('Error loading header:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeGlobalHeader);