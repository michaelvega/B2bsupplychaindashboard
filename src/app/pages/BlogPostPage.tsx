import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Stat } from '../components/marketing/Stat';
import { Reveal } from '../components/marketing/Reveal';
import { POSTS } from '../data/blog';

/** One takeaway from the report: title, lead, supporting numbers, body. */
interface Takeaway {
  title: string;
  lead: string;
  stats: { value: string; label: string }[];
  body: string;
}

const MARKET_STATS = [
  { value: '95%', label: 'of in-house generative AI pilots fail to deliver measurable P&L impact.' },
  { value: '87%', label: 'of organizations currently struggle to hire specialized AI engineering talent.' },
  { value: '76%', label: 'of enterprise AI use cases are now purchased rather than built, up from 53% just a year ago.' },
  { value: '67%', label: 'of organizations are stuck building their own integration plumbing instead of shipping product.' },
];

const TAKEAWAYS: Takeaway[] = [
  {
    title: 'Integration and Security Are the Biggest Barriers to Adoption',
    lead: 'Agent adoption is no longer limited by capability. The blockers are strictly operational.',
    stats: [
      { value: '46%', label: 'cite "system integration" (building the plumbing) as their #1 barrier to adoption.' },
      { value: '42%', label: 'point to data access and data quality.' },
      { value: '40%', label: 'identify security and compliance concerns.' },
    ],
    body: 'Modern AI agents are expected to operate across real enterprise systems: CRMs, legacy databases, and internal APIs. The hardest part of deploying agentic workflows today is secure, reliable access to production systems. If organizations cannot contain the "agentic blast radius" inside a secure, deterministic sandbox, InfoSec teams will inevitably block the agent from touching live data.',
  },
  {
    title: 'The "Plumbing Tax" is Strangling Engineering Teams',
    lead: 'Rather than choosing between fully custom agents or packaged solutions, the market has fractured into three camps:',
    stats: [
      { value: '47%', label: 'use a hybrid approach (Plumbing + APIs): off-the-shelf models stitched to proprietary systems with custom code.' },
      { value: '21%', label: 'rely entirely on pre-built solutions: out-of-the-box tools that limit customization.' },
      { value: '20%', label: 'build entirely in-house (Pure Plumbing): orchestration, sandboxing, and integrations from scratch.' },
    ],
    body: 'Combining the hybrid and in-house groups reveals that 67% of organizations are actively bogged down building their own integration plumbing. When engineers are writing orchestration loops and execution sandboxes, they are not building core products. To scale, organizations must buy the secure runtime layer and reserve their engineering cycles exclusively for building proprietary workflows.',
  },
  {
    title: 'Multi-Step Agent Workflows Are Becoming the Norm',
    lead: 'The era of the simple, single-action chat assistant is over.',
    stats: [
      { value: '57%', label: 'of organizations already deploy multi-step agent workflows.' },
      { value: '16%', label: 'have progressed to cross-functional AI agents spanning multiple teams.' },
      { value: '81%', label: 'plan to expand into more complex agent use cases in 2026.' },
    ],
    body: 'Multi-step workflows amplify operational challenges. If one agent hallucinates and the downstream agent accepts it as ground truth, the entire pipeline crashes. Scaling these workflows reliably requires an auto-correcting orchestration framework, such as a recursive self-improvement (RSI) runtime, that catches and fixes code or logic errors before they cascade.',
  },
  {
    title: 'AI Agents Are Already Delivering Measurable ROI',
    lead: 'Agents are no longer confined to experimentation or R&D budgets.',
    stats: [
      { value: '80%', label: 'of respondents report measurable economic impact from AI agents today.' },
      { value: '88%', label: 'expect ROI to continue or increase in 2026.' },
    ],
    body: 'The conversation has shifted from potential to scale. The organizations seeing real economic returns are the ones who solved the infrastructure layer early, bypassed the custom-build trap, and successfully deployed agents into their production environments.',
  },
  {
    title: 'Enterprise Adoption Is Leading the Market',
    lead: 'Larger organizations continue to lead the adoption of enterprise AI agents.',
    stats: [
      { value: '91%', label: 'of enterprises already use AI coding tools in production.' },
      { value: '54%', label: 'of enterprise respondents are "very optimistic" about AI agent adoption, compared to just 38% of SMBs.' },
    ],
    body: 'Enterprise environments naturally surface integration, governance, and security challenges earlier than smaller companies. Their rapid adoption proves that once the security standoff is solved, typically by deploying a secure orchestration runtime directly into a Virtual Private Cloud (VPC), AI agents transition from risky experiments into foundational business infrastructure.',
  },
];

/** The article layout, driven by the blog data table for the slug. */
export function BlogPostPage() {
  const { slug } = useParams();
  const [demoOpen, setDemoOpen] = useState(false);
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-ink-950" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      {/* Faint grain from particles1, barely there */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <img src="/inspo/particles1.png" alt="" className="w-full h-full object-cover opacity-[0.06] mix-blend-screen grayscale" />
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <MarketingNav onRequestAccess={() => setDemoOpen(true)} logoTo="/" />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        {/* Tall particle line art, right edge, fading into the page */}
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

      {/* ═══════════════ THE MARKET IN FOUR NUMBERS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-18">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-8">Data // The market in four numbers</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKET_STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={i * 60}>
                <Stat value={stat.value} label={stat.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ OPENING ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <div className="max-w-2xl space-y-7">
            <Reveal>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                The conversation around enterprise AI agents has fundamentally shifted in 2026. The industry has moved
                past evaluating model capabilities and is now colliding with the operational realities of production
                deployment.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                The math behind enterprise AI has shifted decisively. For engineering leaders evaluating the total
                cost of ownership (TCO) for agentic workflows this year, the market data reveals a stark reality: most
                builds fail, talent is scarce, and the industry is buying instead of building.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-base text-white/55 leading-relaxed">
                As the 2026 State of AI Agents Report from Anthropic makes clear, deploying AI agents is no longer a
                question of model intelligence. It is entirely an infrastructure problem. Enterprises cannot afford to
                hope a system prompt stops an agent from deleting a database, sending a sensitive email, or modifying
                production records.
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
                Guardrails merely ask; governance decides.
              </p>
              <p className="mt-7 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                The core tension of 2026 agent deployment
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FIVE TAKEAWAYS ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-16 md:py-22">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-6">Report // Five takeaways</p>
            <p className="text-base text-white/55 leading-relaxed max-w-2xl mb-14">
              Here is how the most successful organizations are scaling agent deployments without falling into the
              "plumbing" trap.
            </p>
          </Reveal>

          {TAKEAWAYS.map((takeaway, i) => (
            <Reveal key={takeaway.title}>
              <div className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-white/[0.08] py-12 md:py-14">
                <div className="col-span-12 md:col-span-3">
                  <span className="font-display font-bold text-6xl md:text-7xl text-white/15 tabular-nums leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="col-span-12 md:col-span-9 space-y-6">
                  <h2 className="font-display text-xl md:text-2xl font-medium uppercase tracking-tight text-white leading-[1.15]">
                    {takeaway.title}
                  </h2>
                  <p className="text-white/60 leading-relaxed">{takeaway.lead}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {takeaway.stats.map((stat) => (
                      <div key={stat.value} className="border border-white/[0.08] bg-white/[0.02] p-4">
                        <p className="font-mono text-2xl text-term-300 tabular-nums">{stat.value}</p>
                        <p className="mt-2 text-xs text-white/50 leading-relaxed">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-white/60 leading-relaxed">{takeaway.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════ CLOSING ═══════════════ */}
      <section className="relative border-t border-white/[0.06] overflow-hidden">
        {/* Particle line art anchored to the bottom, fading out */}
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
              Stop paying the <em className="font-serif italic font-normal normal-case">plumbing tax</em>
              <span className="text-term-400">.</span>
            </h2>
            <p className="mt-7 text-white/60 max-w-2xl leading-relaxed">
              The era of hacking together fragile AI scripts has ended. To survive the shift to agentic workflows in
              2026, organizations must stop paying the plumbing tax. By separating the underlying infrastructure from
              the intelligence, and ensuring agents execute within secure, self-correcting sandboxes, engineering
              teams can finally transition from maintaining pipelines to delivering scalable business value.
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
