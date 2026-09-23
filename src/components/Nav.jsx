import { useEffect, useRef, useState } from 'react';
import { navLinks, profile } from '../content/content.js';
import { scrollToSection } from '../hooks/useMotion.js';
import Magnetic from './Magnetic.jsx';

export default function Nav() {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setLifted(y > 40);

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight whichever section currently owns the upper third of the screen.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-30% 0px -65% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      {/* Scroll progress */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-terracotta/70"
        ref={progressRef}
        style={{ transform: 'scaleX(0)' }}
      />

      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
          lifted
            ? 'border-b border-line/60 bg-ivory/80 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="shell flex items-center justify-between py-4 lg:py-5">
          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            data-cursor="top"
            className="display text-lg tracking-tight"
          >
            {profile.name}
            <span className="text-terracotta">.</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  data-cursor=""
                  className={`link-wipe font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    active === link.href ? 'text-terracotta' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* Scrolls to the contact section rather than firing a mailto:
                — a mailto does nothing visible when no mail client is
                registered, which reads as a broken button. */}
            <Magnetic strength={0.25}>
              <a
                href="#contact"
                onClick={(e) => go(e, '#contact')}
                data-cursor="say hi"
                className="hidden rounded-full border border-ink/15 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:border-terracotta hover:bg-terracotta hover:text-bone sm:inline-block"
              >
                Get in touch
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-[59] bg-ivory transition-[opacity,visibility] duration-400 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul className="flex h-full flex-col items-start justify-center gap-2 px-8">
          {navLinks.map((link, i) => (
            <li key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="display block py-2 text-5xl transition-transform duration-500"
                style={{
                  transform: open ? 'translateY(0)' : 'translateY(110%)',
                  transitionDelay: `${open ? 80 + i * 55 : 0}ms`,
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-8">
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-xs uppercase tracking-[0.16em] text-terracotta"
            >
              {profile.email}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
