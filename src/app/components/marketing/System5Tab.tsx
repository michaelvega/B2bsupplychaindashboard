import { useState } from 'react';

const SYSTEM5_URL = '/system5/system5-scroll.html';

/**
 * Fixed tab on the right edge of the screen: "Experience System 5 >".
 * Clicking it sweeps a full-screen panel in from the right and then
 * navigates to the standalone System 5 demo page.
 */
export function System5Tab() {
  const [sweeping, setSweeping] = useState(false);

  const openSystem5 = () => {
    if (sweeping) return;
    setSweeping(true);
    window.setTimeout(() => {
      window.location.href = SYSTEM5_URL;
    }, 750);
  };

  return (
    <>
      {/* Edge tab, vertically set text */}
      <button
        onClick={openSystem5}
        aria-label="Experience System 5"
        className="group fixed right-0 top-1/2 -translate-y-1/2 z-[90] flex items-center gap-3 px-2.5 py-5 bg-ink-950/85 backdrop-blur-sm border border-white/[0.08] border-r-0 font-mono text-[10px] tracking-[0.25em] uppercase text-[#636363]/80 hover:text-term-300 hover:border-term-400/40 transition-colors"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="group-hover:-translate-y-0.5 transition-transform">→</span>
        <span>Experience System 5</span>
      </button>

      {/* Sweep panel: slides in from the right, then the page hands off */}
      <div
        aria-hidden={!sweeping}
        className={`fixed inset-0 z-[200] bg-ink-950 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] ${
          sweeping ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Black gradient emanating from the tab on the right edge */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,#000000_0%,rgba(13,15,13,0.75)_40%,rgba(13,15,13,0.25)_75%,transparent_100%)]" />

        {/* Rotating light beam sweeping the corners */}
        <div className="absolute inset-0 animate-[spin_1.8s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(123,137,111,0.16)_22deg,transparent_60deg,transparent_180deg,rgba(123,137,111,0.16)_202deg,transparent_240deg)]" />

        {/* Corner lights */}
        <span className="absolute top-6 left-6 w-8 h-8 border-t border-l border-term-400/80 animate-pulse" />
        <span className="absolute top-6 right-6 w-8 h-8 border-t border-r border-term-400/80 animate-pulse [animation-delay:0.45s]" />
        <span className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-term-400/80 animate-pulse [animation-delay:0.9s]" />
        <span className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-term-400/80 animate-pulse [animation-delay:1.35s]" />

        <div className="relative flex flex-col items-center gap-4">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400">Procept</p>
          <p className="font-display font-semibold uppercase tracking-tight text-white text-2xl md:text-4xl">
            Entering System <span className="text-term-400">5</span>
          </p>
          <div className="w-40 h-px bg-white/10 relative overflow-hidden mt-2">
            <div className="absolute inset-y-0 left-0 w-full bg-term-400 animate-[sweep_0.7s_ease-in-out_forwards]" />
          </div>
          <style>{`@keyframes sweep { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        </div>
      </div>
    </>
  );
}
