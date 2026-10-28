import { useState } from "react";
import Reveal from "../components/Reveal";
import { PageHeader, Eyebrow } from "../components/Shared";
import { MailIcon, PhoneIcon, CheckIcon, GroupIcon, SparkIcon } from "../components/Icons";

const reasons = [
  { icon: SparkIcon, title: "The first call is free", text: "It lets us decide, together, how we’ll work to achieve your aspirations." },
  { icon: GroupIcon, title: "For heart-led founders", text: "Healers, psychics, therapists, readers and spiritual entrepreneurs." },
  { icon: CheckIcon, title: "Practical & spiritual", text: "Real business experience combined with an awakened awareness of spirit." },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s connect for a free call"
        subtitle="The most effective way to collaborate with me is a one-to-one session online. The first call is free, so we can decide how we’ll work together."
      />

      <section className="relative bg-white px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5">
          {/* Info */}
          <Reveal className="lg:col-span-2">
            <Eyebrow>Why reach out</Eyebrow>
            <div className="mt-6 space-y-4">
              {reasons.map((r) => (
                <div key={r.title} className="flex gap-4 rounded-2xl border border-night-100 bg-night-50/50 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-600">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-night-900">{r.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-night-700/75">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-night-100 bg-night-50/50 p-6">
              <a href="mailto:hello@lightworkercoach.co.uk" className="flex items-center gap-3 text-sm text-night-800/90 hover:text-night-900">
                <MailIcon className="h-5 w-5 text-gold-600" /> hello@lightworkercoach.co.uk
              </a>
              <p className="flex items-center gap-3 text-sm text-night-800/90">
                <PhoneIcon className="h-5 w-5 text-gold-600" /> Sessions online, worldwide
              </p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={120} className="lg:col-span-3">
            <div className="rounded-[2rem] border border-night-100 bg-gradient-to-b from-night-50 to-white p-8 shadow-lg shadow-night-100/50 sm:p-10">
              {sent ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
                    <CheckIcon className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 font-serif text-3xl font-semibold text-night-900">Thank you</h3>
                  <p className="mt-3 max-w-sm text-night-700/75">
                    Your message is on its way. I’ll be in touch soon to arrange your free call.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 rounded-full border border-night-300 px-6 py-2.5 text-sm text-night-800 hover:bg-night-50"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="space-y-5"
                >
                  <h3 className="font-serif text-2xl font-semibold text-night-900">Book your free discovery call</h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" name="name" placeholder="Jane Doe" />
                    <Field label="Email" name="email" type="email" placeholder="you@example.com" />
                  </div>
                  <Field label="Your practice (optional)" name="practice" placeholder="e.g. Reiki healer, Tarot reader" />
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-night-600/80">
                      How can I help?
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me a little about your business and your dreams…"
                      className="w-full resize-none rounded-2xl border border-night-200 bg-white px-4 py-3 text-sm text-night-900 placeholder:text-night-400 outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-400/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-gold-500 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-gold-600 hover:shadow-[0_0_40px_-8px_rgba(217,177,85,0.7)]"
                  >
                    Request my free call
                  </button>
                  <p className="text-center text-xs text-night-500/70">
                    I’ll never share your details. This is a safe, heart-led space.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-night-600/80">{label}</label>
      <input
        name={name}
        type={type}
        required={name !== "practice"}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-night-200 bg-white px-4 py-3 text-sm text-night-900 placeholder:text-night-400 outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-400/20"
      />
    </div>
  );
}
