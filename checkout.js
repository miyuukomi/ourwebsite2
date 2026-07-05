document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('success') === 'true') {
        // Clear all cart items and pricing details from memory on completion
        localStorage.removeItem('allNightCart'); 
        localStorage.removeItem('cart_summary');
        localStorage.removeItem('order_total');
        
        // Render the manual confirmation success message screen
        document.getElementById('success-container').style.setProperty('display', 'block');
        document.getElementById('fillout-container').style.setProperty('display', 'none');
    } else {
        // WE ARE ENTERING CHECKOUT: Safeguard data parameters from order.html
        let parametersChanged = false;

        // Pull backup details from storage if URL parameters ever clear out accidentally
        const savedSummary = localStorage.getItem('cart_summary');
        const savedTotal = localStorage.getItem('order_total');

        if (!urlParams.has('cart_summary') && savedSummary) {
            urlParams.set('cart_summary', savedSummary);
            parametersChanged = true;
        }
        if (!urlParams.has('order_total') && savedTotal) {
            urlParams.set('order_total', savedTotal);
            parametersChanged = true;
        }

        // If data was recovered from storage, cleanly inject it back into the browser URL
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
        document.getElementById('success-container').style.setProperty('none');
    }
});