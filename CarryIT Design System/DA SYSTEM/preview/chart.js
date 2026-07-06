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

  function init() {
    var el = document.getElementById('dsChartCanvas');
    var LW = window.LightweightCharts;
    if (!el || !LW) return;

    var tokens = readTokens(el);

    var data = [
      { time: '2026-01-01', value: 8 },
      { time: '2026-02-01', value: 14 },
      { time: '2026-03-01', value: 18 },
      { time: '2026-04-01', value: 26 },
      { time: '2026-05-01', value: 32 },
      { time: '2026-06-01', value: 48 },
    ];
    var target = 100;

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
      autoscaleInfoProvider: function () {
        // Bornes = 0 (un count n'est jamais négatif) → cible + marge (≈ +10%).
        // Montre le chemin vers la cible (100) sans le désert du haut ni le -20 faux.
        return {
          priceRange: { minValue: 0, maxValue: Math.ceil((target * 1.1) / 10) * 10 },
          margins: { above: 0, below: 0 },
        };
      },
    };

    var series = (LW.AreaSeries && chart.addSeries)
      ? chart.addSeries(LW.AreaSeries, seriesOptions)
      : chart.addAreaSeries(seriesOptions);

    series.setData(data);

    series.createPriceLine({
      price: target,
      color: tokens.targetLine,
      lineWidth: tokens.targetLineWidth,
      lineStyle: (LW.LineStyle && LW.LineStyle.Dashed) || 2,
      axisLabelVisible: false,
      title: '',
    });

    chart.timeScale().setVisibleRange({ from: data[0].time, to: data[data.length - 1].time });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
