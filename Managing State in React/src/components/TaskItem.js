// Displays one task with controls for completion, editing, and deletion.
function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <li className={`task-item${task.completed ? " task-item-completed" : ""}`}>
      <label className="completion-control">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.name}" ${
            task.completed ? "active" : "completed"
          }`}
        />
        <span className="custom-checkbox" aria-hidden="true" />
      </label>

      <button
        className="task-content"
        type="button"
        onClick={() => onEdit(task)}
        aria-label={`Open task editor for ${task.name}`}
      >
        <span className="task-name">{task.name}</span>
        <span className="task-description">{task.description}</span>
      </button>

      <div className="task-actions">
        <button
          className="icon-button"
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.name}`}
          title="Edit task"
        >
          Edit
        </button>
        <button
          className="icon-button delete-button"
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.name}`}
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
