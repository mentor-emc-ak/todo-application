import { useState } from "react";
import { useNavigate } from "react-router";

function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function FormField({ label, type, value, onChange, placeholder, showToggle, onToggle, showPassword }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs tracking-widest uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full bg-elevated text-text text-sm px-3 py-2.5 border border-border rounded focus:border-accent outline-none transition-colors duration-150 pr-10"
          style={{ fontFamily: "var(--font-mono)" }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors duration-100 cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const reset = () => {
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const switchMode = (m) => {
    setMode(m);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Small artificial delay for UX feedback
    await new Promise((r) => setTimeout(r, 200));

    if (mode === "signup") {
      const result = onSignup(username, email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      navigate("/"); // Redirect to home page after successful signup
    } else {
      const result = onLogin(email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      navigate("/"); // Redirect to home page after successful login
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Background accent blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle, rgba(240,140,75,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: "250px",
            height: "250px",
            background: "radial-gradient(circle, rgba(240,140,75,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span style={{ color: "var(--color-accent)", fontSize: "0.55rem" }}>●</span>
          <span
            className="text-4xl tracking-widest"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--color-text)" }}
          >
            EMC Master Class TASKR
          </span>
          <span style={{ color: "var(--color-accent)", fontSize: "0.55rem" }}>●</span>
        </div>
        <p
          className="text-xs tracking-widest"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-faint)" }}
        >
          stay on top of things
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm bg-surface border border-border rounded-lg overflow-hidden"
        style={{ borderTop: "3px solid var(--color-accent)" }}
      >
        {/* Mode tabs */}
        <div className="flex border-b border-border">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className="flex-1 py-3 text-xs tracking-widest uppercase transition-colors duration-100 cursor-pointer"
              style={{
                fontFamily: "var(--font-mono)",
                color: mode === m ? "var(--color-accent)" : "var(--color-faint)",
                background: mode === m ? "var(--color-elevated)" : "transparent",
                borderBottom: mode === m ? "2px solid var(--color-accent)" : "2px solid transparent",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {mode === "signup" ? (
            <FormField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your name"
            />
          ) : <></>}
      
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "min. 6 characters" : "••••••••"}
            showToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />

          {/* Error */}
          {error && (
            <p
              className="text-xs px-3 py-2 rounded border"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-danger)",
                borderColor: "var(--color-danger)",
                background: "rgba(224,90,90,0.06)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2.5 rounded text-sm font-medium tracking-widest uppercase transition-opacity duration-150 cursor-pointer disabled:opacity-50"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            {/* condition ? true : false */}
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <p
          className="text-center pb-5 text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-faint)" }}
        >
          {mode === "login" ? (
            <>
              no account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="cursor-pointer transition-colors duration-100"
                style={{ color: "var(--color-accent)" }}
              >
                sign up
              </button>
            </>
          ) : (
            <>
              already have one?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="cursor-pointer transition-colors duration-100"
                style={{ color: "var(--color-accent)" }}
              >
                sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
