import { cloneElement, useEffect, useRef } from 'react';
import { MOTION, prefersReducedMotion } from '../hooks/useMotion.js';

/**
 * Pulls its child toward the pointer while the pointer is nearby, then
 * releases it with a soft spring. `strength` is how far it travels as a
 * fraction of the pointer's offset from centre; `padding` widens the
 * hit area beyond the element's own box.
 */
export default function Magnetic({ children, strength = 0.32, padding = 24 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = 0;
    let active = false;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const within =
        e.clientX >= r.left - padding &&
        e.clientX <= r.right + padding &&
        e.clientY >= r.top - padding &&
        e.clientY <= r.bottom + padding;

      if (within) {
        target.x = (e.clientX - cx) * strength;
        target.y = (e.clientY - cy) * strength;
        if (!active) {
          active = true;
          raf = raf || requestAnimationFrame(tick);
        }
      } else if (active) {
        target.x = 0;
        target.y = 0;
      }
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * MOTION.pointer.magnetLerp;
      pos.y += (target.y - pos.y) * MOTION.pointer.magnetLerp;
      el.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`;

      const settled =
        Math.abs(pos.x - target.x) < 0.05 && Math.abs(pos.y - target.y) < 0.05;
      if (settled && target.x === 0 && target.y === 0) {
        el.style.transform = '';
        active = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [strength, padding]);

  return cloneElement(children, { ref });
}
