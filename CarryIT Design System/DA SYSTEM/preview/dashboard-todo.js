/* dashboard-todo.js — Vue To-do (Exécution).
   Porté de la to-do de dashboard.html, adapté aux tokens/composants du DA SYSTEM.
   - Tâches scopées au JALON visionné (barre de switch jalon en haut, comme le project switcher legacy).
   - Liste = 3 blocs repliables (En cours / À faire / Terminé), chaque bloc = dropzone (drag inter-bloc = change le statut).
   - Board (Kanban) = 3 colonnes, add-card dans « À faire », drag entre colonnes.
   - Sous-tâches dépliées inline sous la row (chevron) + panneau détail (modal) au ⋯.
   Data : carryit_v1_tasks (clé plate). Tâche = {id,text,status:todo|doing|done,done,jalonId,subtasks:[{id,text,done}]}. */
(function () {
  'use strict';

  var DOTS = '<span class="ds-row-action__dots" aria-hidden="true">⋯</span>';
  var CROSS = '<svg class="ds-row-action__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>';
  var SUB_ICON = '<svg class="ds-checkbox__mark" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" /></svg>';

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ── Données ──────────────────────────────────────────────────────
  function data() { return window.CarryITDashboardData || { tasks: [], jalons: [] }; }
  function allTasks() { var t = data().tasks; return Array.isArray(t) ? t : []; }
  function jalonsSorted() {
    return (data().jalons || []).slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
  }

  // ── État de vue ──────────────────────────────────────────────────
  var selectedJalonId = null;    // jalon visionné
  var todoView = 'list';          // 'list' | 'kanban'
  var groupCollapsed = {};        // { status: bool }
  var subOpen = {};               // { taskId: bool }

  function ensureSelectedJalon() {
    var list = jalonsSorted();
    if (!list.length) { selectedJalonId = null; return; }
    var exists = list.some(function (j) { return String(j.id) === String(selectedJalonId); });
    if (!exists) {
      var active = list.find(function (j) { return j.statut === 'in_progress'; })
        || list.find(function (j) { return j.statut !== 'completed'; })
        || list[0];
      selectedJalonId = active.id;
    }
  }
  function selectedJalon() {
    return jalonsSorted().find(function (j) { return String(j.id) === String(selectedJalonId); }) || null;
  }
  function tasksForSelected() {
    if (selectedJalonId == null) return allTasks();   // pas de jalon → tout (dégradé)
    return allTasks().filter(function (t) { return String(t.jalonId) === String(selectedJalonId); });
  }
  function taskStatus(t) { return t.status || (t.done ? 'done' : 'todo'); }

  function jalonTaskCounts(jid) {
    var ts = allTasks().filter(function (t) { return String(t.jalonId) === String(jid); });
    return { total: ts.length, done: ts.filter(function (t) { return taskStatus(t) === 'done'; }).length };
  }

  var MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function fmtDate(d) {
    if (!d) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
    if (m) return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
    return d;
  }

  // ── Switch jalon (ct__jalons) : un onglet par jalon, pastille sur l'actif + compteur tâches. ──
  function renderJalonTabs() {
    var list = jalonsSorted();
    if (!list.length) return '';
    var tabs = list.map(function (j) {
      var on = String(j.id) === String(selectedJalonId);
      var c = jalonTaskCounts(j.id);
      var dot = on ? '<span class="ct__jalon-dot" aria-hidden="true"></span>' : '';
      var count = c.total ? '<span class="ct__jalon-count type-caption">' + c.done + '/' + c.total + '</span>' : '';
      return '<button type="button" class="ct__jalon' + (on ? ' is-active' : '') + '" role="tab" aria-selected="' + on + '" data-jalon-select="' + esc(j.id) + '">' +
        dot + esc(j.titre || '') + count + '</button>';
    }).join('');
    return '<nav class="ct__jalons" aria-label="Jalons">' + tabs + '</nav>';
  }

  // ── Bloc critère de validation + bouton Valider (droite), sur le jalon sélectionné. ──
  function renderValidation() {
    var j = selectedJalon();
    if (!j) return '';
    // Valider = action irréversible → géré par dashboard-views.js ([data-validate-jalon], confirm).
    var valider = j.statut === 'in_progress'
      ? '<button type="button" class="ds-button ds-button--inverse ds-button--sm" data-validate-jalon data-jalon-id="' + esc(j.id) + '">Valider</button>'
      : '';
    return '<section class="ct__validation">' +
      '<div class="ct__validation-copy">' +
        '<span class="ct__validation-label type-data-label">Critère de validation</span>' +
        '<p class="type-h3">' + esc(j.critere || '') + '</p>' +
      '</div>' + valider +
    '</section>';
  }

  // ── Contexte col-4 = composant Jalon card (ds-jalon-card), jalon sélectionné. ──
  function renderJalonCard() {
    var list = jalonsSorted();
    var j = selectedJalon();
    if (!j) return '';
    var idx = list.findIndex(function (x) { return String(x.id) === String(j.id); });
    var c = jalonTaskCounts(j.id);
    var ratio = c.total ? c.done / c.total : 0;
    var pct = Math.round(ratio * 100);
    var st = j.statut === 'in_progress' ? { mod: 'active', label: 'En cours' }
      : j.statut === 'completed' ? { mod: 'done', label: 'Terminé' }
      : { mod: 'upcoming', label: 'À venir' };
    return '<article class="ds-jalon-card">' +
      '<div class="ds-jalon-card__head">' +
        '<span class="ds-jalon-card__meta type-data-label">Jalon ' + (idx + 1) + ' / ' + list.length + '</span>' +
        '<span class="ds-jalon-status ds-jalon-status--' + st.mod + '"><span class="ds-jalon-status__dot" aria-hidden="true"></span>' + st.label + '</span>' +
      '</div>' +
      '<div class="ds-jalon-card__body">' +
        '<span class="type-h3">' + esc(j.titre || '') + '</span>' +
        (j.critere ? '<span class="type-body-sm dashboard-final__jaloncard-crit">' + esc(j.critere) + '</span>' : '') +
        (j.date ? '<span class="ds-jalon-card__date type-caption">Échéance : ' + esc(fmtDate(j.date)) + '</span>' : '') +
      '</div>' +
      '<div class="ds-jalon-card__progress">' +
        '<div class="ds-jalon-card__progress-label"><span class="type-label">Avancement des tâches</span>' +
          '<span class="ds-jalon-card__progress-count type-caption">' + c.done + ' / ' + c.total + '</span></div>' +
        '<div class="ds-progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
          '<div class="ds-progress__fill" data-progress-fill="' + ratio + '"></div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  // ── Sous-tâches inline (dépliées via le chevron) ─────────────────
  function subtasksInlineHTML(task) {
    var subs = Array.isArray(task.subtasks) ? task.subtasks : [];
    var rows = subs.map(function (s, i) {
      var id = 'todo-sub-' + esc(task.id) + '-' + i;
      return '<div class="nested-group__subtask">' +
        '<div class="disclosure-subrow">' +
          '<span class="ds-row-grip" aria-hidden="true">⠿</span>' +
          '<label class="ds-checkbox" for="' + id + '">' +
            '<span class="ds-checkbox__box ds-checkbox__box--round">' +
              '<input type="checkbox" id="' + id + '" class="ds-checkbox__input ds-checkbox__input--round" data-sub-check data-sub-id="' + esc(s.id) + '"' + (s.done ? ' checked' : '') + '>' +
              SUB_ICON +
            '</span>' +
            '<span class="type-body-sm ds-row-title' + (s.done ? ' is-done' : '') + '">' + esc(s.text) + '</span>' +
          '</label>' +
          '<span class="ds-row-actions">' +
            '<button type="button" class="ds-row-action" aria-label="Supprimer la sous-tâche" data-sub-delete data-sub-id="' + esc(s.id) + '">' + CROSS + '</button>' +
          '</span>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div class="nested-group__subtasks">' + rows +
      '<div class="nested-group__subtask nested-group__subtask--action"><div class="disclosure-subrow">' +
        '<button type="button" class="ds-empty-inline" data-subtask-add="' + esc(task.id) + '"><span class="ds-empty-inline__icon" aria-hidden="true">+</span><span>Ajouter une sous-tâche…</span></button>' +
      '</div></div>' +
    '</div>';
  }

  // ── Row de tâche (liste) ─────────────────────────────────────────
  function taskRowHTML(task) {
    var id = 'todo-task-' + esc(task.id);
    var done = taskStatus(task) === 'done';
    var subs = Array.isArray(task.subtasks) ? task.subtasks : [];
    var hasSubs = subs.length > 0;
    var open = subOpen[task.id] === true;   // repliée par défaut ; TOUTE tâche est dépliable (même 0 sous-tâche → pour en ajouter)
    var doneCount = subs.filter(function (s) { return s.done; }).length;
    var count = hasSubs ? '<span class="type-caption ds-row-subcount">' + doneCount + '/' + subs.length + '</span>' : '';
    var chevron = '<button type="button" class="ds-disclosure" aria-expanded="' + open + '" aria-label="Sous-tâches" data-sub-toggle="' + esc(task.id) + '"><span class="ds-disclosure__icon" aria-hidden="true">&nbsp;</span></button>';

    return '<tr class="ds-table__row--nested-group">' +
      '<td>' +
        '<div class="nested-group">' +
          '<span class="disclosure-row nested-group__task' + (done ? ' is-done' : '') + '" draggable="true" data-task-id="' + esc(task.id) + '">' +
            '<span class="ds-row-grip" aria-hidden="true">⠿</span>' +
            '<label class="ds-checkbox" for="' + id + '">' +
              '<span class="ds-checkbox__box">' +
                '<input type="checkbox" id="' + id + '" class="ds-checkbox__input" aria-label="Marquer la tâche comme terminée" data-task-check' + (done ? ' checked' : '') + '>' +
                SUB_ICON +
              '</span>' +
            '</label>' +
            chevron +
            '<span class="ds-row-copy"><span class="ds-row-title" data-task-title>' + esc(task.text) + '</span>' + count + '</span>' +
            '<span class="ds-row-actions">' +
              '<button type="button" class="ds-row-action" aria-label="Détail de la tâche" data-task-detail>' + DOTS + '</button>' +
              '<button type="button" class="ds-row-action" aria-label="Supprimer la tâche" data-task-delete>' + CROSS + '</button>' +
            '</span>' +
          '</span>' +
          (open ? subtasksInlineHTML(task) : '') +
        '</div>' +
      '</td>' +
    '</tr>';
  }

  // ── Groupe de statut (bloc repliable + dropzone) ─────────────────
  var GROUPS = [
    { status: 'doing', label: 'En cours' },
    { status: 'todo', label: 'À faire' },
    { status: 'done', label: 'Terminées' },
  ];

  // Composant Task list imbriquée : en-tête = chevron repliable + ds-badge + compteur (mockup ct).
  function groupHTML(g, items) {
    var collapsed = groupCollapsed[g.status] === true;
    var rows = collapsed ? '' : items.map(taskRowHTML).join('');
    var addRow = (collapsed || g.status === 'done') ? '' :
      '<tr class="ds-table__row--inline-action"><td><span class="disclosure-row nested-group__add-task">' +
        '<button type="button" class="ds-empty-inline" data-todo-add data-add-status="' + g.status + '"><span class="ds-empty-inline__icon" aria-hidden="true">+</span><span>Ajouter une action…</span></button>' +
      '</span></td></tr>';
    // Bloc actif (En cours) = badge inversé (ds-badge--active, fond plein) ; autres = muted (hiérarchie DS §480, sans couleur).
    var badgeMod = g.status === 'doing' ? 'ds-badge--active' : 'ds-badge--muted';
    var chevron = '<button type="button" class="ds-disclosure" aria-expanded="' + (!collapsed) + '" aria-label="Replier le groupe" data-group-toggle="' + g.status + '"><span class="ds-disclosure__icon" aria-hidden="true">&nbsp;</span></button>';
    return '<table class="ds-table ds-table--nested dashboard-final__todo-group" data-group-status="' + g.status + '">' +
      '<thead><tr><th scope="col"><span class="ds-table__status-heading">' +
        chevron +
        '<span class="ds-badge ' + badgeMod + '">' + esc(g.label) + '</span>' +
        '<span class="type-caption dashboard-final__todo-groupcount">' + items.length + '</span>' +
      '</span></th></tr></thead>' +
      '<tbody>' + rows + addRow + '</tbody>' +
    '</table>';
  }

  // Board (ct__board) = 2 cartes : [En cours + À faire] partagent une carte, [Terminées] à part.
  // 2 tables par carte (chacune sa dropzone data-group-status) → le drag inter-bloc reste intact.
  function renderListCard() {
    var scoped = tasksForSelected();
    function grp(status) {
      var g = null;
      for (var i = 0; i < GROUPS.length; i++) { if (GROUPS[i].status === status) { g = GROUPS[i]; break; } }
      return groupHTML(g, scoped.filter(function (t) { return taskStatus(t) === status; }));
    }
    var stage1 = '<section class="table-stage task-list-stage ct__stage dashboard-final__todo-card">' + grp('doing') + grp('todo') + '</section>';
    var stage2 = '<section class="table-stage task-list-stage ct__stage ct__stage--done ct__done dashboard-final__todo-card">' + grp('done') + '</section>';
    return '<section class="ct__board">' + stage1 + stage2 + '</section>';
  }

  // ── Board (Kanban) ───────────────────────────────────────────────
  var KANBAN_COLS = [
    { status: 'todo', label: 'À faire' },
    { status: 'doing', label: 'En cours' },
    { status: 'done', label: 'Terminé' },
  ];

  function kanbanCardHTML(task) {
    var subs = Array.isArray(task.subtasks) ? task.subtasks : [];
    var doneCount = subs.filter(function (s) { return s.done; }).length;
    var meta = subs.length
      ? '<div class="dashboard-final__kanban-meta"><span class="type-caption dashboard-final__kanban-progress">' + doneCount + '/' + subs.length + '</span></div>'
      : '';
    return '<article class="dashboard-final__kanban-card' + (taskStatus(task) === 'done' ? ' is-done' : '') + '" draggable="true" data-task-id="' + esc(task.id) + '">' +
      '<div class="dashboard-final__kanban-cardhead">' +
        '<p class="type-body-md dashboard-final__kanban-title" data-task-title>' + esc(task.text) + '</p>' +
        '<span class="ds-row-actions dashboard-final__kanban-actions">' +
          '<button type="button" class="ds-row-action" aria-label="Détail de la tâche" data-task-detail>' + DOTS + '</button>' +
          '<button type="button" class="ds-row-action" aria-label="Supprimer la tâche" data-task-delete>' + CROSS + '</button>' +
        '</span>' +
      '</div>' + meta +
    '</article>';
  }

  function kanbanColumnHTML(col, items) {
    var add = col.status === 'todo'
      ? '<button type="button" class="ds-empty-inline dashboard-final__kanban-add" data-todo-add data-add-status="todo"><span class="ds-empty-inline__icon" aria-hidden="true">+</span><span>Ajouter une action…</span></button>'
      : '';
    return '<section class="ds-col-4 dashboard-final__kanban-col" data-kanban-status="' + col.status + '">' +
      '<header class="dashboard-final__kanban-head">' +
        '<span class="ds-badge ds-badge--muted">' + esc(col.label) + '</span>' +
        '<span class="type-caption dashboard-final__kanban-count">' + items.length + '</span>' +
      '</header>' +
      '<div class="dashboard-final__kanban-list" data-kanban-drop="' + col.status + '">' + items.map(kanbanCardHTML).join('') + add + '</div>' +
    '</section>';
  }

  function renderKanbanBody() {
    var scoped = tasksForSelected();
    return '<div class="ds-grid dashboard-final__kanban-board">' +
      KANBAN_COLS.map(function (col) {
        return kanbanColumnHTML(col, scoped.filter(function (t) { return taskStatus(t) === col.status; }));
      }).join('') +
    '</div>';
  }

  // ── Rendu global ─────────────────────────────────────────────────
  function render() {
    var root = document.querySelector('[data-todo-root]');
    if (!root) return;
    ensureSelectedJalon();
    root.innerHTML =
      renderJalonTabs() +
      renderValidation() +
      renderListCard();
    // Progress bar : valeur posée en data (var CSS), pas de style de design en dur (cf. §Progress).
    Array.prototype.forEach.call(root.querySelectorAll('[data-progress-fill]'), function (el) {
      el.style.setProperty('--ds-progress-scale', el.getAttribute('data-progress-fill'));
    });
  }
  window.CarryITRefreshTodo = render;

  // ── Persistence ──────────────────────────────────────────────────
  function readRaw() {
    try { var r = JSON.parse(localStorage.getItem('carryit_v1_tasks')); return Array.isArray(r) ? r : []; }
    catch (e) { return []; }
  }
  function saveRaw(arr) {
    try { localStorage.setItem('carryit_v1_tasks', JSON.stringify(arr)); } catch (e) { return; }
    if (window.CarryITBuildDashboardData) window.CarryITDashboardData = window.CarryITBuildDashboardData();
    render();
    if (openTaskId != null) buildModal();   // reflète les changements dans le panneau ouvert
  }
  function findRaw(arr, id) { return arr.find(function (t) { return String(t.id) === String(id); }); }
  function uid(p) { return (p || 'task') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function toggleTask(id) {
    var arr = readRaw(); var t = findRaw(arr, id); if (!t) return;
    var done = (t.status || (t.done ? 'done' : 'todo')) === 'done';
    t.status = done ? 'todo' : 'done'; t.done = !done; saveRaw(arr);
  }
  function setTaskStatus(id, status) {
    var arr = readRaw(); var t = findRaw(arr, id); if (!t || t.status === status) return;
    t.status = status; t.done = status === 'done'; saveRaw(arr);
  }
  // Confirmation in-app (ds-modal) : fiable même en iframe sandboxée où window.confirm est bloqué.
  function confirmDelete(onOk) {
    var root = document.querySelector('[data-todo-confirm-root]');
    if (!root) { root = document.createElement('div'); root.setAttribute('data-todo-confirm-root', ''); document.body.appendChild(root); }
    root.innerHTML =
      '<div class="ds-modal-backdrop" data-confirm-backdrop>' +
        '<div class="ds-modal" role="alertdialog" aria-modal="true" aria-labelledby="todoConfirmTitle">' +
          '<header class="ds-modal__header"><h2 class="type-h2" id="todoConfirmTitle">Supprimer cette tâche ?</h2>' +
            '<p class="ds-modal__subtitle type-body-sm">Cette action est définitive.</p></header>' +
          '<footer class="ds-modal__footer">' +
            '<button type="button" class="ds-button ds-button--ghost ds-button--sm" data-confirm-cancel>Annuler</button>' +
            '<button type="button" class="ds-button ds-button--danger ds-button--sm" data-confirm-ok>Supprimer</button>' +
          '</footer>' +
        '</div>' +
      '</div>';
    function close() { root.innerHTML = ''; }
    root.querySelector('[data-confirm-ok]').addEventListener('click', function () { close(); onOk(); });
    root.querySelector('[data-confirm-cancel]').addEventListener('click', close);
    root.querySelector('[data-confirm-backdrop]').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
  }

  function deleteTask(id) {
    confirmDelete(function () {
      saveRaw(readRaw().filter(function (t) { return String(t.id) !== String(id); }));
    });
  }
  function renameTask(id, text) {
    var arr = readRaw(); var t = findRaw(arr, id); if (!t) return;
    t.text = text; if ('title' in t) t.title = text; saveRaw(arr);
  }
  function createTask(status, text) {
    var arr = readRaw();
    arr.push({ id: uid('task'), text: text, status: status, done: status === 'done', jalonId: selectedJalonId, subtasks: [] });
    saveRaw(arr);
  }
  function toggleSub(taskId, subId) {
    var arr = readRaw(); var t = findRaw(arr, taskId);
    if (!t || !Array.isArray(t.subtasks)) return;
    var s = t.subtasks.find(function (x) { return String(x.id) === String(subId); });
    if (!s) return; s.done = !s.done; saveRaw(arr);
  }
  function deleteSub(taskId, subId) {
    var arr = readRaw(); var t = findRaw(arr, taskId);
    if (!t || !Array.isArray(t.subtasks)) return;
    t.subtasks = t.subtasks.filter(function (x) { return String(x.id) !== String(subId); });
    saveRaw(arr);
  }
  function addSub(taskId, text) {
    var arr = readRaw(); var t = findRaw(arr, taskId); if (!t) return;
    if (!Array.isArray(t.subtasks)) t.subtasks = [];
    t.subtasks.push({ id: uid('sub'), text: text, done: false });
    subOpen[taskId] = true; saveRaw(arr);
  }

  function updateNotes(id, val) {
    var arr = readRaw(); var t = findRaw(arr, id); if (!t) return;
    t.notes = val;
    try { localStorage.setItem('carryit_v1_tasks', JSON.stringify(arr)); } catch (e) { return; }
    if (window.CarryITBuildDashboardData) window.CarryITDashboardData = window.CarryITBuildDashboardData();
    render();   // liste seulement — pas le modal (évite de perdre le focus du champ)
  }

  // ── Panneau détail = Modal (DS §520) : statut · notes · checklist · supprimer. ──
  var openTaskId = null;
  var CLOSE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function modalTask() { return allTasks().find(function (t) { return String(t.id) === String(openTaskId); }) || null; }

  function modalSubHTML(task) {
    var subs = Array.isArray(task.subtasks) ? task.subtasks : [];
    var rows = subs.map(function (s, i) {
      var id = 'modal-sub-' + esc(task.id) + '-' + i;
      return '<div class="dashboard-final__taskpanel-sub">' +
        '<label class="ds-checkbox" for="' + id + '">' +
          '<span class="ds-checkbox__box ds-checkbox__box--round">' +
            '<input type="checkbox" id="' + id + '" class="ds-checkbox__input ds-checkbox__input--round" data-modal-sub-check data-sub-id="' + esc(s.id) + '"' + (s.done ? ' checked' : '') + '>' +
            SUB_ICON +
          '</span>' +
          '<span class="type-body-sm ds-row-title' + (s.done ? ' is-done' : '') + '">' + esc(s.text) + '</span>' +
        '</label>' +
        '<button type="button" class="ds-row-action" aria-label="Supprimer la sous-tâche" data-modal-sub-delete data-sub-id="' + esc(s.id) + '">' + CROSS + '</button>' +
      '</div>';
    }).join('');
    return rows +
      '<div class="dashboard-final__taskpanel-subadd">' +
        '<span class="dashboard-final__taskpanel-subaddicon" aria-hidden="true">+</span>' +
        '<input type="text" class="ds-input" data-modal-sub-add placeholder="Ajouter une sous-tâche…">' +
      '</div>';
  }

  function buildModal() {
    var root = document.querySelector('[data-task-modal-root]');
    if (!root) { root = document.createElement('div'); root.setAttribute('data-task-modal-root', ''); document.body.appendChild(root); }
    var task = modalTask();
    if (!task) { root.innerHTML = ''; return; }
    var status = taskStatus(task);
    var j = (data().jalons || []).find(function (x) { return String(x.id) === String(task.jalonId); });
    var openCount = (task.subtasks || []).filter(function (s) { return !s.done; }).length;
    var opt = function (v, l) { return '<option value="' + v + '"' + (status === v ? ' selected' : '') + '>' + l + '</option>'; };

    // Panneau latéral (droite) — pas de backdrop, le dashboard reste visible/cliquable (comme le legacy).
    root.innerHTML =
      '<div class="dashboard-final__taskpanel-overlay" data-task-modal>' +
        '<aside class="dashboard-final__taskpanel" role="dialog" aria-modal="false" aria-labelledby="taskPanelTitle">' +
          '<button type="button" class="dashboard-final__taskpanel-close" aria-label="Fermer" data-modal-close>' + CLOSE_ICON + '</button>' +
          '<div class="dashboard-final__taskpanel-body">' +
            '<div class="dashboard-final__taskpanel-section">' +
              '<span class="type-label dashboard-final__taskpanel-label">Statut</span>' +
              '<div class="ds-select-wrapper">' +
                '<select class="ds-select" id="taskPanelStatus" data-modal-status>' + opt('todo', 'À faire') + opt('doing', 'En cours') + opt('done', 'Terminée') + '</select>' +
              '</div>' +
            '</div>' +
            '<h2 class="type-h2 dashboard-final__taskpanel-title" id="taskPanelTitle" data-modal-title title="Modifier le titre">' + esc(task.text) + '</h2>' +
            (j ? '<div class="dashboard-final__taskpanel-field"><span class="type-label dashboard-final__taskpanel-label">Jalon</span><span class="dashboard-final__taskpanel-jalon">' + esc(j.titre || '') + '</span></div>' : '') +
            '<div class="dashboard-final__taskpanel-section">' +
              '<span class="type-label dashboard-final__taskpanel-label">Notes</span>' +
              '<textarea class="ds-textarea" id="taskPanelNotes" data-modal-notes placeholder="Ajouter une note…">' + esc(task.notes || '') + '</textarea>' +
            '</div>' +
            '<div class="dashboard-final__taskpanel-section">' +
              '<div class="dashboard-final__taskpanel-checkhead">' +
                '<span class="type-data-label">Checklist</span>' +
                '<span class="type-caption dashboard-final__taskpanel-checkcount">' + openCount + ' à faire</span>' +
              '</div>' +
              '<div class="dashboard-final__taskpanel-subs">' + modalSubHTML(task) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="dashboard-final__taskpanel-danger">' +
            '<button type="button" class="ds-button ds-button--danger ds-button--sm ds-button--block" data-modal-delete>Supprimer la tâche</button>' +
          '</div>' +
        '</aside>' +
      '</div>';
  }

  function openModal(id) { openTaskId = id; buildModal(); }
  function closeModal() { openTaskId = null; var r = document.querySelector('[data-task-modal-root]'); if (r) r.innerHTML = ''; }
  window.CarryITOpenTaskPanel = openModal;

  // ── Édition inline : remplace un élément par un champ ─────────────
  function replaceWithInput(el, value, placeholder, onCommit, ghost) {
    var input = document.createElement('input');
    input.type = 'text'; input.className = 'dashboard-final__todo-input';
    input.value = value || ''; input.placeholder = placeholder || '';
    var node = input;
    if (ghost) {
      // Édition d'ajout : garde le look inline de la row ghost (« + » + champ borderless), pas un gros ds-input.
      var wrap = document.createElement('span');
      wrap.className = 'ds-empty-inline dashboard-final__todo-editing';
      var ic = document.createElement('span');
      ic.className = 'ds-empty-inline__icon'; ic.setAttribute('aria-hidden', 'true'); ic.textContent = '+';
      wrap.appendChild(ic); wrap.appendChild(input);
      node = wrap;
    }
    el.replaceWith(node);
    input.focus(); input.select();
    var done = false;
    function commit() {
      if (done) return; done = true;
      var v = input.value.trim();
      if (v && v !== value) onCommit(v); else render();
    }
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      else if (e.key === 'Escape') { done = true; render(); }
    });
    input.addEventListener('blur', commit);
  }

  function taskIdOf(el) {
    var row = el.closest('.nested-group') || el.closest('.dashboard-final__kanban-card');
    var anchor = row ? row.querySelector('[data-task-id]') : el.closest('[data-task-id]');
    if (anchor) return anchor.dataset.taskId;
    var card = el.closest('[data-task-id]');
    return card ? card.dataset.taskId : null;
  }

  var dragId = null;
  function clearDrop() {
    Array.prototype.forEach.call(document.querySelectorAll('.is-drop-target'), function (n) { n.classList.remove('is-drop-target'); });
  }

  function init() {
    document.addEventListener('click', function (e) {
      var jsel = e.target.closest('[data-jalon-select]');
      if (jsel) { selectedJalonId = jsel.dataset.jalonSelect; render(); return; }
      var vtab = e.target.closest('[data-todo-view]');
      if (vtab) { todoView = vtab.dataset.todoView; render(); return; }
      var gtog = e.target.closest('[data-group-toggle]');
      if (gtog) { var s = gtog.dataset.groupToggle; groupCollapsed[s] = !groupCollapsed[s]; render(); return; }
      var chev = e.target.closest('[data-sub-toggle]');
      if (chev && !chev.disabled) { var tid = chev.dataset.subToggle; subOpen[tid] = !subOpen[tid]; render(); return; }

      var subAdd = e.target.closest('[data-subtask-add]');
      if (subAdd) { var ti = subAdd.dataset.subtaskAdd; replaceWithInput(subAdd, '', 'Nouvelle sous-tâche…', function (v) { addSub(ti, v); }, true); return; }
      var add = e.target.closest('[data-todo-add]');
      if (add) { var st = add.dataset.addStatus || 'todo'; replaceWithInput(add, '', 'Nouvelle action…', function (v) { createTask(st, v); }, true); return; }

      var detail = e.target.closest('[data-task-detail]');
      if (detail) { var did = taskIdOf(detail); if (did != null && window.CarryITOpenTaskPanel) window.CarryITOpenTaskPanel(did); return; }
      var del = e.target.closest('[data-task-delete]');
      if (del) { var dl = taskIdOf(del); if (dl != null) deleteTask(dl); return; }
      var subDel = e.target.closest('[data-sub-delete]');
      if (subDel) { var stid = taskIdOf(subDel); if (stid != null) deleteSub(stid, subDel.dataset.subId); return; }

      // Clic n'importe où sur la ligne de tâche (sauf checkbox, chevron, actions) → ouvre le panneau.
      var taskRow = e.target.closest('.nested-group__task[data-task-id]');
      if (taskRow && !e.target.closest('.ds-checkbox, .ds-disclosure, .ds-row-actions, .dashboard-final__todo-input')) {
        var rid = taskRow.getAttribute('data-task-id');
        if (rid != null && window.CarryITOpenTaskPanel) { window.CarryITOpenTaskPanel(rid); return; }
      }

      // ── Modal détail ──
      var mSubDel = e.target.closest('[data-modal-sub-delete]');
      if (mSubDel) { if (openTaskId != null) deleteSub(openTaskId, mSubDel.dataset.subId); return; }
      var mDel = e.target.closest('[data-modal-delete]');
      if (mDel) {
        var mid = openTaskId;
        if (mid != null) confirmDelete(function () { closeModal(); saveRaw(readRaw().filter(function (t) { return String(t.id) !== String(mid); })); });
        return;
      }
      if (e.target.closest('[data-modal-close]')) { closeModal(); return; }
      var backdrop = e.target.closest('[data-task-modal]');
      if (backdrop && e.target === backdrop) { closeModal(); return; }
    });

    // Double-clic sur le titre du panneau = renommer inline (le clic simple sur la ligne ouvre le panneau).
    document.addEventListener('dblclick', function (e) {
      var mTitle = e.target.closest('[data-modal-title]');
      if (mTitle && openTaskId != null) {
        replaceWithInput(mTitle, mTitle.textContent, 'Titre de la tâche', function (v) { renameTask(openTaskId, v); });
      }
    });

    document.addEventListener('change', function (e) {
      var tc = e.target.closest('[data-task-check]');
      if (tc) { var id = taskIdOf(tc); if (id != null) toggleTask(id); return; }
      var sc = e.target.closest('[data-sub-check]');
      if (sc) { var tid = taskIdOf(sc); if (tid != null) toggleSub(tid, sc.dataset.subId); return; }

      // ── Modal détail ──
      var mStatus = e.target.closest('[data-modal-status]');
      if (mStatus) { if (openTaskId != null) setTaskStatus(openTaskId, mStatus.value); return; }
      var mSubCheck = e.target.closest('[data-modal-sub-check]');
      if (mSubCheck) { if (openTaskId != null) toggleSub(openTaskId, mSubCheck.dataset.subId); return; }
      var mNotes = e.target.closest('[data-modal-notes]');
      if (mNotes) { if (openTaskId != null) updateNotes(openTaskId, mNotes.value); return; }
    });

    // Modal : Enter dans le champ sous-tâche = ajouter ; Échap = fermer.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openTaskId != null && !e.target.closest('.dashboard-final__todo-input')) { closeModal(); return; }
      var mSubAdd = e.target.closest && e.target.closest('[data-modal-sub-add]');
      if (mSubAdd && e.key === 'Enter') {
        e.preventDefault();
        var v = mSubAdd.value.trim();
        if (v && openTaskId != null) addSub(openTaskId, v);
      }
    });

    // ── Drag & drop : liste (entre blocs) ET board (entre colonnes) → change le statut. ──
    document.addEventListener('dragstart', function (e) {
      var el = e.target.closest('[data-task-id]');
      if (!el) return;
      dragId = el.dataset.taskId;
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      el.classList.add('is-dragging');
    });
    document.addEventListener('dragend', function (e) {
      var el = e.target.closest('[data-task-id]');
      if (el) el.classList.remove('is-dragging');
      clearDrop(); dragId = null;
    });
    document.addEventListener('dragover', function (e) {
      var zone = e.target.closest('[data-kanban-drop], [data-group-status]');
      if (!zone || dragId == null) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      zone.classList.add('is-drop-target');
    });
    document.addEventListener('dragleave', function (e) {
      var zone = e.target.closest('[data-kanban-drop], [data-group-status]');
      if (zone && !zone.contains(e.relatedTarget)) zone.classList.remove('is-drop-target');
    });
    document.addEventListener('drop', function (e) {
      var zone = e.target.closest('[data-kanban-drop], [data-group-status]');
      if (!zone || dragId == null) return;
      e.preventDefault();
      var status = zone.dataset.kanbanDrop || zone.dataset.groupStatus;
      if (status) setTaskStatus(dragId, status);
      dragId = null;
    });

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
