// =========================
// 🏪 QIANLUNSHOP - MAIN SCRIPT
// Modular architecture with imported components
// =========================
import { Cart } from "./cart.js";
import { CONFIG, Utils } from "./config.js";
import { showToast, updateCartCount, flyToCart, loadingState, errorDisplay, toastManager } from "./ui.js";
import { initCartPage } from "./cart.js";
import { initProductFilters, initDiscoverMore, initProductAddToCart, initLazyLoading, initOptimizedSearch } from "./products.js";
import { initCheckoutPage } from "./checkout.js";
import { errorHandler } from "./error-handler.js";
import { apiRateLimiter, userActionLimiter, inputSanitizer } from "./security.js";

// =========================
// 🎯 Global Cart Instance
// =========================
const cart = new Cart();

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
  console.log("🚀 QianlunShop Modular Version Initializing...");

  // Initialize cart count on all pages
  updateCartCount();

  // Initialize all page-specific features
  initCartPage();
  initProductFilters();
  initDiscoverMore();
  initProductAddToCart();
  initLazyLoading();
  initOptimizedSearch();
  initCheckoutPage();
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

  console.log("✅ QianlunShop Modular Version Ready!");
});

// =========================
// 🎯 Global Exports for Interoperability
// =========================
window.QianlunShop = {
  cart,
  showToast,
  updateCartCount,
  flyToCart,
  Utils,
  CONFIG,
  loadingState,
  errorDisplay,
  toastManager,
  apiRateLimiter,
  userActionLimiter,
  inputSanitizer,
  errorHandler
};
