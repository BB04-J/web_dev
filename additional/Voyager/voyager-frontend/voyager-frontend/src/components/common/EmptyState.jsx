const EmptyState = ({ icon = "🧭", title, description, action }) => (
  <div
    className="card"
    style={{
      padding: "48px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    }}
  >
    <span style={{ fontSize: "2rem" }}>{icon}</span>
    <h3 style={{ fontSize: "1.15rem" }}>{title}</h3>
    {description && (
      <p style={{ maxWidth: 380, margin: "0 auto" }}>{description}</p>
    )}
    {action && <div style={{ marginTop: 8 }}>{action}</div>}
  </div>
);

export default EmptyState;
