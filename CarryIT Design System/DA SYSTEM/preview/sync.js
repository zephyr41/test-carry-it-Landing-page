/* Synchroniser : transfert manuel des données CarryIT entre appareils (sans backend).
   Export : télécharge un .json (objectif SMART + jalons).
   Import : le bouton « Importer » ouvre le sélecteur de fichier (input caché) ; au chargement,
   si des données existent déjà, le bouton passe en confirmation (« Remplacer mes données »,
   danger) : 2e clic = écrasement + reload. Sinon import immédiat + reload. */
(function () {
  'use strict';

  var K_SMART = 'carryItObjectifSMART';
  var K_JALONS = 'carryit_v1_jalons';

  var modal, fileInput, importBtn, importLabel, msg;
  var pending = null;   // { data: { clé: valeurBrute } } en attente de confirmation d'écrasement

  function readJSON(key) {
    try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
    catch (e) { return null; }
  }

  // Toutes les données CarryIT vivent sous ces préfixes (legacy « carryIt* » + React « carryit_v1_* »).
  // On les transfère TOUTES : SMART, KPI global (+ measures du chart), jalons, milestones, objectifs.
  function isCarryItKey(k) { return !!k && /^carryit/i.test(k); }

  function carryItKeys() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (isCarryItKey(k)) keys.push(k);
    }
    return keys;
  }

  function hasExistingData() {
    return carryItKeys().length > 0;
  }

  function setMsg(text) {
    if (!msg) return;
    msg.textContent = text || '';
    msg.hidden = !text;
  }

  // ── Modal ──────────────────────────────────────────────────────────
  function open() { if (modal) modal.hidden = false; }
  function close() { if (modal) modal.hidden = true; resetImport(); }

  function resetImport() {
    if (fileInput) fileInput.value = '';
    setMsg('');
  }

  // ── Export : TOUTES les clés localStorage, à plat, valeurs brutes ──
  // Format identique à dashboard.html (backup cross-compatible).
  function doExport() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      data[k] = localStorage.getItem(k);
    }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'carryit-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Import : le bouton ouvre le sélecteur de fichier. ──────────────
  function onImportClick() { if (fileInput) fileInput.click(); }

  // ── Import : au choix du fichier → écrase et recharge (comme dashboard.html). ──
  // Pas de confirmation : choisir un fichier applique directement.
  function onFile() {
    var file = fileInput.files && fileInput.files[0];
    if (fileInput) fileInput.value = '';   // permet de re-sélectionner le même fichier
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try { parsed = JSON.parse(reader.result); }
      catch (e) { setMsg('Fichier invalide. Assure-toi que c’est un export CarryIT.'); return; }
      // Compat : format plat {clé: valeur} (dashboard.html) OU ancien {data: {...}}.
      var data = (parsed && parsed.data && typeof parsed.data === 'object') ? parsed.data : parsed;
      if (!data || typeof data !== 'object') { setMsg('Fichier invalide.'); return; }
      try {
        Object.keys(data).forEach(function (k) {
          var v = data[k];
          localStorage.setItem(k, (typeof v === 'string') ? v : JSON.stringify(v));
        });
        // Aligne les clés live sur le projet courant du tableau (cohérence navbar ↔ SMART).
        if (window.CarryITProjectCurrent) window.CarryITProjectCurrent();
      } catch (e) { setMsg('Échec de l’écriture locale (stockage indisponible).'); return; }
      window.location.reload();
    };
    reader.readAsText(file);
  }

  function init() {
    modal = document.querySelector('[data-sync-modal]');
    fileInput = document.querySelector('[data-sync-file]');
    importBtn = document.querySelector('[data-sync-import]');
    importLabel = document.querySelector('[data-sync-import-label]');
    msg = document.querySelector('[data-sync-msg]');
    if (!modal) return;

    var openBtn = document.querySelector('[data-sync-open]');
    var closeBtn = document.querySelector('[data-sync-close]');
    var exportBtn = document.querySelector('[data-sync-export]');

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (exportBtn) exportBtn.addEventListener('click', doExport);
    if (importBtn) importBtn.addEventListener('click', onImportClick);
    if (fileInput) fileInput.addEventListener('change', onFile);

    // Clic hors du dialog (sur le backdrop) → fermer.
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    // Échap → fermer.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
