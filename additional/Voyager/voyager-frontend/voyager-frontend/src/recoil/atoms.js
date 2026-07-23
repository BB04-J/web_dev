import { atom, selector } from "recoil";

// Holds the current user's trips once fetched, so every component that
// reads it (dashboard, trip list, trip detail) stays in sync without
// re-fetching or prop-drilling.
export const tripsAtom = atom({
  key: "tripsAtom",
  default: [],
});

export const tripsLoadingAtom = atom({
  key: "tripsLoadingAtom",
  default: false,
});

export const tripsErrorAtom = atom({
  key: "tripsErrorAtom",
  default: null,
});

export const wishlistAtom = atom({
  key: "wishlistAtom",
  default: [],
});

// Derived state: upcoming trips, soonest first
export const upcomingTripsSelector = selector({
  key: "upcomingTripsSelector",
  get: ({ get }) => {
    const trips = get(tripsAtom);
    const now = new Date();
    return trips
      .filter((t) => new Date(t.startDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  },
});

// Derived state: total planned budget vs total spent, across all trips
export const budgetOverviewSelector = selector({
  key: "budgetOverviewSelector",
  get: ({ get }) => {
    const trips = get(tripsAtom);
    return trips.reduce(
      (acc, trip) => {
        const spent = (trip.budgetItems || []).reduce(
          (sum, item) => sum + item.amount,
          0
        );
        acc.limit += trip.budgetLimit || 0;
        acc.spent += spent;
        return acc;
      },
      { limit: 0, spent: 0 }
    );
  },
});
