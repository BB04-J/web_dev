const express = require('express');
const router = express.Router();
const {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  toggleComplete
} = require('../controllers/routineController');

const { protect } = require('../middlewares/authMiddleware');

// All routine routes need to be protected (user must be logged in)
router.use(protect);

router.route('/')
  .get(getRoutines)
  .post(createRoutine);

router.route('/:id')
  .get(getRoutineById)
  .put(updateRoutine)
  .delete(deleteRoutine);

router.patch('/:id/complete', toggleComplete);

module.exports = router;
