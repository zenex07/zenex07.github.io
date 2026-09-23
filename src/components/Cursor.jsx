import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useMotion.js';

/**
 * Two-part cursor: a small solid dot that tracks the pointer exactly, and a
 * larger ring that eases behind it. Hovering anything with [data-cursor]
 * expands the ring and can swap in a short label.
 *
 * Fine pointers only — touch devices keep their native behaviour and the
 * component renders nothing.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return undefined;

    document.body.classList.add('has-custom-cursor');

    // Start off-screen so the cursor does not flash at 0,0 on load.
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let raf = 0;
    let magnet = null;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      const hit = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;

      if (hit !== magnet) {
        magnet = hit;
        const text = hit?.dataset.cursor || '';
        targetScale = hit ? (text ? 2.6 : 1.9) : 1;
        if (label) {
          label.textContent = text;
          label.style.opacity = text ? '1' : '0';
        }
        ring.dataset.active = hit ? 'true' : 'false';
      }
    };

    const onDown = () => {
      targetScale *= 0.82;
    };
    const onUp = () => {
      targetScale = magnet ? (magnet.dataset.cursor ? 2.6 : 1.9) : 1;
    };
    const onLeave = () => {
      pos.x = -100;
      pos.y = -100;
    };

    const tick = () => {
      // Ring eases toward the pointer; the dot snaps to it.
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      scale += (targetScale - scale) * 0.14;

      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden [@media(pointer:fine)]:block">
      <div
        ref={ringRef}
        data-active="false"
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-terracotta/45 bg-terracotta/[0.06] backdrop-blur-[1px] transition-colors duration-300 data-[active=true]:border-terracotta/70 data-[active=true]:bg-terracotta/[0.1]"
      >
        <span
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center font-mono text-[4.5px] uppercase tracking-[0.16em] text-terracotta opacity-0 transition-opacity duration-200"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-[5px] w-[5px] rounded-full bg-terracotta"
      />
    </div>
  );
}
