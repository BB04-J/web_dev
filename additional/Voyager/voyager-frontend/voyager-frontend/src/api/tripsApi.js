import api from "./axios";

export const tripsApi = {
  list: (status) => api.get("/trips", { params: status ? { status } : {} }),
  get: (id) => api.get(`/trips/${id}`),
  create: (payload) => api.post("/trips", payload),
  update: (id, payload) => api.put(`/trips/${id}`, payload),
  remove: (id) => api.delete(`/trips/${id}`),
  stats: () => api.get("/trips/stats/summary"),

  addItineraryItem: (tripId, payload) =>
    api.post(`/trips/${tripId}/itinerary`, payload),
  updateItineraryItem: (tripId, itemId, payload) =>
    api.put(`/trips/${tripId}/itinerary/${itemId}`, payload),
  deleteItineraryItem: (tripId, itemId) =>
    api.delete(`/trips/${tripId}/itinerary/${itemId}`),

  addBudgetItem: (tripId, payload) =>
    api.post(`/trips/${tripId}/budget`, payload),
  deleteBudgetItem: (tripId, itemId) =>
    api.delete(`/trips/${tripId}/budget/${itemId}`),

  addPackingItem: (tripId, payload) =>
    api.post(`/trips/${tripId}/packing`, payload),
  togglePackingItem: (tripId, itemId, packed) =>
    api.put(`/trips/${tripId}/packing/${itemId}`, { packed }),
  deletePackingItem: (tripId, itemId) =>
    api.delete(`/trips/${tripId}/packing/${itemId}`),
};

export const wishlistApi = {
  list: () => api.get("/wishlist"),
  add: (payload) => api.post("/wishlist", payload),
  remove: (id) => api.delete(`/wishlist/${id}`),
};

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

export const travelToolsApi = {
  aiPlan: (payload) => api.post("/travel-tools/ai-plan", payload),
  estimateBudget: (params) => api.get("/travel-tools/budget-estimate", { params }),
  trending: (params) => api.get("/travel-tools/trending", { params }),
  explore: (destination) => api.get("/travel-tools/explore", { params: { destination } }),
  weather: (lat, lon) => api.get("/travel-tools/weather", { params: { lat, lon } }),
  currency: (params) => api.get("/travel-tools/currency", { params }),
  packingList: (payload) => api.post("/travel-tools/packing-list", payload),
  insights: () => api.get("/travel-tools/insights"),
  recommendations: () => api.get("/travel-tools/recommendations"),
};
