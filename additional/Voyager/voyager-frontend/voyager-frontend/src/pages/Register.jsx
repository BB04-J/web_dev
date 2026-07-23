import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// SVG Logo and Icons
const TravelLogo = () => (
  <svg width="220" height="70" viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 8 }}>
    {/* T */}
    <path d="M10 20 H36 V27 H28 V60 H18 V27 H10 V20 Z" fill="white" />
    {/* R */}
    <path d="M42 20 H62 C68 20 72 23 72 28.5 C72 32.5 69 35.5 64 36.5 L73 60 H62 L54 37 H51 V60 H42 V20 Z M51 27 V31.5 H61 C63 31.5 64.5 30.5 64.5 29 C64.5 27.5 63 27 H61 H51 Z" fill="white" />
    {/* A */}
    <path d="M86 20 L99 60 H89 L86 49 H77 L74 60 H64 L77 20 H86 Z M83 31 L80 41 H84 Z" fill="white" />
    {/* V with smiling face inside */}
    <path d="M104 20 H114 L121 44 L128 20 H138 L126 60 H116 L104 20 Z" fill="white" />
    {/* E */}
    <path d="M144 20 H166 V27 H154 V35 H163 V42 H154 V52 H166 V60 H144 V20 Z" fill="white" />
    {/* L */}
    <path d="M172 20 H181 V52 H195 V60 H172 V20 Z" fill="white" />
    {/* Orange underline under RAVE (starts under R at x=42 and ends under L at x=195) */}
    <rect x="42" y="64" width="153" height="3" fill="#e8a33d" />
    {/* Smiling face sitting in the V */}
    <circle cx="121" cy="22" r="7" fill="white" />
    <circle cx="119" cy="20" r="1" fill="black" />
    <circle cx="123" cy="20" r="1" fill="black" />
    <path d="M119 24 Q121 26.5 123 24" stroke="black" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    {/* Orange dots above V (antennas) */}
    <circle cx="116" cy="11" r="2.5" fill="#e8a33d" />
    <circle cx="126" cy="11" r="2.5" fill="#e8a33d" />
  </svg>
);

const UserIcon = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const NameIcon = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const LockIcon = () => (
  <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-campsite-bg" />
      <div className="auth-overlay-top" />
      <div className="auth-overlay-bottom" />

      <div className="auth-container">
        <div className="auth-logo-section">
          <TravelLogo />
          <p className="auth-subtitle">We pursue a relaxed travel experience</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: 60 }}>
          {error && <p className="auth-error">{error}</p>}

          <div className="auth-input-group">
            <input
              className="auth-input"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
            />
            <NameIcon />
          </div>

          <div className="auth-input-group">
            <input
              className="auth-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Username (Email)"
            />
            <UserIcon />
          </div>

          <div className="auth-input-group">
            <input
              className="auth-input"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Password"
            />
            <LockIcon />
          </div>

          <div className="auth-button-group">
            <button
              type="submit"
              className="auth-btn auth-btn-filled"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
            <button
              type="button"
              className="auth-btn auth-btn-outline"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>

          <div className="auth-footer">
            <Link to="#" className="auth-link" onClick={() => alert("Password recovery is under development.")}>
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
