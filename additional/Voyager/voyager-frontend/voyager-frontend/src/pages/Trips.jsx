import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import useTrips from "../hooks/useTrips";
import { tripsAtom, tripsLoadingAtom, tripsErrorAtom } from "../recoil/atoms";
import TripCard from "../components/trips/TripCard";
import TripForm from "../components/trips/TripForm";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

const FILTERS = [
  { value: "", label: "All" },
  { value: "planning", label: "Planning" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

const Trips = () => {
  const { fetchTrips, createTrip } = useTrips();
  const trips = useRecoilValue(tripsAtom);
  const loading = useRecoilValue(tripsLoadingAtom);
  const error = useRecoilValue(tripsErrorAtom);

  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTrips(status || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleCreate = async (payload) => {
    await createTrip(payload);
    setShowForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ position: "relative", minHeight: "calc(100vh - 128px)", color: "#f4efe4" }}
    >
      {/* Background Image overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.3) saturate(0.85) contrast(1.1)",
        zIndex: -1,
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Your Trips</h1>
          <p style={{ color: "rgba(244, 239, 228, 0.6)", fontSize: "0.95rem" }}>Map out itineraries, budgets, and packing lists.</p>
        </div>
        <button className="btn-cinematic" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Close Form" : "+ Plan new trip"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="card"
            style={{ padding: 24, marginBottom: 28, overflow: "hidden" }}
          >
            <h2 style={{ fontSize: "1.1rem", marginBottom: 16, color: "var(--text-primary)", fontWeight: 500 }}>Create an Adventure</h2>
            <TripForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitLabel="Create trip" />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className="btn"
            onClick={() => setStatus(f.value)}
            style={{
              padding: "8px 18px",
              fontSize: "0.82rem",
              fontWeight: 600,
              background: status === f.value ? "var(--accent)" : "rgba(255, 255, 255, 0.03)",
              color: status === f.value ? "#030712" : "rgba(244, 239, 228, 0.7)",
              border: status === f.value ? "1px solid var(--accent)" : "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "9999px",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <Loader label="Loading trips..." />}
      {error && <ErrorMessage message={error} onRetry={() => fetchTrips(status || undefined)} />}

      {!loading && !error && trips.length === 0 && (
        <div className="card" style={{ padding: "48px 24px" }}>
          <EmptyState
            icon="🧭"
            title="No trips here yet"
            description="Create a trip to start building your itinerary, budget, and packing list."
          />
        </div>
      )}

      {!loading && !error && trips.length > 0 && (
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {trips.map((trip, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              key={trip._id}
            >
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Trips;
