import { createSlice } from "@reduxjs/toolkit";

// Store task objects using the requested id, description, and isDone fields.
const tasksSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    // Add a new active task to the list.
    addTask: (state, action) => {
      state.unshift({
        id: action.payload.id,
        description: action.payload.description,
        isDone: false,
      });
    },
    // Replace the description for the task being edited.
    editTask: (state, action) => {
      const task = state.find((item) => item.id === action.payload.id);
      if (task) task.description = action.payload.description;
    },
    // Toggle a task between done and not done.
    toggleTask: (state, action) => {
      const task = state.find((item) => item.id === action.payload);
      if (task) task.isDone = !task.isDone;
    },
  },
});

export const { addTask, editTask, toggleTask } = tasksSlice.actions;
export default tasksSlice.reducer;
