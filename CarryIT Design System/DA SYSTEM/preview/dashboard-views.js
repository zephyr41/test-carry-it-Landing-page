/* Dashboard — commutation des vues (Long terme / Moyen terme / To-do) + rendu de la
   vue moyen terme : rail (timeline, rendu par timeline.js) + détail du jalon sélectionné.
   Vide pur : lit window.CarryITDashboardData, ne fabrique aucune donnée.
   NB : deltaText/freshness sont dupliqués depuis dashboard-final.js (helpers privés) —
   à consolider dans un module partagé quand la vue moyen terme sera stabilisée. */
(function () {
  'use strict';

  var EDIT_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  var PLUS_ICON = '<svg class="ds-kpi-card__action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m8-8H4"/></svg>';
  var DOTS_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';

  var MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var STATUS_LABEL = { completed: 'Terminé', in_progress: 'En cours', pending: 'À venir' };

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(n) { return (n == null || !isFinite(n)) ? '' : String(n); }

  function toISO(d) {
    if (!d) return null;
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
    return m ? (m[3] + '-' + m[2] + '-' + m[1]) : d;
  }
  function fmtDue(dateStr) {
    var iso = toISO(dateStr);
    var d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return '';
    return d.getUTCDate() + ' ' + MONTHS_FR[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  }

  // "Il y a Nj" depuis la dernière mesure (identique à dashboard-final.js).
  function freshness(dateStr) {
    var iso = toISO(dateStr);
    var d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return '';
    var days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return "aujourd'hui";
    if (days === 1) return 'hier';
    return 'il y a ' + days + 'j';
  }
  function lastMeasureDate(kpi) {
    var m = kpi && kpi.measures;
    return (m && m.length) ? m[m.length - 1].date : null;
  }

  // Delta = écart-à-cible, sémantique par type (spec §856), identique à dashboard-final.js.
  function deltaText(kpi) {
    if (!kpi || kpi.value == null || kpi.target == null) return '';
    if (kpi.type === 'leading') {
      if (kpi.value >= kpi.target) {
        var unit = kpi.unitShort || kpi.unit || '';
        return '+' + fmt(kpi.value - kpi.target) + (unit ? ' ' + unit : '') + ' au-delà';
      }
      return fmt(kpi.target - kpi.value) + ' restants';
    }
    if (kpi.value >= kpi.target) return 'Objectif atteint';
    return fmt(kpi.target - kpi.value) + ' restants';
  }

  // Carte KPI de jalon — variante complète (head-actions : crayon + « Ajouter … »).
  function kpiCardHTML(kpi, typeLabel, addLabel, jalonId, kpiType) {
    var attrs = 'data-jalon-id="' + esc(jalonId) + '" data-kpi-type="' + esc(kpiType) + '"';
    if (!kpi) {
      return '<article class="ds-kpi-card ds-col-6">' +
        '<div class="ds-empty-state">' +
          '<h3 class="type-h3 ds-empty-state__title">' + esc(typeLabel) + ' à définir</h3>' +
          '<p class="ds-empty-state__description type-body-md">' +
            (kpiType === 'leading'
              ? 'Ce que tu fais pour faire augmenter ton résultat.'
              : 'Définit un indicateur pour savoir ton avancée par rapport à ton objectif à moyen terme.') +
          '</p>' +
          '<button type="button" class="ds-button ds-button--ghost ds-button--sm ds-empty-state__action" data-define-kpi ' + attrs + '>Définir ' + (kpiType === 'leading' ? 'l’effort' : 'le résultat') + '</button>' +
        '</div></article>';
    }
    var unit = kpi.unitShort || kpi.unit || '';
    var target = kpi.target != null ? '/ ' + fmt(kpi.target) + (unit ? ' ' + esc(unit) : '') : '';
    var foot = deltaText(kpi);
    var fresh = freshness(lastMeasureDate(kpi));
    // Fréquence retirée du footer : « Hebdomadaire » tronquait toujours en « Hebdo… ».
    // Elle vit dans le modal d'édition du KPI, pas besoin de la répéter ici.
    return '<article class="ds-kpi-card ds-col-6">' +
      '<div class="ds-kpi-card__head">' +
        '<div class="ds-kpi-card__labels">' +
          '<span class="ds-kpi-card__eyebrow type-data-label">' + esc(typeLabel) + '</span>' +
          '<span class="ds-kpi-card__name type-body-sm">' + esc(kpi.label || '') + '</span>' +
        '</div>' +
        '<div class="ds-kpi-card__head-actions">' +
          '<button type="button" class="ds-row-action" data-edit-kpi ' + attrs + ' aria-label="Modifier le KPI">' + EDIT_ICON + '</button>' +
          '<button type="button" class="ds-button ds-button--ghost ds-button--xs ds-kpi-card__action" data-add-measure ' + attrs + '>' + PLUS_ICON + esc(addLabel) + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="ds-kpi-card__metric">' +
        '<span class="ds-kpi-card__value">' + esc(fmt(kpi.value)) + '</span>' +
        (target ? '<span class="ds-kpi-card__target type-body-md">' + target + '</span>' : '') +
      '</div>' +
      '<hr class="ds-kpi-card__divider">' +
      '<div class="ds-kpi-card__footer">' +
        '<span class="type-body-sm ds-delta">' + esc(foot) + '</span>' +
        (fresh ? '<span class="ds-kpi-card__meta type-body-sm">Mis à jour ' + esc(fresh) + '</span>' : '') +
      '</div>' +
    '</article>';
  }

  var MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function fmtDateShort(dateStr) {
    var iso = toISO(dateStr);
    var d = iso ? new Date(iso) : null;
    if (!d || isNaN(d)) return esc(dateStr || '');
    return d.getUTCDate() + ' ' + MONTHS_SHORT[d.getUTCMonth()];
  }

  // Historique des mesures d'un KPI (lecture seule) — remplit la vue avec la DYNAMIQUE
  // (spec Vue 2 : « accès à l'historique »). date (gauche) · valeur (droite), récent en haut.
  function kpiHistoryHTML(kpi, typeLabel) {
    var freq = (kpi && kpi.frequency) ? ' · ' + esc(kpi.frequency) : '';
    var title = (kpi && kpi.label) ? esc(kpi.label) : esc(typeLabel);
    var head =
      '<header class="ds-kpi-history__head">' +
        '<span class="ds-kpi-history__eyebrow type-data-label">Historique' + freq + '</span>' +
        '<h2 class="ds-kpi-history__title type-h3">' + title + '</h2>' +
      '</header>';
    var measures = (kpi && Array.isArray(kpi.measures)) ? kpi.measures.slice() : [];
    if (!measures.length) {
      return '<article class="ds-kpi-history ds-col-6">' + head +
        '<div class="ds-empty-state ds-kpi-history__empty">' +
          '<h3 class="type-h3 ds-empty-state__title">Aucune mesure</h3>' +
          '<p class="ds-empty-state__description type-body-md">Ajoute une première mesure pour suivre ce KPI.</p>' +
        '</div></article>';
    }
    var unit = kpi.unitShort || kpi.unit || '';
    var rows = measures.slice().reverse().map(function (m) {   // récent en haut
      return '<li class="ds-kpi-history__row"><div class="ds-kpi-history__main">' +
        '<span class="ds-kpi-history__date type-body-sm">' + fmtDateShort(m.date) + '</span>' +
        '<span class="ds-kpi-history__value type-body-md">' + esc(fmt(m.value)) +
          (unit ? ' <span class="ds-kpi-history__unit">' + esc(unit) + '</span>' : '') +
        '</span></div></li>';
    }).join('');
    return '<article class="ds-kpi-history ds-col-6">' + head +
      '<div class="ds-kpi-history__cols">' +
        '<span class="type-data-label">Date</span>' +
        '<span class="type-data-label ds-kpi-history__col--value">Valeur</span>' +
      '</div>' +
      '<ol class="ds-kpi-history__list">' + rows + '</ol></article>';
  }

  function emptyDetail() {
    return '<div class="ds-empty-state">' +
      '<svg class="ds-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5m0 0l14 5L4 15"/></svg>' +
      '<h3 class="type-h3 ds-empty-state__title">Aucun jalon</h3>' +
      '<p class="ds-empty-state__description type-body-md">Les jalons se créent dans l’onboarding.</p>' +
    '</div>';
  }

  // Jalons triés par date croissante (même ordre que le rail timeline).
  function sortedJalons() {
    var d = window.CarryITDashboardData || {};
    return (d.jalons || []).slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
  }

  var currentJalonId = null;   // jalon actuellement affiché dans le détail (pour re-render après save)

  function renderDetail(jalon, index, total) {
    var card = document.querySelector('[data-jalon-detail]');
    if (!card) return;
    if (!jalon) { currentJalonId = null; card.innerHTML = emptyDetail(); return; }
    currentJalonId = jalon.id;

    var effort = (jalon.kpis || []).find(function (k) { return k.type === 'leading'; }) || null;
    var result = (jalon.kpis || []).find(function (k) { return k.type === 'lagging'; }) || null;
    var status = STATUS_LABEL[jalon.statut] || '';
    // Pas de « Mois N » fabriqué (c'était index+1 déguisé en date — la marque ne fabrique pas de données).
    var meta = 'Jalon ' + (index + 1) + '/' + total + (status ? ' · ' + status : '');
    var due = fmtDue(jalon.date);

    card.innerHTML =
      '<div class="ds-jalon-detail">' +
        '<header class="ds-jalon-detail__head">' +
          '<div class="ds-jalon-detail__meta-row">' +
            '<span class="ds-jalon-detail__meta type-data-label">' + esc(meta) + '</span>' +
            '<button type="button" class="ds-button ds-button--subtle ds-button--xs" data-edit-jalon data-jalon-id="' + esc(jalon.id) + '">' + EDIT_ICON + 'Modifier</button>' +
          '</div>' +
          '<h2 class="ds-jalon-detail__title type-h1">' + esc(jalon.titre || '') + '</h2>' +
          (due ? '<p class="ds-jalon-detail__due type-body-md">Échéance · ' + esc(due) + '</p>' : '') +
        '</header>' +
        '<hr class="ds-jalon-detail__rule">' +
        '<section class="ds-jalon-detail__section">' +
          '<span class="ds-jalon-detail__label type-data-label">Critère de validation</span>' +
          '<p class="ds-jalon-detail__criteria type-body-lg">' + esc(jalon.critere || '') + '</p>' +
        '</section>' +
        '<section class="ds-jalon-detail__section">' +
          '<span class="ds-jalon-detail__label type-data-label">KPI de jalon</span>' +
          '<div class="ds-jalon-detail__kpi-grid ds-grid">' +
            kpiCardHTML(effort, 'Effort', 'Ajouter un effort', jalon.id, 'leading') +
            kpiCardHTML(result, 'Résultat', 'Ajouter un résultat', jalon.id, 'lagging') +
          '</div>' +
        '</section>' +
        '<section class="ds-jalon-detail__section">' +
          '<span class="ds-jalon-detail__label type-data-label">Historique des mesures</span>' +
          '<div class="ds-grid dashboard-final__history-grid">' +
            kpiHistoryHTML(effort, 'Effort') +
            kpiHistoryHTML(result, 'Résultat') +
          '</div>' +
        '</section>' +
        '<hr class="ds-jalon-detail__rule">' +
        '<footer class="ds-jalon-detail__footer">' +
          // Valider = action-pic de la vue → CTA orange (Principe 2), UNIQUEMENT sur le jalon en cours.
          // Terminé → statut ; à venir → pas de bouton (on ne valide pas un jalon futur).
          (jalon.statut === 'completed'
            ? '<span class="ds-jalon-detail__meta type-data-label">Jalon validé</span>'
            : jalon.statut === 'in_progress'
              ? '<button type="button" class="ds-button ds-button--inverse ds-button--sm" data-validate-jalon data-jalon-id="' + esc(jalon.id) + '">Valider ce jalon</button>'
              : '<span class="ds-jalon-detail__meta type-data-label">À venir</span>') +
          '<button type="button" class="ds-row-action" aria-label="Plus d’options">' + DOTS_ICON + '</button>' +
        '</footer>' +
      '</div>';

    // Surligne dans le rail le jalon actuellement affiché (sinon on détaille j3 sans repère).
    Array.prototype.forEach.call(document.querySelectorAll('.ds-timeline__item'), function (li) {
      var btn = li.querySelector('[data-jalon-id]');
      li.classList.toggle('is-selected', !!btn && String(btn.dataset.jalonId) === String(jalon.id));
    });
  }

  // Rend le jalon actif (premier non terminé) — l'état par défaut de la vue.
  function renderActive() {
    var list = sortedJalons();
    var total = list.length;
    var idx = list.findIndex(function (j) { return j.statut === 'in_progress'; });
    if (idx < 0) idx = list.findIndex(function (j) { return j.statut !== 'completed'; });
    if (idx < 0 && total) idx = 0;
    renderDetail(idx >= 0 ? list[idx] : null, idx, total);
  }

  // ── Commutation des vues ────────────────────────────────────────────
  function showView(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.ds-tabs__tab[data-view]'), function (t) {
      var on = t.dataset.view === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-view-panel]'), function (p) {
      p.hidden = p.dataset.viewPanel !== name;
    });
    if (name === 'moyen') renderActive();
    if (name === 'todo' && window.CarryITRefreshTodo) window.CarryITRefreshTodo();
  }

  // Ré-affiche un jalon donné (après ajout de mesure) — data déjà rebuildée par l'appelant.
  window.CarryITShowJalon = function (id) {
    var list = sortedJalons();
    var idx = list.findIndex(function (j) { return String(j.id) === String(id); });
    if (idx >= 0) renderDetail(list[idx], idx, list.length);
    else renderActive();   // jalon supprimé → retombe sur le jalon actif
  };
  // Re-render le détail courant (ou le jalon actif) — appelé après une écriture.
  window.CarryITRefreshMoyen = function () {
    if (currentJalonId != null) window.CarryITShowJalon(currentJalonId);
    else renderActive();
  };

  // Valide un jalon (passe statut → completed) dans carryit_v1_jalons, puis rafraîchit tout.
  function validateJalon(id) {
    var raw;
    try { raw = JSON.parse(localStorage.getItem('carryit_v1_jalons')); } catch (e) { raw = null; }
    if (!Array.isArray(raw)) return;
    var j = raw.find(function (x) { return String(x.id) === String(id); });
    if (!j) return;
    j.statut = 'completed'; j.status = 'completed';
    try { localStorage.setItem('carryit_v1_jalons', JSON.stringify(raw)); } catch (e) { return; }
    if (window.CarryITRefreshDashboard) window.CarryITRefreshDashboard();
    if (window.CarryITRefreshTimeline) window.CarryITRefreshTimeline();
    if (window.CarryITRefreshMoyen) window.CarryITRefreshMoyen();
    if (window.CarryITRefreshTodo) window.CarryITRefreshTodo();
  }

  function init() {
    document.addEventListener('click', function (e) {
      var tab = e.target.closest('.ds-tabs__tab[data-view]');
      if (tab) { showView(tab.dataset.view); return; }
      // Valider ce jalon : action importante/irréversible → confirmation avant d'agir (§941).
      var val = e.target.closest('[data-validate-jalon]');
      if (val) {
        if (window.confirm('Valider ce jalon ? Il passera en terminé.')) validateJalon(val.dataset.jalonId);
        return;
      }
    });

    // Clic sur un jalon du rail → détaille ce jalon.
    document.addEventListener('carryit:jalon-open', function (e) {
      var id = e.detail && e.detail.id;
      if (id == null) return;
      var list = sortedJalons();
      var idx = list.findIndex(function (j) { return String(j.id) === String(id); });
      if (idx >= 0) renderDetail(list[idx], idx, list.length);
    });

    renderActive();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
