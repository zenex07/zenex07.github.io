import { useLayoutEffect, useRef, useState } from 'react';
import { approach } from '../content/content.js';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../hooks/useMotion.js';
import SplitHeading from './SplitHeading.jsx';

/**
 * Pinned section: the heading and the big step numeral stay fixed while the
 * four steps advance one at a time. Scroll distance drives the sequence, so
 * the reader sets the pace.
 *
 * Under reduced motion (or on narrow screens, where pinning fights the
 * address bar) it degrades to a plain stacked list.
 */
export default function Approach() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const panels = gsap.utils.toArray('[data-step-panel]', el);

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${panels.length * 340}`,
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          // Map 0..1 progress onto a step index, clamped off the end.
          const i = Math.min(
            panels.length - 1,
            Math.floor(self.progress * panels.length * 0.999)
          );
          setActive(i);
        },
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="approach"
      ref={root}
      className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-ivory lg:py-0"
    >
      <div className="shell lg:flex lg:min-h-screen lg:items-center">
        <div className="grid w-full gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Fixed side */}
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6 !text-ivory/40 before:!bg-ember">How I work</p>

            <SplitHeading
              className="display text-4xl leading-[1.06] lg:text-5xl"
              lines={['Four habits', 'that survive', 'contact with', 'real data.']}
              italicLast
            />

            {/* Step indicator */}
            <div className="mt-10 hidden items-center gap-4 lg:flex">
              <span className="display text-7xl leading-none text-ember/90 tabular-nums">
                {approach[active].step}
              </span>
              <div className="flex flex-col gap-1.5">
                {approach.map((s, i) => (
                  <span
                    key={s.step}
                    className={`h-px transition-all duration-500 ${
                      i === active ? 'w-12 bg-ember' : 'w-6 bg-ivory/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="relative lg:col-span-7">
            {approach.map((s, i) => (
              <div
                key={s.step}
                data-step-panel
                className={`border-t border-ivory/12 py-7 transition-opacity duration-500 lg:py-8 ${
                  i === active ? 'lg:opacity-100' : 'lg:opacity-30'
                }`}
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-ember">
                    {s.step}
                  </span>
                  <h3 className="display text-2xl lg:text-3xl">{s.title}</h3>
                </div>
                <p className="mt-3 max-w-xl text-pretty pl-0 leading-relaxed text-ivory/60 lg:pl-11">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
