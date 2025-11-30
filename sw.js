// =========================
// 🔧 SERVICE WORKER - QIANLUNSHOP PWA
// Offline support & caching strategy
// =========================

const CACHE_VERSION = 'qianlunshop-v1';
const STATIC_CACHE = 'qianlun-static-v1';
const DYNAMIC_CACHE = 'qianlun-dynamic-v1';
const IMAGE_CACHE = 'qianlun-images-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pages/products.html',
  '/pages/cart.html',
  '/pages/about.html',
  '/pages/contact.html',
  '/css/style.css',
  '/js/script-final.js',
  '/js/cart.js',
  '/js/config.js',
  '/assets/images/icons/QianLun Alphabet.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600&display=swap'
];

// =========================
// 📥 INSTALL EVENT - Cache static assets
// =========================
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(error => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// =========================
// 🔄 ACTIVATE EVENT - Clean old caches
// =========================
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cache => {
              return cache !== STATIC_CACHE && 
                     cache !== DYNAMIC_CACHE && 
                     cache !== IMAGE_CACHE;
            })
            .map(cache => {
              console.log('🗑️ Service Worker: Deleting old cache:', cache);
              return caches.delete(cache);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// =========================
// 🌐 FETCH EVENT - Cache strategies
// =========================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // =========================
  // 🖼️ IMAGE CACHING STRATEGY
  // Cache First for images
  // =========================
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(IMAGE_CACHE)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }

              return fetch(request)
                .then(networkResponse => {
                  // Clone response to cache and return
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                })
                .catch(() => {
                  // Return placeholder image if offline
                  return new Response(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image Offline</text></svg>',
                    { headers: { 'Content-Type': 'image/svg+xml' } }
                  );
                });
            });
        })
    );
    return;
  }

  // =========================
  // 📄 STATIC ASSETS STRATEGY
  // Cache First for HTML, CSS, JS
  // =========================
  if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.match(/\.(html|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Return cached version and update in background
            fetchAndCache(request, STATIC_CACHE);
            return cachedResponse;
          }

          return fetch(request)
            .then(networkResponse => {
              return caches.open(STATIC_CACHE)
                .then(cache => {
                  cache.put(request, networkResponse.clone());
                  return networkResponse;
                });
            })
            .catch(() => {
              // Return offline page for HTML requests
              if (request.destination === 'document') {
                return caches.match('/offline.html');
              }
            });
        })
    );
    return;
  }

  // =========================
  // 🌐 API/DYNAMIC CONTENT STRATEGY
  // Network First with cache fallback
  // =========================
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        return caches.open(DYNAMIC_CACHE)
          .then(cache => {
            // Cache successful responses
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(request);
      })
  );
});

// =========================
// 🔔 PUSH NOTIFICATION (Optional)
// =========================
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/images/icons/QianLun Alphabet.png',
    badge: '/assets/images/badge.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/assets/icons/check.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('QianlunShop', options)
  );
});

// =========================
// 🔔 NOTIFICATION CLICK HANDLER
// =========================
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// =========================
// 🔄 BACKGROUND SYNC (Optional)
// =========================
self.addEventListener('sync', event => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// =========================
// 🛠️ HELPER FUNCTIONS
// =========================

/**
 * Fetch and cache in background
 */
function fetchAndCache(request, cacheName) {
  return fetch(request)
    .then(response => {
      return caches.open(cacheName)
        .then(cache => {
          cache.put(request, response.clone());
          return response;
        });
    })
    .catch(() => {
      // Silently fail background update
    });
}

/**
 * Sync orders when back online
 */
function syncOrders() {
  return new Promise((resolve, reject) => {
    // Implement your order sync logic here
    console.log('📤 Syncing orders...');
    
    // Example: Send pending orders to server
    const pendingOrders = []; // Load from IndexedDB
    
    if (pendingOrders.length === 0) {
      resolve();
      return;
    }

    Promise.all(
      pendingOrders.map(order => {
        return fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
      })
    )
    .then(() => {
      console.log('✅ Orders synced successfully');
      resolve();
    })
    .catch(error => {
      console.error('❌ Order sync failed:', error);
      reject(error);
    });
  });
}

// =========================
// 📊 MESSAGE HANDLER
// =========================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cache => caches.delete(cache))
          );
        })
        .then(() => {
          console.log('✅ All caches cleared');
        })
    );
  }
});

console.log('✅ Service Worker: Loaded successfully');