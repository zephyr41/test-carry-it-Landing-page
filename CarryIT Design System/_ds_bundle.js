/* @ds-bundle: {"format":3,"namespace":"CarryITDesignSystem_019df4","components":[{"name":"BlocVision","sourcePath":"ui_kits/web_app/BlocVision.jsx"},{"name":"KPICard","sourcePath":"ui_kits/web_app/BlocVision.jsx"},{"name":"SmartCard","sourcePath":"ui_kits/web_app/BlocVision.jsx"},{"name":"EspaceExecution","sourcePath":"ui_kits/web_app/EspaceExecution.jsx"},{"name":"MilestoneTab","sourcePath":"ui_kits/web_app/EspaceExecution.jsx"},{"name":"TaskRow","sourcePath":"ui_kits/web_app/EspaceExecution.jsx"},{"name":"TaskGroup","sourcePath":"ui_kits/web_app/EspaceExecution.jsx"},{"name":"KanbanColumn","sourcePath":"ui_kits/web_app/EspaceExecution.jsx"},{"name":"AddTaskRow","sourcePath":"ui_kits/web_app/EspaceExecution.jsx"},{"name":"Chevron","sourcePath":"ui_kits/web_app/EspaceExecution.jsx"},{"name":"JalonKPICard","sourcePath":"ui_kits/web_app/JalonKPICard.jsx"},{"name":"KPIEmptyState","sourcePath":"ui_kits/web_app/JalonKPICard.jsx"},{"name":"KPIHistorySheet","sourcePath":"ui_kits/web_app/JalonKPICard.jsx"},{"name":"JalonsView","sourcePath":"ui_kits/web_app/JalonsView.jsx"},{"name":"JalonRailItem","sourcePath":"ui_kits/web_app/JalonsView.jsx"},{"name":"JalonDetail","sourcePath":"ui_kits/web_app/JalonsView.jsx"},{"name":"Modals","sourcePath":"ui_kits/web_app/Modals.jsx"},{"name":"Modal","sourcePath":"ui_kits/web_app/Modals.jsx"},{"name":"AddMeasureModal","sourcePath":"ui_kits/web_app/Modals.jsx"},{"name":"EditSmartModal","sourcePath":"ui_kits/web_app/Modals.jsx"},{"name":"EditKPIModal","sourcePath":"ui_kits/web_app/Modals.jsx"},{"name":"EditJalonModal","sourcePath":"ui_kits/web_app/Modals.jsx"},{"name":"TodoView","sourcePath":"ui_kits/web_app/TodoView.jsx"},{"name":"TopNav","sourcePath":"ui_kits/web_app/TopNav.jsx"},{"name":"VisionView","sourcePath":"ui_kits/web_app/VisionView.jsx"}],"sourceHashes":{"ui_kits/web_app/BlocVision.jsx":"df7e8a82d735","ui_kits/web_app/EspaceExecution.jsx":"35211a5fbcbc","ui_kits/web_app/JalonKPICard.jsx":"26e2dd50849d","ui_kits/web_app/JalonsView.jsx":"1e14c982879a","ui_kits/web_app/Modals.jsx":"f88df2e0670c","ui_kits/web_app/TodoView.jsx":"fab8ee304937","ui_kits/web_app/TopNav.jsx":"654fa78f9115","ui_kits/web_app/VisionView.jsx":"807e9706e0d6","ui_kits/web_app/design-canvas.jsx":"bd8746af6e58","ui_kits/web_app/tweaks-panel.jsx":"82c387552588"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CarryITDesignSystem_019df4 = window.CarryITDesignSystem_019df4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/web_app/BlocVision.jsx
try { (() => {
// CarryIT — Bloc Vision: KPI global + Objectif SMART
// 1:1 reuse of the original dashboard.html design.
// Exports: BlocVision, KPICard, SmartCard

const KPICard = ({
  kpiData,
  onAddMeasure
}) => {
  const measures = kpiData.measures || [];
  const target = kpiData.target || 400;
  const W = 760,
    H = 280;
  const padL = 38,
    padR = 24,
    padT = 16,
    padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxV = Math.max(...measures.map(m => m.value), target * 0.35, 10);
  const yTicks = 5;
  const tickStep = Math.ceil(maxV / yTicks / 5) * 5 || 1;

  // x positions: spread the actual measures over 60% of the chart, leaving 40% for projection
  const projRatio = 0.62;
  const xFor = (i, n) => padL + i / Math.max(1, n - 1) * (plotW * projRatio);
  const yFor = v => padT + plotH - v / (tickStep * yTicks) * plotH;
  const linePoints = measures.map((m, i) => `${xFor(i, measures.length)},${yFor(m.value)}`).join(' ');
  const lastX = measures.length > 0 ? xFor(measures.length - 1, measures.length) : padL;
  const lastY = measures.length > 0 ? yFor(measures[measures.length - 1].value) : yFor(0);

  // Projection: dashed line from last point to target at the right edge
  const targetY = yFor(Math.min(target, tickStep * yTicks));
  const kpiCardStyles = {
    card: {
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
      gap: 16
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    },
    label: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: 'rgba(255,253,246,0.72)',
      whiteSpace: 'nowrap'
    },
    desc: {
      fontSize: 13,
      color: '#FFFDF6',
      fontWeight: 400
    },
    addBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '9px 14px',
      borderRadius: 8,
      background: '#EE4408',
      color: '#FFFDF6',
      border: 'none',
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      transition: 'background 150ms ease'
    },
    chartWrap: {
      flex: 1,
      minHeight: 280,
      borderTop: '1px solid rgba(255,253,246,0.06)',
      paddingTop: 4,
      marginTop: 4
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: kpiCardStyles.card
  }, /*#__PURE__*/React.createElement("div", {
    style: kpiCardStyles.header
  }, /*#__PURE__*/React.createElement("div", {
    style: kpiCardStyles.headerLeft
  }, /*#__PURE__*/React.createElement("span", {
    style: kpiCardStyles.label
  }, "\xC9volution \xB7 KPI"), /*#__PURE__*/React.createElement("span", {
    style: kpiCardStyles.desc
  }, kpiData.label)), /*#__PURE__*/React.createElement("button", {
    style: kpiCardStyles.addBtn,
    onClick: onAddMeasure
  }, "+ Ajouter une mesure")), /*#__PURE__*/React.createElement("div", {
    style: kpiCardStyles.chartWrap
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "280",
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "none"
  }, Array.from({
    length: yTicks + 1
  }, (_, i) => {
    const v = tickStep * i;
    const y = yFor(v);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: padL,
      y1: y,
      x2: W - padR,
      y2: y,
      stroke: "rgba(255,253,246,0.05)",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("text", {
      x: padL - 8,
      y: y + 3,
      textAnchor: "end",
      fontSize: "10",
      fill: "rgba(255,253,246,0.42)",
      fontFamily: "'DM Sans', sans-serif"
    }, v));
  }), measures.map((m, i) => {
    if (measures.length > 6 && i % 2 !== 0 && i !== measures.length - 1) return null;
    const x = xFor(i, measures.length);
    return /*#__PURE__*/React.createElement("text", {
      key: i,
      x: x,
      y: H - 10,
      textAnchor: "middle",
      fontSize: "10",
      fill: "rgba(255,253,246,0.42)",
      fontFamily: "'DM Sans', sans-serif"
    }, m.date.slice(0, 5));
  }), measures.length > 0 && /*#__PURE__*/React.createElement("line", {
    x1: lastX,
    y1: lastY,
    x2: W - padR,
    y2: targetY,
    stroke: "#EE4408",
    strokeWidth: "1.5",
    strokeDasharray: "2 4",
    opacity: "0.45",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: W - padR,
    y1: targetY - 6,
    x2: W - padR,
    y2: targetY + 6,
    stroke: "#EE4408",
    strokeWidth: "2",
    opacity: "0.55"
  }), measures.length > 1 && /*#__PURE__*/React.createElement("polyline", {
    points: linePoints,
    fill: "none",
    stroke: "#EE4408",
    strokeWidth: "2.25",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), measures.map((m, i) => {
    const x = xFor(i, measures.length);
    const y = yFor(m.value);
    const isLast = i === measures.length - 1;
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: x,
      cy: y,
      r: isLast ? 4.5 : 3,
      fill: "#EE4408",
      stroke: isLast ? "#111111" : "none",
      strokeWidth: isLast ? 2.5 : 0
    });
  }), measures.length > 0 && /*#__PURE__*/React.createElement("g", {
    transform: `translate(${lastX + 10}, ${lastY - 14})`
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "42",
    height: "22",
    rx: "4",
    fill: "#EE4408"
  }), /*#__PURE__*/React.createElement("text", {
    x: "21",
    y: "15",
    textAnchor: "middle",
    fontSize: "12",
    fontWeight: "700",
    fill: "#FFFDF6",
    fontFamily: "'DM Sans', sans-serif"
  }, measures[measures.length - 1].value)), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${W - padR - 56}, ${targetY - 28})`
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "52",
    height: "20",
    rx: "4",
    fill: "none",
    stroke: "rgba(238,68,8,0.55)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: "26",
    y: "13.5",
    textAnchor: "middle",
    fontSize: "10",
    fontWeight: "600",
    fill: "#EE4408",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.04em"
  }, target)))));
};
const SmartCard = ({
  smart,
  onEdit
}) => {
  const sections = [{
    key: 'S',
    label: "L'AMBITION",
    value: smart.S
  }, {
    key: 'M',
    label: 'LA MESURE',
    value: smart.M
  }, {
    key: 'A',
    label: 'ATTEIGNABLE',
    value: smart.A
  }, {
    key: 'R',
    label: 'RÉALISTE',
    value: smart.R
  }, {
    key: 'T',
    label: "L'ÉCHÉANCE",
    value: smart.T
  }];
  const smartCardStyles = {
    card: {
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    },
    title: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: 'rgba(255,253,246,0.72)',
      whiteSpace: 'nowrap'
    },
    editBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 6,
      background: 'transparent',
      color: '#FFFDF6',
      border: '1px solid rgba(255,253,246,0.14)',
      fontSize: 12,
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: 'inherit'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '34px 1fr',
      gap: 14,
      alignItems: 'flex-start',
      padding: '14px 0'
    },
    sep: {
      height: 1,
      background: 'rgba(255,253,246,0.07)'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
      height: 26,
      borderRadius: 4,
      background: 'rgba(255,253,246,0.06)',
      color: '#FFFDF6',
      fontSize: 11,
      fontWeight: 700,
      border: '1px solid rgba(255,253,246,0.1)',
      marginTop: 2,
      fontFamily: 'inherit'
    },
    texts: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0
    },
    sublabel: {
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'rgba(255,253,246,0.72)'
    },
    value: {
      fontSize: 13.5,
      color: '#FFFDF6',
      lineHeight: 1.45,
      letterSpacing: '-0.005em'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: smartCardStyles.card
  }, /*#__PURE__*/React.createElement("div", {
    style: smartCardStyles.header
  }, /*#__PURE__*/React.createElement("span", {
    style: smartCardStyles.title
  }, "Objectif SMART"), /*#__PURE__*/React.createElement("button", {
    style: smartCardStyles.editBtn,
    onClick: onEdit
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "pencil",
    style: {
      width: 11,
      height: 11
    }
  }), "Modifier")), sections.map((sec, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: sec.key
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: smartCardStyles.sep
  }), /*#__PURE__*/React.createElement("div", {
    style: smartCardStyles.row
  }, /*#__PURE__*/React.createElement("span", {
    style: smartCardStyles.badge
  }, sec.key), /*#__PURE__*/React.createElement("div", {
    style: smartCardStyles.texts
  }, /*#__PURE__*/React.createElement("span", {
    style: smartCardStyles.sublabel
  }, sec.label), /*#__PURE__*/React.createElement("span", {
    style: smartCardStyles.value
  }, sec.value))))));
};
const BlocVision = ({
  kpiData,
  smart,
  onAddMeasure,
  onEditSmart
}) => {
  const blocStyles = {
    section: {
      marginBottom: 32
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 18
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
      gap: 18,
      alignItems: 'start'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: blocStyles.section
  }, /*#__PURE__*/React.createElement("div", {
    style: blocStyles.sectionLabel
  }, "Vision \xB7 Long terme"), /*#__PURE__*/React.createElement("div", {
    style: blocStyles.grid
  }, /*#__PURE__*/React.createElement(KPICard, {
    kpiData: kpiData,
    onAddMeasure: onAddMeasure
  }), /*#__PURE__*/React.createElement(SmartCard, {
    smart: smart,
    onEdit: onEditSmart
  })));
};
Object.assign(window, {
  BlocVision,
  KPICard,
  SmartCard
});
Object.assign(__ds_scope, { BlocVision, KPICard, SmartCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/BlocVision.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/EspaceExecution.jsx
try { (() => {
// CarryIT — Espace d'Exécution / Jalon Task Block
// Strict 1:1 mapping of dashboard.html buildJalonTaskBlock + dashboard.css.
// Structure:
//   .jt-section
//     .milestone-tabs-wrap > .milestone-tabs > [.milestone-tab]
//     .criterion-card > .criterion-text > .overline + value, + .jalon-validate-btn
//     .todo-list > .task-list-surface
//       .tasks-toolbar > .task-view-toggle > 2 .task-view-btn (Liste/Board)
//       .task-group doing/todo/done — header + dropzone
// Exports: EspaceExecution

const Chevron = ({
  collapsed
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    display: 'inline-block',
    width: 0,
    height: 0,
    marginLeft: 4,
    borderTop: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderLeft: '5px solid rgba(255,253,246,0.42)',
    transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
    transition: 'transform 150ms ease',
    flexShrink: 0
  }
});
const MilestoneTab = ({
  jalon,
  index,
  active,
  onClick,
  isComplete,
  isInProgress,
  taskCount,
  doneCount
}) => {
  const dotStyle = isInProgress ? {
    background: '#EE4408'
  } : isComplete ? {
    background: '#8ea5c4'
  } : {
    background: 'rgba(255,253,246,0.18)'
  };
  const tabStyle = {
    height: 50,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 14px',
    border: 0,
    borderBottom: active ? '2px solid rgba(255,253,246,0.90)' : '2px solid transparent',
    borderRadius: 0,
    background: 'transparent',
    color: active ? 'rgba(255,253,246,0.90)' : 'rgba(255,253,246,0.43)',
    fontSize: 15,
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    transition: 'color 150ms ease, border-color 150ms ease',
    flexShrink: 0
  };
  return /*#__PURE__*/React.createElement("button", {
    style: tabStyle,
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      flexShrink: 0,
      ...dotStyle
    }
  }), /*#__PURE__*/React.createElement("span", null, jalon.title), taskCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '2px 6px',
      borderRadius: 4,
      background: active ? 'rgba(255,253,246,0.065)' : 'transparent',
      border: active ? 'none' : '1px solid rgba(255,253,246,0.12)',
      color: active ? 'rgba(255,253,246,0.54)' : 'rgba(255,253,246,0.42)',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      flexShrink: 0,
      lineHeight: 1.2
    }
  }, doneCount, "/", taskCount));
};
const TaskRow = ({
  task,
  onToggle
}) => {
  const [hover, setHover] = React.useState(false);
  const rowStyles = {
    row: {
      minHeight: 38,
      display: 'grid',
      gridTemplateColumns: '20px 38px 20px minmax(0, 1fr) 28px 28px',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,253,246,0.085)',
      background: hover ? 'rgba(255,253,246,0.032)' : 'transparent',
      transition: 'background 100ms ease'
    },
    grip: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: '100%',
      color: 'rgba(255,253,246,0.18)',
      fontSize: 13,
      cursor: 'grab',
      opacity: hover ? 1 : 0,
      transition: 'opacity 120ms',
      userSelect: 'none',
      lineHeight: 1
    },
    checkCell: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 4,
      border: task.done ? 'none' : '1.5px solid rgba(255,253,246,0.2)',
      background: task.done ? '#EE4408' : 'rgba(255,255,255,0.04)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 150ms ease, border-color 150ms ease',
      color: '#FFFDF6',
      flexShrink: 0
    },
    chevronCell: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: '100%'
    },
    name: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
      color: task.done ? 'rgba(255,253,246,0.42)' : 'rgba(255,253,246,0.82)',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.35,
      textDecoration: task.done ? 'line-through' : 'none',
      paddingRight: 16
    },
    rowActionCell: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    rowAction: {
      display: hover ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      padding: 0,
      border: 'none',
      borderRadius: 4,
      background: 'transparent',
      color: 'rgba(255,253,246,0.42)',
      cursor: 'pointer',
      lineHeight: 1
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: rowStyles.row,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement("span", {
    style: rowStyles.grip
  }, "\u22EE\u22EE"), /*#__PURE__*/React.createElement("div", {
    style: rowStyles.checkCell
  }, /*#__PURE__*/React.createElement("span", {
    style: rowStyles.checkbox,
    onClick: () => onToggle(task.id)
  }, task.done && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      lineHeight: 1
    }
  }, "\u2713"))), /*#__PURE__*/React.createElement("div", {
    style: rowStyles.chevronCell
  }), /*#__PURE__*/React.createElement("div", {
    style: rowStyles.name
  }, task.title), /*#__PURE__*/React.createElement("div", {
    style: rowStyles.rowActionCell
  }, /*#__PURE__*/React.createElement("button", {
    style: rowStyles.rowAction
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "more-horizontal",
    style: {
      width: 14,
      height: 14
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: rowStyles.rowActionCell
  }, /*#__PURE__*/React.createElement("button", {
    style: rowStyles.rowAction
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 14,
      height: 14
    }
  }))));
};
const AddTaskRow = ({
  status,
  onAdd
}) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [hover, setHover] = React.useState(false);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);
  const commit = () => {
    if (value.trim()) onAdd && onAdd(value.trim(), status);
    setValue('');
    setEditing(false);
  };
  const baseGrid = {
    display: 'grid',
    gridTemplateColumns: '20px 38px 20px minmax(0, 1fr)',
    alignItems: 'center',
    width: '100%',
    minHeight: 38,
    padding: 0,
    fontFamily: 'inherit',
    borderBottom: '1px solid rgba(255,253,246,0.085)'
  };
  if (!editing) {
    return /*#__PURE__*/React.createElement("button", {
      style: {
        ...baseGrid,
        background: hover ? 'rgba(255,253,246,0.025)' : 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(255,253,246,0.085)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 120ms ease'
      },
      onClick: () => setEditing(true),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false)
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", {
      style: {
        justifySelf: 'center',
        color: hover ? 'rgba(255,253,246,0.42)' : 'rgba(255,253,246,0.28)',
        fontSize: 16,
        lineHeight: 1,
        transition: 'color 120ms ease'
      }
    }, "+"), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: hover ? 'rgba(255,253,246,0.86)' : 'rgba(255,253,246,0.52)',
        transition: 'color 120ms ease'
      }
    }, "Ajouter une action..."));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...baseGrid,
      background: 'rgba(255,253,246,0.025)'
    }
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", {
    style: {
      justifySelf: 'center',
      color: 'rgba(255,253,246,0.86)',
      fontSize: 16,
      lineHeight: 1
    }
  }, "+"), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "text",
    value: value,
    placeholder: "Ajouter une action...",
    onChange: e => setValue(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') {
        setValue('');
        setEditing(false);
      }
    },
    onBlur: commit,
    style: {
      width: '100%',
      height: 38,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#FFFDF6',
      fontSize: 14,
      fontFamily: 'inherit'
    }
  }));
};
const TaskGroup = ({
  status,
  label,
  tasks,
  onToggle,
  onAdd,
  collapsed,
  onToggleCollapse
}) => {
  const groupColors = {
    doing: {
      headerColor: '#EE4408',
      pillBg: 'rgba(238,68,8,0.18)',
      pillColor: '#ff7948'
    },
    todo: {
      headerColor: 'rgba(255,253,246,0.68)',
      pillBg: 'rgba(255,253,246,0.075)',
      pillColor: 'rgba(255,253,246,0.72)'
    },
    done: {
      headerColor: '#54bdb5',
      pillBg: 'rgba(20,184,166,0.18)',
      pillColor: '#7ddbd4'
    }
  }[status];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleCollapse,
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 0 8px',
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      color: groupColors.headerColor,
      textTransform: 'uppercase',
      letterSpacing: 0,
      fontSize: 12,
      fontWeight: 700,
      fontFamily: 'inherit',
      marginTop: status === 'done' ? 14 : 0,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(Chevron, {
    collapsed: collapsed
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 20,
      padding: '4px 8px',
      borderRadius: 4,
      background: groupColors.pillBg,
      color: groupColors.pillColor,
      fontSize: 11,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: 0,
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'rgba(255,253,246,0.48)',
      fontSize: 12,
      fontWeight: 600
    }
  }, tasks.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: collapsed ? 'none' : 'block'
    }
  }, tasks.map(t => /*#__PURE__*/React.createElement(TaskRow, {
    key: t.id,
    task: t,
    onToggle: onToggle
  })), status !== 'done' && /*#__PURE__*/React.createElement(AddTaskRow, {
    status: status,
    onAdd: onAdd
  })));
};
const KanbanColumn = ({
  status,
  title,
  tasks,
  onToggle
}) => {
  const colPillBg = {
    doing: 'rgba(238,68,8,0.18)',
    todo: 'rgba(255,253,246,0.075)',
    done: 'rgba(20,184,166,0.18)'
  }[status];
  const colPillColor = {
    doing: '#ff7948',
    todo: 'rgba(255,253,246,0.72)',
    done: '#7ddbd4'
  }[status];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 220,
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '14px 14px 16px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 4,
      background: colPillBg,
      color: colPillColor,
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      lineHeight: 1
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 12,
      fontWeight: 600,
      color: 'rgba(255,253,246,0.48)'
    }
  }, tasks.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, tasks.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'rgba(255,253,246,0.42)',
      fontStyle: 'italic',
      padding: '6px 4px'
    }
  }, "\u2014") : tasks.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      background: '#0A0A0A',
      border: '1px solid rgba(255,253,246,0.075)',
      borderRadius: 7,
      padding: '10px 12px',
      cursor: 'pointer',
      fontSize: 13,
      color: status === 'done' ? 'rgba(255,253,246,0.42)' : 'rgba(255,253,246,0.82)',
      lineHeight: 1.4,
      textDecoration: status === 'done' ? 'line-through' : 'none'
    }
  }, t.title))), status !== 'done' && /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 10px',
      borderRadius: 6,
      border: '1px dashed rgba(255,253,246,0.12)',
      color: 'rgba(255,253,246,0.42)',
      background: 'transparent',
      fontSize: 12,
      fontFamily: 'inherit',
      cursor: 'pointer',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 11,
      height: 11
    }
  }), "Ajouter une action"));
};
const EspaceExecution = ({
  jalons,
  activeJalonId,
  onSelectJalon,
  onValidate
}) => {
  const [view, setView] = React.useState('list');
  const [tasks, setTasks] = React.useState({});
  const [collapsed, setCollapsed] = React.useState({
    doing: false,
    todo: false,
    done: true
  });
  React.useEffect(() => {
    const defaultTasks = {};
    jalons.forEach(j => {
      defaultTasks[j.id] = j.tasks || [];
    });
    setTasks(defaultTasks);
  }, [jalons]);
  const activeJalon = jalons.find(j => j.id === activeJalonId) || jalons[0];
  const activeTasks = tasks[activeJalon?.id] || [];
  const toggleTask = taskId => {
    setTasks(prev => ({
      ...prev,
      [activeJalon.id]: prev[activeJalon.id].map(t => t.id === taskId ? {
        ...t,
        done: !t.done
      } : t)
    }));
  };
  const addTask = (title, status) => {
    const newTask = {
      id: 't' + Date.now(),
      title,
      done: false,
      priority: status === 'doing' ? 'high' : undefined
    };
    setTasks(prev => ({
      ...prev,
      [activeJalon.id]: [...(prev[activeJalon.id] || []), newTask]
    }));
  };
  const getStatus = t => t.done ? 'done' : t.priority === 'high' ? 'doing' : 'todo';
  const doing = activeTasks.filter(t => getStatus(t) === 'doing');
  const todo = activeTasks.filter(t => getStatus(t) === 'todo');
  const done = activeTasks.filter(t => getStatus(t) === 'done');
  const sectionStyles = {
    wrap: {
      // .jt-section
    },
    tabsWrap: {
      borderBottom: '1px solid rgba(255,253,246,0.12)',
      overflowX: 'auto',
      marginBottom: 20
    },
    tabs: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 0
    },
    criterion: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      padding: '16px 18px',
      marginBottom: 22,
      borderRadius: 8,
      background: 'rgba(255,253,246,0.028)',
      border: '1px solid rgba(255,253,246,0.10)',
      boxShadow: 'inset 0 1px 0 rgba(255,253,246,0.025)'
    },
    criterionBody: {
      flex: 1,
      minWidth: 0
    },
    overline: {
      display: 'block',
      marginBottom: 6,
      color: 'rgba(255,253,246,0.50)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.105em',
      textTransform: 'uppercase'
    },
    overlineContext: {
      color: 'rgba(255,253,246,0.72)'
    },
    criterionText: {
      color: 'rgba(255,253,246,0.91)',
      fontSize: 15,
      fontWeight: 550,
      lineHeight: 1.4
    },
    validateBtn: done => ({
      flex: '0 0 auto',
      height: 34,
      padding: '0 14px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      border: done ? '1px solid rgba(255,253,246,0.12)' : '1px solid rgba(238,68,8,0.55)',
      borderRadius: 999,
      background: done ? 'rgba(255,253,246,0.04)' : 'rgba(238,68,8,0.18)',
      color: done ? 'rgba(255,253,246,0.46)' : '#ff9a73',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 0,
      cursor: done ? 'default' : 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      transition: 'all 150ms ease'
    }),
    surface: {
      // .task-list-surface
      position: 'relative'
    },
    toolbar: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      gap: 24,
      marginBottom: 6
    },
    toolbarBtn: active => ({
      height: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 0 12px',
      border: 0,
      borderBottom: active ? '2px solid #FFFDF6' : '2px solid transparent',
      borderRadius: 0,
      background: 'transparent',
      color: active ? '#FFFDF6' : 'rgba(255,253,246,0.72)',
      fontSize: 14,
      fontWeight: active ? 620 : 560,
      cursor: 'pointer',
      fontFamily: 'inherit',
      lineHeight: 1,
      transition: 'color 150ms ease, border-color 150ms ease'
    }),
    toolbarIcon: active => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
      borderRadius: 5,
      background: active ? '#FFFDF6' : 'rgba(255,255,255,0.05)',
      border: active ? '1px solid #FFFDF6' : '1px solid rgba(255,253,246,0.075)',
      color: active ? '#080809' : 'rgba(255,253,246,0.72)'
    }),
    kanbanWrap: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14,
      marginTop: 8
    }
  };

  // Sort: active first, then upcoming, then completed (matches dashboard.html logic)
  const sorted = [...jalons];
  return /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.tabsWrap
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.tabs
  }, sorted.map((j, i) => {
    const linkedTasks = tasks[j.id] || j.tasks || [];
    const totalLinked = linkedTasks.length;
    const doneLinked = linkedTasks.filter(t => t.done).length;
    return /*#__PURE__*/React.createElement(MilestoneTab, {
      key: j.id,
      jalon: j,
      index: i,
      active: j.id === activeJalon?.id,
      onClick: () => onSelectJalon(j.id),
      isComplete: j.done,
      isInProgress: !j.done && j.id === activeJalon?.id,
      taskCount: totalLinked,
      doneCount: doneLinked
    });
  }))), activeJalon && /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.criterion
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.criterionBody
  }, /*#__PURE__*/React.createElement("span", {
    style: sectionStyles.overline
  }, "\uD83C\uDFAF Validation ", /*#__PURE__*/React.createElement("span", {
    style: sectionStyles.overlineContext
  }, "\xB7 ", activeJalon.title), " :"), /*#__PURE__*/React.createElement("span", {
    style: sectionStyles.criterionText
  }, activeJalon.validation || '—'))), /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.surface
  }, /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.toolbar
  }, /*#__PURE__*/React.createElement("button", {
    style: sectionStyles.toolbarBtn(view === 'list'),
    onClick: () => setView('list')
  }, /*#__PURE__*/React.createElement("span", {
    style: sectionStyles.toolbarIcon(view === 'list')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
  }))), "Liste"), /*#__PURE__*/React.createElement("button", {
    style: sectionStyles.toolbarBtn(view === 'kanban'),
    onClick: () => setView('kanban')
  }, /*#__PURE__*/React.createElement("span", {
    style: sectionStyles.toolbarIcon(view === 'kanban')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 5h6v14H4zM14 5h6v8h-6zM14 17h6v2h-6z"
  }))), "Board")), view === 'list' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TaskGroup, {
    status: "doing",
    label: "En cours",
    tasks: doing,
    onToggle: toggleTask,
    onAdd: addTask,
    collapsed: collapsed.doing,
    onToggleCollapse: () => setCollapsed(p => ({
      ...p,
      doing: !p.doing
    }))
  }), /*#__PURE__*/React.createElement(TaskGroup, {
    status: "todo",
    label: "\xC0 faire",
    tasks: todo,
    onToggle: toggleTask,
    onAdd: addTask,
    collapsed: collapsed.todo,
    onToggleCollapse: () => setCollapsed(p => ({
      ...p,
      todo: !p.todo
    }))
  }), /*#__PURE__*/React.createElement(TaskGroup, {
    status: "done",
    label: "Termin\xE9es",
    tasks: done,
    onToggle: toggleTask,
    collapsed: collapsed.done,
    onToggleCollapse: () => setCollapsed(p => ({
      ...p,
      done: !p.done
    }))
  })) : /*#__PURE__*/React.createElement("div", {
    style: sectionStyles.kanbanWrap
  }, /*#__PURE__*/React.createElement(KanbanColumn, {
    status: "doing",
    title: "En cours",
    tasks: doing,
    onToggle: toggleTask
  }), /*#__PURE__*/React.createElement(KanbanColumn, {
    status: "todo",
    title: "\xC0 faire",
    tasks: todo,
    onToggle: toggleTask
  }), /*#__PURE__*/React.createElement(KanbanColumn, {
    status: "done",
    title: "Termin\xE9",
    tasks: done,
    onToggle: toggleTask
  }))));
};
Object.assign(window, {
  EspaceExecution,
  MilestoneTab,
  TaskRow,
  TaskGroup,
  KanbanColumn,
  AddTaskRow,
  Chevron
});
Object.assign(__ds_scope, { EspaceExecution, MilestoneTab, TaskRow, TaskGroup, KanbanColumn, AddTaskRow, Chevron });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/EspaceExecution.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/JalonKPICard.jsx
try { (() => {
// CarryIT — KPI Card (data-grounded, per kpi.md)
// Structure (kpi.md §4): title, value, unit, frequency, type, target (opt)
// Actions (kpi.md §7) via "Modifier" button: title, value, frequency, target.
// "+ Mesure" adds a dated measurement; the value becomes the latest measure.
// Sparkline is clickable -> history sheet with the real measure list.
// Exports: JalonKPICard, KPIEmptyState, KPIHistorySheet

const KPIHistorySheet = ({
  open,
  onClose,
  kpi,
  accent,
  onDeleteMeasure
}) => {
  if (!open) return null;
  const measures = (kpi.measures || []).slice().reverse(); // newest first; original index preserved below

  const sheetStyles = {
    backdrop: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    sheet: {
      width: 'min(440px, 100%)',
      height: '100%',
      background: '#16161A',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '-24px 0 64px rgba(0,0,0,0.45)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 240ms cubic-bezier(0.16,1,0.3,1)'
    },
    head: {
      padding: '24px 28px 18px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      borderBottom: '1px solid rgba(255,253,246,0.08)'
    },
    headLeft: {
      flex: 1,
      minWidth: 0
    },
    overline: {
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: 'rgba(255,253,246,0.42)',
      textTransform: 'uppercase',
      marginBottom: 6
    },
    title: {
      fontSize: 18,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    subtitle: {
      fontSize: 12,
      color: 'rgba(255,253,246,0.72)',
      marginTop: 4
    },
    close: {
      width: 30,
      height: 30,
      borderRadius: 6,
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    body: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 0'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      gap: 16,
      alignItems: 'center',
      padding: '14px 28px',
      borderBottom: '1px solid rgba(255,253,246,0.05)'
    },
    rowDate: {
      fontSize: 13,
      color: '#FFFDF6'
    },
    rowDelta: {
      fontSize: 11.5,
      color: 'rgba(255,253,246,0.72)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    },
    rowVal: {
      fontSize: 18,
      fontWeight: 700,
      color: '#FFFDF6',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em'
    },
    rowUnit: {
      fontSize: 11,
      color: 'rgba(255,253,246,0.72)',
      marginLeft: 4,
      fontWeight: 400
    },
    rowDelBtn: {
      width: 26,
      height: 26,
      borderRadius: 6,
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,253,246,0.42)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 120ms ease, color 120ms ease'
    },
    empty: {
      padding: '48px 28px',
      fontSize: 13.5,
      color: 'rgba(255,253,246,0.72)',
      textAlign: 'center',
      lineHeight: 1.6
    }
  };

  // measures are reversed; original index = (length - 1 - i)
  const originalIndex = i => kpi.measures.length - 1 - i;
  return /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.backdrop,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`), /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.sheet,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.head
  }, /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.headLeft
  }, /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.overline
  }, "Historique des mesures"), /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.title
  }, kpi.label), /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.subtitle
  }, measures.length === 0 ? 'Aucune mesure' : `${measures.length} mesure${measures.length > 1 ? 's' : ''} enregistrée${measures.length > 1 ? 's' : ''}`)), /*#__PURE__*/React.createElement("button", {
    style: sheetStyles.close,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 16,
      height: 16
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.body
  }, measures.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: sheetStyles.empty
  }, "Aucune mesure enregistr\xE9e.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      opacity: 0.7
    }
  }, "Utilise \"+ Mesure\" pour en ajouter une.")) : measures.map((m, i) => {
    const prev = measures[i + 1];
    const delta = prev ? m.value - prev.value : null;
    const deltaLabel = delta === null ? '—' : delta > 0 ? `+${delta}` : `${delta}`;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: sheetStyles.row
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: sheetStyles.rowDate
    }, m.date), /*#__PURE__*/React.createElement("div", {
      style: sheetStyles.rowDelta
    }, deltaLabel, " vs pr\xE9c\xE9dent")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: sheetStyles.rowVal
    }, m.value), /*#__PURE__*/React.createElement("span", {
      style: sheetStyles.rowUnit
    }, kpi.unit)), /*#__PURE__*/React.createElement("button", {
      style: sheetStyles.rowDelBtn,
      title: "Supprimer cette mesure",
      onClick: () => onDeleteMeasure && onDeleteMeasure(originalIndex(i)),
      onMouseEnter: e => {
        e.currentTarget.style.background = 'rgba(255,107,86,0.1)';
        e.currentTarget.style.color = '#ff6b56';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'rgba(255,253,246,0.42)';
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      style: {
        width: 13,
        height: 13
      }
    })));
  }))));
};
const JalonKPICard = ({
  kpi,
  onAddMeasure,
  onUpdate,
  onEdit,
  onDeleteMeasure
}) => {
  const isLeading = kpi.type === 'leading';
  const accent = '#EE4408';
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const measures = kpi.measures || [];
  const hasMeasures = measures.length > 0;
  const hasTarget = typeof kpi.target === 'number' && kpi.target > 0;
  const pct = hasTarget && hasMeasures ? Math.min(100, Math.round(kpi.value / kpi.target * 100)) : null;
  const lastMeasure = hasMeasures ? measures[measures.length - 1] : null;
  const prevMeasure = measures.length >= 2 ? measures[measures.length - 2] : null;
  const delta = prevMeasure ? lastMeasure.value - prevMeasure.value : null;
  const deltaPct = prevMeasure && prevMeasure.value !== 0 ? Math.round((lastMeasure.value - prevMeasure.value) / Math.abs(prevMeasure.value) * 100) : null;
  const deltaIsUp = delta !== null && delta > 0;
  const deltaIsFlat = delta !== null && delta === 0;

  // Sparkline geometry — only drawn with >= 2 measures
  const sparkData = measures.map(m => m.value);
  const sparkW = 220,
    sparkH = 44;
  let sparkPath = '',
    sparkArea = '',
    sparkLastX = 0,
    sparkLastY = 0;
  if (sparkData.length >= 2) {
    const min = Math.min(...sparkData, hasTarget ? 0 : Math.min(...sparkData));
    const max = Math.max(...sparkData, hasTarget ? kpi.target : Math.max(...sparkData));
    const range = max - min || 1;
    const pts = sparkData.map((v, i) => {
      const x = i / (sparkData.length - 1) * sparkW;
      const y = sparkH - (v - min) / range * (sparkH - 6) - 3;
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
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      minWidth: 0,
      position: 'relative',
      overflow: 'hidden'
    },
    head: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      minHeight: 18
    },
    typeChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: 0,
      color: 'rgba(255,253,246,0.42)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    },
    typeGlyph: {
      display: 'inline-flex',
      width: 11,
      height: 11,
      alignItems: 'center',
      justifyContent: 'center'
    },
    freqChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 8px',
      borderRadius: 9999,
      background: 'rgba(255,253,246,0.04)',
      border: '1px solid rgba(255,253,246,0.08)',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 10.5,
      fontWeight: 500,
      letterSpacing: 0,
      textTransform: 'none',
      whiteSpace: 'nowrap'
    },
    title: {
      fontSize: 14,
      fontWeight: 500,
      color: 'rgba(255,253,246,0.72)',
      letterSpacing: '-0.005em',
      lineHeight: 1.35
    },
    valueRow: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    },
    valueWrap: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minWidth: 0
    },
    value: {
      fontSize: 44,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.04em',
      lineHeight: 0.95,
      fontVariantNumeric: 'tabular-nums',
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    },
    valueEmpty: {
      fontSize: 44,
      fontWeight: 700,
      color: 'rgba(255,253,246,0.18)',
      letterSpacing: '-0.04em',
      lineHeight: 0.95,
      fontVariantNumeric: 'tabular-nums'
    },
    unit: {
      fontSize: 14,
      fontWeight: 500,
      color: 'rgba(255,253,246,0.72)',
      letterSpacing: '-0.005em'
    },
    delta: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      fontWeight: 600,
      color: deltaIsFlat ? 'rgba(255,253,246,0.42)' : deltaIsUp ? '#7ED48F' : '#F47A60',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      letterSpacing: 0,
      whiteSpace: 'nowrap'
    },
    deltaSub: {
      fontSize: 11,
      color: 'rgba(255,253,246,0.42)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      marginLeft: 6,
      whiteSpace: 'nowrap'
    },
    deltaWrap: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 0,
      flexWrap: 'wrap',
      rowGap: 2
    },
    sparkWrap: {
      flex: '0 0 auto',
      minWidth: 120,
      maxWidth: 220,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: '14px 16px',
      borderRadius: 10,
      background: 'rgba(255,253,246,0.025)',
      border: '1px dashed rgba(255,253,246,0.10)'
    },
    emptyTitle: {
      fontSize: 12.5,
      fontWeight: 500,
      color: 'rgba(255,253,246,0.72)',
      lineHeight: 1.4
    },
    emptyHint: {
      fontSize: 11.5,
      color: 'rgba(255,253,246,0.42)',
      lineHeight: 1.4
    },
    progressBlock: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    },
    progressLabels: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8,
      fontSize: 11.5,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap'
    },
    progressLabelLeft: {
      color: 'rgba(255,253,246,0.42)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontSize: 10,
      fontWeight: 600
    },
    progressValue: {
      color: '#FFFDF6',
      fontWeight: 600
    },
    progressTarget: {
      color: 'rgba(255,253,246,0.42)',
      marginLeft: 4
    },
    progressBar: {
      height: 3,
      background: 'rgba(255,253,246,0.08)',
      borderRadius: 2,
      overflow: 'hidden'
    },
    progressFill: {
      width: `${pct || 0}%`,
      height: '100%',
      background: accent,
      borderRadius: 2,
      transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)'
    },
    setTargetRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 8,
      border: '1px dashed rgba(255,255,255,0.10)',
      color: 'rgba(255,253,246,0.42)',
      fontSize: 12,
      fontFamily: 'inherit',
      background: 'transparent',
      cursor: 'pointer',
      alignSelf: 'flex-start',
      transition: 'border-color 120ms cubic-bezier(0.16,1,0.3,1), color 120ms cubic-bezier(0.16,1,0.3,1)'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingTop: 14,
      borderTop: '1px solid rgba(255,253,246,0.06)',
      flexWrap: 'wrap'
    },
    meta: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12.5,
      color: 'rgba(255,253,246,0.72)',
      flex: 1,
      minWidth: 0,
      fontVariantNumeric: 'tabular-nums',
      background: 'transparent',
      border: 'none',
      padding: 0,
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'color 150ms cubic-bezier(0.16,1,0.3,1)'
    },
    metaDisabled: {
      cursor: 'default'
    },
    metaDim: {
      color: 'rgba(255,253,246,0.42)',
      fontStyle: 'italic'
    },
    editBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '6px 10px',
      borderRadius: 7,
      background: 'transparent',
      border: '1px solid rgba(255,253,246,0.14)',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 12,
      fontWeight: 500,
      fontFamily: 'inherit',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'border-color 150ms ease, color 150ms ease'
    },
    addBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '7px 12px',
      borderRadius: 7,
      background: hasMeasures ? accent : accent,
      border: 'none',
      color: '#FFFDF6',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'opacity 150ms ease'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: c.card
  }, /*#__PURE__*/React.createElement("div", {
    style: c.head
  }, /*#__PURE__*/React.createElement("span", {
    style: c.typeChip
  }, /*#__PURE__*/React.createElement("span", {
    style: c.typeGlyph
  }, isLeading ? /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 9L5 6L7 8L10 4",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 4H10V7",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "4.5",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.8",
    fill: "currentColor"
  }))), isLeading ? "Indicateur d'avancée" : "Indicateur de résultat"), /*#__PURE__*/React.createElement("span", {
    style: c.freqChip
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "repeat",
    style: {
      width: 10,
      height: 10,
      color: 'rgba(255,253,246,0.42)'
    }
  }), frequency)), /*#__PURE__*/React.createElement("div", {
    style: c.title
  }, kpi.label), /*#__PURE__*/React.createElement("div", {
    style: c.valueRow
  }, /*#__PURE__*/React.createElement("div", {
    style: c.valueWrap
  }, hasMeasures ? /*#__PURE__*/React.createElement("div", {
    style: c.value
  }, /*#__PURE__*/React.createElement("span", null, kpi.value), /*#__PURE__*/React.createElement("span", {
    style: c.unit
  }, kpi.unit)) : /*#__PURE__*/React.createElement("div", {
    style: c.value
  }, /*#__PURE__*/React.createElement("span", {
    style: c.valueEmpty
  }, "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: c.unit
  }, kpi.unit || 'à mesurer')), delta !== null && /*#__PURE__*/React.createElement("div", {
    style: c.deltaWrap
  }, /*#__PURE__*/React.createElement("span", {
    style: c.delta
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": deltaIsFlat ? 'minus' : deltaIsUp ? 'arrow-up-right' : 'arrow-down-right',
    style: {
      width: 11,
      height: 11,
      strokeWidth: 2.5
    }
  }), deltaIsUp ? '+' : '', delta, deltaPct !== null && !deltaIsFlat && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7,
      marginLeft: 4
    }
  }, "\xB7 ", deltaIsUp ? '+' : '', deltaPct, "%")), /*#__PURE__*/React.createElement("span", {
    style: c.deltaSub
  }, "vs pr\xE9c\xE9dent"))), sparkData.length >= 2 && /*#__PURE__*/React.createElement("div", {
    style: c.sparkWrap
  }, /*#__PURE__*/React.createElement("svg", {
    width: sparkW,
    height: sparkH,
    viewBox: `0 0 ${sparkW} ${sparkH}`,
    style: {
      overflow: 'visible'
    }
  }, hasTarget && (() => {
    const min = Math.min(...sparkData, 0);
    const max = Math.max(...sparkData, kpi.target);
    const range = max - min || 1;
    const targetY = sparkH - (kpi.target - min) / range * (sparkH - 6) - 3;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
      x1: "0",
      x2: sparkW,
      y1: targetY,
      y2: targetY,
      stroke: "rgba(255,253,246,0.18)",
      strokeWidth: "1",
      strokeDasharray: "2 3"
    }), /*#__PURE__*/React.createElement("text", {
      x: sparkW,
      y: targetY - 4,
      textAnchor: "end",
      fontSize: "9",
      fill: "rgba(255,253,246,0.42)",
      fontFamily: "'JetBrains Mono',monospace",
      letterSpacing: "0.04em"
    }, "cible ", kpi.target));
  })(), /*#__PURE__*/React.createElement("path", {
    d: sparkArea,
    fill: accent,
    fillOpacity: "0.08"
  }), /*#__PURE__*/React.createElement("path", {
    d: sparkPath,
    fill: "none",
    stroke: accent,
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: sparkLastX,
    cy: sparkLastY,
    r: "3",
    fill: accent
  }), /*#__PURE__*/React.createElement("circle", {
    cx: sparkLastX,
    cy: sparkLastY,
    r: "3",
    fill: "none",
    stroke: "#111111",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: sparkLastX,
    cy: sparkLastY,
    r: "3",
    fill: accent
  })))), !hasMeasures && /*#__PURE__*/React.createElement("div", {
    style: c.emptyState
  }, /*#__PURE__*/React.createElement("div", {
    style: c.emptyTitle
  }, "Aucune mesure pour ce KPI"), /*#__PURE__*/React.createElement("div", {
    style: c.emptyHint
  }, "D\xE9marre le suivi en enregistrant la premi\xE8re valeur. Tu pourras ensuite voir l'\xE9volution dans le temps.")), hasMeasures && hasTarget && /*#__PURE__*/React.createElement("div", {
    style: c.progressBlock
  }, /*#__PURE__*/React.createElement("div", {
    style: c.progressLabels
  }, /*#__PURE__*/React.createElement("span", {
    style: c.progressLabelLeft
  }, "Progression"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: c.progressValue
  }, pct, "%"), /*#__PURE__*/React.createElement("span", {
    style: c.progressTarget
  }, "\xB7 ", kpi.value, " / ", kpi.target, " ", kpi.unit))), /*#__PURE__*/React.createElement("div", {
    style: c.progressBar
  }, /*#__PURE__*/React.createElement("div", {
    style: c.progressFill
  }))), hasMeasures && !hasTarget && /*#__PURE__*/React.createElement("button", {
    style: c.setTargetRow,
    onClick: () => onEdit && onEdit(kpi),
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)';
      e.currentTarget.style.color = '#FFFDF6';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
      e.currentTarget.style.color = 'rgba(255,253,246,0.42)';
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "crosshair",
    style: {
      width: 12,
      height: 12
    }
  }), "D\xE9finir une cible"), /*#__PURE__*/React.createElement("div", {
    style: c.footer
  }, /*#__PURE__*/React.createElement("button", {
    style: lastMeasure ? c.meta : {
      ...c.meta,
      ...c.metaDisabled
    },
    onClick: lastMeasure ? () => setHistoryOpen(true) : undefined,
    disabled: !lastMeasure,
    title: lastMeasure ? "Voir l'historique" : 'Aucune mesure',
    onMouseEnter: e => {
      if (lastMeasure) e.currentTarget.style.color = '#FFFDF6';
    },
    onMouseLeave: e => {
      if (lastMeasure) e.currentTarget.style.color = 'rgba(255,253,246,0.72)';
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "calendar",
    style: {
      width: 13,
      height: 13,
      color: 'rgba(255,253,246,0.42)'
    }
  }), lastMeasure ? /*#__PURE__*/React.createElement("span", null, lastMeasure.date, " \xB7 ", measures.length, " mesure", measures.length > 1 ? 's' : '') : /*#__PURE__*/React.createElement("span", {
    style: c.metaDim
  }, "Pas encore mesur\xE9")), /*#__PURE__*/React.createElement("button", {
    style: c.editBtn,
    onClick: () => onEdit && onEdit(kpi),
    title: "Modifier le KPI",
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'rgba(255,253,246,0.42)';
      e.currentTarget.style.color = '#FFFDF6';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(255,253,246,0.14)';
      e.currentTarget.style.color = 'rgba(255,253,246,0.72)';
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "pencil",
    style: {
      width: 11,
      height: 11
    }
  }), "Modifier"), /*#__PURE__*/React.createElement("button", {
    style: c.addBtn,
    onClick: () => onAddMeasure && onAddMeasure(kpi)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 11,
      height: 11,
      strokeWidth: 2.5
    }
  }), hasMeasures ? 'Mesure' : 'Première mesure')), /*#__PURE__*/React.createElement(KPIHistorySheet, {
    open: historyOpen,
    onClose: () => setHistoryOpen(false),
    kpi: kpi,
    accent: accent,
    onDeleteMeasure: onDeleteMeasure
  }));
};
const KPIEmptyState = ({
  jalon,
  onCreate
}) => {
  const emptyStyles = {
    wrap: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 14,
      padding: '24px 24px',
      borderRadius: 12,
      border: '1px dashed rgba(255,253,246,0.12)',
      background: 'rgba(255,253,246,0.02)'
    },
    head: {
      fontSize: 13,
      color: 'rgba(255,253,246,0.72)',
      lineHeight: 1.5
    },
    headStrong: {
      color: '#FFFDF6',
      fontWeight: 600
    },
    actions: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      width: '100%'
    },
    btn: () => ({
      flex: '1 1 200px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '12px 14px',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'inherit',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'border-color 150ms cubic-bezier(0.16,1,0.3,1), background 150ms cubic-bezier(0.16,1,0.3,1)'
    }),
    btnSub: {
      display: 'block',
      marginTop: 2,
      fontSize: 11.5,
      fontWeight: 500,
      color: 'rgba(255,253,246,0.42)'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: emptyStyles.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: emptyStyles.head
  }, "Aucun KPI pour ", /*#__PURE__*/React.createElement("strong", {
    style: emptyStyles.headStrong
  }, jalon.title), ". Cr\xE9e-en jusqu'\xE0 ", /*#__PURE__*/React.createElement("strong", {
    style: emptyStyles.headStrong
  }, "2 KPI"), ", \xE0 partir du crit\xE8re de validation."), /*#__PURE__*/React.createElement("div", {
    style: emptyStyles.actions
  }, /*#__PURE__*/React.createElement("button", {
    style: emptyStyles.btn(),
    onClick: () => onCreate && onCreate('leading')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trending-up",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("span", null, "Ajouter un indicateur d'avanc\xE9e", /*#__PURE__*/React.createElement("span", {
    style: emptyStyles.btnSub
  }, "Ce que tu fais qui cr\xE9e la traction"))), /*#__PURE__*/React.createElement("button", {
    style: emptyStyles.btn(),
    onClick: () => onCreate && onCreate('lagging')
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "target",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("span", null, "Ajouter un indicateur de r\xE9sultat", /*#__PURE__*/React.createElement("span", {
    style: emptyStyles.btnSub
  }, "Le r\xE9sultat que tu vises")))));
};
Object.assign(window, {
  JalonKPICard,
  KPIEmptyState,
  KPIHistorySheet
});
Object.assign(__ds_scope, { JalonKPICard, KPIEmptyState, KPIHistorySheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/JalonKPICard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/JalonsView.jsx
try { (() => {
// CarryIT — Jalons view: vertical timeline rail + jalon detail
// Clean DM Sans typography, no Rifton on titles.
// Exports: JalonsView

const JalonRailItem = ({
  jalon,
  index,
  total,
  active,
  onClick,
  status,
  hasNext = true
}) => {
  const isLast = index === total - 1;
  const statusMap = {
    done: {
      dot: 'transparent',
      dotInner: 'rgba(255,255,255,0.6)',
      dotBorder: '1.5px solid rgba(255,255,255,0.22)',
      line: 'rgba(255,253,246,0.16)',
      dateColor: 'rgba(255,253,246,0.42)'
    },
    active: {
      dot: '#EE4408',
      dotInner: '#FFFDF6',
      dotBorder: 'none',
      line: 'rgba(255,253,246,0.10)',
      dateColor: '#FFFDF6'
    },
    upcoming: {
      dot: 'transparent',
      dotInner: 'rgba(255,253,246,0.72)',
      dotBorder: '1.5px solid rgba(255,255,255,0.12)',
      line: 'rgba(255,253,246,0.10)',
      dateColor: 'rgba(255,253,246,0.42)'
    }
  };
  const conf = statusMap[status];

  // Split date for the "2026 AVR" style label
  const dateParts = (jalon.date || '').split(' ');
  const monthShort = dateParts[0] || jalon.date;
  const year = dateParts[1] || '';
  const railStyles = {
    item: {
      display: 'grid',
      gridTemplateColumns: '52px 24px 1fr',
      gap: 12,
      cursor: 'pointer',
      paddingBottom: 28,
      position: 'relative',
      alignItems: 'start'
    },
    dateCol: {
      paddingTop: 1,
      textAlign: 'right',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 2
    },
    year: {
      fontSize: 11.5,
      fontWeight: 600,
      color: conf.dateColor,
      letterSpacing: '0.04em',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    },
    month: {
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: status === 'upcoming' ? 'rgba(255,253,246,0.42)' : conf.dateColor,
      opacity: status === 'upcoming' ? 1 : 0.85
    },
    dotCol: {
      position: 'relative',
      width: 24,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    connector: {
      // Continuous trait — positioned relative to the .item box.
      // top: 22 (just under the 20px dot, centered in 24px column)
      // bottom: 0 reaches the very bottom of the item (incl. paddingBottom),
      // which is flush with the top of the next item where its dot sits.
      position: 'absolute',
      top: 22,
      bottom: 0,
      // align horizontally to the center of the 24px dot column.
      // grid template: 52px 24px 1fr with gap 12 → center of dot col = 52 + 12 + 12 = 76
      left: 76,
      width: 1,
      background: conf.line,
      pointerEvents: 'none'
    },
    dot: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: conf.dot,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: conf.dotBorder,
      boxShadow: status === 'active' && active ? '0 0 0 5px rgba(238,68,8,0.18)' : status === 'active' ? '0 0 0 3px rgba(238,68,8,0.1)' : 'none',
      transition: 'box-shadow 220ms cubic-bezier(0.16,1,0.3,1)',
      position: 'relative',
      zIndex: 1,
      flexShrink: 0,
      color: conf.dotInner
    },
    body: {
      paddingTop: 1,
      paddingLeft: 4,
      paddingRight: 8,
      paddingBottom: 4,
      borderRadius: 6,
      background: active ? 'rgba(255,253,246,0.04)' : 'transparent',
      marginLeft: -4,
      marginRight: -8,
      transition: 'background 180ms ease'
    },
    monthLabel: {
      fontSize: 9.5,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'rgba(255,253,246,0.42)',
      marginBottom: 2,
      fontFamily: 'inherit'
    },
    title: {
      fontSize: 13.5,
      fontWeight: active ? 600 : 500,
      color: status === 'upcoming' ? 'rgba(255,253,246,0.72)' : '#FFFDF6',
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
      marginBottom: 3
    },
    counter: {
      fontSize: 10.5,
      color: 'rgba(255,253,246,0.42)',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: railStyles.item,
    onClick: onClick
  }, hasNext && /*#__PURE__*/React.createElement("div", {
    style: railStyles.connector
  }), /*#__PURE__*/React.createElement("div", {
    style: railStyles.dateCol
  }, /*#__PURE__*/React.createElement("span", {
    style: railStyles.year
  }, year), /*#__PURE__*/React.createElement("span", {
    style: railStyles.month
  }, monthShort.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: railStyles.dotCol
  }, /*#__PURE__*/React.createElement("div", {
    style: railStyles.dot
  }, status === 'done' && /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 12,
      height: 12,
      strokeWidth: 3
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: railStyles.body
  }, /*#__PURE__*/React.createElement("div", {
    style: railStyles.title
  }, jalon.title), /*#__PURE__*/React.createElement("div", {
    style: railStyles.counter
  }, "Jalon ", index + 1, "/", total)));
};
const JalonDetail = ({
  jalon,
  index,
  total,
  status,
  onValidate,
  onUpdateKPI,
  onAddKPI,
  onAddMeasure,
  onEditKPI,
  onEditJalon,
  onDeleteMeasure
}) => {
  if (!jalon) return null;
  const statusConf = {
    done: {
      color: 'rgba(255,253,246,0.72)',
      border: 'rgba(255,255,255,0.08)',
      label: 'Terminé',
      dot: 'rgba(255,255,255,0.45)'
    },
    active: {
      color: '#FFFDF6',
      border: 'rgba(255,255,255,0.12)',
      label: 'En cours',
      dot: '#EE4408'
    },
    upcoming: {
      color: 'rgba(255,253,246,0.42)',
      border: 'rgba(255,255,255,0.08)',
      label: 'À venir',
      dot: 'rgba(255,255,255,0.3)'
    }
  }[status] || {};
  const doneTasks = (jalon.tasks || []).filter(t => t.done).length;
  const totalTasks = (jalon.tasks || []).length;
  const taskPct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
  const detailStyles = {
    wrap: {
      background: 'transparent',
      padding: 0
    },
    posRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 14
    },
    posBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3px 9px',
      borderRadius: 4,
      background: 'rgba(255,253,246,0.05)',
      border: '1px solid rgba(255,253,246,0.1)',
      color: '#FFFDF6',
      fontSize: 10.5,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
      flexShrink: 0
    },
    statusChip: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '5px 12px',
      borderRadius: 9999,
      background: 'transparent',
      color: statusConf.color,
      border: `1px solid ${statusConf.border}`,
      fontSize: 11.5,
      fontWeight: 500,
      letterSpacing: 0,
      textTransform: 'none',
      whiteSpace: 'nowrap',
      flexShrink: 0
    },
    editJalonBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      color: 'rgba(255,253,246,0.42)',
      border: '1px solid rgba(255,253,246,0.10)',
      cursor: 'pointer',
      transition: 'color 150ms cubic-bezier(0.16,1,0.3,1), border-color 150ms cubic-bezier(0.16,1,0.3,1), background 150ms cubic-bezier(0.16,1,0.3,1)'
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: statusConf.dot
    },
    title: {
      fontFamily: 'inherit',
      fontSize: 26,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
      marginBottom: 8
    },
    date: {
      fontSize: 13.5,
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 24
    },
    sep: {
      height: 1,
      background: 'rgba(255,253,246,0.07)',
      margin: '0 0 22px'
    },
    blockLabel: {
      fontSize: 10.5,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 10
    },
    validation: {
      fontSize: 14.5,
      color: '#FFFDF6',
      lineHeight: 1.55,
      marginBottom: 28,
      fontWeight: 400,
      maxWidth: 640
    },
    kpiList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 14,
      marginBottom: 28
    },
    taskProgressWrap: {
      background: 'rgba(255,253,246,0.025)',
      border: '1px solid rgba(255,253,246,0.06)',
      borderRadius: 10,
      padding: '14px 18px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 18
    },
    taskCount: {
      fontSize: 22,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.02em',
      fontFamily: 'inherit',
      minWidth: 50
    },
    taskCountSub: {
      fontSize: 11,
      color: 'rgba(255,253,246,0.72)',
      marginTop: 2
    },
    taskBarWrap: {
      flex: 1
    },
    taskBar: {
      height: 5,
      background: 'rgba(255,253,246,0.06)',
      borderRadius: 3,
      overflow: 'hidden'
    },
    taskBarFill: p => ({
      height: '100%',
      width: `${p}%`,
      background: 'rgba(255,253,246,0.42)',
      borderRadius: 3,
      transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)'
    }),
    taskBarLabel: {
      fontSize: 11.5,
      color: 'rgba(255,253,246,0.72)',
      marginTop: 5
    },
    actions: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      paddingTop: 18,
      borderTop: '1px solid rgba(255,253,246,0.07)'
    },
    primaryBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '10px 18px',
      borderRadius: 8,
      background: status === 'done' ? 'rgba(255,255,255,0.06)' : '#EE4408',
      color: status === 'done' ? 'rgba(255,253,246,0.7)' : '#FFFDF6',
      border: status === 'done' ? '1px solid rgba(255,255,255,0.10)' : 'none',
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'background 150ms cubic-bezier(0.16,1,0.3,1)'
    },
    ghostBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 14px',
      borderRadius: 8,
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: detailStyles.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: detailStyles.posRow
  }, /*#__PURE__*/React.createElement("span", null, "Jalon ", index + 1, "/", total), /*#__PURE__*/React.createElement("span", {
    style: detailStyles.posBadge
  }, jalon.month), /*#__PURE__*/React.createElement("span", {
    style: detailStyles.statusChip
  }, /*#__PURE__*/React.createElement("span", {
    style: detailStyles.statusDot
  }), statusConf.label), /*#__PURE__*/React.createElement("button", {
    style: detailStyles.editJalonBtn,
    onClick: () => onEditJalon && onEditJalon(jalon),
    title: "Modifier le jalon",
    "aria-label": "Modifier le jalon",
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'rgba(255,253,246,0.28)';
      e.currentTarget.style.color = '#FFFDF6';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(255,253,246,0.10)';
      e.currentTarget.style.color = 'rgba(255,253,246,0.42)';
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "pencil",
    style: {
      width: 14,
      height: 14
    }
  }))), /*#__PURE__*/React.createElement("h2", {
    style: detailStyles.title
  }, jalon.title), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.date
  }, "\xC9ch\xE9ance \xB7 ", jalon.date), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.sep
  }), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.blockLabel
  }, "Crit\xE8re de validation"), /*#__PURE__*/React.createElement("p", {
    style: detailStyles.validation
  }, jalon.validation), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.blockLabel
  }, "KPI de jalon"), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.kpiList
  }, jalon.kpis && jalon.kpis.length > 0 ? jalon.kpis.map((kpi, i) => /*#__PURE__*/React.createElement(JalonKPICard, {
    key: i,
    kpi: kpi,
    onAddMeasure: onAddMeasure,
    onEdit: k => onEditKPI && onEditKPI(jalon.id, i, k),
    onUpdate: next => onUpdateKPI && onUpdateKPI(jalon.id, i, next),
    onDeleteMeasure: measureIdx => onDeleteMeasure && onDeleteMeasure(jalon.id, i, measureIdx)
  })) : /*#__PURE__*/React.createElement(KPIEmptyState, {
    jalon: jalon,
    onCreate: type => onAddKPI && onAddKPI(jalon.id, type)
  }), jalon.kpis && jalon.kpis.length === 1 && /*#__PURE__*/React.createElement("button", {
    onClick: () => onAddKPI && onAddKPI(jalon.id, jalon.kpis[0].type === 'leading' ? 'lagging' : 'leading'),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      minHeight: 120,
      padding: '16px 20px',
      borderRadius: 12,
      border: '1px dashed rgba(255,253,246,0.14)',
      background: 'transparent',
      color: 'rgba(255,253,246,0.42)',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'inherit',
      cursor: 'pointer',
      textAlign: 'center',
      lineHeight: 1.4,
      transition: 'border-color 150ms ease, color 150ms ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'rgba(255,253,246,0.42)';
      e.currentTarget.style.color = '#FFFDF6';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(255,253,246,0.14)';
      e.currentTarget.style.color = 'rgba(255,253,246,0.42)';
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 14,
      height: 14,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", null, "Ajouter un 2", /*#__PURE__*/React.createElement("sup", {
    style: {
      fontSize: '0.7em',
      verticalAlign: 'super',
      lineHeight: 0
    }
  }, "e"), " KPI", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11,
      marginTop: 2,
      color: 'rgba(255,253,246,0.42)'
    }
  }, jalon.kpis[0].type === 'leading' ? 'indicateur de résultat' : "indicateur d'avancée")))), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.blockLabel
  }, "Avancement des t\xE2ches"), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.taskProgressWrap
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: detailStyles.taskCount
  }, doneTasks, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 400,
      color: 'rgba(255,253,246,0.72)'
    }
  }, "/", totalTasks)), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.taskCountSub
  }, "t\xE2ches")), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.taskBarWrap
  }, /*#__PURE__*/React.createElement("div", {
    style: detailStyles.taskBar
  }, /*#__PURE__*/React.createElement("div", {
    style: detailStyles.taskBarFill(taskPct)
  })), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.taskBarLabel
  }, taskPct, "% compl\xE9t\xE9es"))), /*#__PURE__*/React.createElement("div", {
    style: detailStyles.actions
  }, /*#__PURE__*/React.createElement("button", {
    style: detailStyles.primaryBtn,
    onClick: onValidate,
    disabled: status === 'done'
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": status === 'done' ? 'check-circle-2' : 'check-circle',
    style: {
      width: 15,
      height: 15
    }
  }), status === 'done' ? 'Jalon validé' : 'Valider ce jalon')));
};
const JalonsView = ({
  jalons,
  activeJalonId,
  onSelectJalon,
  onValidate,
  onUpdateKPI,
  onAddKPI,
  onAddMeasure,
  onEditKPI,
  onEditJalon,
  onCreateJalon,
  onDeleteMeasure,
  railSide = 'left',
  density = 'comfort'
}) => {
  const activeJalon = jalons.find(j => j.id === activeJalonId) || jalons[0];
  const activeIndex = jalons.findIndex(j => j.id === activeJalon.id);
  const currentIndex = jalons.findIndex(j => !j.done);
  const getStatus = (j, i) => {
    if (j.done) return 'done';
    if (i === currentIndex) return 'active';
    return 'upcoming';
  };
  const detailStatus = activeJalon.done ? 'done' : activeIndex === currentIndex ? 'active' : 'upcoming';
  const compact = density === 'compact';
  const viewStyles = {
    page: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: compact ? '28px 32px 64px' : '40px 32px 96px'
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 18
    },
    pageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 28,
      gap: 24,
      flexWrap: 'wrap'
    },
    pageTitle: {
      fontFamily: 'inherit',
      fontSize: 22,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    },
    pageSub: {
      fontSize: 13,
      color: 'rgba(255,253,246,0.72)',
      marginTop: 4
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: railSide === 'left' ? '260px 1fr' : '1fr 260px',
      gap: 40,
      alignItems: 'start'
    },
    rail: {
      position: 'sticky',
      top: 84,
      paddingTop: 4,
      order: railSide === 'left' ? 0 : 1,
      alignSelf: 'start'
    },
    railHeader: {
      fontSize: 10.5,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 22,
      paddingBottom: 12,
      borderBottom: '1px solid rgba(255,253,246,0.07)',
      display: 'flex',
      justifyContent: 'space-between'
    },
    railCount: {
      color: '#FFFDF6',
      fontWeight: 600,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    },
    railList: {
      display: 'flex',
      flexDirection: 'column'
    },
    // "Nouveau jalon" lives at the end of the timeline — aligned to the dot column
    addJalonBtn: {
      display: 'grid',
      gridTemplateColumns: '52px 24px 1fr',
      gap: 12,
      alignItems: 'start',
      padding: 0,
      marginTop: 0,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: 500,
      color: 'rgba(255,253,246,0.72)',
      textAlign: 'left',
      transition: 'color 150ms cubic-bezier(0.16,1,0.3,1)'
    },
    addJalonDot: {
      gridColumnStart: 2,
      width: 20,
      height: 20,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px dashed rgba(255,253,246,0.32)',
      color: 'rgba(255,253,246,0.72)',
      transition: 'border-color 150ms cubic-bezier(0.16,1,0.3,1), color 150ms cubic-bezier(0.16,1,0.3,1)'
    },
    addJalonLabel: {
      gridColumnStart: 3,
      paddingTop: 2
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: viewStyles.page,
    "data-screen-label": "02 Jalons"
  }, /*#__PURE__*/React.createElement("style", null, `
        @media (max-width: 960px) {
          .jalons-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
          .jalons-rail { position: static !important; padding-bottom: 8px; }
        }
        @media (max-width: 640px) {
          .jalons-detail-pos-row { flex-wrap: wrap; }
          .jalons-detail-status-chip { margin-left: 0 !important; }
        }
        .jalon-status-chip { white-space: nowrap; }
      `), /*#__PURE__*/React.createElement("div", {
    style: viewStyles.eyebrow
  }, "Jalons"), /*#__PURE__*/React.createElement("div", {
    style: viewStyles.pageHeader
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: viewStyles.pageTitle
  }, "Pilotage des jalons"), /*#__PURE__*/React.createElement("p", {
    style: viewStyles.pageSub
  }, "Chaque \xE9tape mesurable vers l'objectif. S\xE9lectionnez un jalon pour voir ses crit\xE8res et ses KPI."))), /*#__PURE__*/React.createElement("div", {
    className: "jalons-layout",
    style: viewStyles.layout
  }, /*#__PURE__*/React.createElement("aside", {
    className: "jalons-rail",
    style: viewStyles.rail
  }, /*#__PURE__*/React.createElement("div", {
    style: viewStyles.railHeader
  }, /*#__PURE__*/React.createElement("span", null, "Timeline"), /*#__PURE__*/React.createElement("span", {
    style: viewStyles.railCount
  }, jalons.length)), /*#__PURE__*/React.createElement("div", {
    style: viewStyles.railList
  }, jalons.map((j, i) => /*#__PURE__*/React.createElement(JalonRailItem, {
    key: j.id,
    jalon: j,
    index: i,
    total: jalons.length,
    active: j.id === activeJalonId,
    onClick: () => onSelectJalon(j.id),
    status: getStatus(j, i),
    hasNext: true
  })), /*#__PURE__*/React.createElement("button", {
    style: viewStyles.addJalonBtn,
    onClick: onCreateJalon,
    onMouseEnter: e => {
      e.currentTarget.style.color = '#FFFDF6';
      const dot = e.currentTarget.querySelector('[data-add-dot]');
      if (dot) {
        dot.style.borderColor = '#EE4408';
        dot.style.color = '#EE4408';
      }
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = 'rgba(255,253,246,0.72)';
      const dot = e.currentTarget.querySelector('[data-add-dot]');
      if (dot) {
        dot.style.borderColor = 'rgba(255,253,246,0.32)';
        dot.style.color = 'rgba(255,253,246,0.72)';
      }
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: viewStyles.addJalonDot,
    "data-add-dot": true
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 11,
      height: 11,
      strokeWidth: 2.5
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: viewStyles.addJalonLabel
  }, "Nouveau jalon")))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(JalonDetail, {
    jalon: activeJalon,
    index: activeIndex,
    total: jalons.length,
    status: detailStatus,
    onValidate: () => onValidate(activeJalon.id),
    onUpdateKPI: onUpdateKPI,
    onAddKPI: onAddKPI,
    onAddMeasure: onAddMeasure,
    onEditKPI: onEditKPI,
    onEditJalon: onEditJalon,
    onDeleteMeasure: onDeleteMeasure
  }))));
};
Object.assign(window, {
  JalonsView,
  JalonRailItem,
  JalonDetail
});
Object.assign(__ds_scope, { JalonsView, JalonRailItem, JalonDetail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/JalonsView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/Modals.jsx
try { (() => {
// CarryIT — Modal components: AddMeasure, EditSmart
// Exports: Modal, AddMeasureModal, EditSmartModal

const Modal = ({
  open,
  onClose,
  title,
  children
}) => {
  React.useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  const s = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.65)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      background: '#16161A',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.55)',
      borderRadius: 12,
      padding: '24px 28px',
      minWidth: 380,
      maxWidth: 480,
      width: '90%',
      boxShadow: '0 16px 64px rgba(0,0,0,0.7)',
      position: 'relative'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    },
    title: {
      fontSize: 16,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.01em'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: 'rgba(255,253,246,0.72)',
      cursor: 'pointer',
      fontSize: 18,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      borderRadius: 6,
      fontFamily: 'inherit'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: s.overlay
  }, /*#__PURE__*/React.createElement("div", {
    style: s.modal
  }, /*#__PURE__*/React.createElement("div", {
    style: s.header
  }, /*#__PURE__*/React.createElement("span", {
    style: s.title
  }, title), /*#__PURE__*/React.createElement("button", {
    style: s.closeBtn,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 16,
      height: 16
    }
  }))), children));
};
const FormGroup = ({
  label,
  children,
  error,
  hint
}) => {
  const s = {
    wrap: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      marginBottom: 16
    },
    label: {
      fontSize: 12,
      fontWeight: 500,
      color: 'rgba(255,253,246,0.72)'
    },
    error: {
      fontSize: 11,
      color: '#ff6b6b',
      marginTop: 2
    },
    hint: {
      fontSize: 11,
      color: 'rgba(255,253,246,0.72)',
      marginTop: 2
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: s.wrap
  }, /*#__PURE__*/React.createElement("label", {
    style: s.label
  }, label), children, error && /*#__PURE__*/React.createElement("span", {
    style: s.error
  }, error), hint && !error && /*#__PURE__*/React.createElement("span", {
    style: s.hint
  }, hint));
};
const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  hasError
}) => {
  const [focused, setFocused] = React.useState(false);
  const s = {
    input: {
      background: 'rgba(0, 0, 0, 0.32)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'inherit',
      fontSize: 14,
      color: '#FFFDF6',
      width: '100%',
      outline: 'none',
      border: hasError ? '1px solid #A3150D' : focused ? '1px solid #EE4408' : '1px solid rgba(255,253,246,0.12)',
      boxShadow: hasError ? '0 0 0 3px rgba(163,21,13,0.12)' : focused ? '0 0 0 3px rgba(238,68,8,0.15)' : 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease'
    }
  };
  return /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    style: s.input,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  });
};
const AddMeasureModal = ({
  open,
  onClose,
  kpiLabel,
  onSave
}) => {
  const [date, setDate] = React.useState('');
  const [value, setValue] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [toast, setToast] = React.useState(null);
  const validate = () => {
    const e = {};
    if (!date) e.date = 'Valeur requise';
    if (!value) e.value = 'Valeur requise';else if (isNaN(Number(value)) || Number(value) < 0) e.value = 'La valeur doit être positive';else if (!Number.isInteger(Number(value))) e.value = 'Entier uniquement';
    return e;
  };
  const handleSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({
      date,
      value: Number(value)
    });
    setDate('');
    setValue('');
    setErrors({});
    onClose();
  };
  const s = {
    actions: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end',
      marginTop: 24
    },
    cancelBtn: {
      padding: '0 16px',
      height: 38,
      borderRadius: 8,
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 500,
      cursor: 'pointer'
    },
    saveBtn: {
      padding: '0 20px',
      height: 38,
      borderRadius: 8,
      background: '#EE4408',
      color: '#FFFDF6',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer'
    },
    kpiCtx: {
      fontSize: 12,
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 16,
      background: 'rgba(255,253,246,0.04)',
      borderRadius: 6,
      padding: '8px 12px'
    },
    row: {
      display: 'flex',
      gap: 12
    }
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "Ajouter une mesure"
  }, /*#__PURE__*/React.createElement("div", {
    style: s.kpiCtx
  }, "KPI : ", kpiLabel), /*#__PURE__*/React.createElement("div", {
    style: s.row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "Date",
    error: errors.date,
    hint: "Format JJ/MM/AAAA"
  }, /*#__PURE__*/React.createElement(Input, {
    value: date,
    onChange: setDate,
    placeholder: "14/05/2026",
    hasError: !!errors.date
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "Valeur",
    error: errors.value
  }, /*#__PURE__*/React.createElement(Input, {
    value: value,
    onChange: setValue,
    placeholder: "247",
    type: "number",
    hasError: !!errors.value
  })))), /*#__PURE__*/React.createElement("div", {
    style: s.actions
  }, /*#__PURE__*/React.createElement("button", {
    style: s.cancelBtn,
    onClick: onClose
  }, "Annuler"), /*#__PURE__*/React.createElement("button", {
    style: s.saveBtn,
    onClick: handleSave
  }, "Enregistrer")));
};
const EditSmartModal = ({
  open,
  onClose,
  smart,
  onSave
}) => {
  const [form, setForm] = React.useState({
    ...smart
  });
  React.useEffect(() => {
    setForm({
      ...smart
    });
  }, [smart, open]);
  const fields = [{
    key: 'S',
    label: "S — L'ambition"
  }, {
    key: 'M',
    label: 'M — La mesure'
  }, {
    key: 'A',
    label: 'A — Atteignable'
  }, {
    key: 'R',
    label: 'R — Réaliste'
  }, {
    key: 'T',
    label: "T — L'échéance"
  }];
  const s = {
    actions: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end',
      marginTop: 24
    },
    cancelBtn: {
      padding: '0 16px',
      height: 38,
      borderRadius: 8,
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 500,
      cursor: 'pointer'
    },
    saveBtn: {
      padding: '0 20px',
      height: 38,
      borderRadius: 8,
      background: '#EE4408',
      color: '#FFFDF6',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer'
    }
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "Modifier l'objectif SMART"
  }, fields.map(f => /*#__PURE__*/React.createElement(FormGroup, {
    key: f.key,
    label: f.label
  }, /*#__PURE__*/React.createElement(Input, {
    value: form[f.key] || '',
    onChange: v => setForm(p => ({
      ...p,
      [f.key]: v
    })),
    placeholder: f.label
  }))), /*#__PURE__*/React.createElement("div", {
    style: s.actions
  }, /*#__PURE__*/React.createElement("button", {
    style: s.cancelBtn,
    onClick: onClose
  }, "Annuler"), /*#__PURE__*/React.createElement("button", {
    style: s.saveBtn,
    onClick: () => {
      onSave(form);
      onClose();
    }
  }, "Enregistrer")));
};

// ── EditKPIModal — full edit for a KPI (title, unit, target, freq, mode, type)
const EditKPIModal = ({
  open,
  onClose,
  kpi,
  onSave,
  onDelete
}) => {
  const [form, setForm] = React.useState(kpi || {});
  const [errors, setErrors] = React.useState({});
  React.useEffect(() => {
    if (open && kpi) {
      setForm({
        ...kpi
      });
      setErrors({});
    }
  }, [open, kpi]);
  if (!kpi) return null;
  const set = (k, v) => setForm(p => ({
    ...p,
    [k]: v
  }));
  const handleSave = () => {
    const e = {};
    if (!form.label || !form.label.trim()) e.label = 'Le titre est requis';
    if (form.value !== '' && form.value !== null && form.value !== undefined) {
      const v = Number(form.value);
      if (isNaN(v) || v < 0) e.value = 'La valeur doit être un nombre positif';else if (!Number.isInteger(v)) e.value = 'Entier uniquement';
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
      target: form.target === '' || form.target === null ? null : Number(form.target)
    });
    onClose();
  };
  const s = {
    actions: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      marginTop: 24,
      paddingTop: 16,
      borderTop: '1px solid rgba(255,253,246,0.07)'
    },
    cancelBtn: {
      padding: '0 16px',
      height: 38,
      borderRadius: 8,
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 500,
      cursor: 'pointer'
    },
    saveBtn: {
      padding: '0 20px',
      height: 38,
      borderRadius: 8,
      background: '#EE4408',
      color: '#FFFDF6',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer'
    },
    delBtn: {
      padding: '0 14px',
      height: 38,
      borderRadius: 8,
      background: 'transparent',
      color: '#ff6b56',
      border: '1px solid rgba(255,107,86,0.32)',
      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginRight: 'auto'
    },
    row: {
      display: 'flex',
      gap: 12
    },
    segWrap: {
      display: 'flex',
      gap: 6,
      background: 'rgba(255,255,255,0.03)',
      padding: 4,
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.06)'
    },
    segBtn: active => ({
      flex: 1,
      padding: '8px 10px',
      borderRadius: 6,
      background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
      color: active ? '#FFFDF6' : 'rgba(255,253,246,0.72)',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 12.5,
      fontWeight: active ? 600 : 500,
      transition: 'background 120ms cubic-bezier(0.16,1,0.3,1), color 120ms cubic-bezier(0.16,1,0.3,1)'
    }),
    typeCard: {
      fontSize: 11,
      color: 'rgba(255,253,246,0.42)',
      marginTop: 6,
      lineHeight: 1.4
    }
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "Modifier le KPI"
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "Titre du KPI",
    error: errors.label
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.label || '',
    onChange: v => set('label', v),
    placeholder: "Clients actifs payants",
    hasError: !!errors.label
  })), /*#__PURE__*/React.createElement("div", {
    style: s.row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "Valeur actuelle",
    error: errors.value,
    hint: "La derni\xE8re mesure connue"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: form.value ?? '',
    onChange: v => set('value', v),
    placeholder: "0",
    hasError: !!errors.value
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "Unit\xE9"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.unit || '',
    onChange: v => set('unit', v),
    placeholder: "clients"
  })))), /*#__PURE__*/React.createElement(FormGroup, {
    label: "Valeur cible",
    error: errors.target,
    hint: "Optionnelle \u2014 laisser vide pour ne pas en d\xE9finir"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number",
    value: form.target ?? '',
    onChange: v => set('target', v),
    placeholder: "400",
    hasError: !!errors.target
  })), /*#__PURE__*/React.createElement(FormGroup, {
    label: "Type d'indicateur"
  }, /*#__PURE__*/React.createElement("div", {
    style: s.segWrap
  }, /*#__PURE__*/React.createElement("button", {
    style: s.segBtn(form.type === 'leading'),
    onClick: () => set('type', 'leading')
  }, "Indicateur d'avanc\xE9e"), /*#__PURE__*/React.createElement("button", {
    style: s.segBtn(form.type === 'lagging'),
    onClick: () => set('type', 'lagging')
  }, "Indicateur de r\xE9sultat")), /*#__PURE__*/React.createElement("div", {
    style: s.typeCard
  }, form.type === 'leading' ? "Ce que tu fais qui crée la traction (action mesurée régulièrement)." : "Le résultat que tu vises (mesure de l'objectif).")), /*#__PURE__*/React.createElement(FormGroup, {
    label: "Fr\xE9quence de mesure"
  }, /*#__PURE__*/React.createElement("div", {
    style: s.segWrap
  }, /*#__PURE__*/React.createElement("button", {
    style: s.segBtn(form.frequency === 'Hebdomadaire'),
    onClick: () => set('frequency', 'Hebdomadaire')
  }, "Hebdomadaire"), /*#__PURE__*/React.createElement("button", {
    style: s.segBtn(form.frequency === 'Mensuel'),
    onClick: () => set('frequency', 'Mensuel')
  }, "Mensuel"))), /*#__PURE__*/React.createElement("div", {
    style: s.actions
  }, onDelete && /*#__PURE__*/React.createElement("button", {
    style: s.delBtn,
    onClick: () => {
      onDelete();
      onClose();
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 13,
      height: 13
    }
  }), "Supprimer"), /*#__PURE__*/React.createElement("button", {
    style: s.cancelBtn,
    onClick: onClose
  }, "Annuler"), /*#__PURE__*/React.createElement("button", {
    style: s.saveBtn,
    onClick: handleSave
  }, "Enregistrer")));
};

// ── EditJalonModal — edit a jalon (title, validation, date)
const EditJalonModal = ({
  open,
  onClose,
  jalon,
  onSave,
  onDelete
}) => {
  const [form, setForm] = React.useState(jalon || {});
  const [errors, setErrors] = React.useState({});
  React.useEffect(() => {
    if (open && jalon) {
      setForm({
        ...jalon
      });
      setErrors({});
    }
  }, [open, jalon]);
  if (!jalon) return null;
  const set = (k, v) => setForm(p => ({
    ...p,
    [k]: v
  }));
  const handleSave = () => {
    const e = {};
    if (!form.title || !form.title.trim()) e.title = 'Le titre est requis';
    if (!form.validation || !form.validation.trim()) e.validation = 'Le critère de validation est requis';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    onSave({
      ...form,
      title: form.title.trim(),
      validation: form.validation.trim()
    });
    onClose();
  };
  const s = {
    actions: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      marginTop: 24,
      paddingTop: 16,
      borderTop: '1px solid rgba(255,253,246,0.07)'
    },
    cancelBtn: {
      padding: '0 16px',
      height: 38,
      borderRadius: 8,
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      border: '1px solid rgba(255,253,246,0.1)',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 500,
      cursor: 'pointer'
    },
    saveBtn: {
      padding: '0 20px',
      height: 38,
      borderRadius: 8,
      background: '#EE4408',
      color: '#FFFDF6',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer'
    },
    delBtn: {
      padding: '0 14px',
      height: 38,
      borderRadius: 8,
      background: 'transparent',
      color: '#ff6b56',
      border: '1px solid rgba(255,107,86,0.32)',
      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginRight: 'auto'
    },
    row: {
      display: 'flex',
      gap: 12
    },
    textarea: (focused, hasError) => ({
      background: 'rgba(0, 0, 0, 0.32)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'inherit',
      fontSize: 14,
      color: '#FFFDF6',
      width: '100%',
      outline: 'none',
      resize: 'vertical',
      minHeight: 80,
      lineHeight: 1.5,
      border: hasError ? '1px solid #A3150D' : focused ? '1px solid #EE4408' : '1px solid rgba(255,253,246,0.12)',
      transition: 'border-color 150ms ease'
    })
  };
  const [valFocus, setValFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: "Modifier le jalon"
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "Titre du jalon",
    error: errors.title
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.title || '',
    onChange: v => set('title', v),
    placeholder: "MVP testable",
    hasError: !!errors.title
  })), /*#__PURE__*/React.createElement("div", {
    style: s.row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "\xC9ch\xE9ance (date)"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.date || '',
    onChange: v => set('date', v),
    placeholder: "Juil 2026"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FormGroup, {
    label: "Position"
  }, /*#__PURE__*/React.createElement(Input, {
    value: form.month || '',
    onChange: v => set('month', v),
    placeholder: "MOIS 4"
  })))), /*#__PURE__*/React.createElement(FormGroup, {
    label: "Crit\xE8re de validation",
    error: errors.validation,
    hint: "Condition observable et binaire \u2014 fait ou pas fait."
  }, /*#__PURE__*/React.createElement("textarea", {
    style: s.textarea(valFocus, !!errors.validation),
    value: form.validation || '',
    onChange: e => set('validation', e.target.value),
    onFocus: () => setValFocus(true),
    onBlur: () => setValFocus(false),
    placeholder: "MVP testable avec onboarding termin\xE9 pour 10 utilisateurs."
  })), /*#__PURE__*/React.createElement("div", {
    style: s.actions
  }, onDelete && /*#__PURE__*/React.createElement("button", {
    style: s.delBtn,
    onClick: () => {
      if (confirm('Supprimer ce jalon ?')) {
        onDelete();
        onClose();
      }
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 13,
      height: 13
    }
  }), "Supprimer"), /*#__PURE__*/React.createElement("button", {
    style: s.cancelBtn,
    onClick: onClose
  }, "Annuler"), /*#__PURE__*/React.createElement("button", {
    style: s.saveBtn,
    onClick: handleSave
  }, "Enregistrer")));
};

// Filename-matching component for the design-system compiler — alias of the base Modal.
function Modals(props) {
  return React.createElement(Modal, props);
}
Object.assign(window, {
  Modals,
  Modal,
  AddMeasureModal,
  EditSmartModal,
  EditKPIModal,
  EditJalonModal
});
Object.assign(__ds_scope, { Modals, Modal, AddMeasureModal, EditSmartModal, EditKPIModal, EditJalonModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/Modals.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/TodoView.jsx
try { (() => {
// CarryIT — To-do list view (strict 1:1 with dashboard.html .jt-section structure)
// No extra header, no top-level "Add task" button. Just section label + content.
// Exports: TodoView

const TodoView = ({
  jalons,
  activeJalonId,
  onSelectJalon,
  onValidate,
  density = 'comfort'
}) => {
  const compact = density === 'compact';
  const targetJalon = jalons.find(j => j.id === activeJalonId) || jalons.find(j => !j.done) || jalons[0];
  const todoStyles = {
    page: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: compact ? '24px 32px 64px' : '40px 32px 96px'
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: 800,
      color: '#F34C0A',
      letterSpacing: '0.02em',
      marginBottom: 18
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: todoStyles.page,
    "data-screen-label": "03 To-do list"
  }, /*#__PURE__*/React.createElement("div", {
    style: todoStyles.sectionLabel
  }, "T\xE2ches vers \xB7 ", targetJalon?.title || 'Exécution quotidienne'), /*#__PURE__*/React.createElement(EspaceExecution, {
    jalons: jalons,
    activeJalonId: activeJalonId,
    onSelectJalon: onSelectJalon,
    onValidate: onValidate
  }));
};
Object.assign(window, {
  TodoView
});
Object.assign(__ds_scope, { TodoView });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/TodoView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/TopNav.jsx
try { (() => {
// CarryIT — Top navigation
// 1:1 with dashboard.css (.dashboard-navbar): 2 rows, brand + sync on top, tabs below.
// Active state = white text + white underline (NOT orange).
// Exports: TopNav

const TopNav = ({
  activeView,
  onChange
}) => {
  const tabs = [{
    id: 'vision',
    label: 'Vision · Long terme',
    // grid icon
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M4 19V5M4 19h16M9 16V9M14 16V7M19 16v-4"
    }))
  }, {
    id: 'jalons',
    label: 'Jalons',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M12 2L4 9v11h5v-7h6v7h5V9z"
    }))
  }, {
    id: 'todo',
    label: 'To-do list',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M9 11l3 3L22 4"
    }), /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
    }))
  }];
  const navStyles = {
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      minHeight: 99,
      height: 99,
      background: 'rgba(15,16,19,0.96)',
      borderBottom: '1px solid rgba(255,253,246,0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column'
    },
    topRow: {
      height: 56,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      flex: '0 0 56px'
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      minWidth: 0,
      flex: 1
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      flex: '0 0 auto',
      textDecoration: 'none',
      color: 'rgba(255,253,246,0.94)'
    },
    logo: {
      width: 24,
      height: 24,
      objectFit: 'contain',
      flexShrink: 0
    },
    brandName: {
      fontFamily: '"Rifton", Georgia, serif',
      fontSize: 18,
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 1,
      textTransform: 'uppercase',
      color: 'rgba(255,253,246,0.94)'
    },
    divider: {
      color: 'rgba(255,253,246,0.20)',
      fontSize: 18,
      fontWeight: 300
    },
    dropdownTrigger: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 30,
      maxWidth: 220,
      padding: '5px 8px',
      border: 0,
      background: 'transparent',
      color: 'rgba(255,253,246,0.72)',
      fontSize: 14,
      fontWeight: 600,
      borderRadius: 7,
      cursor: 'pointer',
      fontFamily: 'inherit'
    },
    initial: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
      width: 22,
      height: 22,
      borderRadius: 6,
      background: '#FFFDF6',
      color: '#080809',
      fontSize: 13,
      fontWeight: 700
    },
    projectLabel: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },
    syncBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      minHeight: 34,
      padding: '0 14px',
      background: 'transparent',
      border: '1px solid rgba(255,253,246,0.14)',
      borderRadius: 7,
      color: 'rgba(255,253,246,0.72)',
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'all 150ms ease'
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: '#1A1A1C',
      border: '1px solid rgba(255,253,246,0.14)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12.5,
      fontWeight: 600,
      color: '#FFFDF6'
    },
    tabsRow: {
      height: 42,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'stretch',
      gap: 32,
      flex: '0 0 42px'
    },
    tab: active => ({
      height: 42,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: 0,
      background: 'transparent',
      border: 0,
      borderBottom: active ? '2px solid rgba(255,253,246,0.94)' : '2px solid transparent',
      color: active ? 'rgba(255,253,246,0.94)' : 'rgba(255,253,246,0.52)',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: 0,
      cursor: 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      transition: 'color 150ms ease, border-color 150ms ease'
    }),
    tabIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16
    }
  };
  return /*#__PURE__*/React.createElement("nav", {
    style: navStyles.nav
  }, /*#__PURE__*/React.createElement("div", {
    style: navStyles.topRow
  }, /*#__PURE__*/React.createElement("div", {
    style: navStyles.left
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: navStyles.brand
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.png",
    alt: "",
    style: navStyles.logo,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    style: navStyles.brandName
  }, "CARRY IT")), /*#__PURE__*/React.createElement("span", {
    style: navStyles.divider,
    "aria-hidden": "true"
  }, "/"), /*#__PURE__*/React.createElement("button", {
    style: navStyles.dropdownTrigger
  }, /*#__PURE__*/React.createElement("span", {
    style: navStyles.initial
  }, "L"), /*#__PURE__*/React.createElement("span", {
    style: navStyles.projectLabel
  }, "Lancer un SaaS B2B"), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 5.5L7 8.5L10 5.5"
  })))), /*#__PURE__*/React.createElement("div", {
    style: navStyles.right
  }, /*#__PURE__*/React.createElement("button", {
    style: navStyles.syncBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  })), "Synchroniser"), /*#__PURE__*/React.createElement("div", {
    style: navStyles.avatar
  }, "A"))), /*#__PURE__*/React.createElement("div", {
    style: navStyles.tabsRow,
    role: "tablist"
  }, tabs.map(t => {
    const active = activeView === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": active,
      style: navStyles.tab(active),
      onClick: () => onChange(t.id),
      "data-screen-label": t.label
    }, /*#__PURE__*/React.createElement("span", {
      style: navStyles.tabIcon
    }, t.icon), t.label);
  })));
};
Object.assign(window, {
  TopNav
});
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/TopNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/VisionView.jsx
try { (() => {
// CarryIT — Vision long terme view
// Eyebrow + KPI card + SMART card — reuses original BlocVision layout
// Exports: VisionView

const VisionView = ({
  kpiData,
  smart,
  jalons,
  onAddMeasure,
  onEditSmart,
  density = 'comfort'
}) => {
  const compact = density === 'compact';

  // Find the active (current) jalon for the small footer block
  const activeJalon = jalons.find(j => !j.done);
  const visionStyles = {
    page: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: compact ? '28px 32px 64px' : '40px 32px 96px'
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 18
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
      gap: 18,
      alignItems: 'start'
    },
    eyebrow2: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'rgba(255,253,246,0.72)',
      marginTop: 48,
      marginBottom: 18
    },
    activeJalonCard: {
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: '20px 22px'
    },
    execHead: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
      paddingBottom: 18,
      borderBottom: '1px solid rgba(255,253,246,0.07)'
    },
    pos: {
      fontSize: 10.5,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'rgba(255,253,246,0.72)',
      marginBottom: 5
    },
    activeTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#FFFDF6',
      letterSpacing: '-0.01em'
    },
    activeDate: {
      fontSize: 12.5,
      color: 'rgba(255,253,246,0.55)',
      marginTop: 3
    },
    activeStatus: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 9999,
      background: 'rgba(238,68,8,0.1)',
      color: '#EE4408',
      fontSize: 11.5,
      fontWeight: 500,
      whiteSpace: 'nowrap'
    },
    activeStatusDot: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: '#EE4408'
    },
    metricRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '18px 0 4px'
    },
    metric: {
      padding: '0 18px',
      borderLeft: '1px solid rgba(255,253,246,0.07)'
    },
    metricFirst: {
      paddingLeft: 0,
      borderLeft: 'none'
    },
    metricLabel: {
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'rgba(255,253,246,0.5)',
      marginBottom: 8
    },
    metricVal: {
      fontSize: 26,
      fontWeight: 700,
      color: '#FFFDF6',
      letterSpacing: '-0.02em',
      lineHeight: 1
    },
    metricValMuted: {
      fontSize: 16,
      fontWeight: 500,
      color: 'rgba(255,253,246,0.32)'
    },
    metricSub: {
      fontSize: 11.5,
      color: 'rgba(255,253,246,0.5)',
      marginTop: 6,
      lineHeight: 1.35
    },
    weekWrap: {
      marginTop: 18,
      paddingTop: 16,
      borderTop: '1px solid rgba(255,253,246,0.07)'
    },
    weekLabel: {
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'rgba(255,253,246,0.5)',
      marginBottom: 12
    },
    weekDays: {
      display: 'flex',
      gap: 8
    },
    dayCol: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 7
    },
    dayDot: {
      width: '100%',
      height: 30,
      borderRadius: 6,
      background: 'rgba(255,253,246,0.05)',
      border: '1px solid rgba(255,253,246,0.07)'
    },
    dayDotActive: {
      background: 'rgba(238,68,8,0.85)',
      border: '1px solid #EE4408',
      boxShadow: '0 0 14px -3px rgba(238,68,8,0.7)'
    },
    dayLetter: {
      fontSize: 11,
      fontWeight: 600,
      color: 'rgba(255,253,246,0.5)'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: visionStyles.page,
    "data-screen-label": "01 Vision long terme"
  }, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.eyebrow
  }, "Vision \xB7 Long terme"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.grid
  }, /*#__PURE__*/React.createElement(KPICard, {
    kpiData: kpiData,
    onAddMeasure: onAddMeasure
  }), /*#__PURE__*/React.createElement(SmartCard, {
    smart: smart,
    onEdit: onEditSmart
  })), activeJalon && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.eyebrow2
  }, "Ex\xE9cution \xB7 Jalon en cours"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.activeJalonCard
  }, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.execHead
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.pos
  }, activeJalon.month, " \xB7 Jalon en cours"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.activeTitle
  }, activeJalon.title), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.activeDate
  }, "\xC9ch\xE9ance \xB7 ", activeJalon.date)), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.activeStatus
  }, /*#__PURE__*/React.createElement("span", {
    style: visionStyles.activeStatusDot
  }), "En cours")), activeJalon.execution && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricRow
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...visionStyles.metric,
      ...visionStyles.metricFirst
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricLabel
  }, "Temps \xE9coul\xE9"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricVal
  }, activeJalon.execution.daysElapsed, "j"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricSub
  }, "depuis la derni\xE8re tentative")), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metric
  }, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricLabel
  }, "Effort r\xE9el"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricVal
  }, activeJalon.execution.effortHours, "h"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricSub
  }, "investies sur cette tentative")), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metric
  }, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricLabel
  }, "R\xE9sultat"), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricVal
  }, activeJalon.execution.result.value, /*#__PURE__*/React.createElement("span", {
    style: visionStyles.metricValMuted
  }, "/", activeJalon.execution.result.target)), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.metricSub
  }, activeJalon.execution.result.label))), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.weekWrap
  }, /*#__PURE__*/React.createElement("div", {
    style: visionStyles.weekLabel
  }, activeJalon.execution.week), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.weekDays
  }, activeJalon.execution.days.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: visionStyles.dayCol
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...visionStyles.dayDot,
      ...(d.active ? visionStyles.dayDotActive : {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: visionStyles.dayLetter
  }, d.d)))))))));
};
Object.assign(window, {
  VisionView
});
Object.assign(__ds_scope, { VisionView });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/VisionView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/design-canvas.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/design-canvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web_app/tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web_app/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BlocVision = __ds_scope.BlocVision;

__ds_ns.KPICard = __ds_scope.KPICard;

__ds_ns.SmartCard = __ds_scope.SmartCard;

__ds_ns.EspaceExecution = __ds_scope.EspaceExecution;

__ds_ns.MilestoneTab = __ds_scope.MilestoneTab;

__ds_ns.TaskRow = __ds_scope.TaskRow;

__ds_ns.TaskGroup = __ds_scope.TaskGroup;

__ds_ns.KanbanColumn = __ds_scope.KanbanColumn;

__ds_ns.AddTaskRow = __ds_scope.AddTaskRow;

__ds_ns.Chevron = __ds_scope.Chevron;

__ds_ns.JalonKPICard = __ds_scope.JalonKPICard;

__ds_ns.KPIEmptyState = __ds_scope.KPIEmptyState;

__ds_ns.KPIHistorySheet = __ds_scope.KPIHistorySheet;

__ds_ns.JalonsView = __ds_scope.JalonsView;

__ds_ns.JalonRailItem = __ds_scope.JalonRailItem;

__ds_ns.JalonDetail = __ds_scope.JalonDetail;

__ds_ns.Modals = __ds_scope.Modals;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.AddMeasureModal = __ds_scope.AddMeasureModal;

__ds_ns.EditSmartModal = __ds_scope.EditSmartModal;

__ds_ns.EditKPIModal = __ds_scope.EditKPIModal;

__ds_ns.EditJalonModal = __ds_scope.EditJalonModal;

__ds_ns.TodoView = __ds_scope.TodoView;

__ds_ns.TopNav = __ds_scope.TopNav;

__ds_ns.VisionView = __ds_scope.VisionView;

})();
