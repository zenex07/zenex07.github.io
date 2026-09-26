import { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browser chrome resizes the viewport mid-scroll; without this every
// trigger refreshes and the page jumps under the thumb.
ScrollTrigger.config({ ignoreMobileResize: true });

/* ------------------------------------------------------------------ *
 *  Motion timing — the one place the whole layer is tuned.
 *
 *  The choreography is deliberately unchanged: same order, same
 *  directions, same easing families. These are only the numbers that
 *  decide how long each beat takes, pulled short so every piece settles
 *  quickly instead of making the reader wait on it.
 * ------------------------------------------------------------------ */
export const EASE_REVEAL = 'expo.out'; // headings and masked lines
export const EASE_RISE = 'power3.out'; // fade-and-rise blocks

export const MOTION = {
  // Scroll
  lenisDuration: 0.95,
  // A shorter, more even settle than the default expo curve — arrives just
  // as fast but without the long creeping tail at the end.
  lenisEase: (t) => 1 - Math.pow(1 - t, 3.2),
  anchorDuration: 1.0,

  // Scroll reveals
  reveal: { duration: 0.7, stagger: 0.055, y: 24 },
  mask: { duration: 0.8, stagger: 0.065 },
  heading: { duration: 0.75, stagger: 0.04 },

  // Scroll-driven scrubs (lower = less trailing behind the scroll)
  scrub: { pin: 0.28, spine: 0.35 },

  // Pointer feel
  pointer: { ringLerp: 0.22, scaleLerp: 0.19, magnetLerp: 0.24 },

  // Sections
  hero: {
    line: 0.85,
    lineStagger: 0.065,
    fade: 0.65,
    fadeStagger: 0.065,
    portrait: 1.0,
    rule: 0.8,
  },
  preloader: { word: 0.7, wordStagger: 0.055, bar: 0.85, fade: 0.3, lift: 0.7 },
  lightbox: { backdrop: 0.26, panel: 0.48, doc: 0.3 },
  stat: 1.0,
  node: 0.2,
};

/**
 * Motion runs by default, deliberately — the OS "reduce motion" setting is
 * not honoured automatically, because most Windows machines have animations
 * switched off system-wide and would otherwise never see the site move.
 *
 * The opt-out is still there for anyone who needs it: add ?reduced-motion
 * to the URL and the whole motion layer switches off.
 */
const REDUCED =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('reduced-motion');

if (REDUCED) document.documentElement.dataset.reducedMotion = '';

export const prefersReducedMotion = () => REDUCED;

/**
 * Lenis inertia scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * scroll position never disagree. Returns the Lenis instance via ref so other
 * components (nav links, scroll-to-top) can drive it.
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: MOTION.lenisDuration,
      easing: MOTION.lenisEase,
      smoothWheel: true,
      // Undamped distance per notch — the inertia curve already smooths the
      // motion, so holding it back on top just made the wheel feel laggy.
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  return lenisRef;
}

/** Scroll to an anchor through Lenis when it is running, natively otherwise. */
export function scrollToSection(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -8, duration: MOTION.anchorDuration });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Reveals every [data-reveal] descendant of the returned ref as it enters the
 * viewport. Children are staggered by their DOM order within the container.
 *
 * data-reveal="up"   — fade + rise (default)
 * data-reveal="mask" — inner <span> slides up out of an overflow-hidden box
 */
export function useReveal(options = {}) {
  const scope = useRef(null);
  const {
    stagger = MOTION.reveal.stagger,
    y = MOTION.reveal.y,
    duration = MOTION.reveal.duration,
    start = 'top 85%',
  } = options;

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return undefined;

    if (prefersReducedMotion()) {
      root.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.remove('will-reveal');
        gsap.set(el, { clearProps: 'all' });
        el.querySelectorAll('.reveal-mask > span').forEach((s) =>
          gsap.set(s, { yPercent: 0 })
        );
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const plain = gsap.utils.toArray('[data-reveal="up"], [data-reveal=""], [data-reveal]:not([data-reveal="mask"])');
      const masks = gsap.utils.toArray('[data-reveal="mask"]');

      if (plain.length) {
        gsap.set(plain, { opacity: 0, y });
        ScrollTrigger.batch(plain, {
          start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              ease: EASE_RISE,
              onStart: () => batch.forEach((el) => el.classList.remove('will-reveal')),
            }),
        });
      }

      masks.forEach((el) => {
        const lines = el.querySelectorAll('.reveal-mask > span');
        if (!lines.length) return;
        gsap.set(lines, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () => {
            el.classList.remove('will-reveal');
            gsap.to(lines, {
              yPercent: 0,
              duration: MOTION.mask.duration,
              stagger: MOTION.mask.stagger,
              ease: EASE_REVEAL,
            });
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [stagger, y, duration, start]);

  return scope;
}

/**
 * Subtle vertical parallax. `speed` is the fraction of the scrolled distance
 * the element lags behind by — 0.1 is a hint, 0.3 is obvious.
 */
export function useParallax(speed = 0.12) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

export { gsap, ScrollTrigger };
