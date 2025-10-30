// =========================
// 🛒 Cart Class - CLEAN VERSION
// =========================
export class Cart {
  constructor() {
    this.key = "qianlunshop_cart";
    this.items = this.load();
  }

  load() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("❌ Gagal load cart:", err);
      return [];
    }
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.items));
  }

  add(product) {
    const existing = this.items.find(i => i.id === product.id);
    const qty = Number(product.quantity ?? 1);
    if (existing) {
      existing.quantity = (existing.quantity ?? 0) + qty;
    } else {
      this.items.push({ ...product, quantity: qty });
    }
    this.save();
  }

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }

  update(id, quantity) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(1, parseInt(quantity, 10) || 1);
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  getItemCount() {
    return this.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  }

  getTotal() {
    return this.items.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 0)), 0);
  }
}