/* Synchroniser — transfert manuel des données CarryIT entre appareils (sans backend).
   Export : télécharge un .json (objectif SMART + jalons).
   Import : le bouton « Importer » ouvre le sélecteur de fichier (input caché) ; au chargement,
   si des données existent déjà, le bouton passe en confirmation (« Remplacer mes données »,
   danger) — 2e clic = écrasement + reload. Sinon import immédiat + reload. */
(function () {
  'use strict';

  var K_SMART = 'carryItObjectifSMART';
  var K_JALONS = 'carryit_v1_jalons';

  var modal, fileInput, importBtn, importLabel, msg;
  var pending = null;   // données parsées prêtes, en attente de confirmation d'écrasement

  function readJSON(key) {
    try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
    catch (e) { return null; }
  }

  function hasExistingData() {
    var s = readJSON(K_SMART), j = readJSON(K_JALONS);
    var sf = s && typeof s === 'object' && Object.keys(s).length > 0;
    var jf = Array.isArray(j) && j.length > 0;
    return !!(sf || jf);
  }

  function setMsg(text) {
    if (!msg) return;
    msg.textContent = text || '';
    msg.hidden = !text;
  }

  // ── Modal ──────────────────────────────────────────────────────────
  function open() { if (modal) modal.hidden = false; }
  function close() { if (modal) modal.hidden = true; resetImport(); }

  // Remet le bouton Importer dans son état neutre (variante secondary, libellé d'origine).
  function resetImport() {
    pending = null;
    if (fileInput) fileInput.value = '';
    if (importBtn) {
      importBtn.classList.remove('ds-button--danger');
      importBtn.classList.add('ds-button--secondary');
    }
    if (importLabel) importLabel.textContent = 'Importer mes données';
    setMsg('');
  }

  // ── Export ─────────────────────────────────────────────────────────
  function doExport() {
    var payload = {
      _meta: { app: 'CarryIT', exportedAt: new Date().toISOString(), version: 1 },
      carryItObjectifSMART: readJSON(K_SMART),
      carryit_v1_jalons: readJSON(K_JALONS),
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'carryit-export-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Import : clic sur le bouton ────────────────────────────────────
  // Pas de fichier en attente → ouvre le sélecteur. Fichier en attente → confirme l'écrasement.
  function onImportClick() {
    if (pending) { applyImport(); return; }
    if (fileInput) fileInput.click();
  }

  // ── Import : lecture du fichier choisi ─────────────────────────────
  function onFile() {
    resetImport();   // repart propre (efface un éventuel état de confirmation précédent)
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try { parsed = JSON.parse(reader.result); }
      catch (e) { setMsg('Fichier illisible : JSON invalide.'); return; }

      var smart = parsed && parsed.carryItObjectifSMART;
      var jalons = parsed && parsed.carryit_v1_jalons;
      if (smart == null && jalons == null) {
        setMsg('Fichier non reconnu : aucune donnée CarryIT trouvée.');
        return;
      }
      pending = { smart: smart, jalons: jalons };

      if (hasExistingData()) {
        // Écrasement → confirmation : le bouton devient destructif, 2e clic valide.
        if (importBtn) {
          importBtn.classList.remove('ds-button--secondary');
          importBtn.classList.add('ds-button--danger');
        }
        if (importLabel) importLabel.textContent = 'Remplacer mes données';
        setMsg('Ça remplacera ton objectif SMART et tes jalons actuels.');
      } else {
        applyImport();
      }
    };
    reader.readAsText(file);
  }

  // ── Import : écriture + reload ─────────────────────────────────────
  function applyImport() {
    if (!pending) return;
    try {
      if (pending.smart != null) localStorage.setItem(K_SMART, JSON.stringify(pending.smart));
      else localStorage.removeItem(K_SMART);
      if (pending.jalons != null) localStorage.setItem(K_JALONS, JSON.stringify(pending.jalons));
      else localStorage.removeItem(K_JALONS);
    } catch (e) {
      setMsg('Échec de l’écriture locale (stockage indisponible).');
      return;
    }
    // Reload : dashboard-data / dashboard-final / chart / timeline relisent tout proprement.
    window.location.reload();
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
