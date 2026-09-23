# Rohit Pise — Portfolio

A single-page portfolio for Rohit Pise: data science and applied AI.
Warm ivory-and-terracotta palette, editorial typography, and a motion layer
built on GSAP + Lenis.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the built output
```

Requires Node 18 or newer.

## Where the content lives

Everything on the page — bio, projects, certifications, timeline, contact
details — comes from one file:

```
src/content/content.js
```

Edit a string there and it updates everywhere it appears. Anything still
marked `TODO:` is a value that needs filling in; the UI hides those fields
rather than displaying a placeholder, so nothing looks broken while they are
outstanding.

Currently outstanding:

- `profile.phone`, `profile.linkedin`
- `education[].period`, and the second (bachelor's) entry
- `projects[].links` — repository / live URLs for all three projects
- `profile.resumeUrl` — drop the CV at `public/assets/rohit-pise-resume.pdf`

## Structure

```
src/
├── App.jsx                 composition of the page
├── content/content.js      all copy and data
├── hooks/useMotion.js      Lenis smooth scroll, reveal + parallax helpers
├── styles/index.css        design tokens (Tailwind v4 @theme) and base styles
└── components/
    ├── Preloader.jsx       name + counter entrance
    ├── Cursor.jsx          custom cursor with magnetic hover states
    ├── Grain.jsx           film grain + vignette overlay
    ├── ShaderBackdrop.jsx  WebGL warm gradient behind the hero (OGL)
    ├── SplitHeading.jsx    per-word masked heading reveals
    ├── Magnetic.jsx        pulls a button toward the pointer
    ├── Nav.jsx             nav, scroll progress, mobile sheet
    ├── Hero.jsx            headline, portrait, optional background video
    ├── Marquee.jsx         scroll-velocity keyword band
    ├── Work.jsx            three projects with expandable detail
    ├── Approach.jsx        pinned, scroll-driven four-step section
    ├── About.jsx           bio, animated stats, skills, education
    ├── Journey.jsx         timeline with a self-drawing spine
    ├── Research.jsx        the SANMANTRANA 2026 paper
    ├── Credentials.jsx     certificate grid
    ├── Lightbox.jsx        in-page certificate viewer
    ├── Contact.jsx         services + contact details
    └── Footer.jsx
```

## Hero background video

The hero uses a WebGL gradient by default. To use a video instead, drop an
MP4 at:

```
public/assets/video/hero.mp4
```

It is picked up automatically, colour-graded warm to match the palette, and
falls back to the gradient if it fails to load.

## Accessibility and motion

The whole motion layer is disabled under `prefers-reduced-motion: reduce` —
no smooth scrolling, no preloader, no custom cursor, and every revealed
element renders in its final state. The page is fully readable and navigable
without any animation running.

## Deploying

A GitHub Actions workflow at `.github/workflows/deploy.yml` builds the site
and publishes it to GitHub Pages on every push to `main`. Enable it once
under **Settings → Pages → Source → GitHub Actions**.

`vite.config.js` sets `base: './'`, so the build works both at a domain root
and in a repository subpath — no change needed either way.
