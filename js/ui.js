// =========================
// 🖥️ QIANLUNSHOP - UI MODULE
// Toast notifications, animations, loading states
// =========================
import { CONFIG, Utils } from "./config.js";

// =========================
// 🏷️ Toast Notification System
// =========================
export function showToast(message, type = "success") {
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
export function updateCartCount(cart) {
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
export function flyToCart(imgEl) {
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
// ⏳ Loading State Manager
// =========================
export const loadingState = {
  show(elementId, text = 'Loading...') {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>${text}</p>
      </div>
    `;
    el.disabled = true;
    el.classList.add('loading-state');
  },

  hide(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.disabled = false;
    el.classList.remove('loading-state');
  },

  // Show loading on button
  showButton(buttonElement, text = 'Loading...') {
    if (!buttonElement) return;
    
    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.innerHTML = `
      <span class="button-spinner"></span>
      <span>${text}</span>
    `;
    buttonElement.disabled = true;
  },

  // Hide loading on button
  hideButton(buttonElement) {
    if (!buttonElement) return;
    
    buttonElement.innerHTML = buttonElement.dataset.originalText || 'Submit';
    buttonElement.disabled = false;
  }
};

// Backward compatibility
export const LoadingState = loadingState;

// =========================
// ❌ Error Display Manager
// =========================
export const errorDisplay = {
  show(elementId, message, type = 'error') {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML = `
      <div class="error-display ${type}">
        <div class="error-icon">${type === 'error' ? '❌' : '⚠️'}</div>
        <p>${message}</p>
        <button class="error-close" onclick="this.parentElement.style.display='none'">×</button>
      </div>
    `;
    el.style.display = 'block';
  },

  hide(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.style.display = 'none';
    }
  },

  // Show inline error on form field
  showField(fieldElement, message) {
    if (!fieldElement) return;

    // Remove existing error
    const existingError = fieldElement.parentElement.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    // Add error class to field
    fieldElement.classList.add('error');

    // Create error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'field-error';
    errorMsg.textContent = message;
    fieldElement.parentElement.appendChild(errorMsg);
  },

  // Hide inline error on form field
  hideField(fieldElement) {
    if (!fieldElement) return;

    fieldElement.classList.remove('error');
    const errorMsg = fieldElement.parentElement.querySelector('.field-error');
    if (errorMsg) {
      errorMsg.remove();
    }
  }
};

// Backward compatibility
export const ErrorDisplay = errorDisplay;

// =========================
// 🍞 Toast Manager - Advanced Toast System
// =========================
export class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  show(message, type = 'info', duration = CONFIG.PERFORMANCE.TOAST_DURATION) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add icon based on type
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  clear() {
    this.container.innerHTML = '';
  }
}

// Create global toast manager instance
export const toastManager = new ToastManager();

// =========================
// 🎬 Animation Helpers
// =========================
export const Animation = {
  /**
   * Fade in element
   */
  fadeIn(element, duration = 300) {
    if (!element) return;

    element.style.opacity = '0';
    element.style.display = 'block';

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      
      element.style.opacity = Math.min(progress / duration, 1);
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  /**
   * Fade out element
   */
  fadeOut(element, duration = 300) {
    if (!element) return;

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      
      element.style.opacity = 1 - Math.min(progress / duration, 1);
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
      }
    };

    requestAnimationFrame(animate);
  },

  /**
   * Slide down element
   */
  slideDown(element, duration = 300) {
    if (!element) return;

    element.style.height = '0px';
    element.style.overflow = 'hidden';
    element.style.display = 'block';

    const height = element.scrollHeight;
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      
      element.style.height = Math.min((progress / duration) * height, height) + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.height = '';
        element.style.overflow = '';
      }
    };

    requestAnimationFrame(animate);
  },

  /**
   * Slide up element
   */
  slideUp(element, duration = 300) {
    if (!element) return;

    const height = element.scrollHeight;
    element.style.height = height + 'px';
    element.style.overflow = 'hidden';

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      
      element.style.height = height - Math.min((progress / duration) * height, height) + 'px';
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
      }
    };

    requestAnimationFrame(animate);
  }
};

// =========================
// 🎨 Modal Manager
// =========================
export const Modal = {
  /**
   * Show modal
   */
  show(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hide(modalId);
      }
    });
  },

  /**
   * Hide modal
   */
  hide(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');
    document.body.style.overflow = '';
  },

  /**
   * Create dynamic modal
   */
  create(content, options = {}) {
    const modalId = 'dynamic-modal-' + Date.now();
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="document.getElementById('${modalId}').remove()">×</button>
        ${options.title ? `<h2 class="modal-title">${options.title}</h2>` : ''}
        <div class="modal-body">
          ${content}
        </div>
        ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
      </div>
    `;

    document.body.appendChild(modal);
    
    setTimeout(() => this.show(modalId), 10);

    return modalId;
  }
};

// =========================
// 📊 Progress Bar
// =========================
export const ProgressBar = {
  /**
   * Show progress bar
   */
  show(elementId, progress = 0) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
        <span class="progress-text">${progress}%</span>
      </div>
    `;
  },

  /**
   * Update progress
   */
  update(elementId, progress) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const fill = el.querySelector('.progress-fill');
    const text = el.querySelector('.progress-text');

    if (fill) fill.style.width = progress + '%';
    if (text) text.textContent = progress + '%';
  }
};

// =========================
// 🔔 Notification Badge
// =========================
export const Badge = {
  /**
   * Update badge count
   */
  update(elementId, count) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (count > 0) {
      el.textContent = count > 99 ? '99+' : count;
      el.classList.remove('empty');
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 500);
    } else {
      el.textContent = '0';
      el.classList.add('empty');
    }
  }
};

console.log('✅ UI module loaded');