import nodemailer from "nodemailer";
import { Pool } from "pg";

// Public URL for the self-check PDF (hosted on Netlify images — same domain as the site)
const SELF_CHECK_PDF_URL = "https://lightworkercoach.netlify.app/images/Where%20is%20your%20practice%20right%20now%20-%20self-check.pdf";

// Header logo used in every outgoing email (served from public/images on the site)
const EMAIL_LOGO_URL = `${process.env.DEPLOY_URL || process.env.URL || "https://lightworkercoach.netlify.app"}/images/email-logo.png`;

// Fetch the PDF from the public URL at send time (Netlify does not bundle arbitrary files with functions)
async function fetchPdfBuffer() {
  try {
    const res = await fetch(SELF_CHECK_PDF_URL);
    if (!res.ok) {
      console.warn(`Could not fetch self-check PDF: ${res.status} ${res.statusText}`);
      return null;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.warn("Could not fetch self-check PDF:", err.message);
    return null;
  }
}

// Fetch the logo once per function instance so it can be embedded (cid:logo) rather than
// relying on remote images, which many mail clients block by default.
let logoBufferPromise = null;
function getLogoBuffer() {
  if (!logoBufferPromise) {
    logoBufferPromise = fetch(EMAIL_LOGO_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return Buffer.from(await res.arrayBuffer());
      })
      .catch((err) => {
        console.warn("Could not fetch email logo:", err.message);
        logoBufferPromise = null;
        return null;
      });
  }
  return logoBufferPromise;
}

// ============================================================
// HELPERS
// ============================================================

function escapeHtml(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}

// Brand colors (white / cream / gold palette matching the landing page)
const BRAND = {
  gold: "#a67c2b",
  goldSoft: "#d9b155",
  cream: "#f8f1e6",
  sand: "#eadbc4",
  night: "#0f172a",
  nightSoft: "#334155",
  muted: "#64748b",
  white: "#ffffff",
};

const SERIF = "'Cormorant Garamond',Georgia,'Times New Roman',serif";
const SANS = "'Jost','Helvetica Neue',Helvetica,Arial,sans-serif";

// ============================================================
// EMAIL LAYOUT (shared header, footer and building blocks)
// ============================================================

function logoHtml(logoSrc) {
  return `<img src="${logoSrc}" alt="Lightworker Coach" width="220" style="display:block;width:220px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />`;
}

// Small uppercase gold label with hairlines either side, as used for section labels on the site
function labelHtml(text) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
    <td style="width:32px;border-top:1px solid ${BRAND.goldSoft};font-size:0;line-height:0;">&nbsp;</td>
    <td style="padding:0 10px;color:${BRAND.gold};font-family:${SANS};font-size:11px;letter-spacing:0.28em;text-transform:uppercase;white-space:nowrap;">${text}</td>
    <td style="width:32px;border-top:1px solid ${BRAND.goldSoft};font-size:0;line-height:0;">&nbsp;</td>
  </tr></table>`;
}

function buttonHtml(href, text) {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td align="center" style="border-radius:50px;background-color:${BRAND.gold};">
      <a href="${href}" style="display:inline-block;background-color:${BRAND.gold};color:${BRAND.white};font-family:${SANS};font-size:16px;font-weight:600;text-decoration:none;border-radius:50px;padding:14px 32px;border:2px solid ${BRAND.gold};">${text} &rarr;</a>
    </td>
  </tr></table>`;
}

function detailRowsHtml(rows) {
  return rows
    .map(
      ([label, value]) => `<tr>
        <td valign="top" style="padding:12px 12px 12px 0;border-bottom:1px solid ${BRAND.sand};color:${BRAND.gold};font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;width:34%;">${label}</td>
        <td valign="top" style="padding:12px 0;border-bottom:1px solid ${BRAND.sand};color:${BRAND.night};font-family:${SANS};font-size:15px;line-height:1.6;">${value}</td>
      </tr>`
    )
    .join("");
}

function emailLayout({ title, label, logoSrc, content, signOff = true }) {
  const fromEmail = escapeHtml(process.env.SMTP_FROM_EMAIL || "");
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:${SANS};color:${BRAND.night};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cream};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:${BRAND.white};border:1px solid ${BRAND.sand};border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(234,219,196,0.6);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 32px 28px;background-color:${BRAND.white};">
              ${logoHtml(logoSrc)}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px;">
              ${labelHtml(label)}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 40px;">
              ${content}
              ${
                signOff
                  ? `<p style="margin:32px 0 0;font-family:${SERIF};font-size:22px;font-style:italic;color:${BRAND.night};">With love and light, Peter</p>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 32px;background-color:${BRAND.cream};border-top:1px solid ${BRAND.sand};color:${BRAND.muted};font-family:${SANS};font-size:12px;letter-spacing:0.06em;line-height:1.8;">
              <span style="font-family:${SERIF};font-size:16px;font-weight:600;color:${BRAND.night};letter-spacing:0.02em;">The Lightworker Coach</span><br />
              Helping those who help others<br />
              ${fromEmail ? `<a href="mailto:${fromEmail}" style="color:${BRAND.gold};text-decoration:none;">${fromEmail}</a><br />` : ""}
              &copy; 2026 Lightworker Coach Limited
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

const headingStyle = `margin:0;font-family:${SERIF};font-size:30px;font-weight:600;line-height:1.2;color:${BRAND.night};`;
const paragraphStyle = `margin:20px 0 0;font-family:${SANS};font-size:16px;line-height:1.75;color:${BRAND.nightSoft};`;

// ============================================================
// EMAIL CONTENT (HTML + plain text)
// ============================================================

function selfCheckHtml({ firstName, downloadUrl, logoSrc }) {
  return emailLayout({
    title: "Your self-check is here",
    label: "Your free self-check",
    logoSrc,
    content: `
      <h1 style="${headingStyle}">Dear ${escapeHtml(firstName)},</h1>
      <p style="${paragraphStyle}">Thank you for patiently listening to me on Friday's call, and for asking for the self-check. Your self-check is attached to this email. You can also download it using the button below.</p>
      <p style="${paragraphStyle}">Take ten quiet minutes with it. There are no right or wrong answers. Just an honest look at where your practice is today, and the next gentle step.</p>
      <p style="${paragraphStyle}">If you'd like to talk it through, simply reply to this email.</p>
      ${downloadUrl ? `<div style="padding-top:32px;">${buttonHtml(escapeHtml(downloadUrl), "Download your self-check")}</div>` : ""}
    `,
  });
}

function callHtml({ firstName, logoSrc }) {
  return emailLayout({
    title: "Your free call with Peter",
    label: "Your free 20-minute call",
    logoSrc,
    content: `
      <h1 style="${headingStyle}">Dear ${escapeHtml(firstName)},</h1>
      <p style="${paragraphStyle}">Thank you for asking for a call.</p>
      <p style="${paragraphStyle}">I'll email you within two working days with some times to choose from. I'm looking forward to hearing about your practice.</p>
    `,
  });
}

function foundingHtml({ firstName, logoSrc }) {
  return emailLayout({
    title: "Your founding place is reserved",
    label: "Founding member",
    logoSrc,
    content: `
      <h1 style="${headingStyle}">Dear ${escapeHtml(firstName)},</h1>
      <p style="${paragraphStyle}">Thank you. Your place as a founding member of my monthly letter is reserved, at <strong style="color:${BRAND.night};">£29 a month</strong>, locked in for as long as you stay.</p>
      <p style="${paragraphStyle}">There's nothing to pay now. In December I'll email you a simple link to set up your monthly payment, and your first letter will arrive in January 2027.</p>
      <p style="${paragraphStyle}">If anything changes for you before then, just reply to this email.</p>
    `,
  });
}

// Notification sent to Peter for every form submission
function peterNotificationHtml({ formType, firstName, email, fields, logoSrc }) {
  const yesNo = (v) => (v ? "Yes" : "No");
  const typeLabels = { selfCheck: "Self-check", call: "Free call", founding: "Founding member" };
  const rows = [
    ["Form", escapeHtml(typeLabels[formType] || formType)],
    ["Name", escapeHtml(formType === "founding" ? `${firstName} ${fields.last_name || ""}`.trim() : firstName)],
    ["Email", `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND.gold};text-decoration:none;">${escapeHtml(email)}</a>`],
  ];
  if (formType === "call") {
    rows.push(["Phone", escapeHtml(fields.phone || "Not provided")]);
    rows.push(["Help with", escapeHtml(fields.help_with || "Not provided")]);
  } else if (formType === "founding") {
    rows.push(["Address", `${escapeHtml(fields.address_1 || "")} ${escapeHtml(fields.address_2 || "")}`.trim()]);
    rows.push(["Town / Postcode / Country", `${escapeHtml(fields.town || "")}, ${escapeHtml(fields.postcode || "")}, ${escapeHtml(fields.country || "")}`]);
    rows.push(["Letter topics", escapeHtml(fields.letter_topics || "")]);
    rows.push(["Reserve confirm", yesNo(fields.reserve_confirm)]);
  }
  if (formType !== "call") rows.push(["Marketing consent", yesNo(fields.marketing_consent)]);

  const headings = {
    selfCheck: `${escapeHtml(firstName)} asked for the self-check`,
    call: `${escapeHtml(firstName)} would like a free call`,
    founding: `${escapeHtml(firstName)} reserved a founding place`,
  };
  const replySubjects = {
    selfCheck: "Re%3A%20Your%20self-check",
    call: "Re%3A%20Your%20free%20call%20with%20Peter",
    founding: "Re%3A%20Your%20founding%20place",
  };

  return emailLayout({
    title: `New ${typeLabels[formType] || formType} submission`,
    label: "New submission",
    logoSrc,
    signOff: false,
    content: `
      <h1 style="${headingStyle}">${headings[formType] || `New submission from ${escapeHtml(firstName)}`}</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid ${BRAND.sand};">
        ${detailRowsHtml(rows)}
      </table>
      <div style="padding-top:32px;">${buttonHtml(`mailto:${escapeHtml(email)}?subject=${replySubjects[formType] || "Re%3A%20Your%20enquiry"}`, `Reply to ${escapeHtml(firstName)}`)}</div>
    `,
  });
}


// ============================================================
// ENVIRONMENT VARIABLES (set these in Netlify dashboard)
// ============================================================

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== "false";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME;
const NOTIFY_TO = process.env.NOTIFY_TO;

const DATABASE_URL = process.env.DATABASE_URL;

// Public URL for the self-check PDF download link (set in Netlify dashboard)
const SITE_URL = process.env.SITE_URL || "";

// Neon/Postgres connection pool (created once, reused across invocations)
let pool = null;
function getPool() {
  if (!pool && DATABASE_URL) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Neon
    });
  }
  return pool;
}

function buildTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: SMTP_USER && SMTP_PASSWORD ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
    tls: { rejectUnauthorized: false },
  });
}

// ============================================================
// DATABASE: store each submission in Neon
// ============================================================

async function storeSubmission(formType, fields) {
  const pg = getPool();
  if (!pg) {
    console.warn("DATABASE_URL not set — skipping database insert");
    return;
  }

  const client = await pg.connect();
  try {
    await client.query("BEGIN");

    if (formType === "selfCheck") {
      await client.query(
        `INSERT INTO self_check_submissions (first_name, email, marketing_consent)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET
           first_name = EXCLUDED.first_name,
           marketing_consent = EXCLUDED.marketing_consent`,
        [
          fields.first_name || "",
          fields.email || "",
          fields.marketing_consent === "on" || fields.marketing_consent === true,
        ]
      );
    } else if (formType === "call") {
      await client.query(
        `INSERT INTO call_requests (first_name, email, phone, help_with)
         VALUES ($1, $2, $3, $4)`,
        [
          fields.first_name || "",
          fields.email || "",
          fields.phone || "",
          fields.help_with || "",
        ]
      );
    } else if (formType === "founding") {
      await client.query(
        `INSERT INTO founding_members (
           first_name, last_name, email, address_1, address_2,
           town, postcode, country, letter_topics,
           reserve_confirm, marketing_consent
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          fields.first_name || "",
          fields.last_name || "",
          fields.email || "",
          fields.address_1 || "",
          fields.address_2 || "",
          fields.town || "",
          fields.postcode || "",
          fields.country || "",
          fields.letter_topics || "",
          fields.reserve_confirm === "on" || fields.reserve_confirm === true,
          fields.marketing_consent === "on" || fields.marketing_consent === true,
        ]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ============================================================
// HANDLER
// ============================================================

function getFormType(event, fields) {
  if (event.queryStringParameters && event.queryStringParameters.form_type) {
    return event.queryStringParameters.form_type;
  }
  if (event.rawUrl) {
    try {
      return new URL(event.rawUrl).searchParams.get("form_type");
    } catch {}
  }
  return fields.form_type || fields.form || "selfCheck";
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export const handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  try {
    const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
    const isMultipart = contentType.includes("multipart/form-data");

    let fields = {};
    if (isMultipart && event.body) {
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ ok: false, error: "Missing boundary" }) };
      }
      const body = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
      const parts = body.toString("utf8").split(`--${boundary}`);
      for (const part of parts) {
        if (part.trim() === "--" || part.trim() === "") continue;
        const [headers, ...valueParts] = part.split("\r\n\r\n");
        const value = valueParts.join("\r\n\r\n").replace(/\r\n--$/, "").trim();
        const nameMatch = headers.match(/name="([^"]+)"/);
        if (nameMatch) fields[nameMatch[1]] = value;
      }
    } else if (event.body) {
      try { fields = JSON.parse(event.body); } catch { fields = {}; }
    }

    const formType = getFormType(event, fields);
    const firstName = String(fields.first_name || fields.firstName || "friend").trim() || "friend";
    const email = String(fields.email || "").trim();

    const downloadUrl = "https://lightworkercoach.co.uk/wp-content/uploads/2026/10/Where-is-your-practice-right-now-self-check.pdf";

    // 1) Store submission in Neon/Postgres (non-fatal)
    try { await storeSubmission(formType, fields); }
    catch (dbErr) { console.error("Database error:", dbErr.message); }

    // 2) Send emails
    const transporter = buildTransporter();

    const logoBuffer = await getLogoBuffer();
    const logoSrc = logoBuffer ? "cid:logo" : EMAIL_LOGO_URL;
    const logoAttachment = () =>
      logoBuffer ? [{ filename: "email-logo.png", content: logoBuffer, contentType: "image/png", cid: "logo" }] : [];

    let htmlBody, plainBody;
    if (formType === "selfCheck") {
      htmlBody = selfCheckHtml({ firstName, downloadUrl, logoSrc });
      plainBody = `Dear ${firstName},\n\nThank you for patiently listening to me on Friday's call, and for asking for the self-check. Your self-check is attached to this email.\n\nTake ten quiet minutes with it.\n\nWith love and light, Peter`;
    } else if (formType === "call") {
      htmlBody = callHtml({ firstName, logoSrc });
      plainBody = `Dear ${firstName},\n\nThank you for asking for a call. I'll email you within two working days.\n\nWith love and light, Peter`;
    } else if (formType === "founding") {
      htmlBody = foundingHtml({ firstName, logoSrc });
      plainBody = `Dear ${firstName},\n\nYour founding member place is reserved.\n\nWith love and light, Peter`;
    }

    const mailOptions = {
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: email,
      subject: formType === "selfCheck" ? "Your self-check is here" : formType === "call" ? "Your free call with Peter" : "Your founding place is reserved",
      text: plainBody,
      html: htmlBody,
      replyTo: SMTP_FROM_EMAIL,
      attachments: logoAttachment(),
    };

    if (formType === "selfCheck") {
      const pdfBuffer = await fetchPdfBuffer();
      if (pdfBuffer) {
        mailOptions.attachments.push({ filename: "Where is your practice right now - self-check.pdf", content: pdfBuffer, contentType: "application/pdf" });
      }
    }

    await transporter.sendMail(mailOptions);

    // Peter notification for ALL form submissions
    const peterSubjects = { selfCheck: `New self-check from ${firstName}`, call: `New call request from ${firstName}`, founding: `New founding member from ${firstName}` };
    await transporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: NOTIFY_TO,
      subject: peterSubjects[formType],
      text: `New ${formType} submission:\n\nName: ${firstName}\nEmail: ${email}\n${formType === "selfCheck" ? `Marketing: ${fields.marketing_consent ? "Yes" : "No"}` : formType === "call" ? `Phone: ${fields.phone || "Not provided"}\nHelp with: ${fields.help_with || "Not provided"}` : `Founding member: ${firstName} ${fields.last_name || ""}\nAddress: ${fields.address_1 || ""}, ${fields.town || ""}, ${fields.postcode || ""}\nCountry: ${fields.country || ""}\nLetter topics: ${fields.letter_topics || ""}\nReserve: ${fields.reserve_confirm ? "Yes" : "No"}\nMarketing: ${fields.marketing_consent ? "Yes" : "No"}`}`,
      html: peterNotificationHtml({ formType, firstName, email, fields, logoSrc }),
      replyTo: email,
      attachments: logoAttachment(),
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true, message: "Form submitted successfully" }),
    };
  } catch (err) {
    console.error("Form submission error:", err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ ok: false, error: err.message || "Failed to process submission" }) };
  }
};
