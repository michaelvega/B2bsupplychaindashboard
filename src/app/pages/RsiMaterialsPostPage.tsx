import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Stat } from '../components/marketing/Stat';
import { Reveal } from '../components/marketing/Reveal';
import { POSTS } from '../data/blog';

const TLDR = [
  {
    label: 'The problem',
    body: 'LLMs generate atomistic models directly from text, but autoregressive generation breaks down on complex structures. Across ten GPT-5.6-sol generated 2D perovskites, some formed unphysical bonds and none matched the correct space groups.',
  },
  {
    label: 'The question',
    body: 'Can physics-guided recursive self-improvement (RSI) teach an LLM to generate 2D hybrid perovskite structures that are physically coherent and simulation-ready?',
  },
  {
    label: 'The plan',
    body: 'A frozen Qwen 3 Bonsai-2 27B loops through generate, diagnose, propose, and retry against a 200-model goldset, targeting a 25% valid one-shot POSCAR rate versus a <5% baseline, verified by CHGNet relaxation.',
  },
];

const HEADLINE_STATS = [
  { value: '0/10', label: 'generated structures had the correct crystallographic space group, across ten GPT-5.6-sol attempts at 2D hybrid perovskites.' },
  { value: '<5%', label: 'one-shot valid generation acceptance for Claude Code with Sonnet today, the baseline this proposal must beat.' },
  { value: '25%', label: 'valid POSCAR generation rate, the preregistered decision threshold for the RSI-equipped pipeline.' },
  { value: '9 HRS', label: 'estimated total compute: roughly 5 million tokens at 150 tok/s on a single L40.' },
];

const METHOD_STEPS = [
  {
    name: 'Learn the Constraints',
    body: 'Analyze the 200 original goldset atomistic models to draft inductive rule criteria and a generalizable inductive taxonomy for the target material class.',
  },
  {
    name: 'Generate One-Shot Samples',
    body: 'A frozen Qwen 3 Bonsai-2 27B generates 100 one-shot atomic model samples against the current taxonomy.',
  },
  {
    name: 'Diagnose Failures',
    body: 'For every sample that fails (crashes, blanks, or physically impossible models), a diagnostician agent determines why it likely failed.',
  },
  {
    name: 'Propose New Rules',
    body: 'A proposal agent drafts new rules to edit the previous taxonomy.',
  },
  {
    name: 'Loop Until Valid',
    body: 'The model retries with the new rules and repeats, capped at 60 turns per model, converging on a 25% eventual acceptance rate.',
  },
];

const METHOD_STATS = [
  { value: '200', label: 'goldset atomistic models used to learn the constraints.' },
  { value: '100', label: 'one-shot samples generated per iteration.' },
  { value: '60', label: 'max turns to converge on a valid model.' },
  { value: '25%', label: 'targeted eventual acceptance rate.' },
];

const EVALUATION_ROWS = [
  {
    label: 'Baseline',
    body: 'One-shot generation from the original model prior to RSI, compared with models after successive RSI iterations.',
  },
  {
    label: 'Metric',
    body: 'The valid POSCAR generation rate: parseable, correct stoichiometry and charge balance, preservation of the input organic cation, a continuous 2D corner-sharing B-X network, and absence of severe steric clashes.',
  },
  {
    label: 'Verification',
    body: 'Structural descriptors compared against experimentally reported structures from the NMSE 2D Perovskites Database, followed by standardized geometry relaxation with a pretrained MLIP (CHGNet) as a surrogate for expensive DFT.',
  },
];

const PREREGISTRATION = [
  {
    label: 'Metric',
    body: 'The valid POSCAR generation rate: the percentage of generated structures that are parseable, stoichiometrically correct, charge-balanced, possess a continuous 2D B-X network, and are free of severe steric clashes.',
  },
  {
    label: 'Baseline',
    body: 'The one-shot valid POSCAR generation rate of the base LLMs (GPT-5.6-sol and Claude Sonnet) without recursive self-improvement.',
  },
  {
    label: 'Decision Rule',
    body: 'The hypothesis is supported if the RSI-equipped pipeline achieves a ≥25% valid generation rate, a statistically significant improvement over the <5% baseline average.',
  },
];

const COMPUTE_STATS = [
  { value: '12 GB', label: 'VRAM plus KV cache, fitting comfortably on one L40 or A100 GPU.' },
  { value: '~5M', label: 'tokens across many epochs of the 200-model goldset.' },
  { value: '150', label: 'tokens per second on an L40, roughly 9 hours total over the coming months.' },
  { value: '3 HRS', label: 'average per training run at 5 to 10 epochs, a comfortable margin for experimentation.' },
];

const REFERENCES = [
  'Antunes, L. M., Butler, K. T., & Grau-Crespo, R. (2023). Crystal Structure Generation with Autoregressive Large Language Modeling. arXiv:2307.04340.',
  'Deng, B., et al. (2023). CHGNet as a pretrained universal neural network potential for charge-informed atomistic modelling. Nature Machine Intelligence, 5(9), 1031-1041.',
  'Karimitari, N., et al. (2024). Accurate Crystal Structure Prediction of New 2D Hybrid Organic-Inorganic Perovskites. JACS, 146(40), 27392-27402.',
  'Kresse, G., & Furthmüller, J. (1996). Efficient iterative schemes for ab initio total-energy calculations using a plane-wave basis set. Physical Review B, 54(16), 11169.',
  'Marchenko, E. I., et al. (2020). Database of Two-Dimensional Hybrid Perovskite Materials: Open-Access Collection of Crystal Structures, Band Gaps, and Atomic Partial Charges Predicted by Machine Learning. Chemistry of Materials, 32(17), 7383-7392.',
  'Xie, T., et al. (2021). Crystal Diffusion Variational Autoencoder for Periodic Material Generation. ICLR.',
  'Zelikman, E., et al. (2022). STaR: Bootstrapping Reasoning With Reasoning. NeurIPS, 35, 15476-15488.',
];

/** Research proposal page: physics-guided RSI for LLM-generated atomistic models. */
export function RsiMaterialsPostPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const post = POSTS.find((p) => p.slug === 'rsi_materials_sci');

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
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">TLDR</p>
          </Reveal>
          <div className="space-y-4">
            {TLDR.map((item, i) => (
              <Reveal key={item.label} delay={i * 60}>
                <div className="grid grid-cols-12 gap-x-6 gap-y-3 border-l-2 border-term-400/60 pl-6 py-2">
                  <div className="col-span-12 md:col-span-3">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">{item.label}</span>
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

      {/* ═══════════════ HEADLINE STATS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-18">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">Data // The baseline and the target</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HEADLINE_STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 60}>
                <Stat value={stat.value} label={stat.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 01 PROBLEM STATEMENT ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">01 // Problem Statement</p>
          </Reveal>
          <div className="max-w-2xl space-y-7">
            <Reveal>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                The construction of an atomistic model is the first step in any materials simulation. Large language
                models offer a flexible way to generate atomistic models directly from textual chemical descriptions,
                enabling rapid exploration of materials space without requiring a structure-specific pipeline.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                Autoregressive generation, however, struggles with complex structures: the model must maintain chemical
                validity, stoichiometry, periodic connectivity, and physically reasonable geometry across long
                sequences of lattice and coordinate tokens.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                This limitation is especially severe for layered two-dimensional perovskites, where flexible organic
                spacers must be packed consistently with an extended inorganic B-X framework. Small errors during
                generation can accumulate into malformed structure files, broken corner-sharing networks, incorrect
                organic placement, or steric clashes at organic-inorganic interfaces.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                Our preliminary study demonstrates these issues. We used the frontier GPT-5.6-sol to generate ten
                structures of 2D hybrid perovskites, providing the molecular structure of the organic cations and the
                inorganic compositions. Some of the structures exhibited overlapping or extremely close atoms between
                the two spacer molecules, forming unphysical chemical bonds. None of the ten generated structures had
                the correct crystallographic space groups when compared to ground truth.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                These failures cause severe problems during downstream atomistic simulations such as density
                functional theory (DFT) calculations, including unstable geometry relaxation, numerical divergence, and
                excessive computational cost to reach convergence. Improving the reliability of LLM-generated
                atomistic models is necessary to make LLMs practical tools in modern computational workflows for
                materials research.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 02 RESEARCH QUESTION ═══════════════ */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 z-[45] pointer-events-none opacity-[0.05]" aria-hidden>
          <img src="/inspo/particles1.png" alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-20 md:py-26">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">02 // Research Question</p>
            <div className="border-l-2 border-term-400 pl-8 md:pl-12">
              <p className="font-serif italic text-3xl md:text-5xl text-white leading-tight max-w-3xl">
                Can physics-guided recursive self-improvement (RSI) teach an LLM to generate 2D hybrid perovskite
                structures that are physically coherent and simulation-ready?
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 03 RELATED WORK ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">03 // Related Work</p>
          </Reveal>
          <div className="max-w-2xl space-y-7">
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                Machine learning has increasingly been applied to crystal structure generation. Earlier approaches
                relied primarily on graph-based and diffusion-based representations of periodic materials, such as
                CDVAE. More recently, crystal structure generation has been formulated as a language-modeling problem:
                autoregressive Transformer models such as CrystalLLM encode lattice parameters, space-group
                information, atomic species, and coordinates as text sequences. Autoregressive coordinate generation,
                however, is sensitive to accumulated errors across long sequences.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                Two-dimensional hybrid organic-inorganic perovskites are a particularly challenging case due to their
                extended inorganic B-X octahedral networks and flexible organic spacer molecules. Generated structures
                must ultimately be validated through atomistic simulation like DFT, but machine-learned interatomic
                potentials (MLIPs) like CHGNet provide a lower-cost alternative for screening and relaxation.
                Recursive self-improvement offers a complementary strategy: the Self-Taught Reasoner (STaR) showed that
                language models improve through repeated cycles of generation, verification, and fine-tuning on
                successful samples. This work investigates whether physically grounded verification can be used to
                iteratively improve the validity and simulation-readiness of LLM-generated atomistic models.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 PROPOSED METHOD ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-2">04 // Proposed Method</p>
            <p className="text-base text-white/55 leading-relaxed max-w-2xl mb-12">
              A frozen LLM recursively self-improves at one-shot generation for atomic molecular models, using an
              automatic prompt optimization technique over 200 original atomic models.
            </p>
          </Reveal>

          {METHOD_STEPS.map((step, i) => (
            <Reveal key={step.name}>
              <div className="grid grid-cols-12 gap-x-6 gap-y-4 border-t border-white/[0.08] py-8 md:py-10">
                <div className="col-span-12 md:col-span-2">
                  <span className="font-mono text-sm text-term-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="col-span-12 md:col-span-10">
                  <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white leading-[1.2]">
                    {step.name}
                  </h3>
                  <p className="mt-3 text-white/55 leading-relaxed">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
              {METHOD_STATS.map((stat) => (
                <div key={stat.value} className="border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="font-mono text-2xl text-term-300 tabular-nums">{stat.value}</p>
                  <p className="mt-2 text-xs text-white/50 leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 05 EVALUATION PLAN ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">05 // Evaluation Plan</p>
          </Reveal>
          <div className="space-y-4">
            {EVALUATION_ROWS.map((row, i) => (
              <Reveal key={row.label} delay={i * 60}>
                <div className="grid grid-cols-12 gap-x-6 gap-y-3 border-l-2 border-term-400/60 pl-6 py-2">
                  <div className="col-span-12 md:col-span-3">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">{row.label}</span>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <p className="text-white/65 leading-relaxed">{row.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 06 PREREGISTRATION ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">06 // Preregistration</p>

            <div className="border border-white/[0.08] bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-2.5">
                <span className="font-mono text-[10px] tracking-[0.2em] text-term-400">REGISTERED BEFORE RUNS</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">NO HARKING</span>
              </div>
              {PREREGISTRATION.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-12 gap-x-6 gap-y-2 px-5 md:px-6 py-5 ${i < PREREGISTRATION.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
                >
                  <div className="col-span-12 md:col-span-3">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">{row.label}</span>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <p className="text-sm text-white/55 leading-relaxed">{row.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ 07 COMPUTE REQUIREMENTS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">07 // Compute Requirements</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPUTE_STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 60}>
                <div className="border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="font-mono text-2xl text-term-300 tabular-nums">{stat.value}</p>
                  <p className="mt-2 text-xs text-white/50 leading-relaxed">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ REFERENCES ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-20">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">References</p>
            <ol className="space-y-3 max-w-3xl">
              {REFERENCES.map((ref, i) => (
                <li key={ref} className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-term-400 tabular-nums shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-[12px] text-white/45 leading-relaxed">{ref}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ CLOSING ═══════════════ */}
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
              Generate. Verify.
              <br />
              Diagnose. <span className="text-term-400">Repeat.</span>
            </h2>
            <p className="mt-7 text-white/60 max-w-2xl leading-relaxed">
              Physics-guided recursive self-improvement turns structure generation into a closed loop: generate,
              verify against physical constraints, diagnose the failure, and retry, until the model is
              simulation-ready. The loop is preregistered, the goldset is fixed, and the decision rule is public
              before the first run.
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
