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

  // 'yyyy-mm-dd' → '1 juil. 2026' (bulle de survol des points).
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    if (!m) return '';
    return Number(m[3]) + ' ' + MONTHS_FR[Number(m[2]) - 1] + ' ' + m[1];
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
    // Robuste : rejette null/undefined/NaN (garde 0) et DÉDOUBLONNE par date. lightweight-charts
    // exige des temps uniques et croissants — 2 mesures le même jour (date par défaut =
    // aujourd'hui) → "Value is null" en boucle sinon. Dernière valeur d'une même date l'emporte.
    var byTime = {};
    (okpi.measures || []).forEach(function (m) {
      var t = toISO(m.date);
      var v = (m.value == null) ? null : Number(m.value);
      if (t && v != null && isFinite(v)) byTime[t] = v;
    });
    var data = Object.keys(byTime).sort().map(function (t) { return { time: t, value: byTime[t] }; });

    // Pas d'état vide : sans mesure, on trace le point de départ à 0 (aujourd'hui). L'axe, la
    // cible et le point sont là dès le premier écran — on comprend que la courbe part de zéro
    // et où elle doit aller, au lieu de lire « aucune donnée ».
    if (!data.length) data = [{ time: new Date().toISOString().slice(0, 10), value: 0 }];

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
        // Ligne verticale de repère seule ; labels natifs coupés (nos bulles HTML portent valeur + date).
        mode: (LW.CrosshairMode && LW.CrosshairMode.Magnet) || 1,
        vertLine: { color: tokens.crosshairLine, width: tokens.crosshairWidth, style: (LW.LineStyle && LW.LineStyle.Solid) || 0, labelVisible: false },
        horzLine: { visible: false, labelVisible: false },
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
      pointMarkersVisible: false,   /* pastilles rendues en HTML (calque) → survol = bulle de valeur */
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

    // Ligne de cible pointillée, titrée « Cible · N » : le haut du graphe est un repère, pas
    // un bord de cadre. Sans cible connue, rien à tracer (on n'invente pas de plafond).
    if (target > 0) {
      series.createPriceLine({
        price: target,
        color: tokens.targetLine,
        lineWidth: tokens.targetLineWidth || 1,
        lineStyle: (LW.LineStyle && LW.LineStyle.Dashed) || 2,
        axisLabelVisible: false,
      });
    }

    chart.timeScale().setVisibleRange({ from: data[0].time, to: data[data.length - 1].time });

    // ── Pastilles HTML : une par mesure, survol = bulle de la valeur saisie ──
    var layer = document.createElement('div');
    layer.className = 'ds-chart-point-layer';
    shell.appendChild(layer);

    var pointEls = [];      // { time, el } — pour activer le point le plus proche au survol de la ligne
    var activePoint = null; // point le plus proche du curseur (pour le clic → édition)

    // Clic sur une mesure → l'app ouvre l'édition (édite/supprime), comme dashboard.html.
    function emitClick(time) {
      document.dispatchEvent(new CustomEvent('carryit:measure-click', { detail: { date: time } }));
    }

    function positionPoints() {
      layer.replaceChildren();
      pointEls = [];
      if (target > 0) {
        var y = series.priceToCoordinate(target);
        if (isFinite(y)) {
          var lbl = document.createElement('span');
          lbl.className = 'ds-chart-target-label';
          lbl.textContent = 'Cible · ' + target;
          lbl.style.top = y + 'px';
          layer.appendChild(lbl);
        }
      }
      data.forEach(function (pt) {
        var x = chart.timeScale().timeToCoordinate(pt.time);
        var y = series.priceToCoordinate(pt.value);
        if (!isFinite(x) || !isFinite(y)) return;
        var point = document.createElement('div');
        point.className = 'ds-chart-point';
        point.style.left = x + 'px';
        point.style.top = y + 'px';
        point.tabIndex = 0;
        var val = document.createElement('span');
        val.className = 'ds-chart-point__value';   // bulle valeur — au-dessus du point
        val.textContent = String(pt.value);
        var date = document.createElement('span');
        date.className = 'ds-chart-point__date';    // date — en-dessous du point
        date.textContent = fmtDate(pt.time);
        point.appendChild(val);
        point.appendChild(date);
        point.addEventListener('click', function () { emitClick(pt.time); });  // clic direct sur la pastille
        layer.appendChild(point);
        pointEls.push({ time: pt.time, el: point });
      });
    }

    // Survol n'importe où sur le graphique → active le point le plus proche (bulle valeur + date).
    chart.subscribeCrosshairMove(function (param) {
      if (!param || !param.point) {
        activePoint = null;
        pointEls.forEach(function (p) { p.el.classList.remove('is-active'); });
        return;
      }
      var mx = param.point.x, best = null, bestD = Infinity;
      pointEls.forEach(function (p) {
        var x = chart.timeScale().timeToCoordinate(p.time);
        if (!isFinite(x)) return;
        var d = Math.abs(x - mx);
        if (d < bestD) { bestD = d; best = p; }
      });
      activePoint = best;
      pointEls.forEach(function (p) { p.el.classList.toggle('is-active', p === best); });
    });

    // Clic sur la ligne (canvas) → édite le point le plus proche (celui surligné).
    chart.subscribeClick(function () { if (activePoint) emitClick(activePoint.time); });

    requestAnimationFrame(positionPoints);
    chart.timeScale().subscribeVisibleTimeRangeChange(positionPoints);
    if (window.ResizeObserver) {
      new ResizeObserver(function () { requestAnimationFrame(positionPoints); }).observe(el);
    }
  }

  // Ré-exposé : après ajout/édition d'une mesure, on relit les données et on retrace.
  window.CarryITRenderChart = render;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
