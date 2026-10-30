require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { pool } = require('./db');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const { notFound, errorHandler } = require('./middleware/errors');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET is missing or shorter than 32 characters. Set it in server/.env');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1); // correct client IPs behind Nginx / cPanel proxy

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // let the React site load /uploads photos
  contentSecurityPolicy: false, // the React build sets its own; API returns JSON only
}));
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
}));
app.use(express.json({ limit: '1mb' }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), { maxAge: '30d', immutable: true }));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch {
    res.status(503).json({ ok: false, db: 'unreachable' });
  }
});

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', notFound);

// Optional: serve the built React site from this same server
const clientDir = process.env.CLIENT_BUILD_DIR && path.resolve(__dirname, '..', process.env.CLIENT_BUILD_DIR);
if (clientDir && fs.existsSync(path.join(clientDir, 'index.html'))) {
  app.use(express.static(clientDir, { maxAge: '7d', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(clientDir, 'index.html')));
}

app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`CBC PNG API listening on http://localhost:${port}`));
