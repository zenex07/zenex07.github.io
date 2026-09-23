import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../hooks/useMotion.js';
import { profile } from '../content/content.js';

/**
 * A short, quiet entrance: the name sets, a rule draws across, the counter
 * runs to 100, and the panel lifts away. Roughly 1.8s, and skipped entirely
 * under reduced motion.
 */
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const barRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone?.();
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    const counter = { value: 0 };

    // gsap.context + revert() rather than tl.kill(): StrictMode mounts this
    // twice, and kill() would leave the heading parked at the .from() start
    // value, so the second timeline would animate 115% -> 115% and the name
    // would never appear. revert() restores the original styles first.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          document.body.style.overflow = '';
          onDone?.();
        },
      });

      tl.from('[data-pre-word]', { yPercent: 115, duration: 1.0, stagger: 0.08 })
        .to(barRef.current, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0.1)
        .to(
          counter,
          {
            value: 100,
            duration: 1.25,
            ease: 'power2.inOut',
            onUpdate: () => setCount(Math.round(counter.value)),
          },
          0.1
        )
        .to('[data-pre-fade]', { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.12')
        .to(root.current, {
          yPercent: -100,
          duration: 1.0,
          ease: 'expo.inOut',
        });
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onDone]);

  if (prefersReducedMotion()) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 text-ivory lg:px-12"
      aria-hidden="true"
    >
      <div data-pre-fade className="eyebrow !text-ivory/45 before:!bg-terracotta">
        {profile.location}
      </div>

      <div className="overflow-hidden">
        <h2
          data-pre-word
          className="display text-[13vw] leading-[0.92] tracking-[-0.03em] lg:text-[8vw]"
        >
          {profile.name}
        </h2>
      </div>

      <div data-pre-fade className="flex items-end justify-between gap-6">
        <div className="h-px w-full max-w-md origin-left scale-x-0 bg-ivory/30" ref={barRef} />
        <span className="font-mono text-sm tabular-nums text-ivory/60">
          {String(count).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}
