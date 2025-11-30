// =========================
// 🔍 PRODUCTS MODULE - QIANLUNSHOP
// Extracted from script.js for better modularity
// =========================
import { CONFIG, Utils } from "./config.js";

// =========================
// 🔍 Product Search & Filter - ENHANCED
// =========================
export function initProductFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const resetBtn = document.getElementById('resetFilter');
  const productGrid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');
  const resultCount = document.getElementById('resultCount');

  if (!searchInput || !productGrid) {
    console.log("ℹ️ Not on products page");
    return;
  }

  console.log("🔍 Initializing enhanced product filters...");

  let allProducts = Array.from(productGrid.querySelectorAll('.product-card'));
  const originalProducts = [...allProducts];

  // Populate category filter
  if (categoryFilter) {
    categoryFilter.innerHTML = `
      <option value="all">Semua Kategori</option>
      ${Object.values(CONFIG.CATEGORIES).map(cat =>
        `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
      ).join('')}
    `;
  }

  function updateResultCount(count) {
    if (resultCount) {
      resultCount.textContent = `${count} produk ditemukan`;
    }
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    let filteredProducts = allProducts.filter(product => {
      const name = product.dataset.name?.toLowerCase() || '';
      const description = product.dataset.description?.toLowerCase() || '';
      const productCategory = product.dataset.category;

      const matchesSearch = searchTerm === '' ||
        name.includes(searchTerm) ||
        description.includes(searchTerm);

      const matchesCategory = category === 'all' || productCategory === category;

      return matchesSearch && matchesCategory;
    });

    // Sort products
    if (sortBy !== 'default') {
      filteredProducts.sort((a, b) => {
        const priceA = parseInt(a.dataset.price) || 0;
        const priceB = parseInt(b.dataset.price) || 0;
        const nameA = a.dataset.name?.toLowerCase() || '';
        const nameB = b.dataset.name?.toLowerCase() || '';

        switch (sortBy) {
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          case 'name-asc': return nameA.localeCompare(nameB);
          case 'name-desc': return nameB.localeCompare(nameA);
          default: return 0;
        }
      });
    }

    updateProductDisplay(filteredProducts);
  }

  function updateProductDisplay(filteredProducts) {
    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      noResults.style.display = 'block';
      updateResultCount(0);
    } else {
      noResults.style.display = 'none';

      filteredProducts.forEach((product, index) => {
        product.style.animationDelay = `${index * 0.1}s`;
        productGrid.appendChild(product);
      });

      updateResultCount(filteredProducts.length);
    }
  }

  function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    allProducts = [...originalProducts];
    updateProductDisplay(allProducts);
    showToast(CONFIG.MESSAGES.FILTER_RESET, "success");

    // Track analytics
    Utils.trackEvent('filters_reset');
  }

  // Event listeners with debouncing
  searchInput.addEventListener('input', Utils.debounce(applyFilters));
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', resetFilters);

  // Reset button from no-results
  const resetFromNoResults = document.getElementById('resetFromNoResults');
  if (resetFromNoResults) {
    resetFromNoResults.addEventListener('click', resetFilters);
  }

  updateResultCount(allProducts.length);
}

// =========================
// 🔍 Discover More - Product Navigation
// =========================
export function initDiscoverMore() {
  function addHighlightStyles() {
    if (document.getElementById('discover-more-styles')) return;

    const style = document.createElement('style');
    style.id = 'discover-more-styles';
    style.textContent = `
      .product-card.highlighted {
        animation: highlightProduct 2s ease;
        border-color: ${CONFIG.THEME.PRIMARY} !important;
      }

      @keyframes highlightProduct {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 4px 12px ${CONFIG.THEME.PRIMARY}30;
        }
        25%, 75% {
          transform: scale(1.03);
          box-shadow: 0 12px 35px ${CONFIG.THEME.PRIMARY}60;
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 16px 45px ${CONFIG.THEME.SECONDARY}70;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function handleProductAnchor() {
    const hash = window.location.hash;

    if (hash && hash.startsWith('#p')) {
      setTimeout(() => {
        const productCard = document.querySelector(`[data-id="${hash.substring(1)}"]`);

        if (productCard) {
          productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          productCard.classList.add('highlighted');
          setTimeout(() => productCard.classList.remove('highlighted'), 3000);
        }
      }, 300);
    }
  }

  addHighlightStyles();
  handleProductAnchor();
  window.addEventListener('hashchange', handleProductAnchor);
}

// =========================
// 🛍️ Product Add to Cart Handler
// =========================
export function initProductAddToCart() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault();
      e.target.disabled = true;

      const card = e.target.closest(".product-card");
      if (!card) {
        console.error("❌ Product card tidak ditemukan");
        showToast(CONFIG.MESSAGES.ORDER_FAILED, "error");
        e.target.disabled = false;
        return;
      }

      // Animation
      const imgEl = card.querySelector("img");
      if (imgEl) {
        flyToCart(imgEl);
      }

      // Extract product data
      const nameEl = card.querySelector("h3, .product-name");
      const priceAttr = card.dataset.price;
      const idAttr = card.dataset.id;
      const categoryAttr = card.dataset.category;

      if (!nameEl || !priceAttr || !idAttr) {
        console.error("❌ Data produk tidak lengkap", { nameEl, priceAttr, idAttr });
        showToast(CONFIG.MESSAGES.FORM_INCOMPLETE, "error");
        e.target.disabled = false;
        return;
      }

      const product = {
        id: idAttr,
        name: nameEl.textContent.trim(),
        price: parseInt(priceAttr, 10),
        image: imgEl ? imgEl.src : "",
        category: categoryAttr || "general",
        quantity: 1
      };

      console.log("🛍️ Adding product to cart:", product);

      try {
        // Import cart dynamically to avoid circular dependencies
        const { Cart } = await import('./cart.js');
        const cart = new Cart();

        const success = await cart.add(product);

        if (success) {
          updateCartCount();
          showToast(CONFIG.MESSAGES.ADD_TO_CART_SUCCESS, "success");

          // Track analytics
          Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.ADD_TO_CART, {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            category: product.category
          });
        } else {
          showToast("⚠️ Gagal menambahkan ke keranjang", "error");
        }
      } catch (error) {
        console.error("❌ Error adding to cart:", error);
        showToast(CONFIG.MESSAGES.ORDER_FAILED, "error");
      } finally {
        e.target.disabled = false;
      }
    }
  });
}

// Helper functions that need to be imported or defined
function showToast(message, type = "success") {
  if (typeof window.showToast === 'function') {
    window.showToast(message, type);
  } else {
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}

function updateCartCount() {
  if (typeof window.updateCartCount === 'function') {
    window.updateCartCount();
  } else {
    console.log("updateCartCount function not available");
  }
}

function flyToCart(imgEl) {
  if (typeof window.flyToCart === 'function') {
    window.flyToCart(imgEl);
  } else {
    console.log("flyToCart function not available");
  }
}
