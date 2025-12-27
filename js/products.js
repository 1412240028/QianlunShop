// =========================
// 🔍 PRODUCTS MODULE - QIANLUNSHOP (FIXED)
// Complete with all exports
// =========================
import { CONFIG, Utils } from "./config.js";
import { showToast, updateCartCount, flyToCart } from "./ui.js";
import { Cart } from "./cart.js";

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
      ${(CONFIG.CATEGORIES ? Object.values(CONFIG.CATEGORIES) : []).map(cat =>
        `<option value="${cat.id}">${cat.icon || ''} ${cat.name || ''}</option>`
      ).join('')}
    `;
  }

  function updateResultCount(count) {
    if (resultCount) {
      resultCount.textContent = `${count} produk ditemukan`;
    }
  }

  function normalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  function applyFilters() {
    const searchTerm = normalizeText(searchInput.value);
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    let filteredProducts = allProducts.filter(product => {
      const name = normalizeText(product.dataset.name || '');
      const description = normalizeText(product.dataset.description || '');
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
      if (noResults) noResults.style.display = 'block';
      updateResultCount(0);
    } else {
      if (noResults) noResults.style.display = 'none';

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

    showToast('Filter direset', 'success');
  }

  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
  });
  
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', resetFilters);

  const resetFromNoResults = document.getElementById('resetFromNoResults');
  if (resetFromNoResults) {
    resetFromNoResults.addEventListener('click', resetFilters);
  }

  updateResultCount(allProducts.length);
  
  console.log('✅ Product filters initialized');
}

// =========================
// 🔍 Discover More - Product Navigation
// ✅ EXPORTED (INI YANG HILANG!)
// =========================
export function initDiscoverMore() {
  console.log("🔍 Initializing Discover More...");
  
  function addHighlightStyles() {
    if (document.getElementById('discover-more-styles')) return;

    const style = document.createElement('style');
    style.id = 'discover-more-styles';
    style.textContent = `
      .product-card.highlighted {
        animation: highlightProduct 2s ease;
        border-color: ${(CONFIG.THEME?.PRIMARY || '#d4af37')} !important;
      }

      @keyframes highlightProduct {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 4px 12px ${(CONFIG.THEME?.PRIMARY || '#d4af37')}30;
        }
        25%, 75% {
          transform: scale(1.03);
          box-shadow: 0 12px 35px ${(CONFIG.THEME?.PRIMARY || '#d4af37')}60;
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 16px 45px ${(CONFIG.THEME?.SECONDARY || '#f4d03f')}70;
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
  
  console.log('✅ Discover More initialized');
}

// =========================
// 🛍️ Product Add to Cart Handler - FIXED VERSION
// =========================
export function initProductAddToCart() {
  console.log("🛍️ Initializing Add to Cart handler...");

  const cart = new Cart();
  const addingProducts = new Set();

  document.addEventListener("click", async (e) => {
    const addButton = e.target.closest(".add-to-cart");

    if (!addButton) return;

    e.preventDefault();
    console.log("🖱️ Add to Cart button clicked");

    const card = addButton.closest('.product-card');
    const productId = card.dataset.id;

    if (addingProducts.has(productId)) return;

    addingProducts.add(productId);

    // Disable button to prevent double-click
    addButton.disabled = true;
    addButton.classList.add('loading');
    const originalText = addButton.innerHTML;
    addButton.innerHTML = '⏳ Adding...';

    try {
      console.log("📦 Product card found:", card);

      // Extract product data with validation
      const nameEl = card.querySelector("h3, .product-name");
      const imgEl = card.querySelector("img");
      const priceAttr = card.dataset.price;
      const idAttr = card.dataset.id;
      const categoryAttr = card.dataset.category || "general";

      // Validate required data
      if (!nameEl || !priceAttr || !idAttr) {
        console.error("❌ Data produk tidak lengkap", {
          nameEl: !!nameEl,
          priceAttr,
          idAttr
        });
        showToast("Data produk tidak lengkap", "error");
        return;
      }

      // Parse price safely
      const parsedPrice = parseInt(priceAttr, 10);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        console.error("❌ Harga tidak valid:", priceAttr);
        showToast("Harga produk tidak valid", "error");
        return;
      }

      // Create product object
      const product = {
        id: idAttr,
        name: nameEl.textContent.trim(),
        price: parsedPrice,
        image: imgEl ? imgEl.src : "../assets/images/products/placeholder.jpg",
        category: categoryAttr,
        quantity: 1
      };

      console.log("🛍️ Adding product to cart:", product);

      // Add to cart
      const success = await cart.add(product);

      if (success) {
        // Update cart count
        updateCartCount(cart);

        // Animation
        if (imgEl) {
          flyToCart(imgEl);
        }

        // Show success message
        showToast("✅ Produk ditambahkan ke keranjang!", "success");

        // ✅ Show Item Count on Button
        const itemInCart = cart.getItem(product.id);
        if (itemInCart) {
          addButton.innerHTML = `✅ In Cart (${itemInCart.quantity})`;
          addButton.classList.add('in-cart');
        } else {
          addButton.innerHTML = '✅ Added!';
        }

        setTimeout(() => {
          addButton.innerHTML = originalText;
          addButton.classList.remove('in-cart');
        }, 2000);

        // Track analytics
        if (typeof Utils !== 'undefined' && Utils.trackEvent) {
          Utils.trackEvent(CONFIG.ANALYTICS_EVENTS.ADD_TO_CART, {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            category: product.category
          });
        }
      } else {
        showToast("⚠️ Gagal menambahkan ke keranjang", "error");
      }

    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      showToast("Terjadi kesalahan, silakan coba lagi", "error");

    } finally {
      // Remove from adding set and remove loading state
      addingProducts.delete(productId);
      addButton.disabled = false;
      addButton.classList.remove('loading');
      if (addButton.innerHTML === '⏳ Adding...') {
        addButton.innerHTML = originalText || 'Add to Cart';
      }
    }
  });

  console.log("✅ Add to Cart handler initialized");
}

// =========================
// 🖼️ LAZY LOADING IMAGES
// =========================
export function initLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    console.log("⚠️ IntersectionObserver not supported");
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });

  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  console.log("✅ Lazy loading initialized");
}

// =========================
// 🧪 DEBUG HELPER
// =========================
export function debugProductCard(productId) {
  const card = document.querySelector(`[data-id="${productId}"]`);
  
  if (!card) {
    console.error("❌ Product card not found:", productId);
    return null;
  }
  
  const debug = {
    card: card,
    dataset: {
      id: card.dataset.id,
      price: card.dataset.price,
      category: card.dataset.category,
      name: card.dataset.name
    },
    elements: {
      h3: card.querySelector('h3'),
      img: card.querySelector('img'),
      button: card.querySelector('.add-to-cart')
    },
    computed: {
      name: card.querySelector('h3')?.textContent.trim(),
      imageSrc: card.querySelector('img')?.src,
      parsedPrice: parseInt(card.dataset.price, 10)
    }
  };
  
  console.log("=== PRODUCT CARD DEBUG ===");
  console.table(debug.dataset);
  console.table(debug.computed);
  console.log("Elements:", debug.elements);
  console.log("==========================");
  
  return debug;
}

// Make debug function globally accessible
if (typeof window !== 'undefined') {
  window.debugProductCard = debugProductCard;
}

console.log("✅ Products module loaded");