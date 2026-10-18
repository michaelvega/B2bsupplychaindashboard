import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Reveal } from '../components/marketing/Reveal';
import { POSTS } from '../data/blog';

const REFERENCES = [
  'Agrawal, L. A., et al. (2025). GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning. arXiv preprint arXiv:2507.19457.',
  'Chollet, F. (2019). On the Measure of Intelligence. arXiv preprint arXiv:1911.01547.',
  'Hu, E. J., et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models. arXiv preprint arXiv:2106.09685.',
  'Khattab, O., et al. (2023). DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines. arXiv preprint arXiv:2310.03714.',
  'NVIDIA. CUDA C++ Programming Guide: CUDA Graphs. NVIDIA Developer Documentation.',
  'Pryzant, R., et al. (2023). Automatic Prompt Optimization with "Gradient Descent" and Beam Search. arXiv preprint arXiv:2305.03495.',
  'Shinn, N., et al. (2023). Reflexion: Language Agents with Verbal Reinforcement Learning. arXiv preprint arXiv:2303.11366.',
  'Yuksekgonul, M., et al. (2024). TextGrad: Automatic "Differentiation" via Text. arXiv preprint arXiv:2406.07496.',
  'Zelikman, E., et al. (2022). STaR: Bootstrapping Reasoning With Reasoning. NeurIPS, 35, 15476-15488.',
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

const BODY = 'font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify';

/** Numbered paper section heading, LaTeX style. */
function Section({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="font-academic text-xl md:text-2xl font-bold text-white mt-14 md:mt-16 mb-6">
      {num}&ensp;&ensp;{title}
    </h2>
  );
}

/** Numbered subsection heading. */
function Sub({ num, title }: { num: string; title: string }) {
  return (
    <h3 className="font-academic text-lg md:text-xl font-bold text-white mt-9 mb-4">
      {num}&ensp;&ensp;{title}
    </h3>
  );
}

/** Display equation, centered with a right-aligned equation number. */
function Eq({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="my-7 flex items-center gap-4">
      <div className="min-w-0 flex-1 overflow-x-auto text-center">
        <span className="inline-block whitespace-nowrap font-academic text-lg md:text-xl text-white/90 tabular-nums">
          {children}
        </span>
      </div>
      <span className="shrink-0 font-academic text-base text-white/70 tabular-nums">({n})</span>
    </div>
  );
}

/** Citation marker. */
function C({ n }: { n: string }) {
  return <span className="text-[#636363]">[{n}]</span>;
}

/** Captioned paper figure. */
function Figure({ n, src, fit, caption }: { n: number; src: string; fit: string; caption: string }) {
  return (
    <figure className="my-9">
      <img src={src} alt={caption} className={`w-full h-auto max-h-[28rem] border border-white/[0.08] ${fit}`} />
      <figcaption className="mt-3 font-academic text-[15px] leading-[1.7] text-white/70 md:text-justify">
        <span className="font-bold text-white">Figure {n}.</span> {caption}
      </figcaption>
    </figure>
  );
}

/**
 * Research article page, typeset like the LaTeX paper itself: centered
 * title block, abstract, numbered sections, justified serif text, references.
 */
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
          className="w-full h-full object-cover opacity-[0.05] mix-blend-screen grayscale"
        />
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <MarketingNav onRequestAccess={() => setDemoOpen(true)} logoTo="/" />

      {/* ═══════════════ THE PAPER ═══════════════ */}
      <article className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-2xl mx-auto px-6 md:px-10 pt-14 md:pt-16 pb-20 md:pb-28">
          <Reveal>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-[#636363]/80 hover:text-term-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog / Index
            </Link>
          </Reveal>

          {/* Title block */}
          <Reveal delay={60}>
            <header className="text-center mt-12 md:mt-16">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-term-400 mb-6">
                Transmission {post.num} // {post.date}
              </p>
              <h1 className="font-academic text-2xl md:text-4xl font-bold text-white leading-snug text-balance">
                Cognition Induction Graphs: Escaping Compression via Unsupervised Prompt Optimization in Multi-Agent
                Topologies
              </h1>
              <p className="mt-6 font-academic text-lg md:text-xl text-white/85">Michael Vega, Sam Carozzi</p>
              <p className="mt-2 font-academic text-sm text-white/45">October 10, 2026</p>
              <div className="mt-10 flex items-center gap-4 justify-center">
                <span className="h-px w-16 bg-white/15" />
                <span className="h-px w-2 bg-term-400/80" />
                <span className="h-px w-16 bg-white/15" />
              </div>
            </header>
          </Reveal>

          {/* Abstract */}
          <Reveal>
            <div className="mt-10 mx-auto max-w-xl">
              <p className="font-academic text-center text-base font-bold text-white mb-3">Abstract</p>
              <p className="font-academic text-[15px] md:text-base font-[450] leading-[1.75] text-white/80 md:text-justify">
                Supervised fine-tuning such as LoRA <C n="3" /> is lossy compression of known solutions into a
                constrained latent space. We propose unsupervised inductive generalization instead, via the Cognition
                Induction Graph (CIG): a graph that traces end-to-end multi-agent topologies and feeds an Unsupervised
                Automatic Prompt Optimization (APO) engine. A Recursive Self-Improvement (RSI) loop experiments inside
                the problem space and distills the results into an inductive taxonomy of rules, which acts on frozen
                weights through prompt-space feature projection and is updated by the Taxonomic Inductive Update
                (TIU). On a frozen Qwen 3 Bonsai-2 27B, we observe a 12-point gain on the Scale Research Rubric, an 80%
                relative gain on OpenAI Frontier Science, and a score of 95.0 on the ARC-AGI 3 public tests.
              </p>
            </div>
          </Reveal>

          {/* 1 Introduction */}
          <Reveal>
            <Section num="1" title="Introduction" />
            <div className="space-y-5">
              <p className={BODY}>
                As multi-agent infrastructures scale in enterprise environments, reliance on static LLMs executing
                isolated tasks imposes systemic latency and computational constraints. Traditional methods for
                optimizing these agents rely on localized parameter updates that require explicit supervised datasets,
                and so ignore the broader architectural topology of the system. Current paradigms lean heavily on
                supervised fine-tuning such as Low-Rank Adaptation (LoRA) <C n="3" />, which acts as a lossy
                compression mechanism mapping known solutions into a constrained latent space.
              </p>
              <p className={BODY}>
                We introduce the Cognition Induction Graph (CIG), an infrastructure layer that logs, analyzes, and
                optimizes multi-agent execution traces in their entirety. By treating the agentic pipeline as a single
                optimizable compute graph, the system derives the full contextual gradients required for continual
                learning, without modifying the underlying model parameters. The CIG aggregates holistic telemetry to
                power an Unsupervised Automatic Prompt Optimization (APO) engine <C n="6" />, a Recursive
                Self-Improvement (RSI) framework <C n="9" /> that experiments within the problem space to produce an
                inductive taxonomy of rules. This relates to recent prompt-space and text-feedback optimizers such as
                DSPy <C n="4" />, TextGrad <C n="8" />, GEPA <C n="1" />, and Reflexion <C n="7" />, which we extend
                from single calls to the full execution topology.
              </p>
            </div>
          </Reveal>

          {/* 2 Epistemics */}
          <Reveal>
            <Section num="2" title="The Epistemics of Continual Learning" />
            <p className={BODY}>
              In statistical learning theory, knowledge acquisition bifurcates into two distinct methodologies:
              inductive generalization and supervised compression.
            </p>
            <Sub num="2.1" title="Two methodologies" />
            <div className="space-y-5">
              <p className={BODY}>
                <span className="font-bold text-white">Inductive generalization (unsupervised).</span> Robust learning
                occurs by expediting stochastic signals until objectives are met in a noisy environment. This requires
                mapping the constraints of the problem space concurrently with the solution space. It is inherently
                unsupervised and relies on continuous experimentation to build a generalizable inductive taxonomy.
              </p>
              <p className={BODY}>
                <span className="font-bold text-white">Supervised compression.</span> Techniques like LoRA{' '}
                <C n="3" /> are fundamentally mechanisms of target compression. Once problem constraints are provided
                via supervised labels, they convert semantic targets into the LLM latent feature space. By solving for
                optimal pathways via feed-forward layer gradients, they output condensed weights:
              </p>
              <Eq n={1}>{'W′ = W + BA'}</Eq>
              <p className={BODY}>
                This constitutes a lossy, surjective mapping from a semantic space to a feature space, optimized for
                computational efficiency rather than out-of-distribution generalization.
              </p>
            </div>
            <Sub num="2.2" title="Surjective semantic projection" />
            <div className="space-y-5">
              <p className={BODY}>
                To achieve inductive generalization without the lossy dimensionality reduction of standard
                fine-tuning, we define the following property governing prompt-based feature modulation.
              </p>
              <p className={`${BODY} border-l border-white/20 pl-5`}>
                <span className="font-bold text-white">Lemma 1 (Semantic-to-Latent Surjection).</span> Every semantic
                construct in natural language possesses a surjectively lossy but approximate representation within the
                latent feature space of a language model’s attention heads.
              </p>
              <p className={BODY}>
                By Lemma 1, a dynamically generated unsupervised rubric acts as a highly effective feature-space
                projection. When prepended as a system prompt, this inductive taxonomy dynamically alters the attention
                gradients of the frozen model. This effectively mimics a weight update while maintaining the
                high-dimensional representation of natural language required to solve unseen variables.
              </p>
            </div>
          </Reveal>

          {/* 3 CIGs */}
          <Reveal>
            <Section num="3" title="Cognition Induction Graphs and Topological Optimization" />
            <p className={BODY}>
              Analogous to CUDA compute graphs <C n="5" />, which map and optimize low-level GPU operations, CIGs trace
              end-to-end multi-agent topologies to identify high-density execution trajectories and systemic
              bottlenecks.
            </p>
            <Sub num="3.1" title="The hardware execution analogy" />
            <div className="space-y-5">
              <p className={BODY}>
                In high-performance computing, a CUDA compute graph stores a sequence of bottom-up GPU operations and
                their memory dependencies prior to execution <C n="5" />. By parsing the entire graph simultaneously,
                the driver traces execution paths, identifies hardware bottlenecks, and optimizes the overarching
                kernel dispatch.
              </p>
              <p className={BODY}>
                Similarly, a Cognition Induction Graph compiles agentic operations, including prompts, tool
                invocations, protocol routing, and user validations. By aggregating these components into a unified
                topological structure, the system derives semantic gradients across the entire workflow (Figure 1).
              </p>
            </div>
            <Figure
              n={1}
              src="/blog/toyCIG.jpg"
              fit="object-cover"
              caption="A toy CIG: agentic operations aggregated into one topological structure."
            />
            <Figure
              n={2}
              src="/blog/unrolledDAG.jpg"
              fit="object-contain"
              caption="An agent workflow unrolled into a directed acyclic graph. Each prompt, tool call, and branch becomes a node in a single graph, so the whole run is observable end to end and its dependencies are explicit."
            />
            <Sub num="3.2" title="Architectural properties of the CIG" />
            <p className={BODY}>
              To execute the experimentation required for continual learning, a system must analyze the entire
              execution topology. The CIG infrastructure achieves this through five foundational mechanisms.
            </p>
            <ol className="mt-5 space-y-5">
              {PILLARS.map((pillar, i) => (
                <li key={pillar.name} className={BODY}>
                  <span className="font-bold text-white">
                    ({i + 1}) {pillar.name}.
                  </span>{' '}
                  {pillar.body}
                </li>
              ))}
            </ol>
          </Reveal>

          {/* 4 APO */}
          <Reveal>
            <Section num="4" title="Unsupervised APO versus Supervised Baselines" />
            <p className={BODY}>
              To contextualize the optimization mathematics, we contrast our approach with Google’s Reinforced
              Recursive Self-Improvement (RRSI) framework.
            </p>
            <Sub num="4.1" title="Supervised gradient approximation" />
            <div className="space-y-5">
              <p className={BODY}>
                Google’s RRSI optimizes prompts via a central harness equation approximating gradients:
              </p>
              <Eq n={2}>
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
              <p className={BODY}>
                where 𝒮 represents the gradient of the system prompt space for semantic alignment, ℱ is the
                formatting space, and ℰ<sub>orig</sub> is the static set of original examples. This approach is
                constrained by its reliance on isolated, static examples and supervised targets.
              </p>
            </div>
            <Sub num="4.2" title="The Taxonomic Inductive Update" />
            <div className="space-y-5">
              <p className={BODY}>
                Our Unsupervised APO replaces static examples with the live telemetry of the Cognition Induction
                Graph. Let 𝒯<sub>t</sub> be the inductive taxonomy of rules at time t. The CIG optimizes via the
                Taxonomic Inductive Update (TIU):
              </p>
              <Eq n={3}>
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
              <p className={BODY}>
                Here ∇<sub>G</sub>𝒞 is the topological gradient of the dominant execution trajectories, derived by
                aggregating the full-context traces of the CIG to identify which paths yield the highest downstream
                success across the network. 𝒩<sub>expedition</sub> is the expeditionary random signal required for
                active runtime experimentation; supported by full graph context, it safely explores the problem space.
                𝕀<sub>unsup</sub> is the unsupervised inductive abstraction operator that distills experimental graph
                successes into generalized semantic rules. The loop of generation, verification, and update is in the
                lineage of self-taught reasoning <C n="9" />, but operates on a rule taxonomy in prompt space rather
                than on model weights.
              </p>
            </div>
          </Reveal>

          {/* 5 Results */}
          <Reveal>
            <Section num="5" title="Experimental Results" />
            <p className={BODY}>
              We benchmarked the CIG Unsupervised APO against Google RRSI using a constrained, frozen open-source
              model, Qwen 3 Bonsai-2 27B, on complex reasoning benchmarks that test generalization to unseen problem
              spaces. Table 1 summarizes the results.
            </p>

            <div className="mt-8">
              <p className="font-academic text-[15px] text-white/70 mb-3 text-center">
                <span className="font-bold text-white">Table 1.</span> Procept CIG versus Google RRSI (frozen Qwen 3
                27B).
              </p>
              <div className="overflow-x-auto border-y border-white/25">
                <table className="w-full text-left font-academic text-[15px] min-w-[30rem]">
                  <thead>
                    <tr className="border-b border-white/15 text-white">
                      <th className="px-3 py-3 font-bold">Benchmark</th>
                      <th className="px-3 py-3 font-bold">Baseline (No Opt)</th>
                      <th className="px-3 py-3 font-bold">Google RRSI</th>
                      <th className="px-3 py-3 font-bold">Procept CIG APO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESULTS.map((row) => (
                      <tr key={row.benchmark} className="border-b border-white/[0.06] last:border-b-0">
                        <td className="px-3 py-3 text-white/80">{row.benchmark}</td>
                        <td className="px-3 py-3 text-[#636363] tabular-nums">{row.baseline}</td>
                        <td className="px-3 py-3 text-[#636363] tabular-nums">{row.rssi}</td>
                        <td className="px-3 py-3 text-white tabular-nums font-bold">{row.cig}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Sub num="5.1" title="Comparative results" />
            <p className={BODY}>
              On the Scale Research Rubric, Google RRSI yielded a modest 6-point increase. Enabled by the full-context
              tracing of the CIG, our Unsupervised APO achieved a 12-point increase (0.41 → 0.53). The delta is more
              pronounced on OpenAI Frontier Science, where the CIG infrastructure facilitated robust runtime
              experimentation, yielding an 80% relative performance increase (0.21 → 0.38), far outpacing the 5-point
              gain of the supervised baseline.
            </p>

            <Sub num="5.2" title="ARC-AGI 3 evaluation" />
            <div className="space-y-5">
              <p className={BODY}>
                The most significant validation of the architecture was observed on the ARC-AGI 3 public tests.
                ARC-AGI 3 measures fluid intelligence and adaptability <C n="2" />, domains where compressed,
                parameter-updated models classically fail. Running the frozen Qwen 3 27B model through the CIG harness
                resulted in an evaluation score of 95.0. The model dynamically experimented during runtime, treating
                the problem constraints and solution spaces iteratively.
              </p>
              <p className={BODY}>
                This demonstrates that heavily quantized, frozen small-parameter models can achieve frontier-level
                reasoning when governed by a topological infrastructure designed for continuous generalization.
              </p>
            </div>
          </Reveal>

          {/* 6 Conclusion */}
          <Reveal>
            <Section num="6" title="Conclusion" />
            <div className="space-y-5">
              <p className={BODY}>
                The Cognition Induction Graph is a foundational architecture for multi-agent systems. By mirroring the
                holistic optimization strategies of hardware compute graphs, CIGs aggregate end-to-end traces to expose
                bottlenecks, map optimal execution trajectories, and provide the overarching context required for
                safe, continuous experimentation.
              </p>
              <p className={BODY}>
                Paired with Unsupervised APO, the framework bypasses the surjective dimensionality reduction of
                traditional parameter updates and demonstrates that robust, generalizable learning can be achieved
                entirely at the infrastructure level.
              </p>
            </div>
          </Reveal>

          {/* References */}
          <Reveal>
            <h2 className="font-academic text-xl md:text-2xl font-bold text-white mt-14 md:mt-16 mb-6">References</h2>
            <ol className="space-y-4">
              {REFERENCES.map((ref, i) => (
                <li key={ref} className="flex gap-4">
                  <span className="font-academic text-[15px] text-[#636363]/80 tabular-nums shrink-0">[{i + 1}]</span>
                  <span className="font-academic text-[15px] leading-[1.75] text-white/70 min-w-0 break-words">
                    {ref}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Back link */}
          <Reveal>
            <div className="mt-16 pt-8 border-t border-white/[0.08] flex items-center justify-between">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-[#636363]/80 hover:text-term-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Transmissions
              </Link>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/25">PDF · v1.0</span>
            </div>
          </Reveal>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
