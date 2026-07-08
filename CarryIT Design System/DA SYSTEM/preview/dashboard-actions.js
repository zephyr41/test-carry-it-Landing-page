/* Dashboard — interactions : ajouter une mesure au KPI global + éditer l'objectif SMART.
   Écrit dans les 2 namespaces (legacy carryItObjectifSMART + React carryit_v1_*), puis
   rafraîchit toutes les vues via window.CarryITRefreshDashboard (re-lit localStorage). */
(function () {
  'use strict';

  // Robuste au double-encodage : certaines écritures de l'app stringifient 2× → JSON.parse
  // rend une string. On re-parse tant que c'est une string JSON.
  function readJSON(k) {
    try {
      var r = localStorage.getItem(k);
      if (r == null || r === '') return null;
      var v = JSON.parse(r), guard = 0;
      while (typeof v === 'string' && guard++ < 3) { try { v = JSON.parse(v); } catch (e) { break; } }
      return v;
    } catch (e) { return null; }
  }
  function readObj(k) { var v = readJSON(k); return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}; }
  function num(v) { var n = Number(v); return (v !== '' && v != null && isFinite(n)) ? n : null; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(s) { return document.querySelector(s); }
  function refresh() { if (window.CarryITRefreshDashboard) window.CarryITRefreshDashboard(); }
  function todayISO() { return new Date().toISOString().slice(0, 10); }

  // Modal générique : fermeture (backdrop, boutons close, Échap).
  function bindModal(modalSel, closeSel) {
    var modal = $(modalSel);
    if (!modal) return null;
    function close() { modal.hidden = true; }
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    Array.prototype.forEach.call(document.querySelectorAll(closeSel), function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
    return { el: modal, open: function () { modal.hidden = false; }, close: close };
  }

  // ── Ajouter une mesure (KPI global) ────────────────────────────────
  function initMeasure() {
    var m = bindModal('[data-measure-modal]', '[data-measure-close]');
    if (!m) return;
    var valEl = $('[data-measure-value]'), noteEl = $('[data-measure-note]'),
        msgEl = $('[data-measure-msg]'), saveBtn = $('[data-measure-save]'),
        dateTrigger = $('[data-measure-date-trigger]'), dateLabel = $('[data-measure-date-label]'),
        calPop = $('[data-measure-cal-pop]');

    var MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    function fmtDate(iso) {
      var p = (iso || '').split('-');
      return (p.length < 3) ? 'Choisir une date' : (parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0]);
    }

    // Calendar DS (@calendarjs) en POPOVER — compact : déclencheur + calendrier au clic.
    var cal = null, measureDate = null;
    function setDate(iso) { measureDate = iso; if (dateLabel) dateLabel.textContent = fmtDate(iso); }
    function closePop() { if (calPop) calPop.hidden = true; if (dateTrigger) dateTrigger.setAttribute('aria-expanded', 'false'); }
    function togglePop() {
      if (!calPop) return;
      var willOpen = calPop.hidden;
      calPop.hidden = !willOpen;
      if (dateTrigger) dateTrigger.setAttribute('aria-expanded', String(willOpen));
    }
    function initCalendar() {
      var el = document.getElementById('measureCalendar');
      if (!el || !window.calendarjs || cal) return;
      window.calendarjs.setDictionary({
        January: 'Janvier', February: 'Février', March: 'Mars', April: 'Avril', May: 'Mai', June: 'Juin',
        July: 'Juillet', August: 'Août', September: 'Septembre', October: 'Octobre', November: 'Novembre', December: 'Décembre',
        Sunday: 'Dimanche', Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi', Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi',
      });
      cal = window.calendarjs.Calendar(el, {
        type: 'inline', startingDay: 1, footer: false,
        onchange: function (_, val) { setDate(val); closePop(); },
      });
    }

    if (dateTrigger) dateTrigger.addEventListener('click', function (e) { e.stopPropagation(); initCalendar(); togglePop(); });

    function openMeasure() {
      initCalendar();
      setDate(todayISO());
      if (cal && cal.setValue) cal.setValue(measureDate);
      closePop();
      valEl.value = '';
      if (noteEl) noteEl.value = '';
      if (msgEl) msgEl.hidden = true;
      m.open();
      valEl.focus();
    }

    // Bouton « Ajouter une mesure » du chart (re-rendu → délégation).
    document.addEventListener('click', function (e) {
      if (e.target.closest('.ds-chart-add-btn')) openMeasure();
    });

    saveBtn.addEventListener('click', function () {
      var date = measureDate || (cal && cal.getValue && cal.getValue()) || todayISO();
      var value = num(valEl.value);
      if (!date || value == null) {
        if (msgEl) { msgEl.textContent = 'Date et valeur requises.'; msgEl.hidden = false; }
        return;
      }
      saveMeasure(date, value, noteEl ? noteEl.value.trim() : '');
      m.close();
      refresh();
    });
  }

  function saveMeasure(date, value, note) {
    var smart = readObj('carryItObjectifSMART');
    var gk = (smart.globalKpi && typeof smart.globalKpi === 'object') ? smart.globalKpi : {};
    var v1kpi = readObj('carryit_v1_kpi');
    // Source unique = la liste réellement affichée (legacy si non vide, sinon v1).
    var current = (Array.isArray(gk.measures) && gk.measures.length) ? gk.measures.slice()
      : (Array.isArray(v1kpi.measures) ? v1kpi.measures.slice() : []);
    current.push({ id: Date.now(), date: date, value: value, note: note || '' });
    // Même liste complète écrite dans les 2 stores (cohérence).
    gk.measures = current; smart.globalKpi = gk; smart.measures = current;
    v1kpi.measures = current;
    try {
      localStorage.setItem('carryItObjectifSMART', JSON.stringify(smart));
      localStorage.setItem('carryit_v1_kpi', JSON.stringify(v1kpi));
      // Persiste dans le projet courant du tableau (sinon un switch de projet écrase la mesure).
      var all = readJSON('carryItAllObjectifs');
      if (Array.isArray(all) && all.length) {
        var idx = parseInt(localStorage.getItem('carryItEditingProjectIndex') || '0', 10);
        if (isNaN(idx) || idx < 0 || idx >= all.length) idx = 0;
        var p = all[idx];
        if (p && typeof p === 'object') {
          var pgk = (p.globalKpi && typeof p.globalKpi === 'object') ? p.globalKpi : {};
          pgk.measures = current; p.globalKpi = pgk; p.measures = current;
          localStorage.setItem('carryItAllObjectifs', JSON.stringify(all));
        }
      }
    } catch (e) {}
  }

  // ── Éditer l'objectif SMART — INLINE dans la carte (pas de modal) ──
  // Ligne = lettre (S/M/A/R/T, vide pour la cible) + label + champ. Ordre calqué sur
  // dashboard.html : S · M · Cible (3e) · A · R · T. Actions Annuler/Enregistrer EN BAS.
  function ta(attr, value) { return '<textarea class="ds-textarea" rows="2" ' + attr + '>' + esc(value) + '</textarea>'; }
  function inp(attr, value, type) {
    return '<input class="ds-input" type="' + (type || 'text') + '" ' + (type === 'number' ? 'step="any" ' : '') + attr + ' value="' + esc(value) + '">';
  }
  function editRow(letter, label, field) {
    return '<div class="ds-smart__edit-row">' +
      '<span class="ds-smart__letter">' + esc(letter) + '</span>' +
      '<div class="ds-smart__edit-field">' +
        '<label class="type-label">' + label + '</label>' + field +
      '</div>' +
    '</div>';
  }

  // Remplace le contenu de la carte SMART par le formulaire d'édition.
  function renderSmartEdit(card) {
    var d = window.CarryITDashboardData || {};
    var s = d.smart || {}, o = d.objectiveKpi || {};
    card.innerHTML =
      '<header class="ds-smart__head">' +
        '<span class="ds-smart__label type-data-label">SMART</span>' +
      '</header>' +
      '<div class="ds-smart__edit">' +
        editRow('S', 'Spécifique', ta('data-smart-edit-specifique', s.specifique)) +
        editRow('M', 'Mesurable (indicateur KPI)', ta('data-smart-edit-mesurable', s.mesurable || '')) +
        editRow('', 'Cible du KPI', inp('data-smart-edit-target', (o.target != null ? o.target : ''), 'number')) +
        editRow('A', 'Atteignable', ta('data-smart-edit-atteignable', s.atteignable)) +
        editRow('R', 'Réaliste', ta('data-smart-edit-realiste', s.realiste)) +
        editRow('T', 'Temporel', inp('data-smart-edit-temporel', s.temporel || '', 'text')) +
      '</div>' +
      '<div class="ds-smart__edit-actions">' +
        '<button type="button" class="ds-button ds-button--ghost ds-button--sm" data-smart-cancel>Annuler</button>' +
        '<button type="button" class="ds-button ds-button--inverse ds-button--sm" data-smart-save-inline>Enregistrer</button>' +
      '</div>';
  }

  function initSmart() {
    // Boutons rendus dynamiquement (carte re-rendue à chaque refresh) → délégation globale.
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-smart-edit]')) {
        var card = $('[data-smart-card]');
        if (card) renderSmartEdit(card);
        return;
      }
      if (e.target.closest('[data-smart-cancel]')) { refresh(); return; }
      if (e.target.closest('[data-smart-save-inline]')) {
        var c = $('[data-smart-card]');
        if (!c) return;
        var g = function (a) { var el = c.querySelector('[' + a + ']'); return el ? el.value.trim() : ''; };
        saveSmart({
          specifique: g('data-smart-edit-specifique'),
          mesurable: g('data-smart-edit-mesurable'),
          atteignable: g('data-smart-edit-atteignable'),
          realiste: g('data-smart-edit-realiste'),
          temporel: g('data-smart-edit-temporel'),
          kpiTarget: g('data-smart-edit-target'),
        });
        refresh();
      }
    });
  }

  function saveSmart(v) {
    var target = num(v.kpiTarget);
    // Legacy : carryItObjectifSMART (fields + globalKpi). Mesurable = indicateur = label du KPI.
    var smart = readObj('carryItObjectifSMART');
    smart.specifique = v.specifique;
    smart.mesurable = v.mesurable;
    smart.atteignable = v.atteignable;
    smart.realiste = v.realiste;
    smart.temporel = v.temporel;
    smart.kpiLabel = v.mesurable;
    smart.kpiTarget = target;
    var gk = (smart.globalKpi && typeof smart.globalKpi === 'object') ? smart.globalKpi : {};
    gk.label = v.mesurable; gk.titre = v.mesurable;
    gk.target = target; gk.cible = target;
    smart.globalKpi = gk;
    // React : carryit_v1_smart (S/M/A/R/T) + carryit_v1_kpi (label/target).
    var v1kpi = readObj('carryit_v1_kpi');
    v1kpi.label = v.mesurable; v1kpi.target = target; v1kpi.cible = target;
    try {
      localStorage.setItem('carryItObjectifSMART', JSON.stringify(smart));
      localStorage.setItem('carryit_v1_smart', JSON.stringify({
        S: v.specifique, M: v.mesurable, A: v.atteignable, R: v.realiste, T: v.temporel,
      }));
      localStorage.setItem('carryit_v1_kpi', JSON.stringify(v1kpi));
    } catch (e) {}
  }

  function init() { initMeasure(); initSmart(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
