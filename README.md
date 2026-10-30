# Christian Brethren Church of Papua New Guinea — website

React (Vite) website + Node/Express API + MySQL database, with an editor at `/admin`
so church leaders can fill in every detail without touching code.

```
cbcpng/
├── database/
│   ├── schema.sql        All tables (run first)
│   └── seed.sql          Starting content from the approved draft
├── server/               Express API (port 5000)
│   ├── src/index.js      App entry
│   ├── src/resources.js  Editable tables and their fields (drives the admin forms)
│   ├── src/routes/       public.js (website) · admin.js (editor, login, uploads)
│   ├── scripts/create-admin.js
│   └── uploads/          Uploaded photos
└── client/               React website (port 5173 in development)
    └── src/
        ├── pages/        Home, About, Services, Publication, News, NewsArticle, Contact, Give
        ├── components/   Header, Footer, DataTable, Fill, Photo, FindChurch …
        ├── admin/        Editor: login, settings, lists, messages, password
        └── styles/global.css
```

## Requirements

- Node.js 18 or newer
- MySQL 8.0+ (or MariaDB 10.6+)

## 1. Create the database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Create a database user for the app (choose your own password):

```sql
CREATE USER 'cbcpng_app'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON cbcpng.* TO 'cbcpng_app'@'localhost';
FLUSH PRIVILEGES;
```

> Re-running `schema.sql` **deletes all data**. Only do it on a fresh install.

## 2. Start the API

```bash
cd server
cp .env.example .env      # then edit DB_PASSWORD and JWT_SECRET
npm install
npm run create-admin      # asks for name, email, password
npm run dev               # http://localhost:5000/api/health should say "connected"
```

Generate a JWT secret with:
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

If MySQL refuses `localhost`, set `DB_HOST=127.0.0.1`.

## 3. Start the website

```bash
cd client
npm install
npm run dev               # open http://localhost:5173
```

The editor is at http://localhost:5173/admin.

## Filling in the content

Anything empty in the database appears on the website as a dashed gold box, exactly
like the draft. Sign in at `/admin`:

- **Text & contact details**: head office, vision, mission, statement of faith,
  coordinator names, bank details, the draft banner on/off, and so on.
- **Lists** (left menu): congregations, leaders, events, colleges, schools,
  health, bookshops, missionaries, history, photos, news.
- **Messages**: everything sent through the Contact page form.

Safety switches built in:

- Bank details stay hidden on the public site until **“Bank details approved by
  church finance”** is ticked.
- Missionaries only appear once **“Has given permission to be shown publicly”** is ticked.
- Vision, mission and values show a “Draft to confirm” label until their
  “officially approved” boxes are ticked.

## Screen sizes

| Width | Layout |
|---|---|
| < 640px (phones) | Single column, menu button, tables become labelled cards, 2-column stats |
| 640–1023px (tablets) | Two-column grids, menu button opens a 2-column menu |
| ≥ 1024px (desktop) | Full navigation bar, 3–4 column grids |

Tested at 375px, 820px and 1440px with no sideways scrolling.

## Deploying (one server)

```bash
cd client && npm run build             # creates client/dist
cd ../server
# in .env: NODE_ENV=production, CLIENT_BUILD_DIR=../client/dist, CORS_ORIGIN=https://your-domain
npm install --omit=dev
npm start                              # use pm2 or systemd to keep it running
```

Express then serves the website, the API and uploaded photos from one address.
Put Nginx (or your host's proxy) in front for HTTPS, for example:

```nginx
server {
  server_name cbcpng.org www.cbcpng.org;
  client_max_body_size 6m;
  location / { proxy_pass http://127.0.0.1:5000; proxy_set_header Host $host;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme; }
}
```

Back up both the MySQL database and `server/uploads/` regularly:

```bash
mysqldump -u root -p cbcpng > cbcpng-$(date +%F).sql
```

## API reference

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/site` | All page content (settings and lists) |
| GET | `/api/news?page=1&limit=9` | Published news, newest first |
| GET | `/api/news/:slug` | One story |
| GET | `/api/congregations?province_id=&q=` | Church finder |
| POST | `/api/contact` | Contact form (5 per 15 min per connection) |
| POST | `/api/admin/auth/login` | Editor sign in (returns token) |
| GET/PUT | `/api/admin/settings` | Text and contact details |
| GET/POST/PUT/DELETE | `/api/admin/r/:resource[/:id]` | Any list in `resources.js` |
| POST | `/api/admin/upload` | Photo upload (JPG, PNG, WebP, GIF; 5 MB) |
| GET/PATCH/DELETE | `/api/admin/messages[/:id]` | Contact messages |

## Adding a new field or list

1. Add the column in `database/schema.sql` (and run an `ALTER TABLE` on the live database).
2. Add the field to that table in `server/src/resources.js`; the editor form appears automatically.
3. Include it in the matching query in `server/src/routes/public.js` and show it in the page under `client/src/pages/`.
