import { research } from '../content/content.js';
import { useReveal } from '../hooks/useMotion.js';
import SplitHeading from './SplitHeading.jsx';

export default function Research() {
  const scope = useReveal();

  return (
    <section id="research" ref={scope} className="shell scroll-mt-24 py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p data-reveal="up" className="eyebrow mb-6">
            Research
          </p>
          <SplitHeading
            className="display text-4xl leading-[1.08] lg:text-5xl"
            lines={['Presented at an', 'international congress.']}
            italicLast
          />
        </div>

        <div className="lg:col-span-8">
          <article data-reveal="up" className="card-paper rounded-2xl p-7 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
              <span className="rounded-full bg-terracotta px-2.5 py-1 text-bone">
                First author
              </span>
              <span>{research.date}</span>
            </div>

            <h3 className="display mt-6 text-2xl leading-snug lg:text-3xl">
              {research.title}
            </h3>

            <p className="mt-3 text-sm text-clay">{research.authors}</p>

            <div className="hairline my-7" />

            <p className="text-pretty text-sm leading-[1.85] text-ink-soft">
              {research.abstract}
            </p>

            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
                  Venue
                </dt>
                <dd className="mt-1.5 text-sm text-ink-soft">{research.venue}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
                  Host
                </dt>
                <dd className="mt-1.5 text-sm text-ink-soft">{research.host}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {research.keywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wide text-ink-soft"
                >
                  {k}
                </span>
              ))}
            </div>

            <a
              href={research.file}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="open"
              className="link-wipe mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-terracotta"
            >
              View presentation certificate ↗
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
