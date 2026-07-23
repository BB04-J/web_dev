const Loader = ({ label = "Loading" }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: "48px 0",
      color: "var(--text-muted)",
    }}
    role="status"
    aria-live="polite"
  >
    <div
      className="mono"
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        border: "3px solid var(--surface-border)",
        borderTopColor: "var(--accent)",
        animation: "voyager-spin 0.8s linear infinite",
      }}
    />
    <span className="mono" style={{ fontSize: "0.8rem" }}>
      {label}…
    </span>
    <style>{`
      @keyframes voyager-spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);

export default Loader;
