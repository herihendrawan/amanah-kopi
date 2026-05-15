const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage untuk gambar menu
const menuStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'kedai-kopi/menu',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

// Storage untuk galeri
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'kedai-kopi/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, quality: 'auto' }],
  },
});

// Storage untuk avatar/branding
const generalStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'kedai-kopi/general',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, quality: 'auto' }],
  },
});

const uploadMenu    = multer({ storage: menuStorage,    limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGallery = multer({ storage: galleryStorage, limits: { fileSize: 8 * 1024 * 1024 } });
const uploadGeneral = multer({ storage: generalStorage, limits: { fileSize: 5 * 1024 * 1024 } });

// Helper: upload base64 atau URL langsung ke Cloudinary
const uploadFromUrl = async (url, folder = 'kedai-kopi/general') => {
  const result = await cloudinary.uploader.upload(url, {
    folder,
    transformation: [{ width: 1000, quality: 'auto' }],
  });
  return result.secure_url;
};

const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, uploadMenu, uploadGallery, uploadGeneral, uploadFromUrl, deleteImage };
