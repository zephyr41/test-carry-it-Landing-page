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

  function saveMeasure(jalonId, kpiType, measure) {
    var jalons = readJSON(JALONS_KEY);
    if (!Array.isArray(jalons)) return false;
    var jalon = jalons.find(function (j) { return String(j.id) === String(jalonId); });
    if (!jalon || !Array.isArray(jalon.kpis)) return false;
    var kpi = jalon.kpis.find(function (k) { return (k && k.type) === kpiType; });
    if (!kpi) return false;
    if (!Array.isArray(kpi.measures)) kpi.measures = [];
    kpi.measures.push(measure);
    recompute(kpi, kpiType);
    try { localStorage.setItem(JALONS_KEY, JSON.stringify(jalons)); } catch (e) { return false; }
    return true;
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
        qtyEl = $('#effortQty'), noteEl = $('#effortNote'), msgEl = $('[data-effort-msg]');
    var target = null;   // { jalonId, kpiType }

    function close() { modal.hidden = true; target = null; }

    function open(jalonId, kpiType) {
      var kpi = findKpi(jalonId, kpiType);
      var isEffort = kpiType === 'leading';
      var unit = (kpi && (kpi.unit || kpi.unitShort)) || '';
      target = { jalonId: jalonId, kpiType: kpiType };

      if (titleEl) titleEl.textContent = isEffort ? 'Ajouter un effort' : 'Ajouter un résultat';
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

      modal.hidden = false;
      // Scheduler mesure sa hauteur de ligne au montage → invisible tant que caché : re-mesurer ici.
      if (window.CarryITEffort) {
        window.CarryITEffort.setDate(new Date());
        window.CarryITEffort.reset();
        window.CarryITEffort.refresh(15, 1);   // re-mesure PUIS place le bloc à 15:00
      }
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
      var measure = {
        id: 'm-' + Date.now() + '-' + Math.random().toString(16).slice(2),
        date: toISO(window.CarryITEffort.getDate()),
        value: value,
        time: window.CarryITEffort.formatHour(st.startHour),
        duration: window.CarryITEffort.formatDuration(st.duration),
        note: noteEl ? noteEl.value.trim() : '',
      };
      if (!saveMeasure(target.jalonId, target.kpiType, measure)) {
        if (msgEl) { msgEl.textContent = 'Enregistrement impossible.'; msgEl.hidden = false; }
        return;
      }
      close();
      if (window.CarryITRefreshDashboard) window.CarryITRefreshDashboard();
      if (window.CarryITRefreshMoyen) window.CarryITRefreshMoyen();
    }

    // Ouverture (délégation : les cartes KPI sont re-rendues).
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-measure]');
      if (!btn) return;
      open(btn.dataset.jalonId, btn.dataset.kpiType);
    });

    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-effort-close]'), function (b) {
      b.addEventListener('click', close);
    });
    var saveBtn = $('[data-effort-save]');
    if (saveBtn) saveBtn.addEventListener('click', save);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  // Réutilisé par dashboard-kpi.js (édition de la définition → la valeur peut changer si le mode change).
  window.CarryITRecomputeKpi = recompute;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initEffort);
  else initEffort();
})();
