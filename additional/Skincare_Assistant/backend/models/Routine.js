const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  time: {
    type: String,
    enum: ['morning', 'night'],
    required: true
  },
  category: {
    type: String,
    enum: ['skincare', 'makeup', 'haircare', 'weekly'],
    default: 'skincare'
  },
  order: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Routine = mongoose.model('Routine', routineSchema);
module.exports = Routine;
