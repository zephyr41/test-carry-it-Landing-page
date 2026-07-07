(function () {
  var MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  function readTokens(el) {
    var cs = getComputedStyle(el);
    function v(name) { return cs.getPropertyValue(name).trim(); }
    return {
      gridLine: v('--chart-grid-line'),
      axisText: v('--chart-axis-text'),
      lineColor: v('--chart-line-color'),
      areaTop: v('--chart-area-top'),
      areaBottom: v('--chart-area-bottom'),
      targetLine: v('--chart-target-line'),
      crosshairLine: v('--chart-crosshair-line'),
      lastValueBg: v('--chart-last-value-bg'),
      fontFamily: cs.getPropertyValue('font-family').trim(),
      fontSize: parseFloat(cs.fontSize) || 12,
      lineWidth: parseFloat(v('--chart-line-width')),
      targetLineWidth: parseFloat(v('--chart-target-line-width')),
      pointRadius: parseFloat(v('--chart-point-radius')),
      markerRadius: parseFloat(v('--chart-marker-radius')),
      scaleMargin: parseFloat(v('--chart-scale-margin')),
      crosshairWidth: parseFloat(v('--chart-crosshair-width')),
      minHeight: parseFloat(cs.minHeight) || 300,
    };
  }

  // Date → 'yyyy-mm-dd' (lightweight-charts). Accepte 'dd/mm/yyyy' (ancien stockage) ou ISO.
  function toISO(d) {
    if (!d) return null;
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
    if (m) return m[3] + '-' + m[2] + '-' + m[1];
    var dt = new Date(d);
    return isNaN(dt) ? null : dt.toISOString().slice(0, 10);
  }

  function renderEmpty(shell) {
    shell.innerHTML =
      '<div class="ds-empty-state">' +
        '<svg class="ds-empty-state__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M9 16V9M14 16V7M19 16v-4"/></svg>' +
        '<h3 class="type-h3">Aucune donnée enregistrée</h3>' +
        '<p class="ds-empty-state__description type-body-md">Le graphique s\'affichera dès la première mesure enregistrée.</p>' +
      '</div>';
  }

  var chartInstance = null;

  function render() {
    var shell = document.querySelector('.ds-chart-shell');
    if (!shell) return;
    var LW = window.LightweightCharts;
    if (!LW) return;

    // Détruire l'instance précédente + repartir d'un canvas propre (re-render après mesure).
    if (chartInstance) { try { chartInstance.remove(); } catch (e) {} chartInstance = null; }
    shell.innerHTML = '<div id="dsChartCanvas" class="ds-chart-canvas" aria-label="Évolution du KPI"></div>';
    var el = document.getElementById('dsChartCanvas');

    var dash = window.CarryITDashboardData || {};
    var okpi = dash.objectiveKpi || {};
    var data = (okpi.measures || [])
      .map(function (m) { return { time: toISO(m.date), value: m.value }; })
      .filter(function (p) { return p.time && p.value != null; })
      .sort(function (a, b) { return a.time < b.time ? -1 : a.time > b.time ? 1 : 0; });

    // Rien à tracer → état vide DS (pas de courbe fantôme).
    if (!data.length) { renderEmpty(shell); return; }

    var target = okpi.target; // cible : l'axe monte jusqu'ici → vraie distance, sans flatter.
    var tokens = readTokens(el);

    var chart = LW.createChart(el, {
      width: el.clientWidth,
      height: Math.max(el.clientHeight, tokens.minHeight),
      autoSize: true,
      layout: {
        background: { type: (LW.ColorType && LW.ColorType.Solid) || 'solid', color: 'transparent' },
        textColor: tokens.axisText,
        fontFamily: tokens.fontFamily,
        fontSize: tokens.fontSize,
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: tokens.gridLine },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: tokens.scaleMargin, bottom: tokens.scaleMargin },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        tickMarkFormatter: function (time) {
          var d;
          if (typeof time === 'string') {
            d = new Date(time);
          } else if (typeof time === 'object' && time && 'year' in time) {
            d = new Date(Date.UTC(time.year, time.month - 1, time.day));
          } else {
            d = new Date(time * 1000);
          }
          return MONTHS_FR[d.getUTCMonth()];
        },
      },
      crosshair: {
        mode: (LW.CrosshairMode && LW.CrosshairMode.Normal) || 0,
        vertLine: { color: tokens.crosshairLine, width: tokens.crosshairWidth, style: (LW.LineStyle && LW.LineStyle.Solid) || 0, labelBackgroundColor: tokens.lastValueBg },
        horzLine: { color: tokens.crosshairLine, width: tokens.crosshairWidth, style: (LW.LineStyle && LW.LineStyle.Solid) || 0, labelBackgroundColor: tokens.lastValueBg },
      },
      handleScroll: false,
      handleScale: false,
    });
    chartInstance = chart;

    var seriesOptions = {
      lineColor: tokens.lineColor,
      topColor: tokens.areaTop,
      bottomColor: tokens.areaBottom,
      lineWidth: tokens.lineWidth,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: tokens.markerRadius,
      crosshairMarkerBorderColor: tokens.lastValueBg,
      crosshairMarkerBackgroundColor: tokens.lineColor,
      pointMarkersVisible: true,
      pointMarkersRadius: tokens.pointRadius,
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
      autoscaleInfoProvider: function (orig) {
        // Cible connue → l'axe monte de 0 à la cible : la courbe se lit à sa VRAIE hauteur
        // (ex. 128/1000 ≈ 12 %), pas un élan trompeur qui remplit la frame.
        // Pas de cible → autoscale par défaut sur la trajectoire.
        if (!(target > 0)) return orig();
        return {
          priceRange: { minValue: 0, maxValue: target },
          margins: { above: 0, below: 0 },
        };
      },
    };

    var series = (LW.AreaSeries && chart.addSeries)
      ? chart.addSeries(LW.AreaSeries, seriesOptions)
      : chart.addAreaSeries(seriesOptions);

    series.setData(data);

    // Pas de ligne cible : l'axe scale sur la trajectoire → la courbe montre l'élan.
    // La cible (1000) vit sur la carte hero, pas ici (une seule source de vérité).

    chart.timeScale().setVisibleRange({ from: data[0].time, to: data[data.length - 1].time });
  }

  // Ré-exposé : après ajout/édition d'une mesure, on relit les données et on retrace.
  window.CarryITRenderChart = render;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
