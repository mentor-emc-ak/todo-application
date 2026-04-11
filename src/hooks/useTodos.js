import { useState, useEffect } from "react";

const STORAGE_KEY = "taskr-todos";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id, text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
  };
}
