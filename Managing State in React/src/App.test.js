import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

test("validates the task name and description before adding", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
  expect(screen.getByText("Enter a task name.")).toBeInTheDocument();
  expect(screen.getByText("Enter a task description.")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("e.g. Plan the week"), {
    target: { value: "  Buy groceries  " },
  });
  fireEvent.change(screen.getByPlaceholderText("Add a few details..."), {
    target: { value: "  Pick up fruit and bread  " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));

  expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  expect(screen.getByText("Pick up fruit and bread")).toBeInTheDocument();
  expect(localStorage.getItem("managing-state-react-tasks")).toContain(
    "Buy groceries"
  );
});

test("edits a task and marks it completed", () => {
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText("e.g. Plan the week"), {
    target: { value: "Read a book" },
  });
  fireEvent.change(screen.getByPlaceholderText("Add a few details..."), {
    target: { value: "Read one chapter" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit Read a book" }));

  fireEvent.change(screen.getByDisplayValue("Read a book"), {
    target: { value: "Read two chapters" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: 'Mark "Read two chapters" completed',
    })
  );

  const task = screen.getByText("Read two chapters").closest("li");
  expect(task).toHaveClass("task-item-completed");
  expect(localStorage.getItem("managing-state-react-tasks")).toContain(
    '"completed":true'
  );
});

test("confirms before deleting a task", () => {
  const confirm = jest.spyOn(window, "confirm");
  confirm.mockReturnValue(false);
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText("e.g. Plan the week"), {
    target: { value: "Water the plants" },
  });
  fireEvent.change(screen.getByPlaceholderText("Add a few details..."), {
    target: { value: "Water the indoor plants" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Delete Water the plants" })
  );
  expect(screen.getByText("Water the plants")).toBeInTheDocument();

  confirm.mockReturnValue(true);
  fireEvent.click(
    screen.getByRole("button", { name: "Delete Water the plants" })
  );
  expect(screen.queryByText("Water the plants")).not.toBeInTheDocument();
  confirm.mockRestore();
});

test("loads saved tasks and filters the list", () => {
  localStorage.setItem(
    "managing-state-react-tasks",
    JSON.stringify([
      {
        id: "saved-active",
        name: "Active task",
        description: "Still to do",
        completed: false,
      },
      {
        id: "saved-completed",
        name: "Finished task",
        description: "Already done",
        completed: true,
      },
    ])
  );
  render(<App />);

  expect(screen.getByText("Active task")).toBeInTheDocument();
  expect(screen.getByText("Finished task")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox", { name: "Filter tasks" }), {
    target: { value: "completed" },
  });

  const list = screen.getByRole("list");
  expect(within(list).getByText("Finished task")).toBeInTheDocument();
  expect(within(list).queryByText("Active task")).not.toBeInTheDocument();
});
