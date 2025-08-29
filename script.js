// script.js (Upgraded and Final Version)
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Add to Cart Logic (Upgraded with Quantity) ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseFloat(this.dataset.price);
            
            // For GA: Send an 'add_to_cart' event
            if (typeof gtag === 'function') {
                gtag('event', 'add_to_cart', {
                    'event_category': 'ecommerce',
                    'event_label': product,
                    'value': price,
                    'items': [{
                        'item_name': product,
                        'price': price,
                        'quantity': 1
                    }]
                });
            }
            
            alert(`${product} has been added to your cart!`);

            // Handle quantities in the cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProductIndex = cart.findIndex(item => item.product === product);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({ product, price, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });

    // --- Display Cart Items on Cart Page (Upgraded with Remove button & Quantity) ---
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        renderCart(); // Use a function to render the cart
    }
    
    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const checkoutBtn = document.getElementById('checkout-btn');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        cartItemsContainer.innerHTML = '';

        if (cart.length > 0) {
            let total = 0;
            let itemsHtml = '<ul>';
            cart.forEach((item, index) => {
                itemsHtml += `<li>${item.product} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)} 
                                <button class="remove-btn" data-index="${index}">Remove</button> 
                             </li>`;
                total += item.price * item.quantity;
            });
            itemsHtml += '</ul>';
            itemsHtml += `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;
            cartItemsContainer.innerHTML = itemsHtml;
            checkoutBtn.style.display = 'inline-block';
            
            localStorage.setItem('cartTotal', total.toFixed(2));

        } else {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            checkoutBtn.style.display = 'none';
            localStorage.removeItem('cartTotal');
        }
        
        addRemoveListeners();
    }
    
    function addRemoveListeners() {
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const indexToRemove = parseInt(this.dataset.index, 10);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                const removedItem = cart[indexToRemove];
                if (typeof gtag === 'function' && removedItem) {
                    gtag('event', 'remove_from_cart', {
                        'event_category': 'ecommerce',
                        'event_label': removedItem.product,
                        'value': removedItem.price,
                        'items': [{
                            'item_name': removedItem.product,
                            'price': removedItem.price,
                            'quantity': removedItem.quantity
                        }]
                    });
                }
                
                cart.splice(indexToRemove, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    // --- Checkout Form Logic ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            if (typeof gtag === 'function') {
                gtag('event', 'begin_checkout', {
                    'event_category': 'ecommerce',
                    'event_label': 'User started checkout'
                });
            }
        });
    }

    // --- Thank You Page Logic (Upgraded with Dynamic Value) ---
    if (window.location.pathname.endsWith('thankyou.html')) {
        const cartTotal = localStorage.getItem('cartTotal');

        if (typeof gtag === 'function' && cartTotal) {
            gtag('event', 'purchase', {
                'transaction_id': `T${Math.floor(Math.random() * 10000)}`,
                'value': parseFloat(cartTotal),
                'currency': 'USD',
                'event_category': 'ecommerce',
                'event_label': 'Successful Order'
            });
        }
        
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTotal');
    }

    // --- NEW: Initialize AOS (Animate On Scroll) ---
    // This code looks for elements with `data-aos` attributes and animates them.
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800, // Duration of animation in milliseconds
            once: true,     // Animation happens only once
        });
    }
});