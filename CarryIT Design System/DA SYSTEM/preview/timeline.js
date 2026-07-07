/* Timeline — rendu dynamique depuis localStorage (carryit_v1_jalons).
   États dérivés du statut : completed = fait, premier pending = courant, autres pending = à venir.
   Jalons cliquables : émettent l'événement `carryit:jalon-open` (l'app branche l'ouverture de la vue). */

(() => {
  const STORAGE_KEY = 'carryit_v1_jalons';
  const SEED_VERSION_KEY = 'carryit_v1_jalons_seed_version';
  const SEED_VERSION = 6; // bump → réinjecte le seed de démo (écrase l'ancien état une fois)
  const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  // Données de démo (seed) : ordre chronologique (haut = le plus proche/tôt, bas = le plus lointain).
  // Jalon 1 validé → on est au jalon 2.
  const SEED = [
    { id: 'j1', date: '2026-04-01', titre: 'cadrage produit finalisé', statut: 'completed' },
    { id: 'j2', date: '2026-05-01', titre: 'POC (V0)', statut: 'pending' },
    { id: 'j3', date: '2026-06-01', titre: 'MVP carry it PRODUCTION', statut: 'pending' },
    { id: 'j4', date: '2026-07-01', titre: 'Lancement V1.0 (MMP). Premiers revenus/KPIs significatifs.', statut: 'pending' },
    { id: 'j5', date: '2026-09-01', titre: '1000 clients mensuels', statut: 'pending' },
  ];

  function loadJalons() {
    try {
      const version = Number(localStorage.getItem(SEED_VERSION_KEY));
      if (version === SEED_VERSION) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length) return parsed;
        }
      }
    } catch (e) { /* version/JSON invalide → on réinjecte le seed */ }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION));
    } catch (e) { /* stockage indisponible */ }
    return SEED;
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
    if (curIdx >= total) { card.hidden = true; return; } // tout validé → aucun jalon actif
    card.hidden = false;
    card.querySelector('[data-active-eyebrow]').textContent = `Jalon actif · ${curIdx + 1}/${total}`;
    card.querySelector('[data-active-title]').textContent = jalons[curIdx].titre;
    const steps = card.querySelector('[data-active-steps]');
    steps.textContent = '';
    jalons.forEach((j, i) => {
      const li = el('li', 'ds-jalon-active__step');
      if (j.statut === 'completed') li.classList.add('is-done');
      else if (i === curIdx) li.classList.add('is-current');
      const dot = el('span', 'ds-jalon-active__dot');
      dot.setAttribute('aria-hidden', 'true');
      li.append(dot, el('span', 'ds-jalon-active__label type-caption', `J${i + 1}`));
      steps.append(li);
    });
  }

  function render(root, jalons) {
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
