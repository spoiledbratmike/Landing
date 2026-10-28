import { Link, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import { CTASection } from "../components/Shared";
import { ArrowIcon, CheckIcon } from "../components/Icons";
import { blogPosts } from "../data";

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  if (!post) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl text-night-900">Article not found</h1>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-gold-600">
          <ArrowIcon className="h-4 w-4 rotate-180" /> Back to the journal
        </Link>
      </section>
    );
  }

  return (
    <>
      <article className="relative bg-white">
        <div className="relative overflow-hidden pt-40 pb-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(222,217,236,0.7), transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-3xl px-6">
            <Reveal>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gold-600">
                <ArrowIcon className="h-4 w-4 rotate-180" /> The Journal
              </Link>
              <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gold-600/80">
                <span>{post.date}</span>
                <span className="h-1 w-1 rounded-full bg-gold-500/50" />
                <span>{post.readTime}</span>
              </div>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-night-900 sm:text-5xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-night-200 px-3 py-1 text-[11px] text-night-600/70">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 pb-16">
          <Reveal>
            <div className="space-y-6">
              {post.content.map((block, i) => {
                if (block.type === "h") {
                  return (
                    <h2 key={i} className="pt-4 font-serif text-2xl font-semibold text-gold-600">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="space-y-3">
                      {block.items?.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-night-800/90">
                          <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-lg leading-relaxed text-night-700/90">
                    {block.text}
                  </p>
                );
              })}
            </div>
          </Reveal>
        </div>
      </article>

      {/* Related */}
      <section className="relative bg-night-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-2xl font-semibold text-night-900">Continue reading</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/blog/${r.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-night-100 bg-white p-7 shadow-sm shadow-night-100/50 transition-all hover:border-gold-400/40 hover:shadow-lg hover:shadow-night-100/60"
              >
                <h3 className="font-serif text-xl font-semibold leading-snug text-night-900 transition-colors group-hover:text-gold-600">
                  {r.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-night-700/75">{r.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-600">
                  Read more <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
