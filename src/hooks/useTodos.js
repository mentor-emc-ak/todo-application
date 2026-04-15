import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { auth } from "../config/firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalize(todo) {
  return { ...todo, id: todo._id ?? todo.id };
}

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTodos() {
      try {
        setLoading(true);
        const headers = await authHeaders();
        const { data } = await api.get("/todos", { headers });
        if (!cancelled) setTodos(data.map(normalize));
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTodos();
    return () => { cancelled = true; };
  }, []);

  const addTodo = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const headers = await authHeaders();
    const { data } = await api.post("/todos", { text: trimmed }, { headers });
    setTodos((prev) => [normalize(data), ...prev]);
  }, []);

  const toggleTodo = useCallback(async (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const headers = await authHeaders();
    const { data } = await api.patch(`/todos/${id}`, { completed: !todo.completed }, { headers });
    setTodos((prev) => prev.map((t) => (t.id === id ? normalize(data) : t)));
  }, [todos]);

  const deleteTodo = useCallback(async (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    const headers = await authHeaders();
    await api.delete(`/todos/${id}`, { headers });
  }, []);

  const editTodo = useCallback(async (id, text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      await deleteTodo(id);
      return;
    }
    const headers = await authHeaders();
    const { data } = await api.patch(`/todos/${id}`, { text: trimmed }, { headers });
    setTodos((prev) => prev.map((t) => (t.id === id ? normalize(data) : t)));
  }, [deleteTodo]);

  const clearCompleted = useCallback(async () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
    const headers = await authHeaders();
    await api.delete("/todos/completed", { headers });
  }, []);

  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
  };
}
