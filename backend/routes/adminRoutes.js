const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getDashboardStats }  = require('../controllers/adminController');

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
