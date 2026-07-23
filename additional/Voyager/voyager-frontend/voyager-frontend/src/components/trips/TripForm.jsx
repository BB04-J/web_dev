import { useState } from "react";

const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"];

const TripForm = ({ initial, onSubmit, onCancel, submitLabel = "Save trip" }) => {
  const [form, setForm] = useState({
    title: initial?.title || "",
    destination: initial?.destination || "",
    country: initial?.country || "",
    startDate: toInputDate(initial?.startDate),
    endDate: toInputDate(initial?.endDate),
    budgetLimit: initial?.budgetLimit || "",
    currency: initial?.currency || "USD",
    status: initial?.status || "planning",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.destination || !form.startDate || !form.endDate) {
      setError("Please fill in title, destination, and both dates.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date must be after the start date.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        budgetLimit: form.budgetLimit ? Number(form.budgetLimit) : 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this trip.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {error && (
        <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>
      )}

      <label style={fieldStyle}>
        Trip title
        <input
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Summer in Kyoto"
          required
        />
      </label>

      <div style={{ display: "flex", gap: 12 }}>
        <label style={fieldStyle}>
          Destination
          <input
            value={form.destination}
            onChange={handleChange("destination")}
            placeholder="Kyoto"
            required
          />
        </label>
        <label style={fieldStyle}>
          Country
          <input
            value={form.country}
            onChange={handleChange("country")}
            placeholder="Japan"
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <label style={fieldStyle}>
          Start date
          <input
            type="date"
            value={form.startDate}
            onChange={handleChange("startDate")}
            required
          />
        </label>
        <label style={fieldStyle}>
          End date
          <input
            type="date"
            value={form.endDate}
            onChange={handleChange("endDate")}
            required
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <label style={fieldStyle}>
          Budget limit
          <input
            type="number"
            min="0"
            value={form.budgetLimit}
            onChange={handleChange("budgetLimit")}
            placeholder="1500"
          />
        </label>
        <label style={fieldStyle}>
          Currency
          <select value={form.currency} onChange={handleChange("currency")}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label style={fieldStyle}>
          Status
          <select value={form.status} onChange={handleChange("status")}>
            <option value="planning">Planning</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            className="btn btn-ghost"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
  flex: 1,
};

export default TripForm;
