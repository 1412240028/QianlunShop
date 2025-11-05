// =========================
// 🔍 SEO ENHANCER - Dynamic Meta Tags & Structured Data
// Comprehensive SEO optimization
// =========================

export class SEOEnhancer {
  constructor() {
    this.baseMeta = {
      title: 'QianlunShop - Luxury Collection',
      description: 'Where Heritage Meets Modern Luxury. Experience timeless elegance with our dragon-inspired collections.',
      keywords: 'luxury, fashion, watches, bags, shoes, wallets, Qianlun, dragon, heritage',
      author: 'Dhoni Prasetya',
      robots: 'index, follow',
      og: {
        type: 'website',
        site_name: 'QianlunShop',
        locale: 'id_ID'
      },
      twitter: {
        card: 'summary_large_image',
        site: '@qianlunshop'
      }
    };

    this.structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'QianlunShop',
      url: 'https://1412240028.github.io/QianlunShop/',
      logo: 'https://1412240028.github.io/QianlunShop/assets/images/icons/QianLun Dragon.png',
      description: 'Luxury e-commerce platform featuring dragon-inspired collections',
      sameAs: [
        'https://github.com/1412240028/QianlunShop'
      ]
    };

    this.init();
  }

  // =========================
  // 🚀 INITIALIZE SEO FEATURES
  // =========================

  init() {
    this.setBaseMetaTags();
    this.addStructuredData();
    this.setupDynamicSEO();
    this.addCanonicalURL();
    this.addAlternateLanguages();

    console.log('🔍 SEO Enhancer initialized');
  }

  // =========================
  // 🏷️ BASE META TAGS
  // =========================

  setBaseMetaTags() {
    const head = document.head;

    // Basic meta tags
    this.setMetaTag('description', this.baseMeta.description);
    this.setMetaTag('keywords', this.baseMeta.keywords);
    this.setMetaTag('author', this.baseMeta.author);
    this.setMetaTag('robots', this.baseMeta.robots);

    // Viewport (if not already set)
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      head.appendChild(viewport);
    }

    // Charset (if not already set)
    if (!document.querySelector('meta[charset]')) {
      const charset = document.createElement('meta');
      charset.setAttribute('charset', 'UTF-8');
      head.insertBefore(charset, head.firstChild);
    }

    // Open Graph tags
    this.setOGTag('title', this.baseMeta.title);
    this.setOGTag('description', this.baseMeta.description);
    this.setOGTag('type', this.baseMeta.og.type);
    this.setOGTag('site_name', this.baseMeta.og.site_name);
    this.setOGTag('locale', this.baseMeta.og.locale);
    this.setOGTag('url', window.location.href);

    // Twitter Card tags
    this.setTwitterTag('card', this.baseMeta.twitter.card);
    this.setTwitterTag('site', this.baseMeta.twitter.site);
    this.setTwitterTag('title', this.baseMeta.title);
    this.setTwitterTag('description', this.baseMeta.description);

    // Additional SEO tags
    this.setMetaTag('theme-color', '#d4af37');
    this.setMetaTag('msapplication-TileColor', '#d4af37');
  }

  // =========================
  // 📄 DYNAMIC PAGE SEO
  // =========================

  setupDynamicSEO() {
    // Listen for page navigation events
    window.addEventListener('popstate', () => {
      this.updateCanonicalURL();
    });

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.updateCanonicalURL();
    });

    // Observe title changes
    const titleObserver = new MutationObserver(() => {
      this.updateOGTitle();
      this.updateTwitterTitle();
    });

    titleObserver.observe(document.querySelector('title'), {
      childList: true,
      subtree: true
    });

    // Observe meta description changes
    const metaObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.name === 'description') {
          this.updateOGDescription();
          this.updateTwitterDescription();
        }
      });
    });

    const metaTags = document.querySelectorAll('meta[name]');
    metaTags.forEach(meta => {
      metaObserver.observe(meta, {
        attributes: true,
        attributeFilter: ['content']
      });
    });
  }

  updateCanonicalURL() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = window.location.href.split('#')[0];
    }
  }

  updateOGTitle() {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = document.title;
    }
  }

  updateTwitterTitle() {
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.content = document.title;
    }
  }

  updateOGDescription() {
    const description = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description && ogDescription) {
      ogDescription.content = description.content;
    }
  }

  updateTwitterDescription() {
    const description = document.querySelector('meta[name="description"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (description && twitterDescription) {
      twitterDescription.content = description.content;
    }
  }

  updatePageSEO(pageData) {
    const { title, description, keywords, image, url, type } = pageData;

    // Update title
    if (title) {
      document.title = title;
      this.setOGTag('title', title);
      this.setTwitterTag('title', title);
    }

    // Update description
    if (description) {
      this.setMetaTag('description', description);
      this.setOGTag('description', description);
      this.setTwitterTag('description', description);
    }

    // Update keywords
    if (keywords) {
      this.setMetaTag('keywords', keywords);
    }

    // Update image
    if (image) {
      this.setOGTag('image', image);
      this.setTwitterTag('image', image);
    }

    // Update URL
    if (url) {
      this.setOGTag('url', url);
    }

    // Update type
    if (type) {
      this.setOGTag('type', type);
    }

    console.log('📄 Page SEO updated:', { title, description });
  }

  // =========================
  // 📦 PRODUCT SEO
  // =========================

  updateProductSEO(product) {
    const title = `${product.name} - QianlunShop`;
    const description = `${product.description} Price: ${this.formatPrice(product.price)}. ${product.isNew ? 'New arrival!' : ''} ${product.isFeatured ? 'Featured product.' : ''}`;
    const keywords = `${product.name}, ${product.category}, ${product.brand}, luxury, ${product.tags.join(', ')}`;
    const image = product.images && product.images[0] ? this.getAbsoluteURL(product.images[0]) : null;
    const url = `${window.location.origin}${window.location.pathname}#product-${product.id}`;

    this.updatePageSEO({
      title,
      description,
      keywords,
      image,
      url,
      type: 'product'
    });

    // Add product structured data
    this.addProductStructuredData(product);
  }

  // =========================
  // 📊 STRUCTURED DATA (JSON-LD)
  // =========================

  addStructuredData(data) {
    this.removeExistingStructuredData();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);

    console.log('📊 Structured data added');
  }

  addProductStructuredData(product) {
    const productData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images.map(img => this.getAbsoluteURL(img)),
      brand: {
        '@type': 'Brand',
        name: product.brand
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'IDR',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        condition: 'https://schema.org/NewCondition'
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      } : undefined
    };

    // Remove undefined properties
    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });

    this.addStructuredData(productData);
  }

  addOrganizationStructuredData() {
    this.addStructuredData(this.structuredData);
  }

  addBreadcrumbStructuredData(breadcrumbs) {
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: this.getAbsoluteURL(crumb.url)
      }))
    };

    this.addStructuredData(breadcrumbData);
  }

  // =========================
  // 🔗 CANONICAL & ALTERNATE URLS
  // =========================

  addCanonicalURL() {
    this.removeExistingCanonical();

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = window.location.href.split('#')[0]; // Remove hash
    document.head.appendChild(canonical);
  }

  addAlternateLanguages() {
    // For multilingual sites - currently single language
    const alternate = document.createElement('link');
    alternate.rel = 'alternate';
    alternate.hreflang = 'id';
    alternate.href = window.location.href;
    document.head.appendChild(alternate);
  }

  // =========================
  // 🖼️ IMAGE OPTIMIZATION SEO
  // =========================

  optimizeImageSEO(img, alt, title = '') {
    if (!img) return;

    // Set alt text
    if (alt && !img.hasAttribute('alt')) {
      img.setAttribute('alt', alt);
    }

    // Set title for additional context
    if (title && !img.hasAttribute('title')) {
      img.setAttribute('title', title);
    }

    // Add loading optimization
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }

    // Add decoding for better performance
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  }

  // =========================
  // 📈 ANALYTICS & TRACKING
  // =========================

  trackPageView(pageData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        ...pageData
      });
    }

    // Custom tracking
    console.log('📈 Page view tracked:', {
      title: document.title,
      url: window.location.href,
      ...pageData
    });
  }

  trackProductView(product) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        currency: 'IDR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          brand: product.brand,
          price: product.price
        }]
      });
    }

    console.log('📈 Product view tracked:', product.name);
  }

  trackSearch(query, results) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        results_count: results
      });
    }

    console.log('📈 Search tracked:', query, `(${results} results)`);
  }

  // =========================
  // 🛠️ UTILITY METHODS
  // =========================

  setMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  setOGTag(property, content) {
    let meta = document.querySelector(`meta[property="og:${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', `og:${property}`);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  setTwitterTag(name, content) {
    let meta = document.querySelector(`meta[name="twitter:${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = `twitter:${name}`;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  getAbsoluteURL(relativeUrl) {
    if (relativeUrl.startsWith('http')) {
      return relativeUrl;
    }
    return `${window.location.origin}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
  }

  formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  removeExistingStructuredData() {
    const existing = document.querySelectorAll('script[type="application/ld+json"]');
    existing.forEach(script => script.remove());
  }

  removeExistingCanonical() {
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) existing.remove();
  }

  // =========================
  // 📊 SEO AUDIT
  // =========================

  runSEOAudit() {
    const audit = {
      title: {
        present: !!document.title,
        length: document.title.length,
        optimal: document.title.length >= 30 && document.title.length <= 60
      },
      description: {
        present: !!document.querySelector('meta[name="description"]'),
        length: document.querySelector('meta[name="description"]')?.content.length || 0,
        optimal: (document.querySelector('meta[name="description"]')?.content.length || 0) >= 120 &&
                 (document.querySelector('meta[name="description"]')?.content.length || 0) <= 160
      },
      keywords: {
        present: !!document.querySelector('meta[name="keywords"]')
      },
      ogTags: {
        title: !!document.querySelector('meta[property="og:title"]'),
        description: !!document.querySelector('meta[property="og:description"]'),
        image: !!document.querySelector('meta[property="og:image"]')
      },
      twitterTags: {
        card: !!document.querySelector('meta[name="twitter:card"]'),
        title: !!document.querySelector('meta[name="twitter:title"]'),
        description: !!document.querySelector('meta[name="twitter:description"]')
      },
      structuredData: {
        present: !!document.querySelector('script[type="application/ld+json"]')
      },
      canonical: {
        present: !!document.querySelector('link[rel="canonical"]')
      },
      images: {
        withAlt: document.querySelectorAll('img[alt]').length,
        total: document.querySelectorAll('img').length,
        ratio: document.querySelectorAll('img').length > 0 ?
               (document.querySelectorAll('img[alt]').length / document.querySelectorAll('img').length) : 0
      },
      headings: {
        h1: document.querySelectorAll('h1').length,
        h2: document.querySelectorAll('h2').length,
        h3: document.querySelectorAll('h3').length
      }
    };

    console.table(audit);
    return audit;
  }

  // =========================
  // 🧹 CLEANUP
  // =========================

  destroy() {
    this.removeExistingStructuredData();
    console.log('🔍 SEO Enhancer destroyed');
  }
}

// =========================
// 🌐 SINGLETON INSTANCE
// =========================

export const seoEnhancer = new SEOEnhancer();
export default SEOEnhancer;
