import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tripsAtom, tripsLoadingAtom, tripsErrorAtom } from "../recoil/atoms";
import { tripsApi } from "../api/tripsApi";

/**
 * Wraps the trips API with Recoil global state, so any component that
 * calls useTrips() sees the same list without prop-drilling or refetching.
 */
const useTrips = () => {
  const [trips, setTrips] = useRecoilState(tripsAtom);
  const setLoading = useSetRecoilState(tripsLoadingAtom);
  const setError = useSetRecoilState(tripsErrorAtom);

  const fetchTrips = useCallback(
    async (status) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await tripsApi.list(status);
        setTrips(data.data);
        return data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Could not load trips");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setTrips, setLoading, setError]
  );

  const createTrip = useCallback(
    async (payload) => {
      const { data } = await tripsApi.create(payload);
      setTrips((prev) => [...prev, data.data]);
      return data.data;
    },
    [setTrips]
  );

  const updateTrip = useCallback(
    async (id, payload) => {
      const { data } = await tripsApi.update(id, payload);
      setTrips((prev) => prev.map((t) => (t._id === id ? data.data : t)));
      return data.data;
    },
    [setTrips]
  );

  const deleteTrip = useCallback(
    async (id) => {
      await tripsApi.remove(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    },
    [setTrips]
  );

  const replaceTripInState = useCallback(
    (updatedTrip) => {
      setTrips((prev) =>
        prev.map((t) => (t._id === updatedTrip._id ? updatedTrip : t))
      );
    },
    [setTrips]
  );

  return {
    trips,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    replaceTripInState,
  };
};

export default useTrips;
