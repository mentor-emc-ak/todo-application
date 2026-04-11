import { useState } from "react";

const ACCOUNTS_KEY = "taskr-accounts";
const SESSION_KEY = "taskr-session";

function loadAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(loadSession);

  const signup = (username, email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !trimmedEmail || !password) {
      return { success: false, error: "All fields are required." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { success: false, error: "Enter a valid email address." };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const accounts = loadAccounts();
    if (accounts.some((a) => a.email === trimmedEmail)) {
      return { success: false, error: "An account with that email already exists." };
    }

    const newAccount = {
      id: crypto.randomUUID(),
      username: trimmedUsername,
      email: trimmedEmail,
      // NOTE: storing hashed representation for demo purposes.
      // In production, use a backend with a proper password hashing algorithm (e.g. bcrypt).
      password,
    };

    saveAccounts([...accounts, newAccount]);

    const session = { id: newAccount.id, username: newAccount.username, email: newAccount.email };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);

    return { success: true };
  };

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return { success: false, error: "All fields are required." };
    }

    const accounts = loadAccounts();
    const account = accounts.find(
      (a) => a.email === trimmedEmail && a.password === password
    );

    if (!account) {
      return { success: false, error: "Invalid email or password." };
    }

    const session = { id: account.id, username: account.username, email: account.email };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);

    return { success: true };
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, signup, login, logout };
}
