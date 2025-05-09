// cart.js - Complete working solution
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count in header
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    }
    
    // Render cart items on cart page
    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('empty-cart-message');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (cart.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            if (subtotalEl) subtotalEl.textContent = '₱0.00';
            if (totalEl) totalEl.textContent = '₱0.00';
            return;
        }
        
        if (emptyMsg) emptyMsg.style.display = 'none';
        
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">₱${item.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-btn" data-id="${item.id}">
                                <i class="fas fa-trash-alt"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });
        
        if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `₱${subtotal.toFixed(2)}`;
    }
    
    // Handle quantity changes and removal
    function handleCartEvents() {
        document.addEventListener('click', function(e) {
            // Handle minus button
            if (e.target.classList.contains('minus-btn')) {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity = Math.max(1, item.quantity - 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    updateCartCount();
                }
            }
            
            // Handle plus button
            if (e.target.classList.contains('plus-btn')) {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    updateCartCount();
                }
            }
            
            // Handle remove button
            if (e.target.classList.contains('remove-btn')) {
                const id = e.target.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            }
        });
    }
    
    // Initialize cart
    updateCartCount();
    renderCart();
    handleCartEvents();
    
    // Make addToCart available globally
    window.addToCart = function(product) {
        // Convert price from "P399.99" to 399.99
        const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: numericPrice,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save to localStorage and update UI
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Added ${product.name} to cart</span>
            <a href="cart.html">View Cart</a>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
});
