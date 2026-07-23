/* Dashboard : « Ajouter un effort / un résultat » (mesure d'un KPI de jalon).
   Ouvre l'effort-modal (scheduler QUAND + quantité + note), paramétré selon le KPI cliqué,
   persiste la mesure dans carryit_v1_jalons[].kpis[].measures, recalcule la valeur du KPI
   (effort = cumulatif, résultat = dernière valeur : porté du legacy dashboard.html), rafraîchit.
   Modèle mesure : { id, date, value, time, duration, note }. Rien inventé. */
(function () {
  'use strict';

  var JALONS_KEY = 'carryit_v1_jalons';

  function readJSON(k) {
    try {
      var r = localStorage.getItem(k);
      if (r == null || r === '') return null;
      var v = JSON.parse(r), guard = 0;
      while (typeof v === 'string' && guard++ < 3) { try { v = JSON.parse(v); } catch (e) { break; } }
      return v;
    } catch (e) { return null; }
  }
  function $(s) { return document.querySelector(s); }
  function toISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function comparable(m) {
    var d = /^\d{4}-\d{2}-\d{2}/.test(m.date || '') ? String(m.date).slice(0, 10)
      : (/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(m.date || '') || []).slice(1).reverse().join('-') || '';
    return d + 'T' + (m.time || '00:00');
  }

  // Recalcule la valeur du KPI depuis ses mesures (porté de normalizeKpiMeasures du legacy).
  function recompute(kpi, kpiType) {
    var mode = (kpi.modeMesure === 'incremental' || kpi.modeMesure === 'absolute')
      ? kpi.modeMesure : (kpiType === 'leading' ? 'incremental' : 'absolute');
    var sorted = (kpi.measures || []).slice().sort(function (a, b) {
      var ca = comparable(a), cb = comparable(b);
      return ca < cb ? -1 : ca > cb ? 1 : 0;
    });
    var run = 0;
    sorted.forEach(function (m) {
      var v = Number(m.value); v = isFinite(v) ? v : 0;
      if (mode === 'incremental') { run += v; m.delta = v; m.total = run; }
      else { m.delta = v; m.total = v; run = v; }
      m.value = v;
    });
    kpi.measures = sorted;
    kpi.modeMesure = mode;
    kpi.valeur = sorted.length ? sorted[sorted.length - 1].total : null;
    kpi.value = kpi.valeur;
  }

  // Écrit dans le KPI ciblé : mutate reçoit le tableau de mesures, recompute + persiste ensuite.
  function writeMeasures(jalonId, kpiType, mutate) {
    var jalons = readJSON(JALONS_KEY);
    if (!Array.isArray(jalons)) return false;
    var jalon = jalons.find(function (j) { return String(j.id) === String(jalonId); });
    if (!jalon || !Array.isArray(jalon.kpis)) return false;
    var kpi = jalon.kpis.find(function (k) { return (k && k.type) === kpiType; });
    if (!kpi) return false;
    if (!Array.isArray(kpi.measures)) kpi.measures = [];
    if (mutate(kpi.measures) === false) return false;
    recompute(kpi, kpiType);
    try { localStorage.setItem(JALONS_KEY, JSON.stringify(jalons)); } catch (e) { return false; }
    return true;
  }

  function saveMeasure(jalonId, kpiType, measure) {
    return writeMeasures(jalonId, kpiType, function (list) { list.push(measure); });
  }

  // Édition d'une mesure existante : on écrase les champs saisis, on garde l'id et le reste.
  function updateMeasure(jalonId, kpiType, measureId, fields) {
    return writeMeasures(jalonId, kpiType, function (list) {
      var m = list.find(function (x) { return x && String(x.id) === String(measureId); });
      if (!m) return false;
      Object.keys(fields).forEach(function (k) { m[k] = fields[k]; });
    });
  }

  function deleteMeasure(jalonId, kpiType, measureId) {
    return writeMeasures(jalonId, kpiType, function (list) {
      var i = list.findIndex(function (x) { return x && String(x.id) === String(measureId); });
      if (i < 0) return false;
      list.splice(i, 1);
    });
  }

  // Mesure brute (localStorage) : la couche data normalise, l'édition a besoin de l'original.
  function rawMeasure(jalonId, kpiType, measureId) {
    var jalons = readJSON(JALONS_KEY);
    if (!Array.isArray(jalons)) return null;
    var jalon = jalons.find(function (j) { return String(j.id) === String(jalonId); });
    var kpi = jalon && Array.isArray(jalon.kpis)
      ? jalon.kpis.find(function (k) { return (k && k.type) === kpiType; }) : null;
    if (!kpi || !Array.isArray(kpi.measures)) return null;
    return kpi.measures.find(function (m) { return m && String(m.id) === String(measureId); }) || null;
  }

  // "14:30" → 14.5 ; "1h30" / "45min" / "2h" → heures décimales. Null si illisible :
  // le scheduler garde alors sa position par défaut plutôt que d'inventer un horaire.
  function parseHour(s) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(String(s || ''));
    return m ? Number(m[1]) + Number(m[2]) / 60 : null;
  }
  function parseDuration(s) {
    var t = String(s || '').trim();
    var min = /^(\d+)\s*min$/.exec(t);
    if (min) return Number(min[1]) / 60;
    var hm = /^(\d+)h(\d{2})$/.exec(t);
    if (hm) return Number(hm[1]) + Number(hm[2]) / 60;
    var h = /^(\d+)h$/.exec(t);
    return h ? Number(h[1]) : null;
  }

  // KPI normalisé (label/unit/value) depuis la couche data, pour paramétrer le modal.
  function findKpi(jalonId, kpiType) {
    var d = window.CarryITDashboardData || {};
    var jalon = (d.jalons || []).find(function (j) { return String(j.id) === String(jalonId); });
    if (!jalon) return null;
    return (jalon.kpis || []).find(function (k) { return k.type === kpiType; }) || null;
  }

  function initEffort() {
    var modal = $('[data-effort-modal]');
    if (!modal) return;
    var titleEl = $('#effort-title'), subEl = $('[data-effort-subtitle]'), ctxEl = $('[data-effort-context]'),
        qtyLabel = $('[data-effort-qty-label]'), blockEyebrow = $('[data-effort-block-eyebrow]'),
        qtyEl = $('#effortQty'), noteEl = $('#effortNote'), msgEl = $('[data-effort-msg]'),
        delBtn = $('[data-effort-delete]');
    var target = null;   // { jalonId, kpiType, measureId } — measureId non nul = édition
    // Ouvert depuis le modal « Modifier le KPI » : on y revient en sortant (bascule, pas empilement).
    var returnToKpi = null;

    function close() {
      modal.hidden = true;
      target = null;
      var back = returnToKpi;
      returnToKpi = null;
      if (back && window.CarryITOpenKpiModal) window.CarryITOpenKpiModal(back.jalonId, back.kpiType);
    }

    function open(jalonId, kpiType, measureId) {
      var kpi = findKpi(jalonId, kpiType);
      var isEffort = kpiType === 'leading';
      var unit = (kpi && (kpi.unit || kpi.unitShort)) || '';
      var editing = measureId ? rawMeasure(jalonId, kpiType, measureId) : null;
      target = { jalonId: jalonId, kpiType: kpiType, measureId: editing ? measureId : null };

      if (titleEl) titleEl.textContent = editing ? 'Modifier la mesure'
        : (isEffort ? 'Ajouter un effort' : 'Ajouter un résultat');
      // Sous-titre : cadrage (secondary) + nom du KPI (dynamique → blanc pour ressortir).
      if (subEl) {
        subEl.textContent = (isEffort ? 'Note ce que tu as fait pour ' : 'Nouvelle valeur pour ');
        var nameSpan = document.createElement('span');
        nameSpan.className = 'ds-effort-dynamic';
        nameSpan.textContent = (kpi && kpi.label) ? kpi.label : 'ce KPI';
        subEl.appendChild(nameSpan);
        subEl.appendChild(document.createTextNode('.'));
      }
      if (ctxEl) {
        var hasVal = kpi && kpi.value != null;
        ctxEl.textContent = hasVal ? ('Déjà fait : ' + kpi.value + (unit ? ' ' + unit : '')) : '';
        ctxEl.hidden = !hasVal;
      }
      // Label : « Quantité » (secondary) + unité (dynamique → blanc).
      if (qtyLabel) {
        qtyLabel.textContent = 'Quantité ';
        if (unit) {
          var unitSpan = document.createElement('span');
          unitSpan.className = 'ds-effort-dynamic';
          unitSpan.textContent = '(' + unit + ')';
          qtyLabel.appendChild(unitSpan);
        }
      }
      if (blockEyebrow) blockEyebrow.textContent = isEffort ? 'Effort' : 'Résultat';
      if (msgEl) msgEl.hidden = true;
      // Supprimer n'a de sens que sur une mesure déjà enregistrée.
      if (delBtn) delBtn.hidden = !editing;

      modal.hidden = false;
      // Scheduler mesure sa hauteur de ligne au montage → invisible tant que caché : re-mesurer ici.
      if (window.CarryITEffort) {
        var when = editing && /^\d{4}-\d{2}-\d{2}/.test(String(editing.date || ''))
          ? new Date(String(editing.date).slice(0, 10) + 'T00:00:00') : new Date();
        var startHour = editing ? parseHour(editing.time) : null;
        var duration = editing ? parseDuration(editing.duration) : null;
        window.CarryITEffort.setDate(when);
        window.CarryITEffort.reset();
        // En édition on replace le bloc sur son créneau d'origine : réenregistrer ne doit pas
        // déplacer silencieusement l'horaire saisi.
        window.CarryITEffort.refresh(startHour == null ? 15 : startHour, duration == null ? 1 : duration);
      }
      // Après reset() : c'est lui qui vide quantité et note, le pré-remplissage passe donc en dernier.
      if (qtyEl) qtyEl.value = editing && editing.value != null ? editing.value : '';
      if (noteEl) noteEl.value = editing ? (editing.note || '') : '';
      if (qtyEl) qtyEl.focus();
    }

    function save() {
      if (!target || !window.CarryITEffort) return;
      var value = Number(qtyEl.value);
      if (qtyEl.value === '' || !isFinite(value)) {
        if (msgEl) { msgEl.textContent = 'Quantité requise.'; msgEl.hidden = false; }
        return;
      }
      var st = window.CarryITEffort.getState();
      var fields = {
        date: toISO(window.CarryITEffort.getDate()),
        value: value,
        time: window.CarryITEffort.formatHour(st.startHour),
        duration: window.CarryITEffort.formatDuration(st.duration),
        note: noteEl ? noteEl.value.trim() : '',
      };
      var ok = target.measureId
        ? updateMeasure(target.jalonId, target.kpiType, target.measureId, fields)
        : saveMeasure(target.jalonId, target.kpiType, Object.assign(
            { id: 'm-' + Date.now() + '-' + Math.random().toString(16).slice(2) }, fields));
      if (!ok) {
        if (msgEl) { msgEl.textContent = 'Enregistrement impossible.'; msgEl.hidden = false; }
        return;
      }
      refresh();
    }

    function del() {
      if (!target || !target.measureId) return;
      if (!deleteMeasure(target.jalonId, target.kpiType, target.measureId)) {
        if (msgEl) { msgEl.textContent = 'Suppression impossible.'; msgEl.hidden = false; }
        return;
      }
      refresh();
    }

    function refresh() {
      var back = returnToKpi;
      returnToKpi = null;          // close() ne rouvre pas : on rouvre nous-mêmes, après le refresh
      close();
      if (window.CarryITRefreshDashboard) window.CarryITRefreshDashboard();
      if (window.CarryITRefreshMoyen) window.CarryITRefreshMoyen();
      // Réouverture après coup : le modal KPI doit afficher le relevé à jour, pas l'ancien.
      if (back && window.CarryITOpenKpiModal) window.CarryITOpenKpiModal(back.jalonId, back.kpiType);
    }

    // Ouverture (délégation : cartes KPI et relevés sont re-rendus à chaque refresh).
    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add-measure]');
      if (add) { open(add.dataset.jalonId, add.dataset.kpiType); return; }
      var edit = e.target.closest('[data-edit-measure]');
      if (edit) {
        returnToKpi = edit.closest('[data-kpi-history]')
          ? { jalonId: edit.dataset.jalonId, kpiType: edit.dataset.kpiType } : null;
        open(edit.dataset.jalonId, edit.dataset.kpiType, edit.dataset.measureId);
      }
    });

    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-effort-close]'), function (b) {
      b.addEventListener('click', close);
    });
    var saveBtn = $('[data-effort-save]');
    if (saveBtn) saveBtn.addEventListener('click', save);
    if (delBtn) delBtn.addEventListener('click', del);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  // Réutilisé par dashboard-kpi.js (édition de la définition → la valeur peut changer si le mode change).
  window.CarryITRecomputeKpi = recompute;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initEffort);
  else initEffort();
})();
