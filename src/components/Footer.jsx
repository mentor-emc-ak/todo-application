export default function Footer() {
  return (
    <footer className="text-center py-5 border-t border-border">
      <p
        className="text-faint text-xs tracking-widest"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        TASKR © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
