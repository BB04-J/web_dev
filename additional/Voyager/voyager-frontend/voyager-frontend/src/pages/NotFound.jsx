import { Link } from "react-router-dom";

const NotFound = () => (
  <div
    style={{
      minHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: 12,
    }}
  >
    <span style={{ fontSize: "2.4rem" }}>🧭</span>
    <h1 style={{ fontSize: "1.6rem" }}>Off the map</h1>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary">
      Back to dashboard
    </Link>
  </div>
);

export default NotFound;
