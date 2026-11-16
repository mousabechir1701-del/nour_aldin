/* تعديل يدوي لمواقيت الصلاة (بالدقائق) لكل صلاة، يُحفظ على جهازك.
   يعمل فوق الملف الرئيسي دون تغيير index.html سوى إضافة سطر تحميل هذا الملف. */
(function () {
  if (typeof app === 'undefined' || typeof store === 'undefined') return;

  var KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
  var NAMES = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
  var LS = 'nd_prayer_adj';
  var MAX = 180;

  function clamp(n) { n = parseInt(n, 10); return isFinite(n) ? Math.max(-MAX, Math.min(MAX, n)) : 0; }

  function load() {
    var o = {};
    try { o = JSON.parse(store.get(LS) || '{}') || {}; } catch (e) {}
    var r = {};
    KEYS.forEach(function (k) { r[k] = clamp(o[k]); });
    return r;
  }

  var adj = load();
  var last = null;

  function hasAdj() { return KEYS.some(function (k) { return adj[k] !== 0; }); }

  // نجعل مكتبة المواقيت تطبّق التعديل عند كل حساب
  function patchAdhan() {
    var A = window.adhan;
    if (!A || !A.CalculationMethod || A.CalculationMethod.__ndPatched) return;
    try {
      var orig = A.CalculationMethod.MuslimWorldLeague;
      A.CalculationMethod.MuslimWorldLeague = function () {
        var p = orig.apply(this, arguments);
        p.adjustments = p.adjustments || {};
        KEYS.forEach(function (k) { p.adjustments[k] = adj[k]; });
        return p;
      };
      A.CalculationMethod.__ndPatched = true;
    } catch (e) {}
  }

  var origLoc = app.onLocationSuccess.bind(app);
  app.onLocationSuccess = function (lat, lng) {
    last = { lat: lat, lng: lng };
    patchAdhan();
    origLoc(lat, lng);
    var info = document.getElementById('methodInfo');
    if (info && hasAdj() && info.textContent.indexOf('طريقة الحساب') === 0) {
      info.textContent += ' | تعديل يدوي مفعّل';
    }
  };

  // بطاقة التعديل
  var anchor = document.getElementById('methodInfo');
  var prayerCard = anchor && anchor.closest ? anchor.closest('.card') : null;
  if (!prayerCard) return;

  var card = document.createElement('div');
  card.className = 'card';
  var rows = KEYS.map(function (k) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">' +
      '<span style="min-width:60px">' + NAMES[k] + '</span>' +
      '<span style="display:flex;align-items:center;gap:6px">' +
      '<button class="btn-sm" data-pa="dec:' + k + '" aria-label="إنقاص دقيقة">−</button>' +
      '<input type="number" step="1" min="-' + MAX + '" max="' + MAX + '" data-k="' + k + '" value="0" aria-label="دقائق ' + NAMES[k] + '" ' +
      'style="width:70px;padding:7px;text-align:center;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-primary);color:var(--text-main);font-family:var(--font-ui)">' +
      '<button class="btn-sm" data-pa="inc:' + k + '" aria-label="زيادة دقيقة">+</button>' +
      '<span class="note">دقيقة</span></span></div>';
  }).join('');
  card.innerHTML =
    '<div class="card-title"><i class="fa-solid fa-sliders"></i> تعديل المواقيت يدويًا</div>' +
    '<div class="note" style="margin-bottom:.75rem">أضف أو اطرح دقائق لكل صلاة لتطابق مسجدك أو التقويم المعتمد عندك. يُحفظ التعديل على جهازك.</div>' +
    rows +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:.5rem">' +
    '<button class="btn-sm" data-pa="all:-60">اطرح ساعة من الكل</button>' +
    '<button class="btn-sm" data-pa="all:60">أضف ساعة للكل</button>' +
    '<button class="btn-sm btn-danger" data-pa="reset">تصفير</button></div>';
  prayerCard.insertAdjacentElement('afterend', card);

  function paint() {
    KEYS.forEach(function (k) {
      var i = card.querySelector('input[data-k="' + k + '"]');
      if (i) i.value = adj[k];
    });
  }

  function apply() {
    store.set(LS, JSON.stringify(adj));
    paint();
    if (last) app.onLocationSuccess(last.lat, last.lng);
    else app.showToast('تم حفظ التعديل، اضغط «تحديد الموقع» لتطبيقه');
  }

  card.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pa]');
    if (!b) return;
    var a = b.dataset.pa.split(':');
    if (a[0] === 'inc' || a[0] === 'dec') adj[a[1]] = clamp(adj[a[1]] + (a[0] === 'inc' ? 1 : -1));
    else if (a[0] === 'all') KEYS.forEach(function (k) { adj[k] = clamp(adj[k] + parseInt(a[1], 10)); });
    else if (a[0] === 'reset') KEYS.forEach(function (k) { adj[k] = 0; });
    apply();
  });

  card.addEventListener('change', function (e) {
    var i = e.target;
    if (i && i.dataset && i.dataset.k) { adj[i.dataset.k] = clamp(i.value); apply(); }
  });

  paint();
})();
