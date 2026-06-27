// CarryIT — To-do list view (strict 1:1 with dashboard.html .jt-section structure)
// No extra header, no top-level "Add task" button. Just section label + content.
// Exports: TodoView

const TodoView = ({ jalons, activeJalonId, onSelectJalon, onValidate, onToggleTask, onAddTask, density = 'comfort' }) => {
  const compact = density === 'compact';
  const targetJalon = jalons.find(j => j.id === activeJalonId)
    || jalons.find(j => !j.done)
    || jalons[0];

  const todoStyles = {
    page: {
      maxWidth: 1120, margin: '0 auto',
      padding: compact ? '24px 32px 64px' : '40px 32px 96px',
    },
    sectionLabel: {
      fontSize: 16, fontWeight: 800,
      color: '#F34C0A', letterSpacing: '0.02em',
      marginBottom: 18,
    },
  };

  return (
    <div style={todoStyles.page} data-screen-label="03 To-do list">
      <div style={todoStyles.sectionLabel}>
        Tâches vers · {targetJalon?.title || 'Exécution quotidienne'}
      </div>
      <EspaceExecution
        jalons={jalons}
        activeJalonId={activeJalonId}
        onSelectJalon={onSelectJalon}
        onValidate={onValidate}
        onToggleTask={onToggleTask}
        onAddTask={onAddTask}
      />
    </div>
  );
};

export { TodoView };
Object.assign(window, { TodoView });
