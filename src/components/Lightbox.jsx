import { useCallback, useEffect, useRef } from 'react';
import { gsap, MOTION, prefersReducedMotion } from '../hooks/useMotion.js';

/**
 * In-page document viewer for the certificates.
 *
 * Opening a PDF in a new tab is unreliable — popup blockers stop it, and some
 * browsers have no inline PDF viewer at all, so the click appears to do
 * nothing. Rendering the document here means a click always produces a
 * visible result, with the original still one link away.
 */
export default function Lightbox({ items, index, onClose, onNavigate }) {
  const open = index !== null && index >= 0;
  const item = open ? items[index] : null;

  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  const go = useCallback(
    (delta) => {
      if (!open) return;
      onNavigate((index + delta + items.length) % items.length);
    },
    [open, index, items.length, onNavigate]
  );

  // Keyboard: Esc closes, arrows page through, Tab is trapped in the panel.
  useEffect(() => {
    if (!open) return undefined;

    lastFocused.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        go(1);
      } else if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      window.__lenis?.start();
      lastFocused.current?.focus?.();
    };
  }, [open, onClose, go]);

  // Entrance
  useEffect(() => {
    if (!open || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: MOTION.lightbox.backdrop, ease: 'power2.out' }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 28, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: MOTION.lightbox.panel, ease: 'expo.out' }
      );
    });
    return () => ctx.revert();
  }, [open]);

  // Cross-fade the document when paging between certificates.
  useEffect(() => {
    if (!open || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-lb-doc]',
        { opacity: 0 },
        { opacity: 1, duration: MOTION.lightbox.doc, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, [open, index]);

  if (!open) return null;

  const isPdf = /\.pdf($|\?)/i.test(item.file);

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — certificate`}
    >
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line/50 bg-ivory shadow-[0_40px_120px_-30px_rgba(36,28,22,0.7)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line/60 px-5 py-4 lg:px-7">
          <div className="min-w-0">
            <h3 className="display truncate text-lg lg:text-xl">{item.title}</h3>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
              {item.issuer.startsWith('TODO') ? 'Issuer to confirm' : item.issuer} ·{' '}
              {item.date}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            data-cursor="close"
            aria-label="Close"
            className="shrink-0 rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft transition-colors duration-300 hover:border-terracotta hover:bg-terracotta hover:text-bone"
          >
            Close
          </button>
        </div>

        {/* Document */}
        <div className="relative flex-1 overflow-auto bg-sand/30 p-3 lg:p-5">
          <div data-lb-doc className="mx-auto h-full w-full">
            {isPdf ? (
              <iframe
                key={item.file}
                src={`${item.file}#view=FitH`}
                title={item.title}
                className="h-full min-h-[55vh] w-full rounded-lg border border-line/50 bg-bone"
              />
            ) : (
              <img
                key={item.file}
                src={item.file}
                alt={item.title}
                className="mx-auto max-h-full rounded-lg border border-line/50 bg-bone object-contain"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 px-5 py-3.5 lg:px-7">
          <p className="max-w-md text-xs leading-relaxed text-ink-soft">{item.detail}</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              data-cursor=""
              aria-label="Previous certificate"
              className="rounded-full border border-line px-3.5 py-2 font-mono text-[11px] text-ink-soft transition-colors duration-300 hover:border-ink hover:text-ink"
            >
              ←
            </button>
            <span className="font-mono text-[10px] tabular-nums text-ink-mute">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              data-cursor=""
              aria-label="Next certificate"
              className="rounded-full border border-line px-3.5 py-2 font-mono text-[11px] text-ink-soft transition-colors duration-300 hover:border-ink hover:text-ink"
            >
              →
            </button>
            <a
              href={item.file}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="open"
              className="ml-2 rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:bg-terracotta"
            >
              Original ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
