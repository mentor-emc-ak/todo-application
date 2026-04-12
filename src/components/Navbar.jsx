import "../assets/css/navbar.css";

function LogoutIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="taskr-nav">
      <div className="taskr-nav-inner">
        <div className="taskr-brand">
          <span className="taskr-dot" aria-hidden="true">●</span>
          <span className="taskr-title">EMC Master Class TASKR</span>
        </div>

        {user ? (
          <div className="taskr-user">
            <span className="taskr-username">{user.username}</span>
            <button
              onClick={onLogout}
              className="taskr-logout"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogoutIcon />
              <span>sign out</span>
            </button>
          </div>
        ) : (
          <span className="taskr-tagline">stay on top of things</span>
        )}
      </div>
    </nav>
  );
}
