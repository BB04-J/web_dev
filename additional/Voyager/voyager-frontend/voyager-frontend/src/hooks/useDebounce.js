import { useEffect, useState } from "react";

// Returns a debounced copy of `value` that only updates after `delay` ms
// of inactivity. Used to avoid firing an API call on every keystroke.
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
