const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  getMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../controllers/menuController');

router.get('/', getMenus);
router.get('/:id', getMenu);
router.post('/', protect, adminOnly, createMenu);
router.put('/:id', protect, adminOnly, updateMenu);
router.delete('/:id', protect, adminOnly, deleteMenu);

module.exports = router;
