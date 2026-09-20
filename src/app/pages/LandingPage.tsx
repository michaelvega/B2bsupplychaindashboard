import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav, scrollToSection } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { SectionHeading } from '../components/marketing/SectionHeading';
import { FigurePanel } from '../components/marketing/FigurePanel';
import { TerminalBlock } from '../components/marketing/TerminalBlock';
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
    image: '/inspo%20pics/hands.png',
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
    image: '/inspo%20pics/squares.png',
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
    image: '/inspo%20pics/gpu.png',
  },
  {
    fig: '4',
    caption: 'EVALUATIONS',
    num: '04',
    title: 'Watch it self-improve',
    image: '/inspo%20pics/summit.png',
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

const BUILD_ISSUES = [
  { title: 'Zero ROI', text: 'Tech teams often lack specialized skills to properly train models and manage architecture, and see no ROI from self-hosting.' },
  { title: 'Open Burden', text: 'There is a market gap in connecting open-source models with GPU hardware, so teams must procure individually.' },
  { title: 'Custom Architecture', text: 'In-house infrastructure risks massive capital overhead and talent scarcity.' },
];

const RENT_ISSUES = [
  { title: 'Exponential Costs', text: 'Charged by the token; scales poorly for massive multi-agent workloads.' },
  { title: 'Zero Control', text: 'Surrender system visibility, diagnostics, and data pipelines to external vendors.' },
  { title: 'Glue Code', text: 'Connect a bunch of pieces with fragile APIs and rigid models.' },
];

/** Mono checklist row with green square bullets. */
function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-white/60">
          <span className="w-2 h-2 bg-term-400/80 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
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

      {/* ═══════════════ STATS / FIELD DATA ═══════════════ */}
      <section id="field-data" className="relative bg-ink-950 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06] overflow-hidden">
        <div className="relative z-50 max-w-6xl mx-auto">
          {/* Poster: figure left, title inline to its right, stats around it */}
          <div className="relative lg:h-[680px]">
            {/* Top label */}
            <Reveal delay={100} className="hidden lg:block lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-0">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-term-400">No more token-based billing</p>
            </Reveal>

            {/* Vertical gradient hairlines */}
            <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-term-400/50 to-transparent" />
            <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-term-400/50 to-transparent" />

            {/* Figure, left side, cutout flush against the edge */}
            <div className="relative w-fit self-start lg:absolute lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:self-auto">
              <img
                src="/inspo%20pics/image%20copy.png"
                alt="Procept figure"
                className="relative w-64 md:w-72 lg:w-[22rem]"
              />
              {/* Fade the top and bottom edges into black */}
              <div className="absolute inset-x-0 top-0 h-24 md:h-28 bg-gradient-to-b from-ink-950 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-24 md:h-28 bg-gradient-to-t from-ink-950 to-transparent" />
            </div>

            {/* Text structured around the figure */}
            <div className="relative mt-10 flex flex-col items-center gap-8 lg:mt-0 lg:absolute lg:inset-0 lg:block">
              <Reveal delay={0} className="w-full lg:w-auto lg:absolute lg:left-[26rem] lg:right-8 lg:top-1/2 lg:-translate-y-1/2">
                <h2 className="text-2xl md:text-4xl font-light text-white tracking-tight leading-tight max-w-xl">
                  The world of multi-agents demands charges based on business outcomes, not model usage.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                  <Stat value="96%" label="cheaper than public API providers." />
                  <Stat value="95%" label="our ARC-AGI 3 score. We are 65% better than Claude, which scored 30%." />
                  <Stat value="10x" label="smaller and still more intelligent." />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MARKET ═══════════════ */}
      <section className="relative bg-ink-900 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06] overflow-hidden">
        {/* Rotated strings image as the section backdrop, above the code layer */}
        <div className="absolute inset-0 z-[45] pointer-events-none flex items-center justify-center">
          <img
            src="/inspo%20pics/strings-rotated.png"
            alt=""
            className="max-h-full max-w-full object-contain grayscale opacity-45"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0A0A0A_90%)]" />
        </div>
        <div className="relative z-50 max-w-6xl mx-auto">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-5">The agentic AI market</p>
            <h2 className="text-2xl md:text-4xl font-light text-white tracking-tight leading-tight max-w-3xl">
              Build your own, or <Em>rent</Em> someone else's.
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
              But companies lack the ability to properly build multi-agent architecture and train models, resulting
              in agent failures, exponential costs, unnecessary hiring, and wasted engineering resources.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-14">
            {/* Build your own */}
            <Reveal delay={0}>
              <div className="relative border border-white/[0.08] bg-ink-950 h-full">
                <div className="flex items-baseline justify-between border-b border-white/[0.06] px-5 py-2.5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-term-400">19% OF COMPANIES</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">BUILD YOUR OWN</span>
                </div>
                <div className="p-6">
                  <p className="text-sm text-white/50 leading-relaxed mb-6">
                    Source GPUs + train your own models + manage architecture + continue to upgrade when new models
                    come out + run evaluations.
                  </p>
                  <div className="space-y-5">
                    {BUILD_ISSUES.map((issue) => (
                      <div key={issue.title}>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-term-400 mb-1.5">{issue.title}</p>
                        <p className="text-sm text-white/50 leading-relaxed">{issue.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Rent models */}
            <Reveal delay={100}>
              <div className="relative border border-white/[0.08] bg-ink-950 h-full">
                <div className="flex items-baseline justify-between border-b border-white/[0.06] px-5 py-2.5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-term-400">81% OF COMPANIES</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">RENT MODELS</span>
                </div>
                <div className="p-6">
                  <p className="text-sm text-white/50 leading-relaxed mb-6">
                    Using commercial AI platforms (OpenAI, Claude) to run complex operations.
                  </p>
                  <div className="space-y-5">
                    {RENT_ISSUES.map((issue) => (
                      <div key={issue.title}>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-term-400 mb-1.5">{issue.title}</p>
                        <p className="text-sm text-white/50 leading-relaxed">{issue.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Reveal delay={0}>
              <Stat value="53%" label="of the $10.8B agentic AI market, multi-agent systems make up a growing share." />
            </Reveal>
            <Reveal delay={100}>
              <Stat value="15-150x" label="the cost. More expensive to run while consistently underperforming." />
            </Reveal>
            <Reveal delay={200}>
              <Stat value="4-220x" label="the tokens consumed compared to single-agent systems." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 / HARNESS ═══════════════ */}
      <section id="harness" className="relative overflow-hidden bg-ink-950 border-t border-white/[0.06]">
        {/* Wall image behind the section content, above the code layer; pushed left, fading out on the right */}
        <div className="absolute inset-0 z-[45] pointer-events-none flex items-center justify-start">
          <img src="/inspo%20pics/wall.png" alt="" className="max-h-full max-w-full object-contain grayscale opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_55%,#050505_100%)]" />
        </div>
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-32 md:py-44">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <SectionHeading
                num="02"
                label="Harness"
                title={<>Recursive. Convergent. <Em>Yours</Em>.</>}
                sub="The model trains on your workflows, not a generic benchmark. And it doesn't stop at deployment. It keeps improving inside your stack, owned by you."
              />
            </Reveal>
            <Reveal delay={150}>
              <TerminalBlock
                title="procept harness"
                lines={[
                  '$ procept harness run --task onboard_finance --agents 8',
                  '[loop 01/04] agents 8 · debate 23 · verdicts 19  ✓',
                  '[loop 02/04] model v1.2 → eval 0.91  ✓',
                  '[loop 03/04] model v1.3 → eval 0.95  ✓',
                  '[loop 04/04] converged · 100% completion',
                  '▸ deploying v1.3 to your stack… OWNED BY YOU',
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 / PROBLEM ═══════════════ */}
      <section id="problem" className="relative bg-ink-900 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <SectionHeading
                num="03"
                label="Problem"
                title={<>You can't trust what you can't <Em>open</Em>.</>}
                sub={
                  <>
                    Closed-source models gorging on private data made the distrust structural. Then the billing
                    arrived: every provider charges per token, and per-usage billing puts a toll on every agent loop.
                    Two companies asked us for open models this week. The market is moving.
                  </>
                }
                className="flex-1"
              />
              {/* Line fading from the word "open" into the open image */}
              <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
                <div className="flex-1 h-px bg-gradient-to-r from-term-400/70 via-term-400/30 to-term-400/10" />
                <img
                  src="/inspo%20pics/open.png"
                  alt=""
                  className="w-44 md:w-52 h-auto"
                  style={{
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-14">
            <Reveal delay={100}>
              <TerminalBlock
                lines={[
                  '$ procept billing --compare',
                  '- provider_a    $0.015 / 1K tokens   × 10⁹ agents',
                  '+ procept       $0.00 / token',
                  '+ procept       $12,000 / month      FLAT',
                  '✓ tokens unmetered · scales linearly with your business',
                ]}
              />
            </Reveal>
            <Reveal delay={200}>
              <div className="space-y-6">
                <Checklist items={['OPEN · MODEL WEIGHTS ARE YOURS', 'METERED · NEVER', 'BILLED · ONE LINE ITEM']} />
                <p className="text-sm text-white/30 font-mono leading-relaxed">
                  // your agents loop thousands of times a day.
                  <br />// your bill shouldn't notice.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section id="access" className="relative overflow-hidden bg-ink-950 border-t border-white/[0.06]">
        <div className="relative z-50 max-w-4xl mx-auto px-6 md:px-16 py-32 md:py-44 text-center">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-5">Access</p>
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-[1.1] mb-6">
              Provision your <Em>stack</Em><span className="text-term-400">.</span>
            </h2>
            <p className="font-mono text-[11px] tracking-[0.25em] text-white/50 mb-10">
              DEPLOY IN DAYS · OWN IT FOREVER · NO PER-TOKEN BILLING
            </p>
            <button
              onClick={() => setDemoOpen(true)}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-ink-950 font-mono text-xs tracking-[0.15em] uppercase font-medium hover:bg-term-300 transition-all"
            >
              Request Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-6 text-xs text-white/30">
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
