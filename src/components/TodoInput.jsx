import { useState } from "react";

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="add a new task..."
        className="flex-1 bg-transparent text-text placeholder-faint text-sm py-1.5 border-b border-border focus:border-accent outline-none transition-colors duration-150"
        style={{ fontFamily: "var(--font-mono)" }}
        autoFocus
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="flex items-center justify-center w-8 h-8 rounded bg-accent text-bg text-lg font-bold leading-none transition-opacity duration-150 disabled:opacity-25 hover:opacity-90 cursor-pointer disabled:cursor-default"
        aria-label="Add task"
      >
        +
      </button>
    </form>
  );
}
