import useDestinationSearch from "../../hooks/useDestinationSearch";

const DestinationSearchBox = ({ onSelect, placeholder = "Search for a city…" }) => {
  const { query, setQuery, results, loading } = useDestinationSearch();

  return (
    <div style={{ position: "relative" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search destinations"
        style={{ width: "100%" }}
      />

      {query.trim().length >= 2 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 99,
            maxHeight: 280,
            overflowY: "auto",
            padding: 6,
            background: "var(--bg-elevated)",
            border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
          }}
        >
          {loading && (
            <p className="mono" style={{ fontSize: "0.78rem", padding: 10, color: "var(--text-secondary)" }}>
              Searching…
            </p>
          )}
          {!loading && results.length === 0 && (
            <p style={{ fontSize: "0.82rem", padding: 10, color: "var(--text-secondary)" }}>No matches found.</p>
          )}
          {!loading &&
            results.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => {
                  onSelect(place);
                  setQuery(""); // Clear query to close suggestion panel automatically
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  transition: "background var(--transition)"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-inset)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontWeight: 600, display: "block", color: "var(--text-primary)" }}>{place.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", display: "block", marginTop: 2 }}>
                  {place.admin1 ? `${place.admin1}, ` : ""}
                  {place.country}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default DestinationSearchBox;
