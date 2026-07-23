import { Router } from "express";
import protect from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  addBudgetItem,
  deleteBudgetItem,
  addPackingItem,
  togglePackingItem,
  deletePackingItem,
  getTripStats,
} from "../controllers/tripController.js";
import {
  createTripSchema,
  updateTripSchema,
  itineraryItemSchema,
  budgetItemSchema,
  packingItemSchema,
} from "../validators/tripValidators.js";

const router = Router();

router.use(protect); // every trip route requires authentication

router.get("/stats/summary", getTripStats);

router.route("/").get(getTrips).post(validate(createTripSchema), createTrip);

router
  .route("/:id")
  .get(getTrip)
  .put(validate(updateTripSchema), updateTrip)
  .delete(deleteTrip);

// Itinerary
router
  .route("/:id/itinerary")
  .post(validate(itineraryItemSchema), addItineraryItem);
router
  .route("/:id/itinerary/:itemId")
  .put(validate(itineraryItemSchema.partial()), updateItineraryItem)
  .delete(deleteItineraryItem);

// Budget
router.route("/:id/budget").post(validate(budgetItemSchema), addBudgetItem);
router.route("/:id/budget/:itemId").delete(deleteBudgetItem);

// Packing list
router.route("/:id/packing").post(validate(packingItemSchema), addPackingItem);
router
  .route("/:id/packing/:itemId")
  .put(togglePackingItem)
  .delete(deletePackingItem);

export default router;
