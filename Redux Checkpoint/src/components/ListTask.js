import Task from "./Task";

// Render the selected tasks or explain that the current filter is empty.
function ListTask({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">✦</span>
        <h3>No tasks to show</h3>
        <p>Add a task above or choose another filter.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default ListTask;
