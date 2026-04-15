import { useState, useMemo, useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import TodoFilter from "./components/TodoFilter";
import AuthPage from "./components/AuthPage";
import { useTodos } from "./hooks/useTodos";
import { useAuth } from "./hooks/useAuth";
import axios from "axios";

function TodoApp({ user }) {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
  } = useTodos(user.id);

  const [filter, setFilter] = useState("all");

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  }), [todos, filter]);

  return (
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
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
});


function App() {
  const { user, signup, login, logout } = useAuth();

  // fetch('https://dummyjson.com/todos')
  //   .then(res => res.json())
  //   .then(console.log);

  async function fetchTodos() {
    try {
      const res = await axiosInstance.get('/todos');
      const todoRes = await axiosInstance.get(`/todo/${res.data.todos[0].id}`);
      console.log(todoRes.data);
    } catch (err) {
      console.error(err);
    }
  }
  // axiosInstance.get('/todos')
  //   .then(res => res.data)
  //   .then(data => {
  //     console.log(data)
  //     console.log(data.todos[0])
  //     axiosInstance.get(`/todo/${data.todos[0].id}`)
  //       .then(res => res.data)
  //       .then(todo => console.log(todo))
  //   })
  //   .catch(err => console.error(err));

  useEffect(() => {
    fetchTodos();
  }, []);



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage onLogin={login} onSignup={signup} />} />
        <Route path="/" element={
          <ProtectedRoute>
            <div className="min-h-screen flex flex-col">
              <Navbar user={user} onLogout={logout} />
              <TodoApp user={user} />
              <Footer />
            </div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );

  // // if not logged in, show auth page (true)
  // if (!user) {
  //   return <AuthPage onLogin={login} onSignup={signup} />;
  // }

  // return (
  //   <div className="min-h-screen flex flex-col">
  //     <Navbar user={user} onLogout={logout} />
  //     <TodoApp user={user} />
  //     <Footer />
  //   </div>
  // );
}

export default App;

