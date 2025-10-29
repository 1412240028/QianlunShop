// =========================
// 🛒 QianlunShop - Cart Module (Final Clean Version)
// =========================
export class Cart {
    constructor() {
      this.key = "qianlunshop_cart";
      this.items = this.load();
    }
  
    // Load cart dari localStorage
    load() {
      try {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
      } catch (err) {
        console.error("❌ Gagal load cart:", err);
        return [];
      }
    }
  
    // Simpan cart ke localStorage
    save() {
      localStorage.setItem(this.key, JSON.stringify(this.items));
    }
  
    // Tambah produk
    add(product) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity += product.quantity ?? 1;
      } else {
        this.items.push({ ...product, quantity: product.quantity ?? 1 });
      }
      this.save();
    }
  
    // Hapus produk berdasarkan ID
    remove(id) {
      this.items = this.items.filter(i => i.id !== id);
      this.save();
    }
  
    // Update jumlah produk
    update(id, quantity) {
      const item = this.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, Number(quantity));
        this.save();
      }
    }
  
    // Hapus seluruh keranjang
    clear() {
      this.items = [];
      this.save();
    }
  
    // Hitung total item
    getItemCount() {
      return this.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
    }
  
    // Hitung total harga keseluruhan
    getTotal() {
      return this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    }
  }
  