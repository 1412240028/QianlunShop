// =========================
// 🖼️ LAZY LOADER - Image Lazy Loading with Intersection Observer
// Performance optimization for images
// =========================

export class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px 0px',
      threshold: 0.1,
      placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
      errorImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=',
      fadeIn: true,
      fadeDuration: 300,
      ...options
    };

    this.observer = null;
    this.images = new Set();
    this.init();
  }

  // =========================
  // 🚀 INITIALIZE INTERSECTION OBSERVER
  // =========================

  init() {
    if (!('IntersectionObserver' in window)) {
      console.warn('⚠️ IntersectionObserver not supported, falling back to immediate loading');
      this.loadAllImages();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );

    console.log('✅ LazyLoader initialized');
  }

  // =========================
  // 👁️ HANDLE INTERSECTION
  // =========================

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
      }
    });
  }

  // =========================
  // 📸 LOAD SINGLE IMAGE
  // =========================

  async loadImage(imgElement) {
    if (!imgElement || imgElement.classList.contains('loaded')) {
      return;
    }

    const src = imgElement.dataset.src || imgElement.src;
    if (!src) return;

    try {
      // Preload image
      await this.preloadImage(src);

      // Set actual source
      imgElement.src = src;
      imgElement.classList.add('loaded');
      imgElement.classList.remove('loading');

      // Remove data-src to prevent re-processing
      delete imgElement.dataset.src;

      // Fade in effect
      if (this.options.fadeIn) {
        imgElement.style.opacity = '0';
        imgElement.style.transition = `opacity ${this.options.fadeDuration}ms ease-in-out`;

        requestAnimationFrame(() => {
          imgElement.style.opacity = '1';
        });
      }

      // Stop observing this image
      if (this.observer) {
        this.observer.unobserve(imgElement);
      }

      this.images.delete(imgElement);

    } catch (error) {
      console.error('❌ Failed to load image:', src, error);
      this.handleImageError(imgElement);
    }
  }

  // =========================
  // 🔄 PRELOAD IMAGE
  // =========================

  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));

      img.src = src;
    });
  }

  // =========================
  // ❌ HANDLE IMAGE ERROR
  // =========================

  handleImageError(imgElement) {
    const fallbackSrc = imgElement.dataset.fallback || this.options.errorImage;

    if (fallbackSrc && imgElement.src !== fallbackSrc) {
      imgElement.src = fallbackSrc;
      imgElement.classList.add('error');
      imgElement.classList.remove('loading');
    }

    // Remove from observation
    if (this.observer) {
      this.observer.unobserve(imgElement);
    }

    this.images.delete(imgElement);
  }

  // =========================
  // 📝 REGISTER IMAGES FOR LAZY LOADING
  // =========================

  observe(imgElement) {
    if (!imgElement) return;

    // Skip if already loaded or loading
    if (imgElement.classList.contains('loaded') || imgElement.classList.contains('loading')) {
      return;
    }

    // Set placeholder
    if (!imgElement.src || imgElement.src === imgElement.dataset.src) {
      imgElement.src = this.options.placeholder;
      imgElement.classList.add('loading');
    }

    // Add to observation set
    this.images.add(imgElement);

    // Start observing
    if (this.observer) {
      this.observer.observe(imgElement);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(imgElement);
    }
  }

  // =========================
  // 📦 OBSERVE MULTIPLE IMAGES
  // =========================

  observeAll(selector = 'img[data-src]') {
    const images = document.querySelectorAll(selector);

    images.forEach(img => {
      // Skip images that are already above the fold
      if (this.isAboveFold(img)) {
        this.loadImage(img);
      } else {
        this.observe(img);
      }
    });

    console.log(`👁️ Observing ${images.length} images for lazy loading`);
  }

  // =========================
  // 📍 CHECK IF IMAGE IS ABOVE THE FOLD
  // =========================

  isAboveFold(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Consider images in the upper half of viewport as above the fold
    return rect.top < windowHeight / 2;
  }

  // =========================
  // 🚀 LOAD ALL IMAGES IMMEDIATELY
  // =========================

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
    this.images.clear();
  }

  // =========================
  // 🔄 REFRESH OBSERVATION
  // =========================

  refresh() {
    // Re-observe images that might have been added dynamically
    this.observeAll();

    // Check for images that entered viewport while not observed
    this.images.forEach(img => {
      if (this.isAboveFold(img)) {
        this.loadImage(img);
      }
    });
  }

  // =========================
  // 📊 GET LOADING STATISTICS
  // =========================

  getStats() {
    const loaded = document.querySelectorAll('img.loaded').length;
    const loading = document.querySelectorAll('img.loading').length;
    const total = document.querySelectorAll('img[data-src]').length;

    return {
      total,
      loaded,
      loading,
      pending: this.images.size,
      failed: document.querySelectorAll('img.error').length
    };
  }

  // =========================
  // 🧹 CLEANUP
  // =========================

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.images.clear();
    console.log('🧹 LazyLoader disconnected');
  }
}

// =========================
// 🌐 SINGLETON INSTANCE
// =========================

export const lazyLoader = new LazyLoader();
export default LazyLoader;
