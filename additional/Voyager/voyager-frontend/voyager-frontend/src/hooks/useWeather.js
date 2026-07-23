import useFetch from "./useFetch";
import { fetchWeather } from "../api/externalApi";

/**
 * Fetches current + 5-day weather for a given coordinate pair.
 * Returns null data until coordinates are available.
 */
const useWeather = (lat, lon) => {
  const enabled = typeof lat === "number" && typeof lon === "number";

  const { data, loading, error, refetch } = useFetch(
    (signal) => fetchWeather(lat, lon, signal),
    [lat, lon],
    { enabled }
  );

  return {
    current: data?.current || null,
    daily: data?.daily || null,
    loading,
    error,
    refetch,
  };
};

export default useWeather;
