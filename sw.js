const CACHE_NAME = 'wardrobe-app-v22';
const ASSETS = [
  '/index.html',
  '/manifest.json'
];

// 图片文件列表（全新40件衣物）
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

// 模特模板图（20张：女装10 + 男装10）
const MODEL_FILES = [
  // 女装10种风格
  '/images/model_w_minimal.jpg','/images/model_w_commute.jpg','/images/model_w_romantic.jpg',
  '/images/model_w_sporty.jpg','/images/model_w_vintage.jpg','/images/model_w_korean.jpg',
  '/images/model_w_elegant.jpg','/images/model_w_street.jpg','/images/model_w_vacation.jpg',
  '/images/model_w_cozy.jpg',
  // 男装10种风格
  '/images/model_m_business.jpg','/images/model_m_casual.jpg','/images/model_m_athletic.jpg',
  '/images/model_m_workwear.jpg','/images/model_m_japanese.jpg','/images/model_m_urban.jpg',
  '/images/model_m_gentleman.jpg','/images/model_m_outdoor.jpg','/images/model_m_preppy.jpg',
  '/images/model_m_summer.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 优先缓存模特模板，确保快速首屏
      return cache.addAll([...ASSETS, ...MODEL_FILES]).then(() => {
        return cache.addAll(IMAGE_FILES);
      }).catch(() => {});
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
      return caches.match(event.request).then((response) => {
        return response || caches.match('/index.html');
      });
    })
  );
});
