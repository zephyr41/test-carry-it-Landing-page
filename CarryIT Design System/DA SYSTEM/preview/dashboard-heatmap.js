/* Dashboard — carte cadence (heatmap) de la vue moyen terme, dynamique.
   Remplace calendar-heatmap.js (100% DEMO hardcodé). Lit window.CarryITDashboardData :
   pour le jalon actif, pose sur la grille du mois courant la DERNIÈRE mesure de chaque
   jour (effort ou résultat), avec popover au survol (bloc horaire réel + valeur + delta).
   Vide pur : aucune donnée fabriquée. Jour sans mesure → cellule inactive. */
(function () {
  'use strict';

  var DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  function pad(n) { return String(n).padStart(2, '0'); }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  // Date comparable yyyy-mm-dd depuis ISO OU jj/mm/aaaa (les 2 coexistent en stockage).
  function toISO(d) {
    if (!d) return null;
    if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
    return m ? (m[3] + '-' + m[2] + '-' + m[1]) : d;
  }
  function timeKey(t) { return /^\d{1,2}:\d{2}/.test(t || '') ? t : '00:00'; }

  // Aplatit les mesures d'un KPI en entrées horodatées + valeur précédente (pour le delta).
  function kpiEntries(kpi, type, isResult) {
    if (!kpi || !Array.isArray(kpi.measures)) return [];
    var unit = kpi.unitShort || kpi.unit || '';
    var label = kpi.label || '';
    var rows = kpi.measures
      .map(function (m) { return { iso: toISO(m.date), time: timeKey(m.time), m: m }; })
      .filter(function (r) { return r.iso; })
      .sort(function (a, b) {
        var ka = a.iso + 'T' + a.time, kb = b.iso + 'T' + b.time;
        return ka < kb ? -1 : ka > kb ? 1 : 0;
      });
    return rows.map(function (r, i) {
      var prev = i > 0 ? rows[i - 1].m.value : undefined;
      return {
        iso: r.iso, time: r.time,
        type: type, isResult: isResult, label: label, unit: unit,
        value: r.m.value, prev: prev == null ? undefined : prev,
        duration: r.m.duration || '', note: r.m.note || '',
      };
    });
  }

  // Map iso → dernière entrée du jour (par heure), tous KPI confondus.
  function buildDayMap() {
    var d = window.CarryITDashboardData || {};
    var entries = kpiEntries(d.effortKpi, 'Effort', false)
      .concat(kpiEntries(d.resultKpi, 'Résultat', true));
    var byDay = {};
    entries.forEach(function (e) {
      var cur = byDay[e.iso];
      if (!cur || e.time >= cur.time) byDay[e.iso] = e;
    });
    return byDay;
  }

  // 28 cellules à partir du 1er du mois courant (même géométrie 4×7 que v4).
  function buildCells(byDay) {
    var now = new Date();
    var start = new Date(now.getFullYear(), now.getMonth(), 1);
    var today = todayISO();
    var cells = [];
    for (var i = 0; i < 28; i++) {
      var dt = new Date(start);
      dt.setDate(start.getDate() + i);
      var iso = dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
      var entry = byDay[iso] || null;
      cells.push({
        iso: iso,
        dateLabel: dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        isToday: iso === today,
        active: !!entry,
        isResult: !!entry && entry.isResult,
        entry: entry,
      });
    }
    return cells;
  }

  function deltaBadge(prev, value, isResult) {
    if (prev === undefined || value == null) return '';
    var delta = value - prev;
    var sign = delta > 0 ? '+' : delta < 0 ? '−' : '';
    var cls = isResult ? 'ds-heatmap-popover-delta ds-heatmap-popover-delta--result' : 'ds-heatmap-popover-delta';
    return '<span class="' + cls + '">' + sign + Math.abs(delta) + '</span>';
  }

  function renderPopover(popover, cell) {
    if (!cell.active) {
      popover.innerHTML =
        '<div class="ds-heatmap-popover-hd"><span class="ds-heatmap-popover-date">' + cell.dateLabel + '</span></div>' +
        '<div class="ds-heatmap-popover-empty">Aucun enregistrement sur cette journée.</div>';
      popover.classList.add('ds-heatmap-popover--visible');
      return;
    }
    var e = cell.entry;
    var isResult = cell.isResult;
    var t = timeKey(e.time);
    var hh = Number(t.split(':')[0]);
    var mm = Number(t.split(':')[1]);
    var h = hh + mm / 60;
    var startH = Math.max(0, Math.floor(h) - 1);
    var hours = [startH, startH + 1, startH + 2, startH + 3];
    var top = Math.round((h - startH) * 23);

    var hoursHtml = hours.map(function (hr) { return '<span>' + pad(hr) + ':00</span>'; }).join('');
    var blockCls = 'ds-heatmap-popover-block' + (isResult ? ' ds-heatmap-popover-block--result' : '');
    var badgeCls = 'ds-heatmap-badge ' + (isResult ? 'ds-heatmap-badge--result' : 'ds-heatmap-badge--effort');

    popover.innerHTML =
      '<div class="ds-heatmap-popover-hd">' +
        '<span class="' + badgeCls + '">' + e.type + '</span>' +
        '<span class="ds-heatmap-popover-date">' + cell.dateLabel + '</span>' +
      '</div>' +
      '<div class="ds-heatmap-popover-top">' +
        '<div class="ds-heatmap-popover-hours">' + hoursHtml + '</div>' +
        '<div class="ds-heatmap-popover-schedule">' +
          '<div class="' + blockCls + '" style="top:' + top + 'px">' +
            '<div class="ds-heatmap-popover-block-sub">' + e.label + '</div>' +
            '<div class="ds-heatmap-popover-value-line">' +
              '<div class="ds-heatmap-popover-block-title">' + e.value + '</div>' +
              deltaBadge(e.prev, e.value, isResult) +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (e.note ? '<div class="ds-heatmap-popover-note">' + e.note + '</div>' : '');
    popover.classList.add('ds-heatmap-popover--visible');
  }

  function render() {
    var grid = document.getElementById('dsHeatmapGrid');
    var popover = document.getElementById('dsHeatmapPopover');
    if (!grid || !popover) return;

    var cells = buildCells(buildDayMap());

    var html = DAY_LABELS.map(function (d) {
      return '<div class="ds-heatmap-day-label">' + d + '</div>';
    }).join('');

    html += cells.map(function (cell) {
      var dotCls = 'ds-heatmap-dot';
      if (cell.isResult) dotCls += ' ds-heatmap-dot--result';
      else if (cell.active) dotCls += ' ds-heatmap-dot--active';
      if (cell.isToday) dotCls += ' ds-heatmap-dot--today';
      var cellCls = 'ds-heatmap-cell' + (cell.active ? ' ds-heatmap-cell--has-data' : '');
      return '<button type="button" class="' + cellCls + '" data-iso="' + cell.iso + '" aria-label="' + cell.dateLabel + '">' +
        '<span class="' + dotCls + '"></span></button>';
    }).join('');

    grid.innerHTML = html;

    var cellByIso = {};
    cells.forEach(function (c) { cellByIso[c.iso] = c; });

    grid.querySelectorAll('.ds-heatmap-cell').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        renderPopover(popover, cellByIso[btn.dataset.iso]);
      });
    });
    grid.addEventListener('mouseleave', function () {
      popover.classList.remove('ds-heatmap-popover--visible');
      popover.innerHTML = '';
    });
  }

  // Ré-exposé : rafraîchi après écriture (ajout de mesure / validation).
  window.CarryITRefreshHeatmap = render;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
