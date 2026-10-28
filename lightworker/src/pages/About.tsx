import Reveal from "../components/Reveal";
import { PageHeader, CTASection, Eyebrow } from "../components/Shared";
import { LotusIcon, SparkIcon, HeartIcon } from "../components/Icons";

const healing = [
  { title: "Reiki", text: "Universal life-force energy healing for balance and wellbeing." },
  { title: "Rahanni Celestial Healing", text: "A gentle, high-vibration healing working on the heart." },
  { title: "Hypnotherapy", text: "Guiding the subconscious toward release, clarity and change." },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Me"
        title="Where corporate transformation meets spiritual transcendence"
        subtitle="Welcome to my world. My whole working life has been dedicated to helping people make more money and build stronger businesses. Now, I help people raise their vibration and their consciousness."
      />

      <section className="relative bg-white px-6 pb-8">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(217,177,85,0.4), transparent 70%)" }}
              />
              <img
                src="/images/portrait.jpg"
                alt="Peter, The Lightworker Coach"
                className="relative w-full rounded-[2rem] border border-night-100 object-cover shadow-lg shadow-night-100/60"
              />
              <div className="relative mt-5 rounded-2xl border border-night-100 bg-night-50/60 p-5 text-center">
                <p className="font-serif text-2xl text-night-900">Peter</p>
                <p className="text-xs uppercase tracking-[0.25em] text-gold-600/90">The Lightworker Coach</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-3">
            <Eyebrow>My Story</Eyebrow>
            <div className="mt-6 space-y-5 leading-relaxed text-night-700/85">
              <p>
                In 2005 I left the corporate world and began my own consultancy business, helping
                small business owners with the acceleration of their growth. Now, in my 20th year of
                self-employment, I focus on instilling a culture of value-seeking salesmanship among
                business leaders and their sales teams — creating an atmosphere where meeting sales
                targets is done gracefully and harmoniously.
              </p>
              <p>
                Apart from my consulting work, I also practise healing techniques such as Reiki,
                Rahanni Celestial Healing and Hypnotherapy. Currently I offer my healing services to
                people around the world, guiding them on paths of wellbeing and rejuvenation.
              </p>
              <p>
                Through various personal struggles in my early life, I gained some profound insights
                about the spiritual terrain — and because of that, have dedicated myself to promoting
                wellness among those in need. I find helping on a one-to-one level very rewarding.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AWAKENING */}
      <section className="relative bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal className="rounded-[2rem] border border-night-100 bg-gradient-to-br from-night-50 to-white p-10 shadow-lg shadow-night-100/50 sm:p-14">
            <SparkIcon className="h-9 w-9 text-gold-500/90 animate-floaty" />
            <h2 className="mt-6 font-serif text-3xl font-semibold text-night-900 sm:text-4xl">The Awakening</h2>
            <div className="mt-5 space-y-5 leading-relaxed text-night-700/85">
              <p>
                In 2022, I experienced an ‘awakening’ whilst attending a retreat. I felt every
                molecule within me connected to every other living thing on the planet and came to
                understand that age-old truism: <span className="text-gold-600">“we are one”.</span>
              </p>
              <p>
                It was so deep and profound that I couldn’t move or speak for quite a while
                afterwards. In that time, I rose above my usual understanding of the workings of the
                universe. I came to realise that, although we all think we are human beings looking
                for a spiritual experience — we are actually spiritual beings, looking for a human
                experience.
              </p>
              <p>
                Now my dreams have expanded to helping those who support others. By assisting
                healers, psychics, counsellors, therapists and other similar experts, I show the way
                to fulfilling their purpose, while also growing their business.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="relative bg-night-50 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <HeartIcon className="mx-auto h-9 w-9 text-gold-500/80" />
            <h2 className="mt-6 font-serif text-3xl font-semibold text-night-900 sm:text-4xl">
              Who the Lightworker Coach is for
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-night-700/80">
              These are therapists, clairvoyants, healers, psychics, tarot readers, Akashic record
              readers and so on. If you are out there with a small practice, helping and healing
              people, then The Lightworker Coach Limited consultancy was set up for you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* HEALING TECHNIQUES */}
      <section className="relative bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <Eyebrow>Healing Practices</Eyebrow>
            <h2 className="mt-6 font-serif text-3xl font-semibold text-night-900 sm:text-4xl">
              Techniques I practise
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {healing.map((h, i) => (
              <Reveal key={h.title} delay={i * 120}>
                <div className="h-full rounded-2xl border border-night-100 bg-night-50/50 p-7 text-center transition-all hover:border-gold-400/40 hover:bg-white hover:shadow-lg hover:shadow-night-100/60">
                  <LotusIcon className="mx-auto h-8 w-8 text-gold-500/90" />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-night-900">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-night-700/75">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
