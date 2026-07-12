document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('success') === 'true') {
        // Clear all cart items, pricing details, and the random code on completion
        localStorage.removeItem('allNightCart'); 
        localStorage.removeItem('cart_summary');
        localStorage.removeItem('order_total');
        localStorage.removeItem('checkout_random_code'); // Clean up the code
        
        // Render the manual confirmation success message screen
        document.getElementById('success-container').style.setProperty('display', 'block');
        document.getElementById('fillout-container').style.setProperty('display', 'none');
    } else {
        // WE ARE ENTERING CHECKOUT: Safeguard data parameters from order.html
        let parametersChanged = false;

        // Pull backup details from storage if URL parameters ever clear out accidentally
        const savedSummary = localStorage.getItem('cart_summary');
        const savedTotal = localStorage.getItem('order_total');
        let savedCode = localStorage.getItem('checkout_random_code');

        // 1. Handle Cart Summary Backup
        if (!urlParams.has('cart_summary') && savedSummary) {
            urlParams.set('cart_summary', savedSummary);
            parametersChanged = true;
        }
        
        // 2. Handle Order Total Backup
        if (!urlParams.has('order_total') && savedTotal) {
            urlParams.set('order_total', savedTotal);
            parametersChanged = true;
        }

        // 3. Handle Random Code Generation & Backup
        // If it's not in the URL and not in storage, create a brand new one
        if (!urlParams.has('random_code') && !savedCode) {
            const randomDigits = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
            savedCode = `ANTYJP-${randomDigits}`;
            localStorage.setItem('checkout_random_code', savedCode);
        }

        // Push the random code into the URL parameter if it isn't already there
        if (!urlParams.has('random_code')) {
            urlParams.set('random_code', savedCode);
            parametersChanged = true;
        }

        // If data was recovered or generated, cleanly inject it back into the browser URL
        if (parametersChanged) {
            const freshUrlPath = window.location.pathname + '?' + urlParams.toString();
            window.history.replaceState(null, '', freshUrlPath);
        }

        // NOW load the Fillout embed engine script so it inherits the finalized URL parameters perfectly
        const filloutEmbedScript = document.createElement('script');
        filloutEmbedScript.src = "https://server.fillout.com/embed/v1/";
        document.body.appendChild(filloutEmbedScript);

        // Display Fillout checkout and payment wizard window safely
        document.getElementById('fillout-container').style.setProperty('display', 'block');
        document.getElementById('success-container').style.setProperty('display', 'none'); // Fixed the bug here!
    }
});