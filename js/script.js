import { Cart } from "./cart.js";

const cart = new Cart();

// =========================
// 🏷️ Toast Notification
// =========================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// =========================
// 🛒 Update Navbar Count
// =========================
function updateCartCount() {
  const countEl = document.querySelector("#cartIcon .cart-count");
  if (countEl) {
    const count = cart.getItemCount();
    countEl.textContent = count;
    console.log("📊 Cart count updated:", count);
  }
}

// =========================
// ✨ Animasi Terbang ke Cart
// =========================
function flyToCart(imgEl) {
  const cartIcon = document.querySelector("#cartIcon");
  if (!cartIcon || !imgEl) return;

  const imgClone = imgEl.cloneNode(true);
  const rect = imgEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  imgClone.style.position = "fixed";
  imgClone.style.top = `${rect.top}px`;
  imgClone.style.left = `${rect.left}px`;
  imgClone.style.width = `${rect.width}px`;
  imgClone.style.height = `${rect.height}px`;
  imgClone.style.transition = "all 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19)";
  imgClone.style.zIndex = "9999";
  imgClone.style.borderRadius = "10px";
  imgClone.style.pointerEvents = "none";
  document.body.appendChild(imgClone);

  setTimeout(() => {
    imgClone.style.top = `${cartRect.top + 10}px`;
    imgClone.style.left = `${cartRect.left + 10}px`;
    imgClone.style.width = "30px";
    imgClone.style.height = "30px";
    imgClone.style.opacity = "0.3";
  }, 10);

  setTimeout(() => {
    imgClone.remove();
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 500);
  }, 900);
}

// =========================
// 🛍️ Tambah ke Keranjang
// =========================
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart")) {
    e.preventDefault();
    
    const card = e.target.closest(".product-card");
    if (!card) {
      console.error("❌ Product card tidak ditemukan");
      return;
    }

    const imgEl = card.querySelector("img");
    if (imgEl) {
      flyToCart(imgEl);
    }

    const nameEl = card.querySelector("h3");
    const priceAttr = card.dataset.price;
    const idAttr = card.dataset.id;
    const categoryAttr = card.dataset.category;

    if (!nameEl || !priceAttr || !idAttr) {
      console.error("❌ Data produk tidak lengkap", { nameEl, priceAttr, idAttr });
      showToast("❌ Gagal menambahkan produk", "error");
      return;
    }

    const product = {
      id: idAttr,
      name: nameEl.textContent.trim(),
      price: parseInt(priceAttr, 10),
      image: imgEl ? imgEl.src : "",
      category: categoryAttr || "general",
      quantity: 1
    };

    console.log("✅ Menambahkan produk:", product);
    cart.add(product);
    updateCartCount();
    showToast(`✅ ${product.name} ditambahkan ke keranjang!`);
  }
});

// =========================
// 🛒 Render Halaman Cart
// =========================
function initCartPage() {
  const container = document.querySelector(".cart-container");
  if (!container) {
    console.log("ℹ️ Bukan halaman cart");
    return;
  }

  console.log("🛒 Initializing cart page...");
  console.log("📦 Cart items:", cart.items);

  function renderCart() {
    const items = cart.items;
    
    console.log("🔄 Rendering cart with", items.length, "items");
    console.log("📦 Raw items data:", JSON.stringify(items, null, 2));

    // Filter item yang valid
    const validItems = items.filter(i => {
      const isValid = i && i.id && i.name && i.price && i.quantity;
      if (!isValid) {
        console.warn("⚠️ Invalid item detected:", i);
      }
      return isValid;
    });

    console.log("✅ Valid items:", validItems.length);

    if (!validItems || validItems.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Keranjang Masih Kosong</h3>
          <p>Temukan koleksi luxury terbaik dari QianlunShop</p>
          <a href="products.html" class="btn btn-primary">Jelajahi Koleksi</a>
        </div>
      `;
      
      // Jika ada item invalid, bersihkan
      if (items.length > 0) {
        console.warn("🧹 Cleaning invalid items from cart");
        cart.items = validItems;
        cart.save();
        updateCartCount();
      }
      return;
    }

    const subtotal = validItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalFormatted = subtotal.toLocaleString("id-ID");
    
    const itemsHTML = validItems.map(i => {
      console.log("Rendering item:", {
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      });
      
      const itemPrice = (i.price || 0).toLocaleString("id-ID");
      const itemTotal = (i.price * i.quantity).toLocaleString("id-ID");
      const fallbackImage = i.image || '../assets/sample1.jpg';
      
      return `
        <div class="cart-item" data-id="${i.id}">
          <img src="${fallbackImage}" alt="${i.name}" onerror="this.src='../assets/sample1.jpg'">
          <div class="cart-info">
            <h3>${i.name}</h3>
            <p class="item-price">Rp ${itemPrice}</p>
            <div class="cart-actions">
              <button class="decrease-quantity" data-id="${i.id}">-</button>
              <input type="number" value="${i.quantity}" min="1" class="quantity-input" data-id="${i.id}" readonly>
              <button class="increase-quantity" data-id="${i.id}">+</button>
            </div>
          </div>
          <div class="item-total-section">
            <p class="item-total">Rp ${itemTotal}</p>
            <button class="remove-item" data-id="${i.id}" title="Hapus item">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="cart-with-items">
        <div class="cart-items">
          ${itemsHTML}
        </div>

        <div class="cart-summary">
          <h3>Ringkasan Pesanan</h3>
          
          <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span id="cartSubtotal">Rp ${subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div class="summary-row">
              <span>Pengiriman:</span>
              <span id="cartShipping">Gratis</span>
            </div>
            <div class="summary-row discount">
              <span>Diskon:</span>
              <span>- Rp 0</span>
            </div>
            <div class="summary-row grand-total">
              <span>Total:</span>
              <span id="cartTotal">Rp ${totalFormatted}</span>
            </div>
          </div>

          <!-- Promo Code Section -->
          <div class="promo-section">
            <label for="cartPromoCode">Kode Promo</label>
            <div class="promo-input-group">
              <input type="text" id="cartPromoCode" placeholder="Masukkan kode promo">
              <button class="btn btn-promo" id="applyCartPromo">Terapkan</button>
            </div>
          </div>

          <!-- Checkout Actions -->
          <div class="checkout-actions">
            <a href="checkout.html" class="btn btn-checkout" id="proceedToCheckout">
              🛍️ Lanjutkan ke Checkout
            </a>
            <a href="products.html" class="btn btn-secondary">Lanjutkan Belanja</a>
          </div>

          <!-- Security Badge -->
          <div class="security-badge">
            <p>🔒 Transaksi 100% Aman & Terenkripsi</p>
          </div>
        </div>
      </div>
    `;

    // Add event listeners for new elements
    attachCartEventListeners();
    console.log("✅ Cart rendered successfully");
  }

  function attachCartEventListeners() {
    // Quantity increase
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const item = cart.items.find(i => i.id === productId);
        if (item) {
          console.log("➕ Increasing quantity for:", productId);
          cart.update(productId, item.quantity + 1);
          renderCart();
          updateCartCount();
        }
      });
    });

    // Quantity decrease
    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const item = cart.items.find(i => i.id === productId);
        if (item && item.quantity > 1) {
          console.log("➖ Decreasing quantity for:", productId);
          cart.update(productId, item.quantity - 1);
          renderCart();
          updateCartCount();
        }
      });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        console.log("🗑️ Removing item:", productId);
        cart.remove(productId);
        renderCart();
        updateCartCount();
        showToast("🗑️ Item dihapus dari keranjang", "error");
      });
    });

    // Checkout validation
    const checkoutBtn = document.getElementById('proceedToCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function(e) {
        const cartItems = cart.items;
        if (cartItems.length === 0) {
          e.preventDefault();
          showToast('❌ Keranjang kosong. Tambahkan produk terlebih dahulu.', 'error');
        }
      });
    }

    // Promo code
    const applyPromoBtn = document.getElementById('applyCartPromo');
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', function() {
        const promoCode = document.getElementById('cartPromoCode').value;
        if (promoCode === 'QIANLUN10') {
          showToast('🎉 Diskon 10% berhasil diterapkan!', 'success');
        } else if (promoCode) {
          showToast('❌ Kode promo tidak valid', 'error');
        }
      });
    }
  }

  renderCart();
}

// =========================
// 💳 Checkout Page Integration
// =========================
function initCheckoutPage() {
  const checkoutContainer = document.querySelector(".checkout-container");
  if (!checkoutContainer) {
    console.log("ℹ️ Bukan halaman checkout");
    return;
  }

  console.log("💳 Initializing checkout page...");
  
  const checkoutManager = new CheckoutManager();
}

// =========================
// 🔍 SEARCH & FILTER LOGIC
// =========================
function initProductFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetBtn = document.getElementById('resetFilter');
  const productGrid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');

  // Check if we're on products page
  if (!searchInput || !productGrid) {
    console.log("ℹ️ Not on products page, skipping filter initialization");
    return;
  }

  console.log("🔍 Initializing product filters...");

  // Get all products
  let allProducts = Array.from(productGrid.querySelectorAll('.product-card'));

  // Store original order
  const originalProducts = [...allProducts];

  // Update result count
  function updateResultCount(count) {
    if (resultCount) {
      resultCount.textContent = count;
    }
  }

  // Apply all filters
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    console.log("🔄 Applying filters:", { searchTerm, category, sortBy });

    // Filter products
    let filteredProducts = allProducts.filter(product => {
      const name = product.dataset.name.toLowerCase();
      const productCategory = product.dataset.category;

      // Search filter
      const matchesSearch = searchTerm === '' || name.includes(searchTerm);

      // Category filter
      const matchesCategory = category === 'all' || productCategory === category;

      return matchesSearch && matchesCategory;
    });

    // Sort products
    if (sortBy !== 'default') {
      filteredProducts.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        const nameA = a.dataset.name.toLowerCase();
        const nameB = b.dataset.name.toLowerCase();

        switch (sortBy) {
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          case 'name-asc':
            return nameA.localeCompare(nameB);
          case 'name-desc':
            return nameB.localeCompare(nameA);
          default:
            return 0;
        }
      });
    }

    // Update DOM
    updateProductDisplay(filteredProducts);
  }

  // Update product display
  function updateProductDisplay(filteredProducts) {
    // Hide all products first
    allProducts.forEach(product => {
      product.classList.add('hidden');
      product.classList.remove('visible');
    });

    // Clear grid
    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      // Show no results message
      noResults.style.display = 'block';
      updateResultCount(0);
    } else {
      // Hide no results message
      noResults.style.display = 'none';

      // Show filtered products with animation
      filteredProducts.forEach((product, index) => {
        product.classList.remove('hidden');
        product.classList.add('visible');
        product.style.animationDelay = `${index * 0.1}s`;
        productGrid.appendChild(product);
      });

      updateResultCount(filteredProducts.length);
    }

    console.log("✅ Displayed", filteredProducts.length, "products");
  }

  // Reset filters
  function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    
    // Restore original order
    allProducts = [...originalProducts];
    updateProductDisplay(allProducts);
    
    console.log("🔄 Filters reset");
    showToast("🔄 Filter direset", "success");
  }

  // Event listeners
  searchInput.addEventListener('input', () => {
    console.log("🔍 Search:", searchInput.value);
    applyFilters();
  });

  categoryFilter.addEventListener('change', () => {
    console.log("📁 Category:", categoryFilter.value);
    applyFilters();
  });

  sortFilter.addEventListener('change', () => {
    console.log("🔢 Sort:", sortFilter.value);
    applyFilters();
  });

  resetBtn.addEventListener('click', resetFilters);

  // Initial count
  updateResultCount(allProducts.length);
  console.log("✅ Product filters initialized with", allProducts.length, "products");
}

// =========================
// 🚀 Initialize on Load
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 QianlunShop script loaded");
  console.log("📦 Initial cart state:", cart.items);
  console.log("🔢 Total items:", cart.getItemCount());
  
  updateCartCount();
  initCartPage();
  initCheckoutPage();
  initProductFilters();
});

// =========================
// 🐛 Debug Helper (Optional - hapus di production)
// =========================
window.debugCart = () => {
  console.log("=== CART DEBUG ===");
  console.log("Items:", cart.items);
  console.log("Count:", cart.getItemCount());
  console.log("Total:", cart.getTotal());
  console.log("localStorage:", localStorage.getItem('qianlunshop_cart'));
};

// Export showToast untuk digunakan di file lain
window.showToast = showToast;

// =========================
// 💳 Checkout Manager Class
// =========================
class CheckoutManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('qianlunshop_cart')) || [];
    this.shippingCost = 0;
    this.discount = 0;
    this.init();
  }

  init() {
    this.displayCheckoutItems();
    this.calculateTotals();
    this.setupEventListeners();
    this.updateCartCount();
  }

  displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    
    if (this.cart.length === 0) {
      checkoutItems.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Keranjang Kosong</h3>
          <p>Silakan tambahkan produk ke keranjang terlebih dahulu</p>
          <a href="products.html" class="btn btn-primary">Belanja Sekarang</a>
        </div>
      `;
      return;
    }

    checkoutItems.innerHTML = this.cart.map(item => `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='../assets/sample1.jpg'">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>${this.formatCategory(item.category)}</p>
          <p>Qty: ${item.quantity}</p>
        </div>
        <div class="item-total">${this.formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');
  }

  calculateTotals() {
    const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update shipping cost based on selection
    const shippingSelect = document.getElementById('shipping');
    if (shippingSelect) {
      this.updateShippingCost(shippingSelect.value);
    }

    const grandTotal = subtotal + this.shippingCost - this.discount;

    // Update DOM
    document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
    document.getElementById('shippingCost').textContent = this.formatPrice(this.shippingCost);
    document.getElementById('grandTotal').textContent = this.formatPrice(grandTotal);
  }

  updateShippingCost(method) {
    switch(method) {
      case 'regular':
        this.shippingCost = 25000;
        break;
      case 'express':
        this.shippingCost = 50000;
        break;
      case 'same-day':
        this.shippingCost = 75000;
        break;
      default:
        this.shippingCost = 0;
    }
    this.calculateTotals();
  }

  setupEventListeners() {
    // Shipping method change
    const shippingSelect = document.getElementById('shipping');
    if (shippingSelect) {
      shippingSelect.addEventListener('change', (e) => {
        this.updateShippingCost(e.target.value);
      });
    }

    // Payment method change
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.getElementById('creditCardForm');
    
    paymentMethods.forEach(method => {
      method.addEventListener('change', (e) => {
        if (e.target.value === 'creditCard') {
          creditCardForm.style.display = 'block';
        } else {
          creditCardForm.style.display = 'none';
        }
      });
    });

    // Promo code
    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', () => {
        this.applyPromoCode();
      });
    }

    // Place order
    const placeOrderBtn = document.getElementById('placeOrder');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.placeOrder();
      });
    }

    // Form validation
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('input', this.validateForm.bind(this));
    }
  }

  applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
    const discountRules = {
      'WELCOME10': 0.1,    // 10% discount
      'DRAGON20': 0.2,     // 20% discount
      'QIANLUN15': 0.15,   // 15% discount
      'LUXURY25': 0.25     // 25% discount
    };

    if (discountRules[promoCode]) {
      const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      this.discount = subtotal * discountRules[promoCode];
      
      // Show success message
      showToast(`Promo code "${promoCode}" berhasil diterapkan!`, 'success');
      this.calculateTotals();
    } else {
      showToast('Kode promo tidak valid', 'error');
      this.discount = 0;
      this.calculateTotals();
    }
  }

  validateForm() {
    const form = document.getElementById('checkoutForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    // Check if payment method is selected
    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    if (!paymentSelected) {
      isValid = false;
    }

    // If credit card selected, validate card fields
    if (document.getElementById('creditCard').checked) {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
      cardFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
          isValid = false;
        }
      });
    }

    const placeOrderBtn = document.getElementById('placeOrder');
    if (placeOrderBtn) {
      placeOrderBtn.disabled = !isValid;
    }
    
    return isValid;
  }

  async placeOrder() {
    if (!this.validateForm()) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'error');
      return;
    }

    if (this.cart.length === 0) {
      showToast('Keranjang belanja kosong', 'error');
      return;
    }

    try {
      // Show loading state
      const placeOrderBtn = document.getElementById('placeOrder');
      const originalText = placeOrderBtn.innerHTML;
      placeOrderBtn.innerHTML = '🔄 Memproses...';
      placeOrderBtn.disabled = true;

      // Simulate API call
      await this.simulatePayment();

      // Create order object
      const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: [...this.cart],
        customerInfo: this.getCustomerInfo(),
        shipping: this.getShippingInfo(),
        payment: this.getPaymentInfo(),
        totals: {
          subtotal: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
          shipping: this.shippingCost,
          discount: this.discount,
          grandTotal: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0) + this.shippingCost - this.discount
        },
        status: 'completed'
      };

      // Save order to localStorage
      this.saveOrder(order);

      // Clear cart
      this.clearCart();

      // Show success message
      showToast('Pesanan berhasil diproses!', 'success');

      // Redirect to confirmation page
      setTimeout(() => {
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
      }, 2000);

    } catch (error) {
      console.error('Order error:', error);
      showToast('Terjadi kesalahan saat memproses pesanan', 'error');
      
      // Reset button
      const placeOrderBtn = document.getElementById('placeOrder');
      placeOrderBtn.innerHTML = '🛍️ Bayar Sekarang';
      placeOrderBtn.disabled = false;
    }
  }

  simulatePayment() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Payment failed'));
        }
      }, 2000);
    });
  }

  getCustomerInfo() {
    return {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      postalCode: document.getElementById('postalCode').value
    };
  }

  getShippingInfo() {
    const shippingSelect = document.getElementById('shipping');
    return {
      method: shippingSelect.value,
      cost: this.shippingCost,
      estimatedDelivery: this.getEstimatedDelivery(shippingSelect.value)
    };
  }

  getPaymentInfo() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const info = { method: paymentMethod };

    if (paymentMethod === 'creditCard') {
      info.cardLastFour = document.getElementById('cardNumber').value.slice(-4);
    }

    return info;
  }

  getEstimatedDelivery(method) {
    const today = new Date();
    switch(method) {
      case 'same-day':
        return new Date(today.setDate(today.getDate())).toLocaleDateString('id-ID');
      case 'express':
        return new Date(today.setDate(today.getDate() + 2)).toLocaleDateString('id-ID');
      case 'regular':
      default:
        return new Date(today.setDate(today.getDate() + 5)).toLocaleDateString('id-ID');
    }
  }

  saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('qianlun_orders')) || [];
    orders.push(order);
    localStorage.setItem('qianlun_orders', JSON.stringify(orders));
  }

  clearCart() {
    localStorage.removeItem('qianlunshop_cart');
    this.cart = [];
    this.updateCartCount();
  }

  updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
    }
  }

  formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatCategory(category) {
    const categories = {
      'watch': 'Luxury Watch',
      'bag': 'Luxury Bag',
      'shoes': 'Luxury Shoes',
      'wallet': 'Luxury Wallet'
    };
    return categories[category] || category;
  }
}