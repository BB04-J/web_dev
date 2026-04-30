const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skinType: {
    type: String,
    enum: ['oily', 'dry', 'combination', 'sensitive', 'acne-prone', 'normal']
  },
  concerns: [{
    type: String,
    enum: ['acne', 'pigmentation', 'dull-skin', 'dark-circles', 'open-pores', 
           'dry-patches', 'tanning', 'uneven-tone']
  }],
  level: {
    type: String,
    enum: ['beginner', 'advanced'],
    default: 'beginner'
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
