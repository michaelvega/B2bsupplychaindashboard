import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { ChatbotHero } from '../components/marketing/ChatbotHero';
import { MarketingNav, scrollToSection } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { SectionHeading } from '../components/marketing/SectionHeading';
import { FigurePanel } from '../components/marketing/FigurePanel';
import { TerminalBlock } from '../components/marketing/TerminalBlock';
import { TelemetryHud } from '../components/marketing/TelemetryHud';
import { Stat } from '../components/marketing/Stat';
import { StatusChip } from '../components/marketing/StatusChip';
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
}

/** The RSI loop, in four stages — Prime Intellect-style numbered figures. */
const STACK_STAGES: StackStage[] = [
  {
    fig: '1',
    caption: 'DATA GENERATION',
    num: '01',
    title: 'Human-review-level data, for any task',
    desc: 'We automatically generate human-reviewed-level data for any task — connected straight to your data sources.',
    bullets: [
      'Human-review-level quality, generated automatically',
      'Connect your data sources — we handle the ingestion',
      'Your workflows, not scraped benchmarks',
    ],
    cta: 'Generate Data',
  },
  {
    fig: '2',
    caption: 'CONTAINERIZED RSI',
    num: '02',
    title: 'Your RSI model, containerized',
    desc: 'We containerize your RSI model so it trains for a specific task — in your stack, owned by you.',
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
    title: 'Brokered GPUs, dedicated inference',
    desc: 'We broker the cheapest GPUs for you at that moment — dedicated inference, no GPU surfing.',
    bullets: [
      'Cheapest GPUs, brokered in real time',
      'Dedicated capacity — nothing shared',
      'One contract, complete transparency',
    ],
    cta: 'Find GPUs',
    image: '/gpus.jpeg',
  },
  {
    fig: '4',
    caption: 'EVALUATIONS',
    num: '04',
    title: 'Watch it self-improve',
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

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* ═══════════════ NAV ═══════════════ */}
      <MarketingNav onRequestAccess={() => setDemoOpen(true)} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="top" className="relative min-h-screen w-full overflow-hidden bg-ink-950 flex flex-col">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/60" />
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-60" />

        <div className="relative flex-1 flex flex-col justify-center px-6 md:px-16 py-16">
          <CornerBrackets />
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.15fr,0.85fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/50">Procept // Self-hosted AI infrastructure</p>
                <StatusChip label="Online" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.05] mb-8">
                Own your <Em>intelligence</Em>.<br />
                Meter nothing<span className="text-term-400">.</span>
              </h1>

              <p className="font-mono text-sm md:text-base tracking-[0.2em] uppercase text-term-300 mb-4">
                Multi-agent systems are here.
              </p>

              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
                Procept is the fully maintained, self-hosted AI stack. We abstract away the GPUs, charge one flat
                linear rate — no per-token pricing, ever — and run a multi-agent harness that improves your models
                recursively.
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
                  onClick={() => scrollToSection('thesis')}
                  className="flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-mono text-xs tracking-[0.15em] uppercase hover:border-term-400/60 hover:text-term-300 transition-all"
                >
                  Read the Thesis
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <Reveal delay={200}>
                <ChatbotHero />
              </Reveal>
            </div>
          </div>
        </div>

        {/* Telemetry strip pinned to hero bottom */}
        <div className="relative">
          <TelemetryHud
            items={[
              { label: 'GPU ALLOC', value: '24×H100' },
              { label: 'AGENT LOOPS', live: { base: 128401, step: 3 } },
              { label: 'BILLING', value: 'FLAT' },
              { label: 'TOKENS', value: 'UNMETERED' },
              { label: 'EVALS', value: 'PASSING' },
            ]}
          />
        </div>
      </section>

      {/* ═══════════════ STATS / FIELD DATA ═══════════════ */}
      <section id="field-data" className="relative bg-ink-950 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-2xl md:text-4xl font-light text-white tracking-tight leading-tight max-w-3xl">
              The companies leaving the token economy are already here.
            </h2>
          </Reveal>

          {/* Poster: figure in the middle, everything else structured around it */}
          <div className="relative mt-16 lg:h-[640px]">
            {/* Top label */}
            <Reveal delay={100} className="hidden lg:block lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-0">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-term-400">Telemetry — field data</p>
            </Reveal>

            {/* Vertical side phrases */}
            <div className="hidden lg:block absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[11px] tracking-[0.3em] uppercase text-term-300/40 [writing-mode:vertical-rl]">
              Multi-agent systems are here.
            </div>
            <div className="hidden lg:block absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[11px] tracking-[0.3em] uppercase text-term-300/40 [writing-mode:vertical-rl]">
              Meter nothing. Meter nothing.
            </div>

            {/* Center figure */}
            <div className="relative mx-auto w-fit lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
              <div
                className="absolute inset-0 -m-8 rounded-full blur-2xl opacity-25"
                style={{ background: 'radial-gradient(circle, rgba(51,255,153,0.4), transparent 70%)' }}
              />
              <img
                src="/inspo%20pics/8d50617ca1e874b1711f33cd5f3e2b24.jpg"
                alt="Procept figure"
                className="relative w-52 md:w-64 lg:w-72"
              />
            </div>

            {/* Text structured around the figure */}
            <div className="relative mt-10 flex flex-col items-center gap-8 lg:mt-0 lg:absolute lg:inset-0 lg:block">
              <Reveal delay={0} className="lg:absolute lg:left-12 lg:top-6 lg:max-w-[240px]">
                <Stat value="96%" label="cheaper than public API providers." />
              </Reveal>
              <Reveal delay={100} className="lg:absolute lg:right-12 lg:top-10 lg:max-w-[240px]">
                <Stat value="95%" label="our ARC-AGI 3 score. We are 65% better than Claude, which scored 30%." />
              </Reveal>
              <Reveal delay={200} className="lg:absolute lg:left-12 lg:bottom-8 lg:max-w-[240px]">
                <Stat value="10x" label="smaller and still more intelligent." />
              </Reveal>
              <Reveal delay={300} className="w-full max-w-xs lg:absolute lg:right-12 lg:bottom-4 lg:max-w-[260px]">
                <TerminalBlock
                  title="procept — billing"
                  lines={[
                    '$ procept bill --current',
                    '$12,000 / month      FLAT',
                  ]}
                />
              </Reveal>
              <Reveal delay={250} className="hidden lg:block lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-0">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-term-400/60">FLAT LINEAR RATE — DEPLOY IN DAYS</p>
              </Reveal>
            </div>
          </div>

          {/* Echo lines */}
          <Reveal delay={200}>
            <div className="mt-16 space-y-2.5 font-mono text-[13px] text-white/50 max-w-2xl mx-auto text-center">
              <p><span className="text-term-400">$</span> echo "Two companies asked us for open-source models this week."</p>
              <p><span className="text-term-400">$</span> echo "We told our provider: no more per-token billing."</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 01 / THESIS ═══════════════ */}
      <section id="thesis" className="relative overflow-hidden bg-ink-950 border-t border-white/[0.06]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/cargoships.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/50 to-ink-950/30" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-16 py-32 md:py-44">
          <Reveal>
            <SectionHeading
              num="01"
              label="Thesis"
              title={<>The gold rush is <Em>over</Em>.</>}
              sub={
                <>
                  Everyone is panning someone else's tokens. The winners will run refineries.
                  <br /><br />
                  Blue Origin builds its own data centers. Frontier labs burn billions on GPT Astra. Token economics
                  never close — margins collapse at exactly the moment you hit scale.
                </>
              }
            />
            <div className="mt-12">
              <Checklist items={['OWNED COMPUTE', 'OWNED WEIGHTS', 'OWNED ECONOMICS']} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 02 / PROBLEM ═══════════════ */}
      <section id="problem" className="relative bg-ink-900 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              num="02"
              label="Problem"
              title={<>You can't trust what you can't <Em>open</Em>.</>}
              sub={
                <>
                  Closed-source models gorging on private data made the distrust structural. Then the billing
                  arrived: every provider charges per token, and per-usage billing puts a toll on every agent loop.
                  Two companies asked us for open models this week — the market is moving.
                </>
              }
            />
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
                <Checklist items={['OPEN — MODEL WEIGHTS ARE YOURS', 'METERED — NEVER', 'BILLED — ONE LINE ITEM']} />
                <p className="text-sm text-white/30 font-mono leading-relaxed">
                  // your agents loop thousands of times a day.
                  <br />// your bill shouldn't notice.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 / STACK ═══════════════ */}
      <section id="stack" className="relative bg-ink-950 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              num="03"
              label="Stack"
              title={<>One stack. Four <Em>stages</Em>.</>}
              sub="The RSI loop, end to end: data, training, inference, evaluation. Every stage fully maintained by Procept — on your stack."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            {STACK_STAGES.map((stage, i) => (
              <Reveal key={stage.fig} delay={(i % 2) * 100}>
                <FigurePanel fig={stage.fig} caption={stage.caption} image={stage.image} className="h-full">
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

      {/* ═══════════════ 04 / HARNESS ═══════════════ */}
      <section id="harness" className="relative overflow-hidden bg-ink-950 border-t border-white/[0.06]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero-factory.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink-950/80" />
        <div className="absolute inset-0 bg-gradient-to-l from-ink-950/90 via-ink-950/60 to-ink-950/20" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-16 py-32 md:py-44">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <SectionHeading
                num="04"
                label="Harness"
                title={<>Recursive. Convergent. <Em>Yours</Em>.</>}
                sub="The model trains on your workflows, not a generic benchmark. And it doesn't stop at deployment — it keeps improving inside your stack, owned by you."
              />
            </Reveal>
            <Reveal delay={150}>
              <TerminalBlock
                title="procept — harness"
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

      {/* ═══════════════ 05 / METRICS ═══════════════ */}
      <section id="metrics" className="relative bg-ink-900 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHeading
              num="05"
              label="Metrics"
              title={<>People suck at evaluations. We measure <Em>outcomes</Em>.</>}
              sub="Measuring, training, and evaluating models is genuinely hard — benchmarks lie. So Procept measures what your business actually cares about: the outcome."
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-14">
            <Reveal delay={100}>
              <FigurePanel fig="5" caption="UNMEASURED OUTPUT. DECOMMISSIONED." image="/ai slop.jpeg" imageClass="grayscale opacity-60" />
            </Reveal>
            <Reveal delay={200}>
              <Checklist items={['EVAL SCORE', 'BUSINESS OUTCOME', 'CUSTOMER IMPACT', 'ROI VS INCUMBENT']} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section id="access" className="relative overflow-hidden bg-ink-950 border-t border-white/[0.06]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/truck video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink-950/80" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-16 py-32 md:py-44 text-center">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-5">Access</p>
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-[1.1] mb-6">
              Provision your <Em>stack</Em><span className="text-term-400">.</span>
            </h2>
            <p className="font-mono text-[11px] tracking-[0.25em] text-white/50 mb-10">
              DEPLOY IN DAYS — OWN IT FOREVER — NO PER-TOKEN BILLING
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
