const CACHE_NAME = 'wardrobe-app-v3';
const ASSETS = [
  '/index.html',
  '/manifest.json'
];

// 图片文件列表
const IMAGE_FILES = [
  '/images/w01.jpg','/images/w02.jpg','/images/w03.jpg','/images/w04.jpg','/images/w05.jpg',
  '/images/w06.jpg','/images/w07.jpg','/images/w08.jpg','/images/w09.jpg','/images/w10.jpg',
  '/images/w11.jpg','/images/w12.jpg','/images/w13.jpg','/images/w14.jpg','/images/w15.jpg',
  '/images/w16.jpg','/images/w17.jpg','/images/w18.jpg','/images/w19.jpg','/images/w20.jpg',
  '/images/m01.jpg','/images/m02.jpg','/images/m03.jpg','/images/m04.jpg','/images/m05.jpg',
  '/images/m06.jpg','/images/m07.jpg','/images/m08.jpg','/images/m09.jpg','/images/m10.jpg',
  '/images/m11.jpg','/images/m12.jpg','/images/m13.jpg','/images/m14.jpg','/images/m15.jpg',
  '/images/m16.jpg','/images/m17.jpg','/images/m18.jpg','/images/m19.jpg','/images/m20.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...ASSETS, ...IMAGE_FILES]);
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
