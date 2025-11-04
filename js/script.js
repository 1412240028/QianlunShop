// =========================
// 🏪 QIANLUNSHOP - FINAL VERSION
// =========================
import { Cart } from "./cart.js";

const cart = new Cart();

// =========================
// 🏷️ Toast Notification System
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
  
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// =========================
// 🛒 Update Navbar Cart Count
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
// ✨ Animasi Produk Terbang ke Cart
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
// 🛍️ Add to Cart Handler
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
// 🛒 Cart Page Renderer
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
            <button class="remove-item" data-id="${i.id}" title="Hapus item">🗑️</button>
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

          <div class="promo-section">
            <label for="cartPromoCode">Kode Promo</label>
            <div class="promo-input-group">
              <input type="text" id="cartPromoCode" placeholder="Masukkan kode promo">
              <button class="btn btn-promo" id="applyCartPromo">Terapkan</button>
            </div>
          </div>

          <div class="checkout-actions">
            <a href="checkout.html" class="btn btn-checkout" id="proceedToCheckout">
              🛍️ Lanjutkan ke Checkout
            </a>
            <a href="products.html" class="btn btn-secondary">Lanjutkan Belanja</a>
          </div>

          <div class="security-badge">
            <p>🔒 Transaksi 100% Aman & Terenkripsi</p>
          </div>
        </div>
      </div>
    `;

    attachCartEventListeners();
    console.log("✅ Cart rendered successfully");
  }

  function attachCartEventListeners() {
    document.querySelectorAll('.increase-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const item = cart.items.find(i => i.id === productId);
        if (item) {
          cart.update(productId, item.quantity + 1);
          renderCart();
          updateCartCount();
        }
      });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const item = cart.items.find(i => i.id === productId);
        if (item && item.quantity > 1) {
          cart.update(productId, item.quantity - 1);
          renderCart();
          updateCartCount();
        }
      });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        cart.remove(productId);
        renderCart();
        updateCartCount();
        showToast("🗑️ Item dihapus dari keranjang", "error");
      });
    });

    const checkoutBtn = document.getElementById('proceedToCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function(e) {
        if (cart.items.length === 0) {
          e.preventDefault();
          showToast('❌ Keranjang kosong. Tambahkan produk terlebih dahulu.', 'error');
        }
      });
    }

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
// 🔍 Product Search & Filter System
// =========================
function initProductFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetBtn = document.getElementById('resetFilter');
  const resetFromNoResults = document.getElementById('resetFromNoResults');
  const productGrid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');

  if (!searchInput || !productGrid) {
    console.log("ℹ️ Not on products page, skipping filter initialization");
    return;
  }

  console.log("🔍 Initializing product filters...");

  let allProducts = Array.from(productGrid.querySelectorAll('.product-card'));
  const originalProducts = [...allProducts];

  function updateResultCount(count) {
    if (resultCount) {
      resultCount.textContent = count;
    }
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    console.log("🔄 Applying filters:", { searchTerm, category, sortBy });

    let filteredProducts = allProducts.filter(product => {
      const name = product.dataset.name.toLowerCase();
      const productCategory = product.dataset.category;

      const matchesSearch = searchTerm === '' || name.includes(searchTerm);
      const matchesCategory = category === 'all' || productCategory === category;

      return matchesSearch && matchesCategory;
    });

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

    console.log("✅ Displayed", filteredProducts.length, "products");
  }

  function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    
    allProducts = [...originalProducts];
    updateProductDisplay(allProducts);
    
    console.log("🔄 Filters reset");
    showToast("🔄 Filter direset", "success");
  }

  // Event listeners
  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', resetFilters);
  
  if (resetFromNoResults) {
    resetFromNoResults.addEventListener('click', resetFilters);
  }

  updateResultCount(allProducts.length);
  console.log("✅ Product filters initialized with", allProducts.length, "products");
}

// =========================
// 🔍 Discover More - Product Navigation
// =========================
function initDiscoverMore() {
  /**
   * Add highlight animation styles
   */
  function addHighlightStyles() {
    if (document.getElementById('discover-more-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'discover-more-styles';
    style.textContent = `
      .product-card.highlighted {
        animation: highlightProduct 2s ease;
        border-color: var(--gold-accent) !important;
      }
      
      @keyframes highlightProduct {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        25%, 75% {
          transform: scale(1.03);
          box-shadow: 0 12px 35px rgba(212, 175, 55, 0.6);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 16px 45px rgba(244, 208, 63, 0.7);
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Handle product anchor navigation (e.g., products.html#p001)
   */
  function handleProductAnchor() {
    const hash = window.location.hash;
    
    if (hash && hash.startsWith('#p')) {
      setTimeout(() => {
        const productCard = document.querySelector(`[data-id="${hash.substring(1)}"]`);
        
        if (productCard) {
          // Smooth scroll to product
          productCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Add highlight animation
          productCard.classList.add('highlighted');
          
          // Remove highlight after animation
          setTimeout(() => {
            productCard.classList.remove('highlighted');
          }, 3000);
          
          console.log(`✨ Navigated to product: ${hash}`);
        }
      }, 300);
    }
  }

  /**
   * Track Discover More button clicks
   */
  function trackDiscoverMoreClicks() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-product') || 
          e.target.classList.contains('view-details')) {
        
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          const productId = productCard.dataset.id;
          const productName = productCard.dataset.name;
          
          console.log('🔍 Discover More clicked:', {
            id: productId,
            name: productName,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
  }

  // Initialize
  addHighlightStyles();
  handleProductAnchor();
  trackDiscoverMoreClicks();
  
  // Handle hash changes (browser back/forward)
  window.addEventListener('hashchange', handleProductAnchor);
  
  console.log('✅ Discover More functionality initialized');
}

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
    if (!checkoutItems) return;
    
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
    const shippingSelect = document.getElementById('shipping');
    if (shippingSelect) {
      this.updateShippingCost(shippingSelect.value);
    }
    const grandTotal = subtotal + this.shippingCost - this.discount;

    const subtotalEl = document.getElementById('subtotal');
    const shippingCostEl = document.getElementById('shippingCost');
    const grandTotalEl = document.getElementById('grandTotal');

    if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
    if (shippingCostEl) shippingCostEl.textContent = this.formatPrice(this.shippingCost);
    if (grandTotalEl) grandTotalEl.textContent = this.formatPrice(grandTotal);
  }

  updateShippingCost(method) {
    switch(method) {
      case 'regular': this.shippingCost = 25000; break;
      case 'express': this.shippingCost = 50000; break;
      case 'same-day': this.shippingCost = 75000; break;
      default: this.shippingCost = 0;
    }
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
      checkoutForm.addEventListener('input', this.validateForm.bind(this));
    }
  }

  applyPromoCode() {
    const promoCodeEl = document.getElementById('promoCode');
    if (!promoCodeEl) return;

    const promoCode = promoCodeEl.value.trim().toUpperCase();
    const discountRules = {
      'WELCOME10': 0.1,
      'DRAGON20': 0.2,
      'QIANLUN15': 0.15,
      'LUXURY25': 0.25
    };

    if (discountRules[promoCode]) {
      const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      this.discount = subtotal * discountRules[promoCode];
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
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) isValid = false;
    });

    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    if (!paymentSelected) isValid = false;

    const creditCardCheck = document.getElementById('creditCard');
    if (creditCardCheck && creditCardCheck.checked) {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
      cardFields.forEach(field => {
        const element = document.getElementById(field);
        if (element && !element.value.trim()) isValid = false;
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
      const placeOrderBtn = document.getElementById('placeOrder');
      if (placeOrderBtn) {
        placeOrderBtn.innerHTML = '🔄 Memproses...';
        placeOrderBtn.disabled = true;
      }

      await this.simulatePayment();

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

      this.saveOrder(order);
      this.clearCart();
      showToast('Pesanan berhasil diproses!', 'success');

      setTimeout(() => {
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
      }, 2000);

    } catch (error) {
      console.error('Order error:', error);
      showToast('Terjadi kesalahan saat memproses pesanan', 'error');
      
      const placeOrderBtn = document.getElementById('placeOrder');
      if (placeOrderBtn) {
        placeOrderBtn.innerHTML = '🛍️ Bayar Sekarang';
        placeOrderBtn.disabled = false;
      }
    }
  }

  simulatePayment() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.1 ? resolve() : reject(new Error('Payment failed'));
      }, 2000);
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
    return {
      method: shippingSelect?.value || 'regular',
      cost: this.shippingCost,
      estimatedDelivery: this.getEstimatedDelivery(shippingSelect?.value || 'regular')
    };
  }

  getPaymentInfo() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    const info = { method: paymentMethod?.value || 'unknown' };

    if (paymentMethod?.value === 'creditCard') {
      const cardNumber = document.getElementById('cardNumber');
      if (cardNumber) {
        info.cardLastFour = cardNumber.value.slice(-4);
      }
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

// =========================
// 💳 Initialize Checkout Page
// =========================
function initCheckoutPage() {
  const checkoutContainer = document.querySelector(".checkout-container");
  if (!checkoutContainer) {
    console.log("ℹ️ Bukan halaman checkout");
    return;
  }
  console.log("💳 Initializing checkout page...");
  new CheckoutManager();
}

// =========================
// 📦 Order Confirmation Page
// =========================
function initOrderConfirmation() {
  const confirmationContainer = document.querySelector(".order-confirmation");
  if (!confirmationContainer) {
    console.log("ℹ️ Bukan halaman konfirmasi pesanan");
    return;
  }

  console.log("✅ Initializing order confirmation page...");
  
  // Get order ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');
  
  if (!orderId) {
    console.error("❌ Order ID tidak ditemukan");
    confirmationContainer.innerHTML = `
      <div class="error-state">
        <h2>❌ Pesanan Tidak Ditemukan</h2>
        <p>Silakan kembali ke halaman checkout atau periksa riwayat pesanan Anda.</p>
        <div class="action-buttons">
          <a href="checkout.html" class="btn btn-primary">Kembali ke Checkout</a>
          <a href="products.html" class="btn btn-secondary">Lanjutkan Belanja</a>
        </div>
      </div>
    `;
    return;
  }

  // Load order data from localStorage
  const orders = JSON.parse(localStorage.getItem('qianlun_orders')) || [];
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    console.error("❌ Data pesanan tidak ditemukan untuk ID:", orderId);
    confirmationContainer.innerHTML = `
      <div class="error-state">
        <h2>❌ Data Pesanan Tidak Ditemukan</h2>
        <p>Pesanan dengan ID ${orderId} tidak dapat ditemukan dalam sistem.</p>
        <div class="action-buttons">
          <a href="checkout.html" class="btn btn-primary">Kembali ke Checkout</a>
          <a href="index.html" class="btn btn-secondary">Kembali ke Beranda</a>
        </div>
      </div>
    `;
    return;
  }

  console.log("📦 Order data loaded:", order);
  renderOrderConfirmation(order);
}

function renderOrderConfirmation(order) {
  const container = document.querySelector(".order-confirmation");
  
  const itemsHTML = order.items.map(item => `
    <div class="order-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='../assets/sample1.jpg'">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>${formatCategory(item.category)}</p>
        <p class="item-quantity">Qty: ${item.quantity}</p>
      </div>
      <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  const orderDate = new Date(order.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  container.innerHTML = `
    <div class="confirmation-header">
      <div class="success-icon">🎉</div>
      <h1>Pesanan Berhasil Diproses!</h1>
      <p class="order-number">Order ID: <strong>${order.id}</strong></p>
      <p class="order-date">Tanggal Pesanan: ${orderDate}</p>
    </div>

    <div class="confirmation-content">
      <div class="order-summary">
        <h3>📦 Ringkasan Pesanan</h3>
        <div class="order-items">
          ${itemsHTML}
        </div>
        
        <div class="order-totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatPrice(order.totals.subtotal)}</span>
          </div>
          <div class="total-row">
            <span>Biaya Pengiriman:</span>
            <span>${formatPrice(order.totals.shipping)}</span>
          </div>
          <div class="total-row">
            <span>Diskon:</span>
            <span>- ${formatPrice(order.totals.discount)}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Pembayaran:</span>
            <span>${formatPrice(order.totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div class="customer-info">
        <div class="info-section">
          <h3>👤 Informasi Pelanggan</h3>
          <p><strong>Nama:</strong> ${order.customerInfo.fullName}</p>
          <p><strong>Email:</strong> ${order.customerInfo.email}</p>
          <p><strong>Telepon:</strong> ${order.customerInfo.phone}</p>
        </div>

        <div class="info-section">
          <h3>🚚 Pengiriman</h3>
          <p><strong>Alamat:</strong> ${order.customerInfo.address}</p>
          <p><strong>Kota:</strong> ${order.customerInfo.city}</p>
          <p><strong>Kode Pos:</strong> ${order.customerInfo.postalCode}</p>
          <p><strong>Metode:</strong> ${getShippingMethodName(order.shipping.method)}</p>
          <p><strong>Estimasi Tiba:</strong> ${order.shipping.estimatedDelivery}</p>
        </div>

        <div class="info-section">
          <h3>💳 Pembayaran</h3>
          <p><strong>Metode:</strong> ${getPaymentMethodName(order.payment.method)}</p>
          ${order.payment.cardLastFour ? 
            `<p><strong>Kartu:</strong> **** **** **** ${order.payment.cardLastFour}</p>` : ''}
          <p class="payment-status"><strong>Status:</strong> <span class="status-completed">✅ Berhasil</span></p>
        </div>
      </div>
    </div>

    <div class="confirmation-actions">
      <div class="action-buttons">
        <button class="btn btn-primary" id="printInvoice">🖨️ Cetak Invoice</button>
        <a href="products.html" class="btn btn-secondary">🛍️ Lanjutkan Belanja</a>
        <a href="index.html" class="btn btn-outline">🏠 Kembali ke Beranda</a>
      </div>
      
      <div class="support-info">
        <p>📞 Butuh bantuan? <a href="contact.html">Hubungi Customer Service</a></p>
        <p>✉️ Detail pesanan telah dikirim ke email ${order.customerInfo.email}</p>
      </div>
    </div>
  `;

  // Add event listener for print button
  document.getElementById('printInvoice')?.addEventListener('click', () => {
    window.print();
  });
}

// Helper functions for order confirmation
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}

function formatCategory(category) {
  const categories = {
    'watch': 'Luxury Watch',
    'bag': 'Luxury Bag',
    'shoes': 'Luxury Shoes',
    'wallet': 'Luxury Wallet'
  };
  return categories[category] || category;
}

function getShippingMethodName(method) {
  const methods = {
    'regular': 'Reguler (5-7 hari)',
    'express': 'Express (2-3 hari)',
    'same-day': 'Same Day'
  };
  return methods[method] || method;
}

function getPaymentMethodName(method) {
  const methods = {
    'creditCard': 'Kartu Kredit',
    'bankTransfer': 'Transfer Bank',
    'ewallet': 'E-Wallet',
    'cod': 'Cash on Delivery'
  };
  return methods[method] || method;
}

// =========================
// 📱 Mobile Menu Handler
// =========================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });

    // Close menu when window is resized to desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
  }
}

// =========================
// 🎯 Main Initialization
// =========================
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 QianlunShop Initializing...");
  
  // Initialize all systems
  updateCartCount();
  initCartPage();
  initProductFilters();
  initDiscoverMore();
  initCheckoutPage();
  initOrderConfirmation();
  initMobileMenu();

  console.log("✅ QianlunShop Successfully Initialized!");
});

// =========================
// 🌐 Global Error Handler
// =========================
window.addEventListener('error', function(e) {
  console.error('Global Error:', e.error);
});