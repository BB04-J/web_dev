import { useMemo } from "react";
import useFetch from "./useFetch";
import { travelToolsApi } from "../api/tripsApi";

/**
 * Looks up the latest exchange rate between two currencies and exposes
 * a convert() helper for turning an amount from -> to.
 */
const useCurrency = (from = "USD", to = "USD") => {
  const enabled = !!from && !!to;

  const { data, loading, error, refetch } = useFetch(
    async () => {
      if (from === to) return { rate: 1, date: null };
      const res = await travelToolsApi.currency({ from, to, amount: 1 });
      return { rate: res.data.data.rate, date: new Date().toLocaleDateString() };
    },
    [from, to],
    { enabled }
  );

  const convert = useMemo(() => {
    const rate = data?.rate;
    return (amount) => (rate ? +(amount * rate).toFixed(2) : null);
  }, [data]);

  return {
    rate: data?.rate ?? null,
    date: data?.date ?? null,
    convert,
    loading,
    error: error ? "Failed to convert currency. Make sure the backend server is running." : null,
    refetch,
  };
};

export default useCurrency;
