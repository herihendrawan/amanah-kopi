const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { uploadMenu, uploadGallery, uploadGeneral, uploadFromUrl } = require('../config/cloudinary');

// Upload file gambar (multipart) — kembalikan URL Cloudinary
// POST /api/upload/menu    → untuk gambar menu
// POST /api/upload/gallery → untuk foto galeri
// POST /api/upload/general → untuk logo, hero, dll

router.post('/menu', protect, adminOnly, uploadMenu.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload.' });
  res.json({ success: true, url: req.file.path });
});

router.post('/gallery', protect, adminOnly, uploadGallery.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload.' });
  res.json({ success: true, url: req.file.path });
});

router.post('/general', protect, adminOnly, uploadGeneral.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload.' });
  res.json({ success: true, url: req.file.path });
});

// Upload dari URL/base64 → simpan ke Cloudinary
router.post('/url', protect, adminOnly, async (req, res) => {
  const { url, folder } = req.body;
  if (!url) return res.status(400).json({ success: false, message: 'URL wajib diisi.' });
  try {
    const cloudUrl = await uploadFromUrl(url, folder || 'kedai-kopi/general');
    res.json({ success: true, url: cloudUrl });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Gagal upload ke Cloudinary: ' + e.message });
  }
});

module.exports = router;
