/* Dashboard — couche de données.
   Lit localStorage (carryItObjectifSMART + carryit_v1_jalons), normalise les champs
   doublés FR/EN, et expose window.CarryITDashboardData.
   Rien inventé : une clé/valeur absente → null. La carte affichera son état vide
   ("si y'a rien y'a rien"). Source de vérité unique consommée par chart.js + dashboard-final.js. */
(function () {
  // Robuste au double-encodage (certaines écritures de l'app stringifient 2× → string).
  function readJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null || raw === '') return null;
      var v = JSON.parse(raw), guard = 0;
      while (typeof v === 'string' && guard++ < 3) { try { v = JSON.parse(v); } catch (e) { break; } }
      return v;
    } catch (e) { return null; }
  }
  function pick() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  }
  function num(v) { var n = Number(v); return (v !== null && v !== '' && isFinite(n)) ? n : null; }
  // Date comparable (yyyy-mm-dd) depuis ISO OU jj/mm/aaaa (les 2 formats coexistent en stockage).
  function toComparable(d) {
    if (!d) return '';
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
    return m ? (m[3] + '-' + m[2] + '-' + m[1]) : d;
  }
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
    // Fallback stockage React (le vrai app écrit AUSSI ces clés) — sans ça, un SMART/KPI
    // stocké côté « v1 » ne s'affiche pas alors qu'il a bien été importé.
    var v1smart = readJSON('carryit_v1_smart') || {};   // { S, M, A, R, T }
    var v1kpi = readJSON('carryit_v1_kpi') || {};        // { label, target/cible, unit, value, measures }
    var gk = smartRaw.globalKpi || {};

    // measures du chart : celles du legacy globalKpi si présentes, sinon celles du KPI React.
    var gkMeasures = (Array.isArray(gk.measures) && gk.measures.length)
      ? gk.measures
      : (Array.isArray(v1kpi.measures) ? v1kpi.measures : []);

    var oMeasures = gkMeasures.map(normMeasure).filter(function (m) { return m.date; });
    // Valeur courante du KPI = dernière mesure VALIDE (par date). Sinon la valeur stockée.
    var latestVal = null;
    var withVal = oMeasures.filter(function (m) { return m.value != null; });
    if (withVal.length) {
      var srt = withVal.slice().sort(function (a, b) {
        var ta = toComparable(a.date), tb = toComparable(b.date);
        return ta < tb ? -1 : ta > tb ? 1 : 0;
      });
      latestVal = srt[srt.length - 1].value;
    }
    var objectiveKpi = {
      label: pick(gk.titre, gk.label, smartRaw.kpiLabel, v1kpi.label, v1kpi.titre),
      value: (latestVal != null ? latestVal : num(pick(gk.valeur, gk.value, v1kpi.value, v1kpi.valeur))),
      target: num(pick(gk.cible, gk.target, smartRaw.kpiTarget, v1kpi.cible, v1kpi.target)),
      unit: pick(gk.unite, gk.unit, smartRaw.kpiUnit, v1kpi.unit, v1kpi.unite) || '',
      measures: oMeasures,
    };

    var smart = {
      titre: pick(smartRaw.titre),
      specifique: pick(smartRaw.specifique, v1smart.S),
      mesurable: pick(smartRaw.mesurable, smartRaw.kpiLabel, v1smart.M),
      atteignable: pick(smartRaw.atteignable, v1smart.A),
      realiste: pick(smartRaw.realiste, v1smart.R),
      temporel: pick(smartRaw.temporel, v1smart.T),
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
