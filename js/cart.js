// =========================
// 🛒 Cart Class - FINAL FIXED VERSION
// Compatible with script.js
// =========================

export class Cart {
  constructor() {
    this.key = "qianlunshop_cart";
    this.items = this.load();
  }

  // =========================
  // 🔹 Load & Save
  // =========================
  load() {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) return [];

      const items = JSON.parse(data);
      return items.filter(item => {
        const isValid = item &&
          item.id &&
          item.name &&
          typeof item.price === "number" &&
          typeof item.quantity === "number";
        if (!isValid) console.warn("⚠️ Invalid item removed:", item);
        return isValid;
      });
    } catch (err) {
      console.error("❌ Gagal load cart:", err);
      return [];
    }
  }

  save() {
    try {
      const validItems = this.items.filter(
        i =>
          i &&
          i.id &&
          i.name &&
          typeof i.price === "number" &&
          typeof i.quantity === "number"
      );
      localStorage.setItem(this.key, JSON.stringify(validItems));
      console.log("💾 Cart saved:", validItems.length, "items");
    } catch (err) {
      console.error("❌ Gagal save cart:", err);
    }
  }

  // =========================
  // 🔹 CRUD
  // =========================
  add(product) {
    if (
      !product ||
      !product.id ||
      !product.name ||
      typeof product.price !== "number"
    ) {
      console.error("❌ Invalid product:", product);
      return false;
    }

    const existing = this.items.find(i => i.id === product.id);
    const qty = Number(product.quantity ?? 1);

    if (existing) {
      existing.quantity = (existing.quantity ?? 0) + qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        category: product.category || "general",
        quantity: qty
      });
    }

    this.save();
    return true;
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

  // =========================
  // 🔹 Getters
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
    return this.items;
  }

  getItem(id) {
    return this.items.find(i => i.id === id);
  }

  getSummary() {
    return {
      count: this.getItemCount(),
      total: this.getTotal(),
      items: this.items
    };
  }

  // =========================
  // 🔹 Utility / Debug
  // =========================
  validate() {
    const valid = this.items.every(
      i =>
        i &&
        i.id &&
        i.name &&
        typeof i.price === "number" &&
        typeof i.quantity === "number"
    );
    console.log(valid ? "✅ Cart valid" : "⚠️ Invalid items detected");
    return valid;
  }

  debug() {
    console.table(this.items);
    console.log("📦 Total Items:", this.getItemCount());
    console.log("💰 Total Harga:", this.getTotal());
  }
}
