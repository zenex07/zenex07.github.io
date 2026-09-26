import { useLayoutEffect, useRef } from 'react';
import {
  EASE_REVEAL,
  gsap,
  MOTION,
  ScrollTrigger,
  prefersReducedMotion,
} from '../hooks/useMotion.js';

/**
 * A heading whose words rise out of clipped lines when it scrolls into view.
 *
 * Words are wrapped individually rather than the whole line, so the reveal
 * staggers across the line instead of sliding as one block — the difference
 * between "animated" and "moved".
 *
 * `lines` is an array of strings; each becomes its own clipped row, so line
 * breaks stay intentional instead of depending on the container width.
 */
export default function SplitHeading({
  lines,
  className = '',
  italicLast = false,
  accentClass = 'italic text-terracotta',
  as: Tag = 'h2',
  delay = 0,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const words = el.querySelectorAll('[data-word]');
    if (!words.length) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115, opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () =>
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: MOTION.heading.duration,
            delay,
            stagger: MOTION.heading.stagger,
            ease: EASE_REVEAL,
          }),
      });
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => {
        const isLast = li === lines.length - 1;
        return (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            {line.split(' ').map((word, wi) => (
              <span
                key={`${word}-${wi}`}
                data-word
                className={`inline-block will-change-transform ${
                  italicLast && isLast ? accentClass : ''
                }`}
              >
                {word}
                {wi < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
