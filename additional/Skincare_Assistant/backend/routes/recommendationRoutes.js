const express = require('express');
const router = express.Router();
const { getRecommendations, generateRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getRecommendations);
router.post('/generate', generateRecommendations);

module.exports = router;
