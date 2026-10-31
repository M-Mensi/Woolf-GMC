import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";

// Create the Redux store that holds the shared task list.
const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

export default store;
