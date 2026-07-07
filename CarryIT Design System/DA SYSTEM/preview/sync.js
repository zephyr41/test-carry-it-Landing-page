/* Synchroniser — transfert manuel des données CarryIT entre navigateurs (sans backend).
   Export : télécharge un .json (objectif SMART + jalons). Import : charge un .json et
   REMPLACE les données locales (confirmation inline si des données existent déjà).
   Après import → reload : toutes les vues relisent localStorage proprement. */
(function () {
  'use strict';

  var K_SMART = 'carryItObjectifSMART';
  var K_JALONS = 'carryit_v1_jalons';

  var modal, fileInput, importBtn, msg;
  var pending = null;     // données parsées prêtes à importer
  var confirming = false; // 2e clic = confirmation d'écrasement

  function readJSON(key) {
    try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
    catch (e) { return null; }
  }

  function hasExistingData() {
    var smart = readJSON(K_SMART);
    var jalons = readJSON(K_JALONS);
    var smartFilled = smart && typeof smart === 'object' && Object.keys(smart).length > 0;
    var jalonsFilled = Array.isArray(jalons) && jalons.length > 0;
    return !!(smartFilled || jalonsFilled);
  }

  // ── Modal ──────────────────────────────────────────────────────────
  function open() { if (modal) modal.hidden = false; }
  function close() {
    if (modal) modal.hidden = true;
    resetImport();
  }

  function resetImport() {
    pending = null;
    confirming = false;
    if (fileInput) fileInput.value = '';
    if (importBtn) {
      importBtn.disabled = true;
      importBtn.textContent = 'Importer';
      importBtn.classList.remove('ds-button--danger');
      importBtn.classList.add('ds-button--primary');
    }
    setMsg('', false);
  }

  function setMsg(text, show) {
    if (!msg) return;
    msg.textContent = text || '';
    msg.hidden = !show;
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

  // ── Import : lecture fichier ───────────────────────────────────────
  function onFile() {
    resetImportState();
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try { parsed = JSON.parse(reader.result); }
      catch (e) { setMsg('Fichier illisible : JSON invalide.', true); return; }

      var smart = parsed && parsed.carryItObjectifSMART;
      var jalons = parsed && parsed.carryit_v1_jalons;
      if (smart == null && jalons == null) {
        setMsg('Fichier non reconnu : aucune donnée CarryIT trouvée.', true);
        return;
      }
      pending = { smart: smart, jalons: jalons };
      var nJalons = Array.isArray(jalons) ? jalons.length : 0;
      setMsg('Fichier chargé : ' + (smart ? 'objectif SMART' : 'aucun objectif') +
        ' · ' + nJalons + ' jalon' + (nJalons > 1 ? 's' : '') + '.', true);
      importBtn.disabled = false;
    };
    reader.readAsText(file);
  }

  function resetImportState() {
    pending = null;
    confirming = false;
    importBtn.disabled = true;
    importBtn.textContent = 'Importer';
    importBtn.classList.remove('ds-button--danger');
    importBtn.classList.add('ds-button--primary');
  }

  // ── Import : validation + écrasement ───────────────────────────────
  function onImport() {
    if (!pending) return;

    // Données présentes + pas encore confirmé → passer en mode confirmation d'écrasement.
    if (hasExistingData() && !confirming) {
      confirming = true;
      importBtn.textContent = 'Remplacer et importer';
      importBtn.classList.remove('ds-button--primary');
      importBtn.classList.add('ds-button--danger');
      setMsg('Des données existent déjà. Confirmer remplacera l’objectif SMART et les jalons actuels.', true);
      return;
    }

    try {
      if (pending.smart != null) localStorage.setItem(K_SMART, JSON.stringify(pending.smart));
      else localStorage.removeItem(K_SMART);
      if (pending.jalons != null) localStorage.setItem(K_JALONS, JSON.stringify(pending.jalons));
      else localStorage.removeItem(K_JALONS);
    } catch (e) {
      setMsg('Échec de l’écriture locale (stockage indisponible).', true);
      return;
    }
    // Reload : dashboard-data / dashboard-final / chart / timeline relisent tout proprement.
    window.location.reload();
  }

  function init() {
    modal = document.querySelector('[data-sync-modal]');
    fileInput = document.querySelector('[data-sync-file]');
    importBtn = document.querySelector('[data-sync-import]');
    msg = document.querySelector('[data-sync-msg]');
    if (!modal) return;

    var openBtn = document.querySelector('[data-sync-open]');
    var closeBtn = document.querySelector('[data-sync-close]');
    var exportBtn = document.querySelector('[data-sync-export]');

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (exportBtn) exportBtn.addEventListener('click', doExport);
    if (fileInput) fileInput.addEventListener('change', onFile);
    if (importBtn) importBtn.addEventListener('click', onImport);

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
