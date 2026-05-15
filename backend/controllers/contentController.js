const SiteContent = require('../models/SiteContent');

// Semua section yang valid
const SECTIONS = ['branding', 'hero', 'about', 'contact', 'gallery', 'testimonials'];

// Helper: ambil atau buat dokumen section
const getOrCreate = async (section) => {
  let doc = await SiteContent.findOne({ section });
  if (!doc) {
    doc = await SiteContent.create({ section });
  }
  return doc;
};

// @desc    Get semua konten website (public)
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    // Pastikan semua section tersedia
    const promises = SECTIONS.map((s) => getOrCreate(s));
    const docs = await Promise.all(promises);

    // Ubah array jadi object { branding: {...}, hero: {...}, ... }
    const result = {};
    docs.forEach((doc) => {
      result[doc.section] = doc;
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Get konten satu section
// @route   GET /api/content/:section
// @access  Public
exports.getSection = async (req, res) => {
  try {
    const { section } = req.params;
    if (!SECTIONS.includes(section)) {
      return res.status(400).json({ success: false, message: 'Section tidak valid.' });
    }

    const doc = await getOrCreate(section);
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Update konten satu section (field-level)
// @route   PUT /api/content/:section
// @access  Admin
exports.updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    if (!SECTIONS.includes(section)) {
      return res.status(400).json({ success: false, message: 'Section tidak valid.' });
    }

    // Hapus field yang tidak boleh di-override
    const body = { ...req.body };
    delete body.section;
    delete body._id;
    delete body.__v;

    const doc = await SiteContent.findOneAndUpdate(
      { section },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: `Section '${section}' berhasil diupdate!`, data: doc });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── GALLERY ITEMS ────────────────────────────────────────────────────────────

// @desc    Tambah foto ke galeri
// @route   POST /api/content/gallery/images
// @access  Admin
exports.addGalleryImage = async (req, res) => {
  try {
    const { url, caption, order } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL gambar wajib diisi.' });

    const doc = await getOrCreate('gallery');
    doc.galleryImages.push({ url, caption: caption || '', order: order || doc.galleryImages.length });
    await doc.save();

    res.status(201).json({ success: true, message: 'Foto berhasil ditambahkan!', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Hapus foto dari galeri
// @route   DELETE /api/content/gallery/images/:imageId
// @access  Admin
exports.deleteGalleryImage = async (req, res) => {
  try {
    const doc = await getOrCreate('gallery');
    doc.galleryImages = doc.galleryImages.filter(
      (img) => img._id.toString() !== req.params.imageId
    );
    await doc.save();

    res.json({ success: true, message: 'Foto berhasil dihapus!', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

// @desc    Tambah testimoni
// @route   POST /api/content/testimonials/items
// @access  Admin
exports.addTestimonial = async (req, res) => {
  try {
    const { name, comment, rating, avatar } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Nama dan komentar wajib diisi.' });
    }

    const doc = await getOrCreate('testimonials');
    doc.testimonials.push({
      name,
      comment,
      rating: rating || 5,
      avatar: avatar || '',
      isVisible: true,
      order: doc.testimonials.length,
    });
    await doc.save();

    res.status(201).json({ success: true, message: 'Testimoni berhasil ditambahkan!', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Update satu testimoni
// @route   PUT /api/content/testimonials/items/:testimonialId
// @access  Admin
exports.updateTestimonial = async (req, res) => {
  try {
    const doc = await getOrCreate('testimonials');
    const item = doc.testimonials.id(req.params.testimonialId);
    if (!item) return res.status(404).json({ success: false, message: 'Testimoni tidak ditemukan.' });

    Object.assign(item, req.body);
    await doc.save();

    res.json({ success: true, message: 'Testimoni berhasil diupdate!', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Hapus testimoni
// @route   DELETE /api/content/testimonials/items/:testimonialId
// @access  Admin
exports.deleteTestimonial = async (req, res) => {
  try {
    const doc = await getOrCreate('testimonials');
    doc.testimonials = doc.testimonials.filter(
      (t) => t._id.toString() !== req.params.testimonialId
    );
    await doc.save();

    res.json({ success: true, message: 'Testimoni berhasil dihapus!', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};
