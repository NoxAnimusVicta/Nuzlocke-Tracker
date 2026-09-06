/* Nuzlocke Gauntlet - offline shell.
   The page is network-first so edits you push show up on the next launch;
   everything else is cache-first. Bump CACHE to force a clean slate. */
const CACHE = "gauntlet-v1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest",
                "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png",
                "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const isPage = req.mode === "navigate" || /\/(index\.html)?$/.test(new URL(req.url).pathname);
  if (isPage) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(CACHE);
        c.put("./index.html", fresh.clone()).catch(() => {});
        return fresh;
      } catch (err) {
        return (await caches.match("./index.html")) ||
               (await caches.match(req)) ||
               new Response("Offline", {status: 503});
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, {ignoreSearch: true});
    if (hit) return hit;
    const res = await fetch(req);
    const c = await caches.open(CACHE);
    c.put(req, res.clone()).catch(() => {});
    return res;
  })());
});
