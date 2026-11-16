/* نور الدين - service worker: يحفظ التطبيق ومكتباته للعمل بدون إنترنت.
   ملفات التطبيق تُعرض فورًا من الذاكرة وتتحدث في الخلفية، فالتعديل الجديد يظهر عند الفتح الثاني. */
const CACHE = 'nour-aldin-v1';
const LOCAL = ['./', 'index.html', 'manifest.json', 'pwa.js', 'azkar-extra.js', 'icon-192.png', 'icon-512.png'];
const CDN = [
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Amiri+Quran&family=Tajawal:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/adhan@4.4.3/lib/bundles/adhan.umd.min.js'
];
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(LOCAL.map((u) => cache.add(u)));
    await Promise.allSettled(CDN.map(async (u) => {
      const res = await fetch(new Request(u, { mode: 'no-cors' }));
      await cache.put(u, res);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // بيانات المصحف تُحفظ داخل التطبيق نفسه، لا نتدخل فيها
  if (url.hostname === 'api.quran.com') return;

  // ملفات التطبيق: من الذاكرة فورًا (مناسب للشبكة الضعيفة) مع تحديثها في الخلفية
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then((res) => {
        if (res && res.ok && !res.redirected) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      if (cached) { event.waitUntil(network); return cached; }
      const res = await network;
      if (res) return res;
      if (req.mode === 'navigate') {
        const fallback = await cache.match('index.html');
        if (fallback) return fallback;
      }
      return Response.error();
    })());
    return;
  }

  // الخطوط والأيقونات والمكتبات: النسخة المحفوظة أولاً
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    })());
  }
});
