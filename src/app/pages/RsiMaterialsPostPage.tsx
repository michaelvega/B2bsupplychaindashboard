import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Reveal } from '../components/marketing/Reveal';
import { POSTS } from '../data/blog';

const PREREGISTRATION = [
  {
    label: 'Metric',
    body: 'The valid POSCAR generation rate (percentage of generated structures that are parseable, stoichiometrically correct, charge-balanced, possess a continuous 2D B-X network, and are free of severe steric clashes).',
  },
  {
    label: 'Baseline',
    body: 'The one-shot valid POSCAR generation rate of the base LLMs (GPT-5.6-sol and Claude Sonnet) without recursive self-improvement.',
  },
  {
    label: 'Decision Rule',
    body: 'The hypothesis is supported if the RSI-equipped pipeline achieves a ≥25% valid generation rate (a statistically significant improvement over the <5% baseline average).',
  },
];

const REFERENCES = [
  'Antunes, L. M., Butler, K. T., & Grau-Crespo, R. (2023). Crystal Structure Generation with Autoregressive Large Language Modeling. arXiv preprint arXiv:2307.04340.',
  'Deng, B., et al. (2023). CHGNet as a pretrained universal neural network potential for charge-informed atomistic modelling. Nature Machine Intelligence, 5(9), 1031-1041.',
  'Karimitari, N., et al. (2024). Accurate Crystal Structure Prediction of New 2D Hybrid Organic-Inorganic Perovskites. Journal of the American Chemical Society, 146(40), 27392-27402.',
  'Kresse, G., & Furthmüller, J. (1996). Efficient iterative schemes for ab initio total-energy calculations using a plane-wave basis set. Physical Review B, 54(16), 11169.',
  'Marchenko, E. I., et al. (2020). Database of Two-Dimensional Hybrid Perovskite Materials: Open-Access Collection of Crystal Structures, Band Gaps, and Atomic Partial Charges Predicted by Machine Learning. Chemistry of Materials, 32(17), 7383-7392.',
  'Xie, T., et al. (2021). Crystal Diffusion Variational Autoencoder for Periodic Material Generation. ICLR.',
  'Zelikman, E., et al. (2022). STaR: Bootstrapping Reasoning With Reasoning. NeurIPS, 35, 15476-15488.',
];

/** Numbered paper section heading, LaTeX style. */
function Section({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="font-academic text-xl md:text-2xl font-bold text-white mt-14 md:mt-16 mb-6">
      {num}&ensp;&ensp;{title}
    </h2>
  );
}

/**
 * Research proposal page, typeset like the LaTeX paper itself: centered
 * title block, numbered sections, justified serif text, numbered references.
 */
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
                Physics-Guided Recursive Self-Improvement for LLM-Generated Atomistic Models
              </h1>
              <p className="mt-6 font-academic text-lg md:text-xl text-white/85">Sam Carozzi, Michael Vega</p>
              <p className="mt-2 font-academic italic text-sm text-white/45">October 13, 2026</p>
              <div className="mt-10 flex items-center gap-4 justify-center">
                <span className="h-px w-16 bg-white/15" />
                <span className="h-px w-2 bg-term-400/80" />
                <span className="h-px w-16 bg-white/15" />
              </div>
            </header>
          </Reveal>

          {/* 1 Problem Statement */}
          <Reveal>
            <Section num="1" title="Problem Statement" />
            <div className="space-y-5">
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                The construction of an atomistic model is a first step in any materials simulation. Recently, large
                language models (LLMs) provide a flexible way to generate atomistic models directly from textual
                chemical descriptions, enabling rapid exploration of materials space without requiring a
                structure-specific pipeline.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                However, autoregressive generation is challenging for complex structures because the model must
                maintain chemical validity, stoichiometry, periodic connectivity, and physically reasonable geometry
                across long sequences of lattice and coordinate tokens.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                This limitation is especially severe for complex materials systems such as layered two-dimensional
                perovskites, where flexible organic spacers must be packed consistently with an extended inorganic
                B-X framework. Small errors during generation can accumulate into malformed structure files, broken
                corner-sharing networks, incorrect organic placement, or steric clashes at organic-inorganic
                interfaces.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                Our preliminary study well-demonstrates these issues. We used the frontier GPT-5.6-sol to generate ten
                structures of 2D hybrid perovskites by providing the molecular structure of the organic cations and
                inorganic compositions. Some of the structures exhibited overlapping or extremely close atoms between
                the two spacer molecules thereby forming unphysical chemical bonds. Furthermore, none of the ten
                generated structures had the correct crystallographic space groups when compared to the ground truth
                structures.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                These failures can cause severe problems during downstream atomistic simulations such as density
                functional theory (DFT) calculations, including unstable geometry relaxation, numerical divergence,
                and excessive computational costs to reach convergence. Improving the reliability of LLM-generated
                atomistic models is therefore necessary to make LLMs practical tools in modern computational
                workflows for materials research.
              </p>
            </div>
          </Reveal>

          {/* 2 Research Question */}
          <Reveal>
            <Section num="2" title="Research Question" />
            <p className="font-academic text-lg md:text-[21px] italic leading-[1.7] text-white/90 md:text-justify">
              Can physics-guided recursive self-improvement (RSI) teach an LLM to generate 2D hybrid perovskite
              structures that are physically coherent and simulation-ready?
            </p>
          </Reveal>

          {/* 3 Related Work */}
          <Reveal>
            <Section num="3" title="Related Work" />
            <div className="space-y-5">
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                Machine learning has increasingly been applied to crystal structure generation. Earlier approaches
                relied primarily on graph-based and diffusion-based representations of periodic materials (e.g.,
                CDVAE; Xie et al., 2021). More recently, crystal structure generation has been formulated as a
                language-modeling problem. Autoregressive Transformer models such as CrystalLLM encode lattice
                parameters, space-group information, atomic species, and coordinates as text sequences (Antunes et
                al., 2023; Song, 2025). However, autoregressive coordinate generation is sensitive to accumulated
                errors across long sequences.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                Two-dimensional hybrid organic-inorganic perovskites are a particularly challenging case due to their
                extended inorganic B-X octahedral networks and flexible organic spacer molecules (Marchenko et al.,
                2020). Generated structures must ultimately be validated through atomistic simulation like DFT
                (Kresse &amp; Furthmüller, 1996), but machine-learned interatomic potentials (MLIPs) like CHGNet
                provide a lower-cost alternative for screening and relaxation (Deng et al., 2023).
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                Recursive self-improvement provides a complementary strategy. The Self-Taught Reasoner (STaR) showed
                that language models can improve through repeated cycles of generation, verification, and fine-tuning
                on successful samples (Zelikman et al., 2022). This work investigates whether physically grounded
                verification can be used to iteratively improve the validity and simulation-readiness of LLM-generated
                atomistic models.
              </p>
            </div>
          </Reveal>

          {/* 4 Proposed Method */}
          <Reveal>
            <Section num="4" title="Proposed Method" />
            <div className="space-y-5">
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                We will use a frozen LLM (Qwen 3 bonsai 2 27B) to recursively self-improve at one-shot generation for
                atomic molecular models. Specifically, we employ an automatic prompt optimization technique with 200
                original atomic models to learn constraints and a generalizable inductive taxonomy so that the LLM can
                experiment and verify its own work.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                The training steps will involve analyzing the 200 original goldset datapoints to draft inductive rule
                criteria. After this first pass, we begin iteration. We will have the LLM generate 100 one-shot
                samples of atomic models. For those that fail (e.g., crashes, blank, or physically impossible models),
                the LLM will initiate recursive self-improvement. A diagnostician agent will diagnose why it
                potentially failed, and a proposal agent will propose new rules to edit the previous taxonomy. The
                model will iteratively try again with these new rules, looping until success is achieved.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                Currently, Claude Code with Sonnet bottoms out acceptance at less than 5% for 1-shot generation on
                average. We will target a 25% eventual acceptance rate for a given atomic model, converging after a
                maximum of 60 turns to pass generation as valid models.
              </p>
            </div>
          </Reveal>

          {/* 5 Evaluation Plan */}
          <Reveal>
            <Section num="5" title="Evaluation Plan" />
            <div className="space-y-5">
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                We will evaluate whether recursive self-improvement (RSI) improves the generation of valid 2D hybrid
                perovskite POSCARs. The primary baseline is one-shot generation from the original model prior to RSI,
                compared with models after successive RSI iterations.
              </p>
              <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                The main metric is the valid POSCAR generation rate, determined by checks for parseability, correct
                stoichiometry and charge balance, preservation of the input organic cation, a continuous 2D
                corner-sharing B-X network, and absence of severe steric clashes. Using experimentally reported
                structures from the NMSE 2D Perovskites Database, we will additionally compare structural descriptors.
                Generated structures will undergo standardized geometry relaxation using a pretrained MLIP (CHGNet) as
                a surrogate for computationally expensive DFT.
              </p>
            </div>
          </Reveal>

          {/* 6 Preregistration */}
          <Reveal>
            <Section num="6" title="Preregistration" />
            <ul className="space-y-5">
              {PREREGISTRATION.map((item) => (
                <li key={item.label} className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
                  <span className="font-bold text-white">{item.label}:</span> {item.body}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 7 Compute Requirements */}
          <Reveal>
            <Section num="7" title="Compute Requirements" />
            <p className="font-academic text-base md:text-[17px] font-[450] leading-[1.8] text-white/85 md:text-justify">
              A Qwen 3 bonsai 2 27B can run on 12 GB of VRAM + KV cache, fitting comfortably on one L40 or A100 GPU.
              The entire project is estimated to take around 5 million tokens across many epochs of the 200-model
              golden set. At 150 tok/s on an L40, this would take approximately 9 hours in total over the coming
              months. Individual training runs (5 to 10 epochs) would require an average of 3 hours, providing a
              comfortable margin for experimentation.
            </p>
          </Reveal>

          {/* References */}
          <Reveal>
            <h2 className="font-academic text-xl md:text-2xl font-bold text-white mt-14 md:mt-16 mb-6">References</h2>
            <ol className="space-y-4">
              {REFERENCES.map((ref, i) => (
                <li key={ref} className="flex gap-4">
                  <span className="font-academic text-[15px] text-[#636363]/80 tabular-nums shrink-0">[{i + 1}]</span>
                  <span className="font-academic text-[15px] leading-[1.75] text-white/70">{ref}</span>
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
