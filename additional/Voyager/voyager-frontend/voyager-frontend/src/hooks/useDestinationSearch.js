import { useState } from "react";
import useDebounce from "./useDebounce";
import useFetch from "./useFetch";
import { searchDestinations } from "../api/externalApi";

// Powers the destination search box: debounces keystrokes, then fetches
// matching places from the geocoding API.
const useDestinationSearch = (delay = 400) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, delay);

  const { data, loading, error } = useFetch(
    (signal) => searchDestinations(debouncedQuery, signal),
    [debouncedQuery],
    { enabled: debouncedQuery.trim().length >= 2 }
  );

  return {
    query,
    setQuery,
    results: data || [],
    loading,
    error,
  };
};

export default useDestinationSearch;
