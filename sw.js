const CACHE_NAME = 'box-images-cache-v1';
const ASSETS_CACHE = 'assets-cache-v1';

// Cache öncelik sırası
const CACHE_PRIORITIES = [
  CACHE_NAME,
  ASSETS_CACHE
];

// Cache'lenecek asset'ler
const urlsToCache = [
  '/assets/boxes/',
  '/assets/ticket.png',
  '/assets/giftbox.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME),
      caches.open(ASSETS_CACHE).then(cache => cache.addAll(urlsToCache))
    ])
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => !CACHE_PRIORITIES.includes(cacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Sadece GET isteklerini cache'le
  if (event.request.method !== 'GET') return;

  // Resim istekleri için özel strateji
  if (event.request.url.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            // Arka planda cache'i güncelle
            fetch(event.request)
              .then(freshResponse => {
                if (freshResponse && freshResponse.status === 200) {
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, freshResponse));
                }
              });
            return response;
          }

          // Cache miss - fetch and cache
          return fetch(event.request).then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
        })
        .catch(() => {
          // Offline fallback
          return caches.match('/assets/placeholder.png');
        })
    );
  }
}); 