(function () {
  'use strict';

  // Scheduler à SCROLL INFINI : le rail des heures boucle (…22,23,00,01…). Technique standard :
  // on empile COPIES copies de 24h et on recentre le scroll aux bords (contenu identique = illusion
  // d'infini). La valeur stockée = heure mod 24. state.top = position ABSOLUE (px) du bloc dans le rail.
  var HOURS = 24;
  var COPIES = 3;
  var TOTAL = HOURS * COPIES;

  var state = { top: 0, duration: 1 };
  var hourHeight = 0;   // px, lu depuis le DOM (token --scheduler-hour-height)
  var dayHeight = 0;    // = 24 * hourHeight
  var dragging = false;

  var els = {};

  function pad(n) { return String(n).padStart(2, '0'); }
  function mod24(h) { return ((h % 24) + 24) % 24; }
  function absToHour(topPx) { return mod24(topPx / hourHeight); }
  function snapPx(px) { var q = hourHeight / 4; return Math.round(px / q) * q; }   // quart d'heure

  function formatHour(hour) {
    var h = mod24(hour);
    var hh = Math.floor(h);
    var m = Math.round((h - hh) * 60);
    if (m === 60) { hh = mod24(hh + 1); m = 0; }
    return pad(hh) + ':' + pad(m);
  }
  function formatDuration(duration) {
    var minutes = Math.round(duration * 60);
    if (minutes < 60) return minutes + 'min';
    if (minutes % 60 === 0) return (minutes / 60) + 'h';
    return Math.floor(minutes / 60) + 'h' + pad(minutes % 60);
  }

  function renderHours() {
    var html = '';
    for (var i = 0; i < TOTAL; i++) {
      html += '<div><span class="ds-scheduler__hour-label">' + pad(i % 24) +
        ':00</span><div class="ds-scheduler__hour-line"></div></div>';
    }
    els.hours.innerHTML = html;
    var firstRow = els.hours.firstElementChild;
    hourHeight = firstRow ? firstRow.offsetHeight : 0;
    dayHeight = HOURS * hourHeight;
  }

  // Applique la position/hauteur du bloc + met à jour les libellés/ARIA.
  function applyBlock() {
    els.block.style.top = state.top + 'px';
    els.block.style.height = (state.duration * hourHeight) + 'px';
    var startH = absToHour(state.top);
    var text = formatHour(startH) + ' → ' + formatHour(startH + state.duration) + ' · ' + formatDuration(state.duration);
    els.blockLabel.textContent = text;
    els.summary.textContent = text;
    els.block.setAttribute('aria-valuenow', String(startH.toFixed(2)));
    els.block.setAttribute('aria-valuetext',
      formatHour(startH) + ' à ' + formatHour(startH + state.duration) + ', durée ' + formatDuration(state.duration));
  }

  // Recentre le scroll (et le bloc, du même décalage) pour rester dans la copie du milieu → boucle infinie.
  function recenter() {
    var M = dayHeight;               // début de la copie du milieu (index 1)
    var st = els.viewport.scrollTop, top = state.top, moved = false;
    while (st < M - 0.5 * dayHeight) { st += dayHeight; top += dayHeight; moved = true; }
    while (st > M + 0.5 * dayHeight) { st -= dayHeight; top -= dayHeight; moved = true; }
    if (moved) { state.top = top; els.block.style.top = top + 'px'; els.viewport.scrollTop = st; }
  }

  function setBlock(startHour, duration, shouldScroll) {
    var d = Math.max(0.25, Math.min(HOURS, Number(duration) || 1));
    var sh = mod24(Number(startHour) || 0);
    state = { top: dayHeight + sh * hourHeight, duration: d };   // placé dans la copie du milieu
    applyBlock();
    if (shouldScroll) {
      els.viewport.scrollTop = state.top - hourHeight * 1.5;
      recenter();
    }
  }

  // Clavier (role="slider") : ↑↓ = 15 min, Maj+↑↓ = durée, PageUp/Down = 1h, Home/End = 00:00.
  function onBlockKeydown(event) {
    var STEP = 0.25;
    var s = absToHour(state.top), d = state.duration, handled = true;
    switch (event.key) {
      case 'ArrowDown': event.shiftKey ? (d += STEP) : (s += STEP); break;
      case 'ArrowUp':   event.shiftKey ? (d -= STEP) : (s -= STEP); break;
      case 'PageDown':  s += 1; break;
      case 'PageUp':    s -= 1; break;
      case 'Home':      s = 0; break;
      case 'End':       s = 23; break;
      default: handled = false;
    }
    if (!handled) return;
    event.preventDefault();
    setBlock(s, event.shiftKey ? d : state.duration, true);
  }

  function getRelY(clientY) { return clientY - els.track.getBoundingClientRect().top; }
  function pointerY(event) { return (event.touches && event.touches[0]) ? event.touches[0].clientY : event.clientY; }

  function startDrag(onMove, onUp) {
    dragging = true;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }
  function stopDrag(onMove, onUp) {
    dragging = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', onUp);
    recenter();   // normalise dans la copie du milieu après le drag
  }

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
    var fixedTop = snapPx(getRelY(pointerY(event)));
    state.top = fixedTop; state.duration = 0.25; applyBlock();
    var scroller = makeEdgeScroller(els.viewport);
    var onMove = function (ev) {
      var endTop = snapPx(getRelY(pointerY(ev)));
      state.duration = Math.max(0.25, Math.min(HOURS, (endTop - fixedTop) / hourHeight));   // durée ≤ 24h
      applyBlock();
      scroller.update(pointerY(ev));
      if (ev.cancelable) ev.preventDefault();
    };
    var onUp = function () { scroller.cancel(); stopDrag(onMove, onUp); };
    startDrag(onMove, onUp);
  }

  // Drag du bloc entier (traverse minuit librement dans le buffer, normalisé au relâchement).
  function onBlockDown(event) {
    event.stopPropagation();
    event.preventDefault();
    var offset = getRelY(pointerY(event)) - state.top;
    var scroller = makeEdgeScroller(els.viewport);
    var onMove = function (ev) {
      var clientY = pointerY(ev);
      state.top = snapPx(getRelY(clientY) - offset);
      applyBlock();
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
      state.duration = Math.max(0.25, Math.min(HOURS, (snapPx(getRelY(clientY)) - state.top) / hourHeight));   // durée ≤ 24h
      applyBlock();
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
        var next = (Number(field.value) || 0) + step;
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
    label.textContent = currentDate.getDate() + ' ' + MONTHS_FR[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
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
    setBlock(15, 1, true);

    els.track.addEventListener('mousedown', onTrackDown);
    els.track.addEventListener('touchstart', onTrackDown, { passive: false });
    els.block.addEventListener('mousedown', onBlockDown);
    els.block.addEventListener('touchstart', onBlockDown, { passive: false });
    els.block.addEventListener('keydown', onBlockKeydown);
    document.getElementById('schedResize').addEventListener('mousedown', onResizeDown);
    document.getElementById('schedResize').addEventListener('touchstart', onResizeDown, { passive: false });
    // Scroll infini : recentre quand on dérive hors de la copie du milieu (sauf pendant un drag).
    els.viewport.addEventListener('scroll', function () { if (!dragging) recenter(); });

    bindSteppers();
    bindDateNav();
    bindModalFocusTrap();
  }

  function bindModalFocusTrap() {
    var modal = document.querySelector('.ds-effort-modal');
    if (!modal) return;
    var selector = 'a[href],button:not([disabled]),input:not([disabled]),' +
      'textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { document.activeElement && document.activeElement.blur(); return; }
      if (e.key !== 'Tab') return;
      var items = Array.prototype.filter.call(modal.querySelectorAll(selector), function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // API pour le câblage dashboard : re-mesure à l'ouverture (scheduler invisible au chargement),
  // lecture de l'heure/durée (mod 24) + date au moment d'enregistrer.
  window.CarryITEffort = {
    // Re-mesure la hauteur de ligne (scheduler invisible au chargement) PUIS place le bloc.
    refresh: function (startHour, duration) {
      renderHours();
      setBlock(startHour == null ? 15 : startHour, duration == null ? 1 : duration, true);
    },
    reset: function () {
      var q = document.getElementById('effortQty'); if (q) q.value = '';
      var n = document.getElementById('effortNote'); if (n) n.value = '';
    },
    getState: function () { return { startHour: absToHour(state.top), duration: state.duration }; },
    getDate: function () { return new Date(currentDate); },
    setDate: function (d) { currentDate = new Date(d); renderDate(); },
    formatHour: formatHour,
    formatDuration: formatDuration,
  };
})();
