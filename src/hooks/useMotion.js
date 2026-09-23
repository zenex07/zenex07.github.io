import { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
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
    window.__lenis.scrollTo(el, { offset: -8, duration: 1.3 });
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
  const { stagger = 0.08, y = 28, duration = 1.0, start = 'top 85%' } = options;

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
              ease: 'power3.out',
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
              duration: 1.15,
              stagger: 0.1,
              ease: 'expo.out',
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
