/* Dashboard : sélecteur de projets (navbar). Liste carryItAllObjectifs, permet de
   changer de projet courant et d'en supprimer. Le projet courant est « projeté » dans
   les clés live lues par dashboard-final (carryItObjectifSMART + carryit_v1_*), puis reload. */
(function () {
  'use strict';

  function readJSON(k) {
    try {
      var r = localStorage.getItem(k);
      if (r == null || r === '') return null;
      var v = JSON.parse(r), g = 0;
      while (typeof v === 'string' && g++ < 3) { try { v = JSON.parse(v); } catch (e) { break; } }
      return v;
    } catch (e) { return null; }
  }
  function readArr(k) { var v = readJSON(k); return Array.isArray(v) ? v : []; }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(v) { var n = Number(v); return (v !== '' && v != null && isFinite(n)) ? n : null; }

  var TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>';

  var toggle, menu, list, label;

  function currentIndex(all) {
    var i = parseInt(localStorage.getItem('carryItEditingProjectIndex') || '0', 10);
    if (isNaN(i) || i < 0 || i >= all.length) i = 0;
    return i;
  }
  function projectTitle(obj, i) { return (obj && obj.titre) ? obj.titre : ('Projet ' + (i + 1)); }

  function render() {
    var all = readArr('carryItAllObjectifs');
    var cur = currentIndex(all);
    list.innerHTML = '';
    all.forEach(function (obj, i) {
      var li = document.createElement('li');
      li.className = 'ds-navbar__project-row' + (i === cur ? ' is-current' : '');
      li.dataset.index = i;
      li.innerHTML =
        '<button type="button" class="ds-navbar__project-pick" data-project-pick="' + i + '">' + esc(projectTitle(obj, i)) + '</button>' +
        '<button type="button" class="ds-navbar__project-del" data-project-del="' + i + '" aria-label="Supprimer le projet">' + TRASH + '</button>';
      list.appendChild(li);
    });
    // `name` vide = aucun projet nommé : la navbar affiche la marque en repli, mais le titre
    // d'onglet ne doit pas la répéter (« Carry It | Carry It »).
    var name = '';
    if (all.length) name = projectTitle(all[cur], cur);
    else { var s = readJSON('carryItObjectifSMART'); name = (s && typeof s === 'object' && s.titre) ? s.titre : ''; }
    if (label) label.textContent = name || 'Carry It';
    // Onglet : « Carry It | <projet> ». Le projet identifie l'onglet quand plusieurs
    // objectifs sont ouverts en parallèle.
    document.title = name ? 'Carry It | ' + name : 'Carry It';
  }

  // Projette un projet dans les clés live lues par dashboard-final.
  function projectInto(obj) {
    var gk = (obj.globalKpi && typeof obj.globalKpi === 'object') ? obj.globalKpi : {};
    localStorage.setItem('carryItObjectifSMART', JSON.stringify(obj));
    localStorage.setItem('carryit_v1_smart', JSON.stringify({
      S: obj.specifique || '', M: obj.mesurable || obj.kpiLabel || gk.label || '',
      A: obj.atteignable || '', R: obj.realiste || '', T: obj.temporel || '',
    }));
    localStorage.setItem('carryit_v1_kpi', JSON.stringify({
      label: gk.label || gk.titre || obj.kpiLabel || '',
      target: (gk.target != null ? gk.target : (gk.cible != null ? gk.cible : num(obj.kpiTarget))),
      cible: (gk.cible != null ? gk.cible : gk.target),
      unit: gk.unit || gk.unite || obj.kpiUnit || '',
      value: (gk.value != null ? gk.value : gk.valeur),
      measures: Array.isArray(gk.measures) ? gk.measures : (Array.isArray(obj.measures) ? obj.measures : []),
    }));
    localStorage.setItem('carryit_v1_jalons', JSON.stringify(Array.isArray(obj.jalons) ? obj.jalons : []));
    // Tâches par-projet : sans ça, au switch les clés live gardent les tâches de l'ancien
    // projet et le sync-retour (project-sync) les réécrit dans le nouveau (clobber).
    localStorage.setItem('carryit_v1_tasks', JSON.stringify(Array.isArray(obj.tasks) ? obj.tasks : []));
  }

  function switchProject(i) {
    var all = readArr('carryItAllObjectifs');
    if (!all[i]) return;
    localStorage.setItem('carryItEditingProjectIndex', String(i));
    projectInto(all[i]);
    window.location.reload();
  }

  // Projette le projet COURANT (tableau + index) dans les clés live. Appelé après un import
  // pour que la carte SMART / le KPI / les jalons affichent le même projet que le navbar.
  function projectCurrent() {
    var all = readArr('carryItAllObjectifs');
    if (!all.length) return;
    projectInto(all[currentIndex(all)]);
  }
  window.CarryITProjectCurrent = projectCurrent;

  function deleteProject(i) {
    var all = readArr('carryItAllObjectifs');
    if (!all[i]) return;
    all.splice(i, 1);
    localStorage.setItem('carryItAllObjectifs', JSON.stringify(all));
    if (all.length === 0) {
      ['carryItObjectifSMART', 'carryit_v1_smart', 'carryit_v1_kpi', 'carryit_v1_jalons', 'carryItEditingProjectIndex', 'carryItMilestones']
        .forEach(function (k) { localStorage.removeItem(k); });
      window.location.reload();
      return;
    }
    var cur = parseInt(localStorage.getItem('carryItEditingProjectIndex') || '0', 10);
    var next = cur > i ? cur - 1 : (cur === i ? Math.min(i, all.length - 1) : cur);
    localStorage.setItem('carryItEditingProjectIndex', String(next));
    projectInto(all[next]);
    window.location.reload();
  }

  // Confirmation inline (remplace la ligne) : action irréversible.
  function confirmDelete(i) {
    var row = list.querySelector('.ds-navbar__project-row[data-index="' + i + '"]');
    if (!row) return;
    var all = readArr('carryItAllObjectifs');
    row.className = 'ds-navbar__project-confirm';
    row.innerHTML =
      '<span class="ds-navbar__project-confirm-label">Supprimer « ' + esc(projectTitle(all[i], i)) + ' » ?</span>' +
      '<button type="button" class="ds-button ds-button--ghost ds-button--xs" data-project-cancel>Annuler</button>' +
      '<button type="button" class="ds-button ds-button--danger ds-button--xs" data-project-confirm="' + i + '">Supprimer</button>';
  }

  function openMenu() { menu.hidden = false; toggle.setAttribute('aria-expanded', 'true'); render(); }
  function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }

  function init() {
    toggle = document.querySelector('[data-project-toggle]');
    menu = document.querySelector('[data-project-menu]');
    list = document.querySelector('[data-project-list]');
    label = document.querySelector('[data-project-label]');
    if (!toggle || !menu || !list) return;

    render();   // label du projet courant au chargement

    toggle.addEventListener('click', function (e) { e.stopPropagation(); menu.hidden ? openMenu() : closeMenu(); });

    menu.addEventListener('click', function (e) {
      e.stopPropagation();
      var pick = e.target.closest('[data-project-pick]');
      if (pick) { switchProject(parseInt(pick.getAttribute('data-project-pick'), 10)); return; }
      var del = e.target.closest('[data-project-del]');
      if (del) { confirmDelete(parseInt(del.getAttribute('data-project-del'), 10)); return; }
      var conf = e.target.closest('[data-project-confirm]');
      if (conf) { deleteProject(parseInt(conf.getAttribute('data-project-confirm'), 10)); return; }
      if (e.target.closest('[data-project-cancel]')) { render(); return; }
      // (le lien « Ajouter un projet » navigue normalement)
    });

    document.addEventListener('click', function () { if (!menu.hidden) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
