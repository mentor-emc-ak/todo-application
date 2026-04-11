import "../assets/css/navbar.css";

export default function Navbar() {
  return (
    <nav>
      <a href="/" className="logo">
        <img src="../assets/vite.svg" width="32" height="32" alt="Vite logo" />
        <span>Vite</span>
      </a>
      <ul>
        <li>
          <a href="/docs">Docs</a>
        </li>
        <li>
          <a href="/blog">Blog</a>
        </li>
        <li>
          <a href="/showcase">Showcase</a>
        </li>
        <li>
          <a href="/community">Community</a>
        </li>
      </ul>

      <div className="social">
        <a href="https://github.com/vitejs/vite" target="_blank">
          <svg className="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#github-icon"></use>
          </svg>
          GitHub
        </a>
        <a href="https://chat.vite.dev/" target="_blank">
          <svg className="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#discord-icon"></use>
          </svg>
          Discord
        </a>
        <a href="https://x.com/vite_js" target="_blank">
          <svg className="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#x-icon"></use>
          </svg>
          X.com
        </a>
        <a href="https://bsky.app/profile/vite.dev" target="_blank">
          <svg className="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#bluesky-icon"></use>
          </svg>
          Bluesky
        </a>
      </div>
    </nav>
  );
}
