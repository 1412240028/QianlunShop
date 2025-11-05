// =========================
// 🏪 QIANLUNSHOP - ENHANCED VERSION
// Integrated with Cart & Config modules
// =========================
import { Cart } from "./cart.js";
import { CONFIG, Utils } from "./config.js";

// Initialize cart with config
const cart = new Cart();

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
// 🛒 Update Navbar Cart Count - ENHANCED
// =========================
function updateCartCount() {
  const countElements = document.querySelectorAll(".cart-count");
  if (countElements.length === 0) return;

  const count = cart.getItemCount();
  const summary = cart.getSummary();
  
  countElements.forEach(el => {
    el.textContent = count;
    el.classList.toggle('empty', count === 0);
    
    // Add animation for cart updates
    if (count > 0) {
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 500);
    }
  });

  console.log("📊 Cart count updated:", count, "items");
  
  // Emit cart update event
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
// 🛍️ Add to Cart Handler - ENHANCED
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

    if (!nameEl || !priceAttr || !idAttr) {
      console.error("❌ Data produk tidak lengkap", { nameEl, priceAttr, idAttr });
      showToast(CONFIG.MESSAGES.FORM_INCOMPLETE, "error");
      e.target.disabled = false;
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
// 🛒 Cart Page Renderer - ENHANCED
// =========================
function initCartPage() {
  const container = document.querySelector(".cart-container");
  if (!container) {
    console.log("ℹ️ Bukan halaman cart");
    return;
  }

  console.log("🛒 Initializing enhanced cart page...");

  function renderCart() {
    const items = cart.getItems();
    
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>${CONFIG.MESSAGES.CART_EMPTY}</h3>
          <p>Temukan koleksi terbaik dari QianlunShop dan rasakan kemewahannya ✨</p>
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
          <div class="summary-row">
            <span>Pengiriman:</span>
            <span>${Utils.isFreeShippingEligible(subtotal) ? 'Gratis' : Utils.formatPrice(CONFIG.SHIPPING.REGULAR.cost)}</span>
          </div>
          <div class="summary-row">
            <span>Diskon:</span>
            <span>- ${Utils.formatPrice(0)}</span>
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

        <div class="promo-section">
          <label for="cartPromoCode">Kode Promo</label>
          <div class="promo-input-group">
            <input type="text" id="cartPromoCode" placeholder="Masukkan kode promo...">
            <button class="btn btn-promo" id="applyCartPromo">Terapkan</button>
          </div>
        </div>

        <div class="checkout-actions">
          <a href="checkout.html" class="btn btn-checkout" ${items.length === 0 ? 'style="display:none"' : ''}>
            🛍️ Lanjutkan ke Checkout
          </a>
          <a href="products.html" class="btn btn-secondary">⬅️ Kembali Belanja</a>
        </div>

        <p class="security-info">🔒 Transaksi Aman & Terlindungi</p>
      </div>
    `;

    attachCartEventListeners();
  }

  function attachCartEventListeners() {
    // Quantity increase
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

    // Quantity decrease
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
          
          // Track analytics
          Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.REMOVE_FROM_CART, {
            product_id: id,
            product_name: item.name
          });
        }
      });
    });

    // Apply promo code
    const applyPromo = document.getElementById("applyCartPromo");
    if (applyPromo) {
      applyPromo.addEventListener("click", () => {
        const code = document.getElementById("cartPromoCode").value.trim().toUpperCase();
        const promo = CONFIG.PROMO_CODES[code];
        
        if (promo) {
          const subtotal = cart.getTotal();
          if (subtotal >= promo.minPurchase) {
            showToast(CONFIG.MESSAGES.PROMO_APPLIED, "success");
            Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.APPLY_PROMO, { promo_code: code });
          } else {
            showToast(CONFIG.MESSAGES.PROMO_MIN_PURCHASE, "error");
          }
        } else if (code) {
          showToast(CONFIG.MESSAGES.PROMO_INVALID, "error");
        }
      });
    }
  }

  // Initial render
  renderCart();
  
  // Listen for cart changes from other tabs
  cart.on('cart-synced', () => {
    console.log("🔄 Cart synced in cart page");
    renderCart();
    updateCartCount();
  });
}

// =========================
// 🔍 Product Search & Filter - ENHANCED
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

  console.log("🔍 Initializing enhanced product filters...");

  let allProducts = Array.from(productGrid.querySelectorAll('.product-card'));
  const originalProducts = [...allProducts];

  // Populate category filter
  if (categoryFilter) {
    categoryFilter.innerHTML = `
      <option value="all">Semua Kategori</option>
      ${Object.values(CONFIG.CATEGORIES).map(cat => 
        `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
      ).join('')}
    `;
  }

  function updateResultCount(count) {
    if (resultCount) {
      resultCount.textContent = `${count} produk ditemukan`;
    }
  }

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

    // Sort products
    if (sortBy !== 'default') {
      filteredProducts.sort((a, b) => {
        const priceA = parseInt(a.dataset.price) || 0;
        const priceB = parseInt(b.dataset.price) || 0;
        const nameA = a.dataset.name?.toLowerCase() || '';
        const nameB = b.dataset.name?.toLowerCase() || '';

        switch (sortBy) {
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          case 'name-asc': return nameA.localeCompare(nameB);
          case 'name-desc': return nameB.localeCompare(nameA);
          default: return 0;
        }
      });
    }

    updateProductDisplay(filteredProducts);
  }

  function updateProductDisplay(filteredProducts) {
    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      noResults.style.display = 'block';
      updateResultCount(0);
    } else {
      noResults.style.display = 'none';

      filteredProducts.forEach((product, index) => {
        product.style.animationDelay = `${index * 0.1}s`;
        productGrid.appendChild(product);
      });

      updateResultCount(filteredProducts.length);
    }
  }

  function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    allProducts = [...originalProducts];
    updateProductDisplay(allProducts);
    showToast(CONFIG.MESSAGES.FILTER_RESET, "success");
    
    // Track analytics
    Utils.trackEvent('filters_reset');
  }

  // Event listeners with debouncing
  searchInput.addEventListener('input', Utils.debounce(applyFilters));
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', resetFilters);

  // Reset button from no-results
  const resetFromNoResults = document.getElementById('resetFromNoResults');
  if (resetFromNoResults) {
    resetFromNoResults.addEventListener('click', resetFilters);
  }

  updateResultCount(allProducts.length);
}

// =========================
// 🔍 Discover More - Product Navigation
// =========================
function initDiscoverMore() {
  function addHighlightStyles() {
    if (document.getElementById('discover-more-styles')) return;

    const style = document.createElement('style');
    style.id = 'discover-more-styles';
    style.textContent = `
      .product-card.highlighted {
        animation: highlightProduct 2s ease;
        border-color: ${CONFIG.THEME.PRIMARY} !important;
      }
      
      @keyframes highlightProduct {
        0%, 100% { 
          transform: scale(1); 
          box-shadow: 0 4px 12px ${CONFIG.THEME.PRIMARY}30; 
        }
        25%, 75% { 
          transform: scale(1.03); 
          box-shadow: 0 12px 35px ${CONFIG.THEME.PRIMARY}60; 
        }
        50% { 
          transform: scale(1.05); 
          box-shadow: 0 16px 45px ${CONFIG.THEME.SECONDARY}70; 
        }
      }
    `;
    document.head.appendChild(style);
  }

  function handleProductAnchor() {
    const hash = window.location.hash;

    if (hash && hash.startsWith('#p')) {
      setTimeout(() => {
        const productCard = document.querySelector(`[data-id="${hash.substring(1)}"]`);

        if (productCard) {
          productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          productCard.classList.add('highlighted');
          setTimeout(() => productCard.classList.remove('highlighted'), 3000);
        }
      }, 300);
    }
  }

  addHighlightStyles();
  handleProductAnchor();
  window.addEventListener('hashchange', handleProductAnchor);
}

// =========================
// 💳 Checkout Manager - ENHANCED
// =========================
class CheckoutManager {
  constructor() {
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
    
    console.log("💳 Enhanced checkout manager initialized");
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
          <p>Silakan tambahkan produk ke keranjang terlebih dahulu</p>
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
          <p>${this.formatCategory(item.category)}</p>
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

    // Update UI elements
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

    // Update free shipping message
    const freeShippingMsg = document.getElementById('freeShippingMsg');
    if (freeShippingMsg) {
      if (Utils.isFreeShippingEligible(subtotal)) {
        freeShippingMsg.style.display = 'block';
        freeShippingMsg.innerHTML = `🎉 Anda mendapatkan <strong>gratis ongkir</strong>!`;
      } else {
        const needed = CONFIG.FREE_SHIPPING_THRESHOLD - subtotal;
        freeShippingMsg.style.display = needed > 0 ? 'block' : 'none';
        freeShippingMsg.innerHTML = `Tambahkan <strong>${Utils.formatPrice(needed)}</strong> lagi untuk gratis ongkir!`;
      }
    }
  }

  updateShippingCost(method) {
    const shipping = CONFIG.SHIPPING[method.toUpperCase()];
    if (shipping) {
      this.shippingCost = Utils.isFreeShippingEligible(this.cart.getTotal()) ? 0 : shipping.cost;
    } else {
      this.shippingCost = 0;
    }
    this.calculateTotals();
  }

  setupEventListeners() {
    // Shipping method selection
    const shippingSelect = document.getElementById('shipping');
    if (shippingSelect) {
      // Populate shipping options
      shippingSelect.innerHTML = Object.entries(CONFIG.SHIPPING).map(([key, method]) => `
        <option value="${key.toLowerCase()}">
          ${method.name} - ${Utils.formatPrice(method.cost)} 
          (${Utils.getEstimatedDelivery(key)})
        </option>
      `).join('');

      shippingSelect.addEventListener('change', (e) => {
        this.updateShippingCost(e.target.value);
      });

      // Set initial shipping cost
      this.updateShippingCost(shippingSelect.value);
    }

    // Payment methods
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.getElementById('creditCardForm');

    paymentMethods.forEach(method => {
      method.addEventListener('change', (e) => {
        if (creditCardForm) {
          creditCardForm.style.display = e.target.value === 'creditCard' ? 'block' : 'none';
        }
      });
    });

    // Promo code
    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
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
    this.setupFormValidation();
  }

  setupFormValidation() {
    const forms = document.querySelectorAll('input, select');
    forms.forEach(form => {
      form.addEventListener('blur', (e) => {
        this.validateField(e.target);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.type) {
      case 'email':
        isValid = Utils.validateEmail(value);
        message = isValid ? '' : 'Format email tidak valid';
        break;
      case 'tel':
        isValid = Utils.validatePhone(value);
        message = isValid ? '' : 'Format nomor telepon tidak valid';
        break;
      default:
        if (field.required) {
          isValid = value.length > 0;
          message = isValid ? '' : 'Field ini wajib diisi';
        }
    }

    // Update UI
    field.classList.toggle('error', !isValid);
    
    // Show/hide error message
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';

    return isValid;
  }

  applyPromoCode() {
    const promoCodeEl = document.getElementById('promoCode');
    if (!promoCodeEl) return;

    const promoCode = promoCodeEl.value.trim().toUpperCase();
    const subtotal = this.cart.getTotal();

    this.discount = Utils.calculateDiscount(subtotal, promoCode);
    
    if (this.discount > 0) {
      this.promoCode = promoCode;
      showToast(CONFIG.MESSAGES.PROMO_APPLIED, 'success');
      this.calculateTotals();
      
      // Track analytics
      Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.APPLY_PROMO, {
        promo_code: promoCode,
        discount_amount: this.discount
      });
    } else {
      showToast(CONFIG.MESSAGES.PROMO_INVALID, 'error');
      this.promoCode = '';
      this.discount = 0;
      this.calculateTotals();
    }
  }

  async placeOrder() {
    if (this.cart.getItems().length === 0) {
      showToast('Keranjang belanja kosong', 'error');
      return;
    }

    // Validate form
    const requiredFields = document.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        allValid = false;
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

      await this.processPayment();

      const order = {
        id: Utils.generateId('ORD'),
        date: new Date().toISOString(),
        items: this.cart.getItems(),
        customerInfo: this.getCustomerInfo(),
        shipping: this.getShippingInfo(),
        payment: this.getPaymentInfo(),
        promoCode: this.promoCode,
        totals: {
          subtotal: this.cart.getTotal(),
          shipping: this.shippingCost,
          tax: this.cart.getTotal() * CONFIG.TAX_RATE,
          discount: this.discount,
          grandTotal: this.cart.getTotal() + this.shippingCost + (this.cart.getTotal() * CONFIG.TAX_RATE) - this.discount
        },
        status: 'completed'
      };

      this.saveOrder(order);
      await this.cart.clear();
      showToast(CONFIG.MESSAGES.ORDER_SUCCESS, 'success');

      // Track analytics
      Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.PURCHASE, {
        transaction_id: order.id,
        value: order.totals.grandTotal,
        currency: 'IDR',
        items: order.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });

      setTimeout(() => {
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
      }, 2000);

    } catch (error) {
      console.error('Order error:', error);
      showToast(CONFIG.MESSAGES.ORDER_FAILED, 'error');

      const placeOrderBtn = document.getElementById('placeOrder');
      if (placeOrderBtn) {
        placeOrderBtn.innerHTML = '🛍️ Bayar Sekarang';
        placeOrderBtn.disabled = false;
      }
    }
  }

  async processPayment() {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
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
      estimatedDelivery: Utils.getEstimatedDelivery(method)
    };
  }

  getPaymentInfo() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    const info = { 
      method: paymentMethod?.value || 'unknown',
      methodName: CONFIG.PAYMENT_METHODS[paymentMethod?.value.toUpperCase()]?.name || 'Unknown'
    };

    if (paymentMethod?.value === 'creditCard') {
      const cardNumber = document.getElementById('cardNumber');
      if (cardNumber) {
        info.cardLastFour = cardNumber.value.slice(-4);
      }
    }

    return info;
  }

  saveOrder(order) {
    const orders = Utils.loadFromStorage(CONFIG.STORAGE_KEYS.ORDERS, []);
    orders.push(order);
    Utils.saveToStorage(CONFIG.STORAGE_KEYS.ORDERS, orders);
  }

  formatCategory(category) {
    return CONFIG.CATEGORIES[category.toUpperCase()]?.name || category;
  }
}

// =========================
// 💳 Initialize Checkout Page
// =========================
function initCheckoutPage() {
  const checkoutContainer = document.querySelector(".checkout-container");
  if (!checkoutContainer) return;
  
  console.log("💳 Initializing enhanced checkout page...");
  new CheckoutManager();
}

// =========================
// 📦 Order Confirmation Page - ENHANCED
// =========================
function initOrderConfirmation() {
  const confirmationContainer = document.querySelector(".order-confirmation");
  if (!confirmationContainer) return;

  console.log("📦 Initializing enhanced order confirmation...");

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  if (!orderId) {
    confirmationContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">⚠️</div>
        <h3>Pesanan Tidak Ditemukan</h3>
        <p>Sepertinya Anda membuka halaman ini tanpa menyelesaikan transaksi.</p>
        <div class="confirmation-actions">
          <a href="products.html" class="btn btn-primary">🛍️ Belanja Sekarang</a>
          <a href="../index.html" class="btn btn-secondary">🏠 Kembali ke Beranda</a>
        </div>
      </div>
    `;
    return;
  }

  const orders = Utils.loadFromStorage(CONFIG.STORAGE_KEYS.ORDERS, []);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    confirmationContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">❌</div>
        <h3>Data Pesanan Tidak Ditemukan</h3>
        <p>Kami tidak dapat menemukan pesanan dengan ID tersebut.</p>
        <div class="confirmation-actions">
          <a href="checkout.html" class="btn btn-primary">🛒 Kembali ke Checkout</a>
          <a href="products.html" class="btn btn-secondary">🛍️ Lanjutkan Belanja</a>
        </div>
      </div>
    `;
    return;
  }

  // Render complete order confirmation
  confirmationContainer.innerHTML = `
    <div class="confirmation-icon">🎉</div>
    <h2>Pesanan Berhasil!</h2>
    <p class="order-id">Order ID: <span>${order.id}</span></p>
    <p class="confirmation-message">Terima kasih telah berbelanja di QianlunShop. Pesanan Anda sedang diproses dengan aman.</p>
    
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
        <h4>📋 Ringkasan Pembayaran</h4>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${Utils.formatPrice(order.totals.subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Ongkos Kirim:</span>
          <span>${Utils.formatPrice(order.totals.shipping)}</span>
        </div>
        <div class="summary-row">
          <span>Pajak (${(CONFIG.TAX_RATE * 100)}%):</span>
          <span>${Utils.formatPrice(order.totals.tax)}</span>
        </div>
        ${order.totals.discount > 0 ? `
          <div class="summary-row discount">
            <span>Diskon:</span>
            <span>- ${Utils.formatPrice(order.totals.discount)}</span>
          </div>
        ` : ''}
        <div class="summary-row grand-total">
          <span>Total:</span>
          <span>${Utils.formatPrice(order.totals.grandTotal)}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>🚚 Informasi Pengiriman</h4>
        <div class="detail-item">
          <strong>Metode:</strong>
          <span>${order.shipping.methodName || order.shipping.method}</span>
        </div>
        <div class="detail-item">
          <strong>Estimasi Tiba:</strong>
          <span>${order.shipping.estimatedDelivery}</span>
        </div>
        <div class="detail-item">
          <strong>Alamat:</strong>
          <span>${order.customerInfo.address}, ${order.customerInfo.city} ${order.customerInfo.postalCode}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>💳 Informasi Pembayaran</h4>
        <div class="detail-item">
          <strong>Metode:</strong>
          <span>${order.payment.methodName || order.payment.method}</span>
        </div>
        ${order.payment.cardLastFour ? `
          <div class="detail-item">
            <strong>Kartu:</strong>
            <span>•••• ${order.payment.cardLastFour}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="confirmation-actions">
      <a href="products.html" class="btn btn-primary">🛍️ Lanjutkan Belanja</a>
      <a href="../index.html" class="btn btn-secondary">🏠 Kembali ke Beranda</a>
      <button class="btn btn-outline" id="printReceipt">🖨️ Cetak Struk</button>
    </div>

    <div class="confirmation-security">
      <p>🔒 Transaksi Anda aman dan terlindungi</p>
      <small>Jika ada pertanyaan, hubungi customer service kami</small>
    </div>
  `;

  // Print receipt functionality
  document.getElementById('printReceipt')?.addEventListener('click', () => {
    window.print();
  });

  // Track successful purchase
  Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.PURCHASE, {
    transaction_id: order.id,
    value: order.totals.grandTotal,
    currency: 'IDR'
  });
}

// =========================
// 🎯 Initialize All Features
// =========================
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 QianlunShop Enhanced Version Initializing...");

  // Initialize cart count on all pages
  updateCartCount();
  
  // Initialize cart page
  initCartPage();
  
  // Initialize product filters
  initProductFilters();
  
  // Initialize discover more
  initDiscoverMore();
  
  // Initialize checkout page
  initCheckoutPage();
  
  // Initialize order confirmation
  initOrderConfirmation();

  // Listen for cart updates from other tabs
  cart.on('cart-synced', () => {
    console.log("🔄 Cart synced across tabs");
    updateCartCount();
    
    // Re-render cart page if needed
    if (document.querySelector('.cart-container')) {
      initCartPage();
    }
  });

  console.log("✅ QianlunShop Enhanced Version Ready!");
});

// Export for use in other modules
export { showToast, updateCartCount, initCartPage, initProductFilters };