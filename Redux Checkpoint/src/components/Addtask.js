import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../tasksSlice";

// Collect a task description and dispatch a Redux action when it is valid.
function Addtask() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Validate that the task has a description before adding it.
  function handleSubmit(event) {
    event.preventDefault();
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setError("Enter a task description.");
      return;
    }

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    dispatch(addTask({ id, description: trimmedDescription }));
    setDescription("");
    setError("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div className="form-icon" aria-hidden="true">
          +
        </div>
        <div>
          <h2>Add a task</h2>
          <p>What do you need to get done?</p>
        </div>
      </div>
      <label className="field">
        <span>Task description</span>
        <textarea
          aria-label="Task description"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "add-task-error" : undefined}
          placeholder="e.g. Plan the week"
          rows="3"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (error) setError("");
          }}
        />
        {error && (
          <span className="field-error" id="add-task-error" role="alert">
            {error}
          </span>
        )}
      </label>
      <div className="form-actions">
        <button className="button button-primary" type="submit">
          Add task
        </button>
      </div>
    </form>
  );
}

export default Addtask;
