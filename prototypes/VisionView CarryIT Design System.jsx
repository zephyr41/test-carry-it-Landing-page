// CarryIT — Vision long terme view
// Eyebrow + KPI card + SMART card — reuses original BlocVision layout
// Exports: VisionView

const VisionView = ({ kpiData, smart, jalons, onAddMeasure, onEditSmart, density = 'comfort' }) => {
  const compact = density === 'compact';

  // Find the active (current) jalon for the small footer block
  const activeJalon = jalons.find(j => !j.done);

  const visionStyles = {
    page: {
      maxWidth: 1280, margin: '0 auto',
      padding: compact ? '28px 32px 64px' : '40px 32px 96px',
    },
    eyebrow: {
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.16em', color: '#929292',
      marginBottom: 18,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
      gap: 18,
      alignItems: 'start',
    },
    eyebrow2: {
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.16em', color: '#929292',
      marginTop: 48, marginBottom: 18,
    },
    activeJalonCard: {
      background: '#111112',
      border: '1px solid rgba(255,253,246,0.08)',
      borderRadius: 8,
      padding: '18px 22px',
      display: 'flex', alignItems: 'center', gap: 20,
    },
    pos: {
      fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#929292', marginBottom: 4,
    },
    activeTitle: {
      fontSize: 16, fontWeight: 600, color: '#FFFDF6',
      letterSpacing: '-0.01em',
    },
    activeDate: { fontSize: 12.5, color: '#929292', marginTop: 2 },
    activeStatus: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 9999,
      background: 'rgba(238,68,8,0.1)', color: '#EE4408',
      fontSize: 11.5, fontWeight: 500,
      whiteSpace: 'nowrap',
    },
    activeStatusDot: { width: 5, height: 5, borderRadius: '50%', background: '#EE4408' },
    activeArrow: {
      marginLeft: 'auto',
      color: '#929292', background: 'none', border: 'none',
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12.5, fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <div style={visionStyles.page} data-screen-label="01 Vision long terme">
      <div style={visionStyles.eyebrow}>Vision · Long terme</div>
      <div style={visionStyles.grid}>
        <KPICard kpiData={kpiData} onAddMeasure={onAddMeasure} />
        <SmartCard smart={smart} onEdit={onEditSmart} />
      </div>

      {activeJalon && (
        <>
          <div style={visionStyles.eyebrow2}>Exécution · Jalon en cours</div>
          <div style={visionStyles.activeJalonCard}>
            <div>
              <div style={visionStyles.pos}>{activeJalon.month} · Jalon en cours</div>
              <div style={visionStyles.activeTitle}>{activeJalon.title}</div>
              <div style={visionStyles.activeDate}>{activeJalon.date}</div>
            </div>
            <div style={visionStyles.activeStatus}>
              <span style={visionStyles.activeStatusDot}></span>
              En cours
            </div>
            <button style={visionStyles.activeArrow}>
              Voir le jalon
              <i data-lucide="arrow-right" style={{width:13,height:13}}></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

Object.assign(window, { VisionView });
