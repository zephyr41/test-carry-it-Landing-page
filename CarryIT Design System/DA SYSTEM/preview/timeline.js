/* Timeline — rendu dynamique depuis localStorage (carryit_v1_jalons).
   États dérivés du statut : completed = fait, premier pending = courant, autres pending = à venir.
   Jalons cliquables : émettent l'événement `carryit:jalon-open` (l'app branche l'ouverture de la vue). */

(() => {
  const STORAGE_KEY = 'carryit_v1_jalons';
  const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  // Vide pur : on lit localStorage tel quel. Aucun seed. Les jalons sont créés
  // dans l'onboarding (objectif.html), jamais injectés ici.
  function loadJalons() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* JSON invalide → vide */ }
    return [];
  }

  function currentIndex(jalons) {
    const i = jalons.findIndex((j) => j.statut !== 'completed');
    return i === -1 ? jalons.length : i; // tout terminé → aucun courant
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderJalon(jalon, index, total, curIdx, showYear) {
    const li = el('li', 'ds-timeline__item');
    // État lu directement du statut du jalon (localStorage) : validé = "completed".
    if (jalon.statut === 'completed') li.classList.add('is-done');
    else if (index === curIdx) li.classList.add('is-current');

    const d = new Date(jalon.date);
    const rail = el('div', 'ds-timeline__rail');
    // Année affichée uniquement quand elle change (groupée) → pas de « 2026 » répété.
    if (showYear) rail.append(el('span', 'ds-timeline__year', String(d.getFullYear())));
    rail.append(el('span', 'ds-timeline__month', MONTHS_FR[d.getMonth()]));

    const marker = el('div', 'ds-timeline__marker');
    marker.setAttribute('aria-hidden', 'true');
    marker.append(el('span', 'ds-timeline__dot'));

    const btn = el('button', 'ds-timeline__content');
    btn.type = 'button';
    btn.dataset.jalonId = jalon.id;
    if (index === curIdx) btn.setAttribute('aria-current', 'step');
    btn.append(
      el('span', 'ds-timeline__title type-body-lg', jalon.titre),
      el('span', 'ds-timeline__jalon type-body-sm', `Jalon ${index + 1}/${total}`)
    );

    li.append(rail, marker, btn);
    return li;
  }

  // Carte « Jalon actif » : stepper horizontal reflétant le jalon en cours.
  function renderActiveCard(jalons, curIdx, total) {
    const card = document.querySelector('[data-jalon-active]');
    if (!card) return;
    if (curIdx >= total) {
      // Aucun jalon actif → état vide DS. La carte RESTE dans la grille (4 cartes = 12 col),
      // sinon la rangée perd une colonne et la grille casse.
      card.hidden = false;
      card.innerHTML =
        '<div class="ds-empty-state">' +
          '<svg class="ds-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M9 16V9M14 16V7M19 16v-4"/></svg>' +
          '<h3 class="type-h3 ds-empty-state__title">Aucun jalon actif</h3>' +
          '<p class="ds-empty-state__description type-body-md">Les jalons se créent dans l’onboarding.</p>' +
        '</div>';
      return;
    }
    card.hidden = false;
    const eyebrow = card.querySelector('[data-active-eyebrow]');
    const title = card.querySelector('[data-active-title]');
    const steps = card.querySelector('[data-active-steps]');
    if (!eyebrow || !title || !steps) return;
    eyebrow.textContent = `Jalon actif · ${curIdx + 1}/${total}`;
    title.textContent = jalons[curIdx].titre;
    steps.textContent = '';

    // Fenêtre de 5 (le stepper horizontal n'a pas de scroll). ≤ 5 jalons → tout affiché.
    // > 5 → fenêtre glissante : le courant tenu en slot 2 (1 validé visible à gauche),
    // décalage d'1 cran par validation ; en fin de liste, le courant dérive vers la droite.
    const WINDOW = 5;
    const start = Math.min(Math.max(curIdx - 1, 0), Math.max(total - WINDOW, 0));
    const end = Math.min(start + WINDOW, total);

    for (let i = start; i < end; i++) {
      const j = jalons[i];
      const li = el('li', 'ds-jalon-active__step');
      if (j.statut === 'completed') li.classList.add('is-done');
      else if (i === curIdx) li.classList.add('is-current');
      const dot = el('span', 'ds-jalon-active__dot');
      dot.setAttribute('aria-hidden', 'true');
      const label = (j.titre || '').trim().split(/\s+/)[0] || `J${i + 1}`; // 1er mot du titre
      li.append(dot, el('span', 'ds-jalon-active__label type-caption', label));
      steps.append(li);
    }
  }

  function render(root, jalons) {
    // Ordre chronologique croissant : le plus tôt à gauche (stepper) / en haut (liste),
    // le plus tard à droite/en bas. Indépendant de l'ordre de stockage localStorage.
    jalons = jalons.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const list = root.querySelector('[data-timeline-list]');
    const count = root.querySelector('[data-timeline-count]');
    const total = jalons.length;
    const curIdx = currentIndex(jalons);
    if (count) count.textContent = String(total);
    renderActiveCard(jalons, curIdx, total);

    // Tous les jalons rendus ; la liste scrolle dans la carte (voir CSS).
    list.textContent = '';
    let prevYear = null;
    for (let i = 0; i < total; i++) {
      const year = new Date(jalons[i].date).getFullYear();
      list.append(renderJalon(jalons[i], i, total, curIdx, year !== prevYear));
      prevYear = year;
    }

    // Fondu haut/bas seulement si la liste déborde réellement (scroll).
    requestAnimationFrame(() => {
      list.classList.toggle('is-scrollable', list.scrollHeight > list.clientHeight + 1);
    });
  }

  function init() {
    const root = document.querySelector('.ds-timeline');
    if (!root) return;
    const jalons = loadJalons();
    render(root, jalons);

    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.ds-timeline__content');
      if (!btn || !btn.dataset.jalonId) return;
      const item = btn.closest('.ds-timeline__item');
      root.querySelectorAll('.ds-timeline__item.is-selected')
        .forEach((n) => n.classList.remove('is-selected'));
      item.classList.add('is-selected');
      // L'app écoute cet événement pour ouvrir la vue du jalon.
      root.dispatchEvent(new CustomEvent('carryit:jalon-open', {
        bubbles: true,
        detail: { id: btn.dataset.jalonId },
      }));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
