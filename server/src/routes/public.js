const express = require('express');
const rateLimit = require('express-rate-limit');
const { query } = require('../db');

const router = express.Router();

// Bank details only leave the server once church finance has approved them.
const BANK_KEYS = ['bank_name', 'bank_account_name', 'bank_account_number', 'bank_branch', 'bank_reference', 'overseas_giving'];

/**
 * GET /api/site
 * Everything the public pages need except news and congregations,
 * in one request so pages render without waterfalls.
 */
router.get('/site', async (req, res, next) => {
  try {
    const [
      settingsRows, stats, ministries, values, leaders, provinces, youthActivities, events,
      institutions, schoolLevels, secretaries, facilityTypes, programmes, partners,
      missionaries, history, gallery, publications, bookshops, partnershipWays, ministryContacts,
      congregationCount,
    ] = await Promise.all([
      query('SELECT setting_key, setting_value FROM settings'),
      query("SELECT id, section, value, label FROM stats ORDER BY FIELD(section,'home','education','health'), sort_order, id"),
      query('SELECT id, title, summary, link, image_url, image_alt FROM ministries ORDER BY sort_order, id'),
      query('SELECT id, title, description FROM church_values ORDER BY sort_order, id'),
      query('SELECT id, full_name, title, photo_url FROM leaders ORDER BY sort_order, id'),
      query('SELECT id, name FROM provinces ORDER BY name'),
      query('SELECT id, title FROM youth_activities ORDER BY sort_order, id'),
      query(`SELECT id, ministry, title, event_date, date_text, venue FROM events
             WHERE event_date IS NULL OR event_date >= CURDATE()
             ORDER BY event_date IS NULL, event_date, id`),
      query('SELECT id, category, name, location, courses, length, intake, fees, contact FROM institutions ORDER BY category, sort_order, id'),
      query('SELECT id, level, number_of_schools, students, provinces FROM school_levels ORDER BY sort_order, id'),
      query('SELECT id, province, full_name, office, phone, email FROM education_secretaries ORDER BY sort_order, province'),
      query('SELECT id, facility_type, number, provinces FROM health_facility_types ORDER BY sort_order, id'),
      query('SELECT id, title FROM health_programmes ORDER BY sort_order, id'),
      query('SELECT id, name, country, website FROM mission_partners ORDER BY sort_order, id'),
      query('SELECT id, full_name, country, ministry, photo_url FROM missionaries WHERE public_consent = 1 ORDER BY sort_order, id'),
      query('SELECT id, year_label, description FROM history_events ORDER BY sort_order, id'),
      query('SELECT id, section, caption, image_url FROM gallery_images ORDER BY section, sort_order, id'),
      query('SELECT id, title FROM publications ORDER BY sort_order, id'),
      query('SELECT id, name, town, address, phone, hours FROM bookshops ORDER BY sort_order, name'),
      query('SELECT id, text FROM partnership_ways ORDER BY sort_order, id'),
      query('SELECT id, ministry, contact FROM ministry_contacts ORDER BY sort_order, id'),
      query('SELECT COUNT(*) AS n FROM congregations'),
    ]);

    const settings = Object.fromEntries(settingsRows.map((r) => [r.setting_key, r.setting_value]));
    if (settings.bank_details_approved !== '1') BANK_KEYS.forEach((k) => { settings[k] = null; });

    const groupBy = (rows, key) => rows.reduce((acc, r) => {
      (acc[r[key]] = acc[r[key]] || []).push(r);
      return acc;
    }, {});

    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      settings,
      stats: groupBy(stats, 'section'),
      ministries,
      values,
      leaders,
      provinces,
      congregationCount: congregationCount[0].n,
      youthActivities,
      events: groupBy(events, 'ministry'),
      institutions: groupBy(institutions, 'category'),
      schoolLevels,
      secretaries,
      facilityTypes,
      programmes,
      partners,
      missionaries,
      history,
      gallery: groupBy(gallery, 'section'),
      publications,
      bookshops,
      partnershipWays,
      ministryContacts,
    });
  } catch (err) { next(err); }
});

/** GET /api/news?limit=3&page=1 */
router.get('/news', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * limit;
    const [items, total] = await Promise.all([
      query(
        `SELECT id, title, slug, summary, image_url, image_alt, published_at FROM news
         WHERE is_published = 1
         ORDER BY COALESCE(published_at, DATE(created_at)) DESC, id DESC
         LIMIT ? OFFSET ?`,
        [limit, offset],
      ),
      query('SELECT COUNT(*) AS n FROM news WHERE is_published = 1'),
    ]);
    res.json({ items, page, limit, total: total[0].n, pages: Math.max(1, Math.ceil(total[0].n / limit)) });
  } catch (err) { next(err); }
});

/** GET /api/news/:slug */
router.get('/news/:slug', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT id, title, slug, summary, body, image_url, image_alt, published_at FROM news
       WHERE slug = ? AND is_published = 1 LIMIT 1`,
      [req.params.slug],
    );
    if (!rows.length) return res.status(404).json({ error: 'This story could not be found. It may have been removed.' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

/** GET /api/congregations?province_id=3&q=gordons */
router.get('/congregations', async (req, res, next) => {
  try {
    const where = [];
    const params = [];
    if (req.query.province_id) { where.push('c.province_id = ?'); params.push(Number(req.query.province_id)); }
    if (req.query.q) {
      where.push('(c.name LIKE ? OR c.town LIKE ?)');
      const like = `%${String(req.query.q).slice(0, 80)}%`;
      params.push(like, like);
    }
    const rows = await query(
      `SELECT c.id, c.name, c.town, c.contact_person, c.phone, c.service_time,
              p.id AS province_id, p.name AS province
       FROM congregations c JOIN provinces p ON p.id = c.province_id
       ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY p.name, c.name`,
      params,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

/** POST /api/contact  — message from the Contact page form */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many messages sent from this connection. Wait 15 minutes and try again.' },
});

router.post('/contact', contactLimiter, async (req, res, next) => {
  try {
    const { full_name, email, phone, subject, message, website } = req.body || {};
    // "website" is a hidden honeypot field: real people leave it empty.
    if (website) return res.status(201).json({ ok: true });

    const errors = {};
    const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
    const data = {
      full_name: clean(full_name, 120),
      email: clean(email, 160),
      phone: clean(phone, 40),
      subject: clean(subject, 160),
      message: clean(message, 5000),
    };
    if (!data.full_name) errors.full_name = 'Enter your name.';
    if (!data.email && !data.phone) errors.email = 'Enter an email address or a phone number so we can reply.';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter an email address like name@example.com.';
    if (!data.subject) errors.subject = 'Choose what your message is about.';
    if (data.message.length < 10) errors.message = 'Write a message of at least 10 characters.';
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Check the highlighted fields.', fields: errors });

    await query(
      'INSERT INTO contact_messages (full_name, email, phone, subject, message, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [data.full_name, data.email || null, data.phone || null, data.subject, data.message, req.ip],
    );
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
