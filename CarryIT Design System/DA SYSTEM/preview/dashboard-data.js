/* Dashboard — couche de données.
   Lit localStorage (carryItObjectifSMART + carryit_v1_jalons), normalise les champs
   doublés FR/EN, et expose window.CarryITDashboardData.
   Rien inventé : une clé/valeur absente → null. La carte affichera son état vide
   ("si y'a rien y'a rien"). Source de vérité unique consommée par chart.js + dashboard-final.js. */
(function () {
  function readJSON(key) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }
  function pick() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  }
  function num(v) { var n = Number(v); return (v !== null && v !== '' && isFinite(n)) ? n : null; }
  function deriveUnitShort(u) { return u ? (String(u).split(/[\s\/]/)[0] || '') : ''; }

  function normMeasure(m) {
    return {
      date: pick(m.date),
      value: num(pick(m.value, m.valeur)),
      total: num(pick(m.total)),
      delta: num(pick(m.delta)),
    };
  }

  function normKpi(k) {
    if (!k) return null;
    var measures = (Array.isArray(k.measures) ? k.measures : []).map(normMeasure)
      .filter(function (m) { return m.date; });
    return {
      type: pick(k.type),                                  // "leading" = Effort · "lagging" = Résultat
      label: pick(k.titre, k.label, k.title),
      value: num(pick(k.valeur, k.value)),
      target: num(pick(k.cible, k.target)),
      unit: pick(k.unite, k.unit) || '',
      unitShort: pick(k.unitShort) || deriveUnitShort(pick(k.unite, k.unit)),
      frequency: pick(k.frequence, k.frequency),
      mode: pick(k.modeMesure, k.mode),
      measures: measures,
    };
  }

  function build() {
    var smartRaw = readJSON('carryItObjectifSMART') || {};
    var gk = smartRaw.globalKpi || {};

    var objectiveKpi = {
      label: pick(gk.titre, gk.label, smartRaw.kpiLabel),
      value: num(pick(gk.valeur, gk.value)),
      target: num(pick(gk.cible, gk.target, smartRaw.kpiTarget)),
      unit: pick(gk.unite, gk.unit, smartRaw.kpiUnit) || '',
      measures: (Array.isArray(gk.measures) ? gk.measures : []).map(normMeasure)
        .filter(function (m) { return m.date; }),
    };

    var smart = {
      titre: pick(smartRaw.titre),
      specifique: pick(smartRaw.specifique),
      mesurable: pick(smartRaw.mesurable, smartRaw.kpiLabel),
      atteignable: pick(smartRaw.atteignable),
      realiste: pick(smartRaw.realiste),
      temporel: pick(smartRaw.temporel),
    };

    var jalons = readJSON('carryit_v1_jalons');
    if (!Array.isArray(jalons)) jalons = [];
    jalons = jalons.map(function (j) {
      return {
        titre: pick(j.titre, j.title),
        date: pick(j.date),
        statut: pick(j.statut, j.status),
        critere: pick(j.critere, j.validation),
        kpis: (Array.isArray(j.kpis) ? j.kpis : []).map(normKpi).filter(Boolean),
      };
    });

    var activeIndex = jalons.findIndex(function (j) { return j.statut === 'in_progress'; });
    if (activeIndex < 0) activeIndex = jalons.findIndex(function (j) { return j.statut !== 'completed'; });
    if (activeIndex < 0 && jalons.length) activeIndex = 0;
    var activeJalon = activeIndex >= 0 ? jalons[activeIndex] : null;
    var kpis = activeJalon ? activeJalon.kpis : [];

    return {
      smart: smart,
      objectiveKpi: objectiveKpi,
      jalons: jalons,
      activeIndex: activeIndex,
      activeJalon: activeJalon,
      effortKpi: kpis.find(function (k) { return k.type === 'leading'; }) || null,
      resultKpi: kpis.find(function (k) { return k.type === 'lagging'; }) || null,
    };
  }

  // build() est ré-exposé : après une édition SMART ou l'ajout d'une mesure,
  // on relit localStorage et on rafraîchit les vues (window.CarryITDashboardData).
  window.CarryITBuildDashboardData = build;
  window.CarryITDashboardData = build();
})();
