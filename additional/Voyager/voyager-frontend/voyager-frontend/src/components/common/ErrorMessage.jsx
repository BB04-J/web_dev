const ErrorMessage = ({ message = "Something went wrong.", onRetry }) => (
  <div
    role="alert"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      padding: "32px 20px",
      textAlign: "center",
      color: "var(--danger)",
    }}
  >
    <span style={{ fontSize: "1.6rem" }}>⚠️</span>
    <p style={{ color: "var(--danger)", maxWidth: 360 }}>{message}</p>
    {onRetry && (
      <button className="btn btn-ghost" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
