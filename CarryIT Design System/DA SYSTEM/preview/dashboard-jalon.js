/* Dashboard — « Modifier le jalon » : titre, échéance (calendrier DS), critère de validation.
   Écrit carryit_v1_jalons[], rafraîchit le rail (timeline) + le détail. Rien inventé. */
(function () {
  'use strict';

  var JALONS_KEY = 'carryit_v1_jalons';
  var MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

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
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return String(d).slice(0, 10);
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
    return m ? (m[3] + '-' + m[2] + '-' + m[1]) : d;
  }
  function fmtLabel(iso) {
    var p = (iso || '').split('-');
    return (p.length < 3) ? 'Choisir une date' : (parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0]);
  }

  function initJalon() {
    var modal = $('[data-jalon-modal]');
    if (!modal) return;
    var titreEl = $('[data-jalon-field-titre]'), critereEl = $('[data-jalon-field-critere]'),
        msgEl = $('[data-jalon-msg]'), deleteBtn = $('[data-jalon-delete]'),
        dateTrigger = $('[data-jalon-date-trigger]'), dateLabel = $('[data-jalon-date-label]'), calPop = $('[data-jalon-cal-pop]');
    var target = null;      // jalonId édité
    var jalonDate = null;   // ISO
    var cal = null;

    function setDate(iso) { jalonDate = iso; if (dateLabel) dateLabel.textContent = fmtLabel(iso); }
    function closePop() { if (calPop) calPop.hidden = true; if (dateTrigger) dateTrigger.setAttribute('aria-expanded', 'false'); }
    function togglePop() {
      if (!calPop) return;
      var willOpen = calPop.hidden;
      calPop.hidden = !willOpen;
      if (dateTrigger) dateTrigger.setAttribute('aria-expanded', String(willOpen));
    }
    function initCalendar() {
      var el = document.getElementById('jalonCalendar');
      if (!el || !window.calendarjs || cal) return;
      cal = window.calendarjs.Calendar(el, {
        type: 'inline', startingDay: 1, footer: false,
        onchange: function (_, val) { setDate(val); closePop(); },
      });
    }
    if (dateTrigger) dateTrigger.addEventListener('click', function (e) { e.stopPropagation(); initCalendar(); togglePop(); });
    // La lib @calendarjs change de mois à la molette (trop sensible). On neutralise la molette
    // SUR le calendrier (capture → la lib ne reçoit pas l'event) : le mois ne défile plus au scroll.
    if (calPop) calPop.addEventListener('wheel', function (e) { e.stopPropagation(); e.preventDefault(); }, { capture: true, passive: false });

    function close() { modal.hidden = true; target = null; closePop(); }

    function open(jalonId) {
      var d = window.CarryITDashboardData || {};
      var jalon = (d.jalons || []).find(function (j) { return String(j.id) === String(jalonId); });
      if (!jalon) return;
      target = jalonId;
      titreEl.value = jalon.titre || '';
      critereEl.value = jalon.critere || '';
      initCalendar();
      var iso = toISO(jalon.date);
      setDate(iso);
      if (cal && cal.setValue && iso) cal.setValue(iso);
      closePop();
      if (msgEl) msgEl.hidden = true;
      modal.hidden = false;
      titreEl.focus();
    }

    function save() {
      if (!target) return;
      var titre = (titreEl.value || '').trim();
      if (!titre) { if (msgEl) { msgEl.textContent = 'Titre requis.'; msgEl.hidden = false; } return; }
      var jalons = readJSON(JALONS_KEY);
      var jalon = Array.isArray(jalons) ? jalons.find(function (j) { return String(j.id) === String(target); }) : null;
      if (!jalon) return;
      jalon.titre = titre; jalon.title = titre;
      if (jalonDate) jalon.date = jalonDate;
      var critere = (critereEl.value || '').trim();
      jalon.critere = critere; jalon.validation = critere;
      try { localStorage.setItem(JALONS_KEY, JSON.stringify(jalons)); } catch (e) { return; }
      finish();
    }

    function del() {
      if (!target) return;
      var jalons = readJSON(JALONS_KEY);
      if (!Array.isArray(jalons)) return;
      jalons = jalons.filter(function (j) { return String(j.id) !== String(target); });
      try { localStorage.setItem(JALONS_KEY, JSON.stringify(jalons)); } catch (e) { return; }
      finish();
    }

    function finish() {
      close();
      if (window.CarryITRefreshDashboard) window.CarryITRefreshDashboard();
      if (window.CarryITRefreshTimeline) window.CarryITRefreshTimeline();
      if (window.CarryITRefreshMoyen) window.CarryITRefreshMoyen();
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-edit-jalon]');
      if (btn) { open(btn.dataset.jalonId); }
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-jalon-close]'), function (b) { b.addEventListener('click', close); });
    var saveBtn = $('[data-jalon-save]'); if (saveBtn) saveBtn.addEventListener('click', save);
    if (deleteBtn) deleteBtn.addEventListener('click', del);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initJalon);
  else initJalon();
})();
