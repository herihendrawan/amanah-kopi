// backend/config/seedContent.js
// Jalankan SEKALI untuk membuat dokumen SiteContent default di MongoDB:
// node backend/config/seedContent.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const SiteContent = require('../models/SiteContent');
const connectDB  = require('./database');

const DEFAULTS = [
  {
    section: 'branding',
    siteName: 'Kedai Kopi Modern',
    logo: '',
    favicon: '',
  },
  {
    section: 'hero',
    heroTitle: 'Selamat Datang di Kedai Kopi Modern',
    heroSubtitle: 'Nikmati cita rasa kopi pilihan dengan suasana yang nyaman dan hangat.',
    heroButtonText: 'Lihat Menu Kami',
    heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200',
  },
  {
    section: 'about',
    aboutTitle: 'Tentang Kami',
    aboutDescription:
      'Kedai Kopi Modern hadir sejak 2018 dengan misi menyajikan kopi berkualitas tinggi dari petani lokal terbaik Indonesia. Kami percaya setiap cangkir kopi adalah sebuah cerita.',
    aboutMission: 'Menyajikan pengalaman kopi terbaik yang menghubungkan petani lokal dengan pencinta kopi.',
    aboutVision: 'Menjadi kedai kopi terpercaya yang membawa kopi Indonesia ke tingkat yang lebih tinggi.',
    aboutImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  },
  {
    section: 'contact',
    address: 'Jl. Kopi No. 1, Pekanbaru, Riau',
    phone: '+62 812-0000-0000',
    email: 'halo@kedaikopi.com',
    whatsapp: '6281200000000',
    instagram: '@kedaikopimodern',
    facebook: 'kedaikopimodern',
    openHours: {
      monday:    { open: '08:00', close: '22:00', isOpen: true },
      tuesday:   { open: '08:00', close: '22:00', isOpen: true },
      wednesday: { open: '08:00', close: '22:00', isOpen: true },
      thursday:  { open: '08:00', close: '22:00', isOpen: true },
      friday:    { open: '08:00', close: '23:00', isOpen: true },
      saturday:  { open: '09:00', close: '23:00', isOpen: true },
      sunday:    { open: '09:00', close: '21:00', isOpen: true },
    },
  },
  {
    section: 'gallery',
    galleryTitle: 'Galeri Kami',
    gallerySubtitle: 'Momen-momen terbaik di Kedai Kopi Modern',
    galleryImages: [],
  },
  {
    section: 'testimonials',
    testimonialsTitle: 'Apa Kata Pelanggan Kami',
    testimonials: [
      {
        name: 'Andi Pratama',
        comment: 'Kopinya enak banget! Suasananya juga nyaman, cocok buat kerja atau hangout bareng teman.',
        rating: 5,
        avatar: '',
        isVisible: true,
        order: 0,
      },
      {
        name: 'Siti Rahayu',
        comment: 'Pelayanannya ramah dan cepat. Menu non-coffee-nya juga bervariasi. Pasti balik lagi!',
        rating: 5,
        avatar: '',
        isVisible: true,
        order: 1,
      },
    ],
  },
];

(async () => {
  await connectDB();
  console.log('🌱 Seeding SiteContent...');

  for (const doc of DEFAULTS) {
    await SiteContent.findOneAndUpdate(
      { section: doc.section },
      { $setOnInsert: doc }, // hanya insert jika belum ada
      { upsert: true, new: true }
    );
    console.log(`  ✅ ${doc.section} ready`);
  }

  console.log('\n🎉 Seed selesai! Semua section SiteContent sudah tersedia.');
  mongoose.disconnect();
})();
