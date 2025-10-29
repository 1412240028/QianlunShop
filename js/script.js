// =========================
// 🛍️ QianlunShop Main Script (Final)
// =========================
import { Cart } from "./cart.js";

const cart = new Cart();

// =========================
// 🏷️ Tambah ke keranjang (Products page)
// =========================
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const product = {
      id: card.dataset.id,
      name: card.querySelector("h3").textContent,
      price: parseInt(card.dataset.price),
      image: card.querySelector("img").src,
      quantity: 1
    };

    cart.add(product);
    alert(`✅ ${product.name} berhasil ditambahkan ke keranjang!`);
  }
});

// =========================
// 🛒 Render halaman Cart
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".cart-container");
  if (!container) return; // kalau bukan di cart.html

  renderCart();

  // Fungsi render
  function renderCart() {
    const items = cart.load();

    // Kalau kosong
    if (!items || items.length === 0) {
      container.innerHTML = `
        <p>Keranjang kamu masih kosong.</p>
        <a href="products.html" class="btn">Belanja Sekarang</a>
      `;
      return;
    }

    // Kalau ada isi
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

  // =========================
  // 🎯 Event Listener Cart
  // =========================
  container.addEventListener("click", e => {
    const id = e.target.dataset.id;

    // Hapus item
    if (e.target.classList.contains("remove-item")) {
      cart.remove(id);
      renderCart();
    }

    // Hapus semua item
    if (e.target.classList.contains("clear-cart")) {
      cart.clear();
      renderCart();
    }

    // Tambah jumlah
    if (e.target.classList.contains("inc")) {
      const item = cart.items.find(i => i.id === id);
      cart.update(id, item.quantity + 1);
      renderCart();
    }

    // Kurangi jumlah
    if (e.target.classList.contains("dec")) {
      const item = cart.items.find(i => i.id === id);
      if (item.quantity > 1) {
        cart.update(id, item.quantity - 1);
        renderCart();
      }
    }
  });
});
