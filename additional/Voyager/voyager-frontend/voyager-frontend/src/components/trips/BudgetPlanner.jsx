import { useState, useEffect } from "react";
import { travelToolsApi } from "../../api/tripsApi";

const CATEGORIES = ["stay", "food", "transport", "activities", "shopping", "other"];

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

const BudgetPlanner = ({ budgetItems = [], budgetLimit = 0, currency = "USD", onAdd, onDelete }) => {
  const [form, setForm] = useState({ label: "", category: "other", amount: "" });
  const [busy, setBusy] = useState(false);

  const [displayCurrency, setDisplayCurrency] = useState(currency);
  const [conversionRate, setConversionRate] = useState(1);
  const [loadingRate, setLoadingRate] = useState(false);

  // Sync display currency if trip base currency changes
  useEffect(() => {
    setDisplayCurrency(currency);
  }, [currency]);

  useEffect(() => {
    if (displayCurrency === currency) {
      setConversionRate(1);
      return;
    }
    let active = true;
    setLoadingRate(true);
    travelToolsApi.currency({ from: currency, to: displayCurrency, amount: 1 })
      .then((res) => {
        if (active) {
          setConversionRate(res.data.data.rate || 1);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch conversion rate:", err);
      })
      .finally(() => {
        if (active) setLoadingRate(false);
      });
    return () => {
      active = false;
    };
  }, [displayCurrency, currency]);

  const spent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budgetLimit - spent;
  const pctUsed = budgetLimit > 0 ? Math.min(100, Math.round((spent / budgetLimit) * 100)) : 0;

  const convertedSpent = Math.round(spent * conversionRate);
  const convertedLimit = Math.round(budgetLimit * conversionRate);
  const convertedRemaining = Math.round(remaining * conversionRate);

  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    total: budgetItems.filter((i) => i.category === cat).reduce((s, i) => s + i.amount, 0),
  })).filter((c) => c.total > 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.amount) return;
    setBusy(true);
    try {
      await onAdd({ ...form, amount: Number(form.amount) });
      setForm({ label: "", category: "other", amount: "" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {/* Currency View Option */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: "rgba(255,255,255,0.01)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.03)" }}>
        <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>
          💵 View Budget in:
        </span>
        <select
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value)}
          style={{
            padding: "4px 10px",
            borderRadius: "6px",
            background: "var(--bg-inset)",
            border: "1px solid var(--surface-border)",
            color: "var(--text-primary)",
            fontSize: "0.82rem",
            fontWeight: 600
          }}
        >
          {["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "SGD", "THB"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 6 }}>
          <span className="mono" style={{ color: "var(--text-primary)" }}>
            {getCurrencySymbol(displayCurrency)}{convertedSpent} / {budgetLimit ? `${getCurrencySymbol(displayCurrency)}${convertedLimit}` : "—"}
            {loadingRate && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 6 }}>(converting...)</span>}
          </span>
          <span
            className="mono"
            style={{ color: remaining < 0 ? "var(--danger)" : "var(--text-muted)" }}
          >
            {budgetLimit ? (remaining < 0 ? `${getCurrencySymbol(displayCurrency)}${Math.abs(convertedRemaining)} over` : `${getCurrencySymbol(displayCurrency)}${convertedRemaining} left`) : ""}
          </span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 999,
            background: "var(--bg-inset)",
            overflow: "hidden",
            border: "1px solid var(--surface-border)",
          }}
        >
          <div
            style={{
              width: `${pctUsed}%`,
              height: "100%",
              background: pctUsed >= 100 ? "var(--danger)" : "var(--accent)",
              transition: "width 220ms ease",
            }}
          />
        </div>
      </div>

      {byCategory.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {byCategory.map((c) => (
            <span key={c.category} className="status-badge" style={{ color: "var(--text-secondary)" }}>
              {c.category}: {getCurrencySymbol(displayCurrency)}{Math.round(c.total * conversionRate)}
            </span>
          ))}
        </div>
      )}

      {budgetItems.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>No expenses logged yet.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {budgetItems.map((item) => (
            <li
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-inset)",
              }}
            >
              <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
                {item.label}{" "}
                <span className="mono" style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>
                  {item.category}
                </span>
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="mono" style={{ color: "var(--text-primary)", fontSize: "0.88rem" }}>
                  {getCurrencySymbol(displayCurrency)}{Math.round(item.amount * conversionRate)}
                  {displayCurrency !== currency && (
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: 6 }}>
                      (originally {item.amount} {currency})
                    </span>
                  )}
                </span>
                <button
                  className="btn btn-danger"
                  style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                  onClick={() => onDelete(item._id)}
                  aria-label={`Remove ${item.label}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        <input
          value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          placeholder="Expense label"
          style={{ flex: 1, minWidth: 140 }}
          aria-label="Expense label"
        />
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          aria-label="Category"
          style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--bg-inset)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          placeholder="Amount"
          style={{ width: 100 }}
          aria-label="Amount"
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Add
        </button>
      </form>
    </div>
  );
};

export default BudgetPlanner;
