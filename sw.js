// Bump CACHE when you update index.html. Online, the newest files are always fetched first; the saved copy is only for offline use.
const CACHE = 'laf-v18';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(new Request(e.request.url, {cache: 'no-cache', credentials: 'same-origin'}))
      .then(r => { if (r.ok && r.type === 'basic') { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
