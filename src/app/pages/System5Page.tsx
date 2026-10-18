import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Stat } from '../components/marketing/Stat';
import { Reveal } from '../components/marketing/Reveal';
import { SectionHeading } from '../components/marketing/SectionHeading';
import { FigurePanel } from '../components/marketing/FigurePanel';

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

/** A single quadrant of the blue-ocean map. */
function Quadrant({
  name,
  players,
  blurb,
  ours,
}: {
  name: string;
  players: string;
  blurb: string;
  ours?: boolean;
}) {
  return (
    <div
      className={`relative border p-5 md:p-7 ${
        ours ? 'border-term-400/50 bg-term-400/[0.07]' : 'border-white/[0.08] bg-white/[0.02]'
      }`}
    >
      {ours && (
        <span className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.2em] uppercase text-term-300">
          ◈ Procept
        </span>
      )}
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80">{players}</p>
      <h4 className="mt-2 font-display text-base md:text-lg uppercase tracking-tight text-white leading-[1.15]">
        {name}
      </h4>
      <p className="mt-3 text-sm text-white/55 leading-relaxed">{blurb}</p>
    </div>
  );
}

const TOC = [
  { label: 'Intro', text: 'The problem: your multi-agent harness does not learn from its mistakes, so failures compound and costs exponentiate.' },
  { label: '01 History', text: 'How the market moved from static chains to graphs that rewrite themselves in production.' },
  { label: '02 What is a 24/7 Operational Harness?', text: 'The always-on, continuously self-improving team of agents, and what separates it from a session that ends.' },
  { label: '03 Problems with 24/7 Operational Harnesses', text: 'The failure modes behind the 85% of multi-agent implementations that never return a dollar of ROI.' },
  { label: '04 A brief overview of our product', text: 'Procept Foundry, the Cognitive Induction Graph, and the Recursive Self-Improvement engine underneath it.' },
  { label: '05 Enterprise walkthrough (Mathematics Corp)', text: 'A live deployment of the CIG and its 27% reduction in shipped bugs.' },
  { label: '06 The future: competitive landscape', text: 'How Procept Foundry sits against Claude Code, LangChain, n8n, Dots, and GrokBot.' },
  { label: '07 Our moat', text: 'Why the graph, the telemetry, and the self-improving loop are expensive to copy.' },
  { label: 'Technical Appendix', text: 'The RSI mechanics, the benchmark tables, and the equations behind every claim.' },
];

const KEY_TERMS = [
  { label: 'AGI & ARC-AGI 3', text: 'AGI is a system that matches human breadth and adaptability rather than acing one narrow task. ARC-AGI 3 is the benchmark that measures that fluid intelligence and adaptability.' },
  { label: 'Recursive Self-Improvement', text: 'RSI learns the rubric by experimentation while the model itself stays frozen. It is unsupervised: no labelled answer key, no human in the loop.' },
  { label: 'Cognitive Induction Graph', text: 'A CIG compiles every prompt, tool call, API call, and agent trajectory into one optimizable compute graph. We then optimize the whole workflow instead of isolated examples.' },
  { label: 'Coding Harnesses', text: 'Claude Code is the reference harness, where emergent subagent communities form to attack a problem. They are ephemeral, dying with the session.' },
  { label: 'Agent plumbing', text: 'LangChain and n8n are the popular way to wire agents today. They are static, manual, and brittle: you assemble the graph by hand and it stays where you left it.' },
  { label: '24/7 Operational Harnesses', text: 'A 24/7 Operational Harness is a team of always-on agents that continuously self-improves. Dots and GrokBot are current examples.' },
];

const HISTORY = [
  {
    name: 'LangChain',
    bullets: [
      'Agent plumbing arrived first, and LangChain framed orchestration as manual sculpture: static wiring, hand-tuned chains at every node. It holds until the world moves.',
      'Change a tool, a prompt, or an API and the whole chain has to be re-chiseled by hand. The structure is brittle by construction, and it snaps the first time reality refuses to sit still.',
    ],
  },
  {
    name: 'Scale AI',
    bullets: [
      'We worked inside Scale AI’s data engine, where the reflex for any weak model was more labels. Fine-tuning with LoRA baked the answers directly into the weights.',
      'That is compression, not learning. The model memorizes exactly what it was shown and fails the moment the problem shifts.',
    ],
  },
  {
    name: 'Claude Code',
    bullets: [
      'Claude Code proved a coding harness could do serious work, spawning emergent subagent communities that behaved like real teams. At big firms the founder watched them stay in the build lane, rarely trusted to operate anything the business runs on.',
      'Those teams are ephemeral: they die with the session and take their lessons with them. Anthropic burns roughly $5k per month per pro user and holds the line largely on endless venture capital.',
    ],
  },
  {
    name: 'The New Frontier',
    bullets: [
      'The frontier then moved from wiring to learning. Where LangChain froze structure and LoRA froze answers, the next class of systems learns the rule instead.',
      'Recursive self-improvement is that shift: the model stays frozen while the system experiments its way to the rubric that governs it, unsupervised.',
    ],
  },
];

const HARNESS_BULLETS = [
  'Before, harnesses like Claude Code were instruments for individuals building: a code harness, ephemeral by design. A 24/7 Operational Harness is a true new team member conducting user operations, running around the clock, continually storing memories, and working independently.',
  'The players are already here: Dots, GrokBot, and Procept Foundry, our user-facing aspect of 24/7 operations. We build the whole stack beneath it, not just the surface.',
  'The industry moves inexorably in this direction, especially as we approach AGI and true human-capable robotic teammates. The always-on harness is not a feature race; it is the default shape of work to come.',
];

const WHY_NOW = [
  { label: 'Cognitive induction graphs', text: 'They run without GPUs, because the model stays frozen and the learning stays unsupervised. Improvement lives in the graph, not the weights, so there is nothing to retrain.' },
  { label: 'Self-hosting a small language model', text: 'Running this big-picture context on GPT would cost over $5,000 a month. Owning a small model keeps an always-on harness affordable.' },
  { label: 'Recursive self-improvement', text: 'RSI is what powers the CIG, letting the graph solve for the rubric instead of the answer. Without it, the graph is only an expensive log.' },
];

const SOLVES = [
  { label: 'Quality', text: 'The harness is self-healing, learning from its own mistakes and rewriting the rules that caused them. In one enterprise deployment that discipline cut shipped bugs by 27%.' },
  { label: 'Cost', text: 'You pay small-model cost for large-model quality, a flat monthly rate rather than a per-token bill. A frozen Qwen 3 Bonsai-2 27B scoring 95% on ARC-AGI 3 for a $35 budget is the proof.' },
  { label: 'Implementation', text: 'We run the whole stack, so there is no AI team to stand up, no GPUs to procure, and no workflow to re-chisel each time the world shifts. You get a self-hosted harness, not another integration project.' },
];

const WALKTHROUGH = [
  'We targeted users to upsell, by extending the conversation at the moment it was about to end or weaving other options straight into the chat. The graph made the high-value branches visible, so the agent could steer toward them.',
  'We targeted users to spend more time with the agent, or less when speed was the point. Sessions stretched or shortened to match what each customer actually needed.',
  'We had the AI learn new tools it had been struggling with. The graph isolated where the failures clustered, and RSI worked the rubric until those tools finally clicked.',
  'We cut latency and reduced tool calling while holding quality steady. Deterministic microservices replaced probabilistic formatting calls, and the agent stopped spending calls on work that did not need them.',
  'We reduced shipped bugs by 27%, including a stale failure where one bad tool call was silently retried over 100 times. The graph exposed that loop the moment it was plotted, and the retry died with it.',
];

const LAYERS = [
  {
    name: '24/7 Operational Harnesses (Dots, GrokBot)',
    definition: '24/7 Operational Harnesses are always-on teams of agents that keep working and keep improving themselves without a human in the loop. Dots and GrokBot are the clearest examples of the pattern.',
    better: 'By tracking the big picture and learning from its mistakes, Procept Foundry is a best-in-class 24/7 Operational Harness. It turns your customer workflows into company IP that grows in value over time.',
  },
  {
    name: 'Coding Harnesses (Claude Code)',
    definition: 'Coding harnesses like Claude Code are built to write code, spinning up emergent subagent communities to attack a repository. They are ephemeral by design: the community dies with the session.',
    better: 'Repurposing a coding harness for operations introduces failure modes and cybersecurity threat vectors it was never built to carry. Procept Foundry is purpose-built for always-on operations.',
  },
  {
    name: 'Agentic Plumbing (LangChain, OpenClaw)',
    definition: 'Agentic plumbing, LangChain and OpenClaw among it, is the 2023 worldview: static chains wired by hand, one block stacked on the next. It gives you brittle legos where operations need living cells.',
    better: 'Static wiring cannot adapt when a dependency shifts, so the whole chain breaks the moment the world changes. Procept Foundry replaces it with a self-healing, self-rewriting graph.',
  },
  {
    name: 'Model Provider (ChatGPT, Qwen)',
    definition: 'Model providers like ChatGPT and Qwen supply the raw intelligence underneath every harness. They own the weights, the pricing, and the ceiling on what the system can reason about.',
    better: 'We self-host your model on your own infrastructure, or pair Procept Foundry with a model key you already trust. Self-hosting is optional, never a requirement.',
  },
  {
    name: 'Self-Hosting (vLLM, Ollama)',
    definition: 'Self-hosting stacks like vLLM and Ollama run an open model on your own hardware, with no per-token bill and full control over your data. The trade is that you operate every part of it yourself.',
    better: 'Procept Foundry sets up, maintains, and manages that stack for you. You keep the control and the data residency of self-hosting without carrying the operational tax.',
  },
  {
    name: 'GPU (Bare Metal, ThunderCompute / Runpod)',
    definition: 'GPU is the floor of the stack: bare metal, or capacity rented by the hour from brokers like ThunderCompute and Runpod. It is where every token is actually computed, and where the real bill is set.',
    better: 'We broker this compute for you and find the guaranteed cheapest stack to run on. You pay for what the workload needs, not for idle capacity.',
  },
];

const QUADRANTS = [
  { name: 'Observability & Evals', players: 'LangSmith · Braintrust · Arize', blurb: 'Purely observational and reactive logging. Tells you when tasks fail without fixing them.' },
  { name: 'Autonomous Runtime', players: 'PROCEPT', blurb: 'Active execution layer with continuous self-improvement and automated closed-loop optimization.', ours: true },
  { name: 'Orchestration & Routers', players: 'LangGraph · CrewAI · AutoGen', blurb: 'Stateless wiring and static agent definitions. Relies 100% on external APIs for thinking.' },
  { name: 'Hosting & Compute', players: 'AWS Bedrock · Azure · vLLM', blurb: 'Hosts raw models and infrastructure without training or self-optimizing capabilities.' },
];

const MOAT_QUOTE =
  'Your marketing team tells you that you sell togetherness and family… but let’s be honest, you sell minutes, period… So how do we get those minutes back? We reinvent the cell phone. We put a computer in it, we put the internet in it… You can tell your marketing team you’re not selling togetherness anymore. You’re selling self-reliance.';

const MOATS = [
  'We do not charge by token, we charge a flat, agreed-upon monthly rate. We believe every AI service will one day do the same, the way cell phones moved from billing by the minute and text to a flat monthly data plan.',
  'We sell end-user behavior, not bug reduction or cost savings.',
  'This is a new product category: we believe Cognitive Induction Graphs will be the operating system of 24/7 Operational Harnesses, from bare metal to end user. We replace five layers of the AI stack rather than improving one or two KPIs, so it is substitution, not addition. We welcome and encourage competition, because we want the whole System 5 pie to grow.',
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
    name: 'Execution Workflow Optimization',
    body: 'Analyzing the most heavily trafficked and efficient sub-graphs surfaces structural edits, for example swapping a probabilistic LLM formatting call for a deterministic, low-compute microservice.',
  },
];

const RESULTS = [
  { benchmark: 'Scale Research Rubric', baseline: '0.41', rssi: '0.47', cig: '0.53' },
  { benchmark: 'OpenAI Frontier Science', baseline: '0.21', rssi: '0.26', cig: '0.38' },
  { benchmark: 'ARC-AGI 3 (Public Tests)', baseline: 'N/A', rssi: 'Fails in live environments', cig: '95.0' },
];

const SYSTEMS = [
  { label: 'System 1:', value: 'Decision Making (Jev)' },
  { label: 'System 2:', value: 'Reasoning (ChatGPT)' },
  { label: 'System 3:', value: 'Coordination (Claude Code)' },
  { label: 'System 4:', value: 'Digital Twins (Palantir Foundry)' },
];

const SYSTEM_5 = {
  label: 'System 5:',
  value: 'All of the Above (Procept’s System 5)',
  lines: ['Metacognitive', 'Self healing', 'Auto implementation of new value streams'],
};

export function System5Page() {
  const [demoOpen, setDemoOpen] = useState(false);

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
              to="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-[#636363]/80 hover:text-term-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Procept
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-10 flex items-center gap-3">
              <span className="h-px w-10 bg-term-400/70" />
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400">System 5</p>
            </div>

            <h1 className="mt-8 font-display font-semibold uppercase tracking-tight leading-[1.08] text-white text-3xl md:text-5xl xl:text-6xl max-w-4xl break-words">
              System 5{' '}
              <span className="font-serif font-normal normal-case text-[#636363]">
                (the operating system for 24/7 Operational Harnesses)
              </span>
            </h1>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80">
              <span>Procept</span>
              <span className="text-[#636363]/60">/</span>
              <span>2026</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ TABLE OF CONTENTS + KEY TERMS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-18">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">
              What we will go over in this article
            </p>
          </Reveal>
          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12 md:col-span-6">
              <div className="space-y-0">
                {TOC.map((item, i) => (
                  <Reveal key={item.label} delay={i * 40}>
                    <div className="grid grid-cols-12 gap-x-4 gap-y-1 border-t border-white/[0.06] py-4">
                      <div className="col-span-12 md:col-span-5">
                        <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/70">
                          {item.label}
                        </span>
                      </div>
                      <div className="col-span-12 md:col-span-7">
                        <p className="text-sm text-[#636363]/80 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 md:border-l md:border-white/[0.06] md:pl-10">
              <Reveal>
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#636363]/80 mb-6">Key terms</p>
              </Reveal>
              <div className="space-y-0">
                {KEY_TERMS.map((term, i) => (
                  <Reveal key={term.label} delay={i * 40}>
                    <div className="border-t border-white/[0.06] py-4">
                      <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-term-300">
                        {term.label}
                      </span>
                      <p className="mt-2 text-sm text-[#636363] leading-relaxed">{term.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
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
              header={false}
              overlay={false}
            />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ INTRO ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">Intro</p>
          </Reveal>
          <div className="max-w-2xl space-y-7">
            <Reveal>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                Your multi-agent harness does not learn from its mistakes, so costs compound with every cycle and
                failures detonate in front of your users. The open-source alternative is no escape: self-hosting is
                slow, dumb, and painful enough that it defeats its own purpose.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                Procept Foundry turns the workflows you already run into company IP that grows in value over time. We
                charge a flat monthly fee instead of per token, collapse five layers of the AI stack into one, and sell
                end-user behavior rather than bug fixes.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ SYSTEM 1 → 5 ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <div className="max-w-4xl">
            {SYSTEMS.map((row, i) => (
              <Reveal key={row.label} delay={i * 40}>
                <div
                  className={`grid grid-cols-12 gap-x-6 gap-y-2 py-6 md:py-8 ${
                    i > 0 ? 'border-t border-white/[0.08]' : ''
                  }`}
                >
                  <div className="col-span-12 md:col-span-4">
                    <span className="font-display text-2xl md:text-3xl text-[#636363]/80">{row.label}</span>
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <p className="font-display text-xl md:text-3xl leading-snug text-[#636363]/80">{row.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={SYSTEMS.length * 40}>
              <div className="grid grid-cols-12 gap-x-6 gap-y-2 border-t border-white/[0.08] py-6 md:py-8">
                <div className="col-span-12 md:col-span-4">
                  <span className="font-display text-2xl md:text-3xl text-term-400">{SYSTEM_5.label}</span>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <p className="font-display text-xl md:text-3xl leading-snug text-term-400">{SYSTEM_5.value}</p>
                  <div className="mt-4 space-y-1">
                    {SYSTEM_5.lines.map((l) => (
                      <p key={l} className="text-lg md:text-2xl text-term-400">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 01 / HISTORY ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="01"
              label="History"
              title={
                <>
                  A short history of the <span className="font-serif ">harness</span>
                </>
              }
              sub="Four stops on the way to recursive self-improvement."
            />
          </Reveal>

          <div className="mt-14 max-w-3xl">
            {HISTORY.map((topic, i) => (
              <Reveal key={topic.name} delay={i * 40}>
                <div className="border-t border-white/[0.08] py-8 md:py-9">
                  <h3 className="font-mono text-[11px] tracking-[0.25em] uppercase text-term-400">
                    {String(i + 1).padStart(2, '0')}. {topic.name}
                  </h3>
                  <div className="mt-5 space-y-4">
                    {topic.bullets.map((b, j) => (
                      <div key={j} className="grid grid-cols-12 gap-x-6">
                        <div className="col-span-12 md:col-span-1">
                          <span className="text-term-400/70">/</span>
                        </div>
                        <p className="col-span-12 md:col-span-11 text-white/55 leading-relaxed">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 02 / 24/7 OPERATIONAL HARNESS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="02"
              label="24/7 Operational Harnesses"
              title={
                <>
                  What is a 24/7 <span className="font-serif ">Operational</span> Harness?
                </>
              }
              sub="From a tool you open to a teammate who never clocks out."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-7">
            {HARNESS_BULLETS.map((b, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="grid grid-cols-12 gap-x-6 border-l-2 border-term-400/60 pl-6 py-2">
                  <div className="col-span-12 md:col-span-2">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="col-span-12 md:col-span-10 text-[#636363] leading-relaxed">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 / PROBLEMS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="03"
              label="Problems"
              title={
                <>
                  Why most harnesses never <span className="font-serif ">pay for themselves</span>
                </>
              }
              sub="Quality, cost, and implementation, the three ways a multi-agent system stalls."
            />
          </Reveal>

          <div className="mt-14 max-w-3xl space-y-8">
            <Reveal>
              <div>
                <h3 className="font-mono text-[11px] tracking-[0.25em] uppercase text-term-400 mb-4">Quality</h3>
                <p className="text-white/55 leading-relaxed">
                  Most multi-agent systems shipping today do not self-heal or learn from their own mistakes, so every
                  deployment introduces new failure modes and cybersecurity threat vectors. And the small language
                  models that would make them cheap are typically much dumber than the large models doing the real work.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="border border-term-400/40 bg-term-400/[0.06] p-6 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-300 mb-4">The key point</p>
                <p className="text-lg text-white/80 leading-relaxed">
                  85% of companies implementing multi-agent systems fail to see a dollar of ROI. Your multi-agent system
                  should be turning customer workflows into company IP that grows in value over time.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h3 className="font-mono text-[11px] tracking-[0.25em] uppercase text-term-400 mb-4">Cost</h3>
                <p className="text-white/55 leading-relaxed">
                  Anthropic burns roughly $5k per month per pro user, and that token spend continues as long as the
                  system runs until it defeats the entire point of automation. Even the cheap model providers charge by
                  token rather than a flat month, which makes these systems exponentially more expensive with every
                  customer added.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <h3 className="font-mono text-[11px] tracking-[0.25em] uppercase text-term-400 mb-4">Implementation</h3>
                <p className="text-white/55 leading-relaxed">
                  First you hire an AI team, then you spend hours manually sculpting the agent plumbing and procuring
                  GPUs. When operational reality changes, the LangChain graph has to be manually re-chiseled.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="border-l-2 border-white/20 pl-6">
                <p className="text-[#636363] leading-relaxed">
                  Small language models solve the cost problem, but large language models are what actually deliver
                  quality. What if an engine achieved the intelligence of large models at the cost of small ones,
                  self-healing and self-learning from user interactions to automatically deliver better user trajectories
                  and suggest architectural changes?
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 / PRODUCT OVERVIEW ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="04"
              label="The product"
              title={
                <>
                  Procept Foundry, <span className="font-serif ">briefly</span>
                </>
              }
              sub="The engine that makes a 24/7 Operational Harness actually viable."
            />
          </Reveal>

          <div className="mt-14 max-w-3xl space-y-10">
            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                What makes a 24/7 Operational Harness viable
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                A 24/7 Operational Harness is built to run your user operations without ever stopping.
                Historically these systems were bespoke and brittle, hand-sculpted the way LangChain chains are, because
                the models underneath lacked big-picture context, continual learning, and self-healing, and coding
                harnesses like Claude Code were too ephemeral, their emergent subagent communities ceasing to exist the
                moment the session ended. Now, with our new inventions, a true 24/7 harness is possible.
              </p>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                Why only now
              </h3>
              <div className="mt-5 space-y-5">
                {WHY_NOW.map((item, i) => (
                  <div key={item.label} className="grid grid-cols-12 gap-x-6 border-l-2 border-white/15 pl-6 py-1">
                    <div className="col-span-12 md:col-span-4">
                      <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/70">
                        {String(i + 1).padStart(2, '0')}. {item.label}
                      </span>
                    </div>
                    <p className="col-span-12 md:col-span-8 text-white/55 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                The engine
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                The engine underneath is a Cognitive Induction Graph, which compiles every prompt, tool call, API call,
                and agent workflow into a single optimizable compute graph. Recursive Self-Improvement is the loop that
                learns the rubric by experimentation, unsupervised, with the model itself frozen throughout. Our serving
                stack runs that frozen model end to end, so the whole harness deploys as one self-hosted system.
              </p>
            </Reveal>

            <Reveal>
              <FigurePanel
                fig="01"
                caption="A live toy CIG in the middle of the console"
                image="/blog/toyCIG.jpg"
                imageClass="object-cover"
                header={false}
                overlay={false}
              />
            </Reveal>

            <Reveal>
              <FigurePanel
                fig="02"
                caption="An agent workflow, unrolled into a directed acyclic graph"
                image="/blog/unrolledDAG.jpg"
                imageClass="object-contain"
                header={false}
                overlay={false}
              />
            </Reveal>

            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                Why this solves all three problems
              </h3>
              <div className="mt-5 space-y-5">
                {SOLVES.map((item, i) => (
                  <div key={item.label} className="grid grid-cols-12 gap-x-6 border-l-2 border-white/15 pl-6 py-1">
                    <div className="col-span-12 md:col-span-4">
                      <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/70">
                        {String(i + 1).padStart(2, '0')}. {item.label}
                      </span>
                    </div>
                    <p className="col-span-12 md:col-span-8 text-white/55 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="border border-term-400/40 bg-term-400/[0.06] p-6 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-300 mb-4">
                  The compounding asset
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  Your customer workflows become company IP that grows in value with every run.
                </p>
              </div>
            </Reveal>

            {/* Benchmark table */}
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#636363]/80 mb-6">
                Benchmark // Procept CIG vs. Google RRSI, frozen Qwen 3 Bonsai-2 27B
              </p>
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
                        Procept RSI
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
          </div>
        </div>
      </section>

      {/* ═══════════════ 05 / ENTERPRISE WALKTHROUGH ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="05"
              label="Enterprise walkthrough"
              title={
                <>
                  Mathematics Corp, a real-estate <span className="font-serif ">operations</span> team
                </>
              }
              sub="One live deployment, anonymized, including the growth figures."
            />
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-8">
            <Reveal>
              <p className="text-white/55 leading-relaxed">
                We pulled the full telemetry history from Mathematics Corp, a real-estate operations team running its
                data ops, tool calls, API calls, and agent workflows through AWS. Procept Foundry compiled every one of
                those steps into a Cognitive Induction Graph, then rendered the live workflows it surfaced as the
                visualization below. The figure is an anonymized toy example with growth figures stripped, but the
                topology it maps is real.
              </p>
            </Reveal>

            <Reveal>
              <FigurePanel
                fig="03"
                caption="Mathematics Corp, an anonymized, toy CIG of the live workflow"
                image="/blog/toyCIG.jpg"
                imageClass="object-cover"
                header={false}
                overlay={false}
              />
            </Reveal>

            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-4">
                What we were able to do
              </p>
              <div className="space-y-5">
                {WALKTHROUGH.map((b, i) => (
                  <div key={i} className="grid grid-cols-12 gap-x-6 border-l-2 border-white/15 pl-6 py-1">
                    <div className="col-span-12 md:col-span-2">
                      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="col-span-12 md:col-span-10 text-[#636363] leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="border border-term-400/40 bg-term-400/[0.06] p-6 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-300 mb-4">Key point</p>
                <p className="text-lg text-white/80 leading-relaxed">
                  The same graph that stops a failure also shows what a healthy, high-value conversation looks like.
                  Learning and growth collapse into one optimization problem.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 06 / COMPETITIVE LANDSCAPE ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="06"
              label="Competitive landscape"
              title={
                <>
                  The serving stack, <span className="font-serif ">layer by layer</span>
                </>
              }
              sub="Six layers, each solving only its own slice, and what Procept Foundry does differently at every one."
            />
          </Reveal>

          <div className="mt-14 max-w-4xl">
            {LAYERS.map((layer, i) => (
              <Reveal key={layer.name} delay={i * 40}>
                <div className="grid grid-cols-12 gap-x-6 gap-y-4 border-t border-white/[0.08] py-8 md:py-10">
                  <div className="col-span-12 md:col-span-4">
                    <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-term-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white leading-[1.2]">
                      {layer.name}
                    </h3>
                  </div>
                  <div className="col-span-12 md:col-span-8 space-y-4">
                    <p className="text-white/55 leading-relaxed">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35">Definition:</span>
                      {layer.definition}
                    </p>
                    <p className="text-white/55 leading-relaxed">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-term-300">Why we win:</span>
                      {layer.better}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Blue ocean map */}
          <div className="mt-20">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-6">
                Blue ocean // Where Procept sits
              </p>
            </Reveal>

            <Reveal>
              <div className="border border-white/[0.08] bg-ink-900/50 p-6 md:p-8">
                {/* X axis labels */}
                <div className="grid grid-cols-[88px_1fr_1fr] gap-px">
                  <div />
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 pb-3">
                    Passive / routing
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 pb-3 text-right">
                    Active execution
                  </p>
                </div>
                {/* Row 1 */}
                <div className="grid grid-cols-[88px_1fr_1fr] gap-px">
                  <div className="flex items-center justify-center">
                    <span
                      className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      Continual learning
                    </span>
                  </div>
                  <Quadrant {...QUADRANTS[0]} />
                  <Quadrant {...QUADRANTS[1]} />
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-[88px_1fr_1fr] gap-px mt-px">
                  <div className="flex items-center justify-center">
                    <span
                      className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      Static / frozen weights
                    </span>
                  </div>
                  <Quadrant {...QUADRANTS[2]} />
                  <Quadrant {...QUADRANTS[3]} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 07 / OUR MOAT ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              num="07"
              label="Our moat"
              title={
                <>
                  The category <span className="font-serif ">belongs to us</span>
                </>
              }
              sub="Not cheaper. Not one more KPI. A different unit of sale."
            />
          </Reveal>

          <Reveal>
            <div className="mt-14 border-l-2 border-term-400 pl-8 md:pl-12">
              <p className="font-serif text-2xl md:text-3xl text-white leading-tight max-w-3xl">
                {MOAT_QUOTE}
              </p>
              <p className="mt-5 font-mono text-[10px] tracking-[0.25em] uppercase text-[#636363]/80">
                Jim Balsillie
              </p>
            </div>
          </Reveal>

          <div className="mt-14 max-w-2xl space-y-6">
            {MOATS.map((m, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="grid grid-cols-12 gap-x-6 border-l-2 border-white/15 pl-6 py-2">
                  <div className="col-span-12 md:col-span-2">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-term-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="col-span-12 md:col-span-10 text-[#636363] leading-relaxed">{m}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TECHNICAL APPENDIX ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <SectionHeading
              compact
              label="Technical Appendix"
              title={
                <>
                  The mechanics, <span className="font-serif ">for the curious</span>
                </>
              }
              sub="Four short notes: the math, the graph, the architecture, and the numbers."
            />
          </Reveal>

          {/* Appendix 01: RSI vs LoRA */}
          <div className="mt-14 max-w-3xl">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">
                01 / Recursive Self-Improvement vs LoRA: the math
              </p>
            </Reveal>

            <Reveal>
              <p className="text-white/55 leading-relaxed">
                LoRA is compression, not learning: it bakes the right answer into the weights, so the moment the
                environment shifts, the memory is worthless. Recursive Self-Improvement solves for the rubric itself,
                it experiments until the objective is met, mapping the problem and solution spaces at once. That is
                inductive generalization, and it is inherently unsupervised.
              </p>
            </Reveal>

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
                Here <span className="font-serif text-white/80">𝒮</span> is the gradient of the system-prompt
                space for semantic alignment, <span className="font-serif text-white/80">ℱ</span> is the
                formatting space, and <span className="font-serif text-white/80">ℰ</span>
                <sub>orig</sub> is the static set of original examples. The whole thing is constrained by its reliance on
                isolated, static examples and supervised targets.
              </p>
            </Reveal>

            <Reveal>
              <h3 className="font-display text-lg md:text-xl font-medium uppercase tracking-tight text-white">
                The taxonomic inductive update
              </h3>
              <p className="mt-4 text-white/55 leading-relaxed">
                Recursive Self-Improvement replaces those static examples with the live telemetry of the Cognitive
                Induction Graph. Let <span className="font-serif text-white/80">𝒯</span>
                <sub>t</sub> be the inductive taxonomy of rules at time{' '}
                <span className="font-serif text-white/80">t</span>. The CIG optimizes via:
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
                  <span className="font-serif text-white/80">∇</span>
                  <sub>G</sub>
                  <span className="font-serif text-white/80">𝒞</span> is the topological gradient of the dominant
                  execution workflows, derived by aggregating full-context traces to find which paths yield the highest
                  downstream success across the network.
                </p>
                <p>
                  <span className="font-serif text-white/80">𝒩</span>
                  <sub>expedition</sub> is the expeditionary random signal for active runtime experimentation. Supported
                  by full graph context, it explores the problem space safely.
                </p>
                <p>
                  <span className="font-serif text-white/80">𝕀</span>
                  <sub>unsup</sub> is the unsupervised inductive abstraction operator that distills experimental graph
                  successes into generalized semantic rules.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Appendix 02: Cognitive Induction Graphs */}
          <div className="mt-16 max-w-3xl">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">
                02 / Cognitive Induction Graphs
              </p>
            </Reveal>
            <Reveal>
              <p className="text-white/55 leading-relaxed">
                A Cognitive Induction Graph compiles agentic operations, prompts, tool invocations, protocol routing,
                and user validations, into a unified topological structure, then derives semantic gradients across the
                entire workflow. That lets us optimize over the whole corpus of data operations, tool calls, and agent
                workflows, and solve for the user’s goals directly.
              </p>
            </Reveal>
          </div>

          {/* Appendix 03: Five pillars */}
          <div className="mt-16">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-2">
                03 / Architecture: the five pillars of a CIG
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

          {/* Appendix 04: Data */}
          <div className="mt-16">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">
                04 / Data: the numbers that matter
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
              {HEADLINE_STATS.map((stat, i) => (
                <Reveal key={stat.value} delay={i * 60}>
                  <Stat value={stat.value} label={stat.label} />
                </Reveal>
              ))}
            </div>

            <div className="max-w-2xl space-y-7">
              <Reveal>
                <p className="text-base text-white/55 leading-relaxed">
                  On the Scale Research Rubric, Google RRSI gained a modest 6 points. Recursive Self-Improvement,
                  enabled by the CIG’s full-context tracing, gained 12 (0.41 → 0.53). The gap is sharper on OpenAI
                  Frontier Science, where the CIG delivered an 80% relative improvement (0.21 → 0.38), far outpacing the
                  supervised baseline’s 5-point gain.
                </p>
              </Reveal>
              <Reveal>
                <p className="text-base text-white/55 leading-relaxed">
                  The most significant validation came on ARC-AGI 3, which measures fluid intelligence and adaptability,
                  exactly where compressed, parameter-updated models classically fail. Running the frozen Qwen 3 27B
                  through Procept Foundry returned a score of 95.0. The model dynamically experimented during runtime,
                  treating problem constraints and solution spaces iteratively. Heavily quantized, frozen,
                  small-parameter models can reach frontier-level reasoning, when governed by a topological
                  infrastructure built for continuous generalization.
                </p>
              </Reveal>
            </div>
          </div>
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
              Turn your user actions into <span className="font-serif font-normal normal-case">company IP</span>
              <span className="text-term-400">.</span>
            </h2>
            <p className="mt-7 text-[#636363] max-w-2xl leading-relaxed">
              Your agents stop being lego pieces. They become a foundry, learning from every conversation and
              compounding into IP your competitors can’t copy.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-white font-mono text-[11px] tracking-[0.15em] uppercase hover:border-term-400/60 hover:text-term-300 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Procept
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
