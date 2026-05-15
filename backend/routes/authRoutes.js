const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  register,
  login,
  getMe,
  toggleFavorite,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/favorite/:menuId', protect, toggleFavorite);

module.exports = router;
