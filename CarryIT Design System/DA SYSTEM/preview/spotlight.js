/* ────────────────────────────────────────────────────────────────────────
   Onboarding — tour spotlight DIRIGISTE (auto-avance) en 4 étapes.

   1 · Long terme  → 1re mesure du KPI global   (bouton « Ajouter une mesure »)
   2 · Moyen terme → définir le RÉSULTAT (skippable)  (carte KPI résultat)
   3 · Moyen terme → définir l'EFFORT               (carte KPI effort)
   4 · To-do       → « Maintenant, commence. »

   Le tour bascule lui-même de vue et se repositionne. Il avance automatiquement
   quand l'action de l'étape est faite : on écoute le rebuild central
   (window.CarryITRefreshDashboard) et on ré-évalue le prédicat `done` de l'étape.
   Réutilise les vraies actions/modales (aucune logique dupliquée).

   ┌── COPY ──────────────────────────────────────────────────────────────┐
   │ Tous les textes affichés sont dans STEPS ci-dessous. Édite ICI (Nils). │
   │ Les libellés « [ ... — copy Nils ] » sont des placeholders à remplacer.│
   └────────────────────────────────────────────────────────────────────────┘
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var STORAGE_KEY = 'carryit_onboard_done';   // tour terminé (finish ou Échap)

  var STEPS = [
    {
      id: 'measure', view: 'long',
      target: '.ds-chart-add-btn',
      eyebrow: 'POINT DE DÉPART',
      title: 'Où en es-tu ?',
      desc: "Définis par rapport à ton objectif SMART où tu en es aujourd'hui",
      skip: 'Plus tard', cta: 'Ajouter ma première mesure',
      done: function (d) { return d.objectiveKpi && Array.isArray(d.objectiveKpi.measures) && d.objectiveKpi.measures.length > 0; },
    },
    {
      id: 'result', view: 'moyen',
      target: '[data-kpi-type="lagging"][data-define-kpi], [data-kpi-type="lagging"][data-edit-kpi]',
      eyebrow: 'Résultat',
      title: 'Définit un résultat précis',
      desc: 'Par rapport à ton critère de validation; définit un résultat mesurable, pour être sur que tu avance vers ton jalon actuel',
      skip: 'Passer', cta: 'Définir',
      done: function (d) { return !!d.resultKpi; },
    },
    {
      id: 'effort', view: 'moyen',
      target: '[data-kpi-type="leading"][data-define-kpi], [data-kpi-type="leading"][data-edit-kpi]',
      eyebrow: '[EYEBROW — copy Nils]',
      title: '[Titre effort — copy Nils]',
      desc: "[Ce que tu fais pour faire avancer le résultat — copy Nils]",
      skip: 'Passer', cta: "Définir l'effort",
      done: function (d) { return !!d.effortKpi; },
    },
    {
      id: 'start', view: 'todo',
      target: null,   // centré, pas de cible
      eyebrow: '[EYEBROW — copy Nils]',
      title: 'Maintenant, commence.',
      desc: '[Petit mot de lancement — copy Nils]',
      cta: "C'est parti",   // pas de skip sur l'étape terminale
      finish: true,
    },
  ];

  var root, ring, bubble, eyebrowEl, titleEl, descEl, skipBtn, ctaBtn;
  var cur = -1, active = false;

  function tok(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return isFinite(n) ? n : fallback;
  }
  var PAD = tok('--space-8', 8), GAP = tok('--space-12', 12), EDGE = tok('--space-16', 16);

  function tourDone() { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; } }
  function markTourDone() { try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {} }

  function data() {
    return (typeof window.CarryITBuildDashboardData === 'function')
      ? window.CarryITBuildDashboardData()
      : (window.CarryITDashboardData || {});
  }

  // Première étape non satisfaite (reprise après reload). Une étape sans `done` est terminale.
  function firstIncomplete() {
    var d = data();
    for (var i = 0; i < STEPS.length; i++) {
      if (typeof STEPS[i].done !== 'function') return i;   // terminale
      if (!STEPS[i].done(d)) return i;
    }
    return STEPS.length - 1;
  }

  // ── Rendu du contenu de la bulle ─────────────────────────────────────────
  function setCopy(step) {
    eyebrowEl.textContent = step.eyebrow || '';
    titleEl.textContent = step.title || '';
    descEl.textContent = step.desc || '';
    ctaBtn.textContent = step.cta || 'Continuer';
    if (step.skip) { skipBtn.textContent = step.skip; skipBtn.hidden = false; }
    else { skipBtn.hidden = true; }
  }

  // ── Placement ────────────────────────────────────────────────────────────
  function positionCentered() {
    ring.style.display = 'none';
    root.classList.add('ds-spotlight--centered');
    bubble.classList.add('ds-spotlight__bubble--centered');
    bubble.classList.remove('ds-spotlight__bubble--above');
    var bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    bubble.style.left = Math.round((window.innerWidth - bw) / 2) + 'px';
    bubble.style.top = Math.round((window.innerHeight - bh) / 2) + 'px';
  }

  function positionOn(step) {
    if (!step.target) { positionCentered(); return true; }
    var target = document.querySelector(step.target);
    if (!target) return false;                       // pas encore rendu → retry
    var r = target.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;

    ring.style.display = '';
    root.classList.remove('ds-spotlight--centered');
    bubble.classList.remove('ds-spotlight__bubble--centered');
    ring.style.left = (r.left - PAD) + 'px';
    ring.style.top = (r.top - PAD) + 'px';
    ring.style.width = (r.width + PAD * 2) + 'px';
    ring.style.height = (r.height + PAD * 2) + 'px';

    var bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    var above = (window.innerHeight - r.bottom) < bh + GAP + EDGE;
    var top = above ? (r.top - GAP - bh) : (r.bottom + GAP);
    var left = r.left - PAD;
    var maxLeft = window.innerWidth - bw - EDGE;
    if (left > maxLeft) left = maxLeft;
    if (left < EDGE) left = EDGE;
    bubble.style.left = left + 'px';
    bubble.style.top = top + 'px';
    bubble.classList.toggle('ds-spotlight__bubble--above', above);
    return true;
  }

  var onReflow = function () { if (active) positionOn(STEPS[cur]); };

  // ── Passage à une étape ──────────────────────────────────────────────────
  function ensureView(step) {
    if (!step.view) return;
    var tab = document.querySelector('.ds-tabs__tab[data-view="' + step.view + '"]');
    if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
  }

  function enter(i) {
    cur = i;
    var step = STEPS[i];
    setCopy(step);
    ensureView(step);
    active = true;
    root.hidden = false;

    var tries = 0;
    (function tryPos() {
      var ok = positionOn(step);
      if (!ok && tries++ < 14) { setTimeout(tryPos, 90); return; }
      if (!ok) positionCentered();   // cible introuvable (ex : pas de jalon) → message centré
      requestAnimationFrame(function () { root.classList.add('is-active'); positionOn(step); });
    })();

    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    document.addEventListener('keydown', onKey);
  }

  function next() {
    if (cur + 1 < STEPS.length) enter(cur + 1);
    else finish();
  }

  function finish() { stop(true); }

  function stop(persist) {
    if (persist) markTourDone();
    if (!active) { root.hidden = true; return; }
    active = false;
    root.classList.remove('is-active');
    window.removeEventListener('resize', onReflow);
    window.removeEventListener('scroll', onReflow, true);
    document.removeEventListener('keydown', onKey);
    var hide = function () { root.hidden = true; };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) hide(); else setTimeout(hide, tok('--motion-duration-base', 220));
  }

  function onKey(e) { if (e.key === 'Escape') finish(); }

  // Rebuild central (mesure ajoutée / KPI configuré) → l'étape est-elle satisfaite ?
  function onRefresh() {
    if (!active) return;
    var step = STEPS[cur];
    if (typeof step.done === 'function' && step.done(data())) next();
    else if (active) positionOn(step);   // sinon, la carte a pu re-render → repositionner
  }

  function wrapRefresh(name) {
    var orig = window[name];
    window[name] = function () {
      var r = (typeof orig === 'function') ? orig.apply(this, arguments) : undefined;
      try { onRefresh(); } catch (e) {}
      return r;
    };
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    root = document.querySelector('[data-spotlight]');
    if (!root) return;
    ring = root.querySelector('[data-spotlight-ring]');
    bubble = root.querySelector('[data-spotlight-bubble]');
    eyebrowEl = root.querySelector('[data-spotlight-eyebrow]');
    titleEl = root.querySelector('[data-spotlight-title]');
    descEl = root.querySelector('[data-spotlight-desc]');
    skipBtn = root.querySelector('[data-spotlight-skip]');
    ctaBtn = root.querySelector('[data-spotlight-cta]');
    if (!ring || !bubble || !titleEl || !ctaBtn) return;

    skipBtn.addEventListener('click', function () { next(); });   // « Passer » = étape suivante
    ctaBtn.addEventListener('click', function () {
      var step = STEPS[cur];
      if (step.finish) { finish(); return; }
      var t = step.target && document.querySelector(step.target);
      if (t) t.click();   // ouvre la vraie modale ; l'avance se fait au rebuild (onRefresh)
    });

    wrapRefresh('CarryITRefreshDashboard');
    wrapRefresh('CarryITRefreshMoyen');

    // Démarrage (première étape non satisfaite). Laisser le dashboard peupler la donnée.
    setTimeout(function () {
      if (tourDone()) return;
      enter(firstIncomplete());
    }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
