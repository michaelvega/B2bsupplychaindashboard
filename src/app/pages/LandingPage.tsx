import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav, scrollToSection } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { SectionHeading } from '../components/marketing/SectionHeading';
import { FigurePanel } from '../components/marketing/FigurePanel';
import { NetworkBackdrop } from '../components/marketing/NetworkBackdrop';
import { CursorGfx } from '../components/marketing/CursorGfx';
import { CodeBackdrop } from '../components/marketing/CodeBackdrop';
import { Stat } from '../components/marketing/Stat';
import { Reveal } from '../components/marketing/Reveal';
import { cn } from '../components/ui/utils';

const HERO_VIDEO = '/city%20video.mp4';

interface StackStage {
  fig: string;
  caption: string;
  num: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  image?: string;
  imageClass?: string;
  fadeBottom?: boolean;
}

/** The RSI loop, in four stages. Prime Intellect-style numbered figures. */
const STACK_STAGES: StackStage[] = [
  {
    fig: '1',
    caption: 'DATA GENERATION',
    num: '01',
    title: 'Human-review-level data, for any task',
    image: '/inspo/hands.png',
    desc: 'We automatically generate human-reviewed-level data for any task, connected straight to your data sources.',
    bullets: [
      'Human-review-level quality, generated automatically',
      'Connect your data sources, we handle the ingestion',
      'Your workflows, not scraped benchmarks',
    ],
    cta: 'Generate Data',
  },
  {
    fig: '2',
    caption: 'CONTAINERIZED RSI',
    num: '02',
    title: 'Your RSI model, containerized',
    image: '/inspo/squares.png',
    desc: 'We containerize your RSI model so it trains for a specific task. In your stack, owned by you.',
    bullets: [
      'One container per task',
      'Trains for the specific task you hand it',
      'Recursive self-improvement, guaranteed convergence',
    ],
    cta: 'Train a Model',
  },
  {
    fig: '3',
    caption: 'DEDICATED INFERENCE',
    num: '03',
    title: 'Dedicated inference',
    desc: 'We broker the cheapest GPUs for you at that moment. Dedicated inference, no GPU surfing.',
    bullets: [
      'Cheapest GPUs, brokered in real time',
      'Dedicated capacity. Nothing shared',
      'One contract, complete transparency',
    ],
    cta: 'Find GPUs',
    image: '/inspo/gpu.png',
  },
  {
    fig: '4',
    caption: 'EVALUATIONS',
    num: '04',
    title: 'Watch it self-improve',
    image: '/inspo/summit.png',
    imageClass: 'object-[50%_20%]',
    fadeBottom: true,
    desc: 'Evaluations that measure what matters. Watch your model train and self-improve over time.',
    bullets: [
      'Live eval scores, loop by loop',
      'Business outcomes, not vanity benchmarks',
      'ROI measured against your incumbents',
    ],
    cta: 'Run Evals',
  },
];

/** Serif-italic accent word inside display headlines. */
function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif italic font-normal">{children}</em>;
}

/**
 * One problem slide. The header label and the stats crossfade between the
 * market's current multi-agent economics (THE PROBLEM) and Procept's
 * numbers (THE SOLUTION). Both phases stay mounted and stack on the same
 * grid cell so the block sizes to the taller phase; opacity swaps every 5s.
 */
function ProblemSlide() {
  const [phase, setPhase] = useState<'problem' | 'solution'>('problem');

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p === 'problem' ? 'solution' : 'problem')), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative border border-white/[0.08] bg-ink-950">
      <div className="flex items-baseline justify-between border-b border-white/[0.06] px-5 py-2.5">
        {/* Header label rotates with the phase */}
        <div className="grid">
          <span
            aria-hidden={phase !== 'problem'}
            className={cn(
              'col-start-1 row-start-1 font-mono text-[10px] tracking-[0.2em] text-term-400 transition-all duration-700',
              phase === 'problem' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
            )}
          >
            THE PROBLEM
          </span>
          <span
            aria-hidden={phase !== 'solution'}
            className={cn(
              'col-start-1 row-start-1 font-mono text-[10px] tracking-[0.2em] text-term-400 transition-all duration-700',
              phase === 'solution' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
            )}
          >
            THE SOLUTION
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">MULTI-AGENT ECONOMICS</span>
      </div>

      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <p className="text-2xl md:text-4xl font-light text-white tracking-tight leading-tight">
          Gain the benefits of <Em>self hosting</Em>, with none of the challenges/engineering overhead.
        </p>

        <div className="grid">
          {/* Market today */}
          <div
            aria-hidden={phase !== 'problem'}
            className={cn(
              'col-start-1 row-start-1 transition-all duration-700',
              phase === 'problem' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            )}
          >
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">
              Multi-agent systems, currently
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Stat value="15-150x" label="the cost. More expensive to run while consistently underperforming." />
              <Stat value="4-220x" label="the tokens consumed compared to single-agent systems." />
            </div>
          </div>

          {/* With Procept */}
          <div
            aria-hidden={phase !== 'solution'}
            className={cn(
              'col-start-1 row-start-1 transition-all duration-700',
              phase === 'solution' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            )}
          >
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-term-400 mb-4">With Procept</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Stat value="96%" label="cheaper than public API providers." />
              <Stat value="95%" label="our ARC-AGI 3 score. We are 65% better than Claude, which scored 30%." />
              <div className="sm:col-span-2">
                <Stat value="3% the size" label="still more intelligent." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** HUD corner brackets for the hero frame. */
function CornerBrackets() {
  const corners = [
    'top-0 left-0 border-t border-l',
    'top-0 right-0 border-t border-r',
    'bottom-0 left-0 border-b border-l',
    'bottom-0 right-0 border-b border-r',
  ] as const;
  return (
    <>
      {corners.map((pos) => (
        <span key={pos} className={cn('absolute w-6 h-6 md:w-8 md:h-8 border-term-400/60 pointer-events-none', pos)} />
      ))}
    </>
  );
}

export function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-ink-950" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>

      <CodeBackdrop />
      <CursorGfx />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* ═══════════════ NAV ═══════════════ */}
      <MarketingNav onRequestAccess={() => setDemoOpen(true)} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="top" className="relative min-h-[calc(100vh+3.5rem)] -mt-14 w-full overflow-hidden bg-transparent flex flex-col">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-65">
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-60" />

        <div className="relative z-50 flex-1 flex flex-col justify-center px-6 md:px-16 py-16">
          <CornerBrackets />
          <div className="max-w-6xl mx-auto w-full">
            <div>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/50 mb-8">Procept Technologies Corp.</p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.05] mb-8 max-w-4xl">
                Driving the world's transition to <Em>AGI</Em><span className="text-term-400">.</span>
              </h1>

              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
                We make frontier intelligence effortless to deploy and transform breakthrough research into industry
                value.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setDemoOpen(true)}
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-ink-950 font-mono text-xs tracking-[0.15em] uppercase font-medium hover:bg-term-300 transition-all"
                >
                  Request Access
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('stack')}
                  className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-mono text-xs tracking-[0.15em] uppercase hover:border-term-400/60 hover:text-term-300 transition-all"
                >
                  See the Stack
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Backed by */}
              <div className="relative inline-flex items-center px-8 py-3 border border-white/15 mt-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <span className="relative font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-white/60">
                  Backed by Georgia Tech <span className="text-white/25">|</span> NVIDIA
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════ 01 / STACK ═══════════════ */}
      <section id="stack" className="relative bg-ink-950 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06] overflow-hidden">
        <NetworkBackdrop />
        <div className="relative z-50 max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              num="01"
              label="Stack"
              title={<>One stack. Four <Em>stages</Em>.</>}
              sub="The RSI loop, end to end: data, training, inference, evaluation. Every stage fully maintained by Procept, on your stack."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            {STACK_STAGES.map((stage, i) => (
              <Reveal key={stage.fig} delay={(i % 2) * 100}>
                <FigurePanel fig={stage.fig} caption={stage.caption} image={stage.image} imageClass={stage.imageClass} fadeBottom={stage.fadeBottom} className="h-full">
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="font-mono text-2xl font-medium text-term-400 tabular-nums">{stage.num}</span>
                    <h3 className="text-xl font-light text-white tracking-tight">{stage.title}</h3>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-5">{stage.desc}</p>
                  <ul className="space-y-2 mb-7">
                    {stage.bullets.map((bullet, j) => (
                      <li key={j} className="font-mono text-[12px] text-white/50 leading-relaxed">
                        <span className="text-term-500 mr-2">{stage.num.replace(/^0/, '')}.{j + 1}</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase text-white hover:border-term-400/60 hover:text-term-300 transition-all"
                  >
                    {stage.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </FigurePanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROBLEM SLIDE ═══════════════ */}
      <section id="problem" className="relative bg-ink-900 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06] overflow-hidden">
        {/* Rotated strings image as the section backdrop, above the code layer */}
        <div className="absolute inset-0 z-[45] pointer-events-none flex items-center justify-center">
          <img
            src="/inspo/strings-rotated.png"
            alt=""
            className="max-h-full max-w-full object-contain grayscale opacity-45"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0A0A0A_90%)]" />
        </div>
        <div className="relative z-50 max-w-6xl mx-auto">
          <Reveal>
            <ProblemSlide />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 04 / HARNESS ═══════════════ */}
      <section id="harness" className="relative overflow-hidden bg-ink-950 border-t border-white/[0.06]">
        {/* Wires image behind the section content, above the code layer; pushed left, fading out on the right */}
        <div className="absolute inset-0 z-[45] pointer-events-none flex items-center justify-start">
          <img src="/inspo/wires.png" alt="" className="max-h-full max-w-full object-contain grayscale opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_55%,#050505_100%)]" />
        </div>
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-32 md:py-44">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <SectionHeading
                title={<>Recursive. Convergent. <Em>Yours</Em>.</>}
              />
            </Reveal>
            <Reveal delay={150}>
              <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
                The model trains on your workflows, not a generic benchmark. And it doesn't stop at deployment. It
                keeps improving inside your stack, owned by you.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section id="access" className="relative overflow-hidden bg-ink-950 border-t border-white/[0.06] min-h-[85vh] md:min-h-[90vh] flex flex-col">
        {/* Mountain image anchored to the bottom; its black sky melts into the section */}
        <div className="absolute inset-x-0 bottom-0 z-[45] pointer-events-none">
          <img
            src="/inspo/mountain_high.png"
            alt=""
            className="w-full h-[52vh] md:h-[62vh] object-cover object-center opacity-90"
          />
          <div className="absolute inset-x-0 top-0 h-24 md:h-36 bg-gradient-to-b from-ink-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>

        {/* Text block, top left */}
        <div className="relative z-50 max-w-6xl mx-auto w-full px-6 md:px-16 pt-32 md:pt-44 pb-44 md:pb-56">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-5">Access</p>
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-[1.1] mb-6 max-w-2xl">
              Provision your <Em>journey</Em><span className="text-term-400">.</span>
            </h2>
            <p className="text-sm text-white/30">
              Flat linear rate. Self-hosted. Fully maintained by Procept.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <MarketingFooter onNavigate={scrollToSection} />
    </div>
  );
}
