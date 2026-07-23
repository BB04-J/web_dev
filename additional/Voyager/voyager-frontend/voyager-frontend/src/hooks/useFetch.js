import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Generic async data-fetching hook with loading/error state and automatic
 * cancellation of stale requests.
 *
 * @param {Function} fetcher - (signal) => Promise<T>
 * @param {Array} deps - dependency array; the fetcher re-runs when these change
 * @param {Object} options - { enabled?: boolean }
 */
const useFetch = (fetcher, deps = [], options = {}) => {
  const { enabled = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(
    (signal) => {
      if (!enabled) return;
      setLoading(true);
      setError(null);

      fetcherRef
        .current(signal)
        .then((result) => {
          if (!signal?.aborted) setData(result);
        })
        .catch((err) => {
          if (err.name !== "AbortError" && !signal?.aborted) {
            setError(err.message || "Something went wrong");
          }
        })
        .finally(() => {
          if (!signal?.aborted) setLoading(false);
        });
    },
    [enabled]
  );

  useEffect(() => {
    const controller = new AbortController();
    run(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    run(controller.signal);
  }, [run]);

  return { data, loading, error, refetch };
};

export default useFetch;
