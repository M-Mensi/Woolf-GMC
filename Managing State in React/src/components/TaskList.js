import TaskItem from "./TaskItem";

// Renders the filtered tasks or a helpful empty state.
function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">✦</span>
        <h3>Nothing here just yet</h3>
        <p>Add a task above or choose another filter.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

export default TaskList;
