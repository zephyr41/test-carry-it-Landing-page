// CarryIT — Bloc Vision: KPI global + Objectif SMART
// 1:1 reuse of the original dashboard.html design.
// Exports: BlocVision, KPICard, SmartCard

const KPICard = ({ kpiData, onAddMeasure }) => {
  const measures = kpiData.measures || [];
  const target = kpiData.target || 400;
  const W = 760, H = 280;
  const padL = 38, padR = 24, padT = 16, padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxV = Math.max(...measures.map(m => m.value), target * 0.35, 10);
  const yTicks = 5;
  const tickStep = Math.ceil(maxV / yTicks / 5) * 5 || 1;

  // x positions: spread the actual measures over 60% of the chart, leaving 40% for projection
  const projRatio = 0.62;
  const xFor = (i, n) => padL + (i / Math.max(1, n - 1)) * (plotW * projRatio);
  const yFor = (v) => padT + plotH - (v / (tickStep * yTicks)) * plotH;

  const linePoints = measures.map((m, i) => `${xFor(i, measures.length)},${yFor(m.value)}`).join(' ');

  const lastX = measures.length > 0 ? xFor(measures.length - 1, measures.length) : padL;
  const lastY = measures.length > 0 ? yFor(measures[measures.length - 1].value) : yFor(0);

  // Projection: dashed line from last point to target at the right edge
  const targetY = yFor(Math.min(target, tickStep * yTicks));

  const kpiCardStyles = {
    card: {
      background: '#111112', border: '1px solid rgba(255,253,246,0.08)',
      borderRadius: 10, padding: '20px 24px',
      display: 'flex', flexDirection: 'column',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      marginBottom: 20, gap: 16,
    },
    headerLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
    label: {
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.14em', color: '#929292',
      whiteSpace: 'nowrap',
    },
    desc: { fontSize: 13, color: '#FFFDF6', fontWeight: 400 },
    addBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '9px 14px', borderRadius: 8,
      background: '#EE4408', color: '#FFFDF6', border: 'none',
      fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'inherit', whiteSpace: 'nowrap',
      transition: 'background 150ms ease',
    },
    chartWrap: {
      flex: 1, minHeight: 280,
      borderTop: '1px solid rgba(255,253,246,0.06)',
      paddingTop: 4, marginTop: 4,
    },
  };

  return (
    <div style={kpiCardStyles.card}>
      <div style={kpiCardStyles.header}>
        <div style={kpiCardStyles.headerLeft}>
          <span style={kpiCardStyles.label}>Évolution · KPI</span>
          <span style={kpiCardStyles.desc}>{kpiData.label}</span>
        </div>
        <button style={kpiCardStyles.addBtn} onClick={onAddMeasure}>
          + Ajouter une mesure
        </button>
      </div>
      <div style={kpiCardStyles.chartWrap}>
        <svg width="100%" height="280" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          {/* Y-axis grid lines + labels */}
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const v = tickStep * i;
            const y = yFor(v);
            return (
              <g key={i}>
                <line x1={padL} y1={y} x2={W - padR} y2={y}
                      stroke="rgba(255,253,246,0.05)" strokeWidth="1" />
                <text x={padL - 8} y={y + 3} textAnchor="end"
                      fontSize="10" fill="#666"
                      fontFamily="'DM Sans', sans-serif">
                  {v}
                </text>
              </g>
            );
          })}

          {/* X-axis date labels under the measure points */}
          {measures.map((m, i) => {
            if (measures.length > 6 && i % 2 !== 0 && i !== measures.length - 1) return null;
            const x = xFor(i, measures.length);
            return (
              <text key={i} x={x} y={H - 10}
                    textAnchor="middle" fontSize="10" fill="#666"
                    fontFamily="'DM Sans', sans-serif">
                {m.date.slice(0, 5)}
              </text>
            );
          })}

          {/* Dotted projection from last point to target */}
          {measures.length > 0 && (
            <line x1={lastX} y1={lastY} x2={W - padR} y2={targetY}
                  stroke="#EE4408" strokeWidth="1.5" strokeDasharray="2 4"
                  opacity="0.45" strokeLinecap="round" />
          )}

          {/* Target horizontal indicator at right */}
          <line x1={W - padR} y1={targetY - 6} x2={W - padR} y2={targetY + 6}
                stroke="#EE4408" strokeWidth="2" opacity="0.55" />

          {/* Main polyline */}
          {measures.length > 1 && (
            <polyline points={linePoints} fill="none"
                      stroke="#EE4408" strokeWidth="2.25"
                      strokeLinejoin="round" strokeLinecap="round" />
          )}

          {/* Dot markers */}
          {measures.map((m, i) => {
            const x = xFor(i, measures.length);
            const y = yFor(m.value);
            const isLast = i === measures.length - 1;
            return (
              <circle key={i} cx={x} cy={y}
                      r={isLast ? 4.5 : 3} fill="#EE4408"
                      stroke={isLast ? "#111112" : "none"} strokeWidth={isLast ? 2.5 : 0} />
            );
          })}

          {/* Last value chip */}
          {measures.length > 0 && (
            <g transform={`translate(${lastX + 10}, ${lastY - 14})`}>
              <rect x="0" y="0" width="42" height="22" rx="4" fill="#EE4408" />
              <text x="21" y="15" textAnchor="middle" fontSize="12" fontWeight="700"
                    fill="#FFFDF6" fontFamily="'DM Sans', sans-serif">
                {measures[measures.length - 1].value}
              </text>
            </g>
          )}

          {/* Target chip at right */}
          <g transform={`translate(${W - padR - 56}, ${targetY - 28})`}>
            <rect x="0" y="0" width="52" height="20" rx="4"
                  fill="none" stroke="rgba(238,68,8,0.55)" strokeWidth="1" />
            <text x="26" y="13.5" textAnchor="middle" fontSize="10"
                  fontWeight="600" fill="#EE4408"
                  fontFamily="'DM Sans', sans-serif" letterSpacing="0.04em">
                {target}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

const SmartCard = ({ smart, onEdit }) => {
  const sections = [
    { key: 'S', label: "L'AMBITION", value: smart.S },
    { key: 'M', label: 'LA MESURE', value: smart.M },
    { key: 'A', label: 'ATTEIGNABLE', value: smart.A },
    { key: 'R', label: 'RÉALISTE', value: smart.R },
    { key: 'T', label: "L'ÉCHÉANCE", value: smart.T },
  ];

  const smartCardStyles = {
    card: {
      background: '#111112', border: '1px solid rgba(255,253,246,0.08)',
      borderRadius: 10, padding: '20px 24px',
      display: 'flex', flexDirection: 'column',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 14,
    },
    title: {
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.14em', color: '#929292',
      whiteSpace: 'nowrap',
    },
    editBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 6,
      background: 'transparent', color: '#FFFDF6',
      border: '1px solid rgba(255,253,246,0.14)',
      fontSize: 12, fontWeight: 500, cursor: 'pointer',
      fontFamily: 'inherit',
    },
    row: {
      display: 'grid', gridTemplateColumns: '34px 1fr',
      gap: 14, alignItems: 'flex-start',
      padding: '14px 0',
    },
    sep: { height: 1, background: 'rgba(255,253,246,0.07)' },
    badge: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: 4,
      background: 'rgba(255,253,246,0.06)',
      color: '#FFFDF6', fontSize: 11, fontWeight: 700,
      border: '1px solid rgba(255,253,246,0.1)',
      marginTop: 2,
      fontFamily: 'inherit',
    },
    texts: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
    sublabel: {
      fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: '#929292',
    },
    value: {
      fontSize: 13.5, color: '#FFFDF6', lineHeight: 1.45,
      letterSpacing: '-0.005em',
    },
  };

  return (
    <div style={smartCardStyles.card}>
      <div style={smartCardStyles.header}>
        <span style={smartCardStyles.title}>Objectif SMART</span>
        <button style={smartCardStyles.editBtn} onClick={onEdit}>
          <i data-lucide="pencil" style={{width:11,height:11}}></i>
          Modifier
        </button>
      </div>
      {sections.map((sec, i) => (
        <React.Fragment key={sec.key}>
          {i > 0 && <div style={smartCardStyles.sep}></div>}
          <div style={smartCardStyles.row}>
            <span style={smartCardStyles.badge}>{sec.key}</span>
            <div style={smartCardStyles.texts}>
              <span style={smartCardStyles.sublabel}>{sec.label}</span>
              <span style={smartCardStyles.value}>{sec.value}</span>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const BlocVision = ({ kpiData, smart, onAddMeasure, onEditSmart }) => {
  const blocStyles = {
    section: { marginBottom: 32 },
    sectionLabel: {
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.16em', color: '#929292', marginBottom: 18,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
      gap: 18,
      alignItems: 'start',
    },
  };

  return (
    <div style={blocStyles.section}>
      <div style={blocStyles.sectionLabel}>Vision · Long terme</div>
      <div style={blocStyles.grid}>
        <KPICard kpiData={kpiData} onAddMeasure={onAddMeasure} />
        <SmartCard smart={smart} onEdit={onEditSmart} />
      </div>
    </div>
  );
};

Object.assign(window, { BlocVision, KPICard, SmartCard });
