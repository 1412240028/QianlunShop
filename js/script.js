// =========================
// 🛒 QIANLUNSHOP - MAIN SCRIPT
// WITH DELETE CONFIRMATION MODAL
// =========================

import { Cart } from "./cart.js";

// Single cart instance untuk seluruh aplikasi
const cart = new Cart();

// Global variable untuk delete confirmation
let itemToDelete = null;

// =========================
// 🏷️ TOAST NOTIFICATION
// =========================
function showToast(message, type = "success") {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Export untuk digunakan globally
window.showToast = showToast;

// =========================
// 🗑️ DELETE CONFIRMATION MODAL
// =========================
function showDeleteModal(productId, productName) {
  itemToDelete = productId;
  
  // Update nama produk di modal
  const productNameEl = document.getElementById('deleteProductName');
  if (productNameEl) {
    productNameEl.textContent = productName;
  }
  
  // Tampilkan modal
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.add('show');
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
}

function hideDeleteModal() {
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.remove('show');
  }
  itemToDelete = null;
  
  // Enable body scroll
  document.body.style.overflow = 'auto';
}

function confirmDeleteItem() {
  if (!itemToDelete) return;
  
  const item = cart.getItem(itemToDelete);
  if (!item) return;
  
  // Animasi hapus item
  const cartItemElement = document.querySelector(`[data-id="${itemToDelete}"]`);
  if (cartItemElement) {
    cartItemElement.classList.add('deleting');
    
    // Tunggu animasi selesai
    setTimeout(() => {
      // Hapus dari cart
      cart.remove(itemToDelete);
      
      // Re-render cart
      if (typeof renderCart === 'function') {
        renderCart();
      }
      
      // Update count
      updateCartCount();
      
      // Show success toast
      showToast(`✅ ${item.name} telah dihapus dari keranjang`, 'delete-success');
      
      // Cek apakah cart kosong
      if (cart.getItemCount() === 0) {
        showEmptyCartState();
      }
    }, 500);
  } else {
    // Jika element tidak ditemukan, langsung hapus
    cart.remove(itemToDelete);
    
    if (typeof renderCart === 'function') {
      renderCart();
    }
    
    updateCartCount();
    showToast(`✅ ${item.name} telah dihapus dari keranjang`, 'delete-success');
  }
  
  // Hide modal
  hideDeleteModal();
}

function showEmptyCartState() {
  const container = document.querySelector(".cart-container");
  if (!container) return;
  
  container.innerHTML = `
    <div class="cart-header">
      <h2>🛒 Keranjang Belanja Anda</h2>
      <p>Keranjang Anda kosong</p>
    </div>
    <div class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h3>Keranjang Masih Kosong</h3>
      <p>Temukan koleksi luxury terbaik dari QianlunShop</p>
      <a href="products.html" class="btn btn-primary">Jelajahi Koleksi</a>
    </div>
  `;
}

// Initialize delete modal event listeners
function initDeleteModal() {
  // Cancel button
  const cancelBtn = document.getElementById('cancelDelete');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideDeleteModal);
  }
  
  // Confirm button
  const confirmBtn = document.getElementById('confirmDelete');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmDeleteItem);
  }
  
  // Click outside modal
  const modalOverlay = document.getElementById('deleteModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        hideDeleteModal();
      }
    });
  }
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && itemToDelete) {
      hideDeleteModal();
    }
  });
}

// =========================
// 🛒 UPDATE CART COUNT
// =========================
function updateCartCount() {
  const countEls = document.querySelectorAll(".cart-count");
  if (countEls.length > 0) {
    const count = cart.getItemCount();
    countEls.forEach(el => {
      el.textContent = count;
      
      // Add bounce effect jika count berubah
      if (count > 0) {
        el.classList.add('bounce');
        setTimeout(() => el.classList.remove('bounce'), 500);
      }
    });
    console.log("📊 Cart count updated:", count);
  }
}

// =========================
// ✨ FLY TO CART ANIMATION
// =========================
function flyToCart(imgEl) {
  const cartIcon = document.querySelector("#cartIcon");
  if (!cartIcon || !imgEl) return;

  const imgClone = imgEl.cloneNode(true);
  const rect = imgEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // Setup clone
  Object.assign(imgClone.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transition: "all 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19)",
    zIndex: "9999",
    borderRadius: "10px",
    pointerEvents: "none"
  });
  
  document.body.appendChild(imgClone);

  // Start animation
  requestAnimationFrame(() => {
    imgClone.style.top = `${cartRect.top + 10}px`;
    imgClone.style.left = `${cartRect.left + 10}px`;
    imgClone.style.width = "30px";
    imgClone.style.height = "30px";
    imgClone.style.opacity = "0.3";
  });

  // Cleanup
  setTimeout(() => {
    imgClone.remove();
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 500);
  }, 900);
}

// =========================
// 🛍️ ADD TO CART HANDLER
// =========================
function handleAddToCart(e) {
  if (!e.target.classList.contains("add-to-cart")) return;
  
  e.preventDefault();
  
  const card = e.target.closest(".product-card");
  if (!card) {
    console.error("❌ Product card not found");
    showToast("❌ Terjadi kesalahan", "error");
    return;
  }

  // Get product data
  const productData = {
    id: card.dataset.id,
    name: card.dataset.name || card.querySelector("h3")?.textContent.trim(),
    price: parseInt(card.dataset.price, 10),
    image: card.querySelector("img")?.src || "",
    category: card.dataset.category || "general",
    quantity: 1
  };

  // Validate data
  if (!productData.id || !productData.name || !productData.price) {
    console.error("❌ Incomplete product data", productData);
    showToast("❌ Data produk tidak lengkap", "error");
    return;
  }

  // Animate
  const imgEl = card.querySelector("img");
  if (imgEl) {
    flyToCart(imgEl);
  }

  // Add to cart
  const success = cart.add(productData);
  
  if (success) {
    updateCartCount();
    showToast(`✅ ${productData.name} ditambahkan ke keranjang!`);
  } else {
    showToast("❌ Gagal menambahkan produk", "error");
  }
}

// Attach global click handler
document.addEventListener("click", handleAddToCart);

// =========================
// 🛒 CART PAGE MANAGEMENT
// =========================
function initCartPage() {
  const container = document.querySelector(".cart-container");
  if (!container) {
    console.log("ℹ️ Not cart page");
    return;
  }

  console.log("🛒 Initializing cart page...");

  // Main render function
  function renderCart() {
    const items = cart.getItems();
    
    console.log("🔄 Rendering", items.length, "items");

    // Empty cart state
    if (items.length === 0) {
      showEmptyCartState();
      return;
    }

    // Calculate totals
    const subtotal = cart.getTotal();
    const shipping = 0; // Free shipping
    const discount = 0;
    const total = subtotal + shipping - discount;

    // Generate items HTML
    const itemsHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='../assets/sample1.jpg'">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p class="item-price">Rp ${item.price.toLocaleString('id-ID')}</p>
          <div class="cart-actions">
            <button class="decrease-quantity" data-id="${item.id}" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" readonly>
            <button class="increase-quantity" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="item-total-section">
          <p class="item-total">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</p>
          <button class="remove-item" 
                  data-id="${item.id}" 
                  data-name="${item.name}"
                  title="Hapus item">🗑️</button>
        </div>
      </div>
    `).join('');

    // Render full cart
    container.innerHTML = `
      <div class="cart-header">
        <h2>🛒 Keranjang Belanja Anda</h2>
        <p>Review produk eksklusif Qianlun yang telah Anda pilih</p>
      </div>

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
              <span id="cartDiscount">- Rp ${discount.toLocaleString('id-ID')}</span>
            </div>
            <div class="summary-row grand-total">
              <span>Total:</span>
              <span id="cartTotal">Rp ${total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div class="promo-section">
            <label for="cartPromoCode">Kode Promo</label>
            <div class="promo-input-group">
              <input type="text" id="cartPromoCode" placeholder="Masukkan kode promo">
              <button class="btn btn-promo" id="applyCartPromo">Terapkan</button>
            </div>
          </div>

          <div class="checkout-actions">
            <a href="checkout.html" class="btn btn-checkout">🛍️ Lanjutkan ke Checkout</a>
            <a href="products.html" class="btn btn-secondary">Lanjutkan Belanja</a>
          </div>

          <div class="security-badge">
            <p>🔒 Transaksi 100% Aman & Terenkripsi</p>
          </div>
        </div>
      </div>
    `;

    // Attach event listeners
    attachCartEventListeners();
  }

  // Make renderCart available globally for delete function
  window.renderCart = renderCart;

  // Event listeners for cart actions
  function attachCartEventListeners() {
    // Event delegation untuk better performance
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    cartItems.addEventListener('click', (e) => {
      const target = e.target;
      const productId = target.dataset.id;

      if (!productId) return;

      // Increase quantity
      if (target.classList.contains('increase-quantity')) {
        const item = cart.getItem(productId);
        if (item) {
          cart.update(productId, item.quantity + 1);
          renderCart();
          updateCartCount();
          showToast("➕ Kuantitas ditambah", "success");
        }
      }

      // Decrease quantity
      else if (target.classList.contains('decrease-quantity')) {
        const item = cart.getItem(productId);
        if (item && item.quantity > 1) {
          cart.update(productId, item.quantity - 1);
          renderCart();
          updateCartCount();
          showToast("➖ Kuantitas dikurangi", "success");
        }
      }

      // Remove item - GUNAKAN MODAL KONFIRMASI
      else if (target.classList.contains('remove-item')) {
        const productName = target.dataset.name;
        showDeleteModal(productId, productName);
      }
    });

    // Promo code handler
    const applyPromoBtn = document.getElementById('applyCartPromo');
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', () => {
        const promoInput = document.getElementById('cartPromoCode');
        const promoCode = promoInput.value.trim().toUpperCase();
        
        const validCodes = {
          'QIANLUN10': 0.1,
          'DRAGON20': 0.2,
          'LUXURY15': 0.15
        };

        if (validCodes[promoCode]) {
          const discount = cart.getTotal() * validCodes[promoCode];
          showToast(`🎉 Diskon ${validCodes[promoCode] * 100}% berhasil diterapkan!`, 'success');
          
          // Update discount display
          const discountEl = document.getElementById('cartDiscount');
          const totalEl = document.getElementById('cartTotal');
          if (discountEl && totalEl) {
            discountEl.textContent = `- Rp ${discount.toLocaleString('id-ID')}`;
            totalEl.textContent = `Rp ${(cart.getTotal() - discount).toLocaleString('id-ID')}`;
          }
        } else if (promoCode) {
          showToast('❌ Kode promo tidak valid', 'error');
        }
      });
    }

    // Checkout button validation
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        if (cart.getItemCount() === 0) {
          e.preventDefault();
          showToast('❌ Keranjang kosong!', 'error');
        }
      });
    }
  }

  // Initial render
  renderCart();
  
  // Initialize delete modal
  initDeleteModal();
}

// =========================
// 💳 CHECKOUT PAGE MANAGEMENT
// =========================
function initCheckoutPage() {
  const checkoutContainer = document.querySelector(".checkout-container");
  if (!checkoutContainer) {
    console.log("ℹ️ Not checkout page");
    return;
  }

  console.log("💳 Initializing checkout page...");
  
  const checkoutManager = new CheckoutManager(cart);
}

// =========================
// 💳 CHECKOUT MANAGER CLASS
// =========================
class CheckoutManager {
  constructor(cartInstance) {
    this.cart = cartInstance;
    this.cartItems = this.cart.getItems();
    this.shippingCost = 0;
    this.discount = 0;
    this.init();
  }

  init() {
    if (this.cartItems.length === 0) {
      this.showEmptyCart();
      return;
    }

    this.displayCheckoutItems();
    this.calculateTotals();
    this.setupEventListeners();
    updateCartCount();
  }

  showEmptyCart() {
    const checkoutItems = document.getElementById('checkoutItems');
    if (checkoutItems) {
      checkoutItems.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Keranjang Kosong</h3>
          <p>Silakan tambahkan produk ke keranjang terlebih dahulu</p>
          <a href="products.html" class="btn btn-primary">Belanja Sekarang</a>
        </div>
      `;
    }
  }

  displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    if (!checkoutItems) return;

    checkoutItems.innerHTML = this.cartItems.map(item => `
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
    const subtotal = this.cart.getTotal();
    const grandTotal = subtotal + this.shippingCost - this.discount;

    this.updateElement('subtotal', this.formatPrice(subtotal));
    this.updateElement('shippingCost', this.formatPrice(this.shippingCost));
    this.updateElement('grandTotal', this.formatPrice(grandTotal));
  }

  updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  updateShippingCost(method) {
    const costs = {
      'regular': 25000,
      'express': 50000,
      'same-day': 75000
    };
    
    this.shippingCost = costs[method] || 0;
    this.calculateTotals();
  }

  setupEventListeners() {
    const shippingSelect = document.getElementById('shipping');
    if (shippingSelect) {
      shippingSelect.addEventListener('change', (e) => {
        this.updateShippingCost(e.target.value);
      });
    }

    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.getElementById('creditCardForm');
    
    paymentMethods.forEach(method => {
      method.addEventListener('change', (e) => {
        if (creditCardForm) {
          creditCardForm.style.display = e.target.value === 'creditCard' ? 'block' : 'none';
        }
      });
    });

    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
    }

    const placeOrderBtn = document.getElementById('placeOrder');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.placeOrder();
      });
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('input', () => this.validateForm());
    }
  }

  applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    if (!promoInput) return;

    const promoCode = promoInput.value.trim().toUpperCase();
    const discountRules = {
      'WELCOME10': 0.1,
      'DRAGON20': 0.2,
      'QIANLUN15': 0.15,
      'LUXURY25': 0.25
    };

    if (discountRules[promoCode]) {
      const subtotal = this.cart.getTotal();
      this.discount = subtotal * discountRules[promoCode];
      showToast(`🎉 Promo "${promoCode}" berhasil diterapkan!`, 'success');
      this.calculateTotals();
    } else if (promoCode) {
      showToast('❌ Kode promo tidak valid', 'error');
    }
  }

  validateForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return false;

    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    if (!paymentSelected) {
      isValid = false;
    }

    const creditCardRadio = document.getElementById('creditCard');
    if (creditCardRadio && creditCardRadio.checked) {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
      cardFields.forEach(field => {
        const el = document.getElementById(field);
        if (el && !el.value.trim()) {
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
      showToast('❌ Harap lengkapi semua field', 'error');
      return;
    }

    if (this.cartItems.length === 0) {
      showToast('❌ Keranjang kosong', 'error');
      return;
    }

    const placeOrderBtn = document.getElementById('placeOrder');
    if (!placeOrderBtn) return;

    try {
      const originalText = placeOrderBtn.innerHTML;
      placeOrderBtn.innerHTML = '🔄 Memproses...';
      placeOrderBtn.disabled = true;

      await new Promise(resolve => setTimeout(resolve, 2000));

      const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: this.cartItems,
        customerInfo: this.getCustomerInfo(),
        shipping: this.getShippingInfo(),
        payment: this.getPaymentInfo(),
        totals: {
          subtotal: this.cart.getTotal(),
          shipping: this.shippingCost,
          discount: this.discount,
          grandTotal: this.cart.getTotal() + this.shippingCost - this.discount
        },
        status: 'completed'
      };

      this.saveOrder(order);
      this.cart.clear();
      updateCartCount();

      showToast('✅ Pesanan berhasil diproses!', 'success');

      setTimeout(() => {
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
      }, 1500);

    } catch (error) {
      console.error('Order error:', error);
      showToast('❌ Terjadi kesalahan', 'error');
      
      placeOrderBtn.innerHTML = '🛍️ Bayar Sekarang';
      placeOrderBtn.disabled = false;
    }
  }

  getCustomerInfo() {
    return {
      fullName: document.getElementById('fullName')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      address: document.getElementById('address')?.value || '',
      city: document.getElementById('city')?.value || '',
      postalCode: document.getElementById('postalCode')?.value || ''
    };
  }

  getShippingInfo() {
    const shippingSelect = document.getElementById('shipping');
    const method = shippingSelect?.value || 'regular';
    
    return {
      method: method,
      cost: this.shippingCost,
      estimatedDelivery: this.getEstimatedDelivery(method)
    };
  }

  getPaymentInfo() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    const info = { method: paymentMethod?.value || 'unknown' };

    if (info.method === 'creditCard') {
      const cardNumber = document.getElementById('cardNumber')?.value || '';
      info.cardLastFour = cardNumber.slice(-4);
    }

    return info;
  }

  getEstimatedDelivery(method) {
    const today = new Date();
    const days = {
      'same-day': 0,
      'express': 2,
      'regular': 5
    };
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + (days[method] || 5));
    
    return deliveryDate.toLocaleDateString('id-ID');
  }

  saveOrder(order) {
    try {
      const orders = JSON.parse(localStorage.getItem('qianlun_orders') || '[]');
      orders.push(order);
      localStorage.setItem('qianlun_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save order:', error);
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

// =========================
// 🔍 PRODUCT FILTERS
// =========================
function initProductFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetBtn = document.getElementById('resetFilter');
  const productGrid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');

  if (!searchInput || !productGrid) {
    console.log("ℹ️ Not on products page");
    return;
  }

  console.log("🔍 Initializing product filters...");

  const allProducts = Array.from(productGrid.querySelectorAll('.product-card'));
  const originalOrder = [...allProducts];

  function updateResultCount(count) {
    if (resultCount) {
      resultCount.textContent = count;
    }
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    let filtered = allProducts.filter(product => {
      const name = (product.dataset.name || '').toLowerCase();
      const productCategory = product.dataset.category || '';

      const matchesSearch = !searchTerm || name.includes(searchTerm);
      const matchesCategory = category === 'all' || productCategory === category;

      return matchesSearch && matchesCategory;
    });

    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        const priceA = parseInt(a.dataset.price) || 0;
        const priceB = parseInt(b.dataset.price) || 0;
        const nameA = (a.dataset.name || '').toLowerCase();
        const nameB = (b.dataset.name || '').toLowerCase();

        switch (sortBy) {
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          case 'name-asc': return nameA.localeCompare(nameB);
          case 'name-desc': return nameB.localeCompare(nameA);
          default: return 0;
        }
      });
    }

    updateDisplay(filtered);
  }

  function updateDisplay(filtered) {
    productGrid.innerHTML = '';

    if (filtered.length === 0) {
      if (noResults) noResults.style.display = 'block';
      updateResultCount(0);
    } else {
      if (noResults) noResults.style.display = 'none';
      
      filtered.forEach((product, index) => {
        product.style.animationDelay = `${index * 0.1}s`;
        productGrid.appendChild(product);
      });
      
      updateResultCount(filtered.length);
    }
  }

  function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    updateDisplay(originalOrder);
    showToast("🔄 Filter direset", "success");
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', resetFilters);

  updateResultCount(allProducts.length);
}

// =========================
// 🌐 SMART HEADER (Auto-hide Navbar)
// =========================
function initSmartHeader() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    console.log("ℹ️ Navbar element not found for Smart Header initialization.");
    return;
  }
  
  let lastScrollTop = 0;
  const navbarHeight = navbar.offsetHeight;

  window.addEventListener('scroll', function() {
    let currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
      navbar.classList.add('navbar-hidden');
    } 
    else if (currentScroll < lastScrollTop || currentScroll <= 0) {
      navbar.classList.remove('navbar-hidden');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  console.log("🌐 Smart Header initialized.");
}

// =========================
// 🚀 INITIALIZE
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 QianlunShop initialized");
  console.log("📦 Cart:", cart.getSummary());
  
  // Initialize all features
  updateCartCount();
  initSmartHeader();
  initCartPage();
  initCheckoutPage();
  initProductFilters();
  
  console.log("✅ All features loaded");
});

// =========================
// 🐛 DEBUG HELPERS
// =========================
if (typeof window !== 'undefined') {
  window.debugCart = () => cart.debug();
  window.testCart = () => cart.validate();
  window.clearCart = () => {
    cart.clear();
    updateCartCount();
    showToast("🧹 Cart cleared", "success");
  };
}