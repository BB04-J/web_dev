const Profile = require('../models/Profile');

// @desc    Get user skin profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(200).json({ success: true, data: null, message: 'Profile not found. Please create one.' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update skin profile
// @route   PUT /api/profile
// @access  Private
const upsertProfile = async (req, res) => {
  try {
    const { skinType, concerns, level } = req.body;

    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // Update
      profile.skinType = skinType || profile.skinType;
      profile.concerns = concerns || profile.concerns;
      profile.level = level || profile.level;

      const updatedProfile = await profile.save();
      return res.status(200).json({ success: true, data: updatedProfile });
    } else {
      // Create
      profile = await Profile.create({
        userId: req.user.id,
        skinType,
        concerns: concerns || [],
        level: level || 'beginner'
      });

      return res.status(201).json({ success: true, data: profile });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set Skin Type
// @route   POST /api/profile/skin-type
// @access  Private
const setSkinType = async (req, res) => {
  try {
    const { skinType } = req.body;
    if (!skinType) {
      return res.status(400).json({ success: false, message: 'Skin type is required' });
    }

    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user.id, skinType });
    } else {
      profile.skinType = skinType;
      await profile.save();
    }
    
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set Skin Concerns
// @route   POST /api/profile/concerns
// @access  Private
const setConcerns = async (req, res) => {
  try {
    const { concerns } = req.body;
    if (!concerns || !Array.isArray(concerns)) {
      return res.status(400).json({ success: false, message: 'Concerns array is required' });
    }

    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user.id, concerns });
    } else {
      profile.concerns = concerns;
      await profile.save();
    }
    
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  upsertProfile,
  setSkinType,
  setConcerns
};
