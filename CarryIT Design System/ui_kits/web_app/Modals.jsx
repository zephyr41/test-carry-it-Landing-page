// CarryIT — Modal components: AddMeasure, EditSmart
// Exports: Modal, AddMeasureModal, EditSmartModal

const Modal = ({ open, onClose, title, children }) => {
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const s = {
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.65)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    modal: {
      background: '#16161A',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.55)',
      borderRadius: 12, padding: '24px 28px',
      minWidth: 380, maxWidth: 480, width: '90%',
      boxShadow: '0 16px 64px rgba(0,0,0,0.7)',
      position: 'relative',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 20,
    },
    title: { fontSize: 16, fontWeight: 700, color: '#FFFDF6', letterSpacing: '-0.01em' },
    closeBtn: {
      background: 'none', border: 'none', color: 'rgba(255,253,246,0.72)',
      cursor: 'pointer', fontSize: 18, lineHeight: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: 6,
      fontFamily: 'inherit',
    },
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>{title}</span>
          <button style={s.closeBtn} onClick={onClose}>
            <i data-lucide="x" style={{width:16,height:16}}></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FormGroup = ({ label, children, error, hint }) => {
  const s = {
    wrap: { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 },
    label: { fontSize: 12, fontWeight: 500, color: 'rgba(255,253,246,0.72)' },
    error: { fontSize: 11, color: '#ff6b6b', marginTop: 2 },
    hint: { fontSize: 11, color: 'rgba(255,253,246,0.72)', marginTop: 2 },
  };
  return (
    <div style={s.wrap}>
      <label style={s.label}>{label}</label>
      {children}
      {error && <span style={s.error}>{error}</span>}
      {hint && !error && <span style={s.hint}>{hint}</span>}
    </div>
  );
};

const Input = ({ value, onChange, placeholder, type = 'text', hasError }) => {
  const [focused, setFocused] = React.useState(false);
  const s = {
    input: {
      background: 'rgba(0, 0, 0, 0.32)', borderRadius: 8, padding: '10px 14px',
      fontFamily: 'inherit', fontSize: 14, color: '#FFFDF6',
      width: '100%', outline: 'none',
      border: hasError
        ? '1px solid #A3150D'
        : focused
        ? '1px solid #EE4408'
        : '1px solid rgba(255,253,246,0.12)',
      boxShadow: hasError
        ? '0 0 0 3px rgba(163,21,13,0.12)'
        : focused
        ? '0 0 0 3px rgba(238,68,8,0.15)'
        : 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    },
  };
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={s.input}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const AddMeasureModal = ({ open, onClose, kpiLabel, kpiUnite, kpiCible, kpiValeur, onSave }) => {
  const HOUR_HEIGHT = 56;
  const HOURS_START = 6;
  const HOURS_END = 23;
  const TOTAL_HOURS = HOURS_END - HOURS_START;

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [startHour, setStartHour] = React.useState(10);
  const [duration, setDuration] = React.useState(1);
  const [value, setValue] = React.useState('');
  const [note, setNote] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const timelineRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const dragState = React.useRef({ active: false });

  React.useEffect(() => {
    if (!open) return;
    const now = new Date();
    setSelectedDate(now);
    const h = now.getHours() + now.getMinutes() / 60;
    const snapped = Math.min(HOURS_END - 1, Math.max(HOURS_START, snap15(h)));
    setStartHour(snapped);
    setDuration(1);
    setValue(''); setNote(''); setErrors({});
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = (snapped - HOURS_START - 1) * HOUR_HEIGHT;
    }, 0);
  }, [open]);

  const snap15 = (h) => Math.round(h * 4) / 4;
  const yToHour = (y) => HOURS_START + y / HOUR_HEIGHT;
  const getRelY = (clientY) => {
    if (!timelineRef.current) return 0;
    return clientY - timelineRef.current.getBoundingClientRect().top;
  };

  // Click+drag on empty timeline: set start + stretch duration
  const handleTimelineMouseDown = (e) => {
    e.preventDefault();
    const startH = Math.max(HOURS_START, Math.min(HOURS_END - 0.25, snap15(yToHour(getRelY(e.clientY)))));
    setStartHour(startH);
    setDuration(0.25);
    dragState.current = { active: true, fixedStart: startH };
    const onMove = (ev) => {
      const endH = snap15(yToHour(getRelY(ev.clientY)));
      const newDur = Math.max(0.25, Math.min(HOURS_END - dragState.current.fixedStart, endH - dragState.current.fixedStart));
      setDuration(newDur);
    };
    const onUp = () => { dragState.current.active = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Drag block body: move
  const handleBlockMoveDown = (e) => {
    e.stopPropagation();
    const offsetH = yToHour(getRelY(e.clientY)) - startHour;
    dragState.current = { active: true };
    const onMove = (ev) => {
      const newStart = snap15(yToHour(getRelY(ev.clientY)) - offsetH);
      setStartHour(Math.max(HOURS_START, Math.min(HOURS_END - duration, newStart)));
    };
    const onUp = () => { dragState.current.active = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Drag bottom handle: resize duration
  const handleResizeDown = (e) => {
    e.stopPropagation();
    dragState.current = { active: true };
    const onMove = (ev) => {
      const endH = snap15(yToHour(getRelY(ev.clientY)));
      setDuration(Math.max(0.25, Math.min(HOURS_END - startHour, endH - startHour)));
    };
    const onUp = () => { dragState.current.active = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const fmt = (h) => {
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  };
  const fmtDuration = (d) => {
    const m = Math.round(d * 60);
    return m < 60 ? `${m}min` : `${Math.floor(m/60)}h${m%60 ? String(m%60).padStart(2,'0') : ''}`;
  };
  const fmtDate = (d) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtDateStr = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

  const changeDate = (delta) => setSelectedDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + delta); return d; });

  const handleSave = () => {
    const e = {};
    if (!value) e.value = 'Valeur requise';
    else if (isNaN(Number(value)) || Number(value) < 0) e.value = 'Valeur positive';
    else if (!Number.isInteger(Number(value))) e.value = 'Entier uniquement';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ date: fmtDateStr(selectedDate), value: Number(value), note: note.trim(), time: fmt(startHour), duration: fmtDuration(duration) });
    onClose();
  };

  const s = {
    actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 },
    cancelBtn: { padding: '0 16px', height: 38, borderRadius: 8, background: 'transparent', color: 'rgba(255,253,246,0.72)', border: '1px solid rgba(255,253,246,0.1)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' },
    saveBtn: { padding: '0 20px', height: 38, borderRadius: 8, background: '#EE4408', color: '#FFFDF6', border: 'none', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' },
    noteTextarea: { background: 'rgba(0,0,0,0.32)', borderRadius: 8, padding: '10px 14px', fontFamily: 'inherit', fontSize: 13.5, color: '#FFFDF6', width: '100%', outline: 'none', resize: 'none', minHeight: 60, lineHeight: 1.5, boxSizing: 'border-box', border: '1px solid rgba(255,253,246,0.12)' },
  };

  return (
    <Modal open={open} onClose={onClose} title={kpiLabel || 'Ajouter une mesure'}>
      {/* KPI context */}
      {(kpiUnite || kpiCible !== '') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, background: 'rgba(255,253,246,0.04)', borderRadius: 7, padding: '7px 12px' }}>
          {kpiUnite && <span style={{ fontSize: 11.5, color: 'rgba(255,253,246,0.55)', fontWeight: 500 }}>Unité : <strong style={{ color: '#FFFDF6', fontWeight: 600 }}>{kpiUnite}</strong></span>}
          {kpiCible !== '' && <span style={{ fontSize: 11.5, color: 'rgba(255,253,246,0.55)', fontWeight: 500 }}>· Actuel : <strong style={{ color: '#FFFDF6', fontWeight: 600 }}>{kpiValeur}</strong> / <strong style={{ color: '#FFFDF6', fontWeight: 600 }}>{kpiCible}</strong></span>}
        </div>
      )}
      {/* Date navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,253,246,0.5)', cursor: 'pointer', fontSize: 20, padding: '0 6px', lineHeight: 1, fontFamily: 'inherit' }} onClick={() => changeDate(-1)}>‹</button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13.5, fontWeight: 600, color: '#FFFDF6', textTransform: 'capitalize' }}>{fmtDate(selectedDate)}</div>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,253,246,0.5)', cursor: 'pointer', fontSize: 20, padding: '0 6px', lineHeight: 1, fontFamily: 'inherit' }} onClick={() => changeDate(1)}>›</button>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} style={{ height: 220, overflowY: 'auto', borderRadius: 8, border: '1px solid rgba(255,253,246,0.08)', background: 'rgba(0,0,0,0.18)', marginBottom: 14, userSelect: 'none' }}>
        <div ref={timelineRef} style={{ position: 'relative', height: TOTAL_HOURS * HOUR_HEIGHT }} onMouseDown={handleTimelineMouseDown}>
          {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => (
            <div key={i} style={{ position: 'absolute', top: i * HOUR_HEIGHT, left: 0, right: 0, display: 'flex', alignItems: 'flex-start', pointerEvents: 'none' }}>
              <span style={{ fontSize: 9.5, color: 'rgba(255,253,246,0.25)', fontFamily: '"JetBrains Mono", monospace', width: 42, textAlign: 'right', paddingRight: 8, lineHeight: 1, transform: 'translateY(-6px)', flexShrink: 0 }}>
                {String(HOURS_START + i).padStart(2,'0')}:00
              </span>
              <div style={{ flex: 1, borderTop: '1px solid rgba(255,253,246,0.06)' }}></div>
            </div>
          ))}
          {/* Effort block */}
          <div
            onMouseDown={handleBlockMoveDown}
            style={{ position: 'absolute', left: 48, right: 8, top: (startHour - HOURS_START) * HOUR_HEIGHT, height: duration * HOUR_HEIGHT, background: 'rgba(238,68,8,0.14)', borderLeft: '3px solid #EE4408', borderRadius: '0 7px 7px 0', cursor: 'grab', zIndex: 2, overflow: 'hidden' }}
          >
            <div style={{ padding: '6px 10px' }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#EE4408', display: 'block' }}>Effort</span>
              <span style={{ fontSize: 11, color: 'rgba(255,253,246,0.65)' }}>{fmt(startHour)} → {fmt(startHour + duration)} · {fmtDuration(duration)}</span>
            </div>
            {/* Resize handle */}
            <div
              onMouseDown={handleResizeDown}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 12, cursor: 'ns-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ width: 24, height: 3, borderRadius: 2, background: 'rgba(238,68,8,0.5)' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Valeur + Note */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 90px' }}>
          <FormGroup label={kpiUnite ? `Valeur (${kpiUnite})` : 'Valeur'} error={errors.value}>
            <Input value={value} onChange={setValue} placeholder="—" type="number" hasError={!!errors.value}/>
          </FormGroup>
        </div>
        <div style={{ flex: 1 }}>
          <FormGroup label="Note (optionnelle)">
            <textarea style={s.noteTextarea} value={note} onChange={e => setNote(e.target.value)} placeholder="Contexte, observations..." rows={2}/>
          </FormGroup>
        </div>
      </div>

      <div style={s.actions}>
        <button style={s.cancelBtn} onClick={onClose}>Annuler</button>
        <button style={s.saveBtn} onClick={handleSave}>Enregistrer</button>
      </div>
    </Modal>
  );
};

const EditSmartModal = ({ open, onClose, smart, onSave }) => {
  const [form, setForm] = React.useState({ ...smart });

  React.useEffect(() => { setForm({ ...smart }); }, [smart, open]);

  const fields = [
    { key: 'S', label: "S — L'ambition" },
    { key: 'M', label: 'M — La mesure' },
    { key: 'A', label: 'A — Atteignable' },
    { key: 'R', label: 'R — Réaliste' },
    { key: 'T', label: "T — L'échéance" },
  ];

  const s = {
    actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
    cancelBtn: {
      padding: '0 16px', height: 38, borderRadius: 8,
      background: 'transparent', color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
    },
    saveBtn: {
      padding: '0 20px', height: 38, borderRadius: 8,
      background: '#EE4408', color: '#FFFDF6', border: 'none',
      fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
    },
  };

  return (
    <Modal open={open} onClose={onClose} title="Modifier l'objectif SMART">
      {fields.map(f => (
        <FormGroup key={f.key} label={f.label}>
          <Input value={form[f.key] || ''} onChange={v => setForm(p => ({...p, [f.key]: v}))} placeholder={f.label}/>
        </FormGroup>
      ))}
      <div style={s.actions}>
        <button style={s.cancelBtn} onClick={onClose}>Annuler</button>
        <button style={s.saveBtn} onClick={() => { onSave(form); onClose(); }}>Enregistrer</button>
      </div>
    </Modal>
  );
};

// ── EditKPIModal — full edit for a KPI (title, unit, target, freq, mode, type)
const EditKPIModal = ({ open, onClose, kpi, onSave, onDelete }) => {
  const [form, setForm] = React.useState(kpi || {});
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open && kpi) {
      setForm({ ...kpi });
      setErrors({});
    }
  }, [open, kpi]);

  if (!kpi) return null;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    const e = {};
    if (!form.label || !form.label.trim()) e.label = 'Le titre est requis';
    if (form.value !== '' && form.value !== null && form.value !== undefined) {
      const v = Number(form.value);
      if (isNaN(v) || v < 0) e.value = 'La valeur doit être un nombre positif';
      else if (!Number.isInteger(v)) e.value = 'Entier uniquement';
    }
    if (form.target !== null && form.target !== '' && form.target !== undefined) {
      const t = Number(form.target);
      if (isNaN(t) || t < 0) e.target = 'La cible doit être un nombre positif';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({
      ...form,
      label: form.label.trim(),
      value: form.value === '' || form.value === null || form.value === undefined ? 0 : Number(form.value),
      target: form.target === '' || form.target === null ? null : Number(form.target),
    });
    onClose();
  };

  const s = {
    actions: {
      display: 'flex', gap: 10, alignItems: 'center', marginTop: 24,
      paddingTop: 16, borderTop: '1px solid rgba(255,253,246,0.07)',
    },
    cancelBtn: {
      padding: '0 16px', height: 38, borderRadius: 8,
      background: 'transparent', color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
    },
    saveBtn: {
      padding: '0 20px', height: 38, borderRadius: 8,
      background: '#EE4408', color: '#FFFDF6', border: 'none',
      fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
    },
    delBtn: {
      padding: '0 14px', height: 38, borderRadius: 8,
      background: 'transparent', color: '#ff6b56',
      border: '1px solid rgba(255,107,86,0.32)',
      fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      marginRight: 'auto',
    },
    row: { display: 'flex', gap: 12 },
    segWrap: { display: 'flex', gap: 6, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' },
    segBtn: (active) => ({
      flex: 1, padding: '8px 10px', borderRadius: 6,
      background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
      color: active ? '#FFFDF6' : 'rgba(255,253,246,0.72)',
      border: 'none', cursor: 'pointer',
      fontFamily: 'inherit', fontSize: 12.5, fontWeight: active ? 600 : 500,
      transition: 'background 120ms cubic-bezier(0.16,1,0.3,1), color 120ms cubic-bezier(0.16,1,0.3,1)',
    }),
    typeCard: {
      fontSize: 11, color: 'rgba(255,253,246,0.42)', marginTop: 6, lineHeight: 1.4,
    },
  };

  return (
    <Modal open={open} onClose={onClose} title="Modifier le KPI">
      <FormGroup label="Titre du KPI" error={errors.label}>
        <Input value={form.label || ''} onChange={v => set('label', v)} placeholder="Clients actifs payants" hasError={!!errors.label}/>
      </FormGroup>

      <div style={s.row}>
        <div style={{flex:1}}>
          <FormGroup label="Valeur actuelle" error={errors.value} hint="La dernière mesure connue">
            <Input
              type="number"
              value={form.value ?? ''}
              onChange={v => set('value', v)}
              placeholder="0"
              hasError={!!errors.value}
            />
          </FormGroup>
        </div>
        <div style={{flex:1}}>
          <FormGroup label="Unité">
            <Input value={form.unit || ''} onChange={v => set('unit', v)} placeholder="clients"/>
          </FormGroup>
        </div>
      </div>

      <FormGroup label="Valeur cible" error={errors.target} hint="Optionnelle — laisser vide pour ne pas en définir">
        <Input
          type="number"
          value={form.target ?? ''}
          onChange={v => set('target', v)}
          placeholder="400"
          hasError={!!errors.target}
        />
      </FormGroup>

      <FormGroup label="Type d'indicateur">
        <div style={s.segWrap}>
          <button style={s.segBtn(form.type === 'leading')} onClick={() => set('type', 'leading')}>
            Indicateur d'avancée
          </button>
          <button style={s.segBtn(form.type === 'lagging')} onClick={() => set('type', 'lagging')}>
            Indicateur de résultat
          </button>
        </div>
        <div style={s.typeCard}>
          {form.type === 'leading'
            ? "Ce que tu fais qui crée la traction (action mesurée régulièrement)."
            : "Le résultat que tu vises (mesure de l'objectif)."}
        </div>
      </FormGroup>

      <FormGroup label="Fréquence de mesure">
        <div style={s.segWrap}>
          <button style={s.segBtn(form.frequency === 'Hebdomadaire')} onClick={() => set('frequency', 'Hebdomadaire')}>
            Hebdomadaire
          </button>
          <button style={s.segBtn(form.frequency === 'Mensuel')} onClick={() => set('frequency', 'Mensuel')}>
            Mensuel
          </button>
        </div>
      </FormGroup>

      <div style={s.actions}>
        {onDelete && (
          <button style={s.delBtn} onClick={() => { onDelete(); onClose(); }}>
            <i data-lucide="trash-2" style={{width:13,height:13}}></i>
            Supprimer
          </button>
        )}
        <button style={s.cancelBtn} onClick={onClose}>Annuler</button>
        <button style={s.saveBtn} onClick={handleSave}>Enregistrer</button>
      </div>
    </Modal>
  );
};

// ── EditJalonModal — edit a jalon (title, validation, date)
const EditJalonModal = ({ open, onClose, jalon, onSave, onDelete }) => {
  const [form, setForm] = React.useState(jalon || {});
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open && jalon) {
      setForm({ ...jalon });
      setErrors({});
    }
  }, [open, jalon]);

  if (!jalon) return null;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    const e = {};
    if (!form.title || !form.title.trim()) e.title = 'Le titre est requis';
    if (!form.validation || !form.validation.trim()) e.validation = 'Le critère de validation est requis';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({
      ...form,
      title: form.title.trim(),
      validation: form.validation.trim(),
    });
    onClose();
  };

  const s = {
    actions: {
      display: 'flex', gap: 10, alignItems: 'center', marginTop: 24,
      paddingTop: 16, borderTop: '1px solid rgba(255,253,246,0.07)',
    },
    cancelBtn: {
      padding: '0 16px', height: 38, borderRadius: 8,
      background: 'transparent', color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
    },
    saveBtn: {
      padding: '0 20px', height: 38, borderRadius: 8,
      background: '#EE4408', color: '#FFFDF6', border: 'none',
      fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
    },
    delBtn: {
      padding: '0 14px', height: 38, borderRadius: 8,
      background: 'transparent', color: '#ff6b56',
      border: '1px solid rgba(255,107,86,0.32)',
      fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      marginRight: 'auto',
    },
    row: { display: 'flex', gap: 12 },
    textarea: (focused, hasError) => ({
      background: 'rgba(0, 0, 0, 0.32)', borderRadius: 8, padding: '10px 14px',
      fontFamily: 'inherit', fontSize: 14, color: '#FFFDF6',
      width: '100%', outline: 'none', resize: 'vertical',
      minHeight: 80, lineHeight: 1.5,
      border: hasError
        ? '1px solid #A3150D'
        : focused
        ? '1px solid #EE4408'
        : '1px solid rgba(255,253,246,0.12)',
      transition: 'border-color 150ms ease',
    }),
  };

  const [valFocus, setValFocus] = React.useState(false);

  return (
    <Modal open={open} onClose={onClose} title="Modifier le jalon">
      <FormGroup label="Titre du jalon" error={errors.title}>
        <Input value={form.title || ''} onChange={v => set('title', v)} placeholder="MVP testable" hasError={!!errors.title}/>
      </FormGroup>

      <div style={s.row}>
        <div style={{flex:1}}>
          <FormGroup label="Échéance (date)">
            <Input value={form.date || ''} onChange={v => set('date', v)} placeholder="Juil 2026"/>
          </FormGroup>
        </div>
        <div style={{flex:1}}>
          <FormGroup label="Position">
            <Input value={form.month || ''} onChange={v => set('month', v)} placeholder="MOIS 4"/>
          </FormGroup>
        </div>
      </div>

      <FormGroup label="Critère de validation" error={errors.validation} hint="Condition observable et binaire — fait ou pas fait.">
        <textarea
          style={s.textarea(valFocus, !!errors.validation)}
          value={form.validation || ''}
          onChange={e => set('validation', e.target.value)}
          onFocus={() => setValFocus(true)}
          onBlur={() => setValFocus(false)}
          placeholder="MVP testable avec onboarding terminé pour 10 utilisateurs."
        />
      </FormGroup>

      <div style={s.actions}>
        {onDelete && (
          <button style={s.delBtn} onClick={() => { if (confirm('Supprimer ce jalon ?')) { onDelete(); onClose(); } }}>
            <i data-lucide="trash-2" style={{width:13,height:13}}></i>
            Supprimer
          </button>
        )}
        <button style={s.cancelBtn} onClick={onClose}>Annuler</button>
        <button style={s.saveBtn} onClick={handleSave}>Enregistrer</button>
      </div>
    </Modal>
  );
};

// Filename-matching component for the design-system compiler — alias of the base Modal.
function Modals(props) { return React.createElement(Modal, props); }
const SimpleMeasureModal = ({ open, onClose, kpiLabel, onSave }) => {
  const todayISO = new Date().toISOString().split('T')[0];
  const [date, setDate] = React.useState(todayISO);
  const [value, setValue] = React.useState('');
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open) { setDate(new Date().toISOString().split('T')[0]); setValue(''); setErrors({}); }
  }, [open]);

  const handleSave = () => {
    const e = {};
    if (!date) e.date = 'Requise';
    if (!value) e.value = 'Requise';
    else if (isNaN(Number(value)) || Number(value) < 0) e.value = 'Positive';
    else if (!Number.isInteger(Number(value))) e.value = 'Entier';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ date, value: Number(value) });
    onClose();
  };

  const dateInputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(0,0,0,0.32)', borderRadius: 8, padding: '0 14px',
    height: 44, fontFamily: 'inherit', fontSize: 14, color: '#FFFDF6',
    border: errors.date ? '1px solid #A3150D' : '1px solid rgba(255,253,246,0.12)',
    outline: 'none', colorScheme: 'dark',
  };
  const s = {
    actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 },
    cancelBtn: { padding: '0 16px', height: 38, borderRadius: 8, background: 'transparent', color: 'rgba(255,253,246,0.72)', border: '1px solid rgba(255,253,246,0.1)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' },
    saveBtn: { padding: '0 20px', height: 38, borderRadius: 8, background: '#EE4408', color: '#FFFDF6', border: 'none', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' },
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter une mesure">
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <FormGroup label="Date" error={errors.date}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={dateInputStyle}/>
          </FormGroup>
        </div>
        <div style={{ flex: 1 }}>
          <FormGroup label="Valeur" error={errors.value}>
            <Input value={value} onChange={setValue} placeholder="—" type="number" hasError={!!errors.value}/>
          </FormGroup>
        </div>
      </div>
      <div style={s.actions}>
        <button style={s.cancelBtn} onClick={onClose}>Annuler</button>
        <button style={s.saveBtn} onClick={handleSave}>Enregistrer</button>
      </div>
    </Modal>
  );
};

export { Modals, Modal, AddMeasureModal, SimpleMeasureModal, EditSmartModal, EditKPIModal, EditJalonModal };
Object.assign(window, { Modals, Modal, AddMeasureModal, SimpleMeasureModal, EditSmartModal, EditKPIModal, EditJalonModal });
