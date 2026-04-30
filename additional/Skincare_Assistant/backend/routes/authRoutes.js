const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/verify', protect, verifyUser);

// Optional: Logout can often be handled pure-client side by destroying the token, 
// but we add a simple endpoint for structure.
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
