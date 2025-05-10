// cart.js - Complete Working Solution
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count in header
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }
    
    // Render cart items
    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('empty-cart-message');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (cart.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            document.getElementById('subtotal').textContent = 'P0.00';
            document.getElementById('total').textContent = 'P0.00';
            return;
        }
        
        if (emptyMsg) emptyMsg.style.display = 'none';
        
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">P${item.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-btn" data-id="${item.id}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        document.getElementById('subtotal').textContent = `P${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `P${subtotal.toFixed(2)}`;
    }
    
    // Handle cart interactions
    function handleCartEvents() {
        document.addEventListener('click', function(e) {
            // Quantity decrease
            if (e.target.classList.contains('minus-btn')) {
                const id = e.target.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) item.quantity = Math.max(1, item.quantity - 1);
                saveCart();
            }
            
            // Quantity increase
            if (e.target.classList.contains('plus-btn')) {
                const id = e.target.dataset.id;
                const item = cart.find(i => i.id === id);
                if (item) item.quantity += 1;
                saveCart();
            }
            
            // Remove item
            if (e.target.classList.contains('remove-btn')) {
                const id = e.target.dataset.id;
                cart = cart.filter(i => i.id !== id);
                saveCart();
            }
        });
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
    
    // Initialize cart
    updateCartCount();
    renderCart();
    handleCartEvents();
    
    // Global function to add items
    window.addToCart = function(product) {
        // Convert price from "P399.99" to number
        const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
        
        // Check if item exists
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCart();
        
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification show';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Added ${product.name} to cart</span>
            <a href="cart.html">View Cart</a>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
});
