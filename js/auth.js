// =========================
// 🔐 AUTHENTICATION UI - INTEGRATED WITH AUTH GUARD
// Handles login/register modals, forms, and validation
// =========================

import { userManager } from "./user-manager.js";
import { authGuard } from "./auth-guard.js";
import { CONFIG } from "./config.js";

export class AuthUI {
  constructor() {
    this.currentModal = null;
    this.init();
  }

  // =========================
  // 🚀 INITIALIZATION
  // =========================

  init() {
    this.createModals();
    this.attachEventListeners();
    this.updateUI();
    
    // Listen to auth events
    userManager.on('login', () => this.handleLoginSuccess());
    userManager.on('logout', () => this.handleLogoutSuccess());
    userManager.on('session-expired', () => this.handleSessionExpired());
    
    console.log("🔐 AuthUI initialized");
  }

  // =========================
  // 🎨 CREATE MODALS
  // =========================

  createModals() {
    // Login Modal
    const loginModal = this.createElement('div', {
      className: 'auth-modal',
      id: 'loginModal',
      innerHTML: `
        <div class="auth-modal-content">
          <div class="auth-modal-header">
            <h2>Masuk ke QianlunShop</h2>
            <button class="auth-modal-close" data-action="close">&times;</button>
          </div>
          <form class="auth-form" id="loginForm">
            <div class="form-group">
              <label for="loginEmail">Email</label>
              <input type="email" id="loginEmail" required placeholder="your@email.com" autocomplete="email">
              <div class="error-message" id="loginEmailError"></div>
            </div>
            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input type="password" id="loginPassword" required placeholder="Password Anda" autocomplete="current-password">
              <div class="error-message" id="loginPasswordError"></div>
            </div>
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" id="rememberMe"> Ingat saya
              </label>
              <a href="#" class="forgot-password">Lupa password?</a>
            </div>
            <button type="submit" class="btn btn-primary auth-submit-btn">
              <span class="btn-text">Masuk</span>
              <span class="btn-loading" style="display: none;">⏳</span>
            </button>
          </form>
          <div class="auth-modal-footer">
            <p>Belum punya akun? <a href="#" data-action="switchToRegister">Daftar sekarang</a></p>
          </div>
        </div>
      `
    });

    // Register Modal
    const registerModal = this.createElement('div', {
      className: 'auth-modal',
      id: 'registerModal',
      innerHTML: `
        <div class="auth-modal-content">
          <div class="auth-modal-header">
            <h2>Daftar Akun QianlunShop</h2>
            <button class="auth-modal-close" data-action="close">&times;</button>
          </div>
          <form class="auth-form" id="registerForm">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Nama Depan</label>
                <input type="text" id="firstName" required placeholder="Nama depan" autocomplete="given-name">
                <div class="error-message" id="firstNameError"></div>
              </div>
              <div class="form-group">
                <label for="lastName">Nama Belakang</label>
                <input type="text" id="lastName" required placeholder="Nama belakang" autocomplete="family-name">
                <div class="error-message" id="lastNameError"></div>
              </div>
            </div>
            <div class="form-group">
              <label for="registerEmail">Email</label>
              <input type="email" id="registerEmail" required placeholder="your@email.com" autocomplete="email">
              <div class="error-message" id="registerEmailError"></div>
            </div>
            <div class="form-group">
              <label for="registerPassword">Password</label>
              <input type="password" id="registerPassword" required placeholder="Minimal 6 karakter" autocomplete="new-password">
              <div class="error-message" id="registerPasswordError"></div>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Konfirmasi Password</label>
              <input type="password" id="confirmPassword" required placeholder="Ulangi password" autocomplete="new-password">
              <div class="error-message" id="confirmPasswordError"></div>
            </div>
            <div class="form-group">
              <label for="phone">Nomor Telepon (Opsional)</label>
              <input type="tel" id="phone" placeholder="+62 xxx xxxx xxxx" autocomplete="tel">
              <div class="error-message" id="phoneError"></div>
            </div>
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" id="newsletter" checked>
                Berlangganan newsletter untuk update eksklusif
              </label>
            </div>
            <button type="submit" class="btn btn-primary auth-submit-btn">
              <span class="btn-text">Daftar</span>
              <span class="btn-loading" style="display: none;">⏳</span>
            </button>
          </form>
          <div class="auth-modal-footer">
            <p>Sudah punya akun? <a href="#" data-action="switchToLogin">Masuk sekarang</a></p>
          </div>
        </div>
      `
    });

    document.body.appendChild(loginModal);
    document.body.appendChild(registerModal);
    this.addModalStyles();
  }

  // =========================
  // 🎨 MODAL STYLES
  // =========================

  addModalStyles() {
    if (document.getElementById('auth-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'auth-modal-styles';
    style.textContent = `
      .auth-modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        animation: fadeIn 0.3s ease;
      }

      .auth-modal.show {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .auth-modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 450px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
      }

      .auth-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid #eee;
      }

      .auth-modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
      }

      .auth-modal-close:hover {
        background: #f5f5f5;
        color: #333;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        min-height: 1rem;
      }

      input.error {
        border-color: #e74c3c !important;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @media (max-width: 480px) {
        .form-row {
          grid-template-columns: 1fr;
          gap: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // =========================
  // 🎧 EVENT LISTENERS
  // =========================

  attachEventListeners() {
    // Modal controls
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="close"]') || e.target.classList.contains('auth-modal')) {
        this.closeModal();
      }

      if (e.target.matches('[data-action="switchToRegister"]')) {
        e.preventDefault();
        this.showRegisterModal();
      }

      if (e.target.matches('[data-action="switchToLogin"]')) {
        e.preventDefault();
        this.showLoginModal();
      }
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
  }

  // =========================
  // 🔐 FORM HANDLERS
  // =========================

  async handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    this.clearFormErrors(form);

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      this.showFormError('loginEmail', 'Email dan password wajib diisi');
      return;
    }

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      const result = await userManager.login(email, password);

      if (result.success) {
        this.closeModal();
        this.showToast('Berhasil masuk! Selamat datang kembali.', 'success');
        
        // Check for intended action
        const intendedAction = sessionStorage.getItem('intended_action');
        if (intendedAction) {
          sessionStorage.removeItem('intended_action');
          setTimeout(() => {
            window.location.href = intendedAction;
          }, 1000);
        }
      } else {
        this.showFormError('loginEmail', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showFormError('loginEmail', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  async handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.auth-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    this.clearFormErrors(form);

    const userData = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('registerEmail').value.trim(),
      password: document.getElementById('registerPassword').value,
      confirmPassword: document.getElementById('confirmPassword').value,
      phone: document.getElementById('phone').value.trim(),
      newsletter: document.getElementById('newsletter').checked
    };

    if (!this.validateRegistrationForm(userData)) {
      return;
    }

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      const result = await userManager.register(userData);

      if (result.success) {
        this.closeModal();
        this.showToast('Akun berhasil dibuat!', 'success');

        // Auto-login
        const loginResult = await userManager.login(userData.email, userData.password);
        if (loginResult.success) {
          this.showToast('Berhasil masuk! Selamat datang di QianlunShop.', 'success');
        }
      } else {
        this.showFormError('registerEmail', result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.showFormError('registerEmail', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  // =========================
  // ✅ VALIDATION
  // =========================

  validateRegistrationForm(data) {
    if (!data.firstName) {
      this.showFormError('firstName', 'Nama depan wajib diisi');
      return false;
    }

    if (!data.lastName) {
      this.showFormError('lastName', 'Nama belakang wajib diisi');
      return false;
    }

    if (!data.email || !data.email.includes('@')) {
      this.showFormError('registerEmail', 'Format email tidak valid');
      return false;
    }

    if (!data.password || data.password.length < 6) {
      this.showFormError('registerPassword', 'Password minimal 6 karakter');
      return false;
    }

    if (data.password !== data.confirmPassword) {
      this.showFormError('confirmPassword', 'Konfirmasi password tidak cocok');
      return false;
    }

    return true;
  }

  showFormError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);

    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('error');
  }

  clearFormErrors(form) {
    form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    form.querySelectorAll('input').forEach(input => input.classList.remove('error'));
  }

  // =========================
  // 🎭 MODAL CONTROLS
  // =========================

  showLoginModal() {
    this.closeModal();
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.add('show');
      this.currentModal = modal;
      document.getElementById('loginEmail').focus();
    }
  }

  showRegisterModal() {
    this.closeModal();
    const modal = document.getElementById('registerModal');
    if (modal) {
      modal.classList.add('show');
      this.currentModal = modal;
      document.getElementById('firstName').focus();
    }
  }

  closeModal() {
    if (this.currentModal) {
      this.currentModal.classList.remove('show');
      this.currentModal = null;
    }
  }

  // =========================
  // 🎨 UI UPDATES
  // =========================

  updateUI() {
    const isLoggedIn = userManager.isLoggedIn();
    const user = userManager.getCurrentUser();

    this.updateNavbar(isLoggedIn, user);
  }

  updateNavbar(isLoggedIn, user) {
    const navbar = document.querySelector('.navbar ul');
    if (!navbar) return;

    // Remove existing auth elements
    const existingAuth = navbar.querySelector('.auth-dropdown');
    if (existingAuth) existingAuth.remove();

    if (isLoggedIn && user) {
      // Logged in state
      const authDropdown = this.createElement('li', {
        className: 'auth-dropdown',
        innerHTML: `
          <div class="user-menu">
            <button class="user-menu-btn">
              <span class="user-avatar">👤</span>
              <span class="user-name">${user.firstName}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="user-dropdown-menu">
              <a href="${this.getPagePath('profile.html')}">👤 Profil Saya</a>
              <a href="${this.getPagePath('cart.html')}">🛒 Keranjang</a>
              <a href="#" id="logoutBtn">🚪 Keluar</a>
            </div>
          </div>
        `
      });

      navbar.appendChild(authDropdown);

      // Logout handler
      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        userManager.logout();
      });

    } else {
      // Not logged in state
      const loginBtn = this.createElement('li', {
        innerHTML: `<a href="#" id="loginBtn">🔐 Masuk</a>`
      });

      const registerBtn = this.createElement('li', {
        innerHTML: `<a href="#" id="registerBtn">📝 Daftar</a>`
      });

      navbar.appendChild(loginBtn);
      navbar.appendChild(registerBtn);

      // Event listeners
      document.getElementById('loginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        this.showLoginModal();
      });

      document.getElementById('registerBtn').addEventListener('click', (e) => {
        e.preventDefault();
        this.showRegisterModal();
      });
    }
  }

  // =========================
  // 🎉 EVENT HANDLERS
  // =========================

  handleLoginSuccess() {
    this.updateUI();
    // Redirect handled by auth-guard
  }

  handleLogoutSuccess() {
    this.updateUI();
    this.showToast('Berhasil keluar. Sampai jumpa!', 'success');
    
    // Redirect to home if on protected page
    const currentPage = authGuard.getCurrentPage();
    if (authGuard.isProtectedRoute(currentPage)) {
      setTimeout(() => {
        window.location.href = authGuard.isInPagesDir() ? '../index.html' : 'index.html';
      }, 1500);
    }
  }

  handleSessionExpired() {
    this.updateUI();
    this.showToast('Sesi Anda telah berakhir. Silakan login kembali.', 'warning');
  }

  // =========================
  // 🛠️ UTILITIES
  // =========================

  createElement(tag, options = {}) {
    const element = document.createElement(tag);
    Object.assign(element, options);
    return element;
  }

  getPagePath(page) {
    const isInPagesDir = window.location.pathname.includes('/pages/');
    return isInPagesDir ? page : 'pages/' + page;
  }

  showToast(message, type = 'success') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
}

// =========================
// 🌐 SINGLETON INSTANCE
// =========================

export const authUI = new AuthUI();
export default AuthUI;