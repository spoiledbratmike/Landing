import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { Eyebrow, CTASection } from "../components/Shared";
import {
  OneToOneIcon,
  GroupIcon,
  CourseIcon,
  ArrowIcon,
  QuoteIcon,
  LotusIcon,
  HeartIcon,
  CompassIcon,
  SparkIcon,
} from "../components/Icons";
import { testimonials, blogPosts } from "../data";

const services = [
  {
    icon: OneToOneIcon,
    title: "One-to-One Coaching",
    text: "The most effective way to work together. You’ll be guided and mentored by me throughout your growth acceleration process — online, and personal to you.",
  },
  {
    icon: GroupIcon,
    title: "Group Coaching",
    text: "Regular sessions online with other spiritually-led business owners. Share best practices, solve shared challenges and speed up your learning together.",
  },
  {
    icon: CourseIcon,
    title: "Online Courses",
    text: "Learn in your own time. Courses that take you from start-up, through scale-up, to sell-up — practical steps for every stage of your journey.",
  },
];

const pillars = [
  {
    icon: HeartIcon,
    title: "Heart-led first",
    text: "We focus on how many people you can help. Income follows service — a benefit of putting others first.",
  },
  {
    icon: CompassIcon,
    title: "Practical strategy",
    text: "Two decades of real business consultancy experience, distilled into clear, actionable steps for your practice.",
  },
  {
    icon: SparkIcon,
    title: "Spiritual alignment",
    text: "Guidance from an awakened awareness — helping you raise your vibration and consciousness as you grow.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/75 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-28">
          <div className="max-w-2xl">
            <div className="animate-fade-up">
              <Eyebrow>Spiritual Business Coaching</Eyebrow>
            </div>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-night-900 animate-fade-up sm:text-7xl" style={{ animationDelay: "120ms" }}>
              Help more people.
              <br />
              <span className="gold-text">Build your light.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-night-800/80 animate-fade-up" style={{ animationDelay: "240ms" }}>
              For healers, psychics, therapists and lightworkers ready to use their gifts to
              serve more people — and create a sustainable, heart-led income doing what they love.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "360ms" }}>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-gold-600 hover:shadow-[0_0_40px_-8px_rgba(217,177,85,0.7)]"
              >
                Book a free call
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-night-300 bg-white/60 px-7 py-4 text-sm font-medium text-night-800 transition-all hover:bg-white"
              >
                Explore ways to work together
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.4em] text-night-500/60">
          Scroll
        </div>
      </section>

      {/* INTRO / WHAT */}
      <section className="relative bg-white px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>What is a Lightworker Coach?</Eyebrow>
              <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight text-night-900 sm:text-5xl">
                A spiritual business coach who has walked both worlds.
              </h2>
              <p className="mt-6 leading-relaxed text-night-700/80">
                This is someone with a background in helping small businesses accelerate their
                reach — so they can help more people. And, as a by-product of helping more people,
                their clients increase their earnings.
              </p>
              <p className="mt-4 leading-relaxed text-night-700/80">
                I’ll be there to guide you in the spiritual <em>and</em> the practical steps toward
                your dream. Healing and helping people does not mean you have to be poor — whether
                that’s time poor or cash poor.
              </p>
              <Link
                to="/about"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold-600"
              >
                Read my story
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>

            <div className="grid gap-5">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 120}>
                  <div className="group flex gap-5 rounded-2xl border border-night-100 bg-night-50/60 p-6 transition-all hover:border-gold-400/40 hover:bg-white hover:shadow-lg hover:shadow-night-100/60">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-600 transition-colors group-hover:bg-gold-400/25">
                      <p.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-night-900">{p.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-night-700/75">{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative overflow-hidden bg-night-50 px-6 py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(222,217,236,0.7), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Eyebrow>Ways to work together</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl font-semibold text-night-900 sm:text-5xl">
              Guidance for every stage of your journey
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-night-100 bg-white p-8 shadow-sm shadow-night-100/50 transition-all hover:border-gold-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-night-200/50">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-600">
                    <s.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-serif text-2xl font-semibold text-night-900">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-night-700/75">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-gold-500/60 px-6 py-3 text-sm font-medium text-gold-600 transition-all hover:bg-gold-500 hover:text-white"
            >
              See packages & details
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* AWAKENING QUOTE */}
      <section className="relative bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <LotusIcon className="mx-auto h-10 w-10 text-gold-500/80 animate-floaty" />
            <p className="mt-8 font-serif text-3xl font-medium leading-snug text-night-900 sm:text-4xl">
              “Although we all think we are human beings looking for a spiritual experience — we
              are actually <span className="gold-text">spiritual beings, looking for a human experience.</span>”
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-night-500/70">
              A truth realised in awakening, 2022
            </p>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative bg-night-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Eyebrow>Kind words</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl font-semibold text-night-900 sm:text-5xl">
              From heart-led business owners
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <figure className="flex h-full flex-col rounded-3xl border border-night-100 bg-white p-8 shadow-sm shadow-night-100/50">
                  <QuoteIcon className="h-8 w-8 text-gold-400/50" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-night-700/85">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-night-100 pt-4">
                    <p className="font-serif text-lg text-night-900">{t.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gold-600/80">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="relative bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>From the journal</Eyebrow>
              <h2 className="mt-6 font-serif text-4xl font-semibold text-night-900 sm:text-5xl">
                Insights & inspiration
              </h2>
            </div>
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gold-600"
            >
              View all articles
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 120}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-night-100 bg-night-50/50 p-7 transition-all hover:border-gold-400/40 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-night-100/60"
                >
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold-600/80">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-gold-500/50" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-night-900 transition-colors group-hover:text-gold-600">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-night-700/75 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-600">
                    Read more
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
