// Free, CORS-enabled public APIs — no key required, called directly from
// the browser rather than proxied through our backend.

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const CURRENCY_URL = "https://api.frankfurter.app";

// Destination search (used by the debounced search box)
export const searchDestinations = async (query, signal) => {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODE_URL}?name=${encodeURIComponent(
    query
  )}&count=6&language=en&format=json`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Destination search failed");

  const data = await res.json();
  return (data.results || []).map((r) => ({
    id: `${r.id}`,
    name: r.name,
    country: r.country || "",
    admin1: r.admin1 || "",
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone,
  }));
};

// Current weather + short daily forecast for a coordinate pair
export const fetchWeather = async (lat, lon, signal) => {
  const url =
    `${WEATHER_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&forecast_days=5&timezone=auto`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Weather lookup failed");
  return res.json();
};

// Latest currency conversion rate
export const fetchExchangeRate = async (from, to, signal) => {
  if (from === to) return { rate: 1, date: null };

  const url = `${CURRENCY_URL}/latest?from=${from}&to=${to}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Currency lookup failed");

  const data = await res.json();
  return { rate: data.rates?.[to] ?? null, date: data.date };
};

export const fetchSupportedCurrencies = async (signal) => {
  const res = await fetch(`${CURRENCY_URL}/currencies`, { signal });
  if (!res.ok) throw new Error("Could not load currency list");
  return res.json(); // { USD: "United States Dollar", ... }
};

// Open-Meteo WMO weather codes -> short label + emoji, for a friendly UI
export const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  61: { label: "Light rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

export const describeWeatherCode = (code) =>
  WEATHER_CODES[code] || { label: "Unknown", icon: "🌍" };
