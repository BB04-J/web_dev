import { Router } from "express";
import protect from "../middleware/auth.js";
import { aiLimiter } from "../middleware/rateLimiter.js";
import {
  aiPlanItinerary,
  estimateBudget,
  getTrending,
  explorePlaces,
  getWeatherForecast,
  convertCurrency,
  generatePackingList,
  getTravelInsights,
  getSmartRecommendations
} from "../controllers/travelToolsController.js";

const router = Router();

router.use(protect); // Require authentication for travel planning tools

router.post("/ai-plan", aiLimiter, aiPlanItinerary);
router.get("/budget-estimate", estimateBudget);
router.get("/trending", getTrending);
router.get("/explore", explorePlaces);
router.get("/weather", getWeatherForecast);
router.get("/currency", convertCurrency);
router.post("/packing-list", aiLimiter, generatePackingList);
router.get("/insights", getTravelInsights);
router.get("/recommendations", getSmartRecommendations);

export default router;
