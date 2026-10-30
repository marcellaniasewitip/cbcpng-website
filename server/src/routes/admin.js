const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { query } = require('../db');
const { requireAdmin } = require('../middleware/auth');
const resources = require('../resources');

const router = express.Router();

/* ------------------------------------------------------------------ */
/* Sign in                                                             */
/* ------------------------------------------------------------------ */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Wait 15 minutes and try again.' },
});

router.post('/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const rows = await query('SELECT id, full_name, email, password_hash FROM admins WHERE email = ? LIMIT 1', [email]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }
    await query('UPDATE admins SET last_login_at = NOW() WHERE id = ?', [admin.id]);
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    );
    res.json({ token, admin: { id: admin.id, name: admin.full_name, email: admin.email } });
  } catch (err) { next(err); }
});

// Everything below needs a valid admin token
router.use(requireAdmin);

router.get('/auth/me', (req, res) => res.json({ admin: req.admin }));

router.post('/auth/password', async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body || {};
    if (!new_password || String(new_password).length < 10) {
      return res.status(422).json({ error: 'New password must be at least 10 characters.' });
    }
    const rows = await query('SELECT password_hash FROM admins WHERE id = ?', [req.admin.id]);
    if (!rows[0] || !(await bcrypt.compare(String(current_password || ''), rows[0].password_hash))) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }
    const hash = await bcrypt.hash(String(new_password), 12);
    await query('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, req.admin.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ------------------------------------------------------------------ */
/* Dashboard summary                                                   */
/* ------------------------------------------------------------------ */
router.get('/summary', async (req, res, next) => {
  try {
    const [settings, messages, news, congregations] = await Promise.all([
      query("SELECT COUNT(*) AS total, SUM(setting_value IS NULL OR setting_value = '') AS empty FROM settings"),
      query('SELECT COUNT(*) AS total, SUM(is_read = 0) AS unread FROM contact_messages'),
      query('SELECT COUNT(*) AS total FROM news'),
      query('SELECT COUNT(*) AS total FROM congregations'),
    ]);
    res.json({
      settingsTotal: Number(settings[0].total), settingsEmpty: Number(settings[0].empty || 0),
      messagesTotal: Number(messages[0].total), messagesUnread: Number(messages[0].unread || 0),
      newsTotal: Number(news[0].total), congregationsTotal: Number(congregations[0].total),
    });
  } catch (err) { next(err); }
});

/* ------------------------------------------------------------------ */
/* Resource definitions (drives the admin forms)                       */
/* ------------------------------------------------------------------ */
router.get('/meta', (req, res) => {
  const meta = Object.entries(resources).map(([key, r]) => ({ key, label: r.label, group: r.group, fields: r.fields }));
  res.json(meta);
});

/* ------------------------------------------------------------------ */
/* Site settings (key/value)                                           */
/* ------------------------------------------------------------------ */
router.get('/settings', async (req, res, next) => {
  try {
    res.json(await query('SELECT setting_key, setting_value, label, group_name, input_type FROM settings ORDER BY sort_order, setting_key'));
  } catch (err) { next(err); }
});

router.put('/settings', async (req, res, next) => {
  try {
    const updates = req.body && typeof req.body === 'object' ? req.body : {};
    const known = new Set((await query('SELECT setting_key FROM settings')).map((r) => r.setting_key));
    const entries = Object.entries(updates).filter(([k]) => known.has(k));
    await Promise.all(entries.map(([k, v]) => {
      const value = v === null || v === undefined || String(v).trim() === '' ? null : String(v);
      return query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [value, k]);
    }));
    res.json({ ok: true, updated: entries.length });
  } catch (err) { next(err); }
});

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */
router.get('/messages', async (req, res, next) => {
  try {
    res.json(await query('SELECT * FROM contact_messages ORDER BY is_read ASC, created_at DESC LIMIT 500'));
  } catch (err) { next(err); }
});

router.patch('/messages/:id', async (req, res, next) => {
  try {
    await query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [req.body?.is_read ? 1 : 0, Number(req.params.id)]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete('/messages/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM contact_messages WHERE id = ?', [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ------------------------------------------------------------------ */
/* Photo upload                                                        */
/* ------------------------------------------------------------------ */
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED[file.mimetype]}`),
  }),
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    const err = new Error('Upload a JPG, PNG, WebP or GIF photo.');
    err.status = 415;
    return cb(err);
  },
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(422).json({ error: 'Choose a photo to upload.' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

/* ------------------------------------------------------------------ */
/* Generic CRUD for every table in resources.js                        */
/* ------------------------------------------------------------------ */
function getResource(req, res) {
  const r = resources[req.params.resource];
  if (!r) { res.status(404).json({ error: 'Unknown section.' }); return null; }
  return r;
}

function slugify(text) {
  return String(text).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 200) || `story-${Date.now()}`;
}

function buildRow(resource, body, resourceKey) {
  const row = {};
  const errors = {};
  for (const f of resource.fields) {
    let v = body[f.name];
    if (v === undefined) continue;
    if (typeof v === 'string') v = v.trim();
    if (v === '') v = null;
    if (f.type === 'boolean') v = v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0;
    if ((f.type === 'number' || f.type === 'province') && v !== null) {
      v = Number(v);
      if (!Number.isFinite(v)) errors[f.name] = `${f.label} must be a number.`;
    }
    if (f.type === 'date' && v !== null && !/^\d{4}-\d{2}-\d{2}$/.test(v)) errors[f.name] = `${f.label} must be a date.`;
    if (f.type === 'select' && v !== null && !f.options.some((o) => o.value === v)) errors[f.name] = `Choose a valid ${f.label.toLowerCase()}.`;
    if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors[f.name] = 'Enter an email address like name@example.com.';
    if (f.required && (v === null || v === undefined)) errors[f.name] = `${f.label} is required.`;
    row[f.name] = v;
  }
  if (resourceKey === 'news' && 'title' in row) {
    row.slug = slugify(row.slug || row.title);
  }
  return { row, errors };
}

router.get('/r/:resource', async (req, res, next) => {
  try {
    const r = getResource(req, res); if (!r) return;
    const cols = ['id', ...r.fields.map((f) => f.name)];
    res.json(await query(`SELECT ${cols.map((c) => `\`${c}\``).join(', ')} FROM \`${req.params.resource}\` ORDER BY ${r.orderBy}`));
  } catch (err) { next(err); }
});

router.post('/r/:resource', async (req, res, next) => {
  try {
    const r = getResource(req, res); if (!r) return;
    const body = { ...Object.fromEntries(r.fields.filter((f) => f.default !== undefined).map((f) => [f.name, f.default])), ...req.body };
    // Required fields must be validated on create even if absent from the body
    r.fields.forEach((f) => { if (!(f.name in body)) body[f.name] = null; });
    const { row, errors } = buildRow(r, body, req.params.resource);
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Check the highlighted fields.', fields: errors });
    const cols = Object.keys(row);
    const result = await query(
      `INSERT INTO \`${req.params.resource}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
      cols.map((c) => row[c]),
    );
    res.status(201).json({ id: result.insertId, ...row });
  } catch (err) { next(err); }
});

router.put('/r/:resource/:id', async (req, res, next) => {
  try {
    const r = getResource(req, res); if (!r) return;
    const { row, errors } = buildRow(r, req.body || {}, req.params.resource);
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Check the highlighted fields.', fields: errors });
    const cols = Object.keys(row);
    if (!cols.length) return res.status(422).json({ error: 'Nothing to save.' });
    const result = await query(
      `UPDATE \`${req.params.resource}\` SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((c) => row[c]), Number(req.params.id)],
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'This item no longer exists.' });
    res.json({ id: Number(req.params.id), ...row });
  } catch (err) { next(err); }
});

router.delete('/r/:resource/:id', async (req, res, next) => {
  try {
    const r = getResource(req, res); if (!r) return;
    await query(`DELETE FROM \`${req.params.resource}\` WHERE id = ?`, [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
