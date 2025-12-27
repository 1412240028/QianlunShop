// =========================
// 🛡️ ERROR HANDLER MODULE - QIANLUNSHOP
// Global error boundary and error management
// =========================
import { CONFIG, Utils } from "./config.js";

// =========================
// 🛡️ Global Error Boundary
// =========================
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 50;
    this.init();
  }

  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack
      });
    });

    // Network error handler
    window.addEventListener('offline', () => {
      this.showNetworkError('Koneksi internet terputus');
    });

    window.addEventListener('online', () => {
      this.showNetworkRecovery('Koneksi internet tersambung kembali');
    });

    console.log("🛡️ Error handler initialized");
  }

  handleError(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: {
        name: error?.name || 'UnknownError',
        message: error?.message || 'Unknown error occurred',
        stack: error?.stack || ''
      },
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        online: navigator.onLine,
        ...context
      }
    };

    // Log to console in development
    if (CONFIG.DEBUG) {
      console.error('🚨 Error caught by error handler:', errorInfo);
    }

    // Store error for analysis
    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Save to localStorage for persistence
    this.saveErrors();

    // Show user-friendly error message
    this.showUserError(errorInfo);

    // Track analytics
    Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.ERROR, {
      error_type: context.type || 'unknown',
      error_message: error?.message || 'Unknown error',
      url: window.location.href
    });

    // Prevent default error handling for known errors
    if (this.isRecoverableError(error)) {
      return true; // Prevent default
    }

    return false; // Allow default handling
  }

  isRecoverableError(error) {
    // Define recoverable errors that shouldn't crash the app
    const recoverablePatterns = [
      /NetworkError/i,
      /TimeoutError/i,
      /AbortError/i,
      /QuotaExceededError/i,
      /NotAllowedError/i
    ];

    const message = error?.message || '';
    return recoverablePatterns.some(pattern => pattern.test(message));
  }

  showUserError(errorInfo) {
    const { error, context } = errorInfo;

    let message = '';
    let type = 'error';

    switch (context.type) {
      case 'network_error':
        message = 'Terjadi masalah koneksi. Silakan periksa internet Anda.';
        break;
      case 'storage_error':
        message = 'Penyimpanan browser penuh. Silakan hapus cache atau data browsing.';
        break;
      case 'javascript_error':
        message = 'Terjadi kesalahan teknis. Halaman akan dimuat ulang.';
        // Auto-reload for critical JS errors
        setTimeout(() => window.location.reload(), 3000);
        break;
      case 'unhandled_promise_rejection':
        message = 'Terjadi kesalahan dalam pemrosesan. Silakan coba lagi.';
        break;
      default:
        message = 'Terjadi kesalahan yang tidak terduga. Silakan refresh halaman.';
    }

    // Import showToast dynamically to avoid circular dependencies
    this.showToast(message, type);
  }

  showNetworkError(message) {
    this.showToast(message, 'warning');
  }

  showNetworkRecovery(message) {
    this.showToast(message, 'success');
  }

  showToast(message, type = "error") {
    // Try to use global showToast if available
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
    } else {
      // Fallback: create a simple toast
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#2ecc71'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 5000);
    }
  }

  saveErrors() {
    try {
      Utils.saveToStorage('error_logs', this.errors);
    } catch (e) {
      console.warn('Failed to save error logs:', e);
    }
  }

  loadErrors() {
    return Utils.loadFromStorage('error_logs', []);
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    Utils.saveToStorage('error_logs', []);
  }

  getErrorSummary() {
    const summary = {
      total: this.errors.length,
      byType: {},
      recent: this.errors.slice(-10)
    };

    this.errors.forEach(error => {
      const type = error.context.type || 'unknown';
      summary.byType[type] = (summary.byType[type] || 0) + 1;
    });

    return summary;
  }

  exportErrors() {
    const data = {
      exportedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errors: this.errors
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qianlunshop-errors-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// =========================
// 🛡️ Cart Error Handler
// =========================
export class CartErrorHandler {
  static handleStorageError(error) {
    if (error.name === 'QuotaExceededError') {
      const message = 'Penyimpanan keranjang penuh. Beberapa item mungkin tidak tersimpan.';
      ErrorHandler.prototype.showToast(message, 'warning');

      // Emit storage error event
      const event = new CustomEvent('storage-error', {
        detail: { type: 'quota', message: message }
      });
      window.dispatchEvent(event);

      return true; // Handled
    }
    return false; // Not handled
  }

  static handleNetworkError(operation) {
    const message = `Gagal ${operation} karena masalah koneksi. Silakan coba lagi.`;
    ErrorHandler.prototype.showToast(message, 'error');

    return true;
  }

  static handleValidationError(field, message) {
    const errorMessage = message || `Field ${field} tidak valid`;
    ErrorHandler.prototype.showToast(errorMessage, 'error');

    // Focus on invalid field
    const element = document.getElementById(field);
    if (element) {
      element.focus();
      element.classList.add('error');
      setTimeout(() => element.classList.remove('error'), 3000);
    }

    return true;
  }
}

// =========================
// 🛡️ API Error Handler
// =========================
export class APIErrorHandler {
  static handleResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static handleFetchError(error, operation = 'memuat data') {
    let message = `Gagal ${operation}. `;

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      message += 'Periksa koneksi internet Anda.';
    } else if (error.name === 'AbortError') {
      message += 'Permintaan dibatalkan.';
    } else {
      message += 'Silakan coba lagi.';
    }

    ErrorHandler.prototype.showToast(message, 'error');
    return error;
  }

  static handleTimeout(operation = 'memuat data') {
    const message = `Waktu ${operation} habis. Silakan coba lagi.`;
    ErrorHandler.prototype.showToast(message, 'warning');
  }
}

// =========================
// 🛡️ Form Error Handler
// =========================
export class FormErrorHandler {
  static showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('error');

    // Create or update error message
    let errorEl = field.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('field-error')) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }

    errorEl.textContent = message;
    errorEl.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.clearFieldError(fieldId);
    }, 5000);
  }

  static clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('error');

    const errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains('field-error')) {
      errorEl.style.display = 'none';
    }
  }

  static validateAndShowErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const fields = form.querySelectorAll('input, select, textarea');
    let hasErrors = false;

    fields.forEach(field => {
      const isValid = this.validateField(field);
      if (!isValid) {
        hasErrors = true;
      }
    });

    return !hasErrors;
  }

  static validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Required validation
    if (field.required && !value) {
      isValid = false;
      message = 'Field ini wajib diisi';
    }

    // Type-specific validation
    if (isValid) {
      switch (field.type) {
        case 'email':
          if (value && !Utils.validateEmail(value)) {
            isValid = false;
            message = 'Format email tidak valid';
          }
          break;
        case 'tel':
          if (value && !Utils.validatePhone(value)) {
            isValid = false;
            message = 'Format nomor telepon tidak valid';
          }
          break;
        case 'number':
          if (value && isNaN(value)) {
            isValid = false;
            message = 'Harus berupa angka';
          }
          break;
      }
    }

    // Min/max length validation
    if (isValid && field.minLength && value.length < field.minLength) {
      isValid = false;
      message = `Minimal ${field.minLength} karakter`;
    }

    if (isValid && field.maxLength && value.length > field.maxLength) {
      isValid = false;
      message = `Maksimal ${field.maxLength} karakter`;
    }

    if (!isValid) {
      this.showFieldError(field.id || field.name, message);
    } else {
      this.clearFieldError(field.id || field.name);
    }

    return isValid;
  }
}

// =========================
// 🛡️ Performance Error Handler
// =========================
export class PerformanceErrorHandler {
  static monitorPerformance() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) { // Long task > 100ms
            console.warn('🚨 Long task detected:', entry);
            Utils.trackEvent('performance_long_task', {
              duration: entry.duration,
              start_time: entry.startTime
            });
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    }

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = performance.memory;
        const usagePercent = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100;

        if (usagePercent > 80) {
          console.warn('🚨 High memory usage:', usagePercent.toFixed(1) + '%');
          Utils.trackEvent('performance_memory_high', {
            usage_percent: usagePercent,
            used_heap: memInfo.usedJSHeapSize,
            total_heap: memInfo.totalJSHeapSize
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  static monitorNetworkRequests() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.responseStatus >= 400) {
            console.warn('🚨 Failed network request:', entry);
            Utils.trackEvent('network_error', {
              url: entry.name,
              status: entry.responseStatus,
              duration: entry.responseEnd - entry.requestStart
            });
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }
}

// =========================
// 🛡️ Initialize Error Handler
// =========================
export const errorHandler = new ErrorHandler();

// Initialize performance monitoring
PerformanceErrorHandler.monitorPerformance();
PerformanceErrorHandler.monitorNetworkRequests();

export default errorHandler;
