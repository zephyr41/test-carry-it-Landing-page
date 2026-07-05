(function () {
  'use strict';

  // Config comportementale (données, pas des valeurs de style) : plage horaire affichée.
  var TL_START = 6;
  var TL_END = 23;
  var TL_TOTAL = TL_END - TL_START;

  var state = { startHour: 15, duration: 1 };
  var hourHeight = 0; // px, lu depuis le DOM (token --scheduler-hour-height)

  var els = {};

  function pad(n) { return String(n).padStart(2, '0'); }

  function snapQuarter(hour) { return Math.round(hour * 4) / 4; }

  function yToHour(y) { return TL_START + y / hourHeight; }

  function formatHour(hour) {
    var h = Math.floor(hour);
    var m = Math.round((hour - h) * 60);
    return pad(h) + ':' + pad(m);
  }

  function formatDuration(duration) {
    var minutes = Math.round(duration * 60);
    if (minutes < 60) return minutes + 'min';
    if (minutes % 60 === 0) return (minutes / 60) + 'h';
    return Math.floor(minutes / 60) + 'h' + pad(minutes % 60);
  }

  function renderHours() {
    var html = '';
    for (var i = 0; i <= TL_TOTAL; i++) {
      html += '<div><span class="ds-scheduler__hour-label">' + pad(TL_START + i) +
        ':00</span><div class="ds-scheduler__hour-line"></div></div>';
    }
    els.hours.innerHTML = html;
    var firstRow = els.hours.firstElementChild;
    hourHeight = firstRow ? firstRow.offsetHeight : 0;
  }

  function setBlock(startHour, duration, shouldScroll) {
    var safeDuration = Math.max(0.25, Math.min(TL_TOTAL, Number(duration) || 1));
    var safeStart = Math.max(TL_START, Math.min(TL_END - safeDuration, Number(startHour) || TL_START));
    state = { startHour: safeStart, duration: safeDuration };

    els.block.style.top = ((safeStart - TL_START) * hourHeight) + 'px';
    els.block.style.height = (safeDuration * hourHeight) + 'px';

    var text = formatHour(safeStart) + ' → ' + formatHour(safeStart + safeDuration) +
      ' · ' + formatDuration(safeDuration);
    els.blockLabel.textContent = text;
    els.summary.textContent = text;

    // Sync ARIA slider (clavier + lecteur d'écran).
    els.block.setAttribute('aria-valuenow', String(safeStart));
    els.block.setAttribute('aria-valuetext',
      formatHour(safeStart) + ' à ' + formatHour(safeStart + safeDuration) +
      ', durée ' + formatDuration(safeDuration));

    if (shouldScroll) {
      els.viewport.scrollTop = Math.max(0, (safeStart - TL_START - 1) * hourHeight);
    }
  }

  // Opération clavier du bloc (role="slider") : ↑↓ déplace de 15 min,
  // Maj+↑↓ ajuste la durée, Home/End cadrent sur les bornes.
  function onBlockKeydown(event) {
    var STEP = 0.25; // quart d'heure
    var s = state.startHour, d = state.duration, handled = true;
    switch (event.key) {
      case 'ArrowDown': event.shiftKey ? (d += STEP) : (s += STEP); break;
      case 'ArrowUp':   event.shiftKey ? (d -= STEP) : (s -= STEP); break;
      case 'PageDown':  s += 1; break;
      case 'PageUp':    s -= 1; break;
      case 'Home':      s = TL_START; break;
      case 'End':       s = TL_END - d; break;
      default: handled = false;
    }
    if (!handled) return;
    event.preventDefault();
    if (event.shiftKey) setBlock(s, d, true);
    else setBlock(s, state.duration, true);
  }

  function getRelY(clientY) {
    return clientY - els.track.getBoundingClientRect().top;
  }

  function pointerY(event) {
    return (event.touches && event.touches[0]) ? event.touches[0].clientY : event.clientY;
  }

  function startDrag(onMove, onUp) {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }

  function stopDrag(onMove, onUp) {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onUp);
  }

  // Auto-scroll quand le pointeur approche les bords du viewport pendant un drag.
  function makeEdgeScroller(scroller) {
    var rafId = null, lastY = 0, threshold = 48, maxSpeed = 10;
    function tick() {
      if (!scroller) return;
      var rect = scroller.getBoundingClientRect();
      if (lastY < rect.top + threshold) {
        var rTop = 1 - (lastY - rect.top) / threshold;
        scroller.scrollTop -= Math.ceil(maxSpeed * Math.max(0.1, rTop));
        rafId = requestAnimationFrame(tick);
      } else if (lastY > rect.bottom - threshold) {
        var rBot = 1 - (rect.bottom - lastY) / threshold;
        scroller.scrollTop += Math.ceil(maxSpeed * Math.max(0.1, rBot));
        rafId = requestAnimationFrame(tick);
      }
    }
    return {
      update: function (y) { lastY = y; if (rafId) cancelAnimationFrame(rafId); tick(); },
      cancel: function () { if (rafId) cancelAnimationFrame(rafId); rafId = null; }
    };
  }

  // Clic sur le track vide : crée un bloc en glissant.
  function onTrackDown(event) {
    if (event.target.closest('.ds-scheduler__block')) return;
    event.preventDefault();
    var fixedStart = Math.max(TL_START,
      Math.min(TL_END - 0.25, snapQuarter(yToHour(getRelY(pointerY(event))))));
    setBlock(fixedStart, 0.25);
    var onMove = function (ev) {
      var endHour = snapQuarter(yToHour(getRelY(pointerY(ev))));
      setBlock(fixedStart, Math.max(0.25, Math.min(TL_END - fixedStart, endHour - fixedStart)));
      if (ev.cancelable) ev.preventDefault();
    };
    var onUp = function () { stopDrag(onMove, onUp); };
    startDrag(onMove, onUp);
  }

  // Drag du bloc entier.
  function onBlockDown(event) {
    event.stopPropagation();
    event.preventDefault();
    var offset = yToHour(getRelY(pointerY(event))) - state.startHour;
    var scroller = makeEdgeScroller(els.viewport);
    var onMove = function (ev) {
      var clientY = pointerY(ev);
      var nextStart = snapQuarter(yToHour(getRelY(clientY)) - offset);
      setBlock(nextStart, state.duration);
      scroller.update(clientY);
      if (ev.cancelable) ev.preventDefault();
    };
    var onUp = function () { scroller.cancel(); stopDrag(onMove, onUp); };
    startDrag(onMove, onUp);
  }

  // Resize par la poignée basse.
  function onResizeDown(event) {
    event.stopPropagation();
    event.preventDefault();
    var scroller = makeEdgeScroller(els.viewport);
    var onMove = function (ev) {
      var clientY = pointerY(ev);
      var endHour = snapQuarter(yToHour(getRelY(clientY)));
      setBlock(state.startHour, endHour - state.startHour);
      scroller.update(clientY);
      if (ev.cancelable) ev.preventDefault();
    };
    var onUp = function () { scroller.cancel(); stopDrag(onMove, onUp); };
    startDrag(onMove, onUp);
  }

  // ---- Input number steppers ----
  function bindSteppers() {
    var field = document.getElementById('effortQty');
    document.querySelectorAll('.ds-input-number__step').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = Number(btn.dataset.step) || 0;
        var current = Number(field.value) || 0;
        var next = current + step;
        if (next < 0) next = 0;
        field.value = String(next);
        field.focus();
      });
    });
  }

  // ---- Navigation date ----
  var MONTHS_FR = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
    'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  var currentDate = new Date();

  function renderDate() {
    var label = document.getElementById('effortDateLabel');
    label.textContent = currentDate.getDate() + ' ' + MONTHS_FR[currentDate.getMonth()] +
      ' ' + currentDate.getFullYear();
  }

  function bindDateNav() {
    document.querySelectorAll('[data-date-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentDate.setDate(currentDate.getDate() + (Number(btn.dataset.dateStep) || 0));
        renderDate();
      });
    });
    renderDate();
  }

  function init() {
    els.track = document.getElementById('schedTrack');
    els.hours = document.getElementById('schedHours');
    els.block = document.getElementById('schedBlock');
    els.blockLabel = document.getElementById('schedBlockLabel');
    els.summary = document.getElementById('schedSummary');
    els.viewport = document.getElementById('schedViewport');
    if (!els.track) return;

    renderHours();
    setBlock(state.startHour, state.duration, true);

    els.track.addEventListener('mousedown', onTrackDown);
    els.track.addEventListener('touchstart', onTrackDown, { passive: false });
    els.block.addEventListener('mousedown', onBlockDown);
    els.block.addEventListener('touchstart', onBlockDown, { passive: false });
    els.block.addEventListener('keydown', onBlockKeydown);
    document.getElementById('schedResize').addEventListener('mousedown', onResizeDown);
    document.getElementById('schedResize').addEventListener('touchstart', onResizeDown, { passive: false });

    bindSteppers();
    bindDateNav();
    bindModalFocusTrap();
  }

  // Focus-trap du modal : Tab reste dans le dialog, Échap retire le focus.
  function bindModalFocusTrap() {
    var modal = document.querySelector('.ds-effort-modal');
    if (!modal) return;
    var selector = 'a[href],button:not([disabled]),input:not([disabled]),' +
      'textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { document.activeElement && document.activeElement.blur(); return; }
      if (e.key !== 'Tab') return;
      var items = Array.prototype.filter.call(
        modal.querySelectorAll(selector),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
