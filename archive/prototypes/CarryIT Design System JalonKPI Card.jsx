// CarryIT — KPI Card with full P0 user actions
// Surface: type chip, title (click to edit), value, mode, sparkline (click for history),
// progress / "Définir une cible" affordance, frequency · last update · "+ Mesure" + "..." menu.
// Sub-components: KPIActionMenu, KPIHistorySheet, KPIEmptyState, AddKPIModal.
// Exports: JalonKPICard, KPIEmptyState

const KPIActionMenu = ({ open, onClose, onAction, hasTarget }) => {
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const items = [
    { id: 'edit-title',    icon: 'pencil',     label: 'Modifier le titre' },
    { id: 'edit-target',   icon: 'crosshair',  label: hasTarget ? 'Modifier la cible' : 'Définir une cible' },
    { id: 'edit-frequency',icon: 'repeat',     label: 'Modifier la fréquence' },
    { id: 'edit-mode',     icon: 'sliders-horizontal', label: 'Mode de mesure' },
    { id: 'history',       icon: 'list',       label: "Voir l'historique" },
    { id: 'sep' },
    { id: 'delete',        icon: 'trash-2',    label: 'Supprimer ce KPI', danger: true },
  ];

  const menuStyles = {
    pop: {
      position: 'absolute',
      top: 38, right: 0, zIndex: 30,
      minWidth: 220,
      background: '#1A1A1C',
      border: '1px solid rgba(255,253,246,0.12)',
      borderRadius: 10,
      padding: 6,
      boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
      display: 'flex', flexDirection: 'column', gap: 1,
    },
    item: (danger) => ({
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 6,
      background: 'transparent', border: 'none',
      color: danger ? '#ff6b56' : '#FFFDF6',
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer', textAlign: 'left',
      transition: 'background 120ms ease',
    }),
    icon: { display: 'inline-flex', width: 14, height: 14, color: 'inherit', flexShrink: 0 },
    sep: { height: 1, background: 'rgba(255,253,246,0.08)', margin: '4px 0' },
  };

  return (
    <div ref={menuRef} style={menuStyles.pop}>
      {items.map(it => it.id === 'sep'
        ? <div key="sep" style={menuStyles.sep}></div>
        : (
          <button
            key={it.id}
            style={menuStyles.item(it.danger)}
            onMouseDown={(e) => {
              e.stopPropagation();
              onAction(it.id);
              onClose();
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,253,246,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={menuStyles.icon}>
              <i data-lucide={it.icon} style={{width:14,height:14}}></i>
            </span>
            {it.label}
          </button>
        )
      )}
    </div>
  );
};

const KPIHistorySheet = ({ open, onClose, kpi, accent }) => {
  if (!open) return null;
  const history = kpi.history || [];
  // Build a richer mock of "measures": each value gets an inferred date going back from today.
  const today = new Date();
  const measures = history.slice().reverse().map((v, i) => {
    const d = new Date(today);
    const step = kpi.frequency === 'Mensuel' ? 30 : 7;
    d.setDate(today.getDate() - i * step);
    return { value: v, date: d };
  });

  const sheetStyles = {
    backdrop: {
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end',
    },
    sheet: {
      width: 'min(440px, 100%)', height: '100%',
      background: '#0F0F11',
      borderLeft: '1px solid rgba(255,253,246,0.1)',
      display: 'flex', flexDirection: 'column',
      animation: 'slideIn 240ms cubic-bezier(0.16,1,0.3,1)',
    },
    head: {
      padding: '24px 28px 18px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      borderBottom: '1px solid rgba(255,253,246,0.08)',
    },
    headLeft: { flex: 1, minWidth: 0 },
    overline: {
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
      color: accent, textTransform: 'uppercase',
      marginBottom: 6,
    },
    title: {
      fontSize: 18, fontWeight: 700, color: '#FFFDF6',
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    close: {
      width: 30, height: 30, borderRadius: 6,
      border: 'none', background: 'transparent',
      color: '#929292', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    body: { flex: 1, overflowY: 'auto', padding: '12px 0' },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      gap: 16, alignItems: 'center',
      padding: '14px 28px',
      borderBottom: '1px solid rgba(255,253,246,0.05)',
    },
    rowDate: { fontSize: 13, color: '#FFFDF6' },
    rowDelta: {
      fontSize: 11.5, color: '#929292',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    },
    rowVal: {
      fontSize: 18, fontWeight: 700, color: '#FFFDF6',
      fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
    },
    rowUnit: { fontSize: 11, color: '#929292', marginLeft: 4, fontWeight: 400 },
    rowDelBtn: {
      width: 26, height: 26, borderRadius: 6,
      border: 'none', background: 'transparent',
      color: 'rgba(255,253,246,0.3)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    empty: {
      padding: '40px 28px', fontSize: 13.5, color: '#929292',
      textAlign: 'center',
    },
  };

  const dateFmt = (d) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div style={sheetStyles.backdrop} onClick={onClose}>
      <style>{`@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={sheetStyles.sheet} onClick={e => e.stopPropagation()}>
        <div style={sheetStyles.head}>
          <div style={sheetStyles.headLeft}>
            <div style={sheetStyles.overline}>Historique des mesures</div>
            <div style={sheetStyles.title}>{kpi.label}</div>
          </div>
          <button style={sheetStyles.close} onClick={onClose}>
            <i data-lucide="x" style={{width:16,height:16}}></i>
          </button>
        </div>
        <div style={sheetStyles.body}>
          {measures.length === 0 ? (
            <div style={sheetStyles.empty}>Aucune mesure enregistrée.</div>
          ) : measures.map((m, i) => {
            const prev = measures[i + 1];
            const delta = prev ? m.value - prev.value : null;
            const deltaLabel = delta === null ? '—' : (delta > 0 ? `+${delta}` : `${delta}`);
            return (
              <div key={i} style={sheetStyles.row}>
                <div>
                  <div style={sheetStyles.rowDate}>{dateFmt(m.date)}</div>
                  <div style={sheetStyles.rowDelta}>{deltaLabel} vs précédent</div>
                </div>
                <div>
                  <span style={sheetStyles.rowVal}>{m.value}</span>
                  <span style={sheetStyles.rowUnit}>{kpi.unit}</span>
                </div>
                <button style={sheetStyles.rowDelBtn}>
                  <i data-lucide="trash-2" style={{width:13,height:13}}></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const JalonKPICard = ({ kpi, onAddMeasure, onUpdate }) => {
  const isLeading = kpi.type === 'leading';
  const accent = isLeading ? '#5BAEC9' : '#EE4408';
  const accentSoft = isLeading ? 'rgba(91,174,201,0.12)' : 'rgba(238,68,8,0.12)';
  const accentBorder = isLeading ? 'rgba(91,174,201,0.32)' : 'rgba(238,68,8,0.32)';

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [titleDraft, setTitleDraft] = React.useState(kpi.label);
  const [editingTarget, setEditingTarget] = React.useState(false);
  const [targetDraft, setTargetDraft] = React.useState(kpi.target?.toString() || '');
  const [editingFreq, setEditingFreq] = React.useState(false);

  const titleInputRef = React.useRef(null);
  const targetInputRef = React.useRef(null);

  React.useEffect(() => { if (editingTitle && titleInputRef.current) titleInputRef.current.focus(); }, [editingTitle]);
  React.useEffect(() => { if (editingTarget && targetInputRef.current) targetInputRef.current.focus(); }, [editingTarget]);

  const commitTitle = () => {
    const t = titleDraft.trim();
    if (t && t !== kpi.label) onUpdate && onUpdate({ ...kpi, label: t });
    setEditingTitle(false);
  };
  const commitTarget = () => {
    const t = parseFloat(targetDraft);
    if (!isNaN(t) && t > 0) onUpdate && onUpdate({ ...kpi, target: t });
    else if (targetDraft.trim() === '') onUpdate && onUpdate({ ...kpi, target: null });
    setEditingTarget(false);
  };
  const cycleFrequency = () => {
    const next = kpi.frequency === 'Hebdomadaire' ? 'Mensuel' : 'Hebdomadaire';
    onUpdate && onUpdate({ ...kpi, frequency: next });
  };

  const handleAction = (id) => {
    switch (id) {
      case 'edit-title':    setEditingTitle(true); break;
      case 'edit-target':   setEditingTarget(true); break;
      case 'edit-frequency':cycleFrequency(); break;
      case 'edit-mode':     onUpdate && onUpdate({ ...kpi, mode: kpi.mode === 'cumulative' ? 'current' : 'cumulative' }); break;
      case 'history':       setHistoryOpen(true); break;
      case 'delete':        onUpdate && onUpdate({ ...kpi, _deleted: true }); break;
    }
  };

  const hasTarget = typeof kpi.target === 'number' && kpi.target > 0;
  const pct = hasTarget ? Math.min(100, Math.round((kpi.value / kpi.target) * 100)) : null;

  // Sparkline
  const history = (kpi.history && kpi.history.length > 1) ? kpi.history : null;
  const sW = 96, sH = 32;
  let sparkPath = '', sparkArea = '', lastDot = null;
  if (history) {
    const max = Math.max(...history, 1);
    const min = Math.min(...history, 0);
    const range = (max - min) || 1;
    const xs = history.map((_, i) => (i / (history.length - 1)) * sW);
    const ys = history.map(v => sH - ((v - min) / range) * (sH - 6) - 3);
    sparkPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
    sparkArea = `${sparkPath} L${sW},${sH} L0,${sH} Z`;
    lastDot = { x: xs[xs.length - 1], y: ys[ys.length - 1] };
  }

  const modeLabel = kpi.mode === 'cumulative' ? 'Cumulatif' : 'Valeur actuelle';
  const modeGlyph = kpi.mode === 'cumulative' ? 'Σ' : '→';

  const c = {
    card: {
      background: '#0F0F11',
      border: '1px solid rgba(255,253,246,0.08)',
      borderRadius: 12,
      padding: '20px 22px',
      display: 'flex', flexDirection: 'column',
      gap: 18,
      minWidth: 0,
      position: 'relative',
      overflow: 'visible',
    },
    accentBar: {
      position: 'absolute',
      top: 0, left: 0, height: 2, width: 32,
      background: accent,
      borderTopLeftRadius: 12,
    },
    head: {
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 12, position: 'relative',
    },
    typeChip: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 9999,
      background: accentSoft,
      border: `1px solid ${accentBorder}`,
      color: accent,
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    },
    typeGlyph: { display: 'inline-flex', width: 11, height: 11, alignItems: 'center', justifyContent: 'center' },
    menuBtn: {
      width: 26, height: 26,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: 'none', background: menuOpen ? 'rgba(255,253,246,0.06)' : 'transparent',
      color: 'rgba(255,253,246,0.42)',
      borderRadius: 6, cursor: 'pointer',
      transition: 'background 120ms ease',
    },
    title: {
      fontSize: 14, fontWeight: 500,
      color: 'rgba(255,253,246,0.74)',
      letterSpacing: '-0.005em', lineHeight: 1.3,
      marginTop: -8,
      cursor: 'text',
      padding: '4px 6px', borderRadius: 5,
      margin: '-8px -6px 0',
      transition: 'background 120ms ease',
    },
    titleInput: {
      fontSize: 14, fontWeight: 500,
      color: '#FFFDF6',
      letterSpacing: '-0.005em', lineHeight: 1.3,
      width: '100%',
      background: 'rgba(255,253,246,0.04)',
      border: `1px solid ${accentBorder}`,
      borderRadius: 5,
      padding: '4px 6px',
      fontFamily: 'inherit',
      outline: 'none',
      marginTop: -8, marginLeft: -6, marginRight: -6,
    },
    body: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      gap: 18, alignItems: 'flex-end',
    },
    valueWrap: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
    value: {
      fontSize: 48, fontWeight: 700, color: '#FFFDF6',
      letterSpacing: '-0.04em', lineHeight: 0.95,
      fontVariantNumeric: 'tabular-nums',
      display: 'flex', alignItems: 'baseline', gap: 8,
    },
    unit: { fontSize: 14, fontWeight: 500, color: '#929292', letterSpacing: '-0.005em' },
    modeRow: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, color: 'rgba(255,253,246,0.42)',
      letterSpacing: '0.02em',
      cursor: 'pointer',
      padding: '2px 6px', borderRadius: 4,
      margin: '-2px -6px',
      transition: 'background 120ms ease',
    },
    modeGlyphStyle: {
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 11.5, color: 'rgba(255,253,246,0.5)',
      fontWeight: 600,
    },
    sparkWrap: {
      cursor: 'pointer',
      padding: 4, margin: -4, borderRadius: 6,
      transition: 'background 120ms ease',
    },
    progress: { display: 'flex', alignItems: 'center', gap: 10 },
    progressBar: {
      flex: 1, height: 2.5,
      background: 'rgba(255,253,246,0.08)',
      borderRadius: 2, overflow: 'hidden',
    },
    progressFill: {
      width: `${pct}%`, height: '100%',
      background: accent,
      borderRadius: 2,
      transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
    },
    progressLabel: {
      fontSize: 11.5, fontVariantNumeric: 'tabular-nums',
      color: 'rgba(255,253,246,0.74)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      whiteSpace: 'nowrap',
    },
    progressTarget: {
      fontSize: 11, color: '#666',
      marginLeft: 4,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      cursor: 'pointer',
    },
    setTargetRow: {
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 6,
      border: `1px dashed rgba(255,253,246,0.14)`,
      color: 'rgba(255,253,246,0.5)',
      fontSize: 12, fontFamily: 'inherit',
      background: 'transparent',
      cursor: 'pointer', width: '100%',
      transition: 'border-color 120ms ease, color 120ms ease',
    },
    targetInputRow: {
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 12px', borderRadius: 6,
      background: 'rgba(255,253,246,0.04)',
      border: `1px solid ${accentBorder}`,
    },
    targetInput: {
      flex: 1, background: 'transparent', border: 'none', outline: 'none',
      color: '#FFFDF6', fontSize: 13, fontFamily: 'inherit',
    },
    footer: {
      display: 'flex', alignItems: 'center', gap: 12,
      paddingTop: 14,
      borderTop: '1px solid rgba(255,253,246,0.06)',
    },
    meta: {
      fontSize: 11.5, color: 'rgba(255,253,246,0.45)',
      display: 'flex', alignItems: 'center', gap: 8,
      flex: 1, minWidth: 0,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    metaBtn: {
      background: 'transparent', border: 'none', color: 'inherit',
      fontFamily: 'inherit', fontSize: 'inherit',
      cursor: 'pointer', padding: 0,
    },
    metaDot: {
      width: 2.5, height: 2.5, borderRadius: '50%',
      background: 'rgba(255,253,246,0.25)', flexShrink: 0,
    },
    addBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '7px 11px', borderRadius: 7,
      background: accent,
      border: 'none',
      color: '#FFFDF6',
      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
      cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'opacity 150ms ease',
    },
  };

  return (
    <div style={c.card}>
      <div style={c.accentBar}></div>

      <div style={c.head}>
        <span style={c.typeChip}>
          <span style={c.typeGlyph}>
            {isLeading ? (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 9L5 6L7 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 4H10V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="6" cy="6" r="1.8" fill="currentColor"/>
              </svg>
            )}
          </span>
          {isLeading ? "Indicateur d'avancée" : "Indicateur de résultat"}
        </span>
        <button
          style={c.menuBtn}
          aria-label="Actions sur le KPI"
          onClick={() => setMenuOpen(o => !o)}
        >
          <i data-lucide="more-horizontal" style={{width:15,height:15}}></i>
        </button>
        <KPIActionMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onAction={handleAction}
          hasTarget={hasTarget}
        />
      </div>

      {editingTitle ? (
        <input
          ref={titleInputRef}
          type="text"
          value={titleDraft}
          onChange={e => setTitleDraft(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={e => {
            if (e.key === 'Enter') commitTitle();
            if (e.key === 'Escape') { setTitleDraft(kpi.label); setEditingTitle(false); }
          }}
          style={c.titleInput}
        />
      ) : (
        <div
          style={c.title}
          onClick={() => { setTitleDraft(kpi.label); setEditingTitle(true); }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,253,246,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          title="Cliquer pour modifier"
        >
          {kpi.label}
        </div>
      )}

      <div style={c.body}>
        <div style={c.valueWrap}>
          <div style={c.value}>
            <span>{kpi.value}</span>
            <span style={c.unit}>{kpi.unit}</span>
          </div>
          <div
            style={c.modeRow}
            onClick={() => onUpdate && onUpdate({ ...kpi, mode: kpi.mode === 'cumulative' ? 'current' : 'cumulative' })}
            title="Cliquer pour changer le mode"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,253,246,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={c.modeGlyphStyle}>{modeGlyph}</span>
            <span>{modeLabel}</span>
          </div>
        </div>

        {history && (
          <div
            style={c.sparkWrap}
            onClick={() => setHistoryOpen(true)}
            title="Voir l'historique"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,253,246,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width={sW} height={sH} viewBox={`0 0 ${sW} ${sH}`} style={{display:'block'}}>
              <defs>
                <linearGradient id={`spark-grad-${kpi.label.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.22"/>
                  <stop offset="100%" stopColor={accent} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={sparkArea} fill={`url(#spark-grad-${kpi.label.replace(/\s/g,'')})`} />
              <path d={sparkPath} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              {lastDot && (
                <>
                  <circle cx={lastDot.x} cy={lastDot.y} r="3" fill="#0F0F11"/>
                  <circle cx={lastDot.x} cy={lastDot.y} r="2" fill={accent}/>
                </>
              )}
            </svg>
          </div>
        )}
      </div>

      {editingTarget ? (
        <div style={c.targetInputRow}>
          <i data-lucide="crosshair" style={{width:13,height:13,color: accent}}></i>
          <input
            ref={targetInputRef}
            type="number"
            value={targetDraft}
            placeholder="Valeur cible (ex. 10)"
            onChange={e => setTargetDraft(e.target.value)}
            onBlur={commitTarget}
            onKeyDown={e => {
              if (e.key === 'Enter') commitTarget();
              if (e.key === 'Escape') { setTargetDraft(kpi.target?.toString() || ''); setEditingTarget(false); }
            }}
            style={c.targetInput}
          />
          <span style={{fontSize:11,color:'#929292'}}>{kpi.unit}</span>
        </div>
      ) : hasTarget ? (
        <div style={c.progress}>
          <div style={c.progressBar}>
            <div style={c.progressFill}></div>
          </div>
          <span style={c.progressLabel}>{pct}%</span>
          <span
            style={c.progressTarget}
            onClick={() => { setTargetDraft(kpi.target.toString()); setEditingTarget(true); }}
            title="Modifier la cible"
          >/ {kpi.target}</span>
        </div>
      ) : (
        <button
          style={c.setTargetRow}
          onClick={() => { setTargetDraft(''); setEditingTarget(true); }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accentBorder; e.currentTarget.style.color = accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,253,246,0.14)'; e.currentTarget.style.color = 'rgba(255,253,246,0.5)'; }}
        >
          <i data-lucide="crosshair" style={{width:12,height:12}}></i>
          Définir une cible
        </button>
      )}

      <div style={c.footer}>
        <div style={c.meta}>
          <button
            style={c.metaBtn}
            onClick={cycleFrequency}
            title="Changer la fréquence"
          >{kpi.frequency || 'Hebdomadaire'}</button>
          <span style={c.metaDot}></span>
          <button
            style={c.metaBtn}
            onClick={() => setHistoryOpen(true)}
            title="Voir l'historique"
          >MAJ {kpi.lastUpdate || '—'}</button>
        </div>
        <button style={c.addBtn} onClick={() => onAddMeasure && onAddMeasure(kpi)}>
          <i data-lucide="plus" style={{width:11,height:11,strokeWidth:2.5}}></i>
          Mesure
        </button>
      </div>

      <KPIHistorySheet
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        kpi={kpi}
        accent={accent}
      />
    </div>
  );
};

const KPIEmptyState = ({ jalon, onCreate }) => {
  const emptyStyles = {
    wrap: {
      gridColumn: '1 / -1',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
      padding: '24px 24px',
      borderRadius: 12,
      border: '1px dashed rgba(255,253,246,0.12)',
      background: 'rgba(255,253,246,0.02)',
    },
    head: {
      fontSize: 13, color: 'rgba(255,253,246,0.74)',
      lineHeight: 1.5,
    },
    headStrong: { color: '#FFFDF6', fontWeight: 600 },
    actions: { display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%' },
    btn: (variant) => ({
      flex: '1 1 200px',
      display: 'inline-flex', alignItems: 'center', gap: 9,
      padding: '12px 14px', borderRadius: 9,
      border: `1px solid ${variant === 'leading' ? 'rgba(91,174,201,0.36)' : 'rgba(238,68,8,0.36)'}`,
      background: variant === 'leading' ? 'rgba(91,174,201,0.06)' : 'rgba(238,68,8,0.06)',
      color: variant === 'leading' ? '#5BAEC9' : '#EE4408',
      fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
      cursor: 'pointer', textAlign: 'left',
      transition: 'background 150ms ease',
    }),
    btnSub: {
      display: 'block', marginTop: 2,
      fontSize: 11.5, fontWeight: 500,
      color: 'rgba(255,253,246,0.55)',
    },
  };

  return (
    <div style={emptyStyles.wrap}>
      <div style={emptyStyles.head}>
        Aucun KPI pour <strong style={emptyStyles.headStrong}>{jalon.title}</strong>. Crée-en jusqu'à <strong style={emptyStyles.headStrong}>2 KPI</strong>, à partir du critère de validation.
      </div>
      <div style={emptyStyles.actions}>
        <button style={emptyStyles.btn('leading')} onClick={() => onCreate && onCreate('leading')}>
          <i data-lucide="trending-up" style={{width:16,height:16}}></i>
          <span>
            Ajouter un indicateur d'avancée
            <span style={emptyStyles.btnSub}>Ce que tu fais qui crée la traction</span>
          </span>
        </button>
        <button style={emptyStyles.btn('lagging')} onClick={() => onCreate && onCreate('lagging')}>
          <i data-lucide="target" style={{width:16,height:16}}></i>
          <span>
            Ajouter un indicateur de résultat
            <span style={emptyStyles.btnSub}>Le résultat que tu vises</span>
          </span>
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { JalonKPICard, KPIEmptyState, KPIActionMenu, KPIHistorySheet });
