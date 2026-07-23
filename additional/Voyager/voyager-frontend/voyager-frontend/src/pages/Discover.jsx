import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DestinationSearchBox from "../components/trips/DestinationSearchBox";
import WeatherWidget from "../components/trips/WeatherWidget";
import CurrencyConverter from "../components/trips/CurrencyConverter";
import { wishlistApi, travelToolsApi } from "../api/tripsApi";

const Discover = () => {
  const [selected, setSelected] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [activePin, setActivePin] = useState(null);

  const navigate = useNavigate();

  const fetchTrendingBatch = async (pageNum = 1) => {
    if (pageNum === 1) setTrendingLoading(true);
    else setLoadingMore(true);

    try {
      const { data } = await travelToolsApi.trending({ page: pageNum, limit: 6 });
      const newItems = data.data || [];
      setTrending((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed loading trending spots:", err);
    } finally {
      setTrendingLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTrendingBatch(1);
  }, []);

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (selected) return;
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 250
      ) {
        if (hasMore && !loadingMore && !trendingLoading) {
          fetchTrendingBatch(page + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, trendingLoading, page, selected]);

  const handleSelect = async (place) => {
    setSelected(place);
    setSavedMessage("");
    setPlacesLoading(true);
    try {
      const { data } = await travelToolsApi.explore(place.name);
      setPlaces(data.data);
    } catch (err) {
      console.error("Failed loading places:", err);
    } finally {
      setPlacesLoading(false);
    }
  };

  const handleSaveToWishlist = async () => {
    try {
      await wishlistApi.add({
        name: selected.name,
        country: selected.country,
        coordinates: { lat: selected.lat, lon: selected.lon },
      });
      setSavedMessage("Saved to your wishlist ✓");
    } catch (err) {
      setSavedMessage(err.response?.data?.message || "Could not save this destination.");
    }
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
        backgroundImage: `url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.3) saturate(0.8) contrast(1.15)",
        zIndex: -1,
        pointerEvents: "none"
      }} />

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "2.2rem", fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)", marginBottom: 6 }}>Discover</h1>
        <p style={{ color: "rgba(244, 239, 228, 0.6)", fontSize: "0.95rem" }}>
          Search for a destination to check the weather, and explore local restaurants, sights, and currencies.
        </p>
      </div>

      <div style={{ maxWidth: 460, marginBottom: 32 }}>
        <DestinationSearchBox onSelect={handleSelect} />
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 28 }}
          >
            {/* Top Row: Info card, Weather & Converter */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: "1.4rem", color: "var(--text-primary)", fontWeight: 500 }}>{selected.name}</h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {selected.admin1 ? `${selected.admin1}, ` : ""}
                      {selected.country}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <button className="btn-cinematic" onClick={handleSaveToWishlist} style={{ fontSize: "0.8rem", padding: "8px 18px" }}>
                      ♡ Save to wishlist
                    </button>
                    <button
                      className="btn-cinematic-secondary"
                      style={{ fontSize: "0.8rem", padding: "8px 18px" }}
                      onClick={() => navigate("/trips")}
                    >
                      Plan a trip →
                    </button>
                  </div>
                </div>
                {savedMessage && <p style={{ fontSize: "0.85rem", color: "var(--success)", fontWeight: 500, marginBottom: 16 }}>{savedMessage}</p>}
                <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: 12, fontWeight: 500 }}>Current Weather</h3>
                <WeatherWidget lat={selected.lat} lon={selected.lon} destination={selected.name} />
              </div>

              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: 18, fontWeight: 500 }}>Currency Converter</h3>
                <CurrencyConverter />
              </div>
            </div>

            {/* Bottom Row: Places Explorer & Interactive Map */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {/* Destination Explorer & Nearby Attractions */}
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 16, fontWeight: 500 }}>🧭 Destination Explorer</h3>
                {placesLoading ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading nearby spots...</p>
                ) : places.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No attractions found. Try another city.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {places.map((place, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActivePin(idx)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          background: activePin === idx ? "var(--bg-inset)" : "var(--bg-inset)",
                          border: activePin === idx ? "1px solid var(--accent)" : "1px solid var(--surface-border)",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, color: activePin === idx ? "var(--accent)" : "var(--text-primary)", fontSize: "0.92rem" }}>
                            {place.name}
                          </span>
                          <span style={{ fontSize: "0.85rem", color: "var(--accent)" }}>⭐ {place.rating}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          <span>{place.category} · {place.distance}</span>
                          <span>🕒 {place.hours}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Map (Mapbox Style Widget) */}
              <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 12, fontWeight: 500 }}>🗺️ Interactive Map (Mapbox)</h3>
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    minHeight: "260px",
                    borderRadius: "12px",
                    background: "#0c101d",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {/* Grid Lines mockup to resemble Mapbox coordinates */}
                  <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }} />

                  {/* Stylized custom SVG map outline */}
                  <svg width="80%" height="80%" viewBox="0 0 100 100" style={{ opacity: 0.15, pointerEvents: "none" }}>
                    <path d="M10 20 Q 30 10 50 40 T 90 20 T 70 80 T 20 90 Z" fill="none" stroke="#fff" strokeWidth="1" />
                    <path d="M30 40 Q 60 50 40 80 T 10 90" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2,2" />
                  </svg>

                  <p style={{ position: "absolute", bottom: 12, left: 12, fontSize: "0.7rem", color: "rgba(244, 239, 228, 0.4)", fontFamily: "monospace" }}>
                    Mapbox Coordinate Layer: {selected.lat.toFixed(4)}° N, {selected.lon.toFixed(4)}° E
                  </p>

                  {/* Dynamic interactive Mapbox Pins */}
                  {places.map((place, idx) => {
                    const x = 20 + (idx * 15) % 60;
                    const y = 30 + (idx * 12) % 50;
                    const isActive = activePin === idx;
                    return (
                      <motion.div
                        key={idx}
                        onClick={() => setActivePin(idx)}
                        animate={{ scale: isActive ? 1.35 : 1, y: isActive ? -4 : 0 }}
                        style={{
                          position: "absolute",
                          left: `${x}%`,
                          top: `${y}%`,
                          cursor: "pointer",
                          zIndex: isActive ? 20 : 10
                        }}
                      >
                        <span style={{ fontSize: "1.4rem", filter: isActive ? "drop-shadow(0 0 8px var(--accent))" : "none" }}>📍</span>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                              position: "absolute",
                              left: "50%",
                              bottom: "100%",
                              transform: "translateX(-50%)",
                              background: "#0d0f17",
                              border: "1px solid var(--accent)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              whiteSpace: "nowrap",
                              fontSize: "0.7rem",
                              color: "#fff",
                              pointerEvents: "none"
                            }}
                          >
                            {place.name}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: 32 }}
          >
            {/* Currency Converter Fallback */}
            <div className="card" style={{ padding: 28, maxWidth: 480 }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: 18, fontWeight: 500 }}>Currency Converter</h3>
              <CurrencyConverter />
            </div>

            {/* Trending Section */}
            <div>
              <h2 style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", fontWeight: 500, color: "#fff", marginBottom: 16 }}>
                🔥 Trending Destinations
              </h2>
              {trendingLoading ? (
                <p style={{ color: "rgba(244, 239, 228, 0.5)", fontSize: "0.9rem" }}>Loading trending locations...</p>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                    {trending.map((t, idx) => (
                      <motion.div
                        key={`${t.city}-${idx}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => {
                          handleSelect({
                            name: t.city,
                            country: t.country,
                            lat: t.lat || 35.6762,
                            lon: t.lon || 139.6503
                          });
                        }}
                        style={{
                          position: "relative",
                          height: "280px",
                          borderRadius: "16px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                        }}
                      >
                        {/* Destination Card Background Photo */}
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url('${t.image}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "brightness(0.55)"
                          }}
                        />

                        {/* Content Overlay */}
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: 20,
                            zIndex: 2
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.72rem", background: "rgba(0,0,0,0.5)", padding: "4px 10px", borderRadius: "9999px", color: "var(--accent)" }}>
                              {t.weather}
                            </span>
                          </div>
                          <div>
                            <p style={{
                              fontSize: "0.8rem",
                              color: "var(--accent)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              marginBottom: 2,
                              letterSpacing: "0.05em",
                              textShadow: "0 2px 4px rgba(0, 0, 0, 0.8), 0 0 1px rgba(0, 0, 0, 0.9)"
                            }}>
                              {t.country}
                            </p>
                            <h3 style={{
                              fontSize: "1.2rem",
                              fontWeight: 600,
                              color: "#fff",
                              marginBottom: 6,
                              textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)"
                            }}>
                              {t.city}
                            </h3>
                            <p style={{
                              fontSize: "0.78rem",
                              color: "rgba(255,255,255,0.85)",
                              lineHeight: "1.3",
                              marginBottom: 12,
                              textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)"
                            }}>
                              {t.description}
                            </p>
                            <span style={{
                              fontSize: "0.8rem",
                              color: "#fff",
                              fontWeight: 500,
                              textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)"
                            }}>
                              Avg. budget: ${t.averageBudget}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {loadingMore && (
                    <div style={{ textAlign: "center", padding: "28px 0", color: "var(--accent)" }}>
                      <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>✨ Discovering more destinations for you...</p>
                    </div>
                  )}

                  {!hasMore && trending.length > 0 && (
                    <div style={{ textAlign: "center", padding: "28px 0", color: "rgba(244, 239, 228, 0.4)" }}>
                      <p style={{ fontSize: "0.85rem" }}>You've explored all top trending destinations 🌍</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Discover;
