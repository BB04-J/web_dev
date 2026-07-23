import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../common/ThemeToggle";

const navLinkStyle = ({ isActive }) => ({
  padding: "8px 4px",
  fontSize: "0.92rem",
  fontWeight: 600,
  fontFamily: "var(--font-body)",
  color: isActive ? "var(--accent)" : "rgba(244, 239, 228, 0.7)",
  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
  transition: "color var(--transition)",
});

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={isScrolled ? "navbar-scrolled" : ""}
      style={{
        borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
        background: isScrolled ? "rgba(3, 7, 18, 0.65)" : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          gap: 16,
          position: "relative",
        }}
      >
        <NavLink
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#fff",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span aria-hidden>🧭</span> Voyager
        </NavLink>

        {isAuthenticated && (
          <nav
            style={{
              display: "flex",
              gap: 24,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            aria-label="Primary"
          >
            <NavLink to="/" end style={navLinkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/trips" style={navLinkStyle}>
              Trips
            </NavLink>
            <NavLink to="/discover" style={navLinkStyle}>
              Discover
            </NavLink>
            <NavLink to="/wishlist" style={navLinkStyle}>
              Wishlist
            </NavLink>
          </nav>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span
                className="mono"
                style={{ fontSize: "0.8rem", color: "rgba(244, 239, 228, 0.6)" }}
              >
                {user?.name?.split(" ")[0]}
              </span>
              <button className="btn btn-ghost" onClick={handleLogout} style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff", background: "rgba(255,255,255,0.02)" }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost" style={{ color: "#fff" }}>
                Log in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
