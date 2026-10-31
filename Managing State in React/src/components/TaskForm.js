import { useState } from "react";

// Shared, validated form for creating a task or editing an existing one.
function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [name, setName] = useState(initialTask?.name ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? ""
  );
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(initialTask);

  // Validate required fields before passing trimmed values to the app.
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Enter a task name.";
    if (!description.trim()) {
      nextErrors.description = "Enter a task description.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ name: name.trim(), description: description.trim() });
    if (!isEditing) {
      setName("");
      setDescription("");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div className="form-icon" aria-hidden="true">
          {isEditing ? "✎" : "+"}
        </div>
        <div>
          <h2>{isEditing ? "Edit task" : "Add a task"}</h2>
          <p>
            {isEditing
              ? "Update the task details below."
              : "What would you like to get done?"}
          </p>
        </div>
      </div>

      <label className="field">
        <span>Task name</span>
        <input
          autoFocus={isEditing}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "task-name-error" : undefined}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Plan the week"
        />
        {errors.name && (
          <span className="field-error" id="task-name-error" role="alert">
            {errors.name}
          </span>
        )}
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "task-description-error" : undefined
          }
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add a few details..."
          rows="3"
        />
        {errors.description && (
          <span
            className="field-error"
            id="task-description-error"
            role="alert"
          >
            {errors.description}
          </span>
        )}
      </label>

      <div className="form-actions">
        {isEditing && (
          <button className="button button-quiet" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="button button-primary" type="submit">
          {isEditing ? "Save changes" : "Add task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
