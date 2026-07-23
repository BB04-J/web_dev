import { useState, useEffect } from "react";
import useWeather from "../../hooks/useWeather";
import { describeWeatherCode, searchDestinations } from "../../api/externalApi";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

const WeatherWidget = ({ lat: propLat, lon: propLon, destination }) => {
  const [coords, setCoords] = useState({ lat: propLat, lon: propLon });

  useEffect(() => {
    if (propLat != null && propLon != null) {
      setCoords({ lat: propLat, lon: propLon });
    } else if (destination) {
      let active = true;
      searchDestinations(destination)
        .then((results) => {
          if (active && results && results.length > 0) {
            setCoords({ lat: results[0].lat, lon: results[0].lon });
          }
        })
        .catch((err) => console.error("Auto-geocoding weather failed:", err));
      return () => {
        active = false;
      };
    }
  }, [propLat, propLon, destination]);

  const { current, daily, loading, error, refetch } = useWeather(coords.lat, coords.lon);

  if (coords.lat == null || coords.lon == null) {
    return (
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
        Fetching coordinates for {destination || "destination"}…
      </p>
    );
  }

  if (loading) return <Loader label={`Checking weather for ${destination || "your destination"}`} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!current) return null;

  const nowInfo = describeWeatherCode(current.weather_code);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <span style={{ fontSize: "2.4rem" }}>{nowInfo.icon}</span>
        <div>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {Math.round(current.temperature_2m)}°C
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {nowInfo.label} in {destination} · wind {Math.round(current.wind_speed_10m)} km/h
          </p>
        </div>
      </div>

      {daily && (
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {daily.time.map((date, i) => {
            const info = describeWeatherCode(daily.weather_code[i]);
            return (
              <div
                key={date}
                className="card"
                style={{
                  minWidth: 84,
                  padding: "10px 8px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                <p className="mono" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p style={{ fontSize: "1.3rem", margin: "4px 0" }}>{info.icon}</p>
                <p className="mono" style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                  {Math.round(daily.temperature_2m_max[i])}° / {Math.round(daily.temperature_2m_min[i])}°
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
