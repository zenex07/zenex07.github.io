import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import { prefersReducedMotion } from '../hooks/useMotion.js';

/**
 * A slow warm gradient mesh behind the hero. Two layers of value noise are
 * warped against each other and mapped onto the ivory/terracotta ramp, so it
 * reads as light moving over paper rather than a "WebGL demo".
 *
 * Deliberately low contrast and low speed — it should be noticed second, not
 * first. Falls back to a static CSS gradient when reduced motion is set or
 * WebGL is unavailable.
 */

const VERT = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uPointer;
varying vec2  vUv;

// Warm palette, sampled from the site's design tokens.
const vec3 IVORY      = vec3(0.969, 0.945, 0.910);
const vec3 SAND       = vec3(0.890, 0.835, 0.765);
const vec3 TERRACOTTA = vec3(0.706, 0.333, 0.184);
const vec3 CLAY       = vec3(0.549, 0.416, 0.310);

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.045;

  // Domain warp: noise offsetting the lookup of more noise.
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(4.7, -t)));
  vec2 r = vec2(fbm(p * 1.9 + q * 1.4 + vec2(1.7, 9.2) + t * 0.6),
                fbm(p * 1.9 + q * 1.4 + vec2(8.3, 2.8) - t * 0.4));

  float field = fbm(p * 2.1 + r * 1.1);
  field = field * 0.5 + 0.5;

  // A soft warm pool that drifts toward the pointer.
  vec2 pointer = vec2(uPointer.x * aspect, uPointer.y);
  float glow = 1.0 - smoothstep(0.0, 0.85, distance(p, pointer));
  field += glow * 0.16;

  // Map the field onto the ramp: paper -> sand -> clay -> a hint of terracotta.
  vec3 col = mix(IVORY, SAND, smoothstep(0.30, 0.72, field));
  col = mix(col, CLAY, smoothstep(0.62, 0.95, field) * 0.34);
  col = mix(col, TERRACOTTA, smoothstep(0.80, 1.05, field + r.x * 0.12) * 0.20);

  // Lift the top of the frame so the hero text always has clean paper under it.
  col = mix(col, IVORY, smoothstep(0.45, 0.0, uv.y) * 0.55);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function ShaderBackdrop({ className = '' }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion()) return undefined;

    let renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.6),
      });
    } catch {
      return undefined; // No WebGL — the CSS gradient underneath stands in.
    }

    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    host.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uPointer: { value: new Vec2(0.5, 0.55) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w || 1, h || 1);
      program.uniforms.uResolution.value.set(w || 1, h || 1);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Pointer eased in shader space (y flipped to match GL coordinates).
    const target = { x: 0.5, y: 0.55 };
    const onMove = (e) => {
      const rect = host.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      target.y = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // Pause when scrolled away — no reason to burn frames off-screen.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(host);

    let raf = 0;
    const start = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      const u = program.uniforms.uPointer.value;
      u.x += (target.x - u.x) * 0.035;
      u.y += (target.y - u.y) * 0.035;

      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      io.disconnect();
      gl.canvas.remove();
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(165deg, #f7f1e8 0%, #f2e9dc 45%, #e3d5c3 78%, #d9c6ae 100%)',
      }}
    />
  );
}
