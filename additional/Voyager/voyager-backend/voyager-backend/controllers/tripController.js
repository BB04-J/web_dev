import Trip from "../models/Trip.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const findUserTrip = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  if (!trip) throw new ApiError(404, "Trip not found");
  return trip;
};

// @route GET /api/trips
export const getTrips = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user._id };
  if (status) {
    filter.status = typeof status === "string" ? status : String(status);
  }

  const trips = await Trip.find(filter).sort({ startDate: 1 });
  res.status(200).json({ success: true, count: trips.length, data: trips });
});

// @route GET /api/trips/:id
export const getTrip = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: trip });
});

// @route POST /api/trips
export const createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, data: trip });
});

// @route PUT /api/trips/:id
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  Object.assign(trip, req.body);
  await trip.save();
  res.status(200).json({ success: true, data: trip });
});

// @route DELETE /api/trips/:id
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  await trip.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// --- Itinerary sub-resource ---

// @route POST /api/trips/:id/itinerary
export const addItineraryItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  trip.itinerary.push(req.body);
  await trip.save();
  res.status(201).json({ success: true, data: trip });
});

// @route PUT /api/trips/:id/itinerary/:itemId
export const updateItineraryItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  const item = trip.itinerary.id(req.params.itemId);
  if (!item) throw new ApiError(404, "Itinerary item not found");
  Object.assign(item, req.body);
  await trip.save();
  res.status(200).json({ success: true, data: trip });
});

// @route DELETE /api/trips/:id/itinerary/:itemId
export const deleteItineraryItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  trip.itinerary.id(req.params.itemId)?.deleteOne();
  await trip.save();
  res.status(200).json({ success: true, data: trip });
});

// --- Budget sub-resource ---

// @route POST /api/trips/:id/budget
export const addBudgetItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  trip.budgetItems.push(req.body);
  await trip.save();
  res.status(201).json({ success: true, data: trip });
});

// @route DELETE /api/trips/:id/budget/:itemId
export const deleteBudgetItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  trip.budgetItems.id(req.params.itemId)?.deleteOne();
  await trip.save();
  res.status(200).json({ success: true, data: trip });
});

// --- Packing list sub-resource ---

// @route POST /api/trips/:id/packing
export const addPackingItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  trip.packingList.push(req.body);
  await trip.save();
  res.status(201).json({ success: true, data: trip });
});

// @route PUT /api/trips/:id/packing/:itemId
export const togglePackingItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  const item = trip.packingList.id(req.params.itemId);
  if (!item) throw new ApiError(404, "Packing item not found");
  item.packed = req.body.packed ?? !item.packed;
  await trip.save();
  res.status(200).json({ success: true, data: trip });
});

// @route DELETE /api/trips/:id/packing/:itemId
export const deletePackingItem = asyncHandler(async (req, res) => {
  const trip = await findUserTrip(req.user._id, req.params.id);
  trip.packingList.id(req.params.itemId)?.deleteOne();
  await trip.save();
  res.status(200).json({ success: true, data: trip });
});

// @route GET /api/trips/stats/summary
// Bonus Challenge 3: travel statistics
export const getTripStats = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ user: req.user._id });
  const now = new Date();

  const countriesVisited = new Set(
    trips
      .filter((t) => t.status === "completed" && t.country)
      .map((t) => t.country.toLowerCase())
  );

  const upcomingTrips = trips.filter(
    (t) => t.startDate > now && t.status !== "completed"
  ).length;

  const budgetSpent = trips.reduce(
    (sum, t) => sum + t.budgetItems.reduce((s, b) => s + b.amount, 0),
    0
  );

  res.status(200).json({
    success: true,
    data: {
      totalTrips: trips.length,
      countriesVisited: countriesVisited.size,
      upcomingTrips,
      budgetSpent,
    },
  });
});
