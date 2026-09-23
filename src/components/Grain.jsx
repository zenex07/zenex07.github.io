/**
 * Film grain. A single tile of fractal noise, blended into the page and
 * nudged around in discrete steps so it flickers like real grain rather than
 * sliding like a texture. Pure CSS once painted — no per-frame JS.
 */
const NOISE =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

export default function Grain() {
  return (
    <>
      <style>{`
        @keyframes grain-shift {
          0%   { transform: translate3d(0, 0, 0); }
          10%  { transform: translate3d(-3%, -4%, 0); }
          20%  { transform: translate3d(-8%, 2%, 0); }
          30%  { transform: translate3d(3%, -8%, 0); }
          40%  { transform: translate3d(-2%, 9%, 0); }
          50%  { transform: translate3d(-6%, 3%, 0); }
          60%  { transform: translate3d(5%, 6%, 0); }
          70%  { transform: translate3d(-5%, 7%, 0); }
          80%  { transform: translate3d(4%, -5%, 0); }
          90%  { transform: translate3d(-1%, 4%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .grain-layer {
          position: fixed;
          top: -12%;
          left: -12%;
          width: 124%;
          height: 124%;
          pointer-events: none;
          z-index: 80;
          opacity: 0.32;
          mix-blend-mode: multiply;
          background-image: url("${NOISE}");
          background-repeat: repeat;
          animation: grain-shift 6s steps(10) infinite;
          will-change: transform;
        }
        /* A still grain still reads as paper; only the flicker is removed. */
        @media (prefers-reduced-motion: reduce) {
          .grain-layer { animation: none; opacity: 0.22; }
        }
      `}</style>
      <div className="grain-layer" aria-hidden="true" />
      {/* Warm vignette — keeps the eye centred without darkening the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[79]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(140, 106, 79, 0.10) 100%)',
        }}
      />
    </>
  );
}
