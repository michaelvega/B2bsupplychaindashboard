import { useState } from 'react';
import type { ReactNode } from 'react';
import { DemoModal } from './DemoModal';
import { MarketingFooter } from './MarketingFooter';
import { MarketingNav } from './MarketingNav';

/** Shared chrome for all legal pages: landing toolbar, title block, metadata grid, footer. */
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
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-ink-950 text-white" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      {/* Toolbar, same as the landing page; logo links home */}
      <MarketingNav onRequestAccess={() => setDemoOpen(true)} logoTo="/" />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

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
