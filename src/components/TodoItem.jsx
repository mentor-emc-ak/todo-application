import { useState, useRef, useEffect } from "react";

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const submitEdit = () => {
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitEdit();
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className="group flex items-start gap-3 px-4 py-3.5 hover:bg-elevated transition-colors duration-100 animate-slide-down">
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-elevated text-text text-sm px-2 py-0.5 border border-accent rounded outline-none"
          style={{ fontFamily: "var(--font-mono)" }}
        />
      ) : (
        <span
          className={`flex-1 text-sm leading-relaxed select-none cursor-default ${
            todo.completed ? "todo-text-done" : "text-text"
          }`}
          onDoubleClick={() => !todo.completed && setIsEditing(true)}
          title={todo.completed ? "" : "Double-click to edit"}
        >
          {todo.text}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100 shrink-0">
        {!todo.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-muted hover:text-accent transition-colors duration-100 rounded cursor-pointer"
            aria-label="Edit task"
          >
            <PencilIcon />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-muted hover:text-danger transition-colors duration-100 rounded cursor-pointer"
          aria-label="Delete task"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
