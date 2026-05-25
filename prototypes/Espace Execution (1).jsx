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

const Chevron = ({ collapsed }) => (
  <span style={{
    display: 'inline-block', width: 0, height: 0,
    marginLeft: 4,
    borderTop: '4px solid transparent',
    borderBottom: '4px solid transparent',
    borderLeft: '5px solid rgba(255,253,246,0.42)',
    transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
    transition: 'transform 150ms ease',
    flexShrink: 0,
  }} />
);

const MilestoneTab = ({ jalon, index, active, onClick, isComplete, isInProgress, taskCount, doneCount }) => {
  const dotStyle = isInProgress
    ? { background: '#EE4408' }
    : isComplete
    ? { background: '#8ea5c4' }
    : { background: 'rgba(255,253,246,0.18)' };

  const tabStyle = {
    height: 50,
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '0 14px',
    border: 0,
    borderBottom: active
      ? '2px solid rgba(255,253,246,0.90)'
      : '2px solid transparent',
    borderRadius: 0,
    background: 'transparent',
    color: active ? 'rgba(255,253,246,0.90)' : 'rgba(255,253,246,0.43)',
    fontSize: 15, fontWeight: active ? 600 : 500,
    cursor: 'pointer', fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    transition: 'color 150ms ease, border-color 150ms ease',
    flexShrink: 0,
  };

  return (
    <button style={tabStyle} onClick={onClick}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        flexShrink: 0,
        ...dotStyle,
      }}></span>
      <span>{jalon.title}</span>
      {taskCount > 0 && (
        <span style={{
          padding: '2px 6px', borderRadius: 4,
          background: active ? 'rgba(255,253,246,0.065)' : 'transparent',
          border: active ? 'none' : '1px solid rgba(255,253,246,0.12)',
          color: active ? 'rgba(255,253,246,0.54)' : 'rgba(255,253,246,0.42)',
          fontSize: 11, fontWeight: 600,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          flexShrink: 0, lineHeight: 1.2,
        }}>{doneCount}/{taskCount}</span>
      )}
    </button>
  );
};

const TaskRow = ({ task, onToggle }) => {
  const [hover, setHover] = React.useState(false);

  const rowStyles = {
    row: {
      minHeight: 38,
      display: 'grid',
      gridTemplateColumns: '20px 38px 20px minmax(0, 1fr) 28px 28px',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,253,246,0.085)',
      background: hover ? 'rgba(255,253,246,0.032)' : 'transparent',
      transition: 'background 100ms ease',
    },
    grip: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: '100%',
      color: 'rgba(255,253,246,0.18)',
      fontSize: 13, cursor: 'grab',
      opacity: hover ? 1 : 0,
      transition: 'opacity 120ms',
      userSelect: 'none', lineHeight: 1,
    },
    checkCell: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    checkbox: {
      width: 18, height: 18, borderRadius: 4,
      border: task.done ? 'none' : '1.5px solid rgba(255,253,246,0.2)',
      background: task.done ? '#EE4408' : '#111112',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 150ms ease, border-color 150ms ease',
      color: '#FFFDF6', flexShrink: 0,
    },
    chevronCell: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: '100%',
    },
    name: {
      display: 'flex', alignItems: 'center',
      minWidth: 0,
      color: task.done ? 'rgba(255,253,246,0.42)' : 'rgba(255,253,246,0.82)',
      fontSize: 14, fontWeight: 500, lineHeight: 1.35,
      textDecoration: task.done ? 'line-through' : 'none',
      paddingRight: 16,
    },
    rowActionCell: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    rowAction: {
      display: hover ? 'flex' : 'none',
      alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28,
      padding: 0, border: 'none', borderRadius: 4,
      background: 'transparent',
      color: 'rgba(255,253,246,0.3)',
      cursor: 'pointer', lineHeight: 1,
    },
  };

  return (
    <div style={rowStyles.row}
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}>
      <span style={rowStyles.grip}>⋮⋮</span>
      <div style={rowStyles.checkCell}>
        <span style={rowStyles.checkbox} onClick={() => onToggle(task.id)}>
          {task.done && <span style={{fontSize:10,fontWeight:700,lineHeight:1}}>✓</span>}
        </span>
      </div>
      <div style={rowStyles.chevronCell}></div>
      <div style={rowStyles.name}>{task.title}</div>
      <div style={rowStyles.rowActionCell}>
        <button style={rowStyles.rowAction}>
          <i data-lucide="more-horizontal" style={{width:14,height:14}}></i>
        </button>
      </div>
      <div style={rowStyles.rowActionCell}>
        <button style={rowStyles.rowAction}>
          <i data-lucide="x" style={{width:14,height:14}}></i>
        </button>
      </div>
    </div>
  );
};

const AddTaskRow = ({ status, onAdd }) => {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [hover, setHover] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const commit = () => {
    if (value.trim()) onAdd && onAdd(value.trim(), status);
    setValue('');
    setEditing(false);
  };

  const baseGrid = {
    display: 'grid',
    gridTemplateColumns: '20px 38px 20px minmax(0, 1fr)',
    alignItems: 'center', width: '100%',
    minHeight: 38, padding: 0,
    fontFamily: 'inherit',
    borderBottom: '1px solid rgba(255,253,246,0.085)',
  };

  if (!editing) {
    return (
      <button
        style={{
          ...baseGrid,
          background: hover ? 'rgba(255,253,246,0.025)' : 'transparent',
          border: 'none', borderBottom: '1px solid rgba(255,253,246,0.085)',
          cursor: 'pointer', textAlign: 'left',
          transition: 'background 120ms ease',
        }}
        onClick={() => setEditing(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span></span>
        <span style={{
          justifySelf: 'center',
          color: hover ? 'rgba(255,253,246,0.55)' : 'rgba(255,253,246,0.28)',
          fontSize: 16, lineHeight: 1,
          transition: 'color 120ms ease',
        }}>+</span>
        <span></span>
        <span style={{
          fontSize: 13,
          color: hover ? 'rgba(255,253,246,0.86)' : 'rgba(255,253,246,0.52)',
          transition: 'color 120ms ease',
        }}>Ajouter une action...</span>
      </button>
    );
  }

  return (
    <div style={{...baseGrid, background: 'rgba(255,253,246,0.025)'}}>
      <span></span>
      <span style={{ justifySelf: 'center', color: 'rgba(255,253,246,0.86)', fontSize: 16, lineHeight: 1 }}>+</span>
      <span></span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder="Ajouter une action..."
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setValue(''); setEditing(false); }
        }}
        onBlur={commit}
        style={{
          width: '100%', height: 38,
          background: 'transparent', border: 'none', outline: 'none',
          color: '#FFFDF6', fontSize: 14, fontFamily: 'inherit',
        }}
      />
    </div>
  );
};

const TaskGroup = ({ status, label, tasks, onToggle, onAdd, collapsed, onToggleCollapse }) => {
  const groupColors = {
    doing: {
      headerColor: '#EE4408',
      pillBg: 'rgba(238,68,8,0.18)',
      pillColor: '#ff7948',
    },
    todo: {
      headerColor: 'rgba(255,253,246,0.68)',
      pillBg: 'rgba(255,253,246,0.075)',
      pillColor: 'rgba(255,253,246,0.72)',
    },
    done: {
      headerColor: '#54bdb5',
      pillBg: 'rgba(20,184,166,0.18)',
      pillColor: '#7ddbd4',
    },
  }[status];

  return (
    <div>
      <button
        onClick={onToggleCollapse}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 0 8px',
          background: 'transparent', border: 0,
          cursor: 'pointer',
          color: groupColors.headerColor,
          textTransform: 'uppercase', letterSpacing: 0,
          fontSize: 12, fontWeight: 700,
          fontFamily: 'inherit',
          marginTop: status === 'done' ? 14 : 0,
          textAlign: 'left',
        }}
      >
        <Chevron collapsed={collapsed} />
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          minHeight: 20, padding: '4px 8px',
          borderRadius: 4,
          background: groupColors.pillBg,
          color: groupColors.pillColor,
          fontSize: 11, fontWeight: 700,
          lineHeight: 1, letterSpacing: 0,
          whiteSpace: 'nowrap',
        }}>{label}</span>
        <strong style={{
          color: 'rgba(255,253,246,0.48)',
          fontSize: 12, fontWeight: 600,
        }}>{tasks.length}</strong>
      </button>
      <div style={{ display: collapsed ? 'none' : 'block' }}>
        {tasks.map(t => (
          <TaskRow key={t.id} task={t} onToggle={onToggle} />
        ))}
        {status !== 'done' && <AddTaskRow status={status} onAdd={onAdd} />}
      </div>
    </div>
  );
};

const KanbanColumn = ({ status, title, tasks, onToggle }) => {
  const colPillBg = {
    doing: 'rgba(238,68,8,0.18)',
    todo: 'rgba(255,253,246,0.075)',
    done: 'rgba(20,184,166,0.18)',
  }[status];

  const colPillColor = {
    doing: '#ff7948',
    todo: 'rgba(255,253,246,0.72)',
    done: '#7ddbd4',
  }[status];

  return (
    <div style={{
      flex: 1, minWidth: 220,
      background: '#14161b',
      border: '1px solid rgba(255,253,246,0.12)',
      borderRadius: 8,
      padding: '14px 14px 16px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '3px 8px', borderRadius: 4,
          background: colPillBg, color: colPillColor,
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          whiteSpace: 'nowrap', lineHeight: 1,
        }}>{title}</span>
        <span style={{
          marginLeft: 'auto', fontSize: 12, fontWeight: 600,
          color: 'rgba(255,253,246,0.48)',
        }}>{tasks.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {tasks.length === 0 ? (
          <div style={{ fontSize: 12.5, color: 'rgba(255,253,246,0.32)', fontStyle: 'italic', padding: '6px 4px' }}>—</div>
        ) : (
          tasks.map(t => (
            <div key={t.id} style={{
              background: '#0f1013',
              border: '1px solid rgba(255,253,246,0.075)',
              borderRadius: 7,
              padding: '10px 12px',
              cursor: 'pointer',
              fontSize: 13,
              color: status === 'done' ? 'rgba(255,253,246,0.42)' : 'rgba(255,253,246,0.82)',
              lineHeight: 1.4,
              textDecoration: status === 'done' ? 'line-through' : 'none',
            }}>
              {t.title}
            </div>
          ))
        )}
      </div>
      {status !== 'done' && (
        <button style={{
          marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 10px', borderRadius: 6,
          border: '1px dashed rgba(255,253,246,0.12)',
          color: 'rgba(255,253,246,0.5)', background: 'transparent',
          fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
          width: '100%',
        }}>
          <i data-lucide="plus" style={{width:11,height:11}}></i>
          Ajouter une action
        </button>
      )}
    </div>
  );
};

const EspaceExecution = ({ jalons, activeJalonId, onSelectJalon, onValidate }) => {
  const [view, setView] = React.useState('list');
  const [tasks, setTasks] = React.useState({});
  const [collapsed, setCollapsed] = React.useState({ doing: false, todo: false, done: true });

  React.useEffect(() => {
    const defaultTasks = {};
    jalons.forEach(j => { defaultTasks[j.id] = j.tasks || []; });
    setTasks(defaultTasks);
  }, [jalons]);

  const activeJalon = jalons.find(j => j.id === activeJalonId) || jalons[0];
  const activeTasks = tasks[activeJalon?.id] || [];

  const toggleTask = (taskId) => {
    setTasks(prev => ({
      ...prev,
      [activeJalon.id]: prev[activeJalon.id].map(t =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
    }));
  };

  const addTask = (title, status) => {
    const newTask = {
      id: 't' + Date.now(),
      title, done: false,
      priority: status === 'doing' ? 'high' : undefined,
    };
    setTasks(prev => ({
      ...prev,
      [activeJalon.id]: [...(prev[activeJalon.id] || []), newTask],
    }));
  };

  const getStatus = (t) => t.done ? 'done' : (t.priority === 'high' ? 'doing' : 'todo');
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
      marginBottom: 20,
    },
    tabs: {
      display: 'flex', alignItems: 'flex-end', gap: 0,
    },
    criterion: {
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '16px 18px',
      marginBottom: 22,
      borderRadius: 8,
      background: 'rgba(255,253,246,0.028)',
      border: '1px solid rgba(255,253,246,0.10)',
      boxShadow: 'inset 0 1px 0 rgba(255,253,246,0.025)',
    },
    criterionBody: { flex: 1, minWidth: 0 },
    overline: {
      display: 'block',
      marginBottom: 6,
      color: 'rgba(255,253,246,0.50)',
      fontSize: 11, fontWeight: 700,
      letterSpacing: '0.105em',
      textTransform: 'uppercase',
    },
    overlineContext: { color: 'rgba(255,253,246,0.74)' },
    criterionText: {
      color: 'rgba(255,253,246,0.91)',
      fontSize: 15, fontWeight: 550,
      lineHeight: 1.4,
    },
    validateBtn: (done) => ({
      flex: '0 0 auto',
      height: 34, padding: '0 14px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      border: done
        ? '1px solid rgba(255,253,246,0.12)'
        : '1px solid rgba(238,68,8,0.55)',
      borderRadius: 999,
      background: done ? 'rgba(255,253,246,0.04)' : 'rgba(238,68,8,0.18)',
      color: done ? 'rgba(255,253,246,0.46)' : '#ff9a73',
      fontSize: 12, fontWeight: 700, letterSpacing: 0,
      cursor: done ? 'default' : 'pointer',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
      transition: 'all 150ms ease',
    }),
    surface: {
      // .task-list-surface
      position: 'relative',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      gap: 24,
      marginBottom: 6,
    },
    toolbarBtn: (active) => ({
      height: 'auto',
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '0 0 12px', border: 0,
      borderBottom: active
        ? '2px solid #FFFDF6'
        : '2px solid transparent',
      borderRadius: 0,
      background: 'transparent',
      color: active ? '#FFFDF6' : '#929292',
      fontSize: 14, fontWeight: active ? 620 : 560,
      cursor: 'pointer', fontFamily: 'inherit',
      lineHeight: 1,
      transition: 'color 150ms ease, border-color 150ms ease',
    }),
    toolbarIcon: (active) => ({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 20, borderRadius: 5,
      background: active ? '#FFFDF6' : '#191b21',
      border: active ? '1px solid #FFFDF6' : '1px solid rgba(255,253,246,0.075)',
      color: active ? '#080809' : '#929292',
    }),
    kanbanWrap: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 14, marginTop: 8,
    },
  };

  // Sort: active first, then upcoming, then completed (matches dashboard.html logic)
  const sorted = [...jalons];

  return (
    <div style={sectionStyles.wrap}>
      {/* milestone tabs */}
      <div style={sectionStyles.tabsWrap}>
        <div style={sectionStyles.tabs}>
          {sorted.map((j, i) => {
            const linkedTasks = tasks[j.id] || j.tasks || [];
            const totalLinked = linkedTasks.length;
            const doneLinked = linkedTasks.filter(t => t.done).length;
            return (
              <MilestoneTab
                key={j.id}
                jalon={j}
                index={i}
                active={j.id === activeJalon?.id}
                onClick={() => onSelectJalon(j.id)}
                isComplete={j.done}
                isInProgress={!j.done && j.id === activeJalon?.id}
                taskCount={totalLinked}
                doneCount={doneLinked}
              />
            );
          })}
        </div>
      </div>

      {/* criterion card */}
      {activeJalon && (
        <div style={sectionStyles.criterion}>
          <div style={sectionStyles.criterionBody}>
            <span style={sectionStyles.overline}>
              🎯 Validation <span style={sectionStyles.overlineContext}>· {activeJalon.title}</span> :
            </span>
            <span style={sectionStyles.criterionText}>
              {activeJalon.validation || '—'}
            </span>
          </div>
        </div>
      )}

      {/* task list surface */}
      <div style={sectionStyles.surface}>
        <div style={sectionStyles.toolbar}>
          <button
            style={sectionStyles.toolbarBtn(view === 'list')}
            onClick={() => setView('list')}
          >
            <span style={sectionStyles.toolbarIcon(view === 'list')}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
            </span>
            Liste
          </button>
          <button
            style={sectionStyles.toolbarBtn(view === 'kanban')}
            onClick={() => setView('kanban')}
          >
            <span style={sectionStyles.toolbarIcon(view === 'kanban')}>
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 5h6v14H4zM14 5h6v8h-6zM14 17h6v2h-6z"/>
              </svg>
            </span>
            Board
          </button>
        </div>

        {view === 'list' ? (
          <div>
            <TaskGroup
              status="doing" label="En cours" tasks={doing}
              onToggle={toggleTask} onAdd={addTask}
              collapsed={collapsed.doing}
              onToggleCollapse={() => setCollapsed(p => ({...p, doing: !p.doing}))}
            />
            <TaskGroup
              status="todo" label="À faire" tasks={todo}
              onToggle={toggleTask} onAdd={addTask}
              collapsed={collapsed.todo}
              onToggleCollapse={() => setCollapsed(p => ({...p, todo: !p.todo}))}
            />
            <TaskGroup
              status="done" label="Terminées" tasks={done}
              onToggle={toggleTask}
              collapsed={collapsed.done}
              onToggleCollapse={() => setCollapsed(p => ({...p, done: !p.done}))}
            />
          </div>
        ) : (
          <div style={sectionStyles.kanbanWrap}>
            <KanbanColumn status="doing" title="En cours" tasks={doing} onToggle={toggleTask} />
            <KanbanColumn status="todo" title="À faire" tasks={todo} onToggle={toggleTask} />
            <KanbanColumn status="done" title="Terminé" tasks={done} onToggle={toggleTask} />
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, {
  EspaceExecution, MilestoneTab, TaskRow, TaskGroup, KanbanColumn, AddTaskRow, Chevron,
});
