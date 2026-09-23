import { useState } from 'react';
import { projects } from '../content/content.js';
import { useReveal } from '../hooks/useMotion.js';
import SplitHeading from './SplitHeading.jsx';

/**
 * Accent-driven decorative panel. These are abstract by design — a fake
 * screenshot would misrepresent the work, so each project gets a woven
 * gradient in its own accent instead.
 */
const PANELS = {
  terracotta: {
    base: 'linear-gradient(145deg, #c96a3e 0%, #b4552f 48%, #8c3f22 100%)',
    ink: '#fbf8f3',
  },
  clay: {
    base: 'linear-gradient(145deg, #a08161 0%, #8c6a4f 50%, #6b4f39 100%)',
    ink: '#fbf8f3',
  },
  olive: {
    base: 'linear-gradient(145deg, #878b69 0%, #6f7355 52%, #545840 100%)',
    ink: '#fbf8f3',
  },
};

function ProjectPanel({ accent, index, title }) {
  const palette = PANELS[accent] || PANELS.terracotta;
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line/60 transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.015]"
      style={{ background: palette.base }}
      aria-hidden="true"
    >
      {/* Concentric arcs — a quiet, printed-pattern feel. */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.20]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <circle
            key={i}
            cx="320"
            cy="250"
            r={34 + i * 34}
            fill="none"
            stroke={palette.ink}
            strokeWidth="1"
          />
        ))}
      </svg>
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: `repeating-linear-gradient(115deg, ${palette.ink} 0 1px, transparent 1px 13px)`,
        }}
      />
      <span
        className="display absolute bottom-4 left-6 text-[5.5rem] leading-none opacity-[0.22]"
        style={{ color: palette.ink }}
      >
        {index}
      </span>
      <span
        className="absolute left-6 top-5 font-mono text-[10px] uppercase tracking-[0.2em] opacity-70"
        style={{ color: palette.ink }}
      >
        {title}
      </span>
    </div>
  );
}

function Project({ project, flip }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      data-reveal="up"
      className="group grid items-center gap-8 border-t border-line/60 py-14 lg:grid-cols-12 lg:gap-14 lg:py-20"
    >
      <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
        <ProjectPanel accent={project.accent} index={project.index} title={project.title} />
      </div>

      <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
        <div className="mb-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          <span className="text-terracotta">{project.index}</span>
          <span className="h-px w-8 bg-line" />
          <span>{project.year}</span>
          <span className="h-px w-8 bg-line" />
          <span>{project.role}</span>
        </div>

        <h3 className="display text-4xl lg:text-5xl">{project.title}</h3>
        <p className="mt-2 text-lg italic text-clay">{project.subtitle}</p>

        <p className="mt-5 max-w-xl text-pretty leading-relaxed text-ink-soft">
          {project.summary}
        </p>

        {/* Detail drawer — keeps the page scannable but the depth available. */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-600 ease-[var(--ease-out-soft)]"
          style={{
            gridTemplateRows: open ? '1fr' : '0fr',
            opacity: open ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ink-soft">
              {project.detail}
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            data-cursor=""
            aria-expanded={open}
            className="link-wipe font-mono text-[11px] uppercase tracking-[0.16em] text-ink"
          >
            {open ? 'Close' : 'Read more'}
          </button>

          {/* A link with no URL yet is hidden rather than shown disabled —
              a visible dead link reads worse than no link at all. */}
          {project.links.map((link) => {
            if (link.href === '#') return null;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="open"
                className="link-wipe font-mono text-[11px] uppercase tracking-[0.16em] text-terracotta"
              >
                {link.label} ↗
              </a>
            );
          })}
        </div>

        <ul className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line/80 bg-bone/60 px-3 py-1 font-mono text-[10px] tracking-wide text-ink-soft"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Work() {
  const scope = useReveal();

  return (
    <section id="work" ref={scope} className="shell scroll-mt-24 py-24 lg:py-36">
      <header data-reveal="up" className="mb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-5">Selected work</p>
          <SplitHeading
            className="display max-w-2xl text-4xl leading-[1.08] lg:text-6xl"
            lines={['Three things I built,', 'start to finish.']}
            italicLast
          />
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-ink-mute">
          Each one shipped — trained, tested and deployed, not left in a notebook.
        </p>
      </header>

      {projects.map((project, i) => (
        <Project key={project.title} project={project} flip={i % 2 === 1} />
      ))}
    </section>
  );
}
