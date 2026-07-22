/* ────────────────────────────────────────────────────────────────────────
   Onboarding : tour spotlight DIRIGISTE (auto-avance) en 4 étapes.

   1 · Long terme  → 1re mesure du KPI global   (carte graphique)
   2 · Moyen terme → définir le RÉSULTAT        (carte KPI résultat)
   3 · Moyen terme → définir l'EFFORT           (carte KPI effort)
   4 · To-do       → « Maintenant, commence. »

   Le tour bascule lui-même de vue et se repositionne. Il avance automatiquement
   quand l'action de l'étape est faite : on écoute le rebuild central
   (window.CarryITRefreshDashboard) et on ré-évalue le prédicat `done` de l'étape.
   Réutilise les vraies actions/modales (aucune logique dupliquée) : le CTA CLIQUE
   le vrai bouton de la page, et le tour s'efface le temps de la modale.

   ┌── COPY ──────────────────────────────────────────────────────────────┐
   │ Tous les textes affichés sont dans STEPS ci-dessous. Édite ICI (Nils). │
   └────────────────────────────────────────────────────────────────────────┘
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var STORAGE_KEY = 'carryit_onboard_done';   // tour terminé (finish ou Échap)

  var STEPS = [
    {
      id: 'measure', view: 'long',
      // Le halo tient TOUTE la carte graphique : l'étape parle de la courbe, pas du bouton.
      spot: '.ds-chart-card',
      cta: 'Ajouter ma première mesure',
      ctaTarget: '.ds-chart-add-btn',
      eyebrow: 'Point de départ',
      title: 'Où en es-tu ?',
      body: 'Ce graphique mesure ton objectif long terme (Mesurable du SMART). Maintenant, regardons ton niveau actuel.',
      skip: 'Passer',
      done: function (d) {
        var m = d.objectiveKpi && d.objectiveKpi.measures;
        return !!(m && m.length);
      },
    },
    {
      id: 'result', view: 'moyen', place: 'above',
      spot: '[data-spot="result-card"]',
      cta: 'Définir mon KPI',
      ctaTarget: '[data-kpi-type="lagging"][data-define-kpi], [data-kpi-type="lagging"][data-edit-kpi]',
      eyebrow: 'KPI de résultat',
      title: 'Mesure les résultats de ton jalon.',
      quoteLabel: 'Prends ton critère de validation :',
      quote: function (d) { return (d.activeJalon || {}).critere || ''; },
      // La 2e phrase nomme la BOUCLE : sans elle, le tour n'apprend qu'à définir des KPI,
      // jamais à les nourrir, et le dashboard reste à zéro un mois plus tard.
      body: "Qu'est-ce que tu dois mesurer pour l'atteindre ? Tu viens le noter dès que ton résultat augmente.",
      example: "Ex : « courir 21 km en moins de 3h » → les km de ta plus longue sortie tenue à l'allure cible. X/21.",
      skip: 'Passer', hint: true,
      done: function (d) { return !!d.resultKpi; },
    },
    {
      id: 'effort', view: 'moyen', place: 'right',
      spot: '[data-spot="effort-card"]',
      cta: 'Définir mon KPI',
      ctaTarget: '[data-kpi-type="leading"][data-define-kpi], [data-kpi-type="leading"][data-edit-kpi]',
      eyebrow: "KPI d'effort",
      title: 'Mesure les efforts.',
      quoteLabel: 'Ton KPI de résultat :',
      // La citation est le KPI RÉELLEMENT saisi à l'étape d'avant : on enchaîne sur sa donnée.
      quote: function (d) { return (d.resultKpi || {}).label || ''; },
      body: "Prends ton KPI de résultat : qu'est-ce que tu fais chaque semaine pour le faire bouger ? Tu viens le noter à chaque fois que tu avances.",
      example: "Ex : « km à l'allure cible » → nombre de séances par semaine.",
      skip: 'Passer', hint: true,
      done: function (d) { return !!d.effortKpi; },
    },
    {
      // La boucle, montrée au lieu d'être décrite : le halo tient le bouton qui sert à nourrir
      // le KPI, et le CTA l'ouvre pour de vrai. Sans mesure, tout ce qui précède reste à zéro.
      id: 'log-effort', view: 'moyen', place: 'right',
      spot: '[data-spot="effort-add"]',
      // KPI d'effort passé → le bouton n'existe pas : l'étape n'a rien à montrer.
      skipIf: function (d) { return !d.effortKpi; },
      cta: 'Ajouter un effort',
      ctaTarget: '[data-spot="effort-add"]',
      eyebrow: 'La boucle',
      title: 'Ton effort se note ici.',
      body: "Ce bouton alimente ton KPI d'effort : il mesure ce que tu fais. Tu viens le noter à chaque fois que tu avances.",
      // Rien à noter avant d'avoir fait quelque chose : passer est une réponse légitime.
      skip: 'Passer',
      done: function (d) {
        var m = d.effortKpi && d.effortKpi.measures;
        return !!(m && m.length);
      },
    },
    {
      // Même geste, autre carte : on le montre sans le faire faire (rien n'a encore bougé,
      // et un résultat inventé pour l'exercice fausserait la première mesure).
      id: 'log-result', view: 'moyen', place: 'left',
      spot: '[data-spot="result-add"]',
      skipIf: function (d) { return !d.resultKpi; },
      cta: 'Suivant',
      eyebrow: 'La boucle',
      title: 'Pareil pour ton résultat.',
      body: 'Ce bouton-là alimente ton KPI de résultat. Tu viens le noter dès que ton résultat bouge.',
    },
    {
      id: 'go', view: 'todo',
      spot: '[data-todo-root]',
      cta: "C'est parti", finish: true,
      eyebrow: 'Exécution',
      title: 'Maintenant, commence.',
      body: 'Ajoute ta première tâche. Et commence à exécuter.',
      skip: 'Passer',
    },
  ];

  // Modales que le tour ouvre lui-même : tant que l'une est ouverte, le tour s'efface.
  var MODALS = '[data-kpi-modal], [data-measure-modal], [data-effort-modal]';

  // Filet des étapes KPI. JAMAIS affiché d'emblée : le montrer à tout le monde reviendrait à
  // souffler d'abandonner avant même d'avoir essayé, et à consoler pour un effort pas fourni.
  // Il ne sort que sur une hésitation constatée : la modale ouverte puis annulée (la personne
  // a cherché et n'a pas trouvé), ou du temps passé sur l'étape sans rien ouvrir.
  var HINT = 'Pas encore clair ? Passe : le KPI se précise en exécutant. Ou demande une proposition à une IA.';
  var HINT_DELAY = 25000;

  var root, ring, bubble, eyebrowEl, stepsEl, titleEl, quoteLabelEl, quoteEl, descEl,
      ruleEl, exampleEl, hintEl, backBtn, skipBtn, ctaBtn, restartBtn;
  var cur = -1, active = false, paused = false, everStarted = false;
  var hintFor = {}, hintTimer = null;   // étapes où l'hésitation a déjà été constatée
  var seq = 0;              // annule les transitions de vue en vol (double clic sur « Passer »)
  var scrolledFor = null;   // id d'étape déjà recentrée (un seul essai de scroll par étape)

  function tok(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return isFinite(n) ? n : fallback;
  }
  var PAD = tok('--space-8', 8), GAP = tok('--space-16', 16), EDGE = tok('--space-16', 16);

  function tourDone() { try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; } }
  function markTourDone() { try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {} }

  function data() {
    return (typeof window.CarryITBuildDashboardData === 'function')
      ? window.CarryITBuildDashboardData()
      : (window.CarryITDashboardData || {});
  }

  function stepDone(i, d) {
    var s = STEPS[i];
    return typeof s.done === 'function' ? s.done(d) : false;
  }

  // Étape sans objet dans l'état courant (ex : nourrir un KPI d'effort qui n'existe pas).
  function stepSkipped(i, d) {
    var s = STEPS[i];
    return !!(s && typeof s.skipIf === 'function' && s.skipIf(d));
  }

  // Index suivant/précédent réellement affichable, en sautant les étapes sans objet.
  function seek(from, dir) {
    var d = data();
    for (var i = from + dir; i >= 0 && i < STEPS.length; i += dir) {
      if (!stepSkipped(i, d)) return i;
    }
    return -1;
  }

  // Première étape non satisfaite (reprise après reload). Une étape sans `done` est terminale.
  function firstIncomplete() {
    var d = data();
    for (var i = 0; i < STEPS.length; i++) {
      if (stepSkipped(i, d)) continue;
      if (typeof STEPS[i].done !== 'function') return i;   // terminale
      if (!STEPS[i].done(d)) return i;
    }
    return STEPS.length - 1;
  }

  // Tout ce que le guide fait remplir est rempli → plus rien à reprendre.
  function allFilled() {
    var d = data();
    for (var i = 0; i < STEPS.length; i++) {
      if (stepSkipped(i, d)) continue;
      if (typeof STEPS[i].done === 'function' && !STEPS[i].done(d)) return false;
    }
    return true;
  }

  function modalOpen() {
    return Array.prototype.some.call(document.querySelectorAll(MODALS), function (m) { return !m.hidden; });
  }

  // ── Rendu du contenu de la bulle ─────────────────────────────────────────
  function renderSteps(activeIndex) {
    if (!stepsEl) return;
    // Un segment par étape RÉELLEMENT parcourue : une étape sans objet ne compte pas, sinon
    // la barre promet un pas de plus qui n'arrivera jamais.
    var d = data(), html = '', shown = 0, pos = 0;
    for (var k = 0; k < STEPS.length; k++) {
      if (stepSkipped(k, d)) continue;
      shown++;
      if (k === activeIndex) pos = shown;
      // Segments CUMULATIFS : les étapes franchies restent pleines → on voit le chemin fait.
      html += '<span' + (k <= activeIndex ? ' class="is-active"' : '') + '></span>';
    }
    stepsEl.innerHTML = html;
    stepsEl.setAttribute('aria-label', 'Étape ' + pos + ' sur ' + shown);
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text || '';
    el.hidden = !text;
  }

  function setCopy(step) {
    var d = data();
    eyebrowEl.textContent = step.eyebrow || '';
    titleEl.textContent = step.title || '';

    var quote = typeof step.quote === 'function' ? step.quote(d) : (step.quote || '');
    setText(quoteLabelEl, quote ? (step.quoteLabel || '') : '');
    setText(quoteEl, quote ? '« ' + quote + ' »' : '');
    // Citation présente → la question qui suit passe en blanc : c'est elle l'instruction.
    descEl.textContent = (typeof step.body === 'function') ? step.body(d) : (step.body || '');
    descEl.classList.toggle('ds-spotlight__desc--lead', !!quote);

    setText(exampleEl, step.example || '');
    if (ruleEl) ruleEl.hidden = !step.example;
    // Une fois méritée, la ligne reste : revenir sur l'étape ne remet pas le compteur à zéro.
    setText(hintEl, (step.hint && hintFor[step.id]) ? HINT : '');

    ctaBtn.textContent = step.cta || 'Continuer';
    setText(skipBtn, step.skip || '');
    // Un CTA dont la cible n'existe pas avalait le clic en silence. Il se désactive plutôt
    // que de faire croire à une action.
    ctaBtn.disabled = !!(step.ctaTarget && !document.querySelector(step.ctaTarget));
  }

  // ── Placement ────────────────────────────────────────────────────────────
  function positionCentered() {
    ring.style.display = 'none';
    root.classList.add('ds-spotlight--centered');
    var bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    bubble.style.left = Math.round((window.innerWidth - bw) / 2) + 'px';
    bubble.style.top = Math.round((window.innerHeight - bh) / 2) + 'px';
  }

  function clamp(v, min, max) { return Math.min(Math.max(v, min), Math.max(max, min)); }

  // Pose le halo sur un rectangle écran (cible ou onglet), sans toucher à la bulle.
  function ringOn(r) {
    ring.style.display = '';
    root.classList.remove('ds-spotlight--centered');
    ring.style.left = (r.left - PAD) + 'px';
    ring.style.top = (r.top - PAD) + 'px';
    ring.style.width = (r.width + PAD * 2) + 'px';
    ring.style.height = (r.height + PAD * 2) + 'px';
  }

  // Certaines cibles ne sont visibles qu'au survol de leur carte (actions du head). Le halo
  // les désignerait à vide : on les force visibles tant que l'étape les vise. Ré-appliqué à
  // chaque positionnement, car les cartes se re-rendent (innerHTML) et perdent la classe.
  var SPOTLIT = 'is-spotlit';
  function markSpotlit(target) {
    Array.prototype.forEach.call(document.querySelectorAll('.' + SPOTLIT), function (el) {
      el.classList.remove(SPOTLIT);
    });
    if (!target) return;
    // La cible EST une action de carte, ou elle en contient (halo posé sur les deux cartes).
    var host = target.closest && target.closest('.ds-kpi-card__head-actions');
    if (host) host.classList.add(SPOTLIT);
    Array.prototype.forEach.call(target.querySelectorAll('.ds-kpi-card__head-actions'), function (el) {
      el.classList.add(SPOTLIT);
    });
  }

  function positionOn(step) {
    if (!step.spot) { markSpotlit(null); positionCentered(); return true; }
    var target = document.querySelector(step.spot);
    if (!target) return false;                       // pas encore rendu → retry
    markSpotlit(target);
    var r0 = target.getBoundingClientRect();
    if (r0.width === 0 && r0.height === 0) return false;

    // Cible hors zone confortable → UN seul recentrage par étape (pas de boucle scroll/replace).
    if (scrolledFor !== step.id && (r0.top < 80 || r0.bottom > window.innerHeight * 0.72)) {
      scrolledFor = step.id;
      var maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      var y = clamp(r0.top + window.scrollY - (window.innerHeight - r0.height) / 2, 0, maxY);
      if (Math.abs(y - window.scrollY) > 4) {
        window.scrollTo({ top: y, behavior: 'smooth' });
        setTimeout(function () { if (active) positionOn(step); }, 450);
        return true;
      }
    }

    var r = target.getBoundingClientRect();
    ringOn(r);

    var vw = window.innerWidth, vh = window.innerHeight;
    var bw = bubble.offsetWidth, bh = bubble.offsetHeight;   // hauteur RÉELLE, pas estimée
    var top = r.top - PAD, left = r.left - PAD;
    var right = r.right + PAD, bottom = r.bottom + PAD;
    var x, y;

    if (step.place === 'right' && right + GAP + bw < vw) {
      x = right + GAP;
      y = clamp(top, EDGE, vh - bh - EDGE);
    } else if (step.place === 'left' && left - GAP - bw > EDGE) {
      x = left - GAP - bw;
      y = clamp(top, EDGE, vh - bh - EDGE);
    } else if (step.place === 'above') {
      y = Math.max(top - bh - GAP, EDGE);
      x = clamp(left, EDGE, vw - bw - EDGE);
    } else if (bottom + GAP + bh < vh) {
      y = bottom + GAP;
      x = clamp(left, EDGE, vw - bw - EDGE);
    } else {
      y = Math.max(top - bh - GAP, EDGE);
      x = clamp(left, EDGE, vw - bw - EDGE);
    }

    bubble.style.left = Math.round(x) + 'px';
    bubble.style.top = Math.round(y) + 'px';
    return true;
  }

  var onReflow = function () { if (active && !paused) positionOn(STEPS[cur]); };

  // Hésitation constatée sur une étape KPI → le filet sort (et la bulle se repose, elle a grandi).
  function earnHint(i) {
    var step = STEPS[i];
    if (!step || !step.hint || hintFor[step.id]) return;
    hintFor[step.id] = true;
    if (cur !== i || !active) return;
    setText(hintEl, HINT);
    if (!paused) positionOn(step);
  }

  function armHint(i) {
    clearTimeout(hintTimer);
    if (!STEPS[i] || !STEPS[i].hint || hintFor[STEPS[i].id]) return;
    hintTimer = setTimeout(function () { earnHint(i); }, HINT_DELAY);
  }

  // ── Passage à une étape ──────────────────────────────────────────────────
  function currentView() {
    var tab = document.querySelector('.ds-tabs__tab[aria-selected="true"]');
    return tab ? tab.dataset.view : null;
  }

  function showView(view) {
    var tab = document.querySelector('.ds-tabs__tab[data-view="' + view + '"]');
    if (tab) tab.click();
  }

  // Étapes jalon : forcer le détail sur le jalon ACTIF, même si l'onglet moyen était déjà
  // sélectionné (sinon le KPI se définit sur le mauvais jalon et `done` ne se satisfait jamais).
  function focusActiveJalon(step) {
    if (step.view !== 'moyen' || typeof window.CarryITShowJalon !== 'function') return;
    var aj = data().activeJalon;
    if (aj && aj.id != null) window.CarryITShowJalon(aj.id);
  }

  function place(step, tries) {
    var ok = positionOn(step);
    if (!ok && (tries || 0) < 14) { setTimeout(function () { place(step, (tries || 0) + 1); }, 90); return; }
    if (!ok) positionCentered();
    bubble.classList.remove('ds-spotlight__bubble--hidden');
    root.classList.add('is-active');
    // Le CTA prend le focus : c'est l'action attendue, et ça amène le clavier dans la bulle.
    if (ctaBtn && !bubble.contains(document.activeElement)) ctaBtn.focus({ preventScroll: true });
  }

  function enter(i) {
    var step = STEPS[i];
    if (!step) { finish(); return; }
    var mine = ++seq;
    cur = i;
    active = true;
    paused = false;
    everStarted = true;
    scrolledFor = null;
    syncRestart();

    setCopy(step);
    renderSteps(i);
    armHint(i);
    if (backBtn) backBtn.hidden = (i === 0);

    root.hidden = false;
    setPageInert(true);
    bubble.classList.add('ds-spotlight__bubble--hidden');

    var start = function () {
      if (seq !== mine) return;
      focusActiveJalon(step);
      requestAnimationFrame(function () { if (seq === mine) place(step); });
    };

    if (step.view && step.view !== currentView()) {
      // Guide l'œil : le halo glisse d'abord sur l'ONGLET, la vue bascule, puis il rejoint
      // la cible. Sans cette étape, la vue change sous un halo resté sur l'ancienne carte.
      var tab = document.querySelector('.ds-tabs__tab[data-view="' + step.view + '"]');
      if (tab) { ringOn(tab.getBoundingClientRect()); root.classList.add('is-active'); }
      setTimeout(function () {
        if (seq !== mine) return;
        showView(step.view);
        setTimeout(start, 450);
      }, 500);
    } else {
      start();
    }

    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    document.addEventListener('keydown', onKey);
  }

  function next() {
    var i = seek(cur, 1);
    if (i >= 0) enter(i); else finish();
  }

  function prev() {
    var i = seek(cur, -1);
    if (i >= 0) enter(i);
  }

  function finish() { stop(true); }

  // Efface le tour le temps d'une modale : il reprendra sur la même étape à la fermeture.
  function pause() {
    paused = true;
    clearTimeout(hintTimer);   // le temps passé dans la modale n'est pas de l'hésitation
    setPageInert(false);       // sinon la modale que le tour vient d'ouvrir serait inerte
    root.classList.remove('is-active');
    setTimeout(function () { if (paused) root.hidden = true; }, tok('--motion-duration-base', 220));
  }

  function resume() {
    if (!active || !paused) return;
    paused = false;
    if (stepDone(cur, data())) { next(); return; }
    // Modale ouverte puis fermée sans rien enregistrer : la personne a cherché sans trouver.
    if (STEPS[cur] && STEPS[cur].hint) hintFor[STEPS[cur].id] = true;
    enter(cur);
  }

  function stop(persist) {
    seq++;
    clearTimeout(hintTimer);
    markSpotlit(null);   // les actions de carte reviennent à leur révélation au survol
    setPageInert(false);
    if (persist) markTourDone();
    active = false;
    paused = false;
    root.classList.remove('is-active');
    window.removeEventListener('resize', onReflow);
    window.removeEventListener('scroll', onReflow, true);
    document.removeEventListener('keydown', onKey);
    var hide = function () { root.hidden = true; };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) hide(); else setTimeout(hide, tok('--motion-duration-base', 220));
    syncRestart();
  }

  // ── Accès clavier ────────────────────────────────────────────────────────
  // Sans ça, la bulle arrive après 40+ tabulations : le tour est visible mais inatteignable
  // au clavier, et le focus continue de parcourir la page sous le voile.
  function focusables() {
    return Array.prototype.filter.call(
      bubble.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.hidden && el.offsetParent !== null; }
    );
  }

  // Le reste de la page devient inerte tant que le tour a la main. `inert` retire aussi les
  // éléments de l'ordre de tabulation ET du lecteur d'écran, ce qu'aucun piège JS ne fait.
  function setPageInert(on) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === root || el === restartBtn) return;
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  function onKey(e) {
    if (e.key === 'Escape' && !paused) { finish(); return; }
    if (e.key !== 'Tab' || paused) return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    // Boucle : la tabulation reste dans la bulle tant que l'étape est ouverte.
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!bubble.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  }

  // ── Reprise du guide ─────────────────────────────────────────────────────
  function syncRestart() {
    if (!restartBtn) return;
    restartBtn.hidden = active || !everStarted || allFilled();
  }

  // Rebuild central (mesure ajoutée / KPI configuré) → l'étape est-elle satisfaite ?
  function onRefresh() {
    syncRestart();
    if (!active) return;
    if (stepDone(cur, data())) { next(); return; }
    if (!paused) positionOn(STEPS[cur]);   // la carte a pu re-render → repositionner
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
    titleEl = root.querySelector('[data-spotlight-title]');
    quoteLabelEl = root.querySelector('[data-spotlight-quote-label]');
    quoteEl = root.querySelector('[data-spotlight-quote]');
    descEl = root.querySelector('[data-spotlight-desc]');
    ruleEl = root.querySelector('[data-spotlight-rule]');
    exampleEl = root.querySelector('[data-spotlight-example]');
    hintEl = root.querySelector('[data-spotlight-hint]');
    backBtn = root.querySelector('[data-spotlight-back]');
    skipBtn = root.querySelector('[data-spotlight-skip]');
    ctaBtn = root.querySelector('[data-spotlight-cta]');
    restartBtn = document.querySelector('[data-spotlight-restart]');
    if (!ring || !bubble || !titleEl || !ctaBtn) return;

    if (backBtn) backBtn.addEventListener('click', function () { prev(); });
    var closeBtn = root.querySelector('[data-spotlight-close]');
    if (closeBtn) closeBtn.addEventListener('click', function () { finish(); });
    // Un seul mot pour avancer (« Passer »), un seul geste pour quitter (la croix) : le
    // tour avait quatre libellés pour deux concepts, impossible d'en apprendre la règle.
    skipBtn.addEventListener('click', function () { next(); });
    ctaBtn.addEventListener('click', function () {
      var step = STEPS[cur];
      if (!step) return;
      if (step.finish) { finish(); return; }
      // Étape sans cible d'action (elle montre, elle ne fait pas faire) : le CTA acquitte.
      if (!step.ctaTarget) { next(); return; }
      var t = document.querySelector(step.ctaTarget);
      if (!t) return;
      pause();               // la modale prend la main ; on revient à sa fermeture
      t.click();
    });
    if (restartBtn) restartBtn.addEventListener('click', function () {
      restartBtn.hidden = true;
      enter(firstIncomplete());
    });

    // Fermeture d'une modale ouverte par le tour (Annuler / Échap / croix) → on revient.
    // L'enregistrement passe, lui, par onRefresh, qui fait avancer d'une étape.
    if (window.MutationObserver) {
      var obs = new MutationObserver(function () {
        if (paused && !modalOpen()) resume();
      });
      Array.prototype.forEach.call(document.querySelectorAll(MODALS), function (m) {
        obs.observe(m, { attributes: true, attributeFilter: ['hidden'] });
      });
    }

    wrapRefresh('CarryITRefreshDashboard');
    wrapRefresh('CarryITRefreshMoyen');

    // Démarrage (première étape non satisfaite). Laisser le dashboard peupler la donnée.
    setTimeout(function () {
      if (tourDone()) { everStarted = true; syncRestart(); return; }
      // Rien à guider tant que l'objectif et le jalon n'existent pas : le tour parlerait de
      // « ton jalon » devant un écran « Aucun jalon », et ses cibles n'existeraient pas.
      // Ce chemin est celui de quelqu'un qui arrive au dashboard avant l'onboarding SMART.
      var d = data();
      if (!d.objectiveKpi || !d.objectiveKpi.label || !d.activeJalon) return;
      enter(firstIncomplete());
    }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
