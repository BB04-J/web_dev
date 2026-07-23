import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { tripsApi, travelToolsApi } from "../api/tripsApi";
import { searchDestinations } from "../api/externalApi";
import useTrips from "../hooks/useTrips";
import TripForm from "../components/trips/TripForm";
import ItineraryList from "../components/trips/ItineraryList";
import BudgetPlanner from "../components/trips/BudgetPlanner";
import PackingChecklist from "../components/trips/PackingChecklist";
import WeatherWidget from "../components/trips/WeatherWidget";
import StatusBadge from "../components/common/StatusBadge";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { motion } from "framer-motion";

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

const TABS = ["Overview", "Itinerary", "Budget", "Packing", "Weather", "Map"];

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteTrip, replaceTripInState } = useTrips();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");
  const [editing, setEditing] = useState(false);

  // AI Itinerary states
  const [generatingItinerary, setGeneratingItinerary] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("Adventure");
  const [selectedInterest, setSelectedInterest] = useState("Nature");
  const [aiNotes, setAiNotes] = useState(null);

  // Smart Budget states
  const [estimatingBudget, setEstimatingBudget] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState(null);

  // Currency Converter states
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState(null);

  // Smart Packing states
  const [generatingPacking, setGeneratingPacking] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("summer");

  // Detailed Weather suggestions
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Map spots
  const [mapPlaces, setMapPlaces] = useState([]);
  const [mapPlacesLoading, setMapPlacesLoading] = useState(false);
  const [activePin, setActivePin] = useState(null);

  const loadTrip = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await tripsApi.get(id);
      setTrip(data.data);
      replaceTripInState(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this trip.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load weather forecast & activity recommendations when weather tab opens
  useEffect(() => {
    if (tab === "Weather" && trip) {
      const loadWeatherDetails = async () => {
        setWeatherLoading(true);
        try {
          let lat = trip.coordinates?.lat;
          let lon = trip.coordinates?.lon;

          // Auto-geocode destination if no coordinates saved
          if (lat == null || lon == null) {
            const query = trip.destination || trip.country || "Japan";
            const results = await searchDestinations(query);
            if (results && results.length > 0) {
              lat = results[0].lat;
              lon = results[0].lon;
            }
          }

          if (lat != null && lon != null) {
            const { data } = await travelToolsApi.weather(lat, lon);
            setWeatherDetails(data.data);
          }
        } catch (err) {
          console.error("Weather forecast fetch failed:", err);
        } finally {
          setWeatherLoading(false);
        }
      };
      loadWeatherDetails();
    }
  }, [tab, trip]);

  // Fetch nearby attractions on map load
  useEffect(() => {
    if (tab === "Map" && trip) {
      const loadMapPlaces = async () => {
        setMapPlacesLoading(true);
        try {
          const { data } = await travelToolsApi.explore(trip.destination);
          setMapPlaces(data.data);
        } catch (err) {
          console.error("Map places fetch failed:", err);
        } finally {
          setMapPlacesLoading(false);
        }
      };
      loadMapPlaces();
    }
  }, [tab, trip]);

  const syncTrip = (updated) => {
    setTrip(updated);
    replaceTripInState(updated);
  };

  const handleUpdateDetails = async (payload) => {
    const { data } = await tripsApi.update(id, payload);
    syncTrip(data.data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${trip.title}"? This can't be undone.`)) return;
    await deleteTrip(id);
    navigate("/trips");
  };

  // AI Itinerary Planner Execution
  const handleGenerateAIItinerary = async () => {
    setGeneratingItinerary(true);
    try {
      const days = Math.ceil(Math.abs(new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) || 3;
      const { data } = await travelToolsApi.aiPlan({
        destination: trip.destination,
        duration: days,
        travelers: trip.travelers || 1,
        budget: trip.budgetLimit > 1500 ? "luxury" : "budget",
        style: selectedStyle,
        interests: [selectedInterest]
      });

      const currentItinerary = Array.isArray(trip?.itinerary) ? trip.itinerary : [];
      const generatedItinerary = Array.isArray(data?.data?.itinerary) ? data.data.itinerary : [];

      const newItinerary = [
        ...currentItinerary,
        ...generatedItinerary.map((item) => ({
          day: item.day,
          title: item.title,
          time: item.time || "09:00",
          notes: `Recommended Spots: ${(data.data.attractions || []).slice(0, 3).join(", ")}`
        }))
      ];

      const res = await tripsApi.update(id, { itinerary: newItinerary });
      syncTrip(res.data.data);
      setAiNotes(data.data);
    } catch (err) {
      console.error("AI Planner failed:", err);
    } finally {
      setGeneratingItinerary(false);
    }
  };

  // Smart Budget Estimator Execution
  const handleEstimateBudget = async () => {
    setEstimatingBudget(true);
    try {
      const days = Math.ceil(Math.abs(new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) || 3;
      const { data } = await travelToolsApi.estimateBudget({
        destination: trip.destination,
        duration: days,
        travelers: trip.travelers || 1
      });

      // Fetch exchange rate from USD (estimator default) to the trip's target currency
      const tripCurrency = trip.currency || "USD";
      let rate = 1;
      if (tripCurrency !== "USD") {
        const rateRes = await travelToolsApi.currency({
          from: "USD",
          to: tripCurrency,
          amount: 1
        });
        rate = rateRes.data.data.rate || 1;
      }

      // Convert estimates from USD to the target trip currency
      const convertedEstimates = {
        flights: Math.round(data.data.flights * rate),
        hotels: Math.round(data.data.hotels * rate),
        food: Math.round(data.data.food * rate),
        transport: Math.round(data.data.transport * rate),
        activities: Math.round((data.data.activities || 0) * rate),
        misc: Math.round((data.data.misc || 0) * rate),
        total: Math.round(data.data.total * rate)
      };

      setEstimatedBudget(convertedEstimates);
    } catch (err) {
      console.error("Budget estimator failed:", err);
    } finally {
      setEstimatingBudget(false);
    }
  };

  const handleSaveBudgetEstimate = async () => {
    if (!estimatedBudget) return;
    try {
      const itemsToAdd = [
        { label: "Estimated Flights", amount: estimatedBudget.flights, category: "transport" },
        { label: "Estimated Hotels", amount: estimatedBudget.hotels, category: "stay" },
        { label: "Estimated Food & Dining", amount: estimatedBudget.food, category: "food" },
        { label: "Estimated Local Transport", amount: estimatedBudget.transport, category: "transport" },
        { label: "Estimated Activities", amount: estimatedBudget.activities, category: "activities" }
      ].filter(item => item.amount > 0);

      const currentBudget = Array.isArray(trip?.budgetItems) ? trip.budgetItems : [];
      const newBudgetItems = [
        ...currentBudget,
        ...itemsToAdd
      ];

      const res = await tripsApi.update(id, { budgetItems: newBudgetItems });
      syncTrip(res.data.data);
      setEstimatedBudget(null);
    } catch (err) {
      console.error("Could not save budget estimates:", err);
    }
  };

  // Smart Packing Checklist Execution
  const handleGeneratePackingList = async () => {
    setGeneratingPacking(true);
    try {
      const { data } = await travelToolsApi.packingList({
        destination: trip.destination,
        season: selectedSeason,
        weather: weatherDetails ? `${weatherDetails.temp}°C, rain probability ${weatherDetails.rainProbability}%` : "Clear"
      });

      const currentPacking = Array.isArray(trip?.packingList) ? trip.packingList : [];
      const generatedItems = Array.isArray(data?.data) ? data.data : [];

      const newPackingItems = [
        ...currentPacking,
        ...generatedItems.map((item) => ({
          label: item.label,
          category: item.category || "clothing"
        }))
      ];

      const res = await tripsApi.update(id, { packingList: newPackingItems });
      syncTrip(res.data.data);
    } catch (err) {
      console.error("Packing generator failed:", err);
    } finally {
      setGeneratingPacking(false);
    }
  };

  // Currency Converter Execution
  const handleConvertCurrency = async () => {
    setCurrencyLoading(true);
    try {
      const { data } = await travelToolsApi.currency({
        from: trip.currency || "USD",
        to: targetCurrency,
        amount: trip.budgetLimit || 1000
      });
      setConversionResult(data.data);
    } catch (err) {
      console.error("Currency lookup failed:", err);
    } finally {
      setCurrencyLoading(false);
    }
  };

  if (loading) return <Loader label="Loading trip details..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadTrip} />;
  if (!trip) return null;

  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 128px)", color: "#f4efe4" }}>
      {/* Background Image overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.3) saturate(0.85) contrast(1.1)",
        zIndex: -1,
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: "2.2rem", fontFamily: "var(--font-display)", fontWeight: 500, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{trip.title}</h1>
            <StatusBadge status={trip.status} />
          </div>
          <p style={{ color: "rgba(244, 239, 228, 0.6)", fontSize: "0.95rem" }}>
            {trip.destination}{trip.country ? `, ${trip.country}` : ""} ·{" "}
            <span className="mono">
              {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
            </span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-cinematic" onClick={() => setEditing((e) => !e)}>
            {editing ? "Cancel Edit" : "Edit Details"}
          </button>
          <button className="btn-cinematic-secondary" style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "#f87171" }} onClick={handleDelete}>
            Delete Adventure
          </button>
        </div>
      </div>

      {editing && (
        <div className="card" style={{ padding: 24, marginBottom: 28 }}>
          <TripForm initial={trip} onSubmit={handleUpdateDetails} onCancel={() => setEditing(false)} submitLabel="Save changes" />
        </div>
      )}

      {/* Tabs Menu */}
      <div style={{ display: "flex", gap: 6, borderBottom: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent",
              border: "none",
              padding: "10px 16px",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: "pointer",
              color: tab === t ? "var(--accent)" : "rgba(244, 239, 228, 0.6)",
              borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "all 0.25s ease"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="card" style={{ padding: 28, color: "var(--text-primary)" }}>
        {tab === "Overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
              <Overview label="Budget limit" value={`${trip.budgetLimit || 0} ${trip.currency}`} />
              <Overview
                label="Spent so far"
                value={`${trip.budgetItems.reduce((s, b) => s + b.amount, 0)} ${trip.currency}`}
              />
              <Overview label="Itinerary stops" value={trip.itinerary.length} />
              <Overview
                label="Packing progress"
                value={`${trip.packingList.filter((p) => p.packed).length}/${trip.packingList.length}`}
              />
            </div>

            {/* Currency Converter Widget */}
            <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: 20 }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 12, fontWeight: 500 }}>💱 Budget Currency Converter</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                Convert your trip budget limit into the local currency of your destination.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>Convert {trip.budgetLimit} {trip.currency} to:</span>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--bg-inset)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
                <button className="btn-cinematic" onClick={handleConvertCurrency} disabled={currencyLoading}>
                  {currencyLoading ? "Converting..." : "Convert"}
                </button>
              </div>

              {conversionResult && (
                <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: "var(--bg-inset)", border: "1px solid var(--surface-border)", maxWidth: 440 }}>
                  <p style={{ fontSize: "0.88rem", marginBottom: 6, color: "var(--text-primary)" }}>
                    Exchange Rate: <span style={{ color: "var(--accent)", fontWeight: 600 }}>1 {trip.currency} = {conversionResult.rate} {targetCurrency}</span>
                  </p>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    Converted Budget: {conversionResult.convertedAmount} {targetCurrency}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    💡 Suggested daily allowance: {conversionResult.dailyRecommend} {targetCurrency} / day
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "Itinerary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* AI Generator Button */}
            <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-inset)", border: "1px solid var(--surface-border)" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: 6, fontWeight: 500 }}>🪄 AI Day-wise Itinerary Generator</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 16 }}>
                Let Gemini design a tailored trip schedule based on your preference and style.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Travel Style</span>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--bg-inset)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Budget">Budget</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Family">Family</option>
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Main Interest</span>
                  <select
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--bg-inset)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
                  >
                    <option value="Nature">Nature</option>
                    <option value="Beaches">Beaches</option>
                    <option value="Food">Food</option>
                    <option value="History">History</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Nightlife">Nightlife</option>
                  </select>
                </div>
                <button
                  className="btn-cinematic"
                  style={{ marginTop: 18 }}
                  onClick={handleGenerateAIItinerary}
                  disabled={generatingItinerary}
                >
                  {generatingItinerary ? "Generating Day Plan..." : "Auto-Generate Itinerary"}
                </button>
              </div>

              {aiNotes && (
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: "0.85rem", borderTop: "1px solid var(--surface-border)", paddingTop: 14, color: "var(--text-primary)" }}>
                  <div>
                    <h4 style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: 4 }}>🍽️ Food Recommendations:</h4>
                    <ul style={{ paddingLeft: 16, color: "var(--text-primary)" }}>
                      {aiNotes.restaurants.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: 4 }}>💡 Travel Tips:</h4>
                    <ul style={{ paddingLeft: 16, color: "var(--text-primary)" }}>
                      {aiNotes.tips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <ItineraryList
              items={trip.itinerary}
              onAdd={async (payload) => {
                const { data } = await tripsApi.addItineraryItem(id, payload);
                syncTrip(data.data);
              }}
              onDelete={async (itemId) => {
                const { data } = await tripsApi.deleteItineraryItem(id, itemId);
                syncTrip(data.data);
              }}
            />
          </div>
        )}

        {tab === "Budget" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Smart Budget Estimator Panel */}
            <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-inset)", border: "1px solid var(--surface-border)" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: 6, fontWeight: 500 }}>💡 Smart Travel Budget Estimator</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                Estimates typical lodging, flights, transit, and meals for your destination.
              </p>
              <button
                className="btn-cinematic"
                onClick={handleEstimateBudget}
                disabled={estimatingBudget}
              >
                {estimatingBudget ? "Fetching Rates..." : "Estimate Trip Costs"}
              </button>

              {estimatedBudget && (
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, fontSize: "0.85rem" }}>
                    <div style={{ background: "var(--bg-inset)", border: "1px solid var(--surface-border)", padding: 10, borderRadius: 8 }}>
                      <p style={{ color: "var(--text-secondary)" }}>✈️ Flights</p>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>{getCurrencySymbol(trip.currency || "USD")}{estimatedBudget.flights}</p>
                    </div>
                    <div style={{ background: "var(--bg-inset)", border: "1px solid var(--surface-border)", padding: 10, borderRadius: 8 }}>
                      <p style={{ color: "var(--text-secondary)" }}>🏨 Lodging</p>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>{getCurrencySymbol(trip.currency || "USD")}{estimatedBudget.hotels}</p>
                    </div>
                    <div style={{ background: "var(--bg-inset)", border: "1px solid var(--surface-border)", padding: 10, borderRadius: 8 }}>
                      <p style={{ color: "var(--text-secondary)" }}>🍔 Food</p>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>{getCurrencySymbol(trip.currency || "USD")}{estimatedBudget.food}</p>
                    </div>
                    <div style={{ background: "var(--bg-inset)", border: "1px solid var(--surface-border)", padding: 10, borderRadius: 8 }}>
                      <p style={{ color: "var(--text-secondary)" }}>🚕 Transport</p>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>{getCurrencySymbol(trip.currency || "USD")}{estimatedBudget.transport}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--surface-border)", paddingTop: 12, flexWrap: "wrap", gap: 10 }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>Total Estimated: {getCurrencySymbol(trip.currency || "USD")}{estimatedBudget.total}</span>
                    <button className="btn-cinematic" onClick={handleSaveBudgetEstimate} style={{ fontSize: "0.8rem", padding: "6px 14px" }}>
                      ✓ Add Estimates to Log
                    </button>
                  </div>
                </div>
              )}
            </div>

            <BudgetPlanner
              budgetItems={trip.budgetItems}
              budgetLimit={trip.budgetLimit}
              currency={trip.currency}
              onAdd={async (payload) => {
                const { data } = await tripsApi.addBudgetItem(id, payload);
                syncTrip(data.data);
              }}
              onDelete={async (itemId) => {
                const { data } = await tripsApi.deleteBudgetItem(id, itemId);
                syncTrip(data.data);
              }}
            />
          </div>
        )}

        {tab === "Packing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* AI Packing Generator Panel */}
            <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-inset)", border: "1px solid var(--surface-border)" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: 6, fontWeight: 500 }}>🎒 Weather-Smart Packing Generator</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                Suggests packing essentials matching your destination's climate, weather, and season.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--bg-inset)", border: "1px solid var(--surface-border)", color: "var(--text-primary)" }}
                >
                  <option value="summer">Summer / Warm</option>
                  <option value="winter">Winter / Cold</option>
                  <option value="monsoon">Monsoon / Rainy</option>
                  <option value="autumn">Autumn</option>
                  <option value="spring">Spring</option>
                </select>
                <button
                  className="btn-cinematic"
                  onClick={handleGeneratePackingList}
                  disabled={generatingPacking}
                >
                  {generatingPacking ? "Generating checklist..." : "Generate Smart Packing List"}
                </button>
              </div>
            </div>

            <PackingChecklist
              items={trip.packingList}
              onAdd={async (payload) => {
                const { data } = await tripsApi.addPackingItem(id, payload);
                syncTrip(data.data);
              }}
              onToggle={async (itemId, packed) => {
                const { data } = await tripsApi.togglePackingItem(id, itemId, packed);
                syncTrip(data.data);
              }}
              onDelete={async (itemId) => {
                const { data } = await tripsApi.deletePackingItem(id, itemId);
                syncTrip(data.data);
              }}
            />
          </div>
        )}

        {tab === "Weather" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {weatherLoading ? (
              <Loader label="Pulling live OpenWeatherMap forecast..." />
            ) : weatherDetails ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Weather widget top section */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, background: "var(--bg-inset)", padding: 20, borderRadius: 12, border: "1px solid var(--surface-border)" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Current Temp</span>
                    <h4 style={{ fontSize: "1.8rem", color: "var(--text-primary)", fontWeight: 700, margin: "2px 0" }}>{weatherDetails.temp}°C</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Humidity</span>
                    <h4 style={{ fontSize: "1.4rem", color: "var(--text-primary)", fontWeight: 500, margin: "2px 0" }}>{weatherDetails.humidity}%</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Wind Speed</span>
                    <h4 style={{ fontSize: "1.4rem", color: "var(--text-primary)", fontWeight: 500, margin: "2px 0" }}>{weatherDetails.wind} km/h</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Rain Prob.</span>
                    <h4 style={{ fontSize: "1.4rem", color: "var(--text-primary)", fontWeight: 500, margin: "2px 0" }}>{weatherDetails.rainProbability}%</h4>
                  </div>
                </div>

                {/* Suggestions card */}
                <div style={{ padding: 20, borderRadius: 12, background: "var(--bg-inset)", border: "1px solid var(--surface-border)" }}>
                  <h4 style={{ fontSize: "0.95rem", color: "var(--accent)", marginBottom: 8, fontWeight: 600 }}>🎒 Weather-Driven Activity Suggestions</h4>
                  <ul style={{ paddingLeft: 16, fontSize: "0.88rem", display: "flex", flexDirection: "column", gap: 4, color: "var(--text-primary)" }}>
                    {weatherDetails.suggestions.map((s, i) => (
                      <li key={i} style={{ color: "var(--text-primary)" }}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <WeatherWidget lat={trip.coordinates?.lat} lon={trip.coordinates?.lon} destination={trip.destination} />
          </div>
        )}

        {tab === "Map" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {/* Left Col: Nearby attractions list */}
            <div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 12, fontWeight: 500 }}>📍 Local Hotspots</h3>
              {mapPlacesLoading ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading coordinates...</p>
              ) : mapPlaces.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Search explorer places to display pins.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {mapPlaces.map((place, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePin(idx)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "var(--bg-inset)",
                        border: activePin === idx ? "1px solid var(--accent)" : "1px solid var(--surface-border)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600, color: activePin === idx ? "var(--accent)" : "var(--text-primary)" }}>{place.name}</span>
                        <span style={{ color: "var(--accent)" }}>★ {place.rating}</span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{place.category} · {place.distance}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Mapbox Styled canvas */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 12, fontWeight: 500 }}>🗺️ Interactive Map (Mapbox GL)</h3>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  minHeight: "320px",
                  borderRadius: "12px",
                  background: "#0c101d",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* Mapbox grid mockup */}
                <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }} />

                <svg width="80%" height="80%" viewBox="0 0 100 100" style={{ opacity: 0.15, pointerEvents: "none" }}>
                  <path d="M10 20 Q 30 10 50 40 T 90 20 T 70 80 T 20 90 Z" fill="none" stroke="#fff" strokeWidth="1" />
                  <path d="M30 40 Q 60 50 40 80 T 10 90" fill="none" stroke="#fff" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>

                {trip.coordinates && (
                  <p style={{ position: "absolute", bottom: 12, left: 12, fontSize: "0.7rem", color: "rgba(244, 239, 228, 0.4)", fontFamily: "monospace" }}>
                    Mapbox Coordinate Layer: {trip.coordinates.lat.toFixed(4)}° N, {trip.coordinates.lon.toFixed(4)}° E
                  </p>
                )}

                {/* Map spots markers */}
                {mapPlaces.map((place, idx) => {
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
        )}
      </div>
    </div>
  );
};

const Overview = ({ label, value }) => (
  <div>
    <p className="mono" style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>
      {value}
    </p>
    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{label}</p>
  </div>
);

export default TripDetail;
