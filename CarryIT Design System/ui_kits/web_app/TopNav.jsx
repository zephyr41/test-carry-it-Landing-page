// CarryIT — Top navigation
// 1:1 with dashboard.css (.dashboard-navbar): 2 rows, brand + sync on top, tabs below.
// Active state = white text + white underline (NOT orange).
// Exports: TopNav

const TopNav = ({ activeView, onChange }) => {
  const tabs = [
    {
      id: 'vision',
      label: 'Vision · Long terme',
      // grid icon
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 19V5M4 19h16M9 16V9M14 16V7M19 16v-4"/>
        </svg>
      ),
    },
    {
      id: 'jalons',
      label: 'Jalons',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 2L4 9v11h5v-7h6v7h5V9z"/>
        </svg>
      ),
    },
    {
      id: 'todo',
      label: 'To-do list',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 11l3 3L22 4"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
  ];

  const navStyles = {
    nav: {
      position: 'sticky', top: 0, zIndex: 20,
      minHeight: 99, height: 99,
      background: 'rgba(15,16,19,0.96)',
      borderBottom: '1px solid rgba(255,253,246,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column',
    },
    topRow: {
      height: 56, padding: '0 32px',
      display: 'flex', alignItems: 'center', gap: 24,
      flex: '0 0 56px',
    },
    left: {
      display: 'flex', alignItems: 'center', gap: 16,
      minWidth: 0, flex: 1,
    },
    brand: {
      display: 'flex', alignItems: 'center', gap: 9,
      flex: '0 0 auto', textDecoration: 'none',
      color: 'rgba(255,253,246,0.94)',
    },
    logo: { width: 24, height: 24, objectFit: 'contain', flexShrink: 0 },
    brandName: {
      fontFamily: '"Rifton", "Inter", system-ui, -apple-system, sans-serif',
      fontSize: 18, fontWeight: 400,
      letterSpacing: 0, lineHeight: 1,
      textTransform: 'uppercase',
      color: 'rgba(255,253,246,0.94)',
    },
    divider: {
      color: 'rgba(255,253,246,0.20)',
      fontSize: 18, fontWeight: 300,
    },
    dropdownTrigger: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 30, maxWidth: 220, padding: '5px 8px',
      border: 0, background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 14, fontWeight: 600,
      borderRadius: 7, cursor: 'pointer',
      fontFamily: 'inherit',
    },
    initial: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flex: '0 0 auto',
      width: 22, height: 22, borderRadius: 6,
      background: '#FFFDF6', color: '#080809',
      fontSize: 13, fontWeight: 700,
    },
    projectLabel: {
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    right: {
      display: 'flex', alignItems: 'center', gap: 12,
    },
    syncBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      minHeight: 34, padding: '0 14px',
      background: 'transparent',
      border: '1px solid rgba(255,253,246,0.14)',
      borderRadius: 7,
      color: 'rgba(255,253,246,0.72)',
      fontSize: 12.5, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'all 150ms ease',
    },
    avatar: {
      width: 30, height: 30, borderRadius: '50%',
      background: '#1A1A1C',
      border: '1px solid rgba(255,253,246,0.14)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12.5, fontWeight: 600, color: '#FFFDF6',
    },
    tabsRow: {
      height: 42, padding: '0 32px',
      display: 'flex', alignItems: 'stretch', gap: 32,
      flex: '0 0 42px',
    },
    tab: (active) => ({
      height: 42,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: 0,
      background: 'transparent',
      border: 0,
      borderBottom: active
        ? '2px solid rgba(255,253,246,0.94)'
        : '2px solid transparent',
      color: active ? 'rgba(255,253,246,0.94)' : 'rgba(255,253,246,0.52)',
      fontSize: 14, fontWeight: 600,
      letterSpacing: 0, cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      transition: 'color 150ms ease, border-color 150ms ease',
    }),
    tabIcon: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 16, height: 16,
    },
  };

  return (
    <nav className="dashboard-topnav" style={navStyles.nav}>
      <style>{`
        @media (max-width: 720px) {
          .dashboard-topnav {
            min-height: 99px !important;
            height: 99px !important;
          }
          .dashboard-topnav-row {
            padding: 0 16px !important;
            gap: 10px !important;
          }
          .dashboard-topnav-left {
            gap: 8px !important;
          }
          .dashboard-topnav-divider {
            display: none !important;
          }
          .dashboard-topnav-brand {
            gap: 7px !important;
          }
          .dashboard-topnav-brand-name {
            font-size: 16px !important;
          }
          .dashboard-topnav-project {
            max-width: 132px !important;
            min-width: 0 !important;
            padding: 5px 6px !important;
          }
          .dashboard-topnav-right {
            gap: 7px !important;
            flex: 0 0 auto !important;
          }
          .dashboard-topnav-sync {
            width: 34px !important;
            min-width: 34px !important;
            padding: 0 !important;
            justify-content: center !important;
          }
          .dashboard-topnav-sync-label {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
          }
          .dashboard-topnav-tabs {
            padding: 0 16px !important;
            gap: 24px !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
          }
          .dashboard-topnav-tabs::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>
      <div className="dashboard-topnav-row" style={navStyles.topRow}>
        <div className="dashboard-topnav-left" style={navStyles.left}>
          <a className="dashboard-topnav-brand" href="#" style={navStyles.brand}>
            <img src="../../assets/logo.png" alt="" style={navStyles.logo} aria-hidden="true" />
            <span className="dashboard-topnav-brand-name" style={navStyles.brandName}>CARRY IT</span>
          </a>
          <span className="dashboard-topnav-divider" style={navStyles.divider} aria-hidden="true">/</span>
          <button className="dashboard-topnav-project" style={navStyles.dropdownTrigger}>
            <span style={navStyles.initial}>L</span>
            <span style={navStyles.projectLabel}>Lancer un SaaS B2B</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                 stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 5.5L7 8.5L10 5.5"/>
            </svg>
          </button>
        </div>
        <div className="dashboard-topnav-right" style={navStyles.right}>
          <button className="dashboard-topnav-sync" style={navStyles.syncBtn} aria-label="Synchroniser">
            <svg width="14" height="14" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span className="dashboard-topnav-sync-label">Synchroniser</span>
          </button>
          <div style={navStyles.avatar}>A</div>
        </div>
      </div>

      <div className="dashboard-topnav-tabs" style={navStyles.tabsRow} role="tablist">
        {tabs.map(t => {
          const active = activeView === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              style={navStyles.tab(active)}
              onClick={() => onChange(t.id)}
              data-screen-label={t.label}
            >
              <span style={navStyles.tabIcon}>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export { TopNav };
Object.assign(window, { TopNav });
