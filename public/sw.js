const cacheName = "watertube";
const precacheResources = ["/"];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(precacheResources);
    })
  );
});
self.addEventListener("activate", event => {
});
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});