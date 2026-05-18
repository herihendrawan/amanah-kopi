# ☕ Kedai Kopi Modern — Full Stack Web App

Website kedai kopi lengkap dengan CMS admin, manajemen menu, dashboard statistik, dan sistem order.

## Stack Teknologi
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React.js (Create React App)
- **Auth**: JWT + bcryptjs

## Cara Menjalankan

### 1. Persiapan (jalankan sekali)
Pastikan sudah install:
- [Node.js](https://nodejs.org) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (lokal) atau pakai MongoDB Atlas

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env     # lalu edit .env — isi MONGODB_URI & JWT_SECRET
npm run seed             # isi database dengan data contoh (menu + akun admin)
npm run seed:content     # isi konten awal website
npm run dev              # jalankan server di http://localhost:5000
```

### 3. Setup Frontend (terminal baru)
```bash
cd frontend
npm install
npm start                # buka http://localhost:3000
```

### 4. Login ke CMS
Buka: http://localhost:3000/admin/cms
```
Email    : heri@warungkopi.com
Password : heri321
```

## Struktur Folder
```
kedai-kopi-final/
├── backend/
│   ├── config/           # database.js, seed.js, seedContent.js
│   ├── controllers/      # auth, menu, content, order, admin
│   ├── middlewares/      # authMiddleware (JWT + role)
│   ├── models/           # User, Menu, Order, SiteContent
│   ├── routes/           # auth, menu, content, order, admin
│   ├── .env.example      # salin ke .env dan isi
│   └── server.js         # entry point
└── frontend/
    ├── public/
    └── src/
        ├── api/          # contentApi.js (semua HTTP calls)
        ├── hooks/        # useSiteContent
        ├── pages/
        │   └── admin/   # CMSPage.jsx + CMSPage.css
        ├── App.js        # routing + login page
        └── index.js
```

## Fitur CMS Admin
| Tab | Fitur |
|-----|-------|
| 📊 Dashboard | Statistik order, pendapatan, menu terlaris, grafik 7 hari |
| 🎨 Branding | Logo, nama site, favicon |
| 🏠 Hero | Judul, subtitle, CTA, background |
| 📖 Tentang | Deskripsi, visi, misi, foto |
| 📞 Kontak | Alamat, telepon, WA, Instagram, jam buka per hari |
| 🖼️ Galeri | Upload foto, caption, hapus |
| ⭐ Testimoni | Tambah/edit/hapus/sembunyikan ulasan |
| ☕ Menu | CRUD menu, filter, promo, featured, toggle tersedia |

## API Endpoints
```
POST   /api/auth/login          Login
POST   /api/auth/register       Register

GET    /api/menu                Semua menu (publik)
POST   /api/menu                Tambah menu (admin)
PUT    /api/menu/:id            Update menu (admin)
DELETE /api/menu/:id            Hapus menu (admin)

GET    /api/content             Semua konten (publik)
PUT    /api/content/:section    Update section (admin)
POST   /api/content/gallery/images        Tambah foto galeri
DELETE /api/content/gallery/images/:id   Hapus foto
POST   /api/content/testimonials/items   Tambah testimoni
PUT    /api/content/testimonials/items/:id
DELETE /api/content/testimonials/items/:id

POST   /api/order               Buat order (user)
GET    /api/order               Order user login
GET    /api/order/admin/all     Semua order (admin)
PUT    /api/order/:id/status    Update status (admin)

GET    /api/admin/stats         Dashboard stats (admin)
```

## Update Terbaru

### Fitur Baru
- **/menu** — Halaman menu lengkap dengan filter + search + tambah ke keranjang
- **/checkout** — Halaman checkout: pilih dine-in/takeaway/delivery, metode bayar, konfirmasi pesanan
- **/auth** — Halaman login & register pelanggan
- **CartDrawer** — Keranjang belanja slide-in dari kanan, tersedia di semua halaman
- **ImageUploader** — Komponen upload gambar: dua mode (URL + file lokal), fallback ke base64 jika Cloudinary belum dikonfigurasi
- **Cloudinary** — Upload gambar ke cloud (opsional, konfigurasikan di .env)

### Setup Cloudinary (Opsional tapi direkomendasikan)
1. Daftar gratis di https://cloudinary.com
2. Dashboard → Settings → API Keys
3. Tambahkan ke backend/.env:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. `npm install` ulang di folder backend

Jika Cloudinary tidak dikonfigurasi, upload gambar akan fallback ke base64 lokal dengan pesan peringatan.

### Halaman Lengkap
| URL | Halaman |
|-----|---------|
| / | Beranda (Hero, Menu featured, About, Galeri, Testimoni, Kontak) |
| /menu | Halaman menu lengkap dengan filter & keranjang |
| /checkout | Checkout & konfirmasi pesanan |
| /auth | Login & Register pelanggan |
| /admin/cms | Panel CMS Admin (butuh login admin) |
