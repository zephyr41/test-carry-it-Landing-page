/* Pattern Confirmation — un dialogue unique (role="alertdialog"), configuré par le déclencheur.
   Le déclencheur porte : data-title, data-desc, data-action-label, data-action-variant (danger|inverse).
   Focus par défaut sur Annuler (choix sûr). Fermeture : Annuler, clic backdrop, Échap.
   L'action réelle (supprimer/valider) = câblage produit ; ici on ferme juste. */

(() => {
  function init() {
    const modal = document.querySelector('[data-confirm]');
    if (!modal) return;
    const dialog = modal.querySelector('.ds-modal');
    const titleEl = modal.querySelector('[data-confirm-title]');
    const descEl = modal.querySelector('[data-confirm-desc]');
    const cancelBtn = modal.querySelector('[data-confirm-cancel]');
    const actionBtn = modal.querySelector('[data-confirm-action]');
    let lastTrigger = null;

    function open(trigger) {
      titleEl.textContent = trigger.dataset.title || 'Confirmer ?';
      descEl.textContent = trigger.dataset.desc || '';
      actionBtn.textContent = trigger.dataset.actionLabel || 'Confirmer';
      // variante d'action : danger (destructif) ou inverse (validation)
      const variant = trigger.dataset.actionVariant === 'inverse' ? 'inverse' : 'danger';
      actionBtn.classList.remove('ds-button--danger', 'ds-button--inverse');
      actionBtn.classList.add(`ds-button--${variant}`);
      modal.hidden = false;
      lastTrigger = trigger;
      cancelBtn.focus();   // défaut sûr = Annuler
    }

    function close() {
      modal.hidden = true;
      if (lastTrigger) lastTrigger.focus();
      lastTrigger = null;
    }

    document.querySelectorAll('[data-confirm-open]').forEach((t) => {
      t.addEventListener('click', () => open(t));
    });
    cancelBtn.addEventListener('click', close);
    actionBtn.addEventListener('click', close);   // démo : l'action réelle = câblage produit
    modal.addEventListener('click', (e) => { if (!dialog.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
