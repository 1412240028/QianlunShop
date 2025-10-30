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
      if (!data) return [];
      
      const items = JSON.parse(data);
      
      // Validasi setiap item
      return items.filter(item => {
        const isValid = item && 
                       item.id && 
                       item.name && 
                       typeof item.price === 'number' && 
                       typeof item.quantity === 'number';
        
        if (!isValid) {
          console.warn("⚠️ Invalid item removed from cart:", item);
        }
        
        return isValid;
      });
    } catch (err) {
      console.error("❌ Gagal load cart:", err);
      return [];
    }
  }

  save() {
    try {
      // Validasi sebelum save
      const validItems = this.items.filter(item => {
        return item && 
               item.id && 
               item.name && 
               typeof item.price === 'number' && 
               typeof item.quantity === 'number';
      });
      
      localStorage.setItem(this.key, JSON.stringify(validItems));
      console.log("💾 Cart saved:", validItems.length, "items");
    } catch (err) {
      console.error("❌ Gagal save cart:", err);
    }
  }

  add(product) {
    // Validasi product sebelum add
    if (!product || !product.id || !product.name || typeof product.price !== 'number') {
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
        image: product.image || '',
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

  getItemCount() {
    return this.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  }

  getTotal() {
    return this.items.reduce((sum, i) => {
      const price = Number(i.price) || 0;
      const qty = Number(i.quantity) || 0;
      return sum + (price * qty);
    }, 0);
  }
}