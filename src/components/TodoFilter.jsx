import { memo } from "react";

const FILTERS = [
  { key: "all", label: "ALL" },
  { key: "active", label: "ACTIVE" },
  { key: "completed", label: "DONE" },
];

function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  totalCount,
  onClearCompleted,
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border">
      <div className="flex items-center gap-1">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-2.5 py-1 text-xs tracking-widest rounded transition-colors duration-100 cursor-pointer ${
              filter === key
                ? "text-accent bg-elevated font-medium"
                : "text-faint hover:text-muted"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {totalCount > 0 && (
          <span className="text-xs text-faint" style={{ fontFamily: "var(--font-mono)" }}>
            {activeCount}/{totalCount}
          </span>
        )}
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-faint hover:text-danger transition-colors duration-100 cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            clear done
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(TodoFilter);
