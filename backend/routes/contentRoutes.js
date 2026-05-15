const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  getAllContent,
  getSection,
  updateSection,
  addGalleryImage,
  deleteGalleryImage,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/contentController');

// ─── PUBLIC ───────────────────────────────────────────────
router.get('/', getAllContent);

// FIX: route spesifik harus SEBELUM route parameter /:section
// agar /gallery/images dan /testimonials/items tidak tertangkap /:section

// Gallery (spesifik, harus di atas /:section)
router.post('/gallery/images',                   protect, adminOnly, addGalleryImage);
router.delete('/gallery/images/:imageId',         protect, adminOnly, deleteGalleryImage);

// Testimonials (spesifik, harus di atas /:section)
router.post('/testimonials/items',                protect, adminOnly, addTestimonial);
router.put('/testimonials/items/:testimonialId',  protect, adminOnly, updateTestimonial);
router.delete('/testimonials/items/:testimonialId', protect, adminOnly, deleteTestimonial);

// ─── GENERIC SECTION ROUTES (di bawah route spesifik) ─────
router.get('/:section',  getAllContent);   // fallback: ambil satu section
router.put('/:section',  protect, adminOnly, updateSection);

module.exports = router;
