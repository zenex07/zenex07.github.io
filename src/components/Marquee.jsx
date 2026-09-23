import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../hooks/useMotion.js';

const WORDS = [
  'Multimodal RAG',
  'Retrieval',
  'Fine-tuning',
  'Edge ML',
  'Evaluation',
  'Data pipelines',
  'Interfaces',
];

/**
 * A slow band of keywords that drifts on its own and leans into whichever
 * direction you are scrolling. Two identical tracks make the loop seamless.
 */
export default function Marquee() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return undefined;

    let offset = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    let raf = 0;
    const half = () => track.scrollWidth / 2;

    const onScroll = () => {
      const y = window.scrollY;
      velocity = gsap.utils.clamp(-40, 40, y - lastScroll);
      lastScroll = y;
    };

    const tick = () => {
      // Constant drift, plus a nudge proportional to scroll speed.
      offset -= 0.45 + velocity * 0.06;
      velocity *= 0.92;

      const w = half();
      if (w > 0) {
        if (offset <= -w) offset += w;
        if (offset > 0) offset -= w;
      }
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const track = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="display whitespace-nowrap px-7 text-[clamp(1.75rem,4.5vw,3.25rem)] leading-none text-ink/85">
            {w}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-terracotta/70" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="overflow-hidden border-y border-line/60 bg-bone/40 py-7"
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {track}
        {track}
      </div>
    </div>
  );
}
