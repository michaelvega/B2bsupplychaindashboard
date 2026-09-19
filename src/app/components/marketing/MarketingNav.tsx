const NAV_ITEMS = [
  { id: 'thesis', num: '01', label: 'THESIS' },
  { id: 'problem', num: '02', label: 'PROBLEM' },
  { id: 'stack', num: '03', label: 'STACK' },
  { id: 'harness', num: '04', label: 'HARNESS' },
  { id: 'metrics', num: '05', label: 'METRICS' },
];

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function MarketingNav({ onRequestAccess }: { onRequestAccess: () => void }) {
  return (
    <div className="sticky top-0 z-50">
      {/* Announcement strip */}
      <div className="bg-term-950 border-b border-term-400/20">
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-2 flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-wider text-term-300">
          <span className="w-1.5 h-1.5 rounded-full bg-term-400 animate-pulse shadow-[0_0_12px_rgba(51,255,153,0.6)] shrink-0" />
          <span className="truncate">SYS.NOTE ▸ Per-token billing retired. Procept operates at one flat linear rate.</span>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-4 flex items-center justify-between gap-6">
          <button onClick={() => scrollToSection('top')} className="flex items-center gap-3 shrink-0">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-7 h-7 rounded-sm object-cover ring-1 ring-white/20" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/80 font-medium">Procept</span>
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-mono text-xs tracking-wider text-white/50 hover:text-white transition-colors"
              >
                <span className="text-term-400 mr-1.5">{item.num}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={onRequestAccess}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-ink-950 font-mono text-xs tracking-[0.15em] uppercase font-medium hover:bg-term-300 transition-all"
          >
            Request Access <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
