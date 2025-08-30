document.addEventListener('DOMContentLoaded', function() {

    // --- Product Database ---
    const products = {
        's25': { id: 's25', name: 'Galaxy S25', price: 799.99, image: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lfGVufDB8fHx8MTY5OTk4ODg4Mg&ixlib=rb-4.0.3&q=80&w=1080', description: 'Experience the perfect balance of power and style. The Galaxy S25 features a stunning display, a powerful new processor, and an advanced camera system for everyday brilliance.' },
        's25plus': { id: 's25plus', name: 'Galaxy S25 Plus', price: 999.99, image: 'https://images.unsplash.com/photo-1605236459359-99376ceabeaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwyfHxzbWFydHBob25lfGVufDB8fHx8MTY5OTk4ODg4Mg&ixlib=rb-4.0.3&q=80&w=1080', description: 'Go bigger and bolder with the S25 Plus. Enjoy a larger, more immersive screen, all-day battery life, and enhanced performance for gaming and productivity.' },
        's25edge': { id: 's25edge', name: 'Galaxy S25 Edge', price: 1099.99, image: 'https://images.unsplash.com/photo-1589739900223-4537b017227f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHwzfHxzbWFydHBob25lfGVufDB8fHx8MTY5OTk4ODg4Mg&ixlib=rb-4.0.3&q=80&w=1080', description: 'Immerse yourself in a truly captivating view with the S25 Edge. The stunning curved display offers a unique aesthetic and an unparalleled media-watching experience.' },
        's25ultra': { id: 's25ultra', name: 'Galaxy S25 Ultra', price: 1299.99, image: 'https://images.unsplash.com/photo-1598327105553-691316b67b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDcxMzJ8MHwxfHNlYXJjaHw0fHxzbWFydHBob25lfGVufDB8fHx8MTY5OTk4ODg4Mg&ixlib=rb-4.0.3&q=80&w=1080', description: 'Unleash the ultimate mobile experience. The S25 Ultra is packed with our most advanced pro-grade camera system, the fastest processor, and a dynamic display for power users.' },
    };

    // --- Product Detail Page Logic ---
    if (document.getElementById('product-detail-content')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products[productId];

        const contentDiv = document.getElementById('product-detail-content');
        if (product) {
            document.title = `${product.name} | Ansh-Mart`;
            contentDiv.innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                    <button class="btn add-to-cart" data-product="${product.name}" data-price="${product.price}">Add to Cart</button>
                </div>
            `;
            // Re-attach event listeners for the new button
            attachAddToCartListeners();
        } else {
            contentDiv.innerHTML = `<p>Product not found.</p>`;
        }
    }

    // --- Add to Cart Logic ---
    function attachAddToCartListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                // Prevent link navigation if button is inside a link
                event.preventDefault();
                event.stopPropagation();

                const product = this.dataset.product;
                const price = parseFloat(this.dataset.price);

                alert(`${product} has been added to your cart!`);

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
    }
    attachAddToCartListeners(); // Initial call for product page

    // --- Cart Page & Order History Logic ---
    if (document.getElementById('cart-items')) renderCart();
    if (document.getElementById('order-history-content')) renderOrderHistory();

    function renderCart() {
        // ... (existing renderCart function)
    }

    function renderOrderHistory() {
        const historyContainer = document.getElementById('order-history-content');
        const orders = JSON.parse(localStorage.getItem('orders')) || [];

        if (orders.length > 0) {
            let historyHtml = '';
            orders.forEach(order => {
                historyHtml += `
                    <div class="order-card">
                        <div class="order-header">
                            <span>Order ID: ${order.id}</span>
                            <span>Total: $${order.total.toFixed(2)}</span>
                        </div>
                        <div class="order-items">
                `;
                order.items.forEach(item => {
                    historyHtml += `<div class="order-item"><span>${item.product} (x${item.quantity})</span><span>$${(item.price * item.quantity).toFixed(2)}</span></div>`;
                });
                historyHtml += `</div></div>`;
            });
            historyContainer.innerHTML = historyHtml;
        }
    }
    
    // --- Checkout & Thank You Page Logic ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            // ... (existing checkout logic)
        });
    }

    if (window.location.pathname.endsWith('thankyou.html')) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

        if (cart.length > 0) {
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            const newOrder = {
                id: `AM-${Math.floor(Math.random() * 100000)}`,
                items: cart,
                total: cartTotal
            };
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
        }

        // ... (existing GTM purchase event logic)

        localStorage.removeItem('cart');
    }
    
    // --- Initialize AOS ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
        });
    }
});