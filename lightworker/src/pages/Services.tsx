import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { PageHeader, CTASection, Eyebrow } from "../components/Shared";
import {
  OneToOneIcon,
  GroupIcon,
  CourseIcon,
  CheckIcon,
  ArrowIcon,
} from "../components/Icons";

const packages = [
  {
    icon: OneToOneIcon,
    name: "One-to-One Coaching",
    tagline: "Personal mentoring, online",
    highlight: true,
    intro:
      "The most effective way to collaborate with me. You’ll be guided and mentored by me throughout your growth acceleration process.",
    features: [
      "Three 60-minute coaching sessions",
      "Email support between sessions",
      "Personalised action plan",
      "Mid-program progress review",
      "Spiritual & practical guidance combined",
    ],
  },
  {
    icon: GroupIcon,
    name: "Group Coaching",
    tagline: "Grow alongside your peers",
    highlight: false,
    intro:
      "Regular sessions online working with other spiritually-led business owners. Together we discuss issues everyone in the group is facing.",
    features: [
      "Live group coaching sessions online",
      "Share best practices with peers",
      "Speed up your learning",
      "Supportive, heart-led community",
      "A fantastic way to drive growth",
    ],
  },
  {
    icon: CourseIcon,
    name: "Online Courses",
    tagline: "Learn in your own time",
    highlight: false,
    intro:
      "Another fantastic way to drive growth in your business. Learn at your own pace with courses for every stage of the journey.",
    features: [
      "From start-up to scale-up to sell-up",
      "Self-paced learning",
      "Practical, actionable modules",
      "Designed for spiritual entrepreneurs",
      "Ongoing access & resources",
    ],
  },
];

const process = [
  { step: "01", title: "Free first call", text: "The first call is free — so we can decide together how we’ll work to achieve your aspirations." },
  { step: "02", title: "Find your focus", text: "We bring laser focus to your vision, positioning your services clearly in the 5D market." },
  { step: "03", title: "Build the strategy", text: "Together we work out a realistic, step-by-step strategy for profitable growth." },
  { step: "04", title: "Grow & thrive", text: "You help more people, raise your vibration, and — as a by-product — increase your income." },
];

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Use your gifts to help more people"
        subtitle="You want to use your gifts to help more people — and by doing so, create a sustainable regular high income. If so, help is at hand."
      />

      {/* PACKAGES */}
      <section className="relative bg-white px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 120}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all hover:-translate-y-1 ${
                  p.highlight
                    ? "border-gold-400/60 bg-gradient-to-b from-gold-400/10 to-white shadow-xl shadow-gold-500/10"
                    : "border-night-100 bg-night-50/50 hover:border-gold-400/40 hover:bg-white hover:shadow-lg hover:shadow-night-100/60"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    Most popular
                  </span>
                )}
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-600">
                  <p.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-serif text-2xl font-semibold text-night-900">{p.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-600/80">{p.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-night-700/75">{p.intro}</p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-night-800/90">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                    p.highlight
                      ? "bg-gold-500 text-white hover:bg-gold-600"
                      : "border border-night-300 text-night-800 hover:bg-night-900 hover:text-white hover:border-night-900"
                  }`}
                >
                  Enquire now
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="relative bg-night-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Eyebrow>How we work together</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl font-semibold text-night-900 sm:text-5xl">
              A simple, soulful path forward
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 110}>
                <div className="h-full rounded-2xl border border-night-100 bg-white p-7 shadow-sm shadow-night-100/50">
                  <span className="font-serif text-4xl gold-text">{p.step}</span>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-night-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-night-700/75">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY BAND */}
      <section className="relative bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-serif text-3xl font-medium leading-snug text-night-900 sm:text-4xl">
              “I don’t wake up thinking, <span className="text-night-500/70">‘Who can I invoice?’</span>
              I think, <span className="gold-text">‘Who can I help?’</span> — because the more I serve, the more I receive.”
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
