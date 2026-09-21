import { Link } from 'react-router';

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/** Top toolbar: logo far left, Docs/Blog + outline CTA far right. Superimposed on the hero on the landing page. */
export function MarketingNav({
  onRequestAccess,
  logoTo,
}: {
  onRequestAccess: () => void;
  /** When set, the logo links to this route instead of scrolling to the hero. */
  logoTo?: string;
}) {
  return (
    <div className="sticky top-0 z-[60]">
      <div className="h-14 flex items-center justify-between px-6 md:px-10">
        {logoTo ? (
          <Link to={logoTo} className="flex items-center gap-2.5 shrink-0">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-sm object-cover ring-1 ring-white/20" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/80 font-medium">Procept</span>
          </Link>
        ) : (
          <button onClick={() => scrollToSection('top')} className="flex items-center gap-2.5 shrink-0">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-sm object-cover ring-1 ring-white/20" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/80 font-medium">Procept</span>
          </button>
        )}

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              Docs
            </a>
            <Link
              to="/plans"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              Plans
            </Link>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              Blog
            </a>
          </nav>

          <button
            onClick={onRequestAccess}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 border border-white/25 bg-white/[0.06] text-white font-mono text-[10px] tracking-[0.15em] uppercase hover:border-term-400/60 hover:text-term-300 transition-all"
          >
            Request Access <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
