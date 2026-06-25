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

const AddMeasureModal = ({ open, onClose, kpiLabel, onSave }) => {
  const [date, setDate] = React.useState('');
  const [value, setValue] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [toast, setToast] = React.useState(null);

  const validate = () => {
    const e = {};
    if (!date) e.date = 'Valeur requise';
    if (!value) e.value = 'Valeur requise';
    else if (isNaN(Number(value)) || Number(value) < 0) e.value = 'La valeur doit être positive';
    else if (!Number.isInteger(Number(value))) e.value = 'Entier uniquement';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({ date, value: Number(value) });
    setDate(''); setValue(''); setErrors({});
    onClose();
  };

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
    kpiCtx: {
      fontSize: 12, color: 'rgba(255,253,246,0.72)', marginBottom: 16,
      background: 'rgba(255,253,246,0.04)', borderRadius: 6,
      padding: '8px 12px',
    },
    row: { display: 'flex', gap: 12 },
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter une mesure">
      <div style={s.kpiCtx}>KPI : {kpiLabel}</div>
      <div style={s.row}>
        <div style={{flex:1}}>
          <FormGroup label="Date" error={errors.date} hint="Format JJ/MM/AAAA">
            <Input value={date} onChange={setDate} placeholder="14/05/2026" hasError={!!errors.date}/>
          </FormGroup>
        </div>
        <div style={{flex:1}}>
          <FormGroup label="Valeur" error={errors.value}>
            <Input value={value} onChange={setValue} placeholder="247" type="number" hasError={!!errors.value}/>
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
export { Modals, Modal, AddMeasureModal, EditSmartModal, EditKPIModal, EditJalonModal };
Object.assign(window, { Modals, Modal, AddMeasureModal, EditSmartModal, EditKPIModal, EditJalonModal });
