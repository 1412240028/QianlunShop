// =========================
// ⚙️ QIANLUNSHOP - CONFIGURATION
// Centralized config untuk consistency
// =========================

export const CONFIG = {
    // 🗄️ LocalStorage Keys
    STORAGE_KEYS: {
      CART: 'qianlunshop_cart',
      ORDERS: 'qianlunshop_orders',
      USER: 'qianlunshop_user',
      WISHLIST: 'qianlunshop_wishlist',
      RECENT_VIEWS: 'qianlunshop_recent_views'
    },
  
    // 🎫 Promo Codes (format: CODE: discount_percentage)
    PROMO_CODES: {
      'WELCOME10': 0.1,    // 10% discount
      'DRAGON20': 0.2,     // 20% discount
      'QIANLUN15': 0.15,   // 15% discount
      'LUXURY25': 0.25,    // 25% discount
      'NEWYEAR30': 0.3     // 30% discount (seasonal)
    },
  
    // 🚚 Shipping Methods & Costs (in IDR)
    SHIPPING: {
      REGULAR: 25000,      // 5-7 hari
      EXPRESS: 50000,      // 2-3 hari
      SAME_DAY: 75000,     // Same day delivery
      FREE: 0              // Free shipping (untuk promo)
    },
  
    // 🏷️ Product Categories
    CATEGORIES: {
      WATCH: {
        id: 'watch',
        name: 'Luxury Watch',
        icon: '⌚',
        description: 'Timepieces that define elegance'
      },
      BAG: {
        id: 'bag',
        name: 'Luxury Bag',
        icon: '👜',
        description: 'Sophisticated handbags for every occasion'
      },
      SHOES: {
        id: 'shoes',
        name: 'Luxury Shoes',
        icon: '👞',
        description: 'Step into luxury with premium footwear'
      },
      WALLET: {
        id: 'wallet',
        name: 'Luxury Wallet',
        icon: '👛',
        description: 'Elegant wallets for the discerning'
      }
    },
  
    // 💳 Payment Methods
    PAYMENT_METHODS: {
      CREDIT_CARD: {
        id: 'creditCard',
        name: 'Kartu Kredit',
        icon: '💳',
        description: 'Visa, Mastercard, JCB'
      },
      BANK_TRANSFER: {
        id: 'bankTransfer',
        name: 'Transfer Bank',
        icon: '🏦',
        description: 'BCA, Mandiri, BNI, BRI'
      },
      E_WALLET: {
        id: 'ewallet',
        name: 'E-Wallet',
        icon: '📱',
        description: 'GoPay, OVO, Dana, ShopeePay'
      },
      COD: {
        id: 'cod',
        name: 'Cash on Delivery',
        icon: '💵',
        description: 'Bayar saat barang diterima'
      }
    },
  
    // ⏱️ Delivery Estimates (in days)
    DELIVERY_TIME: {
      REGULAR: { min: 5, max: 7 },
      EXPRESS: { min: 2, max: 3 },
      SAME_DAY: { min: 0, max: 0 }
    },
  
    // 💰 Free Shipping Threshold
    FREE_SHIPPING_THRESHOLD: 5000000, // Rp 5 juta
  
    // 📧 Contact Information
    CONTACT: {
      EMAIL: 'hello@qianlunshop.com',
      PHONE: '+62 812-3456-7890',
      WHATSAPP: '+6281234567890',
      ADDRESS: 'Tuban, East Java, Indonesia',
      SUPPORT_EMAIL: 'support@qianlunshop.com'
    },
  
    // 🌐 Social Media
    SOCIAL_MEDIA: {
      INSTAGRAM: 'https://instagram.com/qianlunshop',
      FACEBOOK: 'https://facebook.com/qianlunshop',
      TWITTER: 'https://twitter.com/qianlunshop',
      TIKTOK: 'https://tiktok.com/@qianlunshop'
    },
  
    // 🎨 Theme Colors (untuk dynamic theming di masa depan)
    THEME: {
      PRIMARY: '#d4af37',      // Gold
      SECONDARY: '#f4d03f',    // Light Gold
      DARK: '#0a0a0a',         // Background Dark
      LIGHT: '#e8e8e8',        // Text Light
      SUCCESS: '#2ecc71',      // Success Green
      ERROR: '#e74c3c'         // Error Red
    },
  
    // ⚡ Performance Settings
    PERFORMANCE: {
      DEBOUNCE_DELAY: 300,           // ms untuk search debounce
      ANIMATION_DELAY: 100,          // ms untuk stagger animations
      TOAST_DURATION: 2500,          // ms untuk toast notifications
      LAZY_LOAD_THRESHOLD: 200      // px sebelum image dimuat
    },
  
    // 🔒 Security Settings
    SECURITY: {
      MAX_CART_ITEMS: 50,            // Max items di cart
      MAX_QUANTITY_PER_ITEM: 99,     // Max quantity per item
      SESSION_TIMEOUT: 3600000,      // 1 hour in ms
      MAX_LOGIN_ATTEMPTS: 5
    },
  
    // 📱 PWA Settings
    PWA: {
      APP_NAME: 'QianlunShop',
      SHORT_NAME: 'QianlunShop',
      THEME_COLOR: '#d4af37',
      BACKGROUND_COLOR: '#0a0a0a'
    },
  
    // 🔔 Notification Messages
    MESSAGES: {
      ADD_TO_CART_SUCCESS: '✅ Produk ditambahkan ke keranjang!',
      REMOVE_FROM_CART: '🗑️ Item dihapus dari keranjang',
      CART_EMPTY: '🛒 Keranjang Anda masih kosong',
      ORDER_SUCCESS: '🎉 Pesanan berhasil diproses!',
      ORDER_FAILED: '❌ Terjadi kesalahan saat memproses pesanan',
      PROMO_APPLIED: '🎉 Kode promo berhasil diterapkan!',
      PROMO_INVALID: '❌ Kode promo tidak valid',
      FORM_INCOMPLETE: '❌ Harap lengkapi semua field yang wajib diisi',
      PAYMENT_PROCESSING: '🔄 Memproses pembayaran...',
      FILTER_RESET: '🔄 Filter direset',
      QUANTITY_UPDATED: '✅ Jumlah diperbarui',
      NETWORK_ERROR: '❌ Koneksi bermasalah. Coba lagi.'
    },
  
    // 📊 Analytics Events (untuk Google Analytics / tracking)
    ANALYTICS_EVENTS: {
      ADD_TO_CART: 'add_to_cart',
      REMOVE_FROM_CART: 'remove_from_cart',
      BEGIN_CHECKOUT: 'begin_checkout',
      PURCHASE: 'purchase',
      VIEW_PRODUCT: 'view_item',
      SEARCH: 'search',
      APPLY_PROMO: 'apply_promo'
    },
  
    // 🛡️ Validation Rules
    VALIDATION: {
      EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PHONE_REGEX: /^(\+62|62|0)[0-9]{9,12}$/,
      POSTAL_CODE_REGEX: /^[0-9]{5}$/,
      CREDIT_CARD_REGEX: /^[0-9]{13,19}$/,
      CVV_REGEX: /^[0-9]{3,4}$/,
      MIN_NAME_LENGTH: 3,
      MAX_NAME_LENGTH: 100,
      MIN_ADDRESS_LENGTH: 10,
      MAX_ADDRESS_LENGTH: 500
    },
  
    // 💾 Cache Settings (untuk PWA)
    CACHE: {
      VERSION: 'v1',
      STATIC_CACHE: 'qianlun-static-v1',
      DYNAMIC_CACHE: 'qianlun-dynamic-v1',
      IMAGE_CACHE: 'qianlun-images-v1',
      MAX_AGE: 86400000 // 24 hours in ms
    }
  };
  
  // =========================
  // 🔧 Utility Functions
  // =========================
  export const Utils = {
    /**
     * Format price to Indonesian Rupiah
     */
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(price);
    },
  
    /**
     * Format date to Indonesian locale
     */
    formatDate(date, options = {}) {
      const defaultOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(date).toLocaleDateString('id-ID', { ...defaultOptions, ...options });
    },
  
    /**
     * Sanitize user input to prevent XSS
     */
    sanitizeInput(input) {
      const div = document.createElement('div');
      div.textContent = input;
      return div.innerHTML;
    },
  
    /**
     * Debounce function for performance
     */
    debounce(func, wait = CONFIG.PERFORMANCE.DEBOUNCE_DELAY) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  
    /**
     * Generate unique ID
     */
    generateId(prefix = 'ID') {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
  
    /**
     * Validate email
     */
    validateEmail(email) {
      return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
    },
  
    /**
     * Validate phone number
     */
    validatePhone(phone) {
      return CONFIG.VALIDATION.PHONE_REGEX.test(phone);
    },
  
    /**
     * Calculate discount amount
     */
    calculateDiscount(price, discountPercentage) {
      return price * discountPercentage;
    },
  
    /**
     * Check if free shipping eligible
     */
    isFreeShippingEligible(cartTotal) {
      return cartTotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
    },
  
    /**
     * Get estimated delivery date
     */
    getEstimatedDelivery(shippingMethod) {
      const today = new Date();
      const deliveryTime = CONFIG.DELIVERY_TIME[shippingMethod.toUpperCase()];
      
      if (!deliveryTime) return null;
      
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + deliveryTime.min);
      
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + deliveryTime.max);
      
      if (deliveryTime.min === deliveryTime.max) {
        return this.formatDate(minDate);
      }
      
      return `${this.formatDate(minDate, { weekday: 'short', day: 'numeric', month: 'short' })} - ${this.formatDate(maxDate, { weekday: 'short', day: 'numeric', month: 'short' })}`;
    },
  
    /**
     * Store data to localStorage with error handling
     */
    saveToStorage(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Storage Error:', error);
        return false;
      }
    },
  
    /**
     * Load data from localStorage with error handling
     */
    loadFromStorage(key, defaultValue = null) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (error) {
        console.error('Storage Error:', error);
        return defaultValue;
      }
    },
  
    /**
     * Track analytics event (placeholder for GA4)
     */
    trackEvent(eventName, eventParams = {}) {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
      }
      console.log('📊 Analytics Event:', eventName, eventParams);
    }
  };
  
  // =========================
  // 🎯 Export Default
  // =========================
  export default CONFIG;