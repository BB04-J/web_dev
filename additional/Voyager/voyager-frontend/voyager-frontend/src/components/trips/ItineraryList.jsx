import { useState } from "react";

const ItineraryList = ({ items = [], onAdd, onDelete }) => {
  const [form, setForm] = useState({ day: items.length + 1, title: "", time: "", notes: "" });
  const [busy, setBusy] = useState(false);

  const sorted = [...items].sort((a, b) => a.day - b.day);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      await onAdd({ ...form, day: Number(form.day) });
      setForm({ day: Number(form.day) + 1, title: "", time: "", notes: "" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {sorted.length === 0 ? (
        <p style={{ fontSize: "0.85rem" }}>No stops planned yet — add the first one below.</p>
      ) : (
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((item) => (
            <li
              key={item._id}
              className="card"
              style={{
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div>
                <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent)" }}>
                  DAY {item.day} {item.time && `· ${item.time}`}
                </span>
                <p style={{ color: "var(--text-primary)", fontWeight: 600, margin: "2px 0" }}>
                  {item.title}
                </p>
                {item.notes && <p style={{ fontSize: "0.82rem" }}>{item.notes}</p>}
              </div>
              <button
                className="btn btn-danger"
                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                onClick={() => onDelete(item._id)}
                aria-label={`Remove ${item.title}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      )}

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
      >
        <input
          type="number"
          min="1"
          value={form.day}
          onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
          style={{ width: 70 }}
          aria-label="Day number"
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          style={{ width: 110 }}
          aria-label="Time"
        />
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="What's happening?"
          style={{ flex: 1, minWidth: 160 }}
          aria-label="Activity title"
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Add stop
        </button>
      </form>
    </div>
  );
};

export default ItineraryList;
