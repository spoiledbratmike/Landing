import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SunIcon } from "./Icons";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Me" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-night-100 py-3 shadow-sm shadow-night-100/50"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/50 bg-gold-400/10 text-gold-500 transition-transform duration-500 group-hover:rotate-90">
            <SunIcon className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold tracking-wide text-night-900">
              The Lightworker Coach
            </span>
            <span className="block text-[10px] uppercase tracking-[0.35em] text-gold-500/90">
              Heart-led · Purpose-driven
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm tracking-wide transition-colors ${
                    isActive ? "text-gold-600" : "text-night-700/80 hover:text-night-900"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/25"
          >
            Book a Free Call
          </Link>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-night-900 transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-night-900 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-night-900 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden bg-white/95 backdrop-blur-xl transition-all duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 px-6 pb-6 pt-4">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm ${
                    isActive ? "bg-night-50 text-gold-600" : "text-night-700/80"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link
              to="/contact"
              className="mt-2 block rounded-xl bg-gold-500 px-4 py-3 text-center text-sm font-medium text-white"
            >
              Book a Free Call
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
