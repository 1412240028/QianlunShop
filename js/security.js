// =========================
// 🔒 QIANLUNSHOP - SECURITY MODULE
// Rate limiting, input validation, XSS prevention
// =========================

import { CONFIG } from './config.js';

// =========================
// 🚦 API RATE LIMITER
// =========================
export class ApiRateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   * @param {string} key - Unique identifier (IP, user ID, etc)
   * @returns {boolean}
   */
  isAllowed(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove old requests outside the time window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      console.warn(`⚠️ Rate limit exceeded for: ${key}`);
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  /**
   * Reset rate limit for a key
   * @param {string} key
   */
  reset(key) {
    this.requests.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll() {
    this.requests.clear();
  }

  /**
   * Get remaining requests for a key
   * @param {string} key
   * @returns {number}
   */
  getRemaining(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Create singleton instances
export const apiRateLimiter = new ApiRateLimiter(100, 60000);
export const userActionLimiter = new ApiRateLimiter(50, 60000); // User actions: 50 per minute

// =========================
// 🛡️ INPUT VALIDATION
// =========================
export const InputValidator = {
  /**
   * Validate email format
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Validate phone number (Indonesian format)
   */
  validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  },

  /**
   * Validate credit card number (Luhn algorithm)
   */
  validateCreditCard(cardNumber) {
    if (!cardNumber || typeof cardNumber !== 'string') return false;
    
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  /**
   * Validate CVV
   */
  validateCVV(cvv) {
    if (!cvv || typeof cvv !== 'string') return false;
    return /^\d{3,4}$/.test(cvv);
  },

  /**
   * Validate postal code (Indonesian format)
   */
  validatePostalCode(code) {
    if (!code || typeof code !== 'string') return false;
    return /^\d{5}$/.test(code);
  },

  /**
   * Validate required field
   */
  validateRequired(value, minLength = 1) {
    if (!value || typeof value !== 'string') return false;
    return value.trim().length >= minLength;
  },

  /**
   * Validate string length
   */
  validateLength(value, min = 0, max = Infinity) {
    if (!value || typeof value !== 'string') return false;
    const length = value.trim().length;
    return length >= min && length <= max;
  },

  /**
   * Validate numeric value
   */
  validateNumber(value, min = -Infinity, max = Infinity) {
    const num = Number(value);
    if (isNaN(num) || !isFinite(num)) return false;
    return num >= min && num <= max;
  },

  /**
   * Validate URL
   */
  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

// =========================
// 🧹 SANITIZATION
// =========================
export const Sanitizer = {
  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(html) {
    if (typeof html !== 'string') return '';
    
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  },

  /**
 * Advanced Input Sanitization
 * Protects against: XSS, SQL Injection, Path Traversal
 * 
 * @param {string} input - User input to sanitize
 * @param {object} options - Configuration options
 * @returns {string} - Sanitized safe string
 */
sanitizeInput(input, options = {}) {
  if (typeof input !== 'string') return '';
  
  const {
    maxLength = 1000,
    allowHTML = false,
    allowedTags = [],
    strictMode = true
  } = options;
  
  let cleaned = input.trim();
  
  // 1. Length protection
  if (cleaned.length > maxLength) {
    console.warn(`Input truncated from ${cleaned.length} to ${maxLength} chars`);
    cleaned = cleaned.substring(0, maxLength);
  }
  
  // 2. Remove script tags (all variants)
  cleaned = cleaned.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
    ''
  );
  cleaned = cleaned.replace(/<script[^>]*>/gi, '');
  
  // 3. Remove event handlers (onclick, onerror, etc)
  cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // 4. Remove javascript: protocol
  cleaned = cleaned.replace(/javascript:/gi, '');
  cleaned = cleaned.replace(/jscript:/gi, '');
  cleaned = cleaned.replace(/vbscript:/gi, '');
  
  // 5. Remove data: protocol (base64 exploits)
  if (!allowedTags.includes('img')) {
    cleaned = cleaned.replace(/data:/gi, '');
  }
  
  // 6. SQL Injection prevention
  if (strictMode) {
    // Remove SQL keywords and operators
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
      'ALTER', 'EXEC', 'EXECUTE', 'UNION', 'JOIN'
    ];
    
    sqlKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '');
    });
    
    // Remove SQL operators
    cleaned = cleaned.replace(/('|(\-\-)|(;)|(\|\|))/g, '');
  }
  
  // 7. Path traversal prevention
  cleaned = cleaned.replace(/\.\.\/|\.\.\\\\/g, '');
  cleaned = cleaned.replace(/\.\.\\|\.\.\\\\/g, '');
  
  // 8. HTML entity encoding (if not allowing HTML)
  if (!allowHTML) {
    cleaned = cleaned
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  // 9. Remove null bytes
  cleaned = cleaned.replace(/\0/g, '');
  
  // 10. Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned;
},

  /**
   * Sanitize SQL-like strings (for NoSQL queries)
   */
  sanitizeQuery(query) {
    if (typeof query !== 'string') return '';
    
    return query
      .replace(/['";\-\\]/g, '')
      .replace(/\$where/gi, '')
      .replace(/\$regex/gi, '')
      .trim();
  },

  /**
   * Escape HTML entities
   */
  escapeHTML(text) {
    if (typeof text !== 'string') return '';
    
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return text.replace(/[&<>"'/]/g, char => map[char]);
  },

  /**
   * Remove dangerous characters from filename
   */
  sanitizeFilename(filename) {
    if (typeof filename !== 'string') return '';
    
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .substring(0, 255);
  }
};

// Create singleton for easy access
export const inputSanitizer = {
  sanitize: Sanitizer.sanitizeInput,
  sanitizeHTML: Sanitizer.sanitizeHTML,
  escape: Sanitizer.escapeHTML,
  sanitizeQuery: Sanitizer.sanitizeQuery,
  sanitizeFilename: Sanitizer.sanitizeFilename
};

// =========================
// 🔐 ENCRYPTION HELPERS
// =========================
export const Crypto = {
  /**
   * Generate random ID
   */
  generateId(prefix = 'ID', length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = prefix + '-';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result + '-' + Date.now();
  },

  /**
   * Simple hash function (NOT for passwords!)
   */
  simpleHash(str) {
    if (typeof str !== 'string') return '';
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  },

  /**
   * Generate UUID v4
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Mask credit card number
   */
  maskCreditCard(cardNumber) {
    if (!cardNumber || typeof cardNumber !== 'string') return '';
    
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) return '****';
    
    return '**** **** **** ' + cleaned.slice(-4);
  },

  /**
   * Mask email
   */
  maskEmail(email) {
    if (!email || typeof email !== 'string') return '';
    
    const [username, domain] = email.split('@');
    if (!username || !domain) return '***@***.com';
    
    const maskedUsername = username.charAt(0) + 
                          '*'.repeat(Math.max(0, username.length - 2)) + 
                          username.charAt(username.length - 1);
    
    return `${maskedUsername}@${domain}`;
  }
};

// =========================
// 🔒 SESSION MANAGEMENT
// =========================
export class SessionManager {
  constructor(timeout = 3600000) { // 1 hour default
    this.timeout = timeout;
    this.sessionKey = 'qianlunshop_session';
    this.init();
  }

  init() {
    this.startSessionCheck();
  }

  /**
   * Create new session
   */
  create(userData = {}) {
    const session = {
      id: Crypto.generateUUID(),
      userId: userData.userId || null,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      expiresAt: Date.now() + this.timeout,
      data: userData
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    console.log('✅ Session created:', session.id);
    
    return session;
  }

  /**
   * Get current session
   */
  get() {
    try {
      const data = sessionStorage.getItem(this.sessionKey);
      if (!data) return null;

      const session = JSON.parse(data);
      
      // Check if expired
      if (Date.now() > session.expiresAt) {
        this.destroy();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Session error:', error);
      return null;
    }
  }

  /**
   * Update session activity
   */
  touch() {
    const session = this.get();
    if (!session) return false;

    session.lastActivity = Date.now();
    session.expiresAt = Date.now() + this.timeout;
    
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    return true;
  }

  /**
   * Destroy session
   */
  destroy() {
    sessionStorage.removeItem(this.sessionKey);
    console.log('🗑️ Session destroyed');
  }

  /**
   * Check if session is valid
   */
  isValid() {
    const session = this.get();
    return session !== null;
  }

  /**
   * Start automatic session check
   */
  startSessionCheck() {
    setInterval(() => {
      const session = this.get();
      if (!session) return;

      const timeRemaining = session.expiresAt - Date.now();
      
      // Warn user 5 minutes before expiry
      if (timeRemaining < 300000 && timeRemaining > 0) {
        console.warn('⚠️ Session expiring soon');
        
        const event = new CustomEvent('session-expiring', {
          detail: { timeRemaining }
        });
        window.dispatchEvent(event);
      }

      // Session expired
      if (timeRemaining <= 0) {
        this.destroy();
        
        const event = new CustomEvent('session-expired');
        window.dispatchEvent(event);
      }
    }, 60000); // Check every minute
  }
}

// =========================
// 🛡️ CONTENT SECURITY POLICY
// =========================
export const CSP = {
  /**
   * Check if Content-Security-Policy is set
   */
  isEnabled() {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return meta !== null;
  },

  /**
   * Get current CSP
   */
  getPolicy() {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return meta ? meta.getAttribute('content') : null;
  },

  /**
   * Recommended CSP for production
   */
  getRecommendedPolicy() {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.qianlunshop.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }
};

// =========================
// 🔍 SECURITY AUDIT
// =========================
export const SecurityAudit = {
  /**
   * Run security audit
   */
  run() {
    const results = {
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // Check localStorage usage
    results.checks.localStorage = {
      enabled: typeof localStorage !== 'undefined',
      itemCount: localStorage.length,
      totalSize: this.getStorageSize('localStorage')
    };

    // Check sessionStorage usage
    results.checks.sessionStorage = {
      enabled: typeof sessionStorage !== 'undefined',
      itemCount: sessionStorage.length,
      totalSize: this.getStorageSize('sessionStorage')
    };

    // Check HTTPS
    results.checks.https = {
      enabled: window.location.protocol === 'https:',
      recommendation: 'Always use HTTPS in production'
    };

    // Check CSP
    results.checks.csp = {
      enabled: CSP.isEnabled(),
      policy: CSP.getPolicy(),
      recommendation: CSP.getRecommendedPolicy()
    };

    // Check sensitive data in storage
    results.checks.sensitiveData = this.checkSensitiveData();

    console.table(results.checks);
    return results;
  },

  /**
   * Get storage size
   */
  getStorageSize(storageType) {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    let total = 0;

    for (let key in storage) {
      if (storage.hasOwnProperty(key)) {
        total += storage[key].length + key.length;
      }
    }

    return `${(total / 1024).toFixed(2)} KB`;
  },

  /**
   * Check for sensitive data in storage
   */
  checkSensitiveData() {
    const sensitiveKeywords = [
      'password', 'pwd', 'pass',
      'credit', 'card', 'cvv', 'cvc',
      'ssn', 'social',
      'secret', 'token', 'key'
    ];

    const warnings = [];

    [localStorage, sessionStorage].forEach((storage, index) => {
      const storageType = index === 0 ? 'localStorage' : 'sessionStorage';
      
      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          const lowerKey = key.toLowerCase();
          
          for (const keyword of sensitiveKeywords) {
            if (lowerKey.includes(keyword)) {
              warnings.push({
                storage: storageType,
                key: key,
                warning: `Potentially sensitive data in ${storageType}: ${key}`
              });
            }
          }
        }
      }
    });

    return {
      safe: warnings.length === 0,
      warnings: warnings
    };
  }
};

// =========================
// 🚀 EXPORT ALL
// =========================
export default {
  ApiRateLimiter,
  apiRateLimiter,
  userActionLimiter,
  InputValidator,
  Sanitizer,
  inputSanitizer,
  Crypto,
  SessionManager,
  CSP,
  SecurityAudit
};

console.log('✅ Security module loaded');