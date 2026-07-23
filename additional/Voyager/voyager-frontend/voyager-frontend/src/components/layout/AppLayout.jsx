import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  return (
    <div className="cinematic-body-wrap" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1, padding: isDashboard ? 0 : "96px 0 64px" }}>
        {isDashboard ? (
          <Outlet />
        ) : (
          <div className="container">
            <Outlet />
          </div>
        )}
      </main>
      {!isDashboard && (
        <footer
          className="mono"
          style={{
            textAlign: "center",
            padding: "20px 0",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            borderTop: "1px solid var(--surface-border)",
            background: "rgba(3, 7, 18, 0.4)",
            backdropFilter: "blur(10px)",
          }}
        >
          VOYAGER · PLAN · EXPLORE · BUILD
        </footer>
      )}
    </div>
  );
};

export default AppLayout;
