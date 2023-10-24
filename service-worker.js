self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pong-game-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/manifest.json',
        '/icon.png',
        '/hitPaddle.mp3',
        '/hitWall.mp3',
        '/scorePoint.mp3'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
