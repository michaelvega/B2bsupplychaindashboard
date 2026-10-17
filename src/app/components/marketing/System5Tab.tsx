import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const SYSTEM5_URL = '/system5/system5-scroll.html';

/**
 * "Experience System 5" tab on the right edge of the screen.
 *
 * Two modes:
 * - anchored (landing hero): absolutely positioned inside the top hero
 *   section, so the whole composition scrolls away with the video.
 * - floating (other marketing pages): fixed to the viewport via a
 *   portal on document.body.
 *
 * Clicking sweeps a full-screen panel in from the right and then
 * navigates to the standalone System 5 demo page.
 */
export function System5Tab({ anchored = false }: { anchored?: boolean }) {
  const [sweeping, setSweeping] = useState(false);
  const [anchorY, setAnchorY] = useState<number | null>(null);

  // Anchored mode: keep the whole group shooting through the middle of
  // the word "transform" inside the hero's sub-line (#s5-anchor).
  useEffect(() => {
    if (!anchored) return;
    const measure = () => {
      const anchor = document.getElementById('s5-anchor');
      const hero = document.getElementById('top');
      if (!anchor || !hero) return;
      const h = hero.getBoundingClientRect();
      // Prefer the exact word "transform"; fall back to the paragraph center.
      const walker = document.createTreeWalker(anchor, NodeFilter.SHOW_TEXT);
      let node: Node | null = null;
      while ((node = walker.nextNode())) {
        const idx = (node.textContent || '').toLowerCase().indexOf('transform');
        if (idx >= 0) {
          const range = document.createRange();
          range.setStart(node, idx);
          range.setEnd(node, idx + 'transform'.length);
          const r = range.getBoundingClientRect();
          setAnchorY(r.top + r.height / 2 - h.top);
          return;
        }
      }
      const a = anchor.getBoundingClientRect();
      setAnchorY(a.top + a.height / 2 - h.top);
    };
    measure();
    const settle = window.setTimeout(measure, 900); // after fonts and images settle
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('resize', measure);
    };
  }, [anchored]);

  const openSystem5 = () => {
    if (sweeping) return;
    setSweeping(true);
    window.setTimeout(() => {
      window.location.href = SYSTEM5_URL;
    }, 750);
  };

  const pos = anchored ? 'absolute' : 'fixed';
  const beamTabTop = anchored ? { top: anchorY ?? 0 } : { marginTop: 36 };
  const aboveTop = anchored ? { top: (anchorY ?? 0) - 80 } : { top: 'calc(50% - 44px)' };
  const belowTop = anchored ? { top: (anchorY ?? 0) + 60 } : { top: 'calc(50% + 96px)' };
  const hidden = anchored && anchorY === null ? 'opacity-0' : '';
  const zGrad = anchored ? 'z-[46]' : 'z-[55]';
  const zBeam = anchored ? 'z-[46]' : 'z-[56]';
  const zArrows = anchored ? 'z-[51]' : 'z-[57]';
  const zTab = anchored ? 'z-[52]' : 'z-[58]';

  const content = (
    <>
      {/* Fade the backdrop to black around the tab */}
      <div
        className={`${pos} inset-y-0 right-0 ${zGrad} w-80 pointer-events-none bg-[linear-gradient(to_left,#0D0F0D_0%,rgba(13,15,13,0.88)_45%,transparent_100%)]`}
        aria-hidden
      />
      <div
        className={`${pos} right-0 top-1/2 -translate-y-1/2 ${zGrad} ${hidden} w-[340px] h-[440px] pointer-events-none bg-[radial-gradient(circle_at_100%_50%,#0D0F0D_0%,rgba(13,15,13,0.65)_45%,transparent_72%)]`}
        style={beamTabTop}
        aria-hidden
      />

      {/* Beam from the video into the tab, anchored to the text middle.
          Fades to transparent on the left to blend with the video laser. */}
      <svg
        className={`${pos} right-[60px] top-1/2 -translate-y-1/2 ${zBeam} ${hidden} w-[420px] h-[60px] pointer-events-none`}
        viewBox="0 0 420 60"
        fill="none"
        style={beamTabTop}
        aria-hidden
      >
        <defs>
          <linearGradient id="s5-fade" x1="0" y1="0" x2="408" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="s5-holo" x1="0" y1="0" x2="408" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#93A18A" stopOpacity="0" />
            <stop offset="0.28" stopColor="#93A18A" stopOpacity="0.75" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="0.72" stopColor="#93A18A" stopOpacity="0.75" />
            <stop offset="1" stopColor="#93A18A" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path className="s5-base" d="M0 30 H408" />
        <path className="s5-halo" d="M0 30 H408" />
        <path className="s5-holo" d="M0 30 H408" />
        <path className="s5-beam" d="M0 30 H408" />

        {/* Light dot traveling the line into the tab */}
        <circle id="s5-dot-halo" className="s5-dot-halo" r="6" fill="#FFFFFF" opacity="0.14" />
        <circle id="s5-dot" className="s5-dot" r="2.5" fill="#FFF8F3" />
        <animateMotion href="#s5-dot-halo" dur="1.6s" repeatCount="indefinite" path="M0 30 H408" />
        <animateMotion href="#s5-dot" dur="1.6s" repeatCount="indefinite" path="M0 30 H408" />

        <style>{`
          @keyframes s5Sweep { from { stroke-dashoffset: 620; } to { stroke-dashoffset: -130; } }
          .s5-base { stroke: url(#s5-fade); stroke-opacity: 0.16; stroke-width: 1; }
          .s5-halo {
            stroke: url(#s5-fade);
            stroke-opacity: 0.1;
            stroke-width: 8;
            filter: blur(5px);
            stroke-dasharray: 110 510;
            animation: s5Sweep 1.6s linear infinite;
          }
          .s5-holo {
            stroke: url(#s5-holo);
            stroke-width: 0.8;
            stroke-dasharray: 110 510;
            animation: s5Sweep 1.6s linear infinite;
          }
          .s5-beam {
            stroke: url(#s5-fade);
            stroke-opacity: 0.95;
            stroke-width: 1.5;
            stroke-dasharray: 110 510;
            animation: s5Sweep 1.6s linear infinite;
            filter: drop-shadow(0 0 6px rgba(255, 248, 243, 0.8));
          }
          .s5-dot { filter: drop-shadow(0 0 8px rgba(255, 248, 243, 0.9)); }
          .s5-dot-halo { filter: blur(2px); }
        `}</style>
      </svg>

      {/* Edge tab: floating vertical text, no box. The beam passes through
          its middle; generous padding = larger hit area. */}
      <button
        onClick={openSystem5}
        aria-label="Experience System 5"
        className={`group ${pos} right-0 top-1/2 -translate-y-1/2 ${zTab} ${hidden} px-3 py-8 cursor-pointer font-mono text-[10px] tracking-[0.25em] uppercase text-white/70 transition-colors`}
        style={{ writingMode: 'vertical-rl', ...beamTabTop }}
      >
        <span className="inline-block transition-all duration-200 group-hover:-translate-x-1 group-hover:text-term-300 group-hover:[text-shadow:0_0_14px_rgba(255,248,243,0.65)] group-active:translate-x-0 group-active:scale-95">
          Experience System 5
        </span>
      </button>

      {/* Above the text: moving white line, then two arrows pointing right */}
      <svg
        className={`${pos} right-[60px] ${zArrows} ${hidden} w-[190px] h-[24px] pointer-events-none`}
        style={aboveTop}
        viewBox="0 0 190 24"
        fill="none"
        aria-hidden
      >
        <path className="s5-under" d="M0 12 H150" />
        <path className="s5-arrow s5-arrow-1" d="M156 5 L168 12 L156 19" />
        <path className="s5-arrow s5-arrow-2" d="M168 5 L180 12 L168 19" />
      </svg>

      {/* Under the text: same line and arrows */}
      <svg
        className={`${pos} right-[60px] ${zArrows} ${hidden} w-[190px] h-[24px] pointer-events-none`}
        style={belowTop}
        viewBox="0 0 190 24"
        fill="none"
        aria-hidden
      >
        <path className="s5-under" d="M0 12 H150" />
        <path className="s5-arrow s5-arrow-1" d="M156 5 L168 12 L156 19" />
        <path className="s5-arrow s5-arrow-2" d="M168 5 L180 12 L168 19" />
        <style>{`
          @keyframes s5Under { from { stroke-dashoffset: 150; } to { stroke-dashoffset: 0; } }
          @keyframes s5ArrowPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
          .s5-under {
            stroke: #FFFFFF;
            stroke-opacity: 0.55;
            stroke-width: 1;
            stroke-dasharray: 40 110;
            animation: s5Under 1.2s linear infinite;
          }
          .s5-arrow {
            stroke: #FFFFFF;
            stroke-opacity: 0.7;
            stroke-width: 1;
            stroke-linecap: round;
            stroke-linejoin: round;
            animation: s5ArrowPulse 1.2s ease-in-out infinite;
          }
          .s5-arrow-2 { animation-delay: 0.2s; }
        `}</style>
      </svg>

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

  return anchored ? content : createPortal(content, document.body);
}
