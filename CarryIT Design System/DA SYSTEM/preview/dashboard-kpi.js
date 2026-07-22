/* Dashboard : « Configurer / Modifier un KPI de jalon » (définition, pas mesure).
   Crayon d'une carte KPI (édition) ou « Définir… » d'une carte vide (création). Champs :
   métrique, cible, unité, fréquence, mode. Type fixe (leading/lagging, porté par le bouton).
   Écrit carryit_v1_jalons[].kpis[], recalcule la valeur (mode peut changer), rafraîchit. */
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
  function num(v) { var n = Number(v); return (v !== '' && v != null && isFinite(n)) ? n : null; }

  function findJalon(jalons, id) {
    return Array.isArray(jalons) ? jalons.find(function (j) { return String(j.id) === String(id); }) : null;
  }

  // Placeholders descriptifs : une phrase entière, pas une liste de mots, l'utilisateur
  // recopie la FORME de ce qu'on attend (une chose mesurable, sur une période).
  var PLACEHOLDER = {
    leading: 'Nombre de séances de musculation par semaine…',
    lagging: 'Argent économisé chaque mois, km courus chaque semaine…',
  };
  var MODE_HINT = {
    incremental: '*cumulatif : tu saisis 5, puis 3 → affiche 8.',
    absolute: '*instantané : tu saisis 5, puis 3 → affiche 3.',
  };

  function initKpi() {
    var modal = $('[data-kpi-modal]');
    if (!modal) return;
    var titleEl = $('[data-kpi-title]'), subEl = $('[data-kpi-subtitle]'), msgEl = $('[data-kpi-msg]'),
        critEl = $('[data-kpi-criteria]'), critTextEl = $('[data-kpi-criteria-text]'),
        labelEl = $('[data-kpi-field-label]'), targetEl = $('[data-kpi-field-target]'),
        unitEl = $('[data-kpi-field-unit]'), unitCustomEl = $('[data-kpi-field-unit-custom]'),
        unitSelectWrap = $('[data-kpi-unit-select]'), unitCustomWrap = $('[data-kpi-unit-custom]'),
        freqEl = $('[data-kpi-field-freq]'), modeEl = $('[data-kpi-field-mode]'),
        modeHintEl = $('[data-kpi-mode-hint]'), deleteBtn = $('[data-kpi-delete]');
    var target = null;   // { jalonId, kpiType, isEdit }

    function close() { modal.hidden = true; target = null; }

    // Unité : liste fermée par défaut, champ libre à la demande. Une unité déjà saisie qui
    // n'est pas dans la liste ouvre directement le champ libre (sinon elle serait perdue).
    function setUnitMode(custom) {
      if (!unitSelectWrap || !unitCustomWrap) return;
      unitSelectWrap.hidden = custom;
      unitCustomWrap.hidden = !custom;
    }
    function unitValue() {
      if (unitCustomWrap && !unitCustomWrap.hidden) return (unitCustomEl.value || '').trim();
      var v = unitEl.value;
      return v === '__custom' ? '' : v;
    }
    function isKnownUnit(u) {
      return Array.prototype.some.call(unitEl.options, function (o) {
        return o.value !== '__custom' && o.value === u;
      });
    }

    function syncModeHint() {
      if (modeHintEl) modeHintEl.textContent = MODE_HINT[modeEl.value] || '';
    }

    // Contexte du jalon visé : « Jalon 2/5 · Titre », puis son critère pour le résultat.
    function jalonOf(jalonId) {
      var d = window.CarryITDashboardData || {};
      var list = (d.jalons || []).slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
      var i = list.findIndex(function (j) { return String(j.id) === String(jalonId); });
      return i < 0 ? null : { jalon: list[i], index: i, total: list.length };
    }

    function open(jalonId, kpiType, isEdit) {
      var typeWord = kpiType === 'leading' ? 'l’effort' : 'le résultat';
      target = { jalonId: jalonId, kpiType: kpiType, isEdit: isEdit };
      if (titleEl) titleEl.textContent = (isEdit ? 'Modifier ' : 'Définir ') + typeWord;

      var ctx = jalonOf(jalonId);
      if (subEl) {
        subEl.textContent = ctx
          ? 'Jalon ' + (ctx.index + 1) + '/' + ctx.total + (ctx.jalon.titre ? ' · ' + ctx.jalon.titre : '')
          : '';
        subEl.hidden = !subEl.textContent;
      }
      // Le critère n'a de sens que pour le résultat : c'est LUI qu'on cherche à mesurer.
      if (critEl) {
        var crit = (kpiType !== 'leading' && ctx) ? (ctx.jalon.critere || '') : '';
        if (crit) { critTextEl.textContent = crit; critEl.hidden = false; }
        else { critEl.hidden = true; }
      }
      if (msgEl) msgEl.hidden = true;
      if (deleteBtn) deleteBtn.hidden = !isEdit;

      var kpi = null;
      if (isEdit) {
        var d = window.CarryITDashboardData || {};
        var jalon = (d.jalons || []).find(function (j) { return String(j.id) === String(jalonId); });
        kpi = jalon ? (jalon.kpis || []).find(function (k) { return k.type === kpiType; }) : null;
      }
      labelEl.value = kpi ? (kpi.label || '') : '';
      labelEl.placeholder = PLACEHOLDER[kpiType] || '';
      targetEl.value = (kpi && kpi.target != null) ? kpi.target : '';

      var unit = kpi ? (kpi.unit || '') : '';
      var custom = !!unit && !isKnownUnit(unit);
      setUnitMode(custom);
      unitEl.value = custom ? '' : unit;
      if (unitCustomEl) unitCustomEl.value = custom ? unit : '';

      freqEl.value = (kpi && kpi.frequency) ? kpi.frequency : 'Hebdomadaire';
      modeEl.value = (kpi && kpi.mode) ? kpi.mode : (kpiType === 'leading' ? 'incremental' : 'absolute');
      syncModeHint();

      modal.hidden = false;
      labelEl.focus();
    }

    function save() {
      if (!target) return;
      var label = (labelEl.value || '').trim();
      if (!label) { if (msgEl) { msgEl.textContent = 'Nom requis.'; msgEl.hidden = false; } return; }

      var jalons = readJSON(JALONS_KEY);
      var jalon = findJalon(jalons, target.jalonId);
      if (!jalon) return;
      if (!Array.isArray(jalon.kpis)) jalon.kpis = [];

      var kpi = jalon.kpis.find(function (k) { return (k && k.type) === target.kpiType; });
      if (!kpi) {
        kpi = { id: 'kpi-' + Date.now() + '-' + Math.random().toString(16).slice(2), type: target.kpiType, measures: [] };
        jalon.kpis.push(kpi);
      }
      // Champs FR/EN doublés (cohérence avec le stockage app + la couche data).
      kpi.titre = label; kpi.label = label;
      kpi.cible = num(targetEl.value); kpi.target = kpi.cible;
      kpi.unite = unitValue(); kpi.unit = kpi.unite;
      kpi.frequence = freqEl.value; kpi.frequency = freqEl.value;
      kpi.modeMesure = modeEl.value; kpi.mode = modeEl.value;
      if (!Array.isArray(kpi.measures)) kpi.measures = [];
      if (window.CarryITRecomputeKpi) window.CarryITRecomputeKpi(kpi, target.kpiType);

      try { localStorage.setItem(JALONS_KEY, JSON.stringify(jalons)); } catch (e) { return; }
      finish();
    }

    function del() {
      if (!target) return;
      var jalons = readJSON(JALONS_KEY);
      var jalon = findJalon(jalons, target.jalonId);
      if (!jalon || !Array.isArray(jalon.kpis)) return;
      jalon.kpis = jalon.kpis.filter(function (k) { return (k && k.type) !== target.kpiType; });
      try { localStorage.setItem(JALONS_KEY, JSON.stringify(jalons)); } catch (e) { return; }
      finish();
    }

    function finish() {
      close();
      if (window.CarryITRefreshDashboard) window.CarryITRefreshDashboard();
      if (window.CarryITRefreshMoyen) window.CarryITRefreshMoyen();
    }

    document.addEventListener('click', function (e) {
      var edit = e.target.closest('[data-edit-kpi]');
      if (edit) { open(edit.dataset.jalonId, edit.dataset.kpiType, true); return; }
      var define = e.target.closest('[data-define-kpi]');
      if (define) { open(define.dataset.jalonId, define.dataset.kpiType, false); return; }
    });

    unitEl.addEventListener('change', function () {
      if (unitEl.value === '__custom') { setUnitMode(true); if (unitCustomEl) unitCustomEl.focus(); }
    });
    var unitBack = $('[data-kpi-unit-back]');
    if (unitBack) unitBack.addEventListener('click', function () {
      if (unitCustomEl) unitCustomEl.value = '';
      unitEl.value = '';
      setUnitMode(false);
      unitEl.focus();
    });
    modeEl.addEventListener('change', syncModeHint);

    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-kpi-close]'), function (b) { b.addEventListener('click', close); });
    var saveBtn = $('[data-kpi-save]'); if (saveBtn) saveBtn.addEventListener('click', save);
    if (deleteBtn) deleteBtn.addEventListener('click', del);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initKpi);
  else initKpi();
})();
