// Cart Management System
console.log("Cart system initialized");

// Initialize cart if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Add product to cart
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    animateCart();
}

// Cart animation
function animateCart() {
    document.querySelectorAll('.cart-count').forEach(el => {
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 500);
    });
}

// Display cart items
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Continue shopping to add items to your cart</p>
            <a href="products.html" class="btn" style="margin-top: 20px;">Continue Shopping</a>
          </div>
        `;
        cartSummaryContainer.innerHTML = '';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">${item.price}</p>
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease-btn">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn increase-btn">+</button>
            </div>
            <button class="remove-btn">Remove</button>
          </div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('P', '').replace(',', ''));
        return total + (price * item.quantity);
    }, 0);
    
    cartSummaryContainer.innerHTML = `
        <p>Items (${cart.reduce((total, item) => total + item.quantity, 0)})</p>
        <p>Subtotal: P${subtotal.toFixed(2)}</p>
        <p class="cart-total">Total: P${subtotal.toFixed(2)}</p>
    `;
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}

// Remove cart item
function removeCartItem(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    displayCartItems();
    updateCartCount();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.querySelector('img').src.split('/').pop().split('.')[0],
                name: productCard.querySelector('h3').textContent,
                price: productCard.querySelector('.price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            addToCart(product);
        }
        
        // Quantity adjustments
        if (e.target.classList.contains('decrease-btn')) {
            const itemId = e.target.closest('.cart-item').dataset.id;
            updateCartItemQuantity(itemId, -1);
        }
        
        if (e.target.classList.contains('increase-btn')) {
            const itemId = e.target.closest('.cart-item').dataset.id;
            updateCartItemQuantity(itemId, 1);
        }
        
        if (e.target.classList.contains('remove-btn')) {
            const itemId = e.target.closest('.cart-item').dataset.id;
            removeCartItem(itemId);
        }
    });
    
    // Display cart items if on cart page
    if (document.getElementById('cart-items-container')) {
        displayCartItems();
    }
});
