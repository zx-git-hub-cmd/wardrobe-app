const CACHE_NAME = 'wardrobe-app-v2';
const ASSETS = [
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 网络优先策略：优先从网络获取最新内容
  event.respondWith(
    fetch(event.request).then((fetchResponse) => {
      if (fetchResponse.status === 200) {
        const responseClone = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
      }
      return fetchResponse;
    }).catch(() => {
      // 网络不可用时，回退到缓存
      return caches.match(event.request).then((response) => {
        return response || caches.match('/index.html');
      });
    })
  );
});
