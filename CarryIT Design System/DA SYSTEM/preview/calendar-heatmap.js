(function () {
  var DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  var TODAY_ISO = '2026-06-18';

  var DEMO = {
    '2026-06-02': {
      type: 'Effort', label: 'Heures entre chaque Test', unit: 'H/entre chaque test',
      value: 12, prev: 11, time: '10:15', duration: '1h',
    },
    '2026-06-04': {
      type: 'Résultat', label: 'Beta testeur', unit: 'Beta testeur',
      value: 5, prev: 3, time: '14:00', duration: '30min',
    },
    '2026-06-09': {
      type: 'Effort', label: 'Heures entre chaque Test', unit: 'H/entre chaque test',
      value: 20, prev: 12, time: '09:00', duration: '2h',
    },
    '2026-06-18': {
      type: 'Effort', label: 'Heures entre chaque Test', unit: 'H/entre chaque test',
      value: 44, prev: 33, time: '12:15', duration: '1h',
      note: 'Tri des retours, ajustement du message de recrutement.',
    },
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function buildCells() {
    var start = new Date(2026, 5, 1);
    var cells = [];
    for (var i = 0; i < 28; i++) {
      var d = new Date(start);
      d.setDate(start.getDate() + i);
      var iso = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      var entry = DEMO[iso];
      cells.push({
        iso: iso,
        day: d.getDate(),
        dateLabel: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        isToday: iso === TODAY_ISO,
        active: !!entry,
        isResult: !!entry && entry.type === 'Résultat',
        entry: entry || null,
      });
    }
    return cells;
  }

  function deltaBadge(prev, value, isResult) {
    if (prev === undefined || value === undefined) return '';
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
    var hh = Number(e.time.split(':')[0]);
    var mm = Number(e.time.split(':')[1]);
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

  function init() {
    var grid = document.getElementById('dsHeatmapGrid');
    var popover = document.getElementById('dsHeatmapPopover');
    if (!grid || !popover) return;

    var cells = buildCells();

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
