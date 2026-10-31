import { fireEvent, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import tasksReducer from "./tasksSlice";

// Render the app with a fresh Redux store for each test.
function renderApp() {
  const store = configureStore({ reducer: { tasks: tasksReducer } });
  return render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

test("validates and adds a new task to Redux state", () => {
  renderApp();

  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
  expect(screen.getByText("Enter a task description.")).toBeInTheDocument();

  fireEvent.change(screen.getByRole("textbox", { name: "Task description" }), {
    target: { value: "  Finish the assignment  " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));

  expect(screen.getByText("Finish the assignment")).toBeInTheDocument();
  expect(
    within(screen.getByRole("listitem")).getByText("Not done")
  ).toBeInTheDocument();
});

test("toggles, filters, and edits a task", () => {
  renderApp();

  fireEvent.change(screen.getByRole("textbox", { name: "Task description" }), {
    target: { value: "Write tests" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Mark task Write tests done" })
  );

  fireEvent.change(screen.getByRole("combobox", { name: "Filter tasks" }), {
    target: { value: "done" },
  });
  const taskList = screen.getByRole("list");
  expect(within(taskList).getByText("Write tests")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Edit task Write tests" }));
  fireEvent.change(
    screen.getByRole("textbox", { name: "Edit task description" }),
    { target: { value: "Write better tests" } }
  );
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(screen.getByText("Write better tests")).toBeInTheDocument();
  expect(
    within(screen.getByRole("listitem")).getByText("Done")
  ).toBeInTheDocument();

  fireEvent.change(screen.getByRole("combobox", { name: "Filter tasks" }), {
    target: { value: "not-done" },
  });
  expect(screen.getByText("No tasks to show")).toBeInTheDocument();
});
