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

/** Display equation: serif-math with subscripts, in a HUD bracket. */
function Eq({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="my-8 border border-white/[0.08] bg-ink-900/70 px-6 py-6 overflow-x-auto">
      <div className="font-serif text-lg md:text-xl text-white/90 leading-relaxed whitespace-nowrap tabular-nums">
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
    label: 'Abstract',
    body: 'Supervised fine-tuning such as LoRA is lossy compression of known solutions into a constrained latent space. We propose unsupervised inductive generalization instead, via the Cognition Induction Graph (CIG): a graph that traces end-to-end multi-agent topologies and feeds an Unsupervised Automatic Prompt Optimization (APO) engine.',
  },
  {
    label: 'Mechanism',
    body: 'A Recursive Self-Improvement (RSI) loop experiments inside the problem space and distills the results into an inductive taxonomy of rules. The taxonomy acts on frozen weights through prompt-space feature projection, updated by the Taxonomic Inductive Update (TIU).',
  },
  {
    label: 'Evaluation',
    body: 'On a frozen Qwen 3 Bonsai-2 27B: a 12-point gain on the Scale Research Rubric, an 80% relative gain on OpenAI Frontier Science, and a score of 95.0 on the ARC-AGI 3 public tests.',
  },
];

const HEADLINE_STATS = [
  { value: '95.0', label: 'ARC-AGI 3 public tests score, frozen Qwen 3 Bonsai-2 27B under the CIG harness.' },
  { value: '+12', label: 'points on the Scale Research Rubric (0.41 → 0.53), versus +6 for Google RRSI.' },
  { value: '80%', label: 'relative gain on OpenAI Frontier Science (0.21 → 0.38), versus a 5-point supervised baseline.' },
];

const PILLARS = [
  {
    name: 'End-to-End Trace Logging',
    body: 'Every operational step, API call, and telemetry metric is recorded per execution, creating a fully observable directed acyclic graph.',
  },
  {
    name: 'Full Context Optimization',
    body: 'Traces provide the holistic contextual state the RSI engine needs to experiment safely during runtime, ensuring that node-level optimizations respect downstream graph dependencies.',
  },
  {
    name: 'Curated Preference Generation',
    body: 'By evaluating which runtime experiments succeed, the graph continuously generates curated preference data, fueling the inductive taxonomy for scheduled refinements.',
  },
  {
    name: 'Feedback-Driven Evaluations',
    body: 'Holistic trace context unlocks evaluation feedback loops that yield immediate impact, bypassing traditional manual intervention pipelines.',
  },
  {
    name: 'Execution Trajectory Optimization',
    body: 'By analyzing the most heavily trafficked and efficient sub-graphs, the CIG suggests structural architectural edits, including replacing probabilistic LLM formatting calls with deterministic, low-compute microservices.',
  },
];

const RESULTS = [
  { benchmark: 'Scale Research Rubric', baseline: '0.41', rssi: '0.47', cig: '0.53' },
  { benchmark: 'OpenAI Frontier Science', baseline: '0.21', rssi: '0.26', cig: '0.38' },
  { benchmark: 'ARC-AGI 3 (Public Tests)', baseline: 'N/A', rssi: 'Fails in live environments', cig: '95.0' },
];

/** Block-level formal statement (lemma / definition). */
function Formal({ kind, name, children }: { kind: string; name: string; children: ReactNode }) {
  return (
    <div className="my-8 border-l-2 border-term-400/60 bg-white/[0.02] pl-6 pr-6 py-5">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-300">
        {kind} // {name}
      </p>
      <p className="mt-3 font-serif text-lg text-white/85 leading-relaxed">{children}</p>
    </div>
  );
}

const H3 = 'font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white';
const P = 'mt-4 text-white/55 leading-relaxed';
const SUBLABEL = 'font-mono text-[11px] tracking-[0.3em] uppercase text-term-400';
const ital = 'font-serif text-white/80';


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
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border border-white/15 text-[#636363]"
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
              caption="Procept console"
              image="/blog/banner.jpg"
              imageClass="object-cover"
              header={false}
              overlay={false}
            />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ INTRODUCTION ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="01"
              label="Introduction"
              title={
                <>
                  Optimizing the <span className="font-serif ">topology</span>, not the parameters
                </>
              }
              sub="Procept Research, October 7, 2026. Escaping compression via unsupervised prompt optimization in multi-agent topologies."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-7">
            <Reveal>
              <p className="text-white/55 leading-relaxed">
                As multi-agent infrastructures scale in enterprise environments, reliance on static LLMs executing
                isolated tasks imposes systemic latency and computational constraints. Traditional methods for
                optimizing these agents rely on localized parameter updates that require explicit supervised datasets,
                and so ignore the broader architectural topology of the system. Current paradigms lean heavily on
                supervised fine-tuning such as Low-Rank Adaptation (LoRA), which acts as a lossy compression mechanism
                mapping known solutions into a constrained latent space.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-white/55 leading-relaxed">
                We introduce the <span className="text-white">Cognition Induction Graph (CIG)</span>, an
                infrastructure layer that logs, analyzes, and optimizes multi-agent execution traces in their entirety.
                By treating the agentic pipeline as a single optimizable compute graph, the system derives the full
                contextual gradients required for continual learning, without modifying the underlying model
                parameters. The CIG aggregates holistic telemetry to power an Unsupervised Automatic Prompt
                Optimization (APO) engine, a Recursive Self-Improvement (RSI) framework that experiments within the
                problem space to produce an inductive taxonomy of rules.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ EPISTEMICS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="02"
              label="The Epistemics of Continual Learning"
              title={
                <>
                  Inductive generalization vs. <span className="font-serif ">supervised compression</span>
                </>
              }
              sub="In statistical learning theory, knowledge acquisition bifurcates into two distinct methodologies."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-8">
            <Reveal>
              <h3 className={H3}>2.1 Two methodologies</h3>
              <p className={P}>
                <span className="text-white/80">Inductive generalization (unsupervised).</span> Robust learning occurs
                by expediting stochastic signals until objectives are met in a noisy environment. This requires mapping
                the constraints of the problem space concurrently with the solution space. It is inherently
                unsupervised and relies on continuous experimentation to build a generalizable inductive taxonomy.
              </p>
              <p className={P}>
                <span className="text-white/80">Supervised compression.</span> Techniques like LoRA are fundamentally
                mechanisms of target compression. Once problem constraints are provided via supervised labels, they
                convert semantic targets into the LLM latent feature space. By solving for optimal pathways via
                feed-forward layer gradients, they output condensed weights:
              </p>
              <Eq label="LoRA weight update">
                {'W′ = W + BA'}
              </Eq>
              <p className="text-white/55 leading-relaxed">
                This constitutes a lossy, surjective mapping from a semantic space to a feature space, optimized for
                computational efficiency rather than out-of-distribution generalization.
              </p>
            </Reveal>

            <Reveal>
              <h3 className={H3}>2.2 Surjective semantic projection</h3>
              <p className={P}>
                To achieve inductive generalization without the lossy dimensionality reduction of standard
                fine-tuning, we define the following property governing prompt-based feature modulation.
              </p>
              <Formal kind="Lemma 1" name="Semantic-to-Latent Surjection">
                Every semantic construct in natural language possesses a surjectively lossy but approximate
                representation within the latent feature space of a language model’s attention heads.
              </Formal>
              <p className="text-white/55 leading-relaxed">
                By Lemma 1, a dynamically generated unsupervised rubric acts as a highly effective feature-space
                projection. When prepended as a system prompt, this inductive taxonomy dynamically alters the attention
                gradients of the frozen model. This effectively mimics a weight update while maintaining the
                high-dimensional representation of natural language required to solve unseen variables.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ COGNITION INDUCTION GRAPHS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="03"
              label="Cognition Induction Graphs and Topological Optimization"
              title={
                <>
                  Compute graphs for <span className="font-serif ">cognition</span>
                </>
              }
              sub="Analogous to CUDA compute graphs, which map and optimize low-level GPU operations, CIGs trace end-to-end multi-agent topologies to identify high-density execution trajectories and systemic bottlenecks."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-7">
            <Reveal>
              <h3 className={H3}>3.1 The hardware execution analogy</h3>
              <p className={P}>
                In high-performance computing, a CUDA compute graph stores a sequence of bottom-up GPU operations and
                their memory dependencies prior to execution. By parsing the entire graph simultaneously, the driver
                traces execution paths, identifies hardware bottlenecks, and optimizes the overarching kernel dispatch.
              </p>
              <p className={P}>
                Similarly, a Cognition Induction Graph compiles agentic operations, including prompts, tool
                invocations, protocol routing, and user validations. By aggregating these components into a unified
                topological structure, the system derives semantic gradients across the entire workflow.
              </p>
            </Reveal>

            <Reveal>
              <FigurePanel
                fig="01"
                caption="A toy CIG: agentic operations aggregated into one topological structure"
                image="/blog/toyCIG.jpg"
                imageClass="object-cover"
                header={false}
                overlay={false}
              />
            </Reveal>

            <Reveal>
              <FigurePanel
                fig="02"
                caption="An agent workflow unrolled into a directed acyclic graph"
                image="/blog/unrolledDAG.jpg"
                imageClass="object-contain"
                header={false}
                overlay={false}
              >
                <p className="text-white/55 leading-relaxed">
                  Each prompt, tool call, and branch becomes a node in a single directed acyclic graph, so the whole
                  run is observable end to end and its dependencies are explicit.
                </p>
              </FigurePanel>
            </Reveal>
          </div>

          <div className="mt-16">
            <Reveal>
              <p className={`${SUBLABEL} mb-2`}>3.2 Architectural properties of the CIG</p>
              <p className="text-base text-white/55 leading-relaxed max-w-2xl mb-2">
                To execute the experimentation required for continual learning, a system must analyze the entire
                execution topology. The CIG infrastructure achieves this through five foundational mechanisms.
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
        </div>
      </section>

      {/* ═══════════════ UNSUPERVISED APO ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="04"
              label="Unsupervised APO vs. Supervised Baselines"
              title={
                <>
                  The <span className="font-serif ">Taxonomic Inductive Update</span>
                </>
              }
              sub="To contextualize the optimization mathematics, we contrast our approach with Google’s Reinforced Recursive Self-Improvement (RRSI) framework."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-8">
            <Reveal>
              <h3 className={H3}>4.1 Supervised gradient approximation</h3>
              <p className={P}>
                Google’s RRSI optimizes prompts via a central harness equation approximating gradients:
              </p>
              <Eq label="Eq. 1 // Google RRSI: supervised gradient approximation">
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
                where <span className={ital}>𝒮</span> represents the gradient of the system prompt space for semantic
                alignment, <span className={ital}>ℱ</span> is the formatting space, and{' '}
                <span className={ital}>ℰ</span>
                <sub>orig</sub> is the static set of original examples. This approach is constrained by its reliance
                on isolated, static examples and supervised targets.
              </p>
            </Reveal>

            <Reveal>
              <h3 className={H3}>4.2 The Taxonomic Inductive Update</h3>
              <p className={P}>
                Our Unsupervised APO replaces static examples with the live telemetry of the Cognition Induction
                Graph. Let <span className={ital}>𝒯</span>
                <sub>t</sub> be the inductive taxonomy of rules at time <span className={ital}>t</span>. The CIG
                optimizes via the Taxonomic Inductive Update (TIU):
              </p>
              <Eq label="Eq. 2 // Procept CIG: Taxonomic Inductive Update (TIU)">
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
                  <span className={ital}>∇</span>
                  <sub>G</sub>
                  <span className={ital}>𝒞</span> is the topological gradient of the dominant execution trajectories,
                  derived by aggregating the full-context traces of the CIG to identify which paths yield the highest
                  downstream success across the network.
                </p>
                <p>
                  <span className={ital}>𝒩</span>
                  <sub>expedition</sub> is the expeditionary random signal required for active runtime
                  experimentation. Supported by full graph context, it safely explores the problem space.
                </p>
                <p>
                  <span className={ital}>𝕀</span>
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
            <SectionHeading
              compact
              num="05"
              label="Experimental Results"
              title={
                <>
                  Frozen weights, <span className="font-serif ">measured</span>
                </>
              }
              sub="We benchmarked the CIG Unsupervised APO against Google RRSI using a constrained, frozen open-source model, Qwen 3 Bonsai-2 27B, on complex reasoning benchmarks that test generalization to unseen problem spaces."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {HEADLINE_STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 60}>
                <Stat value={stat.value} label={stat.label} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#636363]/80 mb-6">
              Table 1 // Procept CIG vs. Google RRSI (frozen Qwen 3 27B)
            </p>
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto border border-white/[0.08]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80 px-5 py-4">
                      Benchmark
                    </th>
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80 px-5 py-4">
                      Baseline (No Opt)
                    </th>
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80 px-5 py-4">
                      Google RRSI
                    </th>
                    <th className="font-mono text-[10px] tracking-[0.2em] uppercase text-term-400 px-5 py-4">
                      Procept CIG APO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((row) => (
                    <tr key={row.benchmark} className="border-b border-white/[0.06] last:border-b-0">
                      <td className="px-5 py-4 text-white/70">{row.benchmark}</td>
                      <td className="px-5 py-4 font-mono text-[#636363]/80 tabular-nums">{row.baseline}</td>
                      <td className="px-5 py-4 font-mono text-[#636363]/80 tabular-nums">{row.rssi}</td>
                      <td className="px-5 py-4 font-mono text-term-300 tabular-nums">{row.cig}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <div className="mt-12 max-w-2xl space-y-8">
            <Reveal>
              <h3 className={H3}>5.1 Comparative results</h3>
              <p className={P}>
                On the Scale Research Rubric, Google RRSI yielded a modest 6-point increase. Enabled by the
                full-context tracing of the CIG, our Unsupervised APO achieved a 12-point increase (0.41 → 0.53). The
                delta is more pronounced on OpenAI Frontier Science, where the CIG infrastructure facilitated robust
                runtime experimentation, yielding an 80% relative performance increase (0.21 → 0.38), far outpacing
                the 5-point gain of the supervised baseline.
              </p>
            </Reveal>
            <Reveal>
              <h3 className={H3}>5.2 ARC-AGI 3 evaluation</h3>
              <p className={P}>
                The most significant validation of the architecture was observed on the ARC-AGI 3 public tests.
                ARC-AGI 3 measures fluid intelligence and adaptability, domains where compressed, parameter-updated
                models classically fail. Running the frozen Qwen 3 27B model through the CIG harness resulted in an
                evaluation score of 95.0. The model dynamically experimented during runtime, treating the problem
                constraints and solution spaces iteratively.
              </p>
              <p className={P}>
                This demonstrates that heavily quantized, frozen small-parameter models can achieve frontier-level
                reasoning when governed by a topological infrastructure designed for continuous generalization.
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
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-6">06 // Conclusion</p>
            <h2 className="font-display font-semibold uppercase tracking-tight text-3xl md:text-5xl text-white leading-[1.08] max-w-3xl break-words">
              Learning at the <span className="font-serif font-normal normal-case">infrastructure</span> level
              <span className="text-term-400">.</span>
            </h2>
            <p className="mt-7 text-[#636363] max-w-2xl leading-relaxed">
              The Cognition Induction Graph is a foundational architecture for multi-agent systems. By mirroring the
              holistic optimization strategies of hardware compute graphs, CIGs aggregate end-to-end traces to expose
              bottlenecks, map optimal execution trajectories, and provide the overarching context required for safe,
              continuous experimentation.
            </p>
            <p className="mt-5 text-[#636363] max-w-2xl leading-relaxed">
              Paired with Unsupervised APO, the framework bypasses the surjective dimensionality reduction of
              traditional parameter updates and demonstrates that robust, generalizable learning can be achieved
              entirely at the infrastructure level.
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
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-ink-950 font-mono text-[11px] tracking-[0.15em] uppercase font-medium hover:text-term-400 transition-all"
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
