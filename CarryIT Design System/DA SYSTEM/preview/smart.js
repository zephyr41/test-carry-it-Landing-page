/* SMART card : accordéon inline.
   Les champs longs (A/R) sont réduits à 2 lignes ; un « Voir plus ⌄ » n'est injecté QUE si le
   texte déborde vraiment (mesuré). Clic → déplie le texte inline (la carte grandit ; la page peut
   scroller = comportement standard/premium, la carte reste courte tant qu'on ne déplie pas).
   Chevron pivoté + « Voir moins ⌃ » une fois ouvert. */

(() => {
  const CHEVRON = '<svg class="ds-smart__more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function setLabel(btn, expanded) {
    btn.innerHTML = (expanded ? 'Voir moins' : 'Voir plus') + CHEVRON;
    btn.setAttribute('aria-expanded', String(expanded));
  }

  function setup(text) {
    const body = text.closest('.ds-smart__body');
    if (!body || !text.classList.contains('ds-smart__text--clamp')) return;

    // Déborde-t-il vraiment une fois réduit ? Sinon pas de bouton.
    if (text.scrollHeight <= text.clientHeight + 1) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ds-smart__more';
    setLabel(btn, false);
    btn.addEventListener('click', () => {
      const expanded = text.classList.toggle('is-expanded');
      setLabel(btn, expanded);
    });
    body.append(btn);
  }

  function init() {
    document.querySelectorAll('.ds-smart__text').forEach(setup);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
