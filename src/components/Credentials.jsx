import { useState } from 'react';
import { certificates } from '../content/content.js';
import { useReveal } from '../hooks/useMotion.js';
import SplitHeading from './SplitHeading.jsx';
import Lightbox from './Lightbox.jsx';

function Card({ cert, onOpen }) {
  const pending = cert.issuer.startsWith('TODO');

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="view"
      data-reveal="up"
      aria-label={`View ${cert.title} certificate`}
      className="card-paper group flex flex-col overflow-hidden rounded-2xl text-left transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-28px_rgba(36,28,22,0.45)]"
    >
      {/* Thumbnail, or a typographic stand-in when the PDF is vector-only. */}
      <div className="relative aspect-[1.4/1] overflow-hidden border-b border-line/60 bg-sand/40">
        {cert.image ? (
          <img
            src={cert.image}
            alt=""
            loading="lazy"
            /* Warmed down at rest so the grid reads as one palette; the
               certificate returns to its true colours on hover. */
            className="h-full w-full object-cover object-top transition-[transform,filter] duration-500 ease-[var(--ease-out-soft)] [filter:sepia(0.42)_saturate(0.68)_contrast(1.02)_brightness(1.02)] group-hover:scale-[1.04] group-hover:[filter:none]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-bone to-sand/70 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]">
            <span className="display px-6 text-center text-xl leading-tight text-clay/70">
              {cert.title}
            </span>
          </div>
        )}

        {/* Wipe that sweeps across on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-bone/35 to-transparent transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-full"
        />

        {cert.badge ? (
          <span className="absolute right-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-bone backdrop-blur-sm">
            {cert.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="display text-lg leading-snug">{cert.title}</h3>

        <p
          className={`mt-1.5 text-sm ${
            pending ? 'italic text-ink-mute/60' : 'text-terracotta'
          }`}
        >
          {pending ? 'Issuer — to confirm' : cert.issuer}
        </p>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
          {cert.date}
        </p>

        <p className="mt-3 text-xs leading-relaxed text-ink-soft">{cert.meta}</p>

        <span className="mt-auto flex items-center gap-2 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute transition-colors duration-300 group-hover:text-terracotta">
          View certificate
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </button>
  );
}

export default function Credentials() {
  const scope = useReveal({ stagger: 0.06 });
  const [open, setOpen] = useState(null);

  return (
    <section
      id="credentials"
      ref={scope}
      className="scroll-mt-24 bg-surface/50 py-24 lg:py-36"
    >
      <div className="shell">
        <header
          data-reveal="up"
          className="mb-14 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="eyebrow mb-5">Credentials</p>
            <SplitHeading
              className="display max-w-xl text-4xl leading-[1.08] lg:text-5xl"
              lines={['Eight certifications,', 'all verifiable.']}
              italicLast
            />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-mute">
            Every card opens the original document — nothing here is a claim without a
            certificate behind it.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Card key={cert.title} cert={cert} onOpen={() => setOpen(i)} />
          ))}
        </div>
      </div>

      <Lightbox
        items={certificates}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </section>
  );
}
