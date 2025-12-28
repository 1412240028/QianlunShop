// =========================
// 🗄️ INDEXEDDB STORAGE MODULE - QIANLUNSHOP
// Replaces localStorage for large data storage
// =========================

export class IndexedDBStorage {
  constructor(dbName = 'qianlun-db', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.initPromise = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('❌ IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('cart')) {
          db.createObjectStore('cart', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('error_logs')) {
          db.createObjectStore('error_logs', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('analytics')) {
          db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
        }

        console.log('🔄 IndexedDB upgraded');
      };
    });
  }

  async ensureDB() {
    if (!this.db) {
      await this.initPromise;
    }
    return this.db;
  }

  async set(storeName, key, value) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.put({ key, value, timestamp: Date.now() });

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageSize() {
    // Estimate size by getting all data
    try {
      const stores = ['cart', 'orders', 'user', 'preferences', 'error_logs', 'analytics'];
      let totalSize = 0;

      for (const store of stores) {
        const data = await this.getAll(store);
        totalSize += JSON.stringify(data).length;
      }

      return totalSize;
    } catch (error) {
      console.warn('Failed to calculate storage size:', error);
      return 0;
    }
  }

  // Check if IndexedDB is supported
  static isSupported() {
    return 'indexedDB' in window;
  }

  // Fallback to localStorage if IndexedDB fails
  static async createWithFallback(dbName, version) {
    if (!this.isSupported()) {
      console.warn('⚠️ IndexedDB not supported, using localStorage fallback');
      return new LocalStorageFallback();
    }

    try {
      const idb = new IndexedDBStorage(dbName, version);
      await idb.initPromise;
      return idb;
    } catch (error) {
      console.error('❌ IndexedDB failed, falling back to localStorage:', error);
      return new LocalStorageFallback();
    }
  }
}

// =========================
// 💾 LOCALSTORAGE FALLBACK
// =========================
class LocalStorageFallback {
  constructor() {
    this.prefix = 'qianlun_idb_';
  }

  async set(storeName, key, value) {
    try {
      const data = JSON.stringify({ value, timestamp: Date.now() });
      localStorage.setItem(`${this.prefix}${storeName}_${key}`, data);
      return true;
    } catch (error) {
      console.error('❌ localStorage fallback error:', error);
      return false;
    }
  }

  async get(storeName, key) {
    try {
      const data = localStorage.getItem(`${this.prefix}${storeName}_${key}`);
      if (!data) return null;

      const parsed = JSON.parse(data);
      return parsed.value;
    } catch (error) {
      console.error('❌ localStorage fallback error:', error);
      return null;
    }
  }

  async delete(storeName, key) {
    try {
      localStorage.removeItem(`${this.prefix}${storeName}_${key}`);
      return true;
    } catch (error) {
      console.error('❌ localStorage fallback error:', error);
      return false;
    }
  }

  async getAll(storeName) {
    try {
      const items = [];
      const prefix = `${this.prefix}${storeName}_`;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            items.push(parsed.value);
          }
        }
      }

      return items;
    } catch (error) {
      console.error('❌ localStorage fallback error:', error);
      return [];
    }
  }

  async clear(storeName) {
    try {
      const prefix = `${this.prefix}${storeName}_`;

      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('❌ localStorage fallback error:', error);
      return false;
    }
  }

  async getStorageSize() {
    try {
      let total = 0;
      const prefix = this.prefix;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const value = localStorage.getItem(key);
          total += key.length + (value ? value.length : 0);
        }
      }

      return total;
    } catch (error) {
      console.warn('Failed to calculate storage size:', error);
      return 0;
    }
  }
}

// =========================
// 🎯 GLOBAL INSTANCE
// =========================
export const storage = await IndexedDBStorage.createWithFallback('qianlun-db', 1);

export default storage;
