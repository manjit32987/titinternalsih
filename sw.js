const CACHE_NAME = "tit-sih-2026-v1.0.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./committee.html",
  "./xtyle.css",
  "./script.js",
  "./manifest.json",
  "./tit_logo.png",
  "./principal-patron.jpg",
  "./ANUP.jpeg",
  "./PURBA.jpeg",
  "./Sania.jpeg",
  "./aaniketh.jpeg",
  "./arijit.jpeg",
  "./arindam.jpg",
  "./manjit.png",
  "./nikita.jpeg",
  "./SIH2026-IDEA-Presentation-Format.pptx"
];

// Install Event: Precaches core shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[PWA SW] Pre-caching core portal assets");
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[PWA SW] Pre-cache warning:", err))
  );
});

// Activate Event: Cleans up obsolete cache versions
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

// Fetch Event: Stale-While-Revalidate with offline fallback
self.addEventListener("fetch", (event) => {
  // Bypass Firestore, external analytics, and non-GET requests from service worker caching
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("firestore.googleapis.com") ||
    event.request.url.includes("google-analytics.com") ||
    event.request.url.includes("identitytoolkit.googleapis.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available, while fetching update in the background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is for an HTML page, return index.html fallback
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
