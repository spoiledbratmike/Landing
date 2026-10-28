# The Lightworker Coach — Welcome Page

A single-page React + Vite + Tailwind site deployed on **Netlify**. The Welcome page is the homepage (`/`). Three forms (self-check, free call, founding member) submit to a Netlify serverless function that sends confirmation emails, notifies Peter of call requests, and stores submissions in Neon PostgreSQL.

---

## Project Structure

```
/
├── netlify.toml              # Netlify build config + redirects
├── .env.example              # Environment variable template (no secrets)
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config (React + Tailwind + singlefile)
├── index.html                # Entry HTML
├── public/
│   └── images/               # hero.jpg, peter.jpg, typewriter.jpg, etc.
├── netlify/
│   ├── functions/
│   │   ├── submit.js         # Serverless form handler (email + Postgres)
│   │   └── Where is your practice right now - self-check.pdf  # PDF attachment
│   └── (functions dir)
├── src/
│   ├── App.tsx               # Router — Welcome at "/" and "*"
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind styles
│   ├── pages/
│   │   └── Welcome.tsx       # Homepage (the welcome page)
│   └── components/
│       └── Icons.tsx         # SVG icons (Sun, Arrow, Check, Quote, Mail)
└── dist/                     # Build output (gitignored)
```

---

## How It Works

### Form Flow

1. Visitor fills out a form on the Welcome page (`/`).
2. The form POSTs to `/.netlify/functions/submit?form_type=<selfCheck|call|founding>`.
3. The Netlify serverless function (`netlify/functions/submit.js`):
   - **Stores** the submission in Neon PostgreSQL (tables: `self_check_submissions`, `call_requests`, `founding_members`).
   - **Sends a confirmation email** to the visitor with the exact wording below.
   - **For call requests only:** sends Peter a notification email with the caller's details.
   - **For self-check only:** attaches `Where is your practice right now - self-check.pdf` to the visitor's email.

### Email Templates

#### 1. Self-check form — visitor email
**Subject:** Your self-check is here

```
Dear {first name},

Thank you for patiently listening to me on Friday's call, and for asking for the self-check. You'll find it attached [or: download it here].

Take ten quiet minutes with it. There are no right or wrong answers. Just an honest look at where your practice is today, and the next gentle step.

If you'd like to talk it through, simply reply to this email.

With love and light, Peter
```
**Attachment:** `Where is your practice right now - self-check.pdf` (auto-attached)

---

#### 2. Call request form — visitor email
**Subject:** Your free call with Peter

```
Dear {first name},

Thank you for asking for a call. I'll email you within two working days with some times to choose from. I'm looking forward to hearing about your practice.

With love and light, Peter
```

**Peter notification email:**
**Subject:** New free call request from {first name}

```
New free call request:

First name: {first name}
Email: {email}
Phone: {phone}
Help with: {help_with}
```

---

#### 3. Founding member form — visitor email
**Subject:** Your founding place is reserved

```
Dear {first name},

Thank you. Your place as a founding member of my monthly letter is reserved, at £29 a month, locked in for as long as you stay.

There's nothing to pay now. In December I'll email you a simple link to set up your monthly payment, and your first letter will arrive in January 2027.

If anything changes for you before then, just reply to this email.

With love and light, Peter
```

---

## Netlify Deployment

### Build Settings
| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |

### Environment Variables (Netlify Dashboard)

Go to **Site settings → Environment variables** and add:

| Variable | Example Value |
|----------|---------------|
| `SMTP_HOST` | `your-smtp-host.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `your-smtp-user@domain.com` |
| `SMTP_PASSWORD` | `your-smtp-password` |
| `SMTP_FROM_EMAIL` | `your-smtp-user@domain.com` |
| `SMTP_FROM_NAME` | `Your Name` |
| `NOTIFY_TO` | `your-notify@domain.com` |
| `DATABASE_URL` | `your-database-connection-string` |
| `SITE_URL` | `https://your-site.netlify.app` |

> ⚠️ **Security:** Do not commit `.env` to version control. The `.env.example` file is a safe template. Real secrets go only in Netlify's dashboard.

### Local Development
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

### Netlify Redirects (`netlify.toml`)

All routes fall back to `/index.html` so React Router handles client-side navigation and page refreshes work correctly.

---

## Database (Neon / PostgreSQL)

Three tables must exist in Neon (already created per project notes):

| Table | Used by |
|-------|---------|
| `self_check_submissions` | Self-check form |
| `call_requests` | Call request form |
| `founding_members` | Founding member form |

Self-check uses **upsert by email** (resubmissions update the existing row). Call requests and founding members use plain insert.

---

## Files Removed for Netlify

The following were removed because Netlify is a static host and cannot run PHP/Node backend code:

- `submit.php`, `submit.php.bak`, `server.bak`, `verify-email.mjs`, `public/submit.php` — PHP/backend
- `.env`, `.env.bak`, `.env.example` (old) — contained real secrets; replaced with safe `.env.example`
- `cors`, `express`, `multer`, `dotenv`, `nodemailer` (frontend), `pg` (frontend) — backend-only npm packages
- `test-local/`, `source/`, `welcome.html` — legacy/standalone pipeline
- `Home`, `About`, `Services`, `Blog`, `Contact` pages — only Welcome page remains

---

## Support

For issues with form submissions, check **Netlify function logs** in the dashboard. Email and database errors are logged there.