const LABELS = {
  planning: "Planning",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

const StatusBadge = ({ status = "planning" }) => (
  <span
    className="status-badge"
    style={{
      "--dot-color": `var(--status-${status})`,
      color: "var(--text-secondary)",
      fontWeight: 600,
    }}
  >
    {LABELS[status] || status}
  </span>
);

export default StatusBadge;
