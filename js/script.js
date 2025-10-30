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
    const count = cart.getItemCount();
    countEl.textContent = count;
    console.log("📊 Cart count updated:", count);
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
  if (!container) {
    console.log("ℹ️ Bukan halaman cart");
    return;
  }

  console.log("🛒 Initializing cart page...");
  console.log("📦 Cart items:", cart.items);

  function renderCart() {
    const items = cart.items;
    
    console.log("🔄 Rendering cart with", items.length, "items");
    console.log("📦 Raw items data:", JSON.stringify(items, null, 2));

    // Filter item yang valid
    const validItems = items.filter(i => {
      const isValid = i && i.id && i.name && i.price && i.quantity;
      if (!isValid) {
        console.warn("⚠️ Invalid item detected:", i);
      }
      return isValid;
    });

    console.log("✅ Valid items:", validItems.length);

    if (!validItems || validItems.length === 0) {
      container.innerHTML = `
        <p>Keranjang kamu masih kosong.</p>
        <a href="products.html" class="btn">Belanja Sekarang</a>
      `;
      
      // Jika ada item invalid, bersihkan
      if (items.length > 0) {
        console.warn("🧹 Cleaning invalid items from cart");
        cart.items = validItems;
        cart.save();
        updateCartCount();
      }
      return;
    }

    const total = validItems.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString("id-ID");
    
    const itemsHTML = validItems.map(i => {
      console.log("Rendering item:", {
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      });
      
      const itemPrice = (i.price || 0).toLocaleString("id-ID");
      const fallbackImage = i.image || '../assets/sample1.jpg';
      
      return `
        <div class="cart-item" data-id="${i.id}">
          <img src="${fallbackImage}" alt="${i.name}" onerror="this.src='../assets/sample1.jpg'">
          <div class="cart-info">
            <h3>${i.name}</h3>
            <p>Rp ${itemPrice}</p>
            <div class="cart-actions">
              <button class="dec" data-id="${i.id}">-</button>
              <input type="number" value="${i.quantity}" min="1" readonly>
              <button class="inc" data-id="${i.id}">+</button>
            </div>
          </div>
          <button class="remove-item" data-id="${i.id}">✕</button>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="cart-items">
        ${itemsHTML}
      </div>

      <div class="cart-summary">
        <h3>Total: Rp ${total}</h3>
        <button class="btn checkout-btn">Checkout</button>
        <button class="btn clear-cart" style="background: var(--error); margin-top: 1rem;">Hapus Semua</button>
      </div>
    `;

    console.log("✅ Cart rendered successfully");
  }

  renderCart();

  // Event listener untuk cart actions
  container.addEventListener("click", e => {
    const id = e.target.dataset.id;
    
    if (e.target.classList.contains("remove-item")) {
      console.log("🗑️ Removing item:", id);
      cart.remove(id);
      renderCart();
      updateCartCount();
      showToast("🗑️ Item dihapus dari keranjang", "error");
    }
    
    if (e.target.classList.contains("clear-cart")) {
      if (confirm("Yakin ingin menghapus semua item?")) {
        console.log("🚮 Clearing cart");
        cart.clear();
        renderCart();
        updateCartCount();
        showToast("🚮 Semua item dihapus", "error");
      }
    }

    if (e.target.classList.contains("checkout-btn")) {
      alert("🎉 Fitur checkout sedang dalam pengembangan!");
    }
    
    if (e.target.classList.contains("inc")) {
      const item = cart.items.find(i => i.id === id);
      if (item) {
        console.log("➕ Increasing quantity for:", id);
        cart.update(id, item.quantity + 1);
        renderCart();
        updateCartCount();
      }
    }
    
    if (e.target.classList.contains("dec")) {
      const item = cart.items.find(i => i.id === id);
      if (item && item.quantity > 1) {
        console.log("➖ Decreasing quantity for:", id);
        cart.update(id, item.quantity - 1);
        renderCart();
        updateCartCount();
      }
    }
  });
}

// =========================
// 🔍 SEARCH & FILTER LOGIC
// =========================
function initProductFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetBtn = document.getElementById('resetFilter');
  const productGrid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');

  // Check if we're on products page
  if (!searchInput || !productGrid) {
    console.log("ℹ️ Not on products page, skipping filter initialization");
    return;
  }

  console.log("🔍 Initializing product filters...");

  // Get all products
  let allProducts = Array.from(productGrid.querySelectorAll('.product-card'));

  // Store original order
  const originalProducts = [...allProducts];

  // Update result count
  function updateResultCount(count) {
    if (resultCount) {
      resultCount.textContent = count;
    }
  }

  // Apply all filters
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    console.log("🔄 Applying filters:", { searchTerm, category, sortBy });

    // Filter products
    let filteredProducts = allProducts.filter(product => {
      const name = product.dataset.name.toLowerCase();
      const productCategory = product.dataset.category;

      // Search filter
      const matchesSearch = searchTerm === '' || name.includes(searchTerm);

      // Category filter
      const matchesCategory = category === 'all' || productCategory === category;

      return matchesSearch && matchesCategory;
    });

    // Sort products
    if (sortBy !== 'default') {
      filteredProducts.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        const nameA = a.dataset.name.toLowerCase();
        const nameB = b.dataset.name.toLowerCase();

        switch (sortBy) {
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          case 'name-asc':
            return nameA.localeCompare(nameB);
          case 'name-desc':
            return nameB.localeCompare(nameA);
          default:
            return 0;
        }
      });
    }

    // Update DOM
    updateProductDisplay(filteredProducts);
  }

  // Update product display
  function updateProductDisplay(filteredProducts) {
    // Hide all products first
    allProducts.forEach(product => {
      product.classList.add('hidden');
      product.classList.remove('visible');
    });

    // Clear grid
    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      // Show no results message
      noResults.style.display = 'block';
      updateResultCount(0);
    } else {
      // Hide no results message
      noResults.style.display = 'none';

      // Show filtered products with animation
      filteredProducts.forEach((product, index) => {
        product.classList.remove('hidden');
        product.classList.add('visible');
        product.style.animationDelay = `${index * 0.1}s`;
        productGrid.appendChild(product);
      });

      updateResultCount(filteredProducts.length);
    }

    console.log("✅ Displayed", filteredProducts.length, "products");
  }

  // Reset filters
  function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    
    // Restore original order
    allProducts = [...originalProducts];
    updateProductDisplay(allProducts);
    
    console.log("🔄 Filters reset");
    showToast("🔄 Filter direset", "success");
  }

  // Event listeners
  searchInput.addEventListener('input', () => {
    console.log("🔍 Search:", searchInput.value);
    applyFilters();
  });

  categoryFilter.addEventListener('change', () => {
    console.log("📁 Category:", categoryFilter.value);
    applyFilters();
  });

  sortFilter.addEventListener('change', () => {
    console.log("🔢 Sort:", sortFilter.value);
    applyFilters();
  });

  resetBtn.addEventListener('click', resetFilters);

  // Initial count
  updateResultCount(allProducts.length);
  console.log("✅ Product filters initialized with", allProducts.length, "products");
}

// =========================
// 🚀 Initialize on Load
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 QianlunShop script loaded");
  console.log("📦 Initial cart state:", cart.items);
  console.log("🔢 Total items:", cart.getItemCount());
  
  updateCartCount();
  initCartPage();
  initProductFilters();
});

// =========================
// 🐛 Debug Helper (Optional - hapus di production)
// =========================
window.debugCart = () => {
  console.log("=== CART DEBUG ===");
  console.log("Items:", cart.items);
  console.log("Count:", cart.getItemCount());
  console.log("Total:", cart.getTotal());
  console.log("localStorage:", localStorage.getItem('qianlunshop_cart'));
};