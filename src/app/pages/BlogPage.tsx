import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { DemoModal } from '../components/marketing/DemoModal';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { Reveal } from '../components/marketing/Reveal';
import { POSTS } from '../data/blog';

/**
 * Blog index: Swiss brutalist list of transmissions. No code backdrop here,
 * just a faint particle grain and one tall line-art figure on the hero.
 */
export function BlogPage() {
  const [demoOpen, setDemoOpen] = useState(false);

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
        <div className="absolute inset-y-0 right-0 z-[45] pointer-events-none hidden lg:block w-[40%]">
          <img
            src="/inspo/particles2.png"
            alt=""
            className="w-full h-full object-contain object-right-bottom opacity-50 grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#050505_0%,transparent_55%)]" />
        </div>

        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 pt-24 md:pt-32 pb-20 md:pb-28">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-term-400/70" />
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400">Blog // Procept</p>
            </div>

            <h1 className="font-display font-semibold uppercase tracking-tight leading-[1.05] text-white text-3xl md:text-5xl xl:text-6xl">
              The operational reality
              <br />
              of <span className="text-term-400">enterprise AI</span>
              <span className="text-white">.</span>
            </h1>

            <p className="mt-8 text-base md:text-lg text-white/50 leading-relaxed max-w-xl">
              Infrastructure, governance, and the economics of agentic workflows. Written by Procept, for engineering
              leaders.
            </p>

            <p className="mt-10 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
              {String(POSTS.length).padStart(3, '0')} {POSTS.length === 1 ? 'ENTRY' : 'ENTRIES'} // UPDATED SEP 22 2026
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ INDEX ═══════════════ */}
      <section className="relative border-t border-white/[0.06]">
        <div className="relative z-50 max-w-6xl mx-auto px-6 md:px-16 py-14 md:py-16">
          <Reveal>
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">Index</p>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">Nr.</p>
            </div>
          </Reveal>

          {POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <Link
                to={`/blog/${post.slug}`}
                className="group grid grid-cols-12 gap-x-4 items-start border-t border-white/[0.08] py-10 md:py-12 px-2 -mx-2 hover:bg-white/[0.02] transition-colors"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-sm text-term-400 tabular-nums pt-1">
                  {post.num}
                </span>

                <div className="col-span-10 md:col-span-8">
                  <h2 className="font-display text-xl md:text-3xl font-medium uppercase tracking-tight text-white group-hover:text-term-300 transition-colors leading-[1.15]">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-white/50 max-w-2xl leading-relaxed">{post.excerpt}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">{post.date}</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border border-white/15 text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="hidden md:flex col-span-3 items-center justify-end gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 group-hover:text-term-300 transition-colors pt-1">
                  Read
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Reveal>
          ))}

          <Reveal>
            <p className="mt-10 border-t border-white/[0.06] pt-6 font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
              More transmissions incoming. Checking back is the subscription.
            </p>
          </Reveal>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
