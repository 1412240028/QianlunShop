// =========================
// 🛍️ PRODUCT MANAGER - Dynamic Product Loading
// Handles loading, caching, and managing product data
// =========================

export class ProductManager {
  constructor() {
    this.products = [];
    this.cache = new Map();
    this.isLoading = false;
    this.lastFetch = 0;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  // =========================
  // 📥 LOAD PRODUCTS FROM JSON
  // =========================

  async loadProducts(forceRefresh = false) {
    // Check cache first
    if (!forceRefresh && this.products.length > 0) {
      const now = Date.now();
      if (now - this.lastFetch < this.cacheDuration) {
        console.log("📦 Using cached products");
        return this.products;
      }
    }

    if (this.isLoading) {
      console.log("⏳ Product loading already in progress");
      return this.products;
    }

    this.isLoading = true;

    try {
      console.log("📥 Loading products from JSON...");

      const response = await fetch('data/products.json', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid product data format');
      }

      // Process and validate products
      this.products = data.map(product => this.validateProduct(product));

      this.lastFetch = Date.now();
      this.cache.clear(); // Clear template cache

      console.log(`✅ Loaded ${this.products.length} products`);

      return this.products;

    } catch (error) {
      console.error('❌ Failed to load products:', error);

      // Fallback to cached data if available
      if (this.products.length > 0) {
        console.log("⚠️ Using fallback cached products");
        return this.products;
      }

      throw error;

    } finally {
      this.isLoading = false;
    }
  }

  // =========================
  // ✅ VALIDATE PRODUCT DATA
  // =========================

  validateProduct(product) {
    const required = ['id', 'name', 'price', 'category'];

    for (const field of required) {
      if (!product[field]) {
        console.warn(`⚠️ Product missing required field: ${field}`, product);
      }
    }

    return {
      id: product.id || `prod_${Date.now()}`,
      name: product.name || 'Unknown Product',
      slug: product.slug || this.slugify(product.name || 'unknown'),
      category: product.category || 'uncategorized',
      brand: product.brand || 'Qianlun',
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || product.price || 0,
      discount: Number(product.discount) || 0,
      rating: Number(product.rating) || 0,
      reviewCount: Number(product.reviewCount) || 0,
      stock: Number(product.stock) || 0,
      isNew: Boolean(product.isNew),
      isFeatured: Boolean(product.isFeatured),
      images: Array.isArray(product.images) ? product.images : [],
      thumbnail: product.thumbnail || product.images?.[0] || '',
      description: product.description || '',
      specifications: product.specifications || {},
      variants: Array.isArray(product.variants) ? product.variants : [],
      tags: Array.isArray(product.tags) ? product.tags : []
    };
  }

  // =========================
  // 🔍 SEARCH & FILTER PRODUCTS
  // =========================

  searchProducts(query, filters = {}) {
    let results = [...this.products];

    // Text search
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      results = results.filter(product => product.category === filters.category);
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      results = results.filter(product => product.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(product => product.price <= filters.maxPrice);
    }

    // Stock filter
    if (filters.inStockOnly) {
      results = results.filter(product => product.stock > 0);
    }

    // Featured filter
    if (filters.featuredOnly) {
      results = results.filter(product => product.isFeatured);
    }

    // New products filter
    if (filters.newOnly) {
      results = results.filter(product => product.isNew);
    }

    return results;
  }

  // =========================
  // 📊 SORT PRODUCTS
  // =========================

  sortProducts(products, sortBy = 'default') {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);

      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);

      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));

      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);

      case 'newest':
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

      case 'featured':
        return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

      default:
        return sorted;
    }
  }

  // =========================
  // 🎯 GET PRODUCT BY ID/SLUG
  // =========================

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  getProductBySlug(slug) {
    return this.products.find(product => product.slug === slug);
  }

  // =========================
  // 📂 GET PRODUCTS BY CATEGORY
  // =========================

  getProductsByCategory(category) {
    return this.products.filter(product => product.category === category);
  }

  getCategories() {
    const categories = [...new Set(this.products.map(p => p.category))];
    return categories.sort();
  }

  // =========================
  // ⭐ GET FEATURED/NEW PRODUCTS
  // =========================

  getFeaturedProducts(limit = null) {
    const featured = this.products.filter(product => product.isFeatured);
    return limit ? featured.slice(0, limit) : featured;
  }

  getNewProducts(limit = null) {
    const newProducts = this.products.filter(product => product.isNew);
    return limit ? newProducts.slice(0, limit) : newProducts;
  }

  // =========================
  // 🛒 CART INTEGRATION HELPERS
  // =========================

  getProductForCart(productId, variantId = null) {
    const product = this.getProductById(productId);
    if (!product) return null;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.thumbnail || product.images[0] || '',
      category: product.category,
      brand: product.brand,
      maxQuantity: product.stock
    };

    // Add variant info if specified
    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        cartItem.variant = variant;
        cartItem.name += ` (${variant.name})`;
      }
    }

    return cartItem;
  }

  // =========================
  // 🏷️ UTILITIES
  // =========================

  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  // =========================
  // 📊 STATISTICS
  // =========================

  getStats() {
    return {
      total: this.products.length,
      categories: this.getCategories().length,
      featured: this.products.filter(p => p.isFeatured).length,
      new: this.products.filter(p => p.isNew).length,
      inStock: this.products.filter(p => p.stock > 0).length,
      outOfStock: this.products.filter(p => p.stock === 0).length,
      averagePrice: this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length,
      priceRange: {
        min: Math.min(...this.products.map(p => p.price)),
        max: Math.max(...this.products.map(p => p.price))
      }
    };
  }

  // =========================
  // 🔄 REFRESH DATA
  // =========================

  async refresh() {
    console.log("🔄 Refreshing product data...");
    return this.loadProducts(true);
  }

  // =========================
  // 🧹 CLEANUP
  // =========================

  clearCache() {
    this.cache.clear();
    console.log("🧹 Product cache cleared");
  }

  destroy() {
    this.products = [];
    this.cache.clear();
    console.log("🗑️ ProductManager destroyed");
  }

  // =========================
  // 🚀 INITIALIZE PRODUCT MANAGER
  // =========================

  async init() {
    try {
      console.log("🚀 Initializing ProductManager...");
      await this.loadProducts();
      console.log("✅ ProductManager initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize ProductManager:", error);
      throw error;
    }
  }
}

// =========================
// 🌐 SINGLETON INSTANCE
// =========================

export const productManager = new ProductManager();
export default ProductManager;
