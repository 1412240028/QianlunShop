import { Cart } from "./cart.js";

const cart = new Cart();

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
// 🛒 Update Navbar Count
// =========================
function updateCartCount() {
  const countEl = document.querySelector("#cartIcon .cart-count");
  if (countEl) {
    countEl.textContent = cart.getItemCount();
  }
}

// =========================
// ✨ Animasi Terbang ke Cart
// =========================
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
  imgClone.style.pointerEvents = "none";
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

// =========================
// 🛍️ Tambah ke Keranjang
// =========================
document.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart")) {
    e.preventDefault();
    
    const card = e.target.closest(".product-card");
    if (!card) {
      console.error("❌ Product card tidak ditemukan");
      return;
    }

    const imgEl = card.querySelector("img");
    if (imgEl) {
      flyToCart(imgEl);
    }

    const nameEl = card.querySelector("h3");
    const priceAttr = card.dataset.price;
    const idAttr = card.dataset.id;

    if (!nameEl || !priceAttr || !idAttr) {
      console.error("❌ Data produk tidak lengkap", { nameEl, priceAttr, idAttr });
      showToast("❌ Gagal menambahkan produk", "error");
      return;
    }

    const product = {
      id: idAttr,
      name: nameEl.textContent.trim(),
      price: parseInt(priceAttr, 10),
      image: imgEl ? imgEl.src : "",
      quantity: 1
    };

    console.log("✅ Menambahkan produk:", product);
    cart.add(product);
    updateCartCount();
    showToast(`✅ ${product.name} ditambahkan ke keranjang!`);
  }
});

// =========================
// 🛒 Render Halaman Cart
// =========================
function initCartPage() {
  const container = document.querySelector(".cart-container");
  if (!container) return;

  function renderCart() {
    const items = cart.items;
    
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

  renderCart();

  // Event listener untuk cart actions
  container.addEventListener("click", e => {
    const id = e.target.dataset.id;
    
    if (e.target.classList.contains("remove-item")) {
      cart.remove(id);
      renderCart();
      updateCartCount();
      showToast("🗑️ Item dihapus dari keranjang", "error");
    }
    
    if (e.target.classList.contains("clear-cart")) {
      if (confirm("Yakin ingin menghapus semua item?")) {
        cart.clear();
        renderCart();
        updateCartCount();
        showToast("🚮 Semua item dihapus", "error");
      }
    }
    
    if (e.target.classList.contains("inc")) {
      const item = cart.items.find(i => i.id === id);
      if (item) {
        cart.update(id, item.quantity + 1);
        renderCart();
        updateCartCount();
      }
    }
    
    if (e.target.classList.contains("dec")) {
      const item = cart.items.find(i => i.id === id);
      if (item && item.quantity > 1) {
        cart.update(id, item.quantity - 1);
        renderCart();
        updateCartCount();
      }
    }
  });
}

// =========================
// 🚀 Initialize on Load
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Script loaded");
  updateCartCount();
  initCartPage();
});