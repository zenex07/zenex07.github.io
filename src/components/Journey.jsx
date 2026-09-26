import { useLayoutEffect, useRef } from 'react';
import { journey } from '../content/content.js';
import {
  gsap,
  MOTION,
  ScrollTrigger,
  prefersReducedMotion,
  useReveal,
} from '../hooks/useMotion.js';
import SplitHeading from './SplitHeading.jsx';

/**
 * Vertical timeline. The spine draws itself as the section scrolls, and each
 * node lights up once the drawn line reaches it — so the progress of the line
 * and the progress of the reading are the same thing.
 */
export default function Journey() {
  const scope = useReveal({ stagger: 0.05 });
  const spineRef = useRef(null);
  const listRef = useRef(null);

  useLayoutEffect(() => {
    const spine = spineRef.current;
    const list = listRef.current;
    if (!spine || !list || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 72%',
            end: 'bottom 78%',
            scrub: MOTION.scrub.spine,
          },
        }
      );

      // Each dot fills as the spine passes it.
      gsap.utils.toArray('[data-node]', list).forEach((node) => {
        gsap.fromTo(
          node,
          { backgroundColor: '#e3d5c3', scale: 1 },
          {
            backgroundColor: '#b4552f',
            scale: 1.35,
            duration: MOTION.node,
            ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 72%', once: true },
          }
        );
      });
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={scope} className="shell scroll-mt-24 py-24 lg:py-32">
      <header data-reveal="up" className="mb-14 max-w-2xl">
        <p className="eyebrow mb-5">Journey</p>
        <SplitHeading
          className="display text-4xl leading-[1.06] lg:text-5xl"
          lines={['Two years,', 'documented.']}
          italicLast
        />
      </header>

      <div ref={listRef} className="relative pl-8 lg:pl-0">
        {/* Spine */}
        <div
          aria-hidden="true"
          className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px bg-line lg:left-[calc(11rem+3px)]"
        />
        <div
          ref={spineRef}
          aria-hidden="true"
          className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-terracotta lg:left-[calc(11rem+3px)]"
        />

        <ol>
          {journey.map((item) => (
            <li
              key={item.title}
              data-reveal="up"
              className="relative grid gap-1.5 pb-11 last:pb-0 lg:grid-cols-[11rem_1fr] lg:gap-x-10"
            >
              {/* Date rail */}
              <div className="lg:pr-10 lg:text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
                  {item.date}
                </span>
              </div>

              {/* Node */}
              <span
                data-node
                aria-hidden="true"
                className="absolute left-[-1.75rem] top-[0.4rem] h-[7px] w-[7px] rounded-full bg-sand lg:left-[11rem]"
              />

              <div className="lg:pl-6">
                <h3 className="display text-xl leading-snug lg:text-2xl">{item.title}</h3>
                <p className="mt-1 text-sm italic text-clay">{item.org}</p>
                <p className="mt-2.5 max-w-xl text-pretty text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
