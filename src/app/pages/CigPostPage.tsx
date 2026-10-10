import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Stat } from '../components/marketing/Stat';
import { Reveal } from '../components/marketing/Reveal';
import { SectionHeading } from '../components/marketing/SectionHeading';
import { FigurePanel } from '../components/marketing/FigurePanel';
import { POSTS } from '../data/blog';

/** Display equation: serif-italic math with subscripts, in a HUD bracket. */
function Eq({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="my-8 border border-white/[0.08] bg-ink-900/70 px-6 py-6 overflow-x-auto">
      <div className="font-serif italic text-lg md:text-xl text-white/90 leading-relaxed whitespace-nowrap tabular-nums">
        {children}
      </div>
      {label && (
        <p className="mt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35">{label}</p>
      )}
    </div>
  );
}

/** One of the five pillars: number, name, and explanation. */
function Pillar({ index, name, body }: { index: number; name: string; body: string }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-4 border-t border-white/[0.08] py-8 md:py-10">
      <div className="col-span-12 md:col-span-2">
        <span className="font-mono text-sm text-term-400 tabular-nums">
          {String(index).padStart(2, '0')}
        </span>
      </div>
      <div className="col-span-12 md:col-span-10">
        <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white leading-[1.2]">
          {name}
        </h3>
        <p className="mt-3 text-white/55 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

const TLDR = [
  {
    label: 'The problem',
    body: 'Multi-agent harnesses do not learn from their mistakes: costs compound exponentially, failures detonate in front of your users, and open-source alternatives are too slow, too dumb, and too painful to self-host to be worth it.',
  },
  {
    label: 'The architectural novelty',
    body: 'A Cognitive Induction Graph compiles every prompt, tool call, protocol route, and agent trajectory into a single optimizable compute graph (the agentic analog of a CUDA graph), so we optimize the whole workflow instead of isolated examples.',
  },
  {
    label: 'The solution',
    body: 'Procept Foundry builds that graph with Recursive Self-Improvement to score 95% on ARC-AGI 3 for a $35 budget (versus Opus 5’s 30.2% at $20,700), and one enterprise deployment cut shipped bugs by 27%.',
  },
];

const HEADLINE_STATS = [
  { value: '95%', label: 'ARC-AGI 3 score, running a frozen Qwen 3 Bonsai-2 27B through Procept Foundry.' },
  { value: '$35', label: 'total inference budget for that result, versus $20,700 for Opus 5’s 30.2%.' },
  { value: '27%', label: 'reduction in shipped bugs in a live enterprise deployment of the CIG.' },
  { value: '80%', label: 'relative gain on OpenAI Frontier Science (0.21 → 0.38), versus a 5-point supervised baseline.' },
];

const PILLARS = [
  {
    name: 'End-to-End Trace Logging',
    body: 'Every operational step, API call, and telemetry metric is recorded per execution, producing a fully observable directed acyclic graph. Nothing the agent does is invisible, and nothing is lost to the chat-scroll.',
  },
  {
    name: 'Full Context Optimization',
    body: 'Traces carry the holistic contextual state the RSI engine needs to experiment safely at runtime, so a node-level optimization respects every downstream dependency in the graph before it is allowed to touch production.',
  },
  {
    name: 'Curated Preference Generation',
    body: 'By evaluating which runtime experiments succeed, the graph continuously emits curated preference data, the fuel for the inductive taxonomy that gets refined on a schedule, without a human in the loop.',
  },
  {
    name: 'Feedback-Driven Evaluations',
    body: 'Holistic trace context unlocks evaluation feedback loops with immediate impact, bypassing the manual intervention pipelines that normally sit between “something went wrong” and “something got fixed.”',
  },
  {
    name: 'Execution Trajectory Optimization',
    body: 'Analyzing the most heavily trafficked and efficient sub-graphs surfaces structural edits, for example swapping a probabilistic LLM formatting call for a deterministic, low-compute microservice.',
  },
];

const RESULTS = [
  { benchmark: 'Scale Research Rubric', baseline: '0.41', rssi: '0.47', cig: '0.53' },
  { benchmark: 'OpenAI Frontier Science', baseline: '0.21', rssi: '0.26', cig: '0.38' },
  { benchmark: 'ARC-AGI 3 (Public Tests)', baseline: 'N/A', rssi: 'Fails in live environments', cig: '95.0' },
];

export function CigPostPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const post = POSTS.find((p) => p.slug === 'cognitive-induction-graphs');

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
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#050505_0%,transparent_55%)]" />
        </div>

        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 pt-16 md:pt-20 pb-16 md:pb-24">
          <Reveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-white/40 hover:text-term-300 transition-colors"
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

            <h1 className="mt-8 font-display font-semibold uppercase tracking-tight leading-[1.08] text-white text-3xl md:text-5xl xl:text-6xl max-w-4xl">
              {post.title}{' '}
              <em className="font-serif italic font-normal normal-case text-white/60">({post.accent})</em>
            </h1>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
              <span>{post.author}</span>
              <span className="text-white/20">/</span>
              <span>{post.readTime} READ</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border border-white/15 text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ TLDR ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-18">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">
              TLDR
            </p>
          </Reveal>
          <div className="space-y-4">
            {TLDR.map((item, i) => (
              <Reveal key={item.label} delay={i * 60}>
                <div className="grid grid-cols-12 gap-x-6 gap-y-3 border-l-2 border-term-400/60 pl-6 py-2">
                  <div className="col-span-12 md:col-span-3">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">
                      {item.label}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <p className="text-white/65 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BANNER / CONSOLE ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-18">
          <Reveal>
            <FigurePanel
              fig="00"
              caption="Procept Foundry: the full console"
              image="/blog/banner.jpg"
              imageClass="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ PROBLEM ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">Intro</p>
          </Reveal>
          <div className="max-w-2xl space-y-7">
            <Reveal>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                Your multi-agent harness does not learn from its mistakes. It exponentiates costs, blows up in your
                users’ faces, and can’t even remember your own customers’ names.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                To top it off, the open-source alternatives are slow, dumb, and end up taking so much time to self-host
                that they defeat their own purpose. For three years we lived this problem. We personally set up
                self-hosted harnesses for Pinterest, Jefferies IB, and other Fortune 500 companies, and we learned
                that the goal is never just “cheaper and smarter.”
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                What we actually want is to empower enterprises to turn agents from building blocks of connected tools
                and models into a flexible system that lives in their servers, learns from every conversation, and
                becomes company IP that grows in value over time.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ PULL QUOTE ═══════════════ */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 z-[45] pointer-events-none opacity-[0.05]" aria-hidden>
          <img src="/inspo/particles1.png" alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-20 md:py-26">
          <Reveal>
            <div className="border-l-2 border-term-400 pl-8 md:pl-12">
              <p className="font-serif italic text-3xl md:text-5xl text-white leading-tight max-w-3xl">
                Programmatic harness tools are legos: brittle, and agents can only see the adjacent agent, never the
                big picture.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-16 max-w-2xl space-y-7">
              <p className="text-base text-white/55 leading-relaxed">
                Agents can’t be lego pieces operating by themselves if they are really going to work together.
                They need the coordination of living cells in a body, working together to keep the business alive,
                learning from its environment, self-healing when necessary, and keeping the lights on
                no matter what.
              </p>
              <p className="text-base text-white/55 leading-relaxed">
                That is what we built: <span className="text-white">Procept Foundry</span>, a
                self-healing, self-experimenting, metacognitive harness that rewrites its own ruleset in the face of
                errors, or by running its own inductive experiments. Procept Foundry achieves{' '}
                <span className="text-term-300">95% on ARC-AGI 3 with a $35 budget</span>, versus Opus 5 which scores
                30.2% at $20,700.
              </p>
              <p className="text-base text-white/55 leading-relaxed">
                Under the hood it runs two fundamental algorithms we are excited to present: Recursive Self-Improvement,
                and cognitive induction graphs.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ RECURSIVE SELF IMPROVEMENT ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              num="01"
              label="Recursive Self-Improvement"
              title={
                <>
                  Recursive self-improvement at a <em className="font-serif italic">microscopic scale</em>
                </>
              }
              sub="To understand why the CIG matters, we have to first see what fine-tuning gets wrong, and why the right unit of learning is not a weight, but a rule."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-7">
            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                LoRA is compression, not learning
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                LoRA is compression because it just bakes the right answers into the model’s memory. Once the
                problem constraints are handed over via supervised labels, LoRA converts semantic targets into the
                model’s latent feature space, solves for optimal pathways through the feed-forward layers, and
                outputs condensed weights. It is a lossy, surjective
                mapping from a semantic space into a feature space, optimized for computational efficiency, not for
                out-of-distribution generalization.
              </p>
              <p className="mt-4 text-white/55 leading-relaxed">
                It remembers the answer to the exact question it was shown. It does not learn the rule that produced
                the answer. So the moment the environment shifts, the memory is worthless.
              </p>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                We solve for the rubric, not the answer
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                Our recursive self-improvement loop does the opposite: it solves for the rubric itself through
                experimentation. Instead of baking in one correct output, we expedite stochastic signals in a noisy
                environment until the objective is met, mapping the constraints of the problem space and the solution
                space at the same time. That is inductive generalization, and it is inherently unsupervised.
              </p>
            </Reveal>

            <Reveal>
              <div className="border border-white/[0.08] bg-white/[0.02] px-6 py-6">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-4">
                  Lemma 1 // Semantic-to-Latent Surjection
                </p>
                <p className="font-serif italic text-lg md:text-xl text-white/90 leading-relaxed">
                  Every semantic construct in natural language possesses a surjectively lossy but approximate
                  representation within the latent feature space of a language model’s attention heads.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                By this lemma, a dynamically generated, unsupervised rubric acts as a highly effective feature-space
                projection. When we prepend it as a system prompt, it dynamically alters the attention gradients of
                the frozen model, effectively mimicking a weight update while keeping the high-dimensional
                representation of natural language that you need to solve variables you have never seen before.
              </p>
              <p className="mt-4 text-base text-white/55 leading-relaxed">
                In other words: we train a model to solve for the rubric, not the right answer, and then we convert
                those learned weights into text in the system prompt. The model stays frozen. The rule travels.
              </p>
              <p className="mt-4 text-base text-white/55 leading-relaxed">
                There is a practical upshot. Through Recursive Self-Improvement, we train models and fine-tune better
                than LoRA, with no GPU required, for any model, even closed-weight ones. The rubric lives in the
                system prompt, so the technique works on models you cannot fine-tune at all.
              </p>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                From game environments to RSI metrics
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                When you point this loop at game environments (closed worlds with a score, a reset button, and an
                infinite supply of fresh failure), the recursion compounds. That is what yields our recursive
                self-improving loop harness and the RSI metrics we report below: the agent keeps solving for a better
                rubric, and the graph keeps scoring which rubric actually worked.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ COGNITIVE INDUCTION GRAPHS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              num="02"
              label="Cognitive Induction Graphs"
              title={
                <>
                  Cognitive induction <em className="font-serif italic">graphs</em>
                </>
              }
              sub="A single rubric is powerful. But to learn across an entire enterprise, you need the whole graph: every operation, tool call, and trajectory in one place."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-7">
            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                The CUDA analogy
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                In high-performance computing, a CUDA compute graph stores a sequence of bottom-up GPU operations and
                their memory dependencies before execution. By parsing the entire graph at once, the driver traces the
                execution paths, identifies hardware bottlenecks, and optimizes the overarching kernel dispatch. CUDA
                wins because it sees the whole program, not one kernel at a time.
              </p>
              <p className="mt-4 text-white/55 leading-relaxed">
                A Cognitive Induction Graph does the same for agents. It compiles agentic operations (prompts, tool
                invocations, protocol routing, and user validations) into a unified topological structure, then
                derives semantic gradients across the entire workflow. That ultimately lets us perform optimization
                over the whole corpus of data operations, tool calls, and agent trajectories, and solve for the
                user’s goals directly.
              </p>
            </Reveal>

            <Reveal>
              <FigurePanel
                fig="01"
                caption="A live toy CIG in the middle of the console"
                image="/blog/toyCIG.jpg"
                imageClass="object-cover"
              />
            </Reveal>

            <Reveal>
              <FigurePanel
                fig="02"
                caption="An agent trajectory, unrolled into a directed acyclic graph"
                image="/blog/unrolledDAG.jpg"
                imageClass="object-contain"
              >
                <p className="text-white/55 leading-relaxed">
                  This is what Procept Foundry does for you. Every agent trajectory, every prompt, tool call, and
                  branch, gets unrolled into a single directed acyclic graph, so the whole run is inspectable and
                  optimizable end to end.
                </p>
              </FigurePanel>
            </Reveal>
          </div>

          {/* Five pillars */}
          <div className="mt-16">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-2">
                Architecture // The five pillars of a CIG
              </p>
              <p className="text-base text-white/55 leading-relaxed max-w-2xl mb-2">
                To run the kind of experimentation continual learning demands, a system has to analyze the entire
                execution topology. The CIG does it through five mechanisms.
              </p>
            </Reveal>
            <div className="mt-4">
              {PILLARS.map((pillar, i) => (
                <Reveal key={pillar.name} delay={i * 50}>
                  <Pillar index={i + 1} name={pillar.name} body={pillar.body} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Enterprise result */}
          <div className="mt-16">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">
                Field // One enterprise deployment
              </p>
            </Reveal>
            <div className="grid grid-cols-12 gap-x-6 gap-y-6 border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
              <div className="col-span-12 md:col-span-7 space-y-5">
                <Reveal>
                  <p className="font-display text-5xl md:text-6xl text-term-300 tabular-nums leading-none">27%</p>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                    reduction in shipped bugs
                  </p>
                </Reveal>
              </div>
              <div className="col-span-12 md:col-span-5">
                <Reveal delay={80}>
                  <p className="text-white/60 leading-relaxed">
                    In one enterprise implementation we saw a 27% reduction in bugs. But the more interesting result
                    came from the programs that were <em className="text-white/80">not</em> failing: because the CIG
                    exposes the full trajectory, we were able to extrapolate a rubric for customer success and upsell,
                    and train our agents to optimize toward those objectives too.
                  </p>
                  <p className="mt-4 text-white/50 leading-relaxed text-sm">
                    The same graph that stops a failure also discovers what a healthy, high-value conversation looks
                    like. Learning and growth become the same optimization problem.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ THE MATH ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              num="03"
              label="The Math"
              title={
                <>
                  Solving for the Right Answer vs. Solving for the <em className="font-serif italic">Rubric</em>
                </>
              }
              sub="Google’s Reinforced Recursive Self-Improvement (RRSI) approximates gradients against a fixed answer key. Recursive Self-Improvement solves for the rubric itself."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-8">
            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                The supervised gradient approximation
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                Google’s RRSI optimizes prompts through a central harness equation that approximates gradients:
              </p>
              <Eq label="Google RRSI: supervised gradient approximation">
                {'ΔH'}
                <sub>RRSI</sub> = {'{ ∇'}
                <sub>
                  {'θ'}
                  <sub>sem</sub>
                </sub>
                {' 𝒮, ∇'}
                <sub>
                  {'θ'}
                  <sub>style</sub>
                </sub>
                {' ℱ, ℰ'}
                <sub>orig</sub>
                {' }'}
              </Eq>
              <p className="text-white/55 leading-relaxed">
                Here <span className="font-serif italic text-white/80">𝒮</span> is the gradient of the
                system-prompt space for semantic alignment,{' '}
                <span className="font-serif italic text-white/80">ℱ</span> is the formatting space, and{' '}
                <span className="font-serif italic text-white/80">ℰ</span>
                <sub>orig</sub> is the static set of original examples. The whole thing is constrained by its reliance
                on isolated, static examples and supervised targets.
              </p>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                The taxonomic inductive update
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                Recursive Self-Improvement replaces those static examples with the live telemetry of the Cognitive
                Induction Graph. Let <span className="font-serif italic text-white/80">𝒯</span>
                <sub>t</sub> be the inductive taxonomy of rules at time{' '}
                <span className="font-serif italic text-white/80">t</span>. The CIG optimizes via:
              </p>
              <Eq label="Procept CIG: Taxonomic Inductive Update (TIU)">
                {'𝒯'}
                <sub>t+1</sub> = {'𝒯'}
                <sub>t</sub> {' ⊕ 𝕀'}
                <sub>unsup</sub>
                {' ( ∇'}
                <sub>G</sub>
                {' 𝒞, 𝒩'}
                <sub>expedition</sub>
                {' )'}
              </Eq>
              <div className="space-y-3 text-white/55 leading-relaxed">
                <p>
                  <span className="font-serif italic text-white/80">∇</span>
                  <sub>G</sub>
                  <span className="font-serif italic text-white/80">𝒞</span> is the topological gradient of
                  the dominant execution trajectories, derived by aggregating full-context traces to find which paths
                  yield the highest downstream success across the network.
                </p>
                <p>
                  <span className="font-serif italic text-white/80">𝒩</span>
                  <sub>expedition</sub> is the expeditionary random signal for active runtime experimentation.
                  Supported by full graph context, it explores the problem space safely.
                </p>
                <p>
                  <span className="font-serif italic text-white/80">𝕀</span>
                  <sub>unsup</sub> is the unsupervised inductive abstraction operator that distills experimental graph
                  successes into generalized semantic rules.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ RESULTS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">
              Data // The numbers that matter
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {HEADLINE_STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 60}>
                <Stat value={stat.value} label={stat.label} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 mb-6">
              Benchmark // Procept CIG vs. Google RRSI, frozen Qwen 3 Bonsai-2 27B
            </p>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto border border-white/[0.08]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 px-5 py-4">
                      Benchmark
                    </th>
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 px-5 py-4">
                      Baseline (No Opt)
                    </th>
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 px-5 py-4">
                      Google RRSI
                    </th>
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-term-400 px-5 py-4">
                      Procept RSI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((row) => (
                    <tr key={row.benchmark} className="border-b border-white/[0.06] last:border-b-0">
                      <td className="px-5 py-4 text-white/70">{row.benchmark}</td>
                      <td className="px-5 py-4 font-mono text-white/40 tabular-nums">{row.baseline}</td>
                      <td className="px-5 py-4 font-mono text-white/40 tabular-nums">{row.rssi}</td>
                      <td className="px-5 py-4 font-mono text-term-300 tabular-nums">{row.cig}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <div className="mt-12 max-w-2xl space-y-7">
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                On the Scale Research Rubric, Google RRSI gained a modest 6 points. Recursive Self-Improvement, enabled
                by the CIG’s full-context tracing, gained 12 (0.41 → 0.53). The gap is sharper on OpenAI
                Frontier Science, where the CIG delivered an 80% relative improvement (0.21 → 0.38), far outpacing
                the supervised baseline’s 5-point gain.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                The most significant validation came on ARC-AGI 3, which measures fluid intelligence and adaptability,
                exactly where compressed, parameter-updated models classically fail. Running the frozen Qwen 3 27B
                through Procept Foundry returned a score of 95.0. The model dynamically experimented during
                runtime, treating problem constraints and solution spaces iteratively. Heavily quantized, frozen,
                small-parameter models can reach frontier-level reasoning, when governed by a topological
                infrastructure built for continuous generalization.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONCLUSION ═══════════════ */}
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
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-6">Conclusion</p>
            <h2 className="font-display font-semibold uppercase tracking-tight text-3xl md:text-5xl text-white leading-[1.08] max-w-3xl">
              Turn your user actions into <em className="font-serif italic font-normal normal-case">company IP</em>
              <span className="text-term-400">.</span>
            </h2>
            <p className="mt-7 text-white/60 max-w-2xl leading-relaxed">
              The Cognitive Induction Graph is a foundational architecture for multi-agent systems. By mirroring the
              holistic optimization strategies of hardware compute graphs, it aggregates end-to-end traces to expose
              bottlenecks, map the optimal execution trajectories, and provide the overarching context required for
              safe, continuous experimentation.
            </p>
            <p className="mt-5 text-white/60 max-w-2xl leading-relaxed">
              Paired with Recursive Self-Improvement, it bypasses the surjective dimensionality reduction of
              traditional parameter updates and demonstrates that robust, generalizable learning can happen entirely at
              the infrastructure level. Your agents stop being lego pieces. They become a foundry, learning from every
              conversation, and compounding into IP your competitors can’t copy.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-white font-mono text-[11px] tracking-[0.15em] uppercase hover:border-term-400/60 hover:text-term-300 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Transmissions
              </Link>
              <button
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-ink-950 font-mono text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-term-300 transition-all"
              >
                Request Access
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
