/* SMART card — texte complet dans un Modal (la carte ne grandit ni ne scrolle JAMAIS).
   Les champs longs (A/R) sont réduits à 2 lignes ; un « Voir plus » n'est injecté QUE si le texte
   déborde vraiment (mesuré). Clic → ouvre le Modal (titre = dimension, corps = texte complet).
   Fermeture : croix, clic backdrop, Échap. Le focus revient sur le déclencheur. */

(() => {
  const ICON = '<svg class="ds-smart__more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  function init() {
    const modal = document.querySelector('[data-smart-modal]');
    if (!modal) return;
    const titleEl = modal.querySelector('[data-smart-modal-title]');
    const textEl = modal.querySelector('[data-smart-modal-text]');
    const closeBtn = modal.querySelector('[data-smart-modal-close]');
    const dialog = modal.querySelector('.ds-modal');
    let lastTrigger = null;

    function open(dimension, fullText, trigger) {
      titleEl.textContent = dimension;
      textEl.textContent = fullText;
      modal.hidden = false;
      lastTrigger = trigger;
      closeBtn.focus();
    }

    function close() {
      modal.hidden = true;
      if (lastTrigger) lastTrigger.focus();
      lastTrigger = null;
    }

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (!dialog.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

    document.querySelectorAll('.ds-smart__text--clamp').forEach((text) => {
      // Déborde-t-il vraiment une fois réduit ? Sinon pas de bouton.
      if (text.scrollHeight <= text.clientHeight + 1) return;
      const body = text.closest('.ds-smart__body');
      const dimension = body.querySelector('.ds-smart__dimension');
      const label = dimension ? dimension.textContent.trim() : '';
      const full = text.textContent;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ds-smart__more';
      btn.innerHTML = 'Voir plus' + ICON;
      btn.addEventListener('click', () => open(label, full, btn));
      body.append(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
