import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { auth } from "../config/firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

const STORAGE_KEY = "taskr-ai-chat";
const STARTER_MESSAGES = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content:
      "I can help you prioritize your list, turn tasks into a plan, or break down the next step. Ask me about the work already in your account and I will use your current task snapshot for context.",
  },
];
const SUGGESTIONS = [
  "Prioritize my current tasks",
  "Turn my list into a plan for today",
  "Break my next task into smaller steps",
];

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.7 5.1L19 9l-5.3 1.9L12 16l-1.7-5.1L5 9l5.3-1.9L12 2z" />
      <path d="M19 14l.9 2.7 2.8 1-2.8 1-.9 2.7-.9-2.7-2.8-1 2.8-1 .9-2.7z" />
      <path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12a9 9 0 101.9-5.5" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

function createStarterMessages() {
  return STARTER_MESSAGES.map((message) => ({ ...message }));
}

function createMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

function readStoredChatState() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.messages)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function MessageBubble({ message }) {
  const isAssistant = message.role === "assistant";

  return (
    <article
      className={`taskr-chat-message ${
        isAssistant ? "taskr-chat-message--assistant" : "taskr-chat-message--user"
      }`}
    >
      <p className="taskr-chat-message__role">{isAssistant ? "Taskr AI" : "You"}</p>
      <p className="taskr-chat-message__content">{message.content}</p>
    </article>
  );
}

export default function ChatWidget() {
  const storedState = readStoredChatState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => storedState?.messages ?? createStarterMessages());
  const [sessionId, setSessionId] = useState(() => storedState?.sessionId ?? null);
  const [modelLabel, setModelLabel] = useState(() => storedState?.model ?? "gpt-4o");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const viewportRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionId,
        messages,
        model: modelLabel,
      })
    );
  }, [messages, modelLabel, sessionId]);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const node = viewportRef.current;

    if (!node) {
      return;
    }

    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [isOpen, isSending, messages]);

  async function sendMessage(rawMessage) {
    const trimmed = rawMessage.trim();

    if (!trimmed || isSending) {
      return;
    }

    const userMessage = createMessage("user", trimmed);

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const headers = await authHeaders();
      const payload = {
        message: trimmed,
        ...(sessionId ? { sessionId } : {}),
      };

      const { data } = await api.post(
        "/assistant/chat",
        payload,
        { headers }
      );

      setSessionId(data.sessionId);
      setModelLabel(data.model || "gpt-4o");
      setMessages((current) => [...current, createMessage("assistant", data.message.content)]);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "The assistant is unavailable right now. Check the server Copilot configuration and try again."
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleReset() {
    const activeSessionId = sessionId;

    setMessages(createStarterMessages());
    setSessionId(null);
    setError("");
    setDraft("");

    if (!activeSessionId) {
      return;
    }

    try {
      const headers = await authHeaders();
      await api.delete(`/assistant/sessions/${activeSessionId}`, { headers });
    } catch {
      return;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(draft);
    }
  }

  const showSuggestions = messages.length === STARTER_MESSAGES.length;

  return (
    <div className="taskr-chat-shell">
      {isOpen && (
        <section id="taskr-ai-assistant" className="taskr-chat-window" aria-label="Taskr AI assistant">
          <header className="taskr-chat-header">
            <div>
              <p className="taskr-chat-header__eyebrow">GitHub Copilot SDK</p>
              <h2 className="taskr-chat-header__title">Task board copilot</h2>
              <p className="taskr-chat-header__meta">
                <span className="taskr-chat-status-dot" />
                <span>{isSending ? "thinking" : "live"}</span>
                <span className="taskr-chat-header__divider" />
                <span>{modelLabel}</span>
              </p>
            </div>

            <div className="taskr-chat-header__actions">
              <button
                type="button"
                className="taskr-chat-icon-button"
                onClick={() => void handleReset()}
                disabled={isSending}
                aria-label="Start a new chat"
                title="New chat"
              >
                <ResetIcon />
              </button>
              <button
                type="button"
                className="taskr-chat-icon-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                title="Close"
              >
                <CloseIcon />
              </button>
            </div>
          </header>

          <div className="taskr-chat-band">
            Ask about prioritization, sequencing, rewriting tasks, or what to tackle next.
          </div>

          {showSuggestions && (
            <div className="taskr-chat-suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="taskr-chat-suggestion"
                  onClick={() => void sendMessage(suggestion)}
                  disabled={isSending}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div ref={viewportRef} className="taskr-chat-log">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isSending && (
              <article className="taskr-chat-message taskr-chat-message--assistant taskr-chat-message--loading">
                <p className="taskr-chat-message__role">Taskr AI</p>
                <p className="taskr-chat-message__content">Thinking through your task board...</p>
              </article>
            )}
          </div>

          {error && <p className="taskr-chat-error">{error}</p>}

          <form className="taskr-chat-form" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              className="taskr-chat-textarea"
              placeholder="Ask about your workload, next step, or how to sequence tasks..."
              rows={3}
              maxLength={2000}
              disabled={isSending}
            />

            <div className="taskr-chat-form__footer">
              <p className="taskr-chat-form__hint">Enter to send. Shift+Enter for a new line.</p>
              <button
                type="submit"
                className="taskr-chat-submit"
                disabled={!draft.trim() || isSending}
              >
                <SendIcon />
                <span>Send</span>
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`taskr-chat-launcher ${isOpen ? "taskr-chat-launcher--active" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="taskr-ai-assistant"
      >
        <span className="taskr-chat-launcher__pulse" />
        <span className="taskr-chat-launcher__icon">
          <SparkIcon />
        </span>
        <span className="taskr-chat-launcher__copy">
          <strong>Ask AI</strong>
          <small>task-aware gpt-4o chat</small>
        </span>
      </button>
    </div>
  );
}