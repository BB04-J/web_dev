const Profile = require('../models/Profile');

// Free, zero-cost local recommendation engine based on PRD logic
const generateRecommendationLogic = (skinType, concerns, level) => {
  let recommendations = [];

  if (skinType === 'oily') {
    recommendations = [
      { step: 1, category: 'cleanser', name: 'Gel-based cleanser', ingredients: ['Salicylic Acid'], benefits: ['Controls oil', 'Unclogs pores'] },
      { step: 2, category: 'serum', name: 'Niacinamide serum', ingredients: ['Niacinamide'], benefits: ['Reduces sebum', 'Minimizes pores'] },
      { step: 3, category: 'moisturizer', name: 'Oil-free moisturizer', ingredients: ['Hyaluronic Acid'], benefits: ['Hydrates without grease'] },
      { step: 4, category: 'sunscreen', name: 'Mattifying sunscreen', ingredients: ['Zinc Oxide'], benefits: ['Sun protection', 'Matte finish'] }
    ];
  } else if (skinType === 'dry') {
    recommendations = [
      { step: 1, category: 'cleanser', name: 'Cream cleanser', ingredients: ['Ceramides'], benefits: ['Gentle cleansing', 'Protects skin barrier'] },
      { step: 2, category: 'serum', name: 'Hyaluronic acid serum', ingredients: ['Hyaluronic Acid'], benefits: ['Deep hydration', 'Plumps skin'] },
      { step: 3, category: 'moisturizer', name: 'Ceramide moisturizer', ingredients: ['Ceramides', 'Glycerin'], benefits: ['Locks in moisture', 'Repairs barrier'] },
      { step: 4, category: 'sunscreen', name: 'Hydrating sunscreen', ingredients: ['Titanium Dioxide'], benefits: ['Sun protection', 'Moisturizing'] }
    ];
  } else if (skinType === 'combination') {
    recommendations = [
      { step: 1, category: 'cleanser', name: 'Gentle foaming cleanser', ingredients: ['Amino Acids'], benefits: ['Balances oil and dry areas'] },
      { step: 2, category: 'serum', name: 'Niacinamide + Hyaluronic acid', ingredients: ['Niacinamide', 'Hyaluronic Acid'], benefits: ['Hydrates and controls oil'] },
      { step: 3, category: 'moisturizer', name: 'Lightweight moisturizer', ingredients: ['Squalane'], benefits: ['Non-heavy hydration'] },
      { step: 4, category: 'sunscreen', name: 'Broad spectrum sunscreen', ingredients: ['Zinc Oxide'], benefits: ['Sun protection', 'Lightweight'] }
    ];
  } else {
    // Default or Normal skin
    recommendations = [
      { step: 1, category: 'cleanser', name: 'Gentle Cleanser', ingredients: ['Glycerin'], benefits: ['Cleanses without stripping'] },
      { step: 2, category: 'moisturizer', name: 'Daily Moisturizer', ingredients: ['Hyaluronic Acid'], benefits: ['Maintains hydration'] },
      { step: 3, category: 'sunscreen', name: 'Daily Sunscreen', ingredients: ['Broad Spectrum UV Filters'], benefits: ['Sun protection'] }
    ];
  }

  // Add specific ingredients based on concerns (Mock logic)
  if (concerns.includes('acne')) {
    recommendations.push({ step: 5, category: 'treatment', name: 'Spot Treatment', ingredients: ['Salicylic Acid', 'Benzoyl Peroxide'], benefits: ['Treats active breakouts'] });
  }
  if (concerns.includes('pigmentation') || concerns.includes('dark-circles')) {
    recommendations.push({ step: 5, category: 'treatment', name: 'Vitamin C Serum', ingredients: ['Vitamin C', 'Alpha Arbutin'], benefits: ['Brightens skin', 'Fades dark spots'] });
  }

  return recommendations;
};

// @desc    Get recommendations based on user profile
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please complete your skin profile first to get recommendations.' 
      });
    }

    // Since we are using zero-cost implementation, we use our local logic
    const recommendations = generateRecommendationLogic(
      profile.skinType, 
      profile.concerns, 
      profile.level
    );

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate new recommendations (similar to GET, but could be used to force refresh)
// @route   POST /api/recommendations/generate
// @access  Private
const generateRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please complete your skin profile first.' 
      });
    }

    const recommendations = generateRecommendationLogic(
      profile.skinType, 
      profile.concerns, 
      profile.level
    );

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendations,
  generateRecommendations
};
