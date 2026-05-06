import React, { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "TTEEESSSTTT 1", completed: false },
    { id: 2, text: "TTEEESSSTTT 2", completed: true },
    { id: 3, text: "TTEEESSSTTT 3", completed: false },
  ]);
  const [filter, setFilter] = useState("all");

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">
      <h1>Todo App</h1>
      <TodoForm onAdd={addTodo} />
      <div className="filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "active" : ""}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("done")}
          className={filter === "done" ? "active" : ""}
        >
          Done
        </button>
      </div>
      <p>{remainingCount} remaining</p>
      <TodoList
        todos={filteredTodos}
        onDelete={deleteTodo}
        onToggle={toggleTodo}
      />
    </div>
  );
}

export default App;
