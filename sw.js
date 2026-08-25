const CACHE_NAME = "tit-sih-2026-v2.1.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./committee.html",
  "./xtyle.css",
  "./script.js",
  "./manifest.json",
  "./tit_logo.png"
];

// Install Event: Precaches core shell assets & immediately activates
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch((err) => console.warn("[PWA SW] Pre-cache warning:", err))
  );
});

// Activate Event: Cleans up obsolete cache versions and claims clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[PWA SW] Removing outdated cache:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First for HTML/Navigation, Stale-While-Revalidate for static assets
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("firestore.googleapis.com") ||
    event.request.url.includes("google-analytics.com") ||
    event.request.url.includes("identitytoolkit.googleapis.com") ||
    event.request.url.includes("docs.google.com")
  ) {
    return;
  }

  // Network-First for HTML documents to always show newest updates instantly
  if (event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request) || caches.match("./index.html"))
    );
    return;
  }

  // Stale-While-Revalidate for other static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
