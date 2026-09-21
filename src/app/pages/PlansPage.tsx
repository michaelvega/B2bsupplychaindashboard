import { useState } from 'react';
import type { ReactNode } from 'react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { CodeBackdrop } from '../components/marketing/CodeBackdrop';
import { CursorGfx } from '../components/marketing/CursorGfx';
import { Reveal } from '../components/marketing/Reveal';
import { cn } from '../components/ui/utils';

/** Serif-italic accent word inside display headlines. */
function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif italic font-normal">{children}</em>;
}

interface RockService {
  num: string;
  title: string;
  desc: string;
  rock: string;
  rockClass: string;
  rotate: string;
}

/** The stack as a cairn: each rock is a service, text beside it. */
const SERVICES: RockService[] = [
  {
    num: '01',
    title: 'Open-Source Models',
    desc: 'Open-weight models implemented in your environment. You own the weights. We handle the engineering.',
    rock: '/rocks/rock-1.png',
    rockClass: 'w-48 md:w-60',
    rotate: '-rotate-3',
  },
  {
    num: '02',
    title: 'SLM Compression',
    desc: 'Small language models compressed to the task. A fraction of the size, still more intelligent.',
    rock: '/rocks/rock-2.png',
    rockClass: 'w-10 md:w-12',
    rotate: 'rotate-6',
  },
  {
    num: '03',
    title: 'Inference & Brokering',
    desc: 'Cheapest GPUs brokered in real time. Dedicated inference, no GPU surfing.',
    rock: '/rocks/rock-3.png',
    rockClass: 'w-44 md:w-56',
    rotate: '-rotate-2',
  },
  {
    num: '04',
    title: 'Recursive Self-Improvement',
    desc: 'Your model trains, evaluates, and improves. Loop after loop, inside your stack.',
    rock: '/rocks/rock-4.png',
    rockClass: 'w-48 md:w-60',
    rotate: 'rotate-4',
  },
  {
    num: '05',
    title: 'Custom Data Generation',
    desc: 'Human-review-level data for any task, generated automatically and connected to your sources.',
    rock: '/rocks/rock-5.png',
    rockClass: 'w-56 md:w-72',
    rotate: '-rotate-4',
  },
  {
    num: '06',
    title: 'Evaluations & Metrics',
    desc: 'Live eval scores and business outcomes, tracked loop by loop. No vanity benchmarks.',
    rock: '/rocks/rock-6.png',
    rockClass: 'w-48 md:w-64',
    rotate: 'rotate-3',
  },
];

/** Text anchor positions (%), matching each rock's place in the original photo stack. */
const ROCK_TOPS = [12, 16, 28, 42, 62, 86];

/** Horizontal offset from the stack center (px at 880px tall), from the photo. */
const ROCK_DX = [25, -59, -1, -17, 20, -2];

export function PlansPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-ink-950" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      <CodeBackdrop />
      <CursorGfx />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      <MarketingNav onRequestAccess={() => setDemoOpen(true)} />

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section className="relative bg-ink-950 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06] overflow-hidden">
        <div className="relative z-50 max-w-6xl mx-auto">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-5">Plans // Services</p>
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-[1.1] mb-6 max-w-3xl">
              Six services. One <Em>stack</Em>.
            </h1>
            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-20 max-w-2xl">
              Everything you need to run frontier intelligence on your infrastructure: implemented, brokered, and
              maintained by Procept.
            </p>
          </Reveal>

          {/* Mobile: simple stacked list, rock above its text */}
          <div className="lg:hidden space-y-16">
            {SERVICES.map((service) => (
              <Reveal key={service.num}>
                <div className="flex flex-col items-center text-center gap-6">
                  <img
                    src={service.rock}
                    alt={service.title}
                    className={cn('select-none drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)]', service.rockClass, service.rotate)}
                    draggable={false}
                  />
                  <div className="max-w-xs">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-term-400 mb-2">{service.num} // {service.title}</p>
                    <p className="text-sm text-white/50 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Desktop: the cairn exactly as stacked in the rocks.png photo, text off to the sides */}
          <div className="hidden lg:block relative h-[880px] max-w-4xl mx-auto">
            <Reveal className="absolute inset-0">
              {SERVICES.map((service, i) => {
                const side = i % 2 === 0 ? 'left' : 'right';
                return (
                  <div key={service.num}>
                    {/* Rock, at its photo position; grows on hover */}
                    <img
                      src={service.rock}
                      alt={service.title}
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2 -translate-y-1/2 select-none transition-transform duration-300 hover:scale-110 hover:z-10 drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]',
                        service.rockClass,
                      )}
                      style={{ top: `${ROCK_TOPS[i]}%`, marginLeft: `${ROCK_DX[i]}px` }}
                      draggable={false}
                    />
                    {/* Text pushed off to the side, grows on hover */}
                    <div
                      className={cn(
                        'absolute w-[300px] -translate-y-1/2 transition-transform duration-300 hover:scale-105',
                        side === 'left' ? 'left-0 text-right origin-right' : 'right-0 text-left origin-left',
                      )}
                      style={{ top: `${ROCK_TOPS[i]}%` }}
                    >
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-term-400 mb-2">{service.num} // {service.title}</p>
                      <p className="text-sm text-white/50 leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                );
              })}
            </Reveal>
          </div>

          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 text-center mt-16">
              FLAT LINEAR RATE · SELF-HOSTED · FULLY MAINTAINED BY PROCEPT
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ SERVICE DESCRIPTIONS ═══════════════ */}
      <section className="relative bg-ink-950 py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="relative z-50 max-w-5xl mx-auto">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-12">DOC // SERVICE DESCRIPTIONS</p>

            {/* One plan */}
            <div className="border border-white/[0.08] bg-white/[0.03] p-8 hover:border-term-400/40 transition-colors">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-4">PLAN // Procept Pro</p>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Service Description: Procept Pro</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xl">
                    One plan, one flat linear rate. The fully maintained, self-hosted AI stack: deployed in days,
                    owned forever, no per-token billing.
                  </p>
                </div>
                <span className="font-mono text-[11px] text-term-400 shrink-0 md:pt-1">Effective September 20, 2026</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Open-source model implementation',
                  'SLM compression',
                  'Inference and GPU brokering',
                  'Recursive self-improvement models',
                  'Custom data generation',
                  'Evaluations and metric tracking',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/50">
                    <span className="w-1.5 h-1.5 bg-term-400/70 mt-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
