/* Dashboard (long terme) : orchestrateur.
   Lit window.CarryITDashboardData (couche localStorage de dashboard-data.js) et remplit
   les cartes : KPI objectif (hero), KPI effort, KPI résultat, carte SMART.
   Vide pur : aucune donnée inventée. Objectif/SMART absents → état vide DS + CTA vers
   l'onboarding (objectif.html), là où l'utilisateur définit son SMART. La carte "jalon actif"
   et la timeline sont rendues par timeline.js ; le graphique par chart.js. */
(function () {
  'use strict';

  var ONBOARDING_URL = '../../../objectif.html';

  var CHART_ICON = '<svg class="ds-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M9 16V9M14 16V7M19 16v-4"/></svg>';
  var EDIT_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function fmt(n) {
    if (n == null || !isFinite(n)) return '';
    return String(n);
  }

  // "Il y a Nj" depuis une date de mesure (dd/mm/yyyy ou ISO). Null si indéterminable.
  function freshness(dateStr) {
    if (!dateStr) return '';
    var iso = /^\d{4}-\d{2}-\d{2}/.test(dateStr) ? dateStr.slice(0, 10)
      : (/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr) || [])
          .slice(1).reverse().join('-') || dateStr;
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    return 'Il y a ' + days + 'j';
  }

  function lastMeasureDate(kpi) {
    var m = kpi && kpi.measures;
    return (m && m.length) ? m[m.length - 1].date : null;
  }

  // ── État vide générique (avec ou sans CTA onboarding) ──────────────
  function emptyState(title, desc, withCta) {
    var cta = withCta
      ? '<a class="ds-button ds-button--inverse ds-button--sm ds-empty-state__action" href="' +
        ONBOARDING_URL + '">Remplir votre objectif SMART</a>'
      : '';
    return '<div class="ds-empty-state">' + CHART_ICON +
      '<h3 class="type-h3 ds-empty-state__title">' + esc(title) + '</h3>' +
      '<p class="ds-empty-state__description type-body-md">' + esc(desc) + '</p>' +
      cta + '</div>';
  }

  // ── Carte KPI (hero objectif / effort / résultat) ──────────────────
  function kpiEmpty(kpi) {
    return !kpi || (kpi.label == null && kpi.value == null &&
      (!kpi.measures || !kpi.measures.length) && kpi.target == null);
  }

  // Delta = écart-à-cible, sémantique par TYPE (spec §856) :
  //  · effort (leading)  → au-dessus du seuil : « +X {unit} au-delà » · sinon « X restants »
  //  · résultat (lagging) / objectif → atteint : « Objectif atteint » · sinon « X restants »
  // L'effort ne dit JAMAIS « Objectif atteint » (concept de preuve = résultat only).
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

  function renderKpiCard(sel, eyebrow, kpi, opts) {
    opts = opts || {};
    var card = document.querySelector(sel);
    if (!card) return;

    if (kpiEmpty(kpi)) {
      // La variante claire --hero met en valeur une VRAIE donnée. Vide → carte sombre
      // comme les autres, sinon l'état vide (texte clair) passe invisible sur fond clair.
      if (opts.hero) card.classList.remove('ds-kpi-card--hero');
      // Anatomie fantôme, identique à la vue jalon → même carte dans les deux vues. Le CTA
      // vers l'onboarding vit sur la carte SMART, qui est le vrai point d'entrée.
      card.innerHTML =
        '<div class="ds-kpi-card__labels">' +
          '<span class="ds-kpi-card__eyebrow type-data-label">' + esc(eyebrow) + '</span>' +
          '<span class="ds-kpi-card__name ds-kpi-card__name--ghost type-body-sm">À définir</span>' +
        '</div>' +
        '<div class="ds-kpi-card__metric" aria-hidden="true">' +
          '<span class="ds-kpi-card__value ds-kpi-card__value--ghost">0</span>' +
          '<span class="ds-kpi-card__target ds-kpi-card__target--ghost type-body-md">/ cible</span>' +
        '</div>' +
        '<hr class="ds-kpi-card__divider" aria-hidden="true">';
      return;
    }
    if (opts.hero) card.classList.add('ds-kpi-card--hero');

    var unit = kpi.unitShort || kpi.unit || '';
    var target = kpi.target != null ? '/ ' + fmt(kpi.target) + (unit ? ' ' + esc(unit) : '') : '';
    var foot = deltaText(kpi);
    var fresh = freshness(lastMeasureDate(kpi));

    card.innerHTML =
      '<div class="ds-kpi-card__labels">' +
        '<span class="ds-kpi-card__eyebrow type-data-label">' + esc(eyebrow) + '</span>' +
        '<span class="ds-kpi-card__name type-body-sm">' + esc(kpi.label || '') + '</span>' +
      '</div>' +
      '<div class="ds-kpi-card__metric">' +
        '<span class="ds-kpi-card__value">' + esc(fmt(kpi.value != null ? kpi.value : 0)) + '</span>' +
        (target ? '<span class="ds-kpi-card__target type-body-md">' + target + '</span>' : '') +
      '</div>' +
      '<hr class="ds-kpi-card__divider">' +
      '<div class="ds-kpi-card__footer">' +
        '<span class="type-body-sm ds-delta">' + esc(foot) + '</span>' +
        (fresh ? '<span class="ds-kpi-card__meta type-body-sm">' + esc(fresh) + '</span>' : '') +
      '</div>';
  }

  // ── Carte SMART ────────────────────────────────────────────────────
  function smartRow(letter, dimension, text, textCls, field) {
    return '<li class="ds-smart__row" data-smart-row="' + field + '">' +
      '<span class="ds-smart__letter">' + letter + '</span>' +
      '<div class="ds-smart__body">' +
        '<span class="ds-smart__dimension type-data-label">' + dimension + '</span>' +
        '<p class="ds-smart__text ' + textCls + '" data-smart-field="' + field + '">' +
          esc(text || '') + '</p>' +
      '</div></li>';
  }

  function smartEmpty(smart) {
    if (!smart) return true;
    return !(smart.specifique || smart.mesurable || smart.atteignable ||
      smart.realiste || smart.temporel);
  }

  function renderSmart(smart) {
    var card = document.querySelector('[data-smart-card]');
    if (!card) return;

    if (smartEmpty(smart)) {
      card.innerHTML = emptyState(
        'Aucun objectif SMART',
        'Définis ton objectif pour structurer ta progression.', true);
      return;
    }

    card.innerHTML =
      '<header class="ds-smart__head">' +
        '<span class="ds-smart__label type-data-label">SMART</span>' +
        '<button type="button" class="ds-button ds-button--subtle ds-button--xs" data-smart-edit>' +
          EDIT_ICON + 'Modifier</button>' +
      '</header>' +
      '<ol class="ds-smart__list">' +
        smartRow('S', 'Spécifique', smart.specifique, 'ds-smart__text--lead type-body-md', 'specifique') +
        smartRow('M', 'Mesurable', smart.mesurable, 'ds-smart__text--fact type-body-sm', 'mesurable') +
        smartRow('A', 'Atteignable', smart.atteignable, 'ds-smart__text--muted ds-smart__text--clamp type-body-sm', 'atteignable') +
        smartRow('R', 'Réaliste', smart.realiste, 'ds-smart__text--muted ds-smart__text--clamp type-body-sm', 'realiste') +
        smartRow('T', 'Temporel', smart.temporel, 'ds-smart__text--fact type-body-sm', 'temporel') +
      '</ol>';
  }

  // ── Entête du graphique (titre = KPI de l'objectif, vide si aucun) ──
  function renderChartHeader(okpi) {
    var title = document.querySelector('.ds-chart-title');
    if (title) title.textContent = (okpi && okpi.label) ? okpi.label : '';
  }

  // ── Rendu global (idempotent, ré-appelable après édition/mesure) ────
  function renderAll() {
    if (window.CarryITBuildDashboardData) {
      window.CarryITDashboardData = window.CarryITBuildDashboardData();
    }
    var d = window.CarryITDashboardData || {};

    renderKpiCard('[data-objective-card]', "KPI de l'objectif", d.objectiveKpi, { hero: true });
    renderSmart(d.smart);
    renderKpiCard('[data-effort-card]', 'Effort', d.effortKpi);
    renderKpiCard('[data-result-card]', 'Résultat', d.resultKpi);

    renderChartHeader(d.objectiveKpi);
    if (window.CarryITRenderChart) window.CarryITRenderChart();
  }

  window.CarryITRefreshDashboard = renderAll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
})();
