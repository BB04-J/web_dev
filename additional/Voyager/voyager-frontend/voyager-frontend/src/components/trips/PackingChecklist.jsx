import { useState } from "react";

const PackingChecklist = ({ items = [], onAdd, onToggle, onDelete }) => {
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);

  const packedCount = items.filter((i) => i.packed).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    setBusy(true);
    try {
      await onAdd({ label: label.trim() });
      setLabel("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="mono" style={{ fontSize: "0.8rem", marginBottom: 12 }}>
        {packedCount} / {items.length} packed
      </p>

      {items.length === 0 ? (
        <p style={{ fontSize: "0.85rem" }}>Your bag is empty — start adding items.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((item) => (
            <li
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-inset)",
              }}
            >
              <input
                type="checkbox"
                checked={item.packed}
                onChange={() => onToggle(item._id, !item.packed)}
                id={`pack-${item._id}`}
                style={{ width: "auto" }}
              />
              <label
                htmlFor={`pack-${item._id}`}
                style={{
                  flex: 1,
                  fontSize: "0.88rem",
                  textDecoration: item.packed ? "line-through" : "none",
                  color: item.packed ? "var(--text-muted)" : "var(--text-primary)",
                }}
              >
                {item.label}
              </label>
              <button
                className="btn btn-danger"
                style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                onClick={() => onDelete(item._id)}
                aria-label={`Remove ${item.label}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Add an item (e.g. Passport)"
          style={{ flex: 1 }}
          aria-label="Packing item"
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Add
        </button>
      </form>
    </div>
  );
};

export default PackingChecklist;
