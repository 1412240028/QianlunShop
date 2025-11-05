// =========================
// 🏪 QIANLUNSHOP - FIXED VERSION
// =========================
import { Cart } from "./cart.js";

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
  }, 2500);
}

// =========================
// 🛒 Update Navbar Cart Count - FIXED
// =========================
function updateCartCount() {
  const countElements = document.querySelectorAll(".cart-count");
  if (countElements.length === 0) return;

  const count = cart.getItemCount();
  countElements.forEach(el => {
    el.textContent = count;
    console.log("📊 Cart count updated:", count);
  });
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
// 🛒 Cart Page Renderer - FIXED
// =========================
function initCartPage() {
  const container = document.querySelector(".cart-container");
  if (!container) {
    console.log("ℹ️ Bukan halaman cart");
    return;
  }

  console.log("🛒 Initializing cart page...");

  function renderCart() {
    const items = cart.items.filter(i => i && i.id && i.name && i.price && i.quantity);
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Keranjang Kamu Masih Kosong</h3>
          <p>Temukan koleksi terbaik dari QianlunShop dan rasakan kemewahannya ✨</p>
          <a href="products.html" class="btn btn-primary">Jelajahi Produk</a>
        </div>
      `;
      updateCartCount();
      return;
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const itemsHTML = items.map(i => {
      const itemPrice = i.price.toLocaleString("id-ID");
      const itemTotal = (i.price * i.quantity).toLocaleString("id-ID");
      const image = i.image || "../assets/sample1.jpg";

      return `
        <div class="cart-item fade-in" data-id="${i.id}">
          <img src="${image}" alt="${i.name}" onerror="this.src='../assets/sample1.jpg'">
          <div class="cart-info">
            <h3>${i.name}</h3>
            <p class="item-price">Rp ${itemPrice}</p>

            <div class="cart-actions">
              <button class="decrease-quantity" data-id="${i.id}">-</button>
              <input type="number" value="${i.quantity}" min="1" class="quantity-input" data-id="${i.id}" readonly>
              <button class="increase-quantity" data-id="${i.id}">+</button>
            </div>

            <button class="remove-item" data-id="${i.id}" title="Hapus item">🗑️ Hapus</button>
          </div>

          <div class="item-total-section">
            <p class="item-total">Rp ${itemTotal}</p>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="cart-header"> 
        <h2>🛒 Keranjang Belanja</h2>
        <p>Kelola produk favorit kamu sebelum checkout</p>
      </div>

      <div class="cart-items">
        ${itemsHTML}
      </div>

      <div class="cart-summary">
        <h3>Ringkasan Pesanan</h3>
        <div class="summary-details">
          <div class="summary-row"><span>Subtotal:</span><span>Rp ${subtotal.toLocaleString("id-ID")}</span></div>
          <div class="summary-row"><span>Pengiriman:</span><span>Gratis</span></div>
          <div class="summary-row"><span>Diskon:</span><span>- Rp 0</span></div>
          <div class="summary-row grand-total"><span>Total:</span><span>Rp ${subtotal.toLocaleString("id-ID")}</span></div>
        </div>

        <div class="promo-section">
          <label for="cartPromoCode">Kode Promo</label>
          <div class="promo-input-group">
            <input type="text" id="cartPromoCode" placeholder="Masukkan kode promo...">
            <button class="btn btn-promo" id="applyCartPromo">Terapkan</button>
          </div>
        </div>

        <div class="checkout-actions">
          <a href="checkout.html" class="btn btn-checkout">🛍️ Lanjutkan ke Checkout</a>
          <a href="products.html" class="btn btn-secondary">⬅️ Kembali Belanja</a>
        </div>

        <p class="security-info">🔒 Transaksi Aman & Terlindungi</p>
      </div>
    `;

    attachCartEventListeners();
  }

  function attachCartEventListeners() {
    document.querySelectorAll(".increase-quantity").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = cart.items.find(i => i.id === id);
        if (item) {
          cart.update(id, item.quantity + 1);
          renderCart();
          updateCartCount();
        }
      });
    });

    document.querySelectorAll(".decrease-quantity").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = cart.items.find(i => i.id === id);
        if (item && item.quantity > 1) {
          cart.update(id, item.quantity - 1);
          renderCart();
          updateCartCount();
        }
      });
    });

    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        cart.remove(id);
        renderCart();
        updateCartCount();
        showToast("🗑️ Item dihapus dari keranjang", "error");
      });
    });

    const applyPromo = document.getElementById("applyCartPromo");
    if (applyPromo) {
      applyPromo.addEventListener("click", () => {
        const code = document.getElementById("cartPromoCode").value.trim().toUpperCase();
        if (code === "QIANLUN10") {
          showToast("🎉 Diskon 10% diterapkan!", "success");
        } else if (code) {
          showToast("❌ Kode promo tidak valid", "error");
        }
      });
    }
  }

  renderCart();
}

// =========================
// 🔍 Product Search & Filter - FIXED
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
    showToast("🔄 Filter direset", "success");
  }

  // Event listeners
  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', resetFilters);

  // FIXED: Reset button dari no-results
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
        border-color: var(--gold-accent) !important;
      }
      
      @keyframes highlightProduct {
        0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
        25%, 75% { transform: scale(1.03); box-shadow: 0 12px 35px rgba(212, 175, 55, 0.6); }
        50% { transform: scale(1.05); box-shadow: 0 16px 45px rgba(244, 208, 63, 0.7); }
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
// 💳 Checkout Manager - FIXED
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
    updateCartCount(); // FIXED: Update cart count
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
    const grandTotal = subtotal + this.shippingCost - this.discount;

    const subtotalEl = document.getElementById('subtotal');
    const shippingCostEl = document.getElementById('shippingCost');
    const grandTotalEl = document.getElementById('grandTotal');

    if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
    if (shippingCostEl) shippingCostEl.textContent = this.formatPrice(this.shippingCost);
    if (grandTotalEl) grandTotalEl.textContent = this.formatPrice(grandTotal);
  }

  updateShippingCost(method) {
    switch (method) {
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
      showToast(`🎉 Promo code "${promoCode}" berhasil diterapkan!`, 'success');
      this.calculateTotals();
    } else {
      showToast('❌ Kode promo tidak valid', 'error');
      this.discount = 0;
      this.calculateTotals();
    }
  }

  async placeOrder() {
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
    return new Promise((resolve) => setTimeout(resolve, 2000));
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
    switch (method) {
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
    updateCartCount();
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
  if (!checkoutContainer) return;
  console.log("💳 Initializing checkout page...");
  new CheckoutManager();
}

// =========================
// 📦 Order Confirmation Page - FIXED & COMPLETE
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
        <p>Sepertinya Anda membuka halaman ini tanpa menyelesaikan transaksi.</p>
        <div class="confirmation-actions">
          <a href="products.html" class="btn btn-primary">🛍️ Belanja Sekarang</a>
          <a href="../index.html" class="btn btn-secondary">🏠 Kembali ke Beranda</a>
        </div>
      </div>
    `;
    return;
  }

  const orders = JSON.parse(localStorage.getItem('qianlun_orders')) || [];
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

  // Helper function to format price
  function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Format shipping method
  const shippingMethods = {
    'regular': 'Regular Delivery (5 Hari)',
    'express': 'Express Delivery (2 Hari)',
    'same-day': 'Same Day Delivery'
  };

  // Render complete order confirmation
  confirmationContainer.innerHTML = `
    <div class="confirmation-icon">🎉</div>
    <h2>Pesanan Berhasil!</h2>
    <p class="order-id">Order ID: <span>${order.id}</span></p>
    <p>Terima kasih telah berbelanja di QianlunShop. Pesanan Anda sedang diproses dengan aman.</p>
    
    <div class="confirmation-details">
      <div class="detail-item">
        <strong>📅 Estimasi Pengiriman:</strong>
        <span>${order.shipping.estimatedDelivery}</span>
      </div>
      <div class="detail-item">
        <strong>💰 Total Pembayaran:</strong>
        <span>${formatPrice(order.totals.grandTotal)}</span>
      </div>
      <div class="detail-item">
        <strong>🚚 Metode Pengiriman:</strong>
        <span>${shippingMethods[order.shipping.method] || 'Standard Shipping'}</span>
      </div>
      <div class="detail-item">
        <strong>📧 Email Konfirmasi:</strong>
        <span>${order.customerInfo.email}</span>
      </div>
    </div>

    <div class="confirmation-actions">
      <a href="../index.html" class="btn btn-primary">🏠 Kembali ke Beranda</a>
      <a href="products.html" class="btn btn-secondary">🛍️ Lanjutkan Belanja</a>
    </div>
  `;

  console.log("✅ Order confirmation loaded successfully");
}

// =========================
// 📱 Mobile Menu Handler - FIXED
// =========================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.navbar ul'); // FIXED: selector

  if (!mobileMenuBtn || !navLinks) {
    console.log("ℹ️ Mobile menu elements not found");
    return;
  }

  console.log("📱 Initializing mobile menu...");

  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    console.log("📱 Mobile menu toggled");
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    }
  });

  // Close on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinks.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    }
  });
}

// =========================
// 🎯 Main Initialization
// =========================
document.addEventListener("DOMContentLoaded", function () {
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
window.addEventListener('error', function (e) {
  console.error('Global Error:', e.error);
})