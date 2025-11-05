// =========================
// 🛒 Cart Class - FINAL FIXED VERSION
// All critical bugs fixed + improvements added
// =========================

export class Cart {
  constructor() {
    this.key = "qianlunshop_cart";
    this.maxItems = 50; // Security limit
    this.maxQuantityPerItem = 99;
    this.items = this.load();
    this.listeners = new Map(); // Event system
  }

  // =========================
  // 🎧 EVENT SYSTEM
  // =========================
  
  /**
   * Subscribe to cart events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from event
   */
  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  /**
   * Emit event to all listeners
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // =========================
  // 🔹 LOAD & SAVE (FIXED)
  // =========================
  
  /**
   * Load cart from localStorage with validation
   * @returns {Array} Valid cart items
   */
  load() {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) return [];

      const items = JSON.parse(data);
      
      // ✅ Validate it's an array
      if (!Array.isArray(items)) {
        console.warn("⚠️ Invalid cart data format, resetting...");
        localStorage.removeItem(this.key);
        return [];
      }

      // ✅ Validate each item thoroughly
      const validItems = items.filter(item => {
        const isValid = item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          item.id.length > 0 &&
          typeof item.name === 'string' &&
          item.name.length > 0 &&
          typeof item.price === "number" &&
          item.price >= 0 &&
          typeof item.quantity === "number" &&
          item.quantity > 0 &&
          Number.isInteger(item.quantity);

        if (!isValid) {
          console.warn("⚠️ Invalid item removed:", item);
        }
        return isValid;
      });

      console.log(`✅ Loaded ${validItems.length} valid items`);
      return validItems;

    } catch (err) {
      console.error("❌ Failed to load cart:", err);
      localStorage.removeItem(this.key); // Clear corrupted data
      return [];
    }
  }

  /**
   * Save cart to localStorage with error handling
   * @returns {boolean} Success status
   */
  save() {
    try {
      // ✅ Filter valid items
      const validItems = this.items.filter(
        i =>
          i &&
          i.id &&
          i.name &&
          typeof i.price === "number" &&
          typeof i.quantity === "number"
      );

      const dataToSave = JSON.stringify(validItems);
      
      // ✅ Check size limit (5MB)
      if (dataToSave.length > 5000000) {
        throw new Error("Cart data too large");
      }

      localStorage.setItem(this.key, dataToSave);
      console.log("💾 Cart saved:", validItems.length, "items");
      
      return true;

    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        console.error("❌ Storage quota exceeded!");
        this.emit('storage-error', { 
          type: 'quota', 
          message: 'Keranjang penuh! Hapus beberapa item.' 
        });
      } else {
        console.error("❌ Failed to save cart:", err);
        this.emit('storage-error', { 
          type: 'general', 
          message: 'Gagal menyimpan keranjang.' 
        });
      }
      return false;
    }
  }

  // =========================
  // 🔹 CRUD OPERATIONS (FIXED)
  // =========================
  
  /**
   * Add product to cart with validation
   * @param {Object} product - Product to add
   * @returns {boolean} Success status
   */
  add(product) {
    try {
      // ✅ Validate product
      if (!this.validateProduct(product)) {
        console.error("❌ Invalid product:", product);
        this.emit('error', { type: 'invalid-product', product });
        return false;
      }

      // ✅ Check cart size limit
      if (this.items.length >= this.maxItems) {
        console.error("❌ Cart full (max 50 items)");
        this.emit('error', { type: 'cart-full', maxItems: this.maxItems });
        return false;
      }

      // ✅ Reload to prevent race conditions
      this.items = this.load();

      const existing = this.items.find(i => i.id === product.id);
      const qty = Math.max(1, Math.min(this.maxQuantityPerItem, Number(product.quantity ?? 1)));

      if (existing) {
        // ✅ Prevent exceeding max quantity
        const newQuantity = Math.min(
          this.maxQuantityPerItem,
          existing.quantity + qty
        );
        
        if (newQuantity === existing.quantity) {
          console.warn(`⚠️ Cannot add more (max ${this.maxQuantityPerItem})`);
          this.emit('error', { 
            type: 'max-quantity', 
            productId: product.id,
            maxQuantity: this.maxQuantityPerItem 
          });
          return false;
        }

        existing.quantity = newQuantity;
        existing.updatedAt = Date.now();
        
      } else {
        this.items.push({
          id: product.id,
          name: this.sanitize(product.name),
          price: product.price,
          image: this.sanitize(product.image || ""),
          category: this.sanitize(product.category || "general"),
          quantity: qty,
          addedAt: Date.now(),
          updatedAt: Date.now()
        });
      }

      this.save();
      this.emit('item-added', { 
        product, 
        quantity: qty, 
        cart: this.getSummary() 
      });
      
      return true;

    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      this.emit('error', { type: 'add-failed', error });
      return false;
    }
  }

  /**
   * Remove item from cart
   * @param {string} id - Product ID
   * @returns {boolean} Success status
   */
  remove(id) {
    try {
      const removedItem = this.items.find(i => i.id === id);
      
      if (!removedItem) {
        console.warn(`⚠️ Item ${id} not found in cart`);
        return false;
      }

      this.items = this.items.filter(i => i.id !== id);
      this.save();
      
      this.emit('item-removed', { 
        id, 
        item: removedItem, 
        cart: this.getSummary() 
      });
      
      return true;

    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      this.emit('error', { type: 'remove-failed', error });
      return false;
    }
  }

  /**
   * Update item quantity
   * @param {string} id - Product ID
   * @param {number} quantity - New quantity
   * @returns {boolean} Success status
   */
  update(id, quantity) {
    try {
      const item = this.items.find(i => i.id === id);
      
      if (!item) {
        console.warn(`⚠️ Item ${id} not found`);
        return false;
      }

      const newQty = Math.max(1, Math.min(this.maxQuantityPerItem, parseInt(quantity, 10) || 1));
      
      if (newQty === item.quantity) {
        return true; // No change needed
      }

      item.quantity = newQty;
      item.updatedAt = Date.now();
      
      this.save();
      this.emit('item-updated', { 
        id, 
        quantity: newQty, 
        cart: this.getSummary() 
      });
      
      return true;

    } catch (error) {
      console.error("❌ Error updating cart:", error);
      this.emit('error', { type: 'update-failed', error });
      return false;
    }
  }

  /**
   * Clear entire cart
   */
  clear() {
    try {
      const itemCount = this.items.length;
      this.items = [];
      this.save();
      
      this.emit('cart-cleared', { itemCount });
      console.log("🗑️ Cart cleared");
      
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      this.emit('error', { type: 'clear-failed', error });
    }
  }

  // =========================
  // 🔹 GETTERS
  // =========================
  
  /**
   * Get total item count
   * @returns {number} Total quantity
   */
  getItemCount() {
    return this.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  }

  /**
   * Get cart total price
   * @returns {number} Total price
   */
  getTotal() {
    return this.items.reduce((sum, i) => {
      const price = Number(i.price) || 0;
      const qty = Number(i.quantity) || 0;
      return sum + price * qty;
    }, 0);
  }

  /**
   * Get all items
   * @returns {Array} Cart items
   */
  getItems() {
    return [...this.items]; // Return copy to prevent mutation
  }

  /**
   * Get single item
   * @param {string} id - Product ID
   * @returns {Object|null} Item or null
   */
  getItem(id) {
    return this.items.find(i => i.id === id) || null;
  }

  /**
   * Get cart summary
   * @returns {Object} Summary data
   */
  getSummary() {
    return {
      count: this.getItemCount(),
      total: this.getTotal(),
      itemsCount: this.items.length,
      items: this.getItems(),
      isEmpty: this.items.length === 0,
      timestamp: Date.now()
    };
  }

  // =========================
  // 🔹 VALIDATION & UTILITY
  // =========================
  
  /**
   * Validate product object
   * @param {Object} product - Product to validate
   * @returns {boolean} Is valid
   */
  validateProduct(product) {
    return (
      product &&
      typeof product === 'object' &&
      typeof product.id === 'string' &&
      product.id.length > 0 &&
      typeof product.name === 'string' &&
      product.name.length > 0 &&
      typeof product.price === 'number' &&
      product.price >= 0 &&
      isFinite(product.price)
    );
  }

  /**
   * Sanitize string input
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitize(str) {
    if (typeof str !== 'string') return '';
    
    // Remove HTML tags and scripts
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML
      .replace(/[<>]/g, '') // Extra safety
      .trim()
      .substring(0, 500); // Max length
  }

  /**
   * Validate cart integrity
   * @returns {boolean} Is valid
   */
  validate() {
    const valid = this.items.every(
      i =>
        i &&
        i.id &&
        i.name &&
        typeof i.price === "number" &&
        typeof i.quantity === "number" &&
        i.quantity > 0 &&
        i.quantity <= this.maxQuantityPerItem
    );
    
    if (valid) {
      console.log("✅ Cart is valid");
    } else {
      console.warn("⚠️ Invalid items detected in cart");
      // Auto-fix by removing invalid items
      this.items = this.items.filter(i => this.validateProduct(i));
      this.save();
    }
    
    return valid;
  }

  /**
   * Debug cart state
   */
  debug() {
    console.group("🛒 Cart Debug Info");
    console.table(this.items);
    console.log("📦 Total Items:", this.getItemCount());
    console.log("💰 Total Price:", this.getTotal().toLocaleString('id-ID'));
    console.log("🔢 Unique Products:", this.items.length);
    console.log("📊 Summary:", this.getSummary());
    console.groupEnd();
  }

  /**
   * Export cart data (for backup/analytics)
   * @returns {string} JSON string
   */
  export() {
    return JSON.stringify({
      items: this.items,
      summary: this.getSummary(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import cart data
   * @param {string} jsonData - JSON string to import
   * @returns {boolean} Success status
   */
  import(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid import data');
      }

      // Validate all items
      const validItems = data.items.filter(item => this.validateProduct(item));
      
      if (validItems.length === 0) {
        throw new Error('No valid items to import');
      }

      this.items = validItems;
      this.save();
      
      console.log(`✅ Imported ${validItems.length} items`);
      this.emit('cart-imported', { itemCount: validItems.length });
      
      return true;

    } catch (error) {
      console.error('❌ Import failed:', error);
      this.emit('error', { type: 'import-failed', error });
      return false;
    }
  }
}

// =========================
// 🎯 EXPORT
// =========================
export default Cart;