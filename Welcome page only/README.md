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
│   └── Where is your practice right now - self-check.pdf  # PDF attachment
├── netlify/
│   ├── functions/
│   │   ├── submit.mjs        # Serverless form handler (email + Postgres)
│   │   └── Where is your practice right now - self-check.pdf
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
3. The Netlify serverless function (`netlify/functions/submit.mjs`):
   - **Stores** the submission in Neon PostgreSQL (tables: `self_check_submissions`, `call_requests`, `founding_members`).
   - **Sends a confirmation email** to the visitor with branded HTML design.
   - **For call requests only:** sends Peter a notification email with the caller's details.
   - **For self-check only:** attaches `Where is your practice right now - self-check.pdf` to the visitor's email.

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

> ⚠️ **Security:** Do not commit `.env` to version control. Real secrets go only in Netlify's dashboard.

### Local Development
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

---

## Notes

- **Images** (`public/images/`) and the **self-check PDF** (`public/Where is your practice right now - self-check.pdf`) need to be added manually — they are binary files not recreated here.
- The site is configured as a **single-page application** — the Welcome page is the homepage at `/`.
