import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import heroImg from "/images/hero.jpg";
import typewriterImg from "/images/typewriter.jpg";
import peterImg from "/images/peter.jpg";
import { SunIcon, ArrowIcon, CheckIcon, QuoteIcon, MailIcon } from "../components/Icons";

/*
 * / — homepage for The Lightworker Coach welcome page.
 *
 * EMAILS: the three forms POST to the Netlify serverless function at
 * /.netlify/functions/submit, which sends confirmation emails to visitors,
 * a notification to Peter for call requests, and stores each submission in
 * Neon (PostgreSQL).
 *
 * Environment variables (set in Netlify dashboard → Site settings →
 * Environment variables):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD,
 *   SMTP_FROM_EMAIL, SMTP_FROM_NAME, NOTIFY_TO, DATABASE_URL, SITE_URL
 *
 * The self-check PDF (public/Where is your practice right now - self-check.pdf)
 * is attached to the self-check confirmation email automatically.
 */

const PRIVACY_URL = "/privacy";
const PETER_PHOTO: string | null = peterImg;

// Each form posts to the Netlify serverless function.
const FORMS = {
  selfCheck: { action: "/.netlify/functions/submit?form_type=selfCheck", group: "Self-check" },
  call: { action: "/.netlify/functions/submit?form_type=call", group: "Free call" },
  founding: { action: "/.netlify/functions/submit?form_type=founding", group: "Founding members – £29" },
};

const body = "text-[17px] sm:text-lg leading-relaxed text-night-900/90";

function Label({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-typewriter text-xs uppercase tracking-[0.28em] text-gold-600 ${center ? "justify-center" : ""}`}
    >
      <span className="h-px w-8 bg-gold-500/60" />
      {children}
      {center && <span className="h-px w-8 bg-gold-500/60" />}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-night-900">
        {label}
        {!required && <span className="font-normal text-night-700"> (optional)</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-night-200 bg-white px-4 py-3 text-base text-night-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
      />
    </label>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-night-900">
        {label} <span className="font-normal text-night-700">(optional)</span>
      </span>
      <textarea
        name={name}
        rows={3}
        className="w-full rounded-xl border border-night-200 bg-white px-4 py-3 text-base text-night-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
      />
    </label>
  );
}

function Tick({ name, required = false, children }: { name: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-night-900/90">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="mt-1 h-5 w-5 shrink-0 rounded border-night-300 accent-[#a67c2b]"
      />
      <span>{children}</span>
    </label>
  );
}

function GoldButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-4 text-base font-semibold text-white transition-all hover:bg-gold-600 hover:shadow-[0_0_40px_-8px_rgba(217,177,85,0.7)] sm:w-auto"
      style={{
        backgroundColor: "#a67c2b",
        color: "white",
        borderRadius: "50px",
        padding: "14px 32px",
        fontWeight: "600",
        border: "2px solid #a67c2b",
        width: "100%",
        textAlign: "center",
        fontSize: "1rem",
        cursor: "pointer",
      }}
    >
      {children}
      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function PageForm({
  action,
  thanks,
  children,
}: {
  action: string;
  thanks: (firstName: string) => ReactNode;
  children: ReactNode;
}) {
  const [sentName, setSentName] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const first = String(data.get("first_name") || "").trim() || "friend";
    setFailed(false);
    fetch(action, { method: "POST", body: data })
      .then((res) => {
        if (!res.ok) throw new Error("send failed");
        setSentName(first);
      })
      .catch(() => setFailed(true));
  }

  if (sentName !== null) {
    return (
      <div className="rounded-2xl border border-gold-400/40 bg-gold-400/10 p-6 text-center" role="status">
        <CheckIcon className="mx-auto h-7 w-7 text-gold-600" />
        <p className="mt-3 font-serif text-xl font-semibold text-night-900">{thanks(sentName)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
      />
      {children}
      {failed && (
        <p role="alert" className="rounded-xl border border-night-200 bg-night-50/60 p-4 text-sm text-night-900">
          Something went wrong sending your details. Please try again, or email{" "}
          <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || "peter@lightworkercoach.co.uk"}`} className="underline decoration-gold-500 underline-offset-2">
            peter@lightworkercoach.co.uk
          </a>{" "}
          directly.
        </p>
      )}
    </form>
  );
}

function PeterPhoto() {
  if (PETER_PHOTO) {
    return (
      <img
        src={PETER_PHOTO}
        alt="Peter Dickinson, The Lightworker Coach"
        className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl shadow-night-300/40"
      />
    );
  }
  return (
    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-night-200 bg-white/70 p-8 text-center shadow-xl shadow-night-100/50">
      <SunIcon className="h-10 w-10 text-gold-500" />
      <p className="mt-4 font-serif text-2xl font-semibold text-night-900">Peter's photo</p>
      <p className="mt-2 text-sm text-night-700">
        Head and shoulders, smiling, natural light. Portrait shape.
      </p>
    </div>
  );
}

export default function Welcome() {
  useEffect(() => {
    document.title = "Welcome | The Lightworker Coach";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1 — WELCOME */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/80 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:pb-28">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/50 bg-gold-400/10 text-gold-500">
              <SunIcon className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-semibold tracking-wide text-night-900">
              The Lightworker Coach
            </span>
          </div>

          <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="order-2 lg:order-1">
              <Label>Welcome to the members of The Northern College of Clinical Hypnotherapy</Label>
              <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-night-900 sm:text-7xl">
                Help more people.
                <br />
                <span className="gold-text">Build your light.</span>
              </h1>
              <p className={`mt-7 max-w-xl ${body}`}>
                Thank you for patiently listening to me on Friday's call. 🙂 This page holds
                everything I promised: a free self-check to see where your practice is right now, a
                free 20-minute call if you'd like to talk, and a founding place in my monthly letter
                for healers.
              </p>
              <p className="mt-5 font-hand text-3xl text-night-800">With love and light, Peter</p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <a
                  href="#self-check"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-4 text-base font-semibold text-white transition-all hover:bg-gold-600 hover:shadow-[0_0_40px_-8px_rgba(217,177,85,0.7)]"
                >
                  Get your free self-check
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#founding"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-night-300 bg-white/70 px-7 py-4 text-base font-medium text-night-900 transition-all hover:bg-white"
                >
                  Become a founding member
                </a>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-sm lg:order-2">
              <PeterPhoto />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — ABOUT PETER */}
      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Label center>About Peter</Label>
            <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-tight text-night-900 sm:text-5xl">
              A business coach who has walked both worlds.
            </h2>
          </div>
          <div className={`mx-auto mt-8 max-w-3xl space-y-5 ${body}`}>
            <p>
              I spent 29 years in the corporate world and the last 25 helping small business owners
              grow. Then, four years ago, I had an awakening that changed everything. I knew, deep
              down, that we are all one, and that my part is to help raise the vibration of
              humanity.
            </p>
            <p>
              I'm a healer myself. Today I bring the two worlds together: practical, proven business
              help, offered in a way that honours your gifts, your intuition and your heart. You'll
              never have to explain your spiritual side to me.
            </p>
          </div>

          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                year: "1976",
                title: "The corporate years",
                line: "29 years in electronics, computing and international sales, living in the UAE, Germany and America.",
              },
              { year: "2005", title: "Helping small businesses grow", line: "Started my own business coaching practice." },
              {
                year: "2022",
                title: "The awakening",
                line: "A profound shift that turned me towards helping those who help others.",
              },
              {
                year: "Today",
                title: "Lightworker Coach®",
                line: "Helping healers grow practices that support them as well as their clients.",
              },
            ].map((s) => (
              <li key={s.year} className="rounded-2xl border border-night-100 bg-night-50/60 p-6">
                <p className="font-serif text-4xl font-semibold text-gold-600">{s.year}</p>
                <p className="mt-3 font-serif text-xl font-semibold text-night-900">{s.title}</p>
                <p className="mt-2 text-base leading-relaxed text-night-900/85">{s.line}</p>
              </li>
            ))}
          </ol>

          <figure className="mx-auto mt-12 max-w-3xl rounded-2xl border border-night-100 bg-night-50/60 p-8 text-center sm:p-10">
            <QuoteIcon className="mx-auto h-8 w-8 text-gold-500" />
            <blockquote className="mt-4 font-serif text-xl leading-snug text-night-900 sm:text-2xl">
              “When I first met Peter, I was working from four o'clock in the morning until late at
              night… He saw my potential as a teacher and introduced me to the concept of moving from a
              one-to-one business model to a one-to-many approach. Those early conversations helped
              plant the seeds for what would ultimately become the Northern College of Clinical
              Hypnotherapy. Sometimes one conversation can change the direction of a business.”
            </blockquote>
            <figcaption className="mt-5 text-sm uppercase tracking-[0.2em] text-gold-600">
              Amanda Joy · Director of Studies, Northern College of Clinical Hypnotherapy
            </figcaption>
          </figure>
        </div>
      </section>

      {/* SECTION 3 — FREE SELF-CHECK */}
      <section id="self-check" className="scroll-mt-6 bg-night-50 px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          <div>
            <Label>Free · One page · 10 minutes</Label>
            <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight text-night-900 sm:text-5xl">
              Where is your practice right now?
            </h2>
            <p className={`mt-6 ${body}`}>
              Most healers running their own practice are at one of five stages. My free self-check
              helps you see which one is yours, and the next gentle step forward.
            </p>
            <ol className="mt-7 space-y-3">
              {[
                "Thinking about starting",
                "A small, loyal circle of clients",
                "Built it, waiting for them to come",
                "Two years in, still not covering costs",
                "Worn out from trading time for money",
              ].map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/15 font-serif text-lg font-semibold text-gold-600">
                    {i + 1}
                  </span>
                  <span className="text-lg text-night-900">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[1.75rem] border border-night-100 bg-white p-7 shadow-xl shadow-night-100/60 sm:p-9">
            <PageForm
              action={FORMS.selfCheck.action}
              thanks={(n) => (
                <>
                  Thank you, {n}. Your self-check is on its way. Please check your inbox (and your
                  spam folder, just in case).
                </>
              )}
            >
              <Field label="First name" name="first_name" required autoComplete="given-name" />
              <Field label="Email address" name="email" type="email" required autoComplete="email" />
              <Tick name="marketing_consent">
                Yes, please email me Peter's letters and occasional offers. I can unsubscribe at any
                time.
              </Tick>
              <GoldButton>Send me my self-check</GoldButton>
              <p className="text-sm text-night-700">
                Your details are safe with me and never shared. See my{" "}
                <a href={PRIVACY_URL} className="underline decoration-gold-500 underline-offset-2">
                  privacy notice
                </a>
                .
              </p>
            </PageForm>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FREE CALL */}
      <section id="call" className="scroll-mt-6 bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Label center>No obligation</Label>
          <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight text-night-900 sm:text-5xl">
            Would you like to talk?
          </h2>
          <p className={`mt-6 ${body}`}>
            If something on Friday's call touched you, I'd love to hear about your practice. A free
            20-minute conversation, on Zoom or by phone. Just you, me and your next step.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-xl rounded-[1.75rem] border border-night-100 bg-white p-7 text-left shadow-xl shadow-night-100/60 sm:p-9">
          <PageForm
            action={FORMS.call.action}
            thanks={(n) => (
              <>Thank you, {n}. I'll be in touch within two working days to find a time that suits you.</>
            )}
          >
            <Field label="First name" name="first_name" required autoComplete="given-name" />
            <Field label="Email address" name="email" type="email" required autoComplete="email" />
            <Field label="Phone number" name="phone" type="tel" autoComplete="tel" />
            <TextArea label="What would you most like help with?" name="help_with" />
            <GoldButton>Request my free call</GoldButton>
            <p className="text-sm text-night-700">
              I'll reply within two working days to find a time that suits you.
            </p>
          </PageForm>
        </div>
      </section>

      {/* SECTION 5 — FOUNDING MEMBERS */}
      <section id="founding" className="scroll-mt-6 bg-[#f8f1e6] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Label center>Founding members · First letter January 2027</Label>
            <h2 className="mt-6 font-typewriter text-3xl font-bold leading-tight text-night-900 sm:text-4xl">
              A letter through your door, every month.
            </h2>
          </div>

          <figure className="mx-auto mt-10 max-w-2xl">
            <img
              src={typewriterImg}
              alt="Peter's Remington 5 typewriter on his antique writing desk"
              className="w-full rounded-2xl shadow-lg shadow-night-900/15"
              loading="lazy"
            />
            <figcaption className="mt-3 text-center font-typewriter text-sm text-night-900/70">
              My Remington 5, now a museum piece, and the inspiration for these letters.
            </figcaption>
          </figure>

          <div className="mt-8 space-y-5 font-typewriter text-[17px] leading-relaxed text-night-900">
            <p>
              Each month I'll write to you. It's a real, printed letter, posted to your home.
              Practical business help written for healers: finding clients, pricing with
              confidence, protecting your energy, and growing a practice that supports you as well as
              the people you help.
            </p>
            <p>
              It's £49 a month. But for everyone who joined me on Friday's call, it's{" "}
              <strong>£29 a month, locked in for as long as you stay.</strong> Founding members will
              also be the first to receive my new book,{" "}
              <em>Blessed, Busy and Broke! How healers can help more people and live in abundance</em>.
            </p>
          </div>

          <ul className="mx-auto mt-8 grid max-w-xl gap-3">
            {[
              "Reserve your place today. Nothing to pay now",
              "Your first letter arrives in January 2027",
              "Cancel any time; no contract",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-lg text-night-900">
                <CheckIcon className="h-6 w-6 shrink-0 text-gold-600" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-[1.75rem] border border-[#eadbc4] bg-white p-7 shadow-xl shadow-[#eadbc4]/60 sm:p-9">
            <PageForm
              action={FORMS.founding.action}
              thanks={(n) => (
                <>
                  Welcome, {n}. Your founding place is reserved at £29 a month. Nothing to pay now.
                  I'll write to you in December.
                </>
              )}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" name="first_name" required autoComplete="given-name" />
                <Field label="Last name" name="last_name" required autoComplete="family-name" />
              </div>
              <Field label="Email address" name="email" type="email" required autoComplete="email" />
              <Field label="Address line 1" name="address_1" required autoComplete="address-line1" />
              <Field label="Address line 2" name="address_2" autoComplete="address-line2" />
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Town" name="town" required autoComplete="address-level2" />
                <Field label="Postcode" name="postcode" required autoComplete="postal-code" />
                <Field label="Country" name="country" required autoComplete="country-name" />
              </div>
              <TextArea label="What would you most love me to write about in your letters?" name="letter_topics" />
              <Tick name="reserve_confirm" required>
                Please reserve my founding place at £29 a month. I understand nothing is charged now,
                and Peter will email me in December to set up payment before my first letter.
              </Tick>
              <Tick name="marketing_consent">
                Yes, please also email me Peter's news and occasional offers.
              </Tick>
              <GoldButton>Reserve my founding place</GoldButton>
              <p className="text-sm text-night-700">No payment is taken on this page.</p>
            </PageForm>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FOOTER */}
      <footer className="border-t border-night-100 bg-night-50 px-6 py-10 text-center text-sm text-night-800">
        <p className="font-serif text-lg font-semibold text-night-900">
          The Lightworker Coach · Helping those who help others
        </p>
        <p className="mt-3 inline-flex items-center gap-2">
          <MailIcon className="h-4 w-4 text-gold-600" />
          <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || "peter@lightworkercoach.co.uk"}`} className="underline-offset-2 hover:underline">
            peter@lightworkercoach.co.uk
          </a>
        </p>
        <p className="mt-3">
          <a href={PRIVACY_URL} className="underline-offset-2 hover:underline">
            Privacy notice
          </a>{" "}
          · © 2026 Lightworker Coach Limited
        </p>
      </footer>
    </div>
  );
}
