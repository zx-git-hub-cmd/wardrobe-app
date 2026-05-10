const CACHE_NAME = 'wardrobe-app-v11';
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

// 缩略图文件列表（优先缓存，用于快速加载）
const THUMB_FILES = [
  '/images/thumbs/w01.jpg','/images/thumbs/w02.jpg','/images/thumbs/w03.jpg','/images/thumbs/w04.jpg','/images/thumbs/w05.jpg',
  '/images/thumbs/w06.jpg','/images/thumbs/w07.jpg','/images/thumbs/w08.jpg','/images/thumbs/w09.jpg','/images/thumbs/w10.jpg',
  '/images/thumbs/w11.jpg','/images/thumbs/w12.jpg','/images/thumbs/w13.jpg','/images/thumbs/w14.jpg','/images/thumbs/w15.jpg',
  '/images/thumbs/w16.jpg','/images/thumbs/w17.jpg','/images/thumbs/w18.jpg','/images/thumbs/w19.jpg','/images/thumbs/w20.jpg',
  '/images/thumbs/m01.jpg','/images/thumbs/m02.jpg','/images/thumbs/m03.jpg','/images/thumbs/m04.jpg','/images/thumbs/m05.jpg',
  '/images/thumbs/m06.jpg','/images/thumbs/m07.jpg','/images/thumbs/m08.jpg','/images/thumbs/m09.jpg','/images/thumbs/m10.jpg',
  '/images/thumbs/m11.jpg','/images/thumbs/m12.jpg','/images/thumbs/m13.jpg','/images/thumbs/m14.jpg','/images/thumbs/m15.jpg',
  '/images/thumbs/m16.jpg','/images/thumbs/m17.jpg','/images/thumbs/m18.jpg','/images/thumbs/m19.jpg','/images/thumbs/m20.jpg',
];

// 模特模板图（风格化穿搭展示）
const MODEL_FILES = [
  // 女装
  '/images/model_w_casual.jpg','/images/model_w_business.jpg','/images/model_w_sport.jpg',
  '/images/model_w_retro.jpg','/images/model_w_french.jpg','/images/model_w_japanese.jpg',
  '/images/model_w_korean.jpg','/images/model_w_street.jpg','/images/model_w_romantic.jpg',
  '/images/model_w_resort.jpg',
  // 男装
  '/images/model_m_casual.jpg','/images/model_m_business.jpg','/images/model_m_sport.jpg',
  '/images/model_m_workwear.jpg','/images/model_m_denim.jpg','/images/model_m_classic.jpg',
  '/images/model_m_preppy.jpg','/images/model_m_japanese.jpg','/images/model_m_street.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 优先缓存缩略图和模特模板，确保快速首屏
      return cache.addAll([...ASSETS, ...THUMB_FILES, ...MODEL_FILES]).then(() => {
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
