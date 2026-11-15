/* MASK.GPSLOGGER: 画面の部品を端末に保存して、圏外でも開けるようにする */
const CACHE = "mask-gpslogger-v4";
const SHELL = ["./", "index.html", "manifest.webmanifest", "vendor/leaflet.js", "vendor/leaflet.css", "vendor/capacitor.js", "vendor/jszip.min.js",
  "vendor/images/layers.png", "vendor/images/layers-2x.png", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if(e.request.method !== "GET" || u.origin !== self.location.origin) return;   // 地図や天気はそのまま通信する
  e.respondWith(
    fetch(e.request).then(r => { if(r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("index.html")))
  );
});
