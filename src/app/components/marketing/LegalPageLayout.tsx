import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { MarketingFooter } from './MarketingFooter';

/** Shared chrome for all legal pages: sticky header, title block, metadata grid, footer. */
export function LegalPageLayout({
  docId,
  title,
  subtitle,
  meta,
  wide = false,
  children,
}: {
  docId: string;
  title: ReactNode;
  subtitle: string;
  meta: { label: string; value: string }[];
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-ink-950 text-white" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-ink-950/80 backdrop-blur-xl z-50">
        <div className={`mx-auto px-6 py-6 flex items-center justify-between ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-term-300 transition-colors font-mono text-xs tracking-[0.2em] uppercase">
            <ArrowLeft className="w-4 h-4" />
            00 / Home
          </Link>
          <div className="flex items-center gap-3">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-sm opacity-70" />
            <span className="text-white/40 font-mono text-xs tracking-[0.2em] uppercase hidden sm:inline">Procept Technologies Corp.</span>
          </div>
          <span className="font-mono text-xs tracking-[0.2em] text-term-400 uppercase hidden md:inline">DOC://{docId}</span>
        </div>
      </header>

      {/* Content */}
      <main className={`mx-auto px-6 py-16 ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>
        <div className="mb-12">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-5">DOC // {docId}</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">{title}</h1>
          <p className="text-white/30 font-mono text-xs tracking-wider">{subtitle}</p>
        </div>

        {/* Metadata block */}
        <div className="border border-white/[0.08] bg-ink-800 p-6 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {meta.map(item => (
            <div key={item.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-term-400 mb-1.5">{item.label}</p>
              <p className="text-sm text-white/70 leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        {children}
      </main>

      <MarketingFooter />
    </div>
  );
}
