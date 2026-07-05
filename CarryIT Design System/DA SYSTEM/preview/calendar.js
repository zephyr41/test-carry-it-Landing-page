(function () {
  function init() {
    var el = document.getElementById('dsCalendar');
    if (!el || !window.calendarjs) return;

    window.calendarjs.setDictionary({
      January: 'Janvier', February: 'Février', March: 'Mars', April: 'Avril',
      May: 'Mai', June: 'Juin', July: 'Juillet', August: 'Août',
      September: 'Septembre', October: 'Octobre', November: 'Novembre', December: 'Décembre',
      Sunday: 'Dimanche', Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi',
      Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi',
    });

    var Calendar = window.calendarjs.Calendar;
    Calendar(el, {
      type: 'inline',
      startingDay: 1,
      footer: false,
    });

    // La lib auto-sélectionne toujours "aujourd'hui" (pas d'option pour désactiver).
    // On ne veut aucun jour surligné au chargement. On strip la sélection par défaut
    // (init + après chaque nav de mois qui reconstruit la grille) jusqu'à ce que
    // l'utilisateur clique réellement un jour → sélection normale reprend ensuite.
    var userPicked = false;
    function stripDefaultSelection() {
      if (userPicked) return;
      el.querySelectorAll('.lm-calendar-content > div[data-selected="true"]')
        .forEach(function (d) { d.setAttribute('data-selected', 'false'); });
    }
    stripDefaultSelection();

    var observer = new MutationObserver(stripDefaultSelection);
    observer.observe(el, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-selected'],
    });

    el.addEventListener('click', function (e) {
      if (e.target.closest('.lm-calendar-content > div[data-selected]')) {
        userPicked = true;
        observer.disconnect();
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
