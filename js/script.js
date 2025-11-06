// =========================
// 🏪 QIANLUNSHOP - WITH AUTH INTEGRATION
// Enhanced with proper authentication guards
// =========================
import { Cart } from "./cart.js";
import { CONFIG, Utils } from "./config.js";
import { ProductManager, productManager } from "./product-manager.js";
import { userManager } from "./user-manager.js";
import { authGuard } from "./auth-guard.js";

// Initialize cart
const cart = new Cart();

// Make showToast globally available
window.showToast = showToast;

// =========================
// 🔐 PROTECTED ACTION WRAPPER
// =========================

function requireAuth(action, message = "Silakan login untuk melanjutkan") {
  if (!userManager.isLoggedIn()) {
    showToast(message, "warning");
    
    // Store intended action for after login
    sessionStorage.setItem('intended_action', window.location.pathname);
    
    // Redirect to login
    setTimeout(() => {
      const isInPagesDir = window.location.pathname.includes('/pages/');
      window.location.href = isInPagesDir ? 'login.html' : 'pages/login.html';
    }, 1500);
    
    return false;
  }
  
  if (action) action();
  return true;
}

// =========================
// 🏷️ Toast Notification System
// =========================

function showToast(message, type = "success") {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, CONFIG.PERFORMANCE.TOAST_DURATION);
}

// =========================
// 🛒 Update Navbar Cart Count
// =========================

function updateCartCount() {
  const countElements = document.querySelectorAll(".cart-count");
  if (countElements.length === 0) return;

  const count = cart.getItemCount();
  const summary = cart.getSummary();
  
  countElements.forEach(el => {
    el.textContent = count;
    el.classList.toggle('empty', count === 0);
    
    if (count > 0) {
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 500);
    }
  });

  console.log("📊 Cart count updated:", count, "items");
  cart.emit('cart-updated', { summary });
}

// =========================
// ✨ Product Fly Animation
// =========================

function flyToCart(imgEl) {
  const cartIcon = document.querySelector("#cartIcon") || document.querySelector(".cart-icon");
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
  imgClone.style.objectFit = "cover";
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
// 🛍️ Add to Cart Handler - WITH AUTH CHECK
// =========================

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    e.preventDefault();
    e.target.disabled = true;

    const card = e.target.closest(".product-card");
    if (!card) {
      console.error("❌ Product card tidak ditemukan");
      showToast(CONFIG.MESSAGES.ORDER_FAILED, "error");
      e.target.disabled = false;
      return;
    }

    // Animation
    const imgEl = card.querySelector("img");
    if (imgEl) {
      flyToCart(imgEl);
    }

    // Extract product data
    const nameEl = card.querySelector("h3, .product-name");
    const priceAttr = card.dataset.price;
    const idAttr = card.dataset.id;
    const categoryAttr = card.dataset.category;

    if (!nameEl || !idAttr) {
      console.error("❌ Data produk tidak lengkap");
      showToast(CONFIG.MESSAGES.FORM_INCOMPLETE, "error");
      e.target.disabled = false;
      return;
    }

    // Parse price
    let price = 0;
    if (priceAttr) {
      price = parseInt(priceAttr.replace(/[^\d]/g, ''), 10);
    } else {
      const priceEl = card.querySelector('.price, .product-price, [class*="price"]');
      if (priceEl) {
        price = parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10);
      }
    }

    if (isNaN(price) || price <= 0) {
      console.error("❌ Invalid price:", priceAttr, price);
      showToast("Harga produk tidak valid", "error");
      e.target.disabled = false;
      return;
    }

    const product = {
      id: idAttr,
      name: nameEl.textContent.trim(),
      price: price,
      image: imgEl ? imgEl.src : "",
      category: categoryAttr || "general",
      quantity: 1
    };

    console.log("🛍️ Adding product to cart:", product);
    
    try {
      const success = await cart.add(product);
      
      if (success) {
        updateCartCount();
        showToast(CONFIG.MESSAGES.ADD_TO_CART_SUCCESS, "success");
        
        // Track analytics
        Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.ADD_TO_CART, {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          category: product.category
        });
      } else {
        showToast("⚠️ Gagal menambahkan ke keranjang", "error");
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      showToast(CONFIG.MESSAGES.ORDER_FAILED, "error");
    } finally {
      e.target.disabled = false;
    }
  }
});

// =========================
// 🛒 Cart Page Renderer - WITH AUTH
// =========================

function initCartPage() {
  const container = document.querySelector(".cart-container");
  if (!container) return;

  console.log("🛒 Initializing cart page...");

  function renderCart() {
    const items = cart.getItems();
    
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>${CONFIG.MESSAGES.CART_EMPTY}</h3>
          <p>Temukan koleksi terbaik dari QianlunShop ✨</p>
          <a href="products.html" class="btn btn-primary">Jelajahi Produk</a>
        </div>
      `;
      updateCartCount();
      return;
    }

    const summary = cart.getSummary();
    const subtotal = summary.total;

    const itemsHTML = items.map(item => {
      const itemPrice = Utils.formatPrice(item.price);
      const itemTotal = Utils.formatPrice(item.price * item.quantity);
      const image = item.image || "../assets/sample1.jpg";

      return `
        <div class="cart-item fade-in" data-id="${item.id}">
          <img src="${image}" alt="${item.name}" onerror="this.src='../assets/sample1.jpg'">
          <div class="cart-info">
            <h3>${item.name}</h3>
            <p class="item-category">${CONFIG.CATEGORIES[item.category.toUpperCase()]?.name || item.category}</p>
            <p class="item-price">${itemPrice}</p>

            <div class="cart-actions">
              <button class="decrease-quantity" data-id="${item.id}">-</button>
              <input type="number" value="${item.quantity}" min="1" max="${CONFIG.SECURITY.MAX_QUANTITY_PER_ITEM}" 
                     class="quantity-input" data-id="${item.id}" readonly>
              <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>

            <button class="remove-item" data-id="${item.id}" title="Hapus item">
              🗑️ Hapus
            </button>
          </div>

          <div class="item-total-section">
            <p class="item-total">${itemTotal}</p>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="cart-header"> 
        <h2>🛒 Keranjang Belanja</h2>
        <p>${items.length} item • ${Utils.formatPrice(subtotal)}</p>
      </div>

      <div class="cart-items">
        ${itemsHTML}
      </div>

      <div class="cart-summary">
        <h3>Ringkasan Pesanan</h3>
        <div class="summary-details">
          <div class="summary-row">
            <span>Subtotal (${summary.count} items):</span>
            <span>${Utils.formatPrice(subtotal)}</span>
          </div>
          <div class="summary-row grand-total">
            <span>Total:</span>
            <span>${Utils.formatPrice(subtotal)}</span>
          </div>
        </div>

        ${Utils.isFreeShippingEligible(subtotal) ? 
          `<div class="free-shipping-badge">🚚 Gratis Ongkir!</div>` : 
          `<div class="shipping-info">Tambahkan ${Utils.formatPrice(CONFIG.FREE_SHIPPING_THRESHOLD - subtotal)} lagi untuk gratis ongkir!</div>`
        }

        <div class="checkout-actions">
          <button class="btn btn-checkout" id="proceedToCheckout">
            🛍️ Lanjutkan ke Checkout
          </button>
          <a href="products.html" class="btn btn-secondary">⬅️ Kembali Belanja</a>
        </div>

        <p class="security-info">🔒 Transaksi Aman & Terlindungi</p>
      </div>
    `;

    attachCartEventListeners();
  }

  function attachCartEventListeners() {
    // Quantity controls
    document.querySelectorAll(".increase-quantity").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const item = cart.getItem(id);
        if (item) {
          const newQuantity = Math.min(item.quantity + 1, CONFIG.SECURITY.MAX_QUANTITY_PER_ITEM);
          await cart.update(id, newQuantity);
          renderCart();
          updateCartCount();
          showToast(CONFIG.MESSAGES.QUANTITY_UPDATED, "success");
        }
      });
    });

    document.querySelectorAll(".decrease-quantity").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const item = cart.getItem(id);
        if (item && item.quantity > 1) {
          await cart.update(id, item.quantity - 1);
          renderCart();
          updateCartCount();
          showToast(CONFIG.MESSAGES.QUANTITY_UPDATED, "success");
        }
      });
    });

    // Remove item
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const item = cart.getItem(id);
        if (item) {
          await cart.remove(id);
          renderCart();
          updateCartCount();
          showToast(CONFIG.MESSAGES.REMOVE_FROM_CART, "error");
        }
      });
    });

    // Proceed to checkout - REQUIRES AUTH
    const checkoutBtn = document.getElementById("proceedToCheckout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        requireAuth(() => {
          window.location.href = 'checkout.html';
        }, "Silakan login untuk melanjutkan ke checkout");
      });
    }
  }

  renderCart();
  
  cart.on('cart-synced', () => {
    console.log("🔄 Cart synced");
    renderCart();
    updateCartCount();
  });
}

// =========================
// 🔍 Product Search & Filter
// =========================

function initProductFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetBtn = document.getElementById('resetFilter');
  const productGrid = document.getElementById('productGrid');

  if (!searchInput || !productGrid) return;

  console.log("🔍 Initializing product filters...");

  let allProducts = Array.from(productGrid.querySelectorAll('.product-card'));

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    let filteredProducts = allProducts.filter(product => {
      const name = product.dataset.name?.toLowerCase() || '';
      const description = product.dataset.description?.toLowerCase() || '';
      const productCategory = product.dataset.category;

      const matchesSearch = searchTerm === '' || 
        name.includes(searchTerm) || 
        description.includes(searchTerm);
      
      const matchesCategory = category === 'all' || productCategory === category;

      return matchesSearch && matchesCategory;
    });

    // Sort
    if (sortBy !== 'default') {
      filteredProducts.sort((a, b) => {
        const priceA = parseInt(a.dataset.price) || 0;
        const priceB = parseInt(b.dataset.price) || 0;

        switch (sortBy) {
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          default: return 0;
        }
      });
    }

    updateProductDisplay(filteredProducts);
  }

  function updateProductDisplay(filteredProducts) {
    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = '<div class="no-results">Tidak ada produk ditemukan</div>';
    } else {
      filteredProducts.forEach((product, index) => {
        product.style.animationDelay = `${index * 0.1}s`;
        productGrid.appendChild(product);
      });
    }
  }

  searchInput.addEventListener('input', Utils.debounce(applyFilters));
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  resetBtn?.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    applyFilters();
  });
}

// =========================
// 💳 Checkout Manager - REQUIRES AUTH
// =========================

class CheckoutManager {
  constructor() {
    // Auth check already done by auth-guard.js
    this.cart = new Cart();
    this.shippingCost = 0;
    this.discount = 0;
    this.promoCode = '';
    this.init();
  }

  init() {
    this.displayCheckoutItems();
    this.calculateTotals();
    this.setupEventListeners();
    updateCartCount();
    
    console.log("💳 Checkout manager initialized");
  }

  displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    if (!checkoutItems) return;

    const items = this.cart.getItems();
    
    if (items.length === 0) {
      checkoutItems.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Keranjang Kosong</h3>
          <p>Silakan tambahkan produk ke keranjang</p>
          <a href="products.html" class="btn btn-primary">Belanja Sekarang</a>
        </div>
      `;
      return;
    }

    checkoutItems.innerHTML = items.map(item => `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='../assets/sample1.jpg'">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity}</p>
        </div>
        <div class="item-total">${Utils.formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');
  }

  calculateTotals() {
    const subtotal = this.cart.getTotal();
    const tax = subtotal * CONFIG.TAX_RATE;
    const grandTotal = subtotal + this.shippingCost + tax - this.discount;

    const elements = {
      'subtotal': subtotal,
      'shippingCost': this.shippingCost,
      'taxAmount': tax,
      'discountAmount': -this.discount,
      'grandTotal': grandTotal
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = Utils.formatPrice(value);
      }
    });
  }

  setupEventListeners() {
    const shippingSelect = document.getElementById('shipping');
    if (shippingSelect) {
      shippingSelect.addEventListener('change', (e) => {
        const method = CONFIG.SHIPPING[e.target.value.toUpperCase()];
        this.shippingCost = method?.cost || 0;
        this.calculateTotals();
      });
    }

    const placeOrderBtn = document.getElementById('placeOrder');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.placeOrder();
      });
    }
  }

  async placeOrder() {
    // Validate form
    const requiredFields = document.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        allValid = false;
        field.classList.add('error');
      }
    });

    if (!allValid) {
      showToast(CONFIG.MESSAGES.FORM_INCOMPLETE, 'error');
      return;
    }

    try {
      const placeOrderBtn = document.getElementById('placeOrder');
      if (placeOrderBtn) {
        placeOrderBtn.innerHTML = CONFIG.MESSAGES.PAYMENT_PROCESSING;
        placeOrderBtn.disabled = true;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      const order = {
        id: Utils.generateId('ORD'),
        date: new Date().toISOString(),
        items: this.cart.getItems(),
        customerInfo: this.getCustomerInfo(),
        totals: {
          subtotal: this.cart.getTotal(),
          shipping: this.shippingCost,
          tax: this.cart.getTotal() * CONFIG.TAX_RATE,
          discount: this.discount,
          grandTotal: this.cart.getTotal() + this.shippingCost + (this.cart.getTotal() * CONFIG.TAX_RATE) - this.discount
        },
        status: 'completed'
      };

      // Save order to user history
      const currentUser = userManager.getCurrentUser();
      if (currentUser) {
        userManager.addOrderToHistory(currentUser.id, order);
      }

      await this.cart.clear();
      showToast(CONFIG.MESSAGES.ORDER_SUCCESS, 'success');

      window.location.href = `order-confirmation.html?orderId=${order.id}`;

    } catch (error) {
      console.error('Order error:', error);
      showToast(CONFIG.MESSAGES.ORDER_FAILED, 'error');
    }
  }

  getCustomerInfo() {
    return {
      fullName: document.getElementById('fullName')?.value || '',
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      address: document.getElementById('address')?.value || ''
    };
  }
}

// =========================
// 💳 Initialize Checkout Page
// =========================

function initCheckoutPage() {
  const checkoutContainer = document.querySelector(".checkout-container");
  if (!checkoutContainer) return;
  
  console.log("💳 Initializing checkout page...");
  new CheckoutManager();
}

// =========================
// 📦 Order Confirmation - REQUIRES AUTH
// =========================

function initOrderConfirmation() {
  const confirmationContainer = document.querySelector(".order-confirmation");
  if (!confirmationContainer) return;

  console.log("📦 Initializing order confirmation...");

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  if (!orderId) {
    confirmationContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">⚠️</div>
        <h3>Pesanan Tidak Ditemukan</h3>
        <div class="confirmation-actions">
          <a href="products.html" class="btn btn-primary">🛍️ Belanja Sekarang</a>
          <a href="../index.html" class="btn btn-secondary">🏠 Kembali ke Beranda</a>
        </div>
      </div>
    `;
    return;
  }

  // Get order from user's history
  const currentUser = userManager.getCurrentUser();
  if (!currentUser) {
    confirmationContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🔒</div>
        <h3>Akses Ditolak</h3>
        <p>Silakan login untuk melihat pesanan Anda</p>
        <a href="login.html" class="btn btn-primary">Login</a>
      </div>
    `;
    return;
  }

  const orders = userManager.getUserOrders(currentUser.id);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    confirmationContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">❌</div>
        <h3>Pesanan Tidak Ditemukan</h3>
        <a href="products.html" class="btn btn-primary">Belanja Lagi</a>
      </div>
    `;
    return;
  }

  confirmationContainer.innerHTML = `
    <div class="confirmation-icon">🎉</div>
    <h2>Pesanan Berhasil!</h2>
    <p class="order-id">Order ID: <span>${order.id}</span></p>
    <p class="confirmation-message">Terima kasih ${currentUser.firstName}! Pesanan Anda sedang diproses.</p>
    
    <div class="confirmation-details">
      <div class="detail-section">
        <h4>📦 Detail Pesanan</h4>
        ${order.items.map(item => `
          <div class="order-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='../assets/sample1.jpg'">
            <div class="item-info">
              <strong>${item.name}</strong>
              <span>${Utils.formatPrice(item.price)} × ${item.quantity}</span>
            </div>
            <div class="item-total">${Utils.formatPrice(item.price * item.quantity)}</div>
          </div>
        `).join('')}
      </div>

      <div class="detail-section">
        <h4>📋 Ringkasan</h4>
        <div class="summary-row grand-total">
          <span>Total:</span>
          <span>${Utils.formatPrice(order.totals.grandTotal)}</span>
        </div>
      </div>
    </div>

    <div class="confirmation-actions">
      <a href="products.html" class="btn btn-primary">🛍️ Lanjutkan Belanja</a>
      <a href="profile.html" class="btn btn-secondary">👤 Lihat Profil</a>
    </div>
  `;
}

// =========================
// 🎯 Initialize All Features
// =========================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 QianlunShop Initializing...");

  // Update cart count
  updateCartCount();

  // Initialize features
  initCartPage();
  initProductFilters();
  initCheckoutPage();
  initOrderConfirmation();

  // Listen for cart updates
  cart.on('cart-synced', () => {
    console.log("🔄 Cart synced");
    updateCartCount();
    if (document.querySelector('.cart-container')) {
      initCartPage();
    }
  });

  console.log("✅ QianlunShop Ready!");
});

// Export for use in other modules
export { showToast, updateCartCount, requireAuth };