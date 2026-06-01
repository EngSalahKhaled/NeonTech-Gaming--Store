const CACHE_NAME = 'neontech-cache-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'css/main.css',
  'main.js',
  'products.json',
  'images/social-preview.png'
];

// Install Service Worker and pre-cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing stale cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch events: Cache first with Network fallback strategy
self.addEventListener('fetch', (event) => {
  // Only handle local/GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Serve cached version instantly, then fetch fresh copy in background (stale-while-revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch((err) => console.log('[Service Worker] Background fetch failed (offline)'));
          return cachedResponse;
        }

        // Cache miss: fetch from network, then cache the result
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // If offline and request is an HTML page, we can return index.html
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('index.html');
          }
        });
      })
  );
});
