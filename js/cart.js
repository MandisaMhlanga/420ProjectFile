// cart.js - Complete corrected version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart with consistent key
    if (!localStorage.getItem('fabrixCart')) {
        localStorage.setItem('fabrixCart', JSON.stringify([]));
    }

    // Update cart count in header
    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    // Get current cart
    function getCart() {
        return JSON.parse(localStorage.getItem('fabrixCart')) || [];
    }

    // Save cart to storage
    function saveCart(cart) {
        localStorage.setItem('fabrixCart', JSON.stringify(cart));
        updateCartCount();
    }

    // Add animation to cart icon
    function animateCart() {
        const cartIcons = document.querySelectorAll('.cart-count');
        cartIcons.forEach(icon => {
            icon.classList.add('pulse');
            setTimeout(() => icon.classList.remove('pulse'), 500);
        });
    }

    // Add product to cart (now global)
    window.addToCart = function(product) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        saveCart(cart);
        animateCart();
        showCartNotification(product.name);
    };

    // Show cart notification
    function showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span>${productName} added to cart!</span>
            <a href="cart.html">View Cart</a>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Display cart items on cart page
    function displayCart() {
        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) return;

        const cart = getCart();
        const summaryContainer = document.getElementById('cart-summary');

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <h2>Your cart is empty</h2>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            summaryContainer.innerHTML = '';
            return;
        }

        // Render cart items
        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-btn">Remove</button>
                </div>
            </div>
        `).join('');

        // Calculate total with proper price parsing
        const subtotal = cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            return total + (price * item.quantity);
        }, 0);

        summaryContainer.innerHTML = `
            <p>Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p>Subtotal: ₱${subtotal.toFixed(2)}</p>
            <p class="cart-total">Total: ₱${subtotal.toFixed(2)}</p>
        `;
    }

    // Handle quantity changes
    function handleQuantityChange(itemElement, change) {
        const cart = getCart();
        const itemId = itemElement.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;

            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }

            saveCart(cart);
            displayCart();
        }
    }

    // Remove item from cart
    function removeItem(itemElement) {
        const cart = getCart();
        const itemId = itemElement.dataset.id;
        const updatedCart = cart.filter(item => item.id !== itemId);
        saveCart(updatedCart);
        displayCart();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Quantity controls
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('minus')) {
                handleQuantityChange(e.target.closest('.cart-item'), -1);
            }

            if (e.target.classList.contains('plus')) {
                handleQuantityChange(e.target.closest('.cart-item'), 1);
            }

            // Remove button
            if (e.target.classList.contains('remove-btn')) {
                removeItem(e.target.closest('.cart-item'));
            }
        });

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                alert('Proceeding to checkout!');
            });
        }
    }

    // Initialize everything
    updateCartCount();
    displayCart();
    setupEventListeners();

    // Update copyright year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
