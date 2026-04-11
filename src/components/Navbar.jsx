import "../assets/css/navbar.css";

export default function Navbar() {
  return (
    <nav className="taskr-nav">
      <div className="taskr-nav-inner">
        <div className="taskr-brand">
          <span className="taskr-dot" aria-hidden="true">●</span>
          <span className="taskr-title">TASKR</span>
        </div>
        <span className="taskr-tagline">stay on top of things</span>
      </div>
    </nav>
  );
}
