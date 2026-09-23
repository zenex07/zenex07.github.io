import { profile } from '../content/content.js';
import { scrollToSection } from '../hooks/useMotion.js';

export default function Footer() {
  return (
    <footer className="bg-ink pb-10 text-ivory/40">
      <div className="shell">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ivory/12 pt-8 font-mono text-[10px] uppercase tracking-[0.16em]">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>

          <button
            type="button"
            onClick={() => scrollToSection('#top')}
            data-cursor="top"
            className="link-wipe text-ivory/60 hover:text-ember"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
