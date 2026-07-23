import { useState } from "react";
import useCurrency from "../../hooks/useCurrency";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "SGD", "THB"];

const CurrencyConverter = ({ defaultFrom = "USD", defaultTo = "EUR" }) => {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [amount, setAmount] = useState(100);

  const { rate, date, convert, loading, error } = useCurrency(from, to);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        <label style={fieldStyle}>
          Amount
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <label style={fieldStyle}>
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          aria-label="Swap currencies"
          style={{ marginBottom: 1 }}
        >
          ⇄
        </button>
        <label style={fieldStyle}>
          To
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 18 }}>
        {loading && <p className="mono" style={{ fontSize: "0.85rem" }}>Fetching latest rate…</p>}
        {error && <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>}
        {!loading && !error && rate != null && (
          <>
            <p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {amount} {from} = {convert(amount)} {to}
            </p>
            <p className="mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              1 {from} = {rate} {to} {date ? `· as of ${date}` : ""}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
};

export default CurrencyConverter;
