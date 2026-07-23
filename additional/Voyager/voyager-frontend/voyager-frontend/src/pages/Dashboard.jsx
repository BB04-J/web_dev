import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import useTrips from "../hooks/useTrips";
import { upcomingTripsSelector, tripsLoadingAtom } from "../recoil/atoms";
import { tripsApi, travelToolsApi } from "../api/tripsApi";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/trips/TripCard";
import StatCard from "../components/trips/StatCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

// Silhouette traveler & ridges graphic
const TravelerSilhouette = () => (
  <div style={{ position: "absolute", bottom: "-2px", left: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 3, pointerEvents: "none" }}>
    {/* Standalone traveler */}
    <svg viewBox="0 0 100 100" style={{ width: "80px", height: "80px", fill: "#030712", stroke: "rgba(255,255,255,0.03)", strokeWidth: "0.5px", marginBottom: "-15px", position: "relative", zIndex: 4 }}>
      {/* Head */}
      <circle cx="50" cy="22" r="7" />
      {/* Torso & Legs */}
      <path d="M43,30 C39,30 38,36 38,45 L40,78 H46 V95 H54 V78 H60 L62,45 C62,36 61,30 57,30 Z" />
      {/* Backpack */}
      <rect x="33" y="36" width="9" height="26" rx="3" fill="#010307" />
      {/* Staff/Walking Stick */}
      <line x1="64" y1="20" x2="68" y2="95" stroke="#030712" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    
    {/* Rolling ridges masking the bottom */}
    <svg viewBox="0 0 1440 220" fill="#030712" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
      <path d="M0,96 L120,112 C240,128,480,160,720,160 C960,160,1200,128,1320,112 L1440,96 L1440,220 L1320,220 C1200,220,960,220,720,220 C480,220,240,220,120,220 L0,220 Z" />
    </svg>
  </div>
);

// Individual Viewport Snapping Section Component
const CinematicSection = ({ bgUrl, title, subtitle, desc, children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <section ref={ref} className="cinematic-section">
      <div className="parallax-bg-wrapper">
        <motion.div
          className="parallax-bg-img"
          style={{
            backgroundImage: `url(${bgUrl})`,
            y: yBg,
            scale: scaleBg,
          }}
        />
        <div className="parallax-overlay" />
      </div>

      <div className="cinematic-content">
        <motion.span
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="subtitle-mono"
        >
          {subtitle}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="title-huge"
        >
          {title}
        </motion.h2>

        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="desc-text"
          >
            {desc}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", display: "flex", justifyContent: "center", zIndex: 10 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

const BudgetChart = ({ distribution }) => {
  const categories = Object.entries(distribution || {});
  const total = categories.reduce((sum, [_, val]) => sum + val, 0);

  if (total === 0) {
    return <p style={{ fontSize: "0.85rem", color: "rgba(244, 239, 228, 0.4)", marginTop: 12 }}>No budget data recorded yet.</p>;
  }

  const colors = {
    stay: "#a78bfa",
    transport: "#60a5fa",
    food: "#f87171",
    activities: "#34d399",
    shopping: "#fbbf24",
    misc: "#9ca3af"
  };

  return (
    <div style={{ marginTop: 28, width: "100%", maxWidth: 640 }}>
      <h4 style={{ fontSize: "0.95rem", color: "#fff", marginBottom: 12, fontWeight: 500 }}>Budget Category Distribution</h4>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", background: "rgba(255,255,255,0.08)", marginBottom: 16 }}>
        {categories.map(([cat, amount]) => {
          const pct = (amount / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={cat}
              style={{
                width: `${pct}%`,
                background: colors[cat] || colors.misc,
                height: "100%"
              }}
              title={`${cat}: $${amount} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        {categories.map(([cat, amount]) => {
          const pct = (amount / total) * 100;
          if (amount === 0) return null;
          return (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "rgba(244, 239, 228, 0.7)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[cat] || colors.misc }} />
              <span style={{ textTransform: "capitalize" }}>{cat}</span>
              <span style={{ fontWeight: 600, color: "#fff" }}>${amount} ({Math.round(pct)}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { fetchTrips } = useTrips();
  const upcomingTrips = useRecoilValue(upcomingTripsSelector);
  const isLoadingTrips = useRecoilValue(tripsLoadingAtom);

  const [stats, setStats] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setError("");
    setRecLoading(true);
    try {
      await fetchTrips();
      const { data: insightsRes } = await travelToolsApi.insights();
      setStats(insightsRes.data);
    } catch (err) {
      console.error("Dashboard load error details:", err);
      setError(err.response?.data?.message || "Could not load your dashboard.");
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
    // Enable scroll snapping on html/body for dashboard page
    document.documentElement.classList.add("cinematic-snap");
    return () => {
      document.documentElement.classList.remove("cinematic-snap");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // PUBLIC LANDING PAGE (Unauthenticated)
    return (
      <div className="cinematic-scroll-container">
        {/* Section 1: Hero */}
        <CinematicSection
          bgUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          title="VOYAGER"
          subtitle="Explore the Untamed World"
          desc="Plan day-by-day itineraries, track budgets, and manage packing lists all in one immersive storytelling canvas."
        >
          <div style={{ display: "flex", gap: 16, zIndex: 10, position: "relative" }}>
            <Link to="/login" className="btn-cinematic">
              Log In
            </Link>
            <Link to="/register" className="btn-cinematic-secondary">
              Create Account
            </Link>
          </div>
          <TravelerSilhouette />
        </CinematicSection>

        {/* Section 2: Stats Teaser */}
        <CinematicSection
          bgUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80"
          title="TRANQUILITY"
          subtitle="Your journey in numbers"
          desc="Keep track of your destinations, budget spent, and upcoming travels in a clean, glassmorphic stats dashboard."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              width: "100%",
              maxWidth: "960px",
              padding: "0 20px",
            }}
          >
            <StatCard icon="🧳" label="Total trips" value="12" />
            <StatCard icon="🌍" label="Countries visited" value="5" />
            <StatCard icon="🗓️" label="Upcoming trips" value="3" accent="var(--accent)" />
            <StatCard icon="💰" label="Total budget spent" value="$4,250" />
          </div>
        </CinematicSection>

        {/* Section 3: Upcoming Trips Teaser */}
        <CinematicSection
          bgUrl="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"
          title="HORIZON"
          subtitle="Departures and packing lists"
          desc="Never forget a passport or overspend. Organize day-by-day activities, map budgets, and toggle packing items."
        >
          <div className="card" style={{ padding: "40px", borderRadius: "var(--radius-lg)", maxWidth: "540px", width: "100%", margin: "0 auto" }}>
            <EmptyState
              icon="🧭"
              title="Ready to start planning?"
              description="Create a Voyager account to customize your first itinerary, budget tracker, and packing list."
              action={
                <Link to="/register" className="btn-cinematic" style={{ display: "inline-flex", marginTop: 12 }}>
                  Start Planning Now
                </Link>
              }
            />
          </div>
        </CinematicSection>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD (Logged In)
  return (
    <div className="cinematic-scroll-container">
      {/* Section 1: Hero */}
      <CinematicSection
        bgUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
        title={user?.name ? `VOYAGER, ${user.name.split(" ")[0].toUpperCase()}` : "VOYAGER"}
        subtitle="The Adventure Awaits"
        desc="Plan day-by-day itineraries, track budgets, and manage packing lists all in one immersive storytelling canvas."
      >
        <div style={{ display: "flex", gap: 16, zIndex: 10, position: "relative" }}>
          <Link to="/trips" className="btn-cinematic">
            Plan a Trip
          </Link>
          <button
            onClick={() => {
              const el = document.querySelectorAll(".cinematic-section")[1];
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-cinematic-secondary"
          >
            Explore Stats
          </button>
        </div>
        <TravelerSilhouette />
      </CinematicSection>

      {/* Section 2: Stats (Tranquility) */}
      <CinematicSection
        bgUrl="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80"
        title="TRANQUILITY"
        subtitle="Your journey in numbers"
        desc="Look back at your milestones and track what you've accomplished along the horizon."
      >
        {error && <ErrorMessage message={error} onRetry={loadDashboard} />}
        {!error && !stats && isLoadingTrips && <Loader label="Loading stats..." />}
        {!error && stats && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 20,
                width: "100%",
                maxWidth: "960px",
                padding: "0 20px"
              }}
            >
              <StatCard icon="🧳" label="Total trips" value={stats.totalTrips} />
              <StatCard icon="🌍" label="Countries visited" value={stats.countriesVisited} />
              <StatCard icon="🗓️" label="Upcoming trips" value={stats.upcomingTrips} accent="var(--accent)" />
              <StatCard icon="💰" label="Total budget spent" value={`$${stats.totalBudgetSpent}`} />
              <StatCard icon="⏱️" label="Avg trip duration" value={`${stats.avgDuration} days`} />
              <StatCard icon="🗺️" label="Favorite destination" value={stats.favoriteDestination} />
            </div>
          </div>
        )}
      </CinematicSection>

      {/* Section 3: Upcoming Trips (Horizon) */}
      <CinematicSection
        bgUrl="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"
        title="HORIZON"
        subtitle="Upcoming Adventures"
        desc="Ready for what is next? Here are your scheduled departures."
      >
        <div style={{ width: "100%", maxWidth: "960px", padding: "0 20px" }}>
          {isLoadingTrips && <Loader label="Loading upcoming trips..." />}

          {!isLoadingTrips && upcomingTrips.length === 0 && (
            <div className="card" style={{ padding: "40px", borderRadius: "var(--radius-lg)" }}>
              <EmptyState
                icon="🗺️"
                title="No upcoming trips yet"
                description="Start planning your next adventure — add a trip and Voyager will keep everything organized."
                action={
                  <Link to="/trips" className="btn-cinematic" style={{ display: "inline-flex", marginTop: 12 }}>
                    Create first trip
                  </Link>
                }
              />
            </div>
          )}

          {!isLoadingTrips && upcomingTrips.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 20,
                width: "100%",
              }}
            >
              {upcomingTrips.slice(0, 3).map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </CinematicSection>
    </div>
  );
};

export default Dashboard;
