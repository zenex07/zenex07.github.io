import { useEffect, useRef } from 'react';
import { education, profile, skillGroups, stats } from '../content/content.js';
import { gsap, prefersReducedMotion, useReveal } from '../hooks/useMotion.js';
import SplitHeading from './SplitHeading.jsx';

/** Counts up to a numeric value when scrolled into view; passes text through. */
function Stat({ value, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const numeric = Number(value);
    if (!el || Number.isNaN(numeric) || prefersReducedMotion()) return undefined;

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: numeric,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
      });
    });
    return () => ctx.revert();
  }, [value]);

  return (
    <div data-reveal="up" className="border-t border-line/70 pt-4">
      <div ref={ref} className="display text-4xl text-ink lg:text-5xl">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ink-mute">
        {label}
      </div>
    </div>
  );
}

export default function About() {
  const scope = useReveal();

  return (
    <section id="about" ref={scope} className="relative scroll-mt-24 bg-surface/50 py-24 lg:py-36">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p data-reveal="up" className="eyebrow mb-6">
              About
            </p>
            <SplitHeading
              className="display text-4xl leading-[1.08] lg:text-5xl"
              lines={['Curious about', 'the whole path.']}
              italicLast
            />

            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
              {stats.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            {profile.bio.map((para) => (
              <p
                key={para.slice(0, 32)}
                data-reveal="up"
                className="mb-6 text-pretty leading-[1.8] text-ink-soft lg:text-lg"
              >
                {para}
              </p>
            ))}

            {/* Skills */}
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.title} data-reveal="up">
                  <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-terracotta">
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-b border-line/50 pb-2 text-sm text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="mt-14">
              <h3
                data-reveal="up"
                className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-terracotta"
              >
                Education
              </h3>
              {education
                .filter((ed) => !ed.degree.startsWith('TODO'))
                .map((ed) => (
                <div
                  key={ed.degree}
                  data-reveal="up"
                  className="border-t border-line/70 py-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h4 className="display text-xl">{ed.degree}</h4>
                    {ed.period.startsWith('TODO') ? null : (
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
                        {ed.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {ed.school}
                    {ed.university ? `, ${ed.university}` : ''}
                  </p>
                  {ed.note ? (
                    <p className="mt-2 text-sm italic text-clay">{ed.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
