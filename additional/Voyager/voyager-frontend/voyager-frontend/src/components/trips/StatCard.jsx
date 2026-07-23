const StatCard = ({ icon, label, value, accent }) => (
  <div className="card" style={{ padding: "18px 20px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontSize: "1.4rem",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-inset)",
        }}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <p
          className="mono"
          style={{ fontSize: "1.5rem", fontWeight: 700, color: accent || "var(--text-primary)" }}
        >
          {value}
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{label}</p>
      </div>
    </div>
  </div>
);

export default StatCard;
