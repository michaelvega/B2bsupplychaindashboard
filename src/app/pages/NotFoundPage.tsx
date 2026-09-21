import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { CursorGfx } from '../components/marketing/CursorGfx';

/** Serif-italic accent word inside display headlines. */
function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif italic font-normal">{children}</em>;
}

/** 404: the hole image with sides gradient-faded, mono label, link home. */
export function NotFoundPage() {
  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-ink-950" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      <CursorGfx />

      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Hole image, centered; sides gradient-faded into black */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src="/hole.png"
            alt=""
            className="h-[72vh] w-auto object-contain brightness-125"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)',
            }}
          />
        </div>

        <div className="relative z-50 flex-1 flex flex-col justify-center px-6 md:px-16 max-w-6xl mx-auto w-full">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-6">404 // Not Found</p>
          <h1 className="text-6xl md:text-8xl font-light text-white tracking-tight leading-[1.02] mb-8">
            Not <Em>found</Em>.
          </h1>
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/40 leading-relaxed mb-10">
            // the path you requested is not in the stack.
          </p>
          <Link
            to="/"
            className="group inline-flex items-center gap-3 w-fit border border-white/15 px-8 py-4 font-mono text-xs tracking-[0.15em] uppercase text-white hover:border-term-400/60 hover:text-term-300 transition-all"
          >
            00 / Home
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
