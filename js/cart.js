// 🛒 Cart Class - ULTRA FIXED VERSION

export class Cart {
  constructor() {
    this.key = "qianlunshop_cart";
    this.lockKey = "qianlunshop_cart_lock";
    this.maxItems = 50;
    this.maxQuantityPerItem = 99;
    this.items = this.load();
    this.listeners = new Map();
    this.lastModified = 0;
    this.saveTimeout = null;

    // Update queue for race condition prevention
    this.updateQueue = [];
    this.isProcessingQueue = false;
    this.maxRetries = 3;
    this.baseRetryDelay = 100;

    // Multi-tab sync
    this.setupStorageSync();
  }

  // =========================
  // 🔄 MULTI-TAB SYNCHRONIZATION
  // =========================
  
  setupStorageSync() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.key && e.newValue !== e.oldValue) {
        console.log("🔄 Cart synced from another tab");
        this.items = this.load();
        this.emit('cart-synced', { items: this.items });
      }
    });
  }

  // =========================
  // 🎧 EVENT SYSTEM
  // =========================
  
  on(event, callback) {
    if (typeof callback !== 'function') {
      console.error('❌ Callback must be a function');
      return () => {};
    }
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    return () => this.off(event, callback);
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
          console.error(`❌ Error in ${event} listener:`, error);
        }
      });
    }
  }

  // =========================
  // 🔒 ATOMIC OPERATIONS WITH LOCKING
  // =========================
  
  async acquireLock(timeout = 3000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const lock = localStorage.getItem(this.lockKey);
      
      if (!lock || Date.now() - parseInt(lock) > 5000) {
        localStorage.setItem(this.lockKey, Date.now().toString());
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.warn('⚠️ Could not acquire lock, forcing...');
    localStorage.setItem(this.lockKey, Date.now().toString());
    return true;
  }

  releaseLock() {
    localStorage.removeItem(this.lockKey);
  }

  // =========================
  // 💾 LOAD & SAVE (ULTRA FIXED)
  // =========================
  
  load() {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) return [];

      const parsed = JSON.parse(data);
      
      if (!Array.isArray(parsed)) {
        console.warn("⚠️ Invalid cart data format, resetting...");
        localStorage.removeItem(this.key);
        return [];
      }

      const validItems = parsed.filter(item => this.validateItem(item));
      
      if (validItems.length !== parsed.length) {
        console.warn(`⚠️ Removed ${parsed.length - validItems.length} invalid items`);
        this.items = validItems;
        this.save();
      }

      console.log(`✅ Loaded ${validItems.length} valid items`);
      return validItems;

    } catch (err) {
      console.error("❌ Failed to load cart:", err);
      localStorage.removeItem(this.key);
      return [];
    }
  }

  save() {
    // Debounce save to prevent excessive writes
    clearTimeout(this.saveTimeout);
    
    this.saveTimeout = setTimeout(() => {
      this._performSave();
    }, 100);
  }

  _performSave() {
    try {
      const validItems = this.items.filter(i => this.validateItem(i));
      const dataToSave = JSON.stringify(validItems);
      
      if (dataToSave.length > 5000000) {
        throw new Error("Cart data too large");
      }

      localStorage.setItem(this.key, dataToSave);
      this.lastModified = Date.now();
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
  // 🛍️ CRUD OPERATIONS (ATOMIC & SAFE)
  // =========================
  
  async add(product) {
    try {
      if (!this.validateProduct(product)) {
        console.error("❌ Invalid product:", product);
        this.emit('error', { type: 'invalid-product', product });
        return false;
      }

      await this.acquireLock();

      // Reload fresh data
      this.items = this.load();

      if (this.items.length >= this.maxItems) {
        console.error(`❌ Cart full (max ${this.maxItems} items)`);
        this.emit('error', { type: 'cart-full', maxItems: this.maxItems });
        this.releaseLock();
        return false;
      }

      const existing = this.items.find(i => i.id === product.id);
      const qty = Math.max(1, Math.min(this.maxQuantityPerItem, Number(product.quantity ?? 1)));

      if (existing) {
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
          this.releaseLock();
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
      this.releaseLock();
      
      this.emit('item-added', { 
        product, 
        quantity: qty, 
        cart: this.getSummary() 
      });
      
      return true;

    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      this.releaseLock();
      this.emit('error', { type: 'add-failed', error });
      return false;
    }
  }

  async remove(id) {
    try {
      await this.acquireLock();
      
      const removedItem = this.items.find(i => i.id === id);
      
      if (!removedItem) {
        console.warn(`⚠️ Item ${id} not found in cart`);
        this.releaseLock();
        return false;
      }

      this.items = this.items.filter(i => i.id !== id);
      this.save();
      this.releaseLock();
      
      this.emit('item-removed', { 
        id, 
        item: removedItem, 
        cart: this.getSummary() 
      });
      
      return true;

    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      this.releaseLock();
      this.emit('error', { type: 'remove-failed', error });
      return false;
    }
  }

  // Queue-based update to prevent race conditions
  async update(id, quantity) {
    return new Promise((resolve, reject) => {
      this.updateQueue.push({
        id,
        quantity,
        resolve,
        reject,
        timestamp: Date.now()
      });

      this.processUpdateQueue();
    });
  }

  async processUpdateQueue() {
    if (this.isProcessingQueue || this.updateQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.updateQueue.length > 0) {
      const updateRequest = this.updateQueue.shift();

      try {
        const result = await this._performUpdate(updateRequest.id, updateRequest.quantity);
        updateRequest.resolve(result);
      } catch (error) {
        console.error("❌ Queued update failed:", error);
        updateRequest.reject(error);
      }

      // Small delay between updates to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.isProcessingQueue = false;
  }

  async _performUpdate(id, quantity, retryCount = 0) {
    try {
      const lockAcquired = await this.acquireLock(2000); // Shorter timeout for queued operations

      if (!lockAcquired) {
        throw new Error('Could not acquire lock for update');
      }

      // Reload fresh data to ensure consistency
      this.items = this.load();

      const item = this.items.find(i => i.id === id);

      if (!item) {
        console.warn(`⚠️ Item ${id} not found`);
        this.releaseLock();
        return false;
      }

      const newQty = Math.max(1, Math.min(this.maxQuantityPerItem, parseInt(quantity, 10) || 1));

      if (newQty === item.quantity) {
        this.releaseLock();
        return true;
      }

      item.quantity = newQty;
      item.updatedAt = Date.now();

      this.save();
      this.releaseLock();

      this.emit('item-updated', {
        id,
        quantity: newQty,
        cart: this.getSummary()
      });

      return true;

    } catch (error) {
      this.releaseLock();

      // Retry logic with exponential backoff
      if (retryCount < this.maxRetries) {
        const delay = this.baseRetryDelay * Math.pow(2, retryCount);
        console.warn(`⚠️ Update failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);

        await new Promise(resolve => setTimeout(resolve, delay));
        return this._performUpdate(id, quantity, retryCount + 1);
      }

      console.error("❌ Update failed after retries:", error);
      this.emit('error', { type: 'update-failed', error, id, quantity });
      throw error;
    }
  }

  async clear() {
    try {
      await this.acquireLock();
      
      const itemCount = this.items.length;
      this.items = [];
      this.save();
      this.releaseLock();
      
      this.emit('cart-cleared', { itemCount });
      console.log("🗑️ Cart cleared");
      
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      this.releaseLock();
      this.emit('error', { type: 'clear-failed', error });
    }
  }

  // =========================
  // 📊 GETTERS
  // =========================
  
  getItemCount() {
    return this.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  }

  getTotal() {
    return this.items.reduce((sum, i) => {
      const price = Number(i.price) || 0;
      const qty = Number(i.quantity) || 0;
      return sum + price * qty;
    }, 0);
  }

  getItems() {
    return this.items.map(item => ({...item})); // Deep copy
  }

  getItem(id) {
    const item = this.items.find(i => i.id === id);
    return item ? {...item} : null; // Return copy
  }

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
  // ✅ VALIDATION & UTILITY
  // =========================
  
  validateProduct(product) {
    return (
      product &&
      typeof product === 'object' &&
      typeof product.id === 'string' &&
      product.id.length > 0 &&
      product.id.length <= 100 &&
      typeof product.name === 'string' &&
      product.name.length > 0 &&
      product.name.length <= 500 &&
      typeof product.price === 'number' &&
      product.price >= 0 &&
      product.price <= 999999999 &&
      isFinite(product.price)
    );
  }

  validateItem(item) {
    return this.validateProduct(item) &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      item.quantity <= this.maxQuantityPerItem &&
      Number.isInteger(item.quantity);
  }

  sanitize(str) {
    if (typeof str !== 'string') return '';
    
    return str
      .trim()
      .replace(/[<>\"']/g, '') // Remove dangerous chars
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .substring(0, 500);
  }

  validate() {
    const valid = this.items.every(i => this.validateItem(i));
    
    if (!valid) {
      console.warn("⚠️ Invalid items detected, cleaning...");
      this.items = this.items.filter(i => this.validateItem(i));
      this.save();
    }
    
    return valid;
  }

  // =========================
  // 🔧 UTILITIES
  // =========================
  
  debug() {
    console.group("🛒 Cart Debug Info");
    console.table(this.items);
    console.log("📦 Total Items:", this.getItemCount());
    console.log("💰 Total Price:", this.getTotal().toLocaleString('id-ID'));
    console.log("🔢 Unique Products:", this.items.length);
    console.log("📊 Summary:", this.getSummary());
    console.groupEnd();
  }

  export() {
    return JSON.stringify({
      items: this.items,
      summary: this.getSummary(),
      exportedAt: new Date().toISOString(),
      version: '2.0'
    }, null, 2);
  }

  async import(jsonData) {
    try {
      await this.acquireLock();
      
      const data = JSON.parse(jsonData);
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid import data');
      }

      const validItems = data.items.filter(item => this.validateItem(item));
      
      if (validItems.length === 0) {
        throw new Error('No valid items to import');
      }

      this.items = validItems;
      this.save();
      this.releaseLock();
      
      console.log(`✅ Imported ${validItems.length} items`);
      this.emit('cart-imported', { itemCount: validItems.length });
      
      return true;

    } catch (error) {
      console.error('❌ Import failed:', error);
      this.releaseLock();
      this.emit('error', { type: 'import-failed', error });
      return false;
    }
  }

  // Cleanup on destroy
  destroy() {
    clearTimeout(this.saveTimeout);
    this.listeners.clear();
    this.releaseLock();
  }
}

export default Cart;