import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { ArrowIcon } from "./Icons";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">
      <span className="h-px w-8 bg-gold-500/50" />
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-40 pb-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(222,217,236,0.7), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-tight text-night-900 sm:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-night-700/70">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-night-100 bg-gradient-to-br from-night-50 via-white to-night-50 p-10 text-center shadow-xl shadow-night-100/50 sm:p-16">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(217,177,85,0.5), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(159,147,203,0.6), transparent 70%)" }}
        />
        <Reveal>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-gold-600">Your first call is free</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-night-900 sm:text-5xl">
            Ready to grow a heart-led business that thrives?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-night-700/70">
            Let’s connect and decide, together, how we’ll work to achieve your aspirations —
            blending spiritual insight with practical, real-world strategy.
          </p>
          <Link
            to="/contact"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-gold-600 hover:shadow-[0_0_40px_-8px_rgba(217,177,85,0.7)]"
          >
            Book your free discovery call
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
