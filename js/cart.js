// ===== CART MODULE ===== //
const Cart = {
  items: JSON.parse(localStorage.getItem('cart')) || [],

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  updateCount() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
      cartCountElement.classList.add('pulse');
      setTimeout(() => cartCountElement.classList.remove('pulse'), 500);
    }
  },

  add(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      this.items.push({ ...product, quantity: product.quantity || 1 });
    }
    this.save();
    this.updateCount();
  },

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
    this.render();
  },

  changeQuantity(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      this.save();
      this.render();
    }
  },

  render() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-message');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (!container) return;

    container.innerHTML = '';
    if (this.items.length === 0) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    } else {
      if (emptyMsg) emptyMsg.style.display = 'none';
    }

    let subtotal = 0;
    this.items.forEach(item => {
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
  },

  handleEvents() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.minus-btn, .plus-btn, .remove-btn');
      if (!btn) return;
      const productId = parseInt(btn.dataset.id);

      if (btn.classList.contains('minus-btn')) {
        this.changeQuantity(productId, -1);
      } else if (btn.classList.contains('plus-btn')) {
        this.changeQuantity(productId, 1);
      } else if (btn.classList.contains('remove-btn')) {
        this.remove(productId);
      }
    });

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          alert('Your cart is empty!');
        } else {
          alert('Proceeding to checkout!');
          // window.location.href = 'checkout.html'; // Uncomment if needed
        }
      });
    }
  },

  init() {
    this.updateCount();
    if (document.getElementById('cart-items-container')) {
      this.render();
      this.handleEvents();
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
});

// Make addToCart globally accessible
window.addToCart = (product) => Cart.add(product);
window.addEventListener('DOMContentLoaded', () => {
  loadCartItems();
  updateCartCount();
});

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items-container');
  const emptyMsg = document.getElementById('empty-cart-message');
  const summaryContainer = document.getElementById('cart-summary-container');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  container.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    summaryContainer.style.display = 'none';
    return;
  }

  emptyMsg.style.display = 'none';
  summaryContainer.style.display = 'block';

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">P${item.price.toFixed(2)}</div>
        <div class="cart-item-actions">
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">−</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i> Remove</button>
        </div>
      </div>
    `;
    container.appendChild(itemEl);
  });

  subtotalEl.textContent = `P${subtotal.toFixed(2)}`;
  totalEl.textContent = `P${subtotal.toFixed(2)}`; // No shipping cost
}

function changeQuantity(index, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartCount();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartCount();
}

