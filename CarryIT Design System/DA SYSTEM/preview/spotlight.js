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

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var STEPS = [
    {
      id: 'measure', view: 'long',
      target: '.ds-chart-add-btn',
      // Le trou reste sur le bouton (= « ajouter une mesure », c'est CE bouton qui alimente
      // le KPI global). La bulle s'aligne à gauche sur la carte du graphe : elle tombe sur la
      // zone vide du graphique au lieu de recouvrir la carte SMART, qu'on doit pouvoir lire.
      bubbleAnchor: '.ds-chart-card',
      // Second point éclairé : la ligne M du SMART. C'est elle que le graphe trace — les deux
      // allumés en même temps, on fait le lien « mesurable du SMART = cette courbe ».
      lit: '[data-smart-row="mesurable"]',
      eyebrow: 'POINT DE DÉPART',
      title: 'Où en es-tu ?',
      // Fonction : le Mesurable est nommé en clair (repris du SMART), sinon la phrase parlerait
      // d'un « Mesurable » abstrait alors qu'il est juste à côté, surligné.
      desc: function (d) {
        var m = (d.smart && d.smart.mesurable) || (d.objectiveKpi && d.objectiveKpi.label) || '';
        return 'Ce graphique trace ton Mesurable de ton objectif long terme' +
          (m ? ' : <strong>' + esc(m) + '</strong>' : '') +
          '. Il démarre à 0. Maintenant, dis où tu en es vraiment';
      },
      skip: 'Plus tard', cta: 'Ajouter ma première mesure',
      done: function (d) { return d.objectiveKpi && Array.isArray(d.objectiveKpi.measures) && d.objectiveKpi.measures.length > 0; },
    },
    {
      id: 'result', view: 'moyen',
      target: '[data-kpi-type="lagging"][data-define-kpi], [data-kpi-type="lagging"][data-edit-kpi]',
      eyebrow: 'Résultat',
      title: 'Mesure les résultats de ton jalon.',
      recall: function (d) {
        return { label: 'Ton critère de validation', text: (d.activeJalon || {}).critere || '' };
      },
      desc: "Prends ton critère de validation : qu'est-ce que tu dois mesurer pour l'atteindre ? Ex : « courir 21 km en moins de 3h » → les km de ta plus longue sortie tenue à l'allure cible. X/21.",
      skip: 'Passer', cta: 'Définir',
      done: function (d) { return !!d.resultKpi; },
    },
    {
      id: 'effort', view: 'moyen',
      target: '[data-kpi-type="leading"][data-define-kpi], [data-kpi-type="leading"][data-edit-kpi]',
      eyebrow: 'Effort',
      title: 'Mesure les efforts que tu fais pour atteindre ton résultat.',
      recall: function (d) {
        return { label: 'Ton résultat', text: (d.resultKpi || {}).label || '' };
      },
      desc: "Prends ton résultat : qu'est-ce que tu fais chaque semaine pour le faire bouger ? Ex : « km à l'allure cible » → nombre de séances par semaine. X/3.",
      skip: 'Passer', cta: 'Définir',
      done: function (d) { return !!d.effortKpi; },
    },
    {
      id: 'start', view: 'todo',
      target: null,   // centré, pas de cible
      eyebrow: 'Exécution',
      title: 'Maintenant, commence.',
      desc: 'Ajoute ta première tâche. Et commence à exécuter.',
      skip: 'Passer', cta: "C'est parti",
      finish: true,
    },
  ];

  var root, ring, bubble, eyebrowEl, stepsEl, titleEl, critEl, critLabelEl, critTextEl, descEl,
      backBtn, skipBtn, ctaBtn;
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
  // Indicateur d'étapes : un segment par étape du tour, l'étape courante en surbrillance.
  function renderSteps(activeIndex) {
    if (!stepsEl) return;
    var html = '';
    for (var k = 0; k < STEPS.length; k++) {
      html += '<span' + (k === activeIndex ? ' class="is-active"' : '') + '></span>';
    }
    stepsEl.innerHTML = html;
    stepsEl.setAttribute('aria-label', 'Étape ' + (activeIndex + 1) + ' sur ' + STEPS.length);
  }

  function setCopy(step) {
    eyebrowEl.textContent = step.eyebrow || '';
    titleEl.textContent = step.title || '';
    descEl.innerHTML = (typeof step.desc === 'function') ? step.desc(data()) : (step.desc || '');
    // Encart de rappel : l'élément déjà défini sur lequel s'appuie l'étape courante
    // (critère du jalon pour le KPI de résultat, KPI de résultat pour le KPI d'effort).
    // Masqué si l'étape n'en déclare pas, ou si la valeur est vide (étape précédente passée).
    if (critEl) {
      var rec = (typeof step.recall === 'function') ? step.recall(data()) : null;
      if (rec && rec.text) {
        critLabelEl.textContent = rec.label;
        critTextEl.textContent = rec.text;
        critEl.hidden = false;
      } else { critEl.hidden = true; }
    }
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

  // Zones secondaires éclairées : passées au-dessus du scrim par une classe. Ré-appliqué à
  // chaque positionnement, car les cartes se re-rendent (innerHTML) et perdent la classe.
  var LIT_CLASS = 'ds-spotlight-lit';
  function clearLit() {
    Array.prototype.forEach.call(document.querySelectorAll('.' + LIT_CLASS), function (el) {
      el.classList.remove(LIT_CLASS);
    });
  }
  function applyLit(step) {
    clearLit();
    if (!step || !step.lit) return;
    var el = document.querySelector(step.lit);
    if (el) el.classList.add(LIT_CLASS);
  }

  function positionOn(step) {
    applyLit(step);
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
    // `bubbleAnchor` (optionnel) : la bulle se cale sur le bord droit de CET élément plutôt
    // que sous la cible — elle reste dans la carte au lieu de déborder sur la carte voisine.
    var anchor = step.bubbleAnchor && document.querySelector(step.bubbleAnchor);
    var left = anchor ? (anchor.getBoundingClientRect().right - bw) : (r.left - PAD);
    var maxLeft = window.innerWidth - bw - EDGE;
    if (left > maxLeft) left = maxLeft;
    if (left < EDGE) left = EDGE;
    bubble.style.left = left + 'px';
    bubble.style.top = top + 'px';
    // La flèche suit la cible tant qu'elle reste dans la bulle (bulle décalée → sinon elle
    // pointerait le vide).
    var tail = Math.min(Math.max(r.left + r.width / 2 - left - 6, 24), bw - 36);
    bubble.style.setProperty('--spotlight-tail-x', Math.round(tail) + 'px');
    bubble.classList.toggle('ds-spotlight__bubble--above', above);
    return true;
  }

  var onReflow = function () { if (active) positionOn(STEPS[cur]); };

  // ── Passage à une étape ──────────────────────────────────────────────────
  function ensureView(step) {
    if (!step.view) return;
    var tab = document.querySelector('.ds-tabs__tab[data-view="' + step.view + '"]');
    if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    // Étapes jalon (vue moyen) : forcer le détail sur le jalon ACTIF, même si l'onglet moyen
    // était déjà sélectionné (sinon le clic ci-dessus est sauté et la vue garde un autre jalon
    // sélectionné → le KPI se définit sur le mauvais jalon et done (jalon actif) ne se satisfait
    // jamais → l'étape boucle). CarryITShowJalon n'est pas wrappé → pas de re-déclenchement.
    if (step.view === 'moyen' && typeof window.CarryITShowJalon === 'function') {
      var aj = data().activeJalon;
      if (aj && aj.id != null) window.CarryITShowJalon(aj.id);
    }
  }

  function enter(i) {
    cur = i;
    var step = STEPS[i];
    setCopy(step);
    renderSteps(i);
    if (backBtn) backBtn.disabled = (i === 0);
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

  function prev() { if (cur > 0) enter(cur - 1); }

  function finish() { stop(true); }

  function stop(persist) {
    clearLit();
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
    stepsEl = root.querySelector('[data-spotlight-steps]');
    critEl = root.querySelector('[data-spotlight-criteria]');
    critLabelEl = root.querySelector('[data-spotlight-criteria-label]');
    critTextEl = root.querySelector('[data-spotlight-criteria-text]');
    titleEl = root.querySelector('[data-spotlight-title]');
    descEl = root.querySelector('[data-spotlight-desc]');
    backBtn = root.querySelector('[data-spotlight-back]');
    skipBtn = root.querySelector('[data-spotlight-skip]');
    ctaBtn = root.querySelector('[data-spotlight-cta]');
    if (!ring || !bubble || !titleEl || !ctaBtn) return;

    if (backBtn) backBtn.addEventListener('click', function () { prev(); });
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
