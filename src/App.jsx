import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import TodoFilter from "./components/TodoFilter";
import { useTodos } from "./hooks/useTodos";

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
  } = useTodos();

  const [filter, setFilter] = useState("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-xl">

          {/* Page header */}
          <div className="mb-8">
            <h1
              className="text-5xl tracking-tight text-text leading-none"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
            >
              MY TASKS
            </h1>
            <p className="text-muted text-xs mt-2 tracking-widest uppercase">
              {activeCount === 0 && todos.length > 0
                ? "all caught up ✓"
                : activeCount === 0
                ? "nothing here yet"
                : `${activeCount} task${activeCount !== 1 ? "s" : ""} remaining`}
            </p>
          </div>

          {/* Todo panel */}
          <div
            className="bg-surface rounded-lg border border-border overflow-hidden"
            style={{ borderLeft: "3px solid var(--color-accent)" }}
          >
            {/* Input */}
            <div className="px-4 py-3.5 border-b border-border">
              <TodoInput onAdd={addTodo} />
            </div>

            {/* Filter bar */}
            <TodoFilter
              filter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              totalCount={todos.length}
              onClearCompleted={clearCompleted}
            />

            {/* Todo list */}
            <div>
              {filteredTodos.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-faint text-sm tracking-wide">
                    {filter === "completed"
                      ? "no completed tasks yet"
                      : filter === "active"
                      ? "no active tasks"
                      : "add your first task above"}
                  </p>
                </div>
              ) : (
                <ul>
                  {filteredTodos.map((todo) => (
                    <li key={todo.id} className="border-b border-border last:border-b-0">
                      <TodoItem
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer hint */}
          {todos.length > 0 && (
            <p className="text-center text-faint text-xs mt-5 tracking-wide">
              double-click a task to edit · press esc to cancel
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

