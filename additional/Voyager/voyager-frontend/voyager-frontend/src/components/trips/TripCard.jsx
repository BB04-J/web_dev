import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

const formatDateRange = (start, end) => {
  const opts = { month: "short", day: "numeric" };
  const s = new Date(start).toLocaleDateString("en-US", opts);
  const e = new Date(end).toLocaleDateString("en-US", opts);
  return `${s} — ${e}`;
};

const daysUntil = (date) => {
  const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

const getCurrencySymbol = (code) => {
  switch (code) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "JPY": return "¥";
    case "INR": return "₹";
    case "AUD": return "A$";
    case "CAD": return "C$";
    default: return "$";
  }
};

const TripCard = ({ trip }) => {
  const spent = (trip.budgetItems || []).reduce((s, b) => s + b.amount, 0);
  const packedCount = (trip.packingList || []).filter((p) => p.packed).length;
  const totalPacking = (trip.packingList || []).length;
  const remaining = daysUntil(trip.startDate);

  return (
    <Link
      to={`/trips/${trip._id}`}
      className="card"
      style={{
        display: "block",
        padding: 20,
        textDecoration: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{trip.title}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
            {trip.destination}
            {trip.country ? `, ${trip.country}` : ""}
          </p>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <p className="mono" style={{ fontSize: "0.78rem", marginBottom: 14, color: "var(--text-secondary)" }}>
        {formatDateRange(trip.startDate, trip.endDate)}
        {remaining > 0 && trip.status !== "completed"
          ? ` · in ${remaining}d`
          : ""}
      </p>

      <div
        style={{
          display: "flex",
          gap: 18,
          fontSize: "0.78rem",
          color: "var(--text-secondary)",
        }}
        className="mono"
      >
        <span>
          💰 {getCurrencySymbol(trip.currency)}{spent}
          {trip.budgetLimit ? ` / ${getCurrencySymbol(trip.currency)}${trip.budgetLimit}` : ""}
        </span>
        {totalPacking > 0 && (
          <span>
            🎒 {packedCount}/{totalPacking} packed
          </span>
        )}
        <span>🗓️ {trip.itinerary?.length || 0} stops</span>
      </div>
    </Link>
  );
};

export default TripCard;
