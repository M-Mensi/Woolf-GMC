import { useState } from "react";
import { useDispatch } from "react-redux";
import { editTask, toggleTask } from "../tasksSlice";

// Display a task and provide controls to edit it or toggle its done status.
function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Validate and dispatch an edit, keeping the existing task ID and status.
  function handleSave(event) {
    event.preventDefault();
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setError("Task description cannot be empty.");
      return;
    }

    dispatch(editTask({ id: task.id, description: trimmedDescription }));
    setIsEditing(false);
    setError("");
  }

  // Discard unsaved edits and return to the task display.
  function handleCancel() {
    setDescription(task.description);
    setError("");
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="task-item task-item-editing">
        <form className="edit-form" onSubmit={handleSave}>
          <label className="field">
            <span>Edit task description</span>
            <textarea
              autoFocus
              aria-label="Edit task description"
              aria-invalid={Boolean(error)}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                if (error) setError("");
              }}
              rows="2"
            />
            {error && <span className="field-error" role="alert">{error}</span>}
          </label>
          <div className="task-actions">
            <button className="button button-quiet" type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="button button-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`task-item${task.isDone ? " task-item-completed" : ""}`}>
      <label className="completion-control">
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={() => dispatch(toggleTask(task.id))}
          aria-label={`Mark task ${task.description} ${
            task.isDone ? "not done" : "done"
          }`}
        />
        <span className="custom-checkbox" aria-hidden="true" />
      </label>
      <span className="task-content">
        <span className="task-name">{task.description}</span>
        <span className="task-status">{task.isDone ? "Done" : "Not done"}</span>
      </span>
      <div className="task-actions">
        <button
          className="icon-button"
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit task ${task.description}`}
        >
          Edit
        </button>
      </div>
    </li>
  );
}

export default Task;
