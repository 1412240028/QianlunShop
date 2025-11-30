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
export const LoadingState = {
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
  }
};

// =========================
// ❌ Error Display Manager
// =========================
export const ErrorDisplay = {
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
  }
};

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
    toast.innerHTML = `
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
