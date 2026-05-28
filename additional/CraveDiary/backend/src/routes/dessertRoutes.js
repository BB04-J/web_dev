const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addDessert,
    getDesserts,
    updateDessert,
    deleteDessert,
    rateDessert,
    getDashboard,
    discoverDesserts,
    discoverRandom,
    discoverCoffees,
} = require("../controllers/dessertController");

router.post("/", authMiddleware, addDessert);

router.get("/", authMiddleware, getDesserts);

router.put("/:id", authMiddleware, updateDessert);

router.delete("/:id", authMiddleware, deleteDessert);

router.post("/:id/rate", authMiddleware, rateDessert);

router.get("/dashboard/stats", authMiddleware, getDashboard);

router.get("/discover/search", discoverDesserts);

router.get("/discover/random", discoverRandom);

router.get("/discover/coffee", discoverCoffees);

module.exports = router;