// thanks chatgpt and gemini for this lol
let cartItems = JSON.parse(localStorage.getItem('allNightCart')) || [];
const EXCHANGE_RATE = 30.8;

function saveCart() {
    localStorage.setItem('allNightCart', JSON.stringify(cartItems));
}


function selectCountry(country) {
    document.getElementById('step-1-screen').classList.add('hidden');
    document.getElementById('step-2-screen').classList.remove('hidden');
    document.getElementById('form-japan').classList.add('hidden');
    document.getElementById('form-thailand').classList.add('hidden');

    if (country === 'japan') {
        document.getElementById('current-country-title').textContent = 'Japan Collection';
        document.getElementById('step-2-subtitle').textContent = 'Custom proxy orders across major Japanese online marketplaces and specialty stores.';
        document.getElementById('form-japan').classList.remove('hidden');
        renderCart();
    } else if (country === 'thailand') {
        document.getElementById('current-country-title').textContent = 'Thailand Routes';
        document.getElementById('step-2-subtitle').textContent = 'Select your preferred acquisition method for Thai retail spaces and marketplaces.';
        document.getElementById('form-thailand').classList.remove('hidden');
    }
}

function goBackToCountries() {
    document.getElementById('step-2-screen').classList.add('hidden');
    document.getElementById('form-japan').classList.add('hidden');
    document.getElementById('form-thailand').classList.add('hidden');
    document.getElementById('step-1-screen').classList.remove('hidden');
}


function addItemToCart() {
    const linkInput  = document.getElementById('item-link');
    const priceInput = document.getElementById('item-price');
    const fileInput  = document.getElementById('item-screenshot');

    const link     = linkInput.value.trim();
    const yenPrice = parseInt(priceInput.value);

    if (!link || isNaN(yenPrice) || yenPrice <= 0) {
        alert('Please fill out all product details correctly.');
        return;
    }
    if (fileInput.files.length === 0) {
        alert('Please select a verification screenshot.');
        return;
    }

    const newItem = {
        id:       Date.now(),
        link:     link,
        yen:      yenPrice,
        mmk:      Math.round(yenPrice * EXCHANGE_RATE),
        fileName: fileInput.files[0].name,
        checked:  true
    };

    cartItems.push(newItem);
    saveCart();
    renderCart();

    linkInput.value  = '';
    priceInput.value = '';
    fileInput.value  = '';
}

function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function toggleItemCheck(id) {
    const item = cartItems.find(item => item.id === id);
    if (item) {
        item.checked = !item.checked;
        saveCart();
    }
    calculateTotals();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    container.innerHTML = '';

    if (cartItems.length === 0) {
        container.innerHTML = '<p style="opacity:0.4; font-style:italic; padding: 1.5rem 0;">Your manifest registration is currently empty.</p>';
        calculateTotals();
        return;
    }

    cartItems.forEach(item => {
        const shortLink = item.link.length > 35 ? item.link.substring(0, 35) + '...' : item.link;
        const row = document.createElement('div');
        row.className = 'manifest-item';
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1.2rem;">
                <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItemCheck(${item.id})" style="accent-color: var(--text-espresso); transform: scale(1.1);">
                <div>
                    <a href="${item.link}" target="_blank" rel="noopener" class="manifest-link-text">${shortLink}</a>
                    <span class="manifest-subtext">File: ${item.fileName}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
                <span style="font-size: 1.05rem;">¥${item.yen.toLocaleString()}</span>
                <button type="button" class="delete-item-btn" onclick="removeItem(${item.id})">delete</button>
            </div>
        `;
        container.appendChild(row);
    });

    calculateTotals();
}

function calculateTotals() {
    const checked  = cartItems.filter(i => i.checked);
    const totalYen = checked.reduce((s, i) => s + i.yen, 0);
    const totalMMK = checked.reduce((s, i) => s + i.mmk, 0);

    const countEl = document.getElementById('summary-count');
    const yenEl   = document.getElementById('summary-yen');
    const mmkEl   = document.getElementById('summary-mmk');

    if (countEl) countEl.textContent = checked.length;
    if (yenEl)   yenEl.textContent   = '¥' + totalYen.toLocaleString();
    if (mmkEl)   mmkEl.textContent   = totalMMK.toLocaleString() + ' MMK';
}

function goToCheckout() {
    const active = cartItems.filter(i => i.checked);
    if (active.length === 0) {
        alert('Please register items to proceed.');
        return;
    }

    let totalMMK = 0;
    let summary  = '';

    active.forEach((item, index) => {
        totalMMK += item.mmk;
        summary  += `${index + 1}. ${item.link}\n   ¥${item.yen.toLocaleString()} (${item.mmk.toLocaleString()} MMK)\n\n`;
    });
    summary += `=========================\nTOTAL: ${totalMMK.toLocaleString()} MMK`;

    const encodedSummary = encodeURIComponent(summary);
    const encodedTotal   = encodeURIComponent(totalMMK.toLocaleString() + ' MMK');

    window.location.href = `/checkout?cart_summary=${encodedSummary}&order_total=${encodedTotal}`;
}


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items-container');
    if (container) renderCart();
});

function switchStep1Tab(targetTab) {
    const originTab = document.getElementById('tab-origin');
    const shippingTab = document.getElementById('tab-shipping');
    const originPanel = document.getElementById('panel-origin');
    const shippingPanel = document.getElementById('panel-shipping');

    if (targetTab === 'origin') {
        originTab.style.opacity = '1';
        shippingTab.style.opacity = '0.4';
        originPanel.classList.remove('hidden');
        shippingPanel.classList.add('hidden');
    } else {
        originTab.style.opacity = '0.4';
        shippingTab.style.opacity = '1';
        originPanel.classList.add('hidden');
        shippingPanel.classList.remove('hidden');
    }
}

let currentMenuState = 'origin'; 
let isMenuTransitioning = false; 

function rotateSelection() {
    if (isMenuTransitioning) return;
    isMenuTransitioning = true;

    const originTitle = document.getElementById('carousel-title-origin');
    const shippingTitle = document.getElementById('carousel-title-shipping');
    const originPanel = document.getElementById('panel-origin');
    const shippingPanel = document.getElementById('panel-shipping');

    if (currentMenuState === 'origin') {
        currentMenuState = 'shipping';

        
        originTitle.style.opacity = '0';
        originPanel.style.opacity = '0';
        originPanel.style.transform = 'translateY(-15px)';

    
        setTimeout(() => {
            originTitle.classList.add('hidden');
            originPanel.classList.add('hidden');

            shippingTitle.classList.remove('hidden');
            shippingPanel.classList.remove('hidden');

      
            setTimeout(() => {
                shippingTitle.style.opacity = '1';
                shippingPanel.style.opacity = '1';
                shippingPanel.style.transform = 'translateY(0)';
                isMenuTransitioning = false; 
            }, 50);
        }, 300);

    } else {
        currentMenuState = 'origin';

        shippingTitle.style.opacity = '0';
        shippingPanel.style.opacity = '0';
        shippingPanel.style.transform = 'translateY(15px)';

        setTimeout(() => {
            shippingTitle.classList.add('hidden');
            shippingPanel.classList.add('hidden');

            originTitle.classList.remove('hidden');
            originPanel.classList.remove('hidden');

    
            setTimeout(() => {
                originTitle.style.opacity = '1';
                originPanel.style.opacity = '1';
                originPanel.style.transform = 'translateY(0)';
                isMenuTransitioning = false;
            }, 50);
        }, 300);
    }
}