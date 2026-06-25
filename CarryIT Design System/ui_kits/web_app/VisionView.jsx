// CarryIT — Vision long terme view
// Eyebrow + KPI card + SMART card — reuses original BlocVision layout
// Exports: VisionView

const VisionView = ({ kpiData, smart, jalons, onAddMeasure, onEditSmart, density = 'comfort' }) => {
  const compact = density === 'compact';
  const [hoveredEffortDay, setHoveredEffortDay] = React.useState(null);

  const activeJalon = jalons.find(j => !j.done) || jalons[0] || {};
  
  const laggingKpi = activeJalon.kpis?.find(k => k.type === 'lagging') || {};
  const leadingKpi = activeJalon.kpis?.find(k => k.type === 'leading') || {};
  
  let dynamicDaysElapsed = 0;
  if (laggingKpi.measures && laggingKpi.measures.length > 0) {
    const lastMeasure = laggingKpi.measures[laggingKpi.measures.length - 1];
    const today = new Date("2026-06-25T00:00:00Z");
    let dStr = lastMeasure.date;
    if (dStr && dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts[2] && parts[2].length === 4) dStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const lastDate = new Date(dStr);
    if (!isNaN(lastDate)) {
      const diffTime = Math.max(0, today - lastDate);
      dynamicDaysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
  } else if (activeJalon.execution) {
    dynamicDaysElapsed = activeJalon.execution.daysElapsed || 0;
  }

  const execution = {
    daysElapsed: dynamicDaysElapsed,
    effort: {
      value: leadingKpi.valeur !== undefined ? leadingKpi.valeur : (activeJalon.execution?.effort?.value || activeJalon.execution?.effortHours || 0),
      label: leadingKpi.titre || activeJalon.execution?.effort?.label || 'Effort depuis',
      unit: leadingKpi.unite || activeJalon.execution?.effort?.unit || 'h'
    },
    result: {
      value: laggingKpi.valeur !== undefined ? laggingKpi.valeur : (activeJalon.execution?.result?.value || 0),
      target: laggingKpi.cible !== undefined ? laggingKpi.cible : (activeJalon.execution?.result?.target || 0),
      label: laggingKpi.unite || laggingKpi.titre || activeJalon.execution?.result?.label || ''
    },
    days: activeJalon.execution?.days || []
  };

  const activeJalonIndex = Math.max(0, jalons.findIndex(j => j.id === (activeJalon && activeJalon.id)));
  const totalJalons = jalons.length || 1;
  const activeJalonProgress = totalJalons > 1 ? activeJalonIndex / (totalJalons - 1) : 0;
  const daysElapsed = Math.max(0, execution.daysElapsed);
  const lastDoneIndex = activeJalonIndex - 1;
  const lastDoneProgress = totalJalons > 1 && lastDoneIndex >= 0 ? lastDoneIndex / (totalJalons - 1) : 0;
  const effortMeasures = leadingKpi.measures || [];
  const effortDates = new Set();
  const effortValues = {};
  effortMeasures.forEach(m => {
    let dStr = m.date;
    if (dStr && dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts[2] && parts[2].length === 4) dStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    effortDates.add(dStr);
    effortValues[dStr] = m.value;
  });

  let lastEffortDateStr = '';
  let lastEffortValue = '';
  if (effortMeasures.length > 0) {
    const lastEffort = effortMeasures[effortMeasures.length - 1];
    let dStr = lastEffort.date;
    if (dStr && dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts[2] && parts[2].length === 4) dStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    lastEffortDateStr = dStr;
    lastEffortValue = lastEffort.value;
  }

  const todayDate = new Date("2026-06-25T00:00:00Z");
  const currentDayOfWeek = todayDate.getDay() || 7;
  const daysToSunday = 7 - currentDayOfWeek;
  const lastGridDate = new Date(todayDate);
  lastGridDate.setDate(todayDate.getDate() + daysToSunday);

  const calendarCells = Array.from({ length: 28 }, (_, i) => {
    const dayInWeek = i % 7;
    const weekIndex = Math.floor(i / 7);
    const dayFromNow = 27 - i;
    
    const cellDate = new Date(lastGridDate);
    cellDate.setDate(lastGridDate.getDate() - dayFromNow);
    const cellDateStr = cellDate.toISOString().split('T')[0];
    
    const active = effortDates.has(cellDateStr);
    
    const diffFromToday = Math.floor((todayDate - cellDate) / (1000 * 60 * 60 * 24));
    const inCurrentPeriod = diffFromToday >= 0 && diffFromToday < Math.max(1, execution.daysElapsed);
    
    return {
      label: ['L', 'M', 'M', 'J', 'V', 'S', 'D'][dayInWeek],
      weekLabel: `S-${3 - weekIndex}`,
      active,
      isResultDay: diffFromToday === execution.daysElapsed,
      inCurrentPeriod,
      today: diffFromToday === 0,
      title: active ? 'Mise à jour KPI' : 'Aucun effort enregistré',
      time: active ? `${effortValues[cellDateStr]} ${execution.effort.unit || 'enregistré'}` : null,
      duration: active ? `${effortValues[cellDateStr]}` : null,
      note: active ? `Effort enregistré le ${cellDateStr}` : 'Pas de session enregistrée sur cette journée.'
    };
  });

  const periodBands = [];
  for (let week = 0; week < 4; week++) {
    const startCell = week * 7;
    let activeStartCol = -1;
    let activeEndCol = -1;
    for (let col = 0; col < 7; col++) {
      const cellIndex = startCell + col;
      const dayFromNow = 27 - cellIndex;
      
      const cellDate = new Date(lastGridDate);
      cellDate.setDate(lastGridDate.getDate() - dayFromNow);
      const diffFromToday = Math.floor((todayDate - cellDate) / (1000 * 60 * 60 * 24));
      
      if (diffFromToday >= 0 && diffFromToday <= execution.daysElapsed) {
        if (activeStartCol === -1) activeStartCol = col;
        activeEndCol = col;
      }
    }
    if (activeStartCol !== -1) {
      const numCells = activeEndCol - activeStartCol + 1;
      const left = activeStartCol * (15 + 3);
      const width = numCells * 15 + (numCells - 1) * 3;
      const bottom = (3 - week) * 20;
      periodBands.push({ left, width, bottom });
    }
  }

  const visionStyles = {
    page: {
      maxWidth: 1280, margin: '0 auto',
      padding: compact ? '24px 32px 64px' : '32px 32px 88px',
    },
    quickGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr',
      gap: 16,
      marginBottom: 18,
      alignItems: 'stretch',
    },
    quickCard: {
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '12px 14px',
      minHeight: 86,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minWidth: 0,
    },
    metricCard: {
      padding: '12px 14px',
      minHeight: 88,
    },
    metricValue: {
      fontSize: 23,
    },
    metricSub: {
      marginTop: 4,
      fontSize: 11.5,
    },
    calendarCard: {
      display: 'grid',
      gridTemplateColumns: '1fr max-content',
      gridTemplateRows: 'auto 1fr',
      columnGap: 24,
      rowGap: 5,
      alignItems: 'start',
      minHeight: 86,
      paddingTop: 10,
      paddingBottom: 9,
    },
    calendarTitleBlock: {
      alignSelf: 'start',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    },
    calendarTitle: {
      fontSize: 11,
      fontWeight: 650,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'rgba(255,253,246,0.62)',
    },
    quickHead: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginBottom: 7,
    },
    quickLabel: {
      fontSize: 11,
      fontWeight: 650,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'rgba(255,253,246,0.62)',
    },
    quickMeta: {
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 11.5,
      fontWeight: 600,
      color: 'rgba(255,253,246,0.72)',
      whiteSpace: 'nowrap',
    },
    quickValue: {
      fontSize: 25,
      lineHeight: 1,
      color: '#FFFDF6',
      fontWeight: 740,
      letterSpacing: '-0.02em',
    },
    quickMuted: {
      fontSize: 16,
      color: 'rgba(255,253,246,0.42)',
      fontWeight: 520,
    },
    quickSub: {
      marginTop: 5,
      fontSize: 12,
      color: 'rgba(255,253,246,0.52)',
      lineHeight: 1.35,
    },
    jalonTitle: {
      fontSize: 15,
      lineHeight: 1.25,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.005em',
    },
    jalonMeta: {
      marginTop: 3,
      fontSize: 11.5,
      color: 'rgba(255,253,246,0.52)',
    },
    jalonCounter: {
      flex: '0 0 auto',
      color: 'rgba(255,253,246,0.46)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 10,
      fontWeight: 700,
    },
    jalonTimelineRow: {
      display: 'grid',
      gridTemplateColumns: 'auto minmax(0, 1fr)',
      gap: 10,
      alignItems: 'center',
      marginTop: 14,
    },
    jalonTimeline: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '3px 2px',
    },
    jalonConnector: {
      position: 'absolute',
      left: 8,
      right: 8,
      top: '50%',
      borderTop: '1px dashed rgba(255,253,246,0.20)',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
    jalonConnectorDone: {
      position: 'absolute',
      left: 8,
      top: '50%',
      width: `calc((100% - 16px) * ${activeJalonProgress})`,
      borderTop: '1px solid rgba(255,253,246,0.62)',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
    jalonStep: {
      position: 'relative', zIndex: 1, flexShrink: 0,
      width: 16, height: 16, borderRadius: '50%',
      background: '#111111',
      border: '1.5px solid rgba(255,255,255,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'transparent',
    },
    jalonStepDone: {
      background: '#111111',
      border: '1.5px solid rgba(255,255,255,0.22)',
      color: 'rgba(255,255,255,0.6)',
    },
    jalonStepActive: {
      background: '#EE4408',
      border: 'none',
      boxShadow: '0 0 0 3px rgba(238,68,8,0.18)',
    },
    calendarMeta: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      fontSize: 11,
      color: 'rgba(255,253,246,0.52)',
    },
    calendarMetaStrong: {
      color: '#FFFDF6',
      fontWeight: 700,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: 34,
      lineHeight: 0.9,
      letterSpacing: '-0.03em',
    },
    calendarMetaUnit: {
      fontSize: 11.5,
      color: 'rgba(255,253,246,0.42)',
      fontWeight: 600,
      lineHeight: 1.15,
    },
    calendarBody: {
      gridColumn: '1',
      gridRow: '2',
      alignSelf: 'center',
      justifySelf: 'center',
      marginTop: 0,
    },
    calendarMonth: {
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 10.5,
      fontWeight: 600,
      color: 'rgba(255,253,246,0.46)',
      whiteSpace: 'nowrap',
    },
    calendarPanel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gridColumn: '2',
      gridRow: '1 / span 2',
      marginTop: 0,
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 15px)',
      rowGap: 3,
      columnGap: 3,
      alignItems: 'center',
      position: 'relative',
      justifyContent: 'start',
    },
    calendarDayLabel: {
      fontSize: 9.5,
      fontWeight: 650,
      color: 'rgba(255,253,246,0.42)',
      textAlign: 'center',
    },
    calendarPeriodBand: {
      position: 'absolute',
      left: 0,
      width: 123,
      bottom: 0,
      height: 16,
      borderRadius: 999,
      background: 'rgba(255,253,246,0.08)',
      border: '1px solid rgba(255,253,246,0.11)',
      pointerEvents: 'none',
    },
    calendarCell: {
      position: 'relative',
      zIndex: 1,
      width: 15,
      height: 15,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      justifySelf: 'center',
    },
    calendarCellPeriod: {
      background: 'transparent',
    },
    calendarCellMarker: {
      boxShadow: '0 0 0 1px rgba(255,253,246,0.35) inset',
      background: 'rgba(255,253,246,0.06)',
    },
    calendarDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'rgba(255,253,246,0.12)',
    },
    calendarDotActive: {
      background: '#FFFDF6',
    },
    calendarDotResult: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: '#EE4408',
      boxShadow: '0 0 0 2px rgba(238,68,8,0.3)',
      zIndex: 2,
    },
    calendarPopover: {
      position: 'absolute',
      right: -8,
      width: 260,
      top: 'calc(100% + 10px)',
      zIndex: 10,
      background: '#171717',
      border: '1px solid rgba(255,253,246,0.12)',
      borderRadius: 10,
      padding: 14,
      boxShadow: '0 18px 42px rgba(0,0,0,0.42)',
    },
    popoverTop: {
      display: 'grid',
      gridTemplateColumns: '64px 1fr',
      gap: 10,
      alignItems: 'start',
    },
    popoverHours: {
      display: 'grid',
      gap: 7,
      color: 'rgba(255,253,246,0.42)',
      fontSize: 10.5,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    },
    popoverSchedule: {
      position: 'relative',
      minHeight: 92,
      borderLeft: '1px solid rgba(255,253,246,0.08)',
      background: 'repeating-linear-gradient(to bottom, transparent 0, transparent 22px, rgba(255,253,246,0.07) 23px)',
    },
    popoverBlock: {
      position: 'absolute',
      left: 10,
      right: 0,
      top: 34,
      minHeight: 32,
      borderRadius: 7,
      background: 'rgba(255,253,246,0.08)',
      borderLeft: '3px solid #FFFDF6',
      padding: '6px 8px',
    },
    popoverBlockTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: '#FFFDF6',
    },
    popoverBlockMeta: {
      marginTop: 2,
      fontSize: 11,
      color: 'rgba(255,253,246,0.58)',
    },
    popoverNote: {
      marginTop: 10,
      paddingTop: 9,
      borderTop: '1px solid rgba(255,253,246,0.08)',
      fontSize: 11.5,
      lineHeight: 1.45,
      color: 'rgba(255,253,246,0.68)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
      gap: 18,
      alignItems: 'start',
    },
  };

  return (
    <div className="vision-view" style={visionStyles.page} data-screen-label="01 Vision long terme">
      <style>{`
        .vision-view button:hover {
          filter: brightness(1.08);
        }
        .vision-view button:active {
          transform: translateY(1px);
        }
        @media (max-width: 980px) {
          .vision-quick-grid,
          .vision-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 720px) {
          .vision-view {
            padding: 24px 18px 64px !important;
          }
          .vision-hero {
            gap: 18px !important;
            padding-bottom: 22px !important;
          }
          .vision-quick-card {
            min-height: 104px !important;
          }
          .vision-quick-grid {
            gap: 10px !important;
          }
          .vision-card-header {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .vision-card-action {
            justify-content: center !important;
            width: 100% !important;
          }
          .vision-smart-row {
            grid-template-columns: 30px 1fr !important;
            gap: 12px !important;
          }
          .vision-smart-card,
          .vision-kpi-card {
            padding: 20px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .vision-view * {
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
      {execution && (
        <div className="vision-quick-grid" style={visionStyles.quickGrid}>
          <section className="vision-quick-card" style={visionStyles.quickCard} aria-label="Position dans les jalons de l'objectif final">
            <div style={visionStyles.quickHead}>
              <span style={visionStyles.quickLabel}>Jalon actif</span>
              <span style={visionStyles.quickMeta}>{activeJalonIndex + 1}/{totalJalons}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div>
                <div style={visionStyles.jalonTitle}>{activeJalon.title}</div>
                <div style={{ ...visionStyles.jalonMeta, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={activeJalon.validation}>{activeJalon.validation}</div>
                <div style={{ marginTop: 14 }} aria-hidden="true">
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${jalons.length}, 1fr)`,
                    gridTemplateRows: 'auto auto',
                    rowGap: 5,
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: `${50/jalons.length}%`, right: `${50/jalons.length}%`, top: 8, borderTop: '1px solid rgba(255,253,246,0.10)', pointerEvents: 'none', zIndex: 0 }}></span>
                    <span style={{ position: 'absolute', left: `${50/jalons.length}%`, top: 8, width: `${activeJalonIndex / jalons.length * 100}%`, borderTop: '1px solid rgba(255,253,246,0.20)', pointerEvents: 'none', zIndex: 0 }}></span>
                    {jalons.map((j, i) => {
                      const isDone = i < activeJalonIndex;
                      const isActive = i === activeJalonIndex;
                      return (
                        <React.Fragment key={j.id}>
                          <div style={{ gridColumn: i+1, gridRow: 1, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                            <span style={{
                              ...visionStyles.jalonStep,
                              ...(isDone ? visionStyles.jalonStepDone : {}),
                              ...(isActive ? visionStyles.jalonStepActive : {}),
                            }}>
                              {isDone && <i data-lucide="check" style={{width:10,height:10,strokeWidth:3}}></i>}
                            </span>
                          </div>
                          <div style={{ gridColumn: i+1, gridRow: 2, display: 'flex', justifyContent: 'center' }}>
                            <span style={{
                              fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.03em',
                              color: isDone ? 'rgba(255,253,246,0.50)' : isActive ? '#FFFDF6' : 'rgba(255,253,246,0.20)',
                            }}>
                              {j.title.split(' ')[0]}
                            </span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </section>
          <section className="vision-quick-card" style={{...visionStyles.quickCard, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}} aria-label="Lecture effort / résultat">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{...visionStyles.calendarTitleBlock, marginBottom: 0, gridColumn: 'unset'}}>
                <span style={visionStyles.calendarTitle}>Lecture effort / résultat</span>
              </div>
              <div style={{...visionStyles.calendarBody, gridColumn: 'unset', gridRow: 'unset', alignSelf: 'flex-start', justifySelf: 'flex-start'}}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,253,246,0.42)', marginBottom: 4 }}>Résultat actuel</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 28, fontWeight: 700, color: '#FFFDF6', letterSpacing: '-0.02em', lineHeight: 1 }}>{execution.result.value}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,253,246,0.52)', fontWeight: 500 }}>/ {execution.result.target} {execution.result.label.replace(' acquis', '')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, paddingTop: 8, borderTop: '1px solid rgba(255,253,246,0.06)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ color: 'rgba(255,253,246,0.42)', fontWeight: 500, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progression</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#EE4408', fontWeight: 650 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EE4408', display: 'inline-block', flexShrink: 0 }}></span>
                        il y a {execution.daysElapsed}j
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ color: 'rgba(255,253,246,0.42)', fontWeight: 500, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Effort</span>
                      <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 22, fontWeight: 700, color: '#FFFDF6', letterSpacing: '-0.02em', lineHeight: 1 }}>{execution.effort ? execution.effort.value : '—'}</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,253,246,0.52)', fontWeight: 500 }}>/ {leadingKpi.cible ?? '—'} {leadingKpi.unite || ''}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{...visionStyles.calendarPanel, position: 'relative'}}>
<div style={visionStyles.calendarGrid} aria-label="Calendrier d'effort sur 28 jours" onMouseLeave={() => setHoveredEffortDay(null)}>
                {periodBands.map((band, idx) => (
                  <span key={`band-${idx}`} style={{
                    ...visionStyles.calendarPeriodBand,
                    left: band.left,
                    width: band.width,
                    bottom: band.bottom
                  }}></span>
                ))}
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <span key={i} style={visionStyles.calendarDayLabel}>{d}</span>
                ))}
                {Array.from({ length: 4 }, (_, week) => (
                  <React.Fragment key={week}>
                    {calendarCells.slice(week * 7, week * 7 + 7).map((d, i) => (
                      <span
                        key={`${week}-${i}`}
                        title={d.active ? `${d.title} · ${d.time} · ${d.duration}` : d.note}
                        onMouseEnter={() => setHoveredEffortDay(d)}
                        style={{
                          ...visionStyles.calendarCell,
                          ...(d.inCurrentPeriod ? visionStyles.calendarCellPeriod : {}),
                          ...(d.today ? visionStyles.calendarCellMarker : {}),
                        }}
                      >
                        <span
                          style={{
                            ...visionStyles.calendarDot,
                            ...(d.active ? visionStyles.calendarDotActive : {}),
                            ...(d.isResultDay ? visionStyles.calendarDotResult : {}),
                          }}
                        ></span>
                      </span>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              {hoveredEffortDay && (
                <div style={{...visionStyles.calendarPopover, pointerEvents: 'none'}}>
                  {hoveredEffortDay.active && (
                    <div style={{
                      fontSize: 11.5, fontWeight: 600, color: '#FFFDF6',
                      background: 'rgba(255,253,246,0.08)',
                      borderRadius: 6, padding: '5px 9px',
                      marginBottom: 10,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {hoveredEffortDay.title}{hoveredEffortDay.time ? ` · ${hoveredEffortDay.time}` : ''}
                    </div>
                  )}
                  {hoveredEffortDay.active ? (
                    <div style={visionStyles.popoverTop}>
                      <div style={visionStyles.popoverHours}>
                        {['08:00', '10:00', '12:00', '14:00'].map(h => (
                          <span key={h}>{h}</span>
                        ))}
                      </div>
                      <div style={visionStyles.popoverSchedule}>
                        <div style={visionStyles.popoverBlock}>
                          <div style={visionStyles.popoverBlockTitle}>{hoveredEffortDay.title}</div>
                          {hoveredEffortDay.time && (
                            <div style={visionStyles.popoverBlockMeta}>{hoveredEffortDay.time}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div style={visionStyles.popoverNote}>{hoveredEffortDay.note}</div>
                </div>
              )}
            </div>
          </section>


        </div>
      )}
      <div className="vision-grid" style={visionStyles.grid}>
        <KPICard kpiData={kpiData} objective={smart.S} onAddMeasure={onAddMeasure} />
        <SmartCard smart={smart} onEdit={onEditSmart} />
      </div>
    </div>
  );
};

export { VisionView };
Object.assign(window, { VisionView });
