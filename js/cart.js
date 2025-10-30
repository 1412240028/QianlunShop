// =========================
// 🛒 Cart Class
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

// =========================
// 🏷️ Toast Notification
// =========================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// =========================
// 🛍️ Main Script
// =========================
import { Cart } from "./cart.js";
const cart = new Cart();

// Tambah ke cart + animasi fly-to-cart
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const imgEl = card.querySelector("img");
    flyToCart(imgEl);

    const product = {
      id: card.dataset.id,
      name: card.querySelector("h3").textContent,
      price: parseInt(card.dataset.price),
      image: imgEl.src,
      quantity: 1
    };

    cart.add(product);
    showToast(`✅ ${product.name} ditambahkan ke keranjang!`);
  }
});

// Animasi terbang ke cart
function flyToCart(imgEl) {
  const cartIcon = document.querySelector("#cartIcon");
  if (!cartIcon || !imgEl) return;

  const imgClone = imgEl.cloneNode(true);
  const rect = imgEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  imgClone.style.position = "fixed";
  imgClone.style.top = `${rect.top}px`;
  imgClone.style.left = `${rect.left}px`;
  imgClone.style.width = `${rect.width}px`;
  imgClone.style.height = `${rect.height}px`;
  imgClone.style.transition = "all 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19)";
  imgClone.style.zIndex = "9999";
  imgClone.style.borderRadius = "10px";
  document.body.appendChild(imgClone);

  setTimeout(() => {
    imgClone.style.top = `${cartRect.top + 10}px`;
    imgClone.style.left = `${cartRect.left + 10}px`;
    imgClone.style.width = "30px";
    imgClone.style.height = "30px";
    imgClone.style.opacity = "0.3";
  }, 10);

  setTimeout(() => {
    imgClone.remove();
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 500);
  }, 900);
}

// Render halaman cart
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".cart-container");
  if (!container) return;

  renderCart();

  function renderCart() {
    const items = cart.load();
    if (!items || items.length === 0) {
      container.innerHTML = `
        <p>Keranjang kamu masih kosong.</p>
        <a href="products.html" class="btn">Belanja Sekarang</a>
      `;
      return;
    }

    const total = cart.getTotal().toLocaleString("id-ID");
    container.innerHTML = `
      <div class="cart-items">
        ${items.map(i => `
          <div class="cart-item" data-id="${i.id}">
            <img src="${i.image}" alt="${i.name}">
            <div class="cart-info">
              <h3>${i.name}</h3>
              <p>Rp ${i.price.toLocaleString("id-ID")}</p>
              <div class="cart-actions">
                <button class="dec" data-id="${i.id}">-</button>
                <input type="number" value="${i.quantity}" min="1" readonly>
                <button class="inc" data-id="${i.id}">+</button>
              </div>
            </div>
            <button class="remove-item" data-id="${i.id}">✕</button>
          </div>
        `).join("")}
      </div>
      <div class="cart-summary">
        <h3>Total: Rp ${total}</h3>
        <button class="btn clear-cart">Hapus Semua</button>
      </div>
    `;
  }

  container.addEventListener("click", e => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains("remove-item")) {
      cart.remove(id);
      renderCart();
      showToast("🗑️ Item dihapus dari keranjang", "error");
    }
    if (e.target.classList.contains("clear-cart")) {
      cart.clear();
      renderCart();
      showToast("🚮 Semua item dihapus", "error");
    }
    if (e.target.classList.contains("inc")) {
      const item = cart.items.find(i => i.id === id);
      if (item) {
        cart.update(id, item.quantity + 1);
        renderCart();
      }
    }
    if (e.target.classList.contains("dec")) {
      const item = cart.items.find(i => i.id === id);
      if (item && item.quantity > 1) {
        cart.update(id, item.quantity - 1);
        renderCart();
      }
    }
  });
});
