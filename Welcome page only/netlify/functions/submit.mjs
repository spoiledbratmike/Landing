import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { Pool } from "pg";

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the self-check PDF (bundled with the function deployment)
const SELF_CHECK_PDF_PATH = path.join(__dirname, "Where is your practice right now - self-check.pdf");

// Read the PDF once at cold start (if it exists)
let selfCheckPdfBuffer = null;
try {
  if (fs.existsSync(SELF_CHECK_PDF_PATH)) {
    selfCheckPdfBuffer = fs.readFileSync(SELF_CHECK_PDF_PATH);
  }
} catch (err) {
  console.warn("Could not read self-check PDF:", err.message);
}

// ============================================================
// HELPERS
// ============================================================

function escapeHtml(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}

// Brand colors (plum / lavender / gold palette matching the landing page)
const BRAND = {
  plum: "#6b2a6b",
  plumDark: "#4a1d4a",
  lavender: "#e8daef",
  lavenderLight: "#f3e9f7",
  gold: "#a67c2b",
  goldLight: "#d9b15c",
  night: "#0f172a",
  nightSoft: "#1e293b",
  cream: "#f8f1e6",
  white: "#ffffff",
};

function wrapEmail(html, plainText) {
  return {
    html,
    text: plainText,
  };
}

// ============================================================
// EMAIL CONTENT (HTML + plain text)
// ============================================================

function selfCheckHtml({ firstName, downloadUrl }) {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your self-check is here</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.lavenderLight};font-family:'Cormorant Garamond',Georgia,serif;color:${BRAND.night};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lavenderLight};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:${BRAND.white};border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:${BRAND.plum};padding:32px 24px;background-image:linear-gradient(135deg,${BRAND.plum} 0%,${BRAND.plumDark} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <span style="display:inline-block;width:48px;height:48px;background-color:${BRAND.gold};border-radius:50%;line-height:48px;text-align:center;vertical-align:middle;">
                      <span style="color:${BRAND.white};font-size:24px;line-height:1;">☀</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:${BRAND.white};font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;letter-spacing:0.04em;">
                    The Lightworker Coach
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:${BRAND.lavender};font-family:'Jost',sans-serif;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;padding-top:6px;">
                    Helping those who help others
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="color:${BRAND.night};font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;line-height:1.3;">
                    Dear ${escapeHtml(firstName)},
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding-top:20px;color:${BRAND.nightSoft};font-family:'Jost',sans-serif;font-size:16px;line-height:1.7;">
                    Thank you for patiently listening to me on Friday's call, and for asking for the self-check.<br /><br />
                    Your self-check is attached to this email. You can also download it using the button below.<br /><br />
                    Take ten quiet minutes with it. There are no right or wrong answers. Just an honest look at where your practice is today, and the next gentle step.<br /><br />
                    If you'd like to talk it through, simply reply to this email.
                  </td>
                </tr>

                <!-- Download button -->
                <tr>
                  <td align="left" style="padding-top:32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left">
                          <a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background-color:${BRAND.gold};color:${BRAND.white};font-family:'Jost',sans-serif;font-size:16px;font-weight:600;text-decoration:none;border-radius:50px;padding:14px 32px;text-align:center;border:2px solid ${BRAND.gold};transition:all 0.2s;">
                            Download Your Self-Check
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 24px;background-color:${BRAND.lavender};border-top:1px solid ${BRAND.plum}22;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="color:${BRAND.plumDark};font-family:'Jost',sans-serif;font-size:13px;letter-spacing:0.08em;line-height:1.6;">
                    With love and light,<br />
                    <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:${BRAND.night};">Peter</span><br /><br />
                    The Lightworker Coach · Helping those who help others<br />
                    <a href="mailto:${SMTP_FROM_EMAIL}" style="color:${BRAND.gold};text-decoration:none;">${SMTP_FROM_EMAIL}</a><br />
                    · © 2026 Lightworker Coach Limited
                  </td>
                </tr>
              </table>
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

function callHtml({ firstName }) {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your free call with Peter</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.lavenderLight};font-family:'Cormorant Garamond',Georgia,serif;color:${BRAND.night};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lavenderLight};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:${BRAND.white};border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:${BRAND.plum};padding:32px 24px;background-image:linear-gradient(135deg,${BRAND.plum} 0%,${BRAND.plumDark} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <span style="display:inline-block;width:48px;height:48px;background-color:${BRAND.gold};border-radius:50%;line-height:48px;text-align:center;vertical-align:middle;">
                      <span style="color:${BRAND.white};font-size:24px;line-height:1;">☀</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:${BRAND.white};font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;letter-spacing:0.04em;">
                    The Lightworker Coach
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:${BRAND.lavender};font-family:'Jost',sans-serif;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;padding-top:6px;">
                    Helping those who help others
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="color:${BRAND.night};font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;line-height:1.3;">
                    Dear ${escapeHtml(firstName)},
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding-top:20px;color:${BRAND.nightSoft};font-family:'Jost',sans-serif;font-size:16px;line-height:1.7;">
                    Thank you for asking for a call.<br /><br />
                    I'll email you within two working days with some times to choose from. I'm looking forward to hearing about your practice.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 24px;background-color:${BRAND.lavender};border-top:1px solid ${BRAND.plum}22;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="color:${BRAND.plumDark};font-family:'Jost',sans-serif;font-size:13px;letter-spacing:0.08em;line-height:1.6;">
                    With love and light,<br />
                    <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:${BRAND.night};">Peter</span><br /><br />
                    The Lightworker Coach · Helping those who help others<br />
                    <a href="mailto:${SMTP_FROM_EMAIL}" style="color:${BRAND.gold};text-decoration:none;">${SMTP_FROM_EMAIL}</a><br />
                    · © 2026 Lightworker Coach Limited
                  </td>
                </tr>
              </table>
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

function foundingHtml({ firstName }) {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your founding place is reserved</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.lavenderLight};font-family:'Cormorant Garamond',Georgia,serif;color:${BRAND.night};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lavenderLight};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:${BRAND.white};border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:${BRAND.plum};padding:32px 24px;background-image:linear-gradient(135deg,${BRAND.plum} 0%,${BRAND.plumDark} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <span style="display:inline-block;width:48px;height:48px;background-color:${BRAND.gold};border-radius:50%;line-height:48px;text-align:center;vertical-align:middle;">
                      <span style="color:${BRAND.white};font-size:24px;line-height:1;">☀</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:${BRAND.white};font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;letter-spacing:0.04em;">
                    The Lightworker Coach
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:${BRAND.lavender};font-family:'Jost',sans-serif;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;padding-top:6px;">
                    Helping those who help others
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="color:${BRAND.night};font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;line-height:1.3;">
                    Dear ${escapeHtml(firstName)},
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding-top:20px;color:${BRAND.nightSoft};font-family:'Jost',sans-serif;font-size:16px;line-height:1.7;">
                    Thank you. Your place as a founding member of my monthly letter is reserved, at £29 a month, locked in for as long as you stay.<br /><br />
                    There's nothing to pay now. In December I'll email you a simple link to set up your monthly payment, and your first letter will arrive in January 2027.<br /><br />
                    If anything changes for you before then, just reply to this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 24px;background-color:${BRAND.lavender};border-top:1px solid ${BRAND.plum}22;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="color:${BRAND.plumDark};font-family:'Jost',sans-serif;font-size:13px;letter-spacing:0.08em;line-height:1.6;">
                    With love and light,<br />
                    <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:${BRAND.night};">Peter</span><br /><br />
                    The Lightworker Coach · Helping those who help others<br />
                    <a href="mailto:${SMTP_FROM_EMAIL}" style="color:${BRAND.gold};text-decoration:none;">${SMTP_FROM_EMAIL}</a><br />
                    · © 2026 Lightworker Coach Limited
                  </td>
                </tr>
              </table>
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

function peterCallNotificationHtml({ firstName, email, phone, helpWith }) {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New free call request</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.lavenderLight};font-family:'Jost',sans-serif;color:${BRAND.night};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lavenderLight};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:${BRAND.white};border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:${BRAND.plum};padding:24px 24px;background-image:linear-gradient(135deg,${BRAND.plum} 0%,${BRAND.plumDark} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <span style="display:inline-block;width:40px;height:40px;background-color:${BRAND.gold};border-radius:50%;line-height:40px;text-align:center;vertical-align:middle;">
                      <span style="color:${BRAND.white};font-size:20px;line-height:1;">☀</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="color:${BRAND.white};font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:700;letter-spacing:0.04em;">
                    New Free Call Request
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="color:${BRAND.night};font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;">
                    ${escapeHtml(firstName)} would like to book a free call
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding-top:24px;color:${BRAND.nightSoft};font-size:15px;line-height:1.7;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;color:${BRAND.plumDark};font-weight:600;width:30%;">Name</td>
                        <td style="padding:8px 0;color:${BRAND.night};">${escapeHtml(firstName)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:${BRAND.plumDark};font-weight:600;width:30%;">Email</td>
                        <td style="padding:8px 0;color:${BRAND.night};"><a href="mailto:${escapeHtml(email)}" style="color:${BRAND.gold};text-decoration:none;">${escapeHtml(email)}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:${BRAND.plumDark};font-weight:600;width:30%;">Phone</td>
                        <td style="padding:8px 0;color:${BRAND.night};">${escapeHtml(phone || "Not provided")}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:${BRAND.plumDark};font-weight:600;width:30%;">Help with</td>
                        <td style="padding:8px 0;color:${BRAND.night};">${escapeHtml(helpWith || "Not provided")}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reply button -->
          <tr>
            <td align="left" style="padding:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <a href="mailto:${escapeHtml(email)}?subject=Re%3A%20Your%20free%20call%20with%20Peter" style="display:inline-block;background-color:${BRAND.gold};color:${BRAND.white};font-family:'Jost',sans-serif;font-size:15px;font-weight:600;text-decoration:none;border-radius:50px;padding:12px 28px;text-align:center;border:2px solid ${BRAND.gold};">
                      Reply to ${escapeHtml(firstName)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px;background-color:${BRAND.lavender};border-top:1px solid ${BRAND.plum}22;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="color:${BRAND.plumDark};font-family:'Jost',sans-serif;font-size:12px;letter-spacing:0.08em;line-height:1.6;">
                    The Lightworker Coach · Helping those who help others<br />
                    <a href="mailto:${SMTP_FROM_EMAIL}" style="color:${BRAND.gold};text-decoration:none;">${SMTP_FROM_EMAIL}</a><br />
                    · © 2026 Lightworker Coach Limited
                  </td>
                </tr>
              </table>
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
        `INSERT INTO self_check_submissions (first_name, email, marketing_consent, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (email) DO UPDATE SET
           first_name = EXCLUDED.first_name,
           marketing_consent = EXCLUDED.marketing_consent,
           created_at = NOW()`,
        [
          fields.first_name || "",
          fields.email || "",
          fields.marketing_consent === "on" || fields.marketing_consent === true,
        ]
      );
    } else if (formType === "call") {
      await client.query(
        `INSERT INTO call_requests (first_name, email, phone, help_with, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
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
           reserve_confirm, marketing_consent, created_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
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

// Read form_type from URL query string (e.g. /.netlify/functions/submit?form_type=call)
// or from the request body as a fallback.
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

export const handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  try {
    // Parse multipart/form-data from the frontend
    const contentType = event.headers["content-type"] || event.headers["Content-Type"];
    const isMultipart = contentType && contentType.includes("multipart/form-data");

    let fields = {};
    if (isMultipart && event.body) {
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ok: false, error: "Missing boundary" }),
        };
      }
      const body = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
      const parts = body.toString("utf8").split(`--${boundary}`);

      for (const part of parts) {
        if (part.trim() === "--" || part.trim() === "") continue;
        const [headers, ...valueParts] = part.split("\r\n\r\n");
        const value = valueParts.join("\r\n\r\n").replace(/\r\n--$/, "").trim();
        const nameMatch = headers.match(/name="([^"]+)"/);
        if (nameMatch) {
          fields[nameMatch[1]] = value;
        }
      }
    } else if (event.body) {
      try {
        fields = JSON.parse(event.body);
      } catch {
        fields = {};
      }
    }

    const formType = getFormType(event, fields);
    const firstName = String(fields.first_name || fields.firstName || "friend").trim() || "friend";
    const email = String(fields.email || "").trim();

    const downloadUrl = SITE_URL ? `${SITE_URL}/images/Where%20is%20your%20practice%20right%20now%20-%20self-check.pdf` : "";

    // 1) Store submission in Neon/Postgres (non-fatal — emails still send if DB fails)
    try {
      await storeSubmission(formType, fields);
    } catch (dbErr) {
      console.error("Database insert failed, continuing with email:", dbErr.message);
    }

    // 2) Send emails
    const transporter = buildTransporter();

    // Confirmation email to visitor (HTML + plain text, with PDF attachment for self-check)
    let htmlBody;
    let plainBody;
    if (formType === "selfCheck") {
      htmlBody = selfCheckHtml({ firstName, downloadUrl });
      plainBody = `Dear ${firstName},\n\nThank you for patiently listening to me on Friday's call, and for asking for the self-check. Your self-check is attached to this email. You can also download it here: ${downloadUrl || "Not available"}\n\nTake ten quiet minutes with it. There are no right or wrong answers. Just an honest look at where your practice is today, and the next gentle step.\n\nIf you'd like to talk it through, simply reply to this email.\n\nWith love and light, Peter`;
    } else if (formType === "call") {
      htmlBody = callHtml({ firstName });
      plainBody = `Dear ${firstName},\n\nThank you for asking for a call. I'll email you within two working days with some times to choose from. I'm looking forward to hearing about your practice.\n\nWith love and light, Peter`;
    } else if (formType === "founding") {
      htmlBody = foundingHtml({ firstName });
      plainBody = `Dear ${firstName},\n\nThank you. Your place as a founding member of my monthly letter is reserved, at £29 a month, locked in for as long as you stay.\n\nThere's nothing to pay now. In December I'll email you a simple link to set up your monthly payment, and your first letter will arrive in January 2027.\n\nIf anything changes for you before then, just reply to this email.\n\nWith love and light, Peter`;
    }

    const mailOptions = {
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: email,
      subject:
        formType === "selfCheck"
          ? "Your self-check is here"
          : formType === "call"
            ? "Your free call with Peter"
            : "Your founding place is reserved",
      text: plainBody,
      html: htmlBody,
      replyTo: SMTP_FROM_EMAIL,
    };

    // Attach self-check PDF for self-check form
    if (formType === "selfCheck" && selfCheckPdfBuffer) {
      mailOptions.attachments = [
        {
          filename: "Where is your practice right now - self-check.pdf",
          content: selfCheckPdfBuffer,
          contentType: "application/pdf",
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    // Peter notification for call requests
    if (formType === "call") {
      await transporter.sendMail({
        from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
        to: NOTIFY_TO,
        subject: `New free call request from ${firstName}`,
        text: `New free call request:\n\nFirst name: ${firstName}\nEmail: ${email}\nPhone: ${fields.phone || "Not provided"}\nHelp with: ${fields.help_with || "Not provided"}\n`,
        html: peterCallNotificationHtml({ firstName, email, phone: fields.phone || "", helpWith: fields.help_with || "" }),
        replyTo: email,
      });
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, message: "Form submitted successfully" }),
    };
  } catch (err) {
    console.error("Form submission error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: err.message || "Failed to process submission" }),
    };
  }
};
