const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

// ─── VALIDASI ENV KRITIS ──────────────────────────────────
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\n❌  ENV wajib tidak ditemukan: ${missing.join(', ')}`);
  console.error('   Salin .env.example ke .env dan isi nilai-nilainya.\n');
  process.exit(1);
}

const connectDB = require('./config/database');
connectDB();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ──────────────────────────────────────────────
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/menu',    require('./routes/menuRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/order',   require('./routes/orderRoutes'));
app.use('/api/admin',   require('./routes/adminRoutes'));
app.use('/api/upload',  require('./routes/uploadRoutes'));

// ─── HEALTH CHECK ─────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Server OK', env: process.env.NODE_ENV })
);

// ─── 404 ─────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}` })
);

// ─── ERROR HANDLER ────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`\n🚀  Server: http://localhost:${PORT}  [${process.env.NODE_ENV || 'development'}]\n`)
);
