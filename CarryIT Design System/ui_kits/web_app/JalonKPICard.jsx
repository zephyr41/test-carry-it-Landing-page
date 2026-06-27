// CarryIT — KPI Card (data-grounded, per kpi.md)
// Structure (kpi.md §4): title, value, unit, frequency, type, target (opt)
// Actions (kpi.md §7) via "Modifier" button: title, value, frequency, target.
// "+ Mesure" adds a dated measurement; the value becomes the latest measure.
// Sparkline is clickable -> history sheet with the real measure list.
// Exports: JalonKPICard, KPIEmptyState, KPIHistorySheet

const KPIHistorySheet = ({ open, onClose, kpi, accent, onDeleteMeasure, onUpdateMeasure }) => {
  if (!open) return null;
  const measures = (kpi.measures || []).slice().reverse(); // newest first; original index preserved below

  const sheetStyles = {
    backdrop: {
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end',
    },
    sheet: {
      width: 'min(440px, 100%)', height: '100%',
      background: '#16161A',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '-24px 0 64px rgba(0,0,0,0.45)',
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
      fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em',
      color: 'rgba(255,253,246,0.42)', textTransform: 'uppercase',
      marginBottom: 6,
    },
    title: {
      fontSize: 18, fontWeight: 700, color: '#FFFDF6',
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    subtitle: {
      fontSize: 12, color: 'rgba(255,253,246,0.72)', marginTop: 4,
    },
    close: {
      width: 30, height: 30, borderRadius: 6,
      border: 'none', background: 'transparent',
      color: 'rgba(255,253,246,0.72)', cursor: 'pointer',
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
    rowInput: {
      background: 'transparent', border: 'none', color: '#FFFDF6', fontSize: 13,
      fontFamily: 'inherit', outline: 'none', borderBottom: '1px solid transparent',
      transition: 'border-color 0.2s', width: '100%',
    },
    rowNoteInput: {
      background: 'transparent', border: 'none', color: 'rgba(255,253,246,0.72)', fontSize: 12,
      fontFamily: 'inherit', outline: 'none', width: '100%', marginTop: 4,
    },
    rowDelta: {
      fontSize: 11.5, color: 'rgba(255,253,246,0.72)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    },
    rowVal: {
      fontSize: 18, fontWeight: 700, color: '#FFFDF6',
      fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
    },
    rowUnit: { fontSize: 11, color: 'rgba(255,253,246,0.72)', marginLeft: 4, fontWeight: 400 },
    rowDelBtn: {
      width: 26, height: 26, borderRadius: 6,
      border: 'none', background: 'transparent',
      color: 'rgba(255,253,246,0.42)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 120ms ease, color 120ms ease',
    },
    empty: {
      padding: '48px 28px', fontSize: 13.5, color: 'rgba(255,253,246,0.72)',
      textAlign: 'center', lineHeight: 1.6,
    },
  };

  // measures are reversed; original index = (length - 1 - i)
  const originalIndex = (i) => (kpi.measures.length - 1 - i);

  return (
    <div style={sheetStyles.backdrop} onClick={onClose}>
      <style>{`@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={sheetStyles.sheet} onClick={e => e.stopPropagation()}>
        <div style={sheetStyles.head}>
          <div style={sheetStyles.headLeft}>
            <div style={sheetStyles.overline}>Historique des mesures</div>
            <div style={sheetStyles.title}>{kpi.label}</div>
            <div style={sheetStyles.subtitle}>
              {measures.length === 0
                ? 'Aucune mesure'
                : `${measures.length} mesure${measures.length > 1 ? 's' : ''} enregistrée${measures.length > 1 ? 's' : ''}`}
            </div>
          </div>
          <button style={sheetStyles.close} onClick={onClose}>
            <i data-lucide="x" style={{width:16,height:16}}></i>
          </button>
        </div>
        <div style={sheetStyles.body}>
          {measures.length === 0 ? (
            <div style={sheetStyles.empty}>
              Aucune mesure enregistrée.<br/>
              <span style={{fontSize:12,opacity:0.7}}>Utilise "+ Mesure" pour en ajouter une.</span>
            </div>
          ) : measures.map((m, i) => {
            const prev = measures[i + 1];
            const delta = prev ? m.value - prev.value : null;
            const deltaLabel = delta === null
              ? '—'
              : (delta > 0 ? `+${delta}` : `${delta}`);
            return (
              <div key={i} style={sheetStyles.row}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={sheetStyles.rowDate}>{m.date}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      style={{...sheetStyles.rowInput, width: 60, color: 'rgba(255,253,246,0.5)'}}
                      value={m.time || ''}
                      placeholder="10:00"
                      onChange={e => onUpdateMeasure && onUpdateMeasure(originalIndex(i), { ...m, time: e.target.value })}
                      onFocus={e => e.target.style.borderBottom = '1px solid rgba(255,253,246,0.2)'}
                      onBlur={e => e.target.style.borderBottom = '1px solid transparent'}
                    />
                    <div style={sheetStyles.rowDelta}>{deltaLabel} vs précédent</div>
                  </div>
                  <input
                    style={sheetStyles.rowNoteInput}
                    value={m.note || ''}
                    placeholder="Ajouter une note..."
                    onChange={e => onUpdateMeasure && onUpdateMeasure(originalIndex(i), { ...m, note: e.target.value })}
                  />
                </div>
                <div>
                  <span style={sheetStyles.rowVal}>{m.value}</span>
                  <span style={sheetStyles.rowUnit}>{kpi.unit}</span>
                </div>
                <button
                  style={sheetStyles.rowDelBtn}
                  title="Supprimer cette mesure"
                  onClick={() => onDeleteMeasure && onDeleteMeasure(originalIndex(i))}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,86,0.1)'; e.currentTarget.style.color = '#ff6b56'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,253,246,0.42)'; }}
                >
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

const JalonKPICard = ({ kpi, onAddMeasure, onUpdate, onEdit, onDeleteMeasure, onUpdateMeasure }) => {
  const isLeading = kpi.type === 'leading';
  const accent = '#EE4408';

  const [historyOpen, setHistoryOpen] = React.useState(false);

  const measures = kpi.measures || [];
  const hasMeasures = measures.length > 0;
  const hasTarget = typeof kpi.target === 'number' && kpi.target > 0;
  const pct = hasTarget && hasMeasures ? Math.min(100, Math.round((kpi.value / kpi.target) * 100)) : null;

  const lastMeasure = hasMeasures ? measures[measures.length - 1] : null;
  const prevMeasure = measures.length >= 2 ? measures[measures.length - 2] : null;
  const delta = prevMeasure ? lastMeasure.value - prevMeasure.value : null;
  const deltaPct = prevMeasure && prevMeasure.value !== 0
    ? Math.round(((lastMeasure.value - prevMeasure.value) / Math.abs(prevMeasure.value)) * 100)
    : null;
  const deltaIsUp = delta !== null && delta > 0;
  const deltaIsFlat = delta !== null && delta === 0;

  // Sparkline geometry — only drawn with >= 2 measures
  const sparkData = measures.map(m => m.value);
  const sparkW = 220, sparkH = 44;
  let sparkPath = '', sparkArea = '', sparkLastX = 0, sparkLastY = 0;
  if (sparkData.length >= 2) {
    const min = Math.min(...sparkData, hasTarget ? 0 : Math.min(...sparkData));
    const max = Math.max(...sparkData, hasTarget ? kpi.target : Math.max(...sparkData));
    const range = max - min || 1;
    const pts = sparkData.map((v, i) => {
      const x = (i / (sparkData.length - 1)) * sparkW;
      const y = sparkH - ((v - min) / range) * (sparkH - 6) - 3;
      return [x, y];
    });
    sparkPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    sparkArea = `${sparkPath} L${sparkW},${sparkH} L0,${sparkH} Z`;
    sparkLastX = pts[pts.length - 1][0];
    sparkLastY = pts[pts.length - 1][1];
  }

  const frequency = kpi.frequency || 'Hebdomadaire';

  const c = {
    card: {
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      padding: 22,
      display: 'flex', flexDirection: 'column',
      gap: 18,
      minWidth: 0,
      position: 'relative',
      overflow: 'hidden',
    },
    head: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 10,
      minHeight: 18,
    },
    typeChip: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: 0,
      color: 'rgba(255,253,246,0.42)',
      fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    },
    typeGlyph: { display: 'inline-flex', width: 11, height: 11, alignItems: 'center', justifyContent: 'center' },
    freqChip: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 9999,
      background: 'rgba(255,253,246,0.04)',
      border: '1px solid rgba(255,253,246,0.08)',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 10.5, fontWeight: 500,
      letterSpacing: 0,
      textTransform: 'none',
      whiteSpace: 'nowrap',
    },
    title: {
      fontSize: 14, fontWeight: 500,
      color: 'rgba(255,253,246,0.72)',
      letterSpacing: '-0.005em', lineHeight: 1.35,
    },
    valueRow: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
    },
    valueWrap: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
    value: {
      fontSize: 44, fontWeight: 700, color: '#FFFDF6',
      letterSpacing: '-0.04em', lineHeight: 0.95,
      fontVariantNumeric: 'tabular-nums',
      display: 'flex', alignItems: 'baseline', gap: 8,
    },
    valueEmpty: {
      fontSize: 44, fontWeight: 700,
      color: 'rgba(255,253,246,0.18)',
      letterSpacing: '-0.04em', lineHeight: 0.95,
      fontVariantNumeric: 'tabular-nums',
    },
    unit: { fontSize: 14, fontWeight: 500, color: 'rgba(255,253,246,0.72)', letterSpacing: '-0.005em' },
    delta: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, fontWeight: 600,
      color: deltaIsFlat ? 'rgba(255,253,246,0.42)' : deltaIsUp ? '#7ED48F' : '#F47A60',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      letterSpacing: 0,
      whiteSpace: 'nowrap',
    },
    deltaSub: {
      fontSize: 11, color: 'rgba(255,253,246,0.42)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      marginLeft: 6,
      whiteSpace: 'nowrap',
    },
    deltaWrap: {
      display: 'flex', alignItems: 'baseline', gap: 0,
      flexWrap: 'wrap',
      rowGap: 2,
    },
    sparkWrap: {
      flex: '0 0 auto',
      minWidth: 120,
      maxWidth: 220,
      display: 'flex', justifyContent: 'flex-end',
    },
    emptyState: {
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: '14px 16px',
      borderRadius: 10,
      background: 'rgba(255,253,246,0.025)',
      border: '1px dashed rgba(255,253,246,0.10)',
    },
    emptyTitle: {
      fontSize: 12.5, fontWeight: 500,
      color: 'rgba(255,253,246,0.72)',
      lineHeight: 1.4,
    },
    emptyHint: {
      fontSize: 11.5, color: 'rgba(255,253,246,0.42)',
      lineHeight: 1.4,
    },
    progressBlock: {
      display: 'flex', flexDirection: 'column', gap: 7,
    },
    progressLabels: {
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 8,
      fontSize: 11.5,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    },
    progressLabelLeft: {
      color: 'rgba(255,253,246,0.42)',
      letterSpacing: '0.04em', textTransform: 'uppercase',
      fontSize: 10,
      fontWeight: 600,
    },
    progressValue: {
      color: '#FFFDF6', fontWeight: 600,
    },
    progressTarget: {
      color: 'rgba(255,253,246,0.42)',
      marginLeft: 4,
    },
    progressBar: {
      height: 3,
      background: 'rgba(255,253,246,0.08)',
      borderRadius: 2, overflow: 'hidden',
    },
    progressFill: {
      width: `${pct || 0}%`, height: '100%',
      background: accent,
      borderRadius: 2,
      transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
    },
    setTargetRow: {
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 8,
      border: '1px dashed rgba(255,255,255,0.10)',
      color: 'rgba(255,253,246,0.42)',
      fontSize: 12, fontFamily: 'inherit',
      background: 'transparent',
      cursor: 'pointer', alignSelf: 'flex-start',
      transition: 'border-color 120ms cubic-bezier(0.16,1,0.3,1), color 120ms cubic-bezier(0.16,1,0.3,1)',
    },
    footer: {
      display: 'flex', alignItems: 'center', gap: 10,
      paddingTop: 14,
      borderTop: '1px solid rgba(255,253,246,0.06)',
      flexWrap: 'wrap',
    },
    meta: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12.5, color: 'rgba(255,253,246,0.72)',
      flex: 1, minWidth: 0,
      fontVariantNumeric: 'tabular-nums',
      background: 'transparent', border: 'none', padding: 0,
      fontFamily: 'inherit', cursor: 'pointer',
      transition: 'color 150ms cubic-bezier(0.16,1,0.3,1)',
    },
    metaDisabled: { cursor: 'default' },
    metaDim: { color: 'rgba(255,253,246,0.42)', fontStyle: 'italic' },
    editBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 10px', borderRadius: 7,
      background: 'transparent',
      border: '1px solid rgba(255,253,246,0.14)',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'border-color 150ms ease, color 150ms ease',
    },
    addBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '7px 12px', borderRadius: 7,
      background: hasMeasures ? accent : accent,
      border: 'none',
      color: '#FFFDF6',
      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
      cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'opacity 150ms ease',
    },
  };

  return (
    <div style={c.card}>
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
      </div>

      <div style={c.title}>{kpi.label}</div>

      <div style={c.valueRow}>
        <div style={c.valueWrap}>
          {hasMeasures ? (
            <div style={c.value}>
              <span>{kpi.value}</span>
              <span style={c.unit}>{kpi.unit}</span>
            </div>
          ) : (
            <div style={c.value}>
              <span style={c.valueEmpty}>—</span>
              <span style={c.unit}>{kpi.unit || 'à mesurer'}</span>
            </div>
          )}
          {delta !== null && (
            <div style={c.deltaWrap}>
              <span style={c.delta}>
                <i
                  data-lucide={deltaIsFlat ? 'minus' : deltaIsUp ? 'arrow-up-right' : 'arrow-down-right'}
                  style={{width:11,height:11,strokeWidth:2.5}}
                ></i>
                {deltaIsUp ? '+' : ''}{delta}
              </span>
            </div>
          )}
        </div>
        {sparkData.length >= 2 && (
          <div style={c.sparkWrap}>
            <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} style={{overflow:'visible'}}>
              {hasTarget && (() => {
                const min = Math.min(...sparkData, 0);
                const max = Math.max(...sparkData, kpi.target);
                const range = max - min || 1;
                const targetY = sparkH - ((kpi.target - min) / range) * (sparkH - 6) - 3;
                return (
                  <g>
                    <line x1="0" x2={sparkW} y1={targetY} y2={targetY} stroke="rgba(255,253,246,0.18)" strokeWidth="1" strokeDasharray="2 3"/>
                  </g>
                );
              })()}
              <path d={sparkArea} fill={accent} fillOpacity="0.08"/>
              <path d={sparkPath} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx={sparkLastX} cy={sparkLastY} r="3" fill={accent}/>
              <circle cx={sparkLastX} cy={sparkLastY} r="3" fill="none" stroke="#111111" strokeWidth="2"/>
              <circle cx={sparkLastX} cy={sparkLastY} r="3" fill={accent}/>
            </svg>
          </div>
        )}
      </div>

      {!hasMeasures && (
        <div style={c.emptyState}>
          <div style={c.emptyTitle}>Aucune mesure pour ce KPI</div>
          <div style={c.emptyHint}>
            Démarre le suivi en enregistrant la première valeur. Tu pourras ensuite voir l'évolution dans le temps.
          </div>
        </div>
      )}

      {hasMeasures && hasTarget && (
        <div style={c.progressBlock}>
          <div style={c.progressLabels}>
            <span style={c.progressValue}>{kpi.value} / {kpi.target} {kpi.unit}</span>
            <span style={c.progressValue}>{pct}%</span>
          </div>
          <div style={c.progressBar}>
            <div style={c.progressFill}></div>
          </div>
        </div>
      )}

      {hasMeasures && !hasTarget && (
        <button
          style={c.setTargetRow}
          onClick={() => onEdit && onEdit(kpi)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; e.currentTarget.style.color = '#FFFDF6'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,253,246,0.42)'; }}
        >
          <i data-lucide="crosshair" style={{width:12,height:12}}></i>
          Définir une cible
        </button>
      )}

      <div style={c.footer}>
        <button
          style={lastMeasure ? c.meta : {...c.meta, ...c.metaDisabled}}
          onClick={lastMeasure ? () => setHistoryOpen(true) : undefined}
          disabled={!lastMeasure}
          title={lastMeasure ? "Voir l'historique" : 'Aucune mesure'}
          onMouseEnter={e => { if (lastMeasure) e.currentTarget.style.color = '#FFFDF6'; }}
          onMouseLeave={e => { if (lastMeasure) e.currentTarget.style.color = 'rgba(255,253,246,0.72)'; }}
        >
          <i data-lucide="calendar" style={{width:13,height:13,color:'rgba(255,253,246,0.42)'}}></i>
          {lastMeasure ? (
            <span>{lastMeasure.date} · {measures.length} mesure{measures.length > 1 ? 's' : ''}</span>
          ) : (
            <span style={c.metaDim}>Pas encore mesuré</span>
          )}
        </button>
        <button
          style={c.editBtn}
          onClick={() => onEdit && onEdit(kpi)}
          title="Modifier le KPI"
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,253,246,0.42)'; e.currentTarget.style.color = '#FFFDF6'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,253,246,0.14)'; e.currentTarget.style.color = 'rgba(255,253,246,0.72)'; }}
        >
          <i data-lucide="pencil" style={{width:11,height:11}}></i>
          Modifier
        </button>
        <button style={c.addBtn} onClick={() => onAddMeasure && onAddMeasure(kpi)}>
          <i data-lucide="plus" style={{width:11,height:11,strokeWidth:2.5}}></i>
          {hasMeasures ? 'Mesure' : 'Première mesure'}
        </button>
      </div>

      <KPIHistorySheet
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        kpi={kpi}
        accent={accent}
        onDeleteMeasure={onDeleteMeasure}
        onUpdateMeasure={onUpdateMeasure}
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
      fontSize: 13, color: 'rgba(255,253,246,0.72)',
      lineHeight: 1.5,
    },
    headStrong: { color: '#FFFDF6', fontWeight: 600 },
    actions: { display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%' },
    btn: () => ({
      flex: '1 1 200px',
      display: 'inline-flex', alignItems: 'center', gap: 9,
      padding: '12px 14px', borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      cursor: 'pointer', textAlign: 'left',
      transition: 'border-color 150ms cubic-bezier(0.16,1,0.3,1), background 150ms cubic-bezier(0.16,1,0.3,1)',
    }),
    btnSub: {
      display: 'block', marginTop: 2,
      fontSize: 11.5, fontWeight: 500,
      color: 'rgba(255,253,246,0.42)',
    },
  };

  return (
    <div style={emptyStyles.wrap}>
      <div style={emptyStyles.head}>
        Aucun KPI pour <strong style={emptyStyles.headStrong}>{jalon.title}</strong>. Crée-en jusqu'à <strong style={emptyStyles.headStrong}>2 KPI</strong>, à partir du critère de validation.
      </div>
      <div style={emptyStyles.actions}>
        <button style={emptyStyles.btn()} onClick={() => onCreate && onCreate('leading')}>
          <i data-lucide="trending-up" style={{width:16,height:16}}></i>
          <span>
            Ajouter un indicateur d'avancée
            <span style={emptyStyles.btnSub}>Ce que tu fais qui crée la traction</span>
          </span>
        </button>
        <button style={emptyStyles.btn()} onClick={() => onCreate && onCreate('lagging')}>
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

export { JalonKPICard, KPIEmptyState, KPIHistorySheet };
Object.assign(window, { JalonKPICard, KPIEmptyState, KPIHistorySheet });
