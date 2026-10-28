import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { PageHeader, CTASection } from "../components/Shared";
import { ArrowIcon } from "../components/Icons";
import { blogPosts } from "../data";

export default function Blog() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Insights for heart-led entrepreneurs"
        subtitle="Reflections on manifestation, soul-aligned business and ethical, spiritual coaching — to inspire your journey."
      />

      <section className="relative bg-white px-6 pb-12">
        <div className="mx-auto max-w-6xl">
          {/* Featured */}
          <Reveal>
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[2rem] border border-night-100 bg-night-50/50 shadow-sm shadow-night-100/50 transition-all hover:border-gold-400/40 hover:shadow-xl hover:shadow-night-200/40 lg:grid-cols-2"
            >
              <div className="relative min-h-[260px] overflow-hidden">
                <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
                <span className="absolute left-6 top-6 rounded-full bg-gold-500 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                  Featured
                </span>
              </div>
              <div className="p-9 sm:p-11">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold-600/80">
                  <span>{featured.date}</span>
                  <span className="h-1 w-1 rounded-full bg-gold-500/50" />
                  <span>{featured.readTime}</span>
                </div>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-snug text-night-900 transition-colors group-hover:text-gold-600">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-relaxed text-night-700/75">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-600">
                  Read the article
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 120}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-night-100 bg-night-50/50 p-8 transition-all hover:border-gold-400/40 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-night-100/60"
                >
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold-600/80">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-gold-500/50" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-semibold leading-snug text-night-900 transition-colors group-hover:text-gold-600">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-night-700/75">{post.excerpt}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full border border-night-200 px-3 py-1 text-[11px] text-night-600/70">
                        {t}
                      </span>
                    ))}
                  </div>
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
