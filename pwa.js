/* يضيف خصائص التثبيت كتطبيق ويسجّل الـ service worker */
(function () {
  var h = document.head;
  function add(tag, attrs) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    h.appendChild(e);
  }
  if (!document.querySelector('link[rel="manifest"]')) add('link', { rel: 'manifest', href: 'manifest.json' });
  add('link', { rel: 'apple-touch-icon', href: 'icon-192.png' });
  add('meta', { name: 'mobile-web-app-capable', content: 'yes' });
  add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
  add('meta', { name: 'apple-mobile-web-app-title', content: 'نور الدين' });
  add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
