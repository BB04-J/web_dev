const express = require('express');
const router = express.Router();
const {
  getProfile,
  upsertProfile,
  setSkinType,
  setConcerns
} = require('../controllers/profileController');

const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProfile)
  .put(upsertProfile);

router.post('/skin-type', setSkinType);
router.post('/concerns', setConcerns);

module.exports = router;
