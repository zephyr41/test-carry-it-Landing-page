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

  const lastLeadingMeasureValue = leadingKpi.measures?.length > 0
    ? leadingKpi.measures[leadingKpi.measures.length - 1].value
    : undefined;

  const execution = {
    daysElapsed: dynamicDaysElapsed,
    effort: {
      value: lastLeadingMeasureValue ?? leadingKpi.valeur ?? activeJalon.execution?.effort?.value ?? 0,
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
  const effortNotes = {};
  const effortTimes = {};
  // sorted ISO dates array to compute deltas
  const effortSorted = effortMeasures.map(m => {
    let dStr = m.date;
    if (dStr && dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts[2] && parts[2].length === 4) dStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return { dateISO: dStr, value: m.value };
  }).sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  const effortPrev = {}; // dateISO → previous value
  effortSorted.forEach((m, i) => {
    effortDates.add(m.dateISO);
    effortValues[m.dateISO] = m.value;
    if (i > 0) effortPrev[m.dateISO] = effortSorted[i - 1].value;
  });
  effortMeasures.forEach(m => {
    let dStr = m.date;
    if (dStr && dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts[2] && parts[2].length === 4) dStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    if (m.note) effortNotes[dStr] = m.note;
    if (m.time) effortTimes[dStr] = m.time;
  });

  const resultMeasures = laggingKpi.measures || [];
  const resultDates = new Set();
  const resultValues = {};
  const resultNotes = {};
  const resultSorted = resultMeasures.map(m => {
    let dStr = m.date;
    if (dStr && dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts[2] && parts[2].length === 4) dStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return { dateISO: dStr, value: m.value };
  }).sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  const resultPrev = {};
  resultSorted.forEach((m, i) => {
    resultDates.add(m.dateISO);
    resultValues[m.dateISO] = m.value;
    if (i > 0) resultPrev[m.dateISO] = resultSorted[i - 1].value;
  });
  resultMeasures.forEach(m => {
    let dStr = m.date;
    if (dStr && dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts[2] && parts[2].length === 4) dStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    if (m.note) resultNotes[dStr] = m.note;
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
    
    const isEffortDay = effortDates.has(cellDateStr);
    const isResultDay2 = resultDates.has(cellDateStr);
    const active = isEffortDay || isResultDay2;

    const diffFromToday = Math.floor((todayDate - cellDate) / (1000 * 60 * 60 * 24));
    const inCurrentPeriod = diffFromToday >= 0 && diffFromToday < Math.max(1, execution.daysElapsed);
    const formattedDate = cellDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    const type = isResultDay2 ? 'Résultat' : isEffortDay ? 'Effort' : null;
    const userNote = isResultDay2 ? (resultNotes[cellDateStr] || '') : isEffortDay ? (effortNotes[cellDateStr] || '') : '';

    return {
      label: ['L', 'M', 'M', 'J', 'V', 'S', 'D'][dayInWeek],
      weekLabel: `S-${3 - weekIndex}`,
      active,
      isResultDay: isResultDay2,
      inCurrentPeriod,
      today: diffFromToday === 0,
      date: formattedDate,
      type,
      title: active ? 'Mise à jour KPI' : 'Aucun enregistrement',
      time: isEffortDay ? `${effortValues[cellDateStr]} ${execution.effort.unit || ''}` : null,
      effortValue: isEffortDay ? effortValues[cellDateStr] : null,
      effortPrev: isEffortDay && effortPrev[cellDateStr] !== undefined ? effortPrev[cellDateStr] : null,
      effortUnit: isEffortDay ? (execution.effort.unit || '') : null,
      effortLabel: isEffortDay ? (execution.effort.label || '') : null,
      resultValue: isResultDay2 ? (resultValues[cellDateStr] ?? null) : null,
      resultPrevValue: isResultDay2 && resultPrev[cellDateStr] !== undefined ? resultPrev[cellDateStr] : null,
      resultUnit: isResultDay2 ? (execution.result.label || '') : null,
      timeOfDay: isEffortDay ? (effortTimes[cellDateStr] || null) : null,
      duration: isEffortDay ? `${effortValues[cellDateStr]}` : null,
      userNote,
      note: active ? '' : 'Aucun enregistrement sur cette journée.'
    };
  });

  const calendarCellSize = 22;
  const calendarGap = 4;
  const calendarLabelHeight = 14;
  const calendarRowHeight = calendarCellSize + 10;
  const elapsedTone = '#B87820';
  const elapsedToneFill = 'rgba(184,120,32,0.07)';
  const elapsedToneBorder = 'rgba(184,120,32,0.38)';
  const elapsedStartIndex = calendarCells.reduce((lastIndex, cell, index) => (
    cell.isResultDay ? index : lastIndex
  ), -1);
  const elapsedEndIndex = calendarCells.findIndex((cell) => cell.today);
  const elapsedStart = elapsedStartIndex >= 0 ? elapsedStartIndex + 1 : Math.max(0, calendarCells.findIndex((cell) => cell.inCurrentPeriod));
  const elapsedEnd = elapsedEndIndex >= 0 ? elapsedEndIndex : elapsedStart;
  const elapsedBands = [];
  if (elapsedStart >= 0 && elapsedEnd >= elapsedStart) {
    const startWeek = Math.floor(elapsedStart / 7);
    const endWeek = Math.floor(elapsedEnd / 7);
    for (let week = startWeek; week <= endWeek; week++) {
      const startCol = week === startWeek ? elapsedStart % 7 : 0;
      const endCol = week === endWeek ? elapsedEnd % 7 : 6;
      const cells = endCol - startCol + 1;
      elapsedBands.push({
        left: `calc(${startCol} * (((100% - ${calendarGap * 6}px) / 7) + ${calendarGap}px) - 1px)`,
        width: `calc(${cells} * ((100% - ${calendarGap * 6}px) / 7) + ${(cells - 1) * calendarGap}px + 2px)`,
        top: calendarLabelHeight + calendarGap + week * (calendarRowHeight + calendarGap) + Math.round((calendarRowHeight - calendarCellSize) / 2),
        isFirst: week === startWeek,
        isLast: week === endWeek,
      });
    }
  }
  const visionStyles = {
    page: {
      maxWidth: 1280, margin: '0 auto',
      padding: compact ? '24px 32px 64px' : '32px 32px 88px',
    },
    quickGrid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(560px, 620px)',
      gap: 16,
      marginBottom: 18,
      alignItems: 'stretch',
      position: 'relative',
      zIndex: 30,
      overflow: 'visible',
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
      alignItems: 'center',
      gridColumn: '2',
      gridRow: '1 / span 2',
      marginTop: 0,
      width: '100%',
      flexShrink: 0,
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
      gridTemplateRows: `${calendarLabelHeight}px repeat(4, ${calendarRowHeight}px)`,
      rowGap: calendarGap,
      columnGap: calendarGap,
      alignItems: 'center',
      position: 'relative',
      justifyContent: 'center',
      width: 'min(100%, 390px)',
      minWidth: 240,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    calendarDayLabel: {
      fontSize: 10.5,
      lineHeight: `${calendarLabelHeight}px`,
      height: calendarLabelHeight,
      fontWeight: 650,
      color: 'rgba(255,253,246,0.30)',
      textAlign: 'center',
    },
    calendarElapsedBand: {
      position: 'absolute',
      height: calendarCellSize,
      borderRadius: 999,
      background: elapsedToneFill,
      border: `1px solid ${elapsedToneBorder}`,
      pointerEvents: 'none',
      zIndex: 0,
    },
    calendarCell: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: calendarCellSize + 10,
      borderRadius: calendarCellSize / 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      justifySelf: 'center',
      flexDirection: 'column',
      gap: 2,
    },
    calendarCellPeriod: {
      background: 'transparent',
    },
    calendarCellMarker: {},
    calendarDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'rgba(255,253,246,0.08)',
    },
    calendarDotActive: {
      background: 'rgba(255,253,246,0.58)',
    },
    calendarDotResult: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'rgba(238,68,8,0.86)',
      boxShadow: '0 0 0 2px rgba(238,68,8,0.10)',
      zIndex: 2,
    },
    calendarPopover: {
      position: 'absolute',
      right: -8,
      width: 260,
      top: 'calc(100% + 10px)',
      zIndex: 120,
      background: '#171717',
      border: '1px solid rgba(255,253,246,0.12)',
      borderRadius: 10,
      padding: 14,
      boxShadow: '0 18px 42px rgba(0,0,0,0.42)',
    },
    popoverTop: {
      display: 'grid',
      gridTemplateColumns: '46px 1fr',
      gap: 6,
      alignItems: 'start',
      marginBottom: 2,
    },
    popoverHours: {
      display: 'grid',
      gridTemplateRows: 'repeat(4, 23px)',
      color: 'rgba(255,253,246,0.42)',
      fontSize: 10.5,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      alignItems: 'start',
    },
    popoverSchedule: {
      position: 'relative',
      height: 92,
      borderLeft: '1px solid rgba(255,253,246,0.08)',
      background: 'repeating-linear-gradient(to bottom, transparent 0, transparent 22px, rgba(255,253,246,0.07) 23px)',
      overflow: 'hidden',
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
    popoverHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    popoverTypeBadge: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#EE4408',
      background: 'rgba(238,68,8,0.12)',
      borderRadius: 4,
      padding: '2px 7px',
    },
    popoverDate: {
      fontSize: 11,
      color: 'rgba(255,253,246,0.52)',
      fontWeight: 500,
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
      position: 'relative',
      zIndex: 1,
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
          .vision-calendar-card {
            justify-self: stretch !important;
            width: 100% !important;
            max-width: 100% !important;
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
          .vision-calendar-card {
            grid-template-columns: 1fr !important;
            justify-items: start !important;
            justify-self: stretch !important;
            gap: 16px !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
            width: 100% !important;
          }
          .vision-calendar-card > div:first-child {
            max-width: none !important;
            width: 100% !important;
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
          <section className="vision-quick-card vision-calendar-card" style={{
            ...visionStyles.quickCard,
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 0.46fr) minmax(250px, 0.8fr)',
            columnGap: 18,
            alignItems: 'center',
            justifyContent: 'stretch',
            padding: '16px 18px 16px 28px',
            overflow: 'visible',
            width: '100%',
            maxWidth: 'none',
            justifySelf: 'stretch',
            position: 'relative',
            zIndex: 2,
          }} aria-label="Lecture effort / résultat">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
              <span style={{ color: 'rgba(255,253,246,0.40)', fontWeight: 650, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Résultat</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 31, fontWeight: 720, color: '#FFFDF6', letterSpacing: '-0.02em', lineHeight: 1 }}>{execution.result.value}</span>
                <span style={{ fontSize: 13.5, color: 'rgba(255,253,246,0.54)', fontWeight: 500 }}>/ {execution.result.target} {execution.result.label.replace(' acquis', '')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'nowrap' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EE4408', flexShrink: 0 }}></span>
                <span style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 10.5, color: elapsedTone, fontWeight: 600, letterSpacing: '0.02em' }}>{execution.daysElapsed}j sans mesure</span>
              </div>
              <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,253,246,0.10)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <span style={{ color: 'rgba(255,253,246,0.40)', fontWeight: 650, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Effort</span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 25, fontWeight: 710, color: '#FFFDF6', letterSpacing: '-0.02em', lineHeight: 1 }}>{execution.effort ? execution.effort.value : '—'}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,253,246,0.52)', fontWeight: 500 }}>/ {leadingKpi.cible ?? '—'} {leadingKpi.unite || ''}</span>
                  </span>
                </div>
              </div>
            </div>
            <div style={{...visionStyles.calendarPanel, position: 'relative', justifySelf: 'center', alignSelf: 'center', zIndex: 3}}>
              <div style={visionStyles.calendarGrid} aria-label="Calendrier d'effort sur 28 jours" onMouseLeave={() => setHoveredEffortDay(null)}>
                {elapsedBands.map((band, idx) => (
                  <span key={`elapsed-${idx}`} style={{
                    ...visionStyles.calendarElapsedBand,
                    left: band.left,
                    width: band.width,
                    top: band.top,
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
                            ...(d.today ? { boxShadow: '0 0 0 2px #111111, 0 0 0 3.5px rgba(255,253,246,0.50)' } : {}),
                          }}
                        ></span>
                      </span>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              {hoveredEffortDay && (
                <div style={{...visionStyles.calendarPopover, pointerEvents: 'none'}}>
                  <div style={visionStyles.popoverHeader}>
                    {hoveredEffortDay.type && (
                      <span style={{
                        ...visionStyles.popoverTypeBadge,
                        color: hoveredEffortDay.type === 'Résultat' ? '#EE4408' : '#FFFDF6',
                        background: hoveredEffortDay.type === 'Résultat' ? 'rgba(238,68,8,0.12)' : 'rgba(255,253,246,0.10)',
                      }}>{hoveredEffortDay.type}</span>
                    )}
                    <span style={visionStyles.popoverDate}>{hoveredEffortDay.date}</span>
                  </div>
                  {hoveredEffortDay.active ? (() => {
                    const tod = hoveredEffortDay.timeOfDay;
                    let displayHours = [10, 11, 12, 13];
                    let blockTopPx = null;
                    if (tod) {
                      const [hh, mm] = tod.split(':').map(Number);
                      const h = hh + mm / 60;
                      const startH = Math.max(6, Math.floor(h) - 1);
                      displayHours = [startH, startH+1, startH+2, startH+3];
                      blockTopPx = Math.round((h - startH) * 23);
                    }
                    const scheduleStyle = tod
                      ? visionStyles.popoverSchedule
                      : { ...visionStyles.popoverSchedule, overflow: 'visible', display: 'flex', alignItems: 'center' };
                    const blockStyle = (extra) => tod
                      ? { ...visionStyles.popoverBlock, top: blockTopPx, ...extra }
                      : { ...visionStyles.popoverBlock, position: 'relative', top: 'auto', ...extra };
                    return (
                      <div style={visionStyles.popoverTop}>
                        <div style={visionStyles.popoverHours}>
                          {displayHours.map(h => <span key={h}>{String(h).padStart(2,'0')}:00</span>)}
                        </div>
                        <div style={scheduleStyle}>
                          {hoveredEffortDay.type === 'Résultat' ? (
                            <div style={blockStyle({ borderLeft: '3px solid #EE4408' })}>
                              <div style={{ fontSize: 9.5, fontWeight: 600, color: 'rgba(238,68,8,0.8)', marginBottom: 3 }}>{hoveredEffortDay.resultUnit || 'Résultat'}{tod ? ` · ${tod}` : ''}</div>
                              {hoveredEffortDay.resultValue !== null && (
                                <div style={visionStyles.popoverBlockTitle}>
                                  {hoveredEffortDay.resultPrevValue !== null
                                    ? <>{hoveredEffortDay.resultPrevValue} <span style={{ color: 'rgba(255,253,246,0.4)', fontWeight: 400 }}>→</span> {hoveredEffortDay.resultValue}</>
                                    : hoveredEffortDay.resultValue
                                  }
                                </div>
                              )}
                              <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 10, color: '#EE4408', fontWeight: 600 }}>↺</span>
                                <span style={{ fontSize: 10, color: 'rgba(255,253,246,0.45)', fontWeight: 500 }}>Effort repart à 0</span>
                              </div>
                            </div>
                          ) : (
                            <div style={blockStyle()}>
                              <div style={{ fontSize: 9.5, fontWeight: 600, color: 'rgba(255,253,246,0.48)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hoveredEffortDay.effortLabel || hoveredEffortDay.type}{tod ? ` · ${tod}` : ''}</div>
                              {hoveredEffortDay.effortValue !== null && (
                                <div style={visionStyles.popoverBlockTitle}>
                                  {hoveredEffortDay.effortPrev !== null
                                    ? <>{hoveredEffortDay.effortPrev} <span style={{ color: 'rgba(255,253,246,0.4)', fontWeight: 400 }}>→</span> {hoveredEffortDay.effortValue}</>
                                    : hoveredEffortDay.effortValue
                                  }
                                </div>
                              )}
                              {hoveredEffortDay.effortUnit && (
                                <div style={visionStyles.popoverBlockMeta}>{hoveredEffortDay.effortUnit}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })() : (
                    <div style={{ fontSize: 11.5, color: 'rgba(255,253,246,0.40)', lineHeight: 1.45 }}>{hoveredEffortDay.note}</div>
                  )}
                  {hoveredEffortDay.active && (
                    <div style={visionStyles.popoverNote}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,253,246,0.30)', display: 'block', marginBottom: 4 }}>Note</span>
                      {hoveredEffortDay.userNote
                        ? <span style={{ fontSize: 12, lineHeight: 1.45 }}>{hoveredEffortDay.userNote}</span>
                        : <span style={{ color: 'rgba(255,253,246,0.28)', fontStyle: 'italic', fontSize: 12 }}>Aucune note enregistrée</span>
                      }
                    </div>
                  )}
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
