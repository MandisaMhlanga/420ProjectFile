// ===== CART FUNCTIONALITY ===== //
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in header
function updateCartCount() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
    cartCountElement.classList.add('pulse');
    setTimeout(() => cartCountElement.classList.remove('pulse'), 500);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Add to cart (call this from product pages)
function addToCart(product) {
  const existingItem = cartItems.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cartItems.push({ ...product, quantity: product.quantity || 1 });
  }
  saveCart();
  updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

// Render cart items (only on cart.html)
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');

  if (!cartItemsContainer) return; // Skip if not on cart page

  // Clear existing items
  cartItemsContainer.innerHTML = '';
  if (cartItems.length === 0) {
    emptyCartMessage.style.display = 'block';
    return;
  } else {
    emptyCartMessage.style.display = 'none';
  }

  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
    const itemHTML = `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
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
    cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  totalElement.textContent = `$${subtotal.toFixed(2)}`;
}

// Event listeners for cart buttons
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Only run cart-specific code on cart.html
  if (document.getElementById('cart-items-container')) {
    renderCart();

    // Handle quantity changes and removals
    document.getElementById('cart-items-container').addEventListener('click', (e) => {
      const target = e.target.closest('.minus-btn, .plus-btn, .remove-btn');
      if (!target) return;

      const productId = parseInt(target.dataset.id);
      const item = cartItems.find(item => item.id === productId);

      if (target.classList.contains('minus-btn')) {
        item.quantity = Math.max(1, item.quantity - 1);
      } else if (target.classList.contains('plus-btn')) {
        item.quantity += 1;
      } else if (target.classList.contains('remove-btn')) {
        removeFromCart(productId);
      }

      saveCart();
      renderCart();
    });

    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
      } else {
        alert('Proceeding to checkout!');
        // window.location.href = "checkout.html"; // Uncomment in real implementation
      }
    });
  }
});

// Make addToCart available globally
window.addToCart = addToCart;
