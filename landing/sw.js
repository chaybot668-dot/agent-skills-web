/* Service worker: HTML/CSS/JS ưu tiên mạng (luôn nhận bản mới), ảnh dùng cache trước; có trang offline dự phòng.
   Khi đổi tệp tĩnh, tăng V để dọn cache cũ. */
const V = "lavient-v1";
const SHELL = ["./", "index.html", "style.css", "script.js", "offline.html", "manifest.webmanifest", "img/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put("index.html", cp)); return res; })
      .catch(() => caches.match("index.html").then(m => m || caches.match("offline.html"))));
    return;
  }
  const code = /\.(?:css|js|webmanifest)$/.test(new URL(r.url).pathname);
  if (code) {                                            // network-first: tránh phục vụ CSS/JS cũ
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match(r)));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })));
});
