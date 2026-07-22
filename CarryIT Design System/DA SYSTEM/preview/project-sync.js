/* ────────────────────────────────────────────────────────────────────────
   Isolation par projet : source unique = carryItAllObjectifs[index courant].

   Le dashboard lit/écrit des clés « live » (carryItObjectifSMART, carryit_v1_*,
   carryItMilestones). Ce module fait de ces clés une simple PROJECTION du projet
   courant :
     • au LOAD  → hydrate() : projet courant → clés live   (doit tourner AVANT dashboard-data.js)
     • à chaque WRITE → syncBack() : clés live → projet courant
     • une fois → migrateOnce() : backup + rattache les données globales existantes
       (carryItMilestones, carryit_v1_tasks) au projet courant, sans rien effacer.

   Sans ce module, jalons + to-do d'un nouveau projet n'apparaissaient pas et
   n'étaient pas séparés entre projets.
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var MIGRATED_FLAG = 'carryit_project_isolation_v1';
  var BACKUP_KEY = 'carryitBackup_preIsolation';

  function readJSON(k, fb) {
    try {
      var r = localStorage.getItem(k);
      if (r == null || r === '') return fb;
      var v = JSON.parse(r), g = 0;
      while (typeof v === 'string' && g++ < 3) { try { v = JSON.parse(v); } catch (e) { break; } }
      return v;
    } catch (e) { return fb; }
  }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function num(v) { var n = Number(v); return (v !== '' && v != null && isFinite(n)) ? n : null; }

  function allProjects() { var v = readJSON('carryItAllObjectifs', []); return Array.isArray(v) ? v : []; }
  function curIndex() {
    var all = allProjects();
    var i = parseInt(localStorage.getItem('carryItEditingProjectIndex') || '0', 10);
    if (isNaN(i) || i < 0 || i >= all.length) i = 0;
    return i;
  }

  // Jalon « legacy » (carryItMilestones : {id,date,tag,title,desc,kpi}) → jalon canonique
  // du dashboard ({id,titre,date,statut,critere,kpis}). Les KPI effort/résultat se
  // définissent ENSUITE dans le dashboard : on ne les invente pas ici (kpis:[]).
  function milestoneToJalon(m) {
    return {
      id: m.id, titre: m.title || m.label || m.titre || '', date: m.date,
      statut: m.statut || m.status || 'pending',
      critere: m.desc || m.critere || m.kpi || '',
      kpis: Array.isArray(m.kpis) ? m.kpis : [],
    };
  }

  // Fusion : on préserve les jalons canoniques existants (leurs kpis/statut définis dans
  // le dashboard) et on met à jour/complète depuis les milestones (par id).
  function mergeMilestones(existing, milestones) {
    existing = Array.isArray(existing) ? existing.slice() : [];
    (Array.isArray(milestones) ? milestones : []).forEach(function (m) {
      if (!m || !m.id) return;
      var j = existing.find(function (x) { return String(x.id) === String(m.id); });
      if (j) {
        j.titre = m.title || m.label || j.titre;
        j.date = m.date || j.date;
        if (!j.critere) j.critere = m.desc || m.kpi || '';
      } else {
        existing.push(milestoneToJalon(m));
      }
    });
    return existing;
  }

  // ── Projection projet → clés live ────────────────────────────────────────
  function hydrate(index) {
    var all = allProjects();
    if (!all.length) return;
    if (typeof index !== 'number') index = curIndex();
    var p = all[index]; if (!p || typeof p !== 'object') return;
    var gk = (p.globalKpi && typeof p.globalKpi === 'object') ? p.globalKpi : {};
    var jalons = Array.isArray(p.jalons) ? p.jalons : [];
    var tasks = Array.isArray(p.tasks) ? p.tasks : [];

    writeJSON('carryItObjectifSMART', p);
    writeJSON('carryit_v1_smart', {
      S: p.specifique || '', M: p.mesurable || p.kpiLabel || gk.label || '',
      A: p.atteignable || '', R: p.realiste || '', T: p.temporel || '',
    });
    writeJSON('carryit_v1_kpi', {
      label: gk.label || gk.titre || p.kpiLabel || '',
      target: (gk.target != null ? gk.target : (gk.cible != null ? gk.cible : num(p.kpiTarget))),
      cible: (gk.cible != null ? gk.cible : gk.target),
      unit: gk.unit || gk.unite || p.kpiUnit || '',
      value: (gk.value != null ? gk.value : gk.valeur),
      measures: Array.isArray(gk.measures) ? gk.measures : [],
    });
    writeJSON('carryit_v1_jalons', jalons);
    writeJSON('carryit_v1_tasks', tasks);
    writeJSON('carryItMilestones', jalons);   // miroir legacy (jalons.html)
  }

  // ── Sync retour clés live → projet courant ───────────────────────────────
  function syncBack() {
    var all = allProjects();
    if (!all.length) return;
    var i = curIndex();
    var p = all[i]; if (!p || typeof p !== 'object') return;

    var jalons = readJSON('carryit_v1_jalons', null);
    if (Array.isArray(jalons)) p.jalons = jalons;

    var tasks = readJSON('carryit_v1_tasks', null);
    if (Array.isArray(tasks)) p.tasks = tasks;

    // Mesures du KPI global : depuis la clé live (carryit_v1_kpi) ou le SMART legacy.
    var liveKpi = readJSON('carryit_v1_kpi', null);
    var liveSmart = readJSON('carryItObjectifSMART', null);
    var measures = (liveKpi && Array.isArray(liveKpi.measures)) ? liveKpi.measures
      : (liveSmart && liveSmart.globalKpi && Array.isArray(liveSmart.globalKpi.measures)) ? liveSmart.globalKpi.measures
      : null;
    if (Array.isArray(measures)) {
      if (!p.globalKpi || typeof p.globalKpi !== 'object') p.globalKpi = {};
      p.globalKpi.measures = measures;
    }

    all[i] = p;
    writeJSON('carryItAllObjectifs', all);
  }

  // ── Migration one-shot (backup + rattachement des données globales) ───────
  function migrateOnce() {
    if (localStorage.getItem(MIGRATED_FLAG) === '1') return;

    // Backup non destructif de toutes les clés carryit* (réversible).
    if (localStorage.getItem(BACKUP_KEY) == null) {
      var snap = {};
      for (var k = 0; k < localStorage.length; k++) {
        var key = localStorage.key(k);
        if (/^carryit/i.test(key) && key !== BACKUP_KEY) snap[key] = localStorage.getItem(key);
      }
      writeJSON(BACKUP_KEY, { at: new Date().toISOString(), keys: snap });
    }

    var all = allProjects();
    // Pas encore de tableau de projets mais un SMART legacy → on en fait le projet 0.
    if (!all.length) {
      var legacy = readJSON('carryItObjectifSMART', null);
      if (legacy && typeof legacy === 'object') { all = [legacy]; writeJSON('carryItAllObjectifs', all); }
    }
    if (all.length) {
      var i = curIndex();
      var p = all[i] || (all[i] = {});
      // Rattache les jalons globaux (carryItMilestones) au projet courant s'il n'en a pas.
      if (!Array.isArray(p.jalons) || !p.jalons.length) {
        var ms = readJSON('carryItMilestones', null);
        var vj = readJSON('carryit_v1_jalons', null);
        if (Array.isArray(vj) && vj.length) p.jalons = vj;
        else if (Array.isArray(ms) && ms.length) p.jalons = mergeMilestones([], ms);
      }
      // Rattache les tâches globales au projet courant s'il n'en a pas.
      if (!Array.isArray(p.tasks) || !p.tasks.length) {
        var tk = readJSON('carryit_v1_tasks', null);
        if (Array.isArray(tk) && tk.length) p.tasks = tk;
      }
      all[i] = p;
      writeJSON('carryItAllObjectifs', all);
    }

    localStorage.setItem(MIGRATED_FLAG, '1');
  }

  // ── API + wiring ─────────────────────────────────────────────────────────
  window.CarryITSyncProject = syncBack;
  window.CarryITHydrateProject = hydrate;
  window.CarryITProjectMerge = mergeMilestones;   // utilisé par jalons.html

  // Ordre de script : ce fichier tourne AVANT dashboard-data.js → hydrate d'abord.
  migrateOnce();
  hydrate(curIndex());

  // Sync retour après chaque rebuild central (mesure / jalon / KPI). Le wrap est différé :
  // CarryITRefreshDashboard est défini par dashboard-final.js, chargé après.
  function wrapRefresh() {
    var orig = window.CarryITRefreshDashboard;
    if (typeof orig !== 'function' || orig.__wrappedSync) return false;
    var wrapped = function () { var r = orig.apply(this, arguments); try { syncBack(); } catch (e) {} return r; };
    wrapped.__wrappedSync = true;
    window.CarryITRefreshDashboard = wrapped;
    return true;
  }
  if (!wrapRefresh()) {
    var tries = 0, t = setInterval(function () { if (wrapRefresh() || tries++ > 40) clearInterval(t); }, 50);
  }

  // Filet de sécurité : sync avant que la page parte (au cas où un writer n'aurait pas déclenché de rebuild).
  window.addEventListener('pagehide', function () { try { syncBack(); } catch (e) {} });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { try { syncBack(); } catch (e) {} } });
})();
