// =========================
// 👤 USER MANAGER - FIXED VERSION
// Enhanced Authentication & User Management
// =========================

import { CONFIG } from "./config.js";

export class UserManager {
  constructor() {
    this.currentUser = null;
    this.users = this.loadUsers();
    this.sessionKey = "qianlunshop_session";
    this.usersKey = "qianlunshop_users";
    this.listeners = new Map();
    this.sessionCheckInterval = null;

    // Initialize session
    this.checkSession();
    this.startSessionMonitoring();

    console.log("👤 UserManager initialized");
  }

  // =========================
  // 🎧 EVENT SYSTEM
  // =========================

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // =========================
  // 🔐 SESSION MANAGEMENT - ENHANCED
  // =========================

  checkSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) {
        this.currentUser = null;
        return false;
      }

      const session = JSON.parse(sessionData);
      const now = Date.now();

      // Check if session is expired (24 hours)
      if (now >= session.expiresAt) {
        console.log("⏰ Session expired");
        this.logout();
        return false;
      }

      // Validate user still exists
      const user = this.users.find(u => u.id === session.userId);
      if (!user) {
        console.log("❌ User not found in database");
        this.logout();
        return false;
      }

      // Check if user is active
      if (!user.isActive) {
        console.log("🚫 User account is inactive");
        this.logout();
        return false;
      }

      this.currentUser = user;
      console.log("✅ Session restored for user:", user.email);
      return true;

    } catch (error) {
      console.error("❌ Session check failed:", error);
      this.logout();
      return false;
    }
  }

  createSession(user) {
    const now = Date.now();
    const session = {
      userId: user.id,
      loginTime: now,
      expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
      lastActivity: now
    };

    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      this.currentUser = user;
      this.emit('login', { user: this.currentUser });
      console.log("✅ Session created for:", user.email);
      return true;
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      return false;
    }
  }

  destroySession() {
    try {
      localStorage.removeItem(this.sessionKey);
      this.currentUser = null;
      this.emit('logout');
      console.log("👋 Session destroyed");
      return true;
    } catch (error) {
      console.error("❌ Failed to destroy session:", error);
      return false;
    }
  }

  updateSessionActivity() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return;

      const session = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    } catch (error) {
      console.error("❌ Failed to update session activity:", error);
    }
  }

  startSessionMonitoring() {
    // Check session every minute
    this.sessionCheckInterval = setInterval(() => {
      if (this.isLoggedIn()) {
        const isValid = this.checkSession();
        if (!isValid) {
          this.emit('session-expired');
        }
      }
    }, 60 * 1000); // Every 1 minute

    // Update activity on user interaction
    const updateActivity = () => this.updateSessionActivity();
    document.addEventListener('click', updateActivity);
    document.addEventListener('keypress', updateActivity);
    document.addEventListener('scroll', updateActivity);
  }

  stopSessionMonitoring() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  // =========================
  // 🔐 USER REGISTRATION - ENHANCED
  // =========================

  async register(userData) {
    try {
      // Validate input
      const validation = this.validateRegistrationData(userData);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Normalize email
      const normalizedEmail = userData.email.toLowerCase().trim();

      // Check if user already exists
      const existingUser = this.users.find(u => 
        u.email.toLowerCase() === normalizedEmail
      );
      
      if (existingUser) {
        return { success: false, error: "Email sudah terdaftar" };
      }

      // Create new user
      const newUser = {
        id: this.generateUserId(),
        email: normalizedEmail,
        password: await this.hashPassword(userData.password),
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        phone: userData.phone?.trim() || "",
        address: userData.address?.trim() || "",
        city: userData.city?.trim() || "",
        postalCode: userData.postalCode?.trim() || "",
        dateJoined: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        role: "customer",
        preferences: {
          newsletter: userData.newsletter || false,
          notifications: true,
          language: 'id'
        },
        wishlist: [],
        orderHistory: [],
        cart: []
      };

      // Save user
      this.users.push(newUser);
      this.saveUsers();

      console.log("✅ User registered:", newUser.email);
      this.emit('user-registered', { user: this.sanitizeUser(newUser) });

      return { success: true, user: this.sanitizeUser(newUser) };

    } catch (error) {
      console.error("❌ Registration failed:", error);
      return { success: false, error: "Gagal mendaftarkan akun. Silakan coba lagi." };
    }
  }

  // =========================
  // 🔑 USER LOGIN - ENHANCED
  // =========================

  async login(email, password) {
    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();

      // Find user
      const user = this.users.find(u => 
        u.email.toLowerCase() === normalizedEmail
      );

      if (!user) {
        // Don't reveal if email exists for security
        return { success: false, error: "Email atau password salah" };
      }

      // Check if user is active
      if (!user.isActive) {
        return { success: false, error: "Akun telah dinonaktifkan. Hubungi customer service." };
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return { success: false, error: "Email atau password salah" };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      this.saveUsers();

      // Create session
      const sessionCreated = this.createSession(user);
      if (!sessionCreated) {
        return { success: false, error: "Gagal membuat sesi. Silakan coba lagi." };
      }

      console.log("✅ User logged in:", user.email);
      return { success: true, user: this.sanitizeUser(user) };

    } catch (error) {
      console.error("❌ Login failed:", error);
      return { success: false, error: "Gagal masuk. Silakan coba lagi." };
    }
  }

  // =========================
  // 🚪 LOGOUT
  // =========================

  logout() {
    const wasLoggedIn = this.isLoggedIn();
    const userEmail = this.currentUser?.email;

    this.destroySession();

    if (wasLoggedIn) {
      console.log("👋 User logged out:", userEmail);
    }

    return true;
  }

  // =========================
  // 👤 USER PROFILE MANAGEMENT
  // =========================

  async updateProfile(userId, updates) {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return { success: false, error: "User tidak ditemukan" };
      }

      // Only allow updating certain fields
      const allowedFields = [
        'firstName', 'lastName', 'phone', 
        'address', 'city', 'postalCode', 'preferences'
      ];

      const validUpdates = {};
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          validUpdates[field] = updates[field];
        }
      }

      // Validate updates
      if (validUpdates.firstName && validUpdates.firstName.trim().length < 2) {
        return { success: false, error: "Nama depan minimal 2 karakter" };
      }

      if (validUpdates.lastName && validUpdates.lastName.trim().length < 2) {
        return { success: false, error: "Nama belakang minimal 2 karakter" };
      }

      // Update user
      Object.assign(user, validUpdates);
      this.saveUsers();

      // Update current user if it's the logged in user
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = user;
      }

      console.log("✅ Profile updated for user:", user.email);
      this.emit('profile-updated', { user: this.sanitizeUser(user) });

      return { success: true, user: this.sanitizeUser(user) };

    } catch (error) {
      console.error("❌ Profile update failed:", error);
      return { success: false, error: "Gagal memperbarui profil" };
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return { success: false, error: "User tidak ditemukan" };
      }

      // Verify current password
      const isValidCurrent = await this.verifyPassword(currentPassword, user.password);
      if (!isValidCurrent) {
        return { success: false, error: "Password saat ini salah" };
      }

      // Validate new password
      if (newPassword.length < 6) {
        return { success: false, error: "Password baru minimal 6 karakter" };
      }

      if (currentPassword === newPassword) {
        return { success: false, error: "Password baru harus berbeda dengan password lama" };
      }

      // Update password
      user.password = await this.hashPassword(newPassword);
      this.saveUsers();

      console.log("✅ Password changed for user:", user.email);
      this.emit('password-changed', { userId: user.id });

      return { success: true };

    } catch (error) {
      console.error("❌ Password change failed:", error);
      return { success: false, error: "Gagal mengubah password" };
    }
  }

  // =========================
  // 🛒 USER CART MANAGEMENT
  // =========================

  getUserCart(userId) {
    const user = this.users.find(u => u.id === userId);
    return user?.cart || [];
  }

  saveUserCart(userId, cartItems) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.cart = cartItems;
      this.saveUsers();
      return true;
    }
    return false;
  }

  // =========================
  // ❤️ WISHLIST MANAGEMENT
  // =========================

  getUserWishlist(userId) {
    const user = this.users.find(u => u.id === userId);
    return user?.wishlist || [];
  }

  addToWishlist(userId, productId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      if (!user.wishlist) user.wishlist = [];
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        this.saveUsers();
        this.emit('wishlist-updated', { userId, wishlist: user.wishlist });
        return true;
      }
    }
    return false;
  }

  removeFromWishlist(userId, productId) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.wishlist) {
      const initialLength = user.wishlist.length;
      user.wishlist = user.wishlist.filter(id => id !== productId);
      
      if (user.wishlist.length < initialLength) {
        this.saveUsers();
        this.emit('wishlist-updated', { userId, wishlist: user.wishlist });
        return true;
      }
    }
    return false;
  }

  // =========================
  // 📦 ORDER HISTORY
  // =========================

  addOrderToHistory(userId, order) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      if (!user.orderHistory) user.orderHistory = [];
      user.orderHistory.unshift(order); // Add to beginning
      this.saveUsers();
      this.emit('order-added', { userId, order });
      return true;
    }
    return false;
  }

  getUserOrders(userId) {
    const user = this.users.find(u => u.id === userId);
    return user?.orderHistory || [];
  }

  // =========================
  // 🔧 UTILITIES
  // =========================

  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async hashPassword(password) {
    // Enhanced password hashing
    // Still simple for demo, but better than before
    try {
      const salt = CONFIG.SECURITY?.PASSWORD_SALT || 'qianlun_secure_salt_2025';
      const encoder = new TextEncoder();
      const data = encoder.encode(password + salt);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error("❌ Password hashing failed:", error);
      throw new Error("Gagal memproses password");
    }
  }

  async verifyPassword(password, hash) {
    try {
      const hashedInput = await this.hashPassword(password);
      return hashedInput === hash;
    } catch (error) {
      console.error("❌ Password verification failed:", error);
      return false;
    }
  }

  validateRegistrationData(data) {
    if (!data.email || !data.email.includes('@')) {
      return { valid: false, error: "Format email tidak valid" };
    }

    if (!data.password || data.password.length < 6) {
      return { valid: false, error: "Password minimal 6 karakter" };
    }

    if (!data.firstName || data.firstName.trim().length < 2) {
      return { valid: false, error: "Nama depan minimal 2 karakter" };
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      return { valid: false, error: "Nama belakang minimal 2 karakter" };
    }

    return { valid: true };
  }

  sanitizeUser(user) {
    // Remove sensitive data before returning
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // =========================
  // 💾 DATA PERSISTENCE
  // =========================

  loadUsers() {
    try {
      const data = localStorage.getItem(this.usersKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("❌ Failed to load users:", error);
      return [];
    }
  }

  saveUsers() {
    try {
      localStorage.setItem(this.usersKey, JSON.stringify(this.users));
      return true;
    } catch (error) {
      console.error("❌ Failed to save users:", error);
      return false;
    }
  }

  // =========================
  // 📊 GETTERS
  // =========================

  isLoggedIn() {
    return this.currentUser !== null && this.checkSession();
  }

  getCurrentUser() {
    if (!this.isLoggedIn()) return null;
    return this.sanitizeUser(this.currentUser);
  }

  getUserById(id) {
    const user = this.users.find(u => u.id === id);
    return user ? this.sanitizeUser(user) : null;
  }

  getUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = this.users.find(u => 
      u.email.toLowerCase() === normalizedEmail
    );
    return user ? this.sanitizeUser(user) : null;
  }

  // =========================
  // 🧹 CLEANUP
  // =========================

  destroy() {
    this.stopSessionMonitoring();
    this.listeners.clear();
    this.logout();
  }
}

// =========================
// 🌐 SINGLETON INSTANCE
// =========================

export const userManager = new UserManager();
export default UserManager;