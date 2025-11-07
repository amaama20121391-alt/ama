self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open('ama-chat-cache').then(cache=>{
      return cache.addAll(['index.html','manifest.json','AMA-cloud.png']);
    })
  );
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
