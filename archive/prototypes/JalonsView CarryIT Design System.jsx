// CarryIT — Jalons view: vertical timeline rail + jalon detail
// Clean DM Sans typography, no Rifton on titles.
// Exports: JalonsView

const JalonRailItem = ({ jalon, index, total, active, onClick, status }) => {
  const isLast = index === total - 1;

  const statusMap = {
    done: { dot: '#0A2A53', dotInner: '#FFFDF6', line: 'rgba(10,42,83,0.55)', dateColor: '#7aa8d8' },
    active: { dot: '#EE4408', dotInner: '#FFFDF6', line: 'rgba(238,68,8,0.55)', dateColor: '#EE4408' },
    upcoming: { dot: 'transparent', dotInner: '#929292', line: 'rgba(255,253,246,0.1)', dateColor: '#929292' },
  };
  const conf = statusMap[status];

  // Split date for the "2026 AVR" style label
  const dateParts = (jalon.date || '').split(' ');
  const monthShort = dateParts[0] || jalon.date;
  const year = dateParts[1] || '';

  const railStyles = {
    item: {
      display: 'grid',
      gridTemplateColumns: '64px 28px 1fr',
      gap: 14,
      cursor: 'pointer',
      paddingBottom: 28,
      position: 'relative',
      alignItems: 'start',
    },
    dateCol: {
      paddingTop: 1,
      textAlign: 'right',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      gap: 2,
    },
    year: {
      fontSize: 11.5, fontWeight: 600,
      color: conf.dateColor,
      letterSpacing: '0.04em',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    },
    month: {
      fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: status === 'upcoming' ? '#666' : conf.dateColor,
      opacity: status === 'upcoming' ? 1 : 0.85,
    },
    dotCol: {
      position: 'relative',
      width: 28, height: 28,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    },
    connector: {
      position: 'absolute',
      top: 24, bottom: -8, left: '50%',
      width: 1.5,
      background: conf.line,
      transform: 'translateX(-50%)',
    },
    dot: {
      width: 22, height: 22, borderRadius: '50%',
      background: conf.dot,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: status === 'upcoming' ? '1.5px solid rgba(255,253,246,0.2)' : 'none',
      boxShadow: status === 'active' && active
        ? '0 0 0 5px rgba(238,68,8,0.18)'
        : status === 'active'
        ? '0 0 0 3px rgba(238,68,8,0.1)'
        : 'none',
      transition: 'box-shadow 220ms cubic-bezier(0.16,1,0.3,1)',
      position: 'relative', zIndex: 1,
      flexShrink: 0,
      color: conf.dotInner,
    },
    body: {
      paddingTop: 1,
      paddingLeft: 4,
      paddingRight: 8,
      paddingBottom: 4,
      borderRadius: 6,
      background: active ? 'rgba(255,253,246,0.04)' : 'transparent',
      marginLeft: -4, marginRight: -8,
      transition: 'background 180ms ease',
    },
    monthLabel: {
      fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#666',
      marginBottom: 2, fontFamily: 'inherit',
    },
    title: {
      fontSize: 13.5, fontWeight: active ? 600 : 500,
      color: status === 'upcoming' ? '#929292' : '#FFFDF6',
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
      marginBottom: 3,
    },
    counter: {
      fontSize: 10.5, color: '#666',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    },
  };

  return (
    <div style={railStyles.item} onClick={onClick}>
      <div style={railStyles.dateCol}>
        <span style={railStyles.year}>{year}</span>
        <span style={railStyles.month}>{monthShort.toUpperCase()}</span>
      </div>
      <div style={railStyles.dotCol}>
        {!isLast && <div style={railStyles.connector}></div>}
        <div style={railStyles.dot}>
          {status === 'done' && (
            <i data-lucide="check" style={{width:12,height:12,strokeWidth:3}}></i>
          )}
        </div>
      </div>
      <div style={railStyles.body}>
        <div style={railStyles.monthLabel}>{jalon.month}</div>
        <div style={railStyles.title}>{jalon.title}</div>
        <div style={railStyles.counter}>Jalon {index + 1}/{total}</div>
      </div>
    </div>
  );
};

const JalonDetail = ({ jalon, index, total, status, onValidate, onUpdateKPI, onAddKPI, onAddMeasure }) => {
  if (!jalon) return null;

  const statusConf = {
    done: { bg: 'rgba(10,42,83,0.25)', color: '#7aa8d8', border: 'rgba(10,42,83,0.55)', label: 'Terminé', dot: '#7aa8d8' },
    active: { bg: 'rgba(238,68,8,0.1)', color: '#EE4408', border: 'rgba(238,68,8,0.35)', label: 'En cours', dot: '#EE4408' },
    upcoming: { bg: 'rgba(255,253,246,0.04)', color: '#929292', border: 'rgba(255,253,246,0.1)', label: 'À venir', dot: '#929292' },
  }[status] || {};

  const doneTasks = (jalon.tasks || []).filter(t => t.done).length;
  const totalTasks = (jalon.tasks || []).length;
  const taskPct = totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) : 0;

  const detailStyles = {
    wrap: {
      background: '#111112',
      border: '1px solid rgba(255,253,246,0.08)',
      borderRadius: 10,
      padding: '28px 32px 24px',
    },
    posRow: {
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#929292',
      marginBottom: 14,
    },
    posBadge: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '3px 9px', borderRadius: 4,
      background: 'rgba(255,253,246,0.05)',
      border: '1px solid rgba(255,253,246,0.1)',
      color: '#FFFDF6', fontSize: 10.5,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      letterSpacing: '0.03em',
    },
    statusChip: {
      marginLeft: 'auto',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 9999,
      background: statusConf.bg, color: statusConf.color,
      border: `1px solid ${statusConf.border}`,
      fontSize: 11.5, fontWeight: 500, letterSpacing: 0,
      textTransform: 'none',
    },
    statusDot: { width: 6, height: 6, borderRadius: '50%', background: statusConf.dot },
    title: {
      fontFamily: 'inherit',
      fontSize: 26, fontWeight: 700, color: '#FFFDF6',
      letterSpacing: '-0.02em', lineHeight: 1.15,
      marginBottom: 8,
    },
    date: { fontSize: 13.5, color: '#929292', marginBottom: 24 },
    sep: { height: 1, background: 'rgba(255,253,246,0.07)', margin: '0 0 22px' },
    blockLabel: {
      fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: '#929292',
      marginBottom: 10,
    },
    validation: {
      fontSize: 14.5, color: '#FFFDF6', lineHeight: 1.55,
      marginBottom: 28, fontWeight: 400,
      maxWidth: 640,
    },
    kpiList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 14, marginBottom: 28,
    },
    taskProgressWrap: {
      background: 'rgba(255,253,246,0.025)',
      border: '1px solid rgba(255,253,246,0.06)',
      borderRadius: 10,
      padding: '14px 18px',
      marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 18,
    },
    taskCount: {
      fontSize: 22, fontWeight: 700, color: '#FFFDF6',
      letterSpacing: '-0.02em', fontFamily: 'inherit',
      minWidth: 50,
    },
    taskCountSub: { fontSize: 11, color: '#929292', marginTop: 2 },
    taskBarWrap: { flex: 1 },
    taskBar: { height: 5, background: 'rgba(255,253,246,0.06)', borderRadius: 3, overflow: 'hidden' },
    taskBarFill: (p) => ({
      height: '100%', width: `${p}%`,
      background: status === 'done' ? '#0A2A53' : '#404025',
      borderRadius: 3,
      transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
    }),
    taskBarLabel: { fontSize: 11.5, color: '#929292', marginTop: 5 },
    actions: {
      display: 'flex', gap: 10, alignItems: 'center',
      paddingTop: 18,
      borderTop: '1px solid rgba(255,253,246,0.07)',
    },
    primaryBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '10px 18px', borderRadius: 8,
      background: status === 'done'
        ? 'rgba(10,42,83,0.5)'
        : '#0A2A53',
      color: status === 'done' ? '#7aa8d8' : '#FFFDF6',
      border: status === 'done' ? '1px solid rgba(10,42,83,0.7)' : 'none',
      fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'background 150ms ease',
    },
    ghostBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '10px 14px', borderRadius: 8,
      background: 'transparent', color: '#929292',
      border: '1px solid rgba(255,253,246,0.1)',
      fontSize: 13, fontWeight: 500, cursor: 'pointer',
      fontFamily: 'inherit',
    },
  };

  return (
    <div style={detailStyles.wrap}>
      <div style={detailStyles.posRow}>
        <span>Jalon {index + 1}/{total}</span>
        <span style={detailStyles.posBadge}>{jalon.month}</span>
        <span style={detailStyles.statusChip}>
          <span style={detailStyles.statusDot}></span>
          {statusConf.label}
        </span>
      </div>

      <h2 style={detailStyles.title}>{jalon.title}</h2>
      <div style={detailStyles.date}>Échéance · {jalon.date}</div>

      <div style={detailStyles.sep}></div>

      <div style={detailStyles.blockLabel}>Critère de validation</div>
      <p style={detailStyles.validation}>{jalon.validation}</p>

      <div style={detailStyles.blockLabel}>KPI de jalon</div>
      <div style={detailStyles.kpiList}>
        {(jalon.kpis && jalon.kpis.length > 0) ? (
          jalon.kpis.map((kpi, i) => (
            <JalonKPICard
              key={i}
              kpi={kpi}
              onAddMeasure={onAddMeasure}
              onUpdate={(next) => onUpdateKPI && onUpdateKPI(jalon.id, i, next)}
            />
          ))
        ) : (
          <KPIEmptyState
            jalon={jalon}
            onCreate={(type) => onAddKPI && onAddKPI(jalon.id, type)}
          />
        )}
        {jalon.kpis && jalon.kpis.length === 1 && (
          <button
            onClick={() => onAddKPI && onAddKPI(jalon.id, jalon.kpis[0].type === 'leading' ? 'lagging' : 'leading')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              minHeight: 120,
              padding: 16, borderRadius: 12,
              border: '1px dashed rgba(255,253,246,0.14)',
              background: 'transparent',
              color: 'rgba(255,253,246,0.5)',
              fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'border-color 150ms ease, color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,253,246,0.32)'; e.currentTarget.style.color = '#FFFDF6'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,253,246,0.14)'; e.currentTarget.style.color = 'rgba(255,253,246,0.5)'; }}
          >
            <i data-lucide="plus" style={{width:14,height:14}}></i>
            Ajouter un 2<sup>e</sup> KPI ({jalon.kpis[0].type === 'leading' ? 'indicateur de résultat' : "indicateur d'avancée"})
          </button>
        )}
      </div>

      <div style={detailStyles.blockLabel}>Avancement des tâches</div>
      <div style={detailStyles.taskProgressWrap}>
        <div>
          <div style={detailStyles.taskCount}>{doneTasks}<span style={{fontSize:13,fontWeight:400,color:'#929292'}}>/{totalTasks}</span></div>
          <div style={detailStyles.taskCountSub}>tâches</div>
        </div>
        <div style={detailStyles.taskBarWrap}>
          <div style={detailStyles.taskBar}>
            <div style={detailStyles.taskBarFill(taskPct)}></div>
          </div>
          <div style={detailStyles.taskBarLabel}>{taskPct}% complétées</div>
        </div>
      </div>

      <div style={detailStyles.actions}>
        <button
          style={detailStyles.primaryBtn}
          onClick={onValidate}
          disabled={status === 'done'}
        >
          <i data-lucide={status === 'done' ? 'check-circle-2' : 'check-circle'} style={{width:15,height:15}}></i>
          {status === 'done' ? 'Jalon validé' : 'Valider ce jalon'}
        </button>
        <button style={detailStyles.ghostBtn}>
          <i data-lucide="pencil" style={{width:12,height:12}}></i>
          Modifier
        </button>
        <button style={{...detailStyles.ghostBtn, marginLeft: 'auto'}}>
          <i data-lucide="plus" style={{width:12,height:12}}></i>
          Ajouter un KPI
        </button>
      </div>
    </div>
  );
};

const JalonsView = ({ jalons, activeJalonId, onSelectJalon, onValidate, onUpdateKPI, onAddKPI, onAddMeasure, railSide = 'left', density = 'comfort' }) => {
  const activeJalon = jalons.find(j => j.id === activeJalonId) || jalons[0];
  const activeIndex = jalons.findIndex(j => j.id === activeJalon.id);

  const currentIndex = jalons.findIndex(j => !j.done);

  const getStatus = (j, i) => {
    if (j.done) return 'done';
    if (i === currentIndex) return 'active';
    return 'upcoming';
  };

  const detailStatus = activeJalon.done
    ? 'done'
    : activeIndex === currentIndex
    ? 'active'
    : 'upcoming';

  const compact = density === 'compact';

  const viewStyles = {
    page: {
      maxWidth: 1280, margin: '0 auto',
      padding: compact ? '28px 32px 64px' : '40px 32px 96px',
    },
    eyebrow: {
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.16em', color: '#929292',
      marginBottom: 18,
    },
    pageHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      marginBottom: 28, gap: 24, flexWrap: 'wrap',
    },
    pageTitle: {
      fontFamily: 'inherit',
      fontSize: 22, fontWeight: 700, color: '#FFFDF6',
      letterSpacing: '-0.02em', lineHeight: 1.2,
    },
    pageSub: {
      fontSize: 13, color: '#929292', marginTop: 4,
    },
    headerActions: {
      display: 'flex', gap: 10, alignItems: 'center',
    },
    addBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 14px', borderRadius: 8,
      background: 'transparent', color: '#FFFDF6',
      border: '1px solid rgba(255,253,246,0.14)',
      fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
      fontFamily: 'inherit',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: railSide === 'left' ? '280px 1fr' : '1fr 280px',
      gap: 32,
      alignItems: 'start',
    },
    rail: {
      position: 'sticky', top: 84,
      paddingTop: 4,
      order: railSide === 'left' ? 0 : 1,
    },
    railHeader: {
      fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: '#929292',
      marginBottom: 22,
      paddingBottom: 12,
      borderBottom: '1px solid rgba(255,253,246,0.07)',
      display: 'flex', justifyContent: 'space-between',
    },
    railCount: {
      color: '#FFFDF6', fontWeight: 600,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    },
    railList: { display: 'flex', flexDirection: 'column' },
    addJalonRow: {
      marginTop: 4,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, color: '#929292', background: 'none',
      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      padding: '8px 8px 8px 86px',
      borderRadius: 6,
    },
  };

  return (
    <div style={viewStyles.page} data-screen-label="02 Jalons">
      <div style={viewStyles.eyebrow}>Jalons</div>

      <div style={viewStyles.pageHeader}>
        <div>
          <h1 style={viewStyles.pageTitle}>Pilotage des jalons</h1>
          <p style={viewStyles.pageSub}>
            Chaque étape mesurable vers l'objectif. Sélectionnez un jalon pour voir ses critères et ses KPI.
          </p>
        </div>
        <div style={viewStyles.headerActions}>
          <button style={viewStyles.addBtn}>
            <i data-lucide="plus" style={{width:13,height:13}}></i>
            Nouveau jalon
          </button>
        </div>
      </div>

      <div style={viewStyles.layout}>
        <aside style={viewStyles.rail}>
          <div style={viewStyles.railHeader}>
            <span>Timeline</span>
            <span style={viewStyles.railCount}>{jalons.length}</span>
          </div>
          <div style={viewStyles.railList}>
            {jalons.map((j, i) => (
              <JalonRailItem
                key={j.id}
                jalon={j}
                index={i}
                total={jalons.length}
                active={j.id === activeJalonId}
                onClick={() => onSelectJalon(j.id)}
                status={getStatus(j, i)}
              />
            ))}
            <button style={viewStyles.addJalonRow}>
              <i data-lucide="plus" style={{width:12,height:12}}></i>
              Ajouter un jalon
            </button>
          </div>
        </aside>

        <section>
          <JalonDetail
            jalon={activeJalon}
            index={activeIndex}
            total={jalons.length}
            status={detailStatus}
            onValidate={() => onValidate(activeJalon.id)}
            onUpdateKPI={onUpdateKPI}
            onAddKPI={onAddKPI}
            onAddMeasure={onAddMeasure}
          />
        </section>
      </div>
    </div>
  );
};

Object.assign(window, { JalonsView, JalonRailItem, JalonDetail });
