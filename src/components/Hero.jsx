import { useEffect, useRef, useState } from 'react';
import { profile } from '../content/content.js';
import {
  gsap,
  MOTION,
  prefersReducedMotion,
  scrollToSection,
  useParallax,
} from '../hooks/useMotion.js';
import ShaderBackdrop from './ShaderBackdrop.jsx';
import Magnetic from './Magnetic.jsx';

/**
 * Drop a file at public/assets/video/hero.mp4 and it becomes the hero
 * backdrop, warm-graded to match the palette. Until then — or if the file
 * fails to load — the WebGL gradient stands in, so the hero is never empty.
 */
const HERO_VIDEO = './assets/video/hero.mp4';

export default function Hero({ ready }) {
  const root = useRef(null);
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(false);
  const portraitRef = useParallax(0.07);

  useEffect(() => {
    if (!ready) return undefined;

    if (prefersReducedMotion()) {
      gsap.set('[data-hero-line] > span, [data-hero-fade]', { yPercent: 0, opacity: 1 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.from('[data-hero-line] > span', {
        yPercent: 112,
        duration: MOTION.hero.line,
        stagger: MOTION.hero.lineStagger,
      })
        .from(
          '[data-hero-fade]',
          { y: 22, opacity: 0, duration: MOTION.hero.fade, stagger: MOTION.hero.fadeStagger },
          '-=0.55'
        )
        .from(
          '[data-hero-portrait]',
          { scale: 1.06, opacity: 0, duration: MOTION.hero.portrait, ease: 'power3.out' },
          '-=0.75'
        )
        .from(
          '[data-hero-rule]',
          { scaleX: 0, duration: MOTION.hero.rule, ease: 'power2.inOut' },
          '-=0.7'
        );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  // Fade the hero out slightly as it leaves — gives the next section room.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.to('[data-hero-inner]', {
        opacity: 0.25,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'bottom 85%',
          end: 'bottom 25%',
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      /* Extra bottom padding on large screens keeps the availability line
         clear of the absolutely-positioned scroll cue. */
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 lg:pb-32"
    >
      {/* Backdrop: shader by default, video when one is supplied. */}
      <div className="absolute inset-0 -z-10">
        <ShaderBackdrop />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            hasVideo ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: 'saturate(0.72) sepia(0.28) contrast(1.04) brightness(1.06)',
            mixBlendMode: 'multiply',
          }}
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={() => setHasVideo(false)}
          onLoadedData={() => setHasVideo(true)}
        />
        {/* Keeps type legible whatever is playing underneath. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/80 via-ivory/35 to-ivory" />
      </div>

      <div data-hero-inner className="shell relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Type */}
          <div className="lg:col-span-7">
            <p data-hero-fade className="eyebrow mb-8">
              {profile.role}
            </p>

            <h1 className="display text-[clamp(2.75rem,8.4vw,6.5rem)] leading-[0.94]">
              {profile.headline.map((line, i) => (
                <span key={line} data-hero-line className="reveal-mask">
                  <span className={i === profile.headline.length - 1 ? 'italic text-terracotta' : ''}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <div data-hero-rule className="hairline my-9 max-w-lg origin-left" />

            <p
              data-hero-fade
              className="max-w-xl text-pretty text-base leading-relaxed text-ink-soft lg:text-lg"
            >
              {profile.lede}
            </p>

            <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('#work');
                  }}
                  data-cursor="view"
                  className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm text-bone transition-colors duration-300 hover:bg-terracotta"
                >
                  See the work
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </Magnetic>

              <Magnetic strength={0.22}>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="email"
                  className="link-wipe text-sm text-ink-soft hover:text-ink"
                >
                  {profile.email}
                </a>
              </Magnetic>
            </div>

            <p
              data-hero-fade
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-mute"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-olive" />
              {profile.availability}
            </p>
          </div>

          {/* Portrait */}
          <div className="lg:col-span-5">
            <div data-hero-portrait className="relative mx-auto max-w-sm lg:ml-auto lg:mr-0">
              <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl border border-line/70 shadow-[0_30px_80px_-40px_rgba(36,28,22,0.45)]">
                <div ref={portraitRef} className="scale-110">
                  <img
                    src="./assets/rohit-portrait.jpg"
                    alt={`${profile.name}, ${profile.role}`}
                    width="677"
                    height="903"
                    className="h-full w-full object-cover"
                    style={{ filter: 'saturate(0.92) contrast(1.02)' }}
                  />
                </div>
                {/* Warm wash so the portrait sits in the palette. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-clay/25 via-transparent to-transparent mix-blend-multiply" />
              </div>

              <div className="mt-5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
                <span>{profile.location}</span>
                <span>MCA · SVVV</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        type="button"
        onClick={() => scrollToSection('#work')}
        aria-label="Scroll to work"
        data-cursor=""
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-terracotta" />
        </span>
        <style>{`
          @keyframes scrollcue {
            0%   { transform: translateY(-100%); }
            60%  { transform: translateY(200%); }
            100% { transform: translateY(200%); }
          }
        `}</style>
      </button>
    </section>
  );
}
