/* إضافتان: (1) تبويبان جديدان في الأذكار: بعد الصلاة + الاستيقاظ
            (2) عدّاد منفصل لكل ذكر في المسبحة.
   يُحمَّل بعد azkar-extra.js ولا يغيّر شيئًا في index.html غير سطر التحميل. */
(function () {
  if (typeof AZKAR_DATA === 'undefined' || typeof app === 'undefined' || typeof store === 'undefined') return;

  /* ========== 1) أذكار جديدة ========== */
  var MORE = [
    /* --- بعد الصلاة --- */
    { id: 'ap_istighfar', category: ['afterprayer'], count: 3, source: 'صحيح مسلم',
      text: 'أَسْتَغْفِرُ اللَّهَ' },
    { id: 'ap_salam', category: ['afterprayer'], count: 1, source: 'صحيح مسلم',
      text: 'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ' },
    { id: 'ap_manee', category: ['afterprayer'], count: 1, source: 'صحيح البخاري ومسلم',
      text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ' },
    { id: 'ap_hawl', category: ['afterprayer'], count: 1, source: 'صحيح مسلم',
      text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ' },
    { id: 'ap_t33', category: ['afterprayer'], count: 33, source: 'صحيح مسلم (التسبيح بعد كل صلاة)',
      text: 'سُبْحَانَ اللَّهِ' },
    { id: 'ap_h33', category: ['afterprayer'], count: 33, source: 'صحيح مسلم (التحميد بعد كل صلاة)',
      text: 'الْحَمْدُ لِلَّهِ' },
    { id: 'ap_k33', category: ['afterprayer'], count: 33, source: 'صحيح مسلم (التكبير بعد كل صلاة)',
      text: 'اللَّهُ أَكْبَرُ' },
    { id: 'ap_100', category: ['afterprayer'], count: 1, source: 'صحيح مسلم (تمام المائة)',
      text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ' },
    { id: 'ap_kursi', category: ['afterprayer'], count: 1, title: 'آية الكرسي',
      refs: [{ s: 2, a: 255, l: 'آية الكرسي' }], source: 'النسائي في الكبرى (وصححه الألباني)' },
    { id: 'ap_muawwidhat', category: ['afterprayer'], count: 1, title: 'سور الإخلاص والفلق والناس',
      refs: [{ s: 112, a: 1, l: 'الإخلاص' }, { s: 113, a: 1, l: 'الفلق' }, { s: 114, a: 1, l: 'الناس' }],
      source: 'أبو داود والترمذي والنسائي' },
    { id: 'ap_ainni', category: ['afterprayer'], count: 1, source: 'أبو داود والنسائي (وصححه الألباني)',
      text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ' },
    { id: 'ap_tahlil10', category: ['afterprayer'], count: 10, source: 'الترمذي وأحمد (بعد صلاتي الفجر والمغرب)',
      text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ' },

    /* --- الاستيقاظ --- */
    { id: 'wk_ahyana', category: ['wake'], count: 1, source: 'صحيح البخاري',
      text: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ' },
    { id: 'wk_afani', category: ['wake'], count: 1, source: 'الترمذي (وحسّنه الألباني)',
      text: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ' },
    { id: 'wk_tahlil', category: ['wake'], count: 1, source: 'صحيح البخاري (عند الاستيقاظ من الليل)',
      text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، الْحَمْدُ لِلَّهِ، وَسُبْحَانَ اللَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، اللَّهُمَّ اغْفِرْ لِي' },
    { id: 'wk_qahhar', category: ['wake'], count: 1, source: 'النسائي في الكبرى والحاكم (عند التقلّب من الليل)',
      text: 'لَا إِلَهَ إِلَّا اللَّهُ الْوَاحِدُ الْقَهَّارُ، رَبُّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا الْعَزِيزُ الْغَفَّارُ' },
    { id: 'wk_ten', category: ['wake'], count: 1, title: 'الآيات العشر الأواخر من سورة آل عمران',
      refs: [{ s: 3, a: 190, l: 'الآيات 190–200 من آل عمران' }],
      source: 'صحيح البخاري ومسلم (قرأها النبي ﷺ عند قيامه من الليل)' }
  ];

  var have = {};
  AZKAR_DATA.forEach(function (a) { have[a.id] = true; });
  MORE.forEach(function (z) { if (!have[z.id]) AZKAR_DATA.push(z); });

  var tabs = document.querySelector('.azkar-tabs');
  if (tabs) {
    [['afterprayer', 'أذكار بعد الصلاة'], ['wake', 'أذكار الاستيقاظ']].forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'azkar-tab-btn';
      b.textContent = t[1];
      b.onclick = function () { app.filterAzkar(t[0], b); };
      tabs.appendChild(b);
    });
  }

  /* ========== 2) عدّاد منفصل لكل ذكر في المسبحة ========== */
  var KEY = 'nd_misbaha_counts';
  var sel = document.getElementById('misbahaZekrSelect');
  var disp = document.getElementById('misbahaCount');

  if (sel && disp) {
    var counts = store.getJSON(KEY, function (o) { return o && typeof o === 'object' && !Array.isArray(o); }, null);
    if (counts === null) {
      counts = {};
      var old = store.getInt('nd_misbaha', 0, 1e9, 0);   // نقل العدّاد القديم إلى الذكر المختار حاليًا
      if (old > 0) counts[sel.value] = old;
    }
    Object.keys(counts).forEach(function (k) {
      var n = parseInt(counts[k], 10);
      if (!isFinite(n) || n < 0) delete counts[k]; else counts[k] = n;
    });

    var save = function () { store.set(KEY, JSON.stringify(counts)); };
    var cur = function () { return sel.value; };

    var summary = document.createElement('div');
    summary.className = 'note';
    summary.style.marginTop = '1rem';
    var box = document.querySelector('.misbaha-container');
    if (box) box.appendChild(summary);

    var paintSummary = function () {
      var parts = [];
      Array.prototype.forEach.call(sel.options, function (o) {
        var n = counts[o.value] || 0;
        if (n > 0) parts.push(o.value + ': ' + n.toLocaleString('ar-EG'));
      });
      summary.textContent = parts.length ? 'عدّاد كل ذكر: ' + parts.join(' • ') : '';
    };

    app.updateMisbahaUI = function () {
      var n = counts[cur()] || 0;
      this.misbahaCount = n;
      disp.textContent = n.toLocaleString('ar-EG');
      paintSummary();
    };

    app.incrementMisbaha = function () {
      this.playSound();
      counts[cur()] = (counts[cur()] || 0) + 1;
      save();
      this.updateMisbahaUI();
    };

    app.resetMisbaha = function () {
      var n = counts[cur()] || 0;
      if (n > 0 && !confirm('هل تريد إعادة تعيين عدّاد «' + cur() + '» إلى الصفر؟')) return;
      counts[cur()] = 0;
      save();
      this.updateMisbahaUI();
      this.showToast('تمت إعادة تعيين عدّاد هذا الذكر');
    };

    sel.addEventListener('change', function () { app.updateMisbahaUI(); });
    app.updateMisbahaUI();
  }

  app.renderAzkar(app.currentAzkarCat);
})();
