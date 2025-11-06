// =========================
// 🔐 AUTH GUARD - Route Protection & Access Control
// Middleware untuk protect halaman dari unauthorized access
// =========================

import { userManager } from "./user-manager.js";
import { CONFIG } from "./config.js";

export class AuthGuard {
  constructor() {
    this.publicRoutes = [
      'index.html',
      'products.html',
      'about.html',
      'contact.html',
      'login.html',
      'register.html',
      '' // root path
    ];

    this.protectedRoutes = [
      'cart.html',
      'checkout.html',
      'profile.html',
      'order-confirmation.html'
    ];

    this.authRoutes = [
      'login.html',
      'register.html'
    ];

    this.init();
  }

  // =========================
  // 🚀 INITIALIZATION
  // =========================

  init() {
    this.checkPageAccess();
    this.setupSessionMonitoring();
    this.setupStorageListener();
    console.log("🔐 AuthGuard initialized");
  }

  // =========================
  // 🛡️ PAGE ACCESS CONTROL
  // =========================

  checkPageAccess() {
    const currentPage = this.getCurrentPage();
    const isLoggedIn = userManager.isLoggedIn();

    console.log("🔍 Checking access:", { currentPage, isLoggedIn });

    // If user is logged in and tries to access login/register page
    if (isLoggedIn && this.isAuthRoute(currentPage)) {
      console.log("✋ Logged in user accessing auth page, redirecting to home");
      this.redirectTo('../index.html', 'Anda sudah login');
      return;
    }

    // If user is not logged in and tries to access protected page
    if (!isLoggedIn && this.isProtectedRoute(currentPage)) {
      console.log("🚫 Unauthorized access to protected page");
      this.redirectTo('login.html', 'Silakan login terlebih dahulu', 'warning');
      return;
    }

    // Allow access
    console.log("✅ Access granted");
  }

  // =========================
  // 📍 ROUTE HELPERS
  // =========================

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename;
  }

  isPublicRoute(page) {
    return this.publicRoutes.some(route => 
      page === route || page.endsWith(route)
    );
  }

  isProtectedRoute(page) {
    return this.protectedRoutes.some(route => 
      page === route || page.endsWith(route)
    );
  }

  isAuthRoute(page) {
    return this.authRoutes.some(route => 
      page === route || page.endsWith(route)
    );
  }

  // =========================
  // 🔄 REDIRECT HANDLING
  // =========================

  redirectTo(page, message = null, type = 'info') {
    if (message) {
      // Store message in sessionStorage for showing after redirect
      sessionStorage.setItem('auth_redirect_message', JSON.stringify({
        message,
        type
      }));
    }

    // Determine if we need to go up directory
    const currentPage = this.getCurrentPage();
    const isInPagesDir = window.location.pathname.includes('/pages/');
    
    let redirectUrl = page;
    
    // If current page is in /pages/ and target is not, go up
    if (isInPagesDir && !page.startsWith('../') && !page.startsWith('/')) {
      // Check if target is a protected/auth route (should be in pages)
      if (this.isProtectedRoute(page) || this.isAuthRoute(page)) {
        redirectUrl = page; // Stay in same directory
      } else {
        redirectUrl = '../' + page; // Go up to root
      }
    }

    console.log("🔄 Redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
  }

  // =========================
  // ⏱️ SESSION MONITORING
  // =========================

  setupSessionMonitoring() {
    // Check session every 5 minutes
    setInterval(() => {
      this.validateSession();
    }, 5 * 60 * 1000);

    // Check session on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.validateSession();
      }
    });

    // Check session on window focus
    window.addEventListener('focus', () => {
      this.validateSession();
    });
  }

  validateSession() {
    const isLoggedIn = userManager.isLoggedIn();
    const currentPage = this.getCurrentPage();

    if (!isLoggedIn && this.isProtectedRoute(currentPage)) {
      console.log("⚠️ Session expired, redirecting to login");
      userManager.logout();
      this.redirectTo('login.html', 'Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
    }
  }

  // =========================
  // 🔊 CROSS-TAB SYNC
  // =========================

  setupStorageListener() {
    // Listen for storage changes (logout in other tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'qianlunshop_session') {
        console.log("🔄 Session changed in another tab");
        
        const currentPage = this.getCurrentPage();
        const isLoggedIn = userManager.isLoggedIn();

        // If session was removed and we're on protected page
        if (!isLoggedIn && this.isProtectedRoute(currentPage)) {
          this.redirectTo('login.html', 'Anda telah logout di tab lain', 'info');
        }

        // If session was added and we're on auth page
        if (isLoggedIn && this.isAuthRoute(currentPage)) {
          this.redirectTo('../index.html', 'Login berhasil di tab lain', 'success');
        }
      }
    });
  }

  // =========================
  // 💬 SHOW REDIRECT MESSAGE
  // =========================

  showRedirectMessage() {
    const messageData = sessionStorage.getItem('auth_redirect_message');
    if (!messageData) return;

    try {
      const { message, type } = JSON.parse(messageData);
      sessionStorage.removeItem('auth_redirect_message');

      // Show toast notification
      this.showToast(message, type);
    } catch (error) {
      console.error("Error showing redirect message:", error);
    }
  }

  showToast(message, type = 'info') {
    // Create or get toast element
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.display = 'block';

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.style.display = 'none', 300);
    }, 3000);
  }

  // =========================
  // 🔧 UTILITY METHODS
  // =========================

  requireAuth(callback) {
    if (!userManager.isLoggedIn()) {
      this.redirectTo('login.html', 'Silakan login untuk melanjutkan', 'warning');
      return false;
    }
    if (callback) callback();
    return true;
  }

  requireGuest(callback) {
    if (userManager.isLoggedIn()) {
      this.redirectTo('../index.html', 'Anda sudah login', 'info');
      return false;
    }
    if (callback) callback();
    return true;
  }

  // Get current user safely
  getCurrentUser() {
    if (!userManager.isLoggedIn()) {
      return null;
    }
    return userManager.getCurrentUser();
  }
}

// =========================
// 🌐 SINGLETON INSTANCE
// =========================

export const authGuard = new AuthGuard();

// Show any redirect messages after page load
window.addEventListener('DOMContentLoaded', () => {
  authGuard.showRedirectMessage();
});

export default AuthGuard;