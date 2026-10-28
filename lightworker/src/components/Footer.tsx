import { Link } from "react-router-dom";
import { SunIcon, MailIcon, PhoneIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-night-100 bg-night-50">
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-[40rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(159,147,203,0.6), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/50 bg-gold-400/10 text-gold-500">
                <SunIcon className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-semibold text-night-900">The Lightworker Coach</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-night-700/70">
              Spiritual business coaching for healers, psychics, therapists and lightworkers who
              are ready to help more people — and build a heart-led practice that thrives.
            </p>
            <p className="mt-4 text-sm italic text-gold-600 font-serif">
              “The more people we help, the more the money comes in.”
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold-600">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm text-night-700/70">
              <li><Link to="/" className="hover:text-night-900 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-night-900 transition-colors">About Me</Link></li>
              <li><Link to="/services" className="hover:text-night-900 transition-colors">Services</Link></li>
              <li><Link to="/blog" className="hover:text-night-900 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-night-900 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold-600">Connect</h4>
            <ul className="mt-5 space-y-3 text-sm text-night-700/70">
              <li>
                <a href="mailto:hello@lightworkercoach.co.uk" className="flex items-center gap-2 hover:text-night-900 transition-colors">
                  <MailIcon className="h-4 w-4 text-gold-500" /> hello@lightworkercoach.co.uk
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-gold-500" /> By appointment
              </li>
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-flex rounded-full border border-gold-500/60 px-4 py-2 text-xs font-medium text-gold-600 transition-all hover:bg-gold-500 hover:text-white"
            >
              First call is free
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-night-100 pt-8 text-xs text-night-700/50 sm:flex-row">
          <p>© {new Date().getFullYear()} The Lightworker Coach Limited. All rights reserved.</p>
          <p>Raising the vibration of humanity, one lightworker at a time.</p>
        </div>
      </div>
    </footer>
  );
}
