const mongoose = require('mongoose');

/**
 * SiteContent Model
 * Menyimpan semua konten website yang bisa di-edit lewat CMS.
 * Setiap dokumen punya `section` unik (hero, about, contact, gallery, testimonials, branding).
 */
const siteContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: ['branding', 'hero', 'about', 'contact', 'gallery', 'testimonials'],
    },

    // ─── BRANDING ─────────────────────────────────────────
    logo: { type: String, default: '' },
    siteName: { type: String, default: 'Kedai Kopi' },
    favicon: { type: String, default: '' },
    footerTagline: { type: String, default: 'Menyajikan pengalaman kopi terbaik dari biji pilihan petani lokal Indonesia.' },

    // ─── HERO ─────────────────────────────────────────────
    heroTitle: { type: String, default: 'Selamat Datang di Kedai Kopi' },
    heroSubtitle: { type: String, default: 'Nikmati kopi terbaik kami' },
    heroButtonText: { type: String, default: 'Lihat Menu' },
    heroImage: { type: String, default: '' },
    heroEyebrow: { type: String, default: '' },
    foundedYear: { type: String, default: '2018' },
    city: { type: String, default: 'Pekanbaru, Riau' },

    // ─── MENU SECTION (homepage) ──────────────────────────
    menuSectionEyebrow: { type: String, default: 'Menu Pilihan' },
    menuSectionTitle: { type: String, default: 'Temukan Favorit Kamu' },
    menuSectionSubtitle: { type: String, default: 'Dibuat dengan biji kopi pilihan dari petani lokal terbaik Indonesia, diseduh dengan penuh cinta.' },

    // ─── ABOUT ────────────────────────────────────────────
    aboutTitle: { type: String, default: 'Tentang Kami' },
    aboutDescription: { type: String, default: '' },
    aboutImage: { type: String, default: '' },
    aboutMission: { type: String, default: '' },
    aboutVision: { type: String, default: '' },
    aboutSinceLabel: { type: String, default: 'Berdiri Sejak' }, // teks "Berdiri Sejak"
    aboutSinceYear: { type: String, default: '2018' },           // tahun di kotak about

    // ─── CONTACT ──────────────────────────────────────────
    // section: 'contact'
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    openHours: {
      // Jam buka per hari
      monday:    { open: { type: String, default: '08:00' }, close: { type: String, default: '22:00' }, isOpen: { type: Boolean, default: true } },
      tuesday:   { open: { type: String, default: '08:00' }, close: { type: String, default: '22:00' }, isOpen: { type: Boolean, default: true } },
      wednesday: { open: { type: String, default: '08:00' }, close: { type: String, default: '22:00' }, isOpen: { type: Boolean, default: true } },
      thursday:  { open: { type: String, default: '08:00' }, close: { type: String, default: '22:00' }, isOpen: { type: Boolean, default: true } },
      friday:    { open: { type: String, default: '08:00' }, close: { type: String, default: '23:00' }, isOpen: { type: Boolean, default: true } },
      saturday:  { open: { type: String, default: '09:00' }, close: { type: String, default: '23:00' }, isOpen: { type: Boolean, default: true } },
      sunday:    { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, isOpen: { type: Boolean, default: true } },
    },

    // ─── GALLERY ──────────────────────────────────────────
    // section: 'gallery'
    galleryTitle: { type: String, default: 'Galeri Kami' },
    gallerySubtitle: { type: String, default: 'Momen terbaik di kedai kami' },
    galleryImages: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        order: { type: Number, default: 0 },
      },
    ],

    // ─── TESTIMONIALS ─────────────────────────────────────
    // section: 'testimonials'
    testimonialsTitle: { type: String, default: 'Apa Kata Pelanggan Kami' },
    testimonials: [
      {
        name: { type: String, required: true },
        avatar: { type: String, default: '' },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        comment: { type: String, required: true },
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);