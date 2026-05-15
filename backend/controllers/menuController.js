const { validationResult } = require('express-validator');
const Menu = require('../models/Menu');

// @desc    Get all menus with search & filter
// @route   GET /api/menu
// @access  Public
exports.getMenus = async (req, res) => {
  try {
    const { category, search, featured, promo } = req.query;
    const query = {};

    if (category && category !== 'all') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    if (promo === 'true') query.isPromo = true;

    const menus = await Menu.find(query).sort({ createdAt: -1 });

    res.json({ success: true, count: menus.length, data: menus });
  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Get single menu
// @route   GET /api/menu/:id
// @access  Public
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    }
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Create menu
// @route   POST /api/menu
// @access  Admin
exports.createMenu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const menu = await Menu.create(req.body);
    res.status(201).json({ success: true, message: 'Menu berhasil ditambahkan!', data: menu });
  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Update menu
// @route   PUT /api/menu/:id
// @access  Admin
exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Menu berhasil diupdate!', data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Delete menu
// @route   DELETE /api/menu/:id
// @access  Admin
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Menu berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};
