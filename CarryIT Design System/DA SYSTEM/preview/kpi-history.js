// KPI history — ✎ ouvre l'effort modal réutilisé (pré-rempli), 🗑 supprime.
(function () {
  var modal = document.getElementById('measureModal');
  var qty = document.getElementById('effortQty');
  var note = document.getElementById('effortNote');
  var dateLabel = document.getElementById('effortDateLabel');
  var activeRow = null;

  function openModal(row) {
    activeRow = row;
    qty.value = row.dataset.value || '';
    note.value = row.dataset.note || '';
    dateLabel.textContent = row.querySelector('.ds-kpi-history__date').textContent;
    modal.classList.remove('is-hidden');
    qty.focus();
  }

  function closeModal() {
    modal.classList.add('is-hidden');
    activeRow = null;
  }

  function saveModal() {
    if (!activeRow) return;
    activeRow.dataset.value = qty.value;
    activeRow.dataset.note = note.value;
    renderRow(activeRow);
    closeModal();
  }

  function deleteMeasure() {
    if (activeRow) activeRow.remove();
    closeModal();
  }

  // réécrit la vue lecture depuis les data-* (après enregistrement)
  function renderRow(row) {
    var val = row.querySelector('.ds-kpi-history__value');
    val.textContent = row.dataset.value + ' ';
    var unit = document.createElement('span');
    unit.className = 'ds-kpi-history__unit';
    unit.textContent = row.dataset.unit || '';
    val.appendChild(unit);

    var noteEl = row.querySelector('.ds-kpi-history__note');
    var txt = (row.dataset.note || '').trim();
    if (txt) {
      if (!noteEl) {
        noteEl = document.createElement('p');
        noteEl.className = 'ds-kpi-history__note type-body-sm';
        row.appendChild(noteEl);
      }
      noteEl.textContent = txt;
    } else if (noteEl) {
      noteEl.remove();
    }
  }

  document.getElementById('measureClose').addEventListener('click', closeModal);
  document.getElementById('measureSave').addEventListener('click', saveModal);
  document.getElementById('measureCancel').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  document.querySelectorAll('.ds-kpi-history__row').forEach(function (row) {
    row.querySelector('.ds-kpi-history__edit-btn').addEventListener('click', function () {
      openModal(row);
    });
    row.querySelector('.ds-kpi-history__delete').addEventListener('click', function () {
      row.remove();
    });
  });
})();
