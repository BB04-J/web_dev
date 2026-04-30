const Routine = require('../models/Routine');

// @desc    Get all routines for a user (with optional filters)
// @route   GET /api/routines
// @access  Private
const getRoutines = async (req, res) => {
  try {
    const { time, category, search, completed } = req.query;
    
    // Build the query object
    let query = { userId: req.user.id };

    if (time) query.time = time;
    if (category) query.category = category;
    if (completed !== undefined) query.completed = completed === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const routines = await Routine.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: routines.length,
      data: routines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single routine by ID
// @route   GET /api/routines/:id
// @access  Private
const getRoutineById = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      res.status(404);
      throw new Error('Routine step not found');
    }

    // Make sure user owns this routine
    if (routine.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    res.status(200).json({ success: true, data: routine });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ success: false, message: error.message });
  }
};

// @desc    Create a new routine step
// @route   POST /api/routines
// @access  Private
const createRoutine = async (req, res) => {
  try {
    const { name, description, time, category, order } = req.body;

    if (!name || !time) {
      res.status(400);
      throw new Error('Name and time are required');
    }

    const routine = await Routine.create({
      userId: req.user.id,
      name,
      description,
      time,
      category,
      order: order || 0
    });

    res.status(201).json({ success: true, data: routine });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ success: false, message: error.message });
  }
};

// @desc    Update a routine step
// @route   PUT /api/routines/:id
// @access  Private
const updateRoutine = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      res.status(404);
      throw new Error('Routine step not found');
    }

    // Check for user
    if (routine.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedRoutine = await Routine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the updated document
    );

    res.status(200).json({ success: true, data: updatedRoutine });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ success: false, message: error.message });
  }
};

// @desc    Delete a routine step
// @route   DELETE /api/routines/:id
// @access  Private
const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      res.status(404);
      throw new Error('Routine step not found');
    }

    // Check for user
    if (routine.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await Routine.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, id: req.params.id, message: 'Routine step removed' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ success: false, message: error.message });
  }
};

// @desc    Mark routine step as complete/incomplete
// @route   PATCH /api/routines/:id/complete
// @access  Private
const toggleComplete = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);

    if (!routine) {
      res.status(404);
      throw new Error('Routine step not found');
    }

    // Check for user
    if (routine.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const isCompleted = !routine.completed;
    const completedAt = isCompleted ? new Date() : null;

    const updatedRoutine = await Routine.findByIdAndUpdate(
      req.params.id,
      { completed: isCompleted, completedAt },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedRoutine });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  toggleComplete
};
