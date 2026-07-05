// 🎀 Universally discover where this script is running from 
const currentScriptSrc = document.currentScript ? document.currentScript.src : '';
const scriptDirectory = currentScriptSrc.substring(0, currentScriptSrc.lastIndexOf('/'));

async function initializeGlobalHeader() {
    const headerContainer = document.getElementById('global-header');
    if (!headerContainer) return;

    try {
        // 🎀 Fetches header.html from the exact same directory as this script, universally!
        const response = await fetch(`${scriptDirectory}/header.html`);
        if (!response.ok) throw new Error('Header resource load failed');
        headerContainer.innerHTML = await response.text();

        // Bind language button clicks dynamically
        headerContainer.querySelectorAll('.lang-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (window.setLanguage) {
                    window.setLanguage(lang);
                }
            });
        });

        // Set active state on current page link
        let currentPath = window.location.pathname.toLowerCase();
        if (currentPath.endsWith('/')) currentPath = currentPath.slice(0, -1);
        if (currentPath === '' || currentPath === '/index.html') currentPath = '/';

        headerContainer.querySelectorAll('.nav-btn').forEach(link => {
            const dataPage = link.getAttribute('data-page');
            link.classList.toggle('active', dataPage && dataPage.toLowerCase() === currentPath);
        });

        // Setup sidebar hover/click logic
        const hoverZone = headerContainer.querySelector('.sidebar-hover-zone');
        const trigger = headerContainer.querySelector('.sidebar-trigger');
        if (trigger && hoverZone) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                hoverZone.classList.toggle('open');
            });
            document.addEventListener('click', (e) => {
                if (!hoverZone.contains(e.target)) hoverZone.classList.remove('open');
            });
        }

        // Apply translations once header loads
        if (window.applyTranslations) {
            window.applyTranslations(window.getLang());
        }
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeGlobalHeader);