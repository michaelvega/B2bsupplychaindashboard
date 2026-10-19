import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Stat } from '../components/marketing/Stat';
import { Reveal } from '../components/marketing/Reveal';
import { SectionHeading } from '../components/marketing/SectionHeading';
import { POSTS } from '../data/blog';

const IDEA_POINTS = [
  'Most training means changing a model’s weights, and that means GPUs. We train the instructions around the model instead, and the model stays frozen.',
  'Each epoch, the model answers your rows and a grader scores them. Agents turn the wrong answers into short, numbered rules, and a rule is kept only if it helps on rows it hasn’t seen. Only words are written, so the whole loop runs in your browser with no GPU.',
  'Procept RSI is inductive, true learning: put its result back into itself and it learns more. LoRA is compression: put it back into itself enough times and model alignment collapses.',
];

const COMPARISON = [
  { label: 'Hardware', lora: 'Rented GPUs for every training run', procept: 'None. Runs in your browser tab' },
  { label: 'What changes', lora: 'Model weights (an adapter tied to one model version)', procept: 'A short list of plain-English rules in the prompt' },
  { label: 'Readable', lora: 'No. The update is a matrix of numbers', procept: 'Yes. Every rule is text you can read and edit' },
  { label: 'Portable', lora: 'No. Retrain when the base model changes', procept: 'Yes. Carry the rules to any model' },
  { label: 'Cost', lora: 'GPU hours plus engineering time', procept: 'About a tenth of the price, and the demo is free' },
];

const STEPS = [
  { title: 'Bring a CSV', body: 'Upload your own rows with the right answers, or start from the FrontierScience or ResearchRubrics preset.' },
  { title: 'Paste your OpenRouter key', body: 'Model calls are billed to your own key, so we never pay for your run and never see the key.' },
  { title: 'Press start', body: 'Watch it find mistakes, write rules, and keep only the rules that hold up. Pause or stop at any time.' },
];

const STATS = [
  { value: '95.0', label: 'ARC-AGI 3 score from a frozen Qwen 3 27B model, with no weight updates.' },
  { value: '$35', label: 'total inference budget for that result, versus $20,700 for Opus 5’s 30.2%.' },
  { value: '2x', label: 'the gain of Google’s supervised baseline on the Scale Research Rubric (12 points vs 6).' },
];

/** Short explainer: what GPU-free training is and why it beats LoRA. Links to the gated demo. */
export function GpuFreeTrainingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const post = POSTS.find((p) => p.slug === 'gpu-free-training');

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div
      className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-ink-950"
      style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}
    >
      {/* Faint grain from particles1, barely there */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <img
          src="/inspo/particles1.png"
          alt=""
          className="w-full h-full object-cover opacity-[0.06] mix-blend-screen grayscale"
        />
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <MarketingNav onRequestAccess={() => setDemoOpen(true)} logoTo="/" />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-y-0 right-0 z-[45] pointer-events-none hidden lg:block w-[36%]">
          <img
            src="/inspo/particles2.png"
            alt=""
            className="w-full h-full object-contain object-right-bottom opacity-40 grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0D0F0D_0%,transparent_55%)]" />
        </div>

        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 pt-16 md:pt-20 pb-16 md:pb-24">
          <Reveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-[#636363]/80 hover:text-term-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog / Index
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-10 flex items-center gap-3">
              <span className="h-px w-10 bg-term-400/70" />
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400">
                Transmission {post.num} // {post.date}
              </p>
            </div>

            <h1 className="mt-8 font-display font-semibold uppercase tracking-tight leading-[1.08] text-white text-3xl md:text-5xl xl:text-6xl max-w-4xl break-words">
              {post.title}{' '}
              <span className="font-serif font-normal normal-case text-[#636363]">({post.accent})</span>
            </h1>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80">
              <span>{post.author}</span>
              <span className="text-[#636363]/60">/</span>
              <span>{post.readTime} READ</span>
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 border border-white/15 text-[#636363]">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="/foundry/"
              className="mt-8 inline-flex items-center gap-2 px-5 py-3 bg-white text-ink-950 font-mono text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-term-300 transition-colors"
            >
              Open the free demo
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ WHAT IT IS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="01"
              label="The idea"
              title={
                <>
                  Training that never touches the <span className="font-serif ">model</span>
                </>
              }
            />
          </Reveal>

          <ul className="mt-10 max-w-2xl space-y-7">
            {IDEA_POINTS.map((point, i) => (
              <li key={i}>
                <Reveal delay={i * 60}>
                  <div className="flex gap-5">
                    <span className="mt-[0.7em] h-2 w-2 shrink-0 bg-term-400" aria-hidden />
                    <p className="text-base md:text-lg text-white/70 leading-relaxed font-light">{point}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════ VS LORA ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="02"
              label="Versus LoRA"
              title={
                <>
                  Same goal, a tenth of the <span className="font-serif ">price</span>
                </>
              }
              sub="LoRA squeezes what you learned into a small weight update. We keep it as text."
            />
          </Reveal>

          <div className="mt-10 border border-white/[0.08] overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-12 gap-x-4 px-5 py-4 border-b border-white/[0.08] font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80">
                <span className="col-span-3" />
                <span className="col-span-4">LoRA</span>
                <span className="col-span-5 text-term-300">Procept</span>
              </div>
              {COMPARISON.map((row, i) => (
                <Reveal key={row.label} delay={i * 40}>
                  <div className="grid grid-cols-12 gap-x-4 px-5 py-4 border-t border-white/[0.06] first:border-t-0 text-sm leading-relaxed">
                    <span className="col-span-3 font-mono text-[11px] tracking-[0.15em] uppercase text-white/70">{row.label}</span>
                    <span className="col-span-4 text-[#636363]">{row.lora}</span>
                    <span className="col-span-5 text-white/80">{row.procept}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 60}>
                <Stat value={stat.value} label={stat.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FREE ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="03"
              label="Free to run"
              title={
                <>
                  Try it in three <span className="font-serif ">steps</span>
                </>
              }
              sub="No GPU, no install, no bill from us. Sign in with Google and bring your own key."
            />
          </Reveal>

          <div className="mt-10 max-w-3xl space-y-0">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 50}>
                <div className="grid grid-cols-12 gap-x-6 gap-y-2 border-t border-white/[0.08] py-6">
                  <span className="col-span-12 md:col-span-1 font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="col-span-12 md:col-span-4 font-display text-base md:text-lg uppercase tracking-tight text-white leading-[1.2]">
                    {step.title}
                  </h3>
                  <p className="col-span-12 md:col-span-7 text-[#636363] leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-8 max-w-2xl text-sm text-[#636363] leading-relaxed">
              Your projects and results are saved in your own browser, not on our servers. Procept charges nothing;
              the only cost is what your model provider bills your key for the calls.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ CLOSING CTA ═══════════════ */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 z-[45] pointer-events-none" aria-hidden>
          <img
            src="/inspo/particles2.png"
            alt=""
            className="w-full h-56 md:h-72 object-cover object-top opacity-25 grayscale contrast-125"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>

        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 pt-16 md:pt-22 pb-56 md:pb-72">
          <Reveal>
            <h2 className="font-display font-semibold uppercase tracking-tight text-3xl md:text-5xl text-white leading-[1.08] max-w-3xl break-words">
              Train a model without renting a <span className="font-serif font-normal normal-case">GPU</span>
              <span className="text-term-400">.</span>
            </h2>
            <p className="mt-7 text-[#636363] max-w-2xl leading-relaxed">
              Open the demo, run two epochs on a preset, and read the rules it writes.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-white font-mono text-[11px] tracking-[0.15em] uppercase hover:border-term-400/60 hover:text-term-300 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All transmissions
              </Link>
              <a
                href="/foundry/"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-ink-950 font-mono text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-term-300 transition-all"
              >
                Open the free demo
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
