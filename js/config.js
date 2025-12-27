// =========================
// ⚙️ QIANLUNSHOP - ENHANCED CONFIGURATION
// Centralized config + Advanced utilities
// =========================

export const CONFIG = {
  // 🗄️ LocalStorage Keys
  STORAGE_KEYS: {
    CART: 'qianlunshop_cart',
    ORDERS: 'qianlunshop_orders',
    USER: 'qianlunshop_user',
    WISHLIST: 'qianlunshop_wishlist',
    RECENT_VIEWS: 'qianlunshop_recent_views',
    PREFERENCES: 'qianlunshop_preferences'
  },

  // 🎫 Promo Codes
  PROMO_CODES: {
    'WELCOME10': { discount: 0.1, minPurchase: 0, maxDiscount: 500000 },
    'DRAGON20': { discount: 0.2, minPurchase: 1000000, maxDiscount: 1000000 },
    'QIANLUN15': { discount: 0.15, minPurchase: 500000, maxDiscount: 750000 },
    'LUXURY25': { discount: 0.25, minPurchase: 2000000, maxDiscount: 2000000 },
    'NEWYEAR30': { discount: 0.3, minPurchase: 3000000, maxDiscount: 3000000 }
  },

  // 🚚 Shipping Methods
  SHIPPING: {
    REGULAR: { cost: 25000, days: { min: 5, max: 7 }, name: 'Regular Delivery' },
    EXPRESS: { cost: 50000, days: { min: 2, max: 3 }, name: 'Express Delivery' },
    SAME_DAY: { cost: 75000, days: { min: 0, max: 0 }, name: 'Same Day Delivery' },
    FREE: { cost: 0, days: { min: 7, max: 14 }, name: 'Free Shipping' }
  },

  // 🏷️ Product Categories
  CATEGORIES: {
    WATCH: {
      id: 'watch',
      name: 'Luxury Watch',
      icon: '⌚',
      description: 'Timepieces that define elegance',
      color: '#d4af37'
    },
    BAG: {
      id: 'bag',
      name: 'Luxury Bag',
      icon: '👜',
      description: 'Sophisticated handbags',
      color: '#c9a961'
    },
    SHOES: {
      id: 'shoes',
      name: 'Luxury Shoes',
      icon: '👞',
      description: 'Premium footwear',
      color: '#b8941e'
    },
    WALLET: {
      id: 'wallet',
      name: 'Luxury Wallet',
      icon: '👛',
      description: 'Elegant wallets',
      color: '#a17e1a'
    }
  },

  // 💳 Payment Methods
  PAYMENT_METHODS: {
    CREDIT_CARD: {
      id: 'creditCard',
      name: 'Kartu Kredit',
      icon: '💳',
      description: 'Visa, Mastercard, JCB',
      fee: 0
    },
    BANK_TRANSFER: {
      id: 'bankTransfer',
      name: 'Transfer Bank',
      icon: '🏦',
      description: 'BCA, Mandiri, BNI, BRI',
      fee: 0
    },
    E_WALLET: {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: '📱',
      description: 'GoPay, OVO, Dana, ShopeePay',
      fee: 0
    },
    COD: {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Bayar saat terima',
      fee: 10000
    }
  },

  // 💰 Pricing Rules
  FREE_SHIPPING_THRESHOLD: 5000000,
  TAX_RATE: 0.11, // PPN 11%
  CURRENCY: 'IDR',
  LOCALE: 'id-ID',

  // 📧 Contact Information
  CONTACT: {
    EMAIL: 'hello@qianlunshop.com',
    PHONE: '+62 812-3456-7890',
    WHATSAPP: '+6281234567890',
    ADDRESS: 'Tuban, East Java, Indonesia',
    SUPPORT_EMAIL: 'support@qianlunshop.com',
    HOURS: 'Senin - Jumat, 09:00 - 18:00 WIB'
  },

  // 🌐 Social Media
  SOCIAL_MEDIA: {
    INSTAGRAM: { url: 'https://instagram.com/qianlunshop', handle: '@qianlunshop' },
    FACEBOOK: { url: 'https://facebook.com/qianlunshop', handle: 'QianlunShop' },
    TWITTER: { url: 'https://twitter.com/qianlunshop', handle: '@qianlunshop' },
    TIKTOK: { url: 'https://tiktok.com/@qianlunshop', handle: '@qianlunshop' }
  },

  // 🎨 Theme Colors
  THEME: {
    PRIMARY: '#d4af37',
    SECONDARY: '#f4d03f',
    DARK: '#0a0a0a',
    LIGHT: '#e8e8e8',
    SUCCESS: '#2ecc71',
    ERROR: '#e74c3c',
    WARNING: '#f39c12',
    INFO: '#3498db'
  },

  // 📐 Z-Index Layers
  Z_INDEX: {
    TOAST: 1000,
    MODAL: 1100,
    DROPDOWN: 1200,
    LOADING: 1300
  },

  // ⚡ Performance Settings
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    ANIMATION_DELAY: 100,
    TOAST_DURATION: 2500,
    LAZY_LOAD_THRESHOLD: 200,
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },

  // 🔒 Security Settings
  SECURITY: {
    MAX_CART_ITEMS: 50,
    MAX_QUANTITY_PER_ITEM: 99,
    SESSION_TIMEOUT: 3600000,
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
    LOCK_TIMEOUT: 5000
  },

  // 📱 PWA Settings
  PWA: {
    APP_NAME: 'QianlunShop',
    SHORT_NAME: 'QianlunShop',
    THEME_COLOR: '#d4af37',
    BACKGROUND_COLOR: '#0a0a0a',
    DISPLAY: 'standalone',
    ORIENTATION: 'portrait'
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
    PROMO_MIN_PURCHASE: '⚠️ Belanja minimum tidak tercapai',
    FORM_INCOMPLETE: '❌ Harap lengkapi semua field yang wajib diisi',
    PAYMENT_PROCESSING: '🔄 Memproses pembayaran...',
    FILTER_RESET: '🔄 Filter direset',
    QUANTITY_UPDATED: '✅ Jumlah diperbarui',
    NETWORK_ERROR: '❌ Koneksi bermasalah. Coba lagi.',
    SESSION_EXPIRED: '⚠️ Sesi Anda telah berakhir',
    LOADING: '⏳ Memuat...'
  },

  // 📊 Analytics Events
  ANALYTICS_EVENTS: {
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    BEGIN_CHECKOUT: 'begin_checkout',
    PURCHASE: 'purchase',
    VIEW_PRODUCT: 'view_item',
    SEARCH: 'search',
    APPLY_PROMO: 'apply_promo',
    PAGE_VIEW: 'page_view',
    ERROR: 'error_occurred'
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
    MAX_ADDRESS_LENGTH: 500,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128
  },

  // 💾 Cache Settings
  CACHE: {
    VERSION: 'v2',
    STATIC_CACHE: 'qianlun-static-v2',
    DYNAMIC_CACHE: 'qianlun-dynamic-v2',
    IMAGE_CACHE: 'qianlun-images-v2',
    MAX_AGE: 86400000
  }
};

// =========================
// 🔧 ENHANCED UTILITY FUNCTIONS
// =========================
export const Utils = {
  /**
   * Format price to Indonesian Rupiah
   */
  formatPrice(price) {
    if (typeof price !== 'number' || !isFinite(price)) {
      return 'Rp 0';
    }
    return new Intl.NumberFormat(CONFIG.LOCALE, {
      style: 'currency',
      currency: CONFIG.CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString(CONFIG.LOCALE, { ...defaultOptions, ...options });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  },

  /**
   * Sanitize user input (XSS prevention)
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML
      .replace(/[<>\"']/g, '')
      .trim()
      .substring(0, 1000);
  },

  /**
   * Sanitize HTML (more aggressive)
   */
  sanitizeHTML(html) {
    if (typeof html !== 'string') return '';
    
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  },

  /**
   * Debounce function
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
   * Throttle function
   */
  throttle(func, limit = 1000) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
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
    if (typeof email !== 'string') return false;
    return CONFIG.VALIDATION.EMAIL_REGEX.test(email.trim());
  },

  /**
   * Validate phone number
   */
  validatePhone(phone) {
    if (typeof phone !== 'string') return false;
    return CONFIG.VALIDATION.PHONE_REGEX.test(phone.trim());
  },

  /**
   * Calculate discount with rules
   */
  calculateDiscount(price, promoCode) {
    const promo = CONFIG.PROMO_CODES[promoCode];
    if (!promo) return 0;
    
    if (price < promo.minPurchase) return 0;
    
    const discount = price * promo.discount;
    return Math.min(discount, promo.maxDiscount);
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
    const shipping = CONFIG.SHIPPING[shippingMethod.toUpperCase()];
    if (!shipping) return 'Unknown';
    
    const today = new Date();
    const { min, max } = shipping.days;
    
    if (min === max && min === 0) {
      return 'Hari Ini';
    }
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + min);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + max);
    
    if (min === max) {
      return this.formatDate(minDate);
    }
    
    return `${this.formatDate(minDate, { day: 'numeric', month: 'short' })} - ${this.formatDate(maxDate, { day: 'numeric', month: 'short' })}`;
  },

  /**
   * Store data with error handling
   */
  saveToStorage(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage Error:', error);
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded');
      }
      return false;
    }
  },

  /**
   * Load data with validation
   */
  loadFromStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Storage Load Error:', error);
      return defaultValue;
    }
  },

  /**
   * Track analytics event
   */
  trackEvent(eventName, eventParams = {}) {
    try {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
      }
      
      // Custom analytics
      console.log('📊 Analytics Event:', eventName, eventParams);
      
      // Store for offline sync
      const events = this.loadFromStorage('analytics_queue', []);
      events.push({
        event: eventName,
        params: eventParams,
        timestamp: Date.now()
      });
      this.saveToStorage('analytics_queue', events);
      
    } catch (error) {
      console.error('Analytics Error:', error);
    }
  },

  /**
   * Retry async operation
   */
  async retry(fn, maxAttempts = CONFIG.PERFORMANCE.MAX_RETRY_ATTEMPTS) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
        await new Promise(resolve => 
          setTimeout(resolve, CONFIG.PERFORMANCE.RETRY_DELAY * (i + 1))
        );
      }
    }
  },

  /**
   * Check online status
   */
  isOnline() {
    return navigator.onLine;
  },

  /**
   * Deep clone object
   */
  deepClone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.error('Deep clone error:', error);
      return obj;
    }
  },

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get device info
   */
  getDeviceInfo() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTablet: /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent),
      isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  }
};

export default CONFIG;