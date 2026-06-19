// js/cart-count.js - Cart count functionality
async function updateCartCountGlobal() {
    try {
        const response = await fetch('/api/cart/count', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(el => {
                if (data.success) {
                    el.textContent = data.count;
                }
            });
        }
    } catch (error) {
        // Silently fail - user might not be logged in
        console.log('Cart count update failed (normal if not logged in)');
    }
}

// Update on page load
document.addEventListener('DOMContentLoaded', updateCartCountGlobal);

// Make function available globally
window.updateCartCountGlobal = updateCartCountGlobal;